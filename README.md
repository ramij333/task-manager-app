# Task Management App

A full-stack task management system that supports role-based access, real-time notifications, and recurring task logic with a modern UI.

---

## 🛠️ Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ramij333/task-manager-app.git
   cd task-management-app

2. **Install dependencies:**
   ```bash
   npm install
   
3. **Set up environment variables**
   Create a ```.env.local file``` in the root directory with the following:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://task-manager-app-fe6e.onrender.com
   NEXT_TELEMETRY_DISABLED=1

4. **Run the development server:**
   ```bash
   npm run dev

5. **Build and start for production:**
   ```bash
   npm run build
   npm start

---

## 💡 Approach Explanation

This task management system is designed to provide users with a seamless experience for managing and collaborating on tasks. The key features and technologies used are as follows:

### 🔐 Role-Based Access Control (RBAC)

- There are **three types of stakeholders**:
  - **Admin**: Can view all users and assign roles (admin, manager, user).
  - **Manager**: Can assign tasks to users and manage assigned tasks.
  - **Regular User**: Can create, update, and complete their own tasks and receive assigned tasks.
    
---

### 📦 Backend

- **Built with Express.js**.
- **MongoDB** is used as the database.
- **Authentication** is fully handled on both frontend and backend using **JWT tokens and session cookies**.
- **Axios** is used for making and handling API calls between frontend and backend.
- **Recurring task logic** is handled on the backend:
  - Users can set tasks to recur **daily**, **weekly**, or **monthly**.
  - Once a recurring task is marked complete, the backend automatically updates its due date and regenerates it for the next period.
  - Recurring tasks are not active until their next due date, ensuring clean task tracking.

 ---  

### ⚡ Real-Time Notifications

- Implemented with **Socket.IO** for the development environment.
- Notifications are sent in real-time for:
  - Task assignments
  - Updates on assigned tasks
  - When an assignee completes a task, the task creator is notified
- Due to **Render's free hosting limitations**, real-time notifications do **not** work in production, but function correctly in development.

---

### 🔍 Search and Filter

- Users can **search** tasks by title and description.
- Advanced **filter options** include:
  - Priority
  - Status (completed, pending, etc.)
  - Due date

---

### 🎨 Frontend

- Built using **Next.js** with **TypeScript** for type safety.
- **ShadCN/UI** used for building modern, responsive, and accessible UI components.
- **ShadCN React Form + Zod** used for robust client-side form validation.
- **SWR** used for data fetching, caching, and revalidation.

---

### ☁️ Deployment

- **Frontend is hosted on [Vercel](https://vercel.com/)**.
- **Backend is hosted on [Render](https://render.com/)**.

---

### 🧹 Other Features

- Clean codebase with reusable components and global auth context.
- Responsive design with beautiful task cards, toast feedback, and floating action button (FAB) for task creation.
- Route protection and conditional actions based on user roles.
  
---

### ⚠️ Assumptions & Trade-offs

- Offline support was attempted via **next-pwa**, but removed due to caching issues with **Next.js**.
- Real-time notifications are implemented using **Socket.IO**, but currently disabled in production due to limitations in **Render's free hosting plan**.
- Authentication is securely handled on both frontend and backend using **token-based sessions**.
- Search and filter functionalities provide an efficient way to manage and locate tasks.
- While **SWR** is used for automatic data revalidation and to reflect changes without refreshing the page, task updates (e.g., after editing) may take a short moment to appear. Users can either wait briefly or manually reload the page to see immediate changes.

