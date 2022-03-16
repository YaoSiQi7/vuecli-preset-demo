// 特征库
const FeatureLibrary = resolve => {
  import('@/views/featureLibrary/index').then(module => {
    resolve(module);
  });
};
// 算子库
const OperatorLibrary = resolve => {
  import('@/views/operatorLibrary/index').then(module => {
    resolve(module);
  });
};
// 计算指标库
const CalcIndexBase = resolve => {
  import('@/views/featureLibrary/CalcIndexBase').then(module => {
    resolve(module);
  });
};

// 规则集
const RuleSet = resolve => {
  import('@/views/modelManagement/ruleSet').then(module => {
    resolve(module);
  });
};
// 规则审核
const RuleSetVerify = resolve => {
  import('@/views/modelManagement/ruleSetVerify').then(module => {
    resolve(module);
  });
};

// 规则审核详情页面
const RruleCheckDetail = resolve => {
  import('@/views/modelManagement/ruleCheckDetail').then(module => {
    resolve(module);
  });
};
// 规则审核详情里面 规则详情页面
const RuleCheckItemDetail = resolve => {
  import('@/views/modelManagement/ruleCheckItemDetail').then(module => {
    resolve(module);
  });
};
// // 规则审核提交页面
// const RrulSetSubmit = resolve => {
//   import('@/views/modelManagement/ruleSetSubmit').then(module => {
//     resolve(module);
//   });
// };
// // 规则集--变更日志
const ChangeLog = resolve => {
  import('@/views/modelManagement/changeLog').then(module => {
    resolve(module);
  });
};
// 规则列表详情页面
const RuleListDetail = resolve => {
  import('@/views/modelManagement/ruleListDetail').then(module => {
    resolve(module);
  });
};
// 计算指标库-指标详情页面
const CalculateIndexDetails = resolve => {
  import('@/views/featureLibrary/calculateIndexDetails').then(module => {
    resolve(module);
  });
};
// 规则详情页面
const RuleDetail = resolve => {
  import('@/views/modelManagement/ruleDetail').then(module => {
    resolve(module);
  });
};
// 模板参数库
const tempParamLib = resolve => {
  import('@/views/tempManagement/tempParamLib').then(module => {
    resolve(module);
  });
};
// 计算指标模板
const calcIndexTempLib = resolve => {
  import('@/views/tempManagement/calcIndexTempLib').then(module => {
    resolve(module);
  });
};
// 规则模板
const ruleTempLib = resolve => {
  import('@/views/tempManagement/ruleTempLib').then(module => {
    resolve(module);
  });
};

// 名单集
const NameListSet = resolve => {
  import('@/views/nameListManagement/nameListSet').then(module => {
    resolve(module);
  });
};

// 名单数据
const NameListData = resolve => {
  import('@/views/nameListManagement/nameListData').then(module => {
    resolve(module);
  });
};

const featureOperatorCenterRoutes = [
  // 特征库
  {
    path: '/featureLibrary',
    name: 'featureLibrary',
    component: FeatureLibrary,
    children: []
  },
  // 计算指标库
  {
    path: '/calcIndexBase',
    name: 'calcIndexBase',
    component: CalcIndexBase,
    children: []
  },
  // 算子库
  {
    path: '/operatorLibrary',
    name: 'operatorLibrary',
    component: OperatorLibrary,
    children: []
  },
  // 规则集
  {
    path: '/ruleSet',
    name: 'ruleSet',
    component: RuleSet
  },
  // 规则集审核
  {
    path: '/ruleSetVerify',
    name: 'ruleSetVerify',
    component: RuleSetVerify
  },
  // 规则列表详情
  {
    path: '/ruleCheckDetail',
    name: 'ruleCheckDetail',
    component: RruleCheckDetail
  },
  // 规则列表详情内部规则集详情
  {
    path: '/ruleCheckItemDetail',
    name: '/ruleCheckItemDetail',
    component: RuleCheckItemDetail
  },
  // // 规则审核提交页面(测试用)
  // {
  //   path: '/ruleSetSubmit',
  //   name: 'ruleSetSubmit',
  //   component: RrulSetSubmit
  // },
  // 规则集
  {
    path: '/changeLog',
    name: 'changeLog',
    component: ChangeLog
  },
  // 规则列表详情
  {
    path: '/ruleListDetail',
    name: 'ruleListDetail',
    component: RuleListDetail
  },
  // 规则列表详情
  {
    path: '/calculateIndexDetails',
    name: 'calculateIndexDetails',
    component: CalculateIndexDetails
  },
  // 计算指标库---添加和编辑的详情页
  {
    path: '/ruleDetail',
    name: 'ruleDetail',
    component: RuleDetail
  },
  // 模板参数库
  {
    path: '/tempParamLib',
    name: 'tempParamLib',
    component: tempParamLib
  },
  // 计算指标模板
  {
    path: '/calcIndexTempLib',
    name: 'calcIndexTempLib',
    component: calcIndexTempLib
  },
  // 规则模板
  {
    path: '/ruleTempLib',
    name: 'ruleTempLib',
    component: ruleTempLib
  },
  // 名单集
  {
    path: '/nameListSet',
    name: 'nameListSet',
    component: NameListSet
  },
  // 名单数据
  {
    path: '/nameListData',
    name: 'nameListData',
    component: NameListData
  }
];

export default featureOperatorCenterRoutes;
