
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 新建函数
export function addConstEnume (params) {
  return axios.post(`${'/enum/createenumeration'}`, params);
}
// 获取左侧列表数据
export function getEnumeList (params) {
  return axios.get(`${'/enum/findenumeration'}`, params);
}
// 删除枚举常量
export function deleteEnum (params) {
  return axios.post(`${'/enum/deleteenumeration'}`, params);
}
// 编辑枚举常量
export function editEnum (params) {
  return axios.post(`${'/enum/updateenumeration'}`, params);
}
// 右边列表---添加保存
export function addField (params) {
  return axios.post(`${'/enum/createenumfield'}`, params);
}
// 查询右侧列表数据
export const getFieldNameList = params => {
  return axios({
    url: '/enum/findenumfield',
    method: 'get',
    params
  });
};
// 查询右侧列表数据=---枚举常量库列表带分页
export const getEnumCostList = params => {
  return axios({
    url: '/enum/findenumfieldPage',
    method: 'get',
    params
  });
};
// 右边列表---删除
export function deleteField (params) {
  return axios.post(`${'/enum/deleteenumfield'}`, params);
}
// 右边列表---编辑保存
export function editFieldl (params) {
  return axios.post(`${'/enum/updateenumfield'}`, params);
}
