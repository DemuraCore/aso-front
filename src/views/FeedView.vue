<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import type { Post, PostResponse } from '../types'
const posts = ref<Post[]>([])
const page = ref(1)
const limit = ref(10)
const loading = ref(false)
const noMorePosts = ref(false)
const newPostContent = ref('')
const errorMessage = ref('')
let socket: WebSocket
const userID = ref<number | null>(null)

const loadPosts = async () => {
  const token = localStorage.getItem('authToken')
  if (loading.value || noMorePosts.value) return
  loading.value = true
  try {
    const response = await axios.get<PostResponse>(
      `${import.meta.env.VITE_API_URL}/posts?page=${page.value}&limit=${limit.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (response.data.data.length < limit.value) {
      noMorePosts.value = true
    }
    posts.value.push(...response.data.data)
    page.value++
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const createPost = async () => {
  const token = localStorage.getItem('authToken')
  if (!newPostContent.value) return
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
    if (
      error.response &&
      error.response.data &&
      error.response.data.error === 'User needs to verify email'
    ) {
      errorMessage.value = 'You need to verify your email before creating a post.'
    } else {
      console.error(error)
    }
  }
}

const deletePost = async (postID: number) => {
  const token = localStorage.getItem('authToken')
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error('Error deleting post:', error)
  }
}

const connectWebSocket = () => {
  socket = new WebSocket(`${import.meta.env.VITE_API_URL}/ws`)
  socket.onopen = () => {
    console.log('WebSocket connection established')
  }
  socket.onmessage = (event) => {
    try {
      const post: Post = JSON.parse(event.data)
      if (post.Content) {
        console.log('New post received:', post)
        posts.value.unshift(post)
      } else {
        console.log('Post deleted:', post)
        posts.value = posts.value.filter((p) => p.ID !== post.ID)
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error)
    }
  }

  socket.onclose = () => {
    console.log('WebSocket connection closed. Reconnecting...')
    setTimeout(connectWebSocket, 1000)
  }
}

const handleScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    console.log('Loading more posts...')
    loadPosts()
  }
}

const fetchUserID = async () => {
  const token = localStorage.getItem('authToken')
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    userID.value = response.data.data.ID
  } catch (error) {
    console.error('Error fetching user ID:', error)
  }
}

onMounted(() => {
  loadPosts()
  connectWebSocket()
  fetchUserID()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  if (socket) {
    socket.close()
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="mb-4">
    <input
      v-model="newPostContent"
      placeholder="What's on your mind?"
      class="w-full p-2 border rounded mb-2"
    />
    <button @click="createPost" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Post
    </button>
    <div v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</div>
  </div>
  <div v-for="post in posts" :key="post.ID" class="bg-white p-4 rounded shadow mb-4">
    <p class="text-lg">{{ post.Content }}</p>
    <p class="text-gray-500">By: {{ post.User.Username }}</p>
    <button
      v-if="post.UserID === userID"
      @click="deletePost(post.ID)"
      class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2"
    >
      Delete
    </button>
  </div>
  <div v-if="loading" class="text-center text-gray-500">Loading...</div>
</template>
