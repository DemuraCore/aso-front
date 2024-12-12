import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

  const checkAuth = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/me`, { withCredentials: true })
      isAuthenticated.value = true
    } catch (error) {
      isAuthenticated.value = false
    }
  }

  return { isAuthenticated, checkAuth }
})
