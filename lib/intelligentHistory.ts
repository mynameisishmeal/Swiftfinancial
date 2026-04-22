export interface IntelligentHistoryOptions {
  profile: 'military' | 'corporate' | 'freelancer' | 'student' | 'retiree' | 'business_owner' | 'healthcare' | 'tech_worker';
  totalAmount: number;
  timeframe: string;
  location?: 'domestic' | 'international' | 'deployed';
  lifestyle?: 'frugal' | 'moderate' | 'luxury';
}

interface TransactionPattern {
  categories: { name: string; weight: number; avgAmount: number }[];
  frequency: number; // transactions per month
  incomePattern: { amount: number; frequency: string; description: string }[];
  specialEvents: { name: string; amount: number; month?: number }[];
}

const PROFILES: Record<string, TransactionPattern> = {
  military: {
    categories: [
      { name: 'Military Pay', weight: 0.4, avgAmount: 3500 },
      { name: 'Groceries', weight: 0.15, avgAmount: 150 },
      { name: 'Gas/Fuel', weight: 0.1, avgAmount: 80 },
      { name: 'Utilities', weight: 0.08, avgAmount: 120 },
      { name: 'Insurance', weight: 0.07, avgAmount: 200 },
      { name: 'Dining', weight: 0.05, avgAmount: 40 },
      { name: 'Entertainment', weight: 0.03, avgAmount: 50 },
      { name: 'Healthcare', weight: 0.02, avgAmount: 30 },
      { name: 'Online Shopping', weight: 0.05, avgAmount: 100 },
      { name: 'Savings Transfer', weight: 0.05, avgAmount: 500 }
    ],
    frequency: 35,
    incomePattern: [
      { amount: 3500, frequency: 'monthly', description: 'Military Base Pay' },
      { amount: 400, frequency: 'monthly', description: 'BAH Allowance' },
      { amount: 250, frequency: 'monthly', description: 'BAS Allowance' }
    ],
    specialEvents: [
      { name: 'Deployment Bonus', amount: 2000, month: 3 },
      { name: 'Re-enlistment Bonus', amount: 5000, month: 8 }
    ]
  },
  corporate: {
    categories: [
      { name: 'Salary Deposit', weight: 0.35, avgAmount: 5000 },
      { name: 'Groceries', weight: 0.12, avgAmount: 200 },
      { name: 'Dining', weight: 0.1, avgAmount: 80 },
      { name: 'Transportation', weight: 0.08, avgAmount: 150 },
      { name: 'Utilities', weight: 0.06, avgAmount: 180 },
      { name: 'Rent/Mortgage', weight: 0.15, avgAmount: 1800 },
      { name: 'Entertainment', weight: 0.05, avgAmount: 120 },
      { name: 'Shopping', weight: 0.04, avgAmount: 200 },
      { name: 'Gym/Fitness', weight: 0.02, avgAmount: 80 },
      { name: 'Subscriptions', weight: 0.03, avgAmount: 50 }
    ],
    frequency: 45,
    incomePattern: [
      { amount: 5000, frequency: 'bi-weekly', description: 'Salary Direct Deposit' },
      { amount: 1200, frequency: 'quarterly', description: 'Quarterly Bonus' }
    ],
    specialEvents: [
      { name: 'Annual Bonus', amount: 8000, month: 12 },
      { name: 'Tax Refund', amount: 2500, month: 4 }
    ]
  },
  freelancer: {
    categories: [
      { name: 'Client Payment', weight: 0.4, avgAmount: 2500 },
      { name: 'Groceries', weight: 0.1, avgAmount: 180 },
      { name: 'Coffee Shops', weight: 0.08, avgAmount: 40 },
      { name: 'Software/Tools', weight: 0.07, avgAmount: 150 },
      { name: 'Internet/Phone', weight: 0.05, avgAmount: 120 },
      { name: 'Coworking Space', weight: 0.06, avgAmount: 300 },
      { name: 'Dining', weight: 0.06, avgAmount: 60 },
      { name: 'Transportation', weight: 0.04, avgAmount: 100 },
      { name: 'Healthcare', weight: 0.08, avgAmount: 400 },
      { name: 'Business Expenses', weight: 0.06, avgAmount: 200 }
    ],
    frequency: 40,
    incomePattern: [
      { amount: 2500, frequency: 'irregular', description: 'Project Payment' },
      { amount: 1800, frequency: 'irregular', description: 'Consulting Fee' },
      { amount: 800, frequency: 'monthly', description: 'Retainer Client' }
    ],
    specialEvents: [
      { name: 'Large Project Payment', amount: 10000, month: 6 },
      { name: 'Conference Speaking Fee', amount: 3000, month: 9 }
    ]
  },
  student: {
    categories: [
      { name: 'Student Loan Disbursement', weight: 0.3, avgAmount: 3000 },
      { name: 'Part-time Job', weight: 0.15, avgAmount: 800 },
      { name: 'Groceries', weight: 0.12, avgAmount: 120 },
      { name: 'Dining/Fast Food', weight: 0.1, avgAmount: 50 },
      { name: 'Textbooks', weight: 0.08, avgAmount: 200 },
      { name: 'Entertainment', weight: 0.08, avgAmount: 60 },
      { name: 'Transportation', weight: 0.05, avgAmount: 40 },
      { name: 'Subscriptions', weight: 0.04, avgAmount: 30 },
      { name: 'Coffee/Snacks', weight: 0.05, avgAmount: 25 },
      { name: 'Utilities', weight: 0.03, avgAmount: 80 }
    ],
    frequency: 30,
    incomePattern: [
      { amount: 800, frequency: 'bi-weekly', description: 'Part-time Work' },
      { amount: 3000, frequency: 'semester', description: 'Student Loan' },
      { amount: 500, frequency: 'monthly', description: 'Parent Support' }
    ],
    specialEvents: [
      { name: 'Summer Internship', amount: 5000, month: 7 },
      { name: 'Scholarship', amount: 2000, month: 9 }
    ]
  },
  retiree: {
    categories: [
      { name: 'Pension/Social Security', weight: 0.35, avgAmount: 2800 },
      { name: 'Groceries', weight: 0.15, avgAmount: 180 },
      { name: 'Healthcare/Pharmacy', weight: 0.12, avgAmount: 300 },
      { name: 'Utilities', weight: 0.08, avgAmount: 150 },
      { name: 'Dining', weight: 0.08, avgAmount: 70 },
      { name: 'Entertainment', weight: 0.06, avgAmount: 100 },
      { name: 'Travel', weight: 0.08, avgAmount: 500 },
      { name: 'Insurance', weight: 0.05, avgAmount: 250 },
      { name: 'Gifts/Family', weight: 0.02, avgAmount: 150 },
      { name: 'Home Maintenance', weight: 0.01, avgAmount: 200 }
    ],
    frequency: 25,
    incomePattern: [
      { amount: 2800, frequency: 'monthly', description: 'Social Security' },
      { amount: 1500, frequency: 'monthly', description: 'Pension' },
      { amount: 400, frequency: 'quarterly', description: 'Investment Dividends' }
    ],
    specialEvents: [
      { name: 'Tax Refund', amount: 3000, month: 4 },
      { name: 'Holiday Travel', amount: -2500, month: 11 }
    ]
  },
  business_owner: {
    categories: [
      { name: 'Business Revenue', weight: 0.4, avgAmount: 8000 },
      { name: 'Payroll', weight: 0.15, avgAmount: -5000 },
      { name: 'Business Expenses', weight: 0.1, avgAmount: -1200 },
      { name: 'Groceries', weight: 0.08, avgAmount: 250 },
      { name: 'Dining/Client Meals', weight: 0.07, avgAmount: 200 },
      { name: 'Utilities', weight: 0.05, avgAmount: 300 },
      { name: 'Transportation', weight: 0.05, avgAmount: 180 },
      { name: 'Insurance', weight: 0.04, avgAmount: 500 },
      { name: 'Marketing', weight: 0.03, avgAmount: 800 },
      { name: 'Equipment', weight: 0.03, avgAmount: 600 }
    ],
    frequency: 50,
    incomePattern: [
      { amount: 8000, frequency: 'irregular', description: 'Business Revenue' },
      { amount: 12000, frequency: 'irregular', description: 'Large Contract' },
      { amount: 3000, frequency: 'monthly', description: 'Recurring Clients' }
    ],
    specialEvents: [
      { name: 'Major Contract', amount: 50000, month: 5 },
      { name: 'Equipment Purchase', amount: -15000, month: 8 },
      { name: 'Year-end Bonus', amount: 20000, month: 12 }
    ]
  },
  healthcare: {
    categories: [
      { name: 'Salary Deposit', weight: 0.35, avgAmount: 6500 },
      { name: 'Groceries', weight: 0.12, avgAmount: 220 },
      { name: 'Dining', weight: 0.08, avgAmount: 90 },
      { name: 'Transportation', weight: 0.07, avgAmount: 120 },
      { name: 'Utilities', weight: 0.06, avgAmount: 200 },
      { name: 'Rent/Mortgage', weight: 0.15, avgAmount: 2200 },
      { name: 'Healthcare', weight: 0.05, avgAmount: 150 },
      { name: 'Professional Dues', weight: 0.03, avgAmount: 200 },
      { name: 'Continuing Education', weight: 0.04, avgAmount: 300 },
      { name: 'Entertainment', weight: 0.05, avgAmount: 100 }
    ],
    frequency: 40,
    incomePattern: [
      { amount: 6500, frequency: 'bi-weekly', description: 'Salary' },
      { amount: 2000, frequency: 'monthly', description: 'Overtime/On-call' },
      { amount: 1500, frequency: 'quarterly', description: 'Performance Bonus' }
    ],
    specialEvents: [
      { name: 'Annual Bonus', amount: 10000, month: 12 },
      { name: 'CME Conference', amount: -2000, month: 6 }
    ]
  },
  tech_worker: {
    categories: [
      { name: 'Salary Deposit', weight: 0.35, avgAmount: 8000 },
      { name: 'Groceries', weight: 0.1, avgAmount: 200 },
      { name: 'Dining/Delivery', weight: 0.1, avgAmount: 150 },
      { name: 'Rent/Mortgage', weight: 0.18, avgAmount: 2800 },
      { name: 'Tech/Gadgets', weight: 0.06, avgAmount: 400 },
      { name: 'Subscriptions', weight: 0.04, avgAmount: 100 },
      { name: 'Transportation/Uber', weight: 0.05, avgAmount: 120 },
      { name: 'Entertainment', weight: 0.04, avgAmount: 150 },
      { name: 'Gym/Fitness', weight: 0.03, avgAmount: 100 },
      { name: 'Online Shopping', weight: 0.05, avgAmount: 250 }
    ],
    frequency: 48,
    incomePattern: [
      { amount: 8000, frequency: 'bi-weekly', description: 'Salary' },
      { amount: 5000, frequency: 'quarterly', description: 'RSU Vesting' },
      { amount: 2000, frequency: 'quarterly', description: 'Performance Bonus' }
    ],
    specialEvents: [
      { name: 'Annual Bonus', amount: 15000, month: 3 },
      { name: 'Stock Options Exercise', amount: 30000, month: 9 },
      { name: 'Conference Travel', amount: -1500, month: 10 }
    ]
  }
};

