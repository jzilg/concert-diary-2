FROM node:16-slim
WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build
RUN npm prune --production
CMD  ["npm", "start"]
