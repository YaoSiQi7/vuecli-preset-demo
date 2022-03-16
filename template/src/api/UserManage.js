import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 导入数据
export function importData (params) {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    url: `${'/amUser/importUserInfo'}`,
    data: params
  });
}
// 下载模板
export function getTemplData (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/amUser/exportUserInfoDownLoad'}`
  });
}
// 导出
export function getExportData () {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/amUser/exportUserInfo'}`
  });
}
// 获取下拉树
export function queryTreeSelectList () {
  return axios.post(`${'/amDepartment/initQuery'}`);
}
// 获取机构下拉树
export function queryTreeSelectListNew () {
  return axios.post(`${'/amDepartment/initQueryNew'}`);
}
// 获取列表树
export function queryTreeList (params) {
  return axios.post(`${'/amDepartment/query'}`, params);
}
// 获取表格
export function queryTableList (params) {
  return axios.post(`${'/amUser/queryByPid'}`, params);
}
// 预添加
export function preAdds (params) {
  return axios.post(`${'/amUser/showAdd'}`, params);
}
// 添加
export function addItem (params) {
  return axios.post(`${'/amUser/insert'}`, params);
}
// 预重置
export function preEdits (params) {
  return axios.post(`${'/amUser/showUpdate'}`, params);
}
// 重置密码
export function editItem (params) {
  return axios.post(`${'/amUser/update'}`, params);
}
// 新功能-修改密码
export function editNewItem (params) {
  return axios.post(`${'/amUser/updatePwd'}`, params);
}
// 删除
export function removeItem (params) {
  return axios.post(`${'/amUser/deleteById'}`, params);
}
// 启用禁用
export function updateStates (params) {
  return axios.post(`${'/amUser/updateStates'}`, params);
}
// 解锁用户
export function unLockState (params) {
  return axios.post(`${'/amUser/unLockState'}`, params);
}
