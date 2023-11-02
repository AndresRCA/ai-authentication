from flask import Blueprint

app_bp = Blueprint("app", __name__, static_folder="dist/frontend", static_url_path="")

@app_bp.route("/", methods=["GET"])
def index():
    # serve Angular SPA
    return app_bp.send_static_file("index.html")