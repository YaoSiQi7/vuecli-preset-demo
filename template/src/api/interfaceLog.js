import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取下拉框参数
export function querySelect (params) {
  return axios.post(`${'/apiLog/apiInit'}`, params);
}
// 获取表格
export function queryTableList (params) {
  return axios.post(`${'/apiLog/getrisk'}`, params);
}
// 查看参数
export function seeParams (params) {
  return axios.post(`${'/apiLog/getParams'}`, params);
}
// 查看结果
export function seeResult (params) {
  return axios.post(`${'/apiLog/getResult'}`, params);
}

// 导出数据接口excel/csv
export function exportLogData (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/apiLog/export'}`,
    data: params
  });
}
