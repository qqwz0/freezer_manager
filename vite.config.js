import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  resolve: {
    alias: {
      // Тепер 'components' буде вказувати на src/components
      'components': path.resolve(__dirname, 'src/components'),
      'contexts':   path.resolve(__dirname, 'src/contexts'),
      'services':   path.resolve(__dirname, 'src/firebase'),
      'auth':        path.resolve(__dirname, 'src/auth'),
      'freezers':    path.resolve(__dirname, 'src/freezers'),
      'shared':      path.resolve(__dirname, 'src/shared'),
    },
},
});