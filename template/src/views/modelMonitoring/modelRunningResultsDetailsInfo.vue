<!----------  @author: wangguodong  ----------->
<!----------  @updated_at: 2020-08-05  ----------->
<!----------  @version: wuxi-secondPhase  ----------->

<template>
<!-- 模型运行结果详情页的详情卡片 -->
  <div>
    <!-- 保存取消 -->
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3',isFixed?'fixed':'']">
        <v-card-actions style="height:60px">
          <v-btn color="primary" class="ml-4" @click="backTopPage" outlined>返回</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <!-- 加入黑名單彈框 -->
    <v-row justify="center">
      <v-dialog
        style="overflow-x: hidden;"
        v-model="isShowBlackList"
        persistent
        scrollable
        max-width="500px"
      >
      <v-card>
        <v-card-title>
          <span class="ckxq_size">选择黑名单</span>
          <div class="flex-grow-1" />
          <v-btn icon dark @click="cancelCrudFormDialog()">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-form
          ref="addTemplaterAry"
          :lazy-validation="lazy"
          style="overflow-x: hidden;"
          v-model="valid"
          class="form"
        >
          <v-row>
            <v-col cols="2">
            </v-col>
            <v-col cols="8" sm="8">
              <v-select
                v-model="addTemplaterAry.appName"
                item-text="appName"
                item-value="id"
                :items="applyNameAry"
                :menu-props="{ bottom: true }"
                label="应用名称*"
                required
                :rules="[v => !!v || '应用名称不能为空']"
                outlined
                dense
                @change="appNameChange(addTemplaterAry.appName)"
                no-data-text="没有匹配数据"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
            </v-col>
            <v-col cols="8" sm="8">
              <v-select
                v-model="addTemplaterAry.blackName"
                item-text="listName"
                item-value="id"
                :items="blackNameAry"
                :menu-props="{ bottom: true }"
                label="黑名单集*"
                required
                :rules="[v => !!v || '黑名单集不能为空']"
                outlined
                dense
                no-data-text="没有匹配数据"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
            </v-col>
            <v-col cols="8" sm="8">
              <datetime-picker
                v-model="addTemplaterAry.oinvalidTime"
                time-format="HH:mm:ss"
                :type="dateTypeEnd"
                :valid-time="currentTime"
                @clear="addTemplaterAry.oinvalidTime=''"
                :text-field-props="textFieldProps"
                :date-picker-props="dateProps"
                :time-picker-props="timeProps"
                placeholder="不填写时，默认永久有效"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelCrudFormDialog">取消
            </v-btn>
            <v-btn class="primary mr-4" :disabled="!valid" @click="mistakeDialog()">确定</v-btn>
          </div>
        </v-card-actions>
      </v-card>
      </v-dialog>
    </v-row>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="4" class="py-0 pt-2 pb-2">
            <div>
              <span>应用名称：</span>
              <span>{{ appName }}</span>
            </div>
          </v-col>
          <v-col cols="4" class="py-0 pt-2 pb-2">
            <span>模型名称：</span>
            <span>{{ modelName }}</span>
          </v-col>
          <v-col cols="4" class="py-0 pt-2 pb-2">
            <span>模型运行时间：</span>
            <span>{{ modelTime }}</span>
          </v-col>
          <v-col cols="4" class="py-0 pt-2 pb-2">
            <span>实体类型：</span>
            <span>{{ nodeTypeCNName }}</span>
          </v-col>
          <v-col cols="4" class="py-0 pt-2 pb-2">
            <span>实体总数：</span>
            <span>{{ entityNumber }}</span>
          </v-col>
        </v-row>
        <!-- 查询条件 -->
        <v-row style="margin-left: -12px;">
          <v-col cols="11" class="py-0">
            <v-form ref="searchForm" v-model="searchValid" lazy-validation>
              <v-row>
                <v-col cols="3" class="mr-4">
                  <DatePicker
                  type="daterange"
                  v-model="searchForm.dates"
                  :options="options"
                  @on-clear="onClear(searchForm, searchForm.dates)"
                  @on-change="onChange(searchForm.dates, searchForm)"
                  placement="top-start"
                  placeholder="选择日期"
                  style="width: 100%"
                  id='data-picker'
                  ></DatePicker>
                </v-col>
                <v-col
                  cols="4"
                  style="text-align: left; position: relative"
                  class="pt-1"
                >
                  <div class="dateBtnBox">
                    <v-btn
                      color="primary"
                      class="ml-4"
                      @click="resetSearchData"
                      small
                    >重置</v-btn>
                    <v-btn
                      color="primary"
                      class="ml-4"
                      small
                      @click="search"
                    >查询</v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- 详情卡片 -->
    <div :style="{minHeight: cardHeight}" class="elevation-3 cardStyle">
      <v-expansion-panels
        v-model="expansionOpenNumber"
        multiple
        tile
      >
        <v-expansion-panel
          ref="ele"
          v-for="(item,i) in expansionAry"
          :key="keykey + i"
          @clcik="expansionClick()"
        >
          <v-expansion-panel-header class="expansionBordre">{{ item.headerName }}</v-expansion-panel-header>
          <v-expansion-panel-content style="height: 512px;">
            <v-row style="margin: 0; border-bottom: 1px solid #DDDEE2;">
              <v-col cols="8" class="cardCol cardColLeftStyle" >

                <!-- 线图 -->
                <div style="height: 1px;background-color:#fff;position: relative; top: 0px;z-index: 1;"></div>
                <div>
                  <div v-if="item.lineGrossShow && item.lineLoading== false" :key="item.keyChartsTime">
                    <base-echarts :optionParam="item.optionParamBarTriggerNumber"></base-echarts>
                  </div>
                  <div v-if="!item.lineGrossShow && item.lineLoading== false" class="no-data-box">暂无数据</div>
                  <div v-if="item.lineLoading" class="no-data-box">加载中</div>
                </div>
              </v-col>
              <v-col cols="4" class="cardCol cardColRightStyle">
                <v-expansion-panels
                  v-model="item.cardDetailsOpenNumber"
                  accordion
                  mandatory
                  tile
                >
                  <v-expansion-panel>
                    <v-expansion-panel-header class="expansionBordre expansionNoBordre">卡片基本信息</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <div class="cardDetailsRow">
                        <v-row v-if="item.idText === '全局指标'">
                          <v-col cols="12" class="cardCol cardElementaryInfoCol" v-for="(im, ix) in item.isTargetCardDetailsInfo" :key="ix">
                            <span class="cardElementaryInfoCollabel">{{ im.cnName }}</span>
                            <span class="cardElementaryInfoColText">{{ im.value }}</span>
                          </v-col>
                        </v-row>
                        <v-row v-else>
                          <v-col cols="12" class="cardCol cardElementaryInfoCol" v-for="(im, ix) in item.noTargetCardDetailsInfo" :key="ix">
                            <span class="cardElementaryInfoCollabel">{{ im.cnName }}</span>
                            <span class="cardElementaryInfoColText">{{ im.value }}</span>
                          </v-col>
                        </v-row>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel v-if="item.idText !== '全局指标'">
                    <v-expansion-panel-header class="expansionBordre expansionNoBordre" @click="showenTityTable(item, i)">展示实体列表</v-expansion-panel-header>
                    <v-expansion-panel-content class="cardElementaryInfoContent">
                      <div>
                        <v-select
                          style="width: 200px; display: inline-block; margin-left: 16px; margin-top: 10px;"
                          :menu-props="{ bottom: true }"
                          v-model="item.batchOperation"
                          item-text="text"
                          item-value="value"
                          placeholder="批量操作"
                          :disabled="!item.isBlackSelect"
                          :items="batchOperationAry"
                          outlined
                          dense
                          @change="batchOperationChange(item)"
                          no-data-text="没有匹配数据"
                        />
                        <v-data-table
                          v-model="item.blackList"
                          :headers="item.headers"
                          :items="item.blackListAry"
                          :items-per-page="Infinity"
                          :single-select="item.singleSelect"
                          :loading="item.blackTableLoading"
                          :fixed-header="true"
                          hide-default-footer
                          item-key="name"
                          disable-sort
                          show-select
                          color="red"
                          class="elevation-1 blackListTableStyle"
                          @input="selectInput(item)"
                        >
                        </v-data-table>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
