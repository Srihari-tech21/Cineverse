# 🎬 CineVerse — Movie & Entertainment Management Platform

[![Vercel Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://cineverse20-plum.vercel.app/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**CineVerse** is a modern, responsive movie management and entertainment discovery portal built with **React 19**, **Vite 7**, and **JSON Server**. It features an editorial cinema aesthetic, real-time watchlist tracking, smart personalized recommendations, interactive reviews, and an administrative dashboard with analytics.

🌐 **Live Demo:** [https://cineverse20-plum.vercel.app](https://cineverse20-plum.vercel.app)  
📦 **Repository:** [https://github.com/Srihari-tech21/Cineverse](https://github.com/Srihari-tech21/Cineverse)

---

## ✨ Features

- **🌟 Cinematic Discovery & Hero Spotlight:** Dynamic showcase of blockbusters, Telugu & Indian cinema classics, trending global favorites, and critically acclaimed films.
- **🔍 Advanced Search & Multi-Filters:** Instant search by title, director, or cast with genre pills and release year filtering.
- **📑 Detailed Movie Insights:** High-resolution backdrops, cast directories, duration, language, genre tags, and community review ratings.
- **📌 Interactive Watchlist & History:** Add or remove movies with one click, mark items as watched, and maintain your personal cinema queue.
- **🎯 Smart Recommendation Engine:** Tailored recommendations matching your favorite genres and watch history.
- **📊 Admin Dashboard & Visual Analytics:** Full CRUD controls for movies, genres, and reviews, accompanied by interactive charts powered by **Recharts**.
- **🌓 Dark / Light Mode:** Sleek glassmorphism theme with instant zero-flash theme switching.
- **🛡️ Resilient Cloud Architecture:** Hybrid data service that operates seamlessly with live REST backends (Render / JSON Server) and automatically falls back to local storage caching for 100% cloud uptime on Vercel.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/) |
| **Routing** | [React Router 7](https://reactrouter.com/) |
| **Styling & UI** | Vanilla CSS (Glassmorphism, CSS Custom Properties, Responsive Grid) |
| **Icons & Visuals** | [Lucide React](https://lucide.dev/) |
| **Data Visualizations** | [Recharts 3](https://recharts.org/) |
| **Backend / API** | [JSON Server](https://github.com/typicode/json-server) + Node.js HTTP Server |
| **Deployment** | [Vercel](https://vercel.com/) (Frontend) & [Render](https://render.com/) (Web Service Backend) |

---

## 📂 Project Structure

```
movies management/
├── public/                     # Static assets, SVG icons, and fallback images
│   ├── assets/
│   │   ├── backdrop-fallback.svg
│   │   └── poster-fallback.svg
│   └── favicon.svg
├── scripts/                    # Image auditing and data maintenance utilities
├── src/
│   ├── assets/                 # Brand assets and illustrations
│   ├── components/             # Reusable UI components (Navbar, MovieCard, Footer, Toast, etc.)
│   ├── context/                # Global contexts (ThemeContext, WatchlistContext)
│   ├── hooks/                  # Custom hooks (useMovies)
│   ├── pages/                  # Page routes (Home, Movies, MovieDetails, Watchlist, Admin, etc.)
│   ├── services/               # Resilient API service layer with local fallback
│   ├── utils/                  # Recommendation algorithms, calculations, and image helpers
│   ├── App.jsx                 # App routing and shell layout
│   ├── index.css               # Global design tokens and responsive typography
│   └── main.jsx                # Application root entry
├── db.json                     # Comprehensive movie catalog & mock database
├── server.cjs                  # Cloud-compatible Node server with dynamic port & CORS
├── vite.config.js              # Vite configuration with React plugin
└── package.json                # Dependencies and deployment scripts
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js** (v18.0 or higher recommended)
- **npm** (v9.0 or higher)

### 1. Clone the repository

```bash
git clone https://github.com/Srihari-tech21/Cineverse.git
cd Cineverse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development environment

You can run both the frontend and the mock API server:

**Terminal 1 — API Server:**
```bash
npm run server
```
*API runs at `http://localhost:3000`.*

**Terminal 2 — Vite Dev Server:**
```bash
npm run dev
```
*Vite dev server starts at `http://localhost:5173`.*

---

## 📦 Build & Production

To generate an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## ☁️ Deployment Guide

### Deploying Frontend to Vercel

1. Import the repository on [Vercel](https://vercel.com/).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. *(Optional)* Set `VITE_API_URL` to your live backend endpoint. If left empty, CineVerse runs in standalone offline-first mode with embedded mock data.

### Deploying Backend to Render

1. Create a **Web Service** on [Render](https://render.com/).
2. Connect your repository: `https://github.com/Srihari-tech21/Cineverse`.
3. Set the configuration:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.cjs` (or `npm start`)
4. Copy your live Render URL (e.g. `https://cineverse-api.onrender.com`) and add it as `VITE_API_URL` in your Vercel project settings.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Srihari-tech21/Cineverse/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
