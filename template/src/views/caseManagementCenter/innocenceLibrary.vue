<!----------  @author: 古雪瑞  ----------->
<!----------  @updated_at: 2020-05-11  ----------->
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
      <!-- 疑似欺诈库列表 -->
      <v-data-table
        :headers="caseLibraryHeaders"
        :items="caseLibraryData"
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
            <!-- 下一个版本再开发指派重审功能 -->
            <!-- <v-btn color="primary" class="mr-2 mt-1" @click="designate" :disabled="!selectedHeader.length>0">批量指派重审</v-btn> -->
          </v-toolbar>
        </template>
        <template
          v-slot:item.opType="{ item }"
        >
          <span :title="item.opType | textFilters(allTradeTypeList) | ellipsis()">{{ item.opType | textFilters(allTradeTypeList) | ellipsis() }}</span>
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
          <!-- 下一个版本再开发指派重审功能 -->
          <!-- <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
                v-on="on"
                @click="transferSingle(item)"
              >
                mdi-autorenew
              </v-icon>
            </template>
            <span>指派重审</span>
          </v-tooltip> -->
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
import DelDialog from '@c//DelDialog';
import { ACCOUNT_SEARCH_FORM, NO_ACCOUNT_SEARCH_FORM, ACCOUNT_TYPE_HEADER, NO_ACCOUNT_TYPE_HEADER, getSearchData, ACCOUNT_SEARCH_DATA, NO_ACCOUNT_SEARCH_DATA } from '@/utils/generalDataTableHeaders';
import * as dataService from 'api/caseManagementCenter/pendingTask';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'innocenceLibrary',
  components: {
    BaseSearch,
    DelDialog
  },
  data: () => ({
    counter: 0,
    fullHeight: window.innerHeight,
    // 表格加载数据动画
    loading: true,
    taskDetailData: [],
    tab: null,
    tabItems: [
      { tabName: '动账类', buttonUrl: 'innocenceLibraryMovableAccountTab' },
      { tabName: '非动账类', buttonUrl: 'innocenceLibraryNoMovableAccountTab' }
    ],
    isAccountType: 1,
    // 搜索参数
    searchData: {},
    accountSearchData: {
      createTimeStart: '',
      createTimeEnd: '',
      opTypeList: '',
      userId: '',
      outAccount: '',
      inAccount: '',
      riskLabels: '',
      src: '',
      state: 100, // 后端定的默认值
      assignStyle: '',
      eventNo: '',
      executeId: '',
      isAmount: 1,
      dataType: 1
    },
    noAccountSearchData: { NO_ACCOUNT_SEARCH_DATA, ...{ dataType: 0 } },
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
      //   value: '',
      //   type: 'select',
      //   options: [
      //     { text: '全部任务状态', value: 'all' }
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
    noAccountSearchForm: NO_ACCOUNT_SEARCH_FORM,
    caseLibraryHeaders: [],
    caseLibraryData: [],
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
      { text: '生成时间', value: 'createTime', sortable: false, width: 100 },
      { text: '任务来源', value: 'src', sortable: false, width: 100 },
      { text: '指派方式', value: 'assignStyle', sortable: false, width: 100 },
      { text: '审核流类型', value: 'spLevel', sortable: false, width: 100 },
      { text: '审核结果', value: 'result', sortable: false, width: 100 },
      { text: '操作', value: 'action', sortable: false, width: 100 }
    ],
    // 非动账类
    noAccountTypeHeaders: [
      { text: '任务编号', value: 'eventNo', sortable: false, width: 100 },
      { text: '所属应用', value: 'appId', sortable: false, width: 100 },
      { text: '交易类型', value: 'opType', sortable: false, width: 100 },
      { text: '用户标识', value: 'userId', sortable: false, width: 100 },
      { text: '登录账号', value: 'userName', sortable: false, width: 100 },
      { text: '建议策略', value: 'strategy', sortable: false, width: 100 },
      { text: '生成时间', value: 'createTime', sortable: false, width: 100 },
      { text: '任务来源', value: 'src', sortable: false, width: 100 },
      { text: '指派方式', value: 'assignStyle', sortable: false, width: 100 },
      { text: '审核流类型', value: 'spLevel', sortable: false, width: 100 },
      { text: '审核结果', value: 'result', sortable: false, width: 100 },
      { text: '操作', value: 'action', sortable: false, width: 100 }
    ],
    // 任务指派弹窗中的列表表头
    doCaseLibraryHeaders: [],
    doCaseLibraryData: [],
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
    selectedHeader: [],
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
        this.innocenceLibrary = 1;
        Promise.all([
          this.getTradeTypeList(),
          this.getCaseStrategyList(),
          this.getTaskResourceList(),
          this.getTaskStateList(),
          this.getassignTypetList(),
          this.getRiskLabelList(),
          this.getAppListData(),
          this.queryIfdsOptypeList(),
          this.getReviewResultList()
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
  created () {
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
    if (this.hasPermission(this.tabItems[0].buttonUrl)) {
      this.searchData.isAmount = 1; // 动账
    } else if (!this.hasPermission(this.tabItems[0].buttonUrl) && this.hasPermission(this.tabItems[1].buttonUrl)) {
      this.searchData.isAmount = 0; // 非动账
    }
    this.caseLibraryHeaders = this.isAccountType ? this.accountTypeHeaders : this.noAccountTypeHeaders;
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
    panelCounter: function () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    ...mapActions([
      'toSecondRouterPage'
    ]),
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
          resTradeTypeItems.forEach(async (item, index, ary) => {
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
          if (this.isAccountType) { // 动账类标签下
            this.searchForm[6].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          } else {
            this.searchForm[5].options.push({
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
    // 获取审核结果下拉数据
    async getReviewResultList () {
      let param = {
        identifier: 'case_result'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.allReviewResList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取任务状态下拉数据
    async getTaskStateList () {
      // let param = {
      //   identifier: 'case_state'
      // };
      // const res = await dataService.findsysParams(param);
      // if (res.data.code === 200) {
      //   res.data.data.forEach((item, index, ary) => {
      //     if (this.isAccountType) { // 动账类标签下
      //       this.searchForm[7].options.push({
      //         text: item.paramName,
      //         value: item.paramValue
      //       });
      //       this.searchForm[7].value = this.statePrams;
      //     }
      //   });
      // }
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
            this.searchForm[7].options.push({
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
          this.allAppList.push(
            { text: item.appName, value: item.id }
          );
        });
      }
    },
    tabClick (data) {
      this.$route.params.accountType = undefined;
      this.clearDate = !this.clearDate;
      this.loading = true;
      this.caseLibraryData = [];
      this.selectedHeader = [];
      if (data === '动账类') {
        this.isAccountType = 1;
        this.searchForm = this.accountSearchForm;
        this.caseLibraryHeaders = this.accountTypeHeaders;
        this.searchData = this.accountSearchData;
      } else {
        this.isAccountType = 0;
        this.searchForm = this.noAccountSearchForm;
        this.caseLibraryHeaders = this.noAccountTypeHeaders;
        this.searchData = this.noAccountSearchData;
      }
      this.searchData.opTypeList = '';
      // 切换tab时重置查询form
      this.searchForm.forEach((item) => {
        item.value = '';
      });
      this.getTradeTypeList();
      this.getCaseStrategyList();
      this.getTaskResourceList();
      this.getTaskStateList();
      this.getassignTypetList();
      this.getRiskLabelList();
      this.getAppListData();
      this.getReviewResultList();
    },
    // 点击搜索按钮
    search ($event) {
      this.searchData = getSearchData($event);
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
        queryTypes: 3
      };
      let params = Object.assign({}, pageParams, this.searchData);
      const res = await dataService.queryTaskList(params);
      if (res.data.code === 200) {
        this.isAdmin = res.data.data.isAdmin;
        this.roleIdenList = res.data.data.roleIdenList; // 角色列表
        this.caseLibraryData = res.data.data.verifyList;
        this.totalItems = res.data.data.total;
        this.queryPageLength = res.data.data.totalPage;
        this.loading = false;
      }
    },
    // 首页列表的--批量指派重审按钮
    designate () {
      this.doCaseLibraryHeaders = this.caseLibraryHeaders.slice(0, this.caseLibraryHeaders.length - 1);
      this.doCaseLibraryData = this.selectedHeader;
      let params = {
        titleInfo: {
          actionTitle: '设置指派审核流',
          isTransfer: false
        },
        dataHeaders: this.doCaseLibraryHeaders,
        dataItems: this.doCaseLibraryData
      };
      this.toSecondRouterPage(params);
      this.$router.push('/designateOrTransfer');
    },
    // 首页列表的查看详情按钮
    async queryDetailItem (item) {
      let params = {
        id: item.id,
        token: this.token
      };
      const res = await dataService.checkTaskDetail(params);
      if (res.data.code === 200) {
        // 传递到任务详情页的参数
        let detailItems = {
          id: item.id,
          title: '清白件库',
          taskDetail: res.data.data,
          isTrial: item.trial,
          isTransfer: item.tranfer,
          roleIdenList: this.roleIdenList,
          isAmount: this.isAccountType,
          ifdsOptypeList: this.ifdsOptypeList,
          detailItemInfo: item,
          allAppList: this.allAppList
        };
        this.toSecondRouterPage(detailItems);
        this.$router.push('/caseTaskDetail');
      }
    },
    // 表格内重审指派按钮
    transferSingle (item) {
      this.doCaseLibraryHeaders = this.caseLibraryHeaders.slice(0, this.caseLibraryHeaders.length - 1);
      this.doCaseLibraryData = [item];
      let params = {
        titleInfo: {
          actionTitle: '设置指派审核流',
          isTransfer: false
        },
        dataHeaders: this.doCaseLibraryHeaders,
        dataItems: this.doCaseLibraryData
      };
      this.toSecondRouterPage(params);
      this.$router.push('/designateOrTransfer');
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>
