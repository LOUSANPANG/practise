import './public-path'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'


function render(props = {}) {
    const { container } = props;

    createApp(App)
    .use(router)
    .mount(container ? container.querySelector('#app') : '#app')
}

if (!window.__POWERED_BY_QIANKUN__) {
    render();
  }

  export async function bootstrap() {
    console.log('22222 bootstrap');
  }
  export async function mount(props) {
    console.log('22222 mount', props);
    render(props);

    props.onGlobalStateChange((state, prev) => {
      console.log(22222, state, prev);
    })
    props.setGlobalState({ count: 2 })
  }
  export async function unmount() {
    console.log('22222 unmount');
    createApp(App).unmount()
  }