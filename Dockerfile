# Use official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of the application
COPY . .

# Expose port (if using something like Express)
EXPOSE 5000

# Start the app
CMD ["node", "server.js"]
