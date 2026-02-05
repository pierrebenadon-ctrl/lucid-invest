import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// On récupère la div "root" de ton index.html
const rootElement = document.getElementById('root');

// Sécurité pour vérifier que l'élément existe bien
if (!rootElement) {
  throw new Error("L'élément root n'a pas été trouvé. Vérifie ton fichier index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
