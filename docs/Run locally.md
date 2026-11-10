# Run locally

Requires Node 22 (Vite 8 needs Node 20.19+ or 22.12+) and MongoDB on `localhost:27017`. No MongoDB installed? Use the container from this repo:

```bash
docker compose up -d mongo
```

**Terminal 1: backend** (http://localhost:5001)

```bash
cd backend
cp .env.example .env     # then set JWT_SECRET to any long random string
npm ci
npm run seed             # optional demo data
npm run dev
```

**Terminal 2: frontend** (http://localhost:5173)

```bash
cd frontend
npm ci
npm run dev
```

Open **http://localhost:5173**. Vite proxies `/api` to the backend on port 5001.

Notes:
- The local API uses port 5001 because macOS reserves 5000 for AirPlay Receiver.
- If you started Mongo with `MONGO_PORT=27018`, change the port in `MONGO_URI` inside `backend/.env`.
- The Docker stack (port 8080) and the local stack (port 5173) can run side by side; they don't share ports except MongoDB.
