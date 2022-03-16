
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 新建函数
export function addConstEnume (params) {
  return axios.post(`${'/sysParam/createparamsgroup'}`, params);
}
// 获取左侧列表数据
export function getEnumeList (params) {
  return axios.get(`${'/sysParam/findparamsgroup'}`, params);
}
// 删除左侧列表
export function deleteEnum (params) {
  return axios.post(`${'/sysParam/deleteparamsgroup'}`, params);
}
// 编辑左侧列表
export function editEnum (params) {
  return axios.post(`${'/sysParam/updateparamsgroup'}`, params);
}
// 右边列表---添加保存
export function addField (params) {
  return axios.post(`${'/sysParam/createsysparams'}`, params);
}
// 查询右侧列表数据
export const getFieldNameListArray = params => {
  return axios({
    url: '/sysParam/findparamslist',
    method: 'get',
    params
  });
};
// 查询右侧列表数据--带分页 系统参数库
export const getSysParamListArray = params => {
  return axios({
    url: '/sysParam/findparamsPage',
    method: 'get',
    params
  });
};
// 查询右侧列表数据
export const getFieldNameList = params => {
  return axios({
    url: '/sysParam/findsysparams',
    method: 'get',
    params
  });
};
// 右边列表---删除
export function deleteField (params) {
  return axios.post(`${'/sysParam/deletesysparams'}`, params);
}
// 右边列表---编辑保存
export function editFieldl (params) {
  return axios.post(`${'/sysParam/updatesysparams'}`, params);
}
