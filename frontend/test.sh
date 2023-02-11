#!/bin/bash

set -e 
set -a

source ./.env

docker build . -t stravad-frontend

docker run \
    --rm \
    -it \
    -p 8080:80 \
    -e REACT_APP_MAPBOX_API_TOKEN \
    --name stravad-frontendtest \
    --mount type=bind,source="$(pwd)"/../fetch/testdata/,target=/usr/share/nginx/html/tiles/ \
    stravad-frontend
