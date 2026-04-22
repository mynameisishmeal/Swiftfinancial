# Transaction PIN and Card Logo Changes

## Summary
Implemented 4-digit transaction PIN security feature and changed card logo from BofA_rgb.png to cardlogo.png.

## Changes Made

### 1. Card Logo Update
**Files Modified:**
- `app/dashboard/components/CreditCard.tsx`
  - Changed logo from `/assets/BofA_rgb.png` to `/assets/cardlogo.png` (2 locations: front and back of card)

### 2. Transaction PIN Field in Admin Account Creation
**Files Modified:**
- `app/admin/components/CreateAccountTab.tsx`
  - Added "TRANSACTION PIN (4 DIGITS)" field for both admin and user account creation
  - PIN input restricted to 4 numeric digits only
  - Field is required for account creation

- `app/api/admin/create-account/route.ts`
  - Added `transactionPin` parameter to request body
  - Added validation: PIN must be exactly 4 digits
  - Stores `transactionPin` in database with user account

### 3. PIN Verification for CVV Viewing
**Files Modified:**
- `app/dashboard/components/CreditCard.tsx`
  - Added PIN modal that appears when clicking card to flip and view CVV
  - User must enter correct 4-digit PIN to view card back
  - Modal includes:
    - 🔒 lock icon
    - PIN input field (password type, 4 digits max)
    - Error message for incorrect PIN
    - Cancel and Verify buttons
    - Enter key support for quick verification

### 4. PIN Verification Before Transfers
**Files Modified:**
- `app/dashboard/components/PinModal.tsx` (NEW FILE)
  - Created reusable PIN modal component
  - Props: show, onClose, onVerify, transactionPin, title, subtitle
  - Validates PIN before executing callback
  - Styled modal with backdrop and centered positioning

- `app/dashboard/page.tsx`
  - Added `transactionPin` state loaded from account data
  - Added `showPinModal` and `pendingTransferAction` states
  - Modified all transfer handlers to check for PIN:
    - `handleTransfer()` → `executeTransfer()`
    - `handleBillPay()` → `executeBillPay()`
    - `handleZelle()` → `executeZelle()`
    - `handleWire()` → `executeWire()`
  - If PIN exists, shows modal before executing transfer
  - If no PIN, executes transfer immediately (backward compatible)
  - Added PinModal component to render tree

- `app/dashboard/components/AccountsTab.tsx`
  - Replaced inline credit card implementation with CreditCard component
  - Passes `transactionPin` prop to CreditCard component
  - Removed duplicate card rendering code

### 5. Database Schema Update
**New Field:**
- `transactionPin`: String (4 digits) - Required for new accounts
- Stored in plain text in accounts collection
- Used for CVV viewing and transfer authorization

## User Flow

### Admin Creating User Account:
1. Admin fills out create account form
2. Admin enters 4-digit transaction PIN for the user
3. PIN is validated (must be exactly 4 digits)
4. PIN is stored with user account in database

### User Viewing CVV:
1. User clicks on credit card to flip it
2. PIN modal appears with lock icon
3. User enters 4-digit PIN
4. If correct: Card flips to show CVV
5. If incorrect: Error message "Incorrect PIN" displays

### User Making Transfer:
1. User fills out transfer form (any type: transfer, bill pay, Zelle, wire)
2. User clicks "Continue" button
3. PIN modal appears: "Enter Transaction PIN - Enter your 4-digit PIN to authorize this transaction"
4. User enters 4-digit PIN
5. If correct: Transfer executes and receipt shows
6. If incorrect: Error message displays, transfer does not execute

## Security Features
- PIN required for sensitive operations (CVV viewing, transfers)
- PIN input masked (password type)
- Numeric-only validation (no letters or special characters)
- Exactly 4 digits required
- Error feedback for incorrect PIN attempts
- Modal backdrop prevents accidental clicks
- Cancel option available at any time

## Backward Compatibility
- If account has no `transactionPin` field, transfers work without PIN verification
- Existing accounts without PIN can still function normally
- Only new accounts created after this update will have PIN requirement

## Testing Checklist
- [ ] Admin can create user with 4-digit PIN
- [ ] PIN validation rejects non-numeric or wrong-length PINs
- [ ] Credit card requires PIN to view CVV
- [ ] Incorrect PIN shows error message
- [ ] Correct PIN flips card to show CVV
- [ ] Transfer requires PIN before execution
- [ ] Bill pay requires PIN before execution
- [ ] Zelle requires PIN before execution
- [ ] Wire transfer requires PIN before execution
- [ ] Incorrect PIN prevents transfer
- [ ] Correct PIN allows transfer to complete
- [ ] Card logo displays as cardlogo.png
- [ ] Accounts without PIN can still transfer (backward compatible)