export function generateIntelligentHistory(options: IntelligentHistoryOptions): any[] {
  const { profile, totalAmount, timeframe, location = 'domestic', lifestyle = 'moderate' } = options;
  
  const pattern = PROFILES[profile];
  if (!pattern) return [];

  const months = getMonthsFromTimeframe(timeframe);
  const transactions: any[] = [];
  let currentBalance = 0;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // Lifestyle multipliers
  const lifestyleMultiplier = lifestyle === 'frugal' ? 0.7 : lifestyle === 'luxury' ? 1.5 : 1;

  // Generate transactions month by month
  for (let month = 0; month < months; month++) {
    const monthDate = new Date(startDate);
    monthDate.setMonth(monthDate.getMonth() + month);
    
    // Add income transactions
    pattern.incomePattern.forEach(income => {
      if (shouldAddIncome(income.frequency, month)) {
        const amount = income.amount * (0.95 + Math.random() * 0.1);
        currentBalance += amount;
        transactions.push({
          type: 'deposit',
          amount: Math.round(amount * 100) / 100,
          date: getRandomDateInMonth(monthDate).toISOString(),
          balance: Math.round(currentBalance * 100) / 100,
          description: income.description,
          category: 'Income'
        });
      }
    });

    // Add special events
    pattern.specialEvents.forEach(event => {
      if (event.month === month + 1 || (!event.month && Math.random() < 0.1)) {
        currentBalance += event.amount;
        transactions.push({
          type: event.amount > 0 ? 'deposit' : 'withdrawal',
          amount: Math.abs(Math.round(event.amount * 100) / 100),
          date: getRandomDateInMonth(monthDate).toISOString(),
          balance: Math.round(currentBalance * 100) / 100,
          description: event.name,
          category: event.amount > 0 ? 'Income' : 'Special'
        });
      }
    });

    // Add regular transactions
    const txPerMonth = Math.floor(pattern.frequency * (0.8 + Math.random() * 0.4));
    for (let i = 0; i < txPerMonth; i++) {
      const category = selectCategory(pattern.categories);
      if (category.name.includes('Deposit') || category.name.includes('Pay') || category.name.includes('Salary')) continue;
      
      const amount = category.avgAmount * lifestyleMultiplier * (0.7 + Math.random() * 0.6);
      currentBalance -= amount;
      
      transactions.push({
        type: 'withdrawal',
        amount: Math.round(amount * 100) / 100,
        date: getRandomDateInMonth(monthDate).toISOString(),
        balance: Math.round(currentBalance * 100) / 100,
        description: generateDescription(category.name, location),
        category: category.name
      });
    }
  }

  // Sort by date
  transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Adjust to match target amount
  const finalBalance = transactions[transactions.length - 1]?.balance || 0;
  const adjustment = totalAmount - finalBalance;
  
  if (Math.abs(adjustment) > 100) {
    transactions.forEach(tx => {
      tx.balance += adjustment;
      tx.balance = Math.round(tx.balance * 100) / 100;
    });
  }

  return transactions;
}

