#!/bin/bash
root=$(dirname $(perl -MCwd=abs_path -e 'print abs_path(shift)' $0))

java -jar $root/../target/simple-recipes-0.1-SNAPSHOT-jar-with-dependencies.jar "$@"