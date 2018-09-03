# InterlaceBlockchain

This is the Interlace blockchain implementation based on the specifications created in deliverable [D3.1](https://github.com/pdini/Interlace_D3.1) as well as the [ASIM Specification](https://github.com/InterlaceProject/ASIMSpec) of the requirements.

## Setup instructions

First it is necessary to install the pre-Requisites which can be found [here](https://hyperledger.github.io/composer/latest/installing/installing-prereqs.html) and are available for Linux and Mac OS. Currently these are the recommended operating systems, however, with additonal effort it might be possible to run the INTERLACE blockchain on Windows.

Additionally it is also important to setup an development environment described at the [composer github repository](https://hyperledger.github.io/composer/latest/installing/development-tools.html). If you do not want to set up the complete environment it would be still required to install at least playground in order to let the scripts run properly.

## Execution

* Start playground

```bash
composer-playground
```
    
* To run fabric block chain the first time

```bash
cd fabric
./downloadFabric.sh
./startFabric.sh
```

* finally initialize Interlace-Chain by calling

```bash
cd chain
./initNetwork.sh
```

**./initNetwork.sh** will copy all models and script to the network peers to make them accessible in the hyperledger blockchain. Use playground to access and test Credit- and DebitTransfer transactions. **data.json** should act as a helper to init the network quicker. Later the data will be inserted automatically to fill the chain with dummy/test data.

## General architecture:

![](https://raw.githubusercontent.com/InterlaceProject/InterlaceBlockchain/master/figs/Architecture.jpg)


## .cto model diagram:

![](https://raw.githubusercontent.com/InterlaceProject/InterlaceBlockchain/master/figs/DCN_V9.jpg)
