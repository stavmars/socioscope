#!/bin/bash


if [ "$#" -ne 2 ]; then
    echo "Need the url and pass for deployment"
    echo "e.g.: ./path-to/deploy.sh <url> <pass>"
else
    echo "Beginning deployment of Socioscope App."

    # if [ $(mongo localhost:27017 --eval 'db.getMongo().getDBNames().indexOf("socioscope")' --quiet) -lt 0 ]; then
    #     echo "Socioscope DataBase does not exist. Gonna create one."
    # else
    #     echo "Socioscope DatBase exists. Gonna delete it then create a new one."
    #     mongo socioscope --eval "db.dropDatabase()"
    # fi

    # mongo localhost:27017 --eval "use socioscope"

    for collection in dimension_code dimension measure data_set observation deputies adolescents claims
    do
        echo "Dropping collection $collection"
        mongo socioscope --eval "db.$collection.drop()"
    done

    node ./migrate/import.js $1 $2 all
    mongoimport --db socioscope --collection observation --type json --file migrate/observations.json --jsonArray
    mongoimport --db socioscope --collection deputies --type json --file migrate/deputies.json --jsonArray
    mongoimport --db socioscope --collection adolescents --type json --file migrate/adolescents.json --jsonArray
    mongoimport --db socioscope --collection claims --type json --file migrate/claims.json --jsonArray
    echo "Finished deployment"
fi

