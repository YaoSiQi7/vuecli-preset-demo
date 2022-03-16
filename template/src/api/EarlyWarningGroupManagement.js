import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 手机号---添加分组
export function addGroup (params) {
  return axios.post(`${'/sysWarnPhoneGroup/insert'}`, params);
}
// 手机号---查询分组
export function getGroup (params) {
  return axios.post(`${'/sysWarnPhoneGroup/query'}`, params);
}
// 手机号---编辑分组
export function editGroup (params) {
  return axios.post(`${'/sysWarnPhoneGroup/update'}`, params);
}
// 手机号---删除分组
export function deteleGroup (params) {
  return axios.post(`${'/sysWarnPhoneGroup/deleteById'}`, params);
}
// 手机号---添加组信息
export function addPeople (params) {
  return axios.post(`${'/sysWarnPhone/insert'}`, params);
}
// 手机号---查询组信息
export function getPeople (params) {
  return axios.post(`${'/sysWarnPhone/query'}`, params);
}
// 手机号---编辑组信息
export function editPeople (params) {
  return axios.post(`${'/sysWarnPhone/update'}`, params);
}
// 手机号---删除组信息
export function detelePeople (params) {
  return axios.post(`${'/sysWarnPhone/deleteById'}`, params);
}
// 邮箱---添加分组
export function addEmailGroup (params) {
  return axios.post(`${'/sysWarnEmailGroup/insert'}`, params);
}
// 邮箱---查询分组
export function getEmailGroup (params) {
  return axios.post(`${'/sysWarnEmailGroup/query'}`, params);
}
// 邮箱---编辑分组
export function editEmailGroup (params) {
  return axios.post(`${'/sysWarnEmailGroup/update'}`, params);
}
// 邮箱---删除分组
export function deteleEmailGroup (params) {
  return axios.post(`${'/sysWarnEmailGroup/deleteById'}`, params);
}
// 邮箱---添加组信息
export function addEmailPeople (params) {
  return axios.post(`${'/sysWarnEmail/insert'}`, params);
}
// 邮箱---查询组信息
export function getEmailPeople (params) {
  return axios.post(`${'/sysWarnEmail/query'}`, params);
}
// 邮箱---编辑组信息
export function editEmailPeople (params) {
  return axios.post(`${'/sysWarnEmail/update'}`, params);
}
// 邮箱---删除组信息
export function deteleEmailPeople (params) {
  return axios.post(`${'/sysWarnEmail/deleteById'}`, params);
}
// 手机号与邮箱---查询手机号或者邮箱分组的树结构（传空为取所有数据）
export function getEmailOrPhoneTree (params) {
  return axios.post(`${'/amUser/findPhoneAndEmailByUserName'}`, params);
}
