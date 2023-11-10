FROM python:3.8-slim
WORKDIR /app

# copy backend's folder content to /app
COPY . ./
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000
# Start the WSGI server which will be the middleman between Flask and the nginx http server
# Beware of this: https://flask.palletsprojects.com/en/3.0.x/deploying/gunicorn/#binding-externally
CMD ["gunicorn", "-b", ":5000", "wsgi:app"]