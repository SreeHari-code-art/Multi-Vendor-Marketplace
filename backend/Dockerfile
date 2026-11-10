# syntax=docker/dockerfile:1
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node package*.json ./
# ipv4first + explicit timeouts/retries stop npm from stalling on Docker Desktop when IPv6 routes are broken.
RUN --mount=type=cache,target=/root/.npm \
    NODE_OPTIONS=--dns-result-order=ipv4first \
    npm ci --omit=dev --no-audit --no-fund \
      --fetch-retries=5 --fetch-retry-mintimeout=2000 --fetch-timeout=60000
# --chown: source files may be mode 600 (e.g. from a zip), so the non-root user must own them
COPY --chown=node:node . .
USER node
EXPOSE 5000
CMD ["node", "server.js"]
