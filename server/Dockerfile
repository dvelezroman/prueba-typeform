FROM node:9
RUN mkdir /app
RUN mkdir /app/server
WORKDIR /app/server
COPY ./package.json /app/server/package.json
COPY ./package-lock.json /app/server/package-lock.json
RUN npm install --silent
COPY . /app/server
EXPOSE 3001
CMD ['npm start']