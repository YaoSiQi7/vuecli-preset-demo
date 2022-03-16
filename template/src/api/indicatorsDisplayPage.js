/*
 * @Author: your name
 * @Date: 2021-03-16 10:02:53
 * @LastEditTime: 2021-03-25 16:42:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\api\indicatorsDisplayPage.js
 */
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取卡片
export function getCardInfo (params) {
  return axios.post(`${'/Card/getCardInfo'}`, params);
}
// 添加卡片
export function addCardInfo (params) {
  return axios.post(`${'/Card/addCardInfo'}`, params);
}
// 应用名称-添加弹出框
export function getAppInfoOrTradeType (params) {
  return axios.post(`${'/sysAppinfo/getAppInfoOrTradeType'}`, params);
}
// 模型名称-添加弹出框
export function modelByApp (params) {
  return axios.post(`${'/mlModel/modelByApp'}`, params);
}
// 实体类型-添加弹出框
export function findsysparams (params) {
  return axios.post(`${'/sysParam/findsysparams'}`, params);
}
// 指标信息-添加弹出框
export function targetByModel (params) {
  return axios.post(`${'/mlModel/targetByModel'}`, params);
}
// 删除卡片
export function delCardInfo (params) {
  return axios.post(`${'/Card/delCardInfo'}`, params);
}
// 修改卡片
export function updateCardInfo (params) {
  return axios.post(`${'/Card/updateCardInfo'}`, params);
}
// 获取echarts数据
export function queryEntityListBrokenLine (params) {
  return axios.post(`${'/Card/queryEntityListBrokenLine'}`, params);
}
// 手动输入确定添加按钮
export function checkEntityListIsLegitimate (params) {
  return axios.post(`${'/Card/checkEntityListIsLegitimate'}`, params);
}
// 模型结果列表
export function mlModelList (params) {
  return axios.post(`${'/mlModel/mlModelList'}`, params);
}
// 模型结果对应团伙信息
export function nodeByAppAndModel (params) {
  return axios.post(`${'/mlModel/nodeByAppAndModel'}`, params);
}
// 模型结果集合列表
export function mlModeRestList (params) {
  return axios.post(`${'/mlModel/mlModeRestList'}`, params);
}
// 模型结果展示列表
export function showEntityList (params) {
  return axios.post(`${'/Card/showEntityList'}`, params);
}
// 保存-添加实体列表
export function allCardSave (params) {
  return axios.post(`${'/Card/allCardSave'}`, params);
}
//
// 查询黑名单集
export function getBlackName (params) {
  return axios.post(`${'/listManage/selectNameByParamAppId'}`, params);
}
// 实体批量加黑
export function mlBatchAddBlack (params) {
  return axios.post(`${'/mlBoard/mlBatchAddBlack'}`, params);
}
// 实体批量移除黑名单
export function mlBatchDelBlack (params) {
  return axios.post(`${'/mlBoard/mlBatchDelBlack'}`, params);
}
// 实体批量清除
export function bathDelEntityList (params) {
  return axios.post(`${'/Card/bathDelEntityList'}`, params);
}
