# Node.js Blog API

A full-stack blog platform built as part of [The Odin Project](https://www.theodinproject.com/) Node.js curriculum — a single REST API backend serving two independent front-ends: a public reader/commenter site and an author's admin dashboard.

## Structure

This is a monorepo — three independently runnable apps, one Git history:

```
.
├── api/              # Express + Prisma REST API (the only app touching the database)
├── client-public/    # Reader-facing site — read posts/comments, comment while logged in
└── client-admin/     # Author-facing site — full post CRUD, comment moderation
```

Each folder has its own `package.json` and runs independently. Neither client ever touches Prisma directly — both talk to `api/` exclusively over HTTP. Only `api` is containerized — the two front-ends are plain static sites with no build step, so they run as local dev servers regardless of whether `api` is running in Docker or natively.

## Features

**API**
- RESTful CRUD for posts and comments
- JWT authentication — `passport-local` verifies credentials at login, `passport-jwt` protects write routes
- Published/unpublished post states
- Cascading deletes (deleting a post removes its comments)

**client-public**
- Browse all published posts
- Read a single post and its comments
- Sign up / log in
- Post a comment (requires a logged-in account)

**client-admin**
- Log in (author-only front door — no signup page)
- View all posts, published and unpublished, clearly labeled
- Create new posts, with a publish/draft toggle
- Edit existing posts
- Delete posts (comments cascade automatically)
- Moderate comments — delete any comment on any post

## Tech stack

| Layer | Tool |
|---|---|
| Server | Node.js, Express |
| Database | PostgreSQL |
| ORM | Prisma 7 (driver adapters via `@prisma/adapter-pg`, no native query engine binary) |
| Auth | Passport.js (`passport-local` + `passport-jwt`), `jsonwebtoken` |
| Password hashing | bcryptjs |
| Validation | express-validator |
| Front-ends | Vanilla HTML/CSS/JS (no framework, no build step) |
| Styling | Tailwind CSS v4, DaisyUI v5 (both front-ends) |
| Cross-origin requests | `cors` |
| Containerization | Docker, Docker Compose (`api` only) |

## Project structure

```
.
├── api/
│   ├── app.js
│   ├── Dockerfile              # Build instructions for the API container
│   ├── docker-compose.yml      # Orchestrates the api + Postgres containers
│   ├── .dockerignore
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── database/
│   └── prisma/
│       ├── schema.prisma
│       └── migrations/
├── client-public/
│   ├── app.css                 # Tailwind + DaisyUI source
│   ├── output.css              # Compiled CSS (generated, gitignored)
│   ├── js/
│   └── *.html
└── client-admin/
    ├── app.css
    ├── output.css
    ├── js/
    └── *.html
```

## Getting started

### Prerequisites

- Node.js (v22+ recommended)
- Docker Desktop (for the recommended API setup) — or a local PostgreSQL install if running the API manually

### 1. Clone and install each app

```bash
git clone <repo-url>
cd node-blog-api

cd client-public && npm install && cd ..
cd client-admin && npm install && cd ..
```

(`api`'s dependencies install automatically inside the Docker build — skip `npm install` there if using Docker. If running the API manually, see Option B below.)

### 2. Configure the API's environment

Create `api/.env`:

```env
PORT=3000
JWT_SECRET=<a long, random string>
```

If running the API with Docker (Option A below), `DATABASE_URL` is set directly in `docker-compose.yml` and doesn't need to go in `.env`. If running manually (Option B), add `DATABASE_URL` to `.env` pointing at your own Postgres instance.

### 3. Run the API

**Option A: Docker (recommended)**

```bash
cd api
docker compose up --build
```

In a second terminal, run migrations against the containerized database (first time only, or after schema changes):

```bash
cd api
docker compose exec app npx prisma migrate deploy
```

> **Note:** the containerized database starts completely empty. Any user accounts you created while developing locally won't exist here — sign up a fresh account through `client-public` (or `client-admin`, if you seed one manually) before trying to log in.

Everyday commands:
```bash
docker compose up              # start (no rebuild)
docker compose up --build      # start, rebuilding image (use after any code change)
docker compose down            # stop containers, keep data
docker compose down -v         # stop containers AND wipe database data — re-run migrations after this
```

**Option B: Manual (no Docker)**

```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev
node --watch app.js
```

### 4. Point the front-ends at your API

In both `client-public/js/config.js` and `client-admin/js/config.js`:

```js
const API_BASE_URL = "http://localhost:3000";
```

### 5. Build the front-end CSS

In `client-public` and `client-admin` separately:

```bash
npm run css
```

Runs the Tailwind CLI in watch mode, compiling `app.css` → `output.css`. Leave both running in their own terminal tabs while developing.

### 6. Serve both front-ends (two more terminals)

```bash
# Public site
cd client-public && npx serve -p 5500

# Admin site
cd client-admin && npx serve -p 5501
```

Each `client-*` folder needs a `serve.json` to serve correctly:

```json
{
    "cleanUrls": false,
    "rewrites": [
        { "source": "/", "destination": "/index.html" }
    ]
}
```

`cleanUrls: false` is required because the default clean-URL redirect in `serve` strips query strings (`?id=...`), which both `post.html` and `editPost.html` depend on.

Visit `http://localhost:5500` for the public site and `http://localhost:5501` for the admin dashboard.

## Styling

Both front-ends use **Tailwind CSS v4** (utility-first CSS engine) and **DaisyUI v5** (a Tailwind plugin adding semantic component classes like `btn`, `list`, `navbar`) — same approach as the File Uploader project, applied independently in each client folder since there's no shared build/bundler between them.

- Each client has its own `app.css` (source) and `output.css` (compiled, linked directly in each HTML file's `<head>` — no shared partials, since plain HTML has no include mechanism)
- Theme pinned via `data-theme="light"` on each page's `<html>` tag, to stay consistent regardless of the user's OS dark-mode setting
- Elements rendered dynamically via JS (comment lists, post lists) get their DaisyUI/Tailwind classes assigned in JS at creation time (`element.className = "..."`), since there's no static markup for those elements to carry classes in advance

## Design decisions worth knowing

A few intentional simplifications, made deliberately rather than by accident — worth remembering if this project is revisited or extended:

- **No admin role.** Any registered user could technically log into `client-admin` and author posts, since the `User` model has no `isAdmin`/`role` field. Acceptable for a single-author project where only the author knows `client-admin`'s credentials and URL — would need to be fixed before any real public deployment with multiple users.
- **Comment deletion has no ownership restriction.** `DELETE /api/comments/:id` allows any logged-in user to delete any comment, to support moderation from `client-admin` without a separate admin-only route.
- **Comments require a real user account** — no anonymous/guest commenting with just a name/email.
- **JWTs are stateless** — no session table, no server-side logout. "Logging out" just means the client discards its stored token.
- **Only the API is containerized.** The two front-ends are static, buildless HTML/CSS/JS, so they run as plain local dev servers (`npx serve`) rather than being dockerized — there's no real benefit to containerizing something with no dependencies or build process.

## API reference

| Method | Route | Auth required | Description |
|---|---|---|---|
| GET | `/api/posts` | No | List published posts |
| GET | `/api/posts/:id` | No | Get a single published post |
| POST | `/api/posts` | Yes | Create a post |
| PUT | `/api/posts/:id` | Yes | Update a post (partial) |
| DELETE | `/api/posts/:id` | Yes | Delete a post (cascades to its comments) |
| GET | `/api/posts/:id/comments` | No | List a post's comments |
| POST | `/api/posts/:id/comments` | Yes | Add a comment |
| DELETE | `/api/comments/:id` | Yes | Delete any comment |
| GET | `/api/admin/posts` | Yes | List **all** posts, published or not |
| GET | `/api/admin/posts/:id` | Yes | Get any single post, published or not |
| POST | `/signup` | No | Create an account |
| POST | `/login` | No | Log in, returns a JWT |

## License

MIT