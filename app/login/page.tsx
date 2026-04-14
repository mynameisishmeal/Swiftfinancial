'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Session check - redirect if already logged in
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    
    if (userEmail && userRole) {
      if (userRole === 'admin' || userRole === 'superadmin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    let errorMessage = '';
    
    if (!email && !password) {
      errorMessage = 'Please fill in all fields';
    } else if (!email && password) {
      errorMessage = 'Enter email/username';
    } else if (email && !password) {
      errorMessage = 'Enter password';
    }
    
    if (errorMessage) {
      setError(errorMessage);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const role = data.role || 'user';
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role);
        
        if (role === 'admin' || role === 'superadmin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <>
      <link rel="stylesheet" type="text/css" href="/assets/vipaa-v4-jawr.css" media="all" />
      <link type="text/css" rel="stylesheet" href="/assets/styles-67459201e251b94c0aa0.m.css" />
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          height: 100%;
          overflow-x: hidden;
          padding-bottom: 0 !important;
        }
        @media (max-width: 768px) {
          .header-nav {
            display: none !important;
          }
        }
      `}</style>
      
      <div style={{ 
        height: '100vh', 
        backgroundImage: 'url(/assets/login_bg13.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1
        }}></div>

        {/* Header */}
        <header style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          padding: '12px 0',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Link href="/">
              <Image src="/assets/BofA_rgb.png" alt="Swift Financial" width={200} height={24} style={{ cursor: 'pointer' }} />
            </Link>
            <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <Link href="#" style={{ fontSize: '14px', color: '#333', textDecoration: 'none' }}>Personal</Link>
              <Link href="#" style={{ fontSize: '14px', color: '#333', textDecoration: 'none' }}>Business</Link>
              <Link href="#" style={{ fontSize: '14px', color: '#333', textDecoration: 'none' }}>Investing</Link>
              <Link href="#" style={{ fontSize: '14px', color: '#333', textDecoration: 'none' }}>Support</Link>
            </nav>
          </div>
        </header>

        {/* Login form */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          padding: '40px 20px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            padding: '40px',
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                Welcome
              </h1>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Access your Swift Financial account
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Email Field with Floating Label */}
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    const nextSibling = e.target.nextElementSibling as HTMLElement | null;
                    if (e.target.value && nextSibling) {
                      nextSibling.style.transform = 'translateY(-12px) scale(0.85)';
                      nextSibling.style.color = '#0066CC';
                    }
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '20px 16px 8px 16px',
                    border: 'none',
                    borderBottom: '2px solid #e5e7eb',
                    borderRadius: '0',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = '#0066CC';
                    const nextSibling = e.target.nextElementSibling as HTMLElement | null;
                    if (nextSibling) {
                      nextSibling.style.transform = 'translateY(-12px) scale(0.85)';
                      nextSibling.style.color = '#0066CC';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = '#e5e7eb';
                    const nextSibling = e.target.nextElementSibling as HTMLElement | null;
                    if (!e.target.value && nextSibling) {
                      nextSibling.style.transform = 'translateY(0) scale(1)';
                      nextSibling.style.color = '#9ca3af';
                    }
                  }}
                />
                <label
                  htmlFor="login-email"
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '16px',
                    fontSize: '16px',
                    color: '#9ca3af',
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease',
                    transformOrigin: 'left top',
                    backgroundColor: 'transparent',
                    padding: '0'
                  }}
                >
                  Email or Username
                </label>
              </div>

              {/* Password Field with Floating Label */}
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    const nextSibling = e.target.nextElementSibling as HTMLElement | null;
                    if (e.target.value && nextSibling) {
                      nextSibling.style.transform = 'translateY(-12px) scale(0.85)';
                      nextSibling.style.color = '#0066CC';
                    }
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '20px 16px 8px 16px',
                    border: 'none',
                    borderBottom: '2px solid #e5e7eb',
                    borderRadius: '0',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    transition: 'all 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = '#0066CC';
                    const nextSibling = e.target.nextElementSibling as HTMLElement | null;
                    if (nextSibling) {
                      nextSibling.style.transform = 'translateY(-12px) scale(0.85)';
                      nextSibling.style.color = '#0066CC';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = '#e5e7eb';
                    const nextSibling = e.target.nextElementSibling as HTMLElement | null;
                    if (!e.target.value && nextSibling) {
                      nextSibling.style.transform = 'translateY(0) scale(1)';
                      nextSibling.style.color = '#9ca3af';
                    }
                  }}
                />
                <label
                  htmlFor="login-password"
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '16px',
                    fontSize: '16px',
                    color: '#9ca3af',
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease',
                    transformOrigin: 'left top',
                    backgroundColor: 'transparent',
                    padding: '0'
                  }}
                >
                  Password
                </label>
              </div>

              {/* Remember Me Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="remember"
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#0066CC'
                  }}
                />
                <label
                  htmlFor="remember"
                  style={{
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  Remember me
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  border: '1px solid #fecaca',
                  marginBottom: '16px'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '16px',
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #0066CC 0%, #004499 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="#" style={{ color: '#0066CC', textDecoration: 'none', fontSize: '14px' }}>
                Forgot username/password?
              </Link>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Not Enrolled? <Link href="/register" style={{ color: '#0066CC', textDecoration: 'none', fontWeight: '600' }}>Sign Up Now</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(238, 238, 238, 0.5)',
          padding: '20px 0',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          marginTop: 'auto'
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            <p style={{
              fontSize: '12px',
              color: '#666',
              margin: '0 0 10px 0'
            }}>
              © 2025 Swift Financial Corporation. All rights reserved. Member FDIC.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <Link href="#" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>Privacy</Link>
              <Link href="#" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>Security</Link>
              <Link href="#" style={{ fontSize: '12px', color: '#666', textDecoration: 'none' }}>Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}