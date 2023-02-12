<script setup lang="ts">
import { useAccountStore } from '@/stores/account'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const accountStore = useAccountStore()
const { account } = storeToRefs(accountStore)
const router = useRouter()

async function signIn() {
  await accountStore.signIn()
  router.push('/')
}
</script>

<template>
  <main class="form-signin w-100 m-auto">
    <form @submit.prevent="signIn">
      <h1 class="h3 mb-3 fw-normal">Witch Network</h1>
      <div class="form-floating">
        <input type="text" class="form-control" id="floatingInput" placeholder="Username" v-model="account.username">
        <label for="floatingInput">Username</label>
      </div>
      <div class="form-floating">
        <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
          v-model="account.password">
        <label for="floatingPassword">Password</label>
      </div>
      <div class="checkbox mb-3">
        <label>
          <input type="checkbox" value="remember-me"> Remember me
        </label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in / Sign up</button>
    </form>
  </main>
</template>

<style scoped src="@/assets/css/sign-in.css">

</style>
