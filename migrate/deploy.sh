#!/bin/bash


if [ "$#" -ne 1 ]; then
    echo "Need the url for deployment"
    echo "e.g.: ./path-to/deploy.sh <url>"
else
    echo "Beginning deployment of Socioscope App."
    node ./migrate/import.js $1 all
    node ./migrate/qb_data_migration.js
    mongoimport --db socioscope --collection deputies --type json --file migrate/deputies.json --jsonArray
    echo "Finished deployment"
fi

