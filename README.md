# TutorHub — Smart Tutor-Student Platform

A full-stack web app that connects students with tutors. Tutors create profiles and publish availability; students browse, view open slots, and book sessions — with double-booking prevented at the database level.

**Stack:** React (Vite) · Tailwind CSS · Node.js · Express · MongoDB · JWT

![Status](https://img.shields.io/badge/status-MVP-6366f1)
![Node](https://img.shields.io/badge/node-%3E%3D18-43853d)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Auth & Roles](#auth--roles)
- [Booking Logic](#booking-logic)
- [Frontend Pages](#frontend-pages)
- [Testing the API](#testing-the-api)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

---

## Features

- 🔐 **Secure auth** — JWT-based, bcrypt-hashed passwords, role-based access (student / tutor)
- 👤 **Tutor profiles** — headline, bio, subjects, hourly rate, years of experience
- 📅 **Availability slots** — tutors publish start/end times; overlapping slots blocked
- 🎯 **Booking** — students reserve open slots only; double-booking prevented atomically
- ❌ **Cancellation** — either party can cancel; cancelled slots return to the pool
- 🌑 **Premium dark UI** — Tailwind-based, glass cards, gradient accents
- 🧱 **Clean architecture** — controllers, routes, models, validators, middleware separated
- ✅ **Joi validation** + central error handler + protected routes

---

## Architecture

```
┌──────────────────────┐         HTTPS / JSON          ┌──────────────────────┐
│  React (Vite)        │  ───────────────────────────▶ │  Express API         │
│  Tailwind · Router   │                                │  JWT · Joi · CORS    │
│  Axios w/ interceptor│  ◀───────────────────────────  │                      │
└──────────────────────┘          JWT in header         └──────────┬───────────┘
                                                                    │
                                                                    ▼
                                                          ┌──────────────────┐
                                                          │  MongoDB (Atlas) │
                                                          │  Mongoose ODM    │
                                                          └──────────────────┘
```

---

## Project Structure

```
tutor-booking/
├── tutor-booking-server/        # Express API
│   ├── src/
│   │   ├── config/              # DB connection
│   │   ├── controllers/         # Route handlers
│   │   ├── middleware/          # auth, role, validate, error
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # Express routers
│   │   ├── utils/               # ApiError, asyncHandler
│   │   ├── validators/          # Joi schemas
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── client/                      # React (Vite)
    ├── src/
    │   ├── api/                 # Axios + endpoint wrappers
    │   ├── components/          # Reusable UI
    │   ├── context/             # AuthContext
    │   ├── pages/               # Landing, Login, Register, Tutors, ...
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    ├── .env
    └── package.json
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A MongoDB instance (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone and install

```bash
git clone <your-repo-url> tutor-booking
cd tutor-booking
```

### 2. Backend

```bash
cd tutor-booking-server
npm install
cp .env.example .env       # then edit .env with your values
npm run dev
```

Server runs on `http://localhost:5000`. You should see:
```
MongoDB connected
API running on http://localhost:5000
```

### 3. Frontend (in a new terminal)

```bash
cd client
npm install
# create .env with: VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open the URL printed (usually `http://localhost:5173`).

---

## Environment Variables

### `tutor-booking-server/.env`

| Variable | Example | Description |
|---|---|---|
| `PORT` | `5000` | API server port |
| `MONGO_URI` | `mongodb://localhost:27017/tutor_booking` | Mongo connection string |
| `JWT_SECRET` | `a_long_random_string` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

### `client/.env`

| Variable | Example |
|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` |

> ⚠️ After editing `.env`, restart the dev server. Vite does not hot-reload env changes.

---

## API Reference

Base URL: `http://localhost:5000/api`

All protected endpoints require the header:
```
Authorization: Bearer <JWT>
```

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a student or tutor account |
| POST | `/auth/login` | — | Log in, returns JWT |
| GET | `/auth/me` | ✅ | Current user |

**Register body**
```json
{ "name": "Alice", "email": "a@b.com", "password": "minimum8chars", "role": "tutor" }
```

**Login response**
```json
{
  "user": { "_id": "...", "name": "Alice", "email": "a@b.com", "role": "tutor" },
  "token": "eyJhbGciOi..."
}
```

### Tutors

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/tutors` | — | — | List tutors. Query: `?q=algebra&subject=math` |
| GET | `/tutors/:userId` | — | — | Single tutor profile |
| GET | `/tutors/me/profile` | ✅ | tutor | Own profile |
| PUT | `/tutors/me/profile` | ✅ | tutor | Create / update own profile |

### Slots

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/slots` | ✅ | tutor | Add availability |
| GET | `/slots/me` | ✅ | tutor | Own slots |
| DELETE | `/slots/:id` | ✅ | tutor | Cancel an open slot |
| GET | `/slots/tutor/:userId/open` | — | — | List a tutor's open slots |

**Create slot body**
```json
{ "startTime": "2025-12-15T10:00:00Z", "endTime": "2025-12-15T11:00:00Z" }
```

### Bookings

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/bookings` | ✅ | student | Book a slot |
| GET | `/bookings/me/student` | ✅ | student | My bookings |
| GET | `/bookings/me/tutor` | ✅ | tutor | Bookings on my slots |
| PATCH | `/bookings/:id/cancel` | ✅ | owner | Cancel (frees the slot) |

### Error response shape

```json
{ "error": { "message": "Slot is not available", "details": [] } }
```

| Status | Meaning |
|---|---|
| 400 | Validation failed |
| 401 | Missing / invalid token |
| 403 | Wrong role |
| 404 | Resource not found |
| 409 | Conflict (e.g. slot taken, email exists) |
| 500 | Server error |

---

## Data Models

### User
```js
{ name, email (unique), passwordHash, role: "student" | "tutor", timestamps }
```

### TutorProfile
```js
{ user (ref User, unique), headline, bio, subjects: [String],
  hourlyRate, yearsExperience, timestamps }
```

### Slot
```js
{ tutor (ref User), startTime, endTime,
  status: "open" | "booked" | "cancelled",
  bookedBy (ref User), timestamps }
```

### Booking
```js
{ slot (ref Slot, unique), tutor (ref User), student (ref User),
  status: "confirmed" | "cancelled" | "completed", timestamps }
```

---

## Auth & Roles

- Passwords hashed with **bcrypt** (10 rounds).
- JWT signed with `JWT_SECRET`, includes `{ sub: userId, role }`.
- Frontend stores token in `localStorage`; Axios interceptor attaches it automatically.
- `middleware/auth.js` verifies the token and loads `req.user`.
- `middleware/role('tutor' | 'student')` enforces role per route.
- A 401 response on the frontend clears the stored token.

---

## Booking Logic

Double-booking is prevented at **two layers**:

1. **Atomic update** — `createBooking` uses
   ```js
   Slot.findOneAndUpdate(
     { _id, status: 'open', startTime: { $gte: new Date() } },
     { $set: { status: 'booked', bookedBy: userId } },
     { new: true }
   )
   ```
   Two concurrent requests cannot both match the filter.

2. **Unique index** — `Booking.slot` has a `unique: true` index. If the slot update raced through but a duplicate booking insert is attempted, MongoDB rejects it and the controller rolls back the slot.

Cancelling a booking flips its slot back to `open`, making it available again.

Tutors also can't create **overlapping** availability — the controller rejects intersecting time ranges before insert.

---

## Frontend Pages

| Route | Public | Description |
|---|---|---|
| `/` | ✅ | Landing page with hero + features |
| `/login`, `/register` | ✅ | Auth screens with role toggle |
| `/tutors` | ✅ | Browse + search tutors |
| `/tutors/:id` | ✅ | Profile + bookable slots |
| `/student` | student only | Bookings dashboard |
| `/tutor` | tutor only | Profile editor, slot manager, bookings |

State management is intentionally minimal — React Context for auth, local component state for everything else. The Axios layer is the single source for API calls.

---

## Testing the API

The fastest workflow uses **Thunder Client** (VS Code extension) or **Postman**.

Suggested order on a fresh database:
1. Register a tutor → save token
2. PUT `/tutors/me/profile` (tutor token)
3. POST `/slots` (tutor token)
4. Register a student → save token
5. GET `/tutors` (public)
6. GET `/slots/tutor/:userId/open` (public)
7. POST `/bookings` (student token) → expect 201
8. POST `/bookings` with same slot → expect 409 (double-booking guard)

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `MongoDB connection error … IP isn't whitelisted` | Add your IP in Atlas → Network Access |
| Frontend 404 on `/auth/register` | `VITE_API_URL` missing `/api` suffix, or Vite not restarted after editing `.env` |
| CORS error in console | Set `CLIENT_ORIGIN` in server `.env` and restart |
| `Invalid or expired token` | Token aged out; log in again |
| `Slot is not available` | Already booked or in the past — expected behaviour |
| `Email already registered` | Use a different email |
| Vite reports module export not found | Check the file exists and exports use `export const` |

---

## Roadmap

- [ ] Stripe payment integration on booking
- [ ] Ratings & reviews after completed sessions
- [ ] Email notifications (Nodemailer / Resend)
- [ ] Calendar view for slots (FullCalendar)
- [ ] Tutor search filters (price range, experience)
- [ ] Admin dashboard
- [ ] Refresh tokens / token rotation
- [ ] Unit + integration tests (Jest + Supertest)
- [ ] Dockerfile + docker-compose
- [ ] CI/CD (GitHub Actions)

---

## License

MIT © 2025 Your Name
