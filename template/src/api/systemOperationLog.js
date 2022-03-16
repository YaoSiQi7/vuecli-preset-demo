import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取表格
export function searchListData (params) {
  return axios.post(`${'/log/queryOperateLog'}`, params);
}

// 导出数据接口excel/csv
export function exportLogData (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/log/export'}`,
    data: params
  });
}
