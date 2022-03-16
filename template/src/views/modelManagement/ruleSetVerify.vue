<template>
    <div class="my-2 mt-0 fill-height">
        <div class="tab-Warp">
            <v-tabs style="padding:0;" v-model="tab">
                <v-tab
                    v-for="(item,index) in tabItems"
                    :key = "index"
                    @click="tabClick(index)"
                   >
                    {{item.tabName}}
                </v-tab>
            </v-tabs>
        </div><!--tab模块-->
        <div>
           <!-- 搜索表单 -->
          <base-search
            :fieldList="searchForm"
            @search="search($event)"
            @reset="resetSearchData($event)"
            :clearDate="clearDate"
            @change="panelCounter"
          ></base-search>
          <!--表格数据区域--->
           <v-data-table
                  :fixed-header="true"
                  :headers="ruleSetVefifyHeaders"
                  :items="ruleSetVefifytData"
                  hide-default-footer
                  class="elevation-3 mt-3"
                  :loading="loading"
                  loading-text="加载数据中..."
                  no-results-text="没有匹配的数据"
                  :height="tableHeight"
            >
          <!--tab切换区域--->
           <template v-slot:top>
            <v-toolbar flat height="60px">
              <v-toolbar-title style="font-size:18px">
                {{ isAccountType === 0 ? '待审核' :(isAccountType === 1 ?'已审核':'我提交的')}}
              </v-toolbar-title>
            </v-toolbar>
          </template>
      <template v-slot:item.setName="{ item }">
        <span :title="`${item.setName}`">{{ item.setName | ellipsis(16) }}</span>
      </template>
      <template v-slot:item.organizationId="{ item }">
        <span
          :title="item.organizationId | rulesetOrganization(organizationList)">{{ item.organizationId | rulesetOrganization(organizationList) | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.appId="{ item }">
        <span :title="item.appId | rulesetApplication(applications)">{{ item.appId | rulesetApplication(applications) | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.transactionTypeId="{ item }">
        <span :title="item.transactionTypeId | rulesetTradeTypes(tradeTypes)">{{ item.transactionTypeId | rulesetTradeTypes(tradeTypes) | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.matchingModel="{ item }">
        <span :title="item.matchingModel | filtersShowRuleMatchingModel(ruleMatchingModels)">{{ item.matchingModel | filtersShowRuleMatchingModel(ruleMatchingModels) | ellipsis(8) }}</span>
      </template>

       <template v-slot:item.status="{ item }">
        <span
          :title="item.status | rulesetStatus(rulesetStatus)"
        >{{ item.status | rulesetStatus(rulesetStatus) | ellipsis(8) }}</span>
      </template>
          <!---表格操作区域设置-->
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  color="primary"
                  v-on="on"
                  @click="editRultCheckStatus(item)"
                >
                  mdi-square-edit-outline
                </v-icon>
              </template>
              <span>编辑</span>
            </v-tooltip>
          </template>
          <!--表格无数据区域-->
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
        </div>
  <!-- 调接口结果的提示框 -->
      <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >{{ snackbarServeMsg }}</v-snackbar>
    </div><!--最外部div-->
</template>

<script>
import * as dataService from 'api/ruleSet';
import { getRuleExamineSearchData } from '@/utils/generalDataTableHeaders';
import BaseSearch from '@c/BaseSearch';
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
export default {
  name: 'ruleSetVerify',
  components: {
    BaseSearch
  },
  filters: {

    // 规则集匹配模式
    filtersShowRuleMatchingModel: function (dataStr, ruleMatchingModels) {
      var ruleMatchingModelText = '';
      ruleMatchingModels.forEach(element => {
        if (dataStr === element.value) {
          ruleMatchingModelText = element.text;
        }
      });
      return ruleMatchingModelText;
    },
    // 规则集状态
    rulesetStatus: function (dataStr, rulesetStatusList) {
      var rulesetStatus = '';
      rulesetStatusList.forEach(element => {
        if (dataStr === element.value) {
          rulesetStatus = element.text;
        }
      });

      return rulesetStatus;
    },
    // 规则集所属机构
    rulesetOrganization: function (dataStr, OrganizationList) {
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var organization = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < OrganizationList.length; j++) {
            if (element === OrganizationList[j].id) {
              organization.push(OrganizationList[j].label);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return organization.join('、');
      }
    },
    // 规则集交易类型
    rulesetTradeTypes: function (dataStr, tradeTypeList) {
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var tradeType = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < tradeTypeList.length; j++) {
            if (element === tradeTypeList[j].id) {
              tradeType.push(tradeTypeList[j].tradeName);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return tradeType.join('、');
      }
    },
    // 规则集所属应用
    rulesetApplication: function (dataStr, ApplicationList) {
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var Application = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < ApplicationList.length; j++) {
            if (element === ApplicationList[j].id) {
              Application.push(ApplicationList[j].appName);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return Application.join('、');
      }
    }
  },
  data () {
    return {
      counter: 0,
      fullHeight: window.innerHeight,
      // 表格数据加载loading动画
      token: '',
      loading: true,
      isAccountType: 0,
      // 是否展示提报弹窗
      tab: 0,
      tabItems: [
        { tabName: '待审核' },
        { tabName: '已审核' },
        { tabName: '我提交的' }
      ],
      // 机构的数组
      organizationList: [],
      // 所属应用
      applications: [],
      appIDList: [],
      // 交易类型
      tradeTypes: [],
      // // 规则匹配模式
      ruleMatchingModels: [
        { text: '最坏匹配', value: 'WORST_MATCH' },
        { text: '首次匹配', value: 'FIRST_MATCH' },
        { text: '评分模式', value: 'SCORE_MATCH' }
      ],

      // 审核状态 1、待提审 2、审核中 3、驳回

      rulesetStatus: [
        { value: 1, text: '通过' },
        { value: 2, text: '驳回' },
        { value: 3, text: '审核中' }
      ],
      searchForm: [],
      // 搜索组件数据

      // 搜索参数
      searchData: {},
      // 表格的vModel
      selectedHeader: [],
      // 待审核查询参数
      checkPendSearchData: {
        setName: '', // 规则集名称
        organizationId: '', // 所属公司
        appId: '', // 所属应用
        transactionTypeId: '', // 交易类型
        examineName: '',
        beginTime: '',
        endTime: ''
      },
      // // 已审核查询参数
      // reviewedSearchData: {
      //   setName: '',
      //   organizationId: '',
      //   appId: '',
      //   transactionTypeId: '',
      //   opType: '',
      //   strategy: '',
      //   beginTime: '',
      //   endTime: '',
      //   state: '',
      //   amount: 0
      // },
      // 我提交的查询参数
      submittedSearchData: {
        setName: '', // 规则集名称
        organizationId: '', // 所属公司
        appId: '', // 所属应用
        transactionTypeId: '', // 交易类型
        auditorsName: '',
        createTimeStart: '',
        createTimeEnd: '',
        status: ''
      },
      clearDate: false,
      // 搜索组件数据
      // 待审核查询字段 已审核查询字段
      checkPendSearchForm: [
        { placeholder: '规则集名称', value: '', type: 'text' },
        { placeholder: '所属公司', value: '', type: 'select', options: [ { value: 'all', text: '全部公司' } ] },
        { placeholder: '所属应用', value: '', type: 'select', options: [{ text: '全部应用', value: 'all' }] },
        { placeholder: '交易类型', value: '', type: 'select', options: [] },
        { placeholder: '提交人', value: '', type: 'text' },
        { placeholder: '提交时间', value: '', type: 'date' }
      ],
      // 已审核查询字段
      // reviewedSearchForm: [
      //   { placeholder: '规则集名称', value: '', type: 'text' },
      //   { placeholder: '所属公司', value: '', type: 'select' },
      //   { placeholder: '所属应用', value: '', type: 'select' },
      //   { placeholder: '交易类型', value: '', type: 'select' },
      //   { placeholder: '提交人', value: '', type: 'text' },
      //   { placeholder: '提交时间', value: '', type: 'date' }
      // ],
      // 我提交的
      submittedSearchFrom: [
        { placeholder: '规则集名称', value: '', type: 'text' },
        { placeholder: '所属公司', value: '', type: 'select', options: [ { value: 'all', text: '全部公司' } ] },
        { placeholder: '所属应用', value: '', type: 'select', options: [{ text: '全部应用', value: 'all' }] },
        { placeholder: '交易类型', value: '', type: 'select', options: [] },
        { placeholder: '审核人', value: '', type: 'text' },
        { placeholder: '提交时间', value: '', type: 'date' },
        { placeholder: '审核结果',
          value: '',
          type: 'select',
          options: [ { value: 1, text: '通过' },
            { value: 2, text: '驳回' }] }
      ],
      ruleSetVefifyHeaders: [], // 表头数据
      ruleSetVefifytData: [], // 表格内容数据

      // 分页变量
      pageNum: 1,
      // pageSize: 10,
      pagination: false,
      rulePageSize: 1000,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20],
      // 待审核表格头部字段
      checkPendHeaders: [
        { text: '规则集名称', value: 'setName', sortable: false, width: 100 },
        { text: '所属公司', value: 'organizationId', sortable: false, width: 100 },
        { text: '所属应用', value: 'appId', sortable: false, width: 100 },
        { text: '交易类型', value: 'transactionTypeId', sortable: false, width: 100 },
        { text: '规则匹配模式', value: 'matchingModel', sortable: false, width: 110 },
        { text: '版本', value: 'version', sortable: false, width: 80 },
        { text: '提交人', value: 'creatorName', sortable: false, width: 100 },
        { text: '提交时间', value: 'createTime', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      // 已审核表格头部字段
      reviewedHeaders: [
        { text: '规则集名称', value: 'setName', sortable: false, width: 100 },
        { text: '所属公司', value: 'organizationId', sortable: false, width: 100 },
        { text: '所属应用', value: 'appId', sortable: false, width: 100 },
        { text: '交易类型', value: 'transactionTypeId', sortable: false, width: 100 },
        { text: '规则匹配模式', value: 'matchingModel', sortable: false, width: 110 },
        { text: '版本', value: 'version', sortable: false, width: 80 },
        { text: '提交人', value: 'creatorName', sortable: false, width: 100 },
        { text: '提交时间', value: 'createTime', sortable: false, width: 100 },
        { text: '审核结果', value: 'status', sortable: false, width: 100 },
        { text: '审核完成时间', value: 'endTime', sortable: false, width: 110 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      // 我提交的表格头部字段
      submittedHeaders: [
        { text: '规则集名称', value: 'setName', sortable: false, width: 100 },
        { text: '所属公司', value: 'organizationId', sortable: false, width: 100 },
        { text: '所属应用', value: 'appId', sortable: false, width: 100 },
        { text: '交易类型', value: 'transactionTypeId', sortable: false, width: 100 },
        { text: '规则匹配模式', value: 'matchingModel', sortable: false, width: 110 },
        { text: '版本', value: 'version', sortable: false, width: 80 },
        { text: '提交时间', value: 'createTime', sortable: false, width: 100 },
        { text: '审核人', value: 'auditorsName', sortable: false, width: 100 },
        { text: '审核结果', value: 'status', sortable: false, width: 100 },
        { text: '审核完成时间', value: 'endTime', sortable: false, width: 110 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],

      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      timeout: 2000,
      isSnackbarTop: true

    };
  },
  created () {
    let sessionS = window.sessionStorage;
    // 获取搜索条件的缓存
    let searchParamsForSession = sessionS.getItem('searchParam');
    // if (searchParamsForSession) {
    //   searchParamsForSession = JSON.parse(searchParamsForSession);
    // }
    // if (searchParamsForSession && searchParamsForSession.length) {
    //   for (let index = 0; index < searchParamsForSession.length; index++) {
    //     this.searchData[index].value = searchParamsForSession[index];
    //     this.searchData[Object.keys(this.searchData)[index]] = searchParamsForSession[index];
    //     if (searchParamsForSession[index] === 'all') {
    //       this.searchData[Object.keys(this.searchData)[index]] = '';
    //     }

    //     if (searchParamsForSession[index]) {
    //       this.panel = 0;
    //     }
    //   }
    // }
    // 获取分页相关缓存
    this.perPageNum = sessionS.getItem('perPageNum') ? parseInt(sessionS.getItem('perPageNum')) : 10;
    this.pageNum = sessionS.getItem('pageNum') ? parseInt(sessionS.getItem('pageNum')) : 1;
    // 缓存当前tab
    if (sessionStorage.getItem('tabValue')) {
      this.tab = Number(sessionStorage.getItem('tabValue'));
      this.isAccountType = Number(sessionStorage.getItem('tabValue'));
      this.tabChangeFechlist(this.isAccountType, this.pageNum);
      sessionStorage.removeItem('tabValue');
    } else {
      this.tab = 0;
      this.tabChangeFechlist(this.isAccountType, this.pageNum);
    }

    // this.fetchPendingList(); // 待审核列表查询
    this.getApplicationList();
    this.getOrganizationList();
    this.getAllTradeTypeList();
  },
  computed: {
    ...mapGetters([
      'appId',
      'secondLevelRouterItems',
      'pageTabs'
    ]),
    dateRangeText: {
      get () {
        if (moment(this.searchForm.dates[0]).valueOf() < moment(this.searchForm.dates[1]).valueOf()) {
        } else if (moment(this.searchForm.dates[0]).valueOf() > moment(this.searchForm.dates[1]).valueOf()) {
          this.reverseArry(this.searchForm.dates);
        }
        return this.searchForm.dates.join(' 至 ');
      },
      set (newVal) {}
    },
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 314;
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    // 判断当前是在动账类下还是非动账类下
    this.searchForm = this.isAccountType === 0 ? this.checkPendSearchForm : (this.isAccountType === 1 ? this.checkPendSearchForm : this.submittedSearchFrom);
    this.searchData = this.isAccountType === 0 ? this.checkPendSearchData : (this.isAccountType === 1 ? this.checkPendSearchData : this.submittedSearchData);

    this.ruleSetVefifyHeaders = this.isAccountType === 0 ? this.checkPendHeaders : (this.isAccountType === 1 ? this.reviewedHeaders : this.submittedHeaders);
    if (localStorage.getItem('loginData')) {
      let loginData = JSON.parse(localStorage.getItem('loginData'));
      this.token = loginData.token;
      this.loginUserId = loginData.userId;
    }
    // Promise.all([
    //   this.fetchPendingList(), // 待审核列表查询
    //   this.getTradeTypeList(),

    // ]);
  },
  methods: {
    // tab切换
    async tabClick (index) {
      this.isAccountType = index;
      // let sStorage = window.sessionStorage
      // index =sStorage.getItem('tabValue')
      if (index === 0) {
        this.searchForm = this.checkPendSearchForm;
        this.searchData = this.checkPendSearchData;// 获取数据
        this.ruleSetVefifyHeaders = this.checkPendHeaders;// 表头赋值
        this.fetchPendingList(); // 待审核列表查询
      } else if (index === 1) {
        this.searchForm = this.checkPendSearchForm;
        this.searchData = this.checkPendSearchData;// 获取数据
        this.ruleSetVefifyHeaders = this.reviewedHeaders;// 表头赋值

        this.fetchMyAuditedList();// 已审核列表
      } else if (index === 2) {
        this.searchForm = this.submittedSearchFrom;
        this.searchData = this.submittedSearchData;
        this.ruleSetVefifyHeaders = this.submittedHeaders;// 表头赋值
        this.fetchMySubmittedAudit(); // 我提交的列表
      }
      // 切换tab时重置查询form
      this.searchForm.forEach((item) => {
        item.value = '';
      });
    },
    // 默认请求 待审核列表
    async fetchPendingList () {
      this.loading = true;
      let pageParams = {
        pageIndex: this.pageNum,
        size: this.perPageNum
      };
      let searchData = JSON.parse(JSON.stringify(this.searchData));
      const params = Object.assign({}, pageParams, searchData);
      console.log(params, searchData, 'params----待审核');
      const response = await dataService.getPendingAudit(params);
      const code = response.data.code;
      if (code === 200) {
        this.loading = false;
        this.ruleSetVefifytData = response.data.data.pendingRulesetAudits;
        this.totalItems = response.data.data.count; // 总页数
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
        // console.log(this.perPageNum, '待审核列表');
        // this.queryPageLength = response.data.pages
      }
      // console.log(this.ruleSetVefifytData, '待审核数据');
    },
    // 已审核列表数据获取
    async fetchMyAuditedList () {
      this.loading = true;
      let pageParams = {
        pageIndex: this.pageNum,
        size: this.perPageNum
      };
      let searchData = JSON.parse(JSON.stringify(this.searchData));
      let params = Object.assign({}, pageParams, searchData);
      const response = await dataService.getMyAuditedList(params);
      const code = response.data.code;
      if (code === 200) {
        // 获取已审核数据
        this.loading = false;
        if (response.data.data.RulesetAuditedList) {
          this.ruleSetVefifytData = response.data.data.RulesetAuditedList;
          this.totalItems = response.data.data.count;
        } else {
          this.ruleSetVefifytData = []; // 无数据
          this.totalItems = 0;
          // this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
        }
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      } else {
        this.ruleSetVefifytData = [];
        this.snackbarServe = true;
        this.snackbarServeColor = response.msg;
      }
    },
    //  我提交的列表数据获取
    async fetchMySubmittedAudit () {
      this.loading = true;
      let pageParams = {
        pageIndex: this.pageNum,
        size: this.perPageNum
      };
      let searchData = JSON.parse(JSON.stringify(this.searchData));
      let params = Object.assign({}, pageParams, searchData);
      const response = await dataService.getmySubmittedAudit(params);
      const code = response.data.code;
      if (code === 200) {
        this.loading = false;
        this.ruleSetVefifytData = response.data.data.submitRulesetAudits;
        this.totalItems = response.data.data.count;
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      } else {
        this.ruleSetVefifytData = []; // 先清空在重新请求
      }
    },
    // 点击搜索按钮
    search ($event) {
      // console.log($event, 'dddd');
      this.searchData = getRuleExamineSearchData($event);
      this.pageNum = 1; // 默认从第一页开始查询
      let tabValue = this.isAccountType;
      this.tabChangeFechlist(tabValue, this.pageNum);
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.clearDate = !this.clearDate;
      this.searchData = this.isAccountType === 0 ? this.checkPendSearchData : (this.isAccountType === 1 ? this.checkPendSearchData : this.submittedSearchData);
      this.pageNum = 1; // 默认从第一页开始查询
      let tabValue = this.isAccountType;
      this.tabChangeFechlist(tabValue, this.pageNum);
      // this.searchData = this.isAccountType ? this.accountSearchData : this.noAccountSearchData;
      // this.pageNum = 1; // 默认从第一页开始查询
      // this.getDataList();
    },
    // 切换页码
    onPageChange (page) {
      console.log(this.isAccountType, this.perPageNum, page, '当前tab');
      let tabValue = this.isAccountType;
      this.tabChangeFechlist(tabValue, page);
    },
    // 切换每页显示几条数据
    pageChange (page) {
      let tabValue = this.isAccountType;
      this.tabChangeFechlist(tabValue, page);
    },
    // tab切换请求不同tab下的列表数据
    tabChangeFechlist (tabValue, page) {
      switch (tabValue) {
        case 0:
          this.pageSize = page;
          this.fetchPendingList(page);
          break;
        case 1:
          this.pageSize = page;
          this.fetchMyAuditedList(page);
          break;
        case 2:
          this.pageSize = page;
          this.fetchMySubmittedAudit(page);
          break;
      }
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    panelCounter: function () {
      this.counter += 1;
    },
    // 首页列表的编辑按钮
    editRultCheckStatus (item) {
      console.log(item, '编辑');
      // let detailItems = {
      //   isAccountType: this.isAccountType,
      //   tradeTypeItems: this.tradeTypeItems,
      //   caseStrategyItems: this.caseStrategyItems,
      //   dataItem: item
      // };
      // this.toSecondRouterPage(detailItems);

      let sStorage = window.sessionStorage;
      // // // 规则集基本信息
      sStorage.setItem('ruleSetVerifyInfo', JSON.stringify(item));
      sStorage.setItem('tabValue', this.isAccountType);
      sStorage.setItem('pageNum', this.pageNum);
      this.$router.push('/ruleCheckDetail');
    },

    // 获取枚举下拉数据  机构
    async getOrganizationList () {
      const params = {
        enumerateId: 'ORGANIZATION'
      };
      try {
        const response = await dataService.getSubordinateFirm();
        this.organizations = response.data.data.companyItems;
        this.organizationList = response.data.data.companyItems;
        //  console.log(this.organizations,'所属公司11111');
        if (this.organizations.length > 0) {
          this.organizations.forEach((item, index, ary) => {
            this.checkPendSearchForm[1].options.push({ text: item.label, value: item.id }); // 待审核，已审核
            this.submittedSearchFrom[1].options.push({ text: item.label, value: item.id }); // 我提交的
          });

          // this.loading = false;
        }
      } catch (error) {}
    },
    // 获取枚举下拉数据  应用
    async getApplicationList () {
      let params = {
        states: 1,
        appName: '',
        spid: '',
        appTag: '',
        appType: ''
      };
      try {
        const response = await dataService.getApp(params);
        this.applications = response.data.data;
        this.checkPendSearchForm[2].options.push({ text: '全部应用', value: 'all' }); // 待审核，已审核
        this.submittedSearchFrom[2].options.push({ text: '全部应用', value: 'all' }); // 我提交的
        this.applications.forEach(element => {
          this.appIDList.push(element.id);
          this.checkPendSearchForm[2].options.push({ text: element.appName, value: element.id }); // 待审核，已审核
          this.submittedSearchFrom[2].options.push({ text: element.appName, value: element.id }); // 我提交的
        });
        this.getTradeTypeList(this.appIDList, 1);
        this.loading = false;
      } catch (error) {}
    },
    // 获取枚举下拉数据  所有交易类型（系统参数库取）
    async getAllTradeTypeList () {
      const params = {
        tradeName: '',
        identifier: '',
        isAmount: ''
      };
      try {
        const response = await dataService.findtradelist(params);
        this.tradeTypes = response.data.data;
        this.loading = false;
      } catch (error) {}
    },
    // 获取所选应用下的交易类型
    async getTradeTypeList (param, forWhat) {
      let ids;
      if (forWhat === 1) {
        if (typeof param === 'string') {
          ids = [param];
        }
        if (typeof param === 'object') {
          ids = param;
        }
      } else {
        ids = param;
      }
      const params = {
        jsonIds: JSON.stringify(ids)
      };
      try {
        const response = await dataService.getTradeType(params);
        if (response.data.code < 0) {
          response.data.data = [];
        }
        this.loading = false;
        // 搜索的应用选中
        if (forWhat === 1) {
          this.checkPendSearchForm[3].options.push({ text: '全部交易类型', value: 'allOfOne' }); // 待审核，已审核
          this.submittedSearchFrom[3].options.push({ text: '全部交易类型', value: 'allOfOne' }); // 我提交的
          // 返回的交易类型有值
          if (response.data.data.length) {
            response.data.data.forEach(element => {
              this.checkPendSearchForm[3].options.push({ text: element.tradeName, value: element.id }); // 待审核，已审核
              this.submittedSearchFrom[3].options.push({ text: element.tradeName, value: element.id }); // 我提交的
            });
          } else {
            this.checkPendSearchForm[3].options = [];
            this.submittedSearchFrom[3].options = [];
          }
        } else {
          // 新增和编辑的应用选择

        }
      } catch (error) {}
    },
    // 离开规则集页面 可以访问到组件实例this
    beforeRouteLeave (to, from, next) {
    // 如果跳转的页面是规则集详情的页面 搜索条件有值 缓存
      let searchParamsForSession = {};
      this.searchData.forEach(item => {
        searchParamsForSession[item.placeholder] = item.value || '';
      });
      if (to.name === 'ruleCheckDetail') {
        window.sessionStorage.setItem('searchParam', JSON.stringify(Object.values(searchParamsForSession)));
        window.sessionStorage.setItem('perPageNum', this.perPageNum);
        window.sessionStorage.setItem('pageNum', this.pageNum);
        console.log(this.isAccountType, '跳转页面22323');
      } else {
        window.sessionStorage.setItem('searchParam', '');
        window.sessionStorage.setItem('perPageNum', 10);
        window.sessionStorage.setItem('pageNum', 1);
        // window.sessionStorage.setItem('tabValue', '待审核');
      }
      next();
    }
    //
  }
};
</script>

<style lang='stylus' scoped>
>>> .v-select__slot {
   display: -webkit-inline-box;
}
</style>
