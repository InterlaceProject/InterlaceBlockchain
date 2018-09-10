#!/bin/bash
# Grab the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FABRIC_START_TIMEOUT=20
export CHANNELID=interlacechannel
export CHANNELTX=interlace-channel.tx
export CHANNELBLOCK=${CHANNELID}.block
export GENESISBLOCK=interlace-genesis.block
export ADMIN=Admin@sardex.sardex.net

export ORG1=Sardex
export ORG1_MSP=SardexMSP
export ORDERER=orderer.sardex.net
export PEER0=peer0.sardex.sardex.net
export CAUTH=ca.sardex.sardex.net

export PRIVATE_KEY="${DIR}"/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/keystore/ls11f467df2881d0de9687049afe8fc55ebebe68b4a912aa3b14548f721d3d2498_sk
export CERT="${DIR}"/composer/crypto-config/peerOrganizations/sardex.sardex.net/users/Admin@sardex.sardex.net/msp/signcerts/Admin@sardex.sardex.net-cert.pem

export PEER_ADMIN_CARD=PeerAdmin@sardex-open-network.card
