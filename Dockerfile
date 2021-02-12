FROM node:alpine

RUN apk add --update --no-cache \
  make \
  build-base \
  python \
  python3 \
  autoconf \
  automake \
  bash \
  gcc \
  g++ \
  libjpeg-turbo-dev \
  libpng-dev \
  nasm

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

CMD npm start
