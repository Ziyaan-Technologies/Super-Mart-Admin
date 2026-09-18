import { createRouter, createWebHistory } from 'vue-router'
import MainRoutes from './MainRoutes'
import AuthRoutes from './AuthRoutes'
import { useAuthStore } from '@/stores/auth'
import { getAbilities } from '@/utils/getAbilities'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/authentication/Error.vue'),
    },
    MainRoutes,
    AuthRoutes,
  ],
})

router.beforeEach(async (to) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })

  const auth: any = useAuthStore()

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!auth.user) {
      auth.returnUrl = to.fullPath
      return '/auth/login'
    }

    const actions: string[] = Array.isArray(to.meta.action)
      ? (to.meta.action as string[])
      : typeof to.meta.action === 'string'
        ? [to.meta.action as string]
        : []

    const subject = typeof to.meta.subject === 'string' ? (to.meta.subject as string) : undefined

    if (actions.length > 0 && subject) {
      const ability = await getAbilities()
      if (!actions.some((action) => ability.can(action, subject))) {
        return '/auth/unauthorized'
      }
    }
    return true
  }

  if (auth.user && to.name === 'Login') {
    return '/dashboard/analytical'
  }
  return true
})
