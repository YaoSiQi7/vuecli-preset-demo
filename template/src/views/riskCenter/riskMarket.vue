<!-- author: 古雪瑞-->
<!-- updateTime: 2020-04-07-->
<template>
  <div>
    <div class="top-bg pt-7 pb-4">
      <!-- 今日事件部分 -->
      <v-row class="pb-3">
        <div style="color: #2d2d2d; font-weight: bold; font-size: 40px">
          今日
        </div>
        <v-spacer></v-spacer>
        <div
          v-for="(item, n) in todayEventsData"
          :key="n"
          class="today-event-width clearfix"
        >
          <div class="fl">
            <div
              class="today-event-icon-outcircle"
              v-if="item.name === '自动阻断'"
            >
              <div class="cardPng cardOne" />
            </div>
            <div
              class="today-event-icon-outcircle"
              v-if="item.name === '人工审核'"
            >
              <div class="cardPng cardTwo" />
            </div>
            <div
              class="today-event-icon-outcircle"
              v-if="item.name === '加强认证'"
            >
              <div class="cardPng cardThree" />
            </div>
            <div
              class="today-event-icon-outcircle"
              v-if="item.name === '自动放行'"
            >
              <div class="cardPng cardFour" />
            </div>
            <div
              class="today-event-icon-outcircle"
              v-if="item.name === '总数量'"
            >
              <div class="cardPng cardFive" />
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
      </v-row>
      <!-- 查询条件 -->
      <v-row class="pt-3">
        <v-col cols="10">
          <v-form ref="searchForm" v-model="searchValid" lazy-validation>
            <v-row>
              <v-col cols="3" class="mr-4">
                <DatePicker
                  type="daterange"
                  v-model="searchForm.dates"
                  :options="options"
                  placement="top-start"
                  placeholder="选择日期"
                  style="width: 100%"
                  id="data-picker"
                ></DatePicker>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="searchForm.transactionType"
                  :items="tradeTypeItems"
                  item-text="selectText"
                  item-value="selectField"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  class="pt-0 pb-0"
                  background-color="white"
                ></v-select>
              </v-col>
              <v-col
                cols="4"
                style="text-align: left; position: relative"
                class="pt-1"
              >
                <div class="dateBtnBox">
                  <v-btn color="primary" class="ml-4" @click="reset" small
                    >重置条件</v-btn
                  >
                  <!-- <v-btn
                    color="primary"
                    class="ml-4"
                    small
                    v-if="hasPermission(exportBtn)"
                    @click="snackbar = true"
                    >导出</v-btn
                  > -->
                  <v-btn color="primary" class="ml-4" small @click="search"
                    >查询</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </div>
    <v-row>
      <!-- 中国地图 -->
      <v-col cols="8" class="pr-3">
        <div>
          <v-hover v-slot="{ hover }">
            <v-card class="elevation-3">
              <v-card-text>
                <div style="position: relative">
                  <span class="map-title" v-show="provinceVal"
                    >{{ provinceVal }}分布</span
                  >
                  <echart-export-file
                    :chartId="'mapchart'"
                    :hover="hover"
                    :fileName="appName + '-' + provinceVal + '-' + mapTypeValue"
                    :isActive="isActiveBtnMap"
                    style="position: absolute; right: 185px; z-index: 4"
                    @exportExcel="
                      exportData(
                        arguments,
                        'excel',
                        'exportMap',
                        'isActiveBtnMap'
                      )
                    "
                    @exportCSV="
                      exportData(
                        arguments,
                        'csv',
                        'exportMap',
                        'isActiveBtnMap'
                      )
                    "
                    v-if="hasPermission(exportRiskMapBtn)"
                  ></echart-export-file>
                  <v-select
                    v-model="mapTypeValue"
                    style="
                      position: absolute;
                      right: 0;
                      width: 177px !important;
                      z-index: 4;
                    "
                    :items="typeItem"
                    required
                    no-data-text="没有数据"
                    outlined
                    dense
                    @change="mapTypeValueChange($event)"
                  />
                  <!-- <v-select
                  v-model="provinceVal"
                  style="
                    position: absolute;
                    right: 0;
                    width: 177px !important;
                    z-index: 4;
                  "
                  :items="cityData"
                  required
                  item-text="label"
                  item-value="name"
                  no-data-text="没有数据"
                  outlined
                  dense
                  @change="provinceValChange($event)"
                /> -->
                  <div class="mapitem">
                    <div
                      id="mapchart"
                      ref="mapchart"
                      style="width: 95%; height: 466px"
                    />
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </div>
      </v-col>
      <v-col cols="4">
        <!-- 等级占比 -->
        <div>
          <v-hover v-slot="{ hover }">
            <v-card class="elevation-3">
              <v-card-text style="position: relative">
                <echart-export-file
                  :chartId="'riskEventLevelPercent'"
                  :hover="hover"
                  :fileName="appName + '-等级占比'"
                  :isActive="isActiveBtnLevel"
                  @exportExcel="
                    exportData(
                      arguments,
                      'excel',
                      'exportLevel',
                      'isActiveBtnLevel'
                    )
                  "
                  @exportCSV="
                    exportData(
                      arguments,
                      'csv',
                      'exportLevel',
                      'isActiveBtnLevel'
                    )
                  "
                  style="position: absolute; top: 8px; right: 40px; z-index: 4"
                  v-if="hasPermission(exportLevelBtn)"
                ></echart-export-file>
                <v-img
                  src="../../../static/img/arrow_right.png"
                  class="arrow-right hand-signals"
                  @click="toLevelPercent('等级占比')"
                ></v-img>
                <p class="echartsP">等级占比</p>
                <div
                  id="riskEventLevelPercent"
                  ref="riskEventLevelPercent"
                  style="width: 100%; height: 424px"
                />
              </v-card-text>
            </v-card>
          </v-hover>
        </div>
      </v-col>
    </v-row>
    <!-- 地区排名、场景分布、趋势 -->
    <v-row class="mt-3">
      <v-col cols="4" class="pr-3">
        <v-hover v-slot="{ hover }">
          <div style="position: relative">
            <echart-export-file
              :hover="hover"
              :isEchart="false"
              :fileName="appName + '-城市排名'"
              :isActive="isActiveBtnCity"
              :isHoverShow="true"
              @exportExcel="
                exportData(
                  arguments,
                  'excel',
                  'exportCityRanking',
                  'isActiveBtnCity'
                )
              "
              @exportCSV="
                exportData(
                  arguments,
                  'csv',
                  'exportCityRanking',
                  'isActiveBtnCity'
                )
              "
              style="position: absolute; top: 8px; right: 44px; z-index: 4"
              v-if="hasPermission(exportCityRankBtn)"
            ></echart-export-file>
            <base-charts
              :chartTitle="locationTitle"
              :chartsParam="locationParam"
              @eventClick="locationClick"
              @toDetailPage="toLevelPercent($event)"
            ></base-charts>
          </div>
        </v-hover>
      </v-col>
      <v-col cols="4" class="pr-3">
        <v-hover v-slot="{ hover }">
          <div style="position: relative">
            <echart-export-file
              :hover="hover"
              :isEchart="false"
              :fileName="appName + '-场景分布'"
              :isActive="isActiveBtnScene"
              :isHoverShow="true"
              @exportExcel="
                exportData(
                  arguments,
                  'excel',
                  'exportSceneDistribution',
                  'isActiveBtnScene'
                )
              "
              @exportCSV="
                exportData(
                  arguments,
                  'csv',
                  'exportSceneDistribution',
                  'isActiveBtnScene'
                )
              "
              style="position: absolute; top: 8px; right: 44px; z-index: 4"
              v-if="hasPermission(exportSceneDistributionBtn)"
            ></echart-export-file>
            <base-charts
              :chartTitle="scenesTitle"
              :chartsParam="scenesParam"
              @eventClick="scenesClick"
              @toDetailPage="toLevelPercent($event)"
            ></base-charts>
          </div>
        </v-hover>
      </v-col>
      <v-col cols="4">
        <v-hover v-slot="{ hover }">
          <div style="position: relative">
            <echart-export-file
              :hover="hover"
              :isEchart="false"
              :fileName="appName + '-趋势'"
              :isActive="isActiveBtnTrend"
              :isHoverShow="true"
              @exportExcel="
                exportData(
                  arguments,
                  'excel',
                  'exportTrend',
                  'isActiveBtnTrend'
                )
              "
              @exportCSV="
                exportData(arguments, 'csv', 'exportTrend', 'isActiveBtnTrend')
              "
              style="position: absolute; top: 8px; right: 44px; z-index: 4"
              v-if="hasPermission(exportTrendBtn)"
            ></echart-export-file>
            <base-charts
              :chartTitle="riskTrendTitle"
              :chartsParam="riskTrendParam"
              @eventClick="riskTrendClick"
              @toDetailPage="toLevelPercent($event)"
            ></base-charts>
          </div>
        </v-hover>
      </v-col>
    </v-row>
    <!-- 风险实时数据 -->
    <v-row class="mt-3">
      <v-col cols="12">
        <v-hover v-slot="{ hover }">
          <v-card class="elevation-3">
            <v-card-text>
              <p class="echartsP">风险实时数据</p>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="appName + '-风险实时数据'"
                :isActive="isActiveBtnRiskData"
                :isHoverShow="true"
                style="position: absolute; top: 8px; right: 20px; z-index: 4"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'exportRiskRealTimeData',
                    'isActiveBtnRiskData'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'exportRiskRealTimeData',
                    'isActiveBtnRiskData'
                  )
                "
                v-if="hasPermission(exportRiskDataBtn)"
              ></echart-export-file>
              <div class="tabelHeader">
                <span
                  class="textEllipsis table_header"
                  title="出账人姓名"
                  style="width: 10%"
                  >出账人姓名</span
                >
                <span
                  class="textEllipsis table_header"
                  title="手机号"
                  style="width: 15%"
                  >手机号</span
                >
                <span
                  class="textEllipsis table_header"
                  title="所属应用"
                  style="width: 10%"
                  >所属应用</span
                >
                <span
                  class="textEllipsis table_header"
                  title="交易类型"
                  style="width: 10%"
                  >交易类型</span
                >
                <span
                  class="textEllipsis table_header"
                  title="登录账号"
                  style="width: 20%"
                  >登录账号</span
                >
                <span
                  class="textEllipsis table_header"
                  title="操作状态"
                  style="width: 7%"
                  >操作状态</span
                >
                <span
                  class="textEllipsis table_header"
                  title="处置策略"
                  style="width: 10%"
                  >处置策略</span
                >
                <span
                  class="textEllipsis table_header"
                  title="城市"
                  style="width: 7%"
                  >城市</span
                >
                <span
                  class="textEllipsis table_header"
                  title="风控时间"
                  style="width: 11%"
                  >风控时间</span
                >
              </div>
              <div
                class="marquee"
                @mouseenter="mouseEnter"
                @mouseleave="mouseLeave"
              >
                <div class="marquee_box" v-if="marqueeList.length > 0">
                  <ul class="marquee_list" :class="{ marquee_top: animate }">
                    <li v-for="(item, index) in marqueeList" :key="index">
                      <div style="font-size: 12px">
                        <span
                          class="textEllipsis table_td"
                          :title="item.name"
                          style="width: 10%"
                        >
                          {{ item.name | ellipsis() }}
                        </span>
                        <span
                          class="textEllipsis table_td"
                          :title="item.phone"
                          style="width: 15%"
                        >
                          {{ item.phone }}
                        </span>
                        <span
                          class="textEllipsis table_td"
                          :title="item.channel"
                          style="width: 10%"
                        >
                          {{ item.channel }}
                        </span>
                        <span
                          class="textEllipsis table_td"
                          :title="item.transType"
                          style="width: 10%"
                        >
                          {{ item.transType }}
                        </span>
                        <span
                          class="textEllipsis table_td"
                          :title="item.accountNum"
                          style="width: 20%"
                        >
                          {{ item.accountNum }}
                        </span>
                        <span
                          class="textEllipsis table_td"
                          :title="item.opStatus"
                          style="width: 7%"
                        >
                          {{ item.opStatus }}
                        </span>
                        <span
                          class="textEllipsis table_td"
                          :title="item.evenType"
                          style="width: 10%"
                        >
                          {{ item.evenType }}</span
                        >
                        <span
                          class="textEllipsis table_td"
                          :title="item.location"
                          style="width: 7%"
                        >
                          {{ item.location }}</span
                        >
                        <span
                          class="textEllipsis table_td"
                          :title="item.time"
                          style="width: 11%"
                          >{{ item.time }}</span
                        >
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  class="text-center pt-12 pl-5"
                  style="color: rgba(0, 0, 0, 0.6)"
                  v-else
                >
                  暂无数据
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
    <!-- 敬请期待的提示框 -->
    <v-snackbar v-model="snackbar" :timeout="timeout" :top="isSnackbarTop">
      敬请期待
    </v-snackbar>
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
import $ from 'jquery';
import BaseCharts from '@c/BaseCharts';
import * as dataService from 'api/riskMarket.js';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
// import cityData from '@/utils/countryLevelData';
import { DatePicker } from 'view-design';
import EchartExportFile from '@c/EchartExportFile';
import { downloadFile } from '@/utils/downloadFile';

