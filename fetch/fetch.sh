#!/bin/bash

set -e 
set -a 

source ./env.sh

TARGET_DIR=/tiles/

ruby extractGeojson.rb $TARGET_DIR
./generateMbtiles.sh $TARGET_DIR
