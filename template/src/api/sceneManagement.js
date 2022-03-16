import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
const APP_URL = '/sysAppinfo';
const SYS_URL = '/sysParam';
// 获取首页列表
export function querySceneList (params) {
  return axios.post(`${'/scenses/query'}`, params);
}
// 获取交易类型list
export function queryTradeType (params) {
  return axios.post(`${'/sysAppinfo/tradeTypes'}`, params);
}
// 获取场景list和策略类型list
export function queryParams (params) {
  return axios.post(`${'/scenses/param'}`, params);
}
// 添加场景
export function insertScene (params) {
  return axios.post(`${'/scenses/insert'}`, params);
}
// 删除场景
export function deleteScene (params) {
  return axios.post(`${'/scenses/deleteByIds'}`, params);
}
// 编辑场景
export function editScene (params) {
  return axios.post(`${'/scenses/update'}`, params);
}
// 判断场景标识是否唯一
export function existSceneNo (params) {
  return axios.post(`${'/scenses/existScenesNo'}`, params);
}
// 复用时获取源应用
export function queryAppinfo (params) {
  return axios.post(`${'/scenses/appinfo'}`, params);
}
// 保存策略
export function saveStrategy (params) {
  return axios.post(`${'scenses/saveStrategy'}`, params);
}
// 获取应用
export async function getApp (params) {
  return axios.post(`${APP_URL}` + '/query', params);
}
// 获取枚举下拉列表数据
export async function getAllTradeType (params) {
  return axios.post(`${SYS_URL}` + '/findsysparams', params);
}
// 添加引用记录
export function addRecord (params) {
  return axios.post(`${'/ruleset/addrecord'}`, params);
}
// 拷贝目标应用场景信息
export function copyOriginAppInfo (params) {
  return axios.post(`${'/scenses/copy'}`, params);
}
// 修改场景状态
export function editScenesState (params) {
  return axios.post(`${'/scenses/states'}`, params);
}
// 查看是否有引用记录
export function queryIsrecord (params) {
  return axios.post(`${'/ruleset/isrefrecord'}`, params);
}
// 删除引用记录
export function delrecord (params) {
  return axios.post(`${'/ruleset/delrecwithcond'}`, params);
}
// 查询复用的那条规则集信息
export function queryRuleSetInfo (params) {
  return axios.post(`${'/ruleset/query'}`, params);
}
// 修改复用的那条规则集信息，添加当前应用
export function modifyCurrentSet (params) {
  return axios.post(`${'/ruleset/modifyset'}`, params);
}
// 获取所有交易类型
export async function findtradelist (params) {
  return axios.get(`/tradetype/findtradelist`, params);
}
// 查询处置策略列表
export async function queryStrategy (params) {
  return axios.post(`/scenses/querystrategy`, params);
}
// 获取名单集数据
export async function queryNameListSet (params) {
  return axios.post(`/listManage/querylist`, params);
}
// 获取处置动作列表
export async function getDisposalActionList (params) {
  return axios.get(`/blacklistTmpl/datas`, params);
}

// 查询规则级列表
export async function getRuleSet (params) {
  return axios.post('/ruleset/queryRuleSet', params);
}
// 获取名单集数据，二级树形结构
export async function queryNameListNode (params) {
  return axios.post(`/listManage/queryData`, params);
}

// 查询分配给当前用户并且有处置策略的应用集合
export async function queryAppIdsForScenarioManager (params) {
  return axios.post(`/scenses/queryAppIdsForScenarioManager`, params);
}

// 根据应用ID查询有处置策略的交易类型
export async function queryTradeTypeForScenarioManager (params) {
  return axios.post(`/scenses/queryTradeTypeForScenarioManager`, params);
}

// 根据应用ID和交易类型ID查询处置策略
export async function queryStrategyData (params) {
  return axios.post(`/scenses/queryStrategyData`, params);
}

// 业务变量库
export async function queryallfield (params) {
  return axios.post(`/businessVariableLibrary/queryallfield`, params);
}

// 计算指标库
export async function queryindicwithtype (params) {
  return axios.post(`/indicators/queryindicwithtype`, params);
}

// 查询名单类型
export async function mdfindsysparams (params) {
  return axios.post(`/sysParam/findsysparams`, params);
}

// 名单库
export async function effective (params) {
  return axios.post(`/listManage/effective`, params);
}

// 取系统中的计算符
export async function querycountsymbol (params) {
  return axios.post(`/operator/querycountsymbol`, params);
}

// 规则集命中规则
export async function queryHitRuleByRuleSetId (params) {
  return axios.post(`/scenses/queryHitRuleByRuleSetId`, params);
}

// 获取系统参数库（规则集命中风险标签或规则集处置策略）
export async function findsysparams (params) {
  return axios.post(`/sysParam/findsysparams`, params);
}

// 获取黑名单策略
export async function blacklistTmpl (params) {
  return axios.get(`/blacklistTmpl/datas`, params);
}

// 黑名单策略对应的名单集
export async function queryData (params) {
  return axios.post(`/listManage/queryData`, params);
}

// 获取邮件通知群组
export async function sysWarnEmailGroup (params) {
  return axios.post(`/sysWarnEmailGroup/query`, params);
}

// 获取短信通知群组
export async function sysWarnPhoneGroup (params) {
  return axios.post(`/sysWarnPhoneGroup/query`, params);
}
