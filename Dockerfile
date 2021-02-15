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
  nasm \
  tor \
  chromium

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

CMD ./start.sh
