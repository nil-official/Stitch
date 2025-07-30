import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Providers from './Providers.jsx';
import { inject } from '@vercel/analytics';

inject();

createRoot(document.getElementById('root')).render(
  <Providers>
    <App />
  </Providers>
);