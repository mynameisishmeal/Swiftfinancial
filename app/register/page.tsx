'use client';

import '../globals.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [avatar, setAvatar] = useState('');
  const [wantMockHistory, setWantMockHistory] = useState(false);
  const [mockAmount, setMockAmount] = useState('');
  const [mockTimeframe, setMockTimeframe] = useState<'1month' | '6months' | '1year'>('6months');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          name,
          initialAmount: parseFloat(initialAmount) || 0,
          avatar,
          mockHistory: wantMockHistory ? {
            totalAmount: parseFloat(mockAmount) || 0,
            timeframe: mockTimeframe
          } : null
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => router.push('/'), 2000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#DB0011] h-2"></div>
      
      <nav className="bg-black px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img height="28" width="230" alt="Swift Financial" src="/assets/BofA_rgb.png" />
          </div>
          <a href="/" className="text-white hover:text-gray-300 text-sm font-light">Back to Login</a>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-5xl font-light text-gray-900 mb-6">
              Create Your Account
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of customers who trust us with their banking needs.
            </p>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#DB0011] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Instant Account Setup</p>
                  <p className="text-sm text-gray-600">Get started in minutes with our simple registration</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#DB0011] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Secure & Protected</p>
                  <p className="text-sm text-gray-600">Your data is encrypted and protected</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#DB0011] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div>
                  <p className="font-semibold">Full Banking Access</p>
                  <p className="text-sm text-gray-600">Access all features immediately after registration</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-8">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Register</h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 p-3">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">FULL NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#DB0011] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#DB0011] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#DB0011] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">INITIAL DEPOSIT (OPTIONAL)</label>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 focus:border-[#DB0011] focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">PROFILE PICTURE (OPTIONAL)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full text-sm"
                />
                {avatar && (
                  <img src={avatar} alt="Preview" className="mt-3 w-16 h-16 rounded-full object-cover" />
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="mockHistory"
                    checked={wantMockHistory}
                    onChange={(e) => setWantMockHistory(e.target.checked)}
                    className="w-4 h-4 text-[#DB0011] border-gray-300 focus:ring-[#DB0011]"
                  />
                  <label htmlFor="mockHistory" className="text-xs font-semibold text-gray-700">
                    ADD MOCK TRANSACTION HISTORY
                  </label>
                </div>
                
                {wantMockHistory && (
                  <div className="space-y-3 ml-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">TOTAL HISTORY AMOUNT</label>
                      <input
                        type="number"
                        value={mockAmount}
                        onChange={(e) => setMockAmount(e.target.value)}
                        placeholder="e.g., 1000000 for $1M"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#DB0011] focus:outline-none text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">HISTORY TIMEFRAME</label>
                      <select
                        value={mockTimeframe}
                        onChange={(e) => setMockTimeframe(e.target.value as '1month' | '6months' | '1year')}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-[#DB0011] focus:outline-none text-sm"
                      >
                        <option value="1month">1 Month</option>
                        <option value="6months">6 Months</option>
                        <option value="1year">1 Year</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#DB0011] text-white py-3 hover:bg-[#B00010] disabled:opacity-50 font-semibold text-sm mt-6"
              >
                {loading ? 'PLEASE WAIT...' : 'REGISTER'}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account? <a href="/" className="text-[#DB0011] hover:underline">Log In</a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <footer className="bg-gray-100 mt-20 py-8 border-t">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>© 2025 Swift Financial Corporation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
