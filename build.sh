#!/bin/bash

./construct.sh "$1" "$2" "$4" "$5"
./package.sh ".tmp/construct" "$3"
