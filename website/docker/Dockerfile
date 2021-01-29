FROM node:15.6.0-alpine

# Install bash due to alpine based image
RUN apk add --update bash


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json /usr/src/app/
RUN npm install

# Copying source files
COPY . /usr/src/app

# Building app
RUN npm run build
EXPOSE 3000

# Running the app
ENTRYPOINT ["sh", "./docker/start-docker.sh"]