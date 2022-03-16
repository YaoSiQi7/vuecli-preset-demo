import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 新建
export function addOperateLog (params) {
  return axios.post(`${'/log/addOperateLog'}`, params);
}
