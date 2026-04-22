import { NextRequest, NextResponse } from 'next/server';

// Simple intent classification using keyword matching and scoring
function classifyIntent(message: string): { intent: string; confidence: number; entities: any } {
  const lower = message.toLowerCase();
  const words = lower.split(/\s+/);
  
  const intents: Array<{
    name: string;
    keywords: string[];
    weight: Record<string, number>;
  }> = [
    {
      name: 'check_balance',
      keywords: ['balance', 'how much', 'money', 'funds', 'account'],
      weight: { balance: 3, 'how much': 3, money: 2, funds: 2, account: 1 }
    },
    {
      name: 'transfer_money',
      keywords: ['transfer', 'send', 'pay', 'move', 'wire'],
      weight: { transfer: 3, send: 3, pay: 2, move: 2, wire: 2 }
    },
    {
      name: 'transfer_problem',
      keywords: ['can\'t', 'cannot', 'unable', 'problem', 'issue', 'error', 'not working', 'won\'t'],
      weight: { 'can\'t': 3, cannot: 3, unable: 3, problem: 3, issue: 3, error: 3, 'not working': 4, 'won\'t': 3 }
    },
    {
      name: 'affirmative',
      keywords: ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'please', 'guide'],
      weight: { yes: 3, yeah: 3, yep: 3, sure: 2, ok: 2, okay: 2, please: 2, guide: 3 }
    },
    {
      name: 'zelle',
      keywords: ['zelle', 'instant', 'quick pay'],
      weight: { zelle: 5, instant: 2, 'quick pay': 4 }
    },
    {
      name: 'bill_pay',
      keywords: ['bill', 'payee', 'utility', 'payment'],
      weight: { bill: 3, payee: 3, utility: 2, payment: 2 }
    },
    {
      name: 'wire_transfer',
      keywords: ['wire', 'international', 'routing', 'swift'],
      weight: { wire: 3, international: 2, routing: 2, swift: 3 }
    },
    {
      name: 'statement',
      keywords: ['statement', 'download', 'history', 'transactions'],
      weight: { statement: 3, download: 2, history: 2, transactions: 2 }
    },
    {
      name: 'credit_card',
      keywords: ['card', 'credit', 'visa', 'mastercard'],
      weight: { card: 2, credit: 3, visa: 3, mastercard: 3 }
    },
    {
      name: 'rewards',
      keywords: ['reward', 'points', 'redeem', 'cashback'],
      weight: { reward: 3, points: 3, redeem: 3, cashback: 3 }
    },
    {
      name: 'greeting',
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      weight: { hello: 3, hi: 3, hey: 3, 'good morning': 4, 'good afternoon': 4 }
    },
    {
      name: 'thanks',
      keywords: ['thank', 'thanks', 'appreciate'],
      weight: { thank: 3, thanks: 3, appreciate: 3 }
    },
    {
      name: 'help',
      keywords: ['help', 'support', 'assist', 'what can you'],
      weight: { help: 3, support: 3, assist: 3, 'what can you': 4 }
    },
    {
      name: 'live_chat',
      keywords: ['live chat', 'talk to human', 'speak to agent', 'customer service', 'representative', 'real person'],
      weight: { 'live chat': 5, 'talk to human': 5, 'speak to agent': 5, 'customer service': 4, representative: 3, 'real person': 4 }
    }
  ];

  let bestIntent = { name: 'unknown', score: 0 };
  
  for (const intent of intents) {
    let score = 0;
    for (const keyword of intent.keywords) {
      if (lower.includes(keyword)) {
        score += (intent.weight[keyword] as number) || 1;
      }
    }
    if (score > bestIntent.score) {
      bestIntent = { name: intent.name, score };
    }
  }

  // Extract entities
  const entities: any = {};
  
  // Extract amounts
  const amountMatch = message.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (amountMatch) entities.amount = amountMatch[1];
  
  // Extract email
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) entities.email = emailMatch[0];
  
  // Extract phone
  const phoneMatch = message.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) entities.phone = phoneMatch[0];

  const confidence = Math.min(bestIntent.score / 5, 1);
  
  return {
    intent: bestIntent.name,
    confidence,
    entities
  };
}

