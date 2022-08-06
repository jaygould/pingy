FROM node:16
RUN npm i npm@latest -g
RUN apt-get update -y
RUN apt-get install -y rsync

RUN mkdir /home/client && chown node:node /home/client

RUN mkdir /home/client/cache && chown node:node /home/client/cache
WORKDIR /home/client/cache

USER node
COPY --chown=node:node package.json ./
COPY package-lock.json ./
RUN npm install

RUN mkdir /home/client/app && chown node:node /home/client/app
WORKDIR /home/client/app