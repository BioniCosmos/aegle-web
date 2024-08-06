<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ky from '@/ky'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, type GenericObject } from 'vee-validate'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { customizeLabel, disableAutoComplete, init, schema } from './common'

const router = useRouter()

const fieldConfig = computed(() =>
  Object.fromEntries(
    schema
      .keyof()
      .options.map(init)
      .map(customizeLabel)
      .map(disableAutoComplete),
  ),
)

const form = useForm({ validationSchema: toTypedSchema(schema) })

function generate() {
  form.setValues(
    {
      level: 0,
      uuid: crypto.randomUUID(),
      flow: 'xtls-rprx-vision',
      security: 'auto',
    },
    false,
  )
}

function submit(event: GenericObject) {
  return ky
    .post('api/user', {
      json: { ...event, startDate: Temporal.Now.zonedDateTimeISO() },
    })
    .json<{ id: string }>()
    .then(({ id }) => router.push(`/user/${id}`))
}
</script>

<template>
  <Card>
    <CardHeader class="flex-row items-center justify-between">
      <CardTitle>User</CardTitle>
      <Button @click="generate">Generate</Button>
    </CardHeader>
    <CardContent>
      <AutoForm
        class="space-y-6"
        :schema="schema"
        :field-config="fieldConfig"
        :form="form"
        @submit="submit"
        v-slot="{ submitting }"
      >
        <Button :disabled="submitting">Submit</Button>
      </AutoForm>
    </CardContent>
  </Card>
</template>
