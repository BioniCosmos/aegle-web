<script setup lang="ts">
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
  try {
    users.value = await transfer(`/api/users?limit=10&skip=${(page.value - 1) * 10}`) as User[] ?? []
    for (const user of users.value) {
      profiles.value.set(user.id, await transfer(`/api/profiles?userId=${user.id}`) as Profile[])
    }
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    <h1 class="h2">Users</h1>
    <div class="btn-toolbar mb-2 mb-md-0">
      <div class="btn-group me-2">
        <button class="btn btn-outline-primary btn-sm" type="button" @click="toInsertUser">Add</button>
      </div>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table table-sm table-hover align-middle">
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
            <button class="btn btn-secondary btn-sm me-1" type="button" v-for="profile in profiles.get(user.id)"
              :key="profile.id" @click.stop="toUpdateProfile(profile)">{{ profile.name }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
