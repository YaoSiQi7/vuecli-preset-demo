<!--author：FuCheng -->
<!--updateTime：2021-04-07-->
<template>
  <div>
    <!--tab-->
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
      <!--搜索-->
      <base-search
        :fieldList="searchForm"
        @search="search($event)"
        @reset="resetSearchData($event)"
        :clearDate="clearDate"
        @change="panelCounter"
      ></base-search>
      <!--列表-->
      <v-data-table
        :headers="pendingTaskHeaders"
        :items="pendingTaskData"
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
              {{ tab === 0 ? '动账日志' : '非动账日志'}}
            </v-toolbar-title>
          </v-toolbar>
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
                mdi-card-account-details
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
    </div>
  </div>
</template>

<script>
import BaseSearch from '@c/BaseSearchThree';
import { batchServiceSearch } from '@/utils/generalDataTableHeaders';
import { queryTradeType, findsysParams } from 'api/caseManagementCenter/pendingTask';
import * as dataService from 'api/riskControlLog';
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'batchServiceStatistics',
  components: {
    BaseSearch
  },
  data () {
    return {
      counter: 0,
      fullHeight: window.innerHeight,
      tab: 0,
      tabItems: [
        { tabName: '动账日志' },
        { tabName: '非动账日志' }
      ],
      clearDate: false,
      // 搜索数据
      searchData: {},
      // 动账日志搜索数据
      accountSearchData: {
        batchId: '', // 批次号
        outAccount: '', // 出账账号
        outName: '', // 出账人姓名
        tradeTimeStart: '', // 交易开始时间
        tradeTimeEnd: '', // 交易结束时间
        businessOrgCode: '', // 机构号
        opType: '', // 交易类型
        riskTimeStart: '', // 风控开始时间
        riskTimeEnd: '', // 风控结束时间
        strategy: '', // 处置类型
        dataType: 1
      },
      // 非动账日志搜索数据
      noAccountSearchData: {
        batchId: '', // 批次号
        outAccount: '', // 出账账号
        outName: '', // 出账人姓名
        tradeTimeStart: '', // 交易开始时间
        tradeTimeEnd: '', // 交易结束时间
        businessOrgCode: '', // 机构号
        opType: '', // 交易类型
        riskTimeStart: '', // 风控开始时间
        riskTimeEnd: '', // 风控结束时间
        strategy: '', // 处置类型
        dataType: 0
      },
      // 搜索组件数据
      searchForm: [],
      // 动账日志
      accountSearchForm: [
        { placeholder: '批次号', value: '', type: 'text' },
        { placeholder: '出账账号', value: '', type: 'text' },
        { placeholder: '出账人姓名', value: '', type: 'text' },
        {
          placeholder: '交易时间',
          value: [],
          type: 'date',
          dates: []
        },
        { placeholder: '业务归属机构', value: '', type: 'text' },
        {
          placeholder: '交易类型',
          value: '',
          type: 'select',
          options: [
            { text: '全部交易类型', value: 'all' }
          ]
        },
        {
          placeholder: '风控时间',
          value: [],
          type: 'date',
          dates: []
        },
        {
          placeholder: '处置策略',
          value: '',
          type: 'select',
          options: [
            { text: '全部处置策略', value: 'all' }
          ]
        }
      ],
      // 非动账日志
      noAccountSearchForm: [
        { placeholder: '批次号', value: '', type: 'text' },
        {
          placeholder: '交易时间',
          value: [],
          type: 'date',
          dates: []
        },
        { placeholder: '业务归属机构', value: '', type: 'text' },
        {
          placeholder: '交易类型',
          value: '',
          type: 'select',
          options: [
            { text: '全部交易类型', value: 'all' }
          ]
        },
        {
          placeholder: '风控时间',
          value: [],
          type: 'date',
          dates: []
        },
        {
          placeholder: '处置策略',
          value: '',
          type: 'select',
          options: [
            { text: '全部处置策略', value: 'all' }
          ]
        }
      ],
      // 列表头部
      pendingTaskHeaders: [],
      // 动账日志
      accountTypeHeaders: [
        { text: '批次号', value: 'batchId', sortable: false, width: 100 },
        { text: '出账账号', value: 'outAccount', sortable: false, width: 100 },
        { text: '出账人姓名', value: 'outName', sortable: false, width: 100 },
        { text: '入账账号数', value: 'inAccountCount', sortable: false, width: 100 },
        { text: '交易总金额', value: 'tradeAmount', sortable: false, width: 100 },
        { text: '交易笔数', value: 'tradeCount', sortable: false, width: 100 },
        { text: '交易时间', value: 'tradeTime', sortable: false, width: 140 },
        { text: '业务归属机构', value: 'businessOrgCode', sortable: false, width: 120 },
        { text: '交易类型', value: 'opType', sortable: false, width: 100 },
        { text: '风控时间', value: 'riskTime', sortable: false, width: 140 },
        { text: '处置策略', value: 'strategy', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      // 非动账日志
      noAccountTypeHeaders: [
        { text: '批次号', value: 'batchId', sortable: false, width: 100 },
        { text: '新开账户数', value: 'tradeCount', sortable: false, width: 100 },
        { text: '交易笔数', value: 'tradeCount', sortable: false, width: 100 },
        { text: '交易时间', value: 'tradeTime', sortable: false, width: 140 },
        { text: '业务归属机构', value: 'businessOrgCode', sortable: false, width: 120 },
        { text: '交易类型', value: 'opType', sortable: false, width: 100 },
        { text: '风控时间', value: 'riskTime', sortable: false, width: 140 },
        { text: '处置策略', value: 'strategy', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      loading: true,
      pendingTaskData: [],
      // 分页变量
      pageNum: 1,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20],
      // 交易类型
      tradeTypeList: []
    };
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 314;
      }
    },
    ...mapGetters([
      'appId'
    ])
  },
  watch: {
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
    },
    appId: {
      handler: function (newVal, oldVal) {
        this.searchForm = this.tab === 0 ? this.accountSearchForm : this.noAccountSearchForm;
        this.searchData = this.tab === 0 ? this.accountSearchData : this.noAccountSearchData;
        this.pendingTaskHeaders = this.tab === 0 ? this.accountTypeHeaders : this.noAccountTypeHeaders;
        Promise.all([
          this.getTradeTypeList(),
          this.getCaseStrategyList()
        ]);
      },
      immediate: true
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  beforeRouteLeave (to, from, next) {
    // 离开当前路由页面时调用
    if (to.path !== '/batchServiceDetails') {
      window.sessionStorage.removeItem('batchServiceDetailsTab');
    } else {
      window.sessionStorage.setItem('batchServiceDetailsTab', this.tab);
    }
    next();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    if (window.sessionStorage.getItem('batchServiceDetailsTab')) {
      this.tab = Number(window.sessionStorage.getItem('batchServiceDetailsTab'));
    }
    this.searchForm = this.tab === 0 ? this.accountSearchForm : this.noAccountSearchForm;
    this.searchData = this.tab === 0 ? this.accountSearchData : this.noAccountSearchData;
    this.pendingTaskHeaders = this.tab === 0 ? this.accountTypeHeaders : this.noAccountTypeHeaders;
  },
  methods: {
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // tab切换
    tabClick (data) {
      this.clearDate = !this.clearDate;
      if (data === '动账日志') {
        this.tab = 0;
        this.searchForm = this.accountSearchForm;
        this.searchData = this.accountSearchData;
        this.pendingTaskHeaders = this.accountTypeHeaders;
      } else {
        this.tab = 1;
        this.searchForm = this.noAccountSearchForm;
        this.searchData = this.noAccountSearchData;
        this.pendingTaskHeaders = this.noAccountTypeHeaders;
      }
      // 获取交易类型
      this.getTradeTypeList();
      // 获取处置类型
      this.getCaseStrategyList();
    },
    // 获取交易类型
    async getTradeTypeList () {
      // this.accountSearchForm[1].options = [{ text: '全部交易类型', value: 'all' }];
      if (this.appId) {
        const param = {
          appId: this.appId,
          isAmount: this.tab === 0 ? 1 : 0
        };
        const response = await queryTradeType(param);
        if (response.data.code === 200) {
          let resTradeTypeItems = response.data.data.tradeList;
          resTradeTypeItems && resTradeTypeItems.forEach(async (item, index, ary) => {
            if (this.tab === 0) {
              this.searchForm[5].options.push({
                text: item.tradeName,
                value: item.identifier
              });
            } else {
              this.searchForm[3].options.push({
                text: item.tradeName,
                value: item.identifier
              });
            }
            this.tradeTypeList.push(item);
          });
          this.getDataList();
        }
      }
    },
    // 获取处置类型下拉数据
    async getCaseStrategyList () {
      let param = {
        identifier: 'sys_strategy'
      };
      const res = await findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          if (this.tab === 0) {
            this.searchForm[7].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          } else {
            this.searchForm[5].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          }
        });
      }
    },
    // 搜索
    search ($event) {
      this.searchData = batchServiceSearch($event);
      this.tab === 0 ? this.searchData.dataType = 1 : this.searchData.dataType = 0;
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 重置搜索
    resetSearchData () {
      this.clearDate = !this.clearDate;
      this.searchData = this.tab === 0 ? this.accountSearchData : this.noAccountSearchData;
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    panelCounter () {
      this.counter += 1;
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this.getDataList();
    },
    // 切换每页显示几条数据
    pageChange (data) {
      this.perPageNum = data;
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 查看详情
    async queryDetailItem (item) {
      let opType = '';
      this.tradeTypeList.forEach(val => {
        if (val.tradeName === item.opType) {
          opType = val.identifier;
        }
      });
      const res = await dataService.risklogBatchServerListInfo({
        batchId: item.batchId,
        appId: this.appId,
        opType: opType
      });
      if (res.data.code === 200) {
        let params = {
          dataItem: item,
          itRuleTopList: res.data.data.itRuleTopList,
          strategyMapList: res.data.data.strategyMapList,
          isAccount: this.tab === 0 ? 1 : 0
        };
        this.toSecondRouterPage(params);
        this.$router.push('/batchServiceDetails');
      }
    },
    // 获取列表
    async getDataList () {
      this.pendingTaskData = [];
      this.loading = true;
      let params = {
        page: this.pageNum,
        pageSize: this.perPageNum,
        appId: this.appId
      };
      params = Object.assign({}, params, this.searchData);
      const res = await dataService.risklogBatchServer(params);
      if (res.data.code === 200) {
        this.pendingTaskData = res.data.data.list;
        this.totalItems = res.data.data.total;
        this.queryPageLength = res.data.data.pages;
      }
      this.loading = false;
    },
    ...mapActions([
      'toSecondRouterPage'
    ])
  }
};
</script>

<style scoped>

</style>
