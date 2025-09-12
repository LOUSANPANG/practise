<script setup>
import { onMounted } from 'vue'
// import { LogisticsLabel } from '@/utils/logistics-label.js'
const JsBarcode = require('@/utils/JsBarcode.all.min.js')
console.log(11111, JsBarcode)

onMounted(() => {
  // const canvas = document.getElementById('canvas')
  // const label = new LogisticsLabel(
  //   canvas,
  //   {
  //     icon: '◼', // icon 会绘制文本
  //     // iconImage: '', // iconImage 第一行左边会绘制图片
  //     title1: 'ПРЯМАЯ ПОСТАВКА В',
  //     title2: 'ГРИВНО_РФЦ',
  //     section2Title: '№ поставки / поставщик',
  //     section2Number: '200002885',
  //     section2Code: '5738',
  //     section2Company: "Товарищество с ограниченной ответственностью 'Oyang'",
  //     section2Address: 'г. Киев, ул. Тестовая, д. 15, офис 24',
  //     section3Title: 'ID грузового места',
  //     section3Number: '1000000000026',
  //     section3Code: '750400',
  //     barcode: '1000000000026750400'
  //   },
  //   { orientation: 'landscape' }
  // )
  // label.draw()
})
</script>

<template>
  <main>
    <canvas id="canvas"></canvas>
  </main>
</template>
