FROM node:15.6.0-alpine

# Install bash due to alpine based image
RUN apk add --update bash

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./

USER node

RUN npm install

# Bundle app source
COPY --chown=node:node . .

EXPOSE 5000

ENTRYPOINT ["sh", "./docker/node/start-docker.sh"]