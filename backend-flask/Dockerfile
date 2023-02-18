FROM python:3.10-slim-buster
#Inside container
# make a new folder inside the container
WORKDIR /backend-flask

#Outside Conatiner -> Inside Container
# This contains the libraries we want to install to run the app
COPY requirements.txt requirements.txt

#Inside Container
# installs the python libraries used for the app
RUN pip3 install -r requirements.txt

#Outside Conatiner -> Inside Container
# . period means everything in the current directory
# . - first period represents /backend-flask (Outside Container)
# . - second period represents /backend-flask (Inside Container)
COPY . .

# sets env vars (environment variables)
# these are inside container and will remain set when the container is running 
ENV FLASK_ENV=development

EXPOSE ${PORT}

#CMD (command)
# python3 -m flask run --host=0.0.0.0 --port=4567
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]