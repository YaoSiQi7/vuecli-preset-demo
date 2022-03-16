/*
 * @Author: your name
 * @Date: 2020-11-23 10:02:46
 * @LastEditTime: 2020-12-24 10:12:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\api\applicationPrivileges.js
 */
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获得公司，在调表格接口时预调用的
export function sysAppinfoParam (params) {
  return axios.post(`${'/sysAppinfo/param'}`, params);
}
// 获取表格
// export function queryTableList (params) {
//   return axios.post(`${'/amDepartment/queryAppInfo'}`, params);
// }
export function queryTableList (params) {
  return axios.post(`${'/sysAppinfo/query'}`, params);
}
// 预接口访问权限
export function queryInterfaceAuthority (params) {
  return axios.post(`${'/amDepartment/amInterfaceQuery'}`, params);
}
// 接口访问权限
export function interfaceAllocation (params) {
  return axios.post(`${'/amDepartment/interfaceAllocation'}`, params);
}
