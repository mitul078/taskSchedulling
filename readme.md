# 🗓️ TaskFlow — Role-Based Task Scheduling & Management System

> A production-grade, role-based task scheduling REST API built with **Node.js**, **Express 5**, and **MongoDB**. Designed to manage tasks across organizations with a clear hierarchy of **Admin → Manager → Employee**.

---

## 📌 What We Built

**TaskFlow** is a backend system that enables organizations to **create, assign, track, and manage tasks** using a role-based access control (RBAC) model. The system enforces a clear hierarchy:

| Role       | Capabilities                                                                 |
|------------|-----------------------------------------------------------------------------|
| **Admin**  | Promote/demote users, view all users by role, view all tasks by status       |
| **Manager**| Create tasks and assign them to employees, delete tasks                       |
| **Employee**| View their own assigned tasks, update task status (in-progress ↔ completed) |

### 🔑 Core Features

- **🔐 Authentication** — Secure signup/login with bcrypt password hashing and JWT tokens stored in HTTP-only cookies
- **🛡️ Role-Based Access Control (RBAC)** — Three-tier roles (`admin`, `manager`, `employee`) enforced at both route and middleware level
- **📝 Task CRUD** — Full task lifecycle: create → assign → track → update status → delete
- **📊 Paginated Listings** — Admin endpoints support pagination (`page`, `limit` query params) for users and tasks
- **✅ Input Validation** — Request body validation with `express-validator` for signup/signin (email format, password strength, username rules)
- **⚡ Rate Limiting** — Global API rate limiter (5 requests per 10 seconds) to prevent abuse
- **🍪 Secure Cookie Auth** — JWT stored in `httpOnly` + `secure` cookies, not exposed to client-side JavaScript

---

## 🏗️ Tech Stack

| Technology          | Purpose                          |
|---------------------|----------------------------------|
| **Node.js**         | Runtime environment              |
| **Express 5**       | Web framework                    |
| **MongoDB**         | NoSQL database                   |
| **Mongoose 9**      | ODM for MongoDB                  |
| **bcryptjs**        | Password hashing                 |
| **jsonwebtoken**    | JWT token generation & verification |
| **cookie-parser**   | Parse cookies from requests      |
| **express-validator**| Request body validation          |
| **express-rate-limit**| API rate limiting               |
| **dotenv**          | Environment variable management  |

---

## 📁 Project Structure

```
taskScheduling/
└── server/
    ├── server.js                          # Entry point — connects DB & starts server
    ├── package.json                       # Dependencies & scripts
    ├── .env                               # Environment variables (MONGO_URI, JWT_SECRET, PORT)
    ├── .gitignore                         # Ignores .env & node_modules
    └── src/
        ├── app.js                         # Express app setup, middleware, route mounting
        ├── config/
        │   └── db.js                      # MongoDB connection via Mongoose
        ├── middleware/
        │   ├── auth.middleware.js          # JWT token verification from cookies
        │   ├── role.middleware.js          # Role-based access guard (dynamic roles)
        │   └── validator.middleware.js     # Signup/Signin input validators
        └── modules/
            ├── auth/
            │   ├── auth.model.js           # User schema (name, username, email, password, role)
            │   ├── auth.controller.js      # Register & Login logic
            │   └── auth.route.js           # POST /signup, POST /signin
            ├── task/
            │   ├── task.model.js           # Task schema (createdBy, assigned, title, desc, status, dueDate)
            │   ├── task.controller.js      # Create, Delete, Get, UpdateStatus logic
            │   └── task.route.js           # Task CRUD routes (role-protected)
            └── admin/
                ├── admin.controller.js     # Update role, list users, list tasks (paginated)
                └── admin.route.js          # Admin-only endpoints
```

---

## 🔌 API Endpoints

### Auth — `/api/v1/auth`
| Method | Endpoint     | Description                  | Auth | Validation        |
|--------|-------------|------------------------------|------|-------------------|
| POST   | `/signup`    | Register a new user          | ❌   | signupValidator   |
| POST   | `/signin`    | Login and receive JWT cookie | ❌   | signinValidator   |

