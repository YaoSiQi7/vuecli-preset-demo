import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 新建
export function addItem (params) {
  return axios.post(`${'/tradetype/createtrade'}`, params);
}
// 编辑
export function editItem (params) {
  return axios.post(`${'/tradetype/updatetrade'}`, params);
}
// 编辑验证
export function queryRefRecordBySourceId (params) {
  return axios.post(`${'/refrecord/queryRefRecordBySourceId'}`, params);
}
// 删除
export function deleteItem (params) {
  return axios.post(`${'/tradetype/deletetrade'}`, params);
}
// 查询
export const getList = params => {
  return axios({
    url: '/tradetype/findtrade',
    method: 'get',
    params
  });
};
// 查询交易类型
export const getTrasactionTypeList = params => {
  return axios({
    url: '/tradetype/findtradelist',
    method: 'get',
    params
  });
};
// 查询引用记录是否被引用
export const isRefrecord = params => {
  return axios({
    url: '/ruleset/isrefrecord',
    method: 'get',
    params
  });
};
