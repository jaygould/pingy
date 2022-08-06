FROM node:16
RUN npm i npm@latest -g
RUN apt-get update -y
RUN apt-get install -y rsync

RUN mkdir /home/api && chown node:node /home/api

RUN mkdir /home/api/cache && chown node:node /home/api/cache
WORKDIR /home/api/cache

USER node
COPY --chown=node:node package.json ./
# COPY package-lock.json ./
RUN npm install

RUN mkdir /home/api/app && chown node:node /home/api/app
WORKDIR /home/api/app 