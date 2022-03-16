// 应用管理
const ApplyManage = resolve => {
  import('@/views/systemManagementCenter/ApplyManage').then(module => {
    resolve(module);
  });
};
// 授权管理
const authorizeManage = resolve => {
  import('@/views/systemManagementCenter/authorizeManage').then(module => {
    resolve(module);
  });
};
// 公司管理
const CompanyManage = resolve => {
  import('@/views/systemManagementCenter/CompanyManage').then(module => {
    resolve(module);
  });
};
// 机构管理
const OrganizationManage = resolve => {
  import('@/views/systemManagementCenter/OrganizationManage').then(module => {
    resolve(module);
  });
};
// 用户管理
const UserManage = resolve => {
  import('@/views/systemManagementCenter/UserManage').then(module => {
    resolve(module);
  });
};
// 菜单管理
const MenuManage = resolve => {
  import('@/views/resourceManagement/MenuManage').then(module => {
    resolve(module);
  });
};
// 角色管理
const RoleManage = resolve => {
  import('@/views/resourceManagement/RoleManage').then(module => {
    resolve(module);
  });
};
// 用户权限管理
const userPrivileges = resolve => {
  import('@/views/privilegeManagement/userPrivileges').then(module => {
    resolve(module);
  });
};
// 机构权限管理
const organizationPrivileges = resolve => {
  import('@/views/privilegeManagement/organizationPrivileges').then(module => {
    resolve(module);
  });
};
// 应用权限管理
const applicationPrivileges = resolve => {
  import('@/views/privilegeManagement/applicationPrivileges').then(module => {
    resolve(module);
  });
};
// 配置管理--交易类型配置
const transactionTypeConfig = resolve => {
  import('@/views/configurationManagement/transactionTypeConfig').then(module => {
    resolve(module);
  });
};
// 配置管理--角色类型配置
const roleManageConfig = resolve => {
  import('@/views/configurationManagement/roleManageConfig').then(module => {
    resolve(module);
  });
};
// 字段配置管理
const fieldConfig = resolve => {
  import('@/views/systemManagementCenter/fieldConfig').then(module => {
    resolve(module);
  });
};

//  新版风控日志详情弹窗
const newRiskLogConfigDetail = resolve => {
  import('@/views/systemManagementCenter/views/newRiskLogConfigDetail').then(module => {
    resolve(module);
  });
};

// 工单库日志配置
const workOrderConfig = resolve => {
  import('@/views/systemManagementCenter/views/workOrderConfig').then(module => {
    resolve(module);
  });
};

// 系统管理中心--预警策略配置
const EarlyWarningStrategyConfiguration = resolve => {
  import('@/views/forewarningManagement/EarlyWarningStrategyConfiguration').then(module => {
    resolve(module);
  });
};
// 系统管理中心--预警策略模板管理
const EarlyWarningPolicyTemplateManagement = resolve => {
  import('@/views/forewarningManagement/EarlyWarningPolicyTemplateManagement').then(module => {
    resolve(module);
  });
};
// 系统管理中心--预警模板管理
const EarlyWarningTemplateManagement = resolve => {
  import('@/views/forewarningManagement/templateAdministration/index').then(module => {
    resolve(module);
  });
};
// 系统管理中心--预警群组管理
const EarlyWarningGroupManagement = resolve => {
  import('@/views/forewarningManagement/groupAdministration/index').then(module => {
    resolve(module);
  });
};

// 配置管理--超时配置
const systemConfiguration = resolve => {
  import('@/views/configurationManagement/systemConfiguration').then(module => {
    resolve(module);
  });
};

// 配置管理--接口配置
const interfaceConfiguration = resolve => {
  import('@/views/configurationManagement/interfaceConfiguration').then(module => {
    resolve(module);
  });
};

// 配置管理--黑名单策略配置
const BlackListStrategyConfig = resolve => {
  import('@/views/configurationManagement/blackListStrategyConfig').then(module => {
    resolve(module);
  });
};

// 系统日志--接口日志
const interfaceLog = resolve => {
  import('@/views/systemLog/interfaceLog').then(module => {
    resolve(module);
  });
};

// 分单管理--审核流配置
const auditFlowConfig = resolve => {
  import('@/views/separateManagement/auditFlowConfig').then(module => {
    resolve(module);
  });
};
// 分单管理--审核流规则配置
const auditFlowRuleConfig = resolve => {
  import('@/views/separateManagement/auditFlowRuleConfig').then(module => {
    resolve(module);
  });
};
// 分单管理--分单策略管理
const separateOrderStrategyManage = resolve => {
  import('@/views/separateManagement/separateOrderStrategyManage').then(module => {
    resolve(module);
  });
};
// 分单管理--分单策略配置
const splittingPolicyConfig = resolve => {
  import('@/views/separateManagement/splittingPolicyConfig').then(module => {
    resolve(module);
  });
};
// 规则同步--规则导出
const ruleExport = resolve => {
  import('@/views/ruleSynchronization/ruleExport').then(module => {
    resolve(module);
  });
};
// 规则同步--规则导入
const ruleImport = resolve => {
  import('@/views/ruleSynchronization/ruleImport').then(module => {
    resolve(module);
  });
};

