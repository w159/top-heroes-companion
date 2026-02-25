import React from 'react';
import { Bot, User, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Message } from '../hooks/useChatAssistant';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={cn(
        'flex gap-2.5 max-w-[85%]',
        message.role === 'user' && 'self-end flex-row-reverse'
      )}
    >
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
        message.role === 'assistant'
          ? 'bg-gradient-to-br from-primary-500 to-tertiary-500'
          : 'bg-success-500'
      )}>
        {message.role === 'assistant' ? (
          <Bot size={16} className="text-white" />
        ) : (
          <User size={16} className="text-white" />
        )}
      </div>
      <div className={cn(
        'px-3.5 py-2.5 rounded-2xl text-body-md leading-relaxed',
        message.role === 'assistant'
          ? 'bg-surface-800 text-foreground/90'
          : 'bg-primary-500 text-white'
      )}>
        {message.content}
        {message.sources && message.sources.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-surface-700 text-label-sm text-muted-foreground">
            <BookOpen size={12} />
            <span>Sources: {message.sources.map(s => s.category).join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
