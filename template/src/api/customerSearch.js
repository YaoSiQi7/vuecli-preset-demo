/**
author: 古雪瑞
updateTime: 2020-07-30
description: 客户画像功能请求接口方法
**/
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取用户画像列表数据
export function getDataList (params) {
  return axios.post(`${'/personas/getpersonaspage'}`, params);
}

// 获取用户画像详情
export function getUserPortrait (params) {
  return axios.post(`${'/personas/getuserPortrait'}`, params);
}
