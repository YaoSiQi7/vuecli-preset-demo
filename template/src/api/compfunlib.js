// 引入封装的axios函数
import axiosService from '@/utils/axios-request.js';

// import axios from 'axios';

export function getList (parms) {
  return axiosService.post(`${'/operator/queryfunction'}`, parms);
}

export function addItem (parms) {
  return axiosService.post(`${'/operator/addfunction'}`, parms);
}

export function deteleItem (parms) {
  return axiosService.post(`${'/operator/deletefunction'}`, parms);
}

export function editItem (parms) {
  return axiosService.post(`${'/operator/updatefunction'}`, parms);
}
