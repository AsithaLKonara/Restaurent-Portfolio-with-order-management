# 🍛 Spice Garden - Modern Sri Lankan Restaurant Management System

A comprehensive, production-ready restaurant management platform built specifically for Sri Lankan restaurants with advanced features including QR code ordering, real-time kitchen management, and local payment integrations.

## 🌟 Features

### 🏗️ **Phase 1: Core Production Upgrade**
- **PostgreSQL Database** with Prisma ORM for type-safe queries
- **NextAuth.js Authentication** with role-based access control
- **Dual Language Support** (English, Sinhala, Tamil)
- **Multiple Payment Methods** (Stripe, PayHere, LANKAQR, Bank Transfer)
- **WebSocket Real-time Updates** for kitchen dashboard
- **Rate Limiting & Security** middleware
- **VAT & Service Charge** support for Sri Lankan tax compliance

### 🚀 **Phase 2: Smart Features for Engagement**
- **QR Code Ordering System** - Customers scan table QR codes to order
- **Enhanced Loyalty Program** with automated rewards and tier progression
- **SMS/WhatsApp Integration** for customer notifications
- **Automated Offers** based on customer behavior (birthday, milestones, win-back)
- **Comprehensive Reservation System** with deposit payments
- **Points Calculation** for various customer activities

### 🎛️ **Phase 3: Admin & Owner Power Tools**
- **Advanced Analytics Dashboard** with sales, inventory, and customer insights
- **Revenue Projections** and peak hours analysis
- **Enhanced Menu Management** with detailed item tracking
- **Profit Margin Calculations** and popularity metrics
- **Inventory Tracking** with low stock alerts
- **Allergen Management** and dietary preferences
- **Preparation Time Tracking** and cost analysis

### 🇱🇰 **Phase 4: Sri Lanka-Optimized Features**
- **POS Integration** with thermal printer support for kitchen & cashier
- **LANKAQR Instant Payment Verification** - detect payment success instantly
- **Local Tax Compliance** (VAT, service charges)
- **Sri Lankan Payment Gateways** (PayHere, LANKAQR)
- **Multi-language Support** (English, Sinhala, Tamil)
- **Local SMS/WhatsApp** integration for customer communications

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS with shadcn/ui components
- **Real-time**: Socket.IO for live updates
- **Payments**: Stripe, PayHere, LANKAQR integration
- **Deployment**: Vercel (Frontend), Railway/Supabase (Backend)
- **Security**: Rate limiting, input validation, encrypted data storage

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or pnpm package manager
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/AsithaLKonara/Restaurent-Portfolio-with-order-management.git
cd Restaurent-Portfolio-with-order-management
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
Copy the example environment file and configure your variables:
```bash
cp env.example .env.local
```

Update `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/spice_garden_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Payment Gateways
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
PAYHERE_MERCHANT_ID="your_payhere_merchant_id"
LANKAQR_MERCHANT_ID="your_lankaqr_merchant_id"

# SMS/WhatsApp
SMS_GATEWAY_API_KEY="your_sms_gateway_key"
WHATSAPP_API_KEY="your_whatsapp_api_key"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_key"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Open Prisma Studio
npx prisma studio
```

