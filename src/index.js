import React from 'react';
import ReactDOM from 'react-dom/client';
import "./firebase/firebaseInit";
import { CurrentUserContextProvider } from './context/AuthContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { IlerlemeContextProvider } from './context/IlerlemeContext';
import {SistemKullanicilarContextProvider} from "./context/SistemKullanicilarContext"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CurrentUserContextProvider>
         <SistemKullanicilarContextProvider>
           <IlerlemeContextProvider > 
             <App />
           </IlerlemeContextProvider>
         </SistemKullanicilarContextProvider> 
      </CurrentUserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
reportWebVitals();
