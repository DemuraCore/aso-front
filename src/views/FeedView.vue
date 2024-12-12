<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import type { Post, PostResponse } from '../types'
import NewPostForm from '@/components/NewPostForm.vue'
import PostCard from '@/components/PostCard.vue'

const posts = ref<Post[]>([])
const page = ref(1)
const limit = ref(10)
const loading = ref(false)
const noMorePosts = ref(false)
let socket: WebSocket

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

onMounted(() => {
  loadPosts()
  connectWebSocket()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  if (socket) {
    socket.close()
  }
  window.removeEventListener('scroll', handleScroll)
})

const isOwnPost = (postUserID: number) => {
  return Number(localStorage.getItem('userID_cache')) === postUserID
}
</script>

<template>
  <NewPostForm />
  <PostCard
    v-for="post in posts"
    :key="post.ID"
    :post="post"
    :isOwnPost="isOwnPost"
    :deletePost="deletePost"
  />
  <div v-if="loading" class="text-center text-gray-500">Loading...</div>
</template>
