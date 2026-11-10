# Run without Docker (Windows)

This guide runs the marketplace directly on a fresh Windows laptop. Docker is not required.

## 1. Install the prerequisites

Install:

- **Node.js 22.12 or later** (the Node.js 22 LTS release is recommended): [nodejs.org](https://nodejs.org/). The installer includes npm.
- **MongoDB Community Server** for Windows: [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community). In the installer, select the option to install MongoDB as a Windows Service. The default local port is `27017`.
- **Git for Windows** if you will clone the project: [git-scm.com/download/win](https://git-scm.com/download/win). Alternatively, download and extract the project ZIP.

After installation, open a new PowerShell window and confirm Node.js and npm are available:

```powershell
node --version
npm --version
```

The Node.js version must be at least `v22.12.0`.

## 2. Open the project folder

If you have not downloaded the project yet, clone it or extract its ZIP. Then open PowerShell in the project root (the folder containing `backend` and `frontend`). For example:

```powershell
Set-Location "$HOME\Documents\Multi-Vendor-Marketplace"
```

## 3. Start MongoDB

If you selected **Install MongoDB as a Service**, the service usually starts automatically. Check its status in PowerShell:

```powershell
Get-Service MongoDB
```

If it is stopped, start it from an elevated PowerShell window:

```powershell
Start-Service MongoDB
```

The app expects MongoDB at `127.0.0.1:27017`. If MongoDB was installed with a different port or connection setting, update `MONGO_URI` in `backend\.env` accordingly.

## 4. Configure and start the backend

In the first PowerShell window, from the project root:

```powershell
Copy-Item backend\.env.example backend\.env
```

Open `backend\.env` in a text editor. For local development, the example values work with the default MongoDB service; replace `JWT_SECRET` with a long, private random string before using the app beyond local development.

Install the backend dependencies, load the demo data, and start the API:

```powershell
Set-Location backend
npm ci
npm run seed
npm run dev
```

Keep this window open. The API listens at `http://localhost:5001`. Seeding is optional and safe to run again; it creates the demo accounts, shops, and products.

## 5. Start the frontend

Open a **second** PowerShell window in the project root and run:

```powershell
Set-Location frontend
npm ci
npm run dev
```

Open the URL Vite prints in the terminal, usually **http://localhost:5173**. The frontend sends `/api` requests through its development proxy to the backend on port `5001`.

To confirm the backend is responding, open **http://localhost:5001/api/health**. It should return:

```json
{"ok":true}
```

## Demo accounts

After running `npm run seed`, sign in with one of these accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `Admin@123` |
| Seller | `techhaven@example.com` | `Seller@123` |
| Customer | `customer@example.com` | `Customer@123` |

The admin credentials can be changed with `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend\.env` before seeding.

## Troubleshooting

- **`node` or `npm` is not recognized:** finish installing Node.js, then close and reopen PowerShell so it picks up the updated PATH.
- **MongoDB connection failed:** confirm the MongoDB service is running with `Get-Service MongoDB`, and verify `MONGO_URI` in `backend\.env` uses the correct host and port.
- **Port 5001 or 5173 is already in use:** close the other application using that port. The Vite proxy expects the backend on port `5001`, so keep the backend on that port unless you also update `frontend\vite.config.js`.
- **The app cannot reach the API:** keep both terminal windows open and confirm the backend health URL returns `{"ok":true}`.
