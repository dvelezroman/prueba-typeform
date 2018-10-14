# lets start from an image that already has nodejs installed
FROM node:8

# Essentially running mkdir <name> inside the current working
# directory, and then cd <name>
WORKDIR /usr/src/app
# copy the package.json from your computer, into the 
# current directory inside of the container. Then install
# all the dependencies. Then copy the rest of the files
# recursively into the container.
COPY /browser/package*.json ./
RUN npm install 
COPY ./browser .

# Expose port 4000 inside the container to the outside world
# so that http://localhost:4000 routes the network traffic to
# the container
EXPOSE 3000
CMD [ "npm", "start"]