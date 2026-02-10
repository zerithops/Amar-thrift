
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Critical: This tells Vite to expose env vars starting with NEXT_PUBLIC_ to the client
  // preventing undefined errors when using Vercel's default env var naming.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  build: {
    outDir: 'build',
    sourcemap: false
  },
  server: {
    port: 3000
  }
});
