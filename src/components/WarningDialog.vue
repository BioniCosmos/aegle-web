<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ name: string; open: boolean }>()
defineEmits<{ delete: []; close: [] }>()
const realOpen = ref(false)

watch(
  () => props.open,
  (isOpen) => {
    const isOpenClass = 'modal-is-open'
    const openingClass = 'modal-is-opening'
    const closingClass = 'modal-is-closing'
    const animationDuration = 400
    if (isOpen) {
      document.documentElement.classList.add(isOpenClass, openingClass)
      setTimeout(() => {
        document.documentElement.classList.remove(openingClass)
      }, animationDuration)
      realOpen.value = true
    } else {
      document.documentElement.classList.add(closingClass)
      setTimeout(() => {
        document.documentElement.classList.remove(closingClass, isOpenClass)
        realOpen.value = false
      }, animationDuration)
    }
  }
)
</script>

<template>
  <dialog :open="realOpen">
    <article>
      <a href="#" aria-label="Close" class="close" @click="$emit('close')"></a>
      <h3>Warning!</h3>
      <p>
        Are you sure to remove <b>{{ name }}</b
        >?
      </p>
      <footer>
        <a href="#" role="button" class="secondary" @click="$emit('close')">
          No
        </a>
        <a href="#" role="button" @click="$emit('delete')">Yes</a>
      </footer>
    </article>
  </dialog>
</template>
