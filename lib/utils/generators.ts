export function generateIban(): string {
  const num = Math.floor(10 + Math.random() * 89).toString() + Date.now().toString().slice(-14);
  return 'US' + num;
}

export function generateAccountId(): string {
  return 'ACC' + Date.now();
}

export function generateConfirmationNumber(prefix: string): string {
  return prefix + Date.now().toString().slice(-8);
}
