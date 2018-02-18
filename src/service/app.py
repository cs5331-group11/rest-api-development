#!/usr/bin/python
import configparser
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

import jwt
import datetime
from functools import wraps
import json
import os

app = Flask(__name__)
# Enable cross origin sharing for all endpoints
CORS(app)

# Remember to update this list
ENDPOINT_LIST = ['/', '/meta/heartbeat', '/meta/members', '/user', '/users/register',
                 '/user/authenticate', '/diary', 'diary/create', 'diary/delete']

#database access

# Read config file
config = configparser.ConfigParser()
config.read('../../cs5331_db.conf')


app.config['SECRET_KEY'] = 'cs5331secretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + config.get('DB',  'dbname')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)


class UserData(db.Model):
    id = db.Column(db.INTEGER, primary_key=True, autoincrement=True)
    username = db.Column(db.TEXT, unique=True, nullable=False)
    password = db.Column(db.TEXT, nullable=False)
    fullname = db.Column(db.TEXT, nullable=False)
    age = db.Column(db.INTEGER)


class DiaryData(db.Model):
    id = db.Column(db.INT, primary_key=True, autoincrement=True)
    title = db.Column(db.TEXT, nullable=False)
    publish_date = db.Column(db.TEXT, nullable=False)
    public = db.Column(db.BOOLEAN, nullable=False)
    text = db.Column(db.TEXT, nullable=False)
    id_user = db.Column(db.TEXT, db.ForeignKey('user_data.id'),
                          nullable=False)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message' : 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = UserData.query.filter_by(id=data['id']).first()
        except:
            return jsonify({'message' : 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


def make_json_response(data, status=True, code=200):
    """Utility function to create the JSON responses."""

    to_serialize = {}
    if status:
        to_serialize['status'] = True
        if data is not None:
            to_serialize['result'] = data
    else:
        to_serialize['status'] = False
        to_serialize['error'] = data
    response = app.response_class(
        response=json.dumps(to_serialize),
        status=code,
        mimetype='application/json'
    )
    return response



@app.route("/")
def index():
    """Returns a list of implemented endpoints."""
    return make_json_response(ENDPOINT_LIST)


@app.route("/meta/heartbeat")
def meta_heartbeat():
    """Returns true"""
    return make_json_response(None)


@app.route("/meta/members")
def meta_members():
    """Returns a list of team members"""
    with open("./team_members.txt") as f:
        team_members = f.read().strip().split("\n")
    return make_json_response(team_members)

# User endpoints


@app.route('/user', methods=['GET'])
@token_required
def user_list():

    users = UserData.query.all()
    output = []

    for user in users:
        user_data = {}
        user_data['username'] = user.username
        output.append(user_data)

    return jsonify({'result': output})

@app.route('/users/register', methods=['POST'])
def user_register():
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = UserData(username=data['username'], password=hashed_password,
                        fullname=data['fullname'], age=data['age'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'New user created!'})


@app.route('/users/authenticate', methods=['POST'])
def user_authenticate():

    data = request.get_json()

    user = UserData.query.filter_by(username=data['username']).first()

    if not user:
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    if check_password_hash(user.password, data['password']):
        token = jwt.encode(
            {'id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)},
            app.config['SECRET_KEY'])

        return jsonify({'token': token.decode('UTF-8')})

    return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})


# diary endpoints
@app.route('/diary', methods=['GET'])
@token_required
def diary_list():
    diaries = DiaryData.query.all()
    output = []

    for diary in diaries:
        diary_data = {}
        diary_data['id'] = diary.id
        diary_data['title'] = diary.title
        diary_data['publish_date'] = diary.publish_date
        diary_data['text'] = diary.text

        output.append(diary_data)

    return jsonify({'result': output})


@app.route('/diary/create', methods=['POST'])
@token_required
def diary_create(current_user):
    data = request.get_json()

    new_diary = DiaryData(title=data['title'], publish_date=str(datetime.datetime.now()),
                          public=data['public'], text=data['text'], id_user=current_user.id)
    db.session.add(new_diary)
    db.session.commit()

    return jsonify({'message': "Diary created!"})


@app.route('/diary/delete/<diary_id>', methods=['DELETE'])
def diary_delete(current_user, diary_id):

    diary = DiaryData.query.filter_by(id=diary_id, user_id=current_user.id).first()

    if not diary:
        return jsonify({'message': 'No diary found!'})

    db.session.delete(diary)
    db.session.commit()

    return jsonify({'message': 'Diary entry deleted!'})


if __name__ == '__main__':
    # Change the working directory to the script directory
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)

    # Run the application
    app.run(debug=False,
            port=8080, host="0.0.0.0")
