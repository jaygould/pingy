FROM node:16
RUN npm i npm@latest -g
RUN apt-get update -y
RUN apt-get install -y rsync

RUN mkdir /home/api

RUN mkdir /home/api/cache
WORKDIR /home/api/cache

COPY package.json ./
COPY package-lock.json ./
RUN npm install

RUN mkdir /home/api/app
WORKDIR /home/api/app 

COPY prisma ./prisma/
RUN npx prisma generate
