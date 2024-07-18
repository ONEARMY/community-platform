# Use the official Node.js image
FROM node:20-slim

# Create and change to the app directory
WORKDIR /usr/

# Copy application dependency manifest files to the container image
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy local code to the container image
COPY . .

# Expose port 80 to the world outside this container
EXPOSE 8080

# Run the web service on container startup
CMD ["node", "src/app.js"]