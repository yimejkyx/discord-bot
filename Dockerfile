FROM node:alpine

RUN apk add --no-cache \
    python \
    python3 \
    autoconf \
    automake \
    bash \
    g++ \
    make \
    nasm

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

CMD npm start
