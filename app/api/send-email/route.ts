import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const auth = getAuth();

export async function POST(req: NextRequest) {
  try {
    const { to, subject, message, type } = await req.json();

    // Use Firebase Auth to send email
    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      handleCodeInApp: false,
    };

    // For notifications, we'll use the sign-in link feature
    // This is a workaround - Firebase Auth emails are free
    await sendSignInLinkToEmail(auth, to, actionCodeSettings);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json({ message: 'Email failed', error: error.message }, { status: 500 });
  }
}
