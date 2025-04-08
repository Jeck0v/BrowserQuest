FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=browserquest-frontend /app/client-build /usr/share/nginx/html
