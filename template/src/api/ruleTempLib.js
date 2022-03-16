
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 查询模板分组
export function getList () {
  return axios.post(`${'/ruletmpl/querygroup'}`);
}
// 添加模板分组
export function addTempGrop (parms) {
  return axios.post(`${'/ruletmpl/insertgroup'}`, parms);
}
// 更新模板分组
export function editTempGrop (parms) {
  return axios.post(`${'/ruletmpl/updategroup'}`, parms);
}
// 删除模板分组
export function deteleTempGrop (parms) {
  return axios.post(`${'/ruletmpl/deletegroup'}`, parms);
}
// 查询模板
export function getListTmp (parms) {
  return axios.post(`${'/ruletmpl/querytmpl'}`, parms);
}
// 规则模版-右侧列表-带分页
export function getRuleTmpListPage (parms) {
  return axios.post(`${'/ruletmpl/querytmplpage'}`, parms);
}
// 新增模板
export function addTmp (parms) {
  return axios.post(`${'/ruletmpl/inserttmpl'}`, parms);
}
// 删除模板
export function deteleTmp (parms) {
  return axios.post(`${'/ruletmpl/deletetmpl'}`, parms);
}
// 编辑模板
export function editTmp (parms) {
  return axios.post(`${'/target/updatetemplate'}`, parms);
}
// 规则模板参数
export function getTmpListValue (parms) {
  return axios.post(`${'/ruletmpl/queryparams'}`, parms);
}
// 获取模板参数列表
export function getTmpPraList (params) {
  return axios.post(`${'/params/queryparam'}`, params);
}
// 删除模板参数
export function deteleTmpPrm (parms) {
  return axios.post(`${'/ruletmpl/deleteparam'}`, parms);
}
// 批量添加模板参数
export function addAllTmpPrm (parms) {
  return axios.post(`${'/ruletmpl/modifyparams'}`, parms);
}

// 更新规则模板-规则基本信息保存
export function ruleUpdateTmpl (parms) {
  return axios.post(`${'/ruletmpl/updatetmpl'}`, parms);
}
