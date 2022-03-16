<!-- author: yijianchao-->
<!-- updateTime: 2020-09-28-->
<template>
  <!-- 风险地区 -->
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
      <v-row>
        <v-col cols="12" class="pr py-0" style="min-height: 60px">
          <div class="location-cont">
            <div class="input-width fl">
              <v-select
                v-model="provinceId"
                item-text="label"
                item-value="value"
                :items="provinceArr"
                placeholder="当前省："
                dense
                outlined
                no-data-text="没有匹配数据"
              />
            </div>
          </div>
          <!-- 指标策略下拉框 -->
          <div class="strategy-style">
            <v-select
              v-model="strategy"
              item-text="text"
              item-value="value"
              :items="typeItem"
              class="input-width"
              placeholder="指标："
              no-data-text="没有数据"
              outlined
              dense
              @change="search()"
            />
          </div>
        </v-col>
      </v-row>
      <v-row v-if="!provinceId">
        <!-- 全国 城市排名TOP10-->
        <v-col cols="12" class="pr-3 py-0 pr">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <div class="location-text">
                <span>城市排名TOP10</span>
              </div>
              <echart-export-file
                :chartId="'riskAreasTOPId'"
                :hover="hover"
                :fileName="appName + '-全国-城市排名TOP10-' + strategyName.text"
                :isActive="isActiveBtnCityRankTOP10"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'histogram',
                    'isActiveBtnCityRankTOP10'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'histogram',
                    'isActiveBtnCityRankTOP10'
                  )
                "
                style="position: absolute; right: 20px; top: 8px; z-index: 4"
                v-if="hasPermission(exportCityRankTOP10Btn)"
              ></echart-export-file>
              <div>
                <base-echarts
                  :chartId="'riskAreasTOPId'"
                  :optionParam="optionParamBarTriggerNumber"
                  @clickEvent="clickEventBarTop($event, 1)"
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
      <!-- 某个省的 -->
      <div v-else>
        <v-row>
          <!-- 城市占比 -->
          <v-col cols="6" class="py-0">
            <v-hover v-slot="{ hover }">
              <div class="pr" style="position: relative">
                <div class="location-text">
                  <span>城市占比</span>
                </div>
                <echart-export-file
                  :chartId="'riskAreasCityRate'"
                  :hover="hover"
                  :fileName="
                    appName +
                    '-' +
                    `${provinceId === '' ? '全国' : provinceId}` +
                    '-城市占比-' +
                    strategyName.text
                  "
                  :isActive="isActiveBtnCityRito"
                  @exportExcel="
                    exportData(arguments, 'excel', 'pie', 'isActiveBtnCityRito')
                  "
                  @exportCSV="
                    exportData(arguments, 'csv', 'pie', 'isActiveBtnCityRito')
                  "
                  style="position: absolute; right: 20px; top: 8px; z-index: 4"
                  v-if="hasPermission(exportCityRitoBtn)"
                ></echart-export-file>
                <div>
                  <base-echarts
                    :chartId="'riskAreasCityRate'"
                    :optionParam="optionParamCityProportion"
                    @clickEvent="clickEventBarTop"
                  ></base-echarts>
                </div>
                <!-- <div
                v-if="!loading && !optionParamCityProportion"
                class="no-data-box"
              >
                暂无数据
              </div>
              <div v-if="loading" class="no-data-box">加载中</div> -->
              </div>
            </v-hover>
          </v-col>
          <!-- 城市数量 -->
          <v-col cols="6" class="py-0 pl-0">
            <v-hover v-slot="{ hover }">
              <div class="pr" style="position: relative">
                <div class="location-text">
                  <span>城市数量</span>
                </div>
                <echart-export-file
                  :chartId="'riskAreasCityNum'"
                  :hover="hover"
                  :fileName="
                    appName +
                    '-' +
                    `${provinceId === '' ? '全国' : provinceId}` +
                    '-城市数量-' +
                    strategyName.text
                  "
                  :isActive="isActiveBtnCityNum"
                  @exportExcel="
                    exportData(
                      arguments,
                      'excel',
                      'histogram',
                      'isActiveBtnCityNum'
                    )
                  "
                  @exportCSV="
                    exportData(
                      arguments,
                      'csv',
                      'histogram',
                      'isActiveBtnCityNum'
                    )
                  "
                  style="position: absolute; right: 20px; top: 8px; z-index: 4"
                  v-if="hasPermission(exportCityNumBtn)"
                ></echart-export-file>
                <div>
                  <base-echarts
                    :chartId="'riskAreasCityNum'"
                    :optionParam="optionParamCityNumber"
                    @clickEvent="clickEventBarTop"
                  ></base-echarts>
                </div>
                <!-- <div
                v-if="!loading && !optionParamCityNumber"
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
    </div>
    <!-- 表格 -->
    <div>
      <v-hover v-slot="{ hover }">
        <v-data-table
          :headers="headers"
          :items="desserts"
          :items-per-page="perPageNum"
          no-results-text="没有匹配的数据"
          hide-default-footer
          class="elevation-3 mt-3"
          :loading="loading"
          loading-text="加载数据中..."
          :fixed-header="true"
        >
          <!-- 表头 -->
          <template v-slot:top>
            <div style="position: relative">
              <v-toolbar flat height="60px">
                <v-toolbar-title style="font-size: 18px">
                  {{ provinceId === '' ? '城市排名' : '城市列表' }}
                </v-toolbar-title>
              </v-toolbar>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="appName + '-全国-城市排名列表'"
                :isActive="isActiveBtnCityRankList"
                @exportExcel="
                  exportListData(arguments, 'excel', 'isActiveBtnCityRankList')
                "
                @exportCSV="
                  exportListData(arguments, 'csv', 'isActiveBtnCityRankList')
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="
                  provinceId === '' &&
                  hasPermission(exportRiskAreasCityRankListBtn)
                "
              ></echart-export-file>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="appName + '-' + provinceId + '-城市列表'"
                :isActive="isActiveBtnCityList"
                @exportExcel="
                  exportListData(arguments, 'excel', 'isActiveBtnCityList')
                "
                @exportCSV="
                  exportListData(arguments, 'csv', 'isActiveBtnCityList')
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="provinceId !== '' && hasPermission(exportCityListBtn)"
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
                <span v-if="i.value === 'province'">{{ item[i.value] }}</span>
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
import toolList from '@/utils/tools';
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
      strategyName: { text: '', value: '' },
      dates: [], // 时间
      allItem: { label: '全国', value: '' },
      provinceArr: [], // 省份数据
      cityArr: [], // 市数据
      cityData: [],
      provinceId: '',
      cityId: '',
      cityName: '',
      loading: false,
      echartsBarIndex: 0,
      echartsPieIndex: 0,
      // 分页变量
      pageNum: 1,
      queryPageLength: 1,
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
      // 指标下拉框
      strategy: 1000, // 风险事件
      typeItem: [],
      defaultHeight: '500px',
      // 全国城市排名TOP10
      optionParamBarTriggerNumber: loadingOption,
      // 城市占比
      optionParamCityProportion: loadingOption,
      // 城市数量
      optionParamCityNumber: loadingOption,
      headers: [],
      desserts: [],
      // 查看图表的公共弹窗的变量
      riskViewingReportsRiskInfo: {},
      riskViewingReportsHeaders: [],
      riskViewingReportsData: [],
      vuexAppList: [],
      // appName: '', // 应用中文名称
      transactionTypeText: '', // 应用场景中文名称
      resTradeTypeItems: [], // 应用场景数组
      riskViewingReportsParams: {},
      refreshChart: true, // 是否刷新饼图和柱图
      // 按钮权限
      exportBtn: '/exportRiskAreasButton', // 导出权限
      exportCityRankTOP10Btn: '/exportCityRankTOP10Button', // 导出城市排名TOP10
      exportRiskAreasCityRankListBtn: '/exportRiskAreasCityRankListButton', // 导出城市排名
      exportCityRitoBtn: '/exportCityRitoButton', // 导出城市占比
      exportCityNumBtn: '/exportCityNumButton', // 导出城市数量
      exportCityListBtn: '/exportCityListButton', // 导出城市列表
      isActiveBtnCityRankTOP10: true, // 导出按钮是否可以点击
      isActiveBtnCityRankList: true,
      isActiveBtnCityRito: true,
      isActiveBtnCityNum: true,
      isActiveBtnCityList: true
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
        if (newVal !== oldVal) {
          this.getDownBox();
          this.getTradeTypeList();
        }
      },
      immediate: true
    },
    provinceId: {
      handler: function (newVal, oldVal) {
        this.search();
      }
    }
  },
  mounted () {
    this.getDownBox();
    this.getTradeTypeList(); // 交易类型
    this.getCityData();
  },
  methods: {
    // 导出图表Excel与csv
    exportData (arg, fileType, graphMark, isActiveBtn) {
      let fileName = arg[0];
      let params = {
        appId: this.appId,
        graphMark: graphMark,
        opType: (this.searchForm[1].value === '' || this.searchForm[1].value === undefined || this.searchForm[1].value === '全部交易类型') ? -1 : this.searchForm[1].value,
        province: this.provinceId,
        strategy: this.strategy,
        exportType: fileType,
        startTime: moment(this.searchForm[0].value[0]).format('YYYY-MM-DD'),
        endTime: moment(this.searchForm[0].value[1]).format('YYYY-MM-DD')
      };
      if (this.provinceId === '') {
        params.pageIndex = 1;
        params.pageSize = 10;
      }
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportCityRankTOP10(params).then(res => {
        let blob = new Blob([res.data]);
        downloadFile(blob, fileName);
        this[isActiveBtn] = !this[isActiveBtn];
      }).catch(() => {
        this[isActiveBtn] = !this[isActiveBtn];
      });
    },
    // 导出列表Excel与csv
    exportListData (arg, fileType, isActiveBtn) {
      let fileName = arg[0];
      let params = {
        appId: this.appId,
        opType: (this.searchForm[1].value === '' || this.searchForm[1].value === undefined || this.searchForm[1].value === '全部交易类型') ? -1 : this.searchForm[1].value,
        province: this.provinceId,
        strategy: this.strategy,
        exportType: fileType,
        startTime: moment(this.searchForm[0].value[0]).format('YYYY-MM-DD'),
        endTime: moment(this.searchForm[0].value[1]).format('YYYY-MM-DD')
      };
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportCityList(params).then(res => {
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
        this.provinceId = chartsDataParams.province; // 省份
        this.searchForm[0].value = [chartsDataParams.startTime, chartsDataParams.endTime];
        this.dates = [chartsDataParams.startTime, chartsDataParams.endTime];
        this.searchForm[1].value = chartsDataParams.opType === -1 ? '' : chartsDataParams.opType;// 交易类型
        this.strategy = chartsDataParams.strategy;// 指标策略
      } else {
        let today = new Date();
        let startDay = this.dateToString(today);
        let endDay = this.dateToString(new Date()).substr(0, 10);
        this.provinceId = ''; // 省份
        this.searchForm[0].value = [startDay, endDay];
        this.dates = [startDay, endDay];
        this.searchForm[1].value = '';// 交易类型
        this.strategy = 1000;// 指标策略
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
              value: item.id
            });
          });
          if (this.tradeTypeItems.length) {
            this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
          }
          this.searchForm[1].options = this.tradeTypeItems;
        }
      }
    },
    // 风险大盘--风险地区--下拉框接口
    async getDownBox () {
      this.typeItem = [];
      const response = await dataService.getDownBox();
      if (response.data.code === 200) {
        this.typeItem = response.data.data;
        // 指标赋默认值
        if (!this.$route.params) {
          this.strategy = this.typeItem[0].value;
        }
      }
      this.initGetData(); // 初始化数据
      this.search();
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
      this.optionParamCityProportion = loadingOption;// 城市占比
      this.optionParamCityNumber = loadingOption;// 城市数量
      this.headers = [];
      this.desserts = [];
      this.totalItems = 0;
      this.queryPageLength = 1;
      this.strategyName = this.typeItem.find(item => this.strategy === item.value);
      this.doSearch($event);
    },
    doSearch ($event) {
      let params = {};
      if ($event !== undefined) {
        if (typeof ($event[0].value[0]) === 'object') {
          $event[0].value[0] = this.dateToString($event[0].value[0]);
        }
        if (typeof ($event[0].value[1]) === 'object') {
          $event[0].value[1] = this.dateToString($event[0].value[1]);
        }
        params = Object.assign({}, {
          startTime: $event[0].value[0],
          endTime: $event[0].value[1],
          opType: $event[1].value,
          appId: this.appId,
          province: this.provinceId, // 省份
          strategy: this.strategy, // 策略
          pageIndex: this.pageNum,
          pageSize: this.perPageNum
        });
        params.opType = params.opType ? params.opType : '-1';
        this.queryRiskData(params);
      } else {
        this.$nextTick(() => {
          if (typeof (this.searchForm[0].value[0]) === 'object') {
            this.searchForm[0].value[0] = this.dateToString(this.searchForm[0].value[0]);
          }
          if (typeof (this.searchForm[0].value[1]) === 'object') {
            this.searchForm[0].value[1] = this.dateToString(this.searchForm[0].value[1]);
          }
          let datesStr = this.searchForm[0].value;
          params = Object.assign({}, {
            startTime: datesStr[0],
            endTime: datesStr[1],
            opType: this.searchForm[1].value,
            appId: this.appId,
            province: this.provinceId, // 省份
            strategy: this.strategy, // 策略
            pageIndex: this.pageNum,
            pageSize: this.perPageNum
          });
          params.opType = params.opType ? params.opType : '-1';
          this.queryRiskData(params);
        });
      }
    },
    // 图表点击调转
    clickEventBarTop (data, type) {
      // let cityName = data.name;
      // let provinceName = '';
      // if (type) {
      //   cityName = '';
      //   provinceName = data.name;
      // }
      let _province = '';
      let _city = '';
      this.provinceArr.forEach((val, index) => {
        if (val.children && val.children.length && data.name && data.name !== '') {
          let result = val.children.some(k => k.value === data.name);
          if (result) {
            _province = val.value;
          }
        }
      });
      if (_province) {
        _city = data.name;
      } else {
        _province = data.name;
      }
      let strategyName = this.typeItem.find(item => this.strategy === item.value);
      let detailParams = {
        startTime: this.searchForm[0].value[0], // 开始时间
        endTime: this.searchForm[0].value[1], // 结束时间
        opType: this.searchForm[1].value, // 交易类型
        appId: this.appId, // 应用id
        province: this.provinceId ? this.provinceId : _province, // 省份
        city: _city, // 城市
        title: strategyName ? strategyName.text : ''
      };
      // 跳转风险趋势详情页
      this.$router.push({
        name: 'riskAreasDetail',
        params: detailParams
      });
    },
    // 列表信息的某一条数据的点击事件
    async tableClick (item, title) {
      let _province = '';
      let _city = '';
      this.provinceArr.forEach((val, index) => {
        if (val.children && val.children.length && item.province && item.province !== '') { // 判断省份存在，并且不为''
          let result = val.children.some(k => k.value === item.province);
          if (result) {
            _province = val.value;
          }
        }
      });
      if (_province) {
        _city = item.province;
      } else {
        _province = item.province;
      }
      let params = {
        startTime: this.searchForm[0].value[0], // 开始时间
        endTime: this.searchForm[0].value[1], // 结束时间
        opType: this.searchForm[1].value, // 交易类型
        appId: this.appId, // 应用id
        title: title.text,
        province: _province,
        city: _city // 城市
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
        const res = await dataService.getRiskAreasData(params);
        if (res.data.code === 200) {
          this.allData = res.data.data;
          if (this.refreshChart) { // 刷新饼图和柱图
            this.$nextTick(() => {
              // 风险地区---全国----柱图
              this.optionParamBarTriggerNumber = this.allData.provinceHistogram.city ? Object.assign({}, {
                width: '100%',
                height: this.defaultHeight,
                color: window.g.echartsBaseColor,
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
                    data: this.allData.provinceHistogram.city,
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
                    name: this.strategyName.text,
                    type: 'bar',
                    barWidth: '40%',
                    data: this.allData.provinceHistogram.value
                  }
                ]
              }) : noneDataOption;
              // 风险地区---城市占比----饼图
              let legends = [];
              this.allData.cityPieArray.forEach(item => {
                legends.push(item.name);
              });
              this.optionParamCityProportion = this.allData.cityPieArray.length ? Object.assign({}, {
                width: '100%',
                height: this.defaultHeight,
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
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
                    // name: '城市占比',
                    name: this.strategyName.text,
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
                    data: this.allData.cityPieArray
                  }
                ]
              }) : noneDataOption;
              // 风险地区---城市数量----柱图
              this.optionParamCityNumber = this.allData.cityHistogram.city ? Object.assign({}, {
                width: '100%',
                height: this.defaultHeight,
                tooltip: {
                  trigger: 'item',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                xAxis: [
                  {
                    type: 'category',
                    data: this.allData.cityHistogram.city,
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
                    name: this.strategyName.text,
                    type: 'bar',
                    barWidth: '30%',
                    data: this.allData.cityHistogram.value
                  }
                ]
              }) : noneDataOption;
            });
          }
          this.totalItems = this.allData.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          this.allData.titleList.forEach(item => {
            item.sortable = false;
            item.value = item.value.toString();
          });
          this.headers = this.allData.titleList;
          this.desserts = this.allData.listPage;
        }
        this.loading = false;
      }
    },
    // 获取城市
    async getCityData () {
      console.log(1111);
      console.log(toolList);
      try {
        const response = await toolList.getCityData();
        if (response.data.code === 200) {
          this.cityData = response.data.data;
          this.provinceArr = [this.allItem, ...this.cityData];
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

.no-data-box {
  width: 100%;
  height: 500px;
  background: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pr {
  position: relative;
}

.fl {
  float: left;
}

.location-text {
  position: absolute;
  top: 16px;
  left: 0;
  width: 100%;
  z-index: 1;
  font-weight: 700;
  text-align: center;

  span {
    font-size: 17px;
  }
}

// 当前省-城市
.location-cont {
  position: absolute;
  top: 9px;
  left: 16px;
  z-index: 1;
  // font-weight: 700;
}

.input-width {
  width: 177px !important;
}

.strategy-style {
  position: absolute;
  top: 9px;
  right: 20px;
  z-index: 4;
}

.hand-signals {
  cursor: pointer;
}
</style>
