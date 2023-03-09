<script setup lang="ts">
import { useAccountStore } from '@/stores/account'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const accountStore = useAccountStore()
const { account } = storeToRefs(accountStore)
const router = useRouter()

async function signIn() {
  await accountStore.signIn()
  await router.push('/')
}
</script>

<template>
  <div class="h-[calc(100vh-4.25rem)] flex justify-center items-center">
    <article class="grid">
      <form class="mb-0" @submit.prevent="signIn">
        <input type="text" placeholder="Username" aria-label="Username" autocomplete="nickname" required
          v-model="account.username">
        <input type="password" placeholder="Password" aria-label="Password" autocomplete="current-password" required
          v-model="account.password">
        <fieldset>
          <label for="remember">
            <input type="checkbox" role="switch" id="remember">
            Remember me
          </label>
        </fieldset>
        <button class="contrast mb-0">Sign in</button>
      </form>
    </article>
  </div>
</template>
