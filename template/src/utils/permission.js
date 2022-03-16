/*
 * @Author: your name
 * @Date: 2021-04-06 10:28:23
 * @LastEditTime: 2021-04-07 14:53:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\utils\permission.js
 */
import store from '@/store';
// 权限
const hasPermission = (value) => {
  let allMenuArray;
  let isActive = false;
  allMenuArray = JSON.parse(localStorage.getItem('childArray'));
  // 判断value是否为一个数组，如是数组，则更改为字符串
  if (Object.prototype.toString.call(value) === '[object Array]') value = value.toString();
  for (let i = 0; i < allMenuArray.length; i++) {
    if (allMenuArray[i].path) {
      switch (allMenuArray[i].path) {
        case localStorage.getItem('getMenu'):
          if (allMenuArray[i].children && allMenuArray[i].children.length) {
            allMenuArray[i].children.forEach(item => {
              switch (item.path) {
                case value:
                  isActive = true;
                  break;
              }
            });
            break;
          }
      }
    }
  }
  return isActive;
};
// 日期转字符串
const dateToString = (date) => {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString();
  var day = date.getDate().toString();
  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }
  var dateTime = year + '-' + month + '-' + day;
  return dateTime;
};
export default {
  install (Vue) {
    // 权限指令
    Vue.directive('btn', {
      bind: (el, binding, vnode) => {
        el.__hasPermission__ = hasPermission(binding.value);
      },
      inserted (el, binding, vnode) {
        const $parent = el.parentNode;
        if (!el.__hasPermission__) $parent.removeChild(el);
      },
      update (el, binding, vnode) {},
      componentUpdated (el, binding, vnode) {},
      unbind (el, binding, vnode) {}
    });

    // 全局mixin
    Vue.mixin({
      methods: {
        hasPermission (value) {
          return hasPermission(value);
        },
        dateToString (date) {
          return dateToString(date);
        }
      }
    });
  }
};
