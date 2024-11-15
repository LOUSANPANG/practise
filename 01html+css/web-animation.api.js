const ball = document.querySelector('.ball')

function move() {
  ball.getAnimations().forEach(animation => animation.cancel())

  ball.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(300px)' },
  ], {
    duration: 1000,
    iterations: Infinity,
    direction: 'alternate',
    easing: 'ease-in-out'
  })
}
