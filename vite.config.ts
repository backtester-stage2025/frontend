import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
    base: "/",
    plugins: [
        react(),
        commonjs()
    ],
    build: {
        outDir: "dist",
        commonjsOptions: {
            include: [
                /node_modules/,
                /@canvasjs/,
                /@mui/,
                /@emotion/,
                /react-query/,
                /axios/
            ],
            transformMixedEsModules: true,
        }
    },
    optimizeDeps: {
        include: [
            "react",
            "react-dom",
            "react-router-dom",
            "@mui/material",
            "@mui/icons-material",
            "@emotion/react",
            "@emotion/styled",
            "axios",
            "react-query",
            "@canvasjs/",
        ]
    }
});