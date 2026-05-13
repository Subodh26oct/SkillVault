# SkillVault Frontend — Next.js 15 Learning Experience

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)

This is the client-side application for **SkillVault**, a premium AI-powered LMS platform. Built with **Next.js 15**, it leverages the App Router, Server Components, and modern state management to provide a blazing-fast, responsive user interface.

## 🎨 UI/UX Highlights
- **Premium Aesthetics:** Sleek dark/light mode support with `next-themes`.
- **Glassmorphism:** Modern UI components with subtle blurs and gradients.
- **Micro-Animations:** Smooth transitions and interactions powered by `Framer Motion`.
- **Responsive Design:** Mobile-first approach ensuring compatibility across all devices.

## 🛠️ Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Shadcn/UI
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query (Server/Client sync)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide-React
- **Notifications:** Sonner

## 🏗️ Folder Structure
- `src/app`: Page routes and layouts.
- `src/components`: Reusable UI components.
- `src/providers`: App-wide providers (Theme, Auth, Query).
- `src/services`: API abstraction layer using Axios.
- `src/store`: Client-side state stores (Zustand).

## 🚀 Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment:
   Create `.env.local` based on `.env.local.example`.
3. Start development server:
   ```bash
   npm run dev
   ```

## 🔗 Main Project
For the full-stack architecture, backend documentation, and setup guide, please refer to the [Root README](../README.md).
