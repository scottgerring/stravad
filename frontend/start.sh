#!/bin/bash

#
# This launcher exists only as a cheap and cheerful
# way of dropping the mapbox API key into the bundle.
# 

set -e 

if [[ -z "$REACT_APP_MAPBOX_API_TOKEN" ]]; then
    echo "REACT_APP_MAPBOX_API_TOKEN not set" 1>&2
    exit 1
fi

# Write the mapbox API key from the environment into the bundle, overwriting the template
sed -i -e "s|mapbox-api-key-substitute-me|$REACT_APP_MAPBOX_API_TOKEN|" /usr/share/nginx/html/static/js/*

# Start nginx normally
nginx -g "daemon off;"