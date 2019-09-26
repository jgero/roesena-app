FROM node:alpine AS builder
WORKDIR /app
COPY . .
ENV PATH /app/node_modules/.bin:$PATH
RUN npm install
RUN npm install -g @angular/cli
RUN ng build --prod

# prod build would look something like this, some files need to be cahnged

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/landing-page/ /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]