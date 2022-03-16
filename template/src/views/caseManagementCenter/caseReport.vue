<template>
  <div>
    <!-- <div>
      <v-tabs v-model="activeTab">
        <v-tab
          v-for="(item, index) in pageTabs"
          :key="index"
          @click="tabClick(item.text,index)"
        >
          {{ item.text }}
        </v-tab>
      </v-tabs>
    </div> -->
    <div>
      <!-- 搜索表单 -->
      <base-search
        :fieldList="searchForm"
        @search="search($event)"
        @reset="resetSearchData($event)"
        :clearDate="clearDate"
        @change="panelCounter"
      ></base-search>
      <!-- 事件提报列表 -->
      <v-data-table
        :headers="caseReportHeaders"
        :items="caseReportData"
        :items-per-page="perPageNum"
        hide-default-footer
        class="elevation-3 mt-3"
        show-select
        v-model="selectedHeader"
        :loading="loading"
        loading-text="加载数据中..."
        :height="tableHeight"
        :fixed-header="true"
      >
        <!-- 表头 -->
        <template v-slot:top>
          <v-toolbar flat height="60px">
            <!-- <v-toolbar-title style="font-size:18px">
              {{ isAccountType === 0 ? '动账类' : '非动账类'}}
            </v-toolbar-title> -->
            <v-spacer/>
            <v-btn color="primary" class="mr-2 mt-1" @click="AddCase"
                   v-if="hasPermission('addEventButton')">单笔添加</v-btn>
