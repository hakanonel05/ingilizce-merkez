import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CardWordHover, setCardWordSpeaker } from '../../../shared/vocab/CardWordHover';
import { oku } from './lib/seslendirme';

// Mor kelime penceresindeki hoparlör: katmanlı'nın doğal sesi, kelime profili.
setCardWordSpeaker((kelime) => { void oku(kelime, { profil: 'kelime' }); });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Mor (kart) kelimelerin üzerine gelince açılan pencere — bkz. CardWordHover */}
    <CardWordHover />
  </StrictMode>,
);
