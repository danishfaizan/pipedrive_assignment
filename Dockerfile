FROM node:alpine

#Create app directory
WORKDIR /usr/src/app

#Bundle app
COPY . .

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]