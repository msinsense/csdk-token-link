import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { readLink, stripTokenFromUrl } from './link';

const link = readLink(window.location);
stripTokenFromUrl();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App link={link} />
  </StrictMode>,
);
