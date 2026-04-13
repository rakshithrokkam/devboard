FROM node:20-alpine

WORKDIR /usr/src/app

# Only copy package.json and package-lock.json initially to leverage Docker cache
COPY package*.json ./

RUN npm ci --only=production

# Copy all the source code
COPY . .

EXPOSE 5000

# Start server
CMD ["npm", "start"]
