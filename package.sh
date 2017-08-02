#!/bin/bash

# ./build.sh "srcDir" "destFile"

TEMP_FILE="`pwd`/.tmp/epub.zip"

rm -rf "$TEMP_FILE"

mkdir -p `dirname "$TEMP_FILE"`

cd "$1"
zip -r "$TEMP_FILE" .
cd -

mkdir -p `dirname "$2"`
/Applications/calibre.app/Contents/console.app/Contents/MacOS/ebook-convert "$TEMP_FILE" "$2" --input-profile=default --output-profile=default
