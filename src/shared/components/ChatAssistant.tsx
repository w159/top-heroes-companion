import React from 'react';
import { Send, Bot, Loader2, Sparkles, X, MessageCircle } from 'lucide-react';
import { Button } from '../ui/components/button';
import { IconButton } from '../ui/components/icon-button';
import { cn } from '../lib/utils';
import { useChatAssistant, QUICK_PROMPTS } from '../hooks/useChatAssistant';
import { ChatMessage } from './ChatMessage';

const ChatAssistant: React.FC = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    isOpen,
    setIsOpen,
    isIndexed,
    messagesEndRef,
    inputRef,
    sendMessage,
    handleKeyPress,
  } = useChatAssistant();

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 w-14 h-14 rounded-full z-[1000]',
            'bg-gradient-to-br from-primary-500 to-tertiary-500',
            'border-none text-white cursor-pointer',
            'flex items-center justify-center',
            'shadow-lg shadow-primary-500/40',
            'hover:scale-105 hover:shadow-xl hover:shadow-primary-500/50',
            'transition-all duration-200'
          )}
          aria-label="Open chat assistant"
        >
          <MessageCircle size={24} />
          <Sparkles size={12} className="absolute top-2 right-2 text-gold-400" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={cn(
          'fixed bottom-6 right-6 w-[380px] h-[520px] z-[1000]',
          'bg-surface-900/95 backdrop-blur-xl',
          'rounded-2xl border border-surface-700',
          'flex flex-col overflow-hidden',
          'shadow-2xl shadow-black/40',
          'max-sm:w-[calc(100vw-32px)] max-sm:h-[calc(100vh-100px)] max-sm:bottom-20 max-sm:right-4'
        )}>
          {/* Header */}
          <div className="p-4 bg-surface-800/50 border-b border-surface-700 flex justify-between items-center">
            <div className="flex items-center gap-2.5 text-foreground font-semibold">
              <Bot size={20} />
              <span>RAG-Powered Assistant</span>
              {isIndexed && <Sparkles size={14} className="text-success-400" />}
            </div>
            <IconButton variant="default" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </IconButton>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-tertiary-500 flex items-center justify-center flex-shrink-0">
                  <Loader2 size={16} className="animate-spin text-white" />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl bg-surface-800 text-foreground/90 text-body-md">
                  Searching knowledge base...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-4 py-2 flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(prompt);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-label-sm',
                    'bg-surface-800 border border-surface-700 text-foreground/80',
                    'hover:bg-surface-700 hover:text-foreground',
                    'cursor-pointer transition-all'
                  )}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-surface-800/50 border-t border-surface-700 flex gap-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about heroes, builds, strategies..."
              disabled={isLoading}
              className={cn(
                'flex-1 px-3.5 py-2.5 rounded-full text-body-md',
                'bg-surface-800 border border-surface-700 text-foreground',
                'placeholder:text-muted-foreground/40',
                'focus:border-primary-500 focus:outline-none',
                'transition-colors'
              )}
            />
            <Button
              variant="filled"
              size="icon"
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="rounded-full w-10 h-10"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
