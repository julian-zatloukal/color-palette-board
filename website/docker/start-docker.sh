#!/bin/sh
bash -c "./docker/wait-for-it.sh api:5000 -- ./node_modules/.bin/next start"