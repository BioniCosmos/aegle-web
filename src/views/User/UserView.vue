<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import { useProfileStore } from '@/stores/profile'
import type { UserResponse } from '@/stores/user'
import { useUserStore } from '@/stores/user'
import { getDateString, transfer } from '@/utils'
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { toUpdateProfile } = useProfileStore()
const { toInsertUser, toUpdateUser } = useUserStore()
const users = ref<UserResponse[]>([])
const page = ref(
  ((page) => (Number.isNaN(page) ? 1 : page))(Number(route.query['page']))
)

watchEffect(async () => {
  const res = await transfer<UserResponse[]>(
    `/api/users?limit=10&skip=${(page.value - 1) * 10}`
  )
  users.value = res !== null && typeof res !== 'string' ? res : []
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
        <tr
          v-for="{ user, profiles } in users"
          :key="user.id"
          @click="toUpdateUser(user)"
        >
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.level }}</td>
          <td>{{ getDateString(user.billingDate) }}</td>
          <td>
            <button
              type="button"
              v-for="profile in profiles"
              :key="profile.id"
              @click.stop="toUpdateProfile(profile)"
            >
              {{ profile.name }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </BaseLayout>
</template>
