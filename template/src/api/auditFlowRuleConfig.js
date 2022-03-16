import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 编辑
export function editItem (params) {
  return axios.post(`${'/autoauditflow/update'}`, params);
}
// 下拉数据
export const getSelectDataList = params => {
  return axios({
    url: '/autoauditflow/strategy/metadata/query',
    method: 'get',
    params
  });
};
// 查询
export const getList = params => {
  return axios({
    url: '/autoauditflow/search',
    method: 'get',
    params
  });
};
