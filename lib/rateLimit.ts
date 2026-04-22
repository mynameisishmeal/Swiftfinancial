const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6 && password.length <= 128;
}

export function validateAmount(amount: any): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num >= 0 && num <= 1000000000;
}

export function sanitizeString(str: string): string {
  return String(str || '').replace(/[<>\"'&]/g, '').trim().slice(0, 500);
}
