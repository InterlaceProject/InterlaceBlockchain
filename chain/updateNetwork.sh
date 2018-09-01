#!/bin/bash

export NET_VERSION=0.0.5

composer archive create --sourceType dir --sourceName . -a sardex-open-network@${NET_VERSION}.bna
composer network install --card PeerAdmin@sardex-open-network --archiveFile sardex-open-network@${NET_VERSION}.bna
composer network upgrade -c PeerAdmin@sardex-open-network -n sardex-open-network -V ${NET_VERSION}

