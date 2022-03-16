<!-- author: yijianchao-->
<!-- updateTime: 2020-09-28-->
<template>
  <!-- 风险时段 -->
  <div>
    <!-- 查询条件 -->
    <v-row>
      <v-col cols="11" class="py-0">
        <base-search-two
          :dates="dates"
          :fieldList="searchForm"
          @search="search($event)"
          @reset="resetSearchData($event)"
          :clearDate="clearDate"
        ></base-search-two>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pr-3 py-0">
        <v-hover v-slot="{ hover }">
          <div class="pr">
            <div class="location-text">
              <span>风险时段趋势</span>
            </div>
            <echart-export-file
              :chartId="'riskPeriodId'"
              :hover="hover"
              :fileName="appName + '-风险时段趋势'"
              :isActive="isActiveBtnRiskPeriodTrendEchart"
              @exportExcel="
                exportData(
                  arguments,
                  'excel',
                  'histogram',
                  'isActiveBtnRiskPeriodTrendEchart'
                )
              "
              @exportCSV="
                exportData(
                  arguments,
                  'csv',
                  'histogram',
                  'isActiveBtnRiskPeriodTrendEchart'
                )
              "
              style="position: absolute; right: 220px; top: 10px; z-index: 4"
              v-if="hasPermission(exportRiskPeriodTrendEchartBtn)"
            ></echart-export-file>
            <div style="position: absolute; top: 10px; right: 10px; z-index: 4">
              <!-- <span style="float:left;line-height: 40px;">指标：</span> -->
              <v-select
                v-model="riskHour"
                style="width: 200px; float: left"
                :items="riskHourList"
                required
                no-data-text="没有数据"
                outlined
                dense
                @change="riskHourListChange"
              />
            </div>
            <div>
              <base-echarts
                :chartId="'riskPeriodId'"
                :optionParam="optionParamBarTriggerNumber"
                @clickEvent="clickEventBarTop"
                @legendselectchanged="legendselectchanged"
              ></base-echarts>
            </div>
            <!-- <div
              v-if="!loading && !optionParamBarTriggerNumber"
              class="no-data-box"
            >
              暂无数据
            </div>
            <div v-if="loading" class="no-data-box">加载中</div> -->
          </div>
        </v-hover>
      </v-col>
    </v-row>
    <!-- 表格 -->
    <div class="table-box mb-3">
      <v-hover v-slot="{ hover }">
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="perPageNum"
          no-results-text="没有匹配的数据"
          no-data-text="没有匹配的数据"
          :search="tabelSearch"
          hide-default-footer
          class="elevation-3 mt-3"
          loading-text="加载数据中..."
          :fixed-header="true"
        >
          <!-- 表头 -->
          <template v-slot:top>
            <div style="position: relative">
              <v-toolbar flat height="60px">
                <v-toolbar-title style="font-size: 18px">
                  风险时段趋势
                </v-toolbar-title>
              </v-toolbar>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="
                  appName + '-风险时段趋势列表' + '-' + strategyType.text
                "
                :isActive="isActiveBtnRiskPeriodTrendList"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'list',
                    'isActiveBtnRiskPeriodTrendList'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'list',
                    'isActiveBtnRiskPeriodTrendList'
                  )
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="hasPermission(exportRiskPeriodTrendListBtn)"
              ></echart-export-file>
            </div>
            <div style="height: 60px; overflow: hidden">
              <v-select
                v-model="strategy"
                style="width: 177px !important; margin: 20px 0 20px 20px"
                :items="strategyItemList"
                required
                no-data-text="没有数据"
                outlined
                dense
                @change="changeStrategy"
              />
            </div>
          </template>
          <!-- 分页 -->
          <template v-slot:no-data>
            <div>没有数据</div>
          </template>
          <template v-slot:footer>
            <v-divider></v-divider>
            <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
              <div class="footer__select">
                每页
                <span>
                  <v-select
                    v-model="perPageNum"
                    item-text="fieldName"
                    item-value="fieldField"
                    :items="perPageItems"
                    dense
                    width="27px"
                    no-data-text="没有匹配数据"
                    @change="pageChange"
                  /> </span
                >条
                <span style="margin-left: 15px">共{{ totalItems }}条</span>
                <v-spacer />
                <v-pagination
                  class="d-flex justify-end pagination"
                  v-model="pageNum"
                  :length="queryPageLength"
                  :total-visible="7"
                  @input="onPageChange"
                />
              </div>
            </div>
          </template>
        </v-data-table>
      </v-hover>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import BaseEcharts from '@c/BaseEcharts';
