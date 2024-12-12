<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import type { AxiosError } from 'axios'

const newPostContent = ref('')
const errorMessage = ref('')
const loading = ref(false)

const createPost = async () => {
  const token = localStorage.getItem('authToken')
  if (!newPostContent.value) return
  loading.value = true
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/posts`,
      { Content: newPostContent.value },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    newPostContent.value = ''
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = 'You need to verify your email before creating a post.'
  } finally {
    loading.value = false
  }
}

const authStore = useAuthStore()
</script>

<template>
  <div class="grid w-full gap-2 mb-4">
    <Textarea
      v-model="newPostContent"
      placeholder="Type your message here."
      v-if="authStore.isAuthenticated"
    />
    <Button @click="createPost" :disabled="loading" v-if="authStore.isAuthenticated">
      <span v-if="loading">Loading...</span>
      <span v-else>Send message</span>
    </Button>
    <Button v-else @click="$router.push({ name: 'Login' })">Login</Button>
    <div v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</div>
  </div>
</template>
