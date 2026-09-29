import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Minimize2,
  Maximize2,
  Bot,
  User,
  AlertCircle,
  CornerDownLeft,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  error?: boolean;
}

const PRIMARY_WEBHOOK_URL = 'https://rohinitheresa8.app.n8n.cloud/webhook/96bd242c-8430-4a94-8c5e-82db474606b3/chat';
const FALLBACK_PROXY_URL = '/api/n8n-chat';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('localevent_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        text: 'Namaste! 🙏 Welcome to LocalEvent. I am your event planning assistant. Ask me anything about local vendors, catering menus, decor packages, or venues in Visakhapatnam!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize or load session ID
  useEffect(() => {
    let sid = localStorage.getItem('localevent_chat_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.setItem('localevent_chat_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('localevent_chat_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const quickPrompts = [
    'Recommend wedding mandap decorators in MVP Colony',
    'Best Andhra catering options for 100 guests',
    'What are the top beachside venues in Vizag?',
    'How to budget ₹50,000 for a birthday party?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsgId = 'msg-' + Date.now();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: timeNow,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const payload = {
        chatInput: text,
        message: text,
        sessionId: sessionId || 'default_session',
        action: 'sendMessage',
      };

      let response: Response;
      try {
        // Try direct call first
        response = await fetch(PRIMARY_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*',
          },
          body: JSON.stringify(payload),
        });
      } catch (directErr) {
        // If direct fetch is blocked by CORS or network in iframe, retry via Vite dev proxy
        console.warn('Direct n8n webhook call failed, attempting proxy route...', directErr);
        response = await fetch(FALLBACK_PROXY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let replyText = '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        // Support standard n8n chat return variations:
        // e.g. { output: "..." } or { text: "..." } or { response: "..." } or { message: "..." }
        if (typeof data === 'string') {
          replyText = data;
        } else if (data.output) {
          replyText = typeof data.output === 'string' ? data.output : JSON.stringify(data.output);
        } else if (data.text) {
          replyText = data.text;
        } else if (data.response) {
          replyText = data.response;
        } else if (data.message) {
          replyText = data.message;
        } else if (Array.isArray(data) && data[0]?.output) {
          replyText = data[0].output;
        } else {
          replyText = JSON.stringify(data, null, 2);
        }
      } else {
        replyText = await response.text();
      }

      if (!replyText.trim()) {
        replyText = 'Thank you! Your inquiry was received by our agent.';
      }

      const botMessage: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      if (!isOpen) setHasUnread(true);
    } catch (err: any) {
      console.error('Error connecting to n8n chat agent:', err);
      const errorMessage: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'bot',
        text: 'Unable to reach the assistant right now. Please ensure your n8n workflow webhook is active and listening for POST requests.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const welcome: ChatMessage = {
      id: 'msg-welcome-' + Date.now(),
      sender: 'bot',
      text: 'Conversation reset. How can I help you plan your next event in Visakhapatnam?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([welcome]);
    const newSid = 'session_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    setSessionId(newSid);
    localStorage.setItem('localevent_chat_session_id', newSid);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Subtle Callout Bubble */}
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white text-slate-800 px-3.5 py-2 rounded-2xl shadow-lg border border-stone-200 text-xs font-semibold cursor-pointer hover:shadow-xl transition-all duration-200 animate-in fade-in"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Plan with LocalEvent AI</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Open Event Assistant"
            title="Chat with LocalEvent Assistant"
          >
            <MessageSquare className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 ring-2 ring-white rounded-full animate-ping" />
            )}
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white rounded-3xl shadow-2xl border border-stone-200/90 flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isExpanded
              ? 'inset-3 sm:inset-8 sm:w-auto sm:max-w-4xl sm:mx-auto sm:h-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-stone-900 via-slate-900 to-rose-950 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm tracking-tight text-white">
                    LocalEvent Assistant
                  </h3>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" title="Connected to n8n" />
                </div>
                <p className="text-[11px] text-stone-300">
                  AI Planning Agent · Vizag & AP
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-stone-300">
              {/* Reset Session */}
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Expand/Collapse */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:inline-flex p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isExpanded ? 'Restore size' : 'Expand window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-tr-xs'
                      : msg.error
                      ? 'bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-xs'
                      : 'bg-white border border-stone-200/80 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  {msg.error && (
                    <div className="flex items-center gap-1.5 text-rose-600 font-bold mb-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Connection Note</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap break-words">{msg.text}</div>

                  <div
                    className={`text-[9px] mt-1.5 text-right tabular-nums ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Thinking / Typing Animation */}
            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                  <span className="text-[11px] text-slate-500 font-medium ml-1.5">
                    Consulting local directory...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-4 py-2 bg-stone-100/70 border-t border-stone-200/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-slate-400 font-semibold shrink-0 uppercase text-[9px]">Try:</span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-rose-400 hover:text-rose-600 text-slate-600 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <div className="p-3 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about venues, catering, decoration..."
                disabled={isLoading}
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition-all placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Connected to n8n AI webhook</span>
              <span className="hidden sm:inline">Press Enter to send</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
