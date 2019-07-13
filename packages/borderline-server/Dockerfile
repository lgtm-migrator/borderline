FROM node:latest@sha256:6e64f63a663a368cc81b28ed3c3e29e6b3784c04f0128be5aaa659157ed4d231
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
