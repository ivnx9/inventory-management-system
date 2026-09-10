# Stocky — Your Friendly Inventory Management System

A simple full-stack Inventory Management System built for the **LLI Developer Exam**.

Stocky allows authorized users to manage products, monitor inventory, view reports, and manage user accounts according to their assigned role.

## Project Overview

Stocky is designed as an internal inventory system for a company.

The application uses:

- **ReactJS** for the frontend
- **Ant Design** for the user interface
- **ExpressJS** for the backend REST API
- **Microsoft SQL Server** for data storage
- **JWT** for authentication and authorization
- **Git & GitHub** for version control

### Architecture

```text
React + Ant Design
        ↓
     REST API
        ↓
     ExpressJS
        ↓
 Microsoft SQL Server
```

## Features

### Authentication

- User login
- JWT-based authentication
- Protected application routes
- Role-based authorization
- Secure password hashing using bcrypt
- Session/token expiration

### Product Management

Authorized administrators can:

- Add products
- View products
- View individual product details
- Edit products
- Delete products
- Track SKU
- Track category
- Track quantity
- Track unit price
- Automatically record creation and update timestamps

### Dashboard

The dashboard displays:

- Total Products
- Total Quantity
- Total Inventory Value

### Inventory Reports

The Reports page provides:

- Inventory summary
- Product-level inventory information
- Quantity
- Unit price
- Inventory value

### User Management

Administrators can:

- View users
- Add users
- Edit usernames
- Change user roles
- Reset user passwords
- Delete users

Administrators cannot delete their own account.

### Account Settings

Every authenticated user can:

- Change their own password
- Verify their current password before changing it
- Confirm the new password

### Responsive Design

The application is designed to work on:

- Desktop
- Tablet
- Mobile devices

Tables support horizontal scrolling on smaller screens.

## User Roles

The system currently supports two roles:

| Role | Access |
|---|---|
| Admin | Full product and user management access |
| Staff | View inventory, dashboard, reports, and change own password |

The `user` role is displayed in the interface as **Staff**.

User Management is hidden from Staff users in the navigation, while the route and backend API are also protected against unauthorized access.

## Technologies

### Frontend

- ReactJS
- Vite
- Ant Design
- Axios
- React Router DOM

### Backend

- Node.js
- ExpressJS
- Microsoft SQL Server
- `mssql`
- JWT
- bcryptjs
- dotenv
- CORS

### Development Tools

- Git
- GitHub
- Visual Studio Code
- SQL Server Management Studio
- SQL Server Configuration Manager

## Requirements

Before running the project, install:

- Node.js
- npm
- Microsoft SQL Server
- SQL Server Management Studio
- Git

The project was developed and tested on Windows.

## Project Structure

```text
inventory-management-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── userRoutes.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── logo.png
│   │   │   └── mascot.png
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── README.md
└── .gitignore
```

## Database Setup

The application uses Microsoft SQL Server.

Create a database named:

```sql
InventoryDB
```

Then create the required tables.

### Users Table

```sql
USE InventoryDB;
GO

CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL DEFAULT 'user',
    created_at DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO
```

### Products Table

```sql
CREATE TABLE Products (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    sku NVARCHAR(50) NOT NULL UNIQUE,
    category NVARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO
```

## Backend Configuration

Create a `.env` file inside the `backend` folder.

Example:

```env
DB_SERVER=localhost
DB_DATABASE=InventoryDB
DB_USER=sa
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_ENCRYPT=true
DB_TRUST_SERVER_CERT=true
JWT_SECRET=YOUR_JWT_SECRET
```

Replace the placeholder values with the credentials for the local SQL Server installation.

**Do not commit `.env` or real credentials to GitHub.**

The project uses environment variables so database credentials and the JWT secret are not hard-coded into the application.

## Install Dependencies

Open a terminal in the project folder.

### Backend

```bash
cd backend
npm install
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

## Run the Application

The backend and frontend should be started separately.

### 1. Start the Backend

```bash
cd backend
node src/server.js
```

A successful startup should display messages similar to:

```text
Database connected successfully.
Server running on http://localhost:5000
```

### 2. Start the Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Vite will display the local frontend address, normally:

```text
http://localhost:5173
```

Open that address in a browser.

## SQL Server TCP/IP Configuration

If the backend cannot connect to SQL Server through `localhost:1433`, make sure TCP/IP is enabled in **SQL Server Configuration Manager**.

The SQL Server TCP/IP configuration should use port:

```text
1433
```

After changing the TCP/IP configuration, restart the SQL Server service.

This was an important setup requirement during development.

## Test Account

The development environment includes an administrator account used for testing.

```text
Username: admin
Password: admin123
Role: admin
```

This is a **development/test account only**. Do not use this password in a production deployment.

If setting up a completely new database, create an administrator account using the application's user-management/authentication setup with a properly generated password hash rather than storing a plain-text password in the database.

## REST API

The backend exposes the following REST endpoints.

### Health Check

```http
GET /api/health
```

### Authentication

```http
POST /api/auth/login
```

Example request:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Product example:

```json
{
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "category": "Accessories",
  "quantity": 25,
  "unit_price": 499.00
}
```

### Users

Admin-only endpoints:

```http
GET    /api/users
POST   /api/users
PUT    /api/users/:id
PUT    /api/users/:id/password
DELETE /api/users/:id
```

Authenticated user endpoint:

```http
PUT /api/users/me/password
```

## API Authentication

Protected endpoints require a JWT access token.

Use the following HTTP header:

```http
Authorization: Bearer YOUR_TOKEN
```

The frontend automatically attaches the token to API requests after login.

## API Testing

The REST API can be tested using tools such as:

- Postman
- Insomnia
- The included frontend interface

### Example Product Request

```http
POST http://localhost:5000/api/products
```

Headers:

```text
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

