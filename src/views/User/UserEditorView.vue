<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import WarningDialog from '@/components/WarningDialog.vue'
import { useMessage } from '@/stores/common'
import type { Profile } from '@/type/profile'
import { User, getNextDate, parseUser } from '@/type/user'
import ky from 'ky'
import 'temporal-polyfill/global'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const id = useRoute().params.id as string
const isUpdate = computed(() => id !== '')

const user = ref(new User())
const profiles = ref(Array.of<Profile>())
onMounted(() => {
  ky('/api/profiles')
    .json<Profile[]>()
    .then((value) => (profiles.value = value))
  if (isUpdate.value) {
    ky(`/api/user/${id}`, { parseJson: parseUser })
      .json<User>()
      .then((value) => (user.value = value))
  }
})

const nextDate = computed(() => getNextDate(user.value))
const open = ref(false)

function close() {
  open.value = false
}

function extend() {
  const updatedUser = { ...user.value, cycles: user.value.cycles + 1 }
  const json = {
    id: updatedUser.id,
    cycles: updatedUser.cycles,
    nextDate: getNextDate(updatedUser),
  }
  ky.put('/api/user', { json }).then(() => (user.value = updatedUser))
}

function update(event: Event) {
  const input = event.target as HTMLInputElement
  const { checked, value } = input
  user.value.profiles = checked
    ? [...user.value.profiles, { name: value }]
    : user.value.profiles.filter(({ name }) => name !== value)
  if (isUpdate.value) {
    useMessage(`/api/user`, 'PATCH', {
      id,
      profileName: value,
      action: checked ? 'add' : 'remove',
    })
  }
}

function handleDateInput(event: Event) {
  const input = event.target as HTMLInputElement
  const newNextDate = Temporal.PlainDate.from(input.value).toZonedDateTime({
    timeZone: nextDate.value.timeZoneId,
    plainTime: nextDate.value.toPlainTime(),
  })
  user.value.cycles = newNextDate.since(user.value.startDate, {
    smallestUnit: 'month',
  }).months
}

const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)

function inputType(key: keyof User) {
  if (key === 'email') {
    return 'email'
  }
  if (typeof user.value[key] === 'number') {
    return 'number'
  }
  return 'text'
}

function generate() {
  user.value.uuid = crypto.randomUUID()
  user.value.flow = 'xtls-rprx-vision'
  user.value.security = 'auto'
}

function deleteUser() {
  ky.delete(`/api/user/${id}`)
    .then(close)
    .then(() => router.replace('/users'))
}
</script>

<template>
  <BaseLayout>
    <template #title>
      <h3 class="mb-0">
        {{ isUpdate ? 'Update user' : 'Create user' }}
      </h3>
    </template>
    <template #operations v-if="isUpdate">
      <li>
        <a :href="`/api/user/${id}/sub`" role="button" target="_blank">
          Subscription link
        </a>
      </li>
      <li>
        <a href="#" role="button" @click="extend">Extend</a>
      </li>
      <li>
        <a href="#" role="button" @click="open = true">Remove the user</a>
      </li>
    </template>
    <template #operations v-else>
      <li>
        <a href="#" role="button" @click="generate">Generate</a>
      </li>
    </template>
    <form
      @submit.prevent="
        ky.post('/api/user', { json: { ...user, nextDate } }).then(() =>
          $router.replace('/users')
        )
      "
    >
      <label
        v-for="key in [
          'name',
          'email',
          'level',
          'uuid',
          'flow',
          'security',
        ] as const"
        :key="key"
      >
        {{ capitalize(key) }}
        <input
          required
          :type="inputType(key)"
          :readonly="isUpdate"
          v-model="user[key]"
        />
      </label>
      <label>
        Next billing date
        <input
          required
          type="date"
          :readonly="isUpdate"
          :value="nextDate.toPlainDate().toString()"
          @input="handleDateInput"
        />
      </label>
      <fieldset>
        <legend>
          <h5 class="mb-2">Profiles</h5>
        </legend>
        <label v-for="profile in profiles" :key="profile.name">
          <input
            type="checkbox"
            :value="profile.name"
            :checked="
              user.profiles.find(({ name }) => name === profile.name) !==
              undefined
            "
            @change="update"
          />
          {{ profile.name }}
        </label>
      </fieldset>
      <button v-if="!isUpdate">Submit</button>
    </form>
  </BaseLayout>
  <WarningDialog
    :name="user.name"
    :open="open"
    @delete="deleteUser"
    @close="close"
  />
</template>
