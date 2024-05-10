<script setup lang="ts">
import BaseLayout from '@/components/BaseLayout.vue'
import WarningDialogBox from '@/components/WarningDialogBox.vue'
import { useMessage } from '@/stores/common'
import type { Profile } from '@/stores/profile'
import { Operation, User, getNextDate, parseUser } from '@/stores/user'
import ky from 'ky'
import 'temporal-polyfill/global'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

defineEmits<{ (event: 'delete'): void }>()

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
const isOpen = ref(false)

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
  user.value.profileIds = checked
    ? [...user.value.profileIds, value]
    : user.value.profileIds.filter((profileId) => profileId !== value)
  if (isUpdate.value) {
    useMessage(`/api/user/${id}`, 'PATCH', {
      operation: checked ? Operation.Add : Operation.Remove,
      id: value,
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

function protoName(proto: string) {
  if (proto === 'vless') {
    return 'VLESS'
  }
  if (proto === 'vmess') {
    return 'VMess'
  }
  if (proto === 'trojan') {
    return 'Trojan'
  }
  return ''
}

function generate() {
  const id = crypto.randomUUID()
  user.value.account = {
    vless: { id, flow: 'xtls-rprx-vision', encryption: 'none' },
    vmess: { id, security: 'auto' },
    trojan: { password: id },
  }
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
        <a href="#" role="button" @click="isOpen = true">Remove the user</a>
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
      <label v-for="key in ['name', 'email', 'level'] as const" :key="key">
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
      <template v-for="(value, key) in user.account" :key="key">
        <h5 class="mb-2">{{ protoName(key) }}</h5>
        <div class="grid">
          <label v-for="(_v, k) in value" :key="k">
            {{ capitalize(k) }}
            <input
              required
              :readonly="isUpdate"
              v-model="user.account[key][k]"
            />
          </label>
        </div>
      </template>
      <fieldset>
        <legend>
          <h5 class="mb-2">Profiles</h5>
        </legend>
        <label v-for="profile in profiles" :key="profile.id">
          <input
            type="checkbox"
            :value="profile.id"
            :checked="user.profileIds.includes(profile.id)"
            @change="update"
          />
          {{ profile.name }}
        </label>
      </fieldset>
      <button v-if="!isUpdate">Submit</button>
    </form>
  </BaseLayout>
  <WarningDialogBox
    :name="user.name"
    :is-open="isOpen"
    @delete="ky.delete(`/api/user/${id}`).then(() => $router.replace('/users'))"
    @close="isOpen = false"
  />
</template>
