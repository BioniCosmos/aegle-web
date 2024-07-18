<script setup lang="ts">
import BaseLayout from './BaseLayout.vue'
import PlainLayout from './PlainLayout.vue'
</script>

<template>
  <component :is="$route.meta.auth ? BaseLayout : PlainLayout">
    <RouterView />
  </component>
</template>
