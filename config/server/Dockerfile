FROM node:7.7.2-alpine

RUN mkdir /server

WORKDIR /server

COPY ./package.json package.json

RUN npm install

EXPOSE 80

ADD ./server/app.js app.js

CMD ["npm", "start"]