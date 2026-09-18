import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vuetify({
            autoImport: true,
            styles: { configFile: 'src/scss/variables.scss' }
        })
    ],
    build: {
        outDir: 'dist', // Output directory for build
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            external: [],
            output: {
                globals: {
                    quill: 'Quill', // Map Quill to its named export
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        dedupe: ['quill'],
    },
    css: {
        preprocessorOptions: {
            scss: {}
        }
    },
    optimizeDeps: {
        exclude: ['vuetify'],
        entries: ['./src/**/*.vue'],
        include: ['quill', 'vue3-quill'],
    }
});
