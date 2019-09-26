FROM nginx:alpine
COPY dev-config.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]