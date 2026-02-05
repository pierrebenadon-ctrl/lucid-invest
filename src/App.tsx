import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TrendingUp, Send, User, Bot, Sparkles, PieChart, Wallet } from 'lucide-react';

// Configuration de l'IA (Utilise la variable d'env Vercel)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Bonjour ! Je suis votre assistant LucidInvest. Quel est votre objectif financier aujourd\'hui ?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll auto vers le bas
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAskIA = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Tu es LucidInvest, un expert en finance. Réponds de façon concise et pro : ${userMessage}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'bot', text: text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Désolé, j'ai une erreur de connexion. Vérifiez votre clé API." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0D0D0E] text-white">
      {/* Sidebar Style Studio */}
      <aside className="w-64 border-r border-white/10 flex flex-col p-4 hidden md:flex">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <span className="font-bold tracking-tight text-xl">LUCID INVEST</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-sm hover:bg-white/10 transition">
            <PieChart size={18} /> Portefeuille
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition">
            <Wallet size={18} /> Actifs
          </button>
        </nav>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b border-white/10 flex items-center px-6 justify-between bg-[#0D0D0E]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Sparkles size={16} className="text-blue-500" />
            Gemini 1.5 Flash Connecté
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10 text-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-500 text-xs animate-pulse">L'IA analyse le marché...</div>}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0D0D0E] via-[#0D0D0E] to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <input 
              type="text"
              className="w-full bg-[#1A1A1C] border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-600 transition placeholder:text-gray-600"
              placeholder="Demander à l'IA (ex: Analyse Apple pour 2026)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskIA()}
            />
            <button 
              onClick={handleAskIA}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-xl hover:bg-blue-500 transition disabled:opacity-50"
              disabled={loading}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-3">
            LucidInvest peut faire des erreurs. Vérifiez les informations financières importantes.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
