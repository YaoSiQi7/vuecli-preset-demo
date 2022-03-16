
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
import qs from 'qs';
// 左侧列表
export function getList () {
  return axios.post(`${'/target/querygroup'}`);
}
export function addTempGrop (parms) {
  return axios.post(`${'/target/addgroup'}`, parms);
}
export function editTempGrop (parms) {
  return axios.post(`${'/target/updategroup'}`, parms);
}
export function deteleTempGrop (parms) {
  return axios.post(`${'/target/deletegroup'}`, parms);
}
// 右侧列表
export function getListTmp (parms) {
  return axios.post(`${'/target/querytemplate'}`, parms);
}
// 右侧列表---计算指标模版列表-带分页
export function getCalcIndexTmpListPage (parms) {
  return axios.post(`${'/target/querytemplatepage'}`, parms);
}
export function addTmp (parms) {
  return axios.post(`${'/target/addtemplate'}`, parms);
}
export function deteleTmp (parms) {
  return axios.post(`${'/target/deletetemplate'}`, parms);
}
export function editTmp (parms) {
  return axios.post(`${'/target/updatetemplate'}`, parms);
}
// 弹窗
export function getTmpListValue (parms) {
  return axios.post(`${'/target/queryparam'}`, parms);
}
// 获取模板参书列表
export function getTmpPraList (params) {
  return axios.post(`${'/params/queryparam'}`, params);
}
// 删除模板参数
export function deteleTmpPrm (parms) {
  return axios.post(`${'/target/deleteparam'}`, parms);
}
// 批量添加模板参数
export function addAllTmpPrm (parms) {
  return axios.post(`${'/target/modifyparam'}`, parms);
}
