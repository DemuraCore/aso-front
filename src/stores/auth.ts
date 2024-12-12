import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { isTokenExpired, decodeJWT } from '@/utils/decodeJWT'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken')
    if (!token || isTokenExpired(token)) {
      isAuthenticated.value = false
      localStorage.removeItem('authToken')
      return
    }
    isAuthenticated.value = true
  }

  return { isAuthenticated, checkAuth }
})
