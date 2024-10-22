let isComposition = false
const ip = document.querySelector('.input')

function search() {
  console.log(ip.value)
}

ip.addEventListener('input', () => {
  if (isComposition) return
  search()
})
ip.addEventListener('compositionstart', () => {
  isComposition = true
})
ip.addEventListener('compositionend', () => {
  isComposition = false
  search()
})
