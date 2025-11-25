import { createBrowserRouter, Navigate } from 'react-router';
import { LandingPage } from '../components/LandingPage';
import { ProductVisualizer } from '../components/imageGeneration/ProductVisualizer';
import { ChatPage } from '../components/ChatPage';
import { AudioToolsPage } from '../components/AudioToolsPage';
import App from '../../App';

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

