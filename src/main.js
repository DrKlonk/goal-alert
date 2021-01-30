import Vue from 'vue'
import VueMaterial from 'vue-material'
import App from './App.vue'

import 'vue-material/dist/vue-material.min.css'
import './registerServiceWorker'

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('./worker.js', {
//     scope: '/'
//   }).then(() => console.log('SW regged!'))
// }

Vue.config.productionTip = false

Vue.use(VueMaterial)

new Vue({
  render: h => h(App)
}).$mount('#app')