function getMonthsFromTimeframe(timeframe: string): number {
  const map: Record<string, number> = {
    '1month': 1, '6months': 6, '1year': 12, '2years': 24,
    '3years': 36, '4years': 48, '5years': 60, '6years': 72
  };
  return map[timeframe] || 12;
}

function shouldAddIncome(frequency: string, month: number): boolean {
  if (frequency === 'monthly') return true;
  if (frequency === 'bi-weekly') return true;
  if (frequency === 'quarterly') return month % 3 === 0;
  if (frequency === 'semester') return month % 6 === 0;
  if (frequency === 'irregular') return Math.random() < 0.4;
  return false;
}

function selectCategory(categories: { name: string; weight: number }[]): { name: string; weight: number; avgAmount: number } {
  const random = Math.random();
  let cumulative = 0;
  
  for (const cat of categories) {
    cumulative += cat.weight;
    if (random <= cumulative) {
      return cat as any;
    }
  }
  
  return categories[0] as any;
}

function getRandomDateInMonth(monthDate: Date): Date {
  const day = Math.floor(Math.random() * 28) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  
  return new Date(monthDate.getFullYear(), monthDate.getMonth(), day, hour, minute);
}

function generateDescription(category: string, location: string): string {
  const descriptions: Record<string, string[]> = {
    'Groceries': ['Walmart', 'Target', 'Whole Foods', 'Kroger', 'Safeway', 'Trader Joes'],
    'Dining': ['Chipotle', 'Starbucks', 'McDonalds', 'Olive Garden', 'Local Restaurant', 'Pizza Hut'],
    'Gas/Fuel': ['Shell', 'Chevron', 'BP', 'Exxon', 'Mobil'],
    'Utilities': ['Electric Bill', 'Water Bill', 'Gas Bill', 'Internet Bill'],
    'Entertainment': ['Netflix', 'Spotify', 'Movie Theater', 'Concert Tickets', 'Gaming'],
    'Transportation': ['Uber', 'Lyft', 'Public Transit', 'Parking', 'Toll'],
    'Shopping': ['Amazon', 'Best Buy', 'Target', 'Macys', 'Online Store'],
    'Healthcare': ['Pharmacy', 'Doctor Visit', 'Dental', 'Vision', 'Medical Supply']
  };
  
  const options = descriptions[category] || [category];
  return options[Math.floor(Math.random() * options.length)];
}
