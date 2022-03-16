// 引入封装的axios函数
import axiosService from '@/utils/axios-request.js';

export function getGroupList (parms) {
  return axiosService.post(`${'/group/query'}`, parms);
}

export function addGroup (parms) {
  return axiosService.post(`${'/group/addGroup'}`, parms);
}

export function deleteGroup (parms) {
  return axiosService.post(`${'/group/deleteGroup'}`, parms);
}

export function updateGroup (parms) {
  return axiosService.post(`${'/group/updateGroup'}`, parms);
}
// 用户列表
export function getAllUsersList (parms) {
  return axiosService.post(`${'/group/query/allUsers'}`, parms);
}
// 删除业务变量下的字段
export function deleteUser (parms) {
  return axiosService.post(`${'/group/delete/user'}`, parms);
}
// 添加用户
export function addUsers (parms) {
  return axiosService.post(`${'/group/addUsers'}`, parms);
}
// 获取当前用户组下可选择的用户列表
export function getShowUsers (parms) {
  return axiosService.post(`${'/group/add/showUsers'}`, parms);
}
