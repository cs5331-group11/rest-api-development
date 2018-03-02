#!/usr/bin/env python2.7
import unittest
import requests
import os
import binascii

from colorama import init
from termcolor import colored

SCHEME_HOST='http://localhost:8080'
USERNAME='user{}'.format(binascii.hexlify(os.urandom(4)))
PASSWORD='pass{}'.format(binascii.hexlify(os.urandom(4)))
NAME='fullname{}'.format(binascii.hexlify(os.urandom(4)))

NEW_USER = {'username':USERNAME, 'password':PASSWORD,
	'fullname':NAME, 'age':ord(os.urandom(1)) % 40}
CURRENT_TOKEN = None

class CS5331Test(unittest.TestCase):
	def setUp(self):
		print '\nIn method', self._testMethodName

	def test_0100_resource_group(self):
		r = get('/')
		resp = r.json()

		self.assertEqual(int(r.status_code), 200)
		self.assertEqual(resp['status'], True)
		self.assertGreaterEqual(len(resp['result']), 9)

	def test_0200_heartbeat(self):
		r = get('/meta/heartbeat')
		resp = r.json()

		self.assertEqual(int(r.status_code), 200)
		self.assertEqual(resp['status'], True)

	def test_0300_team_members(self):
		r = get('/meta/members')
		resp = r.json()

		self.assertEqual(int(r.status_code), 200)
		self.assertEqual(resp['status'], True)
		self.assertGreaterEqual(len(resp['result']), 4)

	def test_0400_register_user_201(self):
		r = post('/users/register', NEW_USER)
		resp = r.json()

		self.assertEqual(int(r.status_code), 201)
		self.assertEqual(resp['status'], True)

	def test_0401_register_user_duplicate(self):
		r = post('/users/register', NEW_USER)
		resp = r.json()

		self.assertEqual(int(r.status_code), 200)
		self.assertEqual(resp['status'], False)
		self.assertEqual(resp['error'], 'User already exists!')

	def test_0500_auth(self):
		payload = {'username':USERNAME, 'password':PASSWORD}
		r = post('/users/authenticate', payload)
		resp = r.json()

		self.assertEqual(int(r.status_code), 200)
		self.assertEqual(resp['status'], True)
		self.assertRegexpMatches(resp['token'], '^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$')

	def test_0501_auth_fail(self):
		payload = {'username':USERNAME, 'password':'wrongpassword'}
		r = post('/users/authenticate', payload)
		resp = r.json()

		self.assertEqual(int(r.status_code), 200)
		self.assertEqual(resp['status'], False)
		# self.assertRegexpMatches(resp['token'], '^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$')

	def test_0800_user_info(self):
		token = auth()
		r = post('/users', {'token':token})
		resp = r.json()
		print resp

		self.assertEqual(int(r.status_code), 200)
		self.assertEqual(resp['status'], True)
		self.assertEqual(resp['result']['username'], NEW_USER['username'])
		self.assertEqual(resp['result']['fullname'], NEW_USER['fullname'])
		self.assertEqual(resp['result']['age'], NEW_USER['age'])

	# def test_0900_diary_get_public_diary(self):
	# 	r = get('/')
	# 	resp = r.json()

	# 	self.assertEqual(int(r.status_code), 200)
	# 	self.assertEqual(resp['status'], True)

	# def test_1000_diary_post_public_diary(self):
	# 	r = get('/')
	# 	resp = r.json()

	# 	self.assertEqual(int(r.status_code), 200)
	# 	self.assertEqual(resp['status'], True)

	# def test_1001_diary_post_private_diary(self):
	# 	r = get('/')
	# 	resp = r.json()

	# 	self.assertEqual(int(r.status_code), 200)
	# 	self.assertEqual(resp['status'], True)

	# def test_1100_diary_delete(self):
	# 	r = get('/')
	# 	resp = r.json()

	# 	self.assertEqual(int(r.status_code), 200)
	# 	self.assertEqual(resp['status'], True)

	# def test_1200_diary_private_to_public(self):
	# 	r = get('/')
	# 	resp = r.json()

	# 	self.assertEqual(int(r.status_code), 200)
	# 	self.assertEqual(resp['status'], True)

	# def test_1201_diary_public_to_p2rivate(self):
	# 	r = get('/')
	# 	resp = r.json()

	# 	self.assertEqual(int(r.status_code), 200)
	# 	self.assertEqual(resp['status'], True)

	def test_1300_expire(self):
		token = auth()
		r = post('/users/expire', {'token':token})
		resp = r.json()

		self.assertEqual(int(r.status_code), 200)
		self.assertEqual(resp['status'], True)

	def test_1300_expire_fail(self):
		token = CURRENT_TOKEN
		r = post('/users/expire', {'token':token})
		resp = r.json()

		self.assertEqual(int(r.status_code), 200)
		self.assertEqual(resp['status'], False) 


def post(uri, payload=None, base=SCHEME_HOST):
	url = '{}{}'.format(base, uri)
	r = requests.post(url, json=payload)
	print colored('status: {}'.format(r.status_code), 'green')
	print colored('response_body:', 'green')
	print colored(r.text, 'red')

	return r

def get(uri, base=SCHEME_HOST):
	url = '{}{}'.format(base, uri)
	r = requests.get(url)
	print colored('status: {}'.format(r.status_code), 'green')
	print colored('response_body:', 'green')
	print colored(r.text, 'red')

	return r

def auth():
	payload = {'username':USERNAME, 'password':PASSWORD}
	r = post('/users/authenticate', payload)
	resp = r.json()

		# self.assertEqual(int(r.status_code), 200)
		# self.assertEqual(resp['status'], True)
		# self.assertRegexpMatches(resp['token'], '^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$')
	if r.status_code != 200 or not resp['status']:
		return False

	print 'token={}'.format(resp['token'])
	CURRENT_TOKEN = resp['token']
	return resp['token']



if __name__ == '__main__':
	init()
	print colored('user={}, pass={}'.format(USERNAME, PASSWORD), 'green')
	unittest.main()
