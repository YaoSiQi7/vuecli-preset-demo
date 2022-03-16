import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 规则集预导出
export function rulesetShowExport () {
  return axios.post(`${'/ruleset/showExport'}`);
}
// 获得进度条id
export function rulesetGetExportId () {
  return axios.post(`${'/ruleset/getExportId'}`);
}
// 规则集导出
export function rulesetExport (parms) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/ruleset/export'}`,
    data: parms
  });
}
// 导出按钮进度条
export function rulesetMonitorExportProgress (parms) {
  return axios.post(`${'/ruleset/monitorExportProgress'}`, parms);
}
// 导入获取树形结构结构
export function rulesetGetTree (params) {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    url: `${'/ruleset/getTree'}`,
    data: params
  });
}
// 规则集导入
export function rulesetImportRuleset (params) {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    url: `${'/ruleset/importruleset'}`,
    data: params
  });
}
