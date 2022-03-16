/*
  author：古雪瑞
  updateTime：2020-05-11
  适用于案件管理中心页面的查询form和表格表头
*/

// 动账类的查询form
export const ACCOUNT_SEARCH_FORM = [
  { placeholder: '任务编号', value: '', type: 'text' },
  { placeholder: '出账账号', value: '', type: 'text' },
  { placeholder: '入账账号', value: '', type: 'text' },
  {
    placeholder: '交易类型',
    value: '',
    type: 'select',
    options: [{ text: '全部交易类型', value: 'all' }]
  },
  {
    placeholder: '建议策略',
    value: '',
    type: 'select',
    options: [{ text: '全部策略', value: 'all' }]
  },
  {
    placeholder: '任务来源',
    value: '',
    type: 'select',
    options: [{ text: '全部来源', value: 'all' }]
  },
  {
    placeholder: '风控时间',
    value: [],
    type: 'date'
  },
  {
    placeholder: '指派方式',
    value: '',
    type: 'select',
    options: [{ text: '全部方式', value: 'all' }]
  },
  {
    placeholder: '审核流类型',
    value: '',
    type: 'select',
    options: [
      { text: '全部类型', value: 'all' },
      { text: '一级审核流', value: 1 },
      { text: '二级审核流', value: 2 }
    ]
  }
];
// 非动账类的查询form
export const NO_ACCOUNT_SEARCH_FORM = [
  { placeholder: '任务编号', value: '', type: 'text' },
  { placeholder: '用户标识', value: '', type: 'text' },
  { placeholder: '登录账号', value: '', type: 'text' },
  {
    placeholder: '交易类型',
    value: '',
    type: 'select',
    options: [{ text: '全部交易类型', value: 'all' }]
  },
  {
    placeholder: '建议策略',
    value: '',
    type: 'select',
    options: [{ text: '全部策略', value: 'all' }]
  },
  {
    placeholder: '任务来源',
    value: [],
    type: 'select',
    options: [{ text: '全部来源', value: 'all' }]
  },
  {
    placeholder: '生成时间',
    value: '',
    type: 'date'
  },
  {
    placeholder: '指派方式',
    value: '',
    type: 'select',
    options: [{ text: '全部方式', value: 'all' }]
  },
  {
    placeholder: '审核流类型',
    value: '',
    type: 'select',
    options: [
      { text: '全部类型', value: 'all' },
      { text: '一级审核流', value: 1 },
      { text: '二级审核流', value: 2 }
    ]
  }
];

// 动账类的table表头
export const ACCOUNT_TYPE_HEADER = [
  { text: '任务编号', value: 'eventNo', sortable: false, width: 100 },
  { text: '交易类型', value: 'opType', sortable: false, width: 100 },
  { text: '出账账号', value: 'outAccount', sortable: false, width: 100 },
  { text: '入账账号', value: 'inAccount', sortable: false, width: 100 },
  { text: '金额', value: 'amount', sortable: false, width: 100 },
  { text: '建议策略', value: 'strategy', sortable: false, width: 100 },
  { text: '风控时间', value: 'createTime', sortable: false, width: 100 },
  { text: '任务来源', value: 'src', sortable: false, width: 100 },
  { text: '指派方式', value: 'assignStyle', sortable: false, width: 100 },
  { text: '审核流类型', value: 'spLevel', sortable: false, width: 100 },
  { text: '审核结果', value: 'result', sortable: false, width: 100 },
  { text: '操作', value: 'action', sortable: false, width: 100 }
];

// 非动账类的table表头
export const NO_ACCOUNT_TYPE_HEADER = [
  { text: '任务编号', value: 'eventNo', sortable: false, width: 100 },
  { text: '交易类型', value: 'opType', sortable: false, width: 100 },
  { text: '用户标识', value: 'userId', sortable: false, width: 100 },
  { text: '登录账号', value: 'userName', sortable: false, width: 100 },
  { text: '建议策略', value: 'strategy', sortable: false, width: 100 },
  { text: '风控时间', value: 'createTime', sortable: false, width: 100 },
  { text: '任务来源', value: 'src', sortable: false, width: 100 },
  { text: '指派方式', value: 'assignStyle', sortable: false, width: 100 },
  { text: '审核流类型', value: 'spLevel', sortable: false, width: 100 },
  { text: '审核结果', value: 'result', sortable: false, width: 100 },
  { text: '操作', value: 'action', sortable: false, width: 100 }
];

