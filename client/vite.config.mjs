import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tailwindcss from '@tailwindcss/vite';


// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            "@components": path.resolve(__dirname, "src/components/"),
            "@contexts": path.resolve(__dirname, "src/contexts/"),
            "@pages": path.resolve(__dirname, "src/pages/"),
            "@hooks": path.resolve(__dirname, "src/hooks/"),
            "@utils": path.resolve(__dirname, "src/utils/"),
            "@api": path.resolve(__dirname, "src/api/"),
            "@root": path.resolve(__dirname, "src/"),
            "@models": path.resolve(__dirname, "src/models/"),
            "@config": path.resolve(__dirname, "src/config/"),
            "@styles": path.resolve(__dirname, "src/styles/"),
            "@": path.resolve(__dirname, "src/"),
            "@public": path.resolve(__dirname, "public/"),
        },
    },
    define: {
        'process.env': {}
    },
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:4000",
                changeOrigin: true, // 필요에 따라 설정 (예: CORS 문제 해결)
                // rewrite: (path) => path.replace(/^\/api/, '') // 필요에 따라 경로 재작성
            }
        }
    },
}) 
