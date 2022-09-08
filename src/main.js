import Vue from 'vue'
import Playground from './playground.vue'

// import * as lucidUI from '@dingdaoos/lucid-ui'
import lucidIcons from '@dingdaoos/lucid-icons'


// Vue.use(lucidUI)
Vue.use(lucidIcons)

Playground.install = function (vm, options = {}) {
  vm.component(this.name, this)
}

new Vue({
  render: h => h(Playground)
}).$mount('#app')

export default Playground
