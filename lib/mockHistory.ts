export interface MockHistoryOptions {
  totalAmount: number;
  timeframe: '1month' | '6months' | '1year' | '2years' | '3years' | '4years' | '5years' | '6years';
}

interface TransactionTemplate {
  type: 'deposit' | 'withdraw';
  description: string;
  merchant?: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  frequency: number; // 0-1, how often this transaction type occurs
}

const depositTemplates: TransactionTemplate[] = [
  { type: 'deposit', description: 'Direct Deposit - Salary', merchant: 'PAYROLL DEPT', category: 'Income', minAmount: 2500, maxAmount: 8000, frequency: 0.3 },
  { type: 'deposit', description: 'Direct Deposit - Paycheck', merchant: 'EMPLOYER INC', category: 'Income', minAmount: 1500, maxAmount: 5000, frequency: 0.25 },
  { type: 'deposit', description: 'Freelance Payment', merchant: 'UPWORK', category: 'Income', minAmount: 500, maxAmount: 3000, frequency: 0.1 },
  { type: 'deposit', description: 'Freelance Payment', merchant: 'FIVERR', category: 'Income', minAmount: 200, maxAmount: 1500, frequency: 0.08 },
  { type: 'deposit', description: 'Investment Return', merchant: 'VANGUARD', category: 'Investment', minAmount: 100, maxAmount: 2000, frequency: 0.05 },
  { type: 'deposit', description: 'Dividend Payment', merchant: 'CHARLES SCHWAB', category: 'Investment', minAmount: 50, maxAmount: 800, frequency: 0.04 },
  { type: 'deposit', description: 'Bonus Payment', merchant: 'EMPLOYER INC', category: 'Income', minAmount: 1000, maxAmount: 5000, frequency: 0.02 },
  { type: 'deposit', description: 'Tax Refund', merchant: 'IRS TREAS 310', category: 'Income', minAmount: 500, maxAmount: 3000, frequency: 0.01 },
  { type: 'deposit', description: 'Cashback Reward', merchant: 'CREDIT CARD REWARDS', category: 'Rewards', minAmount: 25, maxAmount: 200, frequency: 0.05 },
  { type: 'deposit', description: 'Zelle Transfer', merchant: 'ZELLE FROM JOHN DOE', category: 'Transfer', minAmount: 50, maxAmount: 1000, frequency: 0.08 },
  { type: 'deposit', description: 'Venmo Transfer', merchant: 'VENMO', category: 'Transfer', minAmount: 20, maxAmount: 500, frequency: 0.06 },
  { type: 'deposit', description: 'Check Deposit', merchant: 'MOBILE DEPOSIT', category: 'Deposit', minAmount: 100, maxAmount: 2000, frequency: 0.04 },
  { type: 'deposit', description: 'Interest Earned', merchant: 'SWIFT FINANCIAL', category: 'Interest', minAmount: 5, maxAmount: 100, frequency: 0.03 },
  { type: 'deposit', description: 'Refund', merchant: 'AMAZON.COM', category: 'Refund', minAmount: 20, maxAmount: 500, frequency: 0.03 },
  { type: 'deposit', description: 'Refund', merchant: 'WALMART', category: 'Refund', minAmount: 15, maxAmount: 300, frequency: 0.02 },
];

