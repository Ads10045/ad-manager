import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MappingProvider } from './context/MappingContext';
import './index.css';

import { ThemeProvider } from './context/ThemeContext';

import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <MappingProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </MappingProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
