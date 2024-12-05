import { ref } from 'vue'

export function useDefer() {
  const count  = ref(0)

  function update() {
    count.value++
    requestAnimationFrame(update)
  }
  update()

  return function(n) {
    return count.value >= n
  }
}
