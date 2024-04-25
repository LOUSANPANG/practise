<script setup lang="ts">
  import { ref } from "vue"

  const value = ref('')
</script>

<template>
  <div>
    <input v-model.lazy="value" />
    {{ value }}
  </div>
</template>

<style scoped></style>