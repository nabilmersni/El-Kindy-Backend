FROM node:16-alpine 
ADD upload-directory /app/upload-directory 
WORKDIR /app
COPY . /app 
RUN npm install 
RUN npm run build-dev 
EXPOSE 3000 
CMD  ["npm", "start"]