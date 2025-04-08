FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=browserquest-frontend /usr/share/nginx/html /usr/share/nginx/html
