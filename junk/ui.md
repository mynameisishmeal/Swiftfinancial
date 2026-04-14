Certainly! Here’s a more detailed version of the prompt for your mobile banking app UI build:

---

**Mobile Banking App UI Build - Detailed Prompt**

### **1. Top Navigation Bar (Header)**

* **Menu Icon**:

  * **Position**: Left-aligned.
  * **Icon**: A standard hamburger menu icon (three horizontal lines).
  * **Functionality**: Clicking on this opens the app’s sidebar or navigation drawer containing options like account settings, transaction history, support, etc.
  * **Visual Style**: Minimalistic with a neutral color to maintain focus on other elements.

* **Inbox Icon**:

  * **Position**: Right-aligned, near the top.
  * **Icon**: Envelope or notification bell with a badge.
  * **Notification Badge**: A small red circle with the number 9 to indicate unread messages.
  * **Functionality**: Tapping this opens the inbox or messages section of the app for the user to view new notifications or messages from the bank.

* **Products Icon**:

  * **Position**: Right-aligned, adjacent to the Inbox icon.
  * **Icon**: Shopping cart or product icon with a badge.
  * **Notification Badge**: A small red circle with the number 9 to indicate that there are 9 items in the user's shopping cart or active products in a connected service (e.g., a loan application).
  * **Functionality**: Tapping this takes the user to a screen showing products or services they are interested in.

* **Log Out Icon**:

  * **Position**: Right-aligned, farthest from the other icons.
  * **Icon**: User profile icon or a gear/cog with a "log out" symbol.
  * **Functionality**: This allows the user to log out of the app securely.
  * **Visual Style**: Simple, with a clear logout symbol.

* **Notifications Icon**:

  * **Position**: Right-aligned, near the farthest corner of the header.
  * **Icon**: Red notification bell or alert symbol.
  * **Notification Badge**: Red circular badge displaying the number 4 (for 4 new notifications).
  * **Functionality**: Tapping this reveals recent system or account-related notifications.

---

### **2. Main Dashboard Area**

#### **Top-Level Tab Navigation**

* **Highlighted Active Tab**:

  * The "Accounts" tab should be prominently highlighted in **red**. This indicates that the user is currently on the accounts page.
  * **Inactive Tabs**: Other tabs such as “Dashboard”, “Transactions”, etc., should appear in neutral tones (like gray or white) to distinguish them from the active tab.

* **Search Bar**:

  * **Position**: Directly below the top-level tabs, stretching across the width of the screen.
  * **Label**: “How can we help?” in a light font, encouraging the user to search for specific actions like transfers, bill pay, or customer support.
  * **Functionality**: Users can input queries or transaction types to quickly navigate to specific sections. The search bar should auto-suggest options as users type.
  * **Visual Style**: Rounded corners, with a light gray background to distinguish it from the main content area.

---

### **3. Account Overview Section**

#### **Business Account Name & Rewards Info**

* **Account Name**:

  * **Display**: The business name “Jenn & Co.” prominently at the top of this section.
  * **Font**: Bold, large enough to be immediately noticeable.
* **Preferred Rewards Information**:

  * **Text**: Display the message: “You’ve been enjoying Preferred Rewards for Business since Mar 2018.”
  * **Link**: Include a hyperlink “My Summary” in a different color (e.g., blue or underlined) that the user can tap to view further rewards details or manage their rewards preferences.

#### **Banking Section**

* **Account Display Layout**:

  * **Bank Name**: “BANK OF AMERICA” should appear prominently in the section header for easy identification.
  * **Account List**:

    1. **Business Adv Checking - 3432**:

       * **Balance**: Display $57,213.00 next to the account name in a large, easy-to-read font. Use a distinct color for the balance to draw attention.
       * **Account Number**: Display the last 4 digits of the account number for identification (e.g., -3432).
       * **Action Button**: An expandable arrow or “Details” button should be next to the balance to show more account options like recent transactions, settings, or funding options.
    2. **Business Adv Savings - 0193**:

       * **Balance**: Display $10,900.00 in a similar style to the checking account, keeping a consistent layout.
       * **Account Number**: Display the last 4 digits (e.g., -0193).
       * **Action Button**: Include an expandable arrow or “Details” button next to the savings balance for further actions.

#### **Credit Cards Section**

