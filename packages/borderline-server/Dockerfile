FROM node:latest@sha256:dd2d251960801b7a4259c7cb64b55834ed67db738c45b02658c45d88e5111a6a
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
