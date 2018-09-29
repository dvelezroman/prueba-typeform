FROM node:9
RUN mkdir /app
RUN mkdir /app/browser
WORKDIR /app/browser
COPY ./package.json /app/server/package.json
RUN npm install --silent
COPY . /app/browser
EXPOSE 80
CMD ['npm start']