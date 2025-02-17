<script lang="ts" setup>
import { onMounted } from 'vue'
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {





  // demo1
  // gsap.to(".box", {
  //   rotation: 1800, // 旋转 5 圈（360 * 5）
  //   // ease: "power2.out", // // 旋转有缓动效果
  //   scrollTrigger: {
  //     trigger: ".box", // 以 .box 为触发点, 当 .box 进入视口时触发动画
  //     start: "top 80%", // 当 .box 进入视口 80% 位置时开始
  //     end: "+=500px", // 让动画在滚动 500px 之后完成，滚动 500px 旋转 5 圈
  //     scrub: 1, // 平滑滚动，使旋转和滚动同步
  //     pin: true, // 滚动时固定 .box，动画完成后恢复正常
  //     markers: true, // 调试时可见标记，最终去掉
  //   }
  // })




  // demo2
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".box",
      start: "top 80%",
      end: "+=300px", // 1000px 让整个过程平滑
      scrub: 1, // 平滑滚动
      pin: true, // 固定元素，滚动结束后恢复
    }
  });

  // 变化阶段
  tl.to(".box", {
    backgroundImage: "url('/1.jpg')", // 第一张图片
    duration: 1,
    ease: "power2.out"
  })
  .to(".box", {
    backgroundImage: "url('/2.jpg')", // 第二张图片
    duration: 1,
    ease: "power2.out"
  });





})
</script>


<template>
  <div class="container">
    <div class="box" />
  </div>
</template>

<style scoped>
.container {
  padding-top: 100vh;
  width: 100vw;
  height: 2000vh;
}
.box {
  margin: 0 auto;
  width: 100px;
  height: 100px;
  background-color: #2B7FFF;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-image 0.5s ease, transform 0.5s ease;
  background-size: cover;
  background-position: center;
}
</style>
