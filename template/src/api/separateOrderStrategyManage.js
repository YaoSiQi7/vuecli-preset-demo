import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 添加
export function addItem (params) {
  return axios.post(`${'/autoallocationvoucherflow/add'}`, params);
}
// 编辑
export function editItem (params) {
  return axios.post(`${'/autoallocationvoucherflow/update'}`, params);
}
// 删除
export function deleteItem (params) {
  return axios.post(`${'/autoallocationvoucherflow/del'}`, params);
}
// 查询
export const getList = params => {
  return axios({
    url: '/autoallocationvoucherflow/search',
    method: 'get',
    params
  });
};
