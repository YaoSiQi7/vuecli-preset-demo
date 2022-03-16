<template>
  <div>
    <!-- 查询条件 -->
    <v-row>
      <v-col cols="11" class="py-0">
        <base-search-two
          :fieldList="searchForm11"
          @search="search($event)"
          @reset="resetSearchData($event)"
          :clearDate="clearDate"
        ></base-search-two>
      </v-col>
    </v-row>
    <!-- 图表 -->
    <div>
      <v-row>
        <!-- 工单占比 -->
        <v-col cols="6">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <div class="scene_echarts">
                <span class="scene_echarts_title">工单占比</span>
              </div>
              <echart-export-file
                :chartId="'riskOrderRate'"
                :hover="hover"
                :fileName="appName + '-工单占比'"
                :isActive="isActiveBtnRiskOrderRito"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'pie',
                    'isActiveBtnRiskOrderRito'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'pie',
                    'isActiveBtnRiskOrderRito'
                  )
                "
                style="position: absolute; top: 8px; right: 20px; z-index: 4"
                v-if="hasPermission(exportRiskOrderRitoBtn)"
              ></echart-export-file>
              <div>
                <base-echarts
                  :chartId="'riskOrderRate'"
                  :optionParam="optionParamPieTriggerNumber"
                  @clickEvent="clickEventPieTop"
                ></base-echarts>
              </div>
              <!-- <div v-if="loading == false && !pieGrossShow" class="no-data-box">
                暂无数据
              </div>
              <div v-if="loading" class="no-data-box">加载中</div> -->
            </div>
          </v-hover>
        </v-col>
        <!-- 风险标签分布情况 -->
        <v-col cols="6">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <div class="scene_echarts">
                <span class="scene_echarts_title">工单场景分布</span>
              </div>
              <echart-export-file
                :chartId="'riskOrderScence'"
                :hover="hover"
                :fileName="appName + '-工单场景分布'"
                :isActive="isActiveBtnRiskOrderSceneDistribute"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'histogram',
                    'isActiveBtnRiskOrderSceneDistribute'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'histogram',
                    'isActiveBtnRiskOrderSceneDistribute'
                  )
                "
                style="position: absolute; top: 8px; right: 20px; z-index: 4"
                v-if="hasPermission(exportRiskOrderSceneDistributeBtn)"
              ></echart-export-file>
              <div>
                <base-echarts
                  :chartId="'riskOrderScence'"
                  :optionParam="optionParamBarTriggerNumber"
                  @clickEvent="clickEventBarTop"
                ></base-echarts>
              </div>
              <!-- <div v-if="loading == false && !barShow" class="no-data-box">
                暂无数据
              </div>
              <div v-if="loading" class="no-data-box">加载中</div> -->
            </div>
          </v-hover>
        </v-col>
      </v-row>
    </div>
    <!-- 表格 -->
    <div>
      <v-hover v-slot="{ hover }">
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="perPageNum"
          :search="tabelSearch"
          hide-default-footer
          class="elevation-3 mt-3"
          :loading="loading"
          loading-text="加载数据中..."
        >
          <!-- 表头 -->
          <template v-slot:top>
            <div style="position: relative">
              <v-toolbar flat height="60px">
                <v-toolbar-title style="font-size: 18px">
                  风险工单
                </v-toolbar-title>
              </v-toolbar>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="appName + '-风险工单列表'"
                :isActive="isActiveBtnRiskOrderList"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'list',
                    'isActiveBtnRiskOrderList'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'list',
                    'isActiveBtnRiskOrderList'
                  )
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="hasPermission(exportRiskOrderListBtn)"
              ></echart-export-file>
            </div>
          </template>
          <!-- 没有数据-->
          <template v-slot:no-data>
            <div>没有数据</div>
          </template>
          <!-- 列表项 -->
          <template v-slot:body="{ items }" v-if="desserts.length">
            <tr
              v-for="(item, index) of items.values()"
              :key="index"
              class="el-tr-defu"
            >
              <td v-for="(i, x) of headers" :key="x" class="el-border-defu">
                <span
                  :class="{ 'hand-signals': x != 0 }"
                  @click="tableClick(item, i, x)"
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
import * as riskOrderServe from 'api/riskOrder.js';
import * as dataService from 'api/riskMarket.js';
import * as riskDetailStatistics from 'api/riskDetailStatistics.js';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import { downloadFile } from '@/utils/downloadFile';
export default {
  data () {
    return {
      loading: true,
      echartsBarIndex: 0,
      echartsPieIndex: 0,
      // 分页变量
      pageNum: 1,
      queryPageLength: 1,
      perPageNum: 10,
      totalItems: 10,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 查询条件相关
      dateStart: null,
      dateEnd: null,
      isdateShow: false,
      searchValid: true,
      searchForm: {
        dates: [],
        transactionType: ''
      },
      searchForm11: [],
      clearDate: false,
      ruleName: '', // 页尾列表的搜索框的值
      allData: [],
      tradeTypeItems: [],
      dateItems: [
        { text: '今天', value: '' },
        { text: '近一周', value: -7 },
        { text: '近一月', value: -30 },
        { text: '近一年', value: -365 }
      ],
      typeItems: [],
      pieGross: 0, // 饼图总数量
      pieGrossShow: 0, // 饼图总数量
      barShow: false, // true: 展示柱图，false：不展示
      // 工单场景分布
      optionParamBarTriggerNumber: {
        width: '95%',
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
      },
      // 工单占比
      optionParamPieTriggerNumber: {
        width: '500px',
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
      },
      headers: [
        {
          text: '场景',
          align: 'start',
          sortable: false,
          value: 'optype',
          width: '100px'
        },
        { text: '工单总数', value: 'order_total', sortable: false, width: '100px' },
        { text: '核查单数', value: 'verify_order', sortable: false, width: '120px' },
        { text: '告警单数', value: 'alarm_order', sortable: false, width: '120px' },
        { text: '预警单数', value: 'warning_order', sortable: false, width: '140px' }

      ],
      desserts: [],
      tabelSearch: '',
      // 查看图表的公共弹窗的变量
      riskViewingReportsRiskInfo: {},
      riskViewingReportsHeaders: [],
      riskViewingReportsData: [],
      vuexAppList: [],
      appName: '', // 应用中文名称
      transactionTypeText: '', // 应用场景中文名称
      resTradeTypeItems: [], // 应用场景数组
      scenesId: '',
      riskViewingReportsParams: {},
      orderType: {
        '预警单': 'warning_order',
        '核查单': 'verify_order',
        '告警单': 'alarm_order'
      },
      // 按钮权限
      exportBtn: '/exportRiskOrderButton', // 导出权限
      exportRiskOrderRitoBtn: '/exportRiskOrderRitoButton', // 导出工单占比
      exportRiskOrderSceneDistributeBtn: '/exportRiskOrderSceneDistributeButton', // 导出工单场景分布
      exportRiskOrderListBtn: '/exportRiskOrderListButton', // 导出风险工单列表
      isActiveBtnRiskOrderRito: true, // 导出按钮是否可以点击
      isActiveBtnRiskOrderSceneDistribute: true,
      isActiveBtnRiskOrderList: true
    };
  },
  computed: {
    ...mapGetters([
      'appId'
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
          this.getTradeTypeList()
        ]);
      },
      immediate: true
    }
  },
  created () { },
  mounted () {
    this.getTradeTypeList();
  },
  methods: {
    // 导出Excel与csv
    exportData (arg, fileType, graphMark, isActiveBtn) {
      let fileName = arg[0];
      let params = {
        appId: this.appId,
        fileType: fileType,
        exportObj: graphMark,
        startTime: moment(this.searchForm11[0].value[0]).format('YYYY-MM-DD'),
        endTime: moment(this.searchForm11[0].value[1]).format('YYYY-MM-DD')
      };
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportRiskOrder(params).then(res => {
        let blob = new Blob([res.data]);
        downloadFile(blob, fileName);
        this[isActiveBtn] = !this[isActiveBtn];
      }).catch(() => {
        this[isActiveBtn] = !this[isActiveBtn];
      });
    },
    searchTemp () {
      this.searchForm11 = [
        {
          placeholder: '时间',
          value: [],
          type: 'date'
        }];
      let today = new Date();
      let startDay = today;
      let endDay = new Date();
      this.searchForm11[0].value = [startDay, endDay];
      this.search();
    },
    // 获取应用场景，即场景管理下的交易类型
    async getTradeTypeList () {
      // // 取所有的 应用
      this.vuexAppList = JSON.parse(sessionStorage.getItem('vuexAppList'));
      this.vuexAppList.forEach((item, index, ary) => {
        if (item.id === this.appId) {
          this.appName = item.appName;
        }
      });
      if (this.appId) {
        let param = {
          jsonIds: JSON.stringify(this.appId.split(','))
        };
        this.tradeTypeItems = [];
        const response = await dataService.queryTradeType(param);
        if (response.data.code === 200) {
          let resTradeTypeItems = response.data.data;
          this.resTradeTypeItems = response.data.data;
          resTradeTypeItems.forEach((item, index, ary) => {
            this.tradeTypeItems.push({
              text: item.tradeName,
              value: item.id
            });
          });
          this.tradeTypeItems.unshift({ text: '全部交易类型', value: '-1' });
          this.searchTemp();
        } else {
          // this.tradeTypeItems.unshift({ text: '全部交易类型', value: '-1' });
          this.searchTemp();
        }
      }
    },
    // change时间
    changeDay (daysOfNumber) {
      // 生成开始时间和结束时间
      let today = new Date();
      today.setTime(today.getTime() + daysOfNumber * 24 * 60 * 60 * 1000);

      let startDay = this.dateToString(today);
      let endDay = this.dateToString(new Date()).substr(0, 10);
      this.dateStart = startDay;
      if (daysOfNumber === -1) { // -1为选择了昨天的时间
        this.searchForm.dates = [startDay, startDay];
        this.dateEnd = startDay;
      } else {
        this.searchForm.dates = [startDay, endDay];
        this.dateEnd = endDay;
      }
    },
    // 选择时间的弹框
    dateChange () {
      if (this.searchForm.dates.length === 2) {
        this.isdateShow = false;
      }
    },
    // 选择时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
    },
    // 点击重置条件
    resetSearchData () {
      this.searchForm11 = [
        {
          placeholder: '时间',
          value: [],
          type: 'date'
        }
      ];
      let today = new Date();
      let startDay = today;
      let endDay = new Date();
      this.searchForm11[0].value = [startDay, endDay];
      this.search();
    },
    // 翻转数组
    reverseArry (array) {
      for (var i = 0; i < array.length / 2; i++) {
        var temp = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - 1 - i] = temp;
      }
      return array; // Array对象中的方法返回了一个数组。
    },
    // 点击查询
    search () {
      this.pageNum = 1;
      this.initGetData();
    },
    // 柱状图
    clickEventBarTop (data) {
      this.baseBlank('bar', data);
    },
    // 饼状图
    clickEventPieTop (data) {
      this.baseBlank('pie', data);
    },
    getColor (calories) {
      if (calories > 400) return 'red';
      else if (calories > 200) return 'orange';
      else return 'green';
    },
    // 公共的图标和列表下钻功能
    async baseBlank (id, data) {
      // 时间
      let dateTime = this.searchForm11[0].value;
      let params = {};
      // 场景
      let opTypeC = '';
      let opTypeE = '';
      if (id === 'bar') {
        opTypeC = data.name;
      } else if (id === 'tabel') {
        opTypeC = data.optype;
        if (data.colType === 'optype') {
          data.colType = 'order_total';
        }
      }
      // 工单类型
      let colType = '';
      if (id === 'pie') {
        colType = this.orderType[data.name];
      } else if (id === 'tabel') {
        colType = data.colType;
      } else {
        colType = 'order_total';
      }
      this.tradeTypeItems.forEach(item => {
        if (item.text === opTypeC) {
          opTypeE = item.value;
        }
      });
      params = {
        datesVal: dateTime, // 详情页--时间
        time: this.searchForm11[0].value,
        opType: id === 'pie' ? '-1' : opTypeE, // 详情页--交易类型
        colType: colType
      };
      this.$router.push(
        {
          name: 'riskOrderDetail',
          params: params
        }
      );
    },
    // 列表信息的某一条数据的点击事件
    async tableClick (item, i, x) {
      if (x === 0) {
        return;
      }
      item.colType = i.value;
      this.baseBlank('tabel', item);
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.initGetData();
    },
    // 页数
    pageChange () {
      this.search();
    },
    async initGetData ($event) {
      let params = {};
      if ($event !== undefined) {
        params = Object.assign({}, {
          startTime: $event[0].value[0],
          endTime: $event[0].value[1],
          appId: this.appId,
          page: this.pageNum,
          pageSize: this.perPageNum
        });
        this.queryRiskData(params);
      } else {
        this.$nextTick(() => {
          let datesStr = this.searchForm11[0].value;
          params = Object.assign({}, {
            startTime: this.dateToString(datesStr[0]),
            endTime: this.dateToString(datesStr[1]),
            appId: this.appId,
            page: this.pageNum,
            pageSize: this.perPageNum
          });
          this.queryRiskData(params);
        });
      }
    },
    // 调取查询接口
    async queryRiskData (params) {
      if (this.appId) {
        this.loading = true;
        this.optionParamBarTriggerNumber = {
          width: '95%',
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
        this.optionParamPieTriggerNumber = {
          width: '500px',
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
        const res = await riskOrderServe.queryData(params);
        if (res.data.code === 200) {
          this.loading = false;
          let resData = res.data.data;
          let barSeries = resData.datasDate;
          let barDataAry = [];
          let pieData = [];
          // 柱状图 barShow true:展示柱状图，false：不展示
          if (barSeries && resData.dataX && resData.dataY) {
            if (barSeries.length === 0 || resData.dataX.length === 0 || resData.dataY.length === 0) {
              this.barShow = false;
            } else {
              for (let i = 0; i < barSeries.length; i++) {
                barDataAry = barDataAry.concat(barSeries[i].data);
              };
              if (Array.from(new Set(barDataAry)).length === 1 && Array.from(new Set(barDataAry)).toString() === '0') {
                this.barShow = false;
              } else {
                this.barShow = true;
                this.$nextTick(() => {
                  // 增加固定参数
                  barSeries.forEach((item, index, ary) => {
                    item.stack = '总量';
                    item.type = 'bar';
                    item.barWidth = '40%';
                    item.label = {
                      show: false,
                      position: 'inside'
                    };
                  });
                  // 渲染图表
                  this.optionParamBarTriggerNumber = {
                    width: '95%',
                    height: '500px',
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                      }
                    },
                    title: {
                      subtext: '',
                      left: 'left'
                    },
                    legend: {
                      data: resData.dataX,
                      x: 'center',
                      bottom: '10px'
                    },
                    grid: {
                      top: '50px',
                      left: '0px',
                      right: '10%',
                      bottom: '70px',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'value'
                    },
                    yAxis: {
                      type: 'category',
                      data: resData.dataY
                    },
                    color: window.g.echartsBaseColor,
                    series: barSeries
                  };
                });
              }
            }
            if (!this.barShow) {
              this.optionParamBarTriggerNumber = {
                width: '95%',
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
            }
          }
          // 饼图 pieGrossShow true:展示柱状图，false：不展示
          if (resData.data && resData.data.length !== 0) {
            this.pieGross = 0;
            // pieGross 大于0，才能展示饼图
            resData.data.forEach((item, index, ary) => {
              this.pieGrossShow = true;
              this.pieGross = this.pieGross + item.value;
            });
            if (this.pieGross) {
              this.pieGrossShow = true;
              resData.data.forEach((item, index, ary) => {
                pieData.push(item.name); // 拼饼图的标头名称
              });
              this.$nextTick(() => {
                // 渲染图表
                this.optionParamPieTriggerNumber = {
                  width: '500px',
                  height: '500px',
                  title: {
                    text: this.pieGross,
                    subtext: '工单总数',
                    subtextStyle: {
                      fontSize: 18,
                      color: '#666',
                      fontWeight: 400
                    },
                    textStyle: {
                      fontSize: 40,
                      color: '#fcbc57',
                      fontWeight: 'bold'
                    },
                    textAlign: 'center',
                    x: '49.5%',
                    y: '40%'
                  },
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                  },
                  legend: {
                    x: 'center',
                    bottom: '10px',
                    data: pieData
                  },
                  series: [
                    {
                      name: '工单数目',
                      type: 'pie',
                      radius: ['55%', '70%'],
                      bottom: '70px',
                      color: window.g.echartsBaseColor,
                      avoidLabelOverlap: false,
                      label: {
                        normal: {
                          show: true,
                          formatter: '{b}: \n {c} ({d}%)'
                        }
                      },
                      data: resData.data
                    }
                  ]
                };
              });
            } else {
              this.pieGrossShow = false;
            }
          } else {
            this.pieGrossShow = false;
          }
          if (!this.pieGrossShow) {
            this.optionParamPieTriggerNumber = {
              width: '500px',
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
          }
          this.totalItems = resData.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          this.desserts = resData.riskOrderList;
        } else {
          this.loading = false;
        }
      }
    }
  }
};
</script>
<style>
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
.hand-signals {
  cursor: pointer;
}
</style>
