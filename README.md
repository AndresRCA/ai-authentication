# AI Authentication

## Stack

- **Backend**:
  - Python Ver. 3.8.18.
  - Flask Ver. 3.

- **Database**:
  - Postgres Ver. 14.9.
  
- **Frontend**:
  - Node.js Ver. 16.10.2 LTS.
  - Angular Ver. 16.0.1.

For more details regarding backend and frontend check their respective `README.md` files inside their directories [backend/](https://github.com/AndresRCA/ai-authentication/tree/master/backend) and [frontend/](https://github.com/AndresRCA/ai-authentication/tree/master/frontend).

## Docker deployment (production)

In order to serve this application on any environment, a `compose.yml` is prepared for creating the containers needed to run our application. Follow the next steps in order to do this:

1. Prepare both the `backend` and `frontend` proyects. Look for any files containing the suffix `.example`, without the `.example` suffix they should turn into files ignored by git, these files usually contain sensitive information and are critical to setting up the environment of our application. See [backend](https://github.com/AndresRCA/ai-authentication/tree/master/backend#setup) and [frontend's](https://github.com/AndresRCA/ai-authentication/tree/master/frontend#setup) README.md files for more info on setup.

2. Execute the following command in your terminal to bring up the application:
    ```bash
    docker compose up
    ```

3. You should have your application up and running in the ports defined in the `compose.yml` file.