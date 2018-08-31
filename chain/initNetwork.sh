#!/bin/bash
# network is using the tutorial certs and pathes

composer archive create -t dir -n .

cert_admin_file=../fabric/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/keystore/11f467df2881d0de9687049afe8fc55ebebe68b4a912aa3b14548f721d3d2498_sk
pem_admin_file=../fabric/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/signcerts/Admin@sardex.sardex.net-cert.pem


composer card create -p connection.json -u PeerAdmin -c $pem_admin_file -k $cert_admin_file -r PeerAdmin -r ChannelAdmin

composer card import -f PeerAdmin@sardex-open-network.card

composer network install -c PeerAdmin@sardex-open-network -a sardex-open-network\@0.0.1.bna

composer network start --networkName sardex-open-network --networkVersion 0.0.1 -A admin -S adminpw -c PeerAdmin@sardex-open-network

composer card import -f admin@sardex-open-network.card