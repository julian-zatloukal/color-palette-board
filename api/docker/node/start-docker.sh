#!/bin/sh
bash -c "./docker/node/wait-for-it.sh db:27017 -- npm run dev"