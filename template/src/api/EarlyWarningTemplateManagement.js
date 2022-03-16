import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 查看是否有引用记录
export function queryIsrecord (params) {
  return axios.post(`${'/ruleset/isrefrecord'}`, params);
}
// 删除引用记录
export function delrecord (params) {
  return axios.post(`${'/ruleset/delrecwithcond'}`, params);
}
// 添加引用记录
export function addRecord (params) {
  return axios.post(`${'/ruleset/addrecord'}`, params);
}
// 查询短信
export function searchNote (params) {
  return axios.post(`${'/sysWarnSmsTemplate/query'}`, params);
}
// 添加短信
export function addNote (params) {
  return axios.post(`${'/sysWarnSmsTemplate/insert'}`, params);
}
// 编辑短信
export function amendNote (params) {
  return axios.post(`${'/sysWarnSmsTemplate/update'}`, params);
}
// 删除短信
export function removeNote (params) {
  return axios.post(`${'/sysWarnSmsTemplate/deleteById'}`, params);
}
// 查询邮件
export function searchEmail (params) {
  return axios.post(`${'/sysWarnEmailTemplate/query'}`, params);
}
// 添加邮件
export function addEmail (params) {
  return axios.post(`${'/sysWarnEmailTemplate/insert'}`, params);
}
// 编辑邮件
export function amendEmail (params) {
  return axios.post(`${'/sysWarnEmailTemplate/update'}`, params);
}
// 删除邮件
export function removeEmail (params) {
  return axios.post(`${'/sysWarnEmailTemplate/deleteById'}`, params);
}
