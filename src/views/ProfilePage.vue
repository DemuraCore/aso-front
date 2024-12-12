<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { UserResponse } from '@/types'

const route = useRoute()
const username = ref(route.params.username)
const profileUsername = ref('')
const followerCount = ref(0)
const followingCount = ref(0)
const isFollowing = ref(false)
const error = ref('')
const loading = ref(true)
const userId = ref(0)

const fetchUserProfile = async () => {
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.get<UserResponse>(
      `${import.meta.env.VITE_API_URL}/user/${username.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const data = response.data.data
    userId.value = data.ID
    profileUsername.value = data.Username
    followerCount.value = data.FollowersCount
    followingCount.value = data.FollowingCount
  } catch (err) {
    console.error(err)
    error.value = err.response?.data?.error || 'An error occurred'
  } finally {
    loading.value = false
  }
}

const followUser = async () => {
  const token = localStorage.getItem('authToken')
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/me/follow/${userId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    isFollowing.value = true
    followerCount.value += 1
  } catch (err) {
    error.value = err.response?.data?.error || 'An error occurred'
  }
}

onMounted(() => {
  fetchUserProfile()
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
        <h1 class="text-2xl font-bold">{{ profileUsername }}</h1>
        <p class="text-lg">Followers: {{ followerCount }}</p>
        <p class="text-lg">Following: {{ followingCount }}</p>
        <button v-if="!isFollowing" @click="followUser" class="btn btn-primary mt-4">Follow</button>
      </div>
    </div>
  </div>
</template>

<style>
.profile {
  text-align: center;
  margin-top: 50px;
}
.error {
  color: red;
}
</style>
