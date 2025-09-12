import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'MyButton',
  render() {
    return h('button', {
      onClick: () => {
        console.log('click')
      },
    }, 'MyButton')
  }
})
