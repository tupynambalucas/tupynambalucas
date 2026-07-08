import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';
import { studioAssetsPlugin } from './plugins/studioAssets';

export default defineConfig(({ mode }) => {
  return {
    envDir: '../../infrastructure/docker',
    plugins: [
      studioAssetsPlugin(),
      tailwindcss(),
      react(),
      svgr({
        include: '**/*.svg?react',
      }),
    ],

    resolve: {
      tsconfigPaths: true,
      dedupe: ['react', 'react-dom'],
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime'],
      exclude: ['@tupynambalucas-hub/core', '@tupynambalucas-studio/assets'],
    },

    base: './',

    server: {
      host: true,
      port: 5173,
      allowedHosts: ['elo.internal'],
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    preview: {
      port: 4173,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name ?? '';
            let extType = info.split('.').at(1) ?? 'unknown';

            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            } else if (/css|scss|sass/i.test(extType)) {
              extType = 'css';
            } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
              extType = 'fonts';
            }

            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
    },
  };
});
