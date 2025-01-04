FROM node:22-slim
WORKDIR /app
COPY . /app
RUN npm ci && \
    npm run build && \
    rm -rf node_modules
CMD  ["npm", "start"]
