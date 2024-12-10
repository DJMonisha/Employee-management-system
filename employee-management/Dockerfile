FROM node:21.7.1-alpine
WORKDIR /employee-management
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
