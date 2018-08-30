#!/bin/bash
# network is using the tutorial certs and pathes

composer archive create -t dir -n .

pem_admin_file=/home/vagrant/fabric-dev-servers/fabric-scripts/hlfv11/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem

cert_admin_file=/home/vagrant/fabric-dev-servers/fabric-scripts/hlfv11/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk

composer card create -p connection.json -u PeerAdmin -c $pem_admin_file -k $cert_admin_file -r PeerAdmin -r ChannelAdmin

composer card import -f PeerAdmin@fabric-network.card

composer network install -c PeerAdmin@fabric-network -a sardex-open-network\@0.0.1.bna

composer network start --networkName sardex-open-network --networkVersion 0.0.1 -A admin -S adminpw -c PeerAdmin@fabric-network

composer card import -f admin@sardex-open-network.card