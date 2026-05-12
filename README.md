# SkillVault LMS - Enterprise-Grade Backend API

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)

An enterprise-ready, highly scalable backend infrastructure for **SkillVault**, a comprehensive E-Learning Platform (LMS). Engineered using Node.js and MongoDB, this RESTful API is designed with performance, data integrity, and security at its core.

It features robust ACID-compliant database transactions, dual-gateway payment processing with cryptographic webhook verification, and automated cloud media management.

## 🚀 Architectural Highlights & Core Features

* **Atomic Database Transactions:** Implements Mongoose `ClientSession` and transactions for payment workflows, ensuring strict atomicity (ACID compliance) and preventing data corruption or orphaned records during course enrollment.
* **Dual Payment Gateway Orchestration:** Seamlessly integrates both **Stripe** and **Razorpay**. Utilizes Express raw body parsing to validate HMAC-SHA256 cryptographic webhook signatures, securing the platform against fraudulent payment events.
* **Role-Based Access Control (RBAC):** Secure authentication and authorization flow utilizing HTTP-only JWT cookies. Enforces strict resource access across `Student`, `Instructor`, and `Admin` roles.
* **Automated Media Processing Pipeline:** Integrates **Multer** and **Cloudinary** for scalable, asynchronous video and image processing, optimizing media delivery for front-end consumption.
* **Advanced State Management:** Leverages Mongoose pre-save hooks and complex aggregation pipelines to track granular user telemetry, including lecture watch-time and overall course completion percentages.
* **Hardened Security & Sanitization:** Secured against OWASP Top 10 vulnerabilities using `helmet` (HTTP headers), `express-rate-limit` (brute-force mitigation), `xss-clean` (Cross-Site Scripting protection), and `express-mongo-sanitize` (NoSQL injection prevention).

## 🛠️ Technology Stack

* **Core:** Node.js, Express.js
* **Database:** MongoDB (Atlas), Mongoose ODM
* **Payment Gateways:** Stripe API, Razorpay API
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Storage / CDN:** Cloudinary, Multer
* **Email Service:** Resend API (SMTP)

## 📂 Data Modeling (NoSQL)

The database relies on a highly optimized, document-based NoSQL architecture utilizing reference pointers for scalability:
* `User`: Manages authentication metadata and arrays of deeply nested subdocuments for course enrollments.
* `Course`: High-level curriculum entity containing metadata, pricing schemas, and normalized references to instructor and lecture entities.
* `Lecture`: Modular content units linked to Cloudinary CDN endpoints.
* `CoursePurchase`: Transactional ledger tracking payment status, intent IDs, and methodology.
* `CourseProgress`: Telemetry model mapping user-specific progression metrics against curriculum structures.

## ⚙️ Local Development & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SkillVault-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file referencing `env.example`. Required keys include:
   * `MONGO_URI` (MongoDB connection string)
   * `JWT_SECRET` (Cryptographic signing key)
   * `CLOUDINARY_*` (Asset management credentials)
   * `STRIPE_*` & `RAZORPAY_*` (API keys and Webhook secrets)

4. **Initialize Server**
   ```bash
   npm run dev
   ```
   The application boots on `http://localhost:8000` and establishes the database connection pool.

## 🌐 API Reference (REST)

* **Identity Access Management:** `/api/v1/user`
* **Curriculum Management:** `/api/v1/course`
* **Asset Uploads:** `/api/v1/media`
* **Stripe Processing:** `/api/v1/purchase`
* **Razorpay Processing:** `/api/v1/razorpay`
* **Telemetry & Progress:** `/api/v1/progress`

## 👨‍💻 Engineering Details

Built by **Subodh-SkillVault** to demonstrate proficiency in scalable, secure, and resilient backend architecture, API-first design principles, and complex third-party system integrations.
