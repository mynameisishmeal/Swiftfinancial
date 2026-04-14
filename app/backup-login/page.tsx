'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [buttonStyle, setButtonStyle] = useState({});
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

  useEffect(() => {
    setButtonStyle({
      paddingLeft: '25px',
      background: 'url(/assets/sign-in-sprite.png) no-repeat calc(50% - 20px) -1px #0073cf',
      backgroundSize: '12px',
      maxWidth: '120px'
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userId, password }),
      });
      const data = await res.json();
      if (res.ok) {
        const role = data.role || 'user';
        localStorage.setItem('userEmail', userId);
        localStorage.setItem('userRole', role);
        
        // Role-based redirect
        if (role === 'admin' || role === 'superadmin') {
          router.push('/admin');
        } else if (role === 'user') {
          router.push('/dashboard');
        } else {
          // No valid role, redirect back to login
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRole');
          setError(true);
        }
      } else {
        setError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <>
      <link rel="stylesheet" type="text/css" href="/assets/vipaa-v4-jawr.css" media="all" />
      <link type="text/css" rel="stylesheet" href="/assets/styles-67459201e251b94c0aa0.m.css" />
      <div className="fsd-layout fsd-2c-700lt-layout">
        <div className="fsd-border">
          <div className="center-content">
            <div className="header">
              <div className="header-module">
                <div id="gtSecureFdicWidgetContainer" className="sparta-widget-loader-v6" style={{ height: 'auto', visibility: 'visible' }}>
                  <div data-sparta-wrapper="gt-secure-fdic-widget-1.0.0" className="gt-secure-fdic-widget-1-0-0 xsmall small xsmall-up small-up smallMid smallMid-up smallPlus smallPlus-up medium medium-up large large-up large-only largeCentered xlarge xlarge-up xxlarge xxlarge-up xxlarge-only landscape standard" data-build-id="266727">
                    <div className="sparta-widget-container" data-version="1.0.0" data-sparta-container="gt-secure-fdic-widget" data-sparta-widget="" data-sparta-lang="en-US" style={{ visibility: 'visible' }}>
                      <div className="sparta-widget">
                        <div data-component="layout" data-layout="@sparta.global.widgets/gt-secure-fdic-widget" data-version="" className="gt-secure-fdic-widget-layout sparta-layout layout-1col-multi-row" id="top">
                          <section id="head-row" className="small-centered head-row">
                            <div className="row spa-collapse-small spa-uncollapse-large">
                              <div className="large-12 columns"></div>
                            </div>
                          </section>
                          <section className="small-centered section-body">
                            <div className="row spa-collapse-small spa-collapse-large">
                              <div className="large-12 small-12 columns">
                                <div id="gtSecureFDICWidget" data-component="module" data-sparta-load="primary" data-module-ref="@sparta.global.widgets/gt-secure-fdic-widget" data-init="GTSecureFDICWidget" data-module-parameters="{}" className="gt-secure-fdic-widget-class-v-1-0-0 gt-secure-fdic-widget" data-module="gt-secure-fdic-widget" data-version="1.0.0"></div>
                                <div id="gtSecureFDICModule" data-component="module" data-sparta-load="primary" data-module-ref="@sparta.global-tenants.modules/gt-secure-fdic-module" data-init="GTSecureFDICModule" data-module-parameters="{}" className="global-tenants-gt-secure-fdic-module-class-v-1-0-33 global-tenants-gt-secure-fdic-module" data-module="global-tenants-gt-secure-fdic-module" data-version="1.0.33">
                                  <section>
                                    <div id="fdicConsumerContainer" className="fdic-realDevice">
                                      <div id="fdicConsumer">
                                        <div className="fdic-signage">
                                          <div className="elements">
                                            <span className="text-preamble">Bank of America deposit products: </span>
                                            <img src="/assets/assets-images-global-fdic-fdic-digital-sign-CSX37f66a3e.svg" alt="FDIC-Insured - Backed by the full faith and credit of the U.S. Government" className="fdic-digital-sign" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="fdic-hidden" id="fdicWealth">
                                        <div className="investment-text">Investment products are not FDIC-Insured.</div>
                                      </div>
                                    </div>
                                    <div id="fdicWealthSmall" className="fdic-wealthSmalldevice">
                                      <img src="/assets/assets-images-global-fdic-fdic-wealth-banner-smalldevice-en-CSX7f123629.svg" alt="Bank of America Deposit products:FDIC Insured - Backed by the full faith and credit of the US Government. Investment products are NOT FDIC insured" className="fdic-banner-svg" />
                                    </div>
                                  </section>
                                </div>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="fsd-secure-esp-skin">
                  <img height="28" width="230" alt="Swift Financial" src="/assets/BofA_rgb.png" />
                  <div className="page-type cnx-regular" data-font="#!">Log In</div>
                  <div className="right-links">
                    <div className="secure-area">Secure Area</div>
                    <div className="clearboth"></div>
                  </div>
                  <div className="clearboth"></div>
                </div>
              </div>

              <div className="page-title-module h-100" id="skip-to-h1">
                <div className="red-grad-bar-skin sup-ie">
                  <h1 data-font="#!" className="cnx-regular">Log In to Online Banking</h1>
                </div>
              </div>

              <div id="clientSideErrors" className="messaging-vipaa-module hide" aria-live="polite">
                <div className="error-skin">
                  <div className="error-message">
                    <p className="title TLu_ERROR">We can't process your request.</p>
                    <ul></ul>
                  </div>
                </div>
              </div>

              {error && (
                <div className="messaging-vipaa-module vipaa-pwd" aria-live="polite">
                  <div className="ico-bg" style={{ width: '66px', backgroundColor: '#f9dee1', float: 'left', height: '77px', marginLeft: '21px', marginTop: '1px', backgroundImage: 'url(/assets/error-large.gif)', backgroundPosition: '16px 21px', backgroundRepeat: 'no-repeat' }}>
                    <span className="ada-hidden">error icon</span>
                  </div>
                  <div className="error-skin">
                    <div className="error-message">
                      <p id="Vipaa_Action_0" className="TLu_ERROR"></p>
                      <li>The information you entered doesn't match our records. You have a few more tries remaining.<br /> Please try again or click <a href="#">Forgot ID/Password</a><br /><br /><b>Having problems logging in or resetting your Password?</b> If you're using a password manager or your browser has stored credentials that are no longer valid, deleting your stored credentials should enable you to access your account. <a href="#">Learn more</a></li>
                      <p></p>
                    </div>
                  </div>
                </div>
              )}

              <div className="vipaa-modal-content-module">
                <div className="sitekey-affinity-skin"></div>
              </div>
            </div>

            <div className="columns">
              <div className="flex-col lt-col">
                <div className="online-id-vipaa-module">
                  <div className="enter-skin phoenix">
                    <form className="simple-form collector-form-marker" id="EnterOnlineIDForm" onSubmit={handleSubmit} autoComplete="off">
                      <div className="online-id-section">
                        <label htmlFor="enterID-input">User ID<span className="ada-hidden"> Must be at least 6 characters long</span></label>
                        <input type="text" id="enterID-input" name="user_id" maxLength={32} value={userId} onChange={(e) => setUserId(e.target.value)} autoComplete="off" />
                        
                        <label htmlFor="tlpvt-passcode-input" className="mtop-15">Password<span className="ada-hidden"> is unavailable. Please enter atleast 6 characters of online id to enable Passcode</span></label>
                        <div className="TL_NPI_Pass">
                          <input type="password" className="tl-private fl-lt" id="tlpvt-passcode-input" name="password" maxLength={20} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
                        </div>

                        <a href="#" className="fl-lt forgot-passcode">Forgot your Password?</a>
                        <div className="clearboth"></div>
                        <input type="submit" id="login_button" value={loading ? 'Please wait...' : 'Log In'} className="btn-bofa btn-bofa-blue btn-bofa-small btn-bofa-noRight" disabled={loading} style={buttonStyle} />
                      </div>
                    </form>
                    
                    <div className="mobile-cta-section vertical-dotted-line fl-rt">
                      <p className="cnx-regular title enroll-color-gray mbtm-10">Stay connected with our app</p>
                      <img height="208" width="149" src="/assets/mobile_llama.png" alt="Mobile banking Llama" className="fl-lt" />
                      <div className="get-app-content-section">
                        <div className="cnx-regular title enroll-color-gray mcta-bubble">Secure, convenient banking anytime</div>
                        <a id="choose-device-get-the-app" className="choose-device-get-the-app-modal btn-bofa btn-bofa-red btn-bofa-noRight cnx-regular" href="#" rel="mobile-app-download-choose-device">
                          <span>Get the app</span><span className="ada-hidden">&nbsp; link opens a new info modal layer</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-col rt-col">
                <div className="side-well-vipaa-module">
                  <div className="fsd-ll-skin">
                    <h2>Login help</h2>
                    <ul className="li-pbtm-15">
                      <li><a className="arrow" href="#">Forgot ID/Password?</a></li>
                      <li><a className="arrow" href="#">Problem logging in?</a></li>
                    </ul>
                  </div>
                  <div className="fsd-ll-skin">
                    <h2>Not using Online Banking?</h2>
                    <ul className="li-pbtm-15">
                      <li><a className="arrow" href="/register">Enroll now<span className="ada-hidden"> for online Banking</span></a></li>
                      <li><a className="arrow" href="#">Learn more about Online Banking</a></li>
                      <li><a className="arrow" href="#">Service Agreement</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="clearboth"></div>
            </div>

            <div className="footer">
              <div className="footer-top">&nbsp;</div>
              <div className="footer-inner" style={{ marginTop: '1.3px' }}>
                <div className="global-footer-module">
                  <div className="gray-bground-skin cssp">
                    <div className="secure">Secure area</div>
                    <div className="link-container">
                      <div className="link-row">
                        <a href="#" title="Privacy" target="_blank">Privacy</a>
                        <a href="#" title="Security" target="_blank">Security</a>
                        <a className="last-link" href="#" title="" target="_self">Your Privacy Choices</a>
                        <img id="footer_pill" src="/assets/pill.png" alt="pill" />
                        <div className="clearboth"></div>
                      </div>
                    </div>
                    <p>Swift Financial, N.A. Member FDIC. <a href="#" target="_blank" rel="noopener">Equal Housing Lender</a><br />© 2025 Swift Financial Corporation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
