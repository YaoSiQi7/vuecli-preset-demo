/*
 * @Author: your name
 * @Date: 2020-12-02 14:34:47
 * @LastEditTime: 2020-12-02 15:06:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\api\riskOrder.js
 */
import axios from '@/utils/axios-request.js';

// 获取图表和列表数据

export const queryData = params => {
  return axios({
    url: '/riskOrder/queryRiskOrder',
    method: 'post',
    data: params
  });
};
export const queryDetailData = params => {
  return axios({
    url: '/riskOrder/queryRiskOrderDetails',
    method: 'post',
    data: params
  });
};
