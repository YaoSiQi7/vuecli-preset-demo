/*
 * @Author: your name
 * @Date: 2021-02-07 01:52:26
 * @LastEditTime: 2021-03-30 10:49:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\main.js
 */
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '../static/css/base.css';
import echarts from 'echarts';
import '../node_modules/echarts/map/js/china.js'; // 引入中国地图数据
import { Transfer, DatePicker } from 'view-design';
import 'view-design/dist/styles/iview.css';
import VueParticles from 'vue-particles';
import bus from './utils/bus';
import permission from './utils/permission';
import provinecs from './utils/city'; // 各省地图数据、、、、、、
Vue.prototype.$bus = bus;

Vue.use(VueParticles);

Vue.use(Transfer);
Vue.use(DatePicker);
Vue.use(permission); // 按钮权限功能
Vue.use(provinecs);// 各省地图数据、、、、、
Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.filter('ellipsis', function (value, num = 8) {
  if (!value) return '';
  /* if(/[\u4E00-\u9FA5\uFE30-\uFFA0]/.test(value)) {
      if (value.length > num/2) {
        // return value.slice(0,Math.floor(num/2)) + '...' //  向下取整，（比如2.4== 2）
        return value.slice(0,Math.ceil(num/2)) + '...'     //  向3取整，（比如2.4== 3）
      }
    } else {
      if (value.length > num) {
        return value.slice(0,num) + '...'
      }
    } */
  if (value.length > num) {
    return value.slice(0, num) + '...';
  }
  return value;
});

let keyStr = 'ABCDEFGHIJKLMNOP' + 'QRSTUVWXYZabcdef' + 'ghijklmnopqrstuv' + 'wxyz0123456789+/' + '=';
Vue.prototype.encode = function (input) {
  var output = '';
  let i = 0;
  do {
    let chr1 = ''; let chr2 = ''; let chr3 = '';
    let enc1 = ''; let enc2 = ''; let enc3 = ''; let enc4 = '';
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
  } while (i < input.length);
  return output;
};

new Vue({
  router: router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
