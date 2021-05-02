import Vue from 'vue'
import CarbonComponentsVue from '@carbon/vue'
import App from './App.vue'
import AeSchemaComponent from './components/SchemaComponent.vue'

Vue.config.productionTip = false
Vue.use(CarbonComponentsVue)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
