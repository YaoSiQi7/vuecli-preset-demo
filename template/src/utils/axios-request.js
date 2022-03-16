import axios from 'axios';
import router from '../router';
import qs from 'qs';
import Vue from 'vue';
import bus from './bus';
Vue.prototype.$bus = bus;

let pendingAjax = [];
const fastClickMsg = '数据重复请求，请稍后';
const CancelToken = axios.CancelToken;
const removePendingAjax = (url, type) => {
  console.log(url);
  const index = pendingAjax.findIndex(i => i.url === url);
  if (index > -1 && url.indexOf('/sysAppinfo/tradeTypes') === -1) {
    type === 'req' && pendingAjax[index].c(fastClickMsg);
    pendingAjax.splice(index, 1);
  }
};

// 确保session数据一致
// request header 新增样例:
// Cookie: JSESSIONID=6A89AFCE6D380FF9C007C89D45F4A037
axios.defaults.withCredentials = true;
// 获取全局注册的eventBus方法
const eventBus = new Vue().$bus;
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */

const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
};

// 创建axios实例
const axiosService = axios.create({
  crossDomain: true,
  baseURL: window.g.address,
  timeout: window.g.timeoutConfig,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

if (window.g.isSSO === true) {
  axiosService.defaults.headers['OutIP'] = window.returnCitySN.cip;
}
// axiosService.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// request拦截器，对请求参数进行处理; 如果存在token，则在请求中携带token
axiosService.interceptors.request.use(
  config => {
    let url = config.url;
    if (config.method === 'get') {
      url = url + JSON.stringify(config.params);
    }
    if (config.method === 'post') {
      url = url + JSON.stringify(config.data);
    };
    // removePendingAjax(url, 'req'); 暂时关闭一下
    config.cancelToken = new CancelToken(c => {
      pendingAjax.push({
        url,
        c
      });
    });

    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    let token;
    if (localStorage.getItem('token')) {
      token = JSON.parse(localStorage.getItem('token'));
    }
    token && (config.headers.Authorization = token);
    let noQSUrl = ['/sysSettiog/modifyset', '/effectRisk/saveEffectRiskWeight'];
    if (config.headers['Content-Type'] !== 'multipart/form-data;charset=UTF-8' && !noQSUrl.includes(config.url)) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    // 处理请求错
    Promise.reject(error);
  }
);
// http响应拦截器
axiosService.interceptors.response.use(
  res => {
    if (res.request.responseType === 'blob') {
      if (res.data.type === 'application/json') {
        const reader = new FileReader();
        let blob = new Blob([res.data]);
        reader.readAsText(blob, 'utf-8');
        reader.onload = function () {
          const { msg } = JSON.parse(reader.result);
          if (msg) {
            eventBus.$emit('snackBar', {
              show: true,
              msg: msg
            });
          }
        };
        return Promise.reject(res);
      } else {
        return res;
      }
    }
    // removePending(res.config);
    let code = res.data.code;
    let msg = null;
    if (res && code) {
      switch (code) {
        case -1:
          msg = res.data.msg;
          break;
        case 200:
          break;
        case 400:
          msg = `请求错误(${code}), 请重新申请`;
          break;
        case 401:
          msg = `登录错误(${code}), 请重新登录`;
          localStorage.removeItem('token');
          setTimeout(() => {
            toLogin();
          }, 1000);
          break;
        case 56000:
          // 登录过期，重新登录
          localStorage.removeItem('token');
          setTimeout(() => {
            toLogin();
          }, 1000);
          break;
        case 404:
          msg = `请求的资源不存在(${code})`;
          break;
        case 408:
          msg = `请求超时(${code})`;
          break;
        case 500:
          msg = `服务器错误(${code}), 请重启软件或切换功能`;
          break;
        case 403:
        case 501:
        case 502:
        case 503:
        case 504:
        case 505:
        case 51000:
        case 52000:
        case 53000:
        case 54000:
        case 55000:
        case 50002:
        case 50011:
        case 50012:
        case 50021:
        case 50022:
        case 50023:
        case 50031:
        case 50032:
        case 50033:
        case 50041:
        case 50042:
        case 50051:
        case 50061:
        case 50062:
        case 50071:
          break;
        case 90001:
          msg = res.data.msg;
          break;
        case 93004:
          msg = res.data.msg;
          break;
        default:
          msg = '网络连接出错！';
          return Promise.reject(res);
      }
      // 如果msg不为空，则报错
      removePendingAjax(res.config.url, 'resp');
      if (msg) {
        eventBus.$emit('snackBar', {
          show: true,
          msg: msg
        });
      }
      return res;
    } else {
      msg = '连接服务器失败, 请退出重试!';
    }
  },
  error => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    const { response } = error;
    // 判断error的状态码，并将对应信息弹框报错
    let msg = null;
    if (error && error.response) {
      let status = response.status;
      switch (status) {
        case 400:
          msg = `请求错误(${status}), 请重新申请`;
          break;
        case 401:
          msg = `登录错误(${status}), 请重新登录`;
          toLogin();
          break;
        case 403:
          localStorage.removeItem('token');
          setTimeout(() => {
            toLogin();
          }, 1000);
          msg = `登录过期, 请重新登录(${status})`;
          break;
        case 404:
          msg = `请求的资源不存在(${status})`;
          break;
        case 408:
          msg = `请求超时(${status})`;
          break;
        case 500:
          msg = `操作失败(${status})`;
          break;
        case 501:
          msg = `服务未实现(${status})`;
          break;
        case 502:
          msg = `网络错误(${status})`;
          break;
        case 503:
          msg = `服务不可用(${status})`;
          break;
        case 504:
          msg = `网络超时(${status})`;
          break;
        case 505:
          msg = `HTTP版本不受支持(${status})`;
          break;
        default:
          msg = '网络连接出错！';
      }
    } else {
      if (error.message === '数据请求中，请稍后' || error.message === '数据重复请求，请稍后') {
        msg = null;
      } else {
        msg = '请求超时, 请稍后重试!';
      }
    }
    if (msg) {
      // 监听报错
      eventBus.$emit('snackBar', {
        show: true,
        msg: msg
      });
    }
    return Promise.reject(error);
  });
export default axiosService;
