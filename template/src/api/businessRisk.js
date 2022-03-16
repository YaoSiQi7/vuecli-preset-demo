import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 列表查询接口
export function queryList (params) {
  return axios.post(`${'/merchantRiskMonitor/queryList'}`, params);
}
export function querysList (params) {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    url: `${'/merchantRiskMonitor/queryList'}`,
    data: params
  });
}

// 下载模板
export function exportTemplate () {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/merchantRiskMonitor/exportTemplate'}`
  });
}

// 导出
export function exportQueryList (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/merchantRiskMonitor/exportQueryList'}`,
    data: params
  });
}
// 导出数据接口
export function exportList (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    url: `${'/merchantRiskMonitor/exportQueryList'}`,
    data: params
  });
}
