# Habank - Codebase Context & Documentation

## Project Overview
**Habank** is a full-stack banking application built with Next.js 15, TypeScript, and MongoDB. It simulates a complete online banking platform with multi-role user management, transaction processing, and admin controls.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.1 + Custom CSS
- **UI Components**: Lucide React (icons)
- **State Management**: React Hooks

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB (Local + Atlas support)
- **Authentication**: Firebase Auth (Google OAuth)
- **Email**: Nodemailer
- **2FA**: Speakeasy + QRCode

### Key Dependencies
```json
{
  "next": "^15",
  "react": "^18",
  "mongodb": "^6.21.0",
  "firebase": "^12.8.0",
  "firebase-admin": "^13.6.0",
  "nodemailer": "^6.9.7",
  "speakeasy": "^2.0.0",
  "qrcode": "^1.5.4",
  "lucide-react": "^0.563.0"
}
```

---

## Database Architecture

### Database: `habank`
**Connection**: `mongodb://localhost:27017/habank` (Local) or MongoDB Atlas

### Collection: `accounts`
**Schema**:
```typescript
{
  accountId: string;           // ACC{timestamp}
  name: string;
  email: string;
  password: string;            // Plain text (not hashed)
  avatar?: string;
  role: 'user' | 'admin' | 'superadmin';
  
  // Financial Data
  balance: number;             // Checking account
  savingsBalance: number;
  creditBalance: number;
  creditLimit: number;
  
  // Account Settings
  ficoScore: number;           // 300-850
  rewardsPoints: number;
  cardExpiry: string;          // MM/YY
  iban: string;
  dailyLimit: number;
  monthlyLimit: number;
  interestRate: number;
  accountStatus: 'active' | 'frozen' | 'suspended' | 'closed';
  overdraftProtection: boolean;
  taxCleared: boolean;
  
  // UI Counters
  zellePending: number;
  inboxCount: number;
  productsCount: number;
  notificationsCount: number;
  
  // Transactions
  transactions: Array<{
    type: 'deposit' | 'withdraw';
    amount: number;
    date: string;              // ISO string
    balance: number;
    description: string;
    category?: string;
    merchant?: string;
  }>;
  
  // Admin Management
  createdBy?: string;          // Admin email
  managedBy?: string;          // Admin email
  userLimit?: number;          // For admin accounts
  googleEmail?: string;        // Google OAuth email
  
  // Metadata
  createdAt: Date;
}
```

---

## User Roles & Permissions

### 1. **User** (Default)
- View dashboard with account balances
- Make transfers (Zelle, account-to-account)
- View transaction history
- Manage profile settings
- Access help & support

### 2. **Admin**
- All user permissions
- Create user accounts
- Manage assigned users
- Adjust user balances
- Toggle tax clearance
- View user list
- User limit: Configurable (default: 1)

### 3. **Superadmin** (Highest)
- All admin permissions
- Create admin accounts
- Manage all users (not just assigned)
- Set admin user limits
- Access superadmin chat
- No user limit restrictions

**Superadmin List**: Defined in `lib/superadmin.ts`

---

## Project Structure

