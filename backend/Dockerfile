# Start with Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package dependencies
COPY package*.json ./

# Install packages
RUN npm install

# Copy the rest of your backend code
COPY . .

# Expose the API port
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]
