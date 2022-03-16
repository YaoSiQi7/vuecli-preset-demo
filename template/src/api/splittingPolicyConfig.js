import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 分单组合
export function details (params) {
  return axios.post(`${'/group/query/user/details'}`, params);
}
// 编辑
export function editItem (params) {
  return axios.post(`${'/autoallocationvoucherflow/update'}`, params);
}
// 下拉数据
export const getSelectDataList = params => {
  return axios({
    url: '/autoallocationvoucherflow/strategy/metadata/query',
    method: 'get',
    params
  });
};
// 查询
export const getList = params => {
  return axios({
    url: '/autoallocationvoucherflow/search',
    method: 'get',
    params
  });
};
