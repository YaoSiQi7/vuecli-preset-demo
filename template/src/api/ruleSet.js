import axios from '@/utils/axios-request'; // 导入http中创建的axios实例

const RULESET_URL = '/ruleset';
const TREAD_URL = '/tradetype';
const VARIABLE_URL = '/businessVariableLibrary';
const INDICATORS_URL = '/indicators';
const OPERATOR_URL = '/operator';
const SYS_URL = '/sysParam';
const APP_URL = '/sysAppinfo';
// Auditor_URL
const AUDITOR_URL = '/rulesetAuditor'; // 审核相关
// 查询规则集列表
export async function getRuleSet (params) {
  return axios.post(`${RULESET_URL}/query`, params);
}
// 创建规则集
export async function addRuleSet (params) {
  return axios.post(`${RULESET_URL}/addset`, params);
}
// 删除规则集
export async function delRuleSet (params) {
  return axios.post(`${RULESET_URL}/deleteset`, params);
}
// 修改规则集
export async function modifyRuleSet (params) {
  return axios.post(`${RULESET_URL}/modifyset`, params);
}
// 规则集保存并输出中的保存
export async function initRuleSet (params) {
  return axios.post(`${RULESET_URL}/init`, params);
}
// 规则集保存并输出中的输出
export async function outputRuleSet (params) {
  return axios.post(`${RULESET_URL}/output`, params);
}
// 获取规则集最新版本信息
export async function getRuleSetInfo (params) {
  return axios.post(`${RULESET_URL}/setinfo`, params);
}
// 获取规则集指定版本信息
export async function getVersionInfo (params) {
  return axios.post(`${RULESET_URL}/versioninfo`, params);
}
// 创建规则
export async function addRule (params) {
  return axios.post(`${RULESET_URL}/addrule`, params);
}
// 删除规则
export async function delRule (params) {
  return axios.post(`${RULESET_URL}/delrule`, params);
}
// 修改规则
export async function modifyRule (params) {
  return axios.post(`${RULESET_URL}/modifyrule`, params);
}
// 添加规则集版本
export async function addversion (params) {
  return axios.post(`${RULESET_URL}` + '/addversion', params);
}
// 修改版本信息
export async function modifyversion (params) {
  return axios.post(`${RULESET_URL}` + '/modifyversion', params);
}
// 获取应用
export async function getApp (params) {
  return axios.post(`${APP_URL}` + '/userapp', params);
}
// 获取交易类型
export async function getTradeType (params) {
  return axios.post(`${APP_URL}` + '/uniontradeTypes', params);
}
// 获取枚举下拉列表数据
export async function getAllTradeType (params) {
  return axios.post(`${SYS_URL}` + '/findsysparams', params);
}
// 获取业务变量库
export async function GetVariableField (params) {
  return axios.post(`${VARIABLE_URL}` + '/queryallfield', params);
}
// 获取计算指标库有类型的数据
export async function GetIndicators (params) {
  return axios.get(`${INDICATORS_URL}` + '/queryindicwithtype', params);
}
// 获取计算符
export async function GetOperator (params) {
  return axios.post(`${OPERATOR_URL}` + '/querycountsymbol', params);
}
// 删除引用
export async function delRecWithCond (params) {
  return axios.post(`${RULESET_URL}` + '/delrecwithcond', params);
}
// 新增引用
export async function addRecord (params) {
  return axios.post(`${RULESET_URL}` + '/addrecord', params);
}
// 新增引用
export async function checkIsrefrecord (params) {
  return axios.post(`${RULESET_URL}` + '/isrefrecord', params);
}
// 查询状态有效的名单集
export async function getListManage (params) {
  return axios.post('listManage/effective', params);
}
// 规则升级
export async function UpgradeRule (params) {
  return axios.post(`${RULESET_URL}/modifyupgraderule`, params);
}
// 获取所有交易类型
export async function findtradelist (params) {
  return axios.get(`${TREAD_URL}/findtradelist`, params);
}
// 获取规则集中---所有公司
export async function getSubordinateFirm (params) {
  return axios.get(`${'/amDepartment/initQuery'}`, params);
}
// 获取送审操作---审核人员列表
export async function getAuditUserList (params) {
  return axios.get(`${'/amUser/AuditUserList'}`, {
    params: params
  });
}
// 送审操作---提审 const Auditor_URL = '/rulesetAuditor'; // 规则审核
export async function submitExamine (params) {
  return axios.post(`${AUDITOR_URL}/addAudit`, params);
}
// 查询待审核列表
export async function getPendingAudit (params) {
  return axios.post(`${AUDITOR_URL}/myPendingAudit`, params);
}
// 查询 已审核列表
export async function getMyAuditedList (params) {
  return axios.post(`${AUDITOR_URL}/myAuditedList`, params);
}
// 查询 已提交列表
export async function getmySubmittedAudit (params) {
  return axios.post(`${AUDITOR_URL}/mySubmittedAudit`, params);
}

// 查询该规则集审核详情 queryRulesetAuditInfo
export async function getRulesetAtditInfo (params) {
  return axios.post(`${AUDITOR_URL}/queryRulesetAuditInfo`, params);
}

// 完成审核/rulesetAuditor/completedAudit
export async function completedAudit (params) {
  return axios.post(`${AUDITOR_URL}/completedAudit`, params);
}

// /ruleset/isEditParam
export async function getIsEditParam (params) {
  return axios.post(`${RULESET_URL}/isEditParam`, params);
}
// 获取规则集中---当前用户被授权的公司
export async function initDepartment (params) {
  return axios.post(`${'/sysCompany/initDepartment'}`, params);
}
// 获取规则集中---当前所选公司下的应用
export async function getCompanys (params) {
  return axios.post(`${'/sysAppinfo/getCompanys'}`, params);
}
// 规则集批量导出
export async function exportRuleSetData (keyStatus, params) {
  // return axios.get(`${RULESET_URL}/exportRuleSetExcel/${keyStatus}`, params);
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${RULESET_URL}/exportRuleSetExcel/${keyStatus}`,
    // params: params
    data: params
  });
}
// 规则集导出--滚动条
export async function exportStatus (keyStatus) {
  // /ruleset/get/speed/{keyStatus}
  return axios.get(`${RULESET_URL}/get/speed/${keyStatus}`);
}
// 复制规则
export async function copyRuleSetFun (params) {
  return axios.post(`${RULESET_URL}/copyRuleSet`, params);
}
// 规则集导入 获取查询条件
export async function getRuleConditiong (params) {
  return axios.post(`${RULESET_URL}/queryRuleConditiong`, params);
}

// 规则集导入 获取规则列表
export async function getQueryRules (params) {
  return axios.post(`${RULESET_URL}/queryRules`, params);
}
// 规则集导入 获取规则列表
export async function batchAddRules (params) {
  return axios.post(`${RULESET_URL}/addrules`, params);
}
