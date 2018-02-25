#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

PROXY=nginx
MODULE=cs5331
#TEAMID=${MODULE}-${PROXY}-`md5sum README.md | cut -d' ' -f 1`
TEAMID=${MODULE}-${PROXY}
docker kill $(docker ps -a | fgrep ${MODULE}-${PROXY} | awk '{print $1}') &>/dev/null
docker rm $(docker ps -a | fgrep ${MODULE}-${PROXY} | awk '{print $1}') &>/dev/null
docker build . -t $TEAMID
docker run --name=${TEAMID} -p 80:80 -p 8080:8080 -t $TEAMID $@
