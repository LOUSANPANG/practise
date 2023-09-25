<template>
  <!-- Unocss -->
  <!-- 测试presetUno -->
  <div class="w-md h-sm bg-green-200"></div>
  <!-- 测试presetIcons -->
  <div>
    <i class="i-my-svg-a w-20 h-20"></i>
    <i class="i-my-svg-b w-20 h-20"></i>
    <i class="i-openmoji:artist w-20 h-20"></i>
    <i class="i-openmoji:astonished-face w-20 h-20"></i>
  </div>
  <!-- 测试presetWebFonts -->
  <div class="text-80px font-Monofett">hello word!</div>
  <div class="text-80px font-rub">hello word!</div>

</template>

<style scoped>
  /* 测试字体 */
  @font-face {
    font-family: 'RubikIso';
    src: url('../assets/font/Rubik_Iso/RubikIso-Regular.ttf');
  }
  .font-rub {
    font-family: 'RubikIso';
  }
</style>