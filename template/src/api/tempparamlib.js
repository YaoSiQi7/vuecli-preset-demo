
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取列表
export function getList (params) {
  return axios.post(`${'/params/queryparam'}`, params);
}
// 添加
export function addFunc (params) {
  return axios.post(`${'/params/addparam'}`, params);
}
// 删除
export function deleteFunc (params) {
  return axios.post(`${'/params/deleteparam'}`, params);
}
// 编辑
export function editFunc (params) {
  return axios.post(`${'/params/updateparam'}`, params);
}
// 获取树结构列表
export function getTreeList () {
  return axios.post(`${'/params/queryallsrc'}`);
}
