<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from "gsap";


onMounted(() => {

  // to from fromTo
  gsap.to(".box1", {
    rotation: 360,
    x: 100,
    duration: 3
  });

  // 做个时间线，排队执行
  const tl = gsap.timeline();
  tl.to(".box2", { duration: 1, x: 100, rotation: 360 })
  tl.to(".box2", { duration: 1, x: 200, rotation: 0 }, "+=1") // 等1s后执行
  tl.to(".box2", { duration: 1, x: 300, rotation: 360 })

  // 定义一个标记, 标记了从1s处开始，seek从这个标记开始
  const tl1 = gsap.timeline();
  tl1.addLabel("step2", 1)
    .to(".box3", { duration: 1, x: 100 })
    .to(".box3", { duration: 1, x: 200 })
  tl1.seek("step2");

  // 自定义动画
  gsap.registerEffect({
    name: 'shake',
    effect: (target: any, config: any) => {
      return gsap.to(target, {
        y: () => `${Math.random() * 100 - 50}px`,
        opacity: () => `${Math.random() * 0.5 + 0.5}`,
        duration: config.duration,
        repeat: config.repeat,
        yoyo: config.yoyo
      })
    },
    defaults: {
      duration: 1,
      repeat: Infinity,
      yoyo: true
    }
  })
  gsap.effects.shake(".box4")

})
</script>

<template>
  <main>
    <div class="box box1">基础</div>
    <div class="box box2">时间轴动画</div>
    <div class="box box3">指定时间点</div>
    <div class="box box4">自定义动画</div>
  </main>
</template>

<style>
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  width: 150px;
  height: 150px;
  background-image: linear-gradient(to right, #06b6d4, #3b82f6);
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
}
</style>