### Task — `/api/v1/task`
| Method | Endpoint     | Description                            | Auth | Role       |
|--------|-------------|----------------------------------------|------|------------|
| POST   | `/:id`       | Create & assign task to employee (`:id` = employee ID) | ✅ | Manager    |
| DELETE | `/:id`       | Delete a task (`:id` = task ID)        | ✅   | Admin, Manager |
| GET    | `/`          | Get own assigned in-progress tasks     | ✅   | Employee   |
| PATCH  | `/:id`       | Update task status (`:id` = task ID)   | ✅   | Employee   |

### Admin — `/api/v1/admin`
| Method | Endpoint           | Description                                   | Auth | Role  |
|--------|--------------------|-----------------------------------------------|------|-------|
| PATCH  | `/role/:id`        | Update a user's role (`:id` = user ID)         | ✅   | Admin |
| GET    | `/users/:role`     | List users by role (paginated)                 | ✅   | Admin |
| GET    | `/tasks/:status`   | List tasks by status (paginated)               | ✅   | Admin |

> **Pagination:** Use `?page=1&limit=10` query parameters on admin list endpoints.

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** instance (local or cloud — e.g., MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/taskScheduling.git
cd taskScheduling/server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskScheduling
JWT_SECRET=your_super_secret_key_here
```

### 4. Start the server
```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

---

## 🔐 Data Models

### User Schema
```javascript
{
  name:     String   (required),
  username: String   (required, unique, indexed),
  email:    String   (required, unique, indexed),
  password: String   (required, bcrypt hashed),
  role:     String   (enum: ["admin", "manager", "employee"], default: "employee"),
  createdAt, updatedAt  // auto-generated timestamps
}
```

### Task Schema
```javascript
{
  createdBy:   ObjectId  (ref: User, required — who created the task),
  assigned:    ObjectId  (ref: User, required — who the task is assigned to),
  title:       String    (required),
  description: String    (required),
  status:      String    (enum: ["completed", "in-progress"], default: "in-progress"),
  dueDate:     Date,
  createdAt, updatedAt   // auto-generated timestamps
}
```

---

## 🔒 Security Features

| Feature                | Implementation                                                    |
|------------------------|------------------------------------------------------------------|
| Password Hashing       | bcrypt with 10 salt rounds                                       |
| JWT Auth               | Stored in `httpOnly`, `secure` cookies (7-day expiry)             |
| Rate Limiting          | 5 requests per 10-second window                                  |
| Input Validation       | Strong email, password (uppercase + lowercase + number + `@`), username (3-10 chars, alphanumeric + underscore) |
| Role Enforcement       | Dynamic middleware that checks `req.user.role` against allowedRoles |
| Duplicate Prevention   | User registration checks for existing username OR email           |

---

---

# 🚀 How to Make This UNIQUE & Conceptually Different (To Stand Out & Earn)

> Below are **concrete, innovative ideas** that will transform this project from a "typical CRUD app" into a **portfolio-worthy, potentially monetizable** product.

---

## 🧠 Level 1 — Smart Differentiators (Medium Effort, High Impact)

### 1. **AI-Powered Task Prioritization Engine**
- Integrate **OpenAI / Gemini API** to auto-prioritize tasks based on description, deadlines, and workload
- Auto-suggest which employee should get the task based on their current workload & completion rate
- **Why it's unique:** No simple task manager does intelligent assignment

### 2. **Real-Time Collaboration with WebSockets**
- Add **Socket.IO** for live task updates — when a manager creates a task, the employee sees it instantly
- Live dashboard showing who's working on what right now
- **Why it's unique:** Moves from polling to real-time, like Trello/Asana feel

### 3. **Automated Task Scheduling with Cron Jobs**
- Use **node-cron** or **Agenda.js** to:
  - Auto-create recurring tasks (daily standups, weekly reports)
  - Send deadline reminders before due dates
  - Auto-escalate overdue tasks to the manager
- **Why it's unique:** True "scheduling" — not just task assignment

### 4. **Employee Performance Analytics Dashboard**
- Track metrics per employee:
  - Average task completion time
  - On-time vs. overdue ratio
  - Task completion streaks
- Generate weekly/monthly performance reports
- **Why it's unique:** Turns a task manager into a **performance management tool**

---

## 🔥 Level 2 — Conceptual Game-Changers (Higher Effort, Massive Impact)

### 5. **Gamification System**
- Award **XP points** for completing tasks on time
- Leaderboard system across teams
- Badges: "Streak Master", "Early Finisher", "Reliability King"
- Penalty system for overdue tasks
- **Why it's unique:** Proven to increase engagement by 40%+ (Duolingo, Habitica model)

### 6. **Multi-Tenant / Organization Support**
- Allow multiple companies to use the same platform
- Each organization has its own isolated data (users, tasks)
- Organization-level settings, branding
- **Why it's unique:** Transforms from a project into a **SaaS product** you can sell

### 7. **Smart Workload Balancer**
- Algorithm that calculates each employee's current workload score
- When a manager creates a task, the system suggests the least-loaded employee
- Visual workload heat map
- **Why it's unique:** Solves a real problem — unfair task distribution

### 8. **Kanban Board + Drag & Drop (Frontend)**
- Build a React/Next.js frontend with a **Kanban-style board**
- Drag tasks between columns: `To-Do → In Progress → Review → Done`
- Add more granular statuses beyond just `in-progress` and `completed`
- **Why it's unique:** Visual task management is what users expect in 2026

---

## 💰 Level 3 — Monetization-Ready Features

### 9. **Time Tracking & Timesheets**
- Employees can start/stop a timer on each task
- Auto-generate timesheets per employee per week
- Export timesheets as PDF/CSV for payroll
- **Why it's unique:** Directly ties into payroll — companies will pay for this

### 10. **Integration Layer**
- **Slack/Discord Bot** — Get task notifications in your team's chat
- **Email Notifications** (Nodemailer / SendGrid) — Deadline reminders, assignment alerts
- **Calendar Sync** (Google Calendar API) — Tasks appear on employee calendars
- **Webhook System** — Allow external tools to trigger on task events
- **Why it's unique:** Makes your tool the central hub, not an isolated silo

### 11. **Audit Log & Activity Trail**
- Log every action: who assigned what, when status changed, who deleted what
- Immutable activity feed per task
- Admin can audit any user's complete action history
- **Why it's unique:** Enterprise-grade accountability — required by serious companies

### 12. **Custom Workflows & Approval Chains**
- Let admins define custom task statuses and approval flows
  - Example: `Created → Assigned → In Progress → Under Review → Manager Approved → Completed`
- Multi-level approvals for critical tasks
- **Why it's unique:** Transforms static tasks into dynamic business processes

---

## 🛠️ Technical Improvements to Add

| Improvement                    | Why It Matters                                      |
|-------------------------------|-----------------------------------------------------|
| **Add a Logout endpoint**     | Currently no way to clear the auth cookie            |
| **Refresh Token mechanism**   | More secure than single long-lived JWT               |
| **CORS configuration**       | Required when you add a frontend                     |
| **Error handling middleware** | Centralized error handling instead of per-controller  |
| **Swagger/OpenAPI docs**      | Auto-generated API documentation                     |
| **Unit & Integration tests**  | Jest + Supertest for reliability                     |
| **Docker support**            | One-command deployment with Docker Compose            |
| **CI/CD Pipeline**            | GitHub Actions for auto-deploy                       |
| **Task file attachments**     | Upload files/images to tasks (Multer + Cloudinary)    |
| **Search & filter tasks**     | Full-text search, filter by date range, assigned user |
| **Soft delete**               | Mark tasks as deleted instead of permanently removing |

---

## 🎯 Recommended Roadmap (Pick Your Path)

### 🏃 Quick Win Path (1-2 weeks)
1. Add Logout endpoint + Refresh tokens
2. Add Email notifications (Nodemailer)
3. Add Swagger API docs
4. Add more task statuses (`pending`, `in-review`, `blocked`)
5. Build a simple React frontend

### 🚀 Standout Portfolio Path (3-4 weeks)
1. Everything in Quick Win +
2. Real-time updates with Socket.IO
3. Kanban board frontend (React + DnD)
4. Employee performance analytics
5. Gamification (XP + badges)

### 💰 SaaS / Monetization Path (6-8 weeks)
1. Everything in Standout +
2. Multi-tenant organization support
3. AI task prioritization
4. Time tracking + timesheets
5. Slack/Calendar integrations
6. Custom workflows

---

## 👨‍💻 Author

Built with ❤️ as a learning project in **Role-Based Access Control**, **RESTful API Design**, and **Enterprise Task Management**.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
