'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroEmail, setHeroEmail] = useState('');
  const [heroPassword, setHeroPassword] = useState('');
  const [heroError, setHeroError] = useState('');
  const [heroLoading, setHeroLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Session check - redirect if already logged in
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    
    if (userEmail && userRole) {
      if (userRole === 'admin' || userRole === 'superadmin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    }
  }, []);

  // Define slides outside of render to keep reference stable
  const heroSlides = [
    { type: 'image', src: '/assets/bk.jpg', duration: 8000 },
    { type: 'video', src: '/assets/277094_medium.mp4', duration: 15000 },
    { type: 'video', src: '/assets/298813_medium.mp4', duration: 15000 }
  ];

  useEffect(() => {
    // Check if already initialized
    if ((window as any).googleTranslateInitialized) return;
    
    // Load Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    (window as any).googleTranslateElementInit = () => {
      if (!(window as any).google?.translate) return;
      
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,es,fr,de,it,pt,zh-CN,ja,ko,ar,ru',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        },
        'google_translate_element'
      );
      (window as any).googleTranslateInitialized = true;
    };

    return () => {
      // Cleanup on unmount
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement) {
        translateElement.innerHTML = '';
      }
      delete (window as any).googleTranslateElementInit;
      delete (window as any).googleTranslateInitialized;
    };
  }, []);

  // Hero carousel auto-slide with dynamic duration
  useEffect(() => {
    const currentSlideDuration = heroSlides[currentSlide].duration;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // Use hardcoded 3 instead of heroSlides.length
    }, currentSlideDuration);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]); // Only depend on currentSlide

  return (
    <>
      <link rel="stylesheet" type="text/css" href="/assets/vipaa-v4-jawr.css" media="all" />
      <link type="text/css" rel="stylesheet" href="/assets/styles-67459201e251b94c0aa0.m.css" />
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; }
        .min-h-screen { min-height: 100vh; display: flex; flex-direction: column; }
        .homepage-header { background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .homepage-header-inner { max-width: 1280px; margin: 0 auto; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; }
        .homepage-nav { display: flex; align-items: center; gap: 32px; }
        .homepage-nav a { font-size: 14px; color: #333; text-decoration: none; transition: color 0.2s; }
        .homepage-nav a:hover { color: #0073cf; }
        .homepage-signin { background: #0073cf; color: #fff; padding: 10px 24px; border-radius: 4px; font-weight: 600; }
        .homepage-signin:hover { background: #005ba3; color: #fff; }
        
        /* Modern Header */
        .modern-header { background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); position: sticky; top: 0; z-index: 1000; backdrop-filter: blur(10px); }
        .modern-header-inner { max-width: 1400px; margin: 0 auto; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
        .header-brand { }
        .modern-nav { display: flex; align-items: center; gap: 40px; }
        .nav-item { position: relative; }
        .nav-link { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 500; color: #333; text-decoration: none; padding: 12px 0; transition: color 0.3s; white-space: nowrap; }
        .nav-link:hover { color: #0066CC; }
        .dropdown-menu { position: absolute; top: 100%; left: 0; background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); padding: 32px; min-width: 600px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s; border: 1px solid #f0f0f0; }
        .nav-item:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-section h4 { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
        .dropdown-section a { display: block; font-size: 14px; color: #666; text-decoration: none; padding: 8px 0; transition: color 0.3s; }
        .dropdown-section a:hover { color: #0066CC; }
        .header-actions { display: flex; align-items: center; gap: 24px; }
        .search-container { position: relative; }
        .search-input { padding: 12px 16px 12px 44px; border: 2px solid #f0f0f0; border-radius: 24px; font-size: 14px; width: 200px; transition: all 0.3s; background: #fafafa; }
        .search-input:focus { outline: none; border-color: #0066CC; background: #fff; width: 280px; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #999; }
        .dropdown-menu { position: absolute; top: 100%; left: 0; background: #fff; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); padding: 32px; min-width: 600px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.3s; border: 1px solid #f0f0f0; }
        .nav-item:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-section h4 { font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
        .dropdown-section a { display: block; font-size: 14px; color: #666; text-decoration: none; padding: 8px 0; transition: color 0.3s; }
        .dropdown-section a:hover { color: #0066CC; }
        .header-actions { display: flex; align-items: center; gap: 24px; }
        .search-container { position: relative; }
        .search-input { padding: 12px 16px 12px 44px; border: 2px solid #f0f0f0; border-radius: 24px; font-size: 14px; width: 200px; transition: all 0.3s; background: #fafafa; }
        .search-input:focus { outline: none; border-color: #0066CC; background: #fff; width: 280px; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #999; }
        .homepage-hero { background: linear-gradient(135deg, #012169 0%, #0146a6 50%, #0353b8 100%); color: #fff; padding: 96px 24px; position: relative; overflow: hidden; }
        .homepage-hero::before { content: ''; position: absolute; top: 0; right: 0; width: 400px; height: 400px; background: rgba(255,255,255,0.1); border-radius: 50%; filter: blur(80px); }
        .homepage-hero-inner { max-width: 1280px; margin: 0 auto; position: relative; z-index: 1; }
        .homepage-hero h1 { font-size: 56px; font-weight: 700; margin-bottom: 24px; line-height: 1.2; max-width: 800px; }
        .homepage-hero p { font-size: 20px; margin-bottom: 40px; max-width: 700px; color: rgba(255,255,255,0.9); line-height: 1.6; }
        
        /* Modern Hero Styles */
        .modern-hero { position: relative; color: #fff; padding: 120px 24px; overflow: hidden; min-height: 100vh; display: flex; align-items: center; }
        .hero-carousel { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        .hero-slide { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 1s ease-in-out; }
        .hero-slide.active { opacity: 1; }
        .hero-slide img, .hero-slide video { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)); z-index: 1; }
        .modern-hero-inner { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 2; }
        .hero-content { max-width: 600px; }
        .hero-badge { display: inline-block; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); border-radius: 50px; padding: 8px 20px; margin-bottom: 32px; font-size: 14px; font-weight: 500; }
        .hero-title { font-size: 64px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; }
        .gradient-text { background: linear-gradient(135deg, #00D4AA 0%, #00B894 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-subtitle { font-size: 20px; line-height: 1.6; margin-bottom: 40px; color: rgba(255,255,255,0.8); }
        .homepage-cta { display: inline-flex; gap: 16px; }
        .homepage-btn-primary { background: #fff; color: #012169; padding: 16px 32px; border-radius: 6px; font-weight: 600; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s; }
        .homepage-btn-primary:hover { background: #f0f0f0; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
        .homepage-btn-secondary { background: transparent; color: #fff; padding: 16px 32px; border-radius: 6px; border: 2px solid #fff; font-weight: 600; text-decoration: none; transition: all 0.3s; }
        .homepage-btn-secondary:hover { background: #fff; color: #012169; }
        
        /* Modern Hero Stats and Buttons */
        .hero-stats { display: flex; gap: 48px; margin-bottom: 48px; }
        .stat-item { text-align: left; }
        .stat-number { font-size: 48px; font-weight: 800; color: #00D4AA; display: block; line-height: 1; }
        .stat-label { font-size: 14px; color: #ffffff !important; margin-top: 8px; }
        .hero-cta { display: flex; gap: 20px; align-items: center; }
        .btn-primary-modern { background: #fff; color: #0066CC; padding: 18px 48px; border-radius: 12px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); transition: all 0.3s; border: none; min-width: 450px; }
        .btn-primary-modern:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); background: #f8f9fa; }
        .btn-secondary-modern { background: transparent; color: #fff; padding: 18px 32px; border-radius: 12px; border: 2px solid rgba(255,255,255,0.3); font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 12px; backdrop-filter: blur(10px); transition: all 0.3s; }
        .btn-secondary-modern:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.5); }
        .homepage-highlights { padding: 80px 24px; background: #fff; }
        
        /* Modern Highlights - Bento Grid */
        .modern-highlights { padding: 120px 24px; background: linear-gradient(to bottom, #f8fafc 0%, #fff 50%); }
        .modern-highlights-inner { max-width: 1400px; margin: 0 auto; }
        .section-header { text-align: center; margin-bottom: 80px; }
        .section-header h2 { font-size: 48px; font-weight: 800; color: #1a1a1a; margin-bottom: 16px; line-height: 1.2; }
        .section-header p { font-size: 20px; color: #666; max-width: 600px; margin: 0 auto; }
        .bento-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(3, 200px); gap: 24px; }
        .bento-card { background: #fff; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #f0f0f0; transition: all 0.4s ease; position: relative; overflow: hidden; cursor: pointer; }
        .bento-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .bento-card.large { grid-column: span 2; grid-row: span 2; }
        .bento-card.medium { grid-column: span 2; grid-row: span 2; }
        .bento-card.small { grid-column: span 2; grid-row: span 2; }
        
        /* Banking Preview Styles */
        .hero-visual { position: relative; }
        .banking-preview { position: relative; }
        .preview-card { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 20px; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2); }
        .main-card { margin-bottom: 20px; }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .card-balance { }
        .balance-label { display: block; font-size: 14px; color: #666; margin-bottom: 8px; }
        .balance-amount { display: block; font-size: 32px; font-weight: 800; color: #1a1a1a; }
        .card-trend { display: flex; align-items: center; gap: 6px; color: #00D4AA; font-weight: 600; font-size: 14px; }
        .card-trend.positive { color: #00D4AA; }
        .card-chart { height: 60px; margin-top: 16px; }
        .chart-line { stroke-dasharray: 300; stroke-dashoffset: 300; animation: drawLine 2s ease-out forwards; }
        @keyframes drawLine { to { stroke-dashoffset: 0; } }
        .quick-actions { display: flex; gap: 16px; }
        .action-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border-radius: 12px; background: #f8f9fa; transition: all 0.3s; cursor: pointer; flex: 1; }
        .action-item:hover { background: #e9ecef; transform: translateY(-2px); }
        .action-icon { width: 40px; height: 40px; border-radius: 10px; background: #0066CC; color: #fff; display: flex; align-items: center; justify-content: center; }
        .action-item span { font-size: 12px; font-weight: 600; color: #333; }
        
        /* Bento Card Content Styles */
        .card-content { height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
        .card-icon { width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg, #0066CC 0%, #004499 100%); color: #fff; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .card-icon.credit-card { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); }
        .card-icon.mobile { background: linear-gradient(135deg, #00D4AA 0%, #00B894 100%); }
        .card-icon.invest { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); }
        .bento-card h3 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
        .bento-card p { font-size: 16px; color: #666; line-height: 1.5; margin-bottom: 20px; }
        
        /* Feature Elements */
        .card-feature { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .feature-badge { background: #00D4AA; color: #fff; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .feature-value { font-size: 32px; font-weight: 800; color: #00D4AA; }
        .card-visual { position: absolute; bottom: 20px; right: 20px; }
        .mini-chart { display: flex; align-items: end; gap: 4px; height: 40px; }
        .chart-bar { width: 6px; background: linear-gradient(to top, #0066CC, #00D4AA); border-radius: 3px; animation: growBar 1.5s ease-out forwards; transform-origin: bottom; }
        @keyframes growBar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .reward-display { display: flex; align-items: baseline; gap: 8px; margin-top: auto; }
        .reward-amount { font-size: 48px; font-weight: 800; color: #FF6B35; line-height: 1; }
        .reward-label { font-size: 14px; color: #666; }
        .security-badges { display: flex; gap: 8px; margin-top: auto; }
        .security-badge { background: rgba(0, 212, 170, 0.1); color: #00D4AA; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; border: 1px solid rgba(0, 212, 170, 0.2); }
        
        /* Interactive Features Section */
        .interactive-features { padding: 120px 24px; background: #fff; }
        .interactive-features-inner { max-width: 1400px; margin: 0 auto; }
        .features-header { text-align: center; margin-bottom: 80px; }
        .features-header h2 { font-size: 48px; font-weight: 800; color: #1a1a1a; margin-bottom: 16px; }
        .features-header p { font-size: 20px; color: #666; }
        .features-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
        .feature-card { background: #fff; border-radius: 24px; padding: 40px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid #f0f0f0; transition: all 0.4s ease; }
        .feature-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .feature-card h3 { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; }
        .feature-card p { font-size: 16px; color: #666; margin-bottom: 32px; line-height: 1.6; }
        
        /* Calculator Styles */
        .calculator-inputs { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-size: 14px; font-weight: 600; color: #333; }
        .calc-input { padding: 16px; border: 2px solid #f0f0f0; border-radius: 12px; font-size: 16px; transition: all 0.3s; background: #fafafa; }
        .calc-input:focus { outline: none; border-color: #0066CC; background: #fff; }
        .calculation-result { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: linear-gradient(135deg, #0066CC 0%, #004499 100%); border-radius: 16px; margin-bottom: 24px; }
        .result-label { color: rgba(255,255,255,0.8); font-size: 14px; }
        .result-amount { color: #fff; font-size: 32px; font-weight: 800; }
        .calc-button { width: 100%; padding: 16px; background: #00D4AA; color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.3s; }
        .calc-button:hover { background: #00B894; transform: translateY(-2px); }
        
        /* Savings Goal Styles */
        .savings-goal { }
        .goal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .goal-title { font-size: 18px; font-weight: 600; color: #333; }
        .goal-target { font-size: 18px; font-weight: 700; color: #0066CC; }
        .progress-container { margin-bottom: 24px; }
        .progress-bar { width: 100%; height: 12px; background: #f0f0f0; border-radius: 6px; overflow: hidden; margin-bottom: 8px; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #00D4AA 0%, #00B894 100%); border-radius: 6px; transition: width 2s ease-out; }
        .progress-text { font-size: 14px; color: #666; }
        .goal-stats { display: flex; gap: 32px; }
        .stat { text-align: center; }
        .stat-value { display: block; font-size: 24px; font-weight: 800; color: #1a1a1a; }
        .stat-label { font-size: 12px; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px; }
        .savings .stat-label { color: #000000 !important; }
        
        /* Investment Portfolio Styles */
        .portfolio-summary { }
        .portfolio-value { margin-bottom: 24px; }
        .value-amount { display: block; font-size: 36px; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; }
        .value-change { font-size: 16px; font-weight: 600; }
        .value-change.positive { color: #00D4AA; }
        .portfolio-chart { height: 80px; }
        .portfolio-line { stroke-dasharray: 400; stroke-dashoffset: 400; animation: drawPortfolioLine 3s ease-out forwards; }
        @keyframes drawPortfolioLine { to { stroke-dashoffset: 0; } }
        
        /* Product Showcase Styles */
        .product-showcase { padding: 120px 24px; background: linear-gradient(to bottom, #fff 0%, #f8fafc 100%); }
        .product-showcase-inner { max-width: 1400px; margin: 0 auto; }
        .showcase-header { text-align: center; margin-bottom: 80px; }
        .showcase-header h2 { font-size: 48px; font-weight: 800; color: #1a1a1a; margin-bottom: 16px; }
        .showcase-header p { font-size: 20px; color: #666; }
        .product-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .product-card { background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.08); border: 1px solid #f0f0f0; transition: all 0.4s ease; position: relative; }
        .product-card:hover { transform: translateY(-12px); box-shadow: 0 24px 80px rgba(0,0,0,0.15); }
        .product-badge { position: absolute; top: 20px; right: 20px; background: #FF6B35; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; z-index: 2; }
        .product-image { padding: 40px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); position: relative; }
        
        /* Product Mockups */
        .card-mockup { width: 280px; height: 180px; background: linear-gradient(135deg, #0066CC 0%, #004499 100%); border-radius: 16px; position: relative; color: #fff; padding: 24px; margin: 0 auto; box-shadow: 0 12px 32px rgba(0,102,204,0.3); }
        .card-chip { width: 32px; height: 24px; background: #FFD700; border-radius: 4px; margin-bottom: 20px; }
        .card-number { font-size: 18px; font-weight: 600; letter-spacing: 2px; margin-bottom: 16px; }
        .card-name { font-size: 14px; font-weight: 500; }
        .card-logo { position: absolute; bottom: 24px; right: 24px; font-size: 16px; font-weight: 700; }
        .account-mockup { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); margin: 0 auto; max-width: 300px; }
        .account-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .account-type { font-size: 14px; color: #666; }
        .account-balance { font-size: 24px; font-weight: 800; color: #1a1a1a; }
        .account-actions { display: flex; gap: 8px; }
        .action-btn { padding: 8px 16px; background: #f0f0f0; border: none; border-radius: 20px; font-size: 12px; font-weight: 600; color: #333; cursor: pointer; transition: all 0.3s; }
        .action-btn:hover { background: #0066CC; color: #fff; }
        .investment-mockup { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); margin: 0 auto; max-width: 300px; }
        .investment-chart { height: 120px; margin-bottom: 16px; }
        .investment-line { stroke-dasharray: 200; stroke-dashoffset: 200; animation: drawInvestmentLine 2s ease-out forwards; }
        @keyframes drawInvestmentLine { to { stroke-dashoffset: 0; } }
        .investment-value { display: flex; justify-content: space-between; align-items: center; }
        .investment-amount { font-size: 20px; font-weight: 800; color: #1a1a1a; }
        .investment-growth { font-size: 14px; font-weight: 600; color: #8B5CF6; }
        
        /* Product Content */
        .product-content { padding: 40px; }
        .product-content h3 { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 16px; }
        .product-content p { font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 24px; }
        .product-features { margin-bottom: 32px; }
        .feature-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .feature-item span { font-size: 14px; color: #333; }
        .product-highlight { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding: 16px; background: #f8fafc; border-radius: 12px; }
        .highlight-label { font-size: 14px; color: #666; }
        .highlight-value { font-size: 24px; font-weight: 800; color: #00D4AA; }
        .product-cta { display: inline-flex; align-items: center; gap: 8px; padding: 16px 32px; background: #0066CC; color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600; transition: all 0.3s; }
        .product-cta:hover { background: #004499; transform: translateY(-2px); }
        .product-cta.secondary { background: transparent; color: #0066CC; border: 2px solid #0066CC; }
        .product-cta.secondary:hover { background: #0066CC; color: #fff; }
        
        /* App & Trust Section */
        .app-trust-section { padding: 120px 24px; background: linear-gradient(135deg, #0066CC 0%, #004499 100%); color: #fff; }
        .app-trust-inner { max-width: 1400px; margin: 0 auto; }
        .app-showcase { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .trust-badges { display: flex; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
        .trust-badge { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; }
        .app-content h2 { font-size: 48px; font-weight: 800; margin-bottom: 24px; line-height: 1.2; }
        .app-content p { font-size: 20px; line-height: 1.6; margin-bottom: 40px; color: rgba(255,255,255,0.9); }
        .app-features { margin-bottom: 48px; }
        .app-feature { display: flex; gap: 20px; margin-bottom: 32px; }
        .feature-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #fff; }
        .app-feature h4 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .app-feature p { font-size: 16px; color: rgba(255,255,255,0.8); margin: 0; }
        .app-download { display: flex; gap: 20px; }
        .download-btn { transition: opacity 0.3s; }
        .download-btn:hover { opacity: 0.8; }
        .phone-mockup { width: 300px; height: 600px; background: #1a1a1a; border-radius: 40px; padding: 20px; position: relative; margin: 0 auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .phone-screen { width: 100%; height: 100%; background: #fff; border-radius: 30px; overflow: hidden; }
        .app-interface { padding: 24px; height: 100%; }
        .app-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .greeting { font-size: 18px; font-weight: 600; color: #1a1a1a; }
        .notification-dot { width: 12px; height: 12px; background: #FF6B35; border-radius: 50%; }
        .balance-card { background: linear-gradient(135deg, #0066CC 0%, #004499 100%); color: #fff; padding: 24px; border-radius: 20px; margin-bottom: 32px; }
        .balance-label { display: block; font-size: 14px; opacity: 0.8; margin-bottom: 8px; }
        .balance-amount { display: block; font-size: 32px; font-weight: 800; margin-bottom: 12px; }
        .balance-trend { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: #00D4AA; }
        .quick-actions-mobile { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .quick-action { text-align: center; }
        .action-icon-mobile { width: 48px; height: 48px; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; color: #0066CC; }
        .quick-action span { font-size: 12px; font-weight: 600; color: #666; }
        
        /* Modern Footer */
        .modern-footer { background: #ffffff; color: #000000; padding: 80px 24px 0px; margin: 0; }
        .modern-footer-inner { max-width: 1400px; margin: 0 auto; }
        .footer-top { display: grid; grid-template-columns: 1fr 2fr; gap: 80px; margin-bottom: 60px; }
        .footer-brand p { font-size: 16px; color: #000000; line-height: 1.6; margin: 24px 0 32px; max-width: 400px; }
        .footer-social { display: flex; gap: 16px; }
        .social-link { width: 48px; height: 48px; background: rgba(0,0,0,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #000000; transition: all 0.3s; }
        .social-link:hover { background: #0066CC; transform: translateY(-2px); color: #ffffff; }
        .footer-links { display: grid; grid-template-columns: repeat(5, 1fr); gap: 40px; }
        .footer-column h4 { font-size: 18px; font-weight: 700; margin-bottom: 24px; color: #000000; }
        .footer-column ul { list-style: none; }
        .footer-column li { margin-bottom: 12px; }
        .footer-column a { color: #000000; text-decoration: none; font-size: 14px; transition: color 0.3s; font-weight: 400; }
        .footer-column a:hover { color: #0066CC; }
        .footer-certifications { display: flex; justify-content: center; gap: 48px; padding: 40px 0; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; margin-bottom: 40px; }
        .cert-item { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .cert-item span { font-size: 12px; color: #000000; text-align: center; font-weight: 600; }
        .cert-icon { width: 48px; height: 48px; background: rgba(0,0,0,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; }
        .footer-legal p { font-size: 14px; color: #000000; margin-bottom: 16px; }
        .legal-links { display: flex; gap: 24px; flex-wrap: wrap; }
        .legal-links a { font-size: 14px; color: #000000; text-decoration: none; transition: color 0.3s; font-weight: 400; }
        .legal-links a:hover { color: #0066CC; }
        .footer-contact { display: flex; gap: 32px; }
        .contact-item { display: flex; align-items: center; gap: 8px; color: #000000; font-size: 14px; }
        .contact-item svg { color: #00D4AA; }
        .homepage-highlights-inner { max-width: 1280px; margin: 0 auto; }
        .homepage-highlights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px; }
        .homepage-highlight-card { text-align: center; padding: 32px 24px; border-radius: 12px; transition: all 0.3s; cursor: pointer; }
        .homepage-highlight-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-4px); }
        .homepage-highlight-icon { width: 80px; height: 80px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; }
        .homepage-highlight-card:hover .homepage-highlight-icon { transform: scale(1.1); }
        .icon-blue { background: #e6f2ff; }
        .icon-red { background: #ffe6e6; }
        .icon-green { background: #e6ffe6; }
        .icon-purple { background: #f3e6ff; }
        .homepage-highlight-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #333; }
        .homepage-highlight-card p { font-size: 14px; color: #666; margin-bottom: 16px; line-height: 1.5; }
        .homepage-highlight-card a { color: #0073cf; font-weight: 600; text-decoration: none; font-size: 14px; }
        .homepage-highlight-card a:hover { text-decoration: underline; }
        .homepage-products { padding: 80px 24px; background: linear-gradient(to bottom, #f8f9fa 0%, #fff 100%); }
        .homepage-products-inner { max-width: 1280px; margin: 0 auto; }
        .homepage-products-header { text-align: center; margin-bottom: 64px; }
        .homepage-products-header h2 { font-size: 40px; font-weight: 700; margin-bottom: 16px; color: #333; }
        .homepage-products-header p { font-size: 18px; color: #666; }
        .homepage-products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
        .homepage-product-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.3s; }
        .homepage-product-card:hover { box-shadow: 0 12px 32px rgba(0,0,0,0.15); transform: translateY(-8px); }
        .homepage-product-image { overflow: hidden; }
        .homepage-product-image img { width: 100%; height: auto; transition: transform 0.5s; }
        .homepage-product-card:hover .homepage-product-image img { transform: scale(1.1); }
        .homepage-product-content { padding: 32px; }
        .homepage-product-content h3 { font-size: 24px; font-weight: 700; margin-bottom: 12px; color: #333; }
        .homepage-product-content p { font-size: 15px; color: #666; margin-bottom: 24px; line-height: 1.6; }
        .homepage-product-content a { color: #0073cf; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; }
        .homepage-product-content a:hover { text-decoration: underline; }
        .homepage-app { padding: 80px 24px; background: linear-gradient(135deg, #0073cf 0%, #005ba3 100%); color: #fff; }
        .homepage-app-inner { max-width: 1280px; margin: 0 auto; text-align: center; }
        .homepage-app h2 { font-size: 40px; font-weight: 700; margin-bottom: 16px; }
        .homepage-app p { font-size: 18px; margin-bottom: 40px; color: rgba(255,255,255,0.9); max-width: 700px; margin-left: auto; margin-right: auto; }
        .homepage-app-badges { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; }
        .homepage-app-badges a { transition: opacity 0.3s; }
        .homepage-app-badges a:hover { opacity: 0.8; }
        .homepage-footer { background: #1a1a1a; color: #fff; padding: 64px 24px; }
        .homepage-footer-inner { max-width: 1280px; margin: 0 auto; }
        .homepage-footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 48px; margin-bottom: 48px; }
        .homepage-footer h4 { font-size: 18px; font-weight: 700; margin-bottom: 24px; }
        .homepage-footer ul { list-style: none; }
        .homepage-footer li { margin-bottom: 12px; }
        .homepage-footer a { color: #ccc; text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .homepage-footer a:hover { color: #fff; }
        .homepage-footer-icons { display: flex; gap: 24px; }
        .homepage-footer-icons a { transition: opacity 0.3s; }
        .homepage-footer-icons a:hover { opacity: 0.7; }
        .homepage-footer-bottom { border-top: 1px solid #333; padding-top: 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
        .homepage-footer-bottom p { font-size: 14px; color: #999; }
        .homepage-footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
        #google_translate_element { display: inline-block; }
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0px !important; }
        .goog-te-gadget { font-family: inherit !important; }
        .goog-te-gadget-simple { background-color: transparent !important; border: none !important; padding: 0 !important; }
        .goog-te-gadget-simple .goog-te-menu-value { color: #333 !important; }
        .goog-te-gadget-simple .goog-te-menu-value:hover { color: #0073cf !important; }
        .goog-te-gadget-icon { display: none !important; }
        @media (max-width: 1200px) {
          .modern-nav { gap: 24px; }
          .nav-link { font-size: 14px; }
          .dropdown-menu { min-width: 500px; padding: 24px; }
        }
        @media (max-width: 1024px) {
          .modern-nav { gap: 16px; }
          .nav-link { font-size: 13px; }
          .dropdown-menu { min-width: 400px; padding: 20px; }
          .header-actions { gap: 16px; }
          .search-input { width: 150px; }
          .search-input:focus { width: 200px; }
        }
        @media (max-width: 900px) {
          .modern-nav { display: none; }
          .mobile-menu-btn { display: flex !important; }
          .search-container { display: none; }
          .header-actions { gap: 8px; }
          .signin-btn { padding: 8px 16px; font-size: 14px; }
        }
        @media (max-width: 768px) {
          .homepage-hero h1 { font-size: 36px; }
          .homepage-hero p { font-size: 16px; }
          .homepage-products-header h2 { font-size: 32px; }
          .homepage-app h2 { font-size: 32px; }
          .homepage-nav { gap: 16px; font-size: 12px; }
          .homepage-footer-bottom { flex-direction: column; text-align: center; }
          
          /* Modern Header Mobile */
          .modern-header-inner { padding: 12px 16px; }
          .modern-nav { display: none; }
          .header-actions { gap: 3px; }
          .search-container { display: none; }
          #google_translate_element { transform: scale(0.8); transform-origin: center; white-space: nowrap; }
          #google_translate_element select { max-width: 100px; }
          .goog-te-combo { font-size: 12px !important; }
          .signin-btn { padding: 8px 12px; font-size: 12px; white-space: nowrap; }
          .signin-btn svg { width: 16px; height: 16px; }
          .mobile-menu-btn { display: none; flex-direction: column; gap: 3px; background: none; border: none; cursor: pointer; padding: 8px; }
        .mobile-menu-btn span { width: 20px; height: 2px; background: #333; transition: all 0.3s; }
        .mobile-nav { display: none; position: absolute; top: 100%; left: 0; right: 0; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 24px; z-index: 1000; }
        .mobile-nav.open { display: block; }
        .mobile-nav-item { margin-bottom: 16px; }
        .mobile-nav-link { display: block; font-size: 16px; font-weight: 500; color: #333; text-decoration: none; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
          
          /* Modern Hero Mobile */
          .modern-hero { padding: 80px 24px; min-height: auto; }
          .modern-hero-inner { grid-template-columns: 1fr; gap: 40px; text-align: center; }
          .hero-title { font-size: 42px; }
          .hero-stats { justify-content: center; gap: 32px; }
          .hero-cta { flex-direction: column; align-items: center; }
          .btn-primary-modern, .btn-secondary-modern { width: 100%; justify-content: center; }
          .banking-preview { display: none; }
          
          /* Bento Grid Mobile */
          .modern-highlights { padding: 80px 24px; }
          .section-header h2 { font-size: 36px; }
          .bento-grid { grid-template-columns: 1fr; grid-template-rows: auto; gap: 16px; }
          .bento-card { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 200px; }
          .bento-card h3 { font-size: 20px; }
          .reward-amount { font-size: 36px; }
          
          /* Interactive Features Mobile */
          .interactive-features { padding: 80px 24px; }
          .features-header h2 { font-size: 36px; }
          .features-grid { grid-template-columns: 1fr; gap: 24px; }
          .feature-card { padding: 32px 24px; }
          .goal-stats { gap: 20px; }
          .value-amount { font-size: 28px; }
          
          /* Product Showcase Mobile */
          .product-showcase { padding: 80px 24px; }
          .showcase-header h2 { font-size: 36px; }
          .product-grid { grid-template-columns: 1fr; gap: 32px; }
          .product-content { padding: 32px 24px; }
          .card-mockup { width: 240px; height: 150px; }
          .card-number { font-size: 16px; }
          .account-mockup, .investment-mockup { max-width: 280px; }
          
          /* App Trust Section Mobile */
          .app-trust-section { padding: 80px 24px; }
          .app-showcase { grid-template-columns: 1fr; gap: 60px; text-align: center; }
          .app-content h2 { font-size: 36px; }
          .trust-badges { justify-content: center; }
          .app-download { justify-content: center; flex-wrap: wrap; }
          .phone-mockup { width: 250px; height: 500px; }
          .app-interface { padding: 20px; }
          .balance-amount { font-size: 28px; }
          
          /* Modern Footer Mobile */
          .modern-footer { padding: 60px 24px 32px; }
          .footer-top { grid-template-columns: 1fr; gap: 48px; }
          .footer-links { grid-template-columns: repeat(2, 1fr); gap: 32px; }
          .footer-certifications { flex-wrap: wrap; gap: 24px; }
          .footer-certifications .cert-item:first-child img { width: 350px !important; height: 100px !important; }
          .footer-bottom { flex-direction: column; text-align: center; }
          .footer-contact { flex-direction: column; gap: 16px; }
          .legal-links { justify-content: center; }
        }
      `}</style>
    <div className="min-h-screen bg-white">
      {/* Enhanced Header */}
      <header className="modern-header">
        <div className="modern-header-inner">
          <div className="header-brand">
            <Image src="/assets/BofA_rgb.png" alt="Swift Financial" width={200} height={24} priority />
          </div>
          <nav className="modern-nav">
            <div className="nav-item dropdown">
              <Link href="#" className="nav-link">
                Personal
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <div className="dropdown-menu">
                <div className="dropdown-section">
                  <h4>Banking</h4>
                  <Link href="#">Checking Accounts</Link>
                  <Link href="#">Savings Accounts</Link>
                  <Link href="#">CDs & IRAs</Link>
                </div>
                <div className="dropdown-section">
                  <h4>Credit Cards</h4>
                  <Link href="#">Cash Rewards</Link>
                  <Link href="#">Travel Rewards</Link>
                  <Link href="#">Student Cards</Link>
                </div>
                <div className="dropdown-section">
                  <h4>Loans</h4>
                  <Link href="#">Personal Loans</Link>
                  <Link href="#">Auto Loans</Link>
                  <Link href="#">Home Loans</Link>
                </div>
              </div>
            </div>
            <div className="nav-item dropdown">
              <Link href="#" className="nav-link">
                Business
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <div className="dropdown-menu">
                <div className="dropdown-section">
                  <h4>Small Business</h4>
                  <Link href="#">Business Checking</Link>
                  <Link href="#">Business Credit Cards</Link>
                  <Link href="#">Business Loans</Link>
                </div>
                <div className="dropdown-section">
                  <h4>Commercial</h4>
                  <Link href="#">Treasury Management</Link>
                  <Link href="#">Commercial Lending</Link>
                  <Link href="#">International Trade</Link>
                </div>
              </div>
            </div>
            <div className="nav-item dropdown">
              <Link href="#" className="nav-link">
                Investing
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <div className="dropdown-menu">
                <div className="dropdown-section">
                  <h4>Investment Accounts</h4>
                  <Link href="#">Self-Directed Investing</Link>
                  <Link href="#">Managed Portfolios</Link>
                  <Link href="#">Retirement Planning</Link>
                </div>
                <div className="dropdown-section">
                  <h4>Wealth Management</h4>
                  <Link href="#">Private Banking</Link>
                  <Link href="#">Financial Advisors</Link>
                  <Link href="#">Estate Planning</Link>
                </div>
              </div>
            </div>
            <Link href="#" className="nav-link">Support</Link>
          </nav>
          <div className="header-actions">
            <div id="google_translate_element"></div>
            <Link href="/login" className="signin-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign In
            </Link>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Modern Hero Section */}
      <section className="modern-hero">
        {/* Hero Carousel */}
        <div className="hero-carousel">
          {heroSlides.map((slide, index) => (
            <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
              {slide.type === 'image' ? (
                <img src={slide.src} alt={`Hero ${index + 1}`} />
              ) : (
                <video
                  key={`video-${index}-${currentSlide}`}
                  src={slide.src}
                  autoPlay={index === currentSlide}
                  muted
                  playsInline
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="modern-hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">🏆 #1 Digital Banking Platform 2024</span>
            </div>
            <h1 className="hero-title">
              Banking that moves
              <span className="gradient-text"> at the speed of life</span>
            </h1>
            <p className="hero-subtitle">
              Experience next-generation banking with 
              instant transfers, and security that never sleeps.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number" data-target="67">67</div>
                <div className="stat-label">Million+ Customers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" data-target="99.9">99.9</div>
                <div className="stat-label">% Uptime</div>
              </div>
              <div className="stat-item">
                <div className="stat-number" data-target="24">24hr</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
            <div className="hero-cta">
              {/* <Link href="/register" className="btn-primary-modern">
                <span>Start Banking Today</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.16667 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link> */}
            </div>
          </div>
          <div className="hero-visual">
            <div className="banking-preview">
              <div className="preview-card main-card" style={{ maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Welcome</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>Access your account securely</p>
                </div>
                
                <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={async (e) => {
                  e.preventDefault();
                  setHeroLoading(true);
                  setHeroError('');
                  
                  let errorMessage = '';
                  
                  if (!heroEmail && !heroPassword) {
                    errorMessage = 'Please fill in all fields';
                  } else if (!heroEmail && heroPassword) {
                    errorMessage = 'Enter email/username';
                  } else if (heroEmail && !heroPassword) {
                    errorMessage = 'Enter password';
                  }
                  
                  if (errorMessage) {
                    setHeroError(errorMessage);
                    setHeroLoading(false);
                    return;
                  }
                  
                  try {
                    const res = await fetch('/api/login', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: heroEmail, password: heroPassword }),
                    });

                    const data = await res.json();

                    if (res.ok) {
                      const role = data.role || 'user';
                      localStorage.setItem('userEmail', heroEmail);
                      localStorage.setItem('userRole', role);
                      
                      if (role === 'admin' || role === 'superadmin') {
                        window.location.href = '/admin';
                      } else {
                        window.location.href = '/dashboard';
                      }
                    } else {
                      setHeroError(data.message || 'Login failed');
                    }
                  } catch (error) {
                    setHeroError('Network error. Please try again.');
                  }
                  
                  setHeroLoading(false);
                }}>
                  {/* Email Field with Floating Label */}
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      id="hero-email"
                      name="email"
                      value={heroEmail}
                      onChange={(e) => {
                        setHeroEmail(e.target.value);
                        const nextSibling = e.target.nextElementSibling as HTMLElement | null;
                        if (e.target.value && nextSibling) {
                          nextSibling.style.transform = 'translateY(-12px) scale(0.85)';
                          nextSibling.style.color = '#0066CC';
                        }
                      }}
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
                      htmlFor="hero-email"
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
                      id="hero-password"
                      name="password"
                      value={heroPassword}
                      onChange={(e) => {
                        setHeroPassword(e.target.value);
                        const nextSibling = e.target.nextElementSibling as HTMLElement | null;
                        if (e.target.value && nextSibling) {
                          nextSibling.style.transform = 'translateY(-12px) scale(0.85)';
                          nextSibling.style.color = '#0066CC';
                        }
                      }}
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
                      htmlFor="hero-password"
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
                      id="hero-remember"
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#0066CC'
                      }}
                    />
                    <label
                      htmlFor="hero-remember"
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
                  {heroError && (
                    <div style={{
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      padding: '12px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      border: '1px solid #fecaca',
                      marginBottom: '16px'
                    }}>
                      {heroError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={heroLoading}
                    style={{
                      padding: '16px',
                      background: heroLoading ? '#ccc' : 'linear-gradient(135deg, #0066CC 0%, #004499 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: heroLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)'
                    }}
                  >
                    {heroLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
                
                <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a href="#" style={{ color: '#0066CC', textDecoration: 'none', fontSize: '14px' }}>
                    Forgot username/password?
                  </a>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    Not Enrolled? <a href="/register" style={{ color: '#0066CC', textDecoration: 'none', fontWeight: '600' }}>Sign Up Now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Highlights Section */}
      <section className="modern-highlights">
        <div className="modern-highlights-inner">
          <div className="section-header">
            <h2>Everything you need to manage your money</h2>
            <p>Powerful tools and features designed for modern banking</p>
          </div>
          <div className="bento-grid">
            <div className="bento-card large">
              <div className="card-content">
                <div className="card-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="12" width="40" height="24" rx="4" stroke="currentColor" strokeWidth="2"/>
                    <path d="M4 20h40M12 28h8M12 32h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3>Smart Checking</h3>
                <p>AI-powered insights help you save more and spend smarter with real-time notifications</p>
                <div className="card-feature">
                  <span className="feature-badge">No Monthly Fees</span>
                  <span className="feature-value">$0</span>
                </div>
              </div>
           
            </div>
            
            <div className="bento-card large">
              <div className="card-content">
                <div className="card-icon credit-card">
                  <Image src="/homepage/assets-images-site-hp-assets-highlights-consumer-cards-en-bofa_icon_card1_186.svg" alt="Credit Card" width={40} height={40} />
                </div>
                <h3>Rewards Credit Card</h3>
                <p>Earn 3% cash back on your top spending category</p>
                <div className="reward-display">
                  <span className="reward-amount">3%</span>
                  <span className="reward-label">Cash Back</span>
                </div>
              </div>
            </div>
            
   
            <div className="bento-card small">
              <div className="card-content">
                <div className="card-icon invest">
                  <Image src="/homepage/assets-images-site-homepage-icons-ent_edu_bac_3782311_icon_gc_a-CSXe06a7caa.svg" alt="Investment" width={32} height={32} />
                </div>
                <h3>Investment</h3>
                <p>Grow your wealth with expert-guided investing</p>
              </div>
            </div>
            
            <div className="bento-card medium security">
              <div className="card-content">
                <div className="card-icon">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 2L32 8v12c0 12-12 16-12 16s-12-4-12-16V8l12-6z" stroke="currentColor" strokeWidth="2" fill="rgba(0, 212, 170, 0.1)"/>
                    <path d="M16 18l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Bank-Level Security</h3>
                <p>256-bit encryption and biometric authentication keep your money safe</p>
                <div className="security-badges">
                  <span className="security-badge">FDIC Insured</span>
                  <span className="security-badge">SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="interactive-features">
        <div className="interactive-features-inner">
          <div className="features-header">
            <h2>Smart Financial Tools</h2>
            <p>Calculate, plan, and achieve your financial goals with our intelligent tools</p>
          </div>
          <div className="features-grid">
            <div className="feature-card calculator">
              <div className="feature-content">
                <h3>Mortgage Calculator</h3>
                <p>Find out what you can afford and estimate your monthly payments</p>
                <div className="calculator-inputs">
                  <div className="input-group">
                    <label>Home Price</label>
                    <input type="text" placeholder="$450,000" className="calc-input" />
                  </div>
                  <div className="input-group">
                    <label>Down Payment</label>
                    <input type="text" placeholder="20%" className="calc-input" />
                  </div>
                  <div className="input-group">
                    <label>Interest Rate</label>
                    <input type="text" placeholder="6.5%" className="calc-input" />
                  </div>
                </div>
                <div className="calculation-result">
                  <span className="result-label">Monthly Payment</span>
                  <span className="result-amount">$2,274</span>
                </div>
                <button className="calc-button">
                  Get Pre-Approved
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.33333 8H12.6667M12.6667 8L8.66667 4M12.6667 8L8.66667 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="feature-card savings">
              <div className="feature-content">
                <h3>Savings Goal Tracker</h3>
                <p>Visualize your progress and stay motivated to reach your goals</p>
                <div className="savings-goal">
                  <div className="goal-header">
                    <span className="goal-title">Emergency Fund</span>
                    <span className="goal-target">$10,000</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: '68%'}}></div>
                    </div>
                    <span className="progress-text">$6,800 saved</span>
                  </div>
                  <div className="goal-stats">
                    <div className="stat">
                      <span className="stat-value">$320</span>
                      <span className="stat-label">Monthly</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">10</span>
                      <span className="stat-label">Months left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="feature-card investment">
              <div className="feature-content">
                <h3>Investment Portfolio</h3>
                <p>Track your investments and see real-time performance</p>
                <div className="portfolio-summary">
                  <div className="portfolio-value">
                    <span className="value-amount">$45,280</span>
                    <span className="value-change positive">+$2,140 (4.96%)</span>
                  </div>
                  <div className="portfolio-chart">
                    <svg width="100%" height="80" viewBox="0 0 300 80">
                      <path d="M0,60 Q75,45 150,40 T300,25" stroke="#00D4AA" strokeWidth="3" fill="none" className="portfolio-line"/>
                      <defs>
                        <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="#00D4AA" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <path d="M0,60 Q75,45 150,40 T300,25 L300,80 L0,80 Z" fill="url(#portfolioGradient)"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Enhanced Product Showcase */}
      <section className="product-showcase">
        <div className="product-showcase-inner">
          <div className="showcase-header">
            <h2>Banking Products Designed for You</h2>
            <p>Discover financial solutions that adapt to your lifestyle and goals</p>
          </div>
          <div className="product-grid">
            <div className="product-card premium">
              <div className="product-badge">Most Popular</div>
              <div className="product-image">
                <div className="card-mockup">
                  <Image src="/assets/creditcardchip.jpg" alt="Card Chip" width={50} height={30} style={{ objectFit: 'cover', marginBottom: '20px', borderRadius: '4px' }} />
                  <div className="card-number" style={{ fontSize: '0.9em' }}>**** **** **** 5520</div>
                  <div className="card-name">LUCAS DRAXLER</div>
                  <div className="card-logo">VISA</div>
                </div>
              </div>
              <div className="product-content">
                <h3>Premium Rewards Card</h3>
                <p>Earn unlimited 2% cash back on every purchase, plus exclusive benefits and no annual fee</p>
                <div className="product-features">
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>2% cash back on everything</span>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>No annual fee</span>
                  </div>
                  <div className="feature-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Travel insurance included</span>
                  </div>
                </div>
                <Link href="#" className="product-cta">
                  Apply Now
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.33333 8H12.6667M12.6667 8L8.66667 4M12.6667 8L8.66667 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <div className="account-mockup">
                  <div className="account-header">
                    <span className="account-type">Checking Account</span>
                    <span className="account-balance">$5,247.83</span>
                  </div>
                  <div className="account-actions">
                    <button className="action-btn">Transfer</button>
                    <button className="action-btn">Pay Bills</button>
                    <button className="action-btn">Deposit</button>
                  </div>
                </div>
              </div>
              <div className="product-content">
                <h3>Smart Checking</h3>
                <p>Intelligent banking with AI-powered insights, fee alerts, and automatic savings</p>
                <div className="product-highlight">
                  <span className="highlight-label">Monthly Fee</span>
                  <span className="highlight-value">$0</span>
                </div>
                <Link href="#" className="product-cta secondary">
                  Open Account
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.33333 8H12.6667M12.6667 8L8.66667 4M12.6667 8L8.66667 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="product-card">
              <div className="product-image">
                <div className="investment-mockup">
                  <div className="investment-chart">
                    <svg width="100%" height="120" viewBox="0 0 200 120">
                      <path d="M20,100 Q60,80 100,70 T180,40" stroke="#8B5CF6" strokeWidth="3" fill="none" className="investment-line"/>
                      <circle cx="180" cy="40" r="4" fill="#8B5CF6"/>
                    </svg>
                  </div>
                  <div className="investment-value">
                    <span className="investment-amount">$28,450</span>
                    <span className="investment-growth">+18.2%</span>
                  </div>
                </div>
              </div>
              <div className="product-content">
                <h3>Investment Portfolio</h3>
                <p>Professional portfolio management with low fees and personalized strategies</p>
                <div className="product-highlight">
                  <span className="highlight-label">Management Fee</span>
                  <span className="highlight-value">0.35%</span>
                </div>
                <Link href="#" className="product-cta secondary">
                  Start Investing
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3.33333 8H12.6667M12.6667 8L8.66667 4M12.6667 8L8.66667 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced App & Trust Section */}
      <section className="app-trust-section">
        <div className="app-trust-inner">
          <div className="app-showcase">
            <div className="app-content">
              <div className="trust-badges">
                <div className="trust-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="#FFD700"/>
                  </svg>
                  <span>4.8★ App Store</span>
                </div>
                <div className="trust-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L22 8.5V15.5C22 19.09 19.09 22 15.5 22H8.5C4.91 22 2 19.09 2 15.5V8.5L12 2Z" fill="#00D4AA"/>
                    <path d="M9 12L11 14L15 10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Bank-Level Security</span>
                </div>
                <div className="trust-badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#0066CC"/>
                    <path d="M8 12L11 15L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>FDIC Insured</span>
                </div>
              </div>
              <h2>Award-Winning Mobile Banking</h2>
              <p>Experience banking that fits your lifestyle with our intelligent mobile app featuring AI insights, instant notifications, and seamless money management.</p>
              <div className="app-features">
                <div className="app-feature">
                  <div className="feature-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <rect x="4" y="6" width="24" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M4 12h24M10 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Instant Transfers</h4>
                    <p>Send money in seconds with Zelle and wire transfers</p>
                  </div>
                </div>
                <div className="app-feature">
                  <div className="feature-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M16 4L28 10v10c0 8-12 12-12 12s-12-4-12-12V10l12-6z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 16l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Biometric Security</h4>
                    <p>Face ID and fingerprint authentication for ultimate security</p>
                  </div>
                </div>
                <div className="app-feature">
                  <div className="feature-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M4 20L16 8L28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>AI Insights</h4>
                    <p>Smart spending analysis and personalized financial advice</p>
                  </div>
                </div>
              </div>
              <div className="app-download">
                <Link href="#" className="download-btn">
                  <Image src="/homepage/assets-images-global-get-app-modal-Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917-CSXd8fd3663.svg" alt="Download on App Store" width={160} height={48} />
                </Link>
                <Link href="#" className="download-btn">
                  <Image src="/homepage/assets-images-global-get-app-modal-google-play-badge-CSX89f9024.svg" alt="Get it on Google Play" width={160} height={48} />
                </Link>
              </div>
            </div>
            <div className="app-visual">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="app-interface">
                    {/* Top Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2 5h16M2 10h16M2 15h16" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontSize: '11px', color: '#333', fontWeight: '500' }}>Menu</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ textAlign: 'center', position: 'relative' }}>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <rect x="2" y="4" width="14" height="10" rx="1" stroke="#333" strokeWidth="1.5"/>
                            <path d="M2 6l7 4 7-4" stroke="#333" strokeWidth="1.5"/>
                          </svg>
                          <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#E31837', color: '#fff', borderRadius: '50%', width: '12px', height: '12px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>9</div>
                          <div style={{ fontSize: '9px', color: '#333', marginTop: '2px' }}>Inbox</div>
                        </div>
                        <div style={{ textAlign: 'center', position: 'relative' }}>
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M3 3h12v12H3z" stroke="#333" strokeWidth="1.5"/>
                            <path d="M9 3v12M3 9h12" stroke="#333" strokeWidth="1.5"/>
                          </svg>
                          <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#E31837', color: '#fff', borderRadius: '50%', width: '12px', height: '12px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>9</div>
                          <div style={{ fontSize: '9px', color: '#333', marginTop: '2px' }}>Products</div>
                        </div>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ flex: 1, background: '#EAEAEA', borderRadius: '20px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="6" cy="6" r="4" stroke="#666" strokeWidth="1.5"/>
                          <path d="M9 9l3 3" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span style={{ fontSize: '11px', color: '#666' }}>Hi, I'm Erica. May I help?</span>
                      </div>
                      <div style={{ width: '32px', height: '32px', background: '#E31837', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 8h12M8 2v12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>
                      <div style={{ flex: 1, textAlign: 'center', paddingBottom: '8px', borderBottom: '3px solid #E31837' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#E31837' }}>ACCOUNTS</span>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', paddingBottom: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '500', color: '#666' }}>DASHBOARD</span>
                      </div>
                    </div>

                    {/* Life Plan Card */}
                    <div style={{ background: '#fff', borderRadius: '8px', padding: '12px', marginBottom: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #e5e7eb' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#000', marginBottom: '2px' }}>Swift Financial Life Plan®</div>
                          <div style={{ fontSize: '10px', color: '#666' }}>Set, track, achieve. Your goals are in reach.</div>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M4 2l4 4-4 4" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#000' }}>My Rewards</div>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M4 2l4 4-4 4" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>

                    {/* Banking Card */}
                    <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                      <div style={{ height: '3px', background: 'linear-gradient(to right, #E31837 60%, #012169 60%)' }}></div>
                      <div style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #e5e7eb' }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#000' }}>Banking</span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 8l4-4 4 4" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#000' }}>Swift Financial</span>
                          <div style={{ display: 'flex', gap: '1px' }}>
                            <div style={{ width: '3px', height: '12px', background: '#E31837', transform: 'skewX(-15deg)' }}></div>
                            <div style={{ width: '3px', height: '12px', background: '#E31837', transform: 'skewX(-15deg)' }}></div>
                            <div style={{ width: '3px', height: '12px', background: '#012169', transform: 'skewX(-15deg)' }}></div>
                          </div>
                        </div>
                        <div style={{ fontSize: '8px', color: '#666', fontStyle: 'italic', marginBottom: '10px' }}>FDIC-Insured - Backed by the full faith and credit of the U.S. Government</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#000' }}>Ahmonte</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#000' }}>- $1,397.15</span>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M3 2l4 3-4 3" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '11px', color: '#000' }}>Advantage Savings -</div>
                            <div style={{ fontSize: '11px', color: '#000' }}>2501</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#000' }}>$2.67</span>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M3 2l4 3-4 3" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
               
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="modern-footer">
        <div className="modern-footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <Image src="/assets/BofA_rgb.png" alt="Swift Financial" width={200} height={24} />
              <p>Empowering financial futures through innovative banking solutions and personalized service since 1904.</p>
              <div className="footer-social">
                <Link href="#" className="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="#" className="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="#" className="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link href="#" className="social-link">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 21l4-7 4 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Banking Services</h4>
                <ul>
                  <li><Link href="#">Checking Accounts</Link></li>
                  <li><Link href="#">Savings Accounts</Link></li>
                  <li><Link href="#">Credit Cards</Link></li>
                  <li><Link href="#">Personal Loans</Link></li>
                  <li><Link href="#">Mortgages</Link></li>
                  <li><Link href="#">Auto Loans</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Investment & Wealth</h4>
                <ul>
                  <li><Link href="#">Investment Accounts</Link></li>
                  <li><Link href="#">Retirement Planning</Link></li>
                  <li><Link href="#">Financial Advisors</Link></li>
                  <li><Link href="#">Portfolio Management</Link></li>
                  <li><Link href="#">Estate Planning</Link></li>
                  <li><Link href="#">Insurance</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Business Banking</h4>
                <ul>
                  <li><Link href="#">Business Checking</Link></li>
                  <li><Link href="#">Business Credit Cards</Link></li>
                  <li><Link href="#">Business Loans</Link></li>
                  <li><Link href="#">Merchant Services</Link></li>
                  <li><Link href="#">Treasury Management</Link></li>
                  <li><Link href="#">Commercial Real Estate</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Support & Resources</h4>
                <ul>
                  <li><Link href="#">Customer Support</Link></li>
                  <li><Link href="#">Find ATM/Branch</Link></li>
                  <li><Link href="#">Security Center</Link></li>
                  <li><Link href="#">Financial Education</Link></li>
                  <li><Link href="#">Mobile App</Link></li>
                  <li><Link href="#">Online Banking</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><Link href="#">About Us</Link></li>
                  <li><Link href="#">Careers</Link></li>
                  <li><Link href="#">Press Room</Link></li>
                  <li><Link href="#">Investor Relations</Link></li>
                  <li><Link href="#">Corporate Responsibility</Link></li>
                  <li><Link href="#">Supplier Diversity</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-certifications">
            <div className="cert-item">
              <Image src="/homepage/assets-images-global-fdic-fdic-digital-sign-CSX37f66a3e.svg" alt="FDIC" width={500} height={120} />
            </div>
            <div className="cert-item">
              <div className="cert-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L28 8v10c0 8-12 12-12 12s-12-4-12-12V8l12-6z" stroke="#00D4AA" strokeWidth="2" fill="rgba(0, 212, 170, 0.1)"/>
                  <path d="M12 16l3 3 6-6" stroke="#00D4AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>SSL Secured</span>
            </div>
            <div className="cert-item">
              <div className="cert-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="8" width="24" height="16" rx="3" stroke="#0066CC" strokeWidth="2"/>
                  <path d="M4 14h24M10 20h8" stroke="#0066CC" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span>Equal Housing Lender</span>
            </div>
            <div className="cert-item">
              <div className="cert-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="12" stroke="#FF6B35" strokeWidth="2"/>
                  <path d="M12 16l3 3 6-6" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>SOC 2 Compliant</span>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              <p>© 2025 Swift Financial Corporation. All rights reserved.</p>
              <div className="legal-links">
                <Link href="#">Privacy Policy</Link>
                <Link href="#">Terms of Service</Link>
                <Link href="#">Cookie Policy</Link>
                <Link href="#">Accessibility</Link>
                <Link href="#">Site Map</Link>
              </div>
            </div>
            <div className="footer-contact">
              <div className="contact-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 3h16l-8 5-8-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 3v14h16V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>support@bankofamerica.com</span>
              </div>
              <div className="contact-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 3a1 1 0 0 1 1-1h2.153a1 1 0 0 1 .986.836l.74 4.435a1 1 0 0 1-.54 1.06l-1.548.773a11.037 11.037 0 0 0 6.105 6.105l.774-1.548a1 1 0 0 1 1.059-.54l4.435.74a1 1 0 0 1 .836.986V17a1 1 0 0 1-1 1h-2C7.82 18 2 12.18 2 5V3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>1-800-BANK-BOA</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
