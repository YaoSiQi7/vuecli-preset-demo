import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 查询名单集记录
export function queryNameListRecord (params) {
  return axios.post(`${'/listManage/query'}`, params);
}
// 增加名单集记录
export function addNameListRecord (params) {
  return axios.post(`${'/listManage/insert'}`, params);
}
// 修改名单集记录
export function updateNameListRecord (params) {
  return axios.post(`${'/listManage/update'}`, params);
}
// 删除名单集记录
export function deleteNameListRecord (params) {
  return axios.post(`${'/listManage/delete'}`, params);
}
// 名单集类型全量数据
export function queryNameListTypeList (params) {
  return axios.post(`${'/listManage/listType'}`, params);
}
// 修改开关状态
export function toggleSwitch (params) {
  return axios.post(`${'/listManage/states'}`, params);
}
// 获取全量应用信息
export function queryAllAppList (params) {
  return axios.post(`${'/sysAppinfo/info'}`, params);
}
// 从系统参数库查询参数
export function findsysParams (params) {
  return axios.post(`${'/sysParam/findsysparams'}`, params);
}
// 查询全量业务变量字段值
export function queryallfield (params) {
  return axios.post(`${'/businessVariableLibrary/queryallfield'}`, params);
}
// 批量添加匹配字段的引用记录
export function addBatchRecords (params) {
  return axios.post(`${'/ruleset/addbatchrecords'}`, params);
}
// 批量删除匹配字段的引用记录
export function delBatchRecords (params) {
  return axios.post(`${'/ruleset/delbatchrecords'}`, params);
}
// 获取适用范围
export function getApplyScope (params) {
  return axios.post(`${'/listManage/getApplyScope'}`, params);
}
// 查询应用或者应用下的交易类型
export function getAppInfoOrTradeType (params) {
  return axios.post(`${'/sysAppinfo/getAppInfoOrTradeType'}`, params);
}

// 查询名单集编辑或删除 安全模式，调试模式下是否可用
export function getQueryRefRecordBySourceId (params) {
  return axios.post(`${'/refrecord/queryRefRecordBySourceId'}`, params);
}
