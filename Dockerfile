# FROM node:9-slim 
# #https://hub.docker.com/_/node 
# WORKDIR /app 
# COPY package.json /app 
# RUN npm install 
# COPY . /app 
# CMD ["node", "index.js"]

FROM node:16.3.0-alpine 
WORKDIR /app 
COPY package.json /app  
RUN npm install  
COPY . . 
EXPOSE 4567 
CMD npm start 