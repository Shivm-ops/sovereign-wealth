# Step 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package dependencies first for better caching
COPY package*.json ./
RUN npm install
# Copy the rest of the application files
COPY . .
# Build the production optimized code
RUN npm run build

# Step 2: Serve the application using a lightweight Nginx web server
FROM nginx:alpine
# Copy the built files from the previous step
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose port 80 inside the container
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
