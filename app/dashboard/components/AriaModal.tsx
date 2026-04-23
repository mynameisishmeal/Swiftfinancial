interface AriaModalProps {
  showAria: boolean;
  setshowAria: (show: boolean) => void;
  ariaMessage: string;
  setariaMessage: (message: string) => void;
  ariaChat: Array<{role: 'user' | 'assistant' | 'admin', message: string}>;
  handleAriaSubmit: () => void;
}

export default function AriaModal(props: AriaModalProps) {
  const { showAria, setshowAria, ariaMessage, setariaMessage, ariaChat, handleAriaSubmit } = props;

  if (!showAria) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    }} onClick={() => setshowAria(false)}>
      <div style={{
        background: 'white',
        borderRadius: '16px 16px 0 0',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #E31837 0%, #c41230 100%)',
          color: 'white',
          borderRadius: '16px 16px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E31837'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 8C4 8 6 6 12 6C18 6 20 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 12C4 12 6 10 12 10C18 10 20 12 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 16C4 16 6 14 12 14C18 14 20 16 20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700' }}>Aria</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Your Virtual Financial Assistant</div>
            </div>
          </div>
          <button onClick={() => setshowAria(false)} style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white'
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {ariaChat.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👋</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Hi, I'm Aria!</div>
              <div style={{ fontSize: '14px' }}>Your virtual financial assistant. Ask me anything about your accounts, transfers, or banking services.</div>
            </div>
          )}
          {ariaChat.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: msg.role === 'user' ? '#E31837' : msg.role === 'admin' ? '#10b981' : '#f3f4f6',
                color: msg.role === 'user' || msg.role === 'admin' ? 'white' : '#111827',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {msg.role === 'admin' && <div style={{ fontSize: '10px', fontWeight: '600', marginBottom: '4px', opacity: 0.9 }}>Support Agent</div>}
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            value={ariaMessage}
            onChange={(e) => setariaMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAriaSubmit()}
            placeholder="Ask Aria anything..."
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '24px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleAriaSubmit}
            disabled={!ariaMessage.trim()}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: ariaMessage.trim() ? '#E31837' : '#e5e7eb',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: ariaMessage.trim() ? 'pointer' : 'not-allowed',
              color: 'white'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
