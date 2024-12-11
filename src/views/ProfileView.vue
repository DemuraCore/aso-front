<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const username = ref('')
const followerCount = ref(0)
const followingCount = ref(0)
const error = ref('')
const loading = ref(true)

const fetchProfile = async () => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    error.value = 'No token found'
    loading.value = false
    return
  }

  try {
    const response = await axios.get('http://localhost:2425/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = response.data.data
    username.value = data.Username
    followerCount.value = data.Followers.length
    followingCount.value = data.Following.length
  } catch (err) {
    error.value = err.response?.data?.error || 'An error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="profile container mx-auto mt-10">
    <div v-if="error" class="error text-red-500 text-center">{{ error }}</div>
    <div v-else>
      <div v-if="loading" class="skeleton-loader space-y-4">
        <div class="h-8 bg-gray-300 rounded w-1/3 mx-auto"></div>
        <div class="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
        <div class="h-4 bg-gray-300 rounded w-1/4 mx-auto"></div>
      </div>
      <div v-else class="text-center">
        <h1 class="text-2xl font-bold">{{ username }}</h1>
        <p class="text-lg">Followers: {{ followerCount }}</p>
        <p class="text-lg">Following: {{ followingCount }}</p>
      </div>
    </div>
  </div>
</template>

<style>
/* Add any additional styles here */
.profile {
  text-align: center;
  margin-top: 50px;
}
.error {
  color: red;
}
</style>
