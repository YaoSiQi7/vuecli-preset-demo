
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// import axios from 'axios';
// let BASE_URL = 'http://192.168.1.111:9080';

export function getTest (params) {
  return axios.post('/api/test', params);
}
// 获取搜索条件的配置
export function searchField (params) {
  return axios.post(`${'/workorder/searchfields'}`, params);
}
// 获取列表表头的配置
export function getTableHeader (params) {
  return axios.post(`${'/workorder/showFields'}`, params);
}
// 获取列表内容
export function getTableData (params) {
  return axios.post(`${'/workorder/query'}`, params);
}
// 获取所有规则接口
export function getAllRules (params) {
  return axios.post(`${'/risklog/getrule'}`, params);
}
// 查询工单日志详情
export function getOrderDetails (params) {
  return axios.post(`${'/workorder/info'}`, params);
}

// 字段固定查询工单日志
export function getOrderTableData (params) {
  return axios.post(`${'/workorder/querylist'}`, params);
}
// 字段固定查询工单日志表格表头
export function getOrderTableHeader (params) {
  return axios.post(`${'/workorder/queryhead'}`, params);
}
