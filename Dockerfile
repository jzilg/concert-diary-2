FROM node:18-slim
WORKDIR /app
COPY . /app
RUN npm ci && \
    npm run build && \
    npm prune --production
CMD  ["npm", "start"]
