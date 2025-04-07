# Dockerfile - Vite/React
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Usa o preview embutido do Vite
CMD ["npm", "run", "preview", "--", "--host"]
