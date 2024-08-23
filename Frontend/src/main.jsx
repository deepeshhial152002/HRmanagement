import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router ,Route, Routes } from 'react-router-dom'
import {Provider} from "react-redux"
import store from './store/index.js'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Router>
   <Provider store={store} >
   <App />
   </Provider>
   </Router>
  </StrictMode>,
)
