FROM node:alpine AS builder
WORKDIR /app
COPY package.json package.json
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install
RUN npm install -g @angular/cli
COPY . .
CMD [ "ng", "serve", "--host=0.0.0.0", "--poll", "3000", "--disableHostCheck" ]