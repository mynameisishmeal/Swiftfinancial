export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function validatePassword(password: string): boolean {
  return password.length >= 6 && password.length <= 128;
}

export function validatePin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

export function validateRouting(routing: string): boolean {
  return /^\d{9}$/.test(routing);
}

export function validateAmount(amount: string, min: number = 0): boolean {
  const num = parseFloat(amount);
  return !isNaN(num) && num > min;
}

export function sanitizeString(str: string): string {
  return String(str || '').replace(/[<>"'&]/g, '');
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString();
}
