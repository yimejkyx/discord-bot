FROM node:alpine

RUN apk add vips vips-dev fftw-dev --update-cache \
    --repository http://dl-3.alpinelinux.org/alpine/edge/community \
    --repository http://dl-3.alpinelinux.org/alpine/edge/main

RUN apk add --no-cache \
    python \
    python3 \
    autoconf \
    automake \
    bash \
    g++ \
    libc6-compat \
    libjpeg-turbo-dev \
    libpng-dev \
    make \
    nasm

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

CMD npm start
