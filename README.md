# Wedding Event Management Platform

A comprehensive wedding event management platform with Instagram-like photo sharing capabilities.

## Features

- **Multi-level Authentication**: Admin, Couple, and Guest access levels
- **Admin Dashboard**: Manage all events, view statistics, create new events
- **Couple Dashboard**: Customize events, manage guests, view shared content
- **Guest Experience**: Instagram-style photo sharing with posts, likes, and comments
- **Email Integration**: Automated credential sending and notifications
- **Event Customization**: Custom colors, logos, and branding
- **Guest Management**: Excel import, credential generation, and invitation system

## Mock Data for Testing

The application includes comprehensive mock data to test all functionality without external dependencies:

### Test Credentials

**Admin Login:**
- Email: `admin@weddingplatform.com`
- Password: `admin123`

**Couple Login (Event 1):**
- Event Code: `WEDDING01`
- Password: `couple123`

**Couple Login (Event 2):**
- Event Code: `WEDDING02`
- Password: `couple456`

**Guest Login (Event 1):**
- Event Code: `WEDDING01`
- Username: `alice_j`
- Password: `guest123`

**Guest Login (Event 1):**
- Event Code: `WEDDING01`
- Username: `bob_s`
- Password: `guest456`

**Guest Login (Event 2):**
- Event Code: `WEDDING02`
- Username: `isabella_g`
- Password: `guest606`

### Mock Data Includes

- 3 sample wedding events with different statuses
- 12+ mock guests across events
- Sample posts with photos and engagement metrics
- Admin statistics and analytics
- Email templates and mock sending

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Use the test credentials above to explore different user roles

## User Flows

### Admin Flow
1. Login at `/admin/login`
2. View dashboard with all events and statistics
3. Create new events and send credentials to couples
4. Monitor payments and platform usage

### Couple Flow
1. Login at `/login` with event code and password
2. Access couple dashboard with event statistics
3. Customize event appearance (colors, logos)
4. Import guests via Excel and send invitations
5. View guest-shared content

### Guest Flow
1. Login at `/guest-login` with event code and credentials
2. View Instagram-style feed of event posts
3. Create posts with photos and text
4. Interact with other guests' content

## Technology Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: JWT tokens with role-based access
- **Mock Data**: Comprehensive test data for all features
- **Email**: Mock email system for testing
- **Database**: Ready for MySQL integration
- **Image Storage**: Prepared for Cloudinary integration

## Production Setup

To deploy to production:

1. Set up MySQL database using the provided schema
2. Configure environment variables for database, email, and Cloudinary
3. Replace mock data functions with actual database queries
4. Set up real email service (SMTP)
5. Configure Cloudinary for image storage
6. Set up Stripe for payment processing

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=wedding_events

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```