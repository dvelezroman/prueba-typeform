FROM node:9.6.1
WORKDIR /usr/app
COPY ./server/package.json .
RUN npm install --quiet
COPY ./server .
RUN mkdir /server
EXPOSE 3001
WORKDIR /usr/app/server
CMD ["npm start"]