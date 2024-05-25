<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import ky from 'ky'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function insert(event: Event) {
  const formData = new FormData(event.target as HTMLFormElement)
  ky.post('/api/profile', {
    json: {
      ...Object.fromEntries(formData.entries()),
      nodeId: route.query.nodeId,
    },
  }).then(() => router.push('/nodes'))
}
</script>

<template>
  <BaseLayout>
    <template #title>
      <h3 class="mb-0">Adding a profile</h3>
    </template>
    <form @submit.prevent="insert">
      <label for="name">
        Name
        <input id="name" name="name" required />
      </label>
      <label for="inbound">
        Inbound configuration
        <textarea id="inbound" name="inbound" rows="10" required></textarea>
      </label>
      <label for="outbound">
        Outbound configuration
        <textarea id="outbound" name="outbound" rows="10" required></textarea>
      </label>
      <button>Submit</button>
    </form>
  </BaseLayout>
</template>
