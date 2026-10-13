# use an official node.js runtime as a parent image
FROM node:24-alpine

#set the working directory in the container

WORKDIR /app

#copy package.json and package-lock.json to the working directory
COPY package*.json ./

#install dependencies
RUN npm install


#copy the rest of the application code to the working directory
COPY . . 

# expose app port

EXPOSE 5000

# define run command for application

CMD ["node", "./src/server.js"]

