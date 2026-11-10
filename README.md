# Multi-Vendor-Marketplace

**_Backend_**

- Nodejs
- Mongodb
- Express

**_Frontend_**

- React Js

## Step to Start

**For Backend**
1.  `cd Multi-Vendor-Marketplace`
2.  `npm install`
3.  `npm run dev`

**For Frontend**
1.  `cd Multi-Vendor-Marketplace`
2.  `npm install`
3.  `npm run start`

### Backend CORS configuration

Set `CORS_ORIGIN` in the backend environment to the frontend's origin (scheme and
host, with no path). Multiple origins can be comma-separated, for example:
`CORS_ORIGIN=https://shop.example.com,https://admin.example.com`.
Local development origins on ports 3000, 3001, and 5173 are allowed by default.
