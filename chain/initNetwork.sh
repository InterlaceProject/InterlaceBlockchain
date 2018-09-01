#!/bin/bash
# network is using the tutorial certs and pathes

cert_admin_file=../fabric/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/keystore/11f467df2881d0de9687049afe8fc55ebebe68b4a912aa3b14548f721d3d2498_sk
pem_admin_file=../fabric/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/signcerts/Admin@sardex.sardex.net-cert.pem

if [ ! -f package.json ]; then  
	
#clumsy create package json
cat << EOF > package.json
{
  "name": "sardex-open-network",
  "author": "theSardLabTeam",
  "description": "Start from scratch with a blank minimal mutual credit  network",
  "version": "0.0.1",
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

fi

composer archive create -t dir -n .

composer card create -p connection.json -u PeerAdmin -c $pem_admin_file -k $cert_admin_file -r PeerAdmin -r ChannelAdmin

composer card import -f PeerAdmin@sardex-open-network.card

composer network install -c PeerAdmin@sardex-open-network -a sardex-open-network\@0.0.1.bna

composer network start --networkName sardex-open-network --networkVersion 0.0.1 -A admin -S adminpw -c PeerAdmin@sardex-open-network

composer card import -f admin@sardex-open-network.card