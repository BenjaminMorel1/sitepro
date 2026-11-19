import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './theme' // thème sombre / clair selon l'appareil
import App from './App.tsx'

// adresses propres (…/sitepro/contact) au lieu de …/sitepro/#/contact ; base = "/sitepro/" en ligne, "/" en local
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

// anciens liens partagés avec « # » (…/sitepro/#/contact) : on les convertit en adresse propre
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', `${BASE}${window.location.hash.slice(1)}`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={BASE}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
