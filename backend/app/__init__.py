from flask import Flask
from config import Config
from .extensions import db
from .auth.routes import auth_bp
# import models used in database
from .auth.models.user import User
from .auth.models.user_photo import UserPhoto


def create_app(config_class=Config):
    app = Flask(__name__, static_folder="dist/frontend", static_url_path="")

    # set config
    app.config.from_object(config_class)

    # start database
    db.init_app(app)
    with app.app_context():
        db.create_all()

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

    return app
