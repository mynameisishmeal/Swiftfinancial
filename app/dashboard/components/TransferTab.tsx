export default function TransferTab({ 
  paymentType, setPaymentType, transferAmount, setTransferAmount, billAmount, setBillAmount,
  zelleRecipient, setZelleRecipient, zelleAmount, setZelleAmount, wireBank, setWireBank,
  wireRouting, setWireRouting, wireAccount, setWireAccount, wireAmount, setWireAmount,
  paymentMemo, setPaymentMemo, paymentLoading, payeeSearch, setPayeeSearch,
  showPayeeSuggestions, setShowPayeeSuggestions, filteredPayees, handleTransfer,
  handleBillPay, handleZelle, handleWire, transactions, bankSearch, setBankSearch,
  showBankSuggestions, setShowBankSuggestions, filteredBanks
}: any) {
  return (
    <>
      <style jsx>{`
        .card { background: white; border-radius: 12px; margin-bottom: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 8px; }
        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; box-sizing: border-box; }
        .form-input:focus { border-color: #e31837; box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1); }
        .form-input[type="number"]::-webkit-inner-spin-button,
        .form-input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .form-input[type="number"] { -moz-appearance: textfield; }
        .form-select { width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; transition: all 0.2s; background: white; box-sizing: border-box; }
        .form-select:focus { border-color: #e31837; box-shadow: 0 0 0 3px rgba(227, 24, 55, 0.1); }
        .submit-btn { width: 100%; padding: 14px; background: #e31837; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .submit-btn:hover { background: #c41230; }
        .submit-btn:disabled { background: #9ca3af; cursor: not-allowed; }
        .payee-search-container { position: relative; }
        .payee-suggestions { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 2px solid #e31837; border-top: none; border-radius: 0 0 8px 8px; max-height: 240px; overflow-y: auto; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .payee-suggestion-item { padding: 12px 16px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f3f4f6; }
        .payee-suggestion-item:hover { background: #f9fafb; }
        .payee-name { font-size: 14px; font-weight: 600; color: #111827; }
        .payee-category { font-size: 12px; color: #6b7280; }
        .transaction-item { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
        .transaction-info { flex: 1; }
        .transaction-merchant { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px; }
        .transaction-date { font-size: 12px; color: #6b7280; }
        .transaction-amount { font-size: 16px; font-weight: 600; }
        .transaction-amount.positive { color: #10b981; }
        .transaction-amount.negative { color: #111827; }
      `}</style>
      <div className="card">
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#111827' }}>Make a Payment</h2>
          <div className="form-group">
            <label className="form-label">Payment Type</label>
            <select className="form-select" value={paymentType} onChange={(e) => setPaymentType(e.target.value)}>
              <option value="transfer">Transfer Between Accounts</option>
              <option value="bill">Pay Bill</option>
              <option value="zelle">Send Money with Zelle</option>
              <option value="wire">Wire Transfer</option>
            </select>
          </div>
          {paymentType === 'bill' && (
            <div className="form-group">
              <label className="form-label">Search for Payee</label>
              <div className="payee-search-container">
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Search by company name..."
                  value={payeeSearch}
                  onChange={(e) => { setPayeeSearch(e.target.value); setShowPayeeSuggestions(true); }}
                  onFocus={() => setShowPayeeSuggestions(true)}
                />
                {showPayeeSuggestions && payeeSearch.length > 0 && (
                  <div className="payee-suggestions">
                    {filteredPayees.length > 0 ? (
                      filteredPayees.map((payee: any, idx: number) => (
                        <div key={idx} className="payee-suggestion-item" onClick={() => { setPayeeSearch(payee.name); setShowPayeeSuggestions(false); }}>
                          <div className="payee-name">{payee.name}</div>
                          <div className="payee-category">{payee.category}</div>
                        </div>
                      ))
                    ) : (
                      <div className="payee-suggestion-item"><div className="payee-name">No results found</div></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {paymentType === 'zelle' && (
            <div className="form-group">
              <label className="form-label">Recipient Email or Phone</label>
              <input type="text" className="form-input" placeholder="email@example.com or (555) 123-4567" value={zelleRecipient} onChange={(e) => setZelleRecipient(e.target.value)} />
            </div>
          )}
          {paymentType === 'wire' && (
            <>
              <div className="form-group">
                <label className="form-label">Search for Bank</label>
                <div className="payee-search-container">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Search by bank name..."
                    value={bankSearch}
                    onChange={(e) => { setBankSearch(e.target.value); setShowBankSuggestions(true); }}
                    onFocus={() => setShowBankSuggestions(true)}
                  />
                  {showBankSuggestions && bankSearch.length > 0 && (
                    <div className="payee-suggestions">
                      {filteredBanks.length > 0 ? (
                        filteredBanks.map((bank: any, idx: number) => (
                          <div key={idx} className="payee-suggestion-item" onClick={() => { setBankSearch(bank.name); setWireBank(bank.name); setShowBankSuggestions(false); }}>
                            <div className="payee-name">{bank.name}</div>
                            <div className="payee-category">{bank.category}</div>
                          </div>
                        ))
                      ) : (
                        <div className="payee-suggestion-item"><div className="payee-name">No results found</div></div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Routing Number</label>
                <input type="text" className="form-input" placeholder="9 digit routing number" maxLength={9} value={wireRouting} onChange={(e) => setWireRouting(e.target.value.replace(/[^0-9]/g, ''))} />
              </div>
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input type="text" className="form-input" placeholder="Recipient account number" value={wireAccount} onChange={(e) => setWireAccount(e.target.value.replace(/[^0-9]/g, ''))} />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="0.00"
              min="0"
              step="0.01"
              value={paymentType === 'transfer' ? transferAmount : paymentType === 'bill' ? billAmount : paymentType === 'zelle' ? zelleAmount : wireAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (parseFloat(value) >= 0 && !value.includes('-'))) {
                  if (paymentType === 'transfer') setTransferAmount(value);
                  else if (paymentType === 'bill') setBillAmount(value);
                  else if (paymentType === 'zelle') setZelleAmount(value);
                  else setWireAmount(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <input type="text" className="form-input" placeholder="Add a note" value={paymentMemo} onChange={(e) => setPaymentMemo(e.target.value)} />
          </div>
          <button 
            className="submit-btn" 
            onClick={() => {
              if (paymentType === 'transfer') handleTransfer();
              else if (paymentType === 'bill') handleBillPay();
              else if (paymentType === 'zelle') handleZelle();
              else handleWire();
            }}
            disabled={paymentLoading}
          >
            {paymentLoading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </div>
      
      <div className="card">
        <div style={{ padding: '16px 20px', background: '#f8f9fa', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Transaction History</div>
        </div>
        {transactions.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>💳</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>No Transactions Yet</div>
            <div style={{ fontSize: '14px' }}>Your transaction history will appear here</div>
          </div>
        ) : (
          transactions.slice(0, 8).map((tx: any, idx: number) => (
            <div key={idx} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-merchant">{tx.description || tx.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</div>
                <div className="transaction-date">{new Date(tx.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <div className="transaction-amount ${tx.type === 'deposit' ? 'positive' : 'negative'}">
                {tx.type === 'deposit' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
