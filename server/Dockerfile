# server/Dockerfile
FROM node:18

WORKDIR /app

# Copier package.json et package-lock.json depuis la racine
COPY server ./server 
COPY shared ./shared
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Commande pour lancer le serveur
CMD ["node", "server/js/main.js"]
