FROM node:18
WORKDIR /pld
COPY package*.json ./
RUN apt-get update
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
RUN npm install
COPY . .
EXPOSE 3000
