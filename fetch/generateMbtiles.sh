#!/bin/bash

#
# This script generates an mbtiles file 
# from the contents of `activities`. It first
# removes any files that don't have coordinates
# in them, to make tippecanoe happy. 
#
SOURCE_DIR="$1/activities"
TARGET_DIR="$1/tiles"

mkdir mbtilesScratch
grep -v -l "\"coordinates\":\[\[null" $SOURCE_DIR/*.json | xargs -I {} cp {} mbtilesScratch
cat mbtilesScratch/*.json | jq -s . | tippecanoe -e $TARGET_DIR --force --no-tile-compression
rm -rf mbtilesScratch



