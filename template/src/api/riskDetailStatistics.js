import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例
// 获取首页图标，加列表数据
export const queryAllList = params => {
  return axios({
    url: '/rulehit/getrulehitdate',
    method: 'get',
    params
  });
};
// 规则触发详情
export const getRiskDetail = params => {
  return axios({
    url: '/rulehit/getruletriggerdetail',
    method: 'get',
    params
  });
};
// 导出数据
export const exportData = params => {
  return axios({
    url: '/rulehit/exportrule',
    method: 'get',
    params
  });
};
// 获取应用场景
export function getAppScene (params) {
  return axios.post(`${'/scenses/queryNoPage'}`, params);
}
// 导出数据列表
export function exportrulehit (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/rulehit/exportrulehit'}`,
    data: params
  });
}
// 导出规则触发数top10
export function exportruletriggertopten (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/rulehit/exportruletriggertopten'}`,
    data: params
  });
}
// 规则确认数量top10
export function exportrulevaliditytopten (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/rulehit/exportrulevaliditytopten'}`,
    data: params
  });
}
// 规则明细列表导出
export function exportrulehitdetail (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/rulehit/exportrulehitdetail'}`,
    data: params
  });
}
