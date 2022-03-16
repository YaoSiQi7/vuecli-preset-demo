
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 保存
export function upOrAddConfig (params) {
  // return axios.post(`${'/sysSettiog/modifyset'}`, params);
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: `${'/sysSettiog/modifyset'}`,
    data: params
  });
}

// 获取
export function getConfig (params) {
  return axios.get(`${'/sysSettiog/query'}`, params);
}

// 查询敏感信息列表
export function queryallfield (params) {
  return axios.post(`${'/businessVariableLibrary/queryallfield'}`, params);
}

// 查询省份
export function getCity (params) {
  return axios.post(`${'/city/getcity'}`, params);
}
