#!/bin/bash

# ./construct.sh "srcDir" 1-5 "Title" "Author"

TEMP_DIR=".tmp/construct"

rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

CONTENT_DIR="$1"

START=`echo "$2" | sed s/\-.*//`
STOP=`echo "$2" | sed s/.*\-//`

SRC_DIR="$TEMP_DIR"
mkdir -p "$SRC_DIR/OEBPS/images"

for c in `seq $START $STOP`;
do
	#CHAPTER=`echo "000$c" | sed "s/^.*\([0-9]\{3\}\)$/\1/"`
  CHAPTER=$(printf %03d $c)
	cp "$CONTENT_DIR/c$CHAPTER-"* "$SRC_DIR/OEBPS/images/";
done;

node construct.js "$SRC_DIR" "$3" "$4"
