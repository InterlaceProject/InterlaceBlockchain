# Config Information

In file $_config.sh$ bash variables need to be pre-defined. The fabric script relay on that configuration in order to run correctly. 

The following variable are available:

## General

* FABRIC_START_TIMEOUT=15
* CHANNELID=interlacechannel
* CHANNELTX=interlace-channel.tx
* GENESISBLOCK=interlace-genesis.block

## Organisation Data

* ORG1=Sardex
* ORG1_MSP=SardexMSP
* ORDERER=orderer.sardex.net
* PEER0=peer0.sardex.sardex.net
* CAUTH=ca.sardex.sardex.net

## Keys

* PRIVATE_KEY="${DIR}"/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/keystore/ls11f467df2881d0de9687049afe8fc55ebebe68b4a912aa3b14548f721d3d2498_sk
* CERT="${DIR}"/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/signcerts/Admin@sardex.sardex.net-cert.pem

## Playground

* ADMIN=Admin@sardex.sardex.net
* PEER_ADMIN_CARD=PeerAdmin@hlfv1.card
