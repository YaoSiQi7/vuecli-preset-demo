import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 账户风险监控：历史评分情况
export function findAccoHistoryScore (params) {
  return axios.post(`${'/accountRiskMonitor/findAccoHistoryScore'}`, params);
}
// 账户风险监控：风险标签
export function findAccoRiskLabel (params) {
  return axios.post(`${'/accountRiskMonitor/findAccoRiskLabel'}`, params);
}
// 账户风险监控：交易风险
export function findAccoTransactionRiskStat (params) {
  return axios.post(`${'/accountRiskMonitor/findAccoTransactionRiskStat'}`, params);
}

// 企业风险监控：历史评分情况
export function findEntHistoryScore (params) {
  return axios.post(`${'/enterpriseRiskMonitor/findEntHistoryScore'}`, params);
}
// 企业风险监控：风险标签
export function findEntRiskLabel (params) {
  return axios.post(`${'/enterpriseRiskMonitor/findEntRiskLabel'}`, params);
}
// 企业风险监控：交易风险
export function findEntTransactionRiskStat (params) {
  return axios.post(`${'/enterpriseRiskMonitor/findEntTransactionRiskStat'}`, params);
}

// 商户风险监控：历史评分情况
export function findMerHistoryScore (params) {
  return axios.post(`${'/merchantRiskMonitor/findMerHistoryScore'}`, params);
}
// 商户风险监控：风险标签
export function findMerRiskLabel (params) {
  return axios.post(`${'/merchantRiskMonitor/findMerRiskLabel'}`, params);
}
// 商户风险监控：交易风险
export function findMerTransactionRiskStat (params) {
  return axios.post(`${'/merchantRiskMonitor/findMerTransactionRiskStat'}`, params);
}
// 获取所有交易类型
export async function tradeTypes (params) {
  return axios.post(`${'/sysAppinfo/tradeTypes'}`, params);
}
