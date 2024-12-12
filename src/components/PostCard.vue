<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '@/types'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Heart, MessageCircle, Flag, Trash, Repeat2, Ellipsis } from 'lucide-vue-next'

const props = defineProps<{
  post: Post
  isOwnPost: (postUserID: number) => boolean
  deletePost: (postID: number) => void
}>()
</script>

<template>
  <Card class="w-full rounded-lg border bg-card text-card-foreground shadow-sm mb-2">
    <CardHeader class="flex flex-row space-x-4 items-start p-4">
      <Avatar>
        <AvatarFallback>{{ props.post.User.Username.charAt(0).toUpperCase() }}</AvatarFallback>
      </Avatar>
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold">{{ props.post.User.Name }}</p>
            <p class="text-sm text-gray-500">@{{ props.post.User.Username }}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <Ellipsis />
                <span class="sr-only">Toggle post menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Menu Post</DropdownMenuLabel>
              <DropdownMenuItem
                class="text-red-600"
                v-if="props.isOwnPost(props.post.User.ID)"
                @click="props.deletePost(props.post.ID)"
              >
                <Trash />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem class="text-red-600" v-else> <Flag /> Report </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardHeader>
    <CardContent class="p-4 pt-0">
      <p>{{ props.post.Content }}</p>
    </CardContent>
    <CardFooter class="flex justify-between items-end p-4">
      <div class="flex space-x-2">
        <Button variant="ghost" size="sm">
          <MessageCircle class="w-4 h-4 mr-2" />
          24
        </Button>
        <Button variant="ghost" size="sm">
          <Repeat2 class="w-4 h-4 mr-2" />
          5
        </Button>
        <Button variant="ghost" size="sm">
          <Heart class="w-4 h-4 mr-2" />
          103
        </Button>
      </div>
      <p class="text-sm text-gray-500">2h</p>
    </CardFooter>
  </Card>
</template>
