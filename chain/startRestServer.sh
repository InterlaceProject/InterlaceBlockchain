#!/bin/bash

# starting rest server
#composer-rest-server -c admin@sardex-open-network -n never -w true  -y 123123123 -a false -m true 
composer-rest-server -c admin@sardex-open-network -n never -w true
if ! [ $? -eq 0 ]; then
    >&2 echo "Ensure that the fabric network is running, the bna file is deployed and the network is working correctly."
    exit 1
fi
