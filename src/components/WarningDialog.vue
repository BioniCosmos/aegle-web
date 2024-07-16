<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useMediaQuery } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{ onConfirm: () => Promise<unknown> }>()
const open = defineModel<boolean>()

const isDesktop = useMediaQuery('(min-width: 768px)')

const title = 'Are you absolutely sure?'

const submitting = ref(false)
const confirm = () => {
  submitting.value = true
  props.onConfirm().then(() => (submitting.value = false))
}
</script>

<template>
  <AlertDialog v-if="isDesktop" v-model:open="open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}</AlertDialogTitle>
        <AlertDialogDescription>
          <slot />
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button variant="destructive" :disabled="submitting" @click="confirm">
          Continue
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  <Drawer v-else v-model:open="open">
    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>{{ title }}</DrawerTitle>
        <DrawerDescription>
          <slot />
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooter class="pt-2">
        <Button variant="destructive" :disabled="submitting" @click="confirm">
          Continue
        </Button>
        <DrawerClose as-child>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
