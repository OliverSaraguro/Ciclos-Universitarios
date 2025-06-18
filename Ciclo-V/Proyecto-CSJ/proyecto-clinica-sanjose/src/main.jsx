import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { SanJoseSysApp } from './SanJoseSysApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SanJoseSysApp/>
  </StrictMode>,
)
