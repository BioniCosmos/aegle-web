<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ky from '@/ky'
import { refreshAccount } from '@/type/account'
import type { DefaultResponse } from '@/type/default-response'
import type { HTTPError } from 'ky'
import { AlertCircle } from 'lucide-vue-next'
import type { GenericObject } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

const schema = z.object({ code: z.string().min(1) })
const router = useRouter()
const errorMessage = ref('')

const submit = (event: GenericObject) =>
  ky
    .post('api/account/mfa', { json: { type: 'recoveryCode', ...event } })
    .then(refreshAccount)
    .then(() => router.push('/'))
    .catch(async (error: HTTPError) => {
      const body: DefaultResponse = await error.response.json()
      errorMessage.value = body.message
    })
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Recovery Codes</CardTitle>
    </CardHeader>
    <CardContent>
      <Alert v-if="errorMessage !== ''" variant="destructive" class="mb-4">
        <AlertCircle class="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {{ errorMessage }}
        </AlertDescription>
      </Alert>
      <AutoForm :schema="schema" class="space-y-4" @submit="submit">
        <Button>Confirm</Button>
      </AutoForm>
    </CardContent>
  </Card>
</template>
