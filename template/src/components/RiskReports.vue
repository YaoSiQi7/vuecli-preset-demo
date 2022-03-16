<template>
  <div>
    <!-- 历史评分情况 -->
    <div>
      <v-row>
        <v-col cols="12" class="echartsHeaderStaly">
          <span> 历史评分情况 </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="11" class="py-0">
          <base-echarts-search
            :key="newDateLog"
            :fieldList="searchFormLog"
            @search="searchLog($event, 1)"
            @reset="resetSearchDataLog($event)"
            :clearDate="clearDateLog"
          ></base-echarts-search>
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col cols="11" class="py-0">
          <base-search-two
            :key="newDateLog"
            :fieldList="searchForm"
            @search="search($event)"
            @reset="resetSearchData($event)"
            :clearDate="clearDate"
          ></base-search-two>
        </v-col>
      </v-row> -->
      <!-- 折线带色图 -->
      <div>
        <v-row>
          <v-col cols="12">
            <div style="position: relative">
              <div class="scene_echarts">
                <span class="scene_echarts_title">历史评分情况</span>
              </div>
              <div v-if="lineGrossShow && !loading">
                <base-echarts
                  @clickEvent="clickEventLineTop"
                  :optionParam="optionParamBarTriggerNumber"
                ></base-echarts>
              </div>
              <div v-if="!lineGrossShow && !loading" class="no-data-box">
                暂无数据
              </div>
              <div v-if="loading" class="no-data-box">加载中</div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- 风险标签 -->
    <div>
      <v-row>
        <v-col cols="12" class="echartsHeaderStaly">
          <span> 风险标签 </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="11" class="py-0">
          <base-echarts-search
            :key="newDateLabel"
            :fieldList="searchFormLabel"
            @search="searchLabel($event, 2)"
            @reset="resetSearchDataLabel($event)"
            :clearDate="clearDateLabel"
          ></base-echarts-search>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <div style="position: relative">
            <div class="scene_echarts">
              <span class="scene_echarts_title" v-if="templateName === '企业风险监控'">企业风险标签分布</span>
              <span class="scene_echarts_title" v-if="templateName === '商户风险监控'">商户风险标签分布</span>
              <span class="scene_echarts_title" v-if="templateName === '账户风险监控'">账户风险标签分布</span>
            </div>
            <div v-if="pieEnterpriseShow && !pieEnterpriseLoading">
              <base-echarts
                @clickEvent="clickPieEnterpriseOptions"
                :optionParam="pieEnterpriseOptions"
              ></base-echarts>
            </div>
            <div
              v-if="!pieEnterpriseShow && !pieEnterpriseLoading"
              class="no-data-box"
            >
              暂无数据
            </div>
            <div v-if="pieEnterpriseLoading" class="no-data-box">加载中</div>
          </div>
        </v-col>
        <v-col cols="6">
          <div style="position: relative">
            <div class="scene_echarts">
              <span class="scene_echarts_title">交易风险标签分布</span>
            </div>
            <div v-if="pieTransactionShow && !pieTransactionLoading">
              <base-echarts
                @clickEvent="clickPieTransactionOptions"
                :optionParam="pieTransactionOptions"
              ></base-echarts>
            </div>
            <div
              v-if="!pieTransactionShow && !pieTransactionLoading"
              class="no-data-box"
            >
              暂无数据
            </div>
            <div v-if="pieTransactionLoading" class="no-data-box">加载中</div>
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- 交易风险统计 -->
    <div>
      <v-row>
        <v-col cols="12" class="echartsHeaderStaly">
          <span> 交易风险统计 </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="11" class="py-0">
          <base-echarts-search
            :key="newDateStatistice"
            :fieldList="searchFormStatistice"
            @search="searchStatistice($event, 3)"
            @reset="resetSearchDataStatistice($event)"
            @onHandleChange="onHandleChange($event)"
            :clearDate="clearDateStatistice"
          ></base-echarts-search>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div style="position: relative">
            <div class="scene_echarts">
              <span class="scene_echarts_title">事件数量趋势</span>
            </div>
            <div v-if="PieEventTrendShow && !PieEventTrendLoading">
              <base-echarts @clickEvent="clickPieEventTrendOptions" :optionParam="PieEventTrendOptions"></base-echarts>
            </div>
            <div v-if="!PieEventTrendShow && !PieEventTrendLoading" class="no-data-box">暂无数据</div>
            <div v-if="PieEventTrendLoading" class="no-data-box">加载中</div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div style="position: relative">
            <div class="scene_echarts">
              <span class="scene_echarts_title">规则触发数量Top10</span>
            </div>
            <div v-if="barStatisticeShow && !barStatisticeLoading">
              <base-echarts @clickEvent="clickBarStatisticeOptions" :optionParam="barStatisticeOptions"></base-echarts>
            </div>
            <div v-if="!barStatisticeShow && !barStatisticeLoading" class="no-data-box">暂无数据</div>
            <div v-if="barStatisticeLoading" class="no-data-box">加载中</div>
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- 公共弹框提示 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >
      {{ snackbarServeMsg }}
    </v-snackbar>
  </div>
