<script setup lang="ts">
import WarningDialog from '@/components/WarningDialog.vue'
import { AutoForm, type ConfigItem } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { Profile } from '@/type/profile'
import { parseUser, type User } from '@/type/user'
import { toTypedSchema } from '@vee-validate/zod'
import ky from 'ky'
import useSWRV from 'swrv'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customizeLabel, schema, type Key } from './common'

const router = useRouter()
const id = useRoute().params.id as string

const fieldConfig = computed(() => {
  const addProps = ([key, value]: [Key, ConfigItem]) => [
    key,
    { ...value, inputProps: { readonly: true } },
  ]
  return Object.fromEntries(
    schema.keyof().options.map(customizeLabel).map(addProps),
  )
})

const form = useForm({ validationSchema: toTypedSchema(schema) })

const profiles = ref(Array.of<Profile>())
onMounted(() => {
  ky('/api/profiles')
    .json<Profile[]>()
    .then((value) => (profiles.value = value))
})

const { data: user, mutate } = useSWRV<User>(`/api/user/${id}`, (url) =>
  ky(url, { parseJson: parseUser }).json(),
)
watch(user, (user) => {
  if (user !== undefined) {
    form.resetForm({
      values: {
        ...user,
        date: new Date(user.nextDate.epochMilliseconds),
      },
    })
  }
})

const open = ref(false)

const deleteUser = () =>
  ky
    .delete(`/api/user/${id}`)
    .then(() => (open.value = false))
    .then(() => router.replace('/users'))

const extending = ref(false)
function extend() {
  if (user.value === undefined) {
    return
  }
  extending.value = true
  const { startDate, cycles } = user.value
  return ky
    .put('/api/user', {
      json: {
        id,
        cycles: cycles + 1,
        nextDate: startDate.add({ months: cycles + 1 }),
      },
    })
    .then(() => mutate())
    .then(() => (extending.value = false))
}

const updating = ref(false)
// It seems that we are unable to use curry or bind here.
function update(name: string, checked: boolean) {
  if (user.value === undefined) {
    return
  }
  updating.value = true
  return ky
    .patch('/api/user', {
      json: { id, profileName: name, action: checked ? 'add' : 'remove' },
    })
    .then(() => mutate())
    .then(() => (updating.value = false))
}

const isChecked = (profileName: string) =>
  user.value?.profiles.find(({ name }) => name === profileName) !== undefined
</script>

<template>
  <Card>
    <CardHeader class="flex-row items-center justify-between">
      <CardTitle>User</CardTitle>
      <div class="space-x-4">
        <Button size="sm" as-child>
          <a :href="`/api/user/profiles?id=${id}`" target="_blank">
            Subscription link
          </a>
        </Button>
        <Button size="sm" @click="extend" :disabled="extending">Extend</Button>
        <Button size="sm" variant="secondary" @click="open = true">
          Remove the user
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <AutoForm
        class="space-y-6"
        :schema="schema"
        :field-config="fieldConfig"
        :form="form"
      >
      </AutoForm>
      <div class="mt-8 space-y-4">
        <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mb-5">
          Profiles
        </h4>
        <div
          class="flex items-center space-x-2"
          v-for="profile in profiles"
          :key="profile.name"
        >
          <Switch
            :id="profile.name"
            :checked="isChecked(profile.name)"
            @update:checked="(checked) => update(profile.name, checked)"
            :disabled="updating"
          />
          <Label :for="profile.name">{{ profile.name }}</Label>
        </div>
      </div>
    </CardContent>
  </Card>
  <WarningDialog
    v-if="user !== undefined"
    :name="user.name"
    v-model="open"
    @confirm="deleteUser"
  />
</template>
