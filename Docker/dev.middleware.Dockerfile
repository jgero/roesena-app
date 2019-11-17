# base image
FROM node:10

# set working directory
WORKDIR /app

ENV NODE_ENV=development

COPY package.json /app/package.json
# install dependencies
RUN npm install
# add current directory to /app folder in the container
COPY . /app
# start app
CMD ["npm", "run", "build"]