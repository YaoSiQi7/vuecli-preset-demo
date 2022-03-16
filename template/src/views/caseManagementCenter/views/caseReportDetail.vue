<!--author：古雪瑞 -->
<!--updateTime：2020-04-22-->
<template>
  <div>
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-4 elevation-3',isFixed?'fixed':'']">
        <v-card-actions style="height:60px" v-if="isSubmitDisabled">
          <v-btn  class="ml-4 cancelButton" @click="cancel" outlined>返回</v-btn>
        </v-card-actions>
        <v-card-actions style="height:60px" v-else>
          <v-btn  color="primary" class="ml-4" :disabled="!valid" @click="save"
                  v-if="hasPermission('saveEventReportButton')">保存</v-btn>
          <v-btn  class="ml-4 cancelButton" @click="cancel" outlined >取消</v-btn>
          <v-btn  color="primary" class="ml-4" :disabled="!valid" @click="saveAndReport"
                  v-if="hasPermission('saveAndReportEventReportButton')">保存并提报</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-form ref="form" v-model="valid" :lazy-validation="lazy">
      <v-card class="mx-auto pb-6 elevation-3">
        <v-card-text class="pt-4 pb-2">
          <div class="title-info">
            <i>*</i>添加关键信息
          </div>
        </v-card-text>
        <v-row dense class="px-4">
<!--          <v-col cols="2">
            <v-select
              v-model="formData.eventBody"
              item-text="selectText"
              item-value="selectField"
              placeholder="请选择事件主体"
              :items="secondLevelRouterItems.eventBodyItems"
              :rules="eventBodyRules"
              :disabled="isSubmitDisabled"
              solo
              flat
              dense
              outlined
              no-data-text="没有匹配数据"
            />
          </v-col>-->
