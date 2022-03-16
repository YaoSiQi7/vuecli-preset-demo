/*
  此文件为示例。
  对接口进行统一管理
  post参数放在data内，get参数放在params内
  在组件内使用: (async await语法)
    import { userLogin } from '@/utils/axios-api' // 引入对应方法
    async login() {
      await userLogin(data);
      console.log(data);
    }
*/
// 引入封装的axios函数
import axios from '@/utils/axios-request.js';

// 修改密码
export function editItem (params) {
  return axios.post(`${'/amUser/updatePwd'}`, params);
}

// 登录接口
export function userLogin (params) {
  return axios.post(`${'/login/affirm'}`, params);
}

// 退出登录接口
export function userLoginOut (params) {
  return axios.post(`${'/login/logOut'}`, params);
}

// 获取密码复杂度配置
export function getPwdPolicy (params) {
  return axios.post(`${'/login/getPwdPolicy'}`, params);
}