// 动账类查询参数
export const ACCOUNT_SEARCH_DATA = {
  eventNo: '',
  bankCard: '',
  inAccount: '',
  strategy: '',
  beginTime: '',
  endTime: '',
  src: '',
  assignStyle: '',
  spLevel: '',
  isAmount: 1,
  opTypeList: ''
};
// 非动账类查询参数
export const NO_ACCOUNT_SEARCH_DATA = {
  eventNo: '',
  userId: '',
  userName: '',
  strategy: '',
  createTimeStart: '',
  createTimeEnd: '',
  src: '',
  assignStyle: '',
  spLevel: '',
  isAmount: 0,
  opTypeList: ''
};

// 任务详情弹窗中的 -- 用户信息title和键 对应关系
export const convertKeyToTitle = {
  userId: '客户号',
  accState: '账户状态',
  phone: '预留手机号',
  name: '用户名',
  accType: '账户类型',
  email: '电子邮箱',
  papersType: '证件类型',
  outAccount: '出账账号',
  address: '居住地址',
  idNo: '证件号码',
  accountOpen: '开户网点',
  organization: '工作单位'
};

// 案件管理中心点击查询时获取查询参数公共方法
export const getSearchData = params => {
  let searchData = {};
  for (let i = params.length - 1; i >= 0; i--) {
    switch (params[i].placeholder) {
      case '审核结果':
        searchData.result = params[i].value;
        break;
      case '审核流类型':
        searchData.spLevel = params[i].value;
        break;
      case '指派方式':
        searchData.assignStyle = params[i].value;
        break;
      case '事件状态':
        searchData.state = params[i].value;
        break;
      case '任务状态':
        searchData.state = params[i].value;
        break;
      case '风控时间':
        if (params[i].value && params[i].value.length > 0) {
          let dateItems = params[i].value.split(' 至 ');
          searchData.beginTime = dateItems[0] + ' 00:00:00';
          searchData.endTime = dateItems[1] + ' 23:59:59';
        } else {
          searchData.beginTime = '';
          searchData.endTime = '';
        }
        break;
      case '生成时间':
        if (params[i].value && params[i].value.length > 0) {
          let dateItems = params[i].value.split(' 至 ');
          searchData.createTimeStart = dateItems[0] + ' 00:00:00';
          searchData.createTimeEnd = dateItems[1] + ' 23:59:59';
        } else {
          searchData.createTimeStart = '';
          searchData.createTimeEnd = '';
        }
        break;
      case '建议策略':
        searchData.strategy = params[i].value;
        break;
      case '交易类型':
        searchData.opTypeList = params[i].value;
        break;
      case '提报人':
        searchData.eventUser = params[i].value;
        break;
      case '入账账号':
        searchData.inAccount = params[i].value;
        break;
      case '出账账号':
        searchData.outAccount = params[i].value;
        break;
      case '登录账号':
        searchData.userName = params[i].value;
        break;
      case '用户标识':
        searchData.userId = params[i].value;
        break;
      case '事件编号':
        searchData.eventNo = params[i].value;
        break;
      case '任务来源':
        searchData.src = params[i].value;
        break;
      case '任务编号':
        searchData.eventNo = params[i].value;
        break;
      case '当前处理人':
        searchData.nowExecutor = params[i].value;
        break;
      case '所属应用':
        searchData.appidList = params[i].value;
        break;
      case '风险标签':
        searchData.riskLabels = params[i].value;
        break;
      // case '区间金额数据':
      //   searchData.intervalAmount = JSON.stringify([+params[i].minValue, +params[i].maxValue]);
      //   break;
      default:
        break;
    }
  }

  if (searchData.strategy === 'all') {
    searchData.strategy = '';
  }
  if (searchData.src === 'all') {
    searchData.src = '';
  }
  if (searchData.opTypeList === 'all') {
    searchData.opTypeList = '';
  }
  if (
    !searchData.state ||
    searchData.state === 'all' ||
    searchData.state.length === 0
  ) {
    searchData.state = '';
  }
  if (searchData.result === 'all') {
    searchData.result = '';
  }
  if (searchData.spLevel === 'all') {
    searchData.spLevel = '';
  }
  if (searchData.assignStyle === 'all') {
    searchData.assignStyle = '';
  }
  return searchData;
};