</template>
<script>
import ForceGraph from 'force-graph';
import { queryAppListAll } from 'api/queryHeaderAppList.js';
import * as riskReports from 'api/riskReports.js';
import BaseEcharts from '@c/BaseEcharts';
import BaseEchartsSearch from '@c/BaseEchartsSearch';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
export default {
  name: 'TransactionDetails',
  props: {
    allData: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    // 公共弹框
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '', // success', 'info', 'error' 三种类型
    // 历史评分情况搜索
    clearDateLog: false,
    newDateLog: null,
    searchFormLog: [],
    tradeTypeItems: [],
    // 历史评分情况
    lineGrossShow: false,
    loading: false,
    optionParamBarTriggerNumber: {
      width: '90%',
      height: '500px',
      color: [],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: []
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: []
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: []
    },
    echartsLineLog: {},
    // 风险标签搜索
    newDateLabel: null,
    searchFormLabel: [],
    clearDateLabel: false,
    // 左饼图
    pieEnterpriseShow: false,
    pieEnterpriseLoading: false,
    pieEnterpriseOptions: {
      width: '100%',
      height: '500px',
      color: window.g.echartsBaseColor,
      title: {
        text: '',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        // formatter: '{a} <br/>{b} : {c} ({d}%)'
        formatter: '{b} : {c} ({d}%)'
      },
      // legend: {
      //   orient: 'horizontal',
      //   align: 'auto'
      // },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '50%',
          data: []
        }
      ]
    },
    echartsPieEnterprise: {},
    // 右饼图
    pieTransactionShow: false,
    pieTransactionLoading: false,
    pieTransactionOptions: {
      width: '100%',
      height: '500px',
      color: window.g.echartsBaseColor,
      title: {
        text: '',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        // formatter: '{a} <br/>{b} : {c} ({d}%)'
        formatter: '{b} : {c} ({d}%)'
      },
      // legend: {
      //   orient: 'horizontal',
      //   align: 'auto'
      // },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '50%',
          data: []
        }
      ]
    },
    echartsPieTransaction: {},
    // 交易风险统计搜索
    newDateStatistice: null,
    searchFormStatistice: [
      {
        placeholder: '时间',
        value: [],
        type: 'date',
        clearable: false
      },
      {
        placeholder: '全部应用',
        value: '',
        type: 'select',
        options: []
      },
      {
        placeholder: '全部交易类型',
        value: '',
        type: 'select',
        options: []
      }
    ],
    clearDateStatistice: false,
    // 柱状图
    barStatisticeShow: false,
    barStatisticeLoading: false,
    barStatisticeOptions: {
      width: '100%',
      height: '500px',
      title: {
        text: '规则触发数量Top10',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      // legend: {
      //   show: false,
      //   orient: 'vertical',
      //   left: 'left',
      //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告']
      //   // data: this.allData.pieValChartS
      // },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: '60%',
          color: window.g.echartsBaseColor,
          data: [
            // {
            //   value: 335,
            //   name: '直接访问'
            // },
            // {
            //   value: 310,
            //   name: '邮件营销'
            // },
            // {
            //   value: 234,
            //   name: '联盟广告'
            // },
            // {
            //   value: 135,
            //   name: '视频广告'
            // }
          ]
        }
      ]
    },
    echartsBarStatistice: {},
    // 曲线图
    PieEventTrendShow: false,
    PieEventTrendLoading: false,
    PieEventTrendOptions: {
      width: '100%',
      height: '500px',
      title: {
        text: '规则触发数量Top10',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      // legend: {
      //   show: false,
      //   orient: 'vertical',
      //   left: 'left',
      //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告']
      //   // data: this.allData.pieValChartS
      // },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: '60%',
          color: window.g.echartsBaseColor,
          data: [
            // {
            //   value: 335,
            //   name: '直接访问'
            // },
            // {
            //   value: 310,
            //   name: '邮件营销'
            // },
            // {
            //   value: 234,
            //   name: '联盟广告'
            // },
            // {
            //   value: 135,
            //   name: '视频广告'
            // }
          ]
        }
      ]
    },
    echartsPieEventTrend: {},
    templateName: '', // 来自于哪一个模块的名称
    templateItemData: '', // 来自于某一个模块列表中的一项
    riskTimeRange: [], // 风险监控时间范围
    riskTimeRangeidx1: [] // 历史评分时间范围
  }),
  filters: {},
  computed: {
    ...mapGetters(['appId'])
  },
  components: {
    BaseEcharts,
    BaseEchartsSearch
  },
  created () {
    this.templateItemData = JSON.parse(window.sessionStorage.getItem('tabsQuery'));
    this.riskTimeRange = this.templateItemData.riskTimeRange.split(' 至 ');
    this.riskTimeRangeidx1 = this.timeAdd(JSON.parse(JSON.stringify(this.riskTimeRange)), true);
    console.log(sessionStorage.getItem('tabsName'), this.allData.distinguishName);
    if (sessionStorage.getItem('tabsName') === '商户风险监控' || this.allData.distinguishName === '商户风险监控') {
      this.templateName = '商户风险监控';
    } else if (sessionStorage.getItem('tabsName') === '企业风险监控' || this.allData.distinguishName === '企业风险监控') {
      this.templateName = '企业风险监控';
    } else if (sessionStorage.getItem('tabsName') === '账户风险监控' || this.allData.distinguishName === '账户风险监控') {
      this.templateName = '账户风险监控';
    }
    // this.headers = this.allData.headers;
    this.getTradeTypeList();
  },
  mounted () {
    // Promise.all([this.init()]);
  },
  beforeDestroy () {
    this.myGraph = null;
  },
  methods: {
    // 获取应用场景，即场景管理下的交易类型
    async getTradeTypeList () {
      let param = {
        jsonIds: this.searchFormStatistice[1].value ? JSON.stringify(this.searchFormStatistice[1].value.split(',')) : '[]'
      };
      this.tradeTypeItems = [];
      const response = await riskReports.tradeTypes(param);
      if (response.data.code === 200) {
        let resTradeTypeItems = response.data.data;
        // this.resTradeTypeItems = response.data.data;
        resTradeTypeItems.forEach((item, index, ary) => {
          this.tradeTypeItems.push({
            text: item.tradeName,
            value: item.identifier
          });
        });
        this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
        this.searchTemp();
      } else {
        this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
        this.searchTemp();
      }
    },
    // 获取搜索条件
    searchTemp () {
      this.allApp = [];
      this.allApp = JSON.parse(sessionStorage.getItem('vuexAppList'));
      this.allApp.forEach((item, index) => {
        item.text = item.appName;
        item.value = item.id;
      });
      this.allApp.unshift({ text: '全部应用', value: '' });
      this.$nextTick(() => {
        // 历史评分情况
        this.searchFormLog = [
          {
            type: 'daterange',
            placeholder: '风险评分时间',
            value: this.riskTimeRangeidx1,
            cols: 3,
            options: {
              shortcuts: [
                {
                  text: '今天',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    return [start, end];
                  }
                },
                {
                  text: '近一周',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                    return [start, end];
                  }
                },
                {
                  text: '近一月',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
                    return [start, end];
                  }
                },
                {
                  text: '近一年',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 365);
                    return [start, end];
                  }
                }
              ]
            },
            clearable: false
          }
        ];
        // 风险标签
        this.searchFormLabel = [
          {
            type: 'daterange',
            placeholder: '风险评分时间',
            value: this.riskTimeRange,
            cols: 3,
            options: {
              shortcuts: [
                {
                  text: '今天',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    return [start, end];
                  }
                },
                {
                  text: '近一周',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                    return [start, end];
                  }
                },
                {
                  text: '近一月',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
                    return [start, end];
                  }
                },
                {
                  text: '近一年',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 365);
                    return [start, end];
                  }
                }
              ]
            },
            clearable: false
          }
        ];
        // 交易风险统计
        this.searchFormStatistice = [
          {
            type: 'daterange',
            placeholder: '风险评分时间',
            value: this.riskTimeRange,
            cols: 3,
            options: {
              shortcuts: [
                {
                  text: '今天',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    return [start, end];
                  }
                },
                {
                  text: '近一周',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                    return [start, end];
                  }
                },
                {
                  text: '近一月',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
                    return [start, end];
                  }
                },
                {
                  text: '近一年',
                  value () {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(end.getTime() - 3600 * 1000 * 24 * 365);
                    return [start, end];
                  }
                }
              ]
            },
            clearable: false
          },
          {
            placeholder: '全部应用',
            value: '',
            type: 'select',
            options: this.allApp
          },
          {
            placeholder: '全部交易类型',
            value: '',
            type: 'select',
            options: this.tradeTypeItems
          }
        ];
        this.searchFormGraph = [
          {
            placeholder: '关联关系',
            value: '-1',
            type: 'select',
            options: this.linkRelationship
          },
          {
            placeholder: '关联层级',
            value: '-1',
            type: 'select',
            options: this.linkLevel
          }
        ];
        this.newDateLog = new Date().getTime();
        this.newDateLabel = new Date().getTime();
        this.newDateStatistice = new Date().getTime();
        this.newDateGraph = new Date().getTime();
        this.searchLog(); // 历史评分情况
        this.searchLabel(); // 风险标签
        this.searchStatistice(); // 交易风险统计
        this.searchGraph(); // 图谱
      });
    },
    // 历史评分情况---点击查询
    searchLog ($event) {
      let evt = $event;
      this.initGetData(evt, 1);
    },
    // 风险标签---点击查询
    searchLabel ($event) {
      let evt = $event;
      this.initGetData(evt, 2);
    },
    // 交易风险统计---点击查询
    searchStatistice ($event) {
      let evt = $event;
      this.initGetData(evt, 3);
    },
    // 图谱---点击查询
    searchGraph ($event) {
      let evt = $event;
      this.initGetData(evt, 4);
    },
    // 历史评分情况---重置搜索条件
    resetSearchDataLog ($event) {
      console.log(this.riskTimeRangeidx1);
      this.searchFormLog = [
        {
          type: 'daterange',
          placeholder: '风险评分时间',
          value: this.riskTimeRangeidx1,
          cols: 3,
          options: {
            shortcuts: [
              {
                text: '今天',
                value () {
                  const end = new Date();
                  const start = new Date();
                  return [start, end];
                }
              },
              {
                text: '近一周',
                value () {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                  return [start, end];
                }
              },
              {
                text: '近一月',
                value () {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
                  return [start, end];
                }
              },
              {
                text: '近一年',
                value () {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(end.getTime() - 3600 * 1000 * 24 * 365);
                  return [start, end];
                }
              }
            ]
          },
          clearable: false
        }
      ];
      this.newDateLog = new Date().getTime();
      this.searchLog();
    },
    // 风险标签---重置搜索条件
    resetSearchDataLabel ($event) {
      this.searchFormLabel = [
        {
          type: 'daterange',
          placeholder: '风险评分时间',
          value: this.riskTimeRange,
          cols: 3,
          options: {
            shortcuts: [
              {
                text: '今天',
                value () {
                  const end = new Date();
                  const start = new Date();
                  return [start, end];
                }
              },
              {
                text: '近一周',
                value () {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                  return [start, end];
                }
              },
              {
                text: '近一月',
                value () {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
                  return [start, end];
                }
              },
              {
                text: '近一年',
                value () {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(end.getTime() - 3600 * 1000 * 24 * 365);
                  return [start, end];
                }
              }
            ]
          },
          clearable: false
        }
      ];
      this.newDateLabel = new Date().getTime();
      this.searchLabel();
    },
    // 交易风险统计---重置搜索条件
    resetSearchDataStatistice ($event) {
      this.searchFormStatistice = [
        {
          type: 'daterange',
          placeholder: '风险评分时间',
          value: this.riskTimeRange,
          cols: 3,
          options: {
            shortcuts: [
              {
                text: '今天',
                value () {
                  const end = new Date();
                  const start = new Date();
                  return [start, end];
                }
              },
              {
                text: '近一周',
                value () {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
                  return [start, end];
                }
              },
              {
                text: '近一月',
                value () {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
                  return [start, end];
                }
              },
              {
                text: '近一年',
                value () {
                  const end = new Date();
                  const start = new Date();
                  start.setTime(end.getTime() - 3600 * 1000 * 24 * 365);
                  return [start, end];
                }
              }
            ]
          },
          clearable: false
        },
        {
          placeholder: '全部应用',
          value: '',
          type: 'select',
          options: this.allApp
        },
        {
          placeholder: '交易类型',
          value: '',
          type: 'select',
          options: this.tradeTypeItems
        }
      ];
      this.newDateStatistice = new Date().getTime();
      this.getTradeTypeList();
      this.searchStatistice();
    },
    // 图谱---重置搜索条件
    resetSearchDataGraph ($event) {
      this.searchFormGraph = [
        {
          placeholder: '关联关系',
          value: '',
          type: 'select',
          options: this.linkRelationship
        },
        {
          placeholder: '关联层级',
          value: '',
          type: 'select',
          options: this.linkLevel
        }
      ];
      this.newDateGraph = new Date().getTime();
      this.searchGraph();
    },
    // 历史评分判断日期是否相同
    timeAdd (timeArr, isDefult) {
      let dateTime = new Date(timeArr[1]);
      dateTime = dateTime.setDate(dateTime.getDate() + 1);
      dateTime = new Date(dateTime);
      timeArr[1] = isDefult ? moment(dateTime).format('YYYY-MM-DD') : dateTime;
      return timeArr;
    },
    // 搜索参数
    async initGetData ($event, ix) {
      let params = {};
      if ($event !== undefined) { // 点击了搜索按钮
        if (ix === 3) { // 交易风险统计
          params = Object.assign({}, {
            beginDate: moment($event[0].value[0]).format('YYYY-MM-DD'),
            endDate: moment($event[0].value[1]).format('YYYY-MM-DD'),
            opTypeId: $event[2].value,
            appId: $event[1].value
          });
          params.opTypeId = params.opTypeId ? params.opTypeId : '';
        } else if (ix === 4) { // 关联风险分析
          params = Object.assign({}, {
            // appId: $event[1].value
          });
        } else if (ix === 1) { // 历史评分情况
          // let dateTime = this.timeAdd(JSON.parse(JSON.stringify($event[0].value)));
          let dateTime = $event[0].value;
          params = Object.assign({}, {
            beginDate: moment(dateTime[0]).format('YYYY-MM-DD'),
            endDate: moment(dateTime[1]).format('YYYY-MM-DD')
          });
        } else { // 风险标签
          params = Object.assign({}, {
            beginDate: moment($event[0].value[0]).format('YYYY-MM-DD'),
            endDate: moment($event[0].value[1]).format('YYYY-MM-DD')
          });
        }
        this.queryRiskData(ix, params);
      } else { // 初始化渲染
        this.$nextTick(() => {
          if (ix === 3) {
            // 交易风险统计
            let datesStr = this.searchFormStatistice[0].value;
            params = Object.assign({}, {
              beginDate: moment(datesStr[0]).format('YYYY-MM-DD'),
              endDate: moment(datesStr[1]).format('YYYY-MM-DD'),
              opTypeId: this.searchFormStatistice[2].value,
              appId: this.searchFormStatistice[1].value
            });
            params.opTypeId = params.opTypeId ? params.opTypeId : '';
          } else if (ix === 4) { // 关联风险分析
            params = Object.assign({}, {
              // appId: this.searchFormLog[1].value
            });
          } else if (ix === 1) { // 历史评分情况
            // let datesStr = this.timeAdd(JSON.parse(JSON.stringify(this.searchFormLog[0].value)));
            let datesStr = this.searchFormLog[0].value;
            params = Object.assign({}, {
              /* beginDate: '2021-08-01',
              endDate: '2021-08-04' */
              beginDate: moment(datesStr[0]).format('YYYY-MM-DD'),
              endDate: moment(datesStr[1]).format('YYYY-MM-DD')
            });
          } else if (ix === 2) { // 风险标签
            let datesStr = this.searchFormLabel[0].value;
            params = Object.assign({}, {
              beginDate: moment(datesStr[0]).format('YYYY-MM-DD'),
              endDate: moment(datesStr[1]).format('YYYY-MM-DD')
            });
          }
          this.queryRiskData(ix, params);
        });
      }
    },
    // 调取查询接口
    async queryRiskData (index, params) {
      if (index === 1 && this.templateName === '商户风险监控') { // 历史评分情况
        params = Object.assign({ merId: this.templateItemData.merInfoId }, params);
        const response = await riskReports.findMerHistoryScore(params);
        this.logScore(response);
      } else if (index === 1 && this.templateName === '企业风险监控') {
        params = Object.assign({ entId: this.templateItemData.entInfoId }, params);
        const response = await riskReports.findEntHistoryScore(params);
        this.logScore(response);
      } else if (index === 1 && this.templateName === '账户风险监控') {
        params = Object.assign({ accoId: this.templateItemData.accoInfoId }, params);
        const response = await riskReports.findAccoHistoryScore(params);
        this.logScore(response);
      } else if (index === 2 && this.templateName === '商户风险监控') { // 风险标签
        params = Object.assign({ merId: this.templateItemData.merInfoId }, params);
        const response = await riskReports.findMerRiskLabel(params);
        this.riskLabel(response);
      } else if (index === 2 && this.templateName === '企业风险监控') {
        params = Object.assign({ entId: this.templateItemData.entInfoId }, params);
        const response = await riskReports.findEntRiskLabel(params);
        this.riskLabel(response);
      } else if (index === 2 && this.templateName === '账户风险监控') {
        params = Object.assign({ accoId: this.templateItemData.accoInfoId }, params);
        const response = await riskReports.findAccoRiskLabel(params);
        this.riskLabel(response);
      } else if (index === 3 && this.templateName === '商户风险监控') { // 事件数量趋势
        params = Object.assign({ merId: this.templateItemData.merInfoId }, params);
        for (let i in params) {
          if (!params[i]) {
            delete params[i];
          }
        }
        const response = await riskReports.findMerTransactionRiskStat(params);
        this.incidentTendency(response);
      } else if (index === 3 && this.templateName === '企业风险监控') {
        params = Object.assign({ entId: this.templateItemData.entInfoId }, params);
        const response = await riskReports.findEntTransactionRiskStat(params);
        this.incidentTendency(response);
      } else if (index === 3 && this.templateName === '账户风险监控') {
        params = Object.assign({ accoId: this.templateItemData.accoInfoId }, params);
        const response = await riskReports.findAccoTransactionRiskStat(params);
        this.incidentTendency(response);
      };
    },
    // 历史评分情况-公共渲染图表
    logScore (response) {
      if (response.data.code === 200) {
        if (response.data.data.length > 0) {
          this.lineGrossShow = true;
          this.loading = false;
          let logData = [];
          let logDate = [];
          response.data.data.forEach((item, index, ary) => {
            logDate.push(item.riskTimeStr);
            logData.push(item.source);
          });
          this.echartsLineLog = {
            histogramArray: [
              {
                'data': logData,
                'name': '风险得分'
              }
            ],
            days: logDate
          };
          // 对每一条折线增加渐变色
          this.echartsLineLog.histogramArray.forEach((item, index, ary) => {
            ary[index].type = 'line';
            // ary[index].stack = '总量'; // 代表是否交错。加此属性则会交错，并会累加每一项的值；不加此属性则不会累加
            ary[index].smooth = true;
            ary[index].areaStyle = { // 曲线有交错，删除背景颜色----注释areaStyle:  {}
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0, color: '#89D7BD' // 0% 处的颜色
                  }, {
                    offset: 0.8, color: '#ffffff' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              },
              shadowColor: 'rgba(0, 0, 0, 0)',
              shadowBlur: 101
            };
          });
          // 折线少于余21条，则自动循环初始化颜色的数组
          window.g.echartsBaseColor.forEach((im, ix, ay) => {
            this.echartsLineLog.histogramArray.forEach((m, x, y) => {
              if (x < 21) {
                if (ix === x) {
                  m.areaStyle.color.colorStops[0].color = im;
                }
              }
            });
          });
          this.optionParamBarTriggerNumber = {
            width: '90%',
            height: '500px',
            color: window.g.echartsBaseColor,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            // legend: {
            //   data: this.echartsLineLog.histogramData
            // },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: this.echartsLineLog.days
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: this.echartsLineLog.histogramArray
          };
        } else {
          this.lineGrossShow = false;
          this.loading = false;
        }
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = response.data.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 风险标签-公共渲染图表
    riskLabel (response) {
      if (response.data.code === 200) {
        if (response.data.data.account.length > 0) {
          this.pieEnterpriseShow = true;
          this.pieEnterpriseLoading = false;
          this.echartsPieEnterprise = {
            pieEnterpriseSeriesDate: []
          };
          response.data.data.account.forEach((item, index, ary) => {
            this.echartsPieEnterprise.pieEnterpriseSeriesDate.push(
              {
                value: item.riskLabelNum,
                name: item.riskLabelName ? item.riskLabelName : '数据名称为空，请联系服务商'
              }
            );
            // 待做 riskLabelNum 与value的对应   riskLabelName与 那么的对应关系。
          });
          this.$nextTick(() => {
            this.pieEnterpriseOptions = {
              width: '100%',
              height: '500px',
              color: window.g.echartsBaseColor,
              title: {
                text: '',
                subtext: '',
                left: 'center'
              },
              tooltip: {
                trigger: 'item',
                // formatter: '{a} <br/>{b} : {c} ({d}%)'
                formatter: '{b} : {c} ({d}%)'
              },
              // legend: {
              //   orient: 'horizontal',
              //   align: 'auto'
              // },
              series: [
                {
                  name: '',
                  type: 'pie',
                  radius: '50%',
                  data: this.echartsPieEnterprise.pieEnterpriseSeriesDate
                }
              ]
            };
          });
        } else {
          this.pieEnterpriseShow = false;
          this.pieEnterpriseLoading = false;
        }
        if (response.data.data.transaction.length > 0) {
          this.pieTransactionShow = true;
          this.pieTransactionLoading = false;
          this.echartsPieTransaction = {
            pieTransactionSeriesDate: []
          };
          response.data.data.transaction.forEach((item, index, ary) => {
            this.echartsPieTransaction.pieTransactionSeriesDate.push(
              {
                value: item.riskLabelNum,
                name: item.riskLabelName ? item.riskLabelName : '数据名称为空，请联系服务商'
              }
            );
            // 待做 riskLabelNum 与value的对应   riskLabelName与 那么的对应关系。
          });
          this.$nextTick(() => {
            this.pieTransactionOptions = {
              width: '100%',
              height: '500px',
              color: window.g.echartsBaseColor,
              title: {
                text: '',
                subtext: '',
                left: 'center'
              },
              tooltip: {
                trigger: 'item',
                // formatter: '{a} <br/>{b} : {c} ({d}%)'
                formatter: '{b} : {c} ({d}%)'
              },
              // legend: {
              //   orient: 'horizontal',
              //   align: 'auto'
              // },
              series: [
                {
                  name: '',
                  type: 'pie',
                  radius: '50%',
                  data: this.echartsPieTransaction.pieTransactionSeriesDate
                }
              ]
            };
          });
        } else {
          this.pieTransactionShow = false;
          this.pieTransactionLoading = false;
        }
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = response.data.msg;
        this.snackbarServeColor = 'error';
      }
    },
    incidentTendency (response) {
      if (response.data.code === 200) {
        if (response.data.data.ruleTrigger.length > 0) {
          let xAxisData = [];
          let seriesData = [];
          this.barStatisticeShow = true;
          this.barStatisticeLoading = false;
          response.data.data.ruleTrigger.forEach((item, index, ary) => {
            seriesData.push(
              {
                value: item.ruleTriggerNum,
                name: item.ruleName,
                numb: item.ruleNo
              }
            );
            xAxisData.push(item.ruleNo);
          });
          this.barStatisticeOptions = {
            width: '100%',
            height: '500px',
            title: {
              text: '',
              subtext: '',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: function (params) {
                // <i style="display:inline-block;width:6px;height:6px;vertical-align:middle;margin-right:5px;border-radius:50%;background-color: ${params[0].color}"></i>
                let paramsName = params[0].data.name;
                let step = 30; // 30个字符一行
                let remainder = paramsName.length % step; // 对字符串的长度取行的余数
                let n = (paramsName.length - remainder) / step; // 截完一共多少行（如果余数大于1，则共有n+1行
                let newStr = '';
                for (let i = 0; i < n; i++) {
                  newStr += paramsName.slice(i * step, (i + 1) * step) + '<br />';
                }
                if (remainder > 0) {
                  newStr += paramsName.slice(n * step) + '<br />';
                }
                return (`
                    <ul style="margin: 0; padding: 0;">
                      <li style="list-style: none"><span>规则编号：</span> <span>${params[0].data.numb}</span></li>
                      <li style="list-style: none"><span>规则名称：</span> <span>${newStr}</span></li>
                      <li style="list-style: none"><span>数量：</span> <span>${params[0].value}</span></li>
                    </ul>
                  `);
              }
            },
            xAxis: [
              {
                type: 'category',
                data: xAxisData,
                // data: ['直接访问', '邮件营销', '联盟广告', '视频广告'],
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '',
                type: 'bar',
                barWidth: '60%',
                color: window.g.echartsBaseColor,
                data: seriesData
              }
            ]
          };
        } else {
          this.barStatisticeShow = false;
          this.barStatisticeLoading = false;
        }
        // 折线图
        if (Object.keys(response.data.data.transaction).length > 0) {
          let PieEventTrendSeriesValue = [];
          let PieEventTrendDays = []; // 线图的时间数组
          this.PieEventTrendShow = true;
          this.PieEventTrendLoading = false;
          this.echartsPieEventTrend.PieEventTrendSeriesValue = [];
          this.echartsPieEventTrend.PieEventTrendData = [];
          this.echartsPieEventTrend.PieEventTrendDays = [];
          this.echartsPieEventTrend.PieEventTrendData = Object.keys(response.data.data.transaction);
          this.echartsPieEventTrend.PieEventTrendData.forEach((item, index, ary) => {
            PieEventTrendSeriesValue.push(
              {
                name: item,
                array: response.data.data.transaction[item],
                strategyNum: []
              }
            );
          });
          for (let i = 0; i < PieEventTrendSeriesValue.length; i++) {
            if (PieEventTrendSeriesValue[i].array.length > 0) {
              PieEventTrendSeriesValue[i].array.forEach(item => {
                this.echartsPieEventTrend.PieEventTrendDays.push(item.riskTimeStr); // 线图的时间数组
              });
              break;
            }
          }
          PieEventTrendSeriesValue.forEach((item, index, ary) => {
            item.array.length > 0 && item.array.forEach((i, x, ay) => {
              item.strategyNum.push(i.strategyNum); // 线图的每条线的每一天的值
            });
            this.echartsPieEventTrend.PieEventTrendSeriesValue.push(
              {
                'name': item.name,
                'type': 'line',
                'emphasis': {
                  'scale': true,
                  'focus': 'self'
                },
                'smooth': true,
                'data': item.strategyNum
              }
            );
          });
          this.PieEventTrendOptions = {
            width: '90%',
            height: '500px',
            color: window.g.echartsBaseColor,
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: this.echartsPieEventTrend.PieEventTrendData
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: this.echartsPieEventTrend.PieEventTrendDays
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: this.echartsPieEventTrend.PieEventTrendSeriesValue
          };
        } else {
          this.PieEventTrendShow = false;
          this.PieEventTrendLoading = false;
        }
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = response.data.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 交易风险统计搜索条件change
    async onHandleChange ($event) {
      if ($event.placeholder === this.searchFormStatistice[1].placeholder) {
        let param = {
          jsonIds: this.searchFormStatistice[1].value ? JSON.stringify(this.searchFormStatistice[1].value.split(',')) : '[]'
        };
        const res = await riskReports.tradeTypes(param);
        if (res.data.code === 200) {
          this.tradeTypeItems = [];
          let resTradeTypeItems = res.data.data;
          // this.resTradeTypeItems = response.data.data;
          resTradeTypeItems.forEach((item, index, ary) => {
            this.tradeTypeItems.push({
              text: item.tradeName,
              value: item.identifier
            });
          });
          this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
          this.searchFormStatistice[2].options = this.tradeTypeItems;
        }
      }
      // 修改报错，提示没有index。下方为修改之前的代码
      // } else if (index === 4) {
      //   this.barGraphShow = true;
      //   this.barGraphLoading = false;
      // }
      // });
      // do ajax
      // if (this.appId) {
      //   this.loading = true;
      //   const res = await riskLabelData.queryData(params);
      //   if (res.data.code === 200) {
      //     this.loading = false;
      //     let resData = res.data.data;
      //     this.totalItems = resData.total;
      //     this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      //     this.headers = resData.titleList;
      //     this.desserts = resData.riskLabelPage;
      //   } else {
      //     this.loading = false;
      //   }
      // }
    },
    // 历史评分情况图表点击事件
    clickEventLineTop (data) {
      // this.headers.forEach((item, index, ary) => {
      //   if (data.seriesName === item.text) {
      //     this.baseBlankRiskcontrolLog(data.name, item); // data.name:时间，item: 代表某一项
      //   }
      // });
    },
    // 企业风险标签---左图表点击事件
    clickPieEnterpriseOptions (data) {
      // this.headers.forEach((item, index, ary) => {
      //   if (data.seriesName === item.text) {
      //     this.baseBlankRiskcontrolLog(data.name, item); // data.name:时间，item: 代表某一项
      //   }
      // });
    },
    // 企业风险标签---右图表点击事件
    clickPieTransactionOptions (data) {
      // this.headers.forEach((item, index, ary) => {
      //   if (data.seriesName === item.text) {
      //     this.baseBlankRiskcontrolLog(data.name, item); // data.name:时间，item: 代表某一项
      //   }
      // });
    },
    // 交易风险统计---事件数量趋势
    clickPieEventTrendOptions (data) {
      // this.headers.forEach((item, index, ary) => {
      //   if (data.seriesName === item.text) {
      //     this.baseBlankRiskcontrolLog(data.name, item); // data.name:时间，item: 代表某一项
      //   }
      // });
    },
    // 交易风险统计---规则触发数量Top10
    clickBarStatisticeOptions (data) {
      // this.headers.forEach((item, index, ary) => {
      //   if (data.seriesName === item.text) {
      //     this.baseBlankRiskcontrolLog(data.name, item); // data.name:时间，item: 代表某一项
      //   }
      // });
    },
    // 关联图谱
    init () {
      // this.cardIntoItems = Object.assign(
      //   {},
      //   {
      //     deviceNum: this.graphJson.nodes.filter(
      //       (item) => item.group === "DEVICE"
      //     ).length,
      //     phoneNum: this.graphJson.nodes.filter(
      //       (item) => item.group === "PHONE"
      //     ).length,
      //     ipNum: this.graphJson.nodes.filter((item) => item.group === "IP")
      //       .length,
      //     riskDevice: this.graphJson.nodes.filter(
      //       (item) => item.group === "DEVICE" && item.val
      //     ).length,
      //     riskPhone: this.graphJson.nodes.filter(
      //       (item) => item.group === "PHONE" && item.val
      //     ).length,
      //     riskIp: this.graphJson.nodes.filter(
      //       (item) => item.group === "IP" && item.val
      //     ).length,
      //   }
      // );

      this.graphJson.links.forEach((link) => {
        const a = this.graphJson.nodes[link.source];
        const b = this.graphJson.nodes[link.target];
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b);
        b.neighbors.push(a);

        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(link);
        b.links.push(link);
      });

      const NODE_R = 6;
      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let hoverNode = null;
      const elem = document.getElementById('graph');

      this.myGraph = ForceGraph()(elem)
        .graphData(this.graphJson)
        // .height(this.relGraphHeight)
        .nodeRelSize(NODE_R)
        // .linkDirectionalParticleColor(link => `${link.color}`)
        .nodeId('id')
        .nodeVal('val')
        .nodeAutoColorBy('group')
        // .nodeLabel(node => `节点ID: ${node.value} <br/> 分组: ${node.group} <br/>风险高`)
        .nodeLabel((node) => {
          if (node.val) {
            return `节点ID: ${node.value} <br/> 分组: ${node.group} <br/>风险高`;
          } else {
            return `节点ID: ${node.value} <br/> 分组: ${node.group}`;
          }
        })
        .linkSource('source')
        .linkTarget('target')
        .linkLabel((link) => `${link.value}`)
        // .nodeColor((node) => {
        //   if (node.group === 'PHONE') {
        //     return '#fe8894';
        //   } else if (node.group === 'DEVICE') {
        //     return '#0fcfc8';
        //   } else if (node.group === 'IP') {
        //     return '#f4c79b';
        //   }
        // })
        // eslint-disable-next-line no-return-assign
        .onNodeHover((node) => {
          highlightNodes.clear();
          highlightLinks.clear();
          if (node) {
            highlightNodes.add(node);
            node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
            node.links.forEach((link) => highlightLinks.add(link));
          }

          hoverNode = node || null;
          elem.style.cursor = node ? 'pointer' : null;
        })
        .onLinkHover((link) => {
          highlightNodes.clear();
          highlightLinks.clear();

          if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
          }
        })
        .linkWidth((link) => (highlightLinks.has(link) ? 5 : 1))
        .linkDirectionalParticles(4)
        .linkDirectionalParticleWidth((link) =>
          highlightLinks.has(link) ? 4 : 0
        )
        .nodeCanvasObjectMode((node) =>
          highlightNodes.has(node) ? 'before' : undefined
        )
        .nodeCanvasObject((node, ctx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
          ctx.fillStyle = node === hoverNode ? '#fe8894' : '#f4c79b';
          ctx.fill();
        })
        .onNodeClick((node) => {
          // 点击节点放大
          this.myGraph.centerAt(node.x, node.y, 1000);
          this.myGraph.zoom(4, 1000);
        })
        .onNodeRightClick((node, event) => {
          // 当前点击的节点信息
          this.nodeInfo = Object.assign({}, node);
          this.nodeInfo.linkLength = node.neighbors.length;
          // this.dialog = true;
        });
      // .onLinkRightClick((node, event) => console.log(node, event, elem));
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-border-defu {
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.c-btn {
  text-align: left;
  padding-bottom: 20px;
}

.icon-primary {
  color: var(--v-primary-base) !important;
}

.el-tr-defu:hover {
  background: var(--v-tableRowHoverActive-base);
}

.scene_echarts {
  position: absolute;
  display: inline-block;
  width: 500px;
  z-index: 8;
  font-size: 17px;
  font-weight: bold;
}

.scene_echarts .scene_echarts_title {
  position: relative;
  top: 16px;
  left: 16px;
}

.no-data-box {
  width: 100%;
  height: 532px;
  background: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
}

.echartsHeaderStaly {
  background: var(--v-seeDetailsHeadBgColor-base) !important;
  font-weight: bold;
  font-size: 17px;
}
</style>
