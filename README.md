# Flatworthy MVP

Monorepo for a real-estate investment marketplace.

## Structure

- `/frontend` — Nuxt 3 SSR app
- `/backend` — NestJS API with Prisma, Redis, BullMQ, Elasticsearch, MinIO
- `/infrastructure/docker-compose.yml` — Postgres, Redis, OpenSearch, MinIO

## Environment

Create `.env` files from examples:

- Backend: `backend/.env.example` → `.env`
- Frontend: `frontend/.env.example` → `.env`

## Dev setup

1) Start infrastructure:

```bash
cd infrastructure
docker compose up -d
```

2) Backend

```bash
cd backend
cp .env.example .env
yarn prisma generate
# set DATABASE_URL to point to docker (postgres://postgres:postgres@localhost:5432/flatworthy)
yarn prisma migrate dev --name init
yarn seed
yarn start:dev
```

Swagger: `http://localhost:3001/api/docs`

3) Frontend

```bash
cd frontend
cp .env.example .env
yarn dev
```

Nuxt dev server: `http://localhost:3000`

## Seeded accounts

- Admin: admin@flatworthy.com / admin

## Roles and capabilities

- USER: browse, favorites, send inquiry
- DEVELOPER: manage own projects/units (SALE allowed), view inquiries
- COMPLEX: manage own projects/units (RENT only), view inquiries
- ADMIN: full CRUD, moderation, role changes

## Acceptance checklist

- Register/login/refresh via cookies
- Admin creates developer org, project, SALE unit
- Complex cannot create SALE units (400)
- Favorites work for USER
- Inquiry from property page reaches org inbox
- Search powered by OpenSearch
- Media uploads via pre-signed URLs (MinIO)
- Redis cache on public GETs with invalidation
