import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import { vMaska } from "maska/vue"
import CaslPlugin from '../src/plugins/casl'
import { useAuthStore } from '@/stores/auth'
import { createI18n } from 'vue-i18n';
import messages from '@/utils/locales/messages';
import VueScrollTo from 'vue-scrollto';
import axios from 'axios'
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = authStore.user?.token;
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    response => response,
    error => {
        const authStore = useAuthStore();
        if (error.response?.status === 401 && authStore.user) {
            authStore.logout(false);
        }
        return Promise.reject(error);
    }
);

const i18n = createI18n({
    locale: 'en',
    messages: messages,
    silentTranslationWarn: true,
    silentFallbackWarn: true
});

const app = createApp(App).directive("maska", vMaska);
app.use(createPinia());
app.use(router);
app.use(PerfectScrollbarPlugin);
app.use(VueTablerIcons);
app.use(i18n);
app.use(VueApexCharts as any);
app.use(vuetify);
app.use(CaslPlugin);
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
} as ToastContainerOptions);
app.use(VueScrollTo, {
    duration: 1000,
    easing: "ease"
});

(window as any).$app = app;

const authStore = useAuthStore();
authStore.initializeAuth().then(async (isAuthenticated) => {
    if (isAuthenticated) {
        await app.config.globalProperties.$getAbilities();
    }
    app.mount('#app');
});
