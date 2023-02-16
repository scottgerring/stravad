#!/bin/bash

set -e 
set -a

source ./env.sh 

docker build . -t stravad-fetch

docker run \
    --rm \
    -it \
    --name devtest \
    -e MAPBOX_ACCESS_TOKEN \
    -e MAPBOX_MAP_ID \
    -e STRAVA_CLIENT_ID \
    -e STRAVA_CLIENT_SECRET \
    -e STRAVA_REFRESH_TOKEN \
    --mount type=bind,source="$(pwd)"/testdata/,target=/tiles/ \
    stravad-fetch
    #stravad-fetch
