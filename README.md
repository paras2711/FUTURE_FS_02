# Client Lead Management System (Mini CRM)

A responsive, modern full-stack CRM dashboard designed for administrative users to organize and track client leads generated from website contact forms.

---

## 🚀 Key Features

* **Sleek SaaS Dashboard**: Modern dark sidebar and card layout with responsive grids.
* **Lead Analytics**: CSS progress funnel charts indicating conversions and top referral channels.
* **Leads Database Grid**: Detailed lead records supporting:
  * Case-insensitive search by client name.
  * Filter matches by status stage (`New`, `Contacted`, `Converted`).
  * Inline status adjustments (makes dynamic PATCH requests).
  * Hover note previews with detailed modals.
  * Delete validations prompting safety check overlays.
* **JWT Admin Auth**: Password validation secured using JWT tokens and bcrypt.js.
* **Flexible Seeding**: Complete data seeder to immediately populate test records.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, React Router DOM (v6), Axios, Custom Vanilla CSS
* **Backend**: Node.js, Express.js
* **Database**: MongoDB with Mongoose Schemas
* **Hosting**: Configured for Vercel Multi-Service deployments

---

## 📁 Repository Structure

```text
mini-crm/
├── api/
│   └── index.js (Vercel serverless entry)
├── backend/
│   ├── config/ (Mongoose database helpers)
│   ├── controllers/ (Auth and Lead endpoints logic)
│   ├── middleware/ (JWT protection layer)
│   ├── models/ (Admin and Lead Mongoose Schemas)
│   ├── routes/ (Express router mappings)
│   ├── .env (Backend configuration variables)
│   ├── package.json (Backend dependencies)
│   ├── server.js (Express app orchestrator)
│   └── seed.js (Database seeding handler)
├── frontend/
│   ├── src/
│   │   ├── components/ (Navbar, Sidebar, StatsCard)
│   │   ├── context/ (Auth and Toast state providers)
│   │   ├── pages/ (Login, Dashboard, LeadsList, AddLead, EditLead, Analytics)
│   │   ├── App.jsx
│   │   ├── index.css (SaaS design tokens and scrollbars)
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json (Frontend dependencies)
│   └── vite.config.js (Vite API proxy setups)
├── vercel.json (Vercel Multi-Service config)
└── README.md
```

---

## 💻 Local Setup Instructions

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) running locally.

### 2. Configure Backend Environment
Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini-crm
JWT_SECRET=super_secret_crm_key_123_abc
```

### 3. Setup and Run the Database Seeder
Navigate to the `backend/` folder, install modules, and run the seeding script:
```bash
cd backend
npm install
npm run seed
```
*This seeds a default administrator user: `admin@crm.com` / `admin123` along with 5 mock leads.*

### 4. Run Servers in Development Mode

**Start Backend API (Port 5000)**:
```bash
# In the backend directory
npm run dev
```

**Start Frontend Client (Port 3000)**:
```bash
cd ../frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to view the application.

---

## ☁️ Deployment (Vercel)

This repository includes a root-level `vercel.json` designed for Vercel's **Multi-Service** deployments:

1. Create a repository on GitHub and upload the files.
2. Link the repository to your Vercel Account.
3. In **Vercel Settings -> Environment Variables**, add your production secrets:
   * `MONGO_URI`: Your MongoDB Atlas connection string.
   * `JWT_SECRET`: A secure hash key of your choice.
4. Deploy the project. Vercel will automatically compile the frontend Vite package and route API requests through the backend service.
