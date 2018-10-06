FROM node:9.6.1
RUN mkdir /app
RUN mkdir /app/server
WORKDIR /app/server
COPY ./server/package.json /app/server/package.json
COPY ./server/package-lock.json /app/server/package-lock.json
COPY ./server /app/server
RUN npm install --silent
EXPOSE 3001
CMD ["npm start"]