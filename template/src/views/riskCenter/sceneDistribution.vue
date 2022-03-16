<!-- author: 古雪瑞-->
<!-- updateTime: 2020-10-14-->
<template>
  <!-- 场景分布 -->
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
    <!-- 图表 -->
    <div>
      <v-row class="mb-3">
        <!-- 场景分布饼状图 -->
        <v-col cols="6" class="py-0">
          <v-hover v-slot="{ hover }">
            <div class="pr">
              <div class="location-text">
                <span>场景分布饼状图</span>
              </div>
              <echart-export-file
                :chartId="'sceneDistributionPie'"
                :hover="hover"
                :fileName="appName + '-场景分布-' + tradeTypeObj.text"
                :isActive="isActiveBtnScenedistributionPie"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'pie',
                    'isActiveBtnScenedistributionPie'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'pie',
                    'isActiveBtnScenedistributionPie'
                  )
                "
                style="position: absolute; right: 185px; z-index: 4"
                v-if="hasPermission(exportRiskMarketScenedistributionPieBtn)"
              ></echart-export-file>
              <v-select
                v-model="tradeTypeValue"
                style="
                  position: absolute;
                  right: 0;
                  width: 177px !important;
                  z-index: 4;
                "
                :items="pieChartTradeTypeItems"
                required
                no-data-text="没有数据"
                outlined
                dense
                @change="tradeTypeValueChange($event)"
              />
              <div>
                <base-echarts
                  :chartId="'sceneDistributionPie'"
                  :optionParam="optionParamPieTriggerNumber"
                  @clickEvent="clickEventTop"
                ></base-echarts>
              </div>
              <!-- <div
                v-if="!loadingCharts && !optionParamPieTriggerNumber"
                class="no-data-box"
              >
                暂无数据
              </div>
              <div v-if="loadingCharts" class="no-data-box">加载中</div> -->
            </div>
          </v-hover>
        </v-col>
        <!-- 场景分布数量 -->
        <v-col cols="6" class="py-0 pl-0">
          <v-hover v-slot="{ hover }">
            <div class="pr">
              <div class="location-text">
                <span>场景分布数量</span>
              </div>
              <echart-export-file
                :chartId="'sceneDistributionNum'"
                :hover="hover"
                :fileName="appName + '-场景分布数量-' + tradeTypeObj.text"
                :isActive="isActiveBtnScenedistributionNum"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'histogram',
                    'isActiveBtnScenedistributionNum'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'histogram',
                    'isActiveBtnScenedistributionNum'
                  )
                "
                style="position: absolute; top: 8px; right: 20px; z-index: 4"
                v-if="hasPermission(exportRiskMarketScenedistributionNumBtn)"
              ></echart-export-file>
              <div class="pr">
                <base-echarts
                  :chartId="'sceneDistributionNum'"
                  :optionParam="optionParamBarTriggerNumber"
                  @clickEvent="clickEventTop"
                ></base-echarts>
                <p class="pieLegend" v-if="!optionParamBarTriggerNumber.title">
                  {{ pieLegend }}
                </p>
              </div>
              <!-- <div
                v-if="!loadingCharts && !optionParamBarTriggerNumber"
                class="no-data-box"
              >
                暂无数据
              </div>
              <div v-if="loadingCharts" class="no-data-box">加载中</div> -->
            </div>
          </v-hover>
        </v-col>
      </v-row>
    </div>
    <!-- 表格 -->
    <div class="table-box mb3">
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
                  场景风险分布
                </v-toolbar-title>
              </v-toolbar>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="appName + '-场景风险分布列表'"
                :isActive="isActiveBtnScenedistributionList"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'list',
                    'isActiveBtnScenedistributionList'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'list',
                    'isActiveBtnScenedistributionList'
                  )
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="hasPermission(exportRiskMarketScenedistributionListBtn)"
              ></echart-export-file>
            </div>
          </template>
          <!-- 列表项 -->
          <template v-slot:body="{ items }" v-if="desserts.length">
            <tr
              v-for="(item, index) of items.values()"
              :key="index"
              class="el-tr-defu"
            >
              <td v-for="(i, x) of headers" :key="x" class="el-border-defu">
                <span v-if="i.value === 'optype'">{{ item[i.value] }}</span>
                <span
                  class="hand-signals"
                  @click="tableClick(item, i)"
                  v-else
                  >{{ item[i.value] }}</span
                >
              </td>
            </tr>
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
      loadingCharts: false,
      pieLegend: '风险事件数',
      dates: [],
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
      // 场景分布-柱状图
      optionParamBarTriggerNumber: loadingOption,
      // 场景分布-饼图
      optionParamPieTriggerNumber: loadingOption,
      headers: [],
      desserts: [],
      tabelSearch: '',
      // 查看图表的公共弹窗的变量
      riskViewingReportsRiskInfo: {},
      riskViewingReportsHeaders: [],
      riskViewingReportsData: [],
      vuexAppList: [],
      // appName: '', // 应用中文名称
      transactionTypeText: '', // 应用场景中文名称
      resTradeTypeItems: [], // 应用场景数组
      scenesId: '',
      riskViewingReportsParams: {},
      refreshChart: true, // 是否刷新饼图和柱图
      tradeTypeValue: 'risk_event',
      pieChartTradeTypeItems: [],
      // 按钮权限
      exportBtn: '/exportRiskMarketScenedistributionButton', // 导出权限
      exportRiskMarketScenedistributionPieBtn: '/exportRiskMarketScenedistributionPieButton', // 导出场景分布饼状图
      exportRiskMarketScenedistributionNumBtn: '/exportRiskMarketScenedistributionNumButton', // 导出场景分布数量
      exportRiskMarketScenedistributionListBtn: '/exportRiskMarketScenedistributionListButton', // 导出场景风险分布列表
      isActiveBtnScenedistributionPie: true, // 导出按钮是否可以点击
      isActiveBtnScenedistributionNum: true,
      isActiveBtnScenedistributionList: true,
      tradeTypeObj: { text: '', value: '' }
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
        this.getTradeTypeList();
      },
      immediate: true
    }
  },
  mounted () {
    this.getTradeTypeList();
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
        endTime: moment(this.searchForm[0].value[1]).format('YYYY-MM-DD')
      };
      if (graphMark !== 'list') {
        params.strategyType = this.tradeTypeValue;
      }
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportScenesDistribution(params).then(res => {
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
        let chartsDataParams = this.$route.params;
        this.searchForm[0].value = [chartsDataParams.startTime, chartsDataParams.endTime];
        this.dates = [chartsDataParams.startTime, chartsDataParams.endTime];
        this.searchForm[1].value = chartsDataParams.opType === -1 ? '' : chartsDataParams.opType;// 交易类型
        this.tradeTypeValue = chartsDataParams.strategy;
      } else {
        let today = new Date();
        let startDay = this.dateToString(today);
        let endDay = this.dateToString(new Date()).substr(0, 10);
        this.searchForm[0].value = [startDay, endDay];
        this.dates = [startDay, endDay];
        this.searchForm[1].value = '-1';// 交易类型
        this.tradeTypeValue = 'risk_event';// 指标策略
      }
      this.search();
    },
    // 策略下拉列表
    async querySceneDistributionWithSearch () {
      this.pieChartTradeTypeItems = [];
      const response = await dataService.querySceneDistributionWithSearch();
      if (response.data.code === 200) {
        this.pieChartTradeTypeItems = response.data.data.titleStrSearch;
      }
      this.initGetData();
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
        }
        this.querySceneDistributionWithSearch();
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
      let today = new Date();
      this.searchForm[0].value = [today, today];
      this.dates = [today, today];
      this.refreshChart = true;
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
          startTime: $event[0].value[0],
          endTime: $event[0].value[1],
          opType: $event[1].value,
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
            opType: this.searchForm[1].value,
            appId: this.appId,
            page: this.pageNum,
            pageSize: this.perPageNum
          });
          this.queryRiskData(params);
        });
      }
      this.tradeTypeValueChange();// 图表的接口
    },
    getTrades () {
      let txtName = '风险事件数';
      this.pieChartTradeTypeItems.forEach(item => {
        if (item.value === this.tradeTypeValue) {
          txtName = item.text;
        }
      });
      return txtName;
    },
    // 饼图-风险标签分布情况
    clickEventTop (data) {
      let title = this.getTrades();// 遍历获取事件中文名称
      let opTypeObj = this.tradeTypeItems.find(val => data.name === val.text);
      let datesStr = this.searchForm[0].value;
      let params = {
        startTime: this.dateToString(datesStr[0]), // 开始时间
        endTime: this.dateToString(datesStr[1]), // 结束时间
        opType: opTypeObj.value, // 交易类型
        appId: this.appId, // 应用id
        title: title,
        province: ''
      };
      // 跳转风险趋势详情页
      this.$router.push({
        name: 'riskAreasDetail',
        params: params
      });
    },
    // 列表信息的某一条数据的点击事件
    async tableClick (item, title) {
      let opTypeObj = this.tradeTypeItems.find(val => item.optype === val.text);
      let datesStr = this.searchForm[0].value;
      let params = {
        startTime: this.dateToString(datesStr[0]), // 开始时间
        endTime: this.dateToString(datesStr[1]), // 结束时间
        opType: opTypeObj.value, // 交易类型
        appId: this.appId, // 应用id
        title: title.text,
        province: ''
      };
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
    // 页数
    pageChange () {
      this.refreshChart = false;
      this.pageNum = 1; // 默认从第一页开始查询
      this.doSearch();
    },
    async queryRiskData (params) {
      if (this.appId) {
        this.loading = true;
        let opTypeObj = '-1';
        if (params.opType !== '-1') {
          opTypeObj = this.tradeTypeItems.find(item => item.value === params.opType);
          params.opType = opTypeObj && opTypeObj.identifier ? opTypeObj.identifier : '-1';
        }
        if (typeof (params.startTime) === 'object') {
          params.startTime = this.dateToString(params.startTime);
        }
        if (typeof (params.endTime) === 'object') {
          params.endTime = this.dateToString(params.endTime);
        }
        const res = await dataService.querySceneDistribution(params);
        if (res.data.code === 200) {
          this.allData = res.data.data.data;
          this.totalItems = this.allData.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          let tableHeader = this.allData.titleList;
          for (let i = 0; i < tableHeader.length; i++) {
            tableHeader[i].sortable = false;
            tableHeader[i].width = '100';
          }
          if (tableHeader.length) {
            tableHeader[0].align = 'start';
          }
          this.headers = tableHeader;
          this.desserts = this.allData.sceneDistributionList || [];
        }
        this.loading = false;
      }
    },
    //  切换饼图处的下拉框
    async tradeTypeValueChange (e) {
      this.optionParamBarTriggerNumber = loadingOption;
      this.optionParamPieTriggerNumber = loadingOption;
      this.tradeTypeObj = e ? this.pieChartTradeTypeItems.find(item => e === item.value) : this.pieChartTradeTypeItems[0];
      let params = {};
      this.$nextTick(async () => {
        let datesStr = this.searchForm[0].value;
        params = Object.assign({}, {
          startTime: datesStr[0],
          endTime: datesStr[1],
          opType: this.searchForm[1].value,
          appId: this.appId,
          strategyType: this.tradeTypeValue
        });
        let opTypeObj = '-1';
        if (params.opType !== '-1') {
          opTypeObj = this.tradeTypeItems.find(item => item.value === params.opType);
          params.opType = opTypeObj && opTypeObj.identifier ? opTypeObj.identifier : '-1';
        }
        params.opType = opTypeObj.identifier ? opTypeObj.identifier : '-1';
        this.loadingCharts = true;
        if (typeof (params.startTime) === 'object') {
          params.startTime = this.dateToString(params.startTime);
        }
        if (typeof (params.endTime) === 'object') {
          params.endTime = this.dateToString(params.endTime);
        }
        const res = await dataService.changePieSelect(params);
        if (res.data.code === 200) {
          const resData = res.data.data;
          this.pieLegend = this.getTrades(); // 场景分布数量图例
          // 取出数值，判断值是否都等于0。都为0则展示“暂无数据”。
          let yStr = resData.yStr;
          let yStrIsTrue = false;
          for (let index = 0; index < yStr.length; index++) {
            const element = yStr[index];
            if (element !== 0) {
              yStrIsTrue = true;
              console.log('true----', element);
              break;
            } else {
              console.log('false----', element);
              yStrIsTrue = false;
            }
          }
          this.optionParamBarTriggerNumber = yStrIsTrue ? Object.assign({}, {
            width: '100%',
            height: '500px',
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '5%',
              containLabel: true
            },
            legend: {
              bottom: '0',
              left: 'center',
              data: ['pieLegend']
            },
            xAxis: [
              {
                type: 'value'
              }
              // {
              //   type: 'category',
              //   data: resData.xStr,
              //   axisTick: {
              //     alignWithLabel: true
              //   },
              //   axisLabel: {
              //     interval: 0, // 坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
              //     rotate: 40 // 调整数值改变倾斜的幅度（范围-90到90）
              //   }
              // }
            ],
            yAxis: [
              {
                type: 'category',
                data: resData.xStr
              }
            ],
            series: [
              {
                name: this.pieLegend,
                type: 'bar',
                barWidth: '60%',
                data: resData.yStr
              }
            ]
          }) : noneDataOption;
          // 场景分布-----饼图
          let legends = [];
          resData.data.forEach(item => {
            legends.push(item.name);
          });
          this.optionParamPieTriggerNumber = resData.data.length ? Object.assign({}, {
            width: '100%',
            height: '500px',
            title: {},
            tooltip: {
              trigger: 'item',
              formatter: '{b} : {c} ({d}%)'
            },
            grid: { // 调整表格位置
              top: '10%',
              left: '3%',
              right: '4%',
              bottom: '10%',
              containLabel: true
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              right: 0,
              top: 20,
              bottom: 20,
              data: resData.data
            },
            series: [
              {
                name: '标签',
                type: 'pie',
                radius: '55%',
                center: ['36%', '50%'],
                label: {
                  normal: {
                    show: true,
                    formatter: '{b}: \n {c} ({d}%)'
                  }
                },
                avoidLabelOverlap: true, // 防止标签重叠
                data: resData.data
              }
            ]
          }) : noneDataOption;
        }
        this.loadingCharts = false;
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-border-defu {
  text-align: left;
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

.pr {
  position: relative;
}

.hand-signals {
  cursor: pointer;
}

.location-text {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 100%;
  z-index: 1;
  font-weight: 700;

  span {
    font-size: 17px;
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
  }
}

.pieLegend {
  position: absolute;
  left: 48%;
  bottom: 0;
  color: rgba(0, 0, 0, 0.87);
  font-size: 12px;

  &:after {
    content: '';
    width: 26px;
    height: 15px;
    background: #f4c79b;
    border-radius: 2px;
    position: absolute;
    top: 1px;
    left: -40px;
  }
}
</style>
