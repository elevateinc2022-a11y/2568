import React, { useState, useRef, useEffect } from 'react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { X, Send, Sparkles, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { Chat } from '@google/genai';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm the OERC Research Assistant. How can I help you with educational research in Ontario today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = createChatSession();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToGemini(chatSessionRef.current, userMessage.text);
    
    const modelMessage: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
    setMessages(prev => [...prev, modelMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-600 text-white p-4 rounded-full shadow-lg hover:bg-brand-700 hover:shadow-xl transition-all duration-300 z-50 flex items-center group"
      >
        <Sparkles className="h-6 w-6 mr-2 group-hover:rotate-12 transition-transform" />
        <span className="font-semibold">Research Assistant</span>
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border border-slate-200 w-72 z-50 overflow-hidden">
        <div className="bg-brand-700 p-3 flex justify-between items-center text-white cursor-pointer" onClick={() => setIsMinimized(false)}>
            <div className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="font-medium text-sm">OERC Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
                 <button onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}>
                     <Maximize2 className="h-4 w-4" />
                 </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl border border-slate-200 w-96 h-[500px] z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Header */}
      <div className="bg-brand-700 p-4 flex justify-between items-center text-white shrink-0">
        <div className="flex items-center">
          <div className="bg-white/20 p-1.5 rounded-lg mr-3">
             <Sparkles className="h-5 w-5 text-brand-100" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Research Assistant</h3>
            <p className="text-xs text-brand-200">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={() => setIsMinimized(true)} className="hover:bg-brand-600 p-1 rounded transition-colors">
                <Minimize2 className="h-4 w-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="hover:bg-brand-600 p-1 rounded transition-colors">
                <X className="h-4 w-4" />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-brand-500" />
              <span className="text-sm text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about educational research..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">AI can make mistakes. Please verify important information.</p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;