#!/bin/bash

#
# Fetches a refresh token to provide access to your strava account.
# Uses the docker fetch image to avoid having to have a local ruby
# environment.
#

set -e 
set -a

source ./env.sh 

docker build . -t stravad-fetch

docker run \
    --rm \
    -it \
    --name devtest \
    -e STRAVA_CLIENT_ID \
    -e STRAVA_CLIENT_SECRET \
    stravad-fetch \
    ruby /app/fetchAccessToken.rb