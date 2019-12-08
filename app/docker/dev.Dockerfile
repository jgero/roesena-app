FROM node:10-alpine

ENV NODE_ENV=development

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

CMD [ "npm", "run", "dev" ]