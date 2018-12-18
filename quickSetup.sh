#!/bin/bash
fabric/deletePlaygroundCards.sh &&
	fabric/teardownFabric.sh &&
	fabric/startFabric.sh &&
	cd chain/ &&
	./initNetwork.sh

if ! [ $? -eq 0 ]; then
    >&2 echo "Error during setting up network."
    exit 1
fi

echo "Filling Blockchain with demo data ..."
composer transaction submit -c admin@sardex-open-network -d  '{ "$class": "net.sardex.interlace.InitBlockchain" }'
echo "Done."
