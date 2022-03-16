
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 核查效率
// import axios from 'axios';
// let BASE_URL = 'http://192.168.1.111:9080';
// 获取所有信息
export function getData (params) {
  return axios.post(`${'/verification/efficiency'}`, params);
}
// 获取单组下所有核查人员
export function getAllUsersList (params) {
  return axios.post(`${'/group/query/allUsers/noPage'}`, params);
}
// 获取所有组下所有核查人员
export function getAllGroupAllUsersList (params) {
  return axios.post(`${'/group/query/group/users'}`, params);
}
// 总任务数量Top5导出
export function exportZRWSLTop5 (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/verify/exportZRWSLTop5'}`,
    data: params
  });
}
// 已处理任务数量Top5导出
export function exportLYCLRWSLTop5 (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/verify/exportLYCLRWSLTop5'}`,
    data: params
  });
}
// 核查效率数据明细导出
export function exportSJMX (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/verify/exportSJMX'}`,
    data: params
  });
}
