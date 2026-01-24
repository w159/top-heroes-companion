import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, X, MessageCircle, BookOpen } from 'lucide-react';
import { services } from '../src/core/ServiceContainer';
import { RAGContentLoader } from '../src/core/infrastructure/RAGContentLoader';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; category: string }>;
}

const ChatAssistantEnhanced: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your enhanced Top Heroes assistant powered by RAG. I can provide accurate, sourced information about heroes, teams, gear, strategies, and optimization. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
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

  // Initialize RAG index on first open
  useEffect(() => {
    if (isOpen && !isIndexed) {
      initializeRAG();
    }
  }, [isOpen, isIndexed]);

  const initializeRAG = async () => {
    try {
      const chunks = await RAGContentLoader.loadAllContent();
      await services.rag.indexContent(chunks);
      setIsIndexed(true);
      console.log('RAG index initialized with', chunks.length, 'chunks');
    } catch (error) {
      console.error('Failed to initialize RAG:', error);
    }
  };

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
      // Use RAG service to generate response
      const searchResults = await services.rag.search({
        query: userMessage.content,
      });

      const ragResponse = await services.rag.generateResponse(
        { query: userMessage.content },
        searchResults
      );

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: ragResponse.answer,
        timestamp: new Date(),
        sources: ragResponse.sources.map(s => ({
          title: s.chunk.source,
          category: s.chunk.category,
        })),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('RAG query failed:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble processing that request. Please try rephrasing your question!",
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
    "Best Nature team composition?",
    "How does awakening work?",
    "F2P progression tips?",
    "Which gear for Pyromancer?",
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
              <span>RAG-Powered Assistant</span>
              {isIndexed && <Sparkles size={14} style={{ color: '#30D158' }} />}
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
                  {message.sources && message.sources.length > 0 && (
                    <div className="chat-sources">
                      <BookOpen size={12} />
                      <span>Sources: {message.sources.map(s => s.category).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-message assistant">
                <div className="chat-message-avatar">
                  <Loader2 size={16} className="animate-spin" />
                </div>
                <div className="chat-message-content">
                  Searching knowledge base...
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

        .chat-sources {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
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

export default ChatAssistantEnhanced;
