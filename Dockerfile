FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

# Create a symbolic link to ensure shared files are accessible from the client
RUN ln -sf /app/shared /app/client/shared

EXPOSE 8080 8000

CMD ["sh", "-c", "cd client && npx http-server -p 8080 & node server/js/main.js"]

