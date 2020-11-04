#!/bin/bash

CONTAINER=${container_name}
PORT=${port}

docker build --no-cache -t ${image_name}:${tag} .

RUNNING=${docker inspect --format="{{ .State.Running}}" $CONTAINER 2 > /dev/null}

# 条件判断
if [ ! -n $RUNNING ]; then
  echo "$CONTAINER does not exit"
  return 1
fi    

if [ "$RUNNING" == "false" ]; then
  echo "$CONTAINER is not running."
  return 2
else
  echo "$CONTAINER is running"
  # delete same name container
  matchingStarted=$(docker ps --filter="name=$CONTAINER" -q | xargs)
  if [ -n $matchingStarted ]; then
    docker stop $matchingStarted
  fi
  
  matching=$(docker ps -a --filter="name=$CONTAINER" -q | xargs)
  if [ -n $matching ]; then
    docker rm $matching
  fi
fi

echo "RUNNING is ${RUNNING}"

docker run -itd --name $CONTAINER -p $PORT:3000 ${image_name}:${tag}
