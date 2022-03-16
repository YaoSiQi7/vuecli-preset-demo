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
    <!-- 省市联动 -->
    <v-row>
      <v-col cols="12" class="pr py-0" style="min-height: 60px">
        <div class="location-cont">
          <div class="input-width fl">
            <v-autocomplete
              v-model="provinceId"
              item-text="label"
              item-value="value"
              :items="provinceArr"
              placeholder="当前省："
              outlined
              dense
              no-data-text="没有匹配数据"
              :menu-props="{ auto: true, overflowY: true }"
              @change="changeProvinceFun(1)"
            />
          </div>
          <!-- 当前市： -->
          <div class="input-width fl ml-4" v-if="!!provinceId">
            <v-autocomplete
              v-model="cityId"
              item-text="label"
              item-value="value"
              :items="cityArr"
              placeholder="当前市："
              outlined
              dense
              no-data-text="没有匹配数据"
              :menu-props="{ auto: true, overflowY: true }"
              @change="changeCityFun"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <!-- 图表 -->
    <div>
      <v-row>
        <!-- 全国 -->
        <v-col cols="12" class="pr-3 py-0 pr">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <div class="location-text">
                <span>日趋势图</span>
              </div>
              <echart-export-file
                :chartId="'riskAreasDetailId'"
                :hover="hover"
                :fileName="
                  appName +
                    '-风险地区趋势-' +
                    `${provinceId === '' ? '全国' : provinceId}`
                "
                :isActive="isActiveBtnDayTrendEchart"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'histogram',
                    'isActiveBtnDayTrendEchart'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'histogram',
                    'isActiveBtnDayTrendEchart'
                  )
                "
                style="position: absolute; right: 20px; top: 8px; z-index: 4"
                v-if="hasPermission(exportRiskAreasDayTrendEchartBtn)"
              ></echart-export-file>
              <div>
                <base-echarts
                  :chartId="'riskAreasDetailId'"
                  :optionParam="optionParamBarTriggerNumber"
                  @clickEvent="clickEventBarTop"
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
                  风险地区趋势
                </v-toolbar-title>
              </v-toolbar>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="
                  appName +
                    '-风险地区趋势列表-' +
                    `${provinceId === '' ? '全国' : provinceId}`
                "
                :isActive="isActiveBtnTrendList"
                @exportExcel="
                  exportData(arguments, 'excel', 'list', 'isActiveBtnTrendList')
                "
                @exportCSV="
                  exportData(arguments, 'csv', 'list', 'isActiveBtnTrendList')
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="hasPermission(exportRiskAreasTrendListBtn)"
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
                <span v-if="i.value === 'riskDay'">{{ item[i.value] }}</span>
                <span
                  class="hand-signals"
                  v-else
                  @click="tableClick(item, i)"
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
      dates: [],
      chartsDataParams: null,
      allItem: { label: '全国', value: '' },
      provinceArr: [], // 省份数据
      cityArr: [], // 市数据
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
          value: '-1',
          type: 'select',
          options: []
        }
      ],
      clearDate: false,
      ruleName: '', // 页尾列表的搜索框的值
      allData: [],
      typeItem: [], // 指标策略
      tradeTypeItems: [],
      dateItems: [
        { text: '今天', value: '' },
        { text: '近一周', value: -7 },
        { text: '近一月', value: -30 },
        { text: '近一年', value: -365 }
      ],
      defaultHeight: '500px',
      // 全国城市排名TOP10
      optionParamBarTriggerNumber: noneDataOption,
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
      // 按钮权限
      exportBtn: '/exportRiskAreasDetailsButton', // 导出权限
      exportRiskAreasDayTrendEchartBtn: '/exportRiskAreasDayTrendEchartButton', // 导出日趋势图折线图
      exportRiskAreasTrendListBtn: '/exportRiskAreasTrendListButton', // 导出风险地区趋势列表
      isActiveBtnDayTrendEchart: true, // 导出按钮是否可以点击
      isActiveBtnTrendList: true
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
          this.getDownBox(),
          this.getTradeTypeList(),
          this.initGetData(), // 初始化数据
          this.search()
        ]);
      },
      immediate: true
    }
  },
  mounted () {
    Promise.all([
      this.getCityData(),
      this.getDownBox(), // 处置策略列表
      this.getTradeTypeList(), // 交易类型
      this.initGetData(), // 初始化数据
      this.search()
    ]);
  },
  methods: {
    // 导出Excel与csv
    exportData (arg, fileType, graphMark, isActiveBtn) {
      let fileName = arg[0];
      let params = {
        appId: this.appId,
        opType: this.searchForm[1].value,
        province: this.provinceId,
        city: this.cityId,
        strategy: this.strategy,
        graphMark: graphMark,
        exportType: fileType,
        startTime: moment(this.searchForm[0].value[0]).format('YYYY-MM-DD'),
        endTime: moment(this.searchForm[0].value[1]).format('YYYY-MM-DD')
      };
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportDayTrend(params).then(res => {
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
        this.chartsDataParams = this.$route.params;
        this.provinceId = this.chartsDataParams.province; // 省份
        this.cityName = this.chartsDataParams.city;
        this.searchForm[0].value = [this.chartsDataParams.startTime, this.chartsDataParams.endTime];
        this.dates = [this.chartsDataParams.startTime, this.chartsDataParams.endTime];
        // 交易类型
        if (this.chartsDataParams.opType === '' || this.chartsDataParams.opType === -1) {
          this.searchForm[1].value = '-1';
        } else {
          this.searchForm[1].value = this.chartsDataParams.opType;
        }
        this.strategy = this.chartsDataParams.strategy;// 指标策略
      } else {
        let today = new Date();
        let startDay = this.dateToString(today);
        let endDay = this.dateToString(new Date()).substr(0, 10);
        this.provinceId = ''; // 省份
        this.cityName = ''; // 省份
        this.searchForm[0].value = [startDay, endDay];
        this.dates = [startDay, endDay];
        this.searchForm[1].value = '-1';// 交易类型
        this.strategy = 1000;// 指标策略
      }
      this.changeProvinceFun();
    },
    // 更改省份
    changeProvinceFun (type) {
      let copyCityData = JSON.parse(JSON.stringify(this.cityData));
      let cityItems = copyCityData.find(item => item.value.indexOf(this.provinceId) > 0);
      this.cityArr = cityItems ? cityItems.children : [];
      this.cityArr.unshift({
        label: '全部',
        value: ''
      });
      this.cityId = '';
      if (this.cityName) {
        this.cityId = this.cityName;
        this.cityName = '';
      }
      if (type) {
        this.search();
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
              isAmount: item.isAmount,
              identifier: item.identifier
            });
          });
          if (this.tradeTypeItems.length) {
            this.tradeTypeItems.unshift({ text: '全部交易类型', value: '-1' });
          }
          this.searchForm[1].options = this.tradeTypeItems;
        }
      }
    },
    // 切换城市
    changeCityFun () {
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
          value: '-1',
          type: 'select',
          options: this.tradeTypeItems
        }
      ];

      this.refreshChart = true;
      let today = new Date();
      this.searchForm[0].value = [today, today];
      this.dates = [today, today];
      this.doSearch();
    },
    // 点击查询
    search ($event) {
      this.pageNum = 1;
      this.refreshChart = true;
      this.optionParamBarTriggerNumber = loadingOption;// 日趋势图
      this.headers = [];
      this.desserts = [];
      this.totalItems = 0;
      this.queryPageLength = 1;
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
          city: this.cityId,
          strategy: this.strategy, // 策略
          pageIndex: this.pageNum,
          pageSize: this.perPageNum
        });
        this.getRiskTrendData(params);
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
            appId: this.appId, //
            province: this.provinceId, // 省份
            city: this.cityId,
            strategy: this.strategy, // 策略
            pageIndex: this.pageNum,
            pageSize: this.perPageNum
          });
          this.optionParamBarTriggerNumber = loadingOption;// 日趋势图
          this.getRiskTrendData(params);
        });
      }
    },
    // 获取处置策略列表
    async getDownBox () {
      this.typeItem = [];
      const response = await dataService.getDownBox();
      if (response.data.code === 200) {
        this.typeItem = response.data.data;
      }
    },
    clickEventBarTop (i) {
      let keys = [];
      if (i.seriesId === '1000') { // 风险事件总数
        this.headers.forEach(item => {
          if (item.value !== '1000' && item.value !== '800' && item.value !== '0' && item.value !== '-1' && item.value !== 'riskDay') {
            keys.push(item.value);
          }
        });
      } else if (i.seriesId === '800') {
        this.headers.forEach(item => {
          if (item.value !== '1000' && item.value !== '800' && item.value !== '0' && item.value !== '80' && item.value !== '100' && item.value !== '-1' && item.value !== 'riskDay') {
            keys.push(item.value);
          }
        });
      } else if (i.seriesId === '-1') {
        this.headers.forEach(item => {
          if (item.value !== '1000' && item.value !== '800' && item.value !== '-1' && item.value !== 'riskDay') {
            keys.push(item.value);
          }
        });
      } else {
        keys.push(i.seriesId);
      }
      let tradeTypes = this.tradeTypeItems.find(val => this.searchForm[1].value === val.value);
      let datesStr = this.searchForm[0].value;// 获取时间
      let params = {
        province: this.provinceId, // 城市名称
        city: this.cityId, // 城市名称
        isAmount: tradeTypes.isAmount ? tradeTypes.isAmount : 1, //  1代表动账日志，0代表非动账日志
        paramsAry: [{
          enName: 'strategy', // 指标策略//数组
          value: keys,
          searchType: 'autocomplete'
        }, {
          enName: 'create_time',
          value: [i.name, i.name],
          searchType: 'Date'
        }, {
          enName: 'op_type',
          value: tradeTypes.identifier ? tradeTypes.identifier : 'all',
          searchType: 'select'
        }, {
          enName: 'city', // 必传：城市
          value: this.cityId,
          searchType: 'select'
        }, {
          enName: 'province', // 必传：省会
          value: this.provinceId,
          searchType: 'select'
        }]
      };
      this.$router.push({
        name: 'riskControlLog',
        params: params
      });
    },
    // 列表信息的某一条数据的点击事件
    async tableClick (item, i) {
      let keys = [];
      if (i.value === '1000') { // 风险事件总数
        for (const key in item) {
          if (key !== '1000' && key !== '800' && key !== '0' && key !== '-1' && key !== 'riskDay') {
            keys.push(key);
          }
        }
      } else if (i.value === '800') {
        for (const key in item) {
          if (key !== '1000' && key !== '800' && key !== '0' && key !== '80' && key !== '100' && key !== '-1' && key !== 'riskDay') {
            keys.push(key);
          }
        }
      } else if (i.value === '-1') {
        for (const key in item) {
          if (key !== '1000' && key !== '800' && key !== '-1' && key !== 'riskDay') {
            keys.push(key);
          }
        }
      } else {
        keys.push(i.value);
      }
      let isAmount = ''; // 下钻页面是动账或非动账，0：非动账，1：动账
      let opTypeId = ''; // 下钻页面的搜索条件需要回显 交易类型 的id
      if (this.searchForm[1].value !== '-1') {
        this.tradeTypeItems.forEach((im, ix, ay) => {
          if (this.searchForm[1].value === im.value) {
            isAmount = Number(im.isAmount);
            opTypeId = im.identifier;
          }
        });
      } else {
        isAmount = 1;
        opTypeId = 'all';
      }
      // let datesStr = this.searchForm[0].value;// 获取时间
      let params = {
        province: this.provinceId, // 城市名称
        city: this.cityId, // 城市名称
        isAmount: isAmount,
        paramsAry: [{
          enName: 'strategy', // 指标策略//数组
          value: keys,
          searchType: 'autocomplete'
        }, {
          enName: 'create_time',
          value: [item.riskDay, item.riskDay],
          searchType: 'Date'
        }, {
          enName: 'op_type',
          value: opTypeId,
          searchType: 'select'
        }, {
          enName: 'city', // 必传：城市
          value: this.cityId,
          searchType: 'select'
        }, {
          enName: 'province', // 必传：省会
          value: this.provinceId,
          searchType: 'select'
        }]
      };
      this.$router.push({
        name: 'riskControlLog',
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
    // 获取风险地区详情数据
    async getRiskTrendData (params) {
      if (this.appId) {
        this.loading = true;
        params.opType = params.opType ? params.opType : '-1';
        const res = await dataService.getRiskTrendData(params);
        if (res.data.code === 200) {
          this.allData = res.data.data;
          if (this.refreshChart) { // 刷新饼图和柱图
            this.allData.histogramArray.forEach((item, index) => {
              item.type = 'line';
              // item.stack = '总量';// 代表是否交错。加此属性则会交错，并会累加每一项的值；不加此属性则不会累加
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
              this.optionParamBarTriggerNumber = this.allData.histogramArray.length ? Object.assign({}, {
                width: '100%',
                height: this.defaultHeight,
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
                  bottom: '0',
                  data: this.allData.histogramData
                },
                // toolbox: {
                //   feature: {
                //     saveAsImage: {}
                //   }
                // },
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
                series: this.allData.histogramArray
              }) : noneDataOption;
              if (this.chartsDataParams && this.chartsDataParams.title) {
                // 跳转过来显示的图例
                let obja = {};
                this.allData.histogramData.forEach((item, index) => {
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
          this.headers = this.allData.titleList;
          this.desserts = this.allData.listPage;
        }
        this.loading = false;
      }
    },
    // 获取城市
    async getCityData () {
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

.table-box {
  >>> .v-data-table__wrapper {
    min-height: 400px;
  }
}

.hand-signals {
  cursor: pointer;
}
</style>
