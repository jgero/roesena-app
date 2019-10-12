# base image
FROM node:9.6.1

# set working directory
WORKDIR /app

COPY package.json /app/package.json
# install dependencies
RUN npm install
# add current directory to /app folder in the container
COPY . /app
# start app
CMD npm run start:compile