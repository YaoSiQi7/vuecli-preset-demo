import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取列表树
export function queryTreeList (params) {
  return axios.post(`${'/amResources/query'}`, params);
}
// 获取表格
export function queryTableList (params) {
  return axios.post(`${'/amResources/queryByPid'}`, params);
}
// 预添加
export function preAdds (params) {
  return axios.post(`${'/amResources/showAdd'}`, params);
}
// 添加
export function addItem (params) {
  return axios.post(`${'/amResources/insert'}`, params);
}
// 预编辑
export function preEdits (params) {
  return axios.post(`${'/amResources/showUpdate'}`, params);
}
// 编辑
export function editItem (params) {
  return axios.post(`${'/amResources/update'}`, params);
}
// 删除
export function removeItem (params) {
  return axios.post(`${'/amResources/deleteById'}`, params);
}