import BaseEcharts from '@c/BaseEcharts';
import BaseSearchTwo from '@c/BaseSearchTwo';
import DatetimePicker from '@c/DateTimePicker';
import { DatePicker } from 'view-design';
import {
  targetByModel,
  queryEntityListBrokenLine,
  showEntityList,
  getAppInfoOrTradeType,
  getBlackName,
  mlBatchAddBlack,
  mlBatchDelBlack
} from '../../api/modelRunningResults.js';
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
export default {
  // name: 'caseReport',
  components: {
    BaseEcharts,
    DatetimePicker,
    DatePicker
  },
  filters: {
  },
  data: () => ({
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    align: true, // 是否初始化，true: 初始化，false: 非初始化
    // 添加黑名单弹框
    isShowBlackList: false,
    addTemplaterAry: {
      appName: '',
      blackName: '',
      oinvalidTime: '' // 失效时间
    },
    blackNameAry: [],
    applyNameAry: [],
    valid: true,
    lazy: false,
    textFieldProps: {
      appendIcon: 'event'
    },
    dateProps: {
      headerColor: 'primary'
    },
    timeProps: {
      useSeconds: true,
      ampmInTitle: true
    },
    isScrollHeight: false,
    isFixed: false,
    clearDate: false,
    cardHeight: '',
    fullHeight: window.innerHeight,
    counter: 0, // 搜索条件是否展开
    resultSet: '', // 结果结合
    appName: '', // 应用名称
    modelName: '', // 模型名称
    modelTime: '', // 模型运行时间
    nodeType: '', // 实体类型-英文名称
    nodeTypeCNName: '', // 实体类型-中文名称
    entityNumber: '', // 实体总数
    paramAppId: '', // 应用ID
    isdateShow: false,
    batchOperationAry: [ // 批量操作数组
      {
        text: '加入黑名单',
        value: '1'
      },
      {
        text: '移除黑名单',
        value: '2'
      }
    ],
    batchOperation: '', // 批量操作值
    expansionOpenNumber: [], // 图表卡片打开项
    expansionAry: [],
    keykey: new Date().getTime(),
    doEssentialInfo: false,
    essentialInfoAry: [],
    otherDataAry: [], // 大卡片的数组
    cardLoading: false,
    isBlackSelect: false, // 黑名单是否disabled
    currentItem: {}, // 当前项
    blackTableLoading: false,
    gridTopNum: 30,
    // 1.6新改需求
    searchForm: {
      dates: []
    },
    searchValid: true,
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
    afferentStartTime: '', // 传入的的开始时间
    afferentEndTime: '', // 传入的的结束时间
    currentTime: '', // 点击加入黑名单时的当前时间
    dateTypeEnd: 2
  }),
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 204;
      }
    },
    ...mapGetters([
      'appId'
    ])
  },
  watch: {
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 80;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    },
    appId: {
      handler: function (newVal, oldVal) {
        if (oldVal) {
          this.$route.params.pageNum = 1;
          sessionStorage.setItem('ModelRunningResultsParams', null);
          sessionStorage.setItem('ModelRunningResultsDetailsParams', null);
          this.$router.push({
            path: '/modelRunningResults',
            name: 'modelRunningResults',
            params: this.$route.params
          });
        }
      },
      immediate: true
    }
  },
  created () {
    let cardHeightNumber = 0;
    let oneCardHeight = 635;
    cardHeightNumber = window.innerHeight - 162;
    this.cardHeight = cardHeightNumber + 'px';
    if (Object.keys(this.$route.params).length !== 0) {
      this.resultSet = this.$route.params.resultSet;
      this.appName = this.$route.params.appName;
      this.modelName = this.$route.params.modelName;
      this.modelTime = this.$route.params.modelTime;
      this.nodeType = this.$route.params.node_type;
      this.nodeTypeCNName = this.$route.params.nodeTypeCNName;
      this.entityNumber = this.$route.params.entityNumber;
      this.paramAppId = this.$route.params.appId;
    } else {
      Object.assign(this.$route.params, JSON.parse(sessionStorage.getItem('ModelRunningResultsDetailsParams')));
      this.resultSet = this.$route.params.resultSet;
      this.appName = this.$route.params.appName;
      this.modelName = this.$route.params.modelName;
      this.modelTime = this.$route.params.modelTime;
      this.nodeType = this.$route.params.node_type;
      this.nodeTypeCNName = this.$route.params.nodeTypeCNName;
      this.entityNumber = this.$route.params.entityNumber;
      this.paramAppId = this.$route.params.appId;
    }
    // this.applyNameAry = JSON.parse(sessionStorage.getItem('vuexAppList')); // 获取登录时用户名下的应用名称
    // 根据浏览器高度除以单个卡片的高度，得到最多能展开几个卡片，然后取 Math.ceil()
    // this.expansionOpenNumber = [...Array(Math.ceil(cardHeightNumber / (oneCardHeight + 16))).keys()].map((k, i) => i);
    this.getUserApplyName(); // 实时获取用户名下的应用名称
    this.searchTemp();
    window.addEventListener('scroll', this.fixedBtnBox);
    // this.expansionOpenNumber = [...Array(this.expansionAry.length).keys()].map((k, i) => i);
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('resize', this.getCardHeight);
    window.addEventListener('scroll', this.getScrollHeight);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('resize', this.getCardHeight);
    window.removeEventListener('scroll', this.getScrollHeight);
  },
  methods: {
    onClear (dates) {
      // this.searchForm.dates = dates.dates;
    },
    // formatDate (dateInput) {
    //   var date = new Date(dateInput);
    //   var YY = date.getFullYear() + '-';
    //   var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    //   var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    //   return YY + MM + DD;
    // },
    onChange (dates, item) {
      // item.dates = this.formatDate(dates[0]) + ' - ' + this.formatDate(dates[1]);
    },
    // 头部fixed定位
    fixedBtnBox () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 72) { // 当页面滚动到高度72px处，动态绑定class 来设置头部固定定位
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    backTopPage () {
      this.$route.params.idClass = 2;
      sessionStorage.setItem('ModelRunningResultsDetailsParams', null);
      this.$router.push({
        path: '/modelRunningResultsDetails',
        name: 'modelRunningResultsDetails',
        params: this.$route.params
      });
    },
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 滚动条下拉懒加载，
    getScrollHeight () {
      // 变量scrollTop是滚动条滚动时，距离顶部的距离
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      // 变量windowHeight是可视区的高度
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      // 变量scrollHeight是滚动条的总高度
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      // 滚动条到底部的条件
      if ((scrollTop + windowHeight + 50) > scrollHeight && !this.isScrollHeight) {
        this.isScrollHeight = true;
        // 写后台加载数据的函数
        // console.log('距顶部' + scrollTop + '可视区高度' + windowHeight + '滚动条总高度' + scrollHeight);
      } else if ((scrollTop + windowHeight + 50) <= scrollHeight && this.isScrollHeight) {
        this.isScrollHeight = false;
      }
    },
    // 获取卡片的动态高度
    getCardHeight () {
      let cardHeightNumber = 0;
      cardHeightNumber = window.innerHeight - 162;
      this.cardHeight = cardHeightNumber + 'px';
    },
    searchTemp () {
      this.afferentStartTime = this.$route.params.startTime.substr(0, 10);
      this.afferentEndTime = this.$route.params.endTime.substr(0, 10);
      if (this.afferentStartTime && this.afferentEndTime) {
        this.searchForm.dates = [this.afferentStartTime, this.afferentEndTime];
      } else {
        let today = new Date();
        today.setTime(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        let startDay = this.dateToString(today);
        let endDay = this.dateToString(new Date()).substr(0, 10);
        this.searchForm.dates = [startDay, endDay];
      }
      this.search();
    },
    // 点击重置条件
    resetSearchData () {
      this.searchForm.dates = [this.afferentStartTime, this.afferentEndTime];
      this.search();
    },
    // 查询卡片列表
    async search () {
      if ((this.searchForm.dates.length === 2 && this.searchForm.dates[0] !== '' && this.searchForm.dates[1] !== '') || typeof this.searchForm.dates === 'string') {
        let pageParams = {
          modelName: this.modelName
        };
        const res = await targetByModel(pageParams);
        if (res.data.code === 200) {
          // this.nodeType = 'ip';
          let dataOther = res.data.data[this.nodeType]; // 实体
          let dataOverallSituation = res.data.data.global; // 指标，即全局
          let overallSituationData = [];
          let otherData = [];
          let resultSet = []; // 结果结合，也就是全局图表接口传参中的的indexEntityList的值
          // let overallSituationDataAry = []; // 全局转化为value:global格式的数组
          this.baseAry(dataOverallSituation, overallSituationData, '全局指标');
          this.baseAry(dataOther, otherData, '实体指标');
          // 全局的value 拼接 :global
          overallSituationData.forEach((item, index, ary) => {
            // overallSituationDataAry.push(item.value + ':global');
            item.value = item.value + ':global';
          });
          // 选择时间的时候用到这个变量this.otherDataAry
          // otherData = otherData.concat(overallSituationData);
          otherData = overallSituationData.concat(otherData);
          this.otherDataAry = otherData;
          if (this.resultSet.split(',').length > 0) {
            this.resultSet.split(',').forEach((item, index, ary) => {
              resultSet.push(item + ':' + this.nodeType);
            });
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = '实体指标为空';
            this.snackbarServeColor = 'error';
            return;
          }
          // 生成默认查询近一周的时间
          // let today = new Date();
          // today.setTime(today.getTime() + this.searchForm[1].value * 24 * 60 * 60 * 1000);
          // let startDay = this.dateToString(today);
          // let endDay = this.dateToString(new Date()).substr(0, 10);
          if (otherData.length > 0) {
            this.expansionAry = [];
            otherData.forEach((item, index, ary) => {
              if (item.idText === '全局指标') {
                this.expansionAry.push(
                  {
                    idText: '全局指标',
                    // dates: [],
                    // datesTime: '',
                    singleSelect: false,
                    batchOperation: '', // 团队节点类型
                    blackList: [], // 展示实体列表多选项
                    headers: [
                      {
                        text: 'CST_NO',
                        align: 'start',
                        sortable: false,
                        value: 'name'
                      },
                      { text: '是否已加入黑名单', value: 'calories', width: 130 }
                    ],
                    blackListAry: [],
                    blackTableLoading: false,
                    keyChartsTime: new Date().getTime(),
                    // keyDataTime: new Date().getTime(),
                    // selectTime: -1, // 快捷时间select
                    // isdateShow: false, // 时间弹框是否展示
                    newDate: null,
                    headerName: item.text, // card头部信息
                    cardDetailsOpenNumber: [0], // 基本信息card展示项
                    isBlackSelect: false,
                    lineLoading: true,
                    lineGrossShow: false,
                    optionParamBarTriggerNumber: {
                      width: '100%',
                      height: '446px',
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
                        type: 'scroll',
                        right: 10,
                        left: 10,
                        align: 'left',
                        orient: 'horizontal',
                        pageButtonGap: 10,
                        pageButtonPosition: 'end',
                        top: 10,
                        data: []
                      },
                      grid: {
                        top: 50,
                        left: '3%',
                        right: 50,
                        bottom: 50,
                        containLabel: true
                      },
                      xAxis: [
                        {
                          type: 'category',
                          boundaryGap: false,
                          data: []
                        }
                      ],
                      yAxis: [
                        {
                          type: 'value'
                        }
                      ],
                      dataZoom: [{
                        show: true,
                        realtime: true,
                        width: '70%',
                        left: '15%',
                        start: 0,
                        end: 100
                      }, {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100
                      }],
                      series: []
                    },
                    isTargetCardDetailsInfo: [ // 应用信息
                      {
                        cnName: '应用名称：',
                        value: this.appName
                      },
                      {
                        cnName: '模型名称：',
                        value: this.modelName
                      },
                      {
                        cnName: '折线对应：',
                        value: '指标'
                      }
                    ]
                  }
                );
              } else {
                this.expansionAry.push(
                  {
                    idText: '实体指标',
                    // dates: [],
                    // datesTime: '',
                    singleSelect: false,
                    batchOperation: '', // 团队节点类型
                    blackList: [], // 展示实体列表多选项
                    headers: [
                      {
                        text: this.nodeTypeCNName,
                        align: 'start',
                        sortable: false,
                        value: 'name'
                      },
                      { text: '是否已加入黑名单', value: 'calories', width: 130 }
                    ],
                    blackListAry: [],
                    blackTableLoading: false,
                    keyChartsTime: new Date().getTime(),
                    // keyDataTime: new Date().getTime(),
                    // selectTime: -1, // 快捷时间select
                    // isdateShow: false, // 时间弹框是否展示
                    newDate: null,
                    headerName: item.text, // card头部信息
                    cardDetailsOpenNumber: [0], // 基本信息card展示项
                    isBlackSelect: false,
                    lineLoading: true,
                    lineGrossShow: false,
                    optionParamBarTriggerNumber: {
                      width: '100%',
                      height: '446px',
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
                        type: 'scroll',
                        right: 10,
                        left: 10,
                        align: 'left',
                        orient: 'horizontal',
                        pageButtonGap: 10,
                        pageButtonPosition: 'end',
                        top: 10,
                        data: []
                      },
                      grid: {
                        top: 50,
                        left: '3%',
                        right: 50,
                        bottom: 50,
                        containLabel: true
                      },
                      xAxis: [
                        {
                          type: 'category',
                          boundaryGap: false,
                          data: []
                        }
                      ],
                      yAxis: [
                        {
                          type: 'value'
                        }
                      ],
                      dataZoom: [{
                        show: true,
                        realtime: true,
                        width: '70%',
                        left: '15%',
                        start: 0,
                        end: 100
                      }, {
                        type: 'inside',
                        realtime: true,
                        start: 0,
                        end: 100
                      }],
                      series: []
                    },
                    noTargetCardDetailsInfo: [ // 应用信息
                      {
                        cnName: '应用名称：',
                        value: this.appName
                      },
                      {
                        cnName: '模型名称：',
                        value: this.modelName
                      },
                      {
                        cnName: '折线对应：',
                        value: '实体'
                      },
                      {
                        cnName: '实体类型：',
                        value: this.nodeTypeCNName
                      },
                      {
                        cnName: '展示指标：',
                        value: item.text
                      }
                    ]
                  }
                );
              }
            });
            // for循环写await 循环依次调取接口
            for (let index = 0; index < otherData.length; index++) {
              const item = otherData[index];
              let params = {
                // appId: 'pibs', // 测试用的appId
                appId: this.paramAppId,
                modelName: this.modelName,
                startTime: moment(this.searchForm.dates[0]).format('YYYY-MM-DD'),
                endTime: moment(this.searchForm.dates[1]).format('YYYY-MM-DD')
              };
              if (item.idText === '全局指标') {
                let p = {
                  indexEntityList: item.value,
                  brokenLineCorresponding: '1'
                };
                Object.assign(params, p);
              } else {
                let p = {
                  indexEntityList: resultSet.toString(','),
                  brokenLineCorresponding: '2',
                  index: item.value
                };
                Object.assign(params, p);
              };
              await this.getlineEchart(params, index, item);
            };
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = '卡片数据为空，请稍后再试';
            this.snackbarServeColor = 'error';
          }
        }
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = '搜索时间不能为空';
        this.snackbarServeColor = 'error';
      }
    },
    // 加入或移除黑名单change
    async batchOperationChange (item) {
      // this.$refs.addTemplaterAry.reset();
      if (item.batchOperation === '1' && item.blackList.length > 0) { // 加入黑名单
        this.isShowBlackList = true;
        this.$nextTick(() => {
          this.currentTime = new Date().getTime(); // 获取当前时间戳
          this.currentTime = moment(this.currentTime).format('YYYY-MM-DD HH:mm:ss'); // 转换时间为固定格式的字符串
        });
        this.currentItem = item;
      } else if (item.batchOperation === '2' && item.blackList.length > 0) { // 移除黑名单
        this.currentItem = item;
        try {
          let blackName = '';
          item.blackList.forEach(blackItem => {
            if (blackName) {
              blackName = blackName + ',' + blackItem.name;
            } else {
              blackName = blackItem.name;
            }
          });
          let pam = {
            listValues: blackName
          };
          const res = await mlBatchDelBlack(pam);
          if (res.data.code === 200) {
            this.currentItem.batchOperation = '';
            this.currentItem.blackList = [];
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.getEssentialInfo();
          } else {
            this.currentItem.batchOperation = '';
            this.currentItem.blackList = [];
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        } catch (err) {
          this.currentItem.batchOperation = '';
          this.currentItem.blackList = [];
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        }
      }
    },
    // 获取用户名下的应用名称
    async getUserApplyName () {
      let params = {
        applyScopeId: '2'
      };
      try {
        const res = await getAppInfoOrTradeType(params);
        if (res.data.code === 200) {
          if (res.data.data.length > 0) {
            this.applyNameAry = res.data.data;
          } else {
            this.applyNameAry = [];
          }
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
    // 加入黑名单
    async addBlack (data) {
      try {
        let params = {

        };
        if (data === '1') {
          const res = await showEntityList(params);
          if (res.data.code === 200) {
            res.data.data.forEach((item, index, ary) => {
              item.name = item.entity;
              item.calories = item.backListState ? '是' : '';
            });
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        } else {
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 确定按钮
    async mistakeDialog () {
      let oinvalidTime = '';
      let datetime = 0;
      if (this.addTemplaterAry.oinvalidTime) {
        oinvalidTime = new Date(this.addTemplaterAry.oinvalidTime);
        datetime = moment(oinvalidTime).format('YYYY-MM-DD HH:mm:ss');
      }
      try {
        let blackName = '';
        this.currentItem.blackList.forEach(blackItem => {
          if (blackName) {
            blackName = blackName + ',' + blackItem.name;
          } else {
            blackName = blackItem.name;
          }
        });
        let pam = {
          listId: this.addTemplaterAry.blackName,
          listType: 'BLACK_LIST',
          listValue: blackName,
          expireTime: datetime === 0 ? '' : datetime + ''
        };
        const res = await mlBatchAddBlack(pam);
        if (res.data.code === 200) {
          this.isShowBlackList = false;
          this.currentItem.batchOperation = '';
          this.currentItem.blackList = [];
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.$refs.addTemplaterAry.reset();
          this.getEssentialInfo();
        } else {
          this.isShowBlackList = false;
          this.currentItem.batchOperation = '';
          this.currentItem.blackList = [];
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
          this.$refs.addTemplaterAry.reset();
        }
      } catch (err) {
        this.isShowBlackList = false;
        this.currentItem.batchOperation = '';
        this.currentItem.blackList = [];
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
        this.$refs.addTemplaterAry.reset();
      }
    },
    // 黑名单弹窗---取消事件
    cancelCrudFormDialog () {
      this.isShowBlackList = false;
      this.$refs.addTemplaterAry.reset();
      this.currentItem.batchOperation = '';
      this.currentItem.blackList = [];
    },
    // 获取基本信息
    async getEssentialInfo () {
      try {
        this.blackTableLoading = true;
        let pam = {
          entityLists: this.resultSet
        };
        const res = await showEntityList(pam);
        if (res.data.code === 200) {
          res.data.data.forEach((item, index, ary) => {
            item.name = item.entity;
            item.calories = item.backListState ? '是' : '';
          });
          this.essentialInfoAry = res.data.data;
          this.$nextTick(() => {
            this.expansionAry.forEach(item => {
              item.blackTableLoading = false;
              item.blackListAry = this.essentialInfoAry;
            });
          });
        } else {
          this.blackTableLoading = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.blackTableLoading = false;
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 公共转化获取指标信息的data为数组
    baseAry (data, dataAry, idText) {
      if (data.length > 0) {
        data.forEach((item, index, ary) => {
          let itemAry = [];
          itemAry = item.split(':');
          dataAry.push(
            {
              text: itemAry[0],
              value: itemAry[1],
              idText: idText
            }
          );
        });
        return dataAry;
      }
    },
    // 快捷时间selectChange事件
    // 1.6版本：20217月份修改需求更改提取每个卡片的搜索条件为公共搜索条件。（所以，以下每个卡片的搜索功能已经删除）
    selectTimeChange (item, index) {
      this.changeDay(item);
    },
    changeDay (item) {
      // 生成时间
      let today = new Date();
      today.setTime(today.getTime() + item.selectTime * 24 * 60 * 60 * 1000);
      let startDay = this.dateToString(today);
      let endDay = this.dateToString(new Date()).substr(0, 10);
      this.dateStart = startDay;
      if (item.selectTime === -1) { // -1为选择了昨天的时间
        item.dates = [startDay, startDay];
      } else {
        item.dates = [startDay, endDay];
      }
      item.datesTime = item.dates.join(' 至 ');
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
    // 创建时间和更新时间修改格式。
    baseFilterDate (data) {
      if (data.length === 2) {
        if (data[0]) {
          if (data[0].length < 11) {
            data[0] = data[0] + ' 00:00:00';
          }
        } else {
          data[0] = '';
        }
        if (data[1]) {
          if (data[1].length < 11) {
            data[1] = data[1] + ' 23:59:59';
          }
        } else {
          data[1] = '';
        }
      } else {
        data = [];
      }
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
    all () {
      this.expansionOpenNumber = [...Array(this.expansionAry).keys()].map((k, i) => i);
    },
    // Reset the expansionOpenNumber
    none () {
      this.expansionOpenNumber = [];
    },
    // 获取lineEchartData
    getlineEchart (params, index, item) {
      return new Promise((resolve, reject) => {
        queryEntityListBrokenLine(params).then((res) => {
          if (res.data.code === 200) {
            if (res.data.data.series.length > 0) {
              res.data.data.series.forEach(im => {
                im.type = 'line';
              });
            }
            if (this.align) {
              this.expansionAry[index].selectTime = -7;
            }
            if (res.data.data.xTime.length > 0) {
              this.expansionAry[index].lineLoading = false;
              this.expansionAry[index].lineGrossShow = true;
              // if (res.data.data.item.length > 0 && res.data.data.item.length / 5 > 1) {
              //   this.expansionAry[index].optionParamBarTriggerNumber.grid.top = this.gridTopNum + Math.ceil(res.data.data.item.length / 5) * 20;
              // } else {
              //   this.expansionAry[index].optionParamBarTriggerNumber.grid.top = 30;
              // }
              this.expansionAry[index].optionParamBarTriggerNumber.legend.data = res.data.data.item;
              this.expansionAry[index].optionParamBarTriggerNumber.xAxis[0].data = res.data.data.xTime;
              this.expansionAry[index].optionParamBarTriggerNumber.series = res.data.data.series;
            } else {
              this.expansionAry[index].lineLoading = false;
              this.expansionAry[index].lineGrossShow = false;
            }
            this.expansionOpenNumber = [...Array(this.expansionAry.length).keys()].map((k, i) => i);
            // this.changeDay(this.expansionAry[index]);
            this.expansionAry[index].keyChartsTime = new Date().getTime();
            if (index === this.expansionAry.length) {
              this.doEssentialInfo = true;
              this.$nextTick(() => {
                this.expansionAry.forEach(item => {
                  item.blackListAry = this.essentialInfoAry;
                });
              });
            }
            resolve(this.expansionAry[index]);
          } else {
            reject(res.data.msg);
            this.expansionAry.forEach((im, ix, ay) => {
              if (index < this.expansionAry.length && ix >= index) {
                this.expansionAry[ix].lineLoading = false;
                this.expansionAry[ix].lineGrossShow = false;
              }
            });
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        }).catch(err => {
          this.expansionAry.forEach((im, ix, ay) => {
            if (index < this.expansionAry.length && ix >= index) {
              this.expansionAry[ix].lineLoading = false;
              this.expansionAry[ix].lineGrossShow = false;
            }
          });
          reject(err);
        });
      });
    },
    // 时间点击事件
    dataTimeClick (item, index) {
      item.isdateShow = true;
      item.keyDataTime = new Date().getTime();
      this.$forceUpdate();
    },
    // 实体列表点击事件
    async showenTityTable (im, ix) {
      this.getEssentialInfo();
    },
    // 应用名称change
    async appNameChange (appName) {
      let appNameId = '';
      this.applyNameAry.forEach(item => {
        if (appName === item.appName) {
          appNameId = item.appId;
        }
      });
      let params = {
        appId: appNameId,
        businessVar: this.nodeType
      };
      try {
        const res = await getBlackName(params);
        if (res.data.code === 200) {
          if (res.data.data.length > 0) {
            this.blackNameAry = res.data.data;
          } else {
            this.blackNameAry = [];
          }
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
    // 卡片内的多选框勾选事件
    selectInput (data) {
      this.$nextTick(() => {
        if (data.blackList.length > 0) {
          data.isBlackSelect = true;
        } else {
          data.isBlackSelect = false;
        }
      });
    },
    expansionChange (item, i) {
      // console.log(item, i);
    },
    expansionClick (e) {
      // console.log(e);
    }
  }
};
</script>
<style lang="stylus" scoped>
.cardDetailsRow {
  padding-left: 16px;
  padding-bottom: 10px;
}
.cardStyle {
  margin-top: 16px;
  // overflow-x: auto;
  // padding-top: 16px;
  // background-color: #fff;
}
.no-data-box {
  width: 100%;
  height: 532px;
  background: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
}
.blackListTableStyle {
  margin-top: 10px;
  height: 291px;
  overflow-y: auto;
  box-shadow: none !important;
}
.cardElementaryInfoContent .v-application .elevation-1 {
  box-shadow: none;
}
.fixed {
  position: fixed;
  width: auto;
  top: 0;
  left: 240px;
  right: 12px;
  z-index: 9;
  border-bottom: 1px solid #ededed;
}
.cardStyle .expansionBordre {
  border-bottom: 1px solid #DDDEE2;
  height: 47px;
  font-size: 14px;
  font-weight: bold;
  padding-left: 22px;
}
.cardStyle .expansionNoBordre {
  // border-bottom: 0 !important;
  padding-left: 16px;
}
.cardStyle .cardCol {
  padding-top: 14px;
}
.cardStyle .cardElementaryInfoCol {
  font-size: 12px;
  padding-bottom: 0;
}
.cardStyle .cardElementaryInfoCol .cardElementaryInfoCollabel {
  color: #333333;
  font-weight: bold;
}
.cardStyle .cardElementaryInfoCol .cardElementaryInfoColText {
  color: #777777;
}
// .cardElementaryInfoContent >>> .v-expansion-panel-content__wrap {
//   padding: 0;
// }
.cardStyle .cardColLeftStyle >>> .v-card__text {
  padding: 0;
  padding-bottom: 0px !important;
}
.cardStyle >>> .v-expansion-panel-content__wrap {
  padding: 0;
}
.cardStyle .cardColLeftStyle {
  padding: 0
  border-right: 1px solid #DDDEE2;
}
.cardStyle .cardColRightStyle {
  padding: 0
}
.v-expansion-panel:before, .v-expansion-panel:before {
  box-shadow: none;
}
.v-data-table__wrapper tbody tr.v-data-table__selected .v-data-table__checkbox .theme--light.v-icon {
  color: #2196f3 !important;
}
.blackListTableStyle >>> .theme--light.v-icon {
  color: #2196f3 !important;
}
.ckxq_size {
  font-size: 18px;
}
//时间选择器 输入框高度
#data-picker /deep/ .ivu-input{
  height:40px;
}
.dateBtnBox {
  position: relative;
  top: 13px;
}
</style>
