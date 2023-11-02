import os

from flask import Flask
from flask_cors import CORS

# blueprints
from .routes import app_bp
from .auth.routes import auth_bp

# database imports
from .extensions import db

# import models used in database
from .auth.models.user import User
from .auth.models.user_photo import UserPhoto


def load_dev_config(app: Flask):
    # set dev config
    app.config.from_object("config_dev.Config")
    # allow all origins during development
    CORS(app)
    return app


def load_prod_config(app: Flask):
    # set production config
    app.config.from_object("config_prod.Config")
    # allow only
    CORS(app, resources={r"*": {"origins": os.getenv("APP_DOMAIN")}})
    return app


def create_app():
    app = Flask(__name__)

    # general config
    FLASK_ENV = os.getenv("FLASK_ENV")

    if FLASK_ENV == "development":
        app = load_dev_config(app)
    else:
        app = load_prod_config(app)

    # start database
    db.init_app(app)
    with app.app_context():
        db.create_all()

    # Register Blueprints
    app.register_blueprint(app_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")

    # For undefined routes redirect (check deployment section for Angular apps and reverse proxies)
    @app.errorhandler(404)
    def page_not_found(e):
        # serve the SPA with a 404 status code so it displays it's custom error page
        return app.send_static_file("index.html"), 404

    return app
