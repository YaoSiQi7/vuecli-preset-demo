/*
 * @Author: your name
 * @Date: 2021-02-19 15:07:46
 * @LastEditTime: 2021-02-23 10:32:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\api\OrganizationManage.js
 */
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取下拉树
export function queryTreeSelectList () {
  return axios.post(`${'/amDepartment/initQuery'}`);
}
// 获取列表树
export function queryTreeList (params) {
  return axios.post(`${'/amDepartment/query'}`, params);
}
// 获取表格
export function queryTableList (params) {
  return axios.post(`${'/amDepartment/queryByPid'}`, params);
}
// 预添加
export function preAdds (params) {
  return axios.post(`${'/amDepartment/showAdd'}`, params);
}
// 添加
export function addItem (params) {
  return axios.post(`${'/amDepartment/insert'}`, params);
}
// 预编辑
export function preEdits (params) {
  return axios.post(`${'/amDepartment/showUpdate'}`, params);
}
// 编辑
export function editItem (params) {
  return axios.post(`${'/amDepartment/update'}`, params);
}
// 删除
export function removeItem (params) {
  return axios.post(`${'/amDepartment/deleteById'}`, params);
}
// 批量导入
export function importDepartment (params) {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8'
    },
    url: `${'/amDepartment/importDepartment'}`,
    data: params
  });
}
// 下载模板
export function getDepartData (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/amDepartment/exportDepartmentInfoDownLoad'}`
  });
}
