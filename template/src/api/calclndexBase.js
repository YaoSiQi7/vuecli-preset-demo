/*
 * @Author: your name
 * @Date: 2020-12-02 13:14:51
 * @LastEditTime: 2020-12-03 17:25:58
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\api\calclndexBase.js
 */
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 获取分组
export function getGroupList (params) {
  return axios.post(`${'/indicators/findindicatorsgroup'}`, params);
}
// 添加分组
export function addGroup (params) {
  return axios.post(`${'/indicators/createindicatorsgroup'}`, params);
}
// 删除分组
export function deleteGroup (params) {
  return axios.post(`${'/indicators/deleteindicatorsgroup'}`, params);
}
// 编辑分组
export function editGroup (params) {
  return axios.post(`${'/indicators/updateindicatorsgroup'}`, params);
}
// 添加指标
export function createIndicators (params) {
  return axios.post(`${'/indicators/createindicators'}`, params);
}
// 根据分组id 查询指标
export function getKpiList (params) {
  return axios.post(`${'/indicators/queryindicatorspage'}`, params);
}
// 删除指标
export function deleteKpi (params) {
  return axios.post(`${'/indicators/deleteindicators'}`, params);
}
// 修改指标
export function getIndicatorsById (params) {
  return axios.post(`${'/indicators/updateindicators'}`, params);
}
// 添加指标弹框---模板名称---点击获取下一步的模板结构的接口
export function getApiTemlaterStructure (params) {
  return axios.post(`${'/indicators/gettemplateparameter'}`, params);
}
// 添加指标弹框---获取模板分组
export function findTemplateGroup (params) {
  return axios.post(`${'/target/querygroup'}`, params);
}
// 添加指标弹框---获取模板名称
export function getTemplate (params) {
  return axios.post(`${'/target/querytemplate'}`, params);
}
// 编辑---指标弹框---获取数据
export function editTemplate (params) {
  return axios.post(`${'/indicators/getindicatorsbyid'}`, params);
}
// 交易类型接口
export async function transactionType (params) {
  return axios.post(`${'/sysAppinfo/tradeTypes'}`, params);
}
// 添加方法指标中----方法分组
export async function groupQuery (params) {
  return axios.post(`${'method/groupQuery'}`, params);
}
// 添加方法指标中----方法名称
export async function methodQuery (params) {
  return axios.post(`${'method/getMethodByGroupId'}`, params);
}
// 添加方法指标中----方法名称
export async function getQueryallfield (params) {
  return axios.post(`${'businessVariableLibrary/queryallfield'}`, params);
}
// 过滤条件类型的接口
export async function searchFilterTypeTemplate (params) {
  return axios.post(`${'/indicators/queryfilterconditions'}`, params);
}
// 根据枚举常量名、常量查询对应的枚举值 指标管理模块专用接口
export async function getenumeration (params) {
  return axios.post(`${'/enum/getenumeration'}`, params);
}
// 指标管理--根据应用标识获取 交易类型并集列表
export async function querytradelistbyappids (params) {
  return axios.post(`${'/indicators/querytradelistbyappids'}`, params);
}
// 指标管理--查询应用记录与安全模式或者调试模式
export async function isReferenceAndDebugMode (params) {
  return axios.post(`${'/refrecord/queryRefRecordBySourceId'}`, params);
}
