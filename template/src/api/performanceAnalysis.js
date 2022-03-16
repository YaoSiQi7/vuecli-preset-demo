import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 企业风险监控基本信息
export function enterpriseRiskMonitorQueryBaseInfo (params) {
  return axios.post(`${'/enterpriseRiskMonitor/queryBaseInfo'}`, params);
}

// 查询企业风险信息
export function enterpriseRiskMonitorRiskInfo (params) {
  return axios.post(`${'/enterpriseRiskMonitor/riskInfo'}`, params);
}

// 企业环节命中规则
export function enterpriseRiskMonitorLinkHitRule (params) {
  return axios.post(`${'/enterpriseRiskMonitor/linkHitRule'}`, params);
}

// 商户风险监控基本信息
export function merchantRiskMonitorQueryBaseInfo (params) {
  return axios.post(`${'/merchantRiskMonitor/queryBaseInfo'}`, params);
}

// 查询商户风险信息
export function merchantRiskMonitorRiskInfo (params) {
  return axios.post(`${'/merchantRiskMonitor/riskInfo'}`, params);
}

// 商户环节命中规则
export function merchantRiskMonitorLinkHitRule (params) {
  return axios.post(`${'/merchantRiskMonitor/linkHitRule'}`, params);
}

// 账户风险监控基本信息
export function accountRiskMonitorQueryBaseInfo (params) {
  return axios.post(`${'/accountRiskMonitor/queryBaseInfo'}`, params);
}

// 查询账户风险信息
export function accountRiskMonitorRiskInfo (params) {
  return axios.post(`${'/accountRiskMonitor/riskInfo'}`, params);
}

// 账户环节命中规则
export function accountRiskMonitorLinkHitRule (params) {
  return axios.post(`${'/accountRiskMonitor/linkHitRule'}`, params);
}

// 获取当前用户关联的应用id接口
export function getAppInfoOrTradeType (params) {
  return axios.post(`${'/sysAppinfo/getAppInfoOrTradeType'}`, params);
}

// 获取黑名单集接口
export function getBlankListNames (params) {
  return axios.post(`${'/associatemap/getBlankListNames'}`, params);
}

// 批量加黑接口
export function batchInsertNameData (params) {
  return axios.post(`${'/listData/addNameData'}`, params);
}

// 获取风险等级划分-账户
export function AccoGetMaxScoreGroupByRiskLevel (params) {
  return axios.post(`${'/accountRiskMonitor/getMaxScoreGroupByRiskLevel'}`, params);
}

// 获取风险等级划分-企业
export function EntGetMaxScoreGroupByRiskLevel (params) {
  return axios.post(`${'/enterpriseRiskMonitor/getMaxScoreGroupByRiskLevel'}`, params);
}

// 获取风险等级划分-商户
export function MerGetMaxScoreGroupByRiskLevel (params) {
  return axios.post(`${'/merchantRiskMonitor/getMaxScoreGroupByRiskLevel'}`, params);
}
