import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ha-automation-visualizer/',
  plugins: [react()],
});
