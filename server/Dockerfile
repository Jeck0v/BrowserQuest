FROM node:20-alpine

WORKDIR /app

COPY server ./server
COPY shared ./shared
COPY package*.json ./

RUN npm ci

CMD ["node", "server/js/main.js"]
