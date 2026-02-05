import React, { useState } from 'react';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4">
        LUCID<span className="text-indigo-600">INVEST</span>
      </h1>
      <p className="text-slate-500 text-xl font-medium max-w-md">
        Ton Radar Alpha est en cours de construction. Bientôt, l'IA Gemini analysera tes actions ici.
      </p>
      <div className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">
        Connexion Supabase OK
      </div>
    </div>
  );
};

export default App;
