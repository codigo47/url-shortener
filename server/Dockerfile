FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon

COPY . .

# Run Prisma generate with explicit schema path
RUN npx prisma generate --schema=./src/infrastructure/persistence/prisma/schema.prisma

EXPOSE 5000

# Add watch mode configurations
ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

CMD ["nodemon", "--watch", "src/**/*", "-e", "ts,json", "--exec", "npm run start:dev"]