function animation ({ duration = 1000, from = 0, to, cb }) {
  const speed  = (to -  from) /duration
  const start = Date.now()
  let value = from
  function _run () {
    const now = Date.now()
    if (now - start >= duration) {
      value = to
      cb && cb(value)
      return
    }
    value = from + speed * (now - start)
    cb && cb(value)
    window.requestAnimationFrame(_run)
  }
  _run()
}