import BaseSearchTwo from '@c/BaseSearchTwo';
import EchartExportFile from '@c/EchartExportFile';
import * as dataService from 'api/riskMarket.js';
import * as riskDetailStatistics from 'api/riskDetailStatistics.js';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import { downloadFile } from '@/utils/downloadFile';
let noneDataOption = {
  width: '100%',
  height: '500px',
  title: {
    text: '暂无数据',
    left: 'center',
    top: 'center',
    textStyle: {
      color: '#000000',
      fontWeight: 'normal',
      fontSize: 14
    }
  }
};
let loadingOption = {
  width: '100%',
  height: '500px',
  title: {
    text: '加载中',
    left: 'center',
    top: 'center',
    textStyle: {
      color: '#000000',
      fontWeight: 'normal',
      fontSize: 14
    }
  }
};
export default {
  data () {
    return {
      riskLegend: {}, // 风险时段详情的图例选中
      loading: false,
      riskHour: '-1', // 风险时段
      riskHourList: [{
        text: '全部时间段',
        value: '-1'
      }, {
        text: '[00:00:00,01:00:00)',
        value: '0'
      }, {
        text: '[01:00:00,02:00:00)',
        value: '1'
      }, {
        text: '[02:00:00,03:00:00)',
        value: '2'
      }, {
        text: '[03:00:00,04:00:00)',
        value: '3'
      }, {
        text: '[04:00:00,05:00:00)',
        value: '4'
      }, {
        text: '[05:00:00,06:00:00)',
        value: '5'
      }, {
        text: '[06:00:00,07:00:00)',
        value: '6'
      }, {
        text: '[07:00:00,08:00:00)',
        value: '7'
      }, {
        text: '[08:00:00,09:00:00)',
        value: '8'
      }, {
        text: '[09:00:00,10:00:00)',
        value: '9'
      }, {
        text: '[10:00:00,11:00:00)',
        value: '10'
      }, {
        text: '[11:00:00,12:00:00)',
        value: '11'
      }, {
        text: '[12:00:00,13:00:00)',
        value: '12'
      }, {
        text: '[13:00:00,14:00:00)',
        value: '13'
      }, {
        text: '[14:00:00,15:00:00)',
        value: '14'
      }, {
        text: '[15:00:00,16:00:00)',
        value: '15'
      }, {
        text: '[16:00:00,17:00:00)',
        value: '16'
      }, {
        text: '[17:00:00,18:00:00)',
        value: '17'
      }, {
        text: '[18:00:00,19:00:00)',
        value: '18'
      }, {
        text: '[19:00:00,20:00:00)',
        value: '19'
      }, {
        text: '[20:00:00,21:00:00)',
        value: '20'
      }, {
        text: '[21:00:00,22:00:00)',
        value: '21'
      }, {
        text: '[22:00:00,23:00:00)',
        value: '22'
      }, {
        text: '[23:00:00,24:00:00)',
        value: '23'
      }],
      strategy: '', // 策略指标
      strategyItemList: [], // 策略指标列表
      dates: [],
      defaultHeight: '500px',
      echartsBarIndex: 0,
      echartsPieIndex: 0,
      // 分页变量
      pageNum: 1,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 查询条件相关
      dateStart: null,
      dateEnd: null,
      isdateShow: false,
      searchValid: true,
      searchForm: [
        {
          placeholder: '时间',
          value: [],
          type: 'date'
        },
        {
          placeholder: '交易类型',
          value: '',
          type: 'select',
          options: []
        }
      ],
      clearDate: false,
      ruleName: '', // 页尾列表的搜索框的值
      allData: [],
      tradeTypeItems: [],
      // 风险时段分布情况
      optionParamBarTriggerNumber: loadingOption,
      headers: [],
      desserts: [],
      tabelSearch: '',
      resTradeTypeItems: [], // 应用场景数组
      isLegendselectchanged: false,
      refreshChart: true, // 是否刷新饼图和柱图
      // 按钮权限
      exportBtn: '/exportRiskPeriodDetailButton', // 导出权限
      exportRiskPeriodTrendEchartBtn: '/exportRiskPeriodTrendEchartButton', // 导出风险时段趋势折线图
      exportRiskPeriodTrendListBtn: '/exportRiskPeriodTrendListButton', // 导出风险时段趋势列表
      isActiveBtnRiskPeriodTrendEchart: true, // 导出按钮是否可以点击
      isActiveBtnRiskPeriodTrendList: true,
      strategyType: { text: '', value: '' }
    };
  },
  computed: {
    ...mapGetters([
      'appId',
      'appName'
    ])
  },
  components: {
    BaseEcharts,
    BaseSearchTwo,
    EchartExportFile
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        this.getTradeTypeList(); // 交易类型
        this.initGetData();
      },
      immediate: true
    }
  },
  mounted () {
    this.initGetData();
  },
  methods: {
    // 导出Excel与csv
    exportData (arg, fileType, graphMark, isActiveBtn) {
      let fileName = arg[0];
      let params = {
        appId: this.appId,
        opType: (this.searchForm[1].value === '' || this.searchForm[1].value === undefined || this.searchForm[1].value === '全部交易类型') ? -1 : this.searchForm[1].value,
        exportType: fileType,
        graphMark: graphMark,
        startTime: moment(this.searchForm[0].value[0]).format('YYYY-MM-DD'),
        endTime: moment(this.searchForm[0].value[1]).format('YYYY-MM-DD'),
        strategy: this.strategy,
        riskHour: this.riskHour
      };
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportRiskPeriodTrend(params).then(res => {
        let blob = new Blob([res.data]);
        downloadFile(blob, fileName);
        this[isActiveBtn] = !this[isActiveBtn];
      }).catch(() => {
        this[isActiveBtn] = !this[isActiveBtn];
      });
    },
    legendselectchanged (data) {
      this.isLegendselectchanged = true;
      this.riskLegend = data.selected;
    },
    // 初始化数据反显
    initGetData () {
      if (Object.keys(this.$route.params).length !== 0) {
        // if (sessionStorage.getItem('riskAreasDetailParams')) {
        this.chartsDataParams = this.$route.params;
        this.searchForm[0].value = [this.chartsDataParams.startTime, this.chartsDataParams.endTime];
        this.dates = [this.chartsDataParams.startTime, this.chartsDataParams.endTime];
        this.searchForm[1].value = this.chartsDataParams.opType === -1 ? '' : this.chartsDataParams.opType;// 交易类型
        this.riskHour = this.chartsDataParams.riskHour.toString(); // 风险时段
      } else {
        let today = new Date();
        let startDay = this.dateToString(today);
        let endDay = this.dateToString(new Date()).substr(0, 10);
        this.searchForm[0].value = [startDay, endDay];
        this.dates = [endDay, endDay];
        this.searchForm[1].value = '';// 交易类型
        this.riskHour = '-1'; // 风险时段
      }
      this.getTradeTypeList(); // 交易类型
    },
    // 获取应用场景，即场景管理下的交易类型
    async getTradeTypeList () {
      if (this.appId) {
        this.tradeTypeItems = [];
        let param = {
          jsonIds: JSON.stringify([this.appId])
        };
        const response = await dataService.queryTradeType(param);
        if (response.data.code === 200) {
          let resTradeTypeItems = response.data.data;
          resTradeTypeItems.forEach((item, index, ary) => {
            this.tradeTypeItems.push({
              text: item.tradeName,
              value: item.id,
              isAmount: item.isAmount,
              identifier: item.identifier
            });
          });
          if (this.tradeTypeItems.length) {
            this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
          }
          this.searchForm[1].options = this.tradeTypeItems;
          this.queryRiskTimeChinesization();// 获取策略下拉列表
        }
      }
    },
    // 获取策略下拉列表
    async queryRiskTimeChinesization () {
      this.strategyItemList = [];
      const response = await dataService.queryRiskTimeChinesization();
      if (response.data.code === 200) {
        this.strategyItemList = response.data.data.titleList;
        // 指标赋默认值
        if (this.chartsDataParams && this.chartsDataParams.title) {
          let strategyObj = this.strategyItemList.find(item => this.chartsDataParams.title === item.text);
          this.strategy = strategyObj.value;
          this.strategyType = this.strategyItemList.find(item => this.strategy === item.value);
        }
        this.search();
      }
    },
    // 点击重置条件
    resetSearchData () {
      this.searchForm = [
        {
          placeholder: '时间',
          value: [],
          type: 'date'
        },
        {
          placeholder: '交易类型',
          value: '',
          type: 'select',
          options: this.tradeTypeItems
        }
      ];
      this.dates = [];
      this.refreshChart = true;
      let today = new Date();
      let startDay = this.dateToString(today);
      let endDay = this.dateToString(new Date()).substr(0, 10);
      this.searchForm[0].value = [startDay, endDay];
      this.doSearch();
    },
    // 点击查询
    search ($event) {
      this.pageNum = 1;
      this.refreshChart = true;
      this.optionParamBarTriggerNumber = loadingOption;// 全国城市排名TOP10
      this.headers = [];
      this.desserts = [];
      this.totalItems = 0;
      this.queryPageLength = 1;
      this.doSearch($event);
    },
    doSearch ($event) {
      let params = {};
      if ($event !== undefined) {
        params = Object.assign({}, {
          startTime: this.dateToString($event[0].value[0]),
          endTime: this.dateToString($event[0].value[1]),
          opType: $event[1].value, // 交易类型
          riskHour: this.riskHour, // 时间段
          strategy: this.strategy, // 指标策略
          appId: this.appId,
          page: this.pageNum,
          pageSize: this.perPageNum
        });
        this.queryRiskData(params);
      } else {
        this.$nextTick(() => {
          let datesStr = this.searchForm[0].value;
          params = Object.assign({}, {
            startTime: datesStr[0],
            endTime: datesStr[1],
            opType: this.searchForm[1].value, // 交易类型
            riskHour: this.riskHour, // 时间段
            strategy: this.strategy, // 指标策略
            appId: this.appId,
            page: this.pageNum,
            pageSize: this.perPageNum
          });
          this.queryRiskData(params);
        });
      }
    },
    // 风险时段切换
    riskHourListChange () {
      this.refreshChart = true;
      this.optionParamBarTriggerNumber = loadingOption;// 全国城市排名TOP10
      let datesStr = this.searchForm[0].value;
      let params = Object.assign({}, {
        startTime: datesStr[0],
        endTime: datesStr[1],
        opType: this.searchForm[1].value, // 交易类型
        riskHour: this.riskHour, // 时间段
        // strategy: this.strategy, // 指标策略
        appId: this.appId,
        page: this.pageNum,
        pageSize: this.perPageNum
      });
      this.queryRiskTimeDetailsWithLine(params);// 单独折线图查询接口
    },
    // 列表策略下拉切换
    changeStrategy (e) {
      this.pageNum = 1;
      this.headers = [];
      this.desserts = [];
      this.totalItems = 0;
      this.queryPageLength = 1;
      let datesStr = this.searchForm[0].value;
      this.strategyType = this.strategyItemList.find(item => e === item.value);
      let params = Object.assign({}, {
        startTime: datesStr[0],
        endTime: datesStr[1],
        opType: this.searchForm[1].value, // 交易类型
        // riskHour: this.riskHour, // 时间段
        strategy: this.strategy, // 指标策略
        appId: this.appId,
        page: this.pageNum,
        pageSize: this.perPageNum
      });
      this.queryRiskTimeDetailsWithTable(params);// 单独折线图查询接口
    },
    // 城市排名TOP10
    clickEventBarTop (data) {
      // this.$router.push('/riskAreasDetail');
    },
    // 列表信息的某一条数据的点击事件
    async tableClick (item) {
      // this.$router.push('/riskAreasDetail');
    },
    // 分页
    onPageChange (page) {
      this.refreshChart = false;
      this.pageNum = page;
      this.doSearch();
    },
    // 页数
    pageChange () {
      this.refreshChart = false;
      this.pageNum = 1; // 默认从第一页开始查询
      this.doSearch();
    },
    async queryRiskData (params) {
      if (this.appId) {
        this.loading = true;
        let opTypeObj = this.tradeTypeItems.find(item => item.value === params.opType);
        params.opType = opTypeObj.identifier ? opTypeObj.identifier : '-1';
        const res = await dataService.queryRiskTimeDetails(params);
        if (res.data.code === 200) {
          this.allData = res.data.data;
          if (this.refreshChart) { // 刷新饼图和柱图
            this.allData.array.forEach((item, index) => {
              item.type = 'line';
              // item.stack = '总量';
              // item.label = {
              //   normal: {
              //     show: true,
              //     position: 'top'
              //   }
              // };
              item.smooth = true;
              item.areaStyle = {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: window.g.echartsBaseColor[index] // 0% 处的颜色
                  }, {
                    offset: 0.8, color: '#ffffff' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                },
                shadowColor: 'rgba(0, 0, 0, 0)',
                shadowBlur: 101
              };
            });
            this.$nextTick(() => {
              // 风险地区---折线图
              this.optionParamBarTriggerNumber = this.allData.array.length ? Object.assign({}, {
                width: '100%',
                height: this.defaultHeight,
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
                  bottom: '0',
                  data: this.allData.data
                },
                grid: {
                  top: '50px',
                  left: '3%',
                  right: '4%',
                  bottom: '8%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    boundaryGap: false,
                    data: this.allData.days
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: this.allData.array
              }) : noneDataOption;
              if (this.chartsDataParams && this.chartsDataParams.title) {
                // 跳转过来显示的图例
                let obja = {};
                this.allData.data.forEach((item, index) => {
                  obja[item] = false;
                  if (this.chartsDataParams.title === item) {
                    obja[item] = true;
                  }
                });
                this.optionParamBarTriggerNumber.legend.selected = obja;
              }
            });
          }
          this.totalItems = this.allData.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          this.allData.titleList.forEach(item => {
            item.sortable = false;
            item.value = item.value.toString();
          });
          // this.strategyItemList = this.allData.titleSearchList;
          this.headers = this.allData.titleList;
          this.headers.forEach((item, index) => {
            let textObj = this.riskHourList.find(val => item.value === val.value);
            if (textObj && textObj.value) {
              item.text = textObj.text;
              item.value = textObj.value;
            }
          });
          this.desserts = this.allData.riskTimeList;
        }
        this.loading = false;
      }
    },
    // 单独查询折线图接口
    async queryRiskTimeDetailsWithLine (params) {
      if (this.appId) {
        let opTypeObj = this.tradeTypeItems.find(item => item.value === params.opType);
        params.opType = opTypeObj.identifier ? opTypeObj.identifier : '-1';
        const res = await dataService.queryRiskTimeDetailsWithLine(params);
        if (res.data.code === 200) {
          this.allData = res.data.data;
          if (this.refreshChart) { // 刷新饼图和柱图
            this.allData.array.forEach((item, index) => {
              item.type = 'line';
              // item.stack = '总量';
              // item.label = {
              //   normal: {
              //     show: true,
              //     position: 'top'
              //   }
              // };
              item.smooth = true;
              item.areaStyle = {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: window.g.echartsBaseColor[index] // 0% 处的颜色
                  }, {
                    offset: 0.8, color: '#ffffff' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                },
                shadowColor: 'rgba(0, 0, 0, 0)',
                shadowBlur: 101
              };
            });
            this.$nextTick(() => {
              // 风险地区---折线图
              this.optionParamBarTriggerNumber = this.allData.array.length ? Object.assign({}, {
                width: '100%',
                height: this.defaultHeight,
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
                  bottom: '0',
                  data: this.allData.data
                },
                grid: {
                  top: '50px',
                  left: '3%',
                  right: '4%',
                  bottom: '8%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    boundaryGap: false,
                    data: this.allData.days
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: this.allData.array
              }) : noneDataOption;
              if (this.isLegendselectchanged) {
                this.optionParamBarTriggerNumber.legend.selected = this.riskLegend;
              } else {
                if (this.chartsDataParams && this.chartsDataParams.title) {
                  // 跳转过来显示的图例
                  let obja = {};
                  this.allData.data.forEach((item, index) => {
                    obja[item] = false;
                    if (this.chartsDataParams.title === item) {
                      obja[item] = true;
                    }
                  });
                  this.optionParamBarTriggerNumber.legend.selected = obja;
                }
              }
            });
          }
        }
      }
    },
    // 单独列表查询接口
    async queryRiskTimeDetailsWithTable (params) {
      if (this.appId) {
        this.loading = true;
        let opTypeObj = this.tradeTypeItems.find(item => item.value === params.opType);
        params.opType = opTypeObj.identifier ? opTypeObj.identifier : '-1';
        const res = await dataService.queryRiskTimeDetailsWithTable(params);// 单独列表查询接口
        if (res.data.code === 200) {
          this.allData = res.data.data;
          this.totalItems = this.allData.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          this.allData.titleList.forEach(item => {
            item.sortable = false;
            item.value = item.value.toString();
          });
          // this.strategyItemList = this.allData.titleSearchList;
          this.headers = this.allData.titleList;
          this.headers.forEach((item, index) => {
            let textObj = this.riskHourList.find(val => item.value === val.value);
            if (textObj && textObj.value) {
              item.text = textObj.text;
              item.value = textObj.value;
            }
          });
          this.desserts = this.allData.riskTimeList;
        }
        this.loading = false;
      }
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
  // width: 500px;
  z-index: 8;
  font-size: 17px;
  font-weight: bold;
}

.scene_echarts .scene_echarts_title {
  position: relative;
  top: 16px;
  left: 16px;
}

.pr {
  position: relative;
}

// 当前省-城市
.location-text {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  font-weight: 700;

  span {
    font-size: 17px;
    margin-right: 20px;
  }
}

.no-data-box {
  width: 100%;
  height: 500px;
  background: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-box {
  >>> .v-data-table__wrapper {
    min-height: 400px;

    .v-data-table-header tr th:first-child {
      min-width: 110px;
    }

    .v-data-table-header tr th:nth-child(2) {
      min-width: 70px;
    }
  }
}
</style>
