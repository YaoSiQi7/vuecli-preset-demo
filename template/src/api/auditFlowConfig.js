import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 添加
export function addItem (params) {
  return axios.post(`${'/autoauditflow/add'}`, params);
}
// 编辑
export function editItem (params) {
  return axios.post(`${'/autoauditflow/update'}`, params);
}
// 删除
export function deleteItem (params) {
  return axios.post(`${'/autoauditflow/del'}`, params);
}
// 查询
export const getList = params => {
  return axios({
    url: '/autoauditflow/search',
    method: 'get',
    params
  });
};
