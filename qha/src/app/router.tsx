import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { EventoDetalhePage } from './pages/EventoDetalhePage';
import { EventosPage } from './pages/EventosPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouteErrorPage } from './pages/RouteErrorPage';
import { SobrePage } from './pages/SobrePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/eventos" replace /> },
      { path: 'eventos', element: <EventosPage /> },
      { path: 'eventos/:id', element: <EventoDetalhePage /> },
      { path: 'sobre', element: <SobrePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
