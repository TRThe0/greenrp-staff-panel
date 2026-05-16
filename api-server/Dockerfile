FROM node:18-alpine
WORKDIR /usr/src/app

# Install deps
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "index.js"]
