export interface MockHistoryOptions {
  totalAmount: number;
  timeframe: '1month' | '6months' | '1year' | '2years' | '3years' | '4years' | '5years' | '6years';
}

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
  
  // Generate 15-50 transactions
  const transactionCount = Math.floor(Math.random() * 35) + 15;
  const transactions = [];
  
  let currentBalance = 0;
  
  for (let i = 0; i < transactionCount; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (now.getTime() - startDate.getTime()));
    
    // 70% deposits, 30% withdrawals
    const isDeposit = Math.random() < 0.7;
    
    let amount;
    if (isDeposit) {
      // Deposits: 1-20% of total amount
      amount = Math.floor((Math.random() * 0.19 + 0.01) * totalAmount);
    } else {
      // Withdrawals: 1-10% of total amount, but not more than current balance
      const maxWithdraw = Math.min(currentBalance, totalAmount * 0.1);
      amount = maxWithdraw > 0 ? Math.floor(Math.random() * maxWithdraw) + 1 : 0;
    }
    
    if (amount > 0) {
      if (isDeposit) {
        currentBalance += amount;
      } else {
        currentBalance -= amount;
      }
      
      transactions.push({
        type: isDeposit ? 'deposit' : 'withdraw',
        amount,
        date: randomDate.toISOString(),
        balance: currentBalance,
        description: isDeposit ? getRandomDepositDescription() : getRandomWithdrawDescription()
      });
    }
  }
  
  // Sort by date
  transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Adjust final balance to match target
  const finalBalance = transactions[transactions.length - 1]?.balance || 0;
  const adjustment = totalAmount - finalBalance;
  
  if (adjustment !== 0) {
    transactions.push({
      type: adjustment > 0 ? 'deposit' : 'withdraw',
      amount: Math.abs(adjustment),
      date: now.toISOString(),
      balance: totalAmount,
      description: 'Balance adjustment'
    });
  }
  
  return transactions;
}

function getRandomDepositDescription(): string {
  const descriptions = [
    'Salary payment',
    'Freelance payment',
    'Investment return',
    'Bonus payment',
    'Refund',
    'Transfer from savings',
    'Gift received',
    'Commission payment',
    'Dividend payment',
    'Interest earned'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomWithdrawDescription(): string {
  const descriptions = [
    'ATM withdrawal',
    'Online purchase',
    'Grocery shopping',
    'Utility bill',
    'Restaurant payment',
    'Gas station',
    'Subscription fee',
    'Insurance payment',
    'Rent payment',
    'Medical expense'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}