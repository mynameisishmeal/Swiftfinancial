# 📧 Email Notifications Setup (Firebase)

## Overview
The system uses Firebase Firestore to queue emails. Install the "Trigger Email" extension in Firebase to automatically send emails.

## Setup Instructions

### 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable Firestore Database
4. Go to Project Settings → Service Accounts
5. Click "Generate New Private Key"
6. Download the JSON file

### 2. Install Firebase Extension
1. In Firebase Console, go to Extensions
2. Install "Trigger Email from Firestore"
3. Configure:
   - Collection: `mail`
   - SMTP Connection: Use your email provider
   - Or use SendGrid/Mailgun API

### 3. Update .env.local
From your downloaded service account JSON:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nKey\nHere\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. How It Works
1. App writes email to Firestore `mail` collection
2. Firebase extension detects new document
3. Extension sends email automatically
4. Document is marked as delivered

## Email Notifications Enabled For:
- ✅ Transfers (sender and recipient)
- 🔄 Can be added to: deposits, withdrawals, account creation

## API Endpoint
`POST /api/send-email`

**Body:**
```json
{
  "to": "user@example.com",
  "subject": "Transfer Confirmation",
  "message": "<h2>Your HTML content</h2>",
  "type": "transfer"
}
```

## Testing
1. Set up Firebase project
2. Install Trigger Email extension
3. Update .env.local with credentials
4. Make a transfer
5. Check Firestore `mail` collection
6. Check email inbox

## Production
Firebase extension handles:
- Email delivery
- Retry logic
- Delivery status
- Error handling

No SMTP configuration needed!
