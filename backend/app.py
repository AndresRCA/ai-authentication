from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import UUID, String
from config import (
    DEV_MODE,
    COOKIE_SECRET_KEY,
    SQLALCHEMY_DATABASE_URI,
    SQLALCHEMY_TRACK_MODIFICATIONS,
)
# from db_extension import db
from auth.auth_routes import auth_bp

# flask app config
app = Flask(__name__, static_folder="dist/frontend", static_url_path="")
app.secret_key = COOKIE_SECRET_KEY

# database config
app.config.update(
    SQLALCHEMY_DATABASE_URI=SQLALCHEMY_DATABASE_URI,
    SQLALCHEMY_TRACK_MODIFICATIONS=SQLALCHEMY_TRACK_MODIFICATIONS,
)

db = SQLAlchemy(app)


class User(db.Model):
    __table_args__ = {"schema": "auth"}

    id = db.Column(
        UUID(),
        primary_key=True,
        unique=True,
        nullable=False,
        server_default=db.text("gen_random_uuid()"),
    )
    username = db.Column(String(80), unique=True, nullable=False)
    password = db.Column(String(80), nullable=False)

    # Define one-to-one relationship with UserImages
    user_photo = db.relationship("UserPhoto", uselist=False, back_populates="user")

    # Define one-to-one relationship with UserSession
    user_session = db.relationship("UserSession", uselist=False, back_populates="user")

    def __repr__(self):
        return f"<User {self.username}>"


class UserPhoto(db.Model):
    __table_args__ = {"schema": "auth"}

    id = db.Column(db.Integer, primary_key=True)
    data_url = db.Column(db.Text, nullable=False, doc="base64 that represents an image")

    # Define one-to-one relationship with User
    user = db.relationship("User", back_populates="user_photo")
    # Foreign key
    user_id = db.Column(UUID(), db.ForeignKey("auth.user.id"))


class UserSession(db.Model):
    __table_args__ = {"schema": "auth"}

    id = db.Column(db.Integer, primary_key=True)
    session_token = db.Column(db.Text, unique=True, nullable=False)

    # Define one-to-one relationship with User
    user = db.relationship("User", back_populates="user_session")
    # Foreign key
    user_id = db.Column(UUID(), db.ForeignKey("auth.user.id"))


# with app.app_context():
#     db.create_all()

# Root routes


@app.route("/")
def index():
    # serve Angular SPA
    return app.send_static_file("index.html")


# Register Blueprints after the root routes here

# Register the authentication Blueprint
app.register_blueprint(auth_bp, url_prefix="/auth")


# For undefined routes redirect
@app.errorhandler(404)
def page_not_found(e):
    # serve the SPA with a 404 status code so it displays it's custom error page
    return app.send_static_file("index.html"), 404

with app.app_context():
    # db.init_app(app)  # Initialize the database object
    db.create_all()

if __name__ == "__main__":
    # with app.app_context():
    #     db.init_app(app)  # Initialize the database object
    #     db.create_all()
    app.run(debug=DEV_MODE)
