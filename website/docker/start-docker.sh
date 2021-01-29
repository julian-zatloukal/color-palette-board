#!/bin/sh
bash -c "./docker/wait-for-it.sh api:5000 -- npm run build && npm run dev"