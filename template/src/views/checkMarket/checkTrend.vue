<!---- 核查趋势 ----->
<template>
  <div>
    <div class="top-bg pt-7 pb-4">
      <!-- 核查头部 -->
      <div>
        <h3 class="todayTitle">今日核查单统计</h3>
      </div>
      <v-row class="pb-3">
        <!-- <div style="color: #2d2d2d;font-weight:bold;font-size:40px;">今日</div>
        <v-spacer></v-spacer> -->
        <v-col
          v-for="(item, n) in todayEventsData"
          :key="n"
          class=""
          style="position: relative;"
        >
          <div class="clearfix" @click="todayEventClick(item)">
            <div class="fl pLeft">
              <div class="today-event-icon-outcircle" v-if="item.name === '总核查单'">
                <div class="cardPng cardFive"/>
              </div>
              <div class="today-event-icon-outcircle" v-if="item.name === '待分配'">
                <div class="cardPng cardTwo"/>
              </div>
              <div class="today-event-icon-outcircle"  v-if="item.name === '待初审'">
                <div class="cardPng cardThree"/>
              </div>
              <div class="today-event-icon-outcircle"  v-if="item.name === '待复审'">
                <div class="cardPng cardFour"/>
              </div>
              <div class="today-event-icon-outcircle"  v-if="item.name === '已完结'">
                <div class="cardPng cardOne"/>
              </div>
            </div>
            <div class="fl today-event-box">
              <div class="text-center">
                <span class="today-event-number">
                  {{ item.number }}
                </span>
              </div>
              <div class="today-event-name">
                {{ item.name }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="top-bg mt-4">
      <!-- 代办事项 -->
      <v-row class="mt-3">
        <v-col cols="12">
            <v-card class="elevation-3">
              <v-card-text>
                <p class="echartsP">待办事项
                  <echart-export-file
                    :isEchart="false"
                    :isActive="isActiveBtnList"
                    :chartId="'verificationSheet'"
                    :fileName="appName + '-待办事项'"
                    style="display:inline;float:right;margin-top:-4px;"
                    class="ml-4"
                    v-if="hasPermission('/checkTrendListexportBtn')"
                    @exportExcel="exportData(arguments, 'excel', 'list')"
                    @exportCSV="exportData(arguments, 'csv', 'list')"
                  ></echart-export-file>
                  <!-- (<span style="color: red;cursor: pointer;">{{ backlogNumber }}</span>) -->
                </p>
                <div style="font-size:12px;">
                  <span class="textEllipsis" style="width:10%;"> 所属应用 </span>
                  <span class="textEllipsis" style="width:10%;"> 交易类型 </span>
                  <span class="textEllipsis" style="width:10%;"> 用户标识 </span>
                  <span class="textEllipsis" style="width:15%;"> 生成/创建时间 </span>
                  <span class="textEllipsis" style="width:10%;"> 任务来源 </span>
                  <span class="textEllipsis" style="width:10%;"> 任务状态 </span>
                  <span class="textEllipsis" style="width:30%;"> 风险标签 </span>
                </div>
                <div class="marquee" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
                  <div class="marquee_box" v-if="marqueeList.length > 0">
                      <ul class="marquee_list" :class="{marquee_top:animate}">
                          <li v-for="(item, index) in marqueeList" :key="index">
                              <div style="font-size:12px;">
                                <!-- <span class="textEllipsis" style="width:10%;" :title="`${item.appid}`"> {{item.name | ellipsis()}} </span> -->
                                <span class="textEllipsis" style="width:10%;" :title="`${item.appId}`"> {{item.appId}} </span>
                                <span class="textEllipsis" style="width:10%;"> {{item.opType}} </span>
                                <span class="textEllipsis" style="width:10%;"> {{item.userId}} </span>
                                <span class="textEllipsis" style="width:15%;"> {{item.createTime}} </span>
                                <span class="textEllipsis" style="width:10%;"> {{item.src}} </span>
                                <span class="textEllipsis" style="width:10%;"> {{item.stateName}} </span>
                                <span class="textEllipsis" style="width:30%;" :title="`${item.riskLabels}`"> {{item.riskLabels}} </span>
                                <!-- <span class="textEllipsis" style="width:20%;"> {{item.accountNum}} </span>
                                <span class="textEllipsis" style="width:5%;"> {{item.opStatus}} </span>
                                <span class="textEllipsis" style="width:10%;"> {{item.evenType}}</span>
                                <span class="textEllipsis" style="width:5%;" :title="`${item.location}`"> {{item.location}}</span>
                                <span class="textEllipsis" style="width:20%;">{{item.time}}</span> -->
                              </div>
                          </li>
                      </ul>
                  </div>
                  <div class="text-center pt-12" v-else>暂无数据</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
      </v-row>
    </div>
    <!-- 图表 -->
    <div class="mt-4">
      <v-row class="searchTempStyle">
        <v-col cols="10">
          <v-form ref="searchForm" v-model="searchValid" lazy-validation>
            <v-row style="padding: 12px;">
              <v-col cols="3" class="mr-4">
                <DatePicker
                type="daterange"
                v-model="searchForm.dates"
                :options="options"
                placement="top-start"
                placeholder="选择日期"
                style="width: 100%"
                id='data-picker'
                ></DatePicker>
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
                  >重置</v-btn>
                  <v-btn
                    color="primary"
                    class="ml-4"
                    small
                    @click="searchBtn"
                  >查询</v-btn>
                </div>
              </v-col>
              <!-- <v-col cols="8" class="mt-1">
                <span v-for="(item, index) in dateNumber" :key="index">
                  <v-btn
                    :color="active === index ? 'primary' : ''"
                    class="ml-4"
                    small
                    @click="changeDay(item.date, index)"
                  >{{ item.name }}</v-btn>
                </span>
              </v-col> -->
            </v-row>
          </v-form>
        </v-col>
        <v-col cols="2">
          <v-dialog v-model="isdateShow" width="321">
            <v-date-picker selected-items-text="已选择日期" v-model="searchForm.dates" range  @change="dateChange"></v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols='6' class="echartsStyle echartsPaddingLeftStyle">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <echart-export-file
                :chartId="'checkTrendCheckListQuantity'"
                :isActive="isActiveBtnSheet"
                :hover="hover"
                :fileName="appName + '-核查单数量趋势'"
                v-if="hasPermission('/checkTrendSheetExportBtn')"
                style="position: absolute; right: 20px; top:8px; z-index: 4"
                @exportExcel="exportData(arguments, 'excel', 'verificationSheet')"
                @exportCSV="exportData(arguments, 'csv', 'verificationSheet')"
              ></echart-export-file>
              <base-echarts :chartId="'checkTrendCheckListQuantity'" :optionParam="verificationSheet" @clickEvent="verificationSheetClick()"></base-echarts>
            </div>
          </v-hover>
        </v-col>
        <v-col cols='6' class="echartsStyle echartsPaddingRightStyle">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <echart-export-file
                :chartId="'checkTrendResults'"
                :isActive="isActiveBtnResults"
                :hover="hover"
                v-if="hasPermission('/checkTrendResultsExportBtn')"
                :fileName="appName + '-核查单结果分布'"
                style="position: absolute; right: 20px; top:8px; z-index: 4"
                @exportExcel="exportData(arguments, 'excel', 'verificationResults')"
                @exportCSV="exportData(arguments, 'csv', 'verificationResults')"
              ></echart-export-file>
              <base-echarts :chartId="'checkTrendResults'" :optionParam="verificationResults" @clickEvent="verificationResultsClick()"></base-echarts>
            </div>
          </v-hover>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols='6' class="echartsStyle echartsPaddingLeftStyle">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <echart-export-file
                :chartId="'checkTrendCaseType'"
                :isActive="isActiveBtnCaseType"
                :hover="hover"
                v-if="hasPermission('/checkTrendCaseTypeExportBtn')"
                :fileName="appName + '-案件类型分布'"
                style="position: absolute; right: 20px; top:8px; z-index: 4"
                @exportExcel="exportData(arguments, 'excel', 'caseType')"
                @exportCSV="exportData(arguments, 'csv', 'caseType')"
              ></echart-export-file>
              <base-echarts :chartId="'checkTrendCaseType'" :optionParam="caseType" @clickEvent="caseTypeClick()"></base-echarts>
            </div>
          </v-hover>
        </v-col>
        <v-col cols='6' class="echartsStyle echartsPaddingRightStyle">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <echart-export-file
                :chartId="'checkTrendBlackList'"
                :isActive="isActiveBtnNumber"
                :hover="hover"
                v-if="hasPermission('/checkTrendBlackNumberExportBtn')"
                :fileName="appName + '-录黑数量趋势'"
                style="position: absolute; right: 20px; top:8px; z-index: 4"
                @exportExcel="exportData(arguments, 'excel', 'blackListNumber')"
                @exportCSV="exportData(arguments, 'csv', 'blackListNumber')"
              ></echart-export-file>
              <base-echarts :chartId="'checkTrendBlackList'" :optionParam="blackListNumber" @clickEvent="blackListNumberClick()"></base-echarts>
            </div>
          </v-hover>
        </v-col>
      </v-row>
    </div>
    <!-- <del-dialog :isDialogShow='dialogDel' @cancelDel='dialogDel = false' @confimDel='confirmDelFun'></del-dialog> -->
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
import $ from 'jquery';
import * as dataService from 'api/riskMarket.js';
import * as checkTrend from 'api/checkTrend.js';
import { mapGetters, mapActions } from 'vuex';
import DelDialog from '@/components/DelDialog';
// import * as dataService from 'api/caseManagementCenter/caseReport.js';
import { getSearchData } from '@/utils/generalDataTableHeaders';
import BaseEcharts from '@c/BaseEcharts';
import EchartExportFile from '@c/EchartExportFile';
import moment from 'moment';
import BaseSearch from '@c/BaseSearch';
import { DatePicker } from 'view-design';
import { downloadFile } from '@/utils/downloadFile';
const heartCheck = {
  // wstimeout: 60 * 1000,
  // wstimer: null,
  // serverTimer: null,
  /* wsreset () {
    this.wstimer && clearTimeout(this.wstimer);
    this.serverTimer && clearTimeout(this.serverTimer);
  },
  start (ws) {
    this.wsreset();
    this.wstimer = setTimeout(() => {
      ws.send('ping');
      this.serverTimer = setTimeout(() => {
        // 如果超过一定时间还没响应，说明后端断开了
        ws.close();
      }, this.wstimeout);
    }, this.wstimeout);
  } */
};
export default {
  name: 'riskMarket',
  components: {
    BaseEcharts,
    EchartExportFile,
    DatePicker
  },
  animate: false,
  filters: {},
  data: () => ({
    // 分页变量
    pageNum: 1,
    pageSize: 10,
    queryPageLength: 0,
    perPageNum: 10,
    totalItems: 0,
    perPageItems: [5, 10, 15, 20, 50, 100],
    dialogDel: false,
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    clearDate: false,
    // header
    todayEventsData: [
      {
        name: '总核查单',
        number: '0'
      },
      {
        name: '待分配',
        number: '0'
      },
      {
        name: '待初审',
        number: '0'
      },
      {
        name: '待复审',
        number: '0'
      },
      {
        name: '已完结',
        number: '0'
      }
    ],
    // 滚动列表数据
    backlogNumber: 0,
    animate: false,
    marqueeList: [],
    // 定义定时器
    timer: null,
    isdateShow: false,
    searchValid: true,
    searchForm: {
      dateTime: '',
      dates: []
    },
    dateTimeItems: [
      { text: '今天', value: '' },
      { text: '昨天', value: -1 },
      { text: '近一周', value: -6 },
      { text: '近一月', value: -30 },
      { text: '近一年', value: -364 }
    ],
    dateNumber: [
      {
        name: '今天',
        date: 0
      },
      {
        name: '昨天',
        date: -1
      },
      {
        name: '近7天',
        date: -6
      },
      {
        name: '近30天',
        date: -30
      },
      {
        name: '近60天',
        date: -60
      },
      {
        name: '近90天',
        date: -90
      }
    ],
    active: 0,
    lockReconnect: false, // 连接失败不进行重连
    // 核查单数量趋势
    verificationSheet: {
      width: '500px',
      height: '500px',
      title: [{
        text: '核查单数量趋势',
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
    // 核查单结果分布
    verificationResults: {
      width: '500px',
      height: '500px',
      title: [{
        text: '核查单结果分布',
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
    // 案件类型分布
    caseType: {
      width: '500px',
      height: '500px',
      title: [{
        text: '案件类型分布',
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
    // 录黑数量趋势
    blackListNumber: {
      width: '500px',
      height: '500px',
      title: [{
        text: '录黑数量趋势',
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
    isActiveBtnList: true, // 导出按钮是否可以点击
    isActiveBtnCaseType: true,
    isActiveBtnSheet: true,
    isActiveBtnNumber: true,
    isActiveBtnResults: true
  }),
  computed: {
    ...mapGetters([
      'appId',
      'appName'
    ])
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        this.marqueeList = [];
        Promise.all([
          this.searchData(),
          this.getDataList()
        ]);
      },
      immediate: true
    }
  },
  mounted () {
    this.timer = setInterval(this.showMarquee, 2000);
  },
  beforeDestroy () {
    // 离开此页面时，清除定时器
    clearInterval(this.timer);
  },
  methods: {
    // 今日核查单点击
    todayEventClick (item) {
      let prams = [];
      let url = ''; let name = '';
      if (item.name === '待分配') {
        prams = {
          text: '初审待分配,复审待分配,初审超时，复审超时',
          value: '6,7,12,14'
          // text: '待分配',
          // value: '1'
        };
        url = '/pendingTask';
        name = 'pendingTask';
      } else if (item.name === '待初审') {
        prams = {
          text: '待初审,初审中,驳回待审核',
          value: '2,11,4'
          // text: '待审核',
          // value: '2'
        };
        url = '/pendingTask';
        name = 'pendingTask';
      } else if (item.name === '待复审') {
        prams = {
          text: '待复审,复审中,驳回待复审',
          value: '3,13,5'
          // text: '待复审',
          // value: '3'
        };
        url = '/pendingTask';
        name = 'pendingTask';
      } else if (item.name === '已完结') {
        prams = {
          text: '审核完结',
          value: '8'
        };
        url = '/processedTask';
        name = 'processedTask';
      }
      this.$router.push({
        path: url,
        name: name,
        params: {
          prams: prams
        }
      });
    },
    // 查询列表
    async getDataList () {
      if (this.appId) {
        let params = {
          appId: this.appId,
          startTime: this.dateToString(this.searchForm.dates[0]) + ' 00:00:00',
          endTime: this.dateToString(this.searchForm.dates[1]) + ' 23:59:59'
        };
        const res = await checkTrend.getAppIdData(params);
        if (res.data.code === 200) {
          let caseRiskTypeName = [];
          res.data.data.caseRiskType.forEach((item, index, ary) => {
            caseRiskTypeName.push(item.name);
          });
          res.data.data.verifyList.forEach((item, index, ary) => {
            if (item.src === 0) {
              item.src = '风控服务';
            } else {
              item.src = '事件提报';
            };
          });
          this.marqueeList = res.data.data.verifyList;
          // 选好对应核查单数据与名称
          this.todayEventsData.forEach((item, index, ary) => {
            switch (item.name) {
              case '总核查单':
                item.number = res.data.data.topData.all;
                break;
              case '待分配':
                item.number = res.data.data.topData.dfp;
                break;
              case '待初审':
                item.number = res.data.data.topData.dcs;
                break;
              case '待复审':
                item.number = res.data.data.topData.dfs;
                break;
              case '已完结':
                item.number = res.data.data.topData.fswj;
            }
          });
          res.data.data.checkHit.data.forEach((item, index, ary) => {
            item.name = item.type;
            item.type = 'bar';
          });
          this.$nextTick(() => {
            // 核查单数量趋势
            if (res.data.data.checkHit.isShow) {
              this.verificationSheet = {};
              this.verificationSheet = {
                width: '500px',
                height: '500px',
                color: [
                  '#4F8BE8', // 总数(蓝色)
                  '#EE8F97', // 案件(红色)
                  '#ECCAA1', // 风险事件(土色)
                  '#89D7BD' // 清白件(红色)
                ],
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                title: {
                  text: '核查单数量趋势',
                  subtext: '',
                  left: 'center'
                },
                grid: {
                  left: '8%',
                  right: '8%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: res.data.data.checkHit.dataName,
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
                series: res.data.data.checkHit.data
              };
            } else {
              this.verificationSheet = {
                width: '500px',
                height: '500px',
                title: [{
                  text: '核查单数量趋势',
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
            // 核查单结果分布
            // 取数据，根据有无数据，判断是否展示图表
            if (res.data.data.checkPic.length > 0) {
              let checkPicAry = [];
              let checkPicAryCopy = [];
              for (var k = 0; k < res.data.data.checkPic.length; k++) {
                checkPicAry.push(res.data.data.checkPic[k].value);
              };
              checkPicAryCopy = [...new Set(checkPicAry)];
              if (checkPicAryCopy.length > 1 || (checkPicAryCopy.length === 1 && checkPicAryCopy[0] !== 0)) {
                this.verificationResults = {
                  width: '500px',
                  height: '500px',
                  title: {
                    text: '核查单结果分布',
                    subtext: '',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                  },
                  // legend: {
                  //   show: true,
                  //   orient: 'vertical',
                  //   left: 'left',
                  //   data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                  // },
                  series: [
                    {
                      name: '',
                      type: 'pie',
                      radius: ['50%', '60%'],
                      // avoidLabelOverlap: false,
                      label: {
                        show: true,
                        position: 'left',
                        formatter: '{b}: \n {c} ({d}%)'
                      },
                      emphasis: {
                        label: {
                          show: true,
                          fontSize: '12',
                          fontWeight: 'bold'
                        }
                      },
                      labelLine: {
                        show: true
                      },
                      color: [
                        // '#4F8BE8' // 案件(红色)
                        '#EE8F97', // 案件(红色)
                        '#ECCAA1', // 风险事件(土色)
                        '#89D7BD' // 清白件(红色)
                      ],
                      // data: [
                      //   { value: 335, name: '直接访问' },
                      //   { value: 310, name: '邮件营销' },
                      //   { value: 234, name: '联盟广告' },
                      //   { value: 135, name: '视频广告' },
                      //   { value: 1548, name: '搜索引擎' }
                      // ]
                      data: res.data.data.checkPic
                    }
                  ]
                };
              } else {
                this.verificationResults = {
                  width: '500px',
                  height: '500px',
                  title: [{
                    text: '核查单结果分布',
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
            };
            // 案件类型分布
            // 取数据，根据有无数据，判断是否展示图表
            if (res.data.data.caseRiskType.length > 0) {
              let caseRiskTypeAry = [];
              let caseRiskTypeAryCopy = [];
              for (var i = 0; i < res.data.data.caseRiskType.length; i++) {
                caseRiskTypeAry.push(res.data.data.caseRiskType[i].value);
              }
              caseRiskTypeAryCopy = [...new Set(caseRiskTypeAry)];
              if (caseRiskTypeAryCopy.length > 1 || (caseRiskTypeAryCopy.length === 1 && caseRiskTypeAryCopy[0] !== 0)) {
                this.caseType = {
                  width: '500px',
                  height: '500px',
                  title: {
                    text: '案件类型分布',
                    subtext: '',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                  },
                  legend: {
                    show: false,
                    orient: 'vertical',
                    left: 'left',
                    // data: []
                    // data: ['直接访问', '邮件营销', '联盟广告', '视频广告']
                    data: res.data.data.caseRiskType.caseRiskTypeName
                  },
                  series: [
                    {
                      name: '',
                      type: 'pie',
                      radius: '55%',
                      label: {
                        show: true,
                        formatter: '{b}: \n {c} ({d}%)'
                      },
                      center: ['50%', '60%'],
                      color: [
                        '#89D7BD',
                        '#4F8BE8',
                        '#ECCAA1',
                        '#EE8F97'
                      ],
                      data: res.data.data.caseRiskType
                    }
                  ]
                };
              } else {
                this.caseType = {
                  width: '500px',
                  height: '500px',
                  title: [{
                    text: '案件类型分布',
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
            }
            // 录黑数量趋势
            if (res.data.data.blackList.isShow) {
              this.blackListNumber = {
                width: '500px',
                height: '500px',
                title: {
                  text: '录黑数量趋势',
                  subtext: '',
                  left: 'center'
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  bottom: 0,
                  align: 'left',
                  data: res.data.data.blackList.bottomTitle
                },
                grid: {
                  top: '15%',
                  left: '3%',
                  right: '6%',
                  bottom: '10%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  boundaryGap: false,
                  data: res.data.data.blackList.dataName
                },
                yAxis: {
                  type: 'value'
                },
                series: res.data.data.blackList.data
              };
            } else {
              this.blackListNumber = {
                width: '500px',
                height: '500px',
                title: [{
                  text: '录黑数量趋势',
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
          });
        };
      }
    },
    // 导出
    exportData (fileName, type, name) {
      let params = {
        appId: this.appId,
        startTime: this.dateToString(this.searchForm.dates[0]) + ' 00:00:00',
        endTime: this.dateToString(this.searchForm.dates[1]) + ' 23:59:59',
        exportType: type
      };
      if (name === 'verificationSheet') {
        this.isActiveBtnSheet = false;
        checkTrend.exportHCDSLQS(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnSheet = true;
        }).catch(() => {
          this.isActiveBtnSheet = true;
        });
      } else if (name === 'verificationResults') {
        this.isActiveBtnResults = false;
        checkTrend.exportHCDJGFB(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnResults = true;
        }).catch(() => {
          this.isActiveBtnResults = true;
        });
      } else if (name === 'caseType') {
        this.isActiveBtnCaseType = false;
        checkTrend.exportAJLXFB(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnCaseType = true;
        }).catch(() => {
          this.isActiveBtnCaseType = true;
        });
      } else if (name === 'blackListNumber') {
        this.isActiveBtnNumber = false;
        checkTrend.exportLHSLQS(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnNumber = true;
        }).catch(() => {
          this.isActiveBtnNumber = true;
        });
      } else if (name === 'list') {
        this.isActiveBtnList = false;
        checkTrend.exportDBSX(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnList = true;
        }).catch(() => {
          this.isActiveBtnList = true;
        });
      }
    },
    showMarquee () {
      this.animate = true;
      setTimeout(() => {
        this.marqueeList.push(this.marqueeList[0]);
        this.marqueeList.shift();
        this.animate = false;
      }, 500)
      ;
    },
    mouseEnter () {
      // 鼠标悬停时停止滚动
      clearInterval(this.timer);
    },
    mouseLeave () {
      // 鼠标移开时继续滚动
      this.timer = setInterval(this.showMarquee, 2000);
    },
    reconnect () {
      const that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(() => {
        // this.initWebSocket();
        that.lockReconnect = false;
      }, 60 * 1000);
    },
    searchData () {
      var today = new Date();
      today.setTime(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.dateStart = today;
      this.dateEnd = new Date();
      this.searchForm.dates = [this.dateEnd, this.dateEnd];
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
        // to do search
      }
    },
    // 选择时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
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
    reset () {
      this.searchData();
      this.searchForm.dateTime = this.dateTimeItems[0].value;
      this.searchBtn();
    },
    searchBtn () {
      this.getDataList();
    },
    // 四个图表
    // 核查单数量趋势
    verificationSheetClick () {},
    // 核查单结果分布
    verificationResultsClick () {},
    // 案件类型分布
    caseTypeClick () {},
    // 录黑数量趋势
    blackListNumberClick () {}
  }
};
</script>
<style lang="stylus" scoped>
.todayTitle {
  position: relative;
  top: -14px;
  left: 9px;
}
//浮动，清除浮动
.fl {
  // display: flex;
  float: left;
}
.pLeft {
  padding-left: 5px;
  cursor: pointer;
}
.clearfix:after {
  content: ' ';
  display: block;
  clear: both;
  height: 0;
  visibility: hidden;
}
// 添加顶部背景图片
.top-bg {
  width: 100%;
  background-color: #fff;
}
.top-bg1111 {
  margin-top: -12px;
  background-image: url("../../../static/img/risk_market_top_bg.jpg");
  background-repeat: no-repeat;
  background-position: right center;
  background-size: auto 168%;
}
.v-card--material__heading {
  position: relative;
  top: -40px;
  -webkit-transition: .3s ease;
  transition: .3s ease;
  z-index: 1;
}
.today-event-width {
  width: 16%;
  margin-right: 1%;
}
.today-event-width:last-child {
  margin-right: 0;
}
.textEllipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.today-event-box {
  text-align: center;
  margin-left: 8px;
  cursor: pointer;
}
.marquee_box {
  display: block;
  position: relative;
  width: 100%;
  height: 155px;
  overflow: hidden;
}
.marquee_list {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.marquee_top {
  transition: all 0.5s;
  margin-top: -30px
}
.marquee_top {
  transition: all 0.5s;
  margin-top: -30px
}
.marquee_list li {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding-left: 10px;
}
.today-event-number {
  display: inline-block;
  font-size: 26px;
  color: #2d2d2d;
  line-height: 35px;
}
.today-event-name {
  font-size: 12px;
  color: #666;
}
.today-event-icon-outcircle {
  width: 53px;
  height: 53px;
  border: 2px solid rgba(220,220,220,1);
  border-radius: 50%;
  flex-grow: 1;
}
.cardPng {
  width: 20px;
  height: 20px;
  position: relative;
  top: 15px;
  left: 15px;
}
.cardOne {
  background-image: url("../../../static/img/card_one.png");
  background-repeat: no-repeat center center;
  background-size: 100%, 100%;
}
.cardTwo {
  background-image: url("../../../static/img/card_two.png");
  background-repeat: no-repeat center center;
  background-size: 100%, 100%;
}
.cardThree {
  background-image: url("../../../static/img/card_three.png");
  background-repeat: no-repeat center center;
  background-size: 100%, 100%;
}
.cardFour {
  background-image: url("../../../static/img/card_four.png");
  background-repeat: no-repeat center center;
  background-size: 100%, 100%;
}
.cardFive {
  background-image: url("../../../static/img/card_five.png");
  background-repeat: no-repeat center center;
  background-size: 100%, 100%;
}
// 滚动列表样式
div, ul, li, span, img {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.marquee {
  width: 100%;
  height: 155px;
  color: #3A3A3A;
  box-sizing: border-box;
}
.echartsP {
  color: #000;
  font-size: 16px;
  font-weight: bold;
  padding: 15px 20px 10px;
  margin-bottom: 5px;
  border-bottom: 1px solid #ccc;
}
.textEllipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.active {
  background-color: red;
}
.searchTempStyle {
  margin: 0;
  background-color: #fff;
}
.echartsStyle {
  padding: 12px;
}
.echartsPaddingRightStyle {
  padding-right: 0;
}
.echartsPaddingLeftStyle {
  padding-left: 0;
}
#data-picker /deep/ .ivu-input{
    height:40px
}
</style>
