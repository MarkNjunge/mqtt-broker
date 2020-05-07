FROM node:12.16.3-alpine3.9

WORKDIR /usr/app

COPY . .

RUN yarn

CMD [ "npm", "start" ]