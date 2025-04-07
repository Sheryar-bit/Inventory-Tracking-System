FROM node:18

WORKDIR /usr/src/app

# Copy only the essential files for dependency installation first
COPY package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# Install dependencies
RUN npm install

# Generate Prisma client (first pass)
RUN npx prisma generate

# Copy all remaining files
COPY . .

# Verify Prisma client exists
RUN ls -la node_modules/.prisma/client

# Final generate to ensure everything is up-to-date
RUN npx prisma generate

# Production command
CMD ["node", "app.js"]