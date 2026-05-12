# SkillVault LMS - Backend API

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)

The robust, secure, and highly scalable backend infrastructure for **SkillVault**, a comprehensive Learning Management System (LMS). Built with Node.js, Express, and MongoDB, this API manages everything from user authentication and advanced course progression to dual-payment gateway integration.

## 🚀 Key Features

* **Dual Payment Gateway Integration:** Supports secure checkout sessions via **Stripe** and order generation via **Razorpay**. Includes cryptographic webhook signature verification to prevent fraudulent enrollments.
* **Advanced Progress Tracking:** Granular tracking of video watch time, lecture completion, and automatic calculation of overall course completion percentages via Mongoose pre-save hooks.
* **Secure Authentication & Authorization:** JWT-based authentication with role-based access control (Student, Instructor, Admin). Includes HTTP-only cookies and password reset flows via Resend SMTP.
* **Media Management:** Integrated with **Cloudinary** and Multer for optimized, secure uploading of course thumbnails and lecture videos.
* **Enterprise-Grade Security:** Implements Helmet for HTTP headers, express-rate-limit to prevent brute-force attacks, express-mongo-sanitize against NoSQL injections, and XSS sanitizers.
* **Robust Error Handling:** Custom `AppError` class and centralized `catchAsync` middleware for clean, predictable API error responses.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Payments:** Stripe API & Razorpay SDK
* **Media/Storage:** Cloudinary & Multer
* **Security:** bcryptjs, jsonwebtoken, helmet, cors, express-rate-limit

## 📂 Architecture & Data Models

The database is built on a highly relational NoSQL architecture:
* `User`: Manages authentication credentials, roles, and arrays of enrolled/created courses.
* `Course`: Contains course metadata, pricing, category, and an array of referenced `Lecture` documents.
* `Lecture`: Individual video modules with dedicated Cloudinary public IDs.
* `CoursePurchase`: Tracks transaction states (pending/completed/failed), currency, and methodology (Stripe vs Razorpay).
* `CourseProgress`: Maintains nested arrays tracking the specific watch time and completion status of individual lectures per user.

## ⚙️ Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SkillVault-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory based on the `env.example` file. You will need keys for:
   * MongoDB URI
   * JWT Secret
   * Cloudinary (Name, API Key, API Secret)
   * Resend SMTP Credentials
   * Stripe (Secret Key, Webhook Secret)
   * Razorpay (Key ID, Key Secret)

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:8000`.

## 🌐 API Endpoints Overview

* **Auth:** `/api/v1/user` (Register, Login, Profile, Password Reset)
* **Courses:** `/api/v1/course` (CRUD courses, Search, Publish)
* **Media:** `/api/v1/media` (Cloudinary video/image uploads)
* **Stripe Payments:** `/api/v1/purchase` (Checkout session, Webhook verification)
* **Razorpay Payments:** `/api/v1/razorpay` (Create order, Verify signature)
* **Progress:** `/api/v1/progress` (Update watch time, Mark complete, Reset)

## 👨‍💻 Author

Built by [Subodh-SkillVault] - designed to showcase scalable backend architecture and secure third-party integrations.
