
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 核查趋势
// import axios from 'axios';
// 进入页面获取数据
export async function getAppIdData (params) {
  return axios.post(`/verification/checkcount`, params);
}
// 核查单数量导出
export function exportHCDSLQS (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/verify/exportHCDSLQS'}`,
    data: params
  });
}
// 核查单结果分布导出
export function exportHCDJGFB (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/verify/exportHCDJGFB'}`,
    data: params
  });
}
// 案件类型分布导出
export function exportAJLXFB (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/verify/exportAJLXFB'}`,
    data: params
  });
}
// 录黑数量趋势导出
export function exportLHSLQS (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/verify/exportLHSLQS'}`,
    data: params
  });
}
// 代办任务导出
export function exportDBSX (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/verify/exportDBSX'}`,
    data: params
  });
}
