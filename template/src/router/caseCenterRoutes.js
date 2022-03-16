// 案件管理中心 -- 事件提报
const CaseReport = resolve => {
  import('@/views/caseManagementCenter/caseReport').then(module => {
    resolve(module);
  });
};
// 案件管理中心 -- 事件提报详情页面
const CaseReportDetail = resolve => {
  import('@/views/caseManagementCenter/views/caseReportDetail').then(module => {
    resolve(module);
  });
};
// 案件管理中心 -- 事件提报核查进度
const MergeEventDetail = resolve => {
  import('@/views/caseManagementCenter/views/mergeEventDetail').then(module => {
    resolve(module);
  });
};
// 案件管理中心 -- 案件库
const CaseLibrary = resolve => {
  import('@/views/caseManagementCenter/caseLibrary').then(module => {
    resolve(module);
  });
};
// 案件管理中心 -- 疑似欺诈库
const SuspectedFraudLibrary = resolve => {
  import('@/views/caseManagementCenter/suspectedFraudLibrary').then(module => {
    resolve(module);
  });
};
// 案件管理中心 -- 清白件库
const InnocenceLibrary = resolve => {
  import('@/views/caseManagementCenter/innocenceLibrary').then(module => {
    resolve(module);
  });
};

// 案件管理中心 -- 任务详情页面
const CaseTaskDetail = resolve => {
  import('@/views/caseManagementCenter/views/caseTaskDetail').then(module => {
    resolve(module);
  });
};
// 案件管理中心 -- 已处理任务
const ProcessedTask = resolve => {
  import('@/views/caseManagementCenter/processedTask').then(module => {
    resolve(module);
  });
};

// 案件管理中心 -- 待处理任务
const PendingTask = resolve => {
  import('@/views/caseManagementCenter/pendingTask').then(module => {
    resolve(module);
  });
};

// 案件管理中心 -- 指派or转派公共页面
const DesignateOrTransfer = resolve => {
  import('@/views/caseManagementCenter/views/caseReviewDesignate').then(module => {
    resolve(module);
  });
};

// 案件管理中心 -- 核查趋势
const CheckTrend = resolve => {
  import('@/views/checkMarket/checkTrend').then(module => {
    resolve(module);
  });
};

// 案件管理中心 -- 核查效率
const CheckEfficiency = resolve => {
  import('@/views/checkMarket/checkEfficiency').then(module => {
    resolve(module);
  });
};

const caseRoutes = [
  // 案件管理中心 -- 事件提报
  {
    path: '/caseReport',
    name: 'caseReport',
    component: CaseReport
  },
  // 事件提报详情弹窗
  {
    path: '/caseReportDetail',
    name: 'caseReportDetail',
    component: CaseReportDetail
  },
  // 事件提报核查进度
  {
    path: '/mergeEventDetail',
    name: 'mergeEventDetail',
    component: MergeEventDetail
  },
  // 案件管理中心 -- 待处理任务
  {
    path: '/pendingTask',
    name: 'pendingTask',
    component: PendingTask
  },
  // 案件管理中心 -- 指派or转派
  {
    path: '/designateOrTransfer',
    name: 'designateOrTransfer',
    component: DesignateOrTransfer
  },
  // 案件管理中心 -- 已处理任务
  {
    path: '/processedTask',
    name: 'processedTask',
    component: ProcessedTask
  },
  // 案件管理中心 -- 案件库
  {
    path: '/caseLibrary',
    name: 'caseLibrary',
    component: CaseLibrary
  },
  // 案件管理中心 -- 疑似欺诈库
  {
    path: '/suspectedFraudLibrary',
    name: 'suspectedFraudLibrary',
    component: SuspectedFraudLibrary
  },
  // 案件管理中心 -- 清白件库
  {
    path: '/innocenceLibrary',
    name: 'innocenceLibrary',
    component: InnocenceLibrary
  },
  // 案件管理中心 -- 任务详情页面
  {
    path: '/caseTaskDetail',
    name: 'caseTaskDetail',
    component: CaseTaskDetail
  },
  // 案件管理中心 -- 核查趋势
  {
    path: '/checkTrend',
    name: 'checkTrend',
    component: CheckTrend
  },
  // 案件管理中心 -- 核查效率
  {
    path: '/checkEfficiency',
    name: 'checkEfficiency',
    component: CheckEfficiency
  }
];

export default caseRoutes;
