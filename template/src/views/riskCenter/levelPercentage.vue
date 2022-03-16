<!-- author: 古雪瑞-->
<!-- updateTime: 2020-10-14-->
<template>
  <!-- 等级占比 -->
  <div>
    <!-- 查询条件 -->
    <v-row>
      <v-col cols="11" class="py-0">
        <base-search-two
          :key="newDate"
          :dates="dates"
          :fieldList="searchForm"
          @search="search($event)"
          @reset="resetSearchData($event)"
          :clearDate="clearDate"
        ></base-search-two>
      </v-col>
    </v-row>
    <!-- 图表 -->
    <div>
      <v-row>
        <!-- 等级占比饼图 -->
        <v-col cols="6">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <div class="scene_echarts">
                <span class="scene_echarts_title">等级占比</span>
              </div>
              <echart-export-file
                :chartId="'levelPercentageRate'"
                :hover="hover"
                :fileName="appName + '-等级占比'"
                :isActive="isActiveBtnGradeRito"
                @exportExcel="
                  exportData(arguments, 'excel', 'pie', 'isActiveBtnGradeRito')
                "
                @exportCSV="
                  exportData(arguments, 'csv', 'pie', 'isActiveBtnGradeRito')
                "
                style="position: absolute; top: 8px; right: 20px; z-index: 4"
                v-if="hasPermission(exportRiskMarketGradeRitoBtn)"
              ></echart-export-file>
              <div>
                <base-echarts
                  :chartId="'levelPercentageRate'"
                  :optionParam="optionParamPieTriggerNumber"
                  @clickEvent="toRiskDetailFun($event, 1)"
                ></base-echarts>
              </div>
              <!-- <div
                v-if="!loading && !optionParamPieTriggerNumber"
                class="no-data-box"
              >
                暂无数据
              </div> -->
              <!-- <div v-if="loading" class="no-data-box">加载中</div> -->
            </div>
          </v-hover>
        </v-col>
        <!-- 等级占比柱状图 -->
        <v-col cols="6">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <div class="scene_echarts">
                <span class="scene_echarts_title">等级占比</span>
              </div>
              <echart-export-file
                :chartId="'levelPercentageNum'"
                :hover="hover"
                :fileName="appName + '-等级数量'"
                :isActive="isActiveBtnGradeNum"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'histogram',
                    'isActiveBtnGradeNum'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'histogram',
                    'isActiveBtnGradeNum'
                  )
                "
                style="position: absolute; top: 8px; right: 20px; z-index: 4"
                v-if="hasPermission(exportRiskMarketGradeNumBtn)"
              ></echart-export-file>
              <div>
                <base-echarts
                  :chartId="'levelPercentageNum'"
                  :optionParam="optionParamBarTriggerNumber"
                  @clickEvent="toRiskDetailFun($event, 2)"
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
    </div>
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
          :loading="loading"
          loading-text="加载数据中..."
          hide-default-footer
          class="elevation-1"
        >
          <!-- 表头 -->
          <template v-slot:top>
            <div style="position: relative">
              <v-toolbar flat height="60px">
                <v-toolbar-title style="font-size: 18px">
                  风险等级
                </v-toolbar-title>
              </v-toolbar>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="appName + '-风险等级列表'"
                :isActive="isActiveBtnGradeList"
                @exportExcel="
                  exportData(arguments, 'excel', 'list', 'isActiveBtnGradeList')
                "
                @exportCSV="
                  exportData(arguments, 'csv', 'list', 'isActiveBtnGradeList')
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="hasPermission(exportRiskMarketGradeListBtn)"
              ></echart-export-file>
            </div>
          </template>
          <template v-slot:item.strategyNum="{ item }">
            <span class="hand-signals" @click="toRiskDetailFun(item, 3)" dark>{{
              item.strategyNum
            }}</span>
          </template>
          <template v-slot:item.proportion="{ item }">
            <span class="hand-signals" @click="toRiskDetailFun(item, 3)" dark>{{
              item.proportion
            }}</span>
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
      loading: false,
      dates: [], // 时间
      echartsBarIndex: 0,
      echartsPieIndex: 0,
      // 分页变量
      pageNum: 1,
      queryPageLength: 1,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 查询条件相关
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
      allData: [],
      tradeTypeItems: [],
      dateItems: [
        { text: '今天', value: '' },
        { text: '近一周', value: -7 },
        { text: '近一月', value: -30 },
        { text: '近一年', value: -365 }
      ],
      // 等级占比-柱状图
      optionParamBarTriggerNumber: noneDataOption,
      // 等级占比-饼图
      optionParamPieTriggerNumber: noneDataOption,
      headers: [
        {
          text: '风险等级',
          align: 'start',
          sortable: false,
          value: 'strategy',
          width: '100'
        },
        { text: '数量', value: 'strategyNum', sortable: false, width: '100' },
        { text: '占比', value: 'proportion', sortable: false, width: '100' }
      ],
      desserts: [],
      tabelSearch: '',
      // 查看图表的公共弹窗的变量
      riskViewingReportsRiskInfo: {},
      riskViewingReportsHeaders: [],
      riskViewingReportsData: [],
      newDate: null,
      vuexAppList: [],
      // appName: '', // 应用中文名称
      transactionTypeText: '', // 应用场景中文名称
      resTradeTypeItems: [], // 应用场景数组
      scenesId: '',
      riskViewingReportsParams: {},
      refreshChart: true, // 是否刷新饼图和柱图
      // 按钮权限
      exportBtn: '/exportRiskMarketGradeRatioButton', // 导出权限
      exportRiskMarketGradeRitoBtn: '/exportRiskMarketGradeRitoButton', // 导出等级占比
      exportRiskMarketGradeNumBtn: '/exportRiskMarketGradeNumButton', // 导出等级数量
      exportRiskMarketGradeListBtn: '/exportRiskMarketGradeListButton', // 导出风险等级列表
      isActiveBtnGradeRito: true, // 导出按钮是否可以点击
      isActiveBtnGradeNum: true,
      isActiveBtnGradeList: true
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
        Promise.all([
          this.getTradeTypeList(),
          this.initGetData(),
          this.search()
        ]);
      },
      immediate: true
    }
  },
  mounted () {
    Promise.all([
      this.getTradeTypeList(),
      this.initGetData(),
      this.search()
    ]);
  },
  methods: {
    // 导出等级占比Excel与csv
    exportData (arg, fileType, chartType, isActiveBtn) {
      let fileName = arg[0];
      let params = {
        fileType: fileType,
        exportObj: chartType,
        startTime: moment(this.searchForm[0].value[0]).format('YYYY-MM-DD'),
        endTime: moment(this.searchForm[0].value[1]).format('YYYY-MM-DD'),
        appId: this.appId,
        opType: this.searchForm[1].value ? this.searchForm[1].value : '-1'
      };
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportRiskLevelDetail(params).then(res => {
        let blob = new Blob([res.data]);
        downloadFile(blob, fileName);
        this[isActiveBtn] = !this[isActiveBtn];
      }).catch(() => {
        this[isActiveBtn] = !this[isActiveBtn];
      });
    },
    // 初始化数据反显
    initGetData () {
      if (Object.keys(this.$route.params).length !== 0) {
        // if (sessionStorage.getItem('riskAreasDetailParams')) {
        let chartsDataParams = this.$route.params;
        this.searchForm[0].value = [chartsDataParams.startTime, chartsDataParams.endTime];
        this.dates = [chartsDataParams.startTime, chartsDataParams.endTime];
        this.searchForm[1].value = chartsDataParams.opType === -1 ? '' : chartsDataParams.opType;// 交易类型
      } else {
        let today = new Date();
        let startDay = this.dateToString(today);
        let endDay = this.dateToString(new Date()).substr(0, 10);
        this.searchForm[0].value = [startDay, endDay];
        this.dates = [startDay, endDay];
        this.searchForm[1].value = '';// 交易类型
      }
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
              isAmount: item.isAmount
            });
          });
          if (this.tradeTypeItems.length) {
            this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
          }
          this.searchForm[1].options = this.tradeTypeItems;
        }
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
      this.doSearch($event);
    },
    doSearch ($event) {
      let params = {};
      if ($event !== undefined) {
        params = Object.assign({}, {
          startTime: moment($event[0].value[0]).format('YYYY-MM-DD'),
          endTime: moment($event[0].value[1]).format('YYYY-MM-DD'),
          opType: $event[1].value ? $event[1].value : '-1',
          appId: this.appId,
          pageIndex: this.pageNum,
          pageSize: this.perPageNum
        });
        this.queryRiskData(params);
      } else {
        this.$nextTick(() => {
          let datesStr = this.searchForm[0].value;
          // 解决更改base-search-two组件后产生的日期报错，删除了以下代码。
          // if (typeof (this.searchForm[0].value[0]) === 'object') {
          //   this.searchForm[0].value[0] = this.dateToString(this.searchForm[0].value[0]);
          // }
          // if (typeof (this.searchForm[0].value[1]) === 'object') {
          //   this.searchForm[0].value[1] = this.dateToString(this.searchForm[0].value[1]);
          // }
          params = Object.assign({}, {
            startTime: this.dateToString(datesStr[0]),
            endTime: this.dateToString(datesStr[1]),
            opType: this.searchForm[1].value ? this.searchForm[1].value : '-1',
            appId: this.appId,
            pageIndex: this.pageNum,
            pageSize: this.perPageNum
          });
          this.queryRiskData(params);
        });
      }
    },
    // 饼图、柱状图、列表跳转风险区域详情页面方法
    toRiskDetailFun (data, type) {
      // 跳转风险趋势详情页
      let strategy = '';
      switch (type) {
        case 1:// 饼图
          strategy = data.data.name;
          break;
        case 2: // 柱状图
          strategy = data.name;
          break;
        case 3: // 列表
          strategy = data.strategy;
          break;
        default:
          break;
      }
      let datesStr = this.searchForm[0].value;
      let params = {
        startTime: datesStr[0], // 开始时间
        endTime: datesStr[1], // 结束时间
        opType: this.searchForm[1].value, // 交易类型
        appId: this.appId, // 应用id
        title: strategy,
        province: ''
      };
      // sessionStorage.setItem('riskAreasDetailParams', JSON.stringify(params));
      // this.$router.push('/riskAreasDetail');
      this.$router.push({
        name: 'riskAreasDetail',
        params: params
      });
    },
    // 分页
    onPageChange (page) {
      this.refreshChart = false;
      this.pageNum = page;
      this.doSearch();
    },
    // 页
    pageChange () {
      this.refreshChart = false;
      this.pageNum = 1; // 默认从第一页开始查询
      this.doSearch();
    },
    async queryRiskData (params) {
      if (this.appId) {
        this.loading = true;
        // 饼图
        this.optionParamPieTriggerNumber = this.allData.pieList && this.allData.pieList.length ? this.optionParamPieTriggerNumber : loadingOption;
        // 柱状图
        this.optionParamBarTriggerNumber = this.allData.histogram && this.allData.histogram.length ? this.optionParamBarTriggerNumber : loadingOption;
        const res = await dataService.queryRiskLevel(params);
        if (res.data.code === 200) {
          this.allData = res.data.data;
          if (this.refreshChart) { // 刷新饼图和柱图
            this.$nextTick(() => {
              // 等级占比----柱图
              this.optionParamBarTriggerNumber = this.allData.histogram.length ? Object.assign({}, {
                width: '100%',
                height: '500px',
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                color: [
                  '#89D7BD',
                  '#4F8BE8',
                  '#ECCAA1',
                  '#EE8F97'
                ],
                title: {
                  text: '',
                  subtext: '',
                  left: 'left'
                },
                legend: {
                  data: ['动账', '非动账'],
                  bottom: 0
                },
                grid: {
                  left: '3%',
                  bottom: '8%',
                  containLabel: true
                },
                xAxis: {
                  type: 'value'
                },
                yAxis: {
                  type: 'category',
                  data: this.allData.histogram.reverse(),
                  axisTick: {
                    alignWithLabel: true
                  }
                },
                series: [
                  {
                    name: '动账',
                    type: 'bar',
                    stack: '总量',
                    // label: {
                    //   show: true,
                    //   position: 'insideRight'
                    // },
                    data: this.allData.histogramDz.reverse()
                  },
                  {
                    name: '非动账',
                    type: 'bar',
                    stack: '总量',
                    // label: {
                    //   show: true,
                    //   position: 'insideRight'
                    // },
                    data: this.allData.histogramFdz.reverse()
                  }
                ]
              }) : noneDataOption;
              // 等级占比-----饼图
              let legends = [];
              let legendsColor = [];
              if (this.allData.pieList.length > 0) {
                this.allData.pieList.forEach(item => {
                  legends.push(item.name);
                });
                legends.forEach((item, index, ary) => {
                  switch (item) {
                    case '自动放行':
                      legendsColor.push('#89D7BD');
                      break;
                    case '加强认证':
                      legendsColor.push('#4F8BE8');
                      break;
                    case '人工审核':
                      legendsColor.push('#ECCAA1');
                      break;
                    case '自动阻断':
                      legendsColor.push('#EE8F97');
                      break;
                    default:
                      break;
                  }
                });
              }
              this.optionParamPieTriggerNumber = this.allData.pieList.length ? Object.assign({}, {
                width: '100%',
                height: '500px',
                tooltip: {
                  trigger: 'item',
                  formatter: '{b} : {c} ({d}%)'
                },
                color: legendsColor,
                grid: { // 调整表格位置
                  top: '10%',
                  left: '3%',
                  right: '4%',
                  bottom: '10%',
                  containLabel: true
                },
                legend: {
                  bottom: '0',
                  left: 'center',
                  data: legends
                },
                series: [
                  {
                    name: '标签',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '51%'],
                    label: {
                      normal: {
                        show: true,
                        formatter: '{b}: \n {c} ({d}%)'
                      }
                    },
                    avoidLabelOverlap: true, // 防止标签重叠
                    data: this.allData.pieList
                  }
                ]
              }) : noneDataOption;
            });
          }
          this.totalItems = this.allData.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          this.desserts = this.allData.levelOfList;
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

.hand-signals {
  cursor: pointer;
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
  }
}
</style>
