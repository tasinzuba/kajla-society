# Kajla Society

Community society website with full CMS admin panel — events, notices, articles,
member directory, residence directory, facilities, photo/video gallery, service
applications, and contact form.

## Stack

| Layer | Tech |
|---|---|
| **Frontend** | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · react-icons · Tiptap |
| **Backend** | Node.js · Express · TypeScript · Prisma 7 · PostgreSQL (Neon) · JWT auth |
| **Hosting** | Frontend → Vercel · Backend → Render · DB → Neon · Media → local / Cloudinary |

## Structure

```
KAJLA_PROPROPERTY/
├── backend/      Express + Prisma API
├── frontend/     Next.js public site + admin panel
├── DEPLOY.md     Step-by-step production deploy guide
└── README.md
```

## Local development

### Backend
```bash
cd backend
npm install
cp .env.example .env       # then fill in Neon DATABASE_URL & DIRECT_URL
npx prisma migrate dev
npx tsx prisma/seed.ts     # creates default admin
npm run dev                # http://localhost:5000
```

Default admin: `admin@kajla.org` / `admin123`

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev                # http://localhost:3000
```

## Production deploy

See [DEPLOY.md](./DEPLOY.md) for full step-by-step guide.

Short version:
1. Push code to GitHub
2. Deploy backend to **Render** (see `backend/render.yaml`)
3. Deploy frontend to **Vercel** with `NEXT_PUBLIC_API_URL` pointing to Render URL

## Features

**Public site:** Home · About · Member Directory · Residence Directory ·
Facilities · Organizations · Media · Events · Notice · Contact

**Admin panel:** Dashboard with live stats, full CRUD for articles · events ·
notices · pages (Tiptap editor) · committee · residents (with CSV bulk import) ·
facilities · galleries (photo + video albums) · service applications with
approve/reject + email · contact inbox · site settings.

## License

Private — for Kajla Society use.
