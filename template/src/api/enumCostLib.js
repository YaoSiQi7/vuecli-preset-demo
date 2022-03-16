
import axios from 'axios';

// 新建函数
export function addConstEnume (params) {
  return axios.post(`${'/enum/createEnumeration'}`, params);
}

export function getEnumeList (params) {
  return axios.post(`${'/enum/findEnumeration'}`, params);
}

export function deleteEnum (params) {
  return axios.post(`${'/enum/deleteEnumeration'}`, params);
}

export function editEnum (params) {
  return axios.post(`${'/enum/updateEnumeration'}`, params);
}

export function addField (params) {
  return axios.post(`${'/enum/createEnumField'}`, params);
}

export function getFieldNameList (params) {
  return axios.post(`${'/enum/findEnumField'}`, params);
}

export function deleteField (params) {
  return axios.post(`${'/enum/deleteEnumField'}`, params);
}

export function editFieldl (params) {
  return axios.post(`${'/enum/updateEnumField'}`, params);
}
