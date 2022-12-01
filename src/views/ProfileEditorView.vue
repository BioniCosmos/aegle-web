<script setup lang="ts">
import WarningDialogBox from '@/components/WarningDialogBox.vue'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

defineEmits<{
  (event: 'delete'): void
}>()

const router = useRouter()
const profileStore = useProfileStore()
const { profile, isToInsertProfile } = storeToRefs(profileStore)
const { insertProfile, deleteProfile } = profileStore
const title = computed(() => isToInsertProfile.value ? 'Adding a profile' : 'Editing a profile')
if (profile.value.nodeId === '') {
  router.replace('/nodes')
}
</script>

<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">{{ title }}</h1>
    <div class="btn-toolbar mb-2 mb-md-0" v-if="!isToInsertProfile">
      <div class="btn-group me-2">
        <button class="btn btn-outline-danger btn-sm" type="button" data-bs-toggle="modal"
          data-bs-target="#warning-dialog-box">Remove the profile</button>
      </div>
    </div>
  </div>
  <form @submit.prevent="insertProfile">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <input type="text" class="form-control" id="name" required v-model="profile.name" :disabled="!isToInsertProfile">
    </div>
    <div class="mb-3">
      <label for="data" class="form-label">Inbound configuration</label>
      <textarea class="form-control" id="data" rows="10" required v-model="profile.inbound"
        :disabled="!isToInsertProfile"></textarea>
    </div>
    <div class="mb-3">
      <label for="data" class="form-label">Outbound configuration</label>
      <textarea class="form-control" id="data" rows="10" required v-model="profile.outbound"
        :disabled="!isToInsertProfile"></textarea>
    </div>
    <button class="btn btn-primary" v-if="isToInsertProfile">Submit</button>
  </form>
  <WarningDialogBox :name="profile.name" @delete="deleteProfile" />
</template>
