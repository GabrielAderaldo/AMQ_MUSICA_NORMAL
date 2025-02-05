FROM node:18-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install 

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run build && npm start"]