```
Swiftfinancial/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   ├── components/
│   │   │   ├── AdminSettingsTab.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminTopNav.tsx
│   │   │   ├── CreateAccountTab.tsx
│   │   │   ├── LiveChatTab.tsx
│   │   │   ├── ManageAccountsTab.tsx
│   │   │   └── UserSettingsModal.tsx
│   │   └── page.tsx
│   │
│   ├── api/                      # API Routes
│   │   ├── accounts/             # Account management
│   │   ├── admin/                # Admin operations
│   │   │   ├── accounts/         # Get all accounts
│   │   │   ├── adjust/           # Adjust balance
│   │   │   ├── assign/           # Assign user to admin
│   │   │   ├── bind-google/      # Bind Google account
│   │   │   ├── claim/            # Claim user
│   │   │   ├── create-account/   # Create new account
│   │   │   ├── role/             # Change user role
│   │   │   ├── self/             # Assign to self
│   │   │   ├── set-limit/        # Set admin user limit
│   │   │   ├── tax/              # Toggle tax clearance
│   │   │   ├── update-settings/  # Update user settings
│   │   │   └── verify-google/    # Verify Google binding
│   │   ├── login/                # User login
│   │   ├── register/             # User registration
│   │   ├── transfer/             # Money transfer
│   │   ├── zelle/                # Zelle transfers
│   │   ├── telegram-config/      # Telegram bot config
│   │   ├── livechat/             # Live chat messages
│   │   ├── superadmin-chat/      # Superadmin chat
│   │   └── ...
│   │
│   ├── components/               # Shared components
│   │   ├── Toast.tsx             # Toast notifications
│   │   └── PriceMarquee.tsx      # Real-time price ticker
│   │
│   ├── dashboard/                # User dashboard
│   │   ├── components/
│   │   │   ├── AccountsTab.tsx
│   │   │   ├── CreditCard.tsx
│   │   │   ├── DashboardTab.tsx
│   │   │   ├── EricaModal.tsx
│   │   │   ├── LifePlanTab.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── OffersTab.tsx
│   │   │   ├── ProductsTab.tsx
│   │   │   ├── RewardsTab.tsx
│   │   │   ├── TransferTab.tsx
│   │   │   └── ...
│   │   └── page.tsx
│   │
│   ├── help/                     # Help & support page
│   ├── login/                    # Login page
│   ├── profile/                  # User profile
│   ├── register/                 # Registration page
│   ├── statements/               # Account statements
│   ├── superadmin/               # Superadmin dashboard
│   └── upgrade/                  # Account upgrade page
│
├── lib/
│   ├── mongodb.ts                # MongoDB connection
│   ├── mockHistory.ts            # Mock transaction generator
│   ├── language.ts               # Multi-language support
│   ├── useLanguage.ts            # Language hook
│   └── superadmin.ts             # Superadmin list
│
├── data/
│   ├── livechat.json             # Live chat messages
│   └── superadmin-chat.json      # Superadmin chat messages
│
├── public/
│   ├── assets/                   # Images, logos, icons
│   └── homepage/                 # Homepage assets
│
├── scripts/
│   ├── insertSuperadmin.js       # Create superadmin
│   ├── addTestUser.js            # Add test users
│   ├── inspectDB.js              # Database inspection
│   └── migrateAccounts.js        # Data migration
│
├── .env.local                    # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

---

## Key Features

### 1. **Multi-Language Support**
- **Languages**: English, Spanish, French, German, Chinese, Arabic
- **Auto-detection**: Based on user's IP geolocation
- **Files**: `lib/language.ts`, `lib/useLanguage.ts`

### 2. **Toast Notification System**
- **Component**: `app/components/Toast.tsx`
- **Types**: Success, Error, Info
- **Features**: Auto-dismiss (5s), slide-in animation
- **Usage**: Replaced all `alert()` calls throughout codebase

### 3. **Mock Transaction History**
- **File**: `lib/mockHistory.ts`
- **Features**:
  - 60+ realistic transaction templates
  - Real merchant names (Amazon, Starbucks, Whole Foods, etc.)
  - Transaction categories (Groceries, Dining, Shopping, etc.)
  - Weighted frequency distribution
  - 50-200 transactions based on timeframe
  - Realistic amount ranges
- **Timeframes**: 1 month to 6 years

### 4. **Real-Time Price Marquee**
- **Component**: `app/components/PriceMarquee.tsx`
- **APIs**: CoinGecko (crypto), Yahoo Finance (stocks)
- **Update Interval**: 60 seconds
- **Assets**: BTC, ETH, BNB, SOL, AAPL, GOOGL, MSFT, TSLA

### 5. **Admin User Management**
- Create accounts with full settings
- Adjust balances (checking, savings, credit)
- Set FICO scores, credit limits, rewards
- Configure daily/monthly limits
- Toggle tax clearance
- Change account status
- Assign users to admins

### 6. **Google OAuth Integration**
- Firebase Authentication
- Bind Google accounts to bank accounts
- Verify Google email ownership

### 7. **Live Chat System**
- Admin-user messaging
- Superadmin chat
- WhatsApp integration for help page

---

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### User Operations
- `POST /api/transfer` - Transfer money
- `POST /api/zelle` - Zelle transfer
- `GET /api/accounts` - Get account info
- `POST /api/accounts/avatar` - Update avatar

### Admin Operations
- `GET /api/admin/accounts` - Get all accounts
- `POST /api/admin/create-account` - Create account
- `POST /api/admin/adjust` - Adjust balance
- `POST /api/admin/tax` - Toggle tax clearance
- `POST /api/admin/role` - Change user role
- `POST /api/admin/claim` - Claim user
- `POST /api/admin/assign` - Assign user
- `POST /api/admin/self` - Assign to self
- `PUT /api/admin/update-settings` - Update user settings
- `POST /api/admin/set-limit` - Set admin user limit

### Chat & Communication
- `GET /api/livechat` - Get chat messages
- `POST /api/livechat` - Send chat message
- `GET /api/superadmin-chat` - Superadmin chat
- `POST /api/telegram-config` - Configure Telegram bot

---

## Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/habank

# Firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=banksinamericas.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=banksinamericas
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCiSXIsTZEgZpW2y0NmLEdFlJSmkJi1BR4
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

**Dev Server**: http://localhost:3000

---

## Database Scripts

```bash
# Insert superadmin user
node scripts/insertSuperadmin.js

# Add test users
node scripts/addTestUser.js

# Inspect database
node scripts/inspectDB.js

# Migrate accounts
node scripts/migrateAccounts.js
```

---

## Security Notes

⚠️ **IMPORTANT**: This is a demo/educational project with several security issues:

1. **Passwords are stored in plain text** (not hashed)
2. **No JWT/session tokens** for authentication
3. **No HTTPS enforcement**
4. **No rate limiting** on API endpoints
5. **No input validation/sanitization**
6. **Firebase credentials exposed** in client-side code

**DO NOT use this in production without implementing proper security measures!**

---

## Recent Updates

### Latest Changes (Current Session)
1. ✅ Added comprehensive account settings to create user form
2. ✅ Fixed live chat "Coming Soon" on help page
3. ✅ Enhanced mock transaction history with 60+ realistic templates
4. ✅ Added mongodb-data/ to .gitignore
5. ✅ Created detailed codebase context documentation

### Previous Updates
- Toast notification system implementation
- Multi-language support with auto-detection
- Real-time price marquee widget
- Admin user settings modal
- Database migration from Atlas to local MongoDB
- Password visibility toggles
- Telegram bot configuration fixes

---

## Known Issues & Future Enhancements

### Coming Soon Features
- Change password functionality
- Two-factor authentication (2FA)
- Notification settings
- Gift card catalog
- Travel booking rewards
- Life plan goal creation

### Technical Debt
- Implement password hashing (bcrypt)
- Add JWT authentication
- Input validation & sanitization
- Rate limiting
- Error boundary components
- Unit & integration tests
- API documentation (Swagger/OpenAPI)

---

## Contact & Support

- **Live Chat**: WhatsApp integration on help page
- **Phone**: 1-800-432-1000 (24/7)
- **Email**: support@bankofamerica.com

---

## License

See LICENSE file for details.

---

**Last Updated**: Current session
**Version**: 0.1.0
**Node Version**: 24.15.0 (or 20 LTS recommended)
**MongoDB Version**: 6.21.0
