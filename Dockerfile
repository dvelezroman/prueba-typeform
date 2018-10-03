FROM node:alpine
RUN mkdir /app
RUN mkdir /app/browser
RUN mkdir /app/browser/build
WORKDIR /app/browser/
COPY ./browser/build /app/browser/build
RUN mkdir /app/server
WORKDIR /app/server
COPY ./server/package.json /app/server/package.json
COPY ./server/package-lock.json /app/server/package-lock.json
RUN npm install --silent
COPY ./server /app/server
EXPOSE 3001