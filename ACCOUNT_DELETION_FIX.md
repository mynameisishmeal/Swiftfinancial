# Account Deletion Detection Fix

## Issue
When an admin deleted a user's account while the user was logged in and viewing the dashboard, the page would show $0 balance instead of redirecting the user to the login page.

## Root Cause
The GET `/api/accounts` endpoint was automatically creating a new account with $0 balance when it couldn't find an existing account, instead of returning a 404 error.

## Solution Implemented

### 1. Modified API Endpoint Behavior
**File:** `app/api/accounts/route.ts`

**Changes:**
- Added `autoCreate` query parameter to control account auto-creation
- When `autoCreate` is not set to 'true', endpoint returns 404 with `accountDeleted: true` flag
- Added `transactionPin` to the response data
- Auto-creation only happens when explicitly requested with `?autoCreate=true`

**Before:**
```typescript
if (!account) {
  // Always auto-created account
  const generatedId = 'ACC' + Date.now();
  await db.collection('accounts').insertOne({...});
}
```

**After:**
```typescript
if (!account) {
  if (autoCreate === 'true') {
    // Only auto-create if explicitly requested
    const generatedId = 'ACC' + Date.now();
    await db.collection('accounts').insertOne({...});
  } else {
    return NextResponse.json({ 
      message: 'Account not found', 
      accountDeleted: true 
    }, { status: 404 });
  }
}
```

### 2. Dashboard Error Handling
**File:** `app/dashboard/page.tsx`

**Changes Made:**

#### A. Immediate Detection on Load
Modified `loadAccount()` function to detect deleted accounts:
```typescript
const loadAccount = async (userEmail: string) => {
  const res = await fetch(`/api/accounts?email=${userEmail}`);
  if (!res.ok) {
    const data = await res.json();
    if (data.accountDeleted || res.status === 404) {
      showToast('Your account has been deleted. Please contact support.', 'error');
      setTimeout(() => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        router.push('/');
      }, 2000);
      return;
    }
  }
  // ... rest of function
};
```

#### B. Periodic Account Status Check
Added interval check every 10 seconds to detect deletion while user is idle:
```typescript
useEffect(() => {
  // ... initial load code ...

  // Check account status every 10 seconds
  const accountCheckInterval = setInterval(async () => {
    const res = await fetch(`/api/accounts?email=${userEmail}`);
    if (!res.ok) {
      const data = await res.json();
      if (data.accountDeleted || res.status === 404) {
        clearInterval(accountCheckInterval);
        showToast('Your account has been deleted. Redirecting to login...', 'error');
        setTimeout(() => {
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRole');
          router.push('/');
        }, 2000);
      }
    }
  }, 10000);

  return () => clearInterval(accountCheckInterval);
}, []);
```

#### C. Transaction Fetch Error Handling
Added error handling for transactions API call:
```typescript
const txRes = await fetch(`/api/accounts?email=${userEmail}&transactions=true`);
if (txRes.ok) {
  const txData = await txRes.json();
  if (txData.transactions) setTransactions(txData.transactions);
}
```

## User Experience Flow

### Scenario 1: Account Deleted While User is Active
1. User is logged in and viewing dashboard
2. Admin deletes user's account
3. Within 10 seconds, periodic check detects account deletion
4. Error toast appears: "Your account has been deleted. Redirecting to login..."
5. After 2 seconds, user is logged out and redirected to home page
6. localStorage is cleared (userEmail and userRole removed)

### Scenario 2: Account Deleted, User Refreshes Page
1. User is logged in
2. Admin deletes user's account
3. User refreshes the page or navigates
4. `loadAccount()` immediately detects account is missing
5. Error toast appears: "Your account has been deleted. Please contact support."
6. After 2 seconds, user is logged out and redirected to home page
7. localStorage is cleared

### Scenario 3: Account Deleted, User Tries to Perform Action
1. User is logged in
2. Admin deletes user's account
3. User tries to make a transfer or other action
4. API call fails with 404
5. Periodic check (within 10 seconds) detects deletion
6. User is logged out and redirected

## Benefits

1. **Immediate Feedback**: User knows their account was deleted instead of seeing confusing $0 balance
2. **Automatic Cleanup**: localStorage is properly cleared
3. **Graceful Handling**: 2-second delay allows user to read the error message
4. **Continuous Monitoring**: 10-second interval ensures detection even if user is idle
5. **No False Accounts**: Prevents creation of empty accounts when real account is deleted
6. **Better Security**: Ensures deleted users cannot continue using the system

## Technical Details

- **Detection Interval**: 10 seconds (configurable)
- **Toast Duration**: 2 seconds before redirect
- **HTTP Status**: 404 with `accountDeleted: true` flag
- **Cleanup**: Removes `userEmail` and `userRole` from localStorage
- **Redirect Target**: Home page (`/`)

## Testing Checklist

- [x] User logged in, admin deletes account → User redirected within 10 seconds
- [x] User logged in, admin deletes account, user refreshes → Immediate redirect
- [x] Error toast displays correct message
- [x] localStorage cleared after redirect
- [x] User redirected to home page
- [x] No $0 balance shown
- [x] No empty accounts created
- [x] Interval cleanup on component unmount
- [x] Build successful with no errors

## Notes

- The 10-second interval is a balance between responsiveness and server load
- Can be adjusted by changing the interval value in the useEffect
- The `autoCreate=true` parameter is preserved for backward compatibility with other parts of the system that may need auto-creation
