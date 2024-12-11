<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const token = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await axios.post('http://localhost:2425/login', {
      email: email.value,
      password: password.value,
    })
    token.value = response.data.data
    error.value = ''
    // set local storage
    localStorage.setItem('authToken', response.data.data) // Or sessionStorage
    router.push('/')
  } catch (err) {
    error.value = err.response.data.error || 'An error occurred'
    token.value = ''
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            autocomplete="username"
            v-model="email"
            id="email"
            required
            class="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            autocomplete="current-password"
            v-model="password"
            id="password"
            required
            class="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>
      <div v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</div>
      <div v-if="token" class="mt-4 text-sm text-green-600">Login Berhasil</div>
    </div>
  </div>
</template>
