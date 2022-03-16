/*
  author：古雪瑞
  updateTime：2020-05-22
*/
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 增加
export function insertStrategy (params) {
  return axios.post(`${'/blacklistTmpl/insert'}`, params);
}

// 查询
export function queryDataList (params) {
  return axios.post(`${'/blacklistTmpl/query'}`, params);
}

// 删除
export function deleteItem (params) {
  return axios.post(`${'/blacklistTmpl/delete'}`, params);
}

// 修改
export function updateItem (params) {
  return axios.post(`${'/blacklistTmpl/update'}`, params);
}

// 查询全量业务变量字段值
export function queryallfield (params) {
  return axios.post(`${'/businessVariableLibrary/queryallfield'}`, params);
}

// 从系统参数库查询参数
export function findsysParams (params) {
  return axios.post(`${'/sysParam/findsysparams'}`, params);
}