<!--            <v-btn color="primary" class="mr-2 mt-1" @click="uploadDialog = true">批量导入</v-btn>-->
            <v-btn color="primary" class="mr-1 mt-1" @click="report" :disabled="isDisabled"
                   v-if="hasPermission('batchReportEventButton')">批量提报</v-btn>
            <v-btn color="primary" class="mr-1 mt-1" @click="batchDelete" :disabled="isDisabled"
                   v-if="hasPermission('batchDeleteEventButton')">批量删除</v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.id="{ item }">
          <span :title="item.id">{{ item.id | ellipsis() }}</span>
        </template>
        <template v-slot:item.eventBody="{ item }">
          <span :title="item.eventBody+item.eventValue">{{ item.eventBody | convertOpType(eventBodyItems)}}: {{item.eventValue}}</span>
        </template>
        <template v-slot:item.src="{ item }">
          <span :title="item.src | convertOpType(eventSrcItems)">{{ item.src | convertOpType(eventSrcItems) }}</span>
        </template>
        <template v-slot:item.cause="{ item }">
          <span :title="item.cause | convertOpType(getCauseItems)">{{ item.cause | convertOpType(getCauseItems) }}</span>
        </template>
        <template v-slot:item.states="{ item }">
          <span :title="item.states | convertOpType(getStatesItems)">{{ item.states | convertOpType(getStatesItems) }}</span>
        </template>
        <template v-slot:item.relevance="{ item }">
          <span class="relevance-style" @click="editCaseReport(item,0)">{{ item.relevance ? item.relevance : 0 }}</span>
        </template>
        <template v-slot:item.way="{ item }">
          <span :title="item.way === '0' ? '录入' : '导入'">{{ item.way === '0' ? "录入" : '导入' }}</span>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
                v-on="on"
                v-if="item.isSubmit === '0'"
                @click="editCaseReport(item,1)"
              >
                mdi-square-edit-outline
              </v-icon>
            </template>
            <span>编辑</span>
          </v-tooltip>
          <v-tooltip bottom v-if="hasPermission('deleteEventButton')">
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
                v-on="on"
                v-if="item.isSubmit === '0'"
                @click="deleteCaseReport(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <span>删除</span>
          </v-tooltip>
          <v-tooltip bottom v-if="hasPermission('reportEventButton')">
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
                v-on="on"
                @click="doInlineReport(item)"
                v-if="item.isSubmit === '0'"
              >
                mdi-briefcase-upload-outline
              </v-icon>
            </template>
            <span>提报</span>
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
      <!-- 事件提报弹框 -->
      <v-row dense>
        <v-dialog
          v-model="addOrEditDialog"
          persistent
          scrollable
          max-width="1251px"
        >
          <v-card>
            <v-card-title>
              <v-toolbar-title>事件提报</v-toolbar-title>
              <div class="flex-grow-1" />
              <v-btn
                icon
                dark
                @click="addOrEditDialog = false"
              >
                <v-icon color="#CCCCCC">mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pl-4 pr-4 mt-5 mb-5">
              <div class="dialog-subtitle">事件列表</div>
            </v-card-text>
            <v-card-text>
              <v-data-table :headers="doCaseReportHeaders" :items="doCaseReportData" hide-default-footer class="elevation-1">
                <template v-slot:item.id="{ item }">
                  <span :title="item.id">{{ item.id | ellipsis() }}</span>
                </template>
                <template v-slot:item.eventBody="{ item }">
                  <span :title="item.eventBody+item.eventValue">{{ item.eventBody | convertOpType(eventBodyItems)}}: {{item.eventValue}}</span>
                </template>
                <template v-slot:item.src="{ item }">
                  <span :title="item.src">{{ item.src | convertOpType(eventSrcItems) }}</span>
                </template>
                <template v-slot:item.cause="{ item }">
                  <span :title="item.cause">{{ item.cause | convertOpType(getCauseItems) }}</span>
                </template>
                <template v-slot:item.states="{ item }">
                  <span :title="item.states">{{ item.states | convertOpType(getStatesItems) }}</span>
                </template>
                <template v-slot:item.relevance="{ item }">
                  <span class="relevance-style" @click="editCaseReport(item,0)">{{ item.relevance ? item.relevance : 0 }}</span>
                </template>
                <template v-slot:item.way="{ item }">
                  <span :title="item.way">{{ item.way === '0' ? "录入" : '导入' }}</span>
                </template>
                <template v-slot:no-data>
                  <div>没有数据</div>
                </template>
              </v-data-table>
              <v-divider />
              <v-card-actions class="pt-8 pb-4">
                <div class="flex-grow-1"></div>
                <v-btn class="pl-0 mr-4" @click="addOrEditDialog = false">返回</v-btn>
                <v-btn color="primary" @click="confirmInlineReport">提报</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
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
      <!-- 导入表格 -->
      <v-dialog
        v-model="uploadDialog"
        persistent
        scrollable
        max-width="460px">
        <v-card height="260px">
          <v-card-title>
            <v-toolbar-title>
              导入表格数据
            </v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn
              icon
              dark
              @click="cancelUpload"
            >
              <v-icon color="#CCCCCC">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form
              ref="uploadFileForm"
              :lazy-validation="uploadLazy"
              v-model="uploadFormValid">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10" class="mt-10">
                  <v-file-input
                    v-model="fileInfo"
                    required
                    :rules="[v => !!v || '请选择文件']"
                    show-size
                    accept=".xlsx"
                    :disabled="uploadIsLoading"
                    :loading="uploadIsLoading"
                    prepend-icon=""
                    outlined
                    dense
                    label="点击选择文件，文件后缀为: .xlsx">
                  </v-file-input>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <div class="flex-grow-1" />
            <div>
              <v-btn
                class="primary mr-4"
                outlined
                style="color:white"
                @click="downloadTemp">下载模板
              </v-btn>
              <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="batchImport"
                :disabled="!uploadFormValid"
              >
                导入
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>
<script>
import { getTemplData } from '../../api/UserManage.js';
import BaseSearch from '@c/BaseSearch';
import DelDialog from '@/components/DelDialog';
import * as dataService from 'api/caseManagementCenter/caseReport.js';
import { mapGetters, mapActions } from 'vuex';
import { getReportSearchData } from '@/utils/generalDataTableHeaders';
import moment from 'moment';
export default {
  name: 'caseReport',
  components: {
    BaseSearch,
    DelDialog
  },
  filters: {
    convertOpType: function (str, itemList) {
      let text;
      itemList.forEach(item => {
        if (item.selectField === str) {
          text = item.selectText;
        }
      });
      return text;
    }
  },
  data: () => ({
    counter: 0,
    fullHeight: window.innerHeight,
    // 表格数据加载loading动画
    loading: true,
    // 是否展示提报弹窗
    addOrEditDialog: false,
    valid: true,
    lazy: false,
    // tab: null,
    // activeTab: 0,
    // tabItems: [
    //   { tabName: '动账类' },
    //   { tabName: '非动账类' }
    // ],
    // 表格的vModel
    selectedHeader: [],
    isAccountType: 1, // 是动帐还是非动帐 1是动帐，0是非动帐
    // 搜索参数
    searchDataDefault: {
      createTimeStart: '',
      createTimeEnd: '',
      src: '',
      cause: '',
      name: '',
      states: '',
      relevanceStart: '',
      relevanceEnd: ''
      // isAmount: 1
    },
    searchData: [],
    // 搜索组件数据
    searchForm: [
      { placeholder: '提报时间', value: [], type: 'date' },
      {
        placeholder: '事件来源',
        value: '',
        type: 'select',
        options: [
          { text: '请选择事件来源', value: 'all' }
        ]
      },
      {
        placeholder: '提报原因',
        value: '',
        type: 'select',
        options: [
          { text: '请选择提报原因', value: 'all' }
        ]
      },
      { placeholder: '提报人', value: '', type: 'text' },
      {
        placeholder: '提报状态',
        value: '',
        type: 'select',
        options: [
          { text: '请选择提报状态', value: 'all' }
        ]
      }
      // 搜索区间
      // {
      //   placeholder: '关联交易笔数',
      //   minPlaceholder: '最小值',
      //   maxPlaceholder: '最大值',
      //   value: '',
      //   minValue: '',
      //   maxValue: '',
      //   type: 'interval'
      // }
    ],
    caseReportData: [],
    // 列表头部
    caseReportHeaders: [
      { text: '事件编号', value: 'id', sortable: false, width: 100 },
      // { text: '事件主体', value: 'eventBody', sortable: false, width: 150 },
      { text: '事件来源', value: 'src', sortable: false, width: 100 },
      { text: '提报原因', value: 'cause', sortable: false, width: 100 },
      { text: '提报时间', value: 'createTime', sortable: false, width: 100 },
      { text: '提报人', value: 'name', sortable: false, width: 100 },
      { text: '已添加关联交易笔数', value: 'relevance', sortable: false, width: 100 },
      { text: '提报状态', value: 'states', sortable: false, width: 100 },
      { text: '提报方式', value: 'way', sortable: false, width: 100 },
      { text: '任务状态', value: 'way', sortable: false, width: 100 },
      { text: '操作', value: 'action', sortable: false, width: 100 }
    ],
    accountTypeData: [],
    // 提报弹窗中的列表表头
    doCaseReportHeaders: [],
    doCaseReportData: [],
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
    ifdsOptypeList: [], // 风控平台，交易类型
    getStatesItems: [], // 提报状态
    eventSrcItems: [], // 事件来源下拉数据
    getCauseItems: [], // 提报原因
    eventBodyItems: [], // 事件主体
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    delIds: '', // 删除事件的id
    token: '',
    // 用户id
    loginUserId: '',
    // 上传表格变量
    uploadDialog: false,
    uploadFormValid: true,
    uploadLazy: false,
    fileInfo: null,
    uploadIsLoading: false
  }),

  computed: {
    ...mapGetters([
      'appId',
      'secondLevelRouterItems',
      'pageTabs'
    ]),
    dateRangeText: {
      get () {
        if (moment(this.searchForm.dates[0]).valueOf() > moment(this.searchForm.dates[1]).valueOf()) {
          this.reverseArry(this.searchForm.dates);
        }
        return this.searchForm.dates.join(' 至 ');
      },
      set (newVal) {}
    },
    isDisabled () {
      // 表格是否有勾选
      let flag;
      if (this.selectedHeader.length > 0) {
        flag = false;
      } else {
        flag = true;
      }
      return flag;
    },
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 266;
      }
    }
  },
  watch: {
    // pageTabs (newValue, oldValue) {
    //   this.getPageTabs(newValue);
    // },
    appId: {
      handler: function (newVal, oldVal) {
        this.pageNum = 1;
        Promise.all([
          this.getEventsReportedList(),
          this.getEventSrcList(), // 事件来源
          this.getCauseList(), // 提报原因
          this.getStatesList(), // 提报状态
          this.getEventBodyList(), // 事件主体
          this.queryIfdsOptypeList() // 风控平台-交易类型查询
        ]);
      }
    },
    counter: {
      handler: function (newValue, oldValue) {
        if (this.counter % 2 === 1) {
          // 开
          this.tableHeight = window.innerHeight - 76;
        } else {
          // 关
          this.tableHeight = window.innerHeight;
        }
      },
      immediate: true
    }
  },
  created () {
    // 获取从事件提报详情路由传递回来的参数
    // let routerParams = this.$route.params.accountType;
    // if (routerParams !== undefined) {
    //   this.tab = routerParams ? 0 : 1;
    //   this.searchData.isAmount = routerParams;
    // }
  },
  mounted () {
    // this.getActiveTab();
    this.searchData = this.searchDataDefault;
    // if (sessionStorage.getItem('isAmount')) {
    //   this.searchData.isAmount = sessionStorage.getItem('isAmount');
    // } else {
    //   this.searchData.isAmount = 1;
    // }
    window.addEventListener('resize', this.onWindowResize);
    // 判断当前是在动账类下还是非动账类下
    if (localStorage.getItem('loginData')) {
      let loginData = JSON.parse(localStorage.getItem('loginData'));
      this.token = loginData.token;
      this.loginUserId = loginData.userId;
    }
    this.$nextTick(() => {
      Promise.all([
        this.getEventsReportedList(),
        this.getEventSrcList(), // 事件来源
        this.getCauseList(), // 提报原因
        this.getStatesList(), // 提报状态
        this.getEventBodyList(), // 事件主体
        this.queryIfdsOptypeList() // 风控平台-交易类型查询
      ]);
    });
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    // getActiveTab () {
    //   if (sessionStorage.getItem('currentCaseReportTab')) {
    //     this.activeTab = Number(sessionStorage.getItem('currentCaseReportTab'));
    //   } else {
    //     this.activeTab = 0;
    //   }
    // },
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
    // 获取事件来源下拉数据
    async getEventSrcList () {
      this.eventSrcItems = [];
      let param = {
        identifier: 'sys_event_src'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          // 添加弹框中的名单类型
          this.eventSrcItems.push(
            { selectText: item.paramName, selectField: item.paramValue }
          );
          this.searchForm[1].options.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取事件主体下拉数据
    async getEventBodyList () {
      this.eventBodyItems = [];
      let param = {
        identifier: 'sys_event_body'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          // 添加弹框中的名单类型
          this.eventBodyItems.push(
            { selectText: item.paramName, selectField: item.paramValue }
          );
          // this.searchForm[1].options.push({
          //   text: item.paramName,
          //   value: item.paramValue
          // });
        });
      }
    },
    // 获取提报原因下拉数据
    async getCauseList () {
      this.getCauseItems = [];
      let param = {
        identifier: 'sys_cause'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.getCauseItems.push(
            { selectText: item.paramName, selectField: item.paramValue }
          );
          this.searchForm[2].options.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取提报状态下拉数据
    async getStatesList () {
      this.getStatesItems = [];
      let param = {
        identifier: 'sys_states'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.getStatesItems.push(
            { selectText: item.paramName, selectField: item.paramValue }
          );
          this.searchForm[4].options.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // tabClick (data, index) {
    //   console.log('data==', data);
    //   this.clearDate = !this.clearDate;
    //   this.searchData = this.searchDataDefault;
    //   this.clearDate = !this.clearDate;
    //   this.loading = true;
    //   this.isAccountType = index;
    //   if (data === '动账类') {
    //     this.searchData.isAmount = 1;
    //   } else {
    //     this.searchData.isAmount = 0;
    //   }
    //   // 切换tab时重置查询form
    //   // this.searchForm.forEach((item) => {
    //   //   item.value = '';
    //   // });
    //   this.pageNum = 1;
    //   this.pageSize = 10;
    //   sessionStorage.setItem('isAmount', this.searchData.isAmount);
    //   sessionStorage.setItem('currentCaseReportTab', index);// 存储当前选中tab
    //   this.getEventsReportedList(); // 查询首页列表数据
    // },
    // 点击搜索按钮
    search ($event) {
      this.searchData = getReportSearchData($event);
      //  if (this.isAccountType) {
      // this.searchData.isAmount = sessionStorage.getItem('isAmount') || 1; // 动账
      // } else {
      //   this.searchData.isAmount = 0; // 非动账
      // }
      this.selectedHeader = [];
      this.pageNum = 1; // 默认从第一页开始查询
      this.getEventsReportedList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.clearDate = !this.clearDate;
      this.searchData = this.searchDataDefault;
      this.pageNum = 1; // 默认从第一页开始查询
      this.selectedHeader = [];
      this.getEventsReportedList();
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this.getEventsReportedList();
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getEventsReportedList();
    },
    // 查询列表
    async getEventsReportedList () {
      let pageParams = {
        appId: this.appId,
        page: this.pageNum,
        pageSize: this.perPageNum
      };
      let searchParam = JSON.parse(JSON.stringify(this.searchData));
      let params = Object.assign({}, pageParams, searchParam);
      const res = await dataService.getEventsReportedList(params);
      if (res.data.code === 200) {
        this.caseReportData = res.data.data.list;
        this.totalItems = res.data.data.total;
        // this.queryPageLength = res.data.data.totalPages;
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
        this.loading = false;
      }
    },
    // 添加事件
    AddCase () {
      let detailItems = {
        getStatesItems: this.getStatesItems, // 提报状态
        eventSrcItems: this.eventSrcItems, // 事件来源下拉数据
        getCauseItems: this.getCauseItems, // 提报原因
        eventBodyItems: this.eventBodyItems, // 事件主体
        // isAccountType: this.searchData.isAmount, // 动帐非动帐
        ifdsOptypeList: this.ifdsOptypeList // 风控平台-交易类型
      };
      this.toSecondRouterPage(detailItems);
      this.$router.push('/caseReportDetail');
    },
    // 首页列表的编辑按钮
    editCaseReport (item, num) {
      let detailItems = {
        getStatesItems: this.getStatesItems, // 提报状态
        eventSrcItems: this.eventSrcItems, // 事件来源下拉数据
        getCauseItems: this.getCauseItems, // 提报原因
        eventBodyItems: this.eventBodyItems, // 事件主体
        // isAccountType: this.searchData.isAmount, // 动帐非动帐
        ifdsOptypeList: this.ifdsOptypeList, // 风控平台-交易类型
        dataItem: item
      };
      this.toSecondRouterPage(detailItems);
      if (num === 0) {
        this.$router.push('/caseReportDetail?#selectedTransaction');
      } else {
        this.$router.push('/caseReportDetail');
      }
    },
    // 点击首页表格的提报按钮
    report () {
      let res = [];
      for (let i = 0; i < this.selectedHeader.length; i++) {
        // if (this.selectedHeader[i].isSubmit === '已提报' || this.selectedHeader[i].eventUser !== this.loginUserId) {
        if (this.selectedHeader[i].isSubmit === '1') {
          res.push(this.selectedHeader[i]);
        }
      }
      if (res.length > 0) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请选择当前登录人未提报的事件';
        this.snackbarServeColor = 'error';
        this.addOrEditDialog = false;
      } else {
        this.doCaseReportHeaders = this.caseReportHeaders.slice(0, this.caseReportHeaders.length - 1);
        this.doCaseReportData = this.selectedHeader;
        this.addOrEditDialog = true;
      }
    },
    doInlineReport (item) {
      this.doCaseReportHeaders = this.caseReportHeaders.slice(0, this.caseReportHeaders.length - 1);
      this.doCaseReportData = [item];
      this.addOrEditDialog = true;
    },
    // 提报弹窗中的 -- 提报按钮
    async confirmInlineReport () {
      let params = [];
      for (let i = 0; i < this.doCaseReportData.length; i++) {
        params.push(this.doCaseReportData[i].id);
      }
      let reportParam = {
        ids: params.join(',')
      };
      const res = await dataService.submitCaseReport(reportParam);
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = res.data.msg;
        this.snackbarServeColor = 'success';
        this.selectedHeader = []; // 提报后将选择的事件清空
        this.getEventsReportedList();
      }
      this.addOrEditDialog = false;
    },
    // 批量删除
    batchDelete () {
      let res = [];
      let ids = [];
      for (let i = 0; i < this.selectedHeader.length; i++) {
        if (this.selectedHeader[i].isSubmit === '1') {
          res.push(this.selectedHeader[i]);
        }
        ids.push(this.selectedHeader[i].id);
      }
      if (res.length > 0) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '已提报的事件不可以被删除';
        this.snackbarServeColor = 'error';
        this.addOrEditDialog = false;
      } else {
        this.delIds = ids.join(',');
        this.dialogDel = true;
        this.confirmDelFun = this.confirmDelParam;
      }
    },
    // 首页列表的删除按钮
    deleteCaseReport (item) {
      this.dialogDel = true;
      this.delIds = item.id;
      this.confirmDelFun = this.confirmDelParam;
    },
    // 删除方法
    async confirmDelParam () {
      const res = await dataService.removeCaseReport({ ids: this.delIds });
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '删除成功';
        this.snackbarServeColor = 'success';
        this.selectedHeader = [];
        this.getEventsReportedList();
      }
      this.dialogDel = false;
    },
    ...mapActions([
      'toSecondRouterPage',
      'setPageTabs'
    ]),
    // 批量导入
    cancelUpload () {
      this.$refs.uploadFileForm.reset();
      this.uploadDialog = false;
      this.uploadIsLoading = false;
    },
    // 下载模板
    downloadTemp () {
      getTemplData().then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = '用户数据模板' + '.xlsx';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.message(err.msg, 'error');
      });
    },
    batchImport () {
      console.log('批量导入');
      // if (this.$refs.uploadFileForm.validate()) {
      //   this.uploadIsLoading = true;
      //   let formData = new FormData();
      //   // 把文件信息放入对象中
      //   formData.append('file', this.fileInfo);
      //   formData.append('listId', this.Affiliatelistset);
      //   // formData.append('expireTime', this.getTimes(this.importDate)); // 导入弹框增加失效时间(暂时没用此功能)
      //   dataService.importData(formData).then(res => {
      //     this.snackbarServe = true;
      //     this.snackbarServeMsg = res.data.msg;
      //     this.snackbarServeColor = 'success';
      //     this.cancelUpload();
      //   }).catch(err => {
      //     this.snackbarServe = true;
      //     this.snackbarServeMsg = err.msg;
      //     this.snackbarServeColor = 'error';
      //     this.uploadIsLoading = false;
      //   });
      // }
    }
  }
};
</script>
<style lang="stylus" scoped>
.dialog-subtitle {
  text-align: center;
  color: #000;
  font-size: 16px;
  height: 30px;
  line-height: 30px;
  background-color: var(--v-seeDetailsHeadBgColor-base);
}
.relevance-style {
  cursor: pointer;
  color: #1890FF;
}
</style>
