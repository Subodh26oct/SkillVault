# SkillVault AI — Enterprise-Grade LMS SaaS Platform

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

SkillVault is a high-performance, full-stack Learning Management System (LMS) designed for the modern era. It integrates cutting-edge AI capabilities with robust financial gateways and enterprise security patterns to deliver a premium learning experience for students and a powerful dashboard for instructors.

---

## 🚀 Key Features

### 🤖 AI-Powered Learning Assistant

- **AI Notes Generator:** Automatically synthesize lecture content into structured study notes.
- **Smart Quiz Generator:** Create dynamic assessments based on course material to test student knowledge.
- **Roadmap Generator:** Personalized learning paths generated via Google Gemini for tailored educational journeys.
- **Interactive AI Tutor:** Real-time assistance for students within the learning environment.

### 💳 Financial & Payment Systems

- **Dual Gateway Support:** Seamless integration with **Stripe** (Checkout & Webhooks) and **Razorpay** (Order Verification).
- **Secure Transactions:** Enterprise-grade payment handling with signature verification and idempotent processing.
- **Earnings Analytics:** Detailed revenue tracking and payout summaries for instructors.

### 🎬 Media & Content Delivery

- **High-Performance Streaming:** Optimized video delivery via **Cloudinary** with adaptive bitrate support.
- **Advanced Course Builder:** Drag-and-drop lecture management with thumbnail generation and asset optimization.
- **Interactive Player:** Modern video player with progress persistence and course state sync.

### 🛡️ Security & Architecture

- **RBAC (Role-Based Access Control):** Granular permissions for Admins, Instructors, and Students.
- **Advanced Security:** HTTP-only JWT cookies, Helmet.js headers, rate-limiting, and XSS sanitization.
- **Production Logging:** Robust audit trails and error tracking using **Winston** and **Morgan**.

---

## 🛠️ Tech Stack

| Layer                | Technology                                                                                  |
| :------------------- | :------------------------------------------------------------------------------------------ |
| **Frontend**         | Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Framer Motion                 |
| **Backend**          | Node.js, Express.js, MongoDB (Mongoose)                                                     |
| **State Management** | Zustand, React Query (TanStack)                                                             |
| **Services**         | Cloudinary (Media), Stripe & Razorpay (Payments), Google Gemini (AI Models), Resend (Email) |
| **Developer Tools**  | Winston (Logging), Zod (Validation), ESLint, Prettier                                       |

> > > > > > > 2061c0d (OpenAi migration to Gemini)

---

## 📂 Project Structure

```bash
.
├── controllers/      # Business logic & request handlers
├── middleware/       # Auth guards, security, & validation
├── models/           # Mongoose schemas & data modeling
├── routes/           # API endpoint definitions
├── utils/            # Helper functions (Logger, Cloudinary, AI)
└── frontend/         # Next.js 15 Client application
    ├── src/app/      # App router pages & layouts
    ├── src/components/ # Atomic UI components (Shadcn)
    ├── src/providers/ # Global context & state providers
    └── src/services/ # API client (Axios/React Query)
```

---

## 🏁 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary, Stripe, and Google Gemini API Keys

### 2. Installation

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install
```

### 3. Environment Setup

Create a `.env` in the root and `frontend/.env.local` using the provided templates:

```bash
# Root .env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_key
RAZORPAY_KEY_ID=your_razorpay_id
CLOUDINARY_CLOUD_NAME=your_name
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```

### 4. Running the App

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## 🔒 Security Best Practices

- **Rate Limiting:** Protects against Brute-Force and DoS attacks.
- **XSS Protection:** Sanitizes all incoming data using `express-xss-sanitizer`.
- **HPP:** Prevents HTTP Parameter Pollution.
- **Security Headers:** Implemented via `Helmet` to secure the HTTP response.

---

## 🌟 Roadmap & Future Evolution

SkillVault is a living project. Upcoming features include:

- [ ] **Community Forums:** Real-time discussion boards for student-instructor interaction.
- [ ] **Live Classes:** Integration with Zoom/WebRTC for synchronous learning.
- [ ] **Gamification:** Leaderboards, badges, and XP points to boost engagement.
- [ ] **Mobile App:** Dedicated React Native application for learning on the go.

---

## 🏷️ Keywords & Skills

`MERN Stack` • `Next.js 18` • `TypeScript` • `SaaS Architecture` • `LMS Development` • `AI Integration` • `Gemini API` • `Payment Gateways` • `Stripe` • `Razorpay` • `Cloudinary` • `JWT Auth` • `RBAC` • `Clean Code` • `Scalable Systems` • `Zustand` • `React Query` • `Tailwind CSS` • `RESTful APIs` • `Software Engineering`

---

## 📬 Connect & Collaborate

I'm always looking to improve and expand SkillVault. If you have suggestions or want to collaborate, let's connect!

**Subodh** -(https://github.com/Subodh26oct)
**Project Link:** [https://github.com/Subodh26oct/SkillVault](https://github.com/Subodh26oct/SkillVault)

> _Feel free to star ⭐ this repository if you find it useful!_
