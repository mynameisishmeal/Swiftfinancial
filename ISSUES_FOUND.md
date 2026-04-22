# Codebase Issues & Incomplete Implementations

## Critical Issues

### 1. XSS Vulnerability (HIGH SEVERITY)
**File**: `app/dashboard/page.tsx` (lines 424-425)
**Issue**: User input in statement download not sanitized
**Risk**: Session hijacking, malware, phishing
**Fix**: Sanitize `name`, `email`, `accountId` before including in statement

### 2. Missing Phone Field in Self-Registration
**File**: `app/api/accounts/route.ts`
**Issue**: POST endpoint doesn't capture phone number
**Impact**: Self-registered users have no phone, OTP won't work
**Fix**: Add phone field to POST and GET auto-creation

### 3. Missing Default Notifications in Admin Creation
**File**: `app/api/admin/create-account/route.ts`
**Issue**: Admin-created accounts don't get default notifications
**Impact**: Users see empty notification panels
**Fix**: Add defaultNotifications array like in self-registration

## Incomplete Implementations

### 4. Intelligent History Not in Self-Registration
**File**: `app/api/accounts/route.ts`
**Issue**: Only admin creation uses intelligent history
**Impact**: Self-registered users get basic mock history
**Fix**: Add intelligent history option to registration

### 5. OTP Verification Flow Missing
**File**: User-facing OTP verification
**Issue**: Admin can generate OTP but users can't verify
**Impact**: OTP feature incomplete
**Fix**: Add OTP verification screen for users during login

### 6. Phone Number Not Editable
**File**: `app/admin/components/ManageAccountsTab.tsx`
**Issue**: Phone displayed but not editable in admin panel
**Impact**: Can't update user phone numbers
**Fix**: Add phone to edit mode

### 7. Missing Reload After Operations
**Files**: Multiple admin components
**Issue**: After OTP generation, notification changes, etc., data doesn't refresh
**Impact**: Stale data displayed
**Fix**: Call loadAllAccounts() or reload functions after operations

## Database Schema Inconsistencies

### 8. Missing Fields in Some Accounts
**Issue**: Old accounts missing new fields (phone, otpCode, cardExpiry, etc.)
**Impact**: Undefined errors, missing data
**Fix**: Migration script or default values in queries

### 9. Notification IDs Not Unique
**Issue**: Using `Date.now()` for IDs can create duplicates
**Impact**: Notification operations may fail
**Fix**: Use `Date.now() + Math.random()` or UUID

## Security Issues

### 10. No Input Validation
**Files**: All API endpoints
**Issue**: No validation for email format, phone format, amounts, etc.
**Impact**: Invalid data in database
**Fix**: Add validation middleware

### 11. Passwords Stored in Plain Text
**Files**: All account creation endpoints
**Issue**: Passwords not hashed
**Impact**: CRITICAL security vulnerability
**Fix**: Use bcrypt to hash passwords

### 12. No Rate Limiting
**Files**: All API endpoints
**Issue**: No protection against brute force
**Impact**: Account takeover risk
**Fix**: Add rate limiting middleware

## Performance Issues

### 13. Loading All Accounts Every Time
**File**: `app/admin/page.tsx`
**Issue**: Loads all accounts on every operation
**Impact**: Slow with many accounts
**Fix**: Implement pagination or selective loading

### 14. No Caching
**Issue**: Every request hits database
**Impact**: Slow response times
**Fix**: Add Redis or in-memory caching

## Code Quality Issues

### 15. Duplicate State Declarations
**File**: `app/admin/components/CreateAccountTab.tsx` (was fixed)
**Issue**: Had duplicate useState declarations
**Status**: FIXED

### 16. Missing Error Boundaries
**Files**: All React components
**Issue**: No error boundaries to catch runtime errors
**Impact**: App crashes on errors
**Fix**: Add error boundaries

### 17. No Loading States
**Files**: Multiple components
**Issue**: No loading indicators during async operations
**Impact**: Poor UX
**Fix**: Add loading states

## Missing Features

### 18. No Transaction Editing in User Dashboard
**Issue**: Users can't dispute or view transaction details
**Impact**: Limited functionality
**Fix**: Add transaction detail modal

### 19. No Search/Filter in Admin Panel
**Issue**: Can't search accounts by name, email, etc.
**Impact**: Hard to find specific accounts
**Fix**: Add search functionality

### 20. No Audit Log
**Issue**: No tracking of admin actions
**Impact**: Can't trace who did what
**Fix**: Add audit log table and tracking

## Priority Fixes

**IMMEDIATE (Security)**:
1. Hash passwords (bcrypt)
2. Fix XSS vulnerability
3. Add input validation
4. Add rate limiting

**HIGH (Functionality)**:
5. Add phone to self-registration
6. Add default notifications to admin creation
7. Make phone editable
8. Add data refresh after operations

**MEDIUM (UX)**:
9. Add loading states
10. Add error boundaries
11. Add search/filter
12. Add OTP verification flow

**LOW (Performance)**:
13. Add pagination
14. Add caching
15. Optimize queries
