FROM node:16-alpine
RUN npm i npm@latest -g
RUN apk update
RUN apk add rsync

RUN mkdir /home/api

RUN mkdir /home/api/cache
WORKDIR /home/api/cache

COPY package.json ./
COPY package-lock.json ./
RUN npm install

RUN mkdir /home/api/app
WORKDIR /home/api/app