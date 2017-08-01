#!/bin/bash

VERSION_DIR="./omg-beau-peep/unabridged"

for v in `seq 1 25`;
do
  #VOLUME=`echo "000$v" | sed "s/.*\([0-9]\{3\}\)$/\1/"`
  VOLUME=$(printf %03d $v)
	START=`python -c "print $v * 6 - 5"`
	STOP=`python -c "print $v * 6"`
	./build.sh "$VERSION_DIR/content/" "$START-$STOP" "$VERSION_DIR/epubs/issues/Walking Dead, The_ Volume $VOLUME.epub" "Walking Dead, The: Volume $VOLUME" "Kirkman, Robert"
done;
