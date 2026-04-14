export default function ReceiptModal({ showReceipt, setShowReceipt, receiptData, showToast }: any) {
  if (!showReceipt || !receiptData) return null;

  return (
    <>
      <style jsx>{`
        .receipt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justifyContent: center;
          padding: 20px;
        }
        .receipt-modal {
          background: white;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow: auto;
        }
      `}</style>

      <div className="receipt-overlay" onClick={() => setShowReceipt(false)}>
        <div id="receipt-content" className="receipt-modal" onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>Transaction Successful</h2>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{receiptData.status}</p>
            </div>
            
            <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Transaction Type</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{receiptData.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Amount</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>${receiptData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>From</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', textAlign: 'right' }}>{receiptData.from}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>To</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', textAlign: 'right' }}>{receiptData.to}</span>
              </div>
              {receiptData.routing && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Routing Number</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{receiptData.routing}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Description</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', textAlign: 'right' }}>{receiptData.description}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Date & Time</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{receiptData.date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Confirmation Number</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827', fontFamily: 'monospace' }}>{receiptData.confirmationNumber}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => {
                const printContent = document.getElementById('receipt-content');
                const printWindow = window.open('', '', 'width=800,height=600');
                printWindow?.document.write('<html><head><title>Receipt</title>');
                printWindow?.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;}</style>');
                printWindow?.document.write('</head><body>');
                printWindow?.document.write(printContent?.innerHTML || '');
                printWindow?.document.write('</body></html>');
                printWindow?.document.close();
                printWindow?.print();
              }} style={{ flex: 1, padding: '14px', background: '#e31837', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Print Receipt</button>
              <button onClick={() => {
                const receiptText = `
SWIFT FINANCIAL RECEIPT
========================

Transaction Type: ${receiptData.type}
Amount: $${receiptData.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
From: ${receiptData.from}
To: ${receiptData.to}
${receiptData.routing ? `Routing Number: ${receiptData.routing}\n` : ''}Description: ${receiptData.description}
Date: ${receiptData.date.toLocaleString()}
Confirmation: ${receiptData.confirmationNumber}
Status: ${receiptData.status}

========================
Swift Financial, N.A.
Member FDIC
                `;
                const blob = new Blob([receiptText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Receipt_${receiptData.confirmationNumber}.txt`;
                a.click();
                showToast('Receipt saved successfully', 'success');
              }} style={{ flex: 1, padding: '14px', background: '#f3f4f6', color: '#111827', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Save as File</button>
            </div>
            
            <button onClick={() => setShowReceipt(false)} style={{ width: '100%', padding: '14px', background: 'none', color: '#6b7280', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', marginTop: '12px' }}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
}
