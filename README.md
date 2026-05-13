# SkillVault AI LMS

SkillVault is an AI-powered LMS SaaS platform with secure authentication, instructor dashboards, AI learning tools, Stripe and Razorpay payments, Cloudinary media uploads, and course progress tracking.

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI components, React Query, Zustand, React Hook Form, Zod, Framer Motion, Lucide, Sonner, next-themes
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Services: Cloudinary, Stripe, Razorpay, Resend SMTP, OpenAI API
- Security: HTTP-only JWT cookies, RBAC, Helmet, rate limiting, XSS sanitization, HPP protection, Zod validation

## Features

- Student dashboard with purchased courses and progress sync
- Instructor dashboard with course creation, lecture upload, analytics, earnings, and course management
- Admin console for users, courses, payments, and platform analytics
- Course listing, course details, curriculum, checkout, and learning player
- Stripe checkout and Razorpay order verification
- AI assistant, notes generator, quiz generator, and roadmap generator
- Cloudinary thumbnails and video uploads
- Production-friendly logging with Winston

## Project Structure

```txt
.
├── controllers/
├── middleware/
├── models/
├── routes/
├── schemas/
├── utils/
└── frontend/
    └── src/
        ├── app/
        ├── components/
        ├── providers/
        ├── services/
        ├── store/
        ├── schemas/
        └── types/
```

## Local Development

Install backend dependencies:

```bash
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Create `.env` from `env.example`, then create `frontend/.env.local` from `frontend/.env.local.example`.

Run the backend:

```bash
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Default URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- API base: `http://localhost:8000/api/v1`

## API Areas

- Auth and profile: `/api/v1/user`
- Courses and lectures: `/api/v1/course`
- Stripe purchases: `/api/v1/purchase`
- Razorpay payments: `/api/v1/razorpay`
- Course progress: `/api/v1/progress`
- AI features: `/api/v1/ai`
- Admin analytics: `/api/v1/admin`
- Health check: `/health`

## Positioning

SkillVault is positioned as an AI-powered LMS SaaS platform with secure authentication, instructor dashboards, AI learning assistant, AI-generated quizzes and notes, Stripe and Razorpay integration, and real-time course progress tracking.
