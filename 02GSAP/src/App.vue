<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <nav>
      <RouterLink to="/">GSAP</RouterLink>
      <RouterLink to="/demo">DEMO</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
.app {
  position: relative;
  padding: 2em 0;
}

nav {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  font-size: 12px;
  text-align: center;
  background-color: aliceblue;
}
</style>
