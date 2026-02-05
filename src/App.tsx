import React, { useState } from 'react';

// --- APP COMPONENT ---
export default function App() {
  const [view, setView] = useState('LANDING');

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      fontFamily: 'sans-serif', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1e293b'
    }}>
      {view === 'LANDING' ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px' }}>
            LUCID <span style={{ color: '#4f46e5' }}>INVEST</span>
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#64748b' }}>
            Le déploiement fonctionne enfin !
          </p>
          <button 
            onClick={() => setView('DASHBOARD')}
            style={{ 
              backgroundColor: '#4f46e5', 
              color: 'white', 
              border: 'none', 
              padding: '15px 30px', 
              borderRadius: '12px', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ENTRER DANS LE DASHBOARD
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem' }}>Tableau de Bord Alpha</h2>
          <p>Bienvenue sur la nouvelle version.</p>
          <button onClick={() => setView('LANDING')}>Retour</button>
        </div>
      )}
    </div>
  );
}
