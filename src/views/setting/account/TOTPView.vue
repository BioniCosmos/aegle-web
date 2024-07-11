<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from '@/components/ui/pin-input'
import ky from '@/ky'
import type { TOTP } from '@/type/account'
import type { DefaultResponse } from '@/type/default-response'
import { HTTPError } from 'ky'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const totp = ref<TOTP>()

onMounted(() => {
  ky('api/account/mfa/totp')
    .json<TOTP>()
    .then((body) => {
      totp.value = body
    })
})

const code = ref<string[]>([])
const submitting = ref(false)
const message = ref('')
const router = useRouter()

function submit(event: Event) {
  submitting.value = true
  const formData = new FormData(event.target as HTMLFormElement)
  return ky
    .post('api/account/mfa/totp', {
      json: Object.fromEntries(formData.entries()),
    })
    .then(() => {
      submitting.value = false
    })
    .then(() => router.push('/setting/account'))
    .catch(async (error: HTTPError) => {
      submitting.value = false
      const body: DefaultResponse = await error.response.json()
      message.value = body.message
    })
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>TOTP</CardTitle>
    </CardHeader>
    <form @submit.prevent="submit">
      <CardContent>
        <ol class="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>
            <p class="leading-7 [&:not(:first-child)]:mt-6">
              Scan the following QR code in your authenticator app
            </p>
            <p class="leading-7 [&:not(:first-child)]:mt-6">
              <img :src="totp?.image" width="200" height="200" />
            </p>
            <p class="leading-7 [&:not(:first-child)]:mt-6">
              <span class="text-sm text-muted-foreground">
                Unable to scan? Configure your authenticator app manually:
              </span>
              <code
                class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
              >
                {{ totp?.secret }}
              </code>
            </p>
          </li>
          <li class="space-y-2">
            <Label for="code">Verify the code from the app</Label>
            <PinInput
              id="code"
              name="code"
              v-model="code"
              placeholder="○"
              otp
              type="number"
              required
            >
              <PinInputGroup>
                <PinInputInput
                  v-for="(id, index) in 6"
                  :key="id"
                  :index="index"
                />
              </PinInputGroup>
            </PinInput>
            <p
              v-if="message !== ''"
              role="alert"
              class="text-sm font-medium text-destructive"
            >
              {{ message }}
            </p>
          </li>
        </ol>
      </CardContent>
      <CardFooter class="border-t px-6 py-4">
        <Button :disabled="submitting">Save</Button>
      </CardFooter>
    </form>
  </Card>
</template>
