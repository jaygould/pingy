FROM node:16.15.0-alpine

RUN apk update
RUN apk add vim nano

WORKDIR /home/app/api

COPY package*.json ./

COPY . .

# https://stackoverflow.com/questions/30043872/docker-compose-node-modules-not-present-in-a-volume-after-npm-install-succeeds
# https://stackoverflow.com/questions/45739252/access-node-modules-in-typescript-while-using-docker-docker-compose
# https://burnedikt.com/dockerized-node-development-and-mounting-node-volumes/