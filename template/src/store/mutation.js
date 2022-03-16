/**
author: 古雪瑞
updateTime: 2020-04-16
**/
import * as types from './mutation-type';
import Vue from 'vue';
const state = {};
function deepClone (obj) {
  let newObj = obj instanceof Array ? [] : {};
  for (let i in obj) {
    newObj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
  }
  return newObj;
}
const copyState = deepClone(state); // 拷贝state对象
const matutaions = {
  [types.SET_APPLIST] (state, item) {
    state.appList = item;
  },
  [types.SET_APPNAME] (state, item) {
    state.appName = item.appName;
  },
  [types.SET_APPID] (state, item) {
    state.appId = item.id;
  },
  [types.SET_PAGETABS] (state, item) {
    state.pageTabs = item;
  },
  [types.SET_CENTERACTIVE] (state, item) {
    state.isActive = item;
  },
  [types.SET_NAVITEMS] (state, param) {
    let dataItem = []; // 面包屑导航数据
    let rootItemPath; // 中心下二级菜单的第一个三级菜单path
    if (param.rootItemPath.path) {
      rootItemPath = param.rootItemPath.path;
    } else {
      rootItemPath = param.rootItemPath.children[0].path;
    }
    let currentItem = param.item; // 最后一级菜单内容
    let defaultPage = param.defaultPage;
    let currentPrevItem;// 当前点击的三级菜单所在的二级菜单
    if (param.prevItem) { // 当前三级菜单有二级菜单
      currentPrevItem = param.prevItem;
    }
    // 面包屑第一级中心
    dataItem.push({
      text: currentItem.centerName,
      disabled: true,
      to: rootItemPath
    });
    if (currentPrevItem && currentPrevItem.text) {
      dataItem[0].disabled = false;
      dataItem.push(
        {
          text: currentPrevItem.text,
          disabled: false,
          to: param.prevItem.children[0].path
        },
        {
          text: currentItem.text,
          disabled: true,
          to: currentItem.path
        }
      );
    } else {
      if (defaultPage.text) {
        dataItem.push(
          {
            text: defaultPage.text,
            disabled: true,
            to: defaultPage.path
          },
          {
            text: currentItem.text,
            disabled: true,
            to: currentItem.path
          }
        );
      } else {
        dataItem.push(
          {
            text: currentItem.text,
            disabled: true,
            to: currentItem.path
          }
        );
      }
    }

    Vue.set(state, 'navItems', dataItem);
  },
  [types.SET_TOSECONDLEVELROUTER] (state, item) {
    state.secondLevelRouterItems = Object.assign({}, item);
  },
  [types.RULE_EDITMODE] (state, item) {
    console.log(item, 22222);
    state.ruleEditMode = item;
  },
  [types.SET_CITYDATA] (state, item) {
    state.cityData = item;
  },
  resetState (state) {
    for (let i in copyState) {
      state[i] = copyState[i]; // 递归赋值
    }
  },
  IFCHIP (state, item) {
    state.chip = item;
  },
  updatePwdPolicy (state) {
    state.pwdPolicy++;
  }
};
export default matutaions;
