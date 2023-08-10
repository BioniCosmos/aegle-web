<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import WarningDialogBox from '@/components/WarningDialogBox.vue'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

defineEmits<{
  (event: 'delete'): void
  (event: 'close'): void
}>()

const router = useRouter()
const profileStore = useProfileStore()
const { profile, isToInsertProfile } = storeToRefs(profileStore)
const { insertProfile, deleteProfile } = profileStore
const title = computed(() =>
  isToInsertProfile.value ? 'Adding a profile' : 'Editing a profile'
)
if (profile.value.nodeId === '') {
  router.replace('/nodes')
}
const isOpen = ref(false)
</script>

<template>
  <BaseLayout>
    <template #title>
      <h3 class="mb-0">{{ title }}</h3>
    </template>
    <template #operations v-if="!isToInsertProfile">
      <li>
        <a href="#" role="button" @click="isOpen = true">Remove the profile</a>
      </li>
    </template>
    <form @submit.prevent="insertProfile">
      <label for="name">
        Name
        <input
          type="text"
          id="name"
          required
          v-model="profile.name"
          :readonly="!isToInsertProfile"
        />
      </label>
      <label for="inbound">
        Inbound configuration
        <textarea
          id="inbound"
          rows="10"
          required
          v-model="profile.inbound"
          :readonly="!isToInsertProfile"
        ></textarea>
      </label>
      <label for="outbound">
        Outbound configuration
        <textarea
          id="outbound"
          rows="10"
          required
          v-model="profile.outbound"
          :readonly="!isToInsertProfile"
        ></textarea>
      </label>
      <button v-if="isToInsertProfile">Submit</button>
    </form>
  </BaseLayout>
  <WarningDialogBox
    :name="profile.name"
    :is-open="isOpen"
    @delete="deleteProfile"
    @close="isOpen = false"
  />
</template>
