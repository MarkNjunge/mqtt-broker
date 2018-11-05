FROM node:8.12.0-slim

WORKDIR /usr/src/app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 1883
EXPOSE 8080

CMD [ "npm", "start" ]