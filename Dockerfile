FROM node:16
WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build
CMD  ["npm", "start"]
