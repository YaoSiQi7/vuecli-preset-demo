<!----------  @author: wangguodong  ----------->
<!----------  @updated_at: 2020-08-05  ----------->
<!----------  @version: wuxi-secondPhase  ----------->
<!---- 核查效率 ----->
<template>
  <div>
    <div class="top-bg mt-4">
      <!-- 查询 -->
      <v-row class="searchTempStyle">
        <v-col cols="10" style="backgroud-color: #fff;">
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
                id='data-picker'
                ></DatePicker>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="searchForm.auditGroup"
                  placeholder="全部公司/机构"
                  :items="auditGroupItems"
                  :key="newDate"
                  item-text="groupName"
                  item-value="groupId"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  class="pt-0 pb-0"
                  background-color="white"
                  @change="groupSelectChange(searchForm.auditGroup)"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="searchForm.auditPeople"
                  placeholder="核查人员"
                  :items="auditPeopleItems"
                  :key="newDate"
                  item-text="userName"
                  item-value="userId"
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
                  >重置</v-btn>
                  <v-btn
                    color="primary"
                    class="ml-4"
                    small
                    @click="searchBtn(1)"
                  >查询</v-btn>
                </div>
              </v-col>
            </v-row>
            <!-- <v-row>
              <v-col cols="12" class="mt-1">
                <span v-for="(item, index) in dateNumber" :key="index">
                  <v-btn
                    :color="active === index ? 'primary' : ''"
                    class="ml-4"
                    small
                    @click="changeDay(item.date, index)"
                  >{{ item.name }}</v-btn>
                </span>
              </v-col>
            </v-row> -->
          </v-form>
        </v-col>
        <v-col cols="2">
          <v-dialog v-model="isdateShow" width="321">
            <v-date-picker selected-items-text="已选择日期" v-model="searchForm.dates" range  @change="dateChange"></v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <!-- 图表 -->
      <v-row>
        <v-col cols='6' class="echartsStyle echartsPaddingRightStyle">
          <v-hover v-slot="{ hover }">
           <div style="position: relative;">
            <!-- <div class="tabStyle">
              <v-tabs
                style="padding:0;"
                v-model="tab"
              >
                <v-tab
                  v-for="(item,index) in pageTabs"
                  :key="index"
                  class="tabItemStyle"
                  @click="tabClick(item.text)"
                >
                  {{ item.text }}
                </v-tab>
              </v-tabs>
            </div> -->
                <echart-export-file
                  :chartId="'checkEfficiencyTaskTop'"
                  :isActive="isActiveBtnNumberTop"
                  :hover="hover"
                  :fileName="appName + '-总任务数量TOP5'"
                  v-if="hasPermission('/checkEfficiencyNumberTopExportBtn')"
                  style="position: absolute; right: 20px; top:8px; z-index: 4"
                  @exportExcel="exportData(arguments, 'taskNumber', 'excel')"
                  @exportCSV="exportData(arguments, 'taskNumber', 'csv')"
                ></echart-export-file>
                <base-echarts :chartId="'checkEfficiencyTaskTop'" :optionParam="taskNumberTop" @clickEvent="verificationSheetClick()"></base-echarts>
                <!-- <div v-else class="noDataEchartsTextBox">
                  <h2 class="noDataEchartsTitleText">总任务数量TOP5</h2>
                  <h3 class="noDataEchartsText">
                    {{ noDataEchartsText }}
                  </h3>
              </div> -->
            </div>
          </v-hover>
        </v-col>
        <v-col cols='6' class="echartsStyle echartsPaddingRightStyle">
          <v-hover v-slot="{ hover }">
            <div style="position: relative">
              <echart-export-file
                :chartId="'checkEfficiencyProcessedTop'"
                :isActive="isActiveBtnSheet"
                :hover="hover"
                v-if="hasPermission('/checkEfficiencySheetExportBtn')"
                :fileName="appName + '-已处理任务数量TOP5'"
                style="position: absolute; right: 20px; top:8px; z-index: 4"
                @exportExcel="exportData(arguments, 'efficiencyTop', 'excel')"
                @exportCSV="exportData(arguments, 'efficiencyTop', 'csv')"
              ></echart-export-file>
              <base-echarts :chartId="'checkEfficiencyProcessedTop'" :optionParam="efficiencyTop" @clickEvent="verificationResultsClick()"></base-echarts>
              <!-- <div v-else class="noDataEchartsTextBox">
                <h2 class="noDataEchartsTitleText">已处理任务数量TOP5</h2>
                <h3 class="noDataEchartsText">
                  {{ noDataEchartsText }}
                </h3>
              </div> -->
            </div>
          </v-hover>
        </v-col>
      </v-row>
    </div>
    <!-- 表格 -->
    <h3 class="dataDetail">
      数据明细
      <echart-export-file
        :isEchart="false"
        :isActive="isActiveBtnList"
        :chartId="'verificationSheet'"
        :fileName="appName + '-核查效率数据明细'"
        style="display:inline;float:right;margin-top:-2px;"
        v-if="hasPermission('/checkEffciencyListExportBtn')"
        class="ml-4"
        @exportExcel="exportData(arguments, 'list', 'excel')"
        @exportCSV="exportData(arguments, 'list', 'csv')"
      ></echart-export-file>
    </h3>
    <div class="top-bg">
      <v-data-table
        :headers="headers"
        :items="desserts"
        :items-per-page="perPageNum"
        no-results-text="没有匹配的数据"
        no-data-text="没有匹配的数据"
        :search="tabelSearch"
        hide-default-footer
        class="elevation-1"
        style="font-size: 12px;"
      >
        <!-- <template v-slot:top>
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
              <v-col md="2" class="pr-0">
                <v-card-title style="float: right;padding: 0;">
                  <v-btn color="primary" @click="searchRisk()">规则搜索</v-btn>
                </v-card-title>
              </v-col>
            </v-row>
          </v-toolbar>
        </template> -->
        <template v-slot:item.confirmcaseCount="{ item }">
          <span style="cursor: pointer;" @click="tableClick(item)" dark>{{ item.dclNum }}</span>
        </template>
        <template v-slot:item.confirmRadio="{ item }">
          <span style="cursor: pointer;" @click="tableClick(item)" dark>{{ item.yclNum }}</span>
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
import { getData, getAllUsersList, getAllGroupAllUsersList, exportZRWSLTop5, exportLYCLRWSLTop5, exportSJMX } from 'api/checkEfficiency.js';
import {
  getGroupList
} from '../../api/caseTeam.js'; // 审核组与审核人员接口
import { mapGetters, mapActions } from 'vuex';
import BaseEcharts from '@c/BaseEcharts';
import EchartExportFile from '@c/EchartExportFile';
import { DatePicker } from 'view-design';
import { downloadFile } from '@/utils/downloadFile';
import moment from 'moment';
export default {
  name: 'riskMarket',
  components: {
    BaseEcharts,
    EchartExportFile,
    DatePicker
  },
  filters: {},
  data: () => ({
    // tab切换
    tab: null,
    pageTabs: [
      {
        text: '总任务数量'
      },
      {
        text: '已处理任务数量'
      }
    ],
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
    // 定义定时器
    isdateShow: false,
    searchValid: true,
    searchForm: {
      auditGroup: '',
      auditPeople: '',
      dateTime: '',
      dates: []
    },
    groupIdent: '', // 区分审核组，first：初审，second：复审
    groupId: '',
    dateEnd: null,
    newDate: null,
    auditGroupItems: [],
    auditPeopleItems: [],
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
    // taskNumberShow: false,
    // efficiencyTopShow: false,
    noDataEchartsText: '暂无数据',
    // 总任务数量TOP5
    taskNumberTop: {
      width: '500px',
      height: '500px',
      title: [{
        text: '总任务数量TOP5',
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
    // 已处理任务数量TOP5
    efficiencyTop: {
      width: '500px',
      height: '500px',
      title: [{
        text: '已处理任务数量TOP5',
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
        text: '姓名',
        align: 'start',
        sortable: false,
        value: 'userName',
        width: '100px'
      },
      { text: '公司/机构', value: 'groupName', sortable: false, width: '100px' },
      { text: '角色', value: 'roleName', sortable: false, width: '100px' },
      { text: '任务总数', value: 'allCount', sortable: false, width: '140px' },
      { text: '待处理数量', value: 'dclNum', sortable: false, width: '140px' },
      { text: '已处理数量', value: 'yclNum', sortable: false, width: '140px' },
      { text: '处理率', value: 'treatmentRate', sortable: false, width: '120px' },
      { text: '件均处理时长(小时)', value: 'averageOneRate', sortable: false, width: '200px' },
      { text: '日均处理任务数', value: 'averageDayRate', sortable: false, width: '200px' }
    ],
    desserts: [],
    search: '',
    tabelSearch: '',
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
    isActiveBtnList: true,
    isActiveBtnSheet: true,
    isActiveBtnNumberTop: true
  }),
  computed: {
    ...mapGetters([
      'appId',
      'appName'
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
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        Promise.all([
          this.searchData(),
          this.allGroup(),
          this.searchBtn(1)
        ]);
      },
      immediate: true
    }
  },
  created () {
    // this.initWebSocket();
  },
  mounted () {
    Promise.all([
      // this.searchData(),
      // this.allGroup(),
      // this.searchBtn()
    ]);
    // this.appName = JSON.parse(sessionStorage.getItem('appName')).appName;
  },
  beforeDestroy () {},
  methods: {
    // 查询列表
    async getDataList () {
      // let pageParams = {
      //   appId: this.appId,
      //   page: this.pageNum,
      //   size: this.perPageNum
      // };
      // let searchParam = JSON.parse(JSON.stringify(this.searchData));
      // let params = Object.assign({}, pageParams, searchParam);
      // const res = await getData(params);
      // if (res.data.code === 200) {
      //   this.caseReportData = res.data.data.list;
      //   this.totalItems = res.data.data.total;
      //   this.queryPageLength = res.data.data.totalPages;
      //   this.loading = false;
      // }
    },
    searchData () {
      var today = new Date();
      today.setTime(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      this.dateStart = this.dateToString(today);
      this.dateEnd = this.dateToString(new Date());
      this.searchForm.dates = [this.dateEnd, this.dateEnd];
    },
    // change时间
    changeDay (daysOfNumber) {
      // this.active = index;
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
    // 日期转字符串
    dateToString (date) {
      date = new Date(date);
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
    // 翻转数组
    reverseArry (array) {
      for (var i = 0; i < array.length / 2; i++) {
        var temp = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - 1 - i] = temp;
      }
      return array; // Array对象中的方法返回了一个数组。
    },
    // 总任务数量TOP5
    verificationSheetClick () {},
    // 已处理任务数量TOP5
    verificationResultsClick () {},
    // 图表的切换
    tabClick (data) {
      if (data === '总任务数量') {
        this.$nextTick(() => {
          this.taskNumberTop = {
            width: '500px',
            height: '500px',
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            title: {
              text: '总任务数量TOP5',
              subtext: '',
              left: 0
            },
            grid: {
              left: 0,
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'value',
                boundaryGap: [0, 0.01]
                // type: 'value',
                // data: ['巴西', '印尼', '美国', '印度', '中国', '火星'],
                // // data: [],
                // axisTick: {
                //   alignWithLabel: true
                // }
              }
            ],
            yAxis: [
              {
                type: 'category',
                data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
              }
            ],
            series: [
              {
                name: '',
                type: 'bar',
                barWidth: '60%',
                // data: []
                data: [103, 52, 200, 334, 390, 330, 220]
              }
            ]
          };
        });
      } else {
        this.$nextTick(() => {
          this.taskNumberTop = {
            width: '500px',
            height: '500px',
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            title: {
              text: '总任务数量TOP5',
              subtext: '',
              left: 0
            },
            grid: {
              left: 0,
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'value',
                boundaryGap: [0, 0.01]
                // type: 'value',
                // data: ['巴西', '印尼', '美国', '印度', '中国', '火星'],
                // // data: [],
                // axisTick: {
                //   alignWithLabel: true
                // }
              }
            ],
            yAxis: [
              {
                type: 'category',
                data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
              }
            ],
            series: [
              {
                name: '',
                type: 'bar',
                barWidth: '60%',
                // data: []
                data: [300, 52, 200, 334, 390, 330, 220]
              }
            ]
          };
        });
      }
    },
    reset () {
      this.pageNum = 1;
      this.searchForm.dateTime = this.dateTimeItems[0].value;
      this.searchForm.auditGroup = this.auditGroupItems[0].id;
      this.searchForm.auditPeople = this.auditPeopleItems[0].userId;
      this.changeDay(0);
      this.searchBtn(1);
    },
    // 全部核查组
    allGroup () {
      let params = {
        groupIdent: 'first'
      };
      getGroupList(params).then(res => {
        this.auditGroupItems = res.data.data.groupList;
        let pm = {
          groupIdent: 'second'
        };
        getGroupList(pm).then(ress => {
          this.auditGroupItems = this.auditGroupItems.concat(ress.data.data.groupList);
          if (this.auditGroupItems.length > 0) {
            this.auditGroupItems.unshift({
              groupId: '',
              groupName: '全部公司/机构'
            });
            this.getAllUsersList();
          }
        });
      });
    },
    // 查询审核人员
    getAllUsersList () {
      let parms = {
        groupId: this.groupId
      };
      if (this.groupId) { // 单个组下的所有的审核人员
        getAllUsersList(parms).then(res => {
          this.auditPeopleItems = res.data.data.groupUserList;
          if (this.auditPeopleItems.length > 0) {
            this.auditPeopleItems.unshift({
              userId: '',
              userName: '全部审核人员'
            });
          }
        });
      } else { // 所有组下的所有审核人员
        getAllGroupAllUsersList().then(res => {
          this.auditPeopleItems = res.data.data.groupList;
          if (this.auditPeopleItems.length > 0) {
            this.auditPeopleItems.unshift({
              userId: '',
              userName: '全部审核人员'
            });
          }
        });
      }
    },
    // 审核组change
    groupSelectChange (value) {
      /* this.auditGroupItems.forEach((item, index, ary) => {
        if (item.id === value) {
          this.groupIdent = item.groupIdent;
        }
      }); */
      this.groupId = value;
      this.getAllUsersList();
    },
    // 搜索按钮
    async searchBtn (pageNum) {
      let pageParams = {
        appId: this.appId,
        auditTeam: this.searchForm.auditGroup,
        userId: this.searchForm.auditPeople,
        startTime: this.dateToString(this.searchForm.dates[0]) + ' 00:00:00',
        endTime: this.dateToString(this.searchForm.dates[1]) + ' 23:59:59',
        page: pageNum,
        pageSize: this.perPageNum
      };
      this.pageNum = pageNum;
      const res = await getData(pageParams);
      if (res.data.code === 200) {
        this.desserts = res.data.data.verList;
        this.totalItems = res.data.data.total;
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
        this.$nextTick(() => {
          let taskNumberTopAry = [...new Set(res.data.data.zsChart.data.data)];
          if (taskNumberTopAry.length > 1 || (taskNumberTopAry.length === 1 && taskNumberTopAry[0] !== 0)) {
            // this.taskNumberShow = true;
            this.taskNumberTop = {
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
                },
                formatter: '{b} <br/>总任务数量： {c}'
              },

              title: {
                text: '总任务数量TOP5',
                subtext: '',
                left: 0
              },
              grid: {
                left: 0,
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'value',
                  boundaryGap: [0, 0.01]
                  // type: 'value',
                  // data: ['巴西', '印尼', '美国', '印度', '中国', '火星'],
                  // // data: [],
                  // axisTick: {
                  //   alignWithLabel: true
                  // }
                }
              ],
              yAxis: [
                {
                  type: 'category',
                  data: res.data.data.zsChart.dataName
                  // data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
                }
              ],
              series: res.data.data.zsChart.data
            };
          } else {
            this.taskNumberTop = {
              width: '500px',
              height: '500px',
              title: [{
                text: '总任务数量TOP5',
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
          // 已处理任务数量TOP5
          let efficiencyTopAry = [...new Set(res.data.data.yclChart.data.data)];
          if (efficiencyTopAry.length > 1 || (efficiencyTopAry.length === 1 && efficiencyTopAry[0] !== 0)) {
            // this.efficiencyTopShow = true;
            this.efficiencyTop = {
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
                },
                formatter: '{b} <br/>已处理任务数量： {c}'
              },
              title: {
                text: '已处理任务数量TOP5',
                subtext: '',
                left: 0
              },
              grid: {
                left: 0,
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'value',
                  boundaryGap: [0, 0.01]
                  // type: 'value',
                  // data: ['巴西', '印尼', '美国', '印度', '中国', '火星'],
                  // // data: [],
                  // axisTick: {
                  //   alignWithLabel: true
                  // }
                }
              ],
              yAxis: [
                {
                  type: 'category',
                  data: res.data.data.yclChart.dataName
                }
              ],
              series: res.data.data.yclChart.data
            };
          } else {
            this.efficiencyTop = {
              width: '500px',
              height: '500px',
              title: [{
                text: '已处理任务数量TOP5',
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
      }
    },
    async searchRisk () {
      /* let params = {
        pageIndex: this.pageNum,
        pageSize: this.perPageNum,
        appId: this.appId,
        opTypeId: this.searchForm.transactionType,
        ruleName: this.tabelSearch,
        startTime: this.searchForm.dates.length === 2 ? (this.searchForm.dates[0]) : '',
        endTime: this.searchForm.dates.length === 2 ? (this.searchForm.dates[1]) : ''
      };
      try {
        const res = await riskDetailStatistics.queryAllList(params);
        if (res.data.code === 200) {
          this.allData = res.data.data;
          this.resTradeTypeItems.forEach((item, index, ary) => {
            if (this.searchForm.transactionType === item.tradeId) {
              this.scenesId = item.id;
              this.transactionTypeText = item.tradeName;
            }
          });
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
      } */
    },
    // 列表信息的某一条数据的点击事件
    async tableClick (item) {
      // this.baseBlank(item.ruleNo);
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this.searchBtn(this.pageNum);
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.searchBtn(this.pageNum);
    },
    // echarts图表的导出excel
    async exportData (fileName, name, type) {
      let params = {
        appId: this.appId,
        auditTeam: this.searchForm.auditGroup,
        userId: this.searchForm.auditPeople,
        startTime: this.dateToString(this.searchForm.dates[0]) + ' 00:00:00',
        endTime: this.dateToString(this.searchForm.dates[1]) + ' 23:59:59',
        exportType: type
      };
      if (name === 'taskNumber') {
        this.isActiveBtnNumberTop = false;
        exportZRWSLTop5(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnNumberTop = true;
        }).catch(() => {
          this.isActiveBtnNumberTop = true;
        });
      } else if (name === 'efficiencyTop') {
        this.isActiveBtnSheet = false;
        exportLYCLRWSLTop5(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnSheet = true;
        }).catch(() => {
          this.isActiveBtnSheet = true;
        });
      } else if (name === 'list') {
        this.isActiveBtnList = false;
        exportSJMX(params).then(res => {
          let blob = new Blob([res.data]);
          downloadFile(blob, fileName[0]);
          this.isActiveBtnList = true;
        }).catch(() => {
          this.isActiveBtnList = true;
        });
      }
    },
    // 跳转到详情页面
    async baseBlank (ruleNo) {
      /* let params = {
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
      } */
    }
  }
};
</script>
<style lang="stylus" scoped>
>>> .v-data-table > .v-data-table__wrapper > table > tbody > tr > td{
  font-size: 12px;
  color: #3a3a3a;
}
.tabStyle {
  position: absolute;
  z-index: 1;
  left: 50%;
  width: 247px;
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
  // background-color: #fff;
}
.searchTempStyle {
  margin: 0;
  background-color: #fff;
}
// .top-bg {
//   margin-top: -12px;
//   background-image: url("../../../static/img/risk_market_top_bg.jpg");
//   background-repeat: no-repeat;
//   background-position: right center;
//   background-size: auto 168%;
// }
.v-card--material__heading {
  position: relative;
  top: -40px;
  -webkit-transition: .3s ease;
  transition: .3s ease;
  z-index: 1;
}
.textEllipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}
.tabItemStyle {
  color: #000;
  font-weight: both;
  // background-color: #ccc;
}
.dataDetail {
  margin: 2px 0 12px 0;
  padding: 0 10px;
  height: 40px;
  line-height: 40px;
  width: 100%;
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
//时间选择器 输入框高度
  #data-picker /deep/ .ivu-input{
    height:40px
  }
</style>
