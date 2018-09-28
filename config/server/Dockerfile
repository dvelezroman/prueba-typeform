FROM node:7
RUN mkdir /prueba-typeform
ADD . /prueba-typeform
WORKDIR /prueba-typeform
RUN cd server && npm i
EXPOSE 80
CMD ["npm", "start"]