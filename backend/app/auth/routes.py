from typing import Optional
from flask import Blueprint, request, jsonify
from .models.user import User
from .models.user_photo import UserPhoto
from app.extensions import db
from .auth_service import AuthService

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Invalid data provided"}), 400

    username = data["username"]
    password = data["password"]

    # Check if the user exists in the database
    user = User.query.filter_by(username=username).first()
    if user:
        return {"id": user.id, "username": user.username, "photo_file_name": user.photo.file_name}
        # check for password
        is_valid = AuthService.compare_passwords(user.password, password)
        if is_valid:
            return user

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
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return (
            jsonify({"error": "Username already exists"}),
            409,  # send "conflict" status code
        )

    # get the rest of the data for insertion
    encrypted_password = AuthService.hash_password(data["password"])
    file_name = data["fileName"]
    data_url = data["photoDataUrl"]

    new_photo = UserPhoto(file_name=file_name, data_url=data_url)
    new_user = User(username=username, password=encrypted_password, photo=new_photo)
    db.session.add(new_user)
    db.session.commit()

    return new_user


@auth_bp.route("/users/verify-session", methods=["GET"])
def user_session():
    # Here, you might retrieve user details from the database using the current session/token
    # This logic will depend on how the session/token is managed and associated with users
    # Return user details as needed
    return {"username": "asd"}


@auth_bp.route("/users/photos/verify", methods=["POST"])
def verify_user_photo():
    photo_data_url = request.data["photo_data_url"]
    # retrieve user from JWT value in cookies
    # user = ...
    # user_photo = user.photo.data_url

    # build an image from photo_data_url or use the raw data to feed it into the ML model
    # feed user_photo and photo_data_url into the ML model to start the comparison
    # ...
    
    return {"message": "user is the same person"}
