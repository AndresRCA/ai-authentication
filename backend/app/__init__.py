from flask import Flask
from config import Config

# blueprints
from .routes import app_bp
from .auth.routes import auth_bp

# database imports
from .extensions import db

# import models used in database
from .auth.models.user import User
from .auth.models.user_photo import UserPhoto


def create_app(config_class=Config):
    app = Flask(__name__)

    # set config
    app.config.from_object(config_class)

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
