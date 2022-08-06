FROM node:16
RUN npm i npm@latest -g
RUN apt-get update -y
RUN apt-get install -y rsync

RUN mkdir /home/client

RUN mkdir /home/client/cache
WORKDIR /home/client/cache

COPY package.json ./
COPY package-lock.json ./
RUN npm install

RUN mkdir /home/client/app
WORKDIR /home/client/app