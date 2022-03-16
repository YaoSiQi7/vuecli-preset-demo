import axios from '@/utils/axios-request.js';

// 获取图表和列表数据

export const queryData = params => {
  return axios({
    url: '/risklabel/reportrisklabel',
    method: 'get',
    params
  });
};
export const queryDetailData = params => {
  return axios({
    url: '/risklabel/reportrisklabeldetail',
    method: 'get',
    params
  });
};
