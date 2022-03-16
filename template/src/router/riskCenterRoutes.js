// 风控日志
const riskControlLog = resolve => {
  import('@/views/logManagement/riskControlLog').then(module => {
    resolve(module);
  });
};
// 批量业务统计
const batchServiceStatistics = resolve => {
  import('@/views/logManagement/batchServiceStatistics').then(module => {
    resolve(module);
  });
};
// 批量业务详情
const batchServiceDetails = resolve => {
  import('@/views/logManagement/batchServiceDetails').then(module => {
    resolve(module);
  });
};
// 规则明细统计
const riskDetailStatistics = resolve => {
  import('@/views/logManagement/riskDetailStatistics').then(module => {
    resolve(module);
  });
};
// 规则明细统计-查看图标
const riskDetailViewingReports = resolve => {
  import('@/views/logManagement/riskDetailViewingReports').then(module => {
    resolve(module);
  });
};
// 风险监控任务
const riskMonitoringTaskList = resolve => {
  import('@/views/performanceAnalysis/riskMonitoringTask/riskList').then(module => {
    resolve(module);
  });
};
// 风险监控任务编辑
const riskMonitoringTaskDetail = resolve => {
  import('@/views/performanceAnalysis/riskMonitoringTask/riskDetail').then(module => {
    resolve(module);
  });
};
// 工单日志
const orderLog = resolve => {
  import('@/views/logManagement/repairOrderLog').then(module => {
    resolve(module);
  });
};
// 风险大盘页
const RiskMarket = resolve => {
  import('@/views/riskCenter/riskMarket').then(module => {
    resolve(module);
  });
};

// 风险地区
const RiskAreas = resolve => {
  import('@/views/riskCenter/riskAreas').then(module => {
    resolve(module);
  });
};

// 风险地区详情
const RiskAreasDetail = resolve => {
  import('@/views/riskCenter/riskAreasDetail').then(module => {
    resolve(module);
  });
};
// 风险时段
const RiskPeriod = resolve => {
  import('@/views/riskCenter/riskPeriod').then(module => {
    resolve(module);
  });
};

// 风险时段详情
const RiskPeriodDetail = resolve => {
  import('@/views/riskCenter/riskPeriodDetail').then(module => {
    resolve(module);
  });
};

// 场景管理
const sceneManagement = resolve => {
  import('@/views/sceneManagement/sceneManagement').then(module => {
    resolve(module);
  });
};

// 场景策略配置页
const SceneStrategy = resolve => {
  import('@/views/sceneManagement/sceneStrategy').then(module => {
    resolve(module);
  });
};

// 风险趋势
const RiskTrend = resolve => {
  import('@/views/riskCenter/riskTrend').then(module => {
    resolve(module);
  });
};

// 关联图谱
const RelationGraph = resolve => {
  import('@/views/riskCenter/relationGraph').then(module => {
    resolve(module);
  });
};

// 3D关联图谱
const ThreeDGraph = resolve => {
  import('@/views/graphCenter/relGraph').then(module => {
    resolve(module);
  });
};

// 客户查询
const CustomerSearch = resolve => {
  import('@/views/customerSearch/customerSearch').then(module => {
    resolve(module);
  });
};

// 客户查询详情
const DetailUserInfo = resolve => {
  import('@/views/customerSearch/detailUserInfo').then(module => {
    resolve(module);
  });
};
// 风险标签
const RiskLabel = resolve => {
  import('@/views/riskTemplater/riskLabel').then(module => {
    resolve(module);
  });
};
// 风险标签详情页
const RiskLabelDetail = resolve => {
  import('@/views/riskTemplater/riskLabelDetail').then(module => {
    resolve(module);
  });
};
// 风险工单
const RiskOrder = resolve => {
  import('@/views/riskTemplater/riskOrder').then(module => {
    resolve(module);
  });
};
// 风险工单详情页
const RiskOrderDetail = resolve => {
  import('@/views/riskTemplater/riskOrderDetail').then(module => {
    resolve(module);
  });
};

// 等级占比页面
const LevelPercentage = resolve => {
  import('@/views/riskCenter/levelPercentage').then(module => {
    resolve(module);
  });
};

// 场景分布
const SceneDistribution = resolve => {
  import('@/views/riskCenter/sceneDistribution').then(module => {
    resolve(module);
  });
};
// 账户风险监控
// const AccountRiskStatistics = resolve => {
//   import('@/views/riskCenter/accountRiskStatistics').then(module => {
//     resolve(module);
//   });
// };
// // 账户风险详情
// const AccountDetail = resolve => {
//   import('@/views/riskCenter/accountDetail').then(module => {
//     resolve(module);
//   });
// };
//
// 账户风险
const accountRisk = resolve => {
  import('@/views/performanceAnalysis/accountRisk/riskList').then(module => {
    resolve(module);
  });
};
// 账户详情
const accountRiskDetail = resolve => {
  import('@/views/performanceAnalysis/accountRisk/riskDetail').then(module => {
    resolve(module);
  });
};
// 商户风险
const businessRisk = resolve => {
  import('@/views/performanceAnalysis/businessRisk/riskList').then(module => {
    resolve(module);
  });
};
// 企业风险
const enterpriseRisk = resolve => {
  import('@/views/performanceAnalysis/enterpriseRisk/riskList').then(module => {
    resolve(module);
  });
};

// 模型运行结果
const ModelRunningResults = resolve => {
  import('@/views/modelMonitoring/modelRunningResults').then(module => {
    resolve(module);
  });
};
// 模型分析看板
const ModelAnalysisMent = resolve => {
  import('@/views/analysisCenterModel/modelAnalysisMent').then(module => {
    resolve(module);
  });
};

