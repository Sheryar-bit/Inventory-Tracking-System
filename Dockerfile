
FROM node:18-alpine


WORKDIR /app


COPY package.json ./


RUN npm install --production


COPY controllers ./controllers
COPY db ./db
COPY middleware ./middleware
COPY Routes ./Routes
COPY prisma ./prisma
COPY app.js .
COPY README.md .



RUN npx prisma generate


EXPOSE 3000


CMD ["node", "app.js"]