* **Account Display Layout**:

  * **Card Type and Bank**: "BANK OF AMERICA" followed by the card type "Business Advantage Cash Rewards" in a bold font.
  * **Account Number**: Display the last four digits (e.g., 9832) to indicate the card number.
  * **Balance**: Show the current balance as $982.53 in a large, bold font with a distinct color (e.g., green or blue).
  * **Action Button**: Include an expandable arrow or “Details” button to access further card-related features like statements, rewards tracking, or payment options.

---

### **4. Bottom Navigation Bar**

#### **Navigation Icons**

* **Position**: Fixed at the bottom of the screen for easy access during navigation.
* **Icons**: Use clear, minimalist icons with labels under each for clarity.

  1. **Accounts Icon**:

     * **Active State**: This icon is highlighted in **red** with a label "Accounts."
     * **Inactive State**: Neutral colors for the other sections.
     * **Functionality**: Takes users to the account overview.

  2. **Pay & Transfer Icon**:

     * **Icon**: Dollar sign with a small arrow.
     * **Label**: "Pay & Transfer" should be displayed below the icon.
     * **Functionality**: Users can tap to initiate transfers or bill payments.

  3. **Deposit Checks Icon**:

     * **Icon**: A checkmark or scanner icon.
     * **Label**: "Deposit Checks" should be clearly labeled below the icon.
     * **Functionality**: Launches the camera or guides the user to deposit a check via the app.

  4. **Services Icon**:

     * **Icon**: A toolbox or shopping bag icon.
     * **Label**: "Services" should be displayed below the icon.
     * **Functionality**: Takes users to additional banking services like loan options, credit services, or customer support.

---

### **5. Visual Design & Interaction**

* **Color Scheme**: Use a **red**, **blue**, and **white** color palette consistent with the Bank of America brand. Red should be used to highlight active sections (e.g., active tab, balances), while blue and white can be used for neutral or background elements.

* **Font Style**:

  * **Headings**: Bold, sans-serif for account names and section headers.
  * **Text**: Regular, easy-to-read sans-serif for account balances and details.
  * **Size**: Ensure a clear contrast between headings and details for visual hierarchy. Balances should be larger and bold for emphasis.

* **Interactive Elements**: Ensure that buttons (e.g., "Details" arrows, icons) are large enough to be tapped easily on mobile devices. Use smooth, subtle animations when expanding sections or transitioning between screens for a polished experience.

* **Responsiveness**: The design should be fully responsive to different screen sizes, ensuring that the UI remains clean and functional on various phone models (including iPhone and Android).

* **Security Considerations**: Include security icons (e.g., a lock or fingerprint) to reassure users that their data is protected, especially when they access sensitive information.

---

### **6. Usability Considerations**

* **Accessibility**: Ensure text is large enough for readability and colors provide good contrast. Implement voiceover functionality for users with disabilities, and ensure buttons and links are easily tappable.

* **Intuitive Flow**: Organize account sections (checking, savings, credit cards) logically and allow easy switching between different sections without confusion. The app should feel fluid, requiring minimal steps to complete tasks.

---

This detailed UI build prompt provides a comprehensive guide to creating a professional and user-friendly mobile banking app, focusing on simplicity, clarity, and functionality while maintaining a consistent brand identity.



Perfect — I’ll **fold the improvements directly into your existing prompt**, keeping its structure but **upgrading it to production-grade**. I won’t rewrite everything from scratch; instead this is a **cleanly enhanced version** with added clarity, semantics, accessibility, and polish.

---

## **Mobile Banking App UI Build – Enhanced & Production-Ready Prompt**

---

## **0. Global Design System (NEW)**

### **Design Tokens**

Use reusable tokens to ensure consistency and scalability:

* **Brand Red (Primary / Active States)**: `#E31837`
* **Brand Navy (Primary Text / Headers)**: `#012169`
* **Neutral Text (Secondary)**: `#6B7280`
* **Divider / Border**: `#E5E7EB`
* **Background (App)**: `#F5F5F5`
* **Card Background**: `#FFFFFF`

### **Semantic Color Usage**

* **Balances (Checking / Savings)**: Neutral dark (`#111827`)
* **Credit Card Balance**: Blue (`#2563EB`)
* **Positive Indicators (Rewards, Gains)**: Green (`#10B981`)
* **Alerts / Errors**: Red (`#E31837`)

> Avoid using green for standard balances to prevent confusion with “gain” semantics.

---

## **1. Top Navigation Bar (Header)**

### **General**

* Fixed at the top
* Respects device safe areas (notch-aware)
* High contrast for accessibility

### **Menu Icon**

* **Position**: Left-aligned
* **Icon**: Hamburger menu (SVG or icon library — avoid emojis)
* **Accessibility**:

  * `aria-label="Open menu"`
