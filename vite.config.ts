
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: parseInt(env.VITE_PORT || '3000'),
        host: '0.0.0.0',
        proxy: {
          '/api/freepik': {
            target: 'https://api.freepik.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/freepik/, ''),
            configure: (proxy, _options) => {
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                // Forward the API key header
                const apiKey = env.VITE_FREE_PIK_API_KEY;
                if (apiKey) {
                  proxyReq.setHeader('x-freepik-api-key', apiKey);
                }
              });
            },
          },
          '/api/preview': {
            target: 'https://ai-product-visualizer-ebon.vercel.app',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/preview/, ''),
          },
        },
      },
      plugins: [react(), tailwindcss()],
    };
});
