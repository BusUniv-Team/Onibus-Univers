import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import Poll from './Pages/Poll/poll.jsx' 


import './index.css'
import Home from './Pages/Home/index.jsx'
import Login from './Pages/Login/login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Poll />
        </StrictMode>,
)