* **Functionality**:

  * Opens side drawer with Profile, Settings, Support, Legal, Logout

### **Right Action Icons**

Use a **consistent icon system** (Lucide, Heroicons, SF Symbols).

#### **Inbox**

* Badge: unread message count (e.g. 9)
* `aria-label="Inbox, 9 unread messages"`

#### **Products**

* Badge: active products count (e.g. 9)
* Navigates to products / applications

#### **Notifications**

* Badge: new alerts count (e.g. 4)
* Opens system alerts and account notices

#### **Profile / Logout**

* Opens profile menu
* Logout is a secondary action (confirmation required)

---

## **2. Main Dashboard Area**

### **Top-Level Tab Navigation**

* Horizontally scrollable
* Tabs include:

  * Accounts (active by default)
  * Dashboard
  * Transactions
  * Payments
  * More

#### **Active Tab**

* Red text
* Bottom indicator bar
* `aria-selected="true"`

#### **Inactive Tabs**

* Neutral gray
* Accessible focus styles for keyboard navigation

---

### **Search Bar**

* **Placeholder**: “How can we help?”
* Supports:

  * Transfers
  * Bill pay
  * Statements
  * Help articles
* Optional autocomplete suggestions
* Accessible label for screen readers

---

## **3. Account Overview Section**

### **Business Profile Card**

* Card-based layout
* Elevated with subtle shadow

#### **Business Name**

* “Jenn & Co.”
* Large, bold, navy text

#### **Rewards Info**

* Text:
  “You’ve been enjoying Preferred Rewards for Business since Mar 2018.”
* Inline link:

  * **My Summary**
  * Blue, underlined
  * Navigates to rewards dashboard

---

## **4. Banking Accounts Section**

### **Section Header**

* Label: **BANK OF AMERICA**
* Uppercase, small font
* Subtle background tint

---

### **Account Rows (Expandable)**

Each row includes:

* Account name
* Masked account number (last 4 digits)
* Balance
* Expand/collapse chevron

#### **Accessibility (NEW)**

* Entire row is a button
* Uses:

  * `aria-expanded`
  * `role="button"`
* Chevron rotates on expand (smooth animation)

---

### **Expanded Account Actions**

When expanded, show a grid of actions:

**Checking Account**

* Transfer
* Pay Bills
* Statements
* Account Details
* Settings
* Transaction History

**Savings Account**

* Transfer
* Deposit
* Statements
* Account Details
* Settings
* APY Information

---

## **5. Credit Cards Section**

### **Credit Card Summary Row**

* Card name: Business Advantage Cash Rewards
* Masked card number (…9832)
* Balance shown in **blue**
* Expandable details

---

### **Expanded Credit Card View**

#### **Card Visual**

* Subtle dark gradient
* Chip graphic
* Masked card number
* Cardholder name
* Network logo (e.g., VISA)

> This is a decorative element and should be hidden from screen readers.

#### **Credit Card Actions**

* Pay Card
* Rewards
* Statements
* Card Details
* Settings
* Activity

---

## **6. Bottom Navigation Bar**

### **General**

* Fixed to bottom
* Safe-area aware
* Four equal-width buttons

### **Icons**

* Use SVG icons (no emojis)
* Icons + labels always visible

### **Tabs**

1. **Accounts** (active)
2. **Pay & Transfer**
3. **Deposit Checks**
4. **Services**

#### **Active State**

* Red icon + label
* `aria-current="page"`

---

## **7. Interaction & Motion (NEW)**

* Expand/collapse animations:

  * Ease-in-out
  * ~250ms duration
* Chevron rotation synced with expansion
* Button press feedback (opacity or scale)
* Skeleton loaders for:

  * Account balances
  * Card data
* Graceful empty states if no accounts are available

---

## **8. Accessibility & Usability (Enhanced)**

* Minimum tap target: **44×44 px**
* Color contrast WCAG AA+
* Full keyboard navigation support
* Screen reader labels for:

  * Icons
  * Buttons
  * Expandable rows
* Focus rings visible and styled

---

## **9. Error, Loading & Edge States (NEW)**

* Loading skeletons while fetching balances
* Friendly empty states (e.g. “No accounts available”)
* Error banner for failed data loads
* Retry action where applicable

---

## **Final Goal**

The UI should feel:

* **Trustworthy**
* **Calm**
* **Efficient**
* **Enterprise-grade**

This is not a “fintech toy” — it should resemble a real, production banking app used daily by business owners.

