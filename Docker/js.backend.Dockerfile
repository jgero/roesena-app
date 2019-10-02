# base image
FROM node:9.6.1

# set working directory
WORKDIR /app

COPY package.json /app/package.json
# install dependencies
RUN npm install
# add current directory to /app folder in the container
COPY . /app
# compise TypeScript to JavaScript
RUN npm run tsc

# start app
CMD node build/index.js