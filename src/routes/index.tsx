import { createBrowserRouter, Navigate } from 'react-router';
import App from '../../App';
import { lazy } from 'react';

const ProductVisualizer = lazy(() => import('../components/imageGeneration/ProductVisualizer'));
const ChatPage = lazy(() => import('../components/ChatPage'));
const AudioToolsPage = lazy(() => import('../components/AudioToolsPage'));
const LandingPage = lazy(() => import('../components/LandingPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/generate-image" replace />,
      },
      {
        path: 'generate-image',
        element: <ProductVisualizer />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'audio',
        element: <AudioToolsPage />,
      },
    ],
  },
]);

