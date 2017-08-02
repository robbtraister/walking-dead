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

rm -rf "$1"
mkdir -p "$1"
unzip "$2" -d "$1"
sed -i "" s/none/xMidYMid/g "$1"/titlepage.xhtml
sed -i "" s/\<div\>//g "$1"/titlepage.xhtml
sed -i "" s/\<\\/div\>//g "$1"/titlepage.xhtml

rm -rf "$2"
TARGET_ZIP=`pwd`/"$2"
cd "$1"
zip -r "$TARGET_ZIP" .
cd -
