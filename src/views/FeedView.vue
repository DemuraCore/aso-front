<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = ref('')

const logout = () => {
  localStorage.removeItem('authToken')
  message.value = 'You have been logged out.'
  router.push('/login')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
      <button
        @click="logout"
        class="w-full px-4 py-2 font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
      <div v-if="message" class="mt-4 text-sm text-green-600">{{ message }}</div>
    </div>
  </div>
</template>

<style>
/* Add any additional styles here */
</style>
