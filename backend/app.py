from flask import Flask
from auth.auth_routes import auth_bp

app = Flask(__name__, static_folder='dist/frontend', static_url_path='')
app.secret_key = 'your_secret_key'

# Root routes

@app.route('/')
def index():
  # serve Angular SPA
  return app.send_static_file('index.html')


# Register Blueprints after the root routes here

# Register the authentication Blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

# For undefined routes redirect
@app.errorhandler(404)
def page_not_found(e):
  # serve the SPA with a 404 status code so it displays it's custom error page
  return app.send_static_file('index.html'), 404

if __name__ == '__main__':
  app.run(debug=True)