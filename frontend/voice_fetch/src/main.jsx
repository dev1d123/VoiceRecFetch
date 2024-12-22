import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import VoiceRecognition from './VoiceRecognition.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VoiceRecognition />
  </StrictMode>,
)
