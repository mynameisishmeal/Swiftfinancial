# Live Chat System Documentation

## How It Works

### User Side (Dashboard)
1. User goes to **More > Live Chat Support** tab
2. User types message and clicks send
3. Message is sent to `/api/livechat` (POST) with:
   - `userEmail`
   - `userName`
   - `message`
   - `timestamp`
4. Message is stored in `/data/livechat.json`
5. User sees their messages in red bubbles (right side)
6. Admin replies appear in gray bubbles (left side)

### Admin Side (Admin Panel)
1. Admin clicks **Live Chat** tab in sidebar
2. Admin sees list of all active user chats
3. **Unread badge** shows number of unread messages per user
4. Admin clicks on a user to open their chat
5. Admin types reply and clicks send
6. Reply is sent to `/api/livechat` (PUT) with:
   - `userEmail`
   - `message`
   - `timestamp`
7. Admin messages appear in red bubbles (right side)
8. User messages appear in gray bubbles (left side)

## Current Notification System

### Admin Notifications
- **Badge on Live Chat tab** - Shows total unread messages across all chats
- **Auto-refresh** - Chats refresh every 3 seconds when on Live Chat tab
- **Visual indicator** - Red badge with number appears on sidebar

### Limitations
- Admin must be on the admin page to see notifications
- No browser notifications or sound alerts
- No email notifications when user sends message
- Admin must manually check Live Chat tab

## Data Storage

### File Location
`/data/livechat.json`

### Structure
```json
{
  "chats": [
    {
      "userEmail": "user@example.com",
      "userName": "John Doe",
      "unreadCount": 2,
      "messages": [
        {
          "sender": "user",
          "message": "Hello, I need help",
          "timestamp": "2024-01-15T10:30:00.000Z"
        },
        {
          "sender": "admin",
          "message": "How can I help you?",
          "timestamp": "2024-01-15T10:31:00.000Z"
        }
      ]
    }
  ]
}
```

## API Endpoints

### GET /api/livechat
**Query Params:**
- `adminEmail` - Returns all chats for admin view
- `userEmail` - Returns messages for specific user

**Response:**
```json
{
  "chats": [...] // For admin
  "messages": [...] // For user
}
```

### POST /api/livechat
**Body:**
```json
{
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "message": "Hello",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```
**Action:** User sends message, increments unreadCount

### PUT /api/livechat
**Body:**
```json
{
  "userEmail": "user@example.com",
  "message": "How can I help?",
  "timestamp": "2024-01-15T10:31:00.000Z"
}
```
**Action:** Admin replies to user

## Improvements Needed

### 1. Mark Messages as Read
Currently, unreadCount never decreases. Need to add:
```javascript
// When admin opens a chat
await fetch('/api/livechat/mark-read', {
  method: 'POST',
  body: JSON.stringify({ userEmail })
});
```

### 2. Browser Notifications
Add to admin page:
```javascript
// Request permission
Notification.requestPermission();

// When new message arrives
if (Notification.permission === 'granted') {
  new Notification('New message from ' + userName, {
    body: message,
    icon: '/assets/BofA_rgb.png'
  });
}
```

### 3. Sound Alert
```javascript
const audio = new Audio('/sounds/notification.mp3');
audio.play();
```

### 4. Email Notifications
Add to `/api/livechat` POST:
```javascript
// Send email to admin
await fetch('/api/send-email', {
  method: 'POST',
  body: JSON.stringify({
    to: 'admin@bank.com',
    subject: 'New Live Chat Message',
    text: `${userName} sent: ${message}`
  })
});
```

### 5. User-Side Polling
User dashboard should also poll for new admin replies:
```javascript
useEffect(() => {
  if (activeTab === 'livechat') {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/livechat?userEmail=${email}`);
      const data = await res.json();
      setLiveChatMessages(data.messages || []);
    }, 3000);
    return () => clearInterval(interval);
  }
}, [activeTab]);
```

## Access Points

### User Access
Dashboard → More (bottom nav) → Live Chat Support

### Admin Access
Admin Panel → Live Chat (sidebar)

## Current Status
✅ User can send messages
✅ Admin can see all chats
✅ Admin can reply to users
✅ Unread badge shows on admin sidebar
✅ Auto-refresh every 3 seconds on admin side
❌ Unread count never decreases
❌ No browser notifications
❌ No sound alerts
❌ No email notifications
❌ User side doesn't auto-refresh