// 系统操作日志--系统操作日志
const systemOperationLog = resolve => {
  import('@/views/systemOperationLog/systemOperationLog').then(module => {
    resolve(module);
  });
};

// 系统错误日志--系统错误日志
const systemErrorLog = resolve => {
  import('@/views/systemErrorLog/systemErrorLog').then(module => {
    resolve(module);
  });
};

const sysManageCenterRoutes = [
  // 应用管理
  {
    path: '/applyManage',
    name: 'applyManage',
    component: ApplyManage
  },
  // 授权管理
  {
    path: '/authorizeManage',
    name: 'authorizeManage',
    component: authorizeManage
  },
  // 公司管理
  {
    path: '/companyManage',
    name: 'companyManage',
    component: CompanyManage
  },
  // 机构管理
  {
    path: '/organizationManage',
    name: 'organizationManage',
    component: OrganizationManage
  },
  // 用户管理
  {
    path: '/userManage',
    name: 'userManage',
    component: UserManage
  },
  // 配置管理--交易类型配置
  {
    path: '/transactionTypeConfig',
    name: 'transactionTypeConfig',
    component: transactionTypeConfig
  },
  // 配置管理--角色类型配置
  {
    path: '/roleManageConfig',
    name: 'roleManageConfig',
    component: roleManageConfig
  },
  // 配置管理--超时配置
  {
    path: '/systemConfiguration',
    name: 'systemConfiguration',
    component: systemConfiguration
  },
  // 资源管理--菜单管理
  {
    path: '/menuManage',
    name: 'menuManage',
    component: MenuManage
  },
  // 资源管理--角色管理
  {
    path: '/roleManage',
    name: 'roleManage',
    component: RoleManage
  },
  // 权限管理--用户权限管理
  {
    path: '/userPrivileges',
    name: 'userPrivileges',
    component: userPrivileges
  },
  // 权限管理--机构权限管理
  {
    path: '/organizationPrivileges',
    name: 'organizationPrivileges',
    component: organizationPrivileges
  },
  // 权限管理--应用权限管理
  {
    path: '/applicationPrivileges',
    name: 'applicationPrivileges',
    component: applicationPrivileges
  },
  // 配置管理
  {
    path: '/fieldConfig',
    name: 'fieldConfig',
    component: fieldConfig
  },
  {
    path: '/fieldConfigDetail',
    name: 'riskLogConfigDetail',
    component: newRiskLogConfigDetail
  },
  // 系统管理中心--预警策略配置
  {
    path: '/earlyWarningStrategyConfiguration',
    name: 'earlyWarningStrategyConfiguration',
    component: EarlyWarningStrategyConfiguration
  },
  // 系统管理中心--预警策略配置
  {
    path: '/earlyWarningPolicyTemplateManagement',
    name: 'earlyWarningPolicyTemplateManagement',
    component: EarlyWarningPolicyTemplateManagement
  },
  // 系统管理中心--预警模板管理
  {
    path: '/earlyWarningTemplateManagement',
    name: 'earlyWarningTemplateManagement',
    component: EarlyWarningTemplateManagement
  },
  // 系统管理中心--预警群组管理
  {
    path: '/earlyWarningGroupManagement',
    name: 'earlyWarningGroupManagement',
    component: EarlyWarningGroupManagement
  },
  // 配置管理--接口配置
  {
    path: '/interfaceConfiguration',
    name: 'interfaceConfiguration',
    component: interfaceConfiguration
  },
  // 系统日志--接口日志
  {
    path: '/interfaceLog',
    name: 'interfaceLog',
    component: interfaceLog
  },
  // 系统操作日志--系统操作日志
  {
    path: '/systemOperationLog',
    name: 'systemOperationLog',
    component: systemOperationLog
  },
  // 系统错误日志--系统错误日志
  {
    path: '/systemErrorLog',
    name: 'systemErrorLog',
    component: systemErrorLog
  },
  // 配置管理--黑名单策略配置
  {
    path: '/blackListStrategyConfig',
    name: 'blackListStrategyConfig',
    component: BlackListStrategyConfig
  },
  // 分单管理--审核流配置
  {
    path: '/auditFlowConfig',
    name: 'auditFlowConfig',
    component: auditFlowConfig
  },
  // 分单管理--审核流规则配置
  {
    path: '/auditFlowRuleConfig',
    name: 'auditFlowRuleConfig',
    component: auditFlowRuleConfig
  },
  // 分单管理--分单策略管理
  {
    path: '/separateOrderStrategyManage',
    name: 'separateOrderStrategyManage',
    component: separateOrderStrategyManage
  },
  // 分单管理--分单策略配置
  {
    path: '/splittingPolicyConfig',
    name: 'splittingPolicyConfig',
    component: splittingPolicyConfig
  },
  // 规则同步--规则导出
  {
    path: '/ruleExport',
    name: 'ruleExport',
    component: ruleExport
  },
  // 规则同步--规则导入
  {
    path: '/ruleImport',
    name: 'ruleImport',
    component: ruleImport
  }
];

export default sysManageCenterRoutes;
