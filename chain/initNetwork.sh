#!/bin/bash
# network is using the tutorial certs and pathes

cert_admin_file=../fabric/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/keystore/11f467df2881d0de9687049afe8fc55ebebe68b4a912aa3b14548f721d3d2498_sk
pem_admin_file=../fabric/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/signcerts/Admin@sardex.sardex.net-cert.pem

# get version from package.json and increment it automatically
export NET_VERSION=$(cat package.json 2>/dev/null | grep -E \"version\" | grep -oE [0-9.]+ | awk -F. -v OFS=. 'NF==1{print ++$NF}; NF>1{if(length($NF+1)>length($NF))$(NF-1)++; $NF=sprintf("%0*d", length($NF), ($NF+1)%(10^length($NF))); print}')

if ! [[ $NET_VERSION =~ ^[0-9.]+$ ]]
then
	NET_VERSION="0.0.1"
fi
TEMPDIR=$(mktemp -d)
NETWORKNAME="sardex-open-network"
PA_CARD="PeerAdmin@${NETWORKNAME}"
ADM_CARD="admin@${NETWORKNAME}.card"
BNA="${NETWORKNAME}@${NET_VERSION}.bna"

#clumsy create package json
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

echo "Creating BNA file..."
composer archive create --sourceType dir --sourceName . -a ${TEMPDIR}/${BNA}
if ! [ $? -eq 0 ]; then
    >&2 echo "Error creating bna."
    exit 1
fi

echo "creating ${PA_CARD} card..."
composer card create -p connection.json -u PeerAdmin -c ${pem_admin_file} -k ${cert_admin_file} -r PeerAdmin -r ChannelAdmin -f ${TEMPDIR}/${PA_CARD}.card
if ! [ $? -eq 0 ]; then
    >&2 echo "Error creating ${PA_CARD}.card"
    exit 1
fi

echo "importing ${PA_CARD} card..."
composer card import -f ${TEMPDIR}/${PA_CARD}.card
if ! [ $? -eq 0 ]; then
    >&2 echo "Error importing ${PA_CARD}.card"
    exit 1
fi

echo "installing ${BNA}..."
composer network install -c ${PA_CARD} -a ${TEMPDIR}/${BNA}
if ! [ $? -eq 0 ]; then
    >&2 echo "Error installing ${BNA}"
    exit 1
fi

echo "starting ${NETWORKNAME}..."
composer network start --networkName ${NETWORKNAME} --networkVersion ${NET_VERSION} -A admin -S adminpw -c ${PA_CARD} -f ${TEMPDIR}/${ADM_CARD}
if ! [ $? -eq 0 ]; then
    >&2 echo "Error starting ${NETWORKNAME}"
    exit 1
fi

echo "importing ${ADM_CARD}..."
composer card import -f ${TEMPDIR}/${ADM_CARD}
if ! [ $? -eq 0 ]; then
    >&2 echo "Error importing ${ADM_CARD}"
    exit 1
fi

echo "done."
