<!--author：古雪瑞 -->
<!--updateTime：2020-05-11-->
<template>
  <div>
    <div>
      <v-tabs v-model="tab">
        <v-tab
          v-for="(item, index) in tabItems"
          :key="index"
          @click="tabClick(item.tabName)"
        >
          {{ item.tabName }}
        </v-tab>
      </v-tabs>
    </div>
    <div>
      <!-- 搜索表单 -->
      <base-search
        :fieldList="searchForm"
        @search="search($event)"
        @reset="resetSearchData($event)"
        :clearDate="clearDate"
        @change="panelCounter"
      ></base-search>
      <!-- 待处理任务列表 -->
      <v-data-table
        :headers="pendingTaskHeaders"
        :items="pendingTaskData"
        :items-per-page="perPageNum"
        hide-default-footer
        :height="tableHeight"
        class="elevation-3 mt-3"
        show-select
        v-model="selectedHeader"
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
            <v-spacer/>
            <v-btn color="primary" class="mr-2 mt-1" @click="designate" :disabled="!selectedHeader.length>0"
                   v-if="(isAccountType === 1 && hasPermission('batchAssignmentPendingxMovableAccountTaskButton')) ||
             (isAccountType === 0 && hasPermission('batchAssignmentPendingNoMovableAccountTaskButton'))">批量指派</v-btn>
            <v-btn color="primary" class="mr-1 mt-1" @click="transfer" :disabled="!selectedHeader.length>0"
                   v-if="(isAccountType === 1 && hasPermission('batchTransferPendingMovableAccountTaskButton')) ||
             (isAccountType === 0 && hasPermission('batchTransferPendingNoMovableAccountTaskButton'))">批量转派</v-btn>
          </v-toolbar>
        </template>
        <template
          v-slot:item.opType="{ item }"

        >
          <span :title="item.opType | ifdsOpType(ifdsOptypeList) | ellipsis()">{{ item.opType | ifdsOpType(ifdsOptypeList) | ellipsis() }}</span>
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
          v-slot:item.stateName="{ item }"
        >
          <span :title="item.stateName">{{ item.stateName | ellipsis() }}</span>
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
          <v-tooltip bottom
                     v-if="(isAccountType === 1 && hasPermission('assignmentPendingMovableAccountTaskButton')) ||
                    (isAccountType === 0 && hasPermission('assignmentPendingNoMovableAccountTaskButton'))">
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
                v-on="on"
                @click="designateSingle(item)"
              >
                mdi-account-multiple-plus-outline
              </v-icon>
            </template>
            <span>指派</span>
          </v-tooltip>
          <v-tooltip bottom
                     v-if="(isAccountType === 1 && hasPermission('transferPendingMovableAccountTaskButton')) ||
                    (isAccountType === 0 && hasPermission('transferPendingNoMovableAccountTaskButton'))">
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
                v-on="on"
                @click="transferSingle(item)"
              >
                mdi-account-arrow-right-outline
              </v-icon>
            </template>
            <span>转派</span>
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
  </div>
