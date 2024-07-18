# Use the official Node.js image
FROM node:20-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifest files to the container image
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy local code to the container image
COPY . .

# Expose port 80 to the world outside this container
EXPOSE 80

# Run the web service on container startup
CMD ["node", "app.js"]