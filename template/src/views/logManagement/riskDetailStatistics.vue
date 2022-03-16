<template>
  <div>
    <!-- 效能分析页：查询条件 -->
      <v-row class="pt-3">
        <v-col cols="10">
          <v-form ref="searchForm" v-model="searchValid" lazy-validation>
            <v-row>
               <v-col cols="3" class="mr-4">
                <DatePicker
                type="daterange"
                v-model="searchForm.dates"
                :options="options"
                :clearable="false"
                placement="top-start"
                placeholder="选择日期"
                style="width: 100%"
                id='data-picker'
                ></DatePicker>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="searchForm.transactionType"
                  :items="tradeTypeItems"
                  :key="newDate"
                  placeholder="交易类型:"
                  item-text="text"
                  item-value="value"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  class="pt-0 pb-0"
                  background-color="white"
                ></v-select>
              </v-col>
              <v-col
                cols="4"
                style="text-align: left; position: relative;line-height: 37px;"
              >
                <div class="dateBtnBox">
                  <v-btn
                    color="primary"
                    class="ml-4"
                    @click="reset"
                    small
                  >重置条件</v-btn>
                  <v-btn
                    v-btn="['/exportRuleMonitoringButton']"
                    color="primary"
                    class="ml-4"
                    small
                    disabled
                    @click="snackbar = true"
                  >导出</v-btn>
                  <v-btn
                    color="primary"
                    class="ml-4"
                    small
                    @click="searchBtn"
                  >查询</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
        <v-col cols="2">
          <v-dialog v-model="isdateShow" width="321">
            <v-date-picker selected-items-text="已选择日期" v-model="searchForm.dates" range  @change="dateChange"></v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <!-- 图表 -->
      <div>
        <v-row>
          <v-col cols='6'>
            <v-hover v-slot="{ hover }">
              <div style="position: relative">
                <echart-export-file
                  :chartId="'riskDetailStatisticsRuleTriggerBar'"
                  :isActive="isActiveBtnNumBar"
                  :hover="hover"
                  :fileName="appName + '-规则触发数量TOP10'"
                  v-if="hasPermission('/riskDetailRuleTriggerNumsBarExportBtn')"
                  style="position: absolute; right: 20px; top:8px; z-index: 4"
                  @exportExcel="exportExcelStatistics(arguments, 'ruleTriggerNumsBar', 'excel')"
                  @exportCSV="exportExcelStatistics(arguments, 'ruleTriggerNumsBar', 'csv')"
                ></echart-export-file>
                <base-echarts :chartId="'riskDetailStatisticsRuleTriggerBar'" :optionParam="optionParamBarTriggerNumber" @mouseoverEvent="barTopMouseoverEvent" @clickEvent="clickEventBarTop"></base-echarts>
                <!-- <div v-show="!isBarChartShow" class="noDataEchartsTextBox">
                  <h2 class="noDataEchartsTitleText">规则触发数量Top10</h2>
                  <h3 class="noDataEchartsText">
                    {{ noDataEchartsText }}
                  </h3>
                </div> -->
              </div>
            </v-hover>
          </v-col>
          <v-col cols='6'>
            <v-hover v-slot="{ hover }">
              <div style="position: relative">
                <echart-export-file
                  :chartId="'riskDetailStatisticsRuleTriggerPie'"
                  :isActive="isActiveBtnNumPie"
                  v-if="hasPermission('/riskDetailRuleTriggerNumPieExportBtn')"
                  :hover="hover"
                  :fileName="appName + '-规则触发数量TOP10占比'"
                  style="position: absolute; right: 20px; top:8px; z-index: 4"
                  @exportExcel="exportExcelStatistics(arguments, 'ruleTriggerNumsPie', 'excel')"
                  @exportCSV="exportExcelStatistics(arguments, 'ruleTriggerNumsPie', 'csv')"
                ></echart-export-file>
                <base-echarts :chartId="'riskDetailStatisticsRuleTriggerPie'" :optionParam="optionParamPieTriggerNumber" @mouseoverEvent="pieTopMouseoverEvent" @clickEvent="clickEventPieTop"></base-echarts>
              </div>
            </v-hover>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols='6'>
            <v-hover v-slot="{ hover }">
              <div style="position: relative">
                <echart-export-file
                  :chartId="'riskDetailStatisticsRuleConfirmBar'"
                  :isActive="isActiveBtnRuleConfirmBar"
                  :hover="hover"
                  v-if="hasPermission('/riskDetailRuleConfirmNumBarExportBtn')"
                  :fileName="appName + '-规则确认案件数量TOP10'"
                  style="position: absolute; right: 20px; top:8px; z-index: 4"
                  @exportExcel="exportExcelStatistics(arguments, 'ruleConfirmNumsBar', 'excel')"
                  @exportCSV="exportExcelStatistics(arguments, 'ruleConfirmNumsBar', 'csv')"
                ></echart-export-file>
                <base-echarts :chartId="'riskDetailStatisticsRuleConfirmBar'" :optionParam="optionParamBarCase"></base-echarts>
              </div>
            </v-hover>
          </v-col>
          <v-col cols='6'>
            <v-hover v-slot="{ hover }">
              <div style="position: relative">
                <echart-export-file
                  :chartId="'riskDetailStatisticsRuleConfirmNumsPie'"
                  :isActive="isActiveBtnRuleConfirmPie"
                  :hover="hover"
                  v-if="hasPermission('/riskDetailRuleConfirmNumPieExportBtn')"
                  :fileName="appName + '-规则确认案件数量TOP10占比'"
                  style="position: absolute; right: 20px; top:8px; z-index: 4"
                  @exportExcel="exportExcelStatistics(arguments, 'ruleConfirmNumsPie', 'excel')"
                  @exportCSV="exportExcelStatistics(arguments, 'ruleConfirmNumsPie', 'csv')"
                ></echart-export-file>
                <base-echarts :chartId="'riskDetailStatisticsRuleConfirmNumsPie'" :optionParam="optionParamPieCase"></base-echarts>
              </div>
            </v-hover>
          </v-col>
        </v-row>
      </div>
      <!-- 表格 -->
      <div>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="perPageNum"
          no-results-text="没有匹配的数据"
          no-data-text="没有匹配的数据"
          :search="tabelSearch"
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-row style="align-items: center;">
                <v-col class="mb-0" md="3">
                  <v-card-title class="pl-0">
                    <v-text-field
                      v-model="tabelSearch"
                      placeholder="请输入条件搜索"
                      append-icon="mdi-magnify"
                      outlined
                      dense
                    ></v-text-field>
                  </v-card-title>
                </v-col>
                <v-spacer></v-spacer>
                <v-col md="1" class="pr-4">
                  <v-card-title style="float: right;padding: 0;">
                    <v-btn color="primary" @click="searchRisk()">规则搜索</v-btn>
                  </v-card-title>
                </v-col>
                <v-col md="1" v-if="hasPermission('/riskDetailListExportBtn')">
                  <!-- <v-card-title>
                    <v-menu bottom>
                    <template v-slot:activator="{on, attrs}">
                      <v-btn
                        v-btn="['/exportRuleMonitoringButton']"
                        color="primary"
                        class="ml-4"
                        small
                        v-on="on"
                        v-bind="attrs"
                        @click="snackbar = true"
                      >导出</v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="exportExcelStatistics()">导出Excel</v-list-item>
                      <v-list-item>导出CSV</v-list-item>
                    </v-list>
                  </v-menu>
                    <v-btn color="primary" v-btn="['/exportRuleButton']" @click="allExport()">导出</v-btn>
                  </v-card-title> -->
                  <echart-export-file
                    :isEchart="false"
                    :isActive="isActiveBtnSheet"
                    :chartId="'verificationSheet'"
                    :fileName="appName + '-规则监控列表'"
                    style="position: absolute; right: 16px; top:18px; z-index: 4"
                    @exportExcel="exportExcelStatistics(arguments, 'ruleList', 'excel')"
                    @exportCSV="exportExcelStatistics(arguments, 'ruleList', 'csv')"
                  ></echart-export-file>
                </v-col>
              </v-row>
            </v-toolbar>
          </template>
          <template v-slot:item.ruleCount="{ item }">
            <span style="cursor: pointer;" @click="tableClick(item)" dark>{{ item.ruleCount }}</span>
          </template>
          <!-- 分页 -->
          <template v-slot:no-data>
              <div>没有数据</div>
            </template>
            <template v-slot:footer >
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
                    />
                  </span>条
                  <span style="margin-left:15px">共{{ totalItems }}条</span>
                  <v-spacer/>
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
      </div>
  </div>
