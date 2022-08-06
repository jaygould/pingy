FROM node:16
RUN npm i npm@latest -g
RUN apt-get update -y
RUN apt-get install -y rsync

RUN mkdir /home/api

RUN mkdir /home/api/cache
WORKDIR /home/api/cache

COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

RUN mkdir /home/api/app
WORKDIR /home/api/app 

