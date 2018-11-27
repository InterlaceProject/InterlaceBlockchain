#!/bin/bash
fabric/deletePlaygroundCards.sh &&
	fabric/teardownFabric.sh &&
	fabric/startFabric.sh &&
	cd chain/ &&
	./initNetwork.sh &&
	composer transaction submit -c admin@sardex-open-network -d  '{ "$class": "net.sardex.interlace.InitBlockchain" }'
