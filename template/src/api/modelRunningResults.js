import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 模型结果列表
export function mlModelList (params) {
  return axios.post(`${'/mlModel/mlModelList'}`, params);
}
// 模型结果集合列表
export function mlModeRestList (params) {
  return axios.post(`${'/mlModel/mlModeRestList'}`, params);
}
// 模型获取指标信息
export function targetByModel (params) {
  return axios.post(`${'/mlModel/targetByModel'}`, params);
}
// 模型获取模型信息
export function modelByApp (params) {
  return axios.post(`${'/mlModel/modelByApp'}`, params);
}
// 获取图表数据
export function queryEntityListBrokenLine (params) {
  return axios.post(`${'/Card/queryEntityListBrokenLine'}`, params);
}
// 获取基本信息数据
export function showEntityList (params) {
  return axios.post(`${'/Card/showEntityList'}`, params);
}
// 应用模型对应团伙信息
export function nodeByAppAndModel (params) {
  return axios.post(`${'/mlModel/nodeByAppAndModel'}`, params);
}
// 实体查询当前用户下授权应用
export function getAppInfoOrTradeType (params) {
  return axios.post(`${'/sysAppinfo/getAppInfoOrTradeType'}`, params);
}
// 查询黑名单集
export function getBlackName (params) {
  return axios.post(`${'/listManage/selectNameByParamAppId'}`, params);
}
// 实体批量加黑
export function mlBatchAddBlack (params) {
  return axios.post(`${'/mlBoard/mlBatchAddBlack'}`, params);
}
// 实体批量移除黑名单
export function mlBatchDelBlack (params) {
  return axios.post(`${'/mlBoard/mlBatchDelBlack'}`, params);
}