Body:

```json
{
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "category": "Accessories",
  "quantity": 25,
  "unit_price": 499.00
}
```

Expected result:

```text
HTTP 201 Created
```

## Application Testing Checklist

### Login

1. Start SQL Server.
2. Start the backend.
3. Start the frontend.
4. Open the frontend in a browser.
5. Log in using a valid account.
6. Confirm that the user is redirected to the dashboard.

### Product CRUD

1. Open **Products**.
2. Create a product.
3. Confirm it appears in the table.
4. Edit the product.
5. Confirm the changes are saved.
6. Delete the product.
7. Confirm it is removed.

### Reports

1. Open **Reports**.
2. Confirm inventory information is displayed.
3. Add or modify a product.
4. Return to Reports.
5. Confirm the inventory information reflects the updated data.

### User Management

Using an Admin account:

1. Open **User Management**.
2. Create a Staff user.
3. Edit the user.
4. Reset the user's password.
5. Confirm the Staff user cannot access User Management.
6. Delete the Staff user.

### Password Management

1. Open **Settings**.
2. Enter the current password.
3. Enter a new password.
4. Confirm the new password.
5. Save the change.
6. Log in again using the new password.

## Security

The application implements several basic security practices:

- Passwords are stored as bcrypt hashes.
- Passwords are never returned by the user API.
- JWT authentication protects private API routes.
- Role-based authorization protects administrator functions.
- SQL queries use parameterized inputs.
- Database credentials are stored in environment variables.
- `.env` should not be committed to Git.
- Users cannot delete their own account through the admin interface.
- Staff users are prevented from accessing admin-only routes.

## Challenges Encountered

### SQL Server Connection

During development, the Express backend initially could not connect to SQL Server through `localhost:1433`.

The issue was caused by TCP/IP being disabled in SQL Server Configuration Manager.

The solution was:

1. Open SQL Server Configuration Manager.
2. Enable TCP/IP for the SQL Server instance.
3. Configure the TCP port.
4. Restart the SQL Server service.
5. Restart the Express backend.

### Route Ordering

The self-service password endpoint initially matched the dynamic route:

```text
/users/:id/password
```

instead of:

```text
/users/me/password
```

The problem was solved by placing the `/me/password` route before the dynamic `/:id/password` route.

### Responsive Tables

Inventory and user tables contain multiple columns and can become too wide on mobile devices.

Horizontal table scrolling was added so the table remains usable on smaller screens without breaking the overall page layout.

### Role-Based Access

User Management required protection at multiple levels.

The application therefore:

1. Hides the User Management menu from Staff.
2. Protects the frontend route.
3. Protects the backend API with authentication and role authorization.

This prevents relying only on frontend visibility for security.

## Git Development

The project was developed using Git with feature-oriented commits.

Actual commit history includes:

```text
8c329f3 chore: initialize project
e9dc374 feat: implement product CRUD
fc1f990 feat: implement authentication and authorization
65a647e feat: build product management interface
3f95d54 style: fix responsive full width layout
83763cd feat: add inventory report
9c1946a feat: add Stocky branding and application layout
c9d9373 feat: redesign login page with Stocky mascot
d17442e feat: add user password management
6f88d8b fix: improve responsive layout
```

The repository uses the `main` branch and is hosted on GitHub.

## Repository

GitHub repository:

**https://github.com/ivnx9/inventory-management-system**

## Exam Requirement Checklist

| Requirement | Status |
|---|---|
| ReactJS | Complete |
| Ant Design | Complete |
| ExpressJS | Complete |
| Microsoft SQL Server | Complete |
| RESTful API | Complete |
| Git & GitHub | Complete |
| Login | Complete |
| CRUD | Complete |
| Simple Report | Complete |
| Role-based authorization | Complete |
| Responsive interface | Complete |
| README documentation | Complete |

## Author

**Ivan Abueg**

Stocky was developed as a simple full-stack inventory management system demonstrating frontend development, backend API development, database integration, authentication, authorization, CRUD operations, reporting, responsive UI design, and Git-based development.
