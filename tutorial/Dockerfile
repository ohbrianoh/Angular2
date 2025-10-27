# Stage 1: Build the Angular application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application from a lightweight Nginx server
FROM nginx:alpine

# Copy the built application from the 'build' stage to the Nginx public folder
COPY --from=build /app/dist/tutorial/browser /usr/share/nginx/html

# Copy the mock database
COPY db.json /app/db.json

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install gettext for envsubst, and nodejs+npm for json-server
RUN apk add --no-cache gettext nodejs npm

# Install json-server globally
RUN npm install -g json-server

# Copy the entrypoint script and make it executable
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]