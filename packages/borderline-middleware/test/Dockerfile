FROM node:latest@sha256:029279af2fc78171cc7ee25c6a7f933a23213dd30ffd90e389afa4aee61d8ae3
LABEL maintainer="f.guitton@imperial.ac.uk"

# Create app directories
RUN mkdir -p /usr/app && mkdir -p /usr/test
WORKDIR /usr/app

# Install app dependencies
COPY ./package.json /usr/app/
# Install eae-compute npm dependencies
RUN npm install --silent; exit 0;
RUN cat /root/.npm/_logs/*; exit 0;

# Bundle app
COPY ./.git /usr/app/.git
COPY ./.eslintrc.js /usr/app/.eslintrc.js
COPY ./.eslintignore /usr/app/.eslintignore
COPY ./src /usr/app/src
COPY ./test/*.js /usr/app/test/
COPY ./config/borderline.test.config.js /usr/app/config/borderline.config.js

EXPOSE 80
