FROM node:9-slim 
#https://hub.docker.com/_/node 
WORKDIR /app 
COPY package.json /app 
RUN npm install 
COPY . /app 
CMD ["node", "index.js"]