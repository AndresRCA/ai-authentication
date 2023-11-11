# AI Authentication Backend

## Setup

1. Create a Postgres database called `ai_authentication`.
2. Install the `pgcrypto` extension for that database.
3. Copy the `config_dev.py.example`, `config_prod.py.example` and `.env.example` files, and then remove the `.example` suffix from them and add the values you see fit to use in this flask app.
    > In the .env file you specify how your server will serve your application, it will also decide what configuration file to use when initiating the flask app
4. Create a virtual environment and install the packages using the `requirements.txt` file.
5. Run the `flask run` command to start the development server.