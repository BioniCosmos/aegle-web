<script setup lang="ts">
import { CloudIcon, HomeIcon, UsersIcon } from '@zhuowenli/vue-feather-icons'
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-3 sidebar-sticky">
      <ul class="nav flex-column">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/">
            <HomeIcon class="align-text-bottom" />
            Dashboard
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/nodes">
            <CloudIcon class="align-text-bottom" />
            Nodes
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/users">
            <UsersIcon class="align-text-bottom" />
            Users
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
