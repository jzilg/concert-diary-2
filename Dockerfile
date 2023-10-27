FROM oven/bun:latest
WORKDIR /app
COPY . /app
RUN bun install && \
    bun run build
CMD  ["bun", "start"]
