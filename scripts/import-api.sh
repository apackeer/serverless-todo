#!/bin/bash
root=$(dirname $(perl -MCwd=abs_path -e 'print abs_path(shift)' $0))

./scripts/sub-account-id.sh

java -jar $root/../target/serverless-todo-0.1-SNAPSHOT-jar-with-dependencies.jar "$@"