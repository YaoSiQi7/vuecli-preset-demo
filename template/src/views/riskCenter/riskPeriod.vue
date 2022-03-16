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
      <v-col cols="12" class="pr-3 py-0 pr">
        <v-hover v-slot="{ hover }">
          <div style="position: relative">
            <div class="location-text">
              <span>风险时段分布</span>
            </div>
            <echart-export-file
              :chartId="'riskPeriodId'"
              :hover="hover"
              :fileName="appName + '-风险时段分布'"
              :isActive="isActiveBtnRiskPeriodEchart"
              @exportExcel="
                exportData(
                  arguments,
                  'excel',
                  'histogram',
                  'isActiveBtnRiskPeriodEchart'
                )
              "
              @exportCSV="
                exportData(
                  arguments,
                  'csv',
                  'histogram',
                  'isActiveBtnRiskPeriodEchart'
                )
              "
              style="position: absolute; right: 20px; top: 8px; z-index: 4"
              v-if="hasPermission(exportRiskPeriodDistributeEchartBtn)"
            ></echart-export-file>
            <div>
              <base-echarts
                :chartId="'riskPeriodId'"
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
                  风险时段
                </v-toolbar-title>
              </v-toolbar>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="appName + '-风险时段'"
                :isActive="isActiveBtnRiskPeriodList"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'list',
                    'isActiveBtnRiskPeriodList'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'list',
                    'isActiveBtnRiskPeriodList'
                  )
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="hasPermission(exportRiskPeriodListBtn)"
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
                <span v-if="i.value === 'risk_day'">{{
                  item[i.value] | textFilters(riskHourList)
                }}</span>
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
      dates: [], // 时间
      defaultHeight: '500px',
      loading: false,
      // 时段
      riskHourList: [{
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
      // 指标下拉框
      mapTypeValue: '',
      // 风险时段分布
      optionParamBarTriggerNumber: loadingOption,
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
      exportBtn: '/exportRiskPeriodButton', // 导出权限
      exportRiskPeriodDistributeEchartBtn: '/exportRiskPeriodDistributeEchartButton', // 导出风险时段分布柱状图
      exportRiskPeriodListBtn: '/exportRiskPeriodListButton', // 导出风险时段列表
      isActiveBtnRiskPeriodEchart: true, // 导出按钮是否可以点击
      isActiveBtnRiskPeriodList: true
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
  filters: {
    textFilters: function (str, itemList) {
      let textObj = itemList.find(item => str.toString() === item.value);
      return textObj.text;
    }
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        this.getTradeTypeList(); // 交易类型
      },
      immediate: true
    }
  },
  mounted () {
    let today = new Date();
    let startDay = this.dateToString(today);
    let endDay = this.dateToString(new Date()).substr(0, 10);
    this.searchForm[0].value = [startDay, endDay];
    this.getTradeTypeList(); // 交易类型
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
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportRiskPeriod(params).then(res => {
        let blob = new Blob([res.data]);
        downloadFile(blob, fileName);
        this[isActiveBtn] = !this[isActiveBtn];
      }).catch(() => {
        this[isActiveBtn] = !this[isActiveBtn];
      });
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
          this.search();
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
        if (typeof ($event[0].value[0]) === 'object') {
          $event[0].value[0] = this.dateToString($event[0].value[0]);
        }
        if (typeof ($event[0].value[1]) === 'object') {
          $event[0].value[1] = this.dateToString($event[0].value[1]);
        }
        params = Object.assign({}, {
          startTime: $event[0].value[0],
          endTime: $event[0].value[1],
          optype: $event[1].value,
          appId: this.appId,
          page: this.pageNum,
          pageSize: this.perPageNum
        });
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
            optype: this.searchForm[1].value,
            appId: this.appId,
            page: this.pageNum,
            pageSize: this.perPageNum
          });
          this.queryRiskData(params);
        });
      }
    },
    // 城市排名TOP10
    clickEventBarTop (data) {
      let riskHourObj = this.riskHourList.find(val => data.name === val.text);
      let detailParams = {
        startTime: this.searchForm[0].value[0], // 开始时间
        endTime: this.searchForm[0].value[1], // 结束时间
        opType: this.searchForm[1].value, // 交易类型
        appId: this.appId, // 应用id
        title: data.seriesName, // 策略指标中文
        strategy: data.value, // 策略指标变量名
        riskHour: riskHourObj.value // 时间段
      };
      // sessionStorage.setItem('riskAreasDetailParams', JSON.stringify(detailParams));
      // this.$router.push('/riskPeriodDetail');
      this.$router.push({
        name: 'riskPeriodDetail',
        params: detailParams
      });
    },
    // 列表信息的某一条数据的点击事件
    async tableClick (item, title) {
      let params = {
        startTime: this.searchForm[0].value[0], // 开始时间
        endTime: this.searchForm[0].value[1], // 结束时间
        opType: this.searchForm[1].value, // 交易类型
        appId: this.appId, // 应用id
        title: title.text, // 策略指标中文
        strategy: title.value, // 策略指标变量名
        riskHour: item.risk_day // 时间段
      };
      // sessionStorage.setItem('riskAreasDetailParams', JSON.stringify(params));
      // this.$router.push('/riskPeriodDetail');
      this.$router.push({
        name: 'riskPeriodDetail',
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
        let opTypeObj = this.tradeTypeItems.find(item => item.value === params.optype);
        params.optype = opTypeObj.identifier ? opTypeObj.identifier : '-1';
        const res = await dataService.queryRiskTime(params);
        if (res.data.code === 200) {
          this.allData = res.data.data;
          let xData = this.allData.datas.xData;
          if (this.refreshChart) { // 刷新饼图和柱图
            xData.forEach((item, index) => {
              let aa = this.riskHourList.find(val => item === val.value);
              xData[index] = aa.text;
            });
            let legends = [];
            this.allData.datas.yData.forEach((item, index) => {
              legends.push(item.name);
              item.type = 'bar';
              // item.stack = '总量';
              // item.label = { //去掉柱状图上显示的数字
              //   show: true,
              //   position: 'insideRight'
              // };
            });
            this.$nextTick(() => {
              // 风险地区---全国----柱图
              this.optionParamBarTriggerNumber = this.allData.datas.xData.length ? Object.assign({}, {
                width: '100%',
                height: this.defaultHeight,
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '8%',
                  containLabel: true
                },
                legend: {
                  bottom: '0',
                  left: 'center',
                  data: legends
                },
                xAxis: [
                  {
                    type: 'category',
                    data: xData,
                    axisTick: {
                      alignWithLabel: true
                    }
                    // axisLabel: {
                    //   interval: 0, // 坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
                    //   rotate: 0 // 调整数值改变倾斜的幅度（范围-90到90）
                    // }
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: this.allData.datas.yData
              }) : noneDataOption;
            });
          }
          this.totalItems = this.allData.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          this.allData.titleList.forEach(item => {
            item.sortable = false;
          });
          this.headers = this.allData.titleList;
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

.pr {
  position: relative;
}

// 当前省-城市
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

.hand-signals {
  cursor: pointer;
}
</style>
