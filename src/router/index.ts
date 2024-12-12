import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import FeedView from '../views/FeedView.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import AuthOTPView from '@/views/auth/AuthOTPView.vue'
import AppLayout from '@/views/layouts/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const getCurrentUsername = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) return null

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.data.Username
  } catch (error) {
    console.error('Error fetching current username:', error)
    return null
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth/otp',
      name: 'VerifyOTP',
      component: AuthOTPView,
    },
    {
      path: '/auth',
      children: [
        {
          path: 'login',
          name: 'Login',
          component: LoginView,
        },
        {
          path: 'register',
          name: 'Register',
          component: RegisterView,
        },
        {
          path: 'logout',
          name: 'Logout',
          redirect: '/auth/login',
          beforeEnter: async (to, from, next) => {
            localStorage.removeItem('authToken')
          },
        },
      ],
    },
    {
      path: '/',
      name: 'Feed',
      component: AppLayout,
      children: [
        {
          path: '/',
          component: FeedView,
        },
      ],
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage,
      beforeEnter: async (to, from, next) => {
        const username = await getCurrentUsername()

        next({ name: 'ProfilePage', params: { username } })
      },
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/:username',
      name: 'ProfilePage',
      component: ProfilePage,
      meta: { requiresAuth: true }, // Add meta field to require auth
    },
    {
      path: '/:pathMatch(.*)*', // Catch-all route
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const authStore = useAuthStore()

  await authStore.checkAuth()

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
