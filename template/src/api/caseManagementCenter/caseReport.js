/*
  author：古雪瑞
  updateTime：2020-04-15
*/
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取交易类型list
export function queryTradeType (params) {
  return axios.post(`${'/approval/queryTradeTypeList'}`, params);
}

// 从系统参数库查询参数
export function findsysParams (params) {
  return axios.post(`${'/sysParam/findsysparams'}`, params);
}

// 查询获取列表
export function queryDataList (params) {
  return axios.post(`${'/approval/selecteventtoreport'}`, params);
}

// 添加事件
export function addCaseReport (params) {
  return axios.post(`${'/approval/createeventtoreport'}`, params);
}

// 编辑事件
export function updateCaseReport (params) {
  return axios.post(`${'/approval/updateeventtoreport'}`, params);
}

// 删除事件
export function delCaseReport (params) {
  return axios.post(`${'/approval/deleteeventtoreport'}`, params);
}

// 批量事件提报
export function batchCaseReport (params) {
  return axios.post(`${'/approval/batcheventtoreport'}`, params);
}
// ------
// 事件提报展示列表
export function getEventsReportedList (params) {
  return axios.post(`${'/eventsReported/query'}`, params);
}

// 事件提报详情---获取风控日志列表
export function getEventsRiskList (params) {
  return axios.post(`${'/eventsReported/getRisk'}`, params);
}

// 获取关联交易
export function getRelevanceId (params) {
  return axios.post(`${'/eventsReported/getRelevance'}`, params);
}

// 事件提报添加保存
export function saveEventsReported (params) {
  return axios.post(`${'/eventsReported/add'}`, params);
}

// 事件提报编辑
export function editEventsReported (params) {
  return axios.post(`${'/eventsReported/showEdit'}`, params);
}
// 事件提报编辑
export function updateEventsReported (params) {
  return axios.post(`${'/eventsReported/edit'}`, params);
}
// 删除／批量删除事件提报
export function removeCaseReport (params) {
  return axios.post(`${'/eventsReported/remove'}`, params);
}

// 批量提报事件提报
export function submitCaseReport (params) {
  return axios.post(`${'/eventsReported/submit'}`, params);
}

// 风控日志列表查询详情
export function riskShowDataDetail (params) {
  return axios.post(`${'/approval/showDataDetail'}`, params);
}

// 下载附件
export function downloadFile (params) {
  // return axios.post(`${'/approval/downloadFile'}`, params);
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/approval/downloadFile'}`,
    data: params
  });
}

// 风控平台-交易类型查询
export function queryIfdsOptypeList (params) {
  return axios.post(`${'/approval/queryIfdsOptypeList'}`, params);
}
