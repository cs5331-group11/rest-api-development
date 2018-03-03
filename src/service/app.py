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
import uuid
import binascii

app = Flask(__name__)
# Enable cross origin sharing for all endpoints
CORS(app)

# Remember to update this list
ENDPOINT_LIST = ['/', '/meta/heartbeat', '/meta/members', '/user', '/users/register',
                 '/users/authenticate', '/users/expire','/diary', '/diary/create', '/diary/delete', '/diary/permission']

#database access

# Read config file
config = configparser.ConfigParser()
config.read('/cs5331_db.conf')


app.config['SECRET_KEY'] = 'cs5331secretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + config.get('DB',  'dbname')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['JSON_SORT_KEYS'] = False

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

class TokenData(db.Model):
    id = db.Column(db.INTEGER, primary_key=True, autoincrement=True)
    id_user = db.Column(db.INTEGER, db.ForeignKey('user_data.id'), nullable=False)
    token = db.Column(db.String(36), nullable=False, index=True, default=lambda: str(uuid.uuid4()))
    valid = db.Column(db.Boolean, nullable=False, default=True)
    created_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow())


def token_required_uuid4(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            payload = request.get_json(force=True)

            token = TokenData.query.filter_by(token=payload['token'],valid=True).order_by(TokenData.id.desc()).first()
            user = UserData.query.filter_by(id=token.id_user).first()

            return f(user.id, *args, **kwargs)
        except Exception as e:
            # can be 500?
            print(e)
            return jsonify({'status':False, 'error':'Invalid authentication token.'})

        return jsonify({'status':False, 'error':'Invalid authentication token.'})

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

def get_user_by_token(token):
    user_token = TokenData.query.filter_by(token=token).filter_by(valid=True).first()
    user = UserData.query.filter_by(id=user_token.id_user).first()
    return user

@token_required_uuid4
@app.route('/users', methods=['POST'])
def user_list():
    payload = request.get_json()
    token = payload['token']

    user = get_user_by_token(token)

    user_info = {
        'username':user.username,
        'fullname':user.fullname,
        'age':user.age
    }

    return jsonify({'status':True, 'result':user_info})


@app.route('/users/register', methods=['POST'])
def user_register():
    data = request.get_json(force=True)

    users_match = UserData.query.filter_by(username=data['username']).count()
    if users_match > 0:
        return jsonify({'status':False, 'error':'User already exists!'})

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256',
        salt_length=16)

    new_user = UserData(username=data['username'], password=hashed_password,
                        fullname=data['fullname'], age=data['age'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'status':True}), 201


@app.route('/users/authenticate', methods=['POST'])
def user_authenticate_uuid4():
    data = request.get_json()

    user = UserData.query.filter_by(username=data['username']).first()

    if not user:
        return jsonify({'status':False}), 200

    if check_password_hash(user.password, data['password']):
        old_tokens = TokenData.query.filter_by(id_user=user.id).all()
        for t in old_tokens:
            t.valid = False

        new_token = TokenData(id_user=user.id)
        db.session.add(new_token)
        db.session.commit()

        return jsonify({'token': new_token.token, 'status':True})

    return jsonify({'status':False}), 200


@token_required_uuid4
@app.route('/users/expire', methods=['POST'])
def user_expire():
    try:
        payload = request.get_json()
        token = payload['token']

        user_token = TokenData.query.filter_by(token=token).filter_by(valid=True).first()
        user_token.valid=False
        db.session.commit()

        return jsonify({'status':True})
    except Exception as e:
        print e
        return jsonify({'status':False})

    return jsonify({'status':False})


# diary endpoints
@app.route('/diary', methods=['GET'])
# @token_required_uuid4
def diary_list():

    diaries = DiaryData.query.filter_by(public=1).all()
    output = []

    for diary in diaries:
        diary_data = {}
        diary_data['id'] = diary.id
        diary_data['title'] = diary.title
        user_data = UserData.query.filter_by(id=diary.id_user).first()
        diary_data['author'] = user_data.fullname
        diary_data['publish_date'] = diary.publish_date
        diary_data['public'] = diary.public
        diary_data['text'] = diary.text

        output.append(diary_data)

    return jsonify({'status': True, 'result': output }), 200


@token_required_uuid4
@app.route('/diary', methods=['POST'])
def diary_list_by_user():

    try:
        payload = request.get_json()
        token = payload['token']

        user = get_user_by_token(token)
        diaries = DiaryData.query.filter_by(id_user=user.id).all()
        output = []

        for diary in diaries:
            diary_data = {}
            diary_data['id'] = diary.id
            diary_data['title'] = diary.title
            user_data = UserData.query.filter_by(id=diary.id_user).first()
            diary_data['author'] = user_data.fullname
            diary_data['publish_date'] = diary.publish_date
            diary_data['public'] = diary.public
            diary_data['text'] = diary.text

            output.append(diary_data)

        return jsonify({'status': True, 'result': output}), 200

    except Exception as e:
        return jsonify({'status': False, 'error': str(e)})



@token_required_uuid4
@app.route('/diary/create', methods=['POST'])
def diary_create():
    try:
        data = request.get_json()

        token = data['token']
        user = get_user_by_token(token)

        new_diary = DiaryData(title=data['title'], publish_date=str(datetime.datetime.now()),
                              public=data['public'], text=data['text'], id_user=user.id)
        db.session.add(new_diary)
        db.session.commit()

        return jsonify({'status': True, 'result': new_diary.id}), 201

    except Exception as e:
        return jsonify({'status': False, 'error': str(e)})

@token_required_uuid4
@app.route('/diary/delete', methods=['POST'])
def diary_delete():
    try:
        data = request.get_json()

        token = data['token']
        user = get_user_by_token(token)

        diary = DiaryData.query.filter_by(id=data['id'], id_user=user.id).first()

        if not diary:
            return jsonify({'status': True, 'resutl': data['id'], 'error': 'No diary found!'}), 200

        db.session.delete(diary)
        db.session.commit()

        return jsonify({'status': True}), 200

    except Exception as e:
        return jsonify({'status': False, 'error': str(e)})

@token_required_uuid4
@app.route('/diary/permission', methods=['POST'])
def diary_permission():
    try:

        data = request.get_json()

        token = data['token']
        user = get_user_by_token(token)

        diary = DiaryData.query.filter_by(id=data['id'], id_user=user.id).first()

        if not diary:
            return jsonify({'status': False}), 200

        diary.public = data['public']

        db.session.commit()

        return jsonify({'status': True}), 200

    except Exception as e:
        return jsonify({'status': False, 'error': str(e)})

if __name__ == '__main__':
    # Change the working directory to the script directory
    abspath = os.path.abspath(__file__)
    dname = os.path.dirname(abspath)
    os.chdir(dname)

    # Run the application
    db.create_all()
    app.run(debug=False, port=8081, host="0.0.0.0")
