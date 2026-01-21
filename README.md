# Portfolio Analytics Platform

A full-stack financial analytics web application that allows users to track investment portfolios, record trades, and view real-time portfolio performance through a clean dashboard.

**Live Demo:** https://portfolio-analytics-rho.vercel.app  
**Backend API:** https://portfolio-analytics-production-5caa.up.railway.app/docs

---

## Overview

This project models how a real investment platform tracks holdings and computes portfolio metrics.

Users can create portfolios, record buy/sell transactions, and view up-to-date portfolio value, allocation, and unrealized gains. The system focuses on **data correctness**, **clean APIs**, and **production-ready deployment**.

The goal of this project was to design and build a realistic SaaS-style application, not just a demo UI.

---

## Features

### Authentication

- User registration and login using JWT
- Protected routes with user-scoped data access
- Authorization enforced at the API level

### Portfolio Management

- Support for multiple portfolios per user
- Ownership checks to prevent cross-user access
- Clean portfolio selection and creation workflow

### Transactions

- Buy and sell transactions with strict validation
- Prevents selling more assets than owned
- Automatic recomputation of holdings after every change

### Analytics

- Real-time portfolio value calculation
- Cost basis and unrealized gain tracking
- Asset allocation visualization
- Clean separation between raw data and computed analytics

### Frontend Dashboard

- SaaS-style layout with reusable components
- Clear loading and error states
- Responsive and consistent UI using Tailwind CSS

---

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Axios
- Recharts

### Backend

- FastAPI
- SQLAlchemy
- Alembic (database migrations)
- PostgreSQL
- JWT authentication

### Infrastructure

- Railway (backend + database)
- Vercel (frontend)
- GitHub monorepo

---

## Architecture

```html
Monorepo  
├── backend  
│ ├── app  
│ │ ├── auth  
│ │ ├── portfolios  
│ │ ├── transactions  
│ │ ├── analytics  
│ │ └── main.py  
│ ├── alembic  
│ └── requirements.txt  
│  
├── frontend  
│ ├── src  
│ │ ├── app  
│ │ ├── components  
│ │ └── lib  
│ └── package.json  
```

The backend is organized by feature, not file type, to keep business logic isolated and easy to extend.

---

## API Highlights

### Authentication

- `POST /auth/register`
- `POST /auth/login`

### Portfolios

- `GET /portfolios`
- `POST /portfolios`

### Transactions

- `POST /transactions`
- `DELETE /transactions/{id}`

### Analytics

- `GET /analytics/portfolios/{id}/summary`
- `GET /analytics/portfolios/{id}/value`

---

## Data Integrity & Validation

The backend enforces correctness at multiple levels:

- Users can only access their own portfolios
- Transactions are validated with Pydantic schemas
- Quantity and price must be positive
- Sell transactions are rejected if insufficient holdings exist
- Portfolio state remains consistent after deletes and updates

These checks happen on the server, not just in the UI.

---

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend 

```bash
cd frontend
npm install
npm run dev
```

## Deployment

- Backend deployed on Railway using Uvicorn and PostgreSQL
- Frontend deployed on Vercel
- Environment variables managed separately for production
- CORS configured to allow only trusted frontend origins

## What This Project Demonstrates

- Full-stack system design
- REST API development and validation
- Secure authentication and authorization
- Financial data modeling and analytics
- Database migrations and schema evolution
- Production deployment and debugging
- UI component design for SaaS dashboards