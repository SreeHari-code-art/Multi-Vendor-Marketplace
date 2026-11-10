# Run with Docker

Requires Docker Desktop (Compose v2). Run everything from the project root (the folder containing `docker-compose.yml`).

```bash
docker compose up --build
```

Open **http://localhost:8080**. The first build downloads dependencies and takes a few minutes; later builds reuse the cache. Leave it running until you see `MongoDB connected: mongo` and `API running on http://localhost:5000` (that port is inside the container).

Load the demo data from a second terminal (once):

```bash
docker compose run --rm backend npm run seed
```

Stop with `docker compose down`. Add `-v` to also delete the database.

## Ports

| Service  | Host port | Change it                                  |
| -------- | --------- | ------------------------------------------ |
| Web app  | 8080      | `WEB_PORT=8081 docker compose up --build`  |
| MongoDB  | 27017     | `MONGO_PORT=27018 docker compose up --build` |
| API      | not published | Use `http://localhost:8080/api/...` (nginx forwards it) |

The API is deliberately not published: macOS reserves host port 5000 for AirPlay Receiver, which would break `docker compose up`. Quick check: `curl http://localhost:8080/api/health` should return `{"ok":true}`.

## If `npm ci` is slow or hangs during the build

The Dockerfiles already force IPv4 DNS and set npm retries/timeouts. If the frontend build still stalls, build the frontend on your Mac and let Docker only package it:

```bash
(cd frontend && npm ci && npm run build)
export COMPOSE_FILE=docker-compose.yml:docker-compose.prebuilt.yml
docker compose up --build
```

Keep that `export` in the same terminal (also for the `seed` and `down` commands), or run `unset COMPOSE_FILE` to go back to the normal build.

## Starting clean after failed attempts

```bash
docker compose down --remove-orphans
docker ps -a        # look for leftover containers from manual `docker run` commands
docker rm -f <name> # remove any you don't need
```
