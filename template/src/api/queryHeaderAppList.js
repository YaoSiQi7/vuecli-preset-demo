import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 获取页面右上角切换应用的列表---------已废弃，不用
export function queryAppListAll (params) {
  return axios.post(`${'/sysAppinfo/info'}`, params);
}

// 获取页面右上角应用列表
export function getAppListAll (params) {
  return axios.post(`${'/login/selectAllApp'}`, params);
}

// 切换了应用调取接口告知后台
export function updateDefaultApp (params) {
  return axios.post(`${'/login/updateDefaultApp'}`, params);
}