### 5. Start Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin dashboard pages
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── menu/                     # Customer menu pages
│   ├── profile/                  # User profile pages
│   ├── reservations/             # Reservation system
│   └── table/                    # QR code table ordering
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   └── language-switcher.tsx    # Multi-language support
├── lib/                         # Utility libraries
│   ├── analytics.ts             # Business analytics
│   ├── auth.ts                  # Authentication config
│   ├── i18n.ts                  # Internationalization
│   ├── loyalty.ts               # Loyalty system
│   ├── payments.ts              # Payment processing
│   ├── pos-integration.ts       # POS & thermal printer
│   ├── prisma.ts                # Database client
│   └── socket.ts                # WebSocket management
├── prisma/                      # Database schema
│   └── schema.prisma           # Prisma schema
└── types/                       # TypeScript type definitions
```

## 🎯 Key Features Explained

### 🔐 **Authentication & Authorization**
- **Role-based Access**: Owner, Manager, Waiter, Kitchen, Customer
- **Social Logins**: Google, Facebook integration
- **JWT Sessions**: Secure session management
- **Password Security**: bcrypt hashing with configurable rounds

### 💳 **Payment System**
- **Multiple Gateways**: Stripe, PayHere, LANKAQR, Bank Transfer
- **Instant Verification**: LANKAQR payment status monitoring
- **Refund Management**: Automated refund processing
- **Tax Compliance**: VAT and service charge calculations

### 📱 **QR Code Ordering**
- **Table QR Codes**: Unique QR codes for each table
- **Mobile-First**: Optimized for mobile ordering
- **Real-time Updates**: Instant order notifications
- **Offline Support**: Works without internet connection

### 📊 **Analytics & Reporting**
- **Sales Analytics**: Revenue trends, top-selling items
- **Customer Insights**: Retention rates, customer lifetime value
- **Inventory Management**: Stock levels, wastage tracking
- **Peak Hours Analysis**: Busy periods and staffing optimization

### 🖨️ **POS Integration**
- **Thermal Printer Support**: ESC/POS commands for receipts
- **Kitchen Tickets**: Automated kitchen order printing
- **Daily Reports**: End-of-day sales summaries
- **Receipt Customization**: Branded receipts with VAT numbers

### 🌍 **Multi-language Support**
- **Three Languages**: English, Sinhala, Tamil
- **Dynamic Translation**: Context-aware translations
- **Language Persistence**: User language preferences
- **Cultural Adaptation**: Sri Lankan cultural elements

## 🔧 Configuration

### Database Configuration
The system uses PostgreSQL with Prisma ORM. Key models include:
- **Users**: Customers, staff, and admin users
- **Restaurants**: Multi-branch support
- **Menu Items**: Complete menu management
- **Orders**: Order processing and tracking
- **Reservations**: Table booking system
- **Reviews**: Customer feedback system

### Payment Gateway Setup
1. **Stripe**: International card payments
2. **PayHere**: Sri Lankan payment gateway
3. **LANKAQR**: QR-based instant payments
4. **Bank Transfer**: Manual payment processing

### SMS/WhatsApp Integration
- **Dialog SMS Gateway**: Sri Lankan SMS provider
- **WhatsApp Business API**: Automated messaging
- **Template Messages**: Pre-approved message templates
- **Opt-out Management**: Customer preference handling

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

### Backend (Railway/Supabase)
1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy API routes
4. Set up WebSocket connections

### Environment Variables for Production
```env
# Production Database
DATABASE_URL="postgresql://prod_user:prod_password@prod_host:5432/prod_db"

# Production Secrets
NEXTAUTH_SECRET="your-production-secret"
JWT_SECRET="your-production-jwt-secret"

# Payment Gateway Production Keys
STRIPE_PUBLISHABLE_KEY="pk_live_your_stripe_key"
STRIPE_SECRET_KEY="sk_live_your_stripe_key"

# SMS/WhatsApp Production Keys
SMS_GATEWAY_API_KEY="your_production_sms_key"
WHATSAPP_API_KEY="your_production_whatsapp_key"
```

## 📈 Performance Optimization

- **Image Optimization**: Next.js Image component with Cloudinary
- **Database Indexing**: Optimized queries with Prisma
- **Caching Strategy**: Redis for session management
- **CDN Integration**: Global content delivery
- **Code Splitting**: Lazy loading for better performance

## 🔒 Security Features

- **Rate Limiting**: API protection against abuse
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM
- **XSS Prevention**: Content Security Policy
- **CSRF Protection**: NextAuth.js built-in protection
- **Data Encryption**: Sensitive data encryption at rest

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@spicegarden.lk
- 📱 WhatsApp: +94 11 234 5678
- 🌐 Website: https://spicegarden.lk

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Prisma** for type-safe database queries
- **NextAuth.js** for authentication
- **Socket.IO** for real-time features
- **Sri Lankan Payment Gateways** for local payment support

---

**Built with ❤️ for Sri Lankan Restaurants**

*Experience the future of restaurant management with Spice Garden - where tradition meets technology.*
