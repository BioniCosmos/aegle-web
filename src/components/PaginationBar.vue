<script setup lang="ts">
defineProps<{ page: number }>()
defineEmits<{ toPrevious: []; toNext: [] }>()
</script>

<template>
  <nav>
    <ul>
      <li>
        <a href="#" @click="$emit('toPrevious')">Previous</a>
      </li>
      <li>{{ page }}</li>
      <li>
        <a href="#" @click="$emit('toNext')">Next</a>
      </li>
    </ul>
  </nav>
</template>
