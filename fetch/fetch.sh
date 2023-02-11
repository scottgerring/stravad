#!/bin/bash

set -e 

TARGET_DIR=/tiles/

ruby extractGeojson.rb $TARGET_DIR
./generateMbtiles.sh $TARGET_DIR
