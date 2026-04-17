# 🔗 JugaadLink — Shrink. Track. Dominate.

> The modern link intelligence platform. Shorten URLs, track real-time analytics, protect links, and visualize global traffic — all in one premium dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Ant Design](https://img.shields.io/badge/Ant_Design-6-0170FE?logo=antdesign)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **⚡ Instant URL Shortening** | Paste a URL, get a clean short link in < 200ms |
| **📊 Real-time Analytics** | Clicks, devices, browsers, OS, referrers — all in one view |
| **🗺️ Geographic Heatmap** | Interactive world map showing click distribution by country |
| **🔒 Password Protection** | Lock sensitive links behind a password with a dedicated unlock page |
| **📱 QR Code Generation** | One-click QR code for any shortened link |
| **🏷️ Tags & Categories** | Organize links with custom tags, categories, and notes |
| **⏱️ Auto-Expiry** | Set time-based or click-based expiration on any link |
| **⚙️ Link Activation** | Toggle links on/off — deactivated links show a friendly disabled page |
| **🌗 Dark/Light Mode** | Full theme system with glassmorphic dark mode |
| **🚀 Success Popup** | Instant copy + stats access after shortening — no page navigation needed |
| **🔍 SEO Optimized** | Full Open Graph, Twitter Cards, robots.txt, and semantic HTML |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Custom CSS Design System + Ant Design 6 |
| **Data Fetching** | TanStack React Query v5 |
| **Charts** | Recharts |
| **World Map** | react-simple-maps + world-atlas TopoJSON |
| **Icons** | Lucide React |
| **QR Codes** | qrcode.react |
| **Backend** | Go + Gin + GORM + PostgreSQL + Redis |

---

## 📁 Project Structure

```
url-shortener-fe/
├── app/
│   ├── components/
│   │   ├── common/          # Design system (Button, Card, Modal, Map...)
│   │   ├── Dashboard/       # Main shortener + analytics dashboard
│   │   ├── LandingPage/     # Public landing page
│   │   └── Navbar/          # Top navigation
│   ├── constants/           # All UI strings (centralized)
│   ├── Services/            # API client, hooks, and service functions
│   ├── types/               # TypeScript declarations
│   ├── dashboard/           # /dashboard route
│   ├── login/               # /login route
│   ├── signup/              # /signup route
│   ├── password/[code]/     # Password entry for protected links
│   ├── link-disabled/       # Disabled/expired link page
│   ├── layout.tsx           # Root layout with SEO metadata
│   └── globals.css          # Design tokens & global styles
├── public/
│   └── robots.txt           # SEO crawler directives
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.0
- **npm** / yarn / pnpm
- Backend server running on `http://localhost:8080`

### Installation

```bash
# Clone
git clone https://github.com/your-username/jugaadlink.git
cd jugaadlink/url-shortener-fe

# Install
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |

---

## 🔍 SEO

JugaadLink ships with production-grade SEO out of the box:

- **Open Graph** tags for social sharing (Facebook, LinkedIn, WhatsApp)
- **Twitter Cards** (large image summary)
- **robots.txt** — allows public pages, blocks dashboard/API
- **Canonical URLs**
- **Structured metadata** via Next.js Metadata API
- **Theme color** + Apple Web App meta

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📝 License

MIT © JugaadLink Team
