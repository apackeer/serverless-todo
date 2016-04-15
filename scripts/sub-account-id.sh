#!/bin/bash

ACCOUNT_ID="TODO add your account id here"

EXP="s/ACCOUNT_ID/$ACCOUNT_ID/g"
cp api/definitions/todo.yaml api/definitions/todo.final.yaml

CMD="perl -pi -e $EXP ./api/definitions/todo.final.yaml"
exec $CMD;