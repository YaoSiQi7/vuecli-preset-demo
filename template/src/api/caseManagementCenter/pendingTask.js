/*
  author：古雪瑞
  updateTime：2020-04-27
*/
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取审核员信息
export function queryFirstReviewerInfo (params) {
  return axios.post(`${'/caseMg/queryUserInfo'}`, params);
}

// 获取同级转派人员信息
export function querySameLevelTransferInfo (params) {
  return axios.post(`${'/caseMg/querySameAuthority'}`, params);
}

// 任务查询接口
export function queryTaskList (params) {
  return axios.post(`${'/approval/query'}`, params);
}

// 获取交易类型list
export function queryTradeType (params) {
  return axios.post(`${'/approval/queryTradeTypeList'}`, params);
}

// 从系统参数库查询参数
export function findsysParams (params) {
  return axios.post(`${'/sysParam/findsysparams'}`, params);
}

// 任务指派
export function assignSubmit (params) {
  return axios.post(`${'/approval/assignSubmit'}`, params);
}

// 任务转派
export function transferSubmit (params) {
  return axios.post(`${'/approval/transferSubmit'}`, params);
}

// 查看任务详情
export function checkTaskDetail (params) {
  return axios.post(`${'/approval/selectGroupBondList'}`, params);
}

// 任务提交
export function taskSubmit (params) {
  return axios.post(`${'/approval/workorderSubmit'}`, params);
}

// 查看详情
export function checkDetail (params) {
  return axios.post(`${'/approval/checkDetail'}`, params);
}

// 聚合操作
export function createGroup (params) {
  return axios.post(`${'/approval/createGroup'}`, params);
}

// 查询审核组
export function groupQuery (params) {
  return axios.post(`${'/group/query'}`, params);
}

// 聚合组记录分页查询
export function queryGroupList (params) {
  return axios.post(`${'/approval/queryGroupListInfo'}`, params);
}

// 获取核查单关联聚合数据
export function polymerizationList (params) {
  return axios.post(`${'/approval/polymerizationList'}`, params);
}

// 查看交易详情和风控详情弹窗
export function showDataDetail (params) {
  return axios.post(`${'/approval/showDataDetail'}`, params);
}

// 任务暂存
export function storeTask (params) {
  return axios.post(`${'/approval/temp/store'}`, params);
}

// 建议策略
export function queryStrategyList (params) {
  return axios.post(`${'/approval/queryStrategyList'}`, params);
}

// 风险标签
export function queryRiskLabelList (params) {
  return axios.post(`${'/approval/queryRiskLabelList'}`, params);
}

// 上传文件
export function uploadFile (params) {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    url: `${'/approval/fileUpload'}`,
    data: params
  });
}

// 下载附件
export function downloadFile (params) {
  // return axios.post(`${'/approval/downloadFile'}`, params);
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/approval/downloadFile'}`,
    data: params
  });
}

// 风控平台-交易类型查询
export function queryIfdsOptypeList (params) {
  return axios.post(`${'/approval/queryIfdsOptypeList'}`, params);
}

// 获取当前审核组下所有核查人员
export function queryAllUsersList (params) {
  return axios.post(`${'/group/query/allUsers/noPage'}`, params);
}

// 获取当前审核组下所有核查人员
export function setTaskState (params) {
  return axios.post(`${'/approval/setMarkTimeoutState'}`, params);
}
