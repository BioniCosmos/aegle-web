<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import SideBar from '@/components/SideBar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <NavBar />
  <div class="container-fluid">
    <div class="row">
      <SideBar />
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped src="@/assets/css/dashboard.css">

</style>
