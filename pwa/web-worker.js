let num = 0

for (let index = 0; index < 100000000; index++) {
  num+=index
}

this.postMessage({
  num: num
})