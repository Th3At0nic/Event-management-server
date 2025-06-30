# 📅 Event Management System – Backend

This is the **backend API** for a full-stack Event Management Web Application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).  
It provides secure user authentication and complete event management features, including adding, viewing, joining, updating, and deleting events.

---

## 🚀 Features

- 🔐 **Custom Authentication System** (No third-party libraries)
- ✅ User Registration & Login
- 🧾 JWT-based Auth with Refresh Tokens
- 📌 Role-less logic: all users can create & join events
- 🗓️ Add, Update, Delete Events
- 📥 Join Events (only once per user)
- 🔍 Search by Title
- 📆 Filter by:
  - Today
  - Current/Last Week
  - Current/Last Month
- 📊 Pagination, Sorting, Field Limiting
- 📦 Structured Modular Codebase with MVC Pattern

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Validation:** Zod
- **Auth:** JWT (Access + Refresh)
- **Language:** TypeScript

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```env

NODE_ENV=development or production
PORT=5000
DATABASE_URL=Your_mongodb_connection_url

BCRYPT_SALT_ROUND=number
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
JWT_ACCESS_EXPIRES_IN=15d
JWT_REFRESH_EXPIRES_IN=90d
CLOUDINARY_CLOUD_NAME=your_secret
CLOUDINARY_API_KEY=your_secret
CLOUDINARY_API_SECRET=your_secret_key

```
## 📫 API Endpoints

| Method | Endpoint                   | Description                  |
|--------|----------------------------|------------------------------|
| POST   | `/api/auth/register`       | Register a new user          |
| POST   | `/api/auth/login`          | Login and get access tokens  |
| POST   | `/api/auth/refresh-token`  | Get new access token         |
| GET    | `/api/events`              | Get all events (search + filter + pagination) |
| POST   | `/api/events`              | Create a new event           |
| PATCH  | `/api/events/:id/join`     | Join an event                |
| PATCH  | `/api/events/:id`          | Update an event              |
| DELETE | `/api/events/:id`          | Delete an event              |
| GET    | `/api/my-events`           | Get events created by the user |