// 案件管理中心点击查询时获取查询参数公共方法修改任务状态多选
export const getSearchDatas = params => {
  let searchData = {};
  for (let i = params.length - 1; i >= 0; i--) {
    switch (params[i].placeholder) {
      case '审核结果':
        searchData.result = params[i].value;
        break;
      case '审核流类型':
        searchData.spLevel = params[i].value;
        break;
      case '指派方式':
        searchData.assignStyle = params[i].value;
        break;
      case '事件状态':
        searchData.state = params[i].value;
        break;
      case '任务状态':
        searchData.statesString = params[i].value;
        break;
      case '风控时间':
        if (params[i].value && params[i].value.length > 0) {
          let dateItems = params[i].value.split(' 至 ');
          searchData.beginTime = dateItems[0] + ' 00:00:00';
          searchData.endTime = dateItems[1] + ' 23:59:59';
        } else {
          searchData.beginTime = '';
          searchData.endTime = '';
        }
        break;
      case '生成时间':
        if (params[i].value && params[i].value.length > 0) {
          let dateItems = params[i].value.split(' 至 ');
          searchData.createTimeStart = dateItems[0] + ' 00:00:00';
          searchData.createTimeEnd = dateItems[1] + ' 23:59:59';
        } else {
          searchData.createTimeStart = '';
          searchData.createTimeEnd = '';
        }
        break;
      case '建议策略':
        searchData.strategy = params[i].value;
        break;
      case '交易类型':
        searchData.opTypeList = params[i].value;
        break;
      case '提报人':
        searchData.eventUser = params[i].value;
        break;
      case '入账账号':
        searchData.inAccount = params[i].value;
        break;
      case '出账账号':
        searchData.outAccount = params[i].value;
        break;
      case '登录账号':
        searchData.userName = params[i].value;
        break;
      case '用户标识':
        searchData.userId = params[i].value;
        break;
      case '事件编号':
        searchData.eventNo = params[i].value;
        break;
      case '任务来源':
        searchData.src = params[i].value;
        break;
      case '任务编号':
        searchData.eventNo = params[i].value;
        break;
      case '当前处理人':
        searchData.nowExecutor = params[i].value;
        break;
      case '所属应用':
        searchData.appidList = params[i].value;
        break;
      case '风险标签':
        searchData.riskLabels = params[i].value;
        break;
      // case '区间金额数据':
      //   searchData.intervalAmount = JSON.stringify([+params[i].minValue, +params[i].maxValue]);
      //   break;
      default:
        break;
    }
  }

  if (searchData.strategy === 'all') {
    searchData.strategy = '';
  }
  if (searchData.src === 'all') {
    searchData.src = '';
  }
  if (searchData.opTypeList === 'all') {
    searchData.opTypeList = '';
  }
  if (!searchData.state) {
    searchData.state = '';
  }
  if (
    !searchData.statesString ||
    searchData.statesString === 'all' ||
    searchData.statesString.length === 0
  ) {
    searchData.statesString = '';
  }
  if (searchData.result === 'all') {
    searchData.result = '';
  }
  if (searchData.spLevel === 'all') {
    searchData.spLevel = '';
  }
  if (searchData.assignStyle === 'all') {
    searchData.assignStyle = '';
  }
  return searchData;
};

// 案件管理中心事件提报点击查询时获取查询参数公共方法
export const getReportSearchData = params => {
  let searchData = {};
  for (let i = params.length - 1; i >= 0; i--) {
    switch (params[i].placeholder) {
      case '审核结果':
        searchData.result = params[i].value;
        break;
      case '审核流类型':
        searchData.spLevel = params[i].value;
        break;
      case '指派方式':
        searchData.assignStyle = params[i].value;
        break;
      case '事件状态':
        searchData.state = params[i].value;
        break;
      case '任务状态':
        searchData.state = params[i].value;
        break;
      case '建议策略':
        searchData.strategy = params[i].value;
        break;
      case '交易类型':
        searchData.opType = params[i].value;
        break;
      case '入账账号':
        searchData.inAccount = params[i].value;
        break;
      case '出账账号':
        searchData.outAccount = params[i].value;
        break;
      case '登录账号':
        searchData.userName = params[i].value;
        break;
      case '用户标识':
        searchData.userId = params[i].value;
        break;
      case '事件编号':
        searchData.eventNo = params[i].value;
        break;
      case '事件来源':
        searchData.src = params[i].value;
        break;
      case '任务编号':
        searchData.eventNo = params[i].value;
        break;
      case '当前处理人':
        searchData.nowExecutor = params[i].value;
        break;
      case '提报原因':
        searchData.cause = params[i].value;
        break;
      case '提报人':
        searchData.name = params[i].value;
        break;
      case '提报状态':
        searchData.states = params[i].value;
        break;
      case '提报时间':
        if (params[i].value && params[i].value.length > 0) {
          let dateItems = params[i].value.split(' 至 ');
          searchData.createTimeStart = dateItems[0] + ' 00:00:00';
          searchData.createTimeEnd = dateItems[1] + ' 23:59:59';
        } else {
          searchData.createTimeStart = '';
          searchData.createTimeEnd = '';
        }
        break;
      default:
        break;
    }
  }
  if (searchData.strategy === 'all') {
    searchData.strategy = '';
  }
  if (searchData.src === 'all') {
    searchData.src = '';
  }
  if (searchData.opType === 'all') {
    searchData.opType = '';
  }
  if (searchData.state === 'all') {
    searchData.state = '';
  }
  if (searchData.result === 'all') {
    searchData.result = '';
  }
  if (searchData.spLevel === 'all') {
    searchData.spLevel = '';
  }
  if (searchData.assignStyle === 'all') {
    searchData.assignStyle = '';
  }
  return searchData;
};

