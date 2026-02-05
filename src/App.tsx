import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Sparkles, Send, Settings2, History, ChevronDown, Menu } from 'lucide-react';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleAskIA = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages([...messages, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(userMsg);
      const text = result.response.text();
      setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Erreur : Vérifiez votre clé API dans Vercel." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#131314] text-[#e3e3e3] font-sans overflow-hidden">
      
      {/* SIDEBAR GAUCHE (Style Studio) */}
      <aside className="w-[280px] bg-[#1e1f20] border-r border-[#333537] flex flex-col hidden lg:flex">
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 bg-[#333537] hover:bg-[#3c3d3e] py-3 rounded-full text-sm font-medium transition">
            <Menu size={18} /> Nouveau Chat
          </button>
        </div>
        <div className="flex-1 px-4 overflow-y-auto">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Récents</p>
          <div className="space-y-1">
             <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#333537] cursor-pointer text-sm truncate">
               <History size={14} /> Analyse LucidInvest
             </div>
          </div>
        </div>
        <div className="p-4 border-t border-[#333537] text-xs text-gray-400">
          LucidInvest v1.0 • Gemini 1.5 Flash
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col relative bg-[#131314]">
        
        {/* HEADER */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-[#333537]">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm">Gemini 1.5 Flash</span>
            <ChevronDown size={14} className="text-gray-500" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#333537] rounded-full"><Settings2 size={20} /></button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">PB</div>
          </div>
        </header>

        {/* ZONE DE CHAT */}
        <div className="flex-1 overflow-y-auto px-4 md:px-20 py-10 space-y-8 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl animate-pulse" />
              <h2 className="text-2xl font-medium">Comment puis-je vous aider ?</h2>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'bg-[#1e1f20]/50 p-6 rounded-2xl border border-[#333537]' : ''}`}>
                <div className="mt-1">
                  {msg.role === 'user' ? <UserIcon /> : <Sparkles className="text-blue-400" size={20} />}
                </div>
                <div className="flex-1 prose prose-invert max-w-none text-[15px] leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* INPUT (Le fameux bloc de saisie Studio) */}
        <div className="p-4 md:px-20 pb-8">
          <div className="max-w-4xl mx-auto bg-[#1e1f20] border border-[#333537] rounded-2xl focus-within:ring-1 focus-within:ring-[#4d4d4e] transition-all">
            <textarea
              className="w-full bg-transparent p-4 outline-none resize-none min-h-[100px] text-[15px] placeholder-gray-500"
              placeholder="Saisissez du texte ici..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAskIA();
                }
              }}
            />
            <div className="flex items-center justify-between p-3 border-t border-[#333537]">
              <div className="text-[11px] text-gray-500 px-2 italic">
                Appuyez sur Entrée pour envoyer
              </div>
              <button 
                onClick={handleAskIA}
                disabled={loading || !input}
                className={`p-2 rounded-lg transition ${input ? 'bg-blue-600 text-white' : 'text-gray-600 cursor-not-allowed'}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const UserIcon = () => (
  <div className="w-6 h-6 bg-purple-700 rounded-full flex items-center justify-center text-[10px] font-bold uppercase">
    PB
  </div>
);

export default App;
