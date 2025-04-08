FROM node:20-alpine as builder

RUN apk add --no-cache bash dos2unix

WORKDIR /app
COPY package*.json ./
COPY client ./client
COPY shared ./shared
COPY bin ./bin

RUN dos2unix bin/build.sh && chmod +x bin/build.sh
RUN ls -la bin && cat -vet bin/build.sh
RUN ./bin/build.sh && ls -la /app/client-build


FROM nginx:1.25-alpine as final

COPY --from=builder app/client-build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
