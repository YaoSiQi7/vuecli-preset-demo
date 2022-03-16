<template>
  <!-- 风险标签详情页 -->
  <div>
    <!-- 查询条件 -->
    <v-row class="pt-3">
      <v-col cols="10">
        <base-search-two
          :dates="dates"
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
        <!-- 风险标签趋势 -->
        <v-col cols="12">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <div class="scene_echarts">
                <span class="scene_echarts_title">工单日趋势图</span>
              </div>
              <echart-export-file
                :chartId="'riskOrderDetailTrend'"
                :hover="hover"
                :fileName="appName + '-工单日趋势'"
                :isActive="isActiveBtnRiskOrderDayTrendEchart"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'polyline',
                    'isActiveBtnRiskOrderDayTrendEchart'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'polyline',
                    'isActiveBtnRiskOrderDayTrendEchart'
                  )
                "
                style="position: absolute; top: 8px; right: 20px; z-index: 4"
                v-if="hasPermission(exportRiskOrderDayTrendEchartBtn)"
              ></echart-export-file>
              <div>
                <base-echarts
                  :chartId="'riskOrderDetailTrend'"
                  :optionParam="optionParamBarTriggerNumber"
                  @clickEvent="clickEventLineTop"
                ></base-echarts>
              </div>
              <!-- <div
                v-if="!lineGrossShow && loading == false"
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
    <div>
      <v-hover v-slot="{ hover }">
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="perPageNum"
          no-results-text="没有匹配的数据"
          no-data-text="没有匹配的数据"
          hide-default-footer
          class="elevation-1"
          :loading="loading"
          loading-text="加载数据中..."
          :fixed-header="true"
        >
          <!-- 表头 -->
          <template v-slot:top>
            <div style="position: relative">
              <v-toolbar flat height="60px">
                <v-toolbar-title style="font-size: 18px">
                  工单日趋势
                </v-toolbar-title>
              </v-toolbar>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="appName + '-工单日趋势列表'"
                :isActive="isActiveBtnRiskOrderDayTrendList"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'list',
                    'isActiveBtnRiskOrderDayTrendList'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'list',
                    'isActiveBtnRiskOrderDayTrendList'
                  )
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="hasPermission(exportRiskOrderDayTrendListBtn)"
              ></echart-export-file>
            </div>
          </template>
          <template v-slot:no-data>
            <div>没有数据</div>
          </template>
          <!-- 分页 -->
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
import * as riskOrderServe from 'api/riskOrder.js';
import * as riskDetailStatistics from 'api/riskDetailStatistics.js';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import { downloadFile } from '@/utils/downloadFile';
export default {
  data () {
    return {
      loading: true,
      lineGrossShow: true,
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
      searchForm: {
        dates: [],
        transactionType: ''
      },
      searchForm11: [
        {
          placeholder: '时间',
          value: '',
          type: 'date'
        },
        {
          placeholder: '交易类型',
          value: '-1',
          type: 'select',
          options: []
        }
      ],
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
      // 风险标签趋势
      optionParamBarTriggerNumber: {
        width: '90%',
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
          text: '日期',
          align: 'start',
          sortable: false,
          value: 'risk_day',
          width: '150px'
        },
        { text: '工单总数', value: 'order_total', sortable: false, width: '100px' },
        { text: '动账核查单数', value: 'verify_order_isAccount', sortable: false, width: '120px' },
        { text: '非动账核查单数', value: 'verify_order_notAccount', sortable: false, width: '120px' },
        { text: '动账预警单数', value: 'warning_order_isAccount', sortable: false, width: '140px' },
        { text: '非动账预警单数', value: 'warning_order_notAccount', sortable: false, width: '100px' },
        { text: '动账告警单数', value: 'alarm_order_isAccount', sortable: false, width: '150px' },
        { text: '非动账告警单数', value: 'alarm_order_notAccount', sortable: false, width: '100px' }
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
      riskLabelTabelDataParams: {},
      dates: [],
      isFromRiakOrder: false,
      orderType: {
        warning_order: '预警单',
        verify_order: '核查单',
        alarm_order: '告警单'
      },
      // 按钮权限
      exportBtn: '/exportRiskOrderDetailsButton', // 导出权限
      exportRiskOrderDayTrendEchartBtn: '/exportRiskOrderDayTrendEchartButton', // 导出工单日趋势图
      exportRiskOrderDayTrendListBtn: '/exportRiskOrderDayTrendListButton', // 导出工单日趋列表
      isActiveBtnRiskOrderDayTrendEchart: true, // 导出按钮是否可以点击
      isActiveBtnRiskOrderDayTrendList: true
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
  created () {
    this.getTradeTypeList();
  },
  mounted () {
    if (Object.keys(this.$route.params).length !== 0) {
      this.isFromRiakOrder = true;
      this.riskLabelTabelDataParams = this.$route.params; // 风险标签页跳转而来的参数
      this.dates = this.riskLabelTabelDataParams.datesVal;
      this.getTradeTypeList();
    } else {
      this.isFromRiakOrder = false;
    }
  },
  methods: {
    // 导出Excel与csv
    exportData (arg, fileType, graphMark, isActiveBtn) {
      let fileName = arg[0];
      let params = {
        appId: this.appId,
        opType: (this.searchForm11[1].value === '' || this.searchForm11[1].value === undefined || this.searchForm11[1].value === '全部交易类型') ? -1 : this.searchForm11[1].value,
        fileType: fileType,
        exportObj: graphMark,
        startTime: moment(this.searchForm11[0].value[0]).format('YYYY-MM-DD'),
        endTime: moment(this.searchForm11[0].value[1]).format('YYYY-MM-DD')
      };
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportRiskOrderDetail(params).then(res => {
        let blob = new Blob([res.data]);
        downloadFile(blob, fileName);
        this[isActiveBtn] = !this[isActiveBtn];
      }).catch(() => {
        this[isActiveBtn] = !this[isActiveBtn];
      });
    },
    // 时间的公共方法
    changeDay (daysOfNumber) {
      this.searchForm11.forEach((item, index, ary) => {
        if (item.type === 'date') {
          // 生成开始时间和结束时间
          let today = new Date();
          today.setTime(today.getTime() + daysOfNumber * 24 * 60 * 60 * 1000);

          let startDay = this.dateToString(today);
          let endDay = this.dateToString(new Date()).substr(0, 10);
          this.dateStart = startDay;
          if (daysOfNumber === -1) { // -1为选择了昨天的时间
            item.value = [startDay, startDay];
            this.dates = [startDay, startDay];
            // this.dateEnd = startDay;
          } else {
            item.value = [startDay, endDay];
            this.dates = [startDay, endDay];
            // this.dateEnd = endDay;
          }
        }
      });
    },
    // 日期转字符串
    dateToString (date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length === 1) {
        month = '0' + month;
      }
      if (day.length === 1) {
        day = '0' + day;
      }
      var dateTime = year + '-' + month + '-' + day;
      return dateTime;
    },
    searchTemp () {
      if (this.isFromRiakOrder) {
        this.dates = this.riskLabelTabelDataParams.datesVal;
        this.searchForm11[0].value = this.riskLabelTabelDataParams.time;
        this.searchForm11[1].value = this.riskLabelTabelDataParams.opType;
        this.searchForm11[1].options = this.tradeTypeItems;
      } else {
        this.changeDay(0);
        this.searchForm11[1].options = this.tradeTypeItems;
        this.searchForm11[1].value = '-1';
      };
      this.search();
    },
    // 获取应用场景，即场景管理下的交易类型
    async getTradeTypeList () {
      // let appTag = '';
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
              value: item.id,
              isAmount: item.isAmount,
              identifier: item.identifier
            });
          });
          this.tradeTypeItems.unshift({ text: '全部交易类型', value: '-1' });
          this.searchTemp();
          // this.initGetData();
        }
      }
    },
    // 点击重置条件
    resetSearchData () {
      this.searchForm11 = [
        {
          placeholder: '时间',
          value: [],
          type: 'date'
        },
        {
          placeholder: '交易类型',
          value: '-1',
          type: 'select',
          options: this.tradeTypeItems
        }
      ];
      this.changeDay(0);
      this.search();
    },
    // 点击查询
    search ($event) {
      if ($event) {
        this.dates = this.searchForm11[0].value;
      }
      this.pageNum = 1;
      this.initGetData($event);
    },
    //  曲线图-风险标签趋势
    clickEventLineTop (data) {
      this.headers.forEach((item, index, ary) => {
        if (data.seriesName === item.text) {
          this.baseBlankRiskcontrolLog(data.name, item); // data.name:时间，item: 代表某一项
        }
      });
    },
    getColor (calories) {
      if (calories > 400) return 'red';
      else if (calories > 200) return 'orange';
      else return 'green';
    },
    // 公共的图标和列表下钻功能
    async baseBlank (ruleNo) {
      let params = {
        pageIndex: 1,
        pageSize: 10,
        appId: this.appId,
        scenesId: this.scenesId,
        ruleNo: ruleNo,
        startTime: this.searchForm.dates.length === 2 ? (this.searchForm.dates[0]) : '',
        endTime: this.searchForm.dates.length === 2 ? (this.searchForm.dates[1]) : ''
      };
      this.riskViewingReportsParams = params;
      let sStorage = window.sessionStorage;
      try {
        const res = await riskDetailStatistics.getRiskDetail(params);
        if (res.data.code === 200) {
          res.data.data.opLogTitle.forEach((item, index, ary) => {
            this.riskViewingReportsHeaders.push(
              {
                text: item.cnName,
                value: item.enName,
                sortable: false,
                width: 150
              }
            );
          });
          this.riskViewingReportsData = res.data.data.opLogDate;
          this.riskViewingReportsRiskInfo = {
            riskCode: res.data.data.ruleTrigger.ruleNo,
            riskName: res.data.data.ruleTrigger.ruleName,
            riskChannel: this.appName,
            riskScene: this.transactionTypeText,
            riskNumber: res.data.data.ruleTrigger.ruleCount,
            total: res.data.data.total,
            pages: res.data.data.pages
          };
          // 查看图表
          sStorage.setItem('riskViewingReportsParams', JSON.stringify(this.riskViewingReportsParams));
          sStorage.setItem('riskViewingReportsRiskInfo', JSON.stringify(this.riskViewingReportsRiskInfo));
          sStorage.setItem('riskViewingReportsHeaders', JSON.stringify(this.riskViewingReportsHeaders));
          sStorage.setItem('riskViewingReportsData', JSON.stringify(this.riskViewingReportsData));
          this.$router.push('/riskDetailViewingReports');
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 列表信息的某一条数据的点击事件
    tableClick (item, i) {
      this.baseBlankRiskcontrolLog(item.riskDay, i);
    },
    // 公共跳转至----风控日志页面
    baseBlankRiskcontrolLog (item, i) {
      let dateTime = []; // 下钻页面的搜索条件需要回显 创建时间 的值
      let params = {};
      let isAmount = ''; // 下钻页面是动账或非动账，0：非动账，1：动账
      let opTypeId = ''; // 下钻页面的搜索条件需要回显 交易类型 的id
      let paramsAry = []; // 下钻页面的搜索条件需要回显的数据
      dateTime[0] = item;
      dateTime[1] = item;
      this.tradeTypeItems.forEach((im, ix, ay) => {
        if (this.searchForm11[1].value !== '-1' && this.searchForm11[1].value === im.value) {
          isAmount = Number(im.isAmount);
          opTypeId = im.identifier;
        } else {
          isAmount = 1;
          opTypeId = 'all';
        }
      });
      paramsAry.push( // 风控时间
        {
          enName: 'create_time',
          value: dateTime,
          searchType: 'Date'
        },
        { // 风控日志搜索条件中某一个的英文标识
          enName: i.enName,
          value: i.id.split(','),
          searchType: 'multiple'
        },
        { // 交易类型
          enName: 'op_type',
          value: opTypeId,
          searchType: 'select'
        }
      );
      params = {
        isAmount: isAmount, // 1：风控日志展示为动账，0：风控日志展示为非动账
        paramsAry: paramsAry
      };
      // 本地缓存数据的方法跳转页面
      /* sessionStorage.setItem('riskLogDataParams', JSON.stringify(params));
      this.$router.push('/riskControlLog'); */
      // 传参数的方式跳转页面
      this.$router.push({
        name: 'riskControlLog',
        params: params
      });
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.dates = this.searchForm11[0].value;
      this.initGetData();
    },
    // 页数
    pageChange () {
      this.search();
    },
    initGetData ($event) {
      this.desserts = [];
      if (this.appId) {
        this.loading = true;
        this.optionParamBarTriggerNumber = {
          width: '90%',
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
        let params = {};
        if ($event !== undefined) {
          params = Object.assign({}, {
            startTime: moment($event[0].value[0]).format('YYYY-MM-DD'),
            endTime: moment($event[0].value[1]).format('YYYY-MM-DD'),
            opType: $event[1].value ? this.searchForm11[1].value : '-1',
            appId: this.appId,
            page: this.pageNum,
            pageSize: this.perPageNum
          });
          this.queryRiskData(params);
        } else {
          this.$nextTick(() => {
            let datesStr = this.searchForm11[0].value;
            params = {
              page: this.pageNum,
              pageSize: this.perPageNum,
              appId: this.appId,
              opType: this.searchForm11[1].value ? this.searchForm11[1].value : '-1',
              startTime: moment(datesStr[0]).format('YYYY-MM-DD'),
              endTime: moment(datesStr[1]).format('YYYY-MM-DD')
            };
            this.queryRiskData(params);
          });
        }
      }
    },
    async queryRiskData (params) {
      try {
        let opTypeObj = this.tradeTypeItems.find(item => item.value === params.opType);
        params.opType = opTypeObj.identifier ? opTypeObj.identifier : '-1';
        const res = await riskOrderServe.queryDetailData(params);
        if (res.data.code === 200) {
          this.loading = false;
          this.allData = res.data.data;
          if (this.allData.dataX && this.allData.dataY && this.allData.datasDate) {
            if (this.allData.dataY.length > 0 && this.allData.datasDate.length > 0 && this.allData.dataX.length > 0) { // 判断大于0，才展示折线图表
              this.lineGrossShow = true;
              this.allData.datasDate.forEach((item, index, ary) => {
                ary[index].type = 'line';
                // ary[index].stack = '总量'; // 代表是否交错。加此属性则会交错，并会累加每一项的值；不加此属性则不会累加
                ary[index].smooth = true;
                ary[index].areaStyle = { // 曲线有交错，删除背景颜色----注释areaStyle: {}
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
              window.g.echartsBaseColor.forEach((im, ix, ay) => {
                this.allData.datasDate.forEach((m, x, y) => {
                  if (x < 21) {
                    if (ix === x) {
                      m.areaStyle.color.colorStops[0].color = im;
                    }
                  }
                });
              });
              this.allData.datasDate.forEach(item => {
                if (item.name === 'warning') {
                  item.name = '预警单';
                }
                if (item.name === 'verify') {
                  item.name = '核查单';
                }
                if (item.name === 'alarm') {
                  item.name = '告警单';
                }
              });
              this.$nextTick(() => {
                // 折线图
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
                  legend: {
                    data: this.allData.dataX
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
                      data: this.allData.dataY
                    }
                  ],
                  yAxis: [
                    {
                      type: 'value'
                    }
                  ],
                  series: this.allData.datasDate
                };
                // 如果是风险工单跳过来的 控制折线图的置灰
                if (this.isFromRiakOrder) {
                  if (this.riskLabelTabelDataParams.colType !== 'order_total') {
                    let obja = {};
                    this.allData.datasDate.forEach((item, index) => {
                      obja[item.name] = false;
                      if (this.orderType[this.riskLabelTabelDataParams.colType] === item.name) {
                        obja[item.name] = true;
                      }
                    });
                    this.optionParamBarTriggerNumber.legend.selected = obja;
                  }
                }
              });
            } else {
              this.lineGrossShow = false;
            }
          } else {
            this.lineGrossShow = false;
          }
          if (!this.lineGrossShow) {
            this.optionParamBarTriggerNumber = {
              width: '90%',
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
          this.$nextTick(() => {
            this.desserts = this.allData.riskOrderList;
          });
          this.totalItems = res.data.data.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
        } else {
          this.pageNum = res.data.data.page;
          this.totalItems = res.data.data.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
          this.loading = false;
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
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
