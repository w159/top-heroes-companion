import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  apiEndpoint?: string;
  ragContentPath?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({
  apiEndpoint = '/api/chat',
  ragContentPath = '/rag-content'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your Top Heroes companion assistant. Ask me anything about heroes, team builds, gear, pets, relics, or game strategies!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // For now, simulate a response based on keywords
      // In production, this would call an actual API with RAG
      const response = await simulateRAGResponse(userMessage.content);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "Best Nature team?",
    "How does awakening work?",
    "Which gear for Pyromancer?",
    "F2P hero recommendations?"
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chat-fab"
          aria-label="Open chat assistant"
        >
          <MessageCircle size={24} />
          <Sparkles size={12} className="chat-fab-sparkle" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <Bot size={20} />
              <span>Top Heroes Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="chat-close">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.role}`}
              >
                <div className="chat-message-avatar">
                  {message.role === 'assistant' ? (
                    <Bot size={16} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="chat-message-content">
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message assistant">
                <div className="chat-message-avatar">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="chat-message-content">
                  Thinking...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="chat-quick-prompts">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(prompt);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="chat-quick-prompt"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about heroes, builds, strategies..."
              className="chat-input"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="chat-send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .chat-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 28px;
          background: linear-gradient(135deg, #007AFF, #5856D6);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 122, 255, 0.4);
          z-index: 1000;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .chat-fab:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 24px rgba(0, 122, 255, 0.5);
        }
        
        .chat-fab-sparkle {
          position: absolute;
          top: 8px;
          right: 8px;
          color: #FFD60A;
        }
        
        .chat-window {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 380px;
          height: 520px;
          background: rgba(28, 28, 30, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1000;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        
        .chat-header {
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-weight: 600;
        }
        
        .chat-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .chat-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .chat-message {
          display: flex;
          gap: 10px;
          max-width: 85%;
        }
        
        .chat-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        
        .chat-message-avatar {
          width: 28px;
          height: 28px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .chat-message.assistant .chat-message-avatar {
          background: linear-gradient(135deg, #007AFF, #5856D6);
        }
        
        .chat-message.user .chat-message-avatar {
          background: #30D158;
        }
        
        .chat-message-content {
          padding: 10px 14px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .chat-message.assistant .chat-message-content {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.9);
        }
        
        .chat-message.user .chat-message-content {
          background: #007AFF;
          color: white;
        }
        
        .chat-quick-prompts {
          padding: 8px 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .chat-quick-prompt {
          padding: 6px 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .chat-quick-prompt:hover {
          background: rgba(255, 255, 255, 0.12);
          color: white;
        }
        
        .chat-input-container {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 10px;
        }
        
        .chat-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.08);
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        
        .chat-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .chat-input:focus {
          border-color: #007AFF;
        }
        
        .chat-send {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          background: #007AFF;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .chat-send:hover:not(:disabled) {
          background: #0066CC;
        }
        
        .chat-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 480px) {
          .chat-window {
            width: calc(100vw - 32px);
            height: calc(100vh - 100px);
            bottom: 80px;
            right: 16px;
          }
          
          .chat-fab {
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>
    </>
  );
};

// Simulated RAG response function
// In production, this would call your backend API
async function simulateRAGResponse(query: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
  
  const lowerQuery = query.toLowerCase();
  
  // Hero-related queries
  if (lowerQuery.includes('tidecaller')) {
    return "**Tidecaller** is one of the best heroes in the game! As a Nature Mythic, they're a unique hybrid that can Tank, Heal, AND deal DPS. Best paired with Cactini pet, Oath of Sacred Forest relic set, and Titan or Knight gear. S-Tier pick for any Nature team!";
  }
  
  if (lowerQuery.includes('pyromancer')) {
    return "**Pyromancer** is the recommended early carry for League faction! Max her **Meteor Blaze** skill first for devastating AoE damage. Use Glory of the Knight gear for skill damage bonus. Awaken to Tier 2 early for a major power spike. Pair with Secret Keeper for shields!";
  }
  
  if (lowerQuery.includes('wanderer')) {
    return "**Wanderer** is the essential DPS carry for Horde! Despite being classified as 'Tank', they're your main damage dealer. Use Titan's Might gear, Dragon's Might relics, and pair with Desert Prince tank. Horde builds slowly but Wanderer makes it worth it late game!";
  }
  
  // Team composition queries
  if (lowerQuery.includes('nature team') || lowerQuery.includes('best nature')) {
    return "**Best Nature Team:** Front: Altar Marshal + Monk | Middle: Petalis + Tidecaller | Back: Pixie + Forest Maiden. Use Oath of Sacred Forest relics and Cactini pet. Nature excels at sustain - outlast your enemies!";
  }
  
  if (lowerQuery.includes('horde team') || lowerQuery.includes('best horde')) {
    return "**Best Horde Team:** Front: Beastmaster + Desert Prince | Middle: Wanderer + Soulmancer | Back: Storm Maiden + Witch. Use Dragon's Might relics and Flickerkit/Howli pet. Horde = raw damage, great for PvE/bosses!";
  }
  
  if (lowerQuery.includes('league team') || lowerQuery.includes('best league')) {
    return "**Best League Team:** Front: Adjudicator + Rose Princess | Middle: Paragon + Bishop | Back: Pyromancer + Nun. Use Arcane Vault relics and Eggy pet. League dominates with skill damage and CC!";
  }
  
  // Gear queries
  if (lowerQuery.includes('gear') || lowerQuery.includes('armor')) {
    return "**Gear Sets:**\n• **Knight (Glory of the Knight)**: +40% ATK, +80% HP, +8% Skill Dmg - for skill-based DPS\n• **Blood (Fury of Blood)**: +160% HP, +6% Dmg Reduction - for tanks & healers\n• **Titan (Titan's Might)**: +80% ATK, +6% Dmg - for flat attack scalers\n\nAlways match to hero role!";
  }
  
  // Pet queries
  if (lowerQuery.includes('pet')) {
    return "**Pet Priorities:**\n• **League**: Eggy (Critical Rate buffs)\n• **Nature**: Cactini (best sustain scaling)\n• **Horde**: Flickerkit (BiS) or Howli (F2P)\n\n**Key tip**: Focus 100% of Pet Food on ONE pet matching your main faction. Level to 120+ for Mythic promotion!";
  }
  
  // Awakening queries
  if (lowerQuery.includes('awaken')) {
    return "**Awakening System:**\n• Requires 5★ Legendary hero (11 stars total)\n• 4 tiers to full Mythic status\n• Costs: 9 Soul Stones + ~115 hero copies total\n• Each faction has specific Soul Stones\n\n**Priority:** Awaken your main DPS first, usually Pyromancer (League), Pixie (Nature), or Warlock (Horde)!";
  }
  
  // F2P queries
  if (lowerQuery.includes('f2p') || lowerQuery.includes('free to play')) {
    return "**F2P Tips:**\n1. **Save diamonds** for events only\n2. **Pick ONE faction** and focus on it\n3. **League** is easiest to start\n4. **Join active guild** ASAP (Castle 7)\n5. **Don't invest in Rare heroes**\n6. **Use resources during events** for double value\n7. **Rush Castle to 25** for unlocks!";
  }
  
  // Relic queries
  if (lowerQuery.includes('relic')) {
    return "**Relic Sets by Faction:**\n• **Nature**: Oath of Sacred Forest (Survival + CC)\n• **League**: Arcane Vault (Control + Skill Dmg)\n• **Horde**: Dragon's Might (Raw Damage)\n\n**Tip**: Max ONE relic at a time for star bonuses. 5★ Epic beats 1★ Legendary!";
  }
  
  // Default response
  return "I can help with heroes, team builds, gear sets, pets, relics, awakening, events, and strategies! Try asking about specific heroes like 'Tidecaller' or 'Pyromancer', or topics like 'best Nature team', 'how does awakening work', or 'F2P tips'.";
}

export default ChatAssistant;
