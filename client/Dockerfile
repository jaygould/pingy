FROM node:16

WORKDIR /home/client/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./