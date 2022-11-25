<script setup lang="ts">
import WarningDialogBox from '@/components/WarningDialogBox.vue'
import type { Profile } from '@/stores/profile'
import { Operation, useUserStore } from '@/stores/user'
import { transfer } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

defineEmits<{
  (event: 'delete'): void
}>()

const userStore = useUserStore()
const { user, isToInsertUser } = storeToRefs(userStore)
const { insertUser, deleteUser, updateUserProfile } = userStore
const title = computed(() => isToInsertUser.value ? 'Adding a user' : 'Editing a user')
const profiles = ref(new Array<Profile>())

function updateProfiles(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  const profileId = (event.target as HTMLInputElement).value
  if (checked) {
    user.value.profiles.set(profileId, '')
    if (!isToInsertUser.value) {
      updateUserProfile(Operation.Add, profileId)
    }
  } else {
    user.value.profiles.delete(profileId)
    if (!isToInsertUser.value) {
      updateUserProfile(Operation.Remove, profileId)
    }
  }
}

onMounted(async () => {
  try {
    profiles.value = await transfer('/api/profiles') as Profile[] ?? []
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">{{ title }}</h1>
    <div class="btn-toolbar mb-2 mb-md-0" v-if="!isToInsertUser">
      <div class="btn-group me-2">
        <button class="btn btn-outline-danger btn-sm" type="button" data-bs-toggle="modal"
          data-bs-target="#warning-dialog-box">Remove the user</button>
      </div>
    </div>
  </div>
  <form @submit.prevent="insertUser">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <input type="text" class="form-control" id="name" required v-model="user.name" :disabled="!isToInsertUser">
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input type="email" class="form-control" id="email" required v-model="user.email" :disabled="!isToInsertUser">
    </div>
    <div class="mb-3">
      <label for="level" class="form-label">Level</label>
      <input type="number" class="form-control" id="level" required v-model="user.level" :disabled="!isToInsertUser">
    </div>
    <div class="mb-3">
      <label for="billing-date" class="form-label">Billing Date</label>
      <input type="date" class="form-control" id="billing-date" required v-model="user.billingDate"
        :disabled="!isToInsertUser">
    </div>
    <div class="mb-2 mt-4">VLESS</div>
    <div class="mb-3 row">
      <div class="col">
        <label for="vless-id" class="form-label">Id</label>
        <input class="form-control" id="vless-id" required v-model="user.account.get('vless')!.id"
          :disabled="!isToInsertUser">
      </div>
      <div class="col">
        <label for="vless-flow" class="form-label">Flow</label>
        <input class="form-control" id="vless-flow" required v-model="user.account.get('vless')!.flow"
          :disabled="!isToInsertUser">
      </div>
      <div class="col">
        <label for="vless-encryption" class="form-label">Encryption</label>
        <input class="form-control" id="vless-encryption" required v-model="user.account.get('vless')!.encryption"
          :disabled="!isToInsertUser">
      </div>
    </div>
    <div class="mb-2">VMess</div>
    <div class="mb-3 row">
      <div class="col">
        <label for="vmess-id" class="form-label">Id</label>
        <input class="form-control" id="vmess-id" required v-model="user.account.get('vmess')!.id"
          :disabled="!isToInsertUser">
      </div>
      <div class="col">
        <label for="vmess-security" class="form-label">Security</label>
        <input class="form-control" id="vmess-security" required v-model="user.account.get('vmess')!.security"
          :disabled="!isToInsertUser">
      </div>
    </div>
    <div class="mb-2">Trojan</div>
    <div class="mb-4 row">
      <div class="col">
        <label for="trojan-password" class="form-label">Password</label>
        <input class="form-control" id="trojan-password" required v-model="user.account.get('trojan')!.password"
          :disabled="!isToInsertUser">
      </div>
      <div class="col">
        <label for="trojan-flow" class="form-label">Flow</label>
        <input class="form-control" id="trojan-flow" required v-model="user.account.get('trojan')!.flow"
          :disabled="!isToInsertUser">
      </div>
    </div>
    <div class="mb-2">Profiles</div>
    <div class="mb-4">
      <div class="form-check form-check-inline" v-for="profile in profiles" :key="profile.id">
        <input class="form-check-input" type="checkbox" :id="`profile-${profile.id}`" :value="profile.id"
          :checked="user.profiles.has(profile.id)" @change="updateProfiles">
        <label class="form-check-label" :for="`profile-${profile.id}`">{{ profile.name }}</label>
      </div>
    </div>
    <button class="btn btn-primary mb-3" v-if="isToInsertUser">Submit</button>
  </form>
  <WarningDialogBox :name="user.name" @delete="deleteUser" />
</template>
