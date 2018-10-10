FROM node:8
RUN mkdir /medilink
ADD . /medilink
WORKDIR /medilink/browser
RUN npm i
WORKDIR /medilink/server
RUN npm i
EXPOSE 3001
CMD ["npm", "run", "both"]