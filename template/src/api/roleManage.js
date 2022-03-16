import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取表格
export function queryTableList (params) {
  return axios.post(`${'/amRole/query'}`, params);
}
// 预分配权限
export function queryTResources (params) {
  return axios.post(`${'/amRole/queryTResources'}`, params);
}
// 分配权限
export function allocation (params) {
  return axios.post(`${'/amRole/allocation'}`, params);
}
// 预添加&预编辑
export function preAddAndEdit (params) {
  return axios.post(`${'/amRole/show'}`, params);
}
// 添加
export function addItem (params) {
  return axios.post(`${'/amRole/insert'}`, params);
}
// 编辑
export function editItem (params) {
  return axios.post(`${'/amRole/update'}`, params);
}
// 删除
export function removeItem (params) {
  return axios.post(`${'/amRole/deleteById'}`, params);
}
