<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAccount, type Account } from '@/type/account'
import ky, { HTTPError } from 'ky'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
const hasId = computed(() => id !== '')
const router = useRouter()

const errorMessage = ref('')

onMounted(() => {
  if (hasId.value) {
    const [, setAccount] = useAccount()
    ky.post(`/api/account/verification/${id}`)
      .json<Account>()
      .then(setAccount)
      .then(() => router.push('/'))
      .catch((error: HTTPError) => {
        if (error.response.status === 404) {
          errorMessage.value = 'expired link'
        }
      })
  }
})
</script>

<template>
  <div v-if="hasId">{{ errorMessage }}</div>
  <div v-else class="flex items-center justify-center h-dvh">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Please check your email inbox.</div>
        <div>
          Not received?
          <Button variant="link" class="p-0 text-base">Send again</Button>.
        </div>
      </CardContent>
    </Card>
  </div>
</template>
