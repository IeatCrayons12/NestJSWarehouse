# 🏭 Warehouse App

Full-stack warehouse management system built with:
- **Backend**: NestJS + PostgreSQL (TypeORM) + Google OAuth + JWT
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Dev**: Docker Compose (Postgres + pgAdmin)

---

## 🚀 Quick Start

### 1. Start the database
```bash
docker compose up -d
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # fill in your Google OAuth credentials
npm run migration:run
npm run start:dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Key | Description |
|-----|-------------|
| `DB_HOST` | Postgres host (default: `localhost`) |
| `DB_PORT` | Postgres port (default: `5432`) |
| `DB_USER` | Postgres user |
| `DB_PASSWORD` | Postgres password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | e.g. `http://localhost:3001/auth/google/callback` |
| `FRONTEND_URL` | e.g. `http://localhost:3000` |

### Frontend (`frontend/.env.local`)
| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL e.g. `http://localhost:3001` |

---

## 📁 Project Structure

```
warehouse-app/
├── docker-compose.yml
├── backend/               # NestJS API
│   ├── src/
│   │   ├── auth/          # Google OAuth + JWT
│   │   ├── users/         # User entity + service
│   │   ├── items/         # Warehouse items CRUD
│   │   └── main.ts
│   └── ...
└── frontend/              # Next.js App Router
    ├── app/
    │   ├── (auth)/        # Login page
    │   ├── dashboard/     # Protected pages
    │   │   └── items/     # Items CRUD UI
    │   └── ...
    └── ...
```

---

## 🗺️ API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/auth/google` | Start Google OAuth |
| GET | `/auth/google/callback` | OAuth callback |
| GET | `/auth/me` | Current user (JWT required) |
| GET | `/items` | List all items |
| POST | `/items` | Create item |
| GET | `/items/:id` | Get item by ID |
| PATCH | `/items/:id` | Update item |
| DELETE | `/items/:id` | Delete item |

---

## 🔧 pgAdmin
Visit http://localhost:5050 and login with `admin@admin.com` / `admin`

---

## ☁️ Production Deployment

### Step 1 — Supabase (Database)
1. Go to [supabase.com](https://supabase.com) → New project
2. **Project Settings → Database → Connection string → URI**
3. Copy the URI — looks like:
   `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`
4. Save it as `DATABASE_URL` for Railway

### Step 2 — Railway (Backend)
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Set **Root Directory** to `backend/`
3. Add **Environment Variables** in Railway dashboard:
   ```
   DATABASE_URL         = <Supabase URI>
   JWT_SECRET           = <random strong string>
   GOOGLE_CLIENT_ID     = <Google Cloud Console>
   GOOGLE_CLIENT_SECRET = <Google Cloud Console>
   GOOGLE_CALLBACK_URL  = https://<railway-domain>/auth/google/callback
   FRONTEND_URL         = https://<vercel-domain>
   NODE_ENV             = production
   ```
4. Railway reads `railway.toml` → builds + starts automatically
5. Note your Railway domain (e.g. `your-app.up.railway.app`)

### Step 3 — Google OAuth (update callback)
1. [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → your OAuth client
3. Add to **Authorized redirect URIs**:
   `https://your-app.up.railway.app/auth/google/callback`

### Step 4 — Vercel (Frontend)
1. [vercel.com](https://vercel.com) → New Project → Import repo
2. Set **Root Directory** to `frontend/`
3. Add **Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL = https://your-app.up.railway.app
   ```
4. Deploy — Vercel auto-detects Next.js

### ✅ Final checklist
- [ ] Supabase `DATABASE_URL` copied to Railway
- [ ] Railway deployed, all env vars set
- [ ] Google OAuth callback URL updated with Railway domain
- [ ] Vercel deployed with `NEXT_PUBLIC_API_URL` set
- [ ] Test login end-to-end
