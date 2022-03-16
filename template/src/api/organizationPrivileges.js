import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取下拉树
export function queryTreeSelectList () {
  return axios.post(`${'/amDepartment/initQuery'}`);
}
// 获取列表树
export function queryTreeList (params) {
  return axios.post(`${'/amDepartment/query'}`, params);
}
// 获取表格
export function queryTableList (params) {
  return axios.post(`${'/amDepartment/queryByPid'}`, params);
}
// 预授权
export function prePrivilege (params) {
  return axios.post(`${'/amDepartment/queryTDepartmentRoleAndTDepartmentAppinfo'}`, params);
}
// 授权分配
export function allocation (params) {
  return axios.post(`${'/amDepartment/allocation'}`, params);
}
