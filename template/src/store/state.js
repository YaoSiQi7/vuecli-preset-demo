import { getPwdPolicy } from 'api/login';

/**
author: 古雪瑞
updateTime: 2020-04-16
**/
const state = {
  appName: '',
  appId: '',
  navItems: [
    {
      text: '风控分析中心',
      disabled: true,
      to: '/riskMarket'
    },
    {
      text: '风险大盘',
      disabled: true,
      to: '/riskMarket'
    },
    {
      text: '风险大盘',
      disabled: true,
      to: '/riskMarket'
    }
  ],
  secondLevelRouterItems: {},
  appList: [], // 应用列表数据
  pageTabs: [], // 页面中的tab
  isActive: '', // 选中的中心
  chip: false,
  cityData: [], // 城市
  ruleEditMode: {}, // 规则编辑模式
  pwdPolicy: 0 // 密码复杂策略
};

export default state;
