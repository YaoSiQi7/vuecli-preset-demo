
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// import axios from 'axios';
// let BASE_URL = 'http://192.168.1.111:9080';
// 新建
export function addConstEnume (params) {
  return axios.post(`${'/sysAppinfo/insert'}`, params);
}
// 获取企业名称和应用类型
export function getApplyName (params) {
  return axios.post(`${'/sysAppinfo/param'}`, params);
}
// 获取列表数据
export function getEnumeList (params) {
  return axios.post(`${'/sysAppinfo/query'}`, params);
}
// 更新密钥
export function updataKey (params) {
  return axios.post(`${'sysAppinfo/key'}`, params);
}
// 删除枚举常量
export function deleteEnum (params) {
  return axios.post(`${'/sysAppinfo/deleteByIds'}`, params);
}
// 编辑枚举常量
export function editEnum (params) {
  return axios.post(`${'/sysAppinfo/update'}`, params);
}
// 更改状态
export function amendDetails (params) {
  return axios.post(`${'/sysAppinfo/states'}`, params);
}
// 批量删除引用记录
export async function allRemoveRefrecord (params) {
  return axios.post(`${'/ruleset/delbatchrecords'}`, params);
}
// 批量添加引用记录
export async function allAddRefrecord (params) {
  return axios.post(`${'/ruleset/addbatchrecords'}`, params);
}

// 查询授权信息
export async function queryLicAuthInfo (params) {
  return axios.post(`${'/licAuth/queryLicAuthInfo'}`, params);
}
// 更新授权
export function updateLicAuth (params) {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    url: `${'/licAuth/updateLicAuth'}`,
    data: params
  });
}
// 下载设备绑定码
export function downloadLicAuthFile (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/licAuth/downloadLicAuthFile'}`
  });
}
