
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// import axios from 'axios';
// let BASE_URL = 'http://192.168.1.111:9080';
// 新建
export function addItem (params) {
  return axios.post(`${'/warningstrategyTempl/insert'}`, params);
}
export function getList (params) {
  return axios.post(`${'/warningstrategyTempl/query'}`, params);
}
export function editItem (params) {
  return axios.post(`${'/warningstrategyTempl/update'}`, params);
}
export function deleteItem (params) {
  return axios.post(`${'/warningstrategyTempl/delete'}`, params);
}
// 添加时---无引用记录的预警策略模板
export function searchNoQuoteLog (params) {
  return axios.post(`${'/warningstrategyTempl/valueNotRel'}`, params);
}
// 编辑时---无引用记录的预警策略模板
export function searchNoQuoteLogEdit (params) {
  return axios.post(`${'/warningstrategyTempl/currentAndNotRel'}`, params);
}
// 预警指标select数据
export function getPoliceTargetAry (params) {
  return axios.post(`${'/warningstrategyTempl/getWarnIndicator'}`, params);
}
// 预警指标类型select数据
export function getPoliceTargetTypeAry (params) {
  return axios.get(`${'/warningstrategyTempl/getWarnIndicatorType'}`, {
    params: params
  });
}
