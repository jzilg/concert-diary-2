FROM node:22-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY . /app
RUN pnpm intstall && \
    pnpm run build && \
    pnpm prune --production
CMD  ["pnpm", "start"]
