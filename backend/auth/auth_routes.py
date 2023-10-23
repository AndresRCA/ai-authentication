from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
  # Your login logic here
  pass

@auth_bp.route('logout', methods=['POST'])
def logout():
  # Your logout logic here
  pass

@auth_bp.route('signup', methods=['POST'])
def signup():
  # Your registration logic here
  pass

@auth_bp.route('/user-session', methods=['GET'])
def user_session():
  # return user object from token
  # check cookies here...
  # ...
  
  # get user from database
  user = { 'id': 0, 'username': 'dev' }
  return user