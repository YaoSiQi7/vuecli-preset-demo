<!----------  @author: wangguodong  ----------->
<!----------  @updated_at: 2020-10-11  ----------->
<!----------  @version: 1.2.0  ----------->
<template>
  <!-- 风险标签 -->
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
        <!-- 场景标签分布 -->
        <v-col cols="6">
          <v-hover v-slot="{ hover }">
            <div style="position: relative; height: 532px">
              <div class="scene_echarts">
                <span class="scene_echarts_title">风险标签分布情况</span>
              </div>
              <echart-export-file
                :chartId="'pie'"
                :hover="hover"
                :fileName="appName + '-风险标签分布情况'"
                :isActive="isActiveBtnRiskLabelDistribute"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'pie',
                    ' isActiveBtnRiskLabelDistribute'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'pie',
                    ' isActiveBtnRiskLabelDistribute'
                  )
                "
                style="position: absolute; right: 20px; top: 8px; z-index: 4"
                v-if="hasPermission(exportRiskLabelDistributeBtn)"
              ></echart-export-file>
              <div>
                <base-echarts
                  :chartId="'pie'"
                  :optionParam="optionParamPieTriggerNumber"
                  @clickEvent="clickEventBarTop"
                ></base-echarts>
              </div>
              <!-- <div v-if="!pieGrossShow && !loading" class="no-data-box">
                暂无数据
              </div>
              <div v-if="loading" class="no-data-box">加载中</div> -->
            </div>
          </v-hover>
        </v-col>
        <!-- 风险标签分布情况 -->
        <v-col cols="6">
          <v-hover v-slot="{ hover }">
            <div style="position: relative; height: 532px">
              <div class="scene_echarts">
                <span class="scene_echarts_title">场景标签分布</span>
              </div>
              <echart-export-file
                :chartId="'bar'"
                :hover="hover"
                :fileName="appName + '-场景标签分布'"
                :isActive="isActiveBtnSceneLabelDistribute"
                @exportExcel="
                  exportData(
                    arguments,
                    'excel',
                    'histogram',
                    'isActiveBtnSceneLabelDistribute'
                  )
                "
                @exportCSV="
                  exportData(
                    arguments,
                    'csv',
                    'histogram',
                    'isActiveBtnSceneLabelDistribute'
                  )
                "
                style="position: absolute; right: 20px; top: 8px; z-index: 4"
                v-if="hasPermission(exportSceneLabelDistributeBtn)"
              ></echart-export-file>
              <div>
                <base-echarts
                  :chartId="'bar'"
                  :optionParam="optionParamBarTriggerNumber"
                  @clickEvent="clickEventPieTop"
                ></base-echarts>
              </div>
              <!-- <div v-if="!barShow && !loading" class="no-data-box">
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
          :search="tabelSearch"
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
                  标签
                </v-toolbar-title>
              </v-toolbar>
              <echart-export-file
                :hover="hover"
                :isEchart="false"
                :fileName="appName + '-标签列表'"
                :isActive="isActiveBtnLabelList"
                @exportExcel="
                  exportData(arguments, 'excel', 'list', 'isActiveBtnLabelList')
                "
                @exportCSV="
                  exportData(arguments, 'csv', 'list', 'isActiveBtnLabelList')
                "
                style="position: absolute; top: 8px; right: 16px; z-index: 4"
                v-if="hasPermission(exportLabelListBtn)"
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
              <td v-for="(i, x) of headers" :key="x">
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
import * as dataService from 'api/riskMarket.js';
import * as riskLabelData from 'api/riskLabel.js';
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
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 查询条件相关
      dateStart: null,
      dateEnd: null,
      isdateShow: false,
      searchValid: true,
      searchForm11: [
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
      pieGross: 0, // 饼图总数量
      pieGrossShow: 0, // 饼图总数量
      barShow: false, // true: 展示柱图，false：不展示
      // 场景标签分布
      optionParamBarTriggerNumber: {
        width: '85%',
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
      // 风险标签分布情况
      optionParamPieTriggerNumber: {
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
      headers: [],
      desserts: [],
      sserts: [],
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
      // 按钮权限
      exportBtn: '/exportRiskLabelButton', // 导出权限
      exportRiskLabelDistributeBtn: '/exportRiskLabelDistributeButton', // 导出风险标签分布情况
      exportSceneLabelDistributeBtn: '/exportSceneLabelDistributeButton', // 导出场景标签分布
      exportLabelListBtn: '/exportLabelListButton', // 导出标签列表
      isActiveBtnRiskLabelDistribute: true, // 导出按钮是否可以点击
      isActiveBtnSceneLabelDistribute: true,
      isActiveBtnLabelList: true
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
        opType: (this.searchForm11[1].value === '' || this.searchForm11[1].value === undefined || this.searchForm11[1].value === '全部交易类型') ? -1 : this.searchForm11[1].value,
        fileType: fileType,
        exportObj: graphMark,
        startTime: moment(this.searchForm11[0].value[0]).format('YYYY-MM-DD'),
        endTime: moment(this.searchForm11[0].value[1]).format('YYYY-MM-DD')
      };
      this[isActiveBtn] = !this[isActiveBtn];
      dataService.exportrisklabel(params).then(res => {
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
        },
        {
          placeholder: '交易类型',
          value: '-1',
          type: 'select',
          options: this.tradeTypeItems
        }
      ];
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
          this.tradeTypeItems.unshift({ text: '全部交易类型', value: '-1' });
          this.searchTemp();
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
      let today = new Date();
      let startDay = today;
      let endDay = new Date();
      this.searchForm11[0].value = [startDay, endDay];
      this.search();
    },
    // 点击查询
    search ($event) {
      this.pageNum = 1;
      this.pieGross = 0;
      this.initGetData($event);
    },
    // 饼图-风险标签分布情况
    clickEventBarTop (data) {
      this.baseBlankToDetails('pie', data);
    },
    // 柱状图-场景标签分布
    clickEventPieTop (data) {
      this.baseBlankToDetails('bar', data);
    },
    // 公共的图表和列表下钻功能
    baseBlankToDetails (id, data) {
      let dateTime = this.searchForm11[0].value;
      let riskLabel = '';
      let params = {};
      // dateTime.forEach((im, index, ary) => {
      //   ary[index] = im.trim();
      // });
      // riskLabel
      if (id === 'pie') {
        riskLabel = data.name;
      } else if (id === 'tabel') {
        riskLabel = data.text;
      }
      // opType
      let opType = '';
      if (id === 'pie') {
        opType = this.searchForm11[1].value;
      } else if (id === 'tabel') {
        opType = data.opType;
      } else if (id === 'bar') {
        this.tradeTypeItems.forEach(item => {
          if (item.text === data.name) {
            opType = item.value;
          }
        });
      }
      params = {
        datesVal: dateTime, // 详情页--时间
        time: this.searchForm11[0].value,
        opType: opType, // 详情页--交易类型
        riskLabel: id === 'bar' ? 'all' : riskLabel
      };
      this.$router.push(
        {
          name: 'riskLabelDetail',
          params: params
        }
      );
    },
    // 列表信息的某一条数据的点击事件
    async tableClick (item, i, x) {
      if (x === 0) {
        return;
      }
      i.opType = item.opType;
      this.baseBlankToDetails('tabel', i);
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.initGetData();
    },
    // 页数
    pageChange () {
      this.pageNum = 1;
      this.initGetData();
    },
    async initGetData ($event) {
      let params = {};
      if ($event !== undefined) {
        params = Object.assign({}, {
          startTime: this.dateToString($event[0].value[0]),
          endTime: this.dateToString($event[0].value[1]),
          opType: $event[1].value,
          appId: this.appId,
          pageIndex: this.pageNum,
          pageSize: this.perPageNum
        });
        params.opType = params.opType ? params.opType : '-1';
        this.queryRiskData(params);
      } else {
        this.$nextTick(() => {
          let datesStr = this.searchForm11[0].value;
          params = Object.assign({}, {
            startTime: this.dateToString(datesStr[0]),
            endTime: this.dateToString(datesStr[1]),
            opType: this.searchForm11[1].value,
            appId: this.appId,
            pageIndex: this.pageNum,
            pageSize: this.perPageNum
          });
          params.opType = params.opType ? params.opType : '-1';
          this.queryRiskData(params);
        });
      }
    },
    // 调取查询接口
    async queryRiskData (params) {
      if (this.appId) {
        this.loading = true;
        this.optionParamPieTriggerNumber = {
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
        this.optionParamBarTriggerNumber = {
          width: '85%',
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
        const res = await riskLabelData.queryData(params);
        if (res.data.code === 200) {
          this.loading = false;
          let resData = res.data.data;
          let barSeries = resData.histogram;
          let barDataAry = [];
          let pieData = [];

          // 柱状图
          // barShow true:展示柱状图，false：不展示
          if (barSeries.length === 0 || resData.histogramTitle.length === 0 || resData.histogramY.length === 0) {
            this.barShow = false;
          } else {
            for (let i = 0; i < barSeries.length; i++) {
              barDataAry = barDataAry.concat(barSeries[i].data);
            };
            if (Array.from(new Set(barDataAry)).length === 1 && Array.from(new Set(barDataAry)).toString() === '0') {
              this.barShow = false;
            } else {
              this.barShow = true;
            }
          }
          this.$nextTick(() => {
            if (this.barShow) {
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
                width: '85%',
                height: '500px',
                tooltip: {
                  trigger: 'axis',
                  axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                title: {
                  text: '',
                  subtext: '',
                  left: 'left'
                },
                legend: {
                  data: resData.histogramTitle,
                  left: '0px',
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
                  data: resData.histogramY
                },
                series: barSeries
              };
            } else {
              // 渲染图表
              this.optionParamBarTriggerNumber = {
                width: '85%',
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
          });
          // 饼图
          // pieGrossShow true:展示柱状图，false：不展示
          if (resData.pieList.length !== 0) {
            // 总量每次置空
            this.pieGross = 0;
            // pieGross 大于0，才能展示饼图
            resData.pieList.forEach((item, index, ary) => {
              this.pieGrossShow = true;
              this.pieGross = this.pieGross + item.value;
            });
            if (this.pieGross) {
              this.pieGrossShow = true;
              resData.pieList.forEach((item, index, ary) => {
                pieData.push(item.name); // 拼饼图的标头名称
              });
            } else {
              this.pieGrossShow = false;
            }
          } else {
            this.pieGrossShow = false;
          }

          this.$nextTick(() => {
            // 渲染图表
            this.optionParamPieTriggerNumber = this.pieGrossShow ? {
              width: '90%',
              height: '500px',
              title: {
                text: this.pieGross,
                subtext: '总事件分布',
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
                // show: false,
                // orient: 'vertical',
                // left: 'left',
                left: '0px',
                bottom: '10px',
                data: pieData
              },
              series: [
                {
                  name: '标签',
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
                  data: resData.pieList
                }
              ]
            } : {
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
          });
          this.totalItems = resData.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          resData.titleList.forEach((item, index, ary) => {
            item.sortable = false;
            item.value = item.value.toString();
            if (item.value === 'opType') {
              ary.splice(index, 1);
            }
          });
          if (resData.titleList[1]) {
            resData.titleList[1].sortable = false;
          }
          this.headers = resData.titleList;
          this.desserts = resData.riskLabelPage;
        } else {
          this.loading = false;
        }
      }
    }
  }
};
</script>
<style scoped>
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
