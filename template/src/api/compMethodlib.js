/*
 * @Author: yaosiqi
 * @Date: 2020-04-10 05:44:47
 * @LastEditTime: 2020-04-14 17:01:29
 * @LastEditors: Please set LastEditors
 * @Description: API OF METHODLIB
 * @FilePath: \ipa-manage\src\api\compMethodlib.js
 */
// 引入封装的axios函数
import axiosService from '@/utils/axios-request.js';

// 查询方法组
export function groupQuery (parms) {
  return axiosService.post(`${'/method/groupQuery'}`, parms);
}
// 新增方法组
export function groupAdd (parms) {
  return axiosService.post(`${'/method/groupAdd'}`, parms);
}
// 编辑方法组
export function groupUpdate (parms) {
  return axiosService.post(`${'/method/groupUpdate'}`, parms);
}
// 删除方法组
export function groupDelete (parms) {
  return axiosService.post(`${'/method/groupDelete'}`, parms);
}
// 添加方法
export function methodAdd (parms) {
  return axiosService.post(`${'/method/methodAdd'}`, parms);
}
// 查询方法
export function methodQuery (parms) {
  return axiosService.post(`${'/method/methodQuery'}`, parms);
}
// 编辑方法
export function methodUpdate (parms) {
  return axiosService.post(`${'/method/methodUpdate'}`, parms);
}
// 删除方法
export function methodDelete (parms) {
  return axiosService.post(`${'/method/methodDelete'}`, parms);
}
// 添加参数
export function paramAdd (parms) {
  return axiosService.post(`${'/method/paramAdd'}`, parms);
}
// 查询参数
export function paramQuery (parms) {
  return axiosService.post(`${'/method/getParamByMethodId'}`, parms);
}
// 修改参数
export function paramUpdate (parms) {
  return axiosService.post(`${'/method/update'}`, parms);
}
// 删除参数
export function paramDelete (parms) {
  return axiosService.post(`${'/method/paramDelete'}`, parms);
}
// 删除前是否引用
export function methodIsRecord (parms) {
  return axiosService.post(`${'/method/methodIsRecord'}`, parms);
}
