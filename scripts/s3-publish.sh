#!/bin/bash
root=$(dirname $(perl -MCwd=abs_path -e 'print abs_path(shift)' $0))

aws s3 sync $root/../app s3://aws-recipes "$@"