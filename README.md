# E-Commerce Web Application

A full-stack online store built with a React storefront and an Express API. It includes product listing, login, role-based access, cart flow, checkout, and order tracking.

## Features

- Product catalog with pricing, categories, and stock info
- Add-to-cart and checkout flow
- User login and registration
- Role-based admin access for inventory and order management
- Backend APIs for products, auth, and orders
- MongoDB-ready configuration with in-memory fallback for local demos

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB-ready Mongoose models with fallback demo data
- Authentication: JWT

## Local Setup

1. Install dependencies:
   npm install
   npm install --prefix server
   npm install --prefix client

2. Start the database (optional if you want MongoDB-backed persistence):
   docker compose up -d

3. Launch the app:
   npm run dev

4. Open the storefront:
   http://localhost:5173

5. API endpoint:
   http://localhost:5000/api

## GitHub Pages deployment

The storefront is configured for static hosting on GitHub Pages by using a relative base path and hash-based routing, which avoids SPA route issues on Pages.

To deploy the frontend automatically:

1. Push the project to GitHub.
2. In the repository settings, enable GitHub Pages with the "GitHub Actions" source.
3. The workflow in .github/workflows/deploy-pages.yml will build and deploy the Vite app.

> Note: the Express backend is not hosted on GitHub Pages, so the API still needs to run locally or on a separate Node host for full e-commerce functionality.

## Demo Accounts

- Admin: admin@shop.com / admin123
- Customer: user@shop.com / user123

## Environment Variables

Create a .env file in the server folder with values like:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=change_this_secret

If MONGO_URI is not set, the app runs with built-in mock store data so the project can still be tested locally without a database service.

## Project Scripts

- Root: npm run dev — runs both frontend and backend together
- Server: npm test --prefix server
- Client: npm run build --prefix client

## Notes

This project is designed as a learning app for building a practical e-commerce system with real-world flows, including product management and order tracking.