<!--          <v-col cols="2">
            <v-text-field
              placeholder="请输入"
              v-model.trim="formData.eventValue"
              :rules="valueRules"
              :disabled="isSubmitDisabled"
              solo
              flat
              dense
              outlined
            />
          </v-col>-->
          <v-col cols="2">
            <v-select
              v-model="formData.src"
              item-text="selectText"
              item-value="selectField"
              placeholder="请选择事件来源"
              :items="secondLevelRouterItems.eventSrcItems"
              :rules="srcRules"
              :disabled="isSubmitDisabled"
              solo
              flat
              dense
              outlined
              no-data-text="没有匹配数据"
            />
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="formData.cause"
              item-text="selectText"
              item-value="selectField"
              placeholder="请选择提报原因"
              :items="secondLevelRouterItems.getCauseItems"
              :rules="causeRules"
              :disabled="isSubmitDisabled"
              solo
              flat
              dense
              outlined
              no-data-text="没有匹配数据"
            />
          </v-col>
        </v-row>
        <v-divider class="mt-2"></v-divider>
        <v-card-text class="pt-4 pb-2">
          <div class="title-info">查询关联风控日志</div>
        </v-card-text>
        <v-row class="px-4">
          <v-col cols="3">
            <v-text-field
              outlined
              dense
              v-model="dates"
              append-icon="event"
              placeholder="创建时间："
              :disabled="isSubmitDisabled"
              @click="dateInputClick()"
            >
            </v-text-field>
            <v-dialog v-model="isdateShow" width="321">
              <v-date-picker selected-items-text="已选择日期" v-model="dates" range  @change="dateChange(dates)"></v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="riskSearchData.eventBody"
              item-text="selectText"
              item-value="selectField"
              placeholder="请选择事件主体"
              :items="secondLevelRouterItems.eventBodyItems"
              :disabled="isSubmitDisabled"
              solo
              flat
              dense
              outlined
              no-data-text="没有匹配数据"
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              placeholder="请输入"
              v-model.trim="riskSearchData.eventValue"
              :disabled="isSubmitDisabled"
              solo
              flat
              dense
              outlined
            />
          </v-col>
          <v-col cols="2">
            <v-btn small color="primary" class="mr-2 mt-1" :disabled="isSubmitDisabled" @click="reset">重置</v-btn>
            <v-btn class="mt-1" color="primary" :disabled="isSubmitDisabled" @click="getEventsRiskSearch">查询</v-btn>
          </v-col>
          <v-col cols="1"></v-col>
          <v-col cols="2">
            <v-btn color="primary" class="ml-4" :loading="btnLoading" :disabled="selectedTransaction && selectedTransaction.length || selectedRiskControlLogData.length && isEdit?false:true" @click="addSelectedTransaction">添加选中交易</v-btn>
          </v-col>
        </v-row>
        <!-- 关联风控日志列表 -->
        <v-data-table
          :headers="riskControlLogHeaders"
          :items="riskControlLogData"
          :items-per-page="riskPerPageNum"
          hide-default-footer
          class="elevation-3 px-4"
          show-select
          disabled="true"
          v-model="selectedTransaction"
          :loading="riskListLoading"
          loading-text="加载数据中..."
          :fixed-header="true"
        >
          <template v-slot:item.app_id="{ item }">
            <span :title="item.app_id | convertOpType(allAppList) | ellipsis()">{{ item.app_id | convertOpType(allAppList) | ellipsis() }}</span>
          </template>
          <template v-slot:item.op_type="{ item }">
            <span>{{ item.op_type | ifdsOpType(secondLevelRouterItems.ifdsOptypeList)}}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  color="primary"
                  v-on="on"
                  @click="editCaseReport(item)"
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
                      v-model="riskPerPageNum"
                      item-text="fieldName"
                      item-value="fieldField"
                      :items="perPageItems"
                      dense
                      width="27px"
                      no-data-text="没有匹配数据"
                      @change="riskPageChange"
                    />
                  </span>条
                <span style="margin-left:15px">共{{ riskTotalItems }}条</span>
                <v-spacer/>
                <v-pagination
                  class="d-flex justify-end pagination"
                  v-model="riskPageNum"
                  :length="riskQueryPageLength"
                  :total-visible="7"
                  @input="riskOnPageChange"
                />
              </div>
            </div>
          </template>
        </v-data-table>
        <!-- </v-container> -->
        <div id="selectedTransaction">
          <v-row dense class="px-4">
            <v-col>
              <v-card-text class="pt-4 pb-2 pl-0">
                <div class="title-info">已添加关联交易<span>(该列表中的交易会随提报流程进入“待处理”列表中)</span></div>
              </v-card-text>
            </v-col>
            <v-col>
              <v-btn color="primary" class="ml-4 mt-3" @click="deleteSelectedTransaction" :disabled="deleteSelectedData.length && isEdit?false:true">删除选中交易</v-btn>
            </v-col>
          </v-row>
          <!-- 已添加关联交易列表 -->
          <v-data-table
            :headers="riskControlLogHeaders"
            :items="selectedRiskControlLogData"
            :items-per-page="perPageNum"
            hide-default-footer
            class="elevation-3 px-4"
            show-select
            v-model="deleteSelectedData"
            :loading="loading"
            loading-text="加载数据中..."
            :fixed-header="true"
          >
            <template v-slot:item.app_id="{ item }">
              <span :title="item.app_id | convertOpType(allAppList) | ellipsis()">{{ item.app_id | convertOpType(allAppList) | ellipsis() }}</span>
            </template>
            <template v-slot:item.op_type="{ item }">
              <span>{{ item.op_type | ifdsOpType(secondLevelRouterItems.ifdsOptypeList)}}</span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom v-if="isCheckProgress && formData.isSubmit === '1'">
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    color="primary"
                    v-on="on"
                    @click="eventDetail(item)"
                  >
                    mdi-bookmark-multiple
                  </v-icon>
                </template>
                <span>核查进度</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    color="primary"
                    v-on="on"
                    @click="editCaseReport(item)"
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
        <v-divider class="mt-2"></v-divider>
        <v-card-text class="pt-4 pb-2">
          <div class="title-info">添加调查资料附件</div>
          <file-upload @getFileFun="getFileFun" :accessoryArr="accessoryArr" :accessoryUrl="accessoryUrl" :isEdit="isEdit" @downloadFileFun="downloadFileFun"></file-upload>
        </v-card-text>

        <v-divider class="mt-2"></v-divider>
        <v-card-text class="pt-4 pb-2">
          <div class="title-info">添加描述</div>
          <v-textarea
            v-model.trim="formData.remarks"
            outlined
            placeholder="添加描述"
            rows="4"
            row-height="25"
            :disabled="isSubmitDisabled"
            class="mt-3 textarea-input"
          ></v-textarea>
        </v-card-text>
      </v-card>
    </v-form>
    <!-- 查看详情弹窗 -->
    <v-row dense>
      <v-dialog
        v-model="riskLogDetail"
        persistent
        scrollable
        max-width="1200px">
        <v-card>
          <v-card-title>
            <v-toolbar-title>查看详情</v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn
              icon
              dark
              @click="riskLogDetail = false"
            >
              <v-icon color="#CCCCCC">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <basecase-detail :outAccountInfo="outAccountInfoDialog" :inAccountInfo="inAccountInfoDialog" :transationInfo="transationInfoDialog" :otherInfo="otherInfoDialog" :hitRule="hitRulesDialog" :ifdsOptypeList="secondLevelRouterItems.ifdsOptypeList" :allAppList="allAppList"></basecase-detail>
        </v-card>
      </v-dialog>
    </v-row>
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
</template>
<script>
import $ from 'jquery';
import BasecaseDetail from '@c/BasecaseDetail';
import FileUpload from '@/components/FileUpload';
import * as dataService from 'api/caseManagementCenter/caseReport.js';
import { mapGetters } from 'vuex';
import moment from 'moment';
export default {
  name: 'caseReportDetail',
  components: {
    BasecaseDetail,
    FileUpload
  },
  filters: {
    convertOpType: function (str, itemList) {
      let text = '';
      itemList.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.tag === str) {
          text = item.text;
        }
      });
      return text;
    },
    ifdsOpType: function (str, objList) {
      return objList[str];
    }
  },
  data: () => ({
    isFixed: false,
    allAppList: [],
    eventNo: '', // 事件编号
    token: '',
    // 交易详情弹窗信息
    outAccountInfoDialog: {
      ecifPrivateCustInfo: {},
      ecifCustInfo: {},
      ecifType: ''
    },
    inAccountInfoDialog: {
      ecifPrivateCustInfo: {},
      ecifCustInfo: {},
      chMchtInfo: {},
      ecifType: ''
    },
    transationInfoDialog: {},
    otherInfoDialog: {},
    hitRulesDialog: {},
    // 风控详情默认
    hitRule: {
      'simulatedResult': {
        'matchType': '',
        'hit_labels': '',
        'strategy': '',
        'hit_rules': []
      },
      'officialResult': {
        'matchType': '',
        'label_hit_rules': [],
        'strategy': '',
        'hit_rules': []
      }
    },
    // -------------------------------
    isEdit: true, // true 是新增，false是编辑查看
    riskLogDetail: false,
    isSubmitDisabled: false, // 已经提报的事件不可以更改
    btnLoading: false, // 按钮添加loading，避免多次提交
    isEditMode: false, // true 编辑，false 修改
    accessoryArr: [], // 上传的附件
    accessoryUrl: [], // 上传的附件
    valid: true,
    lazy: false,
    formData: {
      isAmount: 1, // 是否动账（1动账 0非动账）
      eventBody: '', // 事件主体
      eventValue: '', // 事件值
      src: '', // 事件来源
      cause: '', // 提报原因
      relevance: 0, // 已添加关联交易笔数
      relatedTransaction: '', // 关联交易
      states: 1, // 提报状态 1待提报，2已提报
      way: 0, // 提报方式
      isSubmit: 0, // 是否提报（1是 0否）
      accessory: '', // 附件
      remarks: '', // 添加描述
      appId: ''
    },
    // 添加事件参数项验证
    eventBodyRules: [
      v => !!v || '不能为空或只有空格'
    ],
    valueRules: [// 事件主体输入值
      v => !!v || '不能为空或只有空格'
    ],
    srcRules: [ // 事件来源
      v => !!v || '不能为空或只有空格'
    ],
    causeRules: [ // 提报原因
      v => !!v || '不能为空或只有空格'
    ],
    isdateShow: false, // 时间弹窗
    // 表格的vModel
    selectedHeader: [],
    selectedTransaction: [], // 已选中的交易
    // 表格数据加载loading动画
    loading: false,
    riskListLoading: false,
    dates: [], // 风控日志列表日期查询条件
    searchValid: true,
    // 关联风控日志列表查询条件
    riskSearchData: {
      eventBody: '', // 事件主体
      eventValue: '', // 事件主体的值
      startTime: '',
      endTime: ''
    },
    // 分页变量
    riskPageNum: 1, // 第几页
    riskQueryPageLength: 1, // 总共有几页
    riskPerPageNum: 10, // 每页多少条
    riskTotalItems: 0, // 数据的总条数
    perPageItems: [5, 10, 15, 20, 50, 100],
    // 查询关联风控日志列表数据
    riskControlLogData: [],
    // -------------------------
    // 查询关联风控日志列表表头
    riskControlLogHeaders: [
      { text: '所属应用', value: 'app_id', sortable: false, width: 110 },
      { text: '交易类型', value: 'op_type', sortable: false, width: 100 },
      { text: '用户标识', value: 'user_id', sortable: false, width: 100 },
      { text: '出账账号', value: 'out_account', sortable: false, width: 100 },
      { text: '入账账号', value: 'in_account', sortable: false, width: 100 },
      { text: '金额', value: 'amount', sortable: false, width: 100 },
      { text: '风险标签', value: 'riskLabels', sortable: false, width: 100 },
      { text: '查看详情', value: 'action', sortable: false, width: '8%' }
    ],
    // 已选择的风控日志列表
    selectedRiskControlLogData: [],
    // 要删除的已选日志
    deleteSelectedData: [],
    // 分页变量
    pageNum: 1, // 第几页
    queryPageLength: 1, // 总共有几页
    perPageNum: 10, // 每页多少条
    totalItems: 0, // 数据的总条数
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    isCheckProgress: false
  }),
  computed: {
    ...mapGetters([
      'appId',
      'secondLevelRouterItems',
      'appList'
    ]),
    // 判断当前登录用户与所选的数据用户id是否相同，不同则不能编辑
    isDisabled () {
      if (this.formData.eventUser) {
        return this.loginUserId === this.formData.eventUser;
      } else {
        return true;
      }
    },
    AfterChangeData () { // 前端分页
      let start = (this.pageNum - 1) * this.perPageNum;
      let end = this.pageNum * this.perPageNum;
      return this.selectedTransaction.slice(start, end);
    }
  },
  mounted () {
    this.formData.appId = this.appId;
    // this.getEventsRiskList(); // 获取风控日志列表
    this.getAppListData();
    this.initData();
    window.addEventListener('scroll', this.fixedBtnBox);
  },
  methods: {
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 处理所属应用下拉数据
    async getAppListData () {
      if (this.appList.length > 0) {
        const currAppList = await this.appList;
        currAppList.forEach((item, index, ary) => {
          this.allAppList.push(
            { text: item.appName, value: item.id, tag: item.appTag }
          );
        });
      }
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
    initData () {
      if (localStorage.getItem('loginData')) {
        let loginData = JSON.parse(localStorage.getItem('loginData'));
        this.token = loginData.token;
      }
      let pageParams = Object.assign({}, this.secondLevelRouterItems);
      if (pageParams.dataItem) {
        this.eventNo = pageParams.dataItem.id; // 以创建的事件的事件编号
        this.getCaseReportData(pageParams.dataItem.id);
      }
    },
    // 通过事件id获取事件详情
    async getCaseReportData (id) {
      const res = await dataService.editEventsReported({ id: id });
      if (res.data.code === 200) {
        this.isEditMode = true;
        let items = res.data.data; // 获取事件详情
        this.formData = Object.assign({}, {
          id: items.id,
          isAmount: items.isAmount, // 是否动账（1动账 0非动账）
          eventBody: items.eventBody, // 事件主体
          eventValue: items.eventValue, // 事件值
          src: items.src, // 事件来源
          cause: items.cause, // 提报原因
          relevance: items.relevance, // 已添加关联交易笔数
          relatedTransaction: items.relatedTransaction, // 关联交易
          states: items.states, // 提报状态 1待提报，2已提报
          way: items.way, // 提报方式
          isSubmit: items.isSubmit, // 是否提报（1是 0否）
          accessory: items.accessory, // 附件
          remarks: items.remarks // 添加描述
        });
        if (items.isSubmit === '1') {
          this.isSubmitDisabled = true;
          this.isEdit = false; // 添加／删除关联交易按钮禁用；
        }
        if (this.formData.accessory) {
          let accessoryArr = [];
          let accessoryUrl = [];
          let accessorys = this.formData.accessory.split(',');
          accessorys.forEach(item => {
            if (item) {
              accessoryUrl.push(item);
              // let index = item.lastIndexOf('\/');
              let index = item.lastIndexOf('/');
              let fileName = item.substring(index + 1, item.length);
              accessoryArr.push({
                name: fileName,
                uploadStatus: 2,
                uploadPercentage: '100%',
                url: item
              });
            }
          });
          this.accessoryArr = accessoryArr;
          this.accessoryUrl = accessoryUrl;
        }
        // 已添加关联交易笔数跳转
        let hash = window.location.hash;
        let index = hash.lastIndexOf('#');
        if (index !== -1) {
          var locationId = hash.substring(index + 1, hash.length + 1);
          var div = document.getElementById(locationId);
          if (div) {
            this.isCheckProgress = true;
            setTimeout(function () {
              $('html, body').animate({ scrollTop: $(div).offset().top - 43 }, 500);
            }, 500);
            this.isSubmitDisabled = true;
          }
        }
        this.pageNum = 1;
        this.getSelectedTransactionFun(this.formData.relatedTransaction);
      }
    },
    // 重置条件
    reset () {
      // this.$refs.form.reset();
      this.riskSearchData = {
        eventBody: '', // 事件主体
        eventValue: '', // 事件主体的值
        startTime: '',
        endTime: ''
      };
      this.dates = [];
      this.selectedTransaction = [];
      this.selectedTransaction = this.selectedRiskControlLogData;
      this.riskPageNum = 1;
      this.riskControlLogData = [];
      this.riskTotalItems = 0;
      this.riskQueryPageLength = 1;
      this.getEventsRiskSearch();
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
    dateChange (date) {
      this.$nextTick(() => {
        if (moment(date[0]).valueOf() > moment(date[1]).valueOf()) {
          this.reverseArry(date);
        }
        if (date.length === 2) {
          this.isdateShow = false;
          this.dates = date;
          // this.riskSearchData.startTime = this.dates[0];
          // this.riskSearchData.endTime = this.dates[1];
        }
      });
    },
    // 创建时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
    },
    getEventsRiskSearch () {
      this.riskPageNum = 1;
      this.selectedTransaction = [];
      this.selectedTransaction = this.selectedRiskControlLogData;
      this.getEventsRiskList();
    },
    // 查询风控日志列表
    async getEventsRiskList () {
      this.riskListLoading = true;
      this.riskSearchData.startTime = this.dates[0];
      this.riskSearchData.endTime = this.dates[1];
      let pageParams = {
        startIndex: this.riskPageNum, // 页数
        pageSize: this.riskPerPageNum, // 每页条数
        is_amount: this.formData.isAmount, // 动帐非动帐
        appId: this.appId
      };
      let params = Object.assign({}, pageParams, this.riskSearchData);
      const res = await dataService.getEventsRiskList(params);
      if (res.data.code === 200) {
        this.riskControlLogData = res.data.data.data;
        this.riskTotalItems = res.data.data.total;
        this.riskQueryPageLength = res.data.data.pages;
        this.riskListLoading = false;
      }
    },
    // 核查进度
    eventDetail (item) {
      this.$router.push({
        path: '/mergeEventDetail',
        name: 'mergeEventDetail',
        params: {
          details: item,
          submitId: this.secondLevelRouterItems.dataItem.id
        }
      });
    },
    // 查看详情
    async editCaseReport (item) {
      let params = {
        userId: item.user_id, // 客户号
        opId: item.op_id, // 风控日志ID
        inAccount: item.in_account, // 入账账号
        mchtNo: item.shop_no, // 商户号
        token: this.token,
        id: this.secondLevelRouterItems.dataItem ? this.secondLevelRouterItems.dataItem.id : ''
      };
      const res = await dataService.riskShowDataDetail(params);
      if (res.data.code === 200) {
        const resData = res.data.data;
        this.outAccountInfoDialog = Object.assign({}, resData.outAccountInfo);
        this.inAccountInfoDialog = Object.assign({}, resData.inAccountInfo);
        this.transationInfoDialog = Object.assign({}, {
          isAmount: this.secondLevelRouterItems.isAmount,
          createTime: item.create_time,
          appId: item.app_id,
          appName: item.app_name,
          opType: item.op_type,
          op_type: item.op_type,
          opState: item.op_state,
          location: item.city,
          outAccount: item.out_account,
          inAccount: item.in_account,
          amount: item.amount
        });
        this.otherInfoDialog = Object.assign({}, {
          eventNo: resData.id,
          devFp: item.dev_fp,
          brand: item.brand,
          model: item.model,
          ip: item.ip
        });
        if (resData.hitRule) {
          this.hitRulesDialog = Object.assign({}, resData.hitRule);
        } else {
          this.hitRulesDialog = this.hitRule;
        }
        this.riskLogDetail = true;
      }
    },
    // 添加选中交易
    addSelectedTransaction () {
      if (this.selectedTransaction.length > 0) {
        this.btnLoading = true;
        this.pageNum = 1;
        this.getSelectedTransactionFun();
      }
    },
    // 获取选中交易列表数据
    async getSelectedTransactionFun (data) {
      this.loading = true;
      let ids = '';
      if (data) {
        ids = data;
      } else {
        let indexNames = [];
        this.selectedTransaction.forEach(item => {
          indexNames.push(item.indexName + '###' + item.id);
        });
        ids = indexNames.join(',');
      }
      let params = {
        indexName: ids,
        page: this.pageNum, // 当前页
        pageSize: 10000 // 每页条数
      };
      const res = await dataService.getRelevanceId(params);
      if (res.data.code === 200) {
        this.loading = false;
        this.btnLoading = false;
        this.selectedTransaction = res.data.data.opLogList;
        if (this.selectedTransaction) {
          this.selectedRiskControlLogData = this.AfterChangeData;
        } else {
          this.selectedRiskControlLogData = [];
        }
        // this.totalItems = res.data.data.total;
        // this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
        this.pageNum = 1;
        this.getRiskList();
        this.deleteSelectedData = []; // 清空已选择的关联交易
        this.formData.relatedTransaction = ids;// 已添加关联交易
        this.formData.relevance = res.data.data.total; // 已添加关联交易笔数
      }
      this.btnLoading = false;
    },
    getRiskList () { // 前端分页获取列表内容
      if (this.selectedRiskControlLogData.length > 0) {
        this.selectedRiskControlLogData = this.AfterChangeData;
        this.totalItems = this.selectedTransaction.length;
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      } else {
        this.selectedRiskControlLogData = [];
        this.totalItems = 0;
        this.queryPageLength = 1;
      }
    },
    // 删除选中交易
    deleteSelectedTransaction () {
      let result = this.selectedTransaction.filter(item => this.deleteSelectedData.every(key => key.id !== item.id));
      if (result.length > 0) {
        this.pageNum = 1;
        this.selectedTransaction = result;
        this.getSelectedTransactionFun();
      } else {
        this.formData.relatedTransaction = '';
        this.formData.relevance = 0;
        this.selectedTransaction = [];// 选中交易列表空，风控日志列表则没有勾选数据
        this.selectedRiskControlLogData = [];
        this.getSelectedTransactionFun();
      }
    },
    // 查询风控日志列表分页
    riskOnPageChange (page) {
      this.riskPageNum = page;
      this.getEventsRiskList();
    },
    // 查询风控日志列表页数
    riskPageChange (data) {
      this.riskPerPageNum = data;
      this.riskPageNum = 1;
      this.getEventsRiskList();
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.getRiskList();
    },
    // 页数
    pageChange (data) {
      this.perPageNum = data;
      this.pageNum = 1;
      this.getRiskList();
    },
    // 点击保存 -- 待提报
    save () {
      this.formData.isSubmit = 0; // 是否提报（1是 0否）
      this.formData.states = 1; // 提报状态 1待提报，2已提报
      this.doSave('noSubmit');
    },
    // 点击保存并提报
    saveAndReport () {
      this.formData.isSubmit = 1; // 是否提报（1是 0否）
      this.formData.states = 2; // 提报状态 1待提报，2已提报
      this.doSave('submit');
    },
    async doSave (isSubmit) {
      // if (!this.formData.eventValue) {
      //   this.message('事件主体输入值不能为空或空格');
      //   return;
      // }
      if (this.formData.relevance === 0 || this.formData.relevance === undefined) {
        this.message('请添加关联交易');
        return;
      }
      this.isTime = true; // 禁用按钮
      this.formData.isAmount = this.secondLevelRouterItems.isAccountType;
      try {
        let params = Object.assign({}, this.formData);
        let res;
        if (this.isEditMode && isSubmit === 'noSubmit') { // 编辑时点保存按钮
          res = await dataService.updateEventsReported(params);// 编辑时
        } else {
          res = await dataService.saveEventsReported(params);// 添加时
        }
        if (res.data.code === 200) {
          this.message(res.data.msg, 'success');
          this.valid = true;
          this.cancel();
        } else {
          this.isTime = false;
        }
      } catch (err) {
        this.isTime = false;
      }
    },
    // 时间格式化
    myGetDate (paramDate) {
      var year = paramDate.getFullYear();
      var month = paramDate.getMonth() + 1; // js从0开始取
      var date = paramDate.getDate();
      var hour = paramDate.getHours();
      var minutes = paramDate.getMinutes();
      var second = paramDate.getSeconds();
      if (month < 10) {
        month = '0' + month;
      }
      if (date < 10) {
        date = '0' + date;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (second < 10) {
        second = '0' + second;
      }
      let resultDate = year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + second;
      return resultDate;
    },
    cancel () {
      // 传递给上级页面路由参数，用来判断回到动账类下或非动账类下
      this.$router.push({
        path: '/caseReport',
        name: 'caseReport',
        params: {
          accountType: this.secondLevelRouterItems.isAccountType
        }
      });
    },
    getFileFun (file) {
      this.formData.accessory = file.length ? file.join(',') : ''; // 附件
    },
    // 文件下载
    downloadFileFun (item) {
      const params = {
        urls: item.url
      };
      dataService.downloadFile(params).then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = item.name;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.snackbarError = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
  .title-info {
    color:#000;
    i {
      color: red;
      margin-right: 4px;
    }
    span {
      color:#999999;
    }
  }
  .textarea-input {
    margin: 0 auto;
    width: 88%;
  }
  .dialog-subtitle {
    color: #000;
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    background-color: var(--v-seeDetailsHeadBgColor-base);
  }
  .filed-text-center {
    height: 40px;
    line-height: 40px;
    text-align: right;
    color:#333;
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
</style>
