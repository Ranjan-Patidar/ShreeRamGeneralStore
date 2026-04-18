// ==============================
// src/main.jsx
// Entry point of the React application
// Mounts the App component into the HTML page
// ==============================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Find the <div id="root"> in index.html and mount the React app inside it
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* StrictMode helps find potential problems during development */}
    <App />
  </StrictMode>,
)
