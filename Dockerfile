FROM node:18-slim

# Install Potrace and required libraries
RUN apt-get update && \
    apt-get install -y potrace && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy server dependency definitions
# We copy from the 'server' directory because build context is now root
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
# Copy all files from 'server' directory to working directory
COPY server/ .

# Expose port
EXPOSE 3000

# Start command
CMD [ "npm", "start" ]
