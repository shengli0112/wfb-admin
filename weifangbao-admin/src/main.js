import Vue from 'vue'
import Element from 'element-ui'
import App from '@/App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import '@/icons'
import '@/element-ui/theme/index.css'
import 'element-theme-chalk/lib/input.css';
// import 'element-theme-chalk/lib/select.css';
import '@/assets/scss/aui.scss'
import '@/common.css'
import http from '@/utils/request'
import { hasPermission } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'NBGG0NtbzhSLZiLHWi79bNQbuTnbjtZ9'
})
Vue.config.productionTip = false

Vue.use(Element, {
  size: 'default',
  i18n: (key, value) => i18n.t(key, value)
})

// 挂载全局
Vue.prototype.$http = http
Vue.prototype.$hasPermission = hasPermission

// 保存整站vuex本地储存初始状态
console.log(store);

window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
