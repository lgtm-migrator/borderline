FROM node:latest@sha256:01adf5af4a3bebfa0c9b50b3f4ab4a9b896d6c3f80d50d9f26d921fc47f9ba08
LABEL maintainer="f.guitton@imperial.ac.uk"

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm install borderline-ui

# Bundle app source
COPY . /usr/src/app

# Bind to the outside
EXPOSE 8080

# Starting the application
CMD [ "npm", "start" ]
