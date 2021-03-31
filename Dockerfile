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
  jpeg-dev \
  cairo-dev \
  giflib-dev \
  pango-dev \
  libtool \
  cairo-dev \
  jpeg-dev \
  musl-dev \
  pixman-dev \
  pangomm-dev \
  nasm \
  tor \
  chromium

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

CMD ./start.sh
