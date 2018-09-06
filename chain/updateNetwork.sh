#!/bin/bash

# get version from package.json and increment it automatically
export NET_VERSION=$(cat package.json 2>/dev/null | grep -E \"version\" | grep -oE [0-9.]+ | awk -F. -v OFS=. 'NF==1{print ++$NF}; NF>1{if(length($NF+1)>length($NF))$(NF-1)++; $NF=sprintf("%0*d", length($NF), ($NF+1)%(10^length($NF))); print}')

if ! [[ $NET_VERSION =~ ^[0-9.]+$ ]]
then
	>&2 echo "Error: No previous version (defined in package.json) found => upgrade not possible"
	exit 1
fi

#clumsy version rewrite
cat << EOF > package.json
{
  "name": "sardex-open-network",
  "author": "theSardLabTeam",
  "description": "Start from scratch with a blank minimal mutual credit  network",
  "version": "${NET_VERSION}",
  "devDependencies": {
    "browserfs": "^1.2.0",
    "chai": "^3.5.0",
    "composer-admin": "latest",
    "composer-cli": "latest",
    "composer-client": "latest",
    "composer-connector-embedded": "latest",
    "eslint": "^3.6.1",
    "istanbul": "^0.4.5",
    "jsdoc": "^3.4.1",
    "mkdirp": "^0.5.1",
    "mocha": "^3.2.0",
    "moment": "^2.17.1"
  },
  "keywords": [],
  "license": "Apache 2.0",
  "repository": {
    "type": "e.g. git",
    "url": "URL"
  },
  "scripts": {
    "deploy": "./scripts/deploy.sh",
    "doc": "jsdoc --pedantic --recurse -c jsdoc.conf",
    "lint": "eslint .",
    "postlicchk": "npm run doc",
    "postlint": "npm run licchk",
    "prepublish": "mkdirp ./dist && composer archive create  --sourceType dir --sourceName . -a ./dist/unnamed-network.bna",
    "pretest": "npm run lint",
    "test": "mocha --recursive"
  }
}
EOF

TEMPDIR=$(mktemp -d)
PA_CARD="PeerAdmin@sardex-open-network"
NETWORKNAME="sardex-open-network"
BNA="${NETWORKNAME}@${NET_VERSION}.bna"

echo "creating bna-package ${BNA}..."
composer archive create --sourceType dir --sourceName . -a ${TEMPDIR}/${BNA}
if ! [ $? -eq 0 ]; then
    >&2 echo "Error creating bna."
		exit 1
fi

echo "installing bna-packge ${BNA}..."
composer network install --card ${PA_CARD} --archiveFile ${TEMPDIR}/${BNA}
if ! [ $? -eq 0 ]; then
    >&2 echo "Error installing bna."
		exit 1
fi

echo "upgrading network ${NETWORKNAME} ..."
composer network upgrade --card ${PA_CARD} -n ${NETWORKNAME} -V ${NET_VERSION}
if ! [ $? -eq 0 ]; then
    >&2 echo "Error upgrading network."
		exit 1
fi
