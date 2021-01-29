#!/bin/sh
bash -c "./docker/wait-for-it.sh db:27017 -- npm run dev"