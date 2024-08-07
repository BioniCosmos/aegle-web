<script setup lang="ts">
import WarningDialog from '@/components/WarningDialog.vue'
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import ky from '@/ky'
import type { Node } from '@/type/node'
import { toTypedSchema } from '@vee-validate/zod'
import { useMediaQuery } from '@vueuse/core'
import { Menu } from 'lucide-vue-next'
import { VisuallyHidden } from 'radix-vue'
import { useForm } from 'vee-validate'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

const router = useRouter()
const props = defineProps<{ id: string }>()
const id = computed(() => props.id)
const isUpdate = computed(() => id.value !== '')

const isDesktop = useMediaQuery('(min-width: 768px)')
function toProfileEditor() {
  router.push(`/profile?nodeId=${id.value}`)
}

const dialogOpen = ref(false)
function openDialog() {
  dialogOpen.value = true
}
const closeDialog = () => (dialogOpen.value = false)

const schema = z.object({
  name: z.string().min(1),
  apiAddress: z.string().min(1),
})
const form = useForm({ validationSchema: toTypedSchema(schema) })
watchEffect(() => {
  if (isUpdate.value) {
    ky(`api/node/${id.value}`).json<Node>().then(form.setValues)
  }
})

const insert = () =>
  ky
    .post('api/node', { json: form.values })
    .json<{ id: string }>()
    .then(({ id }) => router.push(`/node/${id}`))

const update = () =>
  ky.put('api/node', { json: form.values }).then(() => router.push('/nodes'))

const deleteNode = () =>
  ky
    .delete(`api/node/${id.value}`)
    .then(closeDialog)
    .then(() => router.replace('/nodes'))
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle>Node</CardTitle>
      <template v-if="isUpdate">
        <div v-if="isDesktop" class="space-x-4">
          <Button size="sm" @click="toProfileEditor">Add a profile</Button>
          <Button size="sm" variant="secondary" @click="openDialog">
            Remove the node
          </Button>
        </div>
        <Drawer v-else>
          <DrawerTrigger as-child>
            <Button variant="outline" size="icon" class="shrink-0">
              <Menu class="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <VisuallyHidden>
              <DrawerHeader>
                <DrawerTitle></DrawerTitle>
                <DrawerDescription></DrawerDescription>
              </DrawerHeader>
            </VisuallyHidden>
            <DrawerFooter>
              <DrawerClose as-child>
                <Button @click="toProfileEditor">Add a profile</Button>
              </DrawerClose>
              <DrawerClose as-child>
                <Button variant="secondary" @click="openDialog">
                  Remove the node
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </template>
    </CardHeader>
    <CardContent>
      <AutoForm
        class="space-y-6"
        :schema="schema"
        :field-config="{
          name: { inputProps: { autocomplete: 'off' } },
          apiAddress: { label: 'API Address' },
        }"
        :form="form"
        :onSubmit="isUpdate ? update : insert"
        v-slot="{ submitting }"
      >
        <Button :disabled="submitting">Submit</Button>
      </AutoForm>
    </CardContent>
  </Card>
  <WarningDialog
    v-if="form.values.name !== undefined"
    v-model="dialogOpen"
    @confirm="deleteNode"
  >
    The
    <span class="font-semibold text-primary">{{ form.values.name }}</span> will
    be permanently deleted.
  </WarningDialog>
</template>