const heartCheck = {
  wstimeout: 60 * 1000,
  wstimer: null,
  serverTimer: null,
  wsreset () {
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
  }
};
export default {
  name: 'riskMarket',
  components: {
    BaseCharts,
    DatePicker,
    EchartExportFile
  },
  data: () => ({
    provinceVal: '',
    provinceArr: [], // 省份数据
    defaultTodayEventData: [
      { name: '自动阻断', number: 0 },
      { name: '人工审核', number: 0 },
      { name: '加强认证', number: 0 },
      { name: '自动放行', number: 0 },
      { name: '总数量', number: 0 }
    ],
    tradeTypeItems: [],
    selectDate: '',
    initTodayEvantsData: {
      eBlock: 0,
      eManualAudit: 0,
      eEnhancedCertification: 0,
      eRelease: 0,
      eAll: 0
    },
    eventdata: null,
    todayEventsData: [],
    // 滚动列表数据
    animate: false,
    marqueeList: [],
    // 定义定时器
    timer: null,
    mapTypeValue: '',
    typeItem: [
      '总数量',
      '自动放行',
      '加强认证',
      '人工审核',
      '自动阻断'
    ],
    // 指标策略
    typeItemList: [{
      'text': '总数量',
      'value': -1
    }, {
      'text': '自动放行',
      'value': 0
    }, {
      'text': '加强认证',
      'value': 800
    }, {
      'text': '人工审核',
      'value': 80
    }, {
      'text': '自动阻断',
      'value': 100
    }],
    initMapList: [],
    mapList: [],
    websocket: null,
    lockReconnect: false, // 连接失败不进行重连
    timeoutnum: null,
    // 查询条件相关
    dateStart: null,
    dateEnd: null,
    isdateShow: false,
    searchValid: true,
    searchForm: {
      dates: [],
      transactionType: ''
    },
    // 敬请期待提示框
    snackbar: false,
    timeout: 2000,
    isSnackbarTop: true,
    yAxisdata: [],
    seriesdata: [],
    locationTitle: '',
    locationParam: [],
    scenesTitle: '',
    scenesParam: [],
    riskTrendTitle: '',
    riskTrendParam: [],
    // 提示弹框参数
    // timeout: 2000,
    // isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    // 按钮权限
    exportBtn: '/exportRiskMarketButton', // 导出权限
    exportRiskMapBtn: '/exportRiskMapButton', // 导出风险地图
    exportLevelBtn: '/exportLevelButton', // 导出等级占比
    exportCityRankBtn: '/exportCityRankButton', // 导出城市排名
    exportSceneDistributionBtn: '/exportSceneDistributionButton', // 导出场景分布
    exportTrendBtn: '/exportTrendButton', // 导出趋势
    exportRiskDataBtn: '/exportRiskDataButton', // 导出风险实时数据
    isActiveBtnMap: true, // 导出按钮是否可以点击
    isActiveBtnLevel: true,
    isActiveBtnCity: true,
    isActiveBtnScene: true,
    isActiveBtnTrend: true,
    isActiveBtnRiskData: true,
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
    }
  }),
  computed: {
    ...mapGetters([
      'appId',
      'appName',
      'cityData'
    ])
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        this.websock.close();
        this.eventdata = null;
        this.todayEventsData = this.defaultTodayEventData;
        this.initMapList = [];
        this.mapList = [];
        this.mapTypeValue = this.typeItem[0]; // 地图选择条件赋默认值
        this.marqueeList = [];
        this.reset();
        this.provinceVal && this.getMapDatas(this.dateToString(this.dateEnd), this.dateToString(this.dateEnd), this.searchForm.transactionType); // 获取地图数据
        this.initWebSocket();
        Promise.all([
          this.getTradeTypeList(),
          this.initGetData(),
          this.queryTodayEventData(),
          this.mapTypeValueChange()
        ]);
      }
    }
  },
  created () {
    // 如果是单点登录 直接进到这个页面 后台在session里边存了信息 获取
    if (window.g.isSSO) {
      this.getUserInfo();
    }
    this.mapTypeValue = this.typeItem[0]; // 地图选择条件赋默认值
    this.getDefaultDate();
    this.initWebSocket();
  },
  mounted () {
    // this.provinceArr = [...cityData];
    // this.getCityData(); // 获取全国城市
    this.getProvinceMap(); // 获取地图配置省份
    this.timer = setInterval(this.showMarquee, 2000);
    if (this.appId) {
      Promise.all([
        this.getTradeTypeList(),
        this.initGetData(),
        this.queryTodayEventData()
        // this.mapTypeValueChange()
      ]);
    };
  },
  beforeDestroy () {
    // 离开此页面时，清除定时器
    clearInterval(this.timer);
    this.websock.close(); // 关闭websocket连接
  },
  methods: {
    // 导出Excel与csv
    exportData (arg, fileType, api, isActiveBtn) {
      let fileName = arg[0];
      let params = {
        startTime: this.dateToString(this.searchForm.dates[0]),
        endTime: this.dateToString(this.searchForm.dates[1]),
        appId: this.appId,
        opType: (this.searchForm.transactionType === undefined || this.searchForm.transactionType.selectText === '全部交易类型') ? '' : this.searchForm.transactionType
      };
      if (api === 'exportLevel' || api === 'exportTrend' || api === 'exportMap' || api === 'exportRiskRealTimeData') { // 等级占比、趋势、风险地图、风险实时数据
        params.fileType = fileType;
      } else if (api === 'exportCityRanking' || api === 'exportSceneDistribution') { // 城市排名、场景分布
        params.exportType = fileType;
      }
      if (api === 'exportMap') {
        params.province = this.provinceVal === '全国' ? '' : this.provinceVal;
        params.indicator = this.mapTypeValue;
      }
      if (api === 'exportRiskRealTimeData') {
        params = {
          fileType: fileType,
          appId: this.appId
        };
      }
      this[isActiveBtn] = !this[isActiveBtn];
      dataService[api](params).then(res => {
        let blob = new Blob([res.data]);
        downloadFile(blob, fileName);
        this[isActiveBtn] = !this[isActiveBtn];
      }).catch(() => {
        this[isActiveBtn] = !this[isActiveBtn];
      });
    },
    setBtnDisabled (key) {
      switch (key) {
        case 'exportMap':
          this.isActiveBtnMap = !this.isActiveBtnMap;
          break;
        case 'exportLevel':
          this.isActiveBtnLevel = !this.isActiveBtnLevel;
          break;
        case 'exportCityRanking':
          this.isActiveBtnCity = !this.isActiveBtnCity;
          break;
        case 'exportSceneDistribution':
          this.isActiveBtnScene = !this.isActiveBtnScene;
          break;
        case 'exportTrend':
          this.isActiveBtnTrend = !this.isActiveBtnTrend;
          break;
        case 'exportRiskRealTimeData':
          this.isActiveBtnRiskData = !this.isActiveBtnRiskData;
          break;
        default:
          break;
      }
    },
    provinceValChange (e) {
      console.log(e);
      let val = e === '全国' ? 'china' : e;
      this.renderMap(val);
    },
    getDefaultDate () {
      var today = new Date();
      today.setTime(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.dateStart = new Date(today);
      this.dateEnd = new Date();
      this.searchForm.dates = [this.dateEnd, this.dateEnd];
    },
    initGetData () {
      this.getDefaultDate();
      this.getData(this.dateToString(this.dateEnd), this.dateToString(this.dateEnd)); // 默认查今天的数据
    },
    async getTradeTypeList () {
      this.tradeTypeItems = [];
      let param = {
        jsonIds: JSON.stringify([this.appId])
      };
      const response = await dataService.queryTradeType(param);
      if (response.data.code === 200) {
        let resTradeTypeItems = response.data.data;
        resTradeTypeItems.forEach((item, index, ary) => {
          this.tradeTypeItems.push({
            selectText: item.tradeName,
            selectField: item.id,
            isAmount: item.isAmount
          });
        });
        this.tradeTypeItems.unshift({ selectText: '全部交易类型', selectField: '' });
        this.searchForm.transactionType = this.tradeTypeItems[0];
      }
    },
    // change时间
    changeDay (daysOfNumber) {
      // 生成开始时间和结束时间
      let today = new Date();
      today.setTime(today.getTime() + daysOfNumber * 24 * 60 * 60 * 1000);
      let startDay = this.dateToString(today);
      let endDay = this.dateToString(new Date()).substr(0, 10);
      this.searchForm.dates = [startDay, endDay];
      this.dateStart = startDay;
      this.dateEnd = endDay;
    },
    // 点击重置条件
    reset () {
      this.searchForm.dates = [this.dateEnd, this.dateEnd];
      this.searchForm.transactionType = this.tradeTypeItems[0];
    },
    // 点击查询
    search () {
      this.getData(this.dateToString(this.searchForm.dates[0]), this.dateToString(this.searchForm.dates[1]));
      this.initMapList = [];
      this.mapList = [];
      // 获取地图数据
      this.getMapDatas(this.dateToString(this.searchForm.dates[0]), this.dateToString(this.searchForm.dates[1]), this.searchForm.transactionType);
    },
    // 获取四个非实时图表数据
    async getData (startDay, endDay) {
      // const that = this;
      let optype;
      if (this.searchForm.transactionType === undefined || this.searchForm.transactionType.selectText === '全部交易类型') {
        optype = '';
      } else {
        optype = this.searchForm.transactionType;
      }

      let queryParams = {
        startTime: startDay,
        endTime: endDay,
        opType: optype,
        appid: this.appId
      };
      this.renderLocationBarChart(queryParams);
      this.renderEventSceneChart(queryParams);
      this.renderPieChart(queryParams);
      this.renderRiskEventTrend(queryParams);
    },
    // 获取地图数据
    async getMapDatas (startDay, endDay, transactionType) {
      let optype;
      if (transactionType === undefined || transactionType.selectText === '全部交易类型') {
        optype = '';
      } else {
        optype = transactionType;
      }
      let params = {
        appId: this.appId,
        opType: optype,
        startTime: startDay,
        endTime: endDay,
        province: this.provinceVal === '全国' ? '' : this.provinceVal
      };
      let res = await dataService.reportMap(params);
      if (res.data.code === 200) {
        this.initMapList = res.data.data;
        this.mapTypeValueChange();
      }
    },
    // 图表的鼠标悬浮事件
    eventMouseEnter (param) {
      this.eventParam = param;
    },
    async renderLocationBarChart (queryParams) { // 生成地区排名图
      try {
        const res = await dataService.queryLocation(queryParams);
        if (res.data.code === 200) {
          let locationData = {
            city: res.data.data.city,
            seriesData: res.data.data.seriesData
          };
          this.locationTitle = '城市排名';
          this.locationParam = [];
          if (locationData.city.length > 0) {
            for (let i = 0; i < locationData.city.length; i++) {
              this.locationParam.push(
                {
                  name: locationData.city[i].name,
                  allEventNum: locationData.city[i].num,
                  eRelease: locationData.seriesData[0].data[i],
                  certification: locationData.seriesData[1].data[i],
                  review: locationData.seriesData[2].data[i],
                  block: locationData.seriesData[3].data[i]
                }
              );
            }
          }
        }
      } catch (err) { }
    },
    async renderEventSceneChart (queryParams) { // 生成事件场景分布图
      try {
        const res = await dataService.queryOptype(queryParams);
        if (res.data.code === 200) {
          let scenesData = {
            scene: res.data.data.scene,
            seriesData: res.data.data.seriesData
          };
          this.scenesTitle = '场景分布';
          this.scenesParam = [];
          if (scenesData.scene.length > 0) {
            for (let i = 0; i < scenesData.scene.length; i++) {
              this.scenesParam.push(
                {
                  name: scenesData.scene[i].name,
                  allEventNum: scenesData.scene[i].num,
                  eRelease: scenesData.seriesData[0].data[i],
                  certification: scenesData.seriesData[1].data[i],
                  review: scenesData.seriesData[2].data[i],
                  block: scenesData.seriesData[3].data[i]
                }
              );
            }
          }
        }
      } catch (err) { }
    },
    async renderPieChart (queryParams) { // 生成等级占比图表
      try {
        const res = await dataService.queryLevel(queryParams);
        if (res.data.code === 200) {
          let pieChartData = {
            sum: res.data.data.sum,
            data: res.data.data.data
          };
          if (res.data.data.sum === undefined) {
            pieChartData.sum = 0;
            pieChartData.data = [];
          }
          const riskEventPieEchart = this.$echarts.init(this.$refs.riskEventLevelPercent);
          const pieOption = this.createPieData(
            pieChartData,
            '风险事件'
          );
          riskEventPieEchart.clear();
          riskEventPieEchart.setOption(pieOption);
          $(window).resize(function () {
            riskEventPieEchart.resize();
          });
          this.mapOrPie(riskEventPieEchart, 'pieChart');
        }
      } catch (err) { }
    },
    // 生成饼图
    createPieData (pieChartData) {
      let color = [
        '#89D7BD',
        '#4F8BE8',
        '#ECCAA1',
        '#EE8F97'
      ];
      const option = {
        title: {
          text: pieChartData.sum,
          subtext: '交易(笔)',
          textStyle: {
            fontSize: 40,
            color: '#fcbc57',
            fontWeight: 'bold'
          },
          subtextStyle: {
            fontSize: 18,
            color: '#666',
            fontWeight: 400
          },
          textAlign: 'center',
          x: '49.5%',
          y: '40%'
        },
        color: [
          '#89D7BD',
          '#4F8BE8',
          '#ECCAA1',
          '#EE8F97'
        ],
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return (
              params.name +
              '：' +
              params.value + ' (' + ((params.value / pieChartData.sum) * 100).toFixed(2) + '%)'
            );
          },
          textStyle: {
            color: '#FFFFFF',
            fontSize: 12
          }
        },
        grid: { // 调整表格位置
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        legend: {
          data: [],
          top: 'bottom',
          itemWidth: 9,
          itemHeight: 9
        },
        series: [
          {
            name: '标题',
            type: 'pie',
            center: ['50%', '50%'],
            // radius: ['47%', '60%'],
            radius: [80, 85],
            hoverAnimation: true,
            hoverOffset: 5,
            startAngle: 270,
            label: {
              normal: {
                show: true,
                formatter: '{b}: \n {c} ({d}%)'
              }
            },
            avoidLabelOverlap: true, // 防止标签重叠
            data: []
          }
        ]
      };
      pieChartData.data.forEach(element => {
        option.legend.data.push({
          name: element.name,
          icon: 'rect'
        });
      });
      for (var i = 0; i < pieChartData.data.length; i++) {
        option.series[0].data.push({
          value: pieChartData.data[i].value,
          name: pieChartData.data[i].name,
          itemStyle: {
            normal: {
              borderWidth: 1,
              shadowBlur: 0,
              borderColor: color[i],
              shadowColor: color[i]
            }
          }
        });
      }
      return option;
    },
    async renderRiskEventTrend (queryParams) { // 生成风险趋势折线面积图
      try {
        const res = await dataService.querydate(queryParams);
        if (res.data.code === 200) {
          let riskEventTrendData = {
            seriesData: res.data.data.seriesData,
            xAxisDate: res.data.data.xAxisDate
          };
          this.riskTrendTitle = '趋势';
          this.riskTrendParam = [];
          if (riskEventTrendData.xAxisDate.length > 0) {
            for (let i = 0; i < riskEventTrendData.xAxisDate.length; i++) {
              this.riskTrendParam.push(
                {
                  name: riskEventTrendData.xAxisDate[i],
                  eRelease: riskEventTrendData.seriesData[0].data[i],
                  certification: riskEventTrendData.seriesData[1].data[i],
                  review: riskEventTrendData.seriesData[2].data[i],
                  block: riskEventTrendData.seriesData[3].data[i]
                }
              );
            }
            for (let item of this.riskTrendParam) {
              // 经产品确定，allEventNum不包含“自动放行”
              item.allEventNum = item.certification + item.review + item.block;
            }
          }
        }
      } catch (err) { }
    },
    queryTodayEventData () { // 获取今日事件数据
      this.todayEventsData = [];

      if (this.eventdata !== null && this.eventdata.eAll !== 0) {
        for (let key in this.eventdata) {
          switch (key) {
            case 'eBlock':
              this.initTodayEvantsData.eBlock = this.eventdata['eBlock'];
              break;
            case 'eManualAudit':
              this.initTodayEvantsData.eManualAudit = this.eventdata['eManualAudit'];
              break;
            case 'eEnhancedCertification':
              this.initTodayEvantsData.eEnhancedCertification = this.eventdata['eEnhancedCertification'];
              break;
            case 'eRelease':
              this.initTodayEvantsData.eRelease = this.eventdata['eRelease'];
              break;
            case 'eAll':
              this.initTodayEvantsData.eAll = this.eventdata['eAll'];
              break;
            default:
              break;
          }
        }
        for (let k in this.initTodayEvantsData) {
          switch (k) {
            case 'eBlock':
              this.todayEventsData.push({ name: '自动阻断', number: this.initTodayEvantsData[k] });
              break;
            case 'eManualAudit':
              this.todayEventsData.push({ name: '人工审核', number: this.initTodayEvantsData[k] });
              break;
            case 'eEnhancedCertification':
              this.todayEventsData.push({ name: '加强认证', number: this.initTodayEvantsData[k] });
              break;
            case 'eRelease':
              this.todayEventsData.push({ name: '自动放行', number: this.initTodayEvantsData[k] });
              break;
            case 'eAll':
              this.todayEventsData.push({ name: '总数量', number: this.initTodayEvantsData[k] });
              break;
            default:
              break;
          }
        }
      } else {
        this.todayEventsData = this.defaultTodayEventData;
      }
    },
    showMarquee () {
      this.animate = true;
      setTimeout(() => {
        this.marqueeList.push(this.marqueeList[0]);
        this.marqueeList.shift();
        this.animate = false;
      }, 500);
    },
    mouseEnter () {
      // 鼠标悬停时停止滚动
      clearInterval(this.timer);
    },
    mouseLeave () {
      // 鼠标移开时继续滚动
      this.timer = setInterval(this.showMarquee, 2000);
    },
    // echarts图标跳转风控日志的公共方法
    mapOrPie (id, chartName) {
      id.on('click', (params) => {
        this.baseParams(params, chartName);
      });
    },
    // 跳转页面公共参数
    baseParams (val, chartName) {
      let routerPath = '';
      let province = '';
      let city = '';
      switch (chartName) {
        case 'mapChart':
          routerPath = 'riskAreas';
          province = val.name;
          break;
        case 'pieChart':
          routerPath = 'riskAreasDetail';
          break;
        case 'location':
          routerPath = 'riskAreasDetail';
          let cityName = '';
          for (let item of this.provinceArr) {
            if (item.children && item.children.length) {
              for (let k of item.children) {
                if (val.name && val.name.includes(k.value)) {
                  cityName = k.value;
                  province = item.value;
                  break;
                }
              }
            }
            if (cityName) break;
          };
          if (province) {
            city = cityName;
          } else {
            province = val.name || '';
          }
          break;
        case 'scene':
          routerPath = 'riskAreasDetail';
          break;
        case 'trend':
          routerPath = 'riskAreasDetail';
          break;
        default:
          break;
      }
      let optype;
      if (this.searchForm.transactionType === undefined || this.searchForm.transactionType.selectText === '全部交易类型') {
        optype = -1;
      } else {
        optype = this.searchForm.transactionType;
      }
      let params = {
        appId: this.appId,
        province: province, // 城市名称
        city: city,
        // strategy: this.strategy || this.typeItemList[0].value, // 指标策略
        strategy: this.strategy, // 指标策略
        startTime: this.searchForm.dates[0], // 开始时间
        endTime: this.searchForm.dates[1], // 结束时间
        opType: optype // 交易类型
      };
      if (chartName === 'pieChart') {
        params.title = val.name ? val.name : '';
        params.province = '';
      }
      // sessionStorage.setItem('riskAreasDetailParams', JSON.stringify(params));
      // this.$router.push(routerPath);
      this.$router.push({
        name: routerPath,
        params: params
      });
    },
    // 初始化中国地图
    renderMap (province) {
      let provinceCh = province;
      let defautMapColor = [];
      switch (this.mapTypeValue) {
        case '总数量':
        case '自动放行':
          defautMapColor = ['#FFFFFF', '#89D7BD'];
          break;
        case '加强认证':
          defautMapColor = ['#FFFFFF', '#4F8BE8'];
          break;
        case '人工审核':
          defautMapColor = ['#FFFFFF', '#ECCAA1'];
          break;
        case '自动阻断':
          defautMapColor = ['#FFFFFF', '#EE8F97'];
          break;
      }
      const myChart = this.$echarts.init(this.$refs.mapchart);
      myChart.clear();
      let max = 100;
      let min = 0;
      this.mapList.forEach(item => {
        if (item.value >= max) {
          let num = item.value.toString()[0];
          let length = item.value.toString().length;
          max = num * Math.pow(10, length - 1);
        }
        if (item.value <= min) {
          min = item.value;
        }
      });
      myChart.setOption({ // 进行相关配置
        tooltip: { // 鼠标移到图里面的浮动提示框
          trigger: 'item',
          formatter: function (params) {
            if (params.value) {
              return params.name + ' : ' + params.value;
            } else {
              return params.name + ' : ' + '0';
            }
          }
        },
        visualMap: {
          min: min,
          max: max,
          text: ['高', '低'],
          realtime: true,
          calculable: true,
          inRange: {
            color: defautMapColor
          }
        },
        geo: { // 这个是重点配置区
          map: provinceCh, // 表示中国地图
          roam: false, // 控制地图是否可缩放
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: 'rgba(0,0,0,0.4)'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        series: [
          {
            type: 'map',
            mapType: provinceCh,
            symbolSize: 10,
            symbol: 'circle',
            label: {
              show: true
            },
            geoIndex: 0,
            data: this.mapList
          }
        ]
      });
      $(window).resize(function () {
        myChart.resize();
      });
      // myChart.off('click');
      this.provinceVal === '全国' ? this.mapOrPie(myChart, 'mapChart') : this.mapOrPie(myChart, 'location');
    },
    mapTypeValueChange (data) {
      let strategy = data || this.typeItem[0];
      let strategy1 = this.typeItemList.find(item => strategy === item.text);
      this.strategy = strategy1.value;
      this.mapList = [];
      if (this.initMapList.length > 0) {
        this.initMapList.forEach((item, index, ary) => {
          if (this.mapTypeValue === '自动阻断') {
            this.mapList.push({
              name: item.name,
              value: item.eBlock
            });
          } else if (this.mapTypeValue === '人工审核') {
            this.mapList.push({
              name: item.name,
              value: item.eManualAudit
            });
          } else if (this.mapTypeValue === '加强认证') {
            this.mapList.push({
              name: item.name,
              value: item.eEnhancedCertification
            });
          } else if (this.mapTypeValue === '自动放行') {
            this.mapList.push({
              name: item.name,
              value: item.eRelease
            });
          } else if (this.mapTypeValue === '总数量') {
            this.mapList.push({
              name: item.name,
              value: item.eAll
            });
          }
        });
      }
      // this.renderMap('china');
      this.renderMap(this.provinceVal === '全国' ? 'china' : this.provinceVal);
    },
    reconnect () {
      const that = this;
      if (that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(() => {
        this.initWebSocket();
        that.lockReconnect = false;
      }, 60 * 1000);
    },
    initWebSocket () { // 初始化weosocket
      try {
        if ('WebSocket' in window) {
          const wsuri = `${window.g.wsAddress}/${this.appId}`;
          this.websock = new WebSocket(wsuri);
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onopen = this.websocketonopen;
          this.websock.onerror = this.websocketonerror;
          this.websock.onclose = this.websocketclose;
        } else {
          this.showError('您的浏览器不支持websocket');
        }
      } catch (e) {
        this.reconnect();
      }
    },
    websocketonopen () { // 连接建立之后执行send方法发送数据
      heartCheck.start(this.websock);
      this.websocketsend(this.appId);
    },
    websocketonerror () { // 连接建立失败重连
      this.reconnect();
    },
    websocketonmessage (e) { // 数据接收
      if (e.data === 'pong') {
        heartCheck.start(this.websock);
      } else {
        let resData = JSON.parse(e.data);
        if (resData.type === 'detailEventData') {
          this.marqueeList = this.marqueeList.concat(resData.value);
        }
        if (resData.type === 'todayEventData') {
          this.eventdata = Object.assign({}, resData.value);
          this.queryTodayEventData();
        }
        // if (resData.type === 'mapEventData') {
        //   this.initMapList = resData.value;
        //   this.mapTypeValueChange();
        // }
        heartCheck.start(this.websock); // 消息获取成功，重置心跳
      }
    },
    websocketsend (Data) { // 数据发送
      this.websock.send(Data);
    },
    websocketclose (e) { // 关闭
      // console.log('断开连接', e);
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
    showError (err) { // 错误提示框
      this.snackbarServe = true;
      this.snackbarServeMsg = err;
      this.snackbarServeColor = 'error';
    },
    getUserInfo () {
      let that = this;
      $.ajax({
        url: window.g.address + '/login/userinfo',
        type: 'GET', // GET
        async: false, // 或false,是否异步
        timeout: 5000, // 超时时间
        dataType: 'json', // 返回的数据格式
        xhrFields: { withCredentials: true },
        success: function (res) {
          if (!!res.data && res.code === 200) {
            let data = res.data;
            // if (data.appList && data.appList.length) {
            that.setAppList(data.appList);// 应用列表数据存储到vuex里
            sessionStorage.setItem('vuexAppList', JSON.stringify(data.appList));
            // } else {
            //   that.showError('此账号没有配应用，请联系管理员');
            //   that.btnLoading = false;
            //   return false;
            // }
            // 定义空数组，用于合并各个中心下的目录
            let dataArray = [];
            if (data.caseManangementgCenter) { // 案件管理中心
              dataArray = dataArray.concat(that.addName(JSON.parse(data.caseManangementgCenter), { enTitle: 'caseManangementgCenter', zhTitle: '案件管理中心' }));
            }
            if (data.systemManagementCenter) {
              dataArray = dataArray.concat(that.addName(JSON.parse(data.systemManagementCenter), { enTitle: 'systemManagementCenter', zhTitle: '系统管理中心' }));
            }
            if (data.desicionModelItems) { // 决策模型中心
              dataArray = dataArray.concat(that.addName(JSON.parse(data.desicionModelItems), { enTitle: 'desicionModelItems', zhTitle: '决策模型中心' }));
            }
            if (data.riskMenuItems) { // 风控分析中心
              dataArray = dataArray.concat(that.addName(JSON.parse(data.riskMenuItems), { enTitle: 'riskMenuItems', zhTitle: '风控分析中心' }));
            }
            if (data.shuju) {
              dataArray = dataArray.concat(that.addName(JSON.parse(data.shuju), { enTitle: 'shuju', zhTitle: '数据管理中心' }));
            }
            if (dataArray.length === 0) {
              that.showError('此账号没有分配权限，请联系管理员');
              that.btnLoading = false;
              return false;
            }
            let dataObj = {};
            let childArray = [];
            // 遍历所有菜单，存储所有路由到对象中并给赋值为当前中心名称，所有路由和
            var getData = function (arr) {
              arr.forEach(item => {
                dataObj[item.path] = item.name;// 当前用户，所有权限页面的路由集合
                childArray.push(item);
                if (item.children) {
                  getData(item.children);
                }
              });
            };
            getData(dataArray);
            // 存储token
            if (data.token) {
              localStorage.setItem('token', JSON.stringify(data.token));
            }
            // 存储登录成功返回的数据信息
            localStorage.setItem('loginData', JSON.stringify(data));
            localStorage.setItem('routerObj', JSON.stringify(dataObj));
            localStorage.setItem('childArray', JSON.stringify(childArray));
            that.getNavItems();// 存储路由信息，面包屑导航信息
            window.g.isSSO = false; // 点退出后将单点登录标志设为false
          }
        },
        error: function () { }
      });
    },
    getNavItems () {
      let childArray = JSON.parse(localStorage.getItem('childArray'));
      let toNext = childArray.find(item => item.path === '/riskMarket');
      if (toNext) {
        this.setCenterActive(toNext.name);
        // store.dispatch('setCenterActive', toNext.name); // 存储当前中心到vuex
        sessionStorage.setItem('itemChildren', JSON.stringify(toNext));// 存储当前路由的三级菜单信息
        let menuItems = JSON.parse(JSON.parse(localStorage.getItem('loginData'))[toNext.name]);
        // 获取当前三级菜单所属的二级菜单信息
        let textItem = {};
        menuItems.forEach((item) => {
          if (item.children) {
            item.children.forEach((key) => {
              if (key.path === toNext.path && !key.pageType) {
                textItem = Object.assign({}, item);
              }
              if (key.children) {
                key.children.forEach((i) => {
                  if (i.path === toNext.path) {
                    textItem = Object.assign({}, item);
                  }
                });
              }
            });
          }
        });
        sessionStorage.setItem('menuItems', JSON.stringify(menuItems));// 存储当前中心二、三级目录
        this.handleChangeNavItems({
          rootItemPath: menuItems[0],
          item: toNext,
          prevItem: textItem,
          index: toNext.name
        });
        if (toNext.children) {
          let pageTabs = toNext.children.filter(item => item.pageType === 'tab');
          this.setPageTabs(pageTabs);
        }
      }
    },
    // getSelectItem () { // 展开已选的二级菜单
    //   this.MenuItems.forEach((item) => {
    //     item.model = false;
    //     this.secItem.forEach((key) => {
    //       if (item.text === key) {
    //         item.model = true;
    //       }
    //     });
    //   });
    // },
    // 给每个菜单路由添加所属中心的字段,name代表所属中心
    addName (arr, val) {
      arr.forEach(i => {
        i['name'] = val.enTitle;
        i['centerName'] = val.zhTitle;
        if (i.children) {
          this.addName(i.children, val);
        }
      });
      return arr;
    },
    ...mapActions([
      'setAppList',
      'setCenterActive',
      'setPageTabs',
      'handleChangeNavItems',
      'setCityData'
    ]),
    // 地区
    locationClick (val) {
      this.baseParams(val, 'location');
    },
    // 场景
    scenesClick (val) {
      let selectItem = this.tradeTypeItems.filter(item => item.selectText === val.name);
      this.searchForm.transactionType = selectItem[0].selectField;
      this.baseParams({}, 'scene');
    },
    // 趋势
    riskTrendClick (val) {
      if (val.name.indexOf(':') === -1) {
        let year = new Date().getFullYear();
        let data = `${year}-${val.name}`;
        this.searchForm.dates = [data, data];
      }
      this.baseParams({}, 'trend');
    },
    // 点击四个离线图表右上角的箭头，分别调转不同的页面
    toLevelPercent (param) {
      let routerPath = '';
      let strategyNew = 1000;
      switch (param) {
        case '等级占比':
          routerPath = 'levelPercentage';
          break;
        case '城市排名':
          routerPath = 'riskAreas';
          break;
        case '场景分布':
          routerPath = 'sceneDistribution';
          strategyNew = 'risk_event';
          break;
        case '趋势':
          routerPath = 'riskAreasDetail';
          break;
        default:
          break;
      }
      let optype;
      if (this.searchForm.transactionType === undefined || this.searchForm.transactionType.selectText === '全部交易类型') {
        optype = -1;
      } else {
        optype = this.searchForm.transactionType;
      }
      let params = {
        appId: this.appId,
        province: '', // 城市名称
        startTime: this.searchForm.dates[0], // 开始时间
        endTime: this.searchForm.dates[1], // 结束时间
        opType: optype, // 交易类型
        title: '风险事件数', // 风险事件
        strategy: strategyNew // 风险事件
      };
      // sessionStorage.setItem('riskAreasDetailParams', JSON.stringify(params));
      // this.$router.push(routerPath);
      this.$router.push({
        name: routerPath,
        params: params
      });
    },
    async getCityData () {
      try {
        const response = await dataService.getcity();
        if (response.data.code === 200) {
          let data = response.data.data;
          this.setCityData(data); // 全国城市数据存储到vuex里
          this.provinceArr = data;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = response.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    async getProvinceMap () {
      const response = await dataService.getProvinceMap({ key: 'tbbpz_fxdtsz' });
      if (response.data.code === 200) {
        if (response.data.data) {
          let data = response.data.data;
          this.provinceVal = data.units;
          this.appId && this.getMapDatas(this.dateToString(this.dateEnd), this.dateToString(this.dateEnd), this.searchForm.transactionType); // 获取地图数据
        }
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
// 浮动，清除浮动
.fl {
  float: left;
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
  margin-top: -12px;
  background-image: url('../../../static/img/risk_market_top_bg.jpg');
  background-repeat: no-repeat;
  background-position: right center;
  background-size: auto 168%;
}

.v-card--material__heading {
  position: relative;
  top: -40px;
  -webkit-transition: 0.3s ease;
  transition: 0.3s ease;
  z-index: 1;
}

.today-event-width {
  width: 16%;
  margin-right: 1%;
}

.today-event-width:last-child {
  margin-right: 0;
}

.cardPng {
  width: 20px;
  height: 20px;
  position: relative;
  top: 15px;
  left: 15px;
}

.cardOne {
  background-image: url('../../../static/img/card_one.png');
  background-repeat: no-repeat center center;
  background-size: 100%, 100%;
}

.cardTwo {
  background-image: url('../../../static/img/card_two.png');
  background-repeat: no-repeat center center;
  background-size: 100%, 100%;
}

.cardThree {
  background-image: url('../../../static/img/card_three.png');
  background-repeat: no-repeat center center;
  background-size: 100%, 100%;
}

.cardFour {
  background-image: url('../../../static/img/card_four.png');
  background-repeat: no-repeat center center;
  background-size: 100%, 100%;
}

.cardFive {
  background-image: url('../../../static/img/card_five.png');
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
  height: 220px;
  color: #3A3A3A;
  box-sizing: border-box;
}

.marquee_box {
  display: block;
  position: relative;
  width: 100%;
  height: 220px;
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
  margin-top: -30px;
}

.marquee_list li {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  padding-left: 10px;
}

// 地图样式
.mapitem {
  z-index: 3;
  width: 100%;
  height: 466px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  -o-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  -ms-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
}

.tabelHeader {
  padding-top: 12px;
  padding-left: 10px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
  background: #FFFFFF;
  text-align: center;
}

.echartsP {
  color: #000;
  font-size: 16px;
  font-weight: bold;
  padding-top: 15px;
  padding-left: 20px;
  margin-bottom: 5px;
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
  border: 2px solid rgba(220, 220, 220, 1);
  border-radius: 50%;
}

.map-title {
  font-size: 16px;
  color: #000;
  font-weight: bold;
  position: absolute;
  top: 15px;
  left: 20px;
}

.arrow-right {
  width: 14px;
  height: 10px;
  position: absolute;
  top: 20px;
  right: 20px;
}

.hand-signals {
  cursor: pointer;
}

// 时间选择器 输入框高度
#data-picker /deep/ .ivu-input {
  height: 40px;
}

.table_header {
  font-size: 14px;
  font-weight: 700;
  height: 48px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.7);
}

.table_td {
  color: rgba(0, 0, 0, 0.5);
}
</style>
