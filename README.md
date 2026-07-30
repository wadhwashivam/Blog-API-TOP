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

Each folder has its own `package.json` and runs independently. Neither client ever touches Prisma directly — both talk to `api/` exclusively over HTTP.

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
| ORM | Prisma |
| Auth | Passport.js (`passport-local` + `passport-jwt`), `jsonwebtoken` |
| Password hashing | bcryptjs |
| Validation | express-validator |
| Front-ends | Vanilla HTML/CSS/JS (no framework, no build step) |
| Cross-origin requests | `cors` |

## Getting started

### Prerequisites

- Node.js (v22+ recommended)
- A PostgreSQL database (local or hosted)

### 1. Clone and install each app

```bash
git clone <repo-url>
cd node-blog-api

cd api && npm install && cd ..
cd client-public && npm install && cd ..
cd client-admin && npm install && cd ..
```

### 2. Configure the API's environment

Create `api/.env`:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
NODE_PORT=3000
JWT_SECRET=<a long, random string>
```

### 3. Set up the database

```bash
cd api
npx prisma generate
npx prisma migrate dev
```

### 4. Point the front-ends at your API

In both `client-public/js/config.js` and `client-admin/js/config.js`:

```js
const API_BASE_URL = "http://localhost:3000";
```

### 5. Run all three apps (three separate terminals)

```bash
# Terminal 1 — API
cd api && node --watch app.js

# Terminal 2 — public site
cd client-public && npx serve -p 5500

# Terminal 3 — admin site
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

## Design decisions worth knowing

A few intentional simplifications, made deliberately rather than by accident — worth remembering if this project is revisited or extended:

- **No admin role.** Any registered user could technically log into `client-admin` and author posts, since the `User` model has no `isAdmin`/`role` field. Acceptable for a single-author project where only the author knows `client-admin`'s credentials and URL — would need to be fixed before any real public deployment with multiple users.
- **Comment deletion has no ownership restriction.** `DELETE /api/comments/:id` allows any logged-in user to delete any comment, to support moderation from `client-admin` without a separate admin-only route.
- **Comments require a real user account** — no anonymous/guest commenting with just a name/email.
- **JWTs are stateless** — no session table, no server-side logout. "Logging out" just means the client discards its stored token.

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