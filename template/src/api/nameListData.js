
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 查询名单数据记录
export function queryNameListData (params) {
  return axios.post(`${'/listData/query'}`, params);
}
// 添加名单数据
export function addNameListData (params) {
  return axios.post(`${'/listData/insert'}`, params);
}
// 修改名单数据
export function updateNameListData (params) {
  return axios.post(`${'/listData/update'}`, params);
}
// 删除名单数据
export function deleteNameListData (params) {
  return axios.post(`${'/listData/delete'}`, params);
}
// 切换开关
export function toggleSwitchStates (params) {
  return axios.post(`${'/listData/states'}`, params);
}
// 查询名单集下拉框数据
export function queryNameListSet (params) {
  return axios.post(`${'/listManage/effective'}`, params);
}
// 查询数据来源下拉框数据
export function queryDataSourceList (params) {
  return axios.post(`${'/listData/dataSource'}`, params);
}
// 查询审核状态下拉框数据
export function queryReviewStatesList (params) {
  return axios.post(`${'/listData/checkStates'}`, params);
}
// 添加引用记录
export function addRecord (params) {
  return axios.post(`${'/ruleset/addrecord'}`, params);
}
// 单个删除引用记录
export function delrecord (params) {
  return axios.post(`${'/ruleset/delrecwithcond'}`, params);
}

// 批量删除引用记录
export function delrecordAll (params) {
  return axios.post(`${'/ruleset/delbatchrecords'}`, params);
}

// 导出数据
export function getExportData (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/listData/export'}`,
    data: params
  });
}

// 导入数据
export function importData (params) {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    url: `${'/listData/import'}`,
    data: params
  });
}
// 导入进度
export function importantProsse (params) {
  return axios.post(`${'/listData/queryImpExcelProportion'}`, params);
}

// 下载模板
export function getTemplData (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/listData/exporttemplate'}`,
    data: params
  });
}
