FROM alpine:3.1

FROM node:8

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

#RUN docker compose up
#RUN docker compose run

CMD [ "npm", "start" ]