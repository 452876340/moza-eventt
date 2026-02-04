
import React, { useState, useRef, useEffect } from 'react';
import { getRaceAnalysis } from '../services/geminiService';
import { Message, Driver } from '../types';

interface AIAnalystProps {
  drivers: Driver[];
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ drivers }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '你好！我是株洲速度节的 AI 赛车分析员。有什么我可以帮你的？你可以问我关于领头羊的情况或赛道策略。' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const driversContext = drivers.slice(0, 5).map(d => `${d.name} (Rank ${d.rank}, Points ${d.points})`).join(', ');
    const response = await getRaceAnalysis(userMsg, driversContext);
    
    setMessages(prev => [...prev, { role: 'model', text: response || '无法连接到分析服务器。' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-white dark:bg-[#1a1612] border border-[#e6e1db] dark:border-[#2d261f] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-primary p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-background-dark">smart_toy</span>
              <span className="font-black italic uppercase tracking-tighter text-background-dark">AI 赛车分析员</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="material-symbols-outlined text-background-dark hover:rotate-90 transition-transform">close</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-background-dark' : 'bg-[#f5f3f0] dark:bg-[#2d261f] text-[#181511] dark:text-white'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#f5f3f0] dark:bg-[#2d261f] px-4 py-2 rounded-2xl flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#e6e1db] dark:border-[#2d261f] flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-[#f5f3f0] dark:bg-[#2d261f] border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="提问..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="bg-primary text-background-dark p-2 rounded-xl hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-background-dark rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-4 border-white/10"
      >
        <span className="material-symbols-outlined text-3xl">{isOpen ? 'close' : 'smart_toy'}</span>
      </button>
    </div>
  );
};

export default AIAnalyst;
