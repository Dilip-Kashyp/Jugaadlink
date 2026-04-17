# Jugaadlink

A clever, high-performance URL management platform that streamlines your online experience. Jugaadlink transforms complex URLs into short, shareable links while providing deep analytics and a bold Neo-Brutalist aesthetic.

## Table of Contents
* [About](#about)
* [Key Features](#key-features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Scripts](#scripts)

## About
Jugaadlink is built to handle URL management with speed and style. It utilizes Next.js 16 and React 19 to provide a seamless, performant user experience. The application focuses on clarity and utility, designed with a custom Neo-Brutalist theme that stands out from typical SaaS interfaces.

## Key Features
* URL Shortening: Quickly transform long URLs into concise, manageable links.
* Real-time Analytics: Track link performance with metrics for total clicks, active links, and average usage.
* Data Visualization: Interactive charts for traffic forecasting and top-performing links using Recharts.
* QR Code Generation: Built-in QR code support for every short link generated.
* History Tracking: Comprehensive log of all generated links with source and target tracking.
* Social Sharing: One-click sharing capabilities for shortened URLs.
* Responsive Design: Fully optimized for desktop, tablet, and mobile devices.
* Neo-Brutalist UI: A bold, high-contrast design system with full light/dark mode support.

## Tech Stack
* **Framework:** Next.js 16 (App Router)
* **Frontend Library:** React 19
* **Language:** TypeScript
* **Styling:** Custom Neo-Brutalist CSS, Ant Design, Tailwind CSS
* **Data Fetching:** TanStack React Query
* **Analytics & Charts:** Recharts
* **Animations:** GSAP
* **Icons:** Lucide React, Ant Design Icons

## Getting Started

### Prerequisites
* Node.js (Version 18.0 or higher)
* npm, yarn, or pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/url-shortener-fe.git
   ```
2. Navigate to the project directory:
   ```bash
   cd url-shortener-fe
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables
Create a `.env` file in the root directory and configure the following variables if necessary:
* `NEXT_PUBLIC_API_URL`: The base URL for the backend API.

## Scripts
* `npm run dev`: Runs the application in development mode with Turbopack.
* `npm run build`: Creates an optimized production build.
* `npm run start`: Starts the application in production mode.
* `npm run lint`: Checks the code for linting errors.
