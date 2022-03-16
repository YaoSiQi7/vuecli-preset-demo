/*
 * @Author: your name
 * @Date: 2021-03-15 15:32:37
 * @LastEditTime: 2021-03-15 17:57:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\api\modelAnalysisMent.js
 */
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取表格
export function getList (params) {
  return axios.post(`${'/mlBoard/mlBoardList'}`, params);
}
// 新增数据
export function addBoardIntser (params) {
  return axios.post(`${'/mlBoard/mlBoardIntser'}`, params);
}
// 修改数据
export function mlBoardUpdate (params) {
  return axios.post(`${'/mlBoard/mlBoardUpdate'}`, params);
}
// 删除数据
export function mlBoardDel (params) {
  return axios.post(`${'/mlBoard/mlBoardDel'}`, params);
}
