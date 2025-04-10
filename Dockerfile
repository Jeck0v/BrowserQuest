FROM node:18

WORKDIR /app
COPY . .

RUN cd server && npm install
RUN cd client && npm install http-server --save-dev

RUN chmod 644 server/config.json server/config_local.json

RUN mkdir -p /config && \
    cp server/config.json /config/ && \
    cp server/config_local.json /config/ && \
    mkdir -p /maps && \
    cp server/maps/world_server.json /maps/

RUN sed -i "s|\./server/config\.json|/config/config.json|g" server/js/main.js && \
    sed -i "s|\./server/config_local\.json|/config/config_local.json|g" server/js/main.js && \
    sed -i "s|\./server/maps|/maps|g" server/js/main.js

EXPOSE 8080 8000

CMD ["sh", "-c", "cd /app/client && npx http-server -p 8080 & cd /app/server && node js/main.js"]