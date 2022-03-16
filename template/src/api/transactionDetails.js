import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 账户风险监控：交易汇总信息
export function findaccounttradedetail (params) {
  return axios.post(`${'/accountRiskMonitor/findaccounttradedetail'}`, params);
}

// 企业风险监控：历史评分情况
export function findenterprisetradedetail (params) {
  return axios.post(`${'/enterpriseRiskMonitor/findenterprisetradedetail'}`, params);
}

// 商户风险监控：历史评分情况
export function findmerchanttradedetail (params) {
  return axios.post(`${'/merchantRiskMonitor/findmerchanttradedetail'}`, params);
}

// 获取所有交易类型
export async function tradeTypes (params) {
  return axios.post(`${'/sysAppinfo/tradeTypes'}`, params);
}
// 获取所有命中规则接口
export function getAllRules (params) {
  return axios.post(`${'/risklog/getrule'}`, params);
}
// 获取所有命中规则接口
export function getAllRiskControl (params) {
  return axios.post(`${'/sysParam/findsysparams'}`, params);
}
// 列表查询
export function findriskoplog (params) {
  return axios.post(`${'/accountRiskMonitor/findriskoplog'}`, params);
}
// 列表详情查询
export function riskoplogdetail (params) {
  return axios.post(`${'/risklog/riskoplogdetail'}`, params);
}
// 黑名单功能中的获取应用
export function getAppInfoOrTradeType (params) {
  return axios.post(`${'/sysAppinfo/getAppInfoOrTradeType'}`, params);
}
// 获取黑名单集
export function getBlankListNames (params) {
  return axios.post(`${'/associatemap/getBlankListNames'}`, params);
}
// 加入黑名单的保存
export function addNameData (params) {
  return axios.post(`${'/listData/addNameData'}`, params);
}
