import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // remove esta linha se o teu projeto não tiver src/index.css
import { AppProviders } from './app/providers/AppProviders';
import { DataCheckPage } from './app/pages/DataCheckPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <DataCheckPage />
    </AppProviders>
  </StrictMode>,
);