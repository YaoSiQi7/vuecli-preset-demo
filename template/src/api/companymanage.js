// 引入封装的axios函数
import axios from '@/utils/axios-request.js';
// import axios from 'axios';

let API_ROOT = window.g.address;

export function getList (parms) {
  return axios.post(`${API_ROOT + '/sysCompany/query'}`, parms);
}
export function detailFunc (parms) {
  return axios.post(`${API_ROOT + '/sysCompany/queryByPid'}`, parms);
}
export function addFunc (parms) {
  return axios.post(`${API_ROOT + '/sysCompany/insert'}`, parms);
}
export function editItem (parms) {
  return axios.post(`${API_ROOT + '/sysCompany/update'}`, parms);
}
export function deteleItem (parms) {
  return axios.post(`${API_ROOT + '/sysCompany/deleteById'}`, parms);
}
export function addzcoFunc (parms) {
  return axios.post(`${API_ROOT + '/sysCompany/updateList'}`, parms);
}
// 校验子公司是否可以删除
export function delChecked (parms) {
  return axios.get(`${API_ROOT + '/sysCompany/delChecked/'}` + parms);
}
// 下面的接口是用前后端统一传参格式写的。上面的不是，等待二期启动后，再更改。
/* export function addzcoFunc (params) {
  return nesAxios.post(`${'/sysCompany/updateList'}`, params);
} */
