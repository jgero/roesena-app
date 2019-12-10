FROM node:10-alpine

ENV NODE_ENV=development
ENV TZ='Europe/Amsterdam'

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

CMD [ "npm", "run", "dev" ]
