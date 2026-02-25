import { useState, useRef, useEffect, useCallback } from 'react';
import { services } from '../../core/ServiceContainer';
import { RAGContentLoader } from '../../core/infrastructure/RAGContentLoader';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; category: string }>;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your Top Heroes assistant powered by RAG. I can provide accurate, sourced information about heroes, teams, gear, strategies, and optimization. Ask me anything!",
  timestamp: new Date(),
};

export const QUICK_PROMPTS = [
  "Best Nature team composition?",
  "How does awakening work?",
  "F2P progression tips?",
  "Which gear for Pyromancer?",
];

export function useChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
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
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  return {
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
  };
}
