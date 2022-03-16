/*
 * @Author: your name
 * @Date: 2020-12-07 14:34:12
 * @LastEditTime: 2021-04-07 18:24:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\api\relationGraph.js
 */
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
import https from 'axios';
const APP_URL = '/sysAppinfo';

// 图谱
export function queryassociationmap (params) {
  return axios.post(`${'/associatemap/queryassociationmap'}`, params);
}
// 获取交易类型
export function getTradeType (params) {
  return axios.post(`${APP_URL}` + '/uniontradeTypes', params);
}
// 节点详情
export function getNodeInfo (params) {
  return axios.post(`${'/associatemap/getNodeInfo'}`, params);
}
// 关联详情
export function getAssociateInfo (params) {
  return axios.post(`${'/associatemap/getAssociateInfo'}`, params);
}
// 获取所属应用列表
export function sysAppinfoInfo (params) {
  return axios.post(`${'/sysAppinfo/getAppInfoOrTradeType'}`, params);
}
// 获取所属应用下的名单集（黑名单）
export function getBlankListNames (params) {
  return axios.post(`${'/associatemap/getBlankListNames'}`, params);
}
// 批量添加黑名单
export function batchInsertNameData (params) {
  return axios.post(`${'/associatemap/batchInsertNameData'}`, params);
}
// export function batchInsertNameData (params) {
//   return https({
//     method: 'post',
//     url: 'http://192.168.50.144:8080/associatemap/batchInsertNameData',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     params
//   });
// }
