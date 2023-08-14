<script setup lang="ts">
import { onMounted } from 'vue';
import autofit from 'autofit.js';

  onMounted(() => {

    // autofit.js
    autofit.init({
        dw: 1200,
        dh: 900,
        el: "#app",
        resize: true
    }, true)
    
  })
</script>

<template>
  <!-- autofit js 自适应 -->
  <div class="autofit-text"></div>

  <!-- Unocss -->
  <div class="i-mdi:airplane text-orange-400" />
</template>

<style scoped>
  #container {
    box-sizing: border-box;
    border: 1px solid red;
  }
  .autofit-text {
    width: 200px;
    height: 200px;
    background-color: aqua;
  }
</style>