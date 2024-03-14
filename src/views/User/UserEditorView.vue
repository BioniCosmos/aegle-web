<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
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
const { insertUser, deleteUser, updateUserProfile, generate, extend } =
  userStore
const title = computed(() =>
  isToInsertUser.value ? 'Adding a user' : 'Editing a user'
)
const profiles = ref(new Array<Profile>())
const isOpen = ref(false)

function updateProfiles(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  const profileId = (event.target as HTMLInputElement).value
  if (checked) {
    user.value.profiles.profileId = ''
    if (!isToInsertUser.value) {
      updateUserProfile(Operation.Add, profileId)
    }
  } else {
    delete user.value.profiles.profileId
    if (!isToInsertUser.value) {
      updateUserProfile(Operation.Remove, profileId)
    }
  }
}

function handleDateInput(event: Event) {
  user.value.nextDate = Temporal.PlainDate.from(
    (event.target as HTMLInputElement).value
  ).toZonedDateTime({
    timeZone: user.value.nextDate.timeZoneId,
    plainTime: user.value.nextDate.toPlainTime(),
  })
}

onMounted(async () => {
  const res = await transfer<Profile[]>('/api/profiles')
  profiles.value = Array.isArray(res) ? res : []
})
</script>

<template>
  <BaseLayout>
    <template #title>
      <h3 class="mb-0">{{ title }}</h3>
    </template>
    <template #operations v-if="!isToInsertUser">
      <li>
        <a :href="`/api/user/${user.id}/sub`" role="button" target="_blank"
          >Subscription link</a
        >
      </li>
      <li>
        <a href="#" role="button" @click="extend">Extend</a>
      </li>
      <li>
        <a href="#" role="button" @click="isOpen = true">Remove the user</a>
      </li>
    </template>
    <template #operations v-else>
      <li><a href="#" role="button" @click="generate">Generate</a></li>
    </template>
    <form @submit.prevent="insertUser">
      <label for="name">
        Name
        <input
          type="text"
          id="name"
          required
          v-model="user.name"
          :readonly="!isToInsertUser"
        />
      </label>
      <label for="email">
        Email
        <input
          type="email"
          id="email"
          required
          v-model="user.email"
          :readonly="!isToInsertUser"
        />
      </label>
      <label for="level">
        Level
        <input
          type="number"
          id="level"
          required
          v-model="user.level"
          :readonly="!isToInsertUser"
        />
      </label>
      <label for="next-date">
        Next billing date
        <input
          type="date"
          id="next-date"
          required
          :value="user.nextDate.toPlainDate().toString()"
          @input="handleDateInput"
          :readonly="!isToInsertUser"
        />
      </label>
      <h5>VLESS</h5>
      <div class="grid">
        <label for="vless-id">
          Id
          <input
            id="vless-id"
            required
            v-model="user.account.vless.id"
            :readonly="!isToInsertUser"
          />
        </label>
        <label for="vless-flow">
          Flow
          <input
            id="vless-flow"
            required
            v-model="user.account.vless.flow"
            :readonly="!isToInsertUser"
          />
        </label>
        <label for="vless-encryption">
          Encryption
          <input
            id="vless-encryption"
            required
            v-model="user.account.vless.encryption"
            :readonly="!isToInsertUser"
          />
        </label>
      </div>
      <h5>VMess</h5>
      <div class="grid">
        <label for="vmess-id">
          Id
          <input
            id="vmess-id"
            required
            v-model="user.account.vmess.id"
            :readonly="!isToInsertUser"
          />
        </label>
        <label for="vmess-security">
          Security
          <input
            id="vmess-security"
            required
            v-model="user.account.vmess.security"
            :readonly="!isToInsertUser"
          />
        </label>
      </div>
      <h5>Trojan</h5>
      <div class="grid">
        <label for="trojan-password">
          Password
          <input
            id="trojan-password"
            required
            v-model="user.account.trojan.password"
            :readonly="!isToInsertUser"
          />
        </label>
      </div>
      <fieldset>
        <legend>
          <h5>Profiles</h5>
        </legend>
        <label
          v-for="profile in profiles"
          :key="profile.id"
          :for="`profile-${profile.id}`"
        >
          <input
            type="checkbox"
            :id="`profile-${profile.id}`"
            :value="profile.id"
            :checked="user.profiles[profile.id] !== undefined"
            @change="updateProfiles"
          />
          {{ profile.name }}
        </label>
      </fieldset>
      <button v-if="isToInsertUser">Submit</button>
    </form>
  </BaseLayout>
  <WarningDialogBox
    :name="user.name"
    :is-open="isOpen"
    @delete="deleteUser"
    @close="isOpen = false"
  />
</template>
