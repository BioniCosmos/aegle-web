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
import { Input } from '@/components/ui/input'
import WarningDialog from '@/components/WarningDialog.vue'
import ky, { fetcher } from '@/ky'
import type { MFA } from '@/type/account'
import useSWRV from 'swrv'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const { data: mfa, mutate } = useSWRV<MFA>('api/account/mfa', fetcher)
const open = ref(false)
const disableTOTP = () =>
  ky
    .delete('api/account/mfa/totp')
    .then(() => mutate())
    .then(() => {
      open.value = false
    })
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Name</CardTitle>
      <CardDescription>Change your display name.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="flex flex-col gap-4">
        <Input />
      </form>
    </CardContent>
    <CardFooter class="border-t px-6 py-4">
      <Button>Save</Button>
    </CardFooter>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Password</CardTitle>
      <CardDescription>
        Switch to a new password. Note that all your devices will be signed out.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form class="flex flex-col gap-4">
        <Input />
      </form>
    </CardContent>
    <CardFooter class="border-t px-6 py-4">
      <Button>Save</Button>
    </CardFooter>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Email</CardTitle>
      <CardDescription>Rebind to another email address.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="flex flex-col gap-4">
        <Input />
      </form>
    </CardContent>
    <CardFooter class="border-t px-6 py-4">
      <Button>Save</Button>
    </CardFooter>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Multi-factor Authentication</CardTitle>
      <CardDescription>
        Multi-factor authentication adds an additional layer of security to your
        account by requiring more than just a password to sign in.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div
        v-if="mfa?.totp !== undefined"
        class="flex justify-between items-center"
      >
        <div class="scroll-m-20 text-xl font-semibold tracking-tight">TOTP</div>
        <Button v-if="!mfa.totp" as-child>
          <RouterLink to="/setting/account/totp">Enable</RouterLink>
        </Button>
        <Button v-else @click="open = true">Disable</Button>
      </div>
    </CardContent>
  </Card>
  <WarningDialog v-model="open" @confirm="disableTOTP">
    It is not recommended to disable the authentication.
  </WarningDialog>
</template>
