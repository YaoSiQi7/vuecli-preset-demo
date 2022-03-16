// 引入封装的axios函数
import axios from '@/utils/axios-request.js';
// import axios from 'axios';

let API_ROOT = window.g.address;

export function getList (parms) {
  // return axios.post(`${API_ROOT + '/sysCompany/query'}`, parms);
}
// 操作类型下拉框
export function getOpTypeList (params) {
  return axios.post(`${'/ruleset/queryOperationType'}`, params);
}

// 查询
export function searchData (params) {
  return axios.post(`${'/ruleset/queryRulesetOrRuleChangeLog'}`, params);
}

// 查询
export function searchRuleDetails (params) {
  return axios.post(`${'/ruleset/queryRulesetOrRuleChangeRecordInfo'}`, params);
}

// 获取风险阈值
export function getriskThresholdList (params) {
  return axios.post(`${'/sysParam/findsysparams'}`, params);
}
