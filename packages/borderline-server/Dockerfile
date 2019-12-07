FROM node:latest@sha256:737b3a051de3db388aac1d4ef2e7cf6b96e6dcceb3e1f700c01e8c250d7d5500
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
