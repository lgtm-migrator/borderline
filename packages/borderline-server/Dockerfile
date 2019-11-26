FROM node:latest@sha256:a6fc8b1b272006bec584a4dd1d0b05570e3cd5d15d1ab4e2a9e60d920c9dc1cf
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
