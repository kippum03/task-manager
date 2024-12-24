FROM node:16

WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Clean and rebuild SQLite3 dependencies inside the container
RUN npm install && npm rebuild sqlite3

# Copy the remaining application code
COPY . .

EXPOSE 3000
CMD ["npm", "start"]