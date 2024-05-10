<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import { useProfileStore } from '@/stores/profile'
import { getNextDate, type User, type UserResponse } from '@/stores/user'
import { transfer } from '@/utils'
import { ref, shallowRef, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { toUpdateProfile } = useProfileStore()
const users = shallowRef<UserResponse[]>([])
const page = ref(
  ((page) => (Number.isNaN(page) ? 1 : page))(Number(route.query['page']))
)

const isPaid = (user: User) =>
  Temporal.ZonedDateTime.compare(
    getNextDate(user),
    Temporal.Now.zonedDateTimeISO()
  ) !== -1

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
        <RouterLink to="/user" role="button">Add</RouterLink>
      </li>
    </template>
    <table v-if="users.length !== 0">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Level</th>
          <th scope="col">Billing Date</th>
          <th scope="col">Operations</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="{ user, profiles } in users"
          :key="user.id"
          @click="$router.push(`/user/${user.id}`)"
          :style="{ backgroundColor: isPaid(user) ? 'unset' : 'red' }"
        >
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.level }}</td>
          <td>{{ getNextDate(user).toPlainDate() }}</td>
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
    <div v-else class="text-center">Nothing here</div>
  </BaseLayout>
</template>
