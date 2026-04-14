# 🔥 Firebase Email Setup (100% FREE)

## Quick Setup (5 minutes)

### Step 1: Get Firebase Config
1. Go to **https://console.firebase.google.com/**
2. Click your project (or create new one)
3. Click ⚙️ **Settings** → **Project settings**
4. Scroll to **"Your apps"** section
5. Click **Web app icon** `</>`
6. Register app (name: "habank")
7. Copy the config values

### Step 2: Enable Authentication
1. In Firebase Console, click **"Authentication"** (left menu)
2. Click **"Get started"**
3. Go to **"Settings"** tab → **"Templates"**
4. You'll see email templates (these are FREE to use!)

### Step 3: Update .env.local
Paste your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

### Step 4: Customize Email Templates (Optional)
1. In Authentication → Templates
2. Edit "Email link sign-in" template
3. Customize subject and body
4. Save

## How It Works
- Uses Firebase Authentication (100% free)
- Sends emails through Firebase's email service
- No credit card required
- No extensions needed
- Works immediately

## That's It!
Firebase Auth emails are completely free and work out of the box. No SMTP, no paid plans, no extensions needed.

**Just add your Firebase config to .env.local and it works!** 🎉
