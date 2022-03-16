// 引入封装的axios函数
import axiosService from '@/utils/axios-request.js';

export function getRuList () {
  return axiosService.post(`${'/businessVariableLibrary/queryBusinessVariableList'}`);
}

export function addVar (parms) {
  return axiosService.post(`${'/businessVariableLibrary/addBusinessVariable'}`, parms);
}

export function deteleVar (parms) {
  return axiosService.post(`${'/businessVariableLibrary/deleteBusinessVariableById'}`, parms);
}

export function editVar (parms) {
  return axiosService.post(`${'/businessVariableLibrary/updateBusinessVariableById'}`, parms);
}
// 查询业务变量下字段列表
export function getFieldList (parms) {
  return axiosService.post(`${'/businessVariableLibrary/queryFieldListByBusinessVariableId'}`, parms);
}
// 删除业务变量下的字段
export function deleteField (parms) {
  return axiosService.post(`${'/businessVariableLibrary/deleteFieldById'}`, parms);
}
// 增加业务变量下的字段
export function addField (parms) {
  return axiosService.post(`${'/businessVariableLibrary/addField'}`, parms);
}
// 修改业务变量下的字段
export function updateField (parms) {
  return axiosService.post(`${'/businessVariableLibrary/updateField'}`, parms);
}
