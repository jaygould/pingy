FROM node:16

WORKDIR /home/api/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

