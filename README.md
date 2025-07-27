# Crypto Tracker

A full-stack cryptocurrency tracker built with Next.js, Express, and MongoDB.

## Features

- User authentication (signup, login)
- Dashboard with profile settings
- Fetches live cryptocurrency data from CoinGecko API
- Responsive UI with Tailwind CSS and shadcn/ui components
- Dark/light theme support

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS, shadcn/ui, lucide-react
- Backend: Express.js, Node.js, MongoDB, Mongoose
- API: CoinGecko

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm or npm
- MongoDB instance

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/rahul-sharma143/vr-Automations.git
   cd vr-Automations
   ```

2. Install dependencies:
# For Frontend:
   ```sh
   cd client
   pnpm install
   # or
   npm install
   ```
  # For Backend:
 ```sh
   cd server

   pnpm install
   # or
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.local.example` to `.env.local` and fill in the required values (MongoDB URI, JWT secret, etc).

4. Start the development servers:

   - For the frontend (Next.js):
    cd client

     ```sh
     pnpm dev
     # or
     npm run dev
     ```

   - For the backend (Express):
    cd server

     ```sh
     node ./index.js
     ```

## Project Structure

- `/client` - Next.js app directory (frontend)
- `/server` - Express backend (API, routes, models)

## Scripts

See [`package.json`](package.json) for available scripts:

- `dev` - Start Next.js development server
- `build` - Build the Next.js app
- `start` - Start the production server
- `dev:serve` - Start the backend server

## License

MIT

---

> Powered by [Next.js](https://nextjs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [shadcn/ui](https://ui.shadcn.com/)

## Cron Job: Hourly Coin Sync

This project uses a cron job to **automatically sync cryptocurrency data every hour** using the `node-cron` package.

### 🔧 How It Works
```
The cron job is defined in [`cron.js`](./cron.js):

The job runs at the start of every hour (0 * * * *)

It calls the syncCoins() function, which fetches the latest crypto data and updates the database

In index.js, the cron job is started after MongoDB connects and the server starts.
```

5. Deployment:

## frontend url = https://vr-automations.vercel.app

## backend url = https://vr-automations.onrender.com