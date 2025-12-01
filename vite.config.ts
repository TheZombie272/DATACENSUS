import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const API_PROXY_TARGET = process.env.VITE_API_BASE_URL || (mode === 'development' ? 'http://18.117.138.231:8000' : "http://18.117.138.231:8000");
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        // Proxy /api calls to the backend to avoid CORS/ngrok interstitials in development
        '/api': {
          target: API_PROXY_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
