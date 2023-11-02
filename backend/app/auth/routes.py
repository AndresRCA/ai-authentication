from flask import Blueprint, request, jsonify
from .models.user import User
from app.extensions import db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Invalid data provided"}), 400

    username = data["username"]
    password = data["password"]

    # Check if the user exists in the database
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify(user)
    else:
        return jsonify({"error": "Invalid username or password"}), 401


@auth_bp.route("/logout", methods=["POST"])
def logout():
    # Your logout logic here
    # This could involve clearing the user's session, removing tokens, etc.
    return jsonify({"message": "Logged out"})


@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Invalid data provided"}), 400

    username = data["username"]
    password = data["password"]

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user)


@auth_bp.route("/user-session", methods=["GET"])
def user_session():
    # Here, you might retrieve user details from the database using the current session/token
    # This logic will depend on how the session/token is managed and associated with users
    # Return user details as needed
    return {"username": "asd"}
