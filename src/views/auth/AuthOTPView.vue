<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRouter, RouterLink } from 'vue-router'
import type { ErrorResponse } from '@/types'

import { Input } from '@/components/ui/input'
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
import * as z from 'zod'

const error = ref<string>('')
const successMessage = ref<string>('')

const otpCode = ref<string>('')
const showOtpInput = ref<boolean>(false)
const router = useRouter()

const sendOTP = async () => {
  const token = localStorage.getItem('authToken')
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/verify/send-code`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    successMessage.value = 'OTP sent successfully!'
    error.value = ''
    showOtpInput.value = true
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>
    if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
      error.value = axiosError.response.data.error
    } else {
      error.value = 'An error occurred while sending OTP.'
    }
  }
}

const otpSchema = toTypedSchema(
  z.object({
    otp: z.string().min(4, 'OTP must be at least 4 characters long'),
  }),
)

const { handleSubmit } = useForm({
  validationSchema: otpSchema,
})

const verifyOTP = handleSubmit(async (values) => {
  const token = localStorage.getItem('authToken')
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/verify/verify-email`,
      {
        code: values.otp,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    successMessage.value = 'OTP verified successfully!'
    error.value = ''
    router.push('/')
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>
    if (axiosError.response && axiosError.response.data && axiosError.response.data.error) {
      error.value = axiosError.response.data.error
    } else {
      error.value = 'An error occurred during OTP verification.'
    }
  }
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Send and Verify OTP </CardTitle>
        <CardDescription> Enter your OTP code below to verify your account. </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Button v-if="!showOtpInput" @click="sendOTP" class="w-full"> Send OTP </Button>
          <Button
            v-if="!showOtpInput"
            @click="showOtpInput = true"
            variant="outline"
            class="w-full"
          >
            Already have code?
          </Button>
          <form v-if="showOtpInput" @submit.prevent="verifyOTP" class="space-y-6">
            <FormField v-slot="{ componentField }" name="otp">
              <FormItem>
                <FormLabel>OTP Code</FormLabel>
                <FormControl>
                  <Input
                    id="otp"
                    v-model="otpCode"
                    required
                    v-bind="componentField"
                    placeholder="OTP Code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit" class="w-full"> Verify </Button>
            <Button type="button" @click="sendOTP" variant="outline" class="w-full">
              Resend OTP
            </Button>
            <RouterLink to="/">
              <Button
                type="button"
                variant="outline"
                class="mt-2 w-full hover:text-white hover:border-red-700 hover:bg-red-700"
              >
                Skip
              </Button>
            </RouterLink>
          </form>
        </div>
        <div v-if="error" class="mt-4 text-center text-sm text-red-500">
          {{ error }}
        </div>
        <div v-if="successMessage" class="mt-4 text-center text-sm text-green-500">
          {{ successMessage }}
        </div>
      </CardContent>
    </Card>
  </div>
</template>
