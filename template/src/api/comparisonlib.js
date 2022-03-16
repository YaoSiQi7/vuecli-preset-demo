// 引入封装的axios函数
import axiosService from '@/utils/axios-request.js';

export function getList (parms) {
  return axiosService.post(`${'/operator/querycountsymbol'}`, parms);
}

export function addItem (parms) {
  return axiosService.post(`${'/operator/addcountsymbol'}`, parms);
}

export function deteleItem (parms) {
  return axiosService.post(`${'/operator/deletecountsymbol'}`, parms);
}

export function editItem (parms) {
  return axiosService.post(`${'/operator/updatecountsymbol'}`, parms);
}
