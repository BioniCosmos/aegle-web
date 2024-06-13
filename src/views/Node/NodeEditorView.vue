<script setup lang="ts">
import WarningDialog from '@/components/WarningDialog.vue'
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Node } from '@/type/node'
import { toTypedSchema } from '@vee-validate/zod'
import ky from 'ky'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'

const router = useRouter()
const id = useRoute().params.id as string
const isUpdate = computed(() => id !== '')

const schema = z.object({
  name: z.string().min(1),
  apiAddress: z.string().min(1),
})
const form = useForm({ validationSchema: toTypedSchema(schema) })
onMounted(() => {
  if (isUpdate.value) {
    ky(`/api/node/${id}`).json<Node>().then(form.setValues)
  }
})
const submit = () =>
  ky[isUpdate.value ? 'put' : 'post']('/api/node', { json: form.values }).then(
    () => router.push('/nodes'),
  )

const open = ref(false)
const deleteNode = () =>
  ky
    .delete(`/api/node/${id}`)
    .then(() => (open.value = false))
    .then(() => router.push('/nodes'))
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle>Node</CardTitle>
      <div v-if="isUpdate" class="space-x-4">
        <Button size="sm" as-child variant="default">
          <RouterLink :to="`/profile?nodeId=${id}`">Add a profile</RouterLink>
        </Button>
        <Button size="sm" variant="secondary" @click="open = true">
          Remove the node
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <AutoForm
        class="space-y-6"
        :schema="schema"
        :field-config="{ apiAddress: { label: 'API Address' } }"
        :form="form"
        @submit="submit"
        v-slot="{ submitting }"
      >
        <Button :disabled="submitting">Submit</Button>
      </AutoForm>
    </CardContent>
  </Card>
  <WarningDialog
    v-if="form.values.name !== undefined"
    v-model="open"
    :name="form.values.name"
    @confirm="deleteNode"
  />
</template>
