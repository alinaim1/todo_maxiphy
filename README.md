## ToDoList API Project Overview

This project is a full-featured backend for a ToDo List application built with NestJS, TypeScript, Prisma ORM, and PostgreSQL.

### Main Features

- **User Authentication:**  
  - JWT-based login and signup  
  - Password hashing with bcrypt  
  - AuthGuard for protected routes

- **User Management:**  
  - Create, update, delete users  
  - Unique email validation  
  - Secure password storage

- **Todo Management:**  
  - CRUD operations for todos  
  - Each todo linked to a user  
  - Fields: title, description, priority, date, completed, createdAt

- **Filtering & Pagination:**  
  - Filter todos by title, description, date, completed, priority  
  - Paginated results for efficient data loading

- **Validation & Error Handling:**  
  - DTO validation with class-validator  
  - Custom error responses (409 for duplicate email, 404 for not found, 500 for server errors)

- **Prisma ORM:**  
  - PostgreSQL database integration  
  - Schema-driven models for User and Todo  
  - Automatic migrations and type-safe queries

### How to Run

1. **Install dependencies:**  
   ```bash
   npm install
   ```

2. **Configure environment:**  
   - Set your `DATABASE_URL` in `.env` for PostgreSQL

3. **Generate Prisma Client:**  
   ```bash
   npx prisma generate
   ```

4. **Run migrations (if needed):**  
   ```bash
   npx prisma migrate dev
   ```

5. **Start the server:**  
   ```bash
   npm run start:dev
   ```

### API Endpoints

- `POST /users/signup` — Register new user
- `POST /users/login` — Login and receive JWT
- `GET /todos/list` — Get todos (supports filters & pagination)
- `POST /todos` — Create todo
- `PUT /todos/update` — Update todo
- `DELETE /todos/delete` — Delete todo

### Technologies Used

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- ESLint & Prettier

---

**This backend demonstrates production-ready patterns for authentication, validation, error handling, and scalable API design.**