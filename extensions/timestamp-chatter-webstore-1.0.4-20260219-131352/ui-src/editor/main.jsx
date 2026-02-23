import React from 'react';
import { createRoot } from 'react-dom/client';
import '../shared/shared.css';
import './styles.css';
import '../../shared/theme-catalog-v2.js';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
