FROM node:18-alpine

WORKDIR /app

# Copy only gateway package files
COPY gateway/package.json ./package.json
COPY gateway/package-lock.json* ./ 

RUN npm install

# Copy gateway source code
COPY gateway/. .

# Copy proto files from root
COPY proto /proto

EXPOSE 5000

CMD ["node", "index.js"]
