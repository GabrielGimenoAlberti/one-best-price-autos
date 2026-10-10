# One Best Price Autos

A full-stack web application for an independent used-car dealership: a fast, mobile-friendly inventory site for customers and a private admin dashboard for the dealer.

**Live site:** https://onebestpriceautos.com

## Features

**For customers**
- Browse available vehicles with filters (make, body type, fuel type, price, year, mileage), sorting, and pagination
- Filters live in the URL, so any search can be bookmarked or shared
- Vehicle detail pages with a photo gallery (arrows, swipe, keyboard navigation), specs, and features
- Contact form on every vehicle page, plus a general inquiry form for when nothing in stock fits
- Optional customer accounts (register, log in, log out)
- Responsive design with a glass-style UI, built mobile-first

**For the dealer (admin only)**
- Add, edit, and delete vehicles, and set status (available, pending, sold)
- Upload and remove photos, with image resizing handled on upload
- Inquiry inbox with new/handled states, plus email alerts when a message arrives
- Handled inquiries are deleted automatically after 90 days to limit stored personal data

**SEO and performance**
- Server-rendered pages with per-vehicle titles and descriptions
- Dynamic `sitemap.xml` and `robots.txt`
- Optimized, lazy-loaded images served from a CDN

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Images | Cloudinary, Multer |
| Validation | Zod |
| Email | Resend |
| Hosting | Netlify (frontend), Render (API), Porkbun (domain and DNS) |

## Architecture

```
Browser
  ├─► onebestpriceautos.com       Next.js frontend (Netlify)
  └─► api.onebestpriceautos.com   Express API (Render)
                                    ├─► MongoDB Atlas  (data)
                                    ├─► Cloudinary     (photos)
                                    └─► Resend         (email alerts)
```

The frontend and API share a parent domain so the login cookie works across both.

## Security

- Passwords hashed with bcrypt; the hash is excluded from queries by default
- JWT stored in an `httpOnly`, `sameSite` cookie, so scripts in the browser cannot read it
- Role-based access control: all `/api/admin/*` routes require an authenticated admin, checked against the database on every request
- Public registration can only create customer accounts; admins are created by a server-side script
- Every request body and query string is validated with Zod (strict schemas reject unexpected fields), which also blocks NoSQL operator injection
- Rate limiting on login, registration, and the inquiry form
- `helmet` security headers and an explicit CORS allowlist
- Secrets live only in environment variables and are never committed

## Project structure

```
one-best-price-autos/
├── client/                 Next.js app
│   ├── app/                Pages (home, inventory, admin, login, legal)
│   ├── components/         UI components
│   └── lib/                API helpers
└── server/                 Express API
    └── src/
        ├── config/         Database and Cloudinary setup
        ├── controllers/    Request handling
        ├── middleware/     Auth, uploads
        ├── models/         Mongoose schemas (Vehicle, User, Inquiry)
        ├── routes/         URL definitions
        └── utils/          Seed, admin creation, email
```

## Running locally

**Requirements:** Node.js (current LTS), a free MongoDB Atlas cluster, and a free Cloudinary account.

```bash
git clone https://github.com/GabrielGimenoAlberti/one-best-price-autos.git
cd one-best-price-autos
```

**Backend**

```bash
cd server
npm install
cp .env.example .env     # then fill in the values (see below)
npm run dev              # http://localhost:5001
```

**Frontend** (in a second terminal)

```bash
cd client
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5001/api" > .env.local
npm run dev              # http://localhost:3000
```

On macOS, port 5000 is taken by AirPlay Receiver, which is why the API uses 5001.

### Environment variables

**`server/.env`**

| Variable | Purpose |
|---|---|
| `PORT` | API port (5001 locally) |
| `MONGO_URI` | MongoDB Atlas connection string, including the database name |
| `JWT_SECRET` | Long random string used to sign login tokens |
| `CLIENT_URL` | Frontend origin allowed by CORS, with no trailing slash |
| `NODE_ENV` | `production` on the live server |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image storage |
| `RESEND_API_KEY`, `NOTIFY_EMAIL`, `MAIL_FROM` | Optional inquiry email alerts |

Generate a `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**`client/.env.local`**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the API, ending in `/api` |

### Useful scripts (run from `server/`)

| Command | What it does |
|---|---|
| `npm run dev` | Start the API with file watching |
| `npm run seed` | Load sample vehicles. **Deletes all existing vehicles**, so use it on a development database only |
| `npm run create-admin` | Create or update an admin from `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` set in the shell or `.env`. Remove them afterward |

## API overview

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/vehicles` | Public. Filter, sort, and paginate available vehicles |
| GET | `/api/vehicles/:id` | Public |
| POST | `/api/inquiries` | Public, rate limited |
| POST | `/api/auth/register`, `/login`, `/logout` | Public |
| GET | `/api/auth/me` | Logged in |
| GET, POST, PUT, DELETE | `/api/admin/vehicles` | Admin |
| POST, DELETE | `/api/admin/vehicles/:id/images` | Admin |
| GET, PUT, DELETE | `/api/admin/inquiries` | Admin |

## Deployment

- **API:** Render web service, root directory `server`, deployed from `main`
- **Frontend:** Netlify, base directory `client`, deployed from `main`
- **Workflow:** feature branches merge into `dev` by pull request, and `dev` merges into `main` for releases

## Roadmap

- Saved vehicles for customer accounts
- Dedicated "sold" page for old links
- Dealer management system inventory sync
- Online deposits and credit applications
- Error monitoring and automated tests

## License

Copyright (c) One Best Price Autos. All rights reserved. This repository is published for portfolio viewing and may not be copied or reused without permission.