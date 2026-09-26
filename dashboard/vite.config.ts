import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // docs/ is a separate VitePress site with its own dependencies and build
  // (see the "build:docs" script). Keep the dev server from scanning its HTML
  // for dependencies or reloading on its files.
  optimizeDeps: { entries: ['index.html'] },
  server: { watch: { ignored: ['**/docs/**'] } },
  build: {
    rolldownOptions: {
      output: {
        // Libraries change far less often than the app, so they get their
        // own long-cached chunks.
        codeSplitting: {
          groups: [
            { name: 'supabase', test: /node_modules[\\/]@supabase[\\/]/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
});
