import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MappingProvider } from './context/MappingContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MappingProvider>
            <App />
        </MappingProvider>
    </React.StrictMode>
);
