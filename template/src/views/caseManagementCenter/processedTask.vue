<!--author：古雪瑞 -->
<!--updateTime：2020-05-11-->
<template>
  <div>
    <div>
      <v-tabs v-model="tab">
        <template v-for="(item, index) in tabItems">
          <v-tab :key="index" v-if="hasPermission(item.buttonUrl)"
                 @click="tabClick(item.tabName)"
          >
            {{ item.tabName }}
          </v-tab>
        </template>
      </v-tabs>
    </div>
    <div v-if="hasPermission(tabItems[0].buttonUrl) || hasPermission(tabItems[1].buttonUrl)">
      <!-- 搜索表单 -->
      <base-search
        :fieldList="searchForm"
        @search="search($event)"
        @reset="resetSearchData($event)"
        :clearDate="clearDate"
        @change="panelCounter"
      ></base-search>
      <!-- 已处理任务列表 -->
      <v-data-table
        :headers="processedTaskHeaders"
        :items="processedTaskData"
        :items-per-page="perPageNum"
        hide-default-footer
        :height="tableHeight"
        class="elevation-3 mt-3"
        :loading="loading"
        loading-text="加载数据中..."
        :fixed-header="true"
      >
        <!-- 表头 -->
        <template v-slot:top>
          <v-toolbar flat height="60px">
            <v-toolbar-title style="font-size:18px">
              {{ isAccountType === 1 ? '动账类' : '非动账类'}}
            </v-toolbar-title>
          </v-toolbar>
        </template>
        <template
          v-slot:item.opType="{ item }"
        >
          <span>{{ ifdsOptypeList[item.opType] | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.appId="{ item }"
        >
          <span :title="item.appId | textFilters(allAppList) | ellipsis()">{{ item.appId | textFilters(allAppList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.strategy="{ item }"
        >
          <span :title="item.strategy | textFilters(allStrategyList) | ellipsis()">{{ item.strategy | textFilters(allStrategyList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.createTime="{ item }"
        >
          <span>{{ item.createTime }}</span>
        </template>
        <template
          v-slot:item.src="{ item }"
        >
          <span :title="item.src | textFilters(allTaskResourceList) | ellipsis()">{{ item.src | textFilters(allTaskResourceList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.assignStyle="{ item }"
        >
          <span :title="item.assignStyle | textFilters(allAssignTypeList) | ellipsis()">{{ item.assignStyle | textFilters(allAssignTypeList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.spLevel="{ item }"
        >
          <span :title="item.spLevel | textFilters(allReviewFlowList) | ellipsis()">{{ item.spLevel | textFilters(allReviewFlowList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.result="{ item }"
        >
          <span :title="item.result | textFilters(allReviewResList) | ellipsis()">{{ item.result | textFilters(allReviewResList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.bankCard="{ item }"
        >
          <span :title="item.bankCard">{{ item.bankCard | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.inAccount="{ item }"
        >
          <span :title="item.inAccount">{{ item.inAccount | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.executeId="{ item }"
        >
          <span :title="item.executeId">{{ item.executeId | ellipsis() }}</span>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
                v-on="on"
                @click="queryDetailItem(item)"
              >
                mdi-square-edit-outline
              </v-icon>
            </template>
            <span>查看详情</span>
          </v-tooltip>
        </template>
        <template v-slot:no-data>
          <div>没有数据</div>
        </template>
        <!-- 分页组件 -->
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
      <!-- 删除弹框 -->
      <del-dialog :isDialogShow='dialogDel' @cancelDel='dialogDel = false' @confimDel='confirmDelFun'></del-dialog>
    </div>
  </div>
</template>
<script>
import BaseSearch from '@c/BaseSearch';
import DelDialog from '@/components/DelDialog';
import { getSearchDatas } from '@/utils/generalDataTableHeaders';
import * as dataService from 'api/caseManagementCenter/pendingTask';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'processedTask',
  components: {
    BaseSearch,
    DelDialog
  },
  data: () => ({
    ifdsOptypeList: [],
    counter: 0,
    fullHeight: window.innerHeight,
    loading: true,
    taskDetailData: [],
    tab: null,
    tabItems: [
      { tabName: '动账类', buttonUrl: 'processedTaskMovableAccountTab' },
      { tabName: '非动账类', buttonUrl: 'processedTaskNoMovableAccountTab' }
    ],
    isAccountType: 1,
    // 搜索参数
    searchData: {},
    // 动账类查询参数
    accountSearchData: {
      createTimeStart: '',
      createTimeEnd: '',
      opTypeList: '',
      userId: '',
      outAccount: '',
      inAccount: '',
      riskLabels: '',
      src: '',
      // state: ,
      statesString: '',
      assignStyle: '',
      eventNo: '',
      isAmount: 1,
      dataType: 1
    },
    // 非动账类查询参数
    noAccountSearchData: {
      eventNo: '',
      userId: '',
      userName: '',
      executeId: '',
      strategy: '',
      createTimeStart: '',
      createTimeEnd: '',
      src: '',
      assignStyle: '',
      spLevel: '',
      result: '',
      isAmount: 0,
      dataType: 0,
      opTypeList: ''
    },
    searchForm: [],
    // 搜索组件数据
    accountSearchForm: [
      {
        placeholder: '生成时间',
        value: [],
        type: 'date'
      },
      {
        placeholder: '交易类型',
        value: '',
        type: 'select',
        options: [
          { text: '全部交易类型', value: 'all' }
        ]
      },
      { placeholder: '用户标识', value: '', type: 'text' },
      { placeholder: '出账账号', value: '', type: 'text' },
      { placeholder: '入账账号', value: '', type: 'text' },
      {
        placeholder: '风险标签',
        value: '',
        type: 'select',
        options: [
          { text: '全部标签', value: 'all' }
        ]
      },
      {
        placeholder: '任务来源',
        value: '',
        type: 'select',
        options: [
          { text: '全部来源', value: 'all' }
        ]
      },
      // {
      //   placeholder: '任务状态',
      //   value: [],
      //   type: 'select',
      //   multiple: true,
      //   options: [
      //     // { text: '全部任务状态', value: 'all' }
      //   ]
      // },
      {
        placeholder: '指派方式',
        value: '',
        type: 'select',
        options: [
          { text: '全部方式', value: 'all' }
        ]
      },
      { placeholder: '任务编号', value: '', type: 'text' }
    ],
    // 非动账类
    noAccountSearchForm: [
      { placeholder: '任务编号', value: '', type: 'text' },
      { placeholder: '用户标识', value: '', type: 'text' },
      // { placeholder: '登录账号', value: '', type: 'text' },
      {
        placeholder: '交易类型',
        value: '',
        type: 'select',
        options: [
          { text: '全部交易类型', value: 'all' }
        ]
      },
      {
        placeholder: '建议策略',
        value: '',
        type: 'select',
        options: [
          { text: '全部策略', value: 'all' }
        ]
      },
      {
        placeholder: '任务来源',
        value: [],
        type: 'select',
        options: [
          { text: '全部来源', value: 'all' }
        ]
      },
      {
        placeholder: '生成时间',
        value: '',
        type: 'date'
      },
      {
        placeholder: '指派方式',
        value: '',
        type: 'select',
        options: [
          { text: '全部方式', value: 'all' }
        ]
      },
      {
        placeholder: '审核流类型',
        value: '',
        type: 'select',
        options: [
          { text: '全部类型', value: 'all' },
          { text: '一级审核流', value: 1 },
          { text: '二级审核流', value: 2 }
        ]
      },
      {
        placeholder: '审核结果',
        value: '',
        type: 'select',
        options: [
          { text: '全部', value: 'all' }
        ]
      },
      {
        placeholder: '风险标签',
        value: '',
        type: 'select',
        options: [
          { text: '全部标签', value: 'all' }
        ]
      }
      // {
      //   placeholder: '所属应用',
      //   value: '',
      //   type: 'select',
      //   options: [
      //     { text: '全部应用', value: 'all' }
      //   ]
      // }
    ],
    processedTaskHeaders: [],
    processedTaskData: [],
    // 动账类
    accountTypeHeaders: [
      { text: '任务编号', value: 'eventNo', sortable: false, width: 100 },
      { text: '所属应用', value: 'appId', sortable: false, width: 100 },
      { text: '交易类型', value: 'opType', sortable: false, width: 100 },
      { text: '用户标识', value: 'userId', sortable: false, width: 100 },
      { text: '出账账号', value: 'outAccount', sortable: false, width: 100 },
      { text: '入账账号', value: 'inAccount', sortable: false, width: 100 },
      { text: '金额', value: 'amount', sortable: false, width: 100 },
      { text: '风险标签', value: 'riskLabels', sortable: false, width: 100 },
      { text: '生成时间', value: 'createTime', sortable: false, width: 120 },
      { text: '任务来源', value: 'src', sortable: false, width: 100 },
      { text: '指派方式', value: 'assignStyle', sortable: false, width: 100 },
      { text: '审核流类型', value: 'spLevel', sortable: false, width: 100 },
      { text: '审核结果', value: 'result', sortable: false, width: 100 },
      { text: '查看详情', value: 'action', sortable: false, width: 100 }
    ],
    // 非动账类
    noAccountTypeHeaders: [
      { text: '任务编号', value: 'eventNo', sortable: false, width: 100 },
      { text: '所属应用', value: 'appId', sortable: false, width: 100 },
      { text: '交易类型', value: 'opType', sortable: false, width: 100 },
      { text: '用户标识', value: 'userId', sortable: false, width: 100 },
      { text: '风险标签', value: 'riskLabels', sortable: false, width: 100 },
      { text: '建议策略', value: 'strategy', sortable: false, width: 100 },
      { text: '生成时间', value: 'createTime', sortable: false, width: 120 },
      { text: '任务来源', value: 'src', sortable: false, width: 100 },
      { text: '指派方式', value: 'assignStyle', sortable: false, width: 100 },
      { text: '审核流类型', value: 'spLevel', sortable: false, width: 100 },
      { text: '审核结果', value: 'result', sortable: false, width: 100 },
      { text: '操作', value: 'action', sortable: false, width: 100 }
    ],
    // 分页变量
    pageNum: 1,
    pageSize: 10,
    queryPageLength: 0,
    perPageNum: 10,
    totalItems: 0,
    perPageItems: [5, 10, 15, 20, 50, 100],
    dialogDel: false,
    confirmDelFun: '',
    clearDate: false,
    // 用户信息
    token: '',
    loginUserId: '',
    // 查询下拉框数据--用于表格中过滤中文
    allTradeTypeList: [],
    allStrategyList: [],
    allTaskResourceList: [],
    allReviewResList: [],
    allAssignTypeList: [],
    allReviewFlowList: [
      { text: '一级审核流', value: '1' },
      { text: '二级审核流', value: '2' }
    ],
    isAdmin: false,
    // 角色列表
    roleIdenList: [],
    allRiskLabelList: [],
    allAppList: [],
    statePrams: ''
  }),
  computed: {
    ...mapGetters([
      'appId',
      'pageTabs',
      'appList'
    ]),
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 314;
      }
    }
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        this.searchData.opTypeList = '';
        this.pageNum = 1;
        Promise.all([
          this.queryIfdsOptypeList(), // 风控平台-交易类型查询
          this.getTradeTypeList(),
          this.getCaseStrategyList(),
          this.getTaskResourceList(),
          // this.getTaskStateList(),
          this.getReviewResultList(),
          this.getassignTypetList(),
          this.getRiskLabelList(),
          this.getAppListData()
        ]);
      },
      immediate: true
    },
    counter: {
      handler: function (newValue, oldValue) {
        if (this.counter % 2 === 1) {
          // 开
          this.tableHeight = window.innerHeight - 134;
        } else {
          // 关
          this.tableHeight = window.innerHeight;
        }
      },
      immediate: true
    }
  },
  filters: {
    textFilters: function (str, itemList) {
      let text = '';
      itemList.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.value === str) {
          text = item.text;
        }
      });
      return text;
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    this.searchForm = this.accountSearchForm;
    this.searchData = this.accountSearchData;
    this.processedTaskHeaders = this.accountTypeHeaders;
    this.searchForm = this.isAccountType ? this.accountSearchForm : this.noAccountSearchForm;
    this.searchData = this.isAccountType ? this.accountSearchData : this.noAccountSearchData;
    if (this.hasPermission(this.tabItems[0].buttonUrl)) {
      this.searchData.isAmount = 1; // 动账
    } else if (!this.hasPermission(this.tabItems[0].buttonUrl) && this.hasPermission(this.tabItems[1].buttonUrl)) {
      this.searchData.isAmount = 0; // 非动账
    }
    this.processedTaskHeaders = this.isAccountType ? this.accountTypeHeaders : this.noAccountTypeHeaders;
    if (localStorage.getItem('loginData')) {
      let loginData = JSON.parse(localStorage.getItem('loginData'));
      this.token = loginData.token;
      this.loginUserId = loginData.userId;
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  created () {
    // 核查趋势获取任务状态，当前审核完结写死8,不掉接口，会报错
    let statePrams = this.$route.params.prams;
    if (statePrams) {
      this.statePrams = statePrams;
      this.accountSearchForm[0].value = this.getToday() + ' 至 ' + this.getToday();
      this.accountSearchData.createTimeStart = this.getToday() + ' 00:00:00';
      this.accountSearchData.createTimeEnd = this.getToday() + ' 23:59:59';
      this.noAccountSearchForm[5].value = this.getToday() + ' 至 ' + this.getToday();
      this.noAccountSearchData.createTimeStart = this.getToday() + ' 00:00:00';
      this.noAccountSearchData.createTimeEnd = this.getToday() + ' 23:59:59';
      // this.accountSearchData.state = statePrams.value;
      // this.noAccountSearchData.state = statePrams.value;
      // console.log(this.searchForm, statePrams);
    }
  },
  methods: {
    getToday () {
      let day = new Date();
      day.setTime(day.getTime());
      let today = day.getFullYear() + '-' + ((day.getMonth() + 1) < 10 ? '0' + (day.getMonth() + 1) : (day.getMonth() + 1)) +
        '-' + (day.getDate() < 10 ? '0' + day.getDate() : day.getDate());
      return today;
    },
    // 风控平台-交易类型
    async queryIfdsOptypeList () {
      this.ifdsOptypeList = [];
      const response = await dataService.queryIfdsOptypeList();
      if (response.data.code === 200) {
        this.ifdsOptypeList = response.data.data.optypeMap;
      }
    },
    panelCounter: function () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 获取交易类型
    async getTradeTypeList () {
      this.accountSearchForm[3].options = [{ text: '全部交易类型', value: 'all' }];
      this.allTradeTypeList = [];
      if (this.appId) {
        const param = {
          appId: this.appId,
          isAmount: this.isAccountType
        };
        const response = await dataService.queryTradeType(param);
        if (response.data.code === 200 && response.data.data.tradeList) {
          let resTradeTypeItems = response.data.data.tradeList;
          resTradeTypeItems.forEach(async (item, index, ary) => {
            if (this.isAccountType) {
              this.searchForm[1].options.push({
                text: item.tradeName,
                value: item.identifier
              });
            } else {
              this.searchForm[2].options.push({
                text: item.tradeName,
                value: item.identifier
              });
            }
            await this.allTradeTypeList.push({
              text: item.tradeName,
              value: item.identifier
            });
          });
          this.getDataList();
        } else {
          this.loading = false;
        }
      }
    },
    // 获取建议策略下拉数据
    async getCaseStrategyList () {
      const res = await dataService.queryStrategyList();
      if (res.data.code === 200) {
        res.data.data.strategyList.forEach((item, index, ary) => {
          if (!this.isAccountType) {
            this.searchForm[3].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          }
          this.allStrategyList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取任务来源下拉数据
    async getTaskResourceList () {
      let param = {
        identifier: 'case_src'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          if (this.isAccountType) {
            this.searchForm[6].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          } else {
            this.searchForm[4].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          }
          this.allTaskResourceList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取任务状态下拉数据
    // async getTaskStateList () {
    //   let param = {
    //     identifier: 'case_state'
    //   };
    //   const res = await dataService.findsysParams(param);
    //   if (res.data.code === 200) {
    //     res.data.data.forEach((item, index, ary) => {
    //       if (this.isAccountType) { // 动账类标签下
    //         this.searchForm[7].options.push({
    //           text: item.paramName,
    //           value: item.paramValue
    //         });
    //         this.searchForm[7].value = this.statePrams.value && this.statePrams.value.split(',');
    //       }
    //     });
    //   }
    // },
    // 获取审核结果下拉数据
    async getReviewResultList () {
      let param = {
        identifier: 'case_result'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          if (!this.isAccountType) {
            this.searchForm[8].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          }
          this.allReviewResList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取指派方式下拉数据
    async getassignTypetList () {
      let param = {
        identifier: 'case_assign'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          if (this.isAccountType) {
            this.searchForm[7].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          } else {
            this.searchForm[6].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          }
          this.allAssignTypeList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取风险标签下拉数据
    async getRiskLabelList () {
      const res = await dataService.queryRiskLabelList();
      if (res.data.code === 200) {
        res.data.data.riskLabelList.forEach((item, index, ary) => {
          if (this.isAccountType) {
            this.searchForm[5].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          } else {
            this.searchForm[9].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          }
          this.allRiskLabelList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 处理所属应用下拉数据
    async getAppListData () {
      if (this.appList.length > 0) {
        const currAppList = await this.appList;
        currAppList.forEach((item, index, ary) => {
          // if (!this.isAccountType) {
          //   this.searchForm[10].options.push(
          //     { text: item.appName, value: item.id }
          //   );
          // }
          this.allAppList.push(
            { text: item.appName, value: item.id }
          );
        });
      }
    },
    tabClick (data) {
      this.clearDate = !this.clearDate; // 切换tab时将选择的日期清空
      this.loading = true;
      this.processedTaskData = [];
      if (data === '动账类') {
        this.isAccountType = 1;
        this.searchForm = this.accountSearchForm;
        this.processedTaskHeaders = this.accountTypeHeaders;
        this.searchData = this.accountSearchData;
      } else {
        this.isAccountType = 0;
        this.searchForm = this.noAccountSearchForm;
        this.processedTaskHeaders = this.noAccountTypeHeaders;
        this.searchData = this.noAccountSearchData;
      }
      this.searchData.opTypeList = '';
      // 切换tab时重置查询form
      // if (!this.statePrams) {
      //   this.searchForm.forEach((item) => {
      //     item.value = '';
      //   });
      // }
      this.pageNum = 1; // 默认从第一页开始查询
      this.queryIfdsOptypeList(); // 风控平台-交易类型查询
      this.getTradeTypeList();
      this.getCaseStrategyList();
      this.getTaskResourceList();
      // this.getTaskStateList();
      this.getReviewResultList();
      this.getassignTypetList();
      this.getRiskLabelList();
      this.getAppListData();
    },
    // 点击查询按钮
    search ($event) {
      this.searchData = getSearchDatas($event);
      if (this.isAccountType) {
        this.searchData.isAmount = 1; // 动账
        this.searchData.dataType = 1; // 动账
      } else {
        this.searchData.isAmount = 0; // 非动账
        this.searchData.dataType = 0; // 非动账
      }
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.clearDate = !this.clearDate;
      this.accountSearchData.createTimeStart = '';
      this.accountSearchData.createTimeEnd = '';
      this.noAccountSearchData.createTimeStart = '';
      this.noAccountSearchData.createTimeEnd = '';
      this.statePrams = '';
      this.searchData = this.isAccountType ? this.accountSearchData : this.noAccountSearchData;
      this.searchData.opTypeList = '';
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this.getDataList();
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 查询列表
    async getDataList () {
      this.loading = true;
      this.processedTaskData = [];
      let listArr = [];
      if (!this.searchData.opTypeList) {
        for (let i = 0; i < this.allTradeTypeList.length; i++) {
          listArr.push(this.allTradeTypeList[i].value);
        }
        this.searchData.opTypeList = listArr.join(',');
      }
      let pageParams = {
        appId: this.appId,
        page: this.pageNum,
        pageSize: this.perPageNum,
        token: this.token,
        queryTypes: 2
      };
      // if (this.statePrams) {
      //   pageParams.runIn = 2;
      // }
      if (this.isAccountType) { // 动账类标签下
        if (!this.searchData.statesString || this.searchData.statesString.length === 0) {
          this.searchData.statesString = '100';
        } else if (typeof this.searchData.statesString === 'object') {
          this.searchData.statesString = this.searchData.statesString.join(',');
        }
        if (this.searchData.statesString === 8) {
          this.searchData.statesString = '';
        }
      }
      let params = Object.assign({}, pageParams, this.searchData);
      const res = await dataService.queryTaskList(params);
      if (res.data.code === 200) {
        this.isAdmin = res.data.data.isAdmin;
        this.roleIdenList = res.data.data.roleIdenList; // 角色列表
        this.processedTaskData = res.data.data.verifyList;
        this.totalItems = res.data.data.total;
        this.queryPageLength = res.data.data.totalPage;
      }
      this.loading = false;
    },
    // 首页列表的查看详情按钮
    async queryDetailItem (item) {
      let params = {
        id: item.id,
        token: this.token,
        dataGroupId: item.dataGroupId,
        isGroup: item.isGroup
      };
      const res = await dataService.checkTaskDetail(params);
      if (res.data.code === 200) {
        // 传递到任务详情页的参数
        let detailItems = {
          id: item.id,
          title: '已处理任务',
          taskDetail: res.data.data,
          isTrial: item.trial,
          isTransfer: item.tranfer,
          roleIdenList: this.roleIdenList,
          isAmount: this.isAccountType,
          accountTypeHeaders: this.accountTypeHeaders,
          noAccountTypeHeaders: this.noAccountTypeHeaders,
          allStrategyList: this.allStrategyList,
          allTaskResourceList: this.allTaskResourceList,
          allAssignTypeList: this.allAssignTypeList,
          allAppList: this.allAppList,
          detailItemInfo: item,
          allTradeTypeList: this.allTradeTypeList,
          ifdsOptypeList: this.ifdsOptypeList
        };
        detailItems.accountTypeHeaders[detailItems.accountTypeHeaders.length - 1].text = '查看详情';
        detailItems.noAccountTypeHeaders[detailItems.noAccountTypeHeaders.length - 1].text = '查看详情';
        this.toSecondRouterPage(detailItems);
        this.$router.push('/caseTaskDetail');
      }
    },
    ...mapActions([
      'toSecondRouterPage'
    ])
  }
};
</script>
<style lang="stylus" scoped>
  >>> .v-select__selections {
    flex-wrap: nowrap;
    overflow: hidden;
  }
  >>> .v-select__selection--comma {
    overflow: initial;
  }
</style>
