# Production Deploy Guide

This project has **two services**: a Next.js frontend and an Express backend.
We deploy them on different platforms because Vercel's serverless model
doesn't fit a long-running Express server with file uploads.

| Service | Host | Why |
|---|---|---|
| **Frontend** (Next.js) | Vercel | Native Next.js support, fast CDN, free tier |
| **Backend** (Express) | Render | Persistent disk for uploads, supports Express, free tier |
| **Database** | Neon | Serverless Postgres (already in use) |
| **Media (optional)** | Cloudinary | Add later for scaling beyond Render's free disk |

---

## Step 1 — Push to GitHub

```bash
# from project root (KAJLA_PROPROPERTY)
git init
git add .
git commit -m "Initial commit"
gh repo create kajla-society --public --source=. --push
```

Or manually create a repo at github.com/new and follow GitHub's push instructions.

---

## Step 2 — Deploy backend to Render

1. Go to https://render.com and sign in with GitHub
2. Click **New** → **Blueprint**
3. Connect the repo you just pushed
4. Render will detect `backend/render.yaml` and propose the service
5. Click **Apply**
6. On the new service page, set these **environment variables** (the rest auto-fill from render.yaml):
   - `DATABASE_URL` — your Neon **pooled** URL (`...-pooler...`)
   - `DIRECT_URL` — your Neon **direct** URL (without `-pooler`)
   - `CORS_ORIGIN` — your Vercel frontend URL (set after step 3)
   - (Optional) `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` for email notifications
7. After the first deploy, copy the Render URL (e.g. `https://kajla-api.onrender.com`)
8. **Run migrations**: In the Render shell tab, run:
   ```
   npx prisma migrate deploy
   npx tsx prisma/seed.ts
   ```

> ⚠️ Free tier sleeps after 15 min of inactivity. First request after sleep takes ~30s.

---

## Step 3 — Deploy frontend to Vercel

```bash
cd frontend
vercel login          # one-time, only if not already logged in
vercel --prod
```

When prompted:
- **Set up and deploy?** Y
- **Scope** → your account
- **Link to existing project?** N
- **Project name** → `kajla-society` (or anything)
- **Directory** → `./` (you're already inside `frontend/`)
- **Override settings?** N

After first deploy, set environment variables in Vercel dashboard:

```
NEXT_PUBLIC_API_URL = https://kajla-api.onrender.com/api
NEXT_PUBLIC_SITE_NAME = Kajla Society
```

Then redeploy:
```bash
vercel --prod
```

---

## Step 4 — Wire up CORS

Now that you have the Vercel URL:
1. Go back to Render → your service → Environment
2. Set `CORS_ORIGIN` to your Vercel URL (e.g. `https://kajla-society.vercel.app`)
3. Save → Render will redeploy

---

## Step 5 — Verify

1. Open the Vercel URL
2. Browse pages — facilities, events, etc. should load (empty if no data)
3. Visit `/admin/login` and sign in with `admin@kajla.org` / `admin123`
4. Change the admin password from the admin panel (TODO: build this UI; for now
   update directly via DB or run a `bcrypt.hash()` script)

---

## Security checklist after first deploy

- [ ] Rotate the Neon database password (the dev one was shared in chat history)
- [ ] Change the default admin password
- [ ] Generate a fresh `JWT_SECRET` on Render (the `generateValue: true` in
      `render.yaml` does this automatically)
- [ ] Add a custom domain to Vercel (optional)
- [ ] Configure SMTP for email notifications (optional)

---

## Updating the live site

Every push to your `main` (or `master`) branch on GitHub triggers an
automatic redeploy on **both** Vercel and Render.

```bash
git add .
git commit -m "Update X"
git push
```

---

## Notes on file uploads

- On Render's free tier, the persistent disk is 1 GB
- For production scale, switch to Cloudinary or S3 — only the upload route
  in `backend/src/routes/uploads.ts` needs to change
- The frontend already handles arbitrary URLs (via `mediaUrl()` helper)
