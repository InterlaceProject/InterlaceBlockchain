#!/bin/bash
# 0 equal
# 1 >
# 2 <
vercomp () {    
    if ! [[ $1 =~ ^[0-9.]+$ ]]
    then
      echo 3
      exit
    fi
    if ! [[ $2 =~ ^[0-9.]+$ ]]
    then
      echo 3
      exit
    fi
    
    if [[ $1 == $2 ]]
    then
      echo 0
      exit
    fi
    
    local IFS=.
    local i ver1=($1) ver2=($2)
    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++))
    do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++))
    do
        if [[ -z ${ver2[i]} ]]
        then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]}))
        then
            echo 1
            exit
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]}))
        then
            echo 2
            exit 
        fi
    done
    echo 0
}
required_version="1.2.0"
version_cryptogen=`cryptogen version 2>/dev/null | grep Version | grep -oE [0-9.]+`
version_configtxgen=`configtxgen -version 2>/dev/null | grep Version | grep -oE [0-9.]+`

res=$(vercomp "$version_configtxgen" "$required_version")
if [[ $res -gt 1 ]]
then
  [[ $res == 3 ]] && version_configtxgen="undefined"
  echo "configtxgen should have at least version $required_version but has $version_configtxgen"
  exit 1
fi
res=$(vercomp "$version_cryptogen" "$required_version")
if [[ $res -gt 1 ]]
then
  [[ $res == 3 ]] && version_cryptogen="undefined"
  echo "cryptogen should have at least version $required_version but has $version_cryptogen"
  exit 1
fi

export PATH=${PWD}/../bin:${PWD}:$PATH
export FABRIC_CFG_PATH=${PWD}
export VERBOSE=false
export FABRIC_VERSION="hlfv11"

cryptogen generate --config=./crypto-config.yaml
configtxgen -profile InterlaceOrdererGenesis -outputBlock ./interlace-genesis.block && \
  configtxgen -profile InterlaceChannel -outputCreateChannelTx ./interlace-channel.tx -channelID interlacechannel
