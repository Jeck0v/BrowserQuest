FROM node:18

# Configuration de base
WORKDIR /app
COPY . .

# Installation des dépendances
RUN cd server && npm install
RUN cd client && npm install http-server --save-dev

# Correction des permissions
RUN chmod 644 server/config.json server/config_local.json

# Préparation des fichiers de configuration
RUN mkdir -p /game_config && \
    cp server/config.json /game_config/ && \
    cp server/config_local.json /game_config/ && \
    mkdir -p /game_maps && \
    cp server/maps/world_server.json /game_maps/

# Patch du code source pour utiliser les chemins absolus
RUN sed -i "s|\./server/config\.json|/game_config/config.json|g" server/js/main.js && \
    sed -i "s|\./server/config_local\.json|/game_config/config_local.json|g" server/js/main.js && \
    sed -i "s|\./server/maps|/game_maps|g" server/js/main.js && \
    sed -i "s|\./server/config|/game_config|g" server/js/main.js

EXPOSE 8080 8000

CMD ["sh", "-c", "cd /app/client && npx http-server -p 8080 & cd /app/server && node js/main.js"]