</template>
<script>
import $ from 'jquery';
import BaseEcharts from '@c/BaseEcharts';
import EchartExportFile from '@c/EchartExportFile';
import * as dataService from 'api/riskMarket.js';
import * as riskDetailStatistics from 'api/riskDetailStatistics.js';
import { mapGetters, mapActions } from 'vuex';
import { DatePicker } from 'view-design';
import { downloadFile } from '@/utils/downloadFile';
import moment from 'moment';
export default {
  data () {
    return {
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
      ruleName: '', // 页尾列表的搜索框的值
      allData: [],
      tradeTypeItems: [],
      selectDate: '',
      dateItems: [
        { selectText: '今天', selectField: '' },
        { selectText: '昨天', selectField: -1 },
        { selectText: '近一周', selectField: -7 },
        { selectText: '近一月', selectField: -30 }
      ],
      /* optionParamBar: {
        width: '500px',
        height: '500px',
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      }, */
      // 规则触发数量Top10
      optionParamBarTriggerNumber: {
        width: '85%',
        height: '500px',
        title: [{
          text: '规则触发数量Top10',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#000000',
            fontWeight: 'bold',
            fontSize: 18
          }
        },
        {
          subtext: '暂无数据',
          left: 'center',
          top: 'center',
          subtextStyle: {
            color: '#000000',
            fontWeight: 'normal',
            fontSize: 16
          }
        }]
      },
      // 规则触发数量Top10
      optionParamPieTriggerNumber: {
        width: '85%',
        height: '500px',
        title: [{
          text: '规则触发数量Top10',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#000000',
            fontWeight: 'bold',
            fontSize: 18
          }
        },
        {
          subtext: '暂无数据',
          left: 'center',
          top: 'center',
          subtextStyle: {
            color: '#000000',
            fontWeight: 'normal',
            fontSize: 16
          }
        }]
      },
      // 规则确认案件数量Top10
      optionParamBarCase: {
        width: '85%',
        height: '500px',
        title: [{
          text: '规则确认案件数量Top10',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#000000',
            fontWeight: 'bold',
            fontSize: 18
          }
        },
        {
          subtext: '暂无数据',
          left: 'center',
          top: 'center',
          subtextStyle: {
            color: '#000000',
            fontWeight: 'normal',
            fontSize: 16
          }
        }]
      },
      // 规则确认案件数量Top10
      optionParamPieCase: {
        width: '85%',
        height: '500px',
        title: [{
          text: '规则确认案件数量Top10',
          left: 'center',
          top: 'top',
          textStyle: {
            color: '#000000',
            fontWeight: 'bold',
            fontSize: 18
          }
        },
        {
          subtext: '暂无数据',
          left: 'center',
          top: 'center',
          subtextStyle: {
            color: '#000000',
            fontWeight: 'normal',
            fontSize: 16
          }
        }]
      },
      headers: [
        {
          text: '交易类型',
          align: 'start',
          sortable: false,
          value: 'opTypeName',
          width: '100px'
        },
        { text: '规则编号', sortable: false, value: 'ruleNo', width: '100px' },
        { text: '规则名称', value: 'ruleName', sortable: false, width: '100px' },
        { text: '规则触发次数', value: 'ruleCount', sortable: false, width: '120px' },
        { text: '规则触发比例', value: 'ruleRadio', sortable: false, width: '120px' },
        { text: '确认的案件数量', value: 'confirmcaseCount', sortable: false, width: '140px' },
        { text: '规则有效率', value: 'confirmRadio', sortable: false, width: '100px' },
        { text: '确认的清白件数量', value: 'whitecaseCount', sortable: false, width: '150px' },
        { text: '规则误判率', value: 'whiteRadio', sortable: false, width: '100px' },
        { text: '确认为疑似欺诈案件的数量', value: 'suspectedCount', sortable: false, width: '200px' }
      ],
      desserts: [],
      search: '',
      tabelSearch: '',
      // 查看图表的公共弹窗的变量
      riskViewingReportsRiskInfo: {
        // riskCode: '111',
        // riskName: '2222',
        // riskChannel: '333',
        // riskScene: '444',
        // riskNumber: '555'
      },
      riskViewingReportsHeaders: [
        // {
        //   text: '规则编号',
        //   align: 'start',
        //   sortable: false,
        //   value: 'name',
        //   width: '100px'
        // },
        // { text: '规则名称', value: 'calories', sortable: false, width: '100px' },
        // { text: '规则触发次数', value: 'fat', sortable: false, width: '120px' },
        // { text: '规则触发比例', value: 'carbs', sortable: false, width: '120px' },
        // { text: '确认的案件数量', value: 'protein', sortable: false, width: '140px' },
        // { text: '规则有效率', value: 'iron', sortable: false, width: '100px' },
        // { text: '确认的清白件数量', value: 'iron2', sortable: false, width: '150px' },
        // { text: '规则误判率', value: 'iron3', sortable: false, width: '100px' },
        // { text: '去人为疑似欺诈案件的数量', value: 'iron4', sortable: false, width: '200px' }
      ],
      riskViewingReportsData: [],
      newDate: null,
      vuexAppList: [],
      appName: '', // 应用中文名称
      transactionTypeText: '', // 应用场景中文名称
      resTradeTypeItems: [], // 应用场景数组
      scenesId: '',
      riskViewingReportsParams: {},
      // 时间选择框
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
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: '近一月',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: '近一年',
            value () {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              return [start, end];
            }
          }
        ]
      },
      dataIndex: null,
      // 判断四个echarts图表是不是有数据
      isPieChartShow: true,
      isBarChartShow: true,
      isBarCaseChartShow: true,
      isPieCaseChartShow: true,
      noDataEchartsText: '暂无数据',
      // 判断图表是否可用
      isActiveBtnRuleConfirmBar: true,
      isActiveBtnRuleConfirmPie: true,
      isActiveBtnNumBar: true,
      isActiveBtnNumPie: true,
      isActiveBtnSheet: true
    };
  },
  computed: {
    ...mapGetters([
      'appId'
    ]),
    dateRangeText: {
      get () {
        if (moment(this.searchForm.dates[0]).valueOf() > moment(this.searchForm.dates[1]).valueOf()) {
          this.reverseArry(this.searchForm.dates);
        }
        return this.searchForm.dates.join(' 至 ');
      },
      set (newVal) {}
    }
  },
  components: {
    BaseEcharts,
    EchartExportFile,
    DatePicker
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        Promise.all([
          this.searchData(),
          this.getTradeTypeList()
        ]);
      },
      immediate: true
    }
  },
  mounted () {
    if (this.searchForm.transactionType) {
      Promise.all([
        this.searchData(),
        this.initGetData()
        // this.getTradeTypeList()
      ]);
    } else {
      this.searchData();
      this.getTradeTypeList();
    }
  },
  methods: {
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
          // appId: JSON.stringify([this.appId])
          // appTag: appTag,
          appId: this.appId
        };
        this.tradeTypeItems = [];
        const response = await riskDetailStatistics.getAppScene(param);
        if (response.data.code === 200) {
          let resTradeTypeItems = response.data.data.records;
          this.resTradeTypeItems = response.data.data.records;
          if (resTradeTypeItems.length > 0) {
            resTradeTypeItems.forEach((item, index, ary) => {
              this.tradeTypeItems.push({
                text: item.tradeName,
                value: item.tradeId
              });
            });
          } else {
            this.tradeTypeItems = [];
          }
          this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
          this.searchForm.transactionType = this.tradeTypeItems[0].value;
          this.initGetData();
        }
      }
    },
    // change时间
    changeDay (daysOfNumber) {
      // 生成开始时间和结束时间
      let today = new Date();
      today.setTime(today.getTime() + daysOfNumber * 24 * 60 * 60 * 1000);
      let startDay = today;
      let endDay = new Date();
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
    reset () {
      this.searchForm.dates = [this.dateEnd, this.dateEnd];
      this.selectDate = this.dateItems[0];
      this.changeDay(0);
      this.searchForm.transactionType = this.tradeTypeItems[0];
      this.searchBtn();
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
    searchBtn () {
      this.echartsBarIndex = 0;
      this.echartsPieIndex = 0;
      this.pageNum = 1;
      this.initGetData();
    },
    // 第一个柱图 hover事件
    barTopMouseoverEvent (data) {
      this.dataIndex = data.dataIndex;
    },
    // 第一个饼图 hover事件
    pieTopMouseoverEvent (data) {
      this.dataIndex = data.dataIndex;
    },
    // 第一个柱图
    clickEventBarTop (data) {
      this.echartsBarIndex++;
      if (this.echartsBarIndex === 1 || this.allData.ruleHitTopS.length > 0) {
        this.allData.ruleHitTopS.forEach((item, index) => {
          if (item.slice(item.lastIndexOf(',') + 1) === data.name && index === this.dataIndex) {
            this.baseBlank(data.name, item.split(',')[0], item.split(',')[1]);
          }
        });
      }
    },
    // 第一个饼图
    clickEventPieTop (data) {
      this.echartsPieIndex++;
      if (this.echartsBarIndex === 1 || this.allData.pieHitChartS.length > 0) {
        this.allData.pieHitChartS.forEach((item, index) => {
          if (item.slice(item.lastIndexOf(',') + 1) === data.name && index === this.dataIndex) {
            this.baseBlank(data.name, item.split(',')[0], item.split(',')[1]);
          }
        });
      }
    },
    // 第二个柱图
    clickEventBarBottom (data) {
      // 查看图表
      let sStorage = window.sessionStorage;
      sStorage.setItem('riskViewingReportsRiskInfo', JSON.stringify(this.riskViewingReportsRiskInfo));
      sStorage.setItem('riskViewingReportsHeaders', JSON.stringify(this.riskViewingReportsHeaders));
      sStorage.setItem('riskViewingReportsData', JSON.stringify(this.riskViewingReportsData));
      this.$router.push('/riskDetailViewingReports');
    },
    // 第二个饼图
    clickEventPieBottom (data) {
      // 查看图表
      let sStorage = window.sessionStorage;
      sStorage.setItem('riskViewingReportsRiskInfo', JSON.stringify(this.riskViewingReportsRiskInfo));
      sStorage.setItem('riskViewingReportsHeaders', JSON.stringify(this.riskViewingReportsHeaders));
      sStorage.setItem('riskViewingReportsData', JSON.stringify(this.riskViewingReportsData));
      this.$router.push('/riskDetailViewingReports');
    },
    getColor (calories) {
      if (calories > 400) return 'red';
      else if (calories > 200) return 'orange';
      else return 'green';
    },
    async baseBlank (ruleNo, ruleName, tradeName) {
      // 根据点击的列的name判断跳转页面传的场景id，前面全部类型的时候获取不到
      if (this.resTradeTypeItems.length > 0) {
        this.resTradeTypeItems.forEach((item) => {
          if (tradeName === item.tradeName) {
            this.scenesId = item.id;
            this.transactionTypeText = item.tradeName;
          }
        });
      } else {
        this.scenesId = '';
        this.transactionTypeText = '';
      }
      let params = {
        pageIndex: 1,
        pageSize: 10,
        appId: this.appId,
        scenesId: this.scenesId,
        ruleNo: ruleNo, // 标号
        startTime: this.searchForm.dates.length === 2 ? this.dateToString(this.searchForm.dates[0]) : '',
        endTime: this.searchForm.dates.length === 2 ? this.dateToString(this.searchForm.dates[1]) : '',
        ruleName: ruleName // 中文名称
      };
      this.riskViewingReportsParams = params;
      let sStorage = window.sessionStorage;
      try {
        const res = await riskDetailStatistics.getRiskDetail(params);
        if (res.data.code === 200) {
          if (res.data.data.opLogTitle.length > 0) {
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
          }
          if (res.data.data.opLogDate.length > 0) {
            this.riskViewingReportsData = res.data.data.opLogDate;
          } else {
            this.riskViewingReportsData = [];
          }
          this.riskViewingReportsRiskInfo = {};
          if (res.data.data.ruleTrigger && Object.keys(res.data.data.ruleTrigger).length > 0) {
            this.riskViewingReportsRiskInfo = {
              riskCode: res.data.data.ruleTrigger.ruleNo,
              riskName: res.data.data.ruleTrigger.ruleName,
              riskChannel: this.appName,
              riskScene: this.transactionTypeText,
              riskNumber: res.data.data.ruleTrigger.ruleCount,
              total: res.data.data.total,
              optype: res.data.data.ruleTrigger.optype,
              pages: res.data.data.pages
            };
          } else {
            this.riskViewingReportsRiskInfo = {
              riskCode: '',
              riskName: '',
              riskChannel: this.appName,
              riskScene: this.transactionTypeText,
              riskNumber: '',
              optype: '',
              total: res.data.data.total,
              pages: res.data.data.pages
            };
          }
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
    async tableClick (item) {
      this.baseBlank(item.ruleNo, item.ruleName, item.opTypeName);
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.initGetData();
    },
    // 页数
    pageChange () {
      this.searchBtn();
    },
    searchData () {
      var today = new Date();
      today.setTime(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.dateStart = today;
      this.dateEnd = new Date();
      this.searchForm.dates = [this.dateEnd, this.dateEnd];
    },
    async initGetData () {
      if (this.appId) {
        let params = {
          pageIndex: this.pageNum,
          pageSize: this.perPageNum,
          appId: this.appId,
          opTypeId: typeof this.searchForm.transactionType === 'object' ? this.searchForm.transactionType.value : this.searchForm.transactionType,
          ruleName: this.ruleName,
          startTime: this.searchForm.dates.length === 2 ? this.dateToString(this.searchForm.dates[0]) : '',
          endTime: this.searchForm.dates.length === 2 ? this.dateToString(this.searchForm.dates[1]) : ''
        };
        try {
          const res = await riskDetailStatistics.queryAllList(params);
          if (res.data.code === 200) {
            this.allData = res.data.data;
            // if (this.resTradeTypeItems.length > 0) {
            //   this.resTradeTypeItems.forEach((item, index, ary) => {
            //     if (this.searchForm.transactionType === item.tradeId) {
            //       this.scenesId = item.id;
            //       this.transactionTypeText = item.tradeName;
            //     }
            //   });
            // } else {
            //   this.scenesId = '';
            //   this.transactionTypeText = '';
            // }
            this.$nextTick(() => {
              // 规则触发数量Top10----柱图
              let ruleHitTopS = this.allData.ruleHitTopS;
              let ruleProduceList = this.allData.ruleProduceList; // 拼接类型获取参数
              let ruleHitTopSxAxisData = [];
              ruleHitTopS.forEach((item, index) => {
                ruleHitTopSxAxisData[index] = item.slice(item.lastIndexOf(',') + 1);
              });
              // 判断是否有数据，还是暂无
              if (ruleHitTopS.length > 1 || (ruleHitTopS.length === 1 && ruleHitTopS[0] !== 0)) {
                this.isBarChartShow = true; // 显示图表
                this.optionParamBarTriggerNumber = {
                  width: '500px',
                  height: '500px',
                  title: {
                    text: '规则触发数量Top10',
                    subtext: '',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function (params) {
                      for (let index = 0; index < ruleHitTopS.length; index++) {
                        const element = ruleHitTopS[index];
                        if (index === params[0].dataIndex) {
                          return (
                            ruleHitTopS[index].split(',')[0] + '<br>' + ruleHitTopS[index].split(',')[1] + '<br/>' + '<i style="display:inline-block;width:6px;height:6px;vertical-align:middle;margin-right:5px;border-radius:50%;background-color:' + params[0].color + '"></i>' + params[0].value
                          );
                        }
                      }
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
                      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      data: ruleHitTopSxAxisData,
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
                      color: [
                        '#89D7BD',
                        '#4F8BE8',
                        '#ECCAA1',
                        '#EE8F97'
                      ],
                      // data: [10, 52, 200, 334, 390, 330, 220]
                      data: this.allData.ruleHitTopV
                    }
                  ]
                };
              } else {
                this.isBarChartShow = false;
                this.optionParamBarTriggerNumber = {
                  width: '85%',
                  height: '500px',
                  title: [{
                    text: '规则触发数量Top10',
                    left: 'center',
                    top: 'top',
                    textStyle: {
                      color: '#000000',
                      fontWeight: 'bold',
                      fontSize: 18
                    }
                  },
                  {
                    subtext: '暂无数据',
                    left: 'center',
                    top: 'center',
                    subtextStyle: {
                      color: '#000000',
                      fontWeight: 'normal',
                      fontSize: 16
                    }
                  }]
                };
              }
              // 规则触发数量Top10-----饼图
              let pieHitChartS = this.allData.pieHitChartS;
              let pieHitChartV = this.allData.pieHitChartV;
              let pieHitChartSxAxisData = [];
              pieHitChartS.forEach((item, index) => {
                pieHitChartSxAxisData[index] = item.slice(item.lastIndexOf(',') + 1);
              });
              pieHitChartV.forEach((item, index, ary) => {
                item.name = item.name.slice(item.name.lastIndexOf(',') + 1);
              });
              if (pieHitChartV.length > 1 || (pieHitChartV.length === 1 && pieHitChartV[0] !== 0)) {
                this.isPieChartShow = true;
                this.optionParamPieTriggerNumber = {
                  width: '500px',
                  height: '500px',
                  title: {
                    text: '规则触发数量Top10',
                    subtext: '',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'item',
                    // formatter: '{b} : {c} ({d}%)'
                    formatter: function (params) {
                      // console.log(params.dataIndex);
                      for (let index = 0; index < pieHitChartS.length; index++) {
                        const element = pieHitChartS[index];
                        if (index === params.dataIndex) {
                          return (
                            pieHitChartS[index].split(',')[0] + '<br>' + pieHitChartS[index].split(',')[1] + '<br/>' + '<i style="display:inline-block;width:6px;height:6px;vertical-align:middle;margin-right:5px;border-radius:50%;background-color:' + params.color + '"></i>' + params.value
                          );
                        }
                      }
                    }
                  },
                  legend: {
                    show: false,
                    orient: 'vertical',
                    left: 'left',
                    // data: ['直接访问', '邮件营销', '联盟广告', '视频广告']
                    // data: this.allData.pieHitChartS
                    data: pieHitChartSxAxisData
                  },
                  series: [
                    {
                      name: '',
                      type: 'pie',
                      radius: '55%',
                      label: {
                        show: true,
                        formatter: '{b}: \n {c}'
                      },
                      center: ['50%', '60%'],
                      color: [
                        '#89D7BD',
                        '#4F8BE8',
                        '#ECCAA1',
                        '#EE8F97'
                      ],
                      data: pieHitChartV
                    }
                  ]
                };
              } else {
                this.isPieChartShow = false;
                this.optionParamPieTriggerNumber = {
                  width: '85%',
                  height: '500px',
                  title: [{
                    text: '规则触发数量Top10',
                    left: 'center',
                    top: 'top',
                    textStyle: {
                      color: '#000000',
                      fontWeight: 'bold',
                      fontSize: 18
                    }
                  },
                  {
                    subtext: '暂无数据',
                    left: 'center',
                    top: 'center',
                    subtextStyle: {
                      color: '#000000',
                      fontWeight: 'normal',
                      fontSize: 16
                    }
                  }]
                };
              }
              // let ruleValTopS = ['addssa000,111', 'Tue11111,222', ',3333', 'Thu,王国栋', 'Fri,55555', 'Sat,66', 'Sun,7777'];
              let ruleValTopS = this.allData.ruleValTopS;
              let ruleValTopSxAxisData = [];
              ruleValTopS.forEach((item, index) => {
                ruleValTopSxAxisData[index] = item.slice(item.lastIndexOf(',') + 1);
              });
              // 规则确认案件数量Top10----柱图
              if (ruleValTopS.length > 0) {
                this.isBarCaseChartShow = true;
                this.optionParamBarCase = {
                  width: '500px',
                  height: '500px',
                  title: {
                    text: '规则确认案件数量Top10',
                    subtext: '',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function (params) {
                      for (let index = 0; index < ruleValTopS.length; index++) {
                        const element = ruleValTopS[index];
                        if (index === params[0].dataIndex) {
                          return (
                            ruleValTopS[index].split(',')[0] + '<br>' + ruleValTopS[index].split(',')[1] + '<br/>' + '<i style="display:inline-block;width:6px;height:6px;vertical-align:middle;margin-right:5px;border-radius:50%;background-color:' + params[0].color + '"></i>' + params[0].value
                          );
                        }
                      }
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
                      // data: ['111', '222', '3333', '王国栋', '55555', '66', '7777'],
                      // data: this.allData.ruleValTopS,
                      data: ruleValTopSxAxisData,
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
                      color: [
                        '#89D7BD',
                        '#4F8BE8',
                        '#ECCAA1',
                        '#EE8F97'
                      ],
                      // data: [10, 52, 200, 334, 390, 330, 220]
                      data: this.allData.ruleValTopV
                    }
                  ]
                };
              } else {
                this.isBarCaseChartShow = false;
                this.optionParamBarCase = {
                  width: '85%',
                  height: '500px',
                  title: [{
                    text: '规则确认案件数量Top10',
                    left: 'center',
                    top: 'top',
                    textStyle: {
                      color: '#000000',
                      fontWeight: 'bold',
                      fontSize: 18
                    }
                  },
                  {
                    subtext: '暂无数据',
                    left: 'center',
                    top: 'center',
                    subtextStyle: {
                      color: '#000000',
                      fontWeight: 'normal',
                      fontSize: 16
                    }
                  }]
                };
              }
              // 规则确认案件数量Top10----饼图
              let pieValChartS = this.allData.pieValChartS;
              let pieValChartV = this.allData.pieValChartV;
              let pieValChartSxAxisData = [];
              pieValChartS.forEach((item, index) => {
                pieValChartSxAxisData[index] = item.slice(item.lastIndexOf(',') + 1);
              });
              pieValChartV.forEach((item, index, ary) => {
                item.name = item.name.slice(item.name.lastIndexOf(',') + 1);
              });
              if (pieValChartV.length > 0) {
                this.isPieCaseChartShow = true;
                this.optionParamPieCase = {
                  width: '500px',
                  height: '500px',
                  title: {
                    text: '规则确认案件数量Top10',
                    subtext: '',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'item',
                    // formatter: '{b} : {c} ({d}%)'
                    formatter: function (params) {
                      for (let index = 0; index < pieValChartS.length; index++) {
                        const element = pieValChartS[index];
                        if (index === params.dataIndex) {
                          return (
                            pieValChartS[index].split(',')[0] + '<br>' + pieValChartS[index].split(',')[1] + '<br/>' + '<i style="display:inline-block;width:6px;height:6px;vertical-align:middle;margin-right:5px;border-radius:50%;background-color:' + params.color + '"></i>' + params.value
                          );
                        }
                      }
                    }
                  },
                  legend: {
                    show: false,
                    orient: 'vertical',
                    left: 'left',
                    // data: ['直接访问', '邮件营销', '联盟广告', '视频广告']
                    data: pieValChartSxAxisData
                  },
                  series: [
                    {
                      name: '',
                      type: 'pie',
                      radius: '55%',
                      center: ['50%', '60%'],
                      label: {
                        show: true,
                        formatter: '{b}: \n {c}'
                      },
                      color: [
                        '#89D7BD',
                        '#4F8BE8',
                        '#ECCAA1',
                        '#EE8F97'
                      ],
                      data: pieValChartV
                    }
                  ]
                };
              } else {
                this.isPieCaseChartShow = false;
                this.optionParamPieCase = {
                  width: '85%',
                  height: '500px',
                  title: [{
                    text: '规则确认案件数量Top10',
                    left: 'center',
                    top: 'top',
                    textStyle: {
                      color: '#000000',
                      fontWeight: 'bold',
                      fontSize: 18
                    }
                  },
                  {
                    subtext: '暂无数据',
                    left: 'center',
                    top: 'center',
                    subtextStyle: {
                      color: '#000000',
                      fontWeight: 'normal',
                      fontSize: 16
                    }
                  }]
                };
              }
              this.desserts = this.allData.ruleProduceList;
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
          }
        } catch (err) {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        }
      }
    },
    async searchRisk () {
      let params = {
        pageIndex: this.pageNum,
        pageSize: this.perPageNum,
        appId: this.appId,
        opTypeId: this.searchForm.transactionType,
        ruleName: this.tabelSearch,
        startTime: this.searchForm.dates.length === 2 ? this.dateToString(this.searchForm.dates[0]) : '',
        endTime: this.searchForm.dates.length === 2 ? this.dateToString(this.searchForm.dates[1]) : ''
      };
      try {
        const res = await riskDetailStatistics.queryAllList(params);
        if (res.data.code === 200) {
          this.allData = res.data.data;
          // if (this.resTradeTypeItems.length > 0) {
          //   this.resTradeTypeItems.forEach((item, index, ary) => {
          //     if (this.searchForm.transactionType === item.tradeId) {
          //       this.scenesId = item.id;
          //       this.transactionTypeText = item.tradeName;
          //     }
          //   });
          // } else {
          //   this.scenesId = '';
          //   this.transactionTypeText = '';
          // }
          this.$nextTick(() => {
            this.desserts = this.allData.ruleProduceList;
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
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // echarts图表的导出excel
    async exportExcelStatistics (fileName, name, type) {
      let params = {
        appId: this.appId,
        opType: this.searchForm.transactionType,
        ruleName: this.tabelSearch,
        fileType: type,
        startTime: this.searchForm.dates.length === 2 ? this.dateToString(this.searchForm.dates[0]) : '',
        endTime: this.searchForm.dates.length === 2 ? this.dateToString(this.searchForm.dates[1]) : ''
      };
      this.isActiveBtnRuleConfirmBar = false;
      this.isActiveBtnRuleConfirmPie = false;
      this.isActiveBtnNumBar = false;
      this.isActiveBtnNumPie = false;
      this.isActiveBtnSheet = false;
      if (name === 'ruleTriggerNumsBar' || name === 'ruleTriggerNumsPie') {
        riskDetailStatistics.exportruletriggertopten(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnNumBar = true;
          this.isActiveBtnNumPie = true;
        }).catch(() => {
          this.isActiveBtnNumBar = true;
          this.isActiveBtnNumPie = true;
        });
      } else if (name === 'ruleConfirmNumsBar' || name === 'ruleConfirmNumsPie') {
        riskDetailStatistics.exportrulevaliditytopten(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnRuleConfirmBar = true;
          this.isActiveBtnRuleConfirmPie = true;
        }).catch(() => {
          this.isActiveBtnRuleConfirmBar = true;
          this.isActiveBtnRuleConfirmPie = true;
        });
      } else if (name === 'ruleList') {
        riskDetailStatistics.exportrulehit(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnSheet = true;
        }).catch(() => {
          this.isActiveBtnSheet = true;
        });
      }
      // console.log(result);
    },
    async allExport () {
      // to do
      // window.location.href = '接口?参数1=xxx&参数2=xxx'
      /* let params = {
        appId: this.appId,
        opTypeId: this.searchForm.transactionType,
        ruleName: this.tabelSearch,
        startTime: this.searchForm.dates.length === 2 ? (this.searchForm.dates[0]) : '',
        endTime: this.searchForm.dates.length === 2 ? (this.searchForm.dates[1]) : ''
      };
      try {
        const res = await riskDetailStatistics.exportData(params);
        if (res.data.code === 200) {
          console.log('点击了导出成功');
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      } */
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
#data-picker /deep/ .ivu-input{
    height:40px
}
.noDataEchartsTextBox {
  position: relative;
  width: 100%;
  height: 532px;
  background-color: #fff;
}
.noDataEchartsText {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left:-32.74px;
}
.noDataEchartsTitleText {
  padding-top: 1.5%;
  text-align: center;
  font-size: 18px;
}
</style>
