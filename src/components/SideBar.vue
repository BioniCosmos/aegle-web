<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-3 sidebar-sticky">
      <ul class="nav flex-column">
        <li class="nav-item">
          <RouterLink class="nav-link" to="/">
            <span data-feather="home" class="align-text-bottom"></span>
            Dashboard
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/nodes">
            <span data-feather="cloud" class="align-text-bottom"></span>
            Nodes
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/users">
            <span data-feather="users" class="align-text-bottom"></span>
            Users
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
