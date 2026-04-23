import { useState } from 'react';

export function useAriaChat(email: string, name: string, userData: any) {
  const [ariaMessage, setAriaMessage] = useState('');
  const [ariaChat, setAriaChat] = useState<Array<{role: 'user' | 'assistant', message: string}>>([]);

  const handleAriaSubmit = async (onNavigate?: (target: string) => void) => {
    if (!ariaMessage.trim()) return;
    
    const userMsg = ariaMessage.trim();
    setAriaChat(prev => [...prev, { role: 'user', message: userMsg }]);
    setAriaMessage('');
    
    const accountRes = await fetch(`/api/accounts?email=${email}`);
    const accountData = await accountRes.json();
    const managedBy = accountData.managedBy || null;
    
    const livechatRes = await fetch('/api/livechat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userEmail: email, 
        userName: name,
        message: userMsg,
        timestamp: new Date().toISOString(),
        managedBy: managedBy,
        isAria: false
      }),
    });
    
    const livechatData = await livechatRes.json();
    
    if (livechatData.takenOver) {
      setAriaChat(prev => [...prev, { role: 'assistant', message: 'A live agent has joined the conversation. They will respond to you shortly.' }]);
      return;
    }
    
    try {
      const res = await fetch('/api/aria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          conversationHistory: ariaChat,
          userData
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        const ariaResponse = data.response;
        setAriaChat(prev => [...prev, { role: 'assistant', message: ariaResponse }]);
        
        await fetch('/api/livechat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userEmail: email, 
            userName: 'Aria AI',
            message: ariaResponse,
            timestamp: new Date().toISOString(),
            managedBy: managedBy,
            isAria: true
          }),
        });
        
        if (data.action?.type === 'navigate' && onNavigate) {
          setTimeout(() => onNavigate(data.action.target), 1000);
        }
      } else {
        setAriaChat(prev => [...prev, { role: 'assistant', message: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      setAriaChat(prev => [...prev, { role: 'assistant', message: 'Sorry, I\'m having trouble connecting. Please try again.' }]);
    }
  };

  return { ariaMessage, setAriaMessage, ariaChat, handleAriaSubmit };
}
