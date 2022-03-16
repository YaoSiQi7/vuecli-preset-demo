
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// import axios from 'axios';
// let BASE_URL = 'http://192.168.1.111:9080';
// 获取搜索条件的配置
export function searchField (params) {
  return axios.post(`${'/risklog/searchfieldinterface'}`, params);
}
// 获取列表表头的配置
export function getTableHeader (params) {
  return axios.post(`${'/risklog/risklogfromfield'}`, params);
}
// 获取列表内容
export function getTableData (params) {
  return axios.post(`${'/risklog/getrisk'}`, params);
}
// 获取所有规则接口
export function getAllRules (params) {
  return axios.post(`${'/risklog/getrule'}`, params);
}
// 获取所有规则接口
export function searchTableContentData (params) {
  return axios.post(`${'/risklog/getriskinfo'}`, params);
}

// 导出数据接口excel
export function exportLogData (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/risklog/export'}`,
    data: params
  });
}
// 导出数据接口csv
export function exportLogDataCSV (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/risklog/exportcsv'}`,
    data: params
  });
}

// 批量业务列表查询
export function risklogBatchServer (params) {
  return axios.post(`${'/risklog/batchServer'}`, params);
}

// 批量业务详情
export function risklogBatchServerListInfo (params) {
  return axios.post(`${'/risklog/batchServerListInfo'}`, params);
}
