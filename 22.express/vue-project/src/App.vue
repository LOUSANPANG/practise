<script lang="ts" setup>
import { ref, computed, onUnmounted } from 'vue';

const loading = ref(false);
const elapsed = ref(0);
const result = ref(null);
const error = ref(null);

let timerId = null;
let controller = null;
let timeoutId = null;

function startElapsed() {
  elapsed.value = 0;
  timerId = setInterval(() => { elapsed.value += 1; }, 1000);
}
function stopElapsed() {
  if (timerId) { clearInterval(timerId); timerId = null; }
}

async function callDelay() {
  loading.value = true;
  result.value = null;
  error.value = null;

  // 可取消的 fetch
  controller = new AbortController();
  const signal = controller.signal;

  // 可选：客户端超时时间（例如 20s），避免 fetch 无限制等待
  const clientTimeoutMs = 20000;
  timeoutId = setTimeout(() => {
    controller.abort(); // 超时则中止
  }, clientTimeoutMs);

  startElapsed();

  try {
    const resp = await fetch('http://localhost:3000/delay?ms=10000', { method: 'GET', signal });
    // fetch 被 abort 会抛出 DOMException 名为 'AbortError'
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    result.value = data;
  } catch (err) {
    if (err && err.name === 'AbortError') {
      error.value = '请求已取消或超时';
    } else {
      error.value = err.message || String(err);
    }
  } finally {
    loading.value = false;
    stopElapsed();
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    controller = null;
  }
}

function cancel() {
  if (controller) controller.abort();
}

onUnmounted(() => {
  stopElapsed();
  if (controller) controller.abort();
  if (timeoutId) clearTimeout(timeoutId);
});

const resultText = computed(() => result.value ? JSON.stringify(result.value, null, 2) : '');
</script>


<template>
  <div style="font-family: Arial; max-width:650px;">
    <input type="text">
    <button @click="callDelay" :disabled="loading">请求后端（10s 模拟）</button>
    <button v-if="loading" @click="cancel">取消请求</button>

    <div style="margin-top:12px;">
      <div v-if="loading">请求中... 已等待 {{ elapsed }} s</div>
      <pre v-if="result" style="background:#f6f8fa;padding:10px;border-radius:6px">{{ resultText }}</pre>
      <div v-if="error" style="color:#c00">{{ error }}</div>
    </div>
  </div>
</template>
