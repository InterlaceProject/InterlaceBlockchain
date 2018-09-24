# InterlaceBlockchain

This is the Interlace blockchain implementation based on the specifications created in deliverable [D3.1](https://github.com/pdini/Interlace_D3.1) as well as the [ASIM Specification](https://github.com/InterlaceProject/ASIMSpec) of the requirements.

## Setup instructions

First it is necessary to install the pre-requisites which can be found [here](https://hyperledger.github.io/composer/latest/installing/installing-prereqs.html) and are available for Linux and Mac OS. Currently these are the recommended operating systems, however, with additional effort it might be possible to run the INTERLACE blockchain on Windows directly.
To support windows user a virtual machine setup is also available and can be found [here](https://github.com/hirsche/hyperledger). It is a very simple setup based on [vagrant](https://www.vagrantup.com/) utilizing an [Ubuntu 16.04 LTS](http://old-releases.ubuntu.com/releases/16.04.4/) virtual machine running on a hyper-v hypervisor.

Additionally it is also important to setup a development environment described at the [composer github repository](https://hyperledger.github.io/composer/latest/installing/development-tools.html). If you do not want to set up the complete environment it would be still recommended to install and start Composer Playground. Playground enables you to connect and test the Interlace payment network. Nevertheless, playground is not required and you might use composer-cli or other methods to utilized the network.

## Execution

Next you can find some help to manage the interlace blockchain and run transactions against the chain.

### Run fabric block chain (the first time)

```bash
cd fabric
./downloadFabric.sh # updates images - only the first time necessary
./startFabric.sh # start up docker environment using docker-compose
```

### Finally initialize Interlace-Chain by calling

```bash
cd chain
./initNetwork.sh # use hyperledger composer to create a business network and deploy it
```

**./initNetwork.sh** will copy all models and script to the network peers to make them accessible in the hyperledger blockchain. You may use playground to access and test Credit- and DebitTransfer transactions. **data.json** should act as a helper to init the network by hand. There is also a transaction called **InitBlockchain** available which sets up a plain testing environment.

### Shutting down

Sometimes it is useful to throw away everything and restart from scratch. To teardown fabric and remove playground left-overs execute:

```bash
cd fabric
./teardownFabric.sh
./deletePlaygroundCards.sh
```

### Start playground

If you've decided to install Composer Playground it can be started using that command

```bash
composer-playground
```

The standard configuration opens a browser connecting to playground at localhost with port *8080*. If you've running playground in a separate virtual environment like e.g. in a docker container, it may be necessary to start the browser manually, determine the VM-/Containers-IP and fill in the address manually in the url field.

## General architecture:

![](https://raw.githubusercontent.com/InterlaceProject/InterlaceBlockchain/master/figs/Architecture.jpg)


## .cto model diagram:

![](https://raw.githubusercontent.com/InterlaceProject/InterlaceBlockchain/master/figs/DCN_V9.jpg)

