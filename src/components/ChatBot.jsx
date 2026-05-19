import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am HealthPath AI. How can I help you today? You can ask me about symptoms, or which doctor/hospital to visit.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      const data = await response.json();
      
      if (response.status === 429) {
        setMessages(prev => [...prev, { role: 'model', text: data.error, isError: true, isRateLimited: true }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'model', text: `Error: ${data.error}`, isError: true }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I am having trouble connecting to the server. Please check if the backend is running.', isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-full max-w-[400px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold">HealthPath AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-blue-100 font-semibold uppercase tracking-wider">Always here to help</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                    m.role === 'user' ? 'bg-blue-600 text-white' : m.isError ? 'bg-red-100 text-red-600' : 'bg-white text-blue-600 border border-slate-200'
                  }`}>
                    {m.role === 'user' ? <User size={16} /> : m.isError ? <AlertCircle size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : m.isError 
                        ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none'
                        : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-white text-blue-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="p-3 bg-white text-slate-400 border border-slate-200 rounded-2xl rounded-tl-none text-sm italic flex items-center gap-2">
                    {messages.length > 0 && messages[messages.length - 1].isRateLimited ? 'Please wait... (Rate limited)' : 'Thinking...'}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {/* FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group relative ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        
        {!isOpen && (
          <div className="absolute -top-12 right-0 bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-xl border border-slate-100 text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500" />
            Need help? Ask AI
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45"></div>
          </div>
        )}
      </button>
    </div>
  );
}
