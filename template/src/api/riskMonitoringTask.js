import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 风险任务监控列表
export function effectRiskList (params) {
  return axios.post(`${'/effectRisk/effectRiskList'}`, params);
}

// 风险任务监控详情
export function effectRiskListInfo (params) {
  return axios.post(`${'/effectRisk/effectRiskListInfo'}`, params);
}

// 新增风险监控任务
export function addEffectRisk (params) {
  return axios.post(`${'/effectRisk/addEffectRisk'}`, params);
}

// 修改风险监控任务
export function updateEffectRisk (params) {
  return axios.post(`${'/effectRisk/updateEffectRisk'}`, params);
}

// 删除风险监控任务
export function delEffectRisk (params) {
  return axios.post(`${'/effectRisk/delEffectRisk'}`, params);
}

// 风险任务监控详情保存
export function saveEffectRiskWeight (params) {
  return axios({
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    url: `${'/effectRisk/saveEffectRiskWeight'}`,
    data: params
  });
}

// 开启或关闭风险监控任务
export function upTaskState (params) {
  return axios.post(`${'/effectRisk/upTaskState'}`, params);
}

// 修改spark服务配置参数
export function upConfig (params) {
  return axios.post(`${'/effectRisk/upConfig'}`, params);
}
