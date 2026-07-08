import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type {Connect, Plugin} from 'vite';
import {defineConfig} from 'vite';
import dotenv from 'dotenv';

// Load environment variables. In this environment secrets live in
// .env.development.local (framework-loaded) and .env; load both so the
// dev-time API middleware can reach DATABASE_URL via process.env.
dotenv.config({path: '.env.development.local'});
dotenv.config({path: '.env.local'});
dotenv.config();

// Dev-only middleware that serves the same handlers used by the Vercel
// serverless functions in /api, so registration/login work in the preview.
function apiDevServer(): Plugin {
  return {
    name: 'ts-connect-api-dev-server',
    configureServer(server) {
      const handle = (route: string, loader: () => Promise<any>) => {
        server.middlewares.use(
          route,
          async (req: Connect.IncomingMessage, res, next) => {
            try {
              const mod = await loader();
              await mod.default(req, res);
            } catch (err) {
              console.error(`[v0] API middleware error on ${route}:`, err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({error: 'Error del servidor. Inténtalo de nuevo.'}),
              );
            }
          },
        );
      };

      handle('/api/register', () => server.ssrLoadModule('/api/register.ts'));
      handle('/api/login', () => server.ssrLoadModule('/api/login.ts'));
    },
  };
}

export default defineConfig(() => {
  return {
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },
    plugins: [react(), tailwindcss(), apiDevServer()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
