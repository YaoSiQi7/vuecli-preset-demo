import axios from '@/utils/axios-request.js';

// 获取模块(第一页面表格数据)列表
export function queryFieldData (params) {
  return axios.post(`${'/field/query'}`, params);
}

// 获取全量应用(渠道)列表
export function queryAppInfo (params) {
  return axios.post(`${'/sysAppinfo/info'}`, params);
}

// 获取当前可配置应用列表
export function queryFilteredApps () {
  return axios.post(`${'/field/filtered'}`);
}

// 获取字段池
export function queryConfiguarableFields () {
  return axios.post(`${'/field/findfield'}`);
}

// 保存模块配置
export function addModule (params) {
  return axios.post(`${'/field/addmodule'}`, params);
}

// 编辑模块配置
export function editModule (params) {
  return axios.post(`${'/field/modifymodule'}`, params);
}

// 保存表头和搜索
export function addTitle (params) {
  return axios.post(`${'/field/modifytitle'}`, params);
}

// 保存详情字段
export function addGroup (params) {
  return axios.post(`${'/field/modifygroup'}`, params);
}

// 删除模块配置
export function delModule (params) {
  return axios.post(`${'/field/del'}`, params);
}

export function queryTableHeader (params) {
  return axios.post(`${'/field/getheader'}`, params);
}

// 获取分组详情
export function queryGroup (params) {
  return axios.post(`${'/field/getgroup'}`, params);
}
