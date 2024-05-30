<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import type { Pagination } from '@/type/pagination'
import { getNextDate, parseUser, type User } from '@/type/user'
import ky from 'ky'
import useSWRV from 'swrv'
import { ref } from 'vue'

const page = ref(1)
const { data: pagination } = useSWRV<Pagination<User>>(
  () => `/api/users?page=${page.value}`,
  (url) => ky(url, { parseJson: parseUser }).json(),
)

const isPaid = (user: User) =>
  Temporal.ZonedDateTime.compare(
    getNextDate(user),
    Temporal.Now.zonedDateTimeISO(),
  ) !== -1
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
    <table v-if="pagination?.items.length !== 0">
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
          v-for="user in pagination?.items"
          :key="user.id"
          @click="$router.push(`/user/${user.id}`)"
          :style="{ backgroundColor: isPaid(user) ? 'unset' : 'red' }"
        >
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.level }}</td>
          <td>{{ getNextDate(user).toPlainDate() }}</td>
          <td>
            <button type="button" v-for="{ name } in user.profiles" :key="name">
              {{ name }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="text-center">Nothing here</div>
  </BaseLayout>
  <PaginationBar
    :page="page"
    @toPrevious="page = pagination?.previousPage!"
    @toNext="page = pagination?.nextPage!"
  />
</template>
