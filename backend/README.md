# CollegeKampus Backend

Production-ready Node.js/Express/PostgreSQL/Prisma backend for the CollegeKampus college discovery platform — matches the uploaded Next.js frontend (search, filters, sort, pagination, save, compare) and implements the full original spec (auth, reviews, applications, admin, recommendations).

## Tech Stack
Node.js · Express · PostgreSQL · Prisma ORM · JWT (access + refresh) · Redis caching · Cloudinary uploads · Swagger/OpenAPI · Docker

## 1. Local Setup (without Docker)

```bash
cd backend
cp .env.example .env        # fill in DATABASE_URL, JWT secrets, Cloudinary keys
npm install

# Start Postgres & Redis locally (or use docker compose just for these):
docker compose up -d db redis

npx prisma migrate dev --name init
npm run seed                 # loads sample colleges, exams, courses, admin/student users
npm run dev                  # http://localhost:4000
```

Swagger docs: `http://localhost:4000/api-docs`
Health check: `GET /health`

Seeded accounts:
- Admin: `admin@collegekampus.com` / `Admin@12345`
- Student: `student@collegekampus.com` / `Student@12345`

## 2. Full Docker Setup

```bash
cp .env.example .env
docker compose up --build
```
This brings up the API, Postgres, and Redis. Migrations run automatically on container start (`prisma migrate deploy`). Run the seed once the stack is up:
```bash
docker exec -it college-kampus-api npm run seed
```

## 3. Project Structure

```
src/
 ├── controllers/   # request/response handling only
 ├── routes/        # express routers + swagger jsdoc annotations
 ├── services/      # business logic, prisma queries, caching
 ├── middleware/     # auth, error handling, validation, rate limiting, upload
 ├── validations/    # zod schemas per resource
 ├── config/         # env, db (prisma client), redis, cloudinary, swagger
 ├── utils/          # logger, ApiError, jwt, slugify, apiResponse
 └── app.js
prisma/
 ├── schema.prisma
 └── seed.js
server.js
```

## 4. API Overview

All routes are prefixed with `/api`. Full interactive docs at `/api-docs`.

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me` |
| Colleges | `GET /colleges` (search/filter/sort/paginate), `GET /colleges/:id`, `GET /colleges/trending`, `GET /colleges/compare?ids=a,b`, `GET /colleges/recommendations`, `POST/PUT/DELETE /colleges` (admin) |
| Courses | `GET /courses`, `GET /courses/:id`, `POST /courses` (admin) |
| Exams | `GET /exams`, `GET /exams/:id`, `POST /exams` (admin) |
| Reviews | `POST /reviews`, `GET /reviews/:collegeId`, `DELETE /reviews/:id` |
| Saved | `POST /saved`, `DELETE /saved/:collegeId`, `GET /saved` |
| Applications | `POST /applications`, `GET /applications`, `PUT /applications/:id` |
| Search | `GET /search?q=`, `GET /search/popular` |
| Admin | `GET /admin/users`, `GET /admin/analytics`, `GET /admin/colleges` |
| Upload | `POST /upload/image` (admin, Cloudinary) |

### Colleges list query params (maps to frontend filter sidebar)
`q, stream, state, city, type, maxFees, minFees, minRating, course, sort(ranking|rating|fees-low|fees-high|popular|newest), page, pageSize`

`stream`, `state`, `type` accept comma-separated multi-values (matches the multi-select checkboxes in `filter-sidebar.tsx`).

## 5. Security
- bcrypt password hashing (12 rounds)
- JWT access (7d) + refresh (30d) tokens
- helmet, CORS allow-list, rate limiting (global + stricter on auth)
- Zod input validation on every mutating route
- Prisma parameterized queries (SQL injection safe by default)
- Role-based authorization middleware (`STUDENT` / `ADMIN`)

## 6. Performance
- Redis caching on college list/detail/trending/search (60s–10min TTLs, invalidated on writes)
- Database indexes on state, city, stream, type, rating, ranking, fees, featured
- Pagination on every list endpoint
- gzip compression middleware

## 7. Deployment Guide (example: Railway/Render/EC2 + managed Postgres/Redis)

1. Provision a managed PostgreSQL instance and Redis instance (e.g. Railway, Supabase, Upstash, ElastiCache).
2. Set environment variables from `.env.example` in your hosting provider's dashboard — never commit `.env`.
3. Build & push the Docker image:
   ```bash
   docker build -t collegekampus-api .
   docker push <registry>/collegekampus-api
   ```
4. On the host, run migrations once before first traffic:
   ```bash
   npx prisma migrate deploy
   ```
   (already wired into the Dockerfile's `CMD`).
5. Point your frontend's API base URL to the deployed backend, and set `CORS_ORIGIN` to your frontend's deployed domain.
6. Put the API behind a reverse proxy/load balancer (e.g. Nginx, Render's built-in proxy) for TLS termination.
7. Configure log shipping for `logs/combined.log` / `logs/error.log` (Winston) to your observability stack (e.g. Datadog, CloudWatch).
8. Set up a scheduled job or Cloudinary auto-backup for uploaded images if needed.

## 8. Postman
Import `postman_collection.json`. Set the `baseUrl`, `accessToken` (from login), and `collegeId` collection variables.
