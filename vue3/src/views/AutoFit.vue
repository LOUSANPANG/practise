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
</template>

<style scoped>
  /* 测试大屏 */
  .autofit-text {
    width: 200px;
    height: 200px;
    background-color: aqua;
  }
</style>