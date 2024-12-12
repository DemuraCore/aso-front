<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import type { LoginResponse, ErrorResponse } from '../../types'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { h } from 'vue'
import * as z from 'zod'
import { RouterLink } from 'vue-router'

const error = ref<string>('')
const token = ref<string>('')
const loading = ref<boolean>(false)
const router = useRouter()

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(4),
  }),
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    const response = await axios.post<LoginResponse>(`${import.meta.env.VITE_API_URL}/login`, {
      email: values.email,
      password: values.password,
    })

    token.value = response.data.data
    error.value = ''
    // set local storage
    localStorage.setItem('authToken', response.data.data) // Or sessionStorage
    router.push('/')
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>
    if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
      error.value = axiosError.response.data.error
    } else {
      error.value = 'An error occurred during login.'
    }
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription> Enter your email below to login to your account. </CardDescription>
      </CardHeader>
      <form @submit.prevent="onSubmit">
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    autocomplete="username"
                    required
                    v-bind="componentField"
                    placeholder="Email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    v-bind="componentField"
                    type="password"
                    autocomplete="current-password"
                    placeholder="Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            <span v-if="loading">Loading...</span>
            <span v-else>Sign in</span>
          </Button>
          <div v-if="error" class="mt-4 text-center text-sm text-red-500">
            {{ error }}
          </div>
          <div class="mt-4 text-center text-sm">
            Don't have an account?
            <RouterLink to="/auth/register" class="underline">Register</RouterLink>
          </div>
        </CardContent>
      </form>
    </Card>
  </div>
</template>
