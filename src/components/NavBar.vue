<script setup lang="ts">
import { useAccountStore } from '@/stores/account'
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'
import CloudIcon from './icons/CloudIcon.vue'
import CreditCardIcon from './icons/CreditCardIcon.vue'
import LogOutIcon from './icons/LogOutIcon.vue'
import UsersIcon from './icons/UsersIcon.vue'

const accountStore = useAccountStore()
const { isAuthorized } = storeToRefs(accountStore)
const router = useRouter()

async function signOut() {
  await accountStore.signOut()
  isAuthorized.value = false
  await router.push('/sign-in')
}
</script>

<template>
  <nav class="container-fluid">
    <ul>
      <li>
        <RouterLink to="/" class="focus:bg-transparent">
          <h3 class="mb-0">Witch Network</h3>
        </RouterLink>
      </li>
    </ul>
    <ul v-if="isAuthorized">
      <li>
        <RouterLink to="/">
          <CreditCardIcon />
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/nodes">
          <CloudIcon />
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/users">
          <UsersIcon />
        </RouterLink>
      </li>
      <li>
        <a href="#" @click="signOut">
          <LogOutIcon />
        </a>
      </li>
    </ul>
  </nav>
</template>
