'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Help() {
  const [activeSection, setActiveSection] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const faqs = [
    {
      question: "How do I transfer money to another account?",
      answer: "Go to Transfer & Pay tab, enter the recipient's email and amount, then click Transfer Money. Make sure you have sufficient funds and tax clearance."
    },
    {
      question: "What is Zelle® and how does it work?",
      answer: "Zelle® lets you send money to friends and family in minutes using just their email address. Funds are transferred directly between bank accounts."
    },
    {
      question: "Why are my transfers blocked?",
      answer: "Transfers may be blocked if you have outstanding tax issues. Contact customer service to resolve tax clearance status."
    },
    {
      question: "How do I download my account statements?",
      answer: "In your Accounts tab, click 'View statements' in the Quick Actions section, then click Download on the statement you need."
    },
    {
      question: "How do I change my profile picture?",
      answer: "Click on your profile picture in the top navigation, then select 'Update Profile Picture' and choose a new image."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .app-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F4F4F4; min-height: 100vh; }
        .top-nav { background: white; padding: 16px 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
        .back-btn { background: #E31837; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .back-btn:hover { background: #c41230; }
        .content { padding: 20px; max-width: 1200px; margin: 0 auto; }
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
        .card-header { padding: 20px; border-bottom: 1px solid #f3f4f6; }
        .card-title { font-size: 20px; font-weight: 700; color: #111827; }
        .card-content { padding: 20px; }
        .sidebar { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .sidebar-btn { width: 100%; padding: 12px 16px; text-align: left; background: none; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; color: #111827; transition: all 0.2s; }
        .sidebar-btn:hover { background: #f9fafb; }
        .sidebar-btn.active { background: #fef2f2; color: #e31837; font-weight: 600; }
        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
        .form-input:focus { border-color: #e31837; box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1); }
        .grid-2 { display: grid; grid-template-columns: 250px 1fr; gap: 24px; }
        @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
      `}</style>
      <div className="app-container">
        <div className="top-nav">
          <img src="/assets/BofA_rgb.png" alt="Swift Financial" style={{ height: '24px' }} />
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Help & Support</div>
          <button onClick={() => router.push('/dashboard')} className="back-btn">
            BACK TO DASHBOARD
          </button>
        </div>

        <div className="content">
          <div className="grid-2">
            <div className="sidebar">
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>Support Topics</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className={`sidebar-btn ${activeSection === 'faq' ? 'active' : ''}`} onClick={() => setActiveSection('faq')}>
                  Frequently Asked Questions
                </button>
                <button className={`sidebar-btn ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => setActiveSection('contact')}>
                  Contact Us
                </button>
                <button className={`sidebar-btn ${activeSection === 'security' ? 'active' : ''}`} onClick={() => setActiveSection('security')}>
                  Security Center
                </button>
                <button className={`sidebar-btn ${activeSection === 'fees' ? 'active' : ''}`} onClick={() => setActiveSection('fees')}>
                  Fees & Rates
                </button>
              </div>
            </div>

            <div>
              {activeSection === 'faq' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Frequently Asked Questions</h2>
                  </div>
                  <div className="card-content">
                    <div style={{ marginBottom: '20px' }}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-input"
                        placeholder="Search FAQs..."
                      />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {filteredFaqs.map((faq, index) => (
                        <div key={index} style={{ borderBottom: '1px solid var(--bofa-gray-200)', paddingBottom: '16px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'var(--bofa-gray-900)' }}>
                            {faq.question}
                          </h4>
                          <p style={{ fontSize: '14px', color: 'var(--bofa-gray-600)', lineHeight: '1.5' }}>
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'contact' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Contact Customer Service</h2>
                  </div>
                  <div className="card-content">
                    <div style={{ display: 'grid', gap: '24px' }}>
                      <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>📞 Phone Support</h4>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                          Available 24/7 for account assistance
                        </p>
                        <p style={{ fontSize: '18px', fontWeight: '600', color: '#e31837' }}>
                          1-800-432-1000
                        </p>
                      </div>
                      
                      <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>💬 Live Chat</h4>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                          Chat with a representative online
                        </p>
                        <button style={{ padding: '10px 20px', background: '#e31837', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} onClick={() => window.open('https://wa.me/message/IQWVVQXQXQXQX', '_blank')}>
                          Start Live Chat
                        </button>
                      </div>
                      
                      <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>📧 Email Support</h4>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                          Send us a secure message
                        </p>
                        <p style={{ fontSize: '14px', color: '#0055C4' }}>
                          support@bankofamerica.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'security' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Security Center</h2>
                  </div>
                  <div className="card-content">
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>🔒 Account Security</h4>
                      <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#6b7280' }}>
                        <li>Never share your login credentials with anyone</li>
                        <li>Always log out when using public computers</li>
                        <li>Check your account regularly for unauthorized transactions</li>
                        <li>Use strong, unique passwords</li>
                      </ul>
                    </div>
                    
                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>🚨 Report Fraud</h4>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                        If you notice suspicious activity on your account, contact us immediately.
                      </p>
                      <button style={{ padding: '10px 20px', background: '#e31837', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                        Report Suspicious Activity
                      </button>
                    </div>
                    
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>🛡️ FDIC Protection</h4>
                      <p style={{ fontSize: '14px', color: '#6b7280' }}>
                        Your deposits are insured by the FDIC up to $250,000 per depositor, per bank.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'fees' && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Fees & Rates</h2>
                  </div>
                  <div className="card-content">
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Monthly Maintenance Fee</span>
                        <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>$0.00</span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Zelle® Transfers</span>
                        <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>Free</span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Account-to-Account Transfers</span>
                        <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>Free</span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Overdraft Fee</span>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>$35.00</span>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Paper Statements</span>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>$5.00/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}