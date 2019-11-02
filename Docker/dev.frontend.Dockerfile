FROM node:alpine AS builder
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
CMD [ "npm", "run", "start" ]