FROM node:10-alpine AS builder

WORKDIR /app

ENV NODE_ENV=development
ENV TZ='Europe/Amsterdam'

COPY package.json package.json
COPY package-lock.json package-lock.json

#install packages still in dev mode
RUN npm ci 

ENV NODE_ENV=production

COPY . /app

# to be able to build the app here
RUN npm run build

FROM node:10-alpine

WORKDIR /app

#install in prod mode now so only needed packages are here
ENV NODE_ENV=production
ENV TZ='Europe/Amsterdam'

COPY package.json package.json
COPY package-lock.json package-lock.json

# copy built app from builder stage
COPY --from=builder /app/__sapper__ __sapper__
# copy static files from sources
COPY static static

RUN npm ci 

CMD ["npm", "start"]
