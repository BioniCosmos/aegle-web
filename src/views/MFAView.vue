<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from '@/components/ui/pin-input'
import ky from '@/ky'
import { refreshAccount } from '@/type/account'
import type { DefaultResponse } from '@/type/default-response'
import type { HTTPError } from 'ky'
import { AlertCircle } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const errorMessage = ref('')
const code = ref<string[]>([])

const submit = (event: string[]) =>
  ky
    .post('api/account/mfa', { json: { code: event.join('') } })
    .then(refreshAccount)
    .then(() => router.push('/'))
    .catch(async (error: HTTPError) => {
      const body: DefaultResponse = await error.response.json()
      errorMessage.value = body.message
    })
</script>

<template>
  <div class="flex items-center justify-center h-dvh">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">MFA Verification</CardTitle>
        <CardDescription>
          Enter your 6-digit TOTP code to complete the login process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert v-if="errorMessage !== ''" variant="destructive" class="mb-4">
          <AlertCircle class="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {{ errorMessage }}
          </AlertDescription>
        </Alert>
        <PinInput
          id="code"
          name="code"
          v-model="code"
          placeholder="○"
          otp
          type="number"
          required
          @complete="submit"
        >
          <PinInputGroup>
            <PinInputInput v-for="(id, index) in 6" :key="id" :index="index" />
          </PinInputGroup>
        </PinInput>
      </CardContent>
    </Card>
  </div>
</template>
