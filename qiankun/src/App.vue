<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    <nav>
      <RouterLink to="/">主Home</RouterLink>
      <RouterLink to="/about">主About</RouterLink>
      <RouterLink to="/app-vue3">子app-vue3</RouterLink>
    </nav>
  </header>

  <RouterView />
  <div id="container"></div>
</template>

<style>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}
a {
  padding: 1em 2em;
  margin-right: 2em;
}
</style>
