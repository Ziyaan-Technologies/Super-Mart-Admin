import { defineStore } from 'pinia';
import { router } from '@/router';
import axios from 'axios';

const readJson = (key: string) => {
    try {
        return JSON.parse(localStorage.getItem(key) || 'null');
    } catch (error) {
        return null;
    }
};

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: readJson('user'),
        returnUrl: null as string | null
    }),
    actions: {
        async initializeAuth() {
            const token = this.user?.token;
            if (!token) {
                this.clearSession();
                return false;
            }
            try {
                const response = await axios.get('auth/me', { headers: { Authorization: `Bearer ${token}` } });
                this.setUser({ ...response.data, token });
                return true;
            } catch (error) {
                this.clearSession();
                return false;
            }
        },
        setUser(user: any) {
            this.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userObject', JSON.stringify(user));
        },
        clearSession() {
            this.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('userObject');
            localStorage.removeItem('permissions');
        },
        async login(email: string, password: string) {
            const response = await axios.post(`admin/login`, { email, password });
            const { token, admin } = response.data;
            this.setUser({ ...admin, token });
            localStorage.removeItem('permissions');
            await (window as any).$app.config.globalProperties.$getAbilities(true);
            router.replace(this.returnUrl || '/dashboard/analytical');
            this.returnUrl = null;
        },
        async logout(callApi = true) {
            if (callApi && this.user?.token) {
                try {
                    await axios.delete(`auth/logout`);
                } catch (error) {
                    console.error('Logout request failed', error);
                }
            }
            this.clearSession();
            await (window as any).$app?.config.globalProperties.$getAbilities(true);
            router.replace('/auth/login');
        }
    }
});
