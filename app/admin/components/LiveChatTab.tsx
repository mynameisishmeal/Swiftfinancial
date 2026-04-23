import { Send } from 'lucide-react';

export default function LiveChatTab({ 
  liveChats, 
  selectedChat, 
  setSelectedChat, 
  adminMessage, 
  setAdminMessage, 
  handleAdminReply 
}: any) {
  return (
    <>
      <style jsx>{`
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .card-content {
          padding: 24px;
        }

        .chat-list {
          max-height: 600px;
          overflow-y: auto;
        }

        .chat-item {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          cursor: pointer;
          transition: background 0.2s;
        }

        .chat-item:hover {
          background: #f9fafb;
        }

        .chat-item.selected {
          background: #fef2f2;
        }

        .chat-messages {
          height: 400px;
          overflow-y: auto;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 16px;
          background: #f9fafb;
        }

        .message {
          margin-bottom: 12px;
          display: flex;
        }

        .message.user {
          justify-content: flex-start;
        }

        .message.admin {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 16px;
        }

        .message.user .message-bubble {
          background: #f3f4f6;
          color: #111827;
        }

        .message.admin .message-bubble {
          background: #E31837;
          color: white;
        }

        .input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }

        .input:focus {
          border-color: #E31837;
        }

        .btn-primary {
          padding: 12px 24px;
          background: #E31837;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background: #c41530;
        }

        .btn-primary:disabled {
          background: #e5e7eb;
          cursor: not-allowed;
        }
      `}</style>

      <div style={{ display: 'grid', gridTemplateColumns: selectedChat ? '1fr 2fr' : '1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Chats ({liveChats.length})</h3>
          </div>
          <div className="chat-list">
            {liveChats.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <div style={{ fontSize: '14px' }}>No active chats</div>
              </div>
            ) : (
              liveChats.map((chat: any) => (
                <div 
                  key={chat.userEmail} 
                  className={`chat-item ${selectedChat?.userEmail === chat.userEmail ? 'selected' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{chat.userName}</div>
                      {chat.aiActive && !chat.takenOver && (
                        <div style={{ background: '#7c3aed', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '10px', fontWeight: 600 }}>AI</div>
                      )}
                    </div>
                    {chat.unreadCount > 0 && (
                      <div style={{ background: '#e31837', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{chat.userEmail}</div>
                  <div style={{ fontSize: '13px', color: '#111827', marginTop: '8px' }}>
                    {chat.messages[chat.messages.length - 1]?.message.substring(0, 50)}...
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedChat && (
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="card-title">{selectedChat.userName}</h3>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{selectedChat.userEmail}</div>
                </div>
                {selectedChat.aiActive && !selectedChat.takenOver && (
                  <button
                    onClick={async () => {
                      await fetch('/api/livechat', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userEmail: selectedChat.userEmail, action: 'takeover' }),
                      });
                      window.location.reload();
                    }}
                    style={{ padding: '8px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Take Over from AI
                  </button>
                )}
                {selectedChat.takenOver && (
                  <button
                    onClick={async () => {
                      await fetch('/api/livechat', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userEmail: selectedChat.userEmail, action: 'release' }),
                      });
                      window.location.reload();
                    }}
                    style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Release to AI
                  </button>
                )}
              </div>
            </div>
            <div className="card-content">
              <div className="chat-messages">
                {selectedChat.messages.map((msg: any, idx: number) => (
                  <div key={idx} className={`message ${msg.sender === 'aria' ? 'user' : msg.sender}`}>
                    <div className="message-bubble">
                      {msg.sender === 'aria' && <div style={{ fontSize: '10px', fontWeight: 600, marginBottom: '4px', opacity: 0.7 }}>Aria AI</div>}
                      <div style={{ fontSize: '14px', marginBottom: '4px' }}>{msg.message}</div>
                      <div style={{ fontSize: '11px', opacity: 0.7 }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  className="input"
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminReply()}
                  placeholder="Type your reply..."
                  style={{ flex: 1 }}
                />
                <button 
                  className="btn-primary"
                  onClick={handleAdminReply}
                  disabled={!adminMessage.trim()}
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
