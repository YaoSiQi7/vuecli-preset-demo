import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 查询
export function searchStrategy (params) {
  return axios.post(`${'/warnstrategy/querystrategy'}`, params);
}
// 添加
export function addStrategy (params) {
  return axios.post(`${'/warnstrategy/insertstrategy'}`, params);
}
// 编辑
export function amendStrategy (params) {
  return axios.post(`${'/warnstrategy/updatestrategy'}`, params);
}
// 删除
export function removeStrategy (params) {
  return axios.post(`${'/warnstrategy/deletestrategy'}`, params);
}
// 短信树
export function phoneNoteTreeArray (params) {
  return axios.post(`${'/sysWarnPhoneGroup/querygroup'}`, params);
}
// 邮箱树
export function emailTreeArray (params) {
  return axios.post(`${'/sysWarnEmailGroup/querygroup'}`, params);
}
