import { ChevronRight, ChevronUp } from 'lucide-react';
import CreditCard from './CreditCard';

export default function AccountsTab({ 
  name, balance, savingsBalance, creditBalance, accountId, iban, taxCleared, cardFlipped, 
  bankingExpanded, expandedAccount, setActiveTab, setActiveNav, setBankingExpanded, 
  setExpandedAccount, setCardFlipped, downloadStatement, showToast, transactionPin 
}: any) {
  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .card-row { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: 1px solid #F3F4F6; }
        .card-row:last-child { border-bottom: none; }
        .card-row:hover { background: #F9FAFB; }
        .row-left { flex: 1; }
        .row-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 4px; }
        .row-subtitle { font-size: 13px; color: #6B7280; }
        .banking-accent { height: 4px; background: linear-gradient(to right, #E31837 60%, #012169 60%); }
        .banking-header { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: 1px solid #F3F4F6; }
        .banking-title { font-size: 18px; font-weight: 700; color: #111827; }
        .bank-identity { padding: 16px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #F3F4F6; }
        .bank-name { font-size: 16px; font-weight: 700; color: #111827; }
        .bank-logo { display: flex; gap: 2px; }
        .logo-stripe { width: 8px; height: 20px; border-radius: 2px; }
        .fdic-row { padding: 12px 20px; border-bottom: 1px solid #F3F4F6; }
        .fdic-text { font-size: 12px; font-weight: 700; color: #012169; margin-bottom: 4px; }
        .fdic-disclaimer { font-size: 10px; color: #6B7280; font-style: italic; }
        .account-row { padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F3F4F6; cursor: pointer; }
        .account-row:hover { background: #F9FAFB; }
        .account-name { font-size: 15px; color: #111827; }
        .account-balance { font-size: 16px; font-weight: 700; color: #111827; margin-right: 8px; }
        .account-details { padding: 16px 20px; background: #f9fafb; border-top: 1px solid #e5e7eb; }
        .detail-buttons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .detail-btn { padding: 12px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; color: #012169; cursor: pointer; transition: all 0.2s; }
        .detail-btn:hover { background: #012169; color: white; border-color: #012169; }
        .credit-card-container { perspective: 1000px; cursor: pointer; margin-bottom: 16px; width: 100%; max-width: 400px; margin-left: auto; margin-right: auto; }
        .credit-card-3d { position: relative; width: 100%; height: 250px; transition: transform 0.6s; transform-style: preserve-3d; max-width: 400px; }
        .card-face { position: absolute; width: 100%; height: 250px; backface-visibility: hidden; background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%); border-radius: 12px; padding: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); color: white; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow: hidden; }
        .card-face.back { transform: rotateY(180deg); background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); }
        .promo-card { padding: 20px; }
        .promo-top { display: flex; gap: 16px; margin-bottom: 20px; }
        .promo-icon { width: 60px; height: 60px; background: #012169; border-radius: 8px; display: flex; align-items: center; justify-content: center; transform: rotate(-5deg); flex-shrink: 0; }
        .promo-text { flex: 1; }
        .promo-headline { font-size: 18px; font-weight: 700; color: #111827; margin-bottom: 8px; }
        .promo-body { font-size: 14px; color: #6B7280; line-height: 1.5; }
        .promo-actions { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #F3F4F6; padding-top: 16px; gap: 1px; }
        .promo-btn { padding: 12px; text-align: center; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; color: #0055C4; background: none; border: none; cursor: pointer; }
        .promo-btn:first-child { border-right: 1px solid #F3F4F6; }
      `}</style>
      <div className="card">
        <div className="card-row" onClick={() => { setActiveTab('lifeplan'); setActiveNav('more'); }}>
          <div className="row-left">
            <div className="row-title">Swift Financial Life Plan®</div>
            <div className="row-subtitle">Set, track, achieve. Your goals are in reach.</div>
          </div>
          <ChevronRight size={20} color="#6B7280" />
        </div>
        <div className="card-row" onClick={() => { setActiveTab('rewards'); setActiveNav('more'); }}>
          <div className="row-left">
            <div className="row-title">My Rewards</div>
          </div>
          <ChevronRight size={20} color="#6B7280" />
        </div>
      </div>

      <div className="card">
        <div className="banking-accent"></div>
        <div className="banking-header" onClick={() => setBankingExpanded(!bankingExpanded)}>
          <div className="banking-title">Banking</div>
          {bankingExpanded ? <ChevronUp size={20} color="#6B7280" /> : <ChevronRight size={20} color="#6B7280" />}
        </div>
        
        {bankingExpanded && (
          <>
            <div className="bank-identity">
              <div className="bank-name">Swift Financial</div>
              <div className="bank-logo">
                <div className="logo-stripe" style={{ background: '#E31837' }}></div>
                <div className="logo-stripe" style={{ background: '#E31837' }}></div>
                <div className="logo-stripe" style={{ background: '#012169' }}></div>
              </div>
            </div>

            <div className="fdic-row">
              <div className="fdic-text">FDIC</div>
              <div className="fdic-disclaimer">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</div>
            </div>

            <div className="account-row" onClick={() => setExpandedAccount(expandedAccount === 'checking' ? null : 'checking')}>
              <div className="account-name">{name || 'Ahmonte'}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="account-balance">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <ChevronRight size={20} color="#6B7280" />
              </div>
            </div>
            {expandedAccount === 'checking' && (
              <div className="account-details">
                <div className="detail-buttons">
                  <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('transfer'); setActiveNav('transfer'); }}>Transfer</button>
                  <button className="detail-btn" onClick={(e) => { e.stopPropagation(); window.location.href = '/statements'; }}>Statement</button>
                  <button className="detail-btn" onClick={(e) => { e.stopPropagation(); showToast('Account details: Checking ...'+accountId.slice(-4), 'success'); }}>Details</button>
                </div>
              </div>
            )}

            <div className="account-row" onClick={() => setExpandedAccount(expandedAccount === 'savings' ? null : 'savings')}>
              <div className="account-name">Advantage Savings - 2501</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="account-balance">${savingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <ChevronRight size={20} color="#6B7280" />
              </div>
            </div>
            {expandedAccount === 'savings' && (
              <div className="account-details">
                <div className="detail-buttons">
                  <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('transfer'); setActiveNav('transfer'); }}>Transfer</button>
                  <button className="detail-btn" onClick={(e) => { e.stopPropagation(); window.location.href = '/statements'; }}>Statement</button>
                  <button className="detail-btn" onClick={(e) => { e.stopPropagation(); showToast('APY: 2.5% Annual Percentage Yield', 'success'); }}>APY Info</button>
                </div>
              </div>
            )}

            <div className="account-row" onClick={() => setExpandedAccount(expandedAccount === 'credit' ? null : 'credit')}>
              <div className="account-name">Business Cash Rewards - {accountId.slice(-4) || '9832'}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="account-balance">${creditBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <ChevronRight size={20} color="#6B7280" />
              </div>
            </div>
            {expandedAccount === 'credit' && (
              <div className="account-details">
                <CreditCard accountId={accountId} name={name} transactionPin={transactionPin} />
                <div className="detail-buttons">
                  <button className="detail-btn" onClick={(e) => { e.stopPropagation(); setActiveTab('transfer'); setActiveNav('transfer'); }}>Pay Card</button>
                  <button className="detail-btn" onClick={(e) => { e.stopPropagation(); showToast('You have 15,000 rewards points', 'success'); }}>Rewards</button>
                  <button className="detail-btn" onClick={(e) => { e.stopPropagation(); window.location.href = '/statements'; }}>Statement</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="card">
        <div className="promo-card">
          <div className="promo-top">
            <div className="promo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="8" y="4" width="16" height="20" fill="white" rx="2"/>
                <line x1="10" y1="8" x2="18" y2="8" stroke="#E31837" strokeWidth="2"/>
                <line x1="10" y1="11" x2="18" y2="11" stroke="#E31837" strokeWidth="2"/>
                <path d="M10 14L12 16L18 10" stroke="#E31837" strokeWidth="2" fill="none"/>
                <line x1="10" y1="18" x2="18" y2="18" stroke="#0055C4" strokeWidth="2"/>
                <line x1="10" y1="21" x2="18" y2="21" stroke="#0055C4" strokeWidth="2"/>
              </svg>
            </div>
            <div className="promo-text">
              <div className="promo-headline">There's more to explore</div>
              <div className="promo-body">
                Explore Swift Financial credit cards, loans, checking and savings accounts, plus Merrill investment solutions.
              </div>
            </div>
          </div>
          <div className="promo-actions">
            <button className="promo-btn" onClick={() => { setActiveTab('offers'); setActiveNav('more'); }}>OFFERS</button>
            <button className="promo-btn" onClick={() => { setActiveTab('products'); setActiveNav('more'); }}>PRODUCTS</button>
          </div>
        </div>
      </div>
    </>
  );
}
