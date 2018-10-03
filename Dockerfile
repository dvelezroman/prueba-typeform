FROM node:9
RUN mkdir /app/browser/build
WORKDIR /app/browser/
COPY ./browser/build /app/browser/build
RUN mkdir /app/server
WORKDIR /app/server
COPY ./package.json /app/server/package.json
COPY ./package-lock.json /app/server/package-lock.json
RUN npm install --silent
COPY ./server /app/server
EXPOSE 3001
CMD ['npm run server']