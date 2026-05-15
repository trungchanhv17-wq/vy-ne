import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../hooks/useFirebase';
import { getTutorStream } from '../services/gemini';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

export function Tutor() {
  const { profile } = useAuth();
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: Date.now()
    };

    setInput('');
    await sendMessage(userMessage);
    setIsTyping(true);

    try {
      const stream = await getTutorStream([...messages, userMessage], profile?.level || 'A1');
      let fullContent = '';
      
      // We'll create a temporary logic to handle stream visualization
      // In a real production app, we'd use a better streaming hook
      for await (const chunk of stream) {
        fullContent += chunk.text;
      }

      await sendMessage({
        role: 'model',
        content: fullContent,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Tutor error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-zinc-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3 overflow-hidden">
             <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Gia sư AI</h2>
            <div className="flex items-center gap-2 text-xs text-green-500 font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Đang trực tuyến
            </div>
          </div>
        </div>
        <div className="px-4 py-2 bg-zinc-50 rounded-xl text-xs font-bold text-zinc-500 border border-zinc-100">
          TRÌNH ĐỘ {profile?.level}
        </div>
      </header>

      <ScrollArea className="flex-1 px-4 lg:px-0">
        <div className="space-y-8 py-4">
          {messages.length === 0 && (
            <div className="text-center py-20 px-8">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} className="text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">Chào mừng bạn!</h3>
              <p className="text-zinc-500 max-w-xs mx-auto">Hãy bắt đầu bằng việc chào gia sư của bạn bằng tiếng Đức, ví dụ: "Hallo, ich bin {profile?.displayName}".</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`p-1.5 rounded-xl h-fit ${msg.role === 'user' ? 'bg-zinc-100' : 'bg-zinc-900 text-white'}`}>
                  {msg.role === 'user' ? <UserIcon size={18} /> : <Bot size={18} />}
                </div>
                <div className={`max-w-[80%] p-5 rounded-3xl ${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 text-white rounded-tr-none' 
                    : 'bg-white text-zinc-800 rounded-tl-none shadow-sm ring-1 ring-zinc-100'
                }`}>
                  <div className="prose prose-sm prose-zinc max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-4">
              <div className="p-1.5 rounded-xl bg-zinc-900 text-white h-fit">
                <Bot size={18} />
              </div>
              <div className="bg-white p-5 rounded-3xl rounded-tl-none shadow-sm ring-1 ring-zinc-100 italic text-zinc-400 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Gia sư đang gõ...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="bg-white p-3 rounded-[32px] shadow-lg border border-zinc-100 flex items-center gap-2 ring-4 ring-zinc-50">
        <Input 
          placeholder="Viết tin nhắn cho gia sư..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg px-6 rounded-3xl"
        />
        <Button 
          size="icon" 
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className="h-14 w-14 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95 shadow-lg"
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
}
