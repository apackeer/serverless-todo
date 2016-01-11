#!/bin/bash

ACCOUNT_ID="ENTER YOUR AWS ACCOUNT ID HERE"

EXP="s/ACCOUNT_ID/$ACCOUNT_ID/g"
cp api/definitions/recipes.yaml api/definitions/recipes.final.yaml

CMD="perl -pi -e $EXP ./api/definitions/recipes.final.yaml"
exec $CMD;