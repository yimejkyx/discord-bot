FROM node:alpine

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

RUN apk add --update --no-cache \
    --repository http://dl-3.alpinelinux.org/alpine/edge/community \
    --repository http://dl-3.alpinelinux.org/alpine/edge/main \
    vips-dev

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

CMD npm start