const withdrawTemplates: TransactionTemplate[] = [
  // Groceries & Food
  { type: 'withdraw', description: 'Grocery Purchase', merchant: 'WHOLE FOODS', category: 'Groceries', minAmount: 50, maxAmount: 250, frequency: 0.08 },
  { type: 'withdraw', description: 'Grocery Purchase', merchant: 'TRADER JOES', category: 'Groceries', minAmount: 40, maxAmount: 180, frequency: 0.07 },
  { type: 'withdraw', description: 'Grocery Purchase', merchant: 'WALMART SUPERCENTER', category: 'Groceries', minAmount: 60, maxAmount: 300, frequency: 0.09 },
  { type: 'withdraw', description: 'Grocery Purchase', merchant: 'TARGET', category: 'Groceries', minAmount: 45, maxAmount: 200, frequency: 0.06 },
  { type: 'withdraw', description: 'Restaurant', merchant: 'CHIPOTLE', category: 'Dining', minAmount: 12, maxAmount: 45, frequency: 0.05 },
  { type: 'withdraw', description: 'Restaurant', merchant: 'STARBUCKS', category: 'Dining', minAmount: 5, maxAmount: 25, frequency: 0.08 },
  { type: 'withdraw', description: 'Restaurant', merchant: 'MCDONALDS', category: 'Dining', minAmount: 8, maxAmount: 30, frequency: 0.04 },
  { type: 'withdraw', description: 'Restaurant', merchant: 'OLIVE GARDEN', category: 'Dining', minAmount: 35, maxAmount: 120, frequency: 0.03 },
  { type: 'withdraw', description: 'Fast Food', merchant: 'SUBWAY', category: 'Dining', minAmount: 8, maxAmount: 25, frequency: 0.03 },
  { type: 'withdraw', description: 'Coffee Shop', merchant: 'DUNKIN DONUTS', category: 'Dining', minAmount: 4, maxAmount: 15, frequency: 0.04 },
  
  // Shopping
  { type: 'withdraw', description: 'Online Purchase', merchant: 'AMAZON.COM', category: 'Shopping', minAmount: 20, maxAmount: 500, frequency: 0.1 },
  { type: 'withdraw', description: 'Online Purchase', merchant: 'EBAY', category: 'Shopping', minAmount: 15, maxAmount: 300, frequency: 0.03 },
  { type: 'withdraw', description: 'Retail Purchase', merchant: 'BEST BUY', category: 'Electronics', minAmount: 50, maxAmount: 800, frequency: 0.02 },
  { type: 'withdraw', description: 'Retail Purchase', merchant: 'HOME DEPOT', category: 'Home', minAmount: 30, maxAmount: 400, frequency: 0.03 },
  { type: 'withdraw', description: 'Clothing', merchant: 'NIKE STORE', category: 'Shopping', minAmount: 40, maxAmount: 250, frequency: 0.02 },
  { type: 'withdraw', description: 'Clothing', merchant: 'H&M', category: 'Shopping', minAmount: 25, maxAmount: 150, frequency: 0.02 },
  
  // Bills & Utilities
  { type: 'withdraw', description: 'Rent Payment', merchant: 'PROPERTY MANAGEMENT', category: 'Housing', minAmount: 800, maxAmount: 2500, frequency: 0.05 },
  { type: 'withdraw', description: 'Electric Bill', merchant: 'ELECTRIC COMPANY', category: 'Utilities', minAmount: 60, maxAmount: 200, frequency: 0.04 },
  { type: 'withdraw', description: 'Internet Service', merchant: 'COMCAST', category: 'Utilities', minAmount: 50, maxAmount: 120, frequency: 0.03 },
  { type: 'withdraw', description: 'Phone Bill', merchant: 'VERIZON WIRELESS', category: 'Utilities', minAmount: 40, maxAmount: 150, frequency: 0.03 },
  { type: 'withdraw', description: 'Water Bill', merchant: 'WATER UTILITY', category: 'Utilities', minAmount: 30, maxAmount: 80, frequency: 0.02 },
  { type: 'withdraw', description: 'Gas Bill', merchant: 'GAS COMPANY', category: 'Utilities', minAmount: 40, maxAmount: 150, frequency: 0.02 },
  
  // Transportation
  { type: 'withdraw', description: 'Gas Station', merchant: 'SHELL', category: 'Transportation', minAmount: 30, maxAmount: 80, frequency: 0.06 },
  { type: 'withdraw', description: 'Gas Station', merchant: 'CHEVRON', category: 'Transportation', minAmount: 35, maxAmount: 85, frequency: 0.05 },
  { type: 'withdraw', description: 'Gas Station', merchant: 'EXXON', category: 'Transportation', minAmount: 30, maxAmount: 75, frequency: 0.04 },
  { type: 'withdraw', description: 'Parking', merchant: 'PARKING GARAGE', category: 'Transportation', minAmount: 10, maxAmount: 40, frequency: 0.02 },
  { type: 'withdraw', description: 'Uber Ride', merchant: 'UBER', category: 'Transportation', minAmount: 12, maxAmount: 60, frequency: 0.04 },
  { type: 'withdraw', description: 'Lyft Ride', merchant: 'LYFT', category: 'Transportation', minAmount: 10, maxAmount: 55, frequency: 0.03 },
  
  // Subscriptions
  { type: 'withdraw', description: 'Subscription', merchant: 'NETFLIX', category: 'Entertainment', minAmount: 10, maxAmount: 20, frequency: 0.03 },
  { type: 'withdraw', description: 'Subscription', merchant: 'SPOTIFY', category: 'Entertainment', minAmount: 10, maxAmount: 15, frequency: 0.03 },
  { type: 'withdraw', description: 'Subscription', merchant: 'AMAZON PRIME', category: 'Shopping', minAmount: 12, maxAmount: 15, frequency: 0.02 },
  { type: 'withdraw', description: 'Subscription', merchant: 'DISNEY PLUS', category: 'Entertainment', minAmount: 8, maxAmount: 14, frequency: 0.02 },
  { type: 'withdraw', description: 'Subscription', merchant: 'GYM MEMBERSHIP', category: 'Health', minAmount: 25, maxAmount: 80, frequency: 0.03 },
  
  // Healthcare
  { type: 'withdraw', description: 'Pharmacy', merchant: 'CVS PHARMACY', category: 'Healthcare', minAmount: 15, maxAmount: 150, frequency: 0.03 },
  { type: 'withdraw', description: 'Pharmacy', merchant: 'WALGREENS', category: 'Healthcare', minAmount: 12, maxAmount: 120, frequency: 0.02 },
  { type: 'withdraw', description: 'Medical Payment', merchant: 'DOCTORS OFFICE', category: 'Healthcare', minAmount: 50, maxAmount: 300, frequency: 0.02 },
  { type: 'withdraw', description: 'Insurance Premium', merchant: 'HEALTH INSURANCE', category: 'Insurance', minAmount: 200, maxAmount: 600, frequency: 0.02 },
  
  // ATM & Transfers
  { type: 'withdraw', description: 'ATM Withdrawal', merchant: 'SWIFT FINANCIAL ATM', category: 'Cash', minAmount: 20, maxAmount: 200, frequency: 0.05 },
  { type: 'withdraw', description: 'ATM Withdrawal', merchant: 'ATM', category: 'Cash', minAmount: 40, maxAmount: 300, frequency: 0.04 },
  { type: 'withdraw', description: 'Zelle Transfer', merchant: 'ZELLE TO JANE SMITH', category: 'Transfer', minAmount: 50, maxAmount: 500, frequency: 0.03 },
  { type: 'withdraw', description: 'Venmo Payment', merchant: 'VENMO', category: 'Transfer', minAmount: 20, maxAmount: 200, frequency: 0.03 },
];

