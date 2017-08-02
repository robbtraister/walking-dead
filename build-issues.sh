#!/bin/bash

if [[ ! "$VERSION_DIR" ]]; then
  VERSION_DIR="./omg-beau-peep/abridged"
fi;

i=1
CONTINUE=true
while [[ "$CONTINUE" == "true" ]];
do
  issue=$(printf %03d $i)
  source_file="$VERSION_DIR/content/c$issue/c$issue-p001.jpg"
  if [[ -f "$source_file" ]]; then
    dest_file="$VERSION_DIR/epubs/issues/Walking Dead, The_ Issue $issue.epub"
    if [[ ! -f "$dest_file" ]]; then
      #ISSUE=`echo "000$i" | sed "s/.*\([0-9]\{3\}\)$/\1/"`
      ./build.sh "$VERSION_DIR/content/" "$issue" "$dest_file" "Walking Dead, The: Issue $issue" "Kirkman, Robert"
    fi;
    i=`expr $i + 1`
  else
    CONTINUE=false
  fi;
done;
