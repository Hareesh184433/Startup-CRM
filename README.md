# Startup CRM Lite

Full-stack multi-tenant CRM built with the MERN stack (MongoDB, Express, React, Node.js).

Each registered user represents one startup's isolated workspace (one login per startup, as
decided). All leads, notifications, and stats are scoped to the logged-in account only.

## Project Structure

```
startup-crm-lite/
├── backend/     Express + MongoDB API
└── frontend/    React + Vite + Tailwind app
```

## Features

- JWT authentication (register / login), one workspace per account
- Leads CRUD: create, search, filter by status & source, list/grid view
- Dashboard: live stats cards, pipeline breakdown, recent leads, CSV export
- Analytics: charts for leads by status and by source, conversion rate, won deal value
- Notifications: auto-generated on lead created / won / lost / meeting scheduled
- Settings: update name and company name
- Light/dark mode toggle

## 1. Run locally

### Backend

```
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and JWT_SECRET
npm run dev
```

Backend runs at `http://localhost:5000`.

### Frontend

```
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

Frontend runs at `http://localhost:5173`.

## 2. Set up MongoDB Atlas (free tier)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free M0 cluster (any region close to you).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) — required since
   Render's servers use dynamic IPs.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/crmlite?retryWrites=true&w=majority`
6. Replace `<username>` and `<password>` with your database user's credentials, and use this
   as `MONGO_URI`.

## 3. Deploy the backend (Render, free tier)

1. Push this project to a GitHub repository.
2. Go to https://render.com and sign up / log in.
3. Click **New → Web Service**, connect your GitHub repo.
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables under the **Environment** tab:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string (e.g. generate one with `openssl rand -base64 32`)
   - `PORT` = `5000` (Render sets its own `PORT` automatically, but the app reads `process.env.PORT` either way)
6. Click **Create Web Service**. Once deployed, note the URL, e.g.
   `https://startup-crm-lite-api.onrender.com`.

## 4. Deploy the frontend (Vercel)

1. Go to https://vercel.com and sign up / log in.
2. Click **Add New → Project**, import the same GitHub repo.
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://startup-crm-lite-api.onrender.com/api` (your Render backend URL + `/api`)
5. Click **Deploy**.

Once deployed, your CRM will be live at something like `https://startup-crm-lite.vercel.app`.

## 5. Post-deployment check

1. Visit your Vercel URL → you should see the Login page.
2. Click **Register new profile** and create your first startup account.
3. Add a lead, confirm it shows on the Dashboard, Leads page, and Analytics.
4. Confirm notifications appear when a lead's status changes to Won / Lost / Meeting Scheduled.

## Notes

- Render's free tier spins down after inactivity, so the first request after idle time may take
  10–30 seconds to respond (cold start). This is normal for free hosting.
- If you add team roles later, the multi-tenancy is already isolated by the `owner` field on
  `Lead` and `Notification`, so adding a `TeamMember` model that references the same owner is a
  straightforward extension.
