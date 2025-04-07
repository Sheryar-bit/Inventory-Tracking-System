FROM node:18

WORKDIR /usr/src/app


COPY package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npm install

RUN npx prisma generate

COPY . .

RUN ls -la node_modules/.prisma/client

RUN npx prisma generate

CMD ["node", "app.js"]