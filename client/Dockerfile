FROM node:16

RUN apt-get update -y
RUN apt-get install -y rsync

WORKDIR /home/client/cache

COPY package.json ./
COPY package-lock.json ./
RUN npm install

WORKDIR /home/client/app