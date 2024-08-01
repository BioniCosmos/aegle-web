<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import ky, { fetcher } from '@/ky'
import type { RecoveryCode } from '@/type/account'
import useSWRV from 'swrv'

const { data: codes, mutate } = useSWRV<RecoveryCode[]>(
  'api/account/mfa/recovery-codes',
  fetcher,
)

function download(codes: RecoveryCode[]) {
  const url = URL.createObjectURL(
    new Blob(
      [
        codes
          .map(({ code, used }, i) => `${i}. ${used ? 'USED' : code}`)
          .join('\n'),
      ],
      { type: 'text/plain' },
    ),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = 'recovery-codes.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const generate = () =>
  ky.post('api/account/mfa/recovery-codes').then(() => mutate())
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Recovery codes</CardTitle>
      <CardDescription>
        Recovery codes can be used to access your account if you cannot use
        other multi-factor authentication methods.
      </CardDescription>
    </CardHeader>
    <CardContent
      v-if="codes !== undefined"
      class="grid grid-cols-2 justify-items-center gap-y-1"
    >
      <div
        v-for="{ code, used } in codes"
        :key="code"
        :class="['font-mono', { 'line-through opacity-30': used }]"
      >
        {{ code }}
      </div>
    </CardContent>
    <CardContent v-else class="grid grid-cols-2 justify-items-center gap-y-1">
      <Skeleton class="w-20 h-6" v-for="i in 10" :key="i" />
    </CardContent>
    <CardFooter v-if="codes !== undefined" class="space-x-4">
      <Button @click="download(codes)">Download</Button>
      <Button variant="secondary" @click="generate">Generate new codes</Button>
    </CardFooter>
    <CardFooter v-else class="space-x-4">
      <Skeleton class="w-[108.78px] h-10" />
      <Skeleton class="w-[186.08px] h-10" />
    </CardFooter>
  </Card>
</template>
