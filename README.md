# Portfolio Backend System

A complete Node.js backend system for the Mohamed Adel Portfolio website, featuring user authentication, admin panel API, MongoDB database integration, and Vercel serverless deployment.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier available)
- Vercel account (for deployment)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
copy .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
# MongoDB (get from MongoDB Atlas)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your-64-char-secret
JWT_REFRESH_SECRET=your-other-64-char-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary (optional, for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📁 Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── auth/              # Authentication endpoints
│   ├── projects/          # Projects CRUD
│   ├── skills/            # Skills CRUD
│   ├── experiences/       # Experiences CRUD
│   ├── general/           # General settings
│   ├── messages/          # Contact messages
│   └── upload/            # Image upload
├── server/
│   ├── lib/               # Utilities (db, email)
│   ├── middleware/        # Auth, validation
│   └── models/            # Mongoose models
├── admin/                 # Admin panel
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── forgot-password.html
│   ├── admin.html         # Main admin panel
│   ├── admin.js           # Admin logic (API integrated)
│   └── api-service.js     # API client library
└── vercel.json            # Vercel configuration
```

## 🔐 Authentication

- **Registration**: First user becomes admin automatically
- **Email Verification**: Required before login
- **JWT Tokens**: 15-minute access token + 7-day refresh token
- **Password Reset**: Email-based recovery

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login |
| `/api/auth/verify` | GET | Verify email |
| `/api/auth/forgot-password` | POST | Request reset |
| `/api/auth/reset-password` | POST | Reset password |
| `/api/auth/refresh` | POST | Refresh token |
| `/api/auth/me` | GET | Get current user |

## 📊 CRUD APIs

### Projects
- `GET /api/projects` - List all (public)
- `POST /api/projects` - Create (admin)
- `GET /api/projects/:id` - Get one (public)
- `PUT /api/projects/:id` - Update (admin)
- `DELETE /api/projects/:id` - Delete (admin)

### Skills
- `GET /api/skills` - List all (public)
- `POST /api/skills` - Create (admin)
- `PUT /api/skills/:id` - Update (admin)
- `DELETE /api/skills/:id` - Delete (admin)

### Experiences
- `GET /api/experiences` - List all (public)
- `POST /api/experiences` - Create (admin)
- `PUT /api/experiences/:id` - Update (admin)
- `DELETE /api/experiences/:id` - Delete (admin)

### General Settings
- `GET /api/general` - Get settings (public)
- `PUT /api/general` - Update settings (admin)

### Messages (Contact Form)
- `GET /api/messages` - List all (admin)
- `POST /api/messages` - Submit message (public)
- `PUT /api/messages/:id` - Mark read/replied (admin)
- `DELETE /api/messages/:id` - Delete (admin)

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod
```

### Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

1. Add `MONGODB_URI`
2. Add `JWT_SECRET`
3. Add `JWT_REFRESH_SECRET`
4. Add `FRONTEND_URL` (your Vercel URL)
5. Add email settings if using password reset

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Rate limiting on auth endpoints
- Input validation and sanitization
- Security headers (X-Frame-Options, XSS Protection)
- Email enumeration prevention

## 📧 Email Setup

### Gmail App Password

1. Enable 2-Factor Authentication on your Google Account
2. Go to Security → App passwords
3. Generate a new app password for "Mail"
4. Use this password in `SMTP_PASS`

### Alternative: SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

## 🖼️ Image Upload

Images are uploaded to Cloudinary (optional). Without Cloudinary configured, images are stored as base64.

### Cloudinary Setup

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Get cloud name, API key, and secret
3. Add to environment variables

## 📝 License

MIT License

## 👤 Author

Mohamed Adel - Flutter Developer