// 规则集审核 查询参数公共方法
export const getRuleExamineSearchData = params => {
  let searchData = {};
  for (let i = params.length - 1; i >= 0; i--) {
    switch (params[i].placeholder) {
      case '规则集名称':
        searchData.setName = params[i].value;
        break;
      case '所属公司':
        searchData.organizationId = params[i].value;
        break;
      case '所属应用':
        searchData.appId = params[i].value;
        break;
      case '交易类型':
        searchData.transactionTypeId = params[i].value;
        break;
      case '提交人':
        searchData.creatorName = params[i].value;
        break;
      case '提交时间':
        if (params[i].value && params[i].value.length > 0) {
          let dateItems = params[i].value.split(' 至 ');
          searchData.createTimeStart = dateItems[0] + ' 00:00:00';
          searchData.createTimeEnd = dateItems[1] + ' 23:59:59';
        } else {
          searchData.createTimeStart = '';
          searchData.createTimeEnd = '';
        }
        break;
      case '审核人':
        searchData.auditorsName = params[i].value;
        break;
      case '审核结果':
        searchData.status = params[i].value;
        break;
    }
  }

  if (searchData.organizationId === 'all') {
    searchData.organizationId = '';
  }
  if (searchData.appId === 'all') {
    searchData.appId = '';
  }
  if (searchData.transactionTypeId === 'all') {
    searchData.transactionTypeId = '';
  }
  if (searchData.transactionTypeId === 'all') {
    searchData.transactionTypeId = '';
  }
  if (searchData.transactionTypeId === 'allOfOne') {
    searchData.transactionTypeId = '';
  }
  return searchData;
};

// 批量业务统计击查询时获取查询参数公共方法
export const batchServiceSearch = (params) => {
  let searchData = {};
  for (let i = params.length - 1; i >= 0; i--) {
    switch (params[i].placeholder) {
      case '批次号':
        searchData.batchId = params[i].value;
        break;
      case '出账账号':
        searchData.outAccount = params[i].value;
        break;
      case '出账人姓名':
        searchData.outName = params[i].value;
        break;
      case '交易时间':
        if (params[i].value && params[i].value.length > 0) {
          let dateItems = params[i].value.split(' 至 ');
          searchData.tradeTimeStart = dateItems[0] + ' 00:00:00';
          searchData.tradeTimeEnd = dateItems[1] + ' 23:59:59';
        } else {
          searchData.tradeTimeStart = '';
          searchData.tradeTimeEnd = '';
        }
        break;
      case '业务归属机构':
        searchData.businessOrgCode = params[i].value;
        break;
      case '交易类型':
        searchData.opType = params[i].value;
        break;
      case '风控时间':
        if (params[i].value && params[i].value.length > 0) {
          let dateItems = params[i].value.split(' 至 ');
          searchData.riskTimeStart = dateItems[0] + ' 00:00:00';
          searchData.riskTimeEnd = dateItems[1] + ' 23:59:59';
        } else {
          searchData.riskTimeStart = '';
          searchData.riskTimeEnd = '';
        }
        break;
      case '处置类型':
        searchData.strategy = params[i].value;
        break;
      case '处置策略':
        searchData.strategy = params[i].value;
        break;
      default:
        break;
    }
  }
  if (searchData.opType === 'all') {
    searchData.opType = '';
  }
  if (searchData.strategy === 'all') {
    searchData.strategy = '';
  }
  return searchData;
};
