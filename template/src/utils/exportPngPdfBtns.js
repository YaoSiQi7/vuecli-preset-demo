const btns = [
  // 风控分析中心-风险大盘-风险大盘
  {
    url: '/riskMarket',
    chartId: 'mapchart',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDP_QQFB',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskMarket',
    chartId: 'mapchart',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDP_QQFB',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  {
    url: '/riskMarket',
    chartId: 'riskEventLevelPercent',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDP_DJZB',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskMarket',
    chartId: 'riskEventLevelPercent',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDP_DJZB',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-等级占比详情
  {
    url: '/levelPercentage',
    chartId: 'levelPercentageRate',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDP_DJZBXQ_DJZB',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/levelPercentage',
    chartId: 'levelPercentageRate',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDP_DJZBXQ_DJZB',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  {
    url: '/levelPercentage',
    chartId: 'levelPercentageNum',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDP_DJZBXQ_DJSL',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/levelPercentage',
    chartId: 'levelPercentageNum',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDP_DJZBXQ_DJSL',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-风险地区
  {
    url: '/riskAreas',
    chartId: 'riskAreasTOPId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDQ_CSPM',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskAreas',
    chartId: 'riskAreasTOPId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDQ_CSPM',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  {
    url: '/riskAreas',
    chartId: 'riskAreasCityRate',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDQ_CSZB',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskAreas',
    chartId: 'riskAreasCityRate',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDQ_CSZB',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  {
    url: '/riskAreas',
    chartId: 'riskAreasCityNum',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDQ_CSSL',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskAreas',
    chartId: 'riskAreasCityNum',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXDQ_CSSL',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-风险趋势详情
  {
    url: '/riskAreasDetail',
    chartId: 'riskAreasDetailId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXQSXQ_RQST',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskAreasDetail',
    chartId: 'riskAreasDetailId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXQSXQ_RQST',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-风险时段
  {
    url: '/riskPeriod',
    chartId: 'riskPeriodId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXSD_FXSDFB',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskPeriod',
    chartId: 'riskPeriodId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXSD_FXSDFB',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-风险时段详情
  {
    url: '/riskPeriodDetail',
    chartId: 'riskPeriodId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXSDXQ_FXSDQS',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskPeriodDetail',
    chartId: 'riskPeriodId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXSDXQ_FXSDQS',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-场景分布
  {
    url: '/sceneDistribution',
    chartId: 'sceneDistributionPie',
    moduleCode: 'FKFXZX.FXDPCATALOG.CJFB_CJFBBZT',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/sceneDistribution',
    chartId: 'sceneDistributionPie',
    moduleCode: 'FKFXZX.FXDPCATALOG.CJFB_CJFBBZT',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  {
    url: '/sceneDistribution',
    chartId: 'sceneDistributionNum',
    moduleCode: 'FKFXZX.FXDPCATALOG.CJFB_CJFBSL',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/sceneDistribution',
    chartId: 'sceneDistributionNum',
    moduleCode: 'FKFXZX.FXDPCATALOG.CJFB_CJFBSL',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-风险标签
  {
    url: '/riskLabel',
    chartId: 'pie',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXBQ_FXBQFBQK',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskLabel',
    chartId: 'pie',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXBQ_FXBQFBQK',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  {
    url: '/riskLabel',
    chartId: 'bar',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXBQ_CHBQFB',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskLabel',
    chartId: 'bar',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXBQ_CHBQFB',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-风险标签详情
  {
    url: '/riskLabelDetail',
    chartId: 'riskLabelDetailId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXBQXQ_FXBQQS',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskLabelDetail',
    chartId: 'riskLabelDetailId',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXBQXQ_FXBQQS',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-风险工单
  {
    url: '/riskOrder',
    chartId: 'riskOrderRate',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXGD_GDZB',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskOrder',
    chartId: 'riskOrderRate',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXGD_GDZB',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  {
    url: '/riskOrder',
    chartId: 'riskOrderScence',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXGD_GDCJFB',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskOrder',
    chartId: 'riskOrderScence',
    moduleCode: 'FKFXZX.FXDPCATALOG.FXGD_GDCJFB',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-风险大盘-工单监控详情页
  {
    url: '/riskOrderDetail',
    chartId: 'riskOrderDetailTrend',
    moduleCode: 'FKFXZX.FXDPCATALOG.GDJKXQY_GDRQST',
    btnCode: 'EXPORT_PNG',
    type: 'PNG'
  },
  {
    url: '/riskOrderDetail',
    chartId: 'riskOrderDetailTrend',
    moduleCode: 'FKFXZX.FXDPCATALOG.GDJKXQY_GDRQST',
    btnCode: 'EXPORT_PDF',
    type: 'PDF'
  },
  // 风控分析中心-效能分析-规则监控
  {
    url: '/riskDetailStatistics',
    type: 'PNG',
    moduleCode: 'FKFXZX.XNFX.GZJK_GZCFSLZZT',
    btnCode: 'EXPORT_PNG',
    chartId: 'riskDetailStatisticsRuleTriggerBar'
  },
  {
    url: '/riskDetailStatistics',
    type: 'PDF',
    moduleCode: 'FKFXZX.XNFX.GZJK_GZCFSLZZT',
    btnCode: 'EXPORT_PDF',
    chartId: 'riskDetailStatisticsRuleTriggerBar'
  },
  {
    url: '/riskDetailStatistics',
    type: 'PNG',
    moduleCode: 'FKFXZX.XNFX.GZJK_GZCFSLBT',
    btnCode: 'EXPORT_PNG',
    chartId: 'riskDetailStatisticsRuleTriggerPie'
  },
  {
    url: '/riskDetailStatistics',
    type: 'PDF',
    moduleCode: 'FKFXZX.XNFX.GZJK_GZCFSLBT',
    btnCode: 'EXPORT_PDF',
    chartId: 'riskDetailStatisticsRuleTriggerPie'
  },
  {
    url: '/riskDetailStatistics',
    type: 'PNG',
    moduleCode: 'FKFXZX.XNFX.GZJK_GZQRAJSHZZT',
    btnCode: 'EXPORT_PNG',
    chartId: 'riskDetailStatisticsRuleConfirmBar'
  },
  {
    url: '/riskDetailStatistics',
    type: 'PDF',
    moduleCode: 'FKFXZX.XNFX.GZJK_GZQRAJSHZZT',
    btnCode: 'EXPORT_PDF',
    chartId: 'riskDetailStatisticsRuleConfirmBar'
  },
  {
    url: '/riskDetailStatistics',
    type: 'PNG',
    moduleCode: 'FKFXZX.XNFX.GZJK_GZQRANSLBT',
    btnCode: 'EXPORT_PNG',
    chartId: 'riskDetailStatisticsRuleConfirmNumsPie'
  },
  {
    url: '/riskDetailStatistics',
    type: 'PDF',
    moduleCode: 'FKFXZX.XNFX.GZJK_GZQRANSLBT',
    btnCode: 'EXPORT_PDF',
    chartId: 'riskDetailStatisticsRuleConfirmNumsPie'
  },
  // 案件管理中心-核查大盘-核查趋势
  {
    url: '/checkTrend',
    type: 'PNG',
    moduleCode: 'AJGLZX.HCDP.HCQS_HCDSLQS',
    btnCode: 'EXPORT_PNG',
    chartId: 'checkTrendCheckListQuantity'
  },
  {
    url: '/checkTrend',
    type: 'PDF',
    moduleCode: 'AJGLZX.HCDP.HCQS_HCDSLQS',
    btnCode: 'EXPORT_PDF',
    chartId: 'checkTrendCheckListQuantity'
  },
  {
    url: '/checkTrend',
    type: 'PNG',
    moduleCode: 'AJGLZX.HCDP.HCQS_HCDJGFB',
    btnCode: 'EXPORT_PNG',
    chartId: 'checkTrendResults'
  },
  {
    url: '/checkTrend',
    type: 'PDF',
    moduleCode: 'AJGLZX.HCDP.HCQS_HCDJGFB',
    btnCode: 'EXPORT_PDF',
    chartId: 'checkTrendResults'
  },
  {
    url: '/checkTrend',
    type: 'PNG',
    moduleCode: 'AJGLZX.HCDP.HCQS_ANLXFB',
    btnCode: 'EXPORT_PNG',
    chartId: 'checkTrendCaseType'
  },
  {
    url: '/checkTrend',
    type: 'PDF',
    moduleCode: 'AJGLZX.HCDP.HCQS_ANLXFB',
    btnCode: 'EXPORT_PDF',
    chartId: 'checkTrendCaseType'
  },
  {
    url: '/checkTrend',
    type: 'PNG',
    moduleCode: 'AJGLZX.HCDP.HCQS_LHSLQS',
    btnCode: 'EXPORT_PNG',
    chartId: 'checkTrendBlackList'
  },
  {
    url: '/checkTrend',
    type: 'PDF',
    moduleCode: 'AJGLZX.HCDP.HCQS_LHSLQS',
    btnCode: 'EXPORT_PDF',
    chartId: 'checkTrendBlackList'
  },
  //  案件管理中心-核查大盘-核查效率
  {
    url: '/checkEfficiency',
    type: 'PNG',
    moduleCode: 'AJGLZX.HCDP.HCXL_ZRWSL',
    btnCode: 'EXPORT_PNG',
    chartId: 'checkEfficiencyTaskTop'
  },
  {
    url: '/checkEfficiency',
    type: 'PDF',
    moduleCode: 'AJGLZX.HCDP.HCXL_ZRWSL',
    btnCode: 'EXPORT_PDF',
    chartId: 'checkEfficiencyTaskTop'
  },
  {
    url: '/checkEfficiency',
    type: 'PNG',
    moduleCode: 'AJGLZX.HCDP.HCXL_YCLRWSL',
    btnCode: 'EXPORT_PNG',
    chartId: 'checkEfficiencyProcessedTop'
  },
  {
    url: '/checkEfficiency',
    type: 'PDF',
    moduleCode: 'AJGLZX.HCDP.HCXL_YCLRWSL',
    btnCode: 'EXPORT_PDF',
    chartId: 'checkEfficiencyProcessedTop'
  }
];
export default btns;
