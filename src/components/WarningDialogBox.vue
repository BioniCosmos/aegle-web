<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="modal fade" id="warning-dialog-box" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Warning!</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure to remove <strong>{{ name }}</strong>?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="$emit('delete')">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>
