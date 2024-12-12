<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import type { RegisterResponse, ErrorResponse } from '../../types'
import { decodeJWT } from '@/utils/decodeJWT'

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
const loading = ref<boolean>(false)
const router = useRouter()

const formSchema = toTypedSchema(
  z
    .object({
      name: z.string(),
      username: z.string().min(4),
      email: z.string().email(),
      password: z.string().min(4),
      confirmPassword: z.string().min(4),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
)

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    const response = await axios.post<RegisterResponse>(
      `${import.meta.env.VITE_API_URL}/register`,
      {
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
      },
    )
    const decoded = decodeJWT(response.data.token)
    // set local storage
    localStorage.setItem('authToken', response.data.token) // Or sessionStorage
    localStorage.setItem('userID_cache', decoded?.user_id?.toString() || '')
    router.push('/auth/otp')
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
        <CardTitle class="text-2xl"> Register </CardTitle>
        <CardDescription> Enter your email below to login to your account. </CardDescription>
      </CardHeader>
      <form @submit.prevent="onSubmit">
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Your Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    autocomplete="name"
                    required
                    v-bind="componentField"
                    placeholder="Your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    autocomplete="username"
                    required
                    v-bind="componentField"
                    placeholder="Username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    autocomplete="email"
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
                    autocomplete="new-password"
                    placeholder="Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    id="confirm-password"
                    type="password"
                    v-bind="componentField"
                    placeholder="Confirm Password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            <span v-if="loading">Loading...</span>
            <span v-else>Sign Up</span>
          </Button>
          <div v-if="error" class="mt-4 text-center text-sm text-red-500">
            {{ error }}
          </div>
          <div class="mt-4 text-center text-sm">
            Already have an account?
            <RouterLink to="/auth/login" class="underline">login</RouterLink>
          </div>
        </CardContent>
      </form>
    </Card>
  </div>
</template>
