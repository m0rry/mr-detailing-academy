import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

if(!window.location.hash){
  window.location.hash = '#/home'
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
