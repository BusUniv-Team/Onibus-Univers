import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import Poll from './Pages/Poll/poll.jsx'
import './Pages/Poll/poll.css' 



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Poll />
        </StrictMode>,
)


