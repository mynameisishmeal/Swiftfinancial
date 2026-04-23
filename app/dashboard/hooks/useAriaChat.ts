import { useState, useEffect } from 'react';

export function useAriaChat(email: string, name: string, userData: any) {
  const [ariaMessage, setAriaMessage] = useState('');
  const [ariaChat, setAriaChat] = useState<Array<{role: 'user' | 'assistant' | 'admin', message: string}>>([]);
  const [liveChatActive, setLiveChatActive] = useState(false);

  // Poll for admin messages
  useEffect(() => {
    const checkForAdminMessages = async () => {
      const res = await fetch(`/api/livechat?userEmail=${email}`);
      const data = await res.json();
      if (data.messages) {
        // Rebuild chat from server messages
        const newChat: Array<{role: 'user' | 'assistant' | 'admin', message: string}> = [];
        data.messages.forEach((m: any) => {
          if (m.sender === 'user') {
            newChat.push({ role: 'user', message: m.message });
          } else if (m.sender === 'admin') {
            newChat.push({ role: 'admin', message: m.message });
          } else if (m.sender === 'aria') {
            newChat.push({ role: 'assistant', message: m.message });
          }
        });
        
        // Check if chat was just ended
        const wasActive = liveChatActive;
        const isActive = data.takenOver || false;
        
        if (wasActive && !isActive) {
          // Admin just ended chat
          newChat.push({ role: 'assistant', message: 'The support agent has ended the chat. I\'m back to assist you with anything else you need!' });
        }
        
        setAriaChat(newChat);
        setLiveChatActive(isActive);
      }
    };
    
    const interval = setInterval(checkForAdminMessages, 2000);
    return () => clearInterval(interval);
  }, [email, liveChatActive]);

  const handleAriaSubmit = async () => {
    if (!ariaMessage.trim()) return;
    
    const userMsg = ariaMessage.trim();
    setAriaChat(prev => [...prev, { role: 'user', message: userMsg }]);
    setAriaMessage('');
    
    const accountRes = await fetch(`/api/accounts?email=${email}`);
    const accountData = await accountRes.json();
    const managedBy = accountData.managedBy || null;
    
    // Send to livechat
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
    
    // If admin has taken over, don't send to Aria
    if (livechatData.takenOver) {
      if (!liveChatActive) {
        setAriaChat(prev => [...prev, { role: 'assistant', message: 'A live agent has joined the conversation. They will respond to you shortly.' }]);
        setLiveChatActive(true);
      }
      return;
    }
    
    // Check if user is requesting live chat
    const lowerMsg = userMsg.toLowerCase();
    const requestingAgent = lowerMsg.includes('agent') || lowerMsg.includes('human') || 
                           lowerMsg.includes('talk to someone') || lowerMsg.includes('speak to someone') ||
                           lowerMsg.includes('live chat') || lowerMsg.includes('representative');
    
    if (requestingAgent) {
      setAriaChat(prev => [...prev, { role: 'assistant', message: 'I\'ve notified our support team. An agent will join this conversation shortly to assist you.' }]);
      
      await fetch('/api/livechat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userEmail: email, 
          userName: 'Aria AI',
          message: 'I\'ve notified our support team. An agent will join this conversation shortly to assist you.',
          timestamp: new Date().toISOString(),
          managedBy: managedBy,
          isAria: true
        }),
      });
      return;
    }
    
    // Send to Aria AI
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
      } else {
        setAriaChat(prev => [...prev, { role: 'assistant', message: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      setAriaChat(prev => [...prev, { role: 'assistant', message: 'Sorry, I\'m having trouble connecting. Please try again.' }]);
    }
  };

  return { ariaMessage, setAriaMessage, ariaChat, handleAriaSubmit, liveChatActive };
}
