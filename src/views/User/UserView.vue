<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import type { Profile } from '@/stores/profile'
import { useProfileStore } from '@/stores/profile'
import type { User } from '@/stores/user'
import { useUserStore } from '@/stores/user'
import { getDateString, transfer } from '@/utils'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { toUpdateProfile } = useProfileStore()
const { toInsertUser, toUpdateUser } = useUserStore()
const users = ref<User[]>([])
const profiles = ref(new Map<string, Profile[]>())
const page = ref(((page) => Number.isNaN(page) ? 1 : page)(Number(route.query['page'])))

watchEffect(async () => {
  users.value = await transfer(`/api/users?limit=10&skip=${(page.value - 1) * 10}`) as User[] ?? []
  const requests = users.value.map(user => transfer(`/api/profiles?userId=${user.id}`) as Promise<Array<Profile>>)
  const responses = await Promise.allSettled(requests)
  for (const [i, user] of users.value.entries()) {
    const profile = responses[i]
    if (profile.status === 'fulfilled') {
      profiles.value.set(user.id, profile.value)
    } else {
      console.error(profile.reason)
    }
  }
})
</script>

<template>
  <BaseLayout>
    <template #title>
      <h2 class="mb-0">Users</h2>
    </template>
    <template #operations>
      <li>
        <a href="#" role="button" @click="toInsertUser">Add</a>
      </li>
    </template>
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Level</th>
          <th scope="col">Billing Date</th>
          <th scope="col">Profiles</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" @click="toUpdateUser(user)">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.level }}</td>
          <td>{{ getDateString(new Date(user.billingDate)) }}</td>
          <td>
            <button type="button" v-for="profile in profiles.get(user.id)" :key="profile.id"
              @click.stop="toUpdateProfile(profile)">{{ profile.name }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </BaseLayout>
</template>
