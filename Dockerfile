FROM node:7
RUN mkdir /medilink
ADD . /medilink
WORKDIR /medilink/browser
RUN npm i
WORKDIR /medilink/server
RUN npm i
EXPOSE 3001
CMD ["npm", "start"]