</template>
<script>
import BaseSearch from '@c/BaseSearch';
import DelDialog from '@/components/DelDialog';
import * as dataService from 'api/caseManagementCenter/pendingTask';
import { getSearchDatas } from '@/utils/generalDataTableHeaders';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'pendingTask',
  components: {
    BaseSearch,
    DelDialog
  },
  data: () => ({
    counter: 0,
    fullHeight: window.innerHeight,
    // 表格加载数据动画
    loading: true,
    tab: null,
    tabItems: [
      { tabName: '动账类' },
      { tabName: '非动账类' }
    ],
    selectedHeader: [],
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
      // state: 100, // 后端定的默认值
      statesString: '100', // 后端定的默认值
      assignStyle: '',
      eventNo: '',
      executeId: '',
      isAmount: 1,
      dataType: 1
    },
    // 非动账类查询参数
    noAccountSearchData: {
      eventNo: '',
      userId: '',
      userName: '',
      opTypeList: '',
      strategy: '',
      createTimeStart: '',
      createTimeEnd: '',
      src: '',
      assignStyle: '',
      // state: 100, // 后端定的默认值
      statesString: '100', // 后端定的默认值
      riskLabels: '',
      executeId: '',
      isAmount: 0,
      dataType: 0
    },
    taskDetailData: [],
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
      {
        placeholder: '任务状态',
        value: [],
        type: 'select',
        multiple: true,
        options: [
          // { text: '全部任务状态', value: 'all' }
        ]
      },
      {
        placeholder: '指派方式',
        value: '',
        type: 'select',
        options: [
          { text: '全部方式', value: 'all' }
        ]
      },
      { placeholder: '任务编号', value: '', type: 'text' },
      { placeholder: '当前处理人', value: '', type: 'text' }
    ],
    // 非动账类
    noAccountSearchForm: [
      { placeholder: '任务编号', value: '', type: 'text' },
      { placeholder: '用户标识', value: '', type: 'text' },
      // { placeholder: '登录账号', value: '', type: 'text' },
      { placeholder: '当前处理人', value: '', type: 'text' },
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
        placeholder: '生成时间',
        value: '',
        type: 'date'
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
        placeholder: '指派方式',
        value: '',
        type: 'select',
        options: [
          { text: '全部方式', value: 'all' }
        ]
      },
      {
        placeholder: '任务状态',
        value: [],
        type: 'select',
        multiple: true,
        options: [
          // { text: '全部任务状态', value: 'all' }
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
    pendingTaskHeaders: [],
    pendingTaskData: [],
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
      { text: '建议策略', value: 'strategy', sortable: false, width: 100 },
      { text: '生成时间', value: 'createTime', sortable: false, width: 120 },
      { text: '任务来源', value: 'src', sortable: false, width: 100 },
      { text: '指派方式', value: 'assignStyle', sortable: false, width: 100 },
      { text: '任务状态', value: 'stateName', sortable: false, width: 100 },
      { text: '当前处理人', value: 'nowExecutor', sortable: false, width: 100 },
      { text: '操作', value: 'action', sortable: false, width: 100 }
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
      { text: '任务状态', value: 'stateName', sortable: false, width: 100 },
      { text: '当前处理人', value: 'nowExecutor', sortable: false, width: 100 },
      { text: '操作', value: 'action', sortable: false, width: 100 }
    ],
    // 任务指派弹窗中的列表表头
    doPendingTaskHeaders: [],
    doPendingTaskData: [],
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
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    // 用户信息
    token: '',
    loginUserId: '',
    // 查询下拉框数据--用于表格中过滤中文
    allTradeTypeList: [],
    allStrategyList: [],
    allTaskResourceList: [],
    allAssignTypeList: [],
    // 是否为超级管理员
    isAdmin: false,
    // 角色列表
    roleIdenList: [],
    allRiskLabelList: [],
    statePrams: '',
    allAppList: [],
    ifdsOptypeList: [] // 风控平台，交易类型
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
        let data = sessionStorage.getItem('pendingTaskTab');
        if (data) {
          if (data === '0') {
            this.tab = 0;
            this.isAccountType = 1;
            this.searchForm = this.accountSearchForm;
            this.pendingTaskHeaders = this.accountTypeHeaders;
            this.searchData = this.accountSearchData;
          } else {
            this.tab = 1;
            this.isAccountType = 0;
            this.searchForm = this.noAccountSearchForm;
            this.pendingTaskHeaders = this.noAccountTypeHeaders;
            this.searchData = this.noAccountSearchData;
          }
          sessionStorage.removeItem('pendingTaskTab');
        }
        Promise.all([
          this.getTradeTypeList(),
          this.getCaseStrategyList(),
          this.getTaskResourceList(),
          this.getTaskStateList(),
          this.getassignTypetList(),
          this.getRiskLabelList(),
          this.getAppListData(),
          this.queryIfdsOptypeList() // 风控平台-交易类型查询
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
    },
    ifdsOpType: function (str, objList) { // 风控平台--交易类型
      return objList[str];
    }
  },
  created () {
    // 核查趋势获取任务状态
    let statePrams = this.$route.params.prams;
    if (statePrams) {
      this.statePrams = statePrams;
      this.accountSearchData.statesString = statePrams.value.split(',');
      this.accountSearchForm[0].value = this.getToday() + ' 至 ' + this.getToday();
      this.accountSearchData.createTimeStart = this.getToday() + ' 00:00:00';
      this.accountSearchData.createTimeEnd = this.getToday() + ' 23:59:59';
      this.noAccountSearchData.statesString = statePrams.value.split(',');
      this.noAccountSearchForm[5].value = this.getToday() + ' 至 ' + this.getToday();
      this.noAccountSearchData.createTimeStart = this.getToday() + ' 00:00:00';
      this.noAccountSearchData.createTimeEnd = this.getToday() + ' 23:59:59';
    }
    // 获取从事件提报详情路由传递回来的参数
    let routerParams = this.$route.params.accountType;
    if (routerParams !== undefined) {
      this.tab = routerParams ? 0 : 1;
      this.isAccountType = routerParams;
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    this.searchForm = this.isAccountType ? this.accountSearchForm : this.noAccountSearchForm;
    this.searchData = this.isAccountType ? this.accountSearchData : this.noAccountSearchData;
    this.pendingTaskHeaders = this.isAccountType ? this.accountTypeHeaders : this.noAccountTypeHeaders;
    if (localStorage.getItem('loginData')) {
      let loginData = JSON.parse(localStorage.getItem('loginData'));
      this.token = loginData.token;
      this.loginUserId = loginData.userId;
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    getToday () {
      let day = new Date();
      day.setTime(day.getTime());
      let today = day.getFullYear() + '-' + ((day.getMonth() + 1) < 10 ? '0' + (day.getMonth() + 1) : (day.getMonth() + 1)) +
        '-' + (day.getDate() < 10 ? '0' + day.getDate() : day.getDate());
      return today;
    },
    panelCounter: function () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 风控平台-交易类型
    async queryIfdsOptypeList () {
      this.ifdsOptypeList = [];
      const response = await dataService.queryIfdsOptypeList();
      if (response.data.code === 200) {
        this.ifdsOptypeList = response.data.data.optypeMap || {};
      }
    },
    // 获取交易类型
    async getTradeTypeList () {
      this.accountSearchForm[1].options = [{ text: '全部交易类型', value: 'all' }];
      this.allTradeTypeList = [];
      if (this.appId) {
        const param = {
          appId: this.appId,
          isAmount: this.$route.params.accountType !== undefined ? this.$route.params.accountType : this.isAccountType
        };
        const response = await dataService.queryTradeType(param);
        if (response.data.code === 200) {
          let resTradeTypeItems = response.data.data.tradeList;
          resTradeTypeItems && resTradeTypeItems.forEach(async (item, index, ary) => {
            if (this.isAccountType) { // 动账类标签下
              this.searchForm[1].options.push({
                text: item.tradeName,
                value: item.identifier
              });
            } else {
              this.searchForm[3].options.push({
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
        }
      }
    },
    // 获取建议策略下拉数据
    async getCaseStrategyList () {
      let param = {
        identifier: 'sys_strategy'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          if (!this.isAccountType) { // 非动账类标签下
            this.searchForm[4].options.push({
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
          this.searchForm[6].options.push({
            text: item.paramName,
            value: item.paramValue
          });
          this.allTaskResourceList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取任务状态下拉数据
    async getTaskStateList () {
      let param = {
        identifier: 'case_state'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          if (this.isAccountType) { // 动账类标签下
            this.searchForm[7].options.push({
              text: item.paramName,
              value: item.paramValue
            });
            this.searchForm[7].value = this.statePrams.value && this.statePrams.value.split(',');
          } else {
            this.searchForm[8].options.push({
              text: item.paramName,
              value: item.paramValue
            });
            this.searchForm[8].value = this.statePrams.value && this.statePrams.value.split(',');
          }
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
          if (this.isAccountType) { // 动账类标签下
            this.searchForm[8].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          } else {
            this.searchForm[7].options.push({
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
            { text: item.appName, value: item.id, tag: item.appTag }
          );
        });
      }
    },
    tabClick (data) {
      this.$route.params.accountType = undefined;
      this.clearDate = !this.clearDate;
      this.loading = true;
      this.pendingTaskData = [];
      if (data === '动账类') {
        this.tab = 0;
        this.isAccountType = 1;
        this.searchForm = this.accountSearchForm;
        this.pendingTaskHeaders = this.accountTypeHeaders;
        this.searchData = this.accountSearchData;
      } else {
        this.tab = 1;
        this.isAccountType = 0;
        this.searchForm = this.noAccountSearchForm;
        this.pendingTaskHeaders = this.noAccountTypeHeaders;
        this.searchData = this.noAccountSearchData;
      }
      this.searchData.opTypeList = '';
      // 切换tab时重置查询form
      if (!this.statePrams) {
        this.searchForm.forEach((item) => {
          item.value = '';
        });
      }
      this.getCaseStrategyList();
      this.getTaskResourceList();
      this.getTaskStateList();
      this.getassignTypetList();
      this.getRiskLabelList();
      this.getAppListData();
      this.getTradeTypeList();
    },
    // 点击搜索按钮
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
      this.pendingTaskData = [];
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
        queryTypes: 1
      };
      if (!this.searchData.statesString || this.searchData.statesString.length === 0) {
        this.searchData.statesString = '100';
      } else if (typeof this.searchData.statesString === 'object') {
        this.searchData.statesString = this.searchData.statesString.join(',');
      }
      let params = Object.assign({}, pageParams, this.searchData);
      const res = await dataService.queryTaskList(params);
      if (res.data.code === 200) {
        this.isAdmin = res.data.data.isAdmin;
        this.roleIdenList = res.data.data.roleIdenList; // 角色列表
        this.pendingTaskData = res.data.data.verifyList;
        this.totalItems = res.data.data.total;
        this.queryPageLength = res.data.data.totalPage;
        this.loading = false;
      }
    },
    // 首页列表的--指派按钮
    designate () {
      if (!this.isAdmin) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '您没有操作权限!';
        this.snackbarServeColor = 'error';
        return;
      }

      const isDesignateItems = this.selectedHeader.filter(item => item.assignment === 'false');
      // 检查当前角色是否可以进行指派操作
      const roleFlag = this.roleIdenList.some(item => item === 'admin' || item === 'normal');
      // 判断任务状态是否相同
      const sameAssignLevelLen = this.selectedHeader.filter(item => item.assignLevel === 0);
      const isAssignSame = (sameAssignLevelLen.length === this.selectedHeader.length) ||
        (sameAssignLevelLen.length + this.selectedHeader.length) === this.selectedHeader.length;
      if (roleFlag && !isDesignateItems.length && isAssignSame) {
        this.doPendingTaskHeaders = this.pendingTaskHeaders.slice(0, this.pendingTaskHeaders.length - 1);
        this.doPendingTaskData = this.selectedHeader;
        let params = {
          titleInfo: {
            actionTitle: '设置指派审核流',
            isTransfer: false
          },
          dataHeaders: this.doPendingTaskHeaders,
          dataItems: this.doPendingTaskData,
          isAmount: this.isAccountType,
          assignLevel: this.selectedHeader[0].assignLevel
        };
        this.toSecondRouterPage(params);
        sessionStorage.setItem('pendingTaskTab', this.tab);
        this.$router.push('/designateOrTransfer');
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = `您不能指派当前选择的任务!`;
        this.snackbarServeColor = 'error';
      }
    },
    async serTaskState (item) {
      // if (item.markTimeoutState === null) { // 此时改变任务状态为初审中或复审中
      let examineType = '';
      if (item.state >= 3 && item.state < 6) {
        examineType = '0'; // 初审
      } else if (item.state > 6 && item.state < 10) {
        examineType = '1'; // 复审
      }
      const params = {
        verifyId: item.id,
        examineType: examineType
      };
      await dataService.setTaskState(params);
    },
    // 首页列表的查看详情按钮
    async queryDetailItem (item) {
      this.serTaskState(item); // 点击查看详情按钮后，改变当前任务状态
      if (!this.isAdmin) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '您没有操作权限!';
        this.snackbarServeColor = 'error';
        return;
      }

      let listArr = [];
      if (!this.searchData.opTypeList) {
        for (let i = 0; i < this.allTradeTypeList.length; i++) {
          listArr.push(this.allTradeTypeList[i].value);
        }
        this.searchData.opTypeList = listArr.join(',');
      }
      // 传递给详情页，用于转派时进行判断
      let roleType = '';
      if ((item.state >= 3 && item.state < 7) || item.state === 11 || item.state === 12) {
        roleType = 'first';
      } else if ((item.state >= 7 && item.state < 10) || item.state === 13 || item.state === 14) {
        roleType = 'second';
      }

      let params = {
        id: item.id,
        dataGroupId: item.dataGroupId,
        isGroup: item.isGroup,
        token: this.token
      };
      const res = await dataService.checkTaskDetail(params);
      if (res.data.code === 200) {
        // 传递到任务详情页的参数
        let detailItems = {
          id: item.id,
          title: '待处理任务',
          state: item.state,
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
          roleType: roleType,
          allTradeTypeList: this.allTradeTypeList,
          ifdsOptypeList: this.ifdsOptypeList,
          taskStateName: '待处理任务'
        };
        detailItems.accountTypeHeaders[detailItems.accountTypeHeaders.length - 1].text = '查看详情';
        detailItems.noAccountTypeHeaders[detailItems.noAccountTypeHeaders.length - 1].text = '查看详情';
        this.toSecondRouterPage(detailItems);
        sessionStorage.setItem('pendingTaskTab', this.tab);
        this.$router.push('/caseTaskDetail');
      }
    },
    // 点击首页表格的转派按钮
    transfer () {
      if (!this.isAdmin) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '您没有操作权限!';
        this.snackbarServeColor = 'error';
        return;
      }

      const isTransferItems = this.selectedHeader.filter(item => item.tranfer === 'false');
      // 检查当前角色是否可以进行转派操作
      const roleFlag = this.roleIdenList.some(item => item === 'first' || item === 'second' || 'admin');
      if (roleFlag && !isTransferItems.length) {
        this.doPendingTaskHeaders = this.pendingTaskHeaders.slice(0, this.pendingTaskHeaders.length - 1);
        this.doPendingTaskData = this.selectedHeader;
        // 判断所选择任务的状态是否相同
        const firstFlag = this.doPendingTaskData.some(item => item.state >= 3 && item.state < 7);
        const secondFlag = this.doPendingTaskData.some(item => item.state >= 7 && item.state < 10);
        if (firstFlag && secondFlag) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '操作失败，请选择任务状态相同的任务!';
          this.snackbarServeColor = 'error';
          return;
        }
        let roleType = ''; // 区分初审后复审
        if (this.doPendingTaskData.every(item => (item.state >= 3 && item.state < 7) || item.state === 11 || item.state === 12)) {
          roleType = 'first';
        } else if (this.doPendingTaskData.every(item => (item.state >= 7 && item.state < 10) || item.state === 13 || item.state === 14)) {
          roleType = 'second';
        }
        let params = {
          titleInfo: {
            actionTitle: '任务转派',
            isTransfer: true
          },
          dataHeaders: this.doPendingTaskHeaders,
          dataItems: this.doPendingTaskData,
          roleType: roleType,
          isAmount: this.isAccountType
        };
        this.toSecondRouterPage(params);
        sessionStorage.setItem('pendingTaskTab', this.tab);
        this.$router.push('/designateOrTransfer');
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = `您不能转派当前选择的任务!`;
        this.snackbarServeColor = 'error';
      }
    },
    // 表格内指派按钮
    designateSingle (item) {
      if (!this.isAdmin) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '您没有操作权限!';
        this.snackbarServeColor = 'error';
        return;
      }
      if ((!(item.state > 0 && item.state < 3) && item.state !== 6) && (item.assignLevel !== 1 && item.state !== 6)) {
        this.snackbarServe = true;
        this.snackbarServeMsg = `您只能指派待分配的任务!`;
        this.snackbarServeColor = 'error';
        return;
      }
      // 检查当前角色是否可以进行指派操作
      const roleFlag = this.roleIdenList.some(item => item === 'admin' || item === 'normal');
      if (roleFlag && item.assignment === 'true') {
        this.doPendingTaskHeaders = this.pendingTaskHeaders.slice(0, this.pendingTaskHeaders.length - 1);
        this.doPendingTaskData = [item];
        let params = {
          titleInfo: {
            actionTitle: '设置指派审核流',
            isTransfer: false
          },
          dataHeaders: this.doPendingTaskHeaders,
          dataItems: this.doPendingTaskData,
          isAmount: this.isAccountType,
          allStrategyList: this.allStrategyList,
          assignLevel: item.assignLevel,
          state: item.state
        };
        this.toSecondRouterPage(params);
        sessionStorage.setItem('pendingTaskTab', this.tab);
        this.$router.push('/designateOrTransfer');
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = '您没有权限对当前任务进行指派!';
        this.snackbarServeColor = 'error';
      }
    },
    // 表格内转派按钮
    transferSingle (item) {
      if (!this.isAdmin) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '您没有操作权限!';
        this.snackbarServeColor = 'error';
        return;
      }

      // 检查当前角色是否可以进行转派操作
      const roleFlag = this.roleIdenList.some(item => item === 'first' || item === 'second' || item === 'normal' || item === 'admin');
      if (roleFlag && item.tranfer === 'true') {
        this.doPendingTaskHeaders = this.pendingTaskHeaders.slice(0, this.pendingTaskHeaders.length - 1);
        this.doPendingTaskData = [item];
        let roleType = '';
        if ((item.state >= 3 && item.state < 7) || item.state === 11 || item.state === 12) {
          roleType = 'first';
        } else if ((item.state >= 7 && item.state < 10) || item.state === 13 || item.state === 14) {
          roleType = 'second';
        }
        let params = {
          titleInfo: {
            actionTitle: '任务转派',
            isTransfer: true
          },
          dataHeaders: this.doPendingTaskHeaders,
          dataItems: this.doPendingTaskData,
          roleType: roleType,
          isAmount: this.isAccountType,
          roleIdenList: this.roleIdenList,
          allStrategyList: this.allStrategyList
        };
        this.toSecondRouterPage(params);
        sessionStorage.setItem('pendingTaskTab', this.tab);
        this.$router.push('/designateOrTransfer');
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = '您没有权限对当前任务进行转派!';
        this.snackbarServeColor = 'error';
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
