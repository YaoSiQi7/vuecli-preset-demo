
import axios from '@/utils/axios-request.js'; // 导入http中创建的axios实例

// 获取交易类型list
export function queryTradeType (params) {
  return axios.post(`${'/sysAppinfo/tradeTypes'}`, params);
}
// 获取非实时图表数据
export function queryLocation (params) {
  return axios.post(`${'/chart/queryLocation'}`, params);
}
// 获取场景分布图数据
export function queryOptype (params) {
  return axios.post(`${'/chart/queryOptype'}`, params);
}
// 获取风险事件等级分布图数据
export function queryLevel (params) {
  return axios.post(`${'/chart/queryLevel'}`, params);
}
// 获取风险事件趋势图数据
export function querydate (params) {
  return axios.post(`${'/chart/querydate'}`, params);
}
// 风险大盘--等级占比页面查询接口
export function queryRiskLevel (params) {
  return axios.get(`${'/riskmarket/risklevel'}`, {
    params: params
  });
}
// 风险大盘--场景分布页面查询接口
export function querySceneDistribution (params) {
  return axios.post(`${'/chart/querySceneDistribution'}`, params);
}
// 风险大盘--场景分布页面-切换饼图下拉框
export function changePieSelect (params) {
  return axios.post(`${'/chart/querySceneDistributionWithPie'}`, params);
}

// 风险大盘--风险地区--下拉框接口
export function getDownBox (params) {
  return axios.get(`${'/riskmarket/getdownbox'}`, {
    params: params
  });
}

// 风险大盘--风险地区
export function getRiskAreasData (params) {
  return axios.get(`${'/riskmarket/riskareas'}`, {
    params: params
  });
}

// 风险大盘--风险地区详情
export function getRiskTrendData (params) {
  return axios.get(`${'/riskmarket/risktrend'}`, {
    params: params
  });
}

// 风险时段接口
export function queryRiskTime (params) {
  return axios.post(`${'/riskTime/queryRiskTime'}`, params);
}

// 风险时段详情接口
export function queryRiskTimeDetails (params) {
  return axios.post(`${'/riskTime/queryRiskTimeDetails'}`, params);
}

// 风险时段详情页面，单独折线图查询接口
export function queryRiskTimeDetailsWithLine (params) {
  return axios.post(`${'/riskTime/queryRiskTimeDetailsWithLine'}`, params);
}

// 风险时段详情页面，单独列表查询接口
export function queryRiskTimeDetailsWithTable (params) {
  return axios.post(`${'/riskTime/queryRiskTimeDetailsWithTable'}`, params);
}

// 风险时段详情页面，单独列表查询接口
export function queryRiskTimeChinesization (params) {
  return axios.post(`${'/riskTime/queryRiskTimeChinesization'}`, params);
}
// 场景分布新增策略列表数据
export function querySceneDistributionWithSearch (params) {
  return axios.post(`${'/chart/querySceneDistributionWithSearch'}`, params);
}
// 获取全国城市数据
export function getcity (params) {
  return axios.post(`${'/city/getcity'}`, params);
}
// 获取系统配置风险地图省份
export function getProvinceMap (params) {
  return axios.post(`${'/sysSettiog/fnidDataByKey'}`, params);
}
// 查询地图数据
export function reportMap (params) {
  return axios.post(`${'/riskmarket/reportMap'}`, params);
}
// 导出等级占比
export function exportLevel (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/chart/exportLevel'}`,
    data: params
  });
}
// 导出等级占比下砖
export function exportRiskLevelDetail (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskmarket/exportRiskLevelDetail'}`,
    data: params
  });
}
// 导出城市排名TOP10
export function exportCityRankTOP10 (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskmarket/exportCityRankTOP10'}`,
    data: params
  });
}
// 导出城市排名列表
export function exportCityList (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskmarket/exportCityList'}`,
    data: params
  });
}
// 导出城市排名列表
export function exportDayTrend (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskmarket/exportDayTrend'}`,
    data: params
  });
}
// 导出风险趋势列表
export function exportTrend (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/chart/exportTrend'}`,
    data: params
  });
}
// 导出场景分布
export function exportScenesDistribution (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/chart/exportScenesDistribution'}`,
    data: params
  });
}
// 风险时段
export function exportRiskPeriod (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskTime/exportRiskPeriod'}`,
    data: params
  });
}
// 风险时段趋势
export function exportRiskPeriodTrend (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskTime/exportRiskPeriodTrend'}`,
    data: params
  });
}
// 风险标签
export function exportrisklabel (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/risklabel/exportrisklabel'}`,
    data: params
  });
}
// 风险标签趋势
export function exportrisklabeldetail (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/risklabel/exportrisklabeldetail'}`,
    data: params
  });
}
// 城市排名
export function exportCityRanking (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/chart/exportCityRanking'}`,
    data: params
  });
}
// 场景分布
export function exportSceneDistribution (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/chart/exportSceneDistribution'}`,
    data: params
  });
}
// 工单占比
export function exportRiskOrder (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskOrder/exportRiskOrder'}`,
    data: params
  });
}
// 工单日趋势图(折线图)/列表
export function exportRiskOrderDetail (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskOrder/exportRiskOrderDetail'}`,
    data: params
  });
}
// 风险地图导出
export function exportMap (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskmarket/exportMap'}`,
    data: params
  });
}
// 风险实时数据导出
export function exportRiskRealTimeData (params) {
  return axios({
    method: 'post',
    responseType: 'blob',
    url: `${'/riskmarket/exportRiskRealTimeData'}`,
    data: params
  });
}