// Generate contextual response based on intent and conversation history
function generateResponse(
  intent: string,
  confidence: number,
  entities: any,
  userMessage: string,
  conversationHistory: any[],
  userData: any
): string {
  const { balance, savingsBalance, creditBalance, taxCleared } = userData;

  // Check previous context
  const prevAssistantMsg = conversationHistory.length > 1 
    ? conversationHistory[conversationHistory.length - 2]?.message?.toLowerCase() || ''
    : '';

  switch (intent) {
    case 'check_balance':
      return `Your current checking balance is $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Your savings balance is $${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Is there anything else I can help you with?`;

    case 'affirmative':
      if (prevAssistantMsg.includes('transfer') || prevAssistantMsg.includes('guide')) {
        return "Perfect! I've opened the Pay & Transfer page for you. Here's how to make a transfer:\n\n1. Select your payment type (Transfer, Bill Pay, Zelle, or Wire)\n2. Enter the amount you want to send\n3. Add a description (optional)\n4. Click 'Continue' to complete\n\nNeed help with a specific type of transfer?";
      }
      return "Great! What would you like me to help you with?";

    case 'transfer_money':
      return "I can help you transfer money! Click on 'Pay & Transfer' in the menu to get started. Would you like me to guide you through it?";

    case 'transfer_problem':
      const problemLower = userMessage.toLowerCase();
      if (problemLower.includes('transfer') || problemLower.includes('send') || problemLower.includes('pay')) {
        return `I'm sorry you're having trouble with transfers. Let me help you troubleshoot:\n\n• Make sure you have sufficient funds in your account\n• Check that all required fields are filled out\n• Verify the recipient information is correct\n\nYour current balance is $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Would you like me to open the transfer page for you?`;
      }
      return "I'm sorry you're experiencing an issue. Can you tell me more about what's not working? I'm here to help with:\n\n• Account access\n• Transfers and payments\n• Statement downloads\n• Account information\n\nWhat specifically can I assist you with?";

    case 'zelle':
      if (!taxCleared) {
        return "I see you're interested in Zelle. However, your account currently has a restriction due to outstanding tax issues. Please resolve these issues first, or contact support for assistance.";
      }
      return "Zelle is a great way to send money instantly! To use Zelle:\n\n1. Go to Pay & Transfer\n2. Select 'Send Money with Zelle'\n3. Enter recipient's email or phone\n4. Enter amount and description\n5. Confirm and send\n\nWould you like me to open the Zelle page for you?";

    case 'bill_pay':
      return "You can pay bills to over 55 companies including utilities, internet, phone services, credit cards, and more. Just go to Pay & Transfer, select 'Pay Bill', and search for your payee. Need help finding a specific company?";

    case 'wire_transfer':
      return "Wire transfers let you send money to banks worldwide. We support 108+ international banks. To send a wire:\n\n1. Go to Pay & Transfer\n2. Select 'Wire Transfer'\n3. Search for the recipient bank\n4. Enter routing and account numbers\n5. Enter amount and confirm\n\nWould you like to start a wire transfer?";

    case 'statement':
      return "You can download your account statement by going to your account details and clicking the 'Statement' button, or visit the dedicated Statements page. Would you like me to show you where?";

    case 'credit_card':
      return `Your credit card balance is $${creditBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. You have 15,000 rewards points available (worth approximately $150). Need help with anything else?`;

    case 'rewards':
      return "You currently have 15,000 rewards points, which equals approximately $150 in value. You can redeem these for cash back, travel, gift cards, or statement credits. Would you like to see your rewards options?";

    case 'greeting':
      return `Hello! I'm Erica, your virtual financial assistant. Your checking balance is $${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. How can I help you today?`;

    case 'thanks':
      return "You're welcome! Is there anything else I can help you with today?";

    case 'help':
      return "I'm here to help! You can ask me about:\n\n• Account balances and details\n• Making transfers and payments\n• Downloading statements\n• Credit card and rewards info\n• Zelle, wire transfers, and bill pay\n• Troubleshooting issues\n\nIf you need to speak with a human agent, just ask for live chat!\n\nWhat would you like to know?";

    case 'live_chat':
      return "I'd be happy to connect you with a live agent! Click on 'More' in the menu, then select 'Live Chat' to start a conversation with our support team. They're available to help you with any questions or concerns.";

    default:
      if (confidence < 0.3) {
        return "I'm not quite sure what you're asking. I can help you with:\n\n• Checking balances\n• Making transfers and payments\n• Downloading statements\n• Account information\n• Rewards and credit cards\n\nCould you rephrase your question?";
      }
      return "I'm Erica, your virtual financial assistant. I can help you with:\n\n• Checking balances\n• Making transfers and payments\n• Downloading statements\n• Account information\n• Rewards and credit cards\n\nWhat can I help you with today?";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory, userData } = await req.json();

    if (!message || !userData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Classify intent using simple ML-like approach
    const { intent, confidence, entities } = classifyIntent(message);

    // Generate contextual response
    const response = generateResponse(
      intent,
      confidence,
      entities,
      message,
      conversationHistory || [],
      userData
    );

    // Determine if action should be taken
    let action = null;
    if (intent === 'live_chat') {
      action = { type: 'navigate', target: 'livechat' };
    } else if (intent === 'affirmative' && conversationHistory.length > 0) {
      const prevMsg = conversationHistory[conversationHistory.length - 1]?.message?.toLowerCase() || '';
      if (prevMsg.includes('transfer') || prevMsg.includes('guide')) {
        action = { type: 'navigate', target: 'transfer' };
      }
    } else if (intent === 'transfer_problem' && response.includes('open the transfer page')) {
      action = { type: 'navigate', target: 'transfer' };
    }

    return NextResponse.json({
      success: true,
      response,
      intent,
      confidence,
      entities,
      action
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
