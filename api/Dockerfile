FROM node:16

RUN apt-get update -y
RUN apt-get install -y rsync

WORKDIR /home/api/cache

COPY package.json ./
COPY package-lock.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

WORKDIR /home/api/app 