// 模型运行结果详情列表
const ModelRunningResultsDetails = resolve => {
  import('@/views/modelMonitoring/modelRunningResultsDetails').then(module => {
    resolve(module);
  });
};
// 计算指标展示页
const IndicatorsDisplayPage = resolve => {
  import('@/views/analysisCenterModel/indicatorsDisplayPage').then(module => {
    resolve(module);
  });
};
// 模型运行结果详情列表信息
const ModelRunningResultsDetailsInfo = resolve => {
  import('@/views/modelMonitoring/modelRunningResultsDetailsInfo').then(module => {
    resolve(module);
  });
};

export default [
  // 场景管理
  {
    path: '/sceneManagement',
    name: 'sceneManagement',
    component: sceneManagement
  },
  {
    path: '/sceneStrategy',
    name: 'sceneStrategy',
    component: SceneStrategy
  },
  // 风控日志
  {
    path: '/riskControlLog',
    name: 'riskControlLog',
    component: riskControlLog
  },
  // 批量业务统计
  {
    path: '/batchServiceStatistics',
    name: 'batchServiceStatistics',
    component: batchServiceStatistics
  },
  // 批量业务详情
  {
    path: '/batchServiceDetails',
    name: 'batchServiceDetails',
    component: batchServiceDetails
  },
  // 规则明细统计
  {
    path: '/riskDetailStatistics',
    name: 'riskDetailStatistics',
    component: riskDetailStatistics
  },
  // 规则明细统计-查看图表
  {
    path: '/riskDetailViewingReports',
    name: 'riskDetailViewingReports',
    component: riskDetailViewingReports
  },
  // 风险监控任务
  {
    path: '/riskMonitoringTaskList',
    name: 'riskList',
    component: riskMonitoringTaskList
  },
  // 风险监控任务编辑
  {
    path: '/riskMonitoringTaskDetail',
    name: 'riskDetail',
    component: riskMonitoringTaskDetail
  },
  // 工单日志
  {
    path: '/orderLog',
    name: 'orderLog',
    component: orderLog
  },
  // 风险大盘
  {
    path: '/riskMarket',
    name: 'riskMarket',
    component: RiskMarket
  },
  // 关联图谱
  {
    path: '/relationGraph',
    name: 'relationGraph',
    component: RelationGraph
  },
  // 3D 关联图谱
  {
    path: '/3dgraph',
    name: '3dgraph',
    component: ThreeDGraph
  },
  // 客户查询
  {
    path: '/customerSearch',
    name: 'customerSearch',
    component: CustomerSearch
  },
  // 客户查询详情
  {
    path: '/detailUserInfo',
    name: 'detailUserInfo',
    component: DetailUserInfo
  },
  // 风险标签
  {
    path: '/riskLabel',
    name: 'riskLabel',
    component: RiskLabel
  },
  // 风险标签详情页
  {
    path: '/riskLabelDetail',
    name: 'riskLabelDetail',
    component: RiskLabelDetail
  },
  // 风险工单
  {
    path: '/riskOrder',
    name: 'riskOrder',
    component: RiskOrder
  },
  // 风险工单详情页
  {
    path: '/riskOrderDetail',
    name: 'riskOrderDetail',
    component: RiskOrderDetail
  },
  // 等级占比
  {
    path: '/levelPercentage',
    name: 'levelPercentage',
    component: LevelPercentage
  },
  // 场景分布
  {
    path: '/sceneDistribution',
    name: 'sceneDistribution',
    component: SceneDistribution
  },
  // 风险地区
  {
    path: '/riskAreas',
    name: 'riskAreas',
    component: RiskAreas
  },
  // 风险地区详情
  {
    path: '/riskAreasDetail',
    name: 'riskAreasDetail',
    component: RiskAreasDetail
  },
  // 风险时段
  {
    path: '/riskPeriod',
    name: 'riskPeriod',
    component: RiskPeriod
  },
  // 风险时段详情
  {
    path: '/riskPeriodDetail',
    name: 'riskPeriodDetail',
    component: RiskPeriodDetail
  },
  // 账户风险
  {
    path: '/accountRisk',
    name: 'accountRisk',
    component: accountRisk
  },
  // 企业风险详情
  {
    path: '/enterpriseRiskDetail',
    name: 'enterpriseRiskDetail',
    component: accountRiskDetail
  },
  // 账户风险详情
  {
    path: '/accountRiskDetail',
    name: 'accountRiskDetail',
    component: accountRiskDetail
  },

  // 商户风险详情
  {
    path: '/businessRiskDetail',
    name: 'businessRiskDetail',
    component: accountRiskDetail
  },
  // 商户风险
  {
    path: '/businessRisk',
    name: 'businessRisk',
    component: businessRisk
  },
  // 企业风险
  {
    path: '/enterpriseRisk',
    name: 'enterpriseRisk',
    component: enterpriseRisk
  },
  // 模型运行结果
  {
    path: '/modelRunningResults',
    name: 'modelRunningResults',
    component: ModelRunningResults
  },
  // 模型分析看板
  {
    path: '/modelAnalysisMent',
    name: 'modelAnalysisMent',
    component: ModelAnalysisMent
  },
  // 模型运行结果详情列表
  {
    path: '/modelRunningResultsDetails',
    name: 'modelRunningResultsDetails',
    component: ModelRunningResultsDetails
  },
  // 计算指标展示页
  {
    path: '/indicatorsDisplayPage',
    name: 'indicatorsDisplayPage',
    component: IndicatorsDisplayPage
  },
  // 模型运行结果详情列表信息
  {
    path: '/modelRunningResultsDetailsInfo',
    name: 'modelRunningResultsDetailsInfo',
    component: ModelRunningResultsDetailsInfo
  }
];
