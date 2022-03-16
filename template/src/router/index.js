/*
  author：Xin Tan
  updateTime：2020-04-27
*/
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index';
// 风控中心
import riskCenterRoutes from './riskCenterRoutes';
// 案件管理中心
import caseCenterRoutes from './caseCenterRoutes';
// 特征算字库
import featureOperatorCenterRoutes from './featureOperatorCenterRoutes';
// 系统管理中心
import sysManageCenterRoutes from './sysManageCenterRoutes';
// 数据管理中心
import dataManageCenterRoutes from './dataManageCenterRoutes';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err);
};
// 登录
const Login = resolve => {
  import('@/views/login').then(module => {
    resolve(module);
  });
};
const Home = resolve => {
  import('@/views/Home').then(module => {
    resolve(module);
  });
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/index',
    name: 'home',
    component: Home,
    children: [
      ...riskCenterRoutes,
      ...caseCenterRoutes,
      ...featureOperatorCenterRoutes,
      ...sysManageCenterRoutes
    ]
  }
];

const router = new VueRouter({
  scrollBehavior: () => ({
    y: 0
  }),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    return;
  }
  localStorage.setItem('getMenu', to.path);
  if (window.g.isSSO && to.path === '/riskMarket') {
    next();
  } else {
    if (localStorage.getItem('token')) { // 判断是否有token
      let routerObj = JSON.parse(localStorage.getItem('routerObj'));// 获取存储的路由
      if (routerObj[to.path]) {
        // 获取所有的菜单信息，查找路由指向的菜单，保存菜单及所属中心
        let childArray = JSON.parse(localStorage.getItem('childArray'));
        let toNext = childArray.find(item => item.path === to.path);
        if (toNext) {
          store.dispatch('setCenterActive', toNext.name); // 存储当前中心到vuex
          sessionStorage.setItem('itemChildren', JSON.stringify(toNext));// 存储当前路由的三级菜单信息
          let menuItems = JSON.parse(JSON.parse(localStorage.getItem('loginData'))[toNext.name]);
          // 获取当前三级菜单所属的二级菜单信息
          let textItem = {};
          let defaultPage = {};
          menuItems.forEach((item) => {
            if (item.children) {
              item.children.forEach((key) => {
                if (key.path === toNext.path && !key.pageType) {
                  textItem = Object.assign({}, item);
                }
                if (toNext.path === '/relationGraph' || toNext.path === '/auditFlowConfig' || toNext.path === '/auditFlowRuleConfig' ||
                  toNext.path === '/separateOrderStrategyManage' || toNext.path === '/splittingPolicyConfig' ||
                  toNext.path === '/accountRisk' || toNext.path === '/businessRisk' || toNext.path === '/enterpriseRisk' || toNext.path === '/accountRiskDetail' ||
                  toNext.path === '/enterpriseRiskDetail' || toNext.path === '/businessRiskDetail' ||
                  toNext.path === '/riskMonitoringTaskList' || toNext.path === '/riskMonitoringTaskDetail' || toNext.path === '/indicatorsDisplayPage') {
                  sessionStorage.removeItem('chipDisable');
                  sessionStorage.setItem('chipDisable', true);
                  store.commit('IFCHIP', sessionStorage.getItem('chipDisable'));
                } else if (toNext.path === '/modelAnalysisMent') {
                  sessionStorage.removeItem('chipDisable');
                  sessionStorage.setItem('chipDisable', true);
                  store.commit('IFCHIP', sessionStorage.getItem('chipDisable'));
                } else {
                  sessionStorage.removeItem('chipDisable');
                  sessionStorage.setItem('chipDisable', false);
                  store.commit('IFCHIP', sessionStorage.getItem('chipDisable'));
                }
                if (key.children) {
                  key.children.forEach((i) => {
                    if (i.path === toNext.path) {
                      textItem = Object.assign({}, item);
                    }
                  });
                }
              });
            }
          });
          sessionStorage.setItem('menuItems', JSON.stringify(menuItems));// 存储当前中心二、三级目录
          store.dispatch('handleChangeNavItems', { // 面包屑导航存储到vuex中
            rootItemPath: menuItems[0],
            item: toNext,
            prevItem: textItem,
            index: toNext.name,
            defaultPage: defaultPage
          });
          if (toNext.children) {
            let pageTabs = toNext.children.filter(item => item.pageType === 'tab');
            store.dispatch('setPageTabs', pageTabs);
          }
          next();
        }
      } else {
        if (sessionStorage.getItem('itemChildren')) {
          next(JSON.parse(sessionStorage.getItem('itemChildren')).path);
        }
        if (to.path === '/login') {
          next();
        }
      }
    } else {
      if (to.path !== '/login') { // 没有token的话让跳转到登录页，并传递当前准备访问的路由
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        next();
      }
    }
  }
});

export default router;
