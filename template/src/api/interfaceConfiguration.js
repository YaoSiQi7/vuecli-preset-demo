import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取表格
export function queryTableList (params) {
  return axios.post(`${'/amInterface/query'}`, params);
}
// 添加
export function addItem (params) {
  return axios.post(`${'/amInterface/insert'}`, params);
}
// 编辑
export function editItem (params) {
  return axios.post(`${'/amInterface/update'}`, params);
}
// 删除
export function removeItem (params) {
  return axios.post(`${'/amInterface/deleteById'}`, params);
}
