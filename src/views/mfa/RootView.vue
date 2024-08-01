<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetcher } from '@/ky'
import type { MFA } from '@/type/account'
import { Badge, Code } from 'lucide-vue-next'
import useSWRV from 'swrv'

const { data: mfa } = useSWRV<MFA>('api/account/mfa', fetcher)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>MFA</CardTitle>
      <CardDescription>Select your preferred method</CardDescription>
    </CardHeader>
    <CardContent v-if="mfa !== undefined">
      <div class="grid gap-4">
        <RouterLink
          v-if="mfa.totp"
          to="/mfa/totp"
          class="grid grid-cols-[auto_1fr] items-center gap-4 rounded-md border border-input bg-popover p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <div class="rounded-full bg-primary p-3 text-primary-foreground">
            <Badge class="size-6" />
          </div>
          <div>
            <div class="text-lg font-medium">Authenticator App</div>
            <p class="text-muted-foreground">
              Use a mobile authenticator app to generate a one-time code.
            </p>
          </div>
        </RouterLink>
        <RouterLink
          to="/mfa/recovery-codes"
          class="grid grid-cols-[auto_1fr] items-center gap-4 rounded-md border border-input bg-popover p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <div class="rounded-full bg-primary p-3 text-primary-foreground">
            <Code class="size-6" />
          </div>
          <div>
            <div class="text-lg font-medium">Recovery Code</div>
            <p class="text-muted-foreground">
              Use a pre-generated recovery code to access your account.
            </p>
          </div>
        </RouterLink>
      </div>
    </CardContent>
    <CardContent v-else>
      <div class="grid gap-4">
        <Skeleton class="w-[597.75px] h-[96.5px]" />
        <Skeleton class="w-[597.75px] h-[96.5px]" />
      </div>
    </CardContent>
  </Card>
</template>