export function generateMockTransactions(options: MockHistoryOptions) {
  const { totalAmount, timeframe } = options;
  
  const now = new Date();
  const timeframeMap: Record<string, number> = {
    '1month': 30,
    '6months': 180,
    '1year': 365,
    '2years': 730,
    '3years': 1095,
    '4years': 1460,
    '5years': 1825,
    '6years': 2190
  };
  
  const days = timeframeMap[timeframe];
  const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  
  // Generate more transactions for longer timeframes (50-200 transactions)
  const baseTransactionCount = Math.floor(days / 7); // Roughly weekly transactions
  const transactionCount = Math.min(200, Math.max(50, baseTransactionCount + Math.floor(Math.random() * 30)));
  
  const transactions = [];
  let currentBalance = 0;
  
  // Calculate total frequency weights
  const depositWeight = depositTemplates.reduce((sum, t) => sum + t.frequency, 0);
  const withdrawWeight = withdrawTemplates.reduce((sum, t) => sum + t.frequency, 0);
  
  for (let i = 0; i < transactionCount; i++) {
    // Generate random date within timeframe
    const randomDate = new Date(startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime()));
    
    // 65% deposits, 35% withdrawals to build up balance
    const isDeposit = Math.random() < 0.65;
    
    let template: TransactionTemplate;
    
    if (isDeposit) {
      // Weighted random selection of deposit template
      let random = Math.random() * depositWeight;
      template = depositTemplates[0];
      for (const t of depositTemplates) {
        random -= t.frequency;
        if (random <= 0) {
          template = t;
          break;
        }
      }
    } else {
      // Weighted random selection of withdraw template
      let random = Math.random() * withdrawWeight;
      template = withdrawTemplates[0];
      for (const t of withdrawTemplates) {
        random -= t.frequency;
        if (random <= 0) {
          template = t;
          break;
        }
      }
    }
    
    // Calculate amount based on template and scale to total amount
    const scaleFactor = totalAmount / 100000; // Scale based on target amount
    let amount = Math.floor(
      (template.minAmount + Math.random() * (template.maxAmount - template.minAmount)) * scaleFactor
    );
    
    // Ensure minimum amount of $1
    amount = Math.max(1, amount);
    
    // For withdrawals, don't exceed current balance
    if (!isDeposit && amount > currentBalance) {
      amount = Math.floor(currentBalance * 0.8); // Take max 80% of balance
    }
    
    if (amount > 0) {
      if (isDeposit) {
        currentBalance += amount;
      } else {
        currentBalance -= amount;
      }
      
      transactions.push({
        type: template.type,
        amount,
        date: randomDate.toISOString(),
        balance: currentBalance,
        description: template.merchant ? `${template.description} - ${template.merchant}` : template.description,
        category: template.category,
        merchant: template.merchant || 'N/A'
      });
    }
  }
  
  // Sort by date
  transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Recalculate balances after sorting
  let runningBalance = 0;
  transactions.forEach(t => {
    if (t.type === 'deposit') {
      runningBalance += t.amount;
    } else {
      runningBalance -= t.amount;
    }
    t.balance = runningBalance;
  });
  
  // Adjust final balance to match target
  const finalBalance = transactions[transactions.length - 1]?.balance || 0;
  const adjustment = totalAmount - finalBalance;
  
  if (Math.abs(adjustment) > 1) {
    transactions.push({
      type: adjustment > 0 ? 'deposit' : 'withdraw',
      amount: Math.abs(adjustment),
      date: now.toISOString(),
      balance: totalAmount,
      description: adjustment > 0 ? 'Direct Deposit - Salary - EMPLOYER INC' : 'Balance Adjustment',
      category: adjustment > 0 ? 'Income' : 'Adjustment',
      merchant: adjustment > 0 ? 'EMPLOYER INC' : 'SWIFT FINANCIAL'
    });
  }
  
  return transactions;
}
