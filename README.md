# EduPerks

**Verified Student Discounts Platform for Nepal**

EduPerks is a student discount verification platform built specifically for Nepal, inspired by platforms like Student Beans and UNiDAYS. It enables verified students to access exclusive discounts while allowing merchants to safely offer student-only deals using OCR-based identity verification and robust fraud prevention.

---

## Problem Statement

In Nepal, students represent a massive yet underserved consumer segment:

- **No digital way to prove student status** — Students lack a standardized, verifiable digital identity
- **Students pay full price** — Missing out on potential savings for essentials like food, tech, software, and educational resources
- **Merchants fear fraud** — Without verification tools, businesses hesitate to offer student discounts
- **Global platforms don't work here** — Services like Student Beans and UNiDAYS don't support Nepalese institutions

**Result:** Millions in potential savings and merchant revenue are lost every year.

---

## Our Solution

EduPerks transforms a student ID into a trusted digital credential, connecting students with verified discounts and helping merchants reach a valuable demographic safely.

### What EduPerks Provides

- **OCR-based student ID verification** — Automated identity document processing
- **Institutional email verification** — .edu.np domain authentication
- **One-time coupon system** — Fraud-proof redemption (one coupon per student per offer)
- **Merchant analytics dashboard** — Track performance and student engagement
- **Fraud prevention** — Multi-layered security with admin moderation
- **Merchant onboarding** — Admin-approved business verification

---

## Platform Workflow

### Student Journey
```
Register → Upload Student ID → OCR Verification → 
Email Confirmation → Account Activated → Browse Offers → 
Generate Coupon → Redirect to Merchant → Purchase
```

### Merchant Journey
```
Register → Upload Business Documents → Admin Review → 
Approval → Dashboard Access → Create Offers → View Analytics
```

### Admin Journey
```
Login → Review Applications → Approve/Reject → 
Monitor Analytics → Handle Reports → Manage Users
```

---

## System Architecture

```
┌─────────────────────────────────────┐
│   Frontend (Next.js + TypeScript)   │
│        Tailwind CSS Styling         │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│     API Layer (Next.js App Router)  │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Authentication (JWT + Role-Based)  │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│     OCR Service (Tesseract.js)      │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   Database (PostgreSQL + Prisma)    │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│ Email Service (Verification & Notif)│
└─────────────────────────────────────┘
```

---

## Student Verification Methodology

### OCR-Based ID Verification

1. **Image Preprocessing** — Quality checks and enhancement
2. **Text Extraction** — Handles rotated and horizontal text
3. **Key Data Extraction:**
   - Student name
   - Institution name
   - Program/degree
   - Validity/expiry date
   - Citizenship number
4. **Validation** — Cross-reference with recognized institutions database
5. **Expiry Enforcement** — Automatic account deactivation for expired IDs
6. **Duplicate Prevention** — Block multiple accounts from same ID

### Email Verification

- Token-based confirmation system
- `.edu.np` domain whitelist
- Expiration handling (24-hour token validity)
- Resend verification support

---

## Security & Fraud Prevention

- **One redemption per student per offer** — Database-level constraint enforcement
- **JWT-based authentication** — Secure session management
- **Role-based access control** — Student / Merchant / Admin permissions
- **API rate limiting** — Prevent abuse and brute-force attacks
- **Secure file uploads** — Type validation and size limits
- **Encrypted data** — At rest and in transit
- **Admin-controlled merchant onboarding** — Manual verification before approval

---

## Business Model

### Revenue Streams

1. **Commission Model** — 5–10% on verified purchases through the platform
2. **Merchant Subscriptions** — Tier-based monthly plans (Basic, Pro, Enterprise)
3. **Featured Listings** — Paid premium placement for merchant offers
4. **Advanced Analytics** — Paid insights and reporting for merchants
5. **Transaction Fees** — Per-coupon redemption fee
6. **University Partnerships** — White-label solutions and licensing
7. **Data Insights** — Aggregated, anonymized reports for market research

### Competitive Advantages

- **First mover in Nepal** — No direct competitors
- **Automated OCR verification** — Scalable and efficient
- **Fraud-proof redemption** — Technical safeguards prevent abuse
- **Localized for Nepal** — Built for Nepalese institutions and merchants

---

## Tech Stack

### Frontend
- **Next.js** (App Router)
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling

### Backend
- **Next.js API Routes** — Serverless backend
- **JWT Authentication** — Secure token-based auth
- **Role-Based Access Control** — Granular permissions

### Database
- **PostgreSQL** — Relational database
- **Prisma ORM** — Type-safe database client

### Services
- **Tesseract.js** — OCR text extraction
- **Email Service** — SMTP/API-based verification emails
- **Secure File Uploads** — Validated and sanitized

---

## Database Schema (High-Level)

**Core Models:**
- `User` — Authentication and role management
- `StudentProfile` — Student-specific data and verification status
- `MerchantProfile` — Business information and approval status
- `Offer` — Discount offers created by merchants
- `Coupon` — Generated coupons for students
- `Redemption` — Track coupon usage (ensures one-time use)
- `Analytics` — Platform metrics and insights
- `VerificationLogs` — Audit trail for verifications

---

## Implementation Roadmap

### Phase 1 — MVP (Current)
- Student authentication & OCR verification
- Merchant onboarding with admin approval
- Basic offer creation & redemption system

### Phase 2 — Pilot
- Partner with 3-5 universities in Kathmandu
- Onboard 20-30 local merchants
- Improve OCR accuracy based on feedback
- Enhanced analytics dashboard

### Phase 3 — Scale
- National rollout to all major universities
- Mobile app development (iOS & Android)
- Advanced merchant insights and recommendations
- Explore expansion to other South Asian markets

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/eduperks.git
cd eduperks

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/eduperks
JWT_SECRET=your_secure_jwt_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

### Recommended Stack
- **Hosting:** Vercel (optimized for Next.js)
- **Database:** Supabase / Neon / Railway (managed PostgreSQL)
- **Environment Variables:** Configure in deployment platform
- **Domain:** Custom domain with SSL

### Deployment Steps

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy --prod
```

---

## Why EduPerks?

### Innovation
- First OCR-based student verification system in Nepal
- Automated, scalable, and accurate identity verification

### Business Viability
- Multiple revenue streams ensure sustainability
- Clear path to profitability with a growing user base

### Social Impact
- Increases affordability for students
- Helps local merchants reach a valuable demographic
- Reduces fraud in the student discount ecosystem

### Scalability
- Built on modern, scalable tech stack
- Ready for national expansion and future international markets

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For questions, partnerships, or support:

- **Email:** eduperks.dev@gmail.com


---

**Built with ❤️ for students by students.**

*Empowering students, enabling merchants, transforming education commerce.*
