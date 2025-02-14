<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from "gsap";


onMounted(() => {
  console.log(gsap.version);

  // gsap.effects 定义可复用的动画效果
  // gsap.globalTimeline 全局时间轴，可以管理多个时间轴
  // gsap.timeline 时间轴，可以管理多个动画
  // gsap.to 定义一个动画
  // gsap.from 定义一个动画，从某个状态开始
  // gsap.fromTo 定义一个动画，从某个状态开始，到某个状态结束
  gsap.registerEffect({
    name: "fadeInMove", // 这个动画效果的名称
    effect: (targets: any, config: any) => { // 定义动画逻辑
      return gsap.to(targets, {
        opacity: 1,
        x: config.x,
        duration: config.duration
      });
    },
    defaults: { x: 0 }, // 设定默认参数
    extendTimeline: true // 允许在 timeline 里使用
  });
  gsap.effects.fadeInMove(".effect", { duration: 1, x: 200 })

  // timeline 里混合 effect 和普通动画
  // const tl = gsap.timeline();
  // tl.effects.fadeInMove(".effect", { duration: 1, x: 200 }) // .box1 先 淡入并移动
  //   .to(".effect", { rotation: 360, duration: 1 }) // 额外的旋转动画
  //   .effects.fadeInMove(".effect2", { duration: 1.5, x: 300 }, "<"); // 与 `.box1` 同时执行，.box2 淡入并移动










  // gsap.ticker 是 GSAP 的帧率管理器，用于在每一帧中执行动画
  // gsap.deltaRatio 基于帧率的动画速度调整，可以让动画在 不同帧率下保持一致的移动速度，避免因为设备刷新率不同而导致动画快慢不一
  let xPos = 0;
  function update() {
    // 在 60fps 下，deltaRatio() 返回 1，xPos += 2 * 1，即每帧移动 2px（正常速度）
    // 在 30fps 下，deltaRatio() 返回 2，xPos += 2 * 2，即每帧移动 4px（补偿帧率降低）
    // 在 120fps 下，deltaRatio() 返回 0.5，xPos += 2 * 0.5，即每帧移动 1px（补偿帧率提高）
    xPos += 2 * gsap.ticker.deltaRatio(); // 调整速度
    gsap.set(".ticker", { x: xPos });
  }
  gsap.ticker.add(update); // 在每一帧后执行一个函数
  setTimeout(() => {
    gsap.ticker.remove(update); // 移除
  }, 5000)



})
</script>

<template>
  <main>
    <div class="box effect" style="opacity: 0;">ticker</div>
    <div class="box ticker">ticker</div>
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
