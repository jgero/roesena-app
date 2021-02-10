FROM docker.io/node:10

# setup workdir
RUN mkdir /app

# add local node_modules to path so no global package installation is needed
ENV PATH /app/node_modules/.bin:$PATH
