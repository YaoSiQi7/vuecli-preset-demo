/**
author: 古雪瑞
updateTime: 2020-04-16
**/
import * as types from './mutation-type';
import { getConfig } from 'api/systemConfiguration';

export const changeAppName = function ({ commit }, item) {
  commit(types.SET_APPNAME, item);
  commit(types.SET_APPID, item);
};

export const handleChangeNavItems = function ({ commit }, item) {
  commit(types.SET_NAVITEMS, item);
};

// 跳转页面二级路由
export const toSecondRouterPage = function ({ commit }, item) {
  commit(types.SET_TOSECONDLEVELROUTER, item);
};
// 应用列表
export const setAppList = function ({ commit }, item) {
  commit(types.SET_APPLIST, item);
};

// 页面中的tab
export const setPageTabs = function ({ commit }, item) {
  commit(types.SET_PAGETABS, item);
};

// 选中的中心
export const setCenterActive = function ({ commit }, item) {
  commit(types.SET_CENTERACTIVE, item);
};

// 城市
export const setCityData = function ({ commit }, item) {
  commit(types.SET_CITYDATA, item);
};

// 规则编辑模式
export const ruleEditMode = function ({ commit }, item) {
  console.log(item, 111111);
  if (item) {
    commit(types.RULE_EDITMODE, item);
    return;
  }
  getConfig()
    .then(res => {
      if (res.data.code === 200) {
        let data = res.data.data;
        data.forEach(function (itm) {
          if (itm.ATAGDESCRIPTION === '规则编辑模式配置') {
            sessionStorage.setItem('ruleEditMode', itm.INFO[0].PVALUE);
            commit(types.RULE_EDITMODE, JSON.parse(itm.INFO[0].PVALUE));
          }
        });
      }
    });
};
