# syntax=docker/dockerfile:1
# --- build the React app ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
# ipv4first + explicit timeouts/retries stop npm from stalling on Docker Desktop when IPv6 routes are broken.
RUN --mount=type=cache,target=/root/.npm \
    NODE_OPTIONS=--dns-result-order=ipv4first \
    npm ci --legacy-peer-deps --no-audit --no-fund \
      --fetch-retries=5 --fetch-retry-mintimeout=2000 --fetch-timeout=60000
COPY . .
RUN npm run build

# --- serve it with nginx, proxying /api to the backend container ---
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# make sure the nginx worker can read everything, whatever file modes the source tree had
RUN chmod -R a+rX /usr/share/nginx/html
EXPOSE 80
