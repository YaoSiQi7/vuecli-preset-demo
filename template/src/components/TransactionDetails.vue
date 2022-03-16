<template>
<!-- tab页---交易详情 -->
  <div>
    <!-- <v-row class="backgroudColor">
      <v-col class="labelFtSize">
        交易汇总信息
      </v-col>
    </v-row> -->
    <div>
      <div
        class="account_details account_header_info">
        <span>出账次数：</span>
        <span>{{ riskMonitor.outNum }}</span>
      </div>
      <div
        class="account_details account_header_info">
        <span>出账总金额：</span>
        <span>{{ riskMonitor.outAmount }}</span>
      </div>
      <div
        class="account_details account_header_info">
        <span>入账次数：</span>
        <span>{{ riskMonitor.inNum }}</span>
      </div>
      <div
        class="account_details account_header_info">
        <span>入账总金额：</span>
        <span>{{ riskMonitor.inAmount }}</span>
      </div>
      <div
        class="account_details account_header_info">
        <span>关联设备数：</span>
        <span>{{ riskMonitor.relationDevfpNum }}</span>
      </div>
      <div
        class="account_details account_header_info">
        <span>关联手机号：</span>
        <span>{{ riskMonitor.relationPhoneNum }}</span>
      </div>
      <div
        class="account_details account_header_info">
        <span>二类账户数：</span>
        <span>{{ riskMonitor.twoAccountNum }}</span>
      </div>
      <div
        class="account_details account_header_info">
        <span>三类账户数：</span>
        <span>{{ riskMonitor.threeAccountNum }}</span>
      </div>
    </div>
    <!-- 多种类户信息 -->
    <div v-if="accountTradeDetail.length > 0">
      <div
        v-for="(item, index) in accountTradeDetail"
        :key="newD + index"
      >
        <v-row
          class="accountTitlePLeft"
          @mouseenter="enterlist(item, index)"
          @mouseleave="leavelist(item, index)">
          <v-col
            cols="8"
            class="backgroudColor labelFtSize">
            {{ item.bankCardAccountType }}：{{ item.bankCard }}的交易汇总信息
          </v-col>
          <v-col
            cols="4"
            class="backgroudColor"
            style="position：relative;">
            <span v-if="item.AccountBlack" class="add_black" @click="add_black(index + 1)">加入黑名单</span>
          </v-col>
        </v-row>
        <div class="accountTitlePLeft">
          <div
            class="account_details account_content_info">
            <span>出账次数：</span>
            <span>{{ item.outNum }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>入账次数：</span>
            <span>{{ item.inNum }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>出账总金额：</span>
            <span>{{ item.outTotalAmount }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>入账总金额：</span>
            <span>{{ item.inTotalAmount }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>平均出账金额：</span>
            <span>{{ item.outAvgAmount }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>平均入账金额：</span>
            <span>{{ item.inAvgAmount }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>出账账户数：</span>
            <span>{{ item.outAccountNum }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>入账账户数：</span>
            <span>{{ item.inAccountNum }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>单笔出账最大金额：</span>
            <span>{{ item.outMaxAmount }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>单笔入账最大金额：</span>
            <span>{{ item.inMaxAmount }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>单个账户出账最大金额：</span>
            <span>{{ item.accountOutMaxAmount }}</span>
          </div>
          <div
            class="account_details account_content_info">
            <span>单个账户入账最大金额：</span>
            <span>{{ item.accountInMaxAmount }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <v-row
      class="accountTitlePLeft"
      @mouseenter="enterlist(1)"
      @mouseleave="leavelist(2)">
      <v-col
        cols="8"
        class="backgroudColor">
        一类户：{{ allData.oneAccount }}的交易汇总信息
      </v-col>
      <v-col
        cols="4"
        class="backgroudColor"
        style="position：relative;">
        <span v-if="oneAccountBlack" class="add_black" @click="add_black(1)">加入黑名单</span>
      </v-col>
    </v-row> -->
    <div class="accountTitlePLeft">
      <!-- <div
        v-for="(item, index) in allData.oneAccountDetails"
        :key="index"
        class="account_details account_content_info">
        <span>{{ item.name }}：</span>
        <span>{{ item.value }}</span>
      </div> -->
    </div>
    <!-- <v-row
      class="accountTitlePLeft"
      @mouseenter="enterlist(3)"
      @mouseleave="leavelist(4)">
      <v-col
        cols="8"
        class="backgroudColor">
      二类户：{{ allData.twoAccount }}的交易汇总信息
      </v-col>
      <v-col
        cols="4"
        class="backgroudColor"
        style="position：relative;">
        <span v-if="twoAccountBlack" class="add_black" @click="add_black(3)">加入黑名单</span>
      </v-col>
    </v-row> -->
    <!-- <div class="accountTitlePLeft">
      <div
        v-for="(item, index) in allData.twoAccountDetails"
        :key="index"
        class="account_details account_content_info">
        <span>{{ item.name }}：</span>
        <span>{{ item.value }}</span>
      </div>
    </div> -->
    <v-row>
      <v-col cols="11" class="py-0">
        <base-search-change
          :key="newDate"
          :fieldList="searchForm"
          @search="search($event)"
          @reset="resetSearchData($event)"
          @onHandleChange="onHandleChange($event)"
          :clearDate="clearDate"
        ></base-search-change>
      </v-col>
    </v-row>
    <div>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :items-per-page="perPageNum"
        no-results-text="没有匹配的数据"
        no-data-text="没有匹配的数据"
        hide-default-footer
        class="elevation-1"
        :loading="loading"
        loading-text="加载数据中..."
        :fixed-header="true"
      >
        <!-- 列表项 -->
        <template v-slot:item.appId="{ item }">
          <span>{{item.appId | textFilters(allApp)}}</span>
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
        <!-- 分页 -->
        <template v-slot:no-data>
          <div>没有数据</div>
        </template>
        <template v-slot:footer >
          <v-divider></v-divider>
          <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
            <div class="footer__select">
              每页
              <span style="width: 60px;">
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
    <!-- 查看详情 -->
    <v-dialog v-model="detailsDialog" scrollable persistent max-width="1200px">
    <v-card>
      <v-card-title>
        <span class="seeDetails_size">查看详情</span>
        <div class="flex-grow-1" />
        <v-btn icon dark @click="cancleDetailsDialog">
          <v-icon color="var(--v-headerCloseIconColor-base)">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="6"  v-if="Object.keys(hitRule).length > 0">
            <div style="border: 1px solid #F3F3F3;">
              <v-card-title class="header_bg_color">
                <span v-if="templateName === '商户风险监控'">商户账户风险策略</span>
                <span v-if="templateName === '企业风险监控'">企业账户风险策略</span>
                <span v-if="templateName === '账户风险监控'">个人账户风险策略</span>
              </v-card-title>
              <v-row class="mt-2" style="padding: 0;margin:0;">
                <v-col
                  cols="9"
                >
                  <div>
                    <span class="base_field_text_cu">风险标签：</span>
                    <span class="base_field_color">{{ hitRule.monitoringScore.monitoringLabels }}</span>
                  </div>
                </v-col>
              </v-row>
              <div class="dashed_color"></div>
              <v-row class="addDetilBaseMTop">
                <v-col>
                  <v-row>
                    <v-col cols="8">
                      <span class="base_field_text_cu">命中规则：</span>
                    </v-col>
                    <v-col cols="4">
                      <span class="base_field_text_cu">风险分数：</span>
                    </v-col>
                  </v-row>
                  <div v-if="Object.keys(hitRule.monitoringScore).length > 0 && hitRule.monitoringScore.monitoringRule.length > 0">
                    <v-row v-for="(item, index) in hitRule.monitoringScore.monitoringRule" :key="index">
                      <v-col cols="8">
                        <div class="base_field_color">{{ item.rule_name }}</div>
                      </v-col>
                      <v-col cols="4">
                        <div>{{ item.rule_score | matchTypeValue() }}</div>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-else></div>
                </v-col>
              </v-row>
            </div>
            <div style="border: 1px solid #F3F3F3;">
              <v-card-title class="header_bg_color">
                上线风险策略
              </v-card-title>
              <v-row class="mt-2" style="padding: 0;margin:0;">
                <v-col
                  cols="3"
                  style="padding: 0;margin:0;text-align: center;"
                >
                  <!-- 人工审核 -->
                  <span v-if="hitRule.officialResult.strategy === '人工审核'" class="emptyCircle manuallyReview">
                    <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                  </span>
                  <!-- 自动放行 -->
                  <span v-else-if="hitRule.officialResult.strategy === '自动放行'" class="emptyCircle automaticPermitThrough">
                    <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                  </span>
                  <!-- 加强认证 -->
                  <span v-else-if="hitRule.officialResult.strategy === '加强认证'" class="emptyCircle identification">
                    <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                  </span>
                  <!-- 自动阻断 -->
                  <span v-else-if="hitRule.officialResult.strategy === '自动阻断'" class="emptyCircle autoBlacking">
                    <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                  </span>
                  <!-- 试运行：默认颜色 -->
                  <span v-else class="emptyCircle tacitlyApprove">
                    <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                  </span>
                </v-col>
                <v-col
                  cols="9"
                >
                  <div>
                    <span class="base_field_text_cu">匹配模式：</span>
                    <span>{{ hitRule.officialResult.matchType }}</span>
                  </div>
                  <div>
                    <span class="base_field_text_cu">建议策略：</span>
                    <span>{{ hitRule.officialResult.strategy }}</span>
                  </div>
                  <div>
                    <span class="base_field_text_cu">风险标签：</span>
                    <span class="base_field_color">{{ hitRule.officialResult.hit_labels }}</span>
                  </div>
                </v-col>
              </v-row>
              <div class="dashed_color"></div>
              <v-row class="addDetilBaseMTop">
                <v-col>
                  <v-row>
                    <v-col cols="8">
                      <span class="base_field_text_cu">命中规则：</span>
                    </v-col>
                    <v-col cols="4">
                      <span v-if="hitRule.officialResult.matchType === '评分模式'" class="base_field_text_cu">规则权重：</span>
                      <span v-else class="base_field_text_cu">处置策略：</span>
                    </v-col>
                  </v-row>
                  <div v-if="Object.keys(hitRule.officialResult).length > 0 && hitRule.officialResult.hit_rules.length > 0">
                    <v-row v-for="(item, index) in hitRule.officialResult.hit_rules" :key="index">
                      <v-col cols="8">
                        <div class="base_field_color">{{ item.rule_name }}</div>
                      </v-col>
                      <v-col cols="4">
                        <div v-if="hitRule.officialResult.matchType === '评分模式'">{{ item.rule_score | matchTypeValue() }}</div>
                        <div v-else>{{ item.rule_strategy }}</div>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-else></div>
                </v-col>
              </v-row>
            </div>
            <!--  -->
          </v-col>
          <v-col cols="6">
            <!-- 二期详情右边的自动配置 -->
            <div v-for="(item, index) in oplogDetails" :key="index" style="border: 1px solid #F3F3F3;margin-bottom: 10px;">
              <v-card-title class="header_bg_color">
                {{ item.groupName }}
              </v-card-title>
              <v-row v-for="(i, x) in item.groupData" :key="x" class="addDetilBaseMTop">
                <v-col>
                  <span class="base_field_text_cu">{{ i.name}}：</span>
                  <span>{{ i.value }}</span>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    </v-dialog>
    <!-- 添加黑名单弹窗 -->
    <v-dialog v-model="addBlackDialog" persistent scrollable max-width="630px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            添加名单数据
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn icon dark @click="addBlackDialog = false">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-form
            ref="form"
            :lazy-validation="lazy"
            v-model="valid"
            class="form"
          >
            <v-row>
              <v-col cols="2">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="8">
                <v-select
                  label="所属应用"
                  v-model="form.applyList"
                  :items="applyListItems"
                  item-text="appName"
                  item-value="id"
                  required
                  multiple
                  :rules="[v => v.length > 0 || '所属应用不能为空']"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  @change="handleChangeSelectApply(form.applyList)"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="8">
                <v-select
                  label="所属名单集"
                  v-model="form.nameList"
                  :items="nameListItems"
                  item-text="listName"
                  item-value="id"
                  required
                  multiple
                  :rules="[v => v.length > 0 || '所属名单集不能为空']"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  @change="handleChangeSelectList(form.nameList)"
                />
              </v-col>
            </v-row>
            <!-- 日期 -->
            <v-row>
              <v-col cols="2">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="8">
                <DatetimePicker
                  required
                  solo
                  flat
                  dense
                  persistent
                  v-model="form.value"
                  time-format="HH:mm:ss"
                  :type="3"
                  @clear="form.value = ''"
                  :text-field-props="fors.textFieldProps"
                  :date-picker-props="fors.dateProps"
                  :time-picker-props="fors.timeProps"
                  placeholder="不填写时，默认永久有效"
                  class="isEditDropdown"
                >
                </DatetimePicker>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pt-4 pb-4">
          <div class="flex-grow-1"></div>
          <v-btn class="pl-0 mr-4" @click="cancelSubmit">关闭</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="doSubmit">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import * as transactionDetails from 'api/transactionDetails.js';
import BaseSearchChange from '@c/BaseSearchChange';
import DatetimePicker from '@c/DateTimePicker';
import moment from 'moment';
import {
  sysAppinfoInfo,
  getBlankListNames,
  batchInsertNameData
} from 'api/relationGraph.js';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'TransactionDetails',
  props: {
    allData: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    // 公共弹框
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '', // success', 'info', 'error' 三种类型
    allApp: [],
    newDate: null,
    oneAccountBlack: false,
    twoAccountBlack: false,
    loading: false,
    // 分页变量
    pageNum: 1,
    queryPageLength: 0,
    perPageNum: 10,
    totalItems: 0,
    perPageItems: [5, 10, 15, 20],
    // 查询条件相关
    dateStart: null,
    dateEnd: null,
    isdateShow: false,
    searchValid: true,
    clearDate: false,
    searchForm: [],
    tradeTypeItems: [],
    dateItems: [
      { text: '今天', value: '' },
      { text: '近一周', value: -7 },
      { text: '近一月', value: -30 },
      { text: '近一年', value: -365 }
    ],
    // 列表
    headers: [],
    desserts: [],
    detailsDialog: false,
    hitRule: {},
    oplogDetails: [],
    // 加入黑名单
    addBlackDialog: false,
    valid: true,
    lazy: false,
    form: {
      applyList: '',
      nameList: '',
      value: ''
    },
    fors: {
      label: '失效时间*',
      textFieldProps: {
        appendIcon: 'event'
      },
      dateProps: {
        headerColor: 'primary'
      },
      timeProps: {
        useSeconds: true,
        ampmInTitle: true
      }
    },
    applyListItems: [],
    applyListItemIdAry: [], // 黑名单中选中应用所对应的id
    nameListItems: [],
    // 名单集搜到数据
    listsListArr: '',
    blackSet: '',
    // 权限控制
    newD: null,
    riskMonitor: {
      outNum: '',
      outAmount: '',
      inNum: '',
      inAmount: '',
      relationDevfpNum: '',
      relationPhoneNum: '',
      twoAccountNum: '',
      threeAccountNum: ''
    },
    accountTradeDetail: [], // 交易汇总信息
    templateInfo: {}, // 列表接口params的关于模块的信息
    templateName: '', // 模块名称
    templateItemData: '', // 某个模块列表中的某一项
    getAllRulesAry: [], // 命中规则
    riskControlAry: [], // 风险标签
    bankCard: '', // 加入黑名单当前项的银行卡号
    blackId: '', // 加入黑名单当前项的id
    riskTimeRange: [] // 风险监控时间范围
  }),
  created () {
    this.templateName = window.sessionStorage.getItem('tabsName');
    this.templateItemData = JSON.parse(window.sessionStorage.getItem('tabsQuery'));
    this.riskTimeRange = this.templateItemData.riskTimeRange.split(' 至 ');
    this.templateInfo.moduleType = this.templateName;
    if (sessionStorage.getItem('tabsName') === '商户风险监控' || this.templateName === '商户风险监控') {
      this.templateInfo.moduleType = 'merchant';
      this.templateInfo.merInfoId = this.templateItemData.merInfoId;
      this.headers = [
        {
          text: '所属应用',
          align: 'left',
          sortable: false,
          value: 'appId',
          width: 150
        },
        { text: '交易类型', value: 'op_type', sortable: false, width: 100 },
        { text: '出账账号', value: 'out_account', sortable: false, width: 100 },
        { text: '入账账号', value: 'in_account', sortable: false, width: 200 },
        { text: '金额', value: 'amount', sortable: false, width: 150 },
        { text: '交易时间', value: 'trade_time', sortable: false, width: 150 },
        { text: '命中规则', value: 'result', sortable: false, width: 250 },
        { text: '风险标签', value: 'risk_labels', sortable: false, width: 120 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 100 }
      ];
    } else if (sessionStorage.getItem('tabsName') === '企业风险监控' || this.templateName === '企业风险监控') {
      this.templateInfo.moduleType = 'enterprise';
      this.templateInfo.entInfoId = this.templateItemData.entInfoId;
      this.headers = [
        {
          text: '所属应用',
          align: 'left',
          sortable: false,
          value: 'appId',
          width: 150
        },
        { text: '交易类型', value: 'op_type', sortable: false, width: 100 },
        { text: '出账账号', value: 'out_account', sortable: false, width: 100 },
        { text: '入账账号', value: 'in_account', sortable: false, width: 200 },
        { text: '金额', value: 'amount', sortable: false, width: 150 },
        { text: '交易时间', value: 'trade_time', sortable: false, width: 150 },
        { text: '命中规则', value: 'result', sortable: false, width: 250 },
        { text: '风险标签', value: 'risk_labels', sortable: false, width: 120 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 100 }
      ];
    } else if (sessionStorage.getItem('tabsName') === '账户风险监控' || this.templateName === '账户风险监控') {
      this.templateInfo.moduleType = 'account';
      this.templateInfo.accoInfoId = this.templateItemData.accoInfoId;
      this.headers = [
        {
          text: '所属应用',
          align: 'left',
          sortable: false,
          value: 'appId',
          width: 150
        },
        { text: '交易类型', value: 'op_type', sortable: false, width: 100 },
        { text: '出账账号', value: 'out_account', sortable: false, width: 100 },
        { text: '入账账号', value: 'in_account', sortable: false, width: 200 },
        { text: '金额', value: 'amount', sortable: false, width: 150 },
        { text: '交易时间', value: 'trade_time', sortable: false, width: 150 },
        { text: '命中规则', value: 'result', sortable: false, width: 250 },
        { text: '风险标签', value: 'risk_labels', sortable: false, width: 120 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 100 }
      ];
    } else {
      this.snackbarServe = true;
      this.timeout = 10000;
      this.snackbarServeMsg = '获取监控模块错误，请返回上一页重试！';
      this.snackbarServeColor = 'error';
      return;
    }
    this.dataState(); // 获取交易汇总信息
    this.sysAppinfoInfos();
    // this.headers = this.headers;
    this.getTradeTypeList(); // 获取交易类型
    this.getAllRules(); // 获取命中规则
    this.riskControl(); // 获取风险标签
    this.searchTemp();
  },
  filters: {
    // 评分模式下：规则权重的值删除小数点后的数字。
    matchTypeValue: function (data) {
      let dataValue;
      let dataIndex = String(data).indexOf('.');
      if (data && String(data).indexOf('.') !== -1) {
        dataValue = String(data).substring(0, dataIndex);
      } else {
        dataValue = data;
      }
      return dataValue;
    },
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
  },
  computed: {
    ...mapGetters([
      'appId'
    ])
  },
  components: {
    DatetimePicker,
    BaseSearchChange
  },
  methods: {
    // 获取交易汇总信息
    async dataState () {
      let params = null;
      let response = null;
      if (this.templateName === '商户风险监控') {
        params = {
          merId: this.templateItemData.merId
        };
        response = await transactionDetails.findmerchanttradedetail(params);
      } else if (this.templateName === '企业风险监控') {
        params = {
          entId: this.templateItemData.entId
        };
        response = await transactionDetails.findenterprisetradedetail(params);
      } else if (this.templateName === '账户风险监控') {
        params = {
          accoId: this.templateItemData.accoId
        };
        response = await transactionDetails.findaccounttradedetail(params);
      }
      // this.templateItemData = JSON.parse(window.sessionStorage.getItem('tabsQuery'));
      // const response = await transactionDetails.findaccounttradedetail(params);
      if (response.data.code === 200) {
        this.riskMonitor = response.data.data.riskMonitor;
        if (this.templateName === '商户风险监控') {
          this.accountTradeDetail = response.data.data.merchantTradeDetail;
        } else if (this.templateName === '企业风险监控') {
          this.accountTradeDetail = response.data.data.enterpriseTradeDetail;
        } else if (this.templateName === '账户风险监控') {
          this.accountTradeDetail = response.data.data.accountTradeDetail;
        }
        this.accountTradeDetail.forEach((item, index, ary) => {
          if (item.bankCardAccountType === '1') {
            item.bankCardAccountType = '一类账户';
          } else if (item.bankCardAccountType === '2') {
            item.bankCardAccountType = '二类账户';
          } else if (item.bankCardAccountType === '3') {
            item.bankCardAccountType = '三类账户';
          }
          ary[index].AccountBlack = false;
        });
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = response.data.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 获取命中规则
    async getAllRules () {
      let param = {
        appId: ''
      };
      this.getAllRulesAry = [];
      const response = await transactionDetails.getAllRules(param);
      if (response.data.code === 200) {
        this.$nextTick(() => {
          response.data.data.forEach((item, index, ary) => {
            item.text = item.ruleName;
            item.value = item.ruleName;
          });
          this.getAllRulesAry = response.data.data;
          // let resTradeTypeItems = response.data.data;
          // this.resTradeTypeItems = response.data.data;
          // resTradeTypeItems.forEach((item, index, ary) => {
          //   this.tradeTypeItems.push({
          //     text: item.tradeName,
          //     value: item.id
          //   });
          // });
          this.getAllRulesAry.unshift({ text: '全部命中规则', value: '' });
          this.searchForm[5].options = this.getAllRulesAry;
        });
      } else {
        this.getAllRulesAry.unshift({ text: '全部命中规则', value: '' });
        this.searchForm[5].options = this.getAllRulesAry;
      }
    },
    // 获取风险标签
    async riskControl () {
      let param = {
        identifier: 'sys_risk_label'
      };
      this.riskControlAry = [];
      const response = await transactionDetails.getAllRiskControl(param);
      if (response.data.code === 200) {
        this.$nextTick(() => {
          response.data.data.forEach((item, index, ary) => {
            item.text = item.paramName;
            item.value = item.id;
          });
          this.riskControlAry = response.data.data;
          // let resTradeTypeItems = response.data.data;
          // this.resTradeTypeItems = response.data.data;
          // resTradeTypeItems.forEach((item, index, ary) => {
          //   this.tradeTypeItems.push({
          //     text: item.tradeName,
          //     value: item.id
          //   });
          // });
          this.riskControlAry.unshift({ text: '全部风险标签', value: '' });
          this.searchForm[6].options = this.riskControlAry;
        });
      } else {
        this.riskControlAry.unshift({ text: '全部风险标签', value: '' });
        this.searchForm[6].options = this.riskControlAry;
      }
    },
    // 加入黑名单滑过
    enterlist (item, index) {
      this.newD = new Date();
      this.accountTradeDetail[index].AccountBlack = true;
    },
    // 加入黑名单滑过离开
    leavelist (item, index) {
      this.newD = new Date();
      this.accountTradeDetail[index].AccountBlack = false;
    },
    // 获取应用场景，即场景管理下的交易类型
    async getTradeTypeList () {
      let jsonIds = null;
      this.searchForm.forEach((item, index, ary) => {
        if (item.placeholder === '全部应用') {
          jsonIds = item.value;
        }
      });
      // this.searchTemp();
      let param = {
        jsonIds: jsonIds ? JSON.stringify(jsonIds.split(',')) : '[]'
      };
      this.tradeTypeItems = [];
      const response = await transactionDetails.tradeTypes(param);
      if (response.data.code === 200) {
        let resTradeTypeItems = response.data.data;
        this.resTradeTypeItems = response.data.data;
        resTradeTypeItems.forEach((item, index, ary) => {
          this.tradeTypeItems.push({
            text: item.tradeName,
            value: item.identifier
          });
        });
        this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
        this.searchForm[2].options = this.tradeTypeItems;
      } else {
        this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
      }
    },
    // 获取搜索条件
    searchTemp () {
      this.allApp = [];
      this.allApp = JSON.parse(sessionStorage.getItem('vuexAppList'));
      this.allApp.forEach((item, index) => {
        item.text = item.appName;
        item.value = item.id;
      });
      this.allApp.unshift({ text: '全部应用', value: '' });
      if (this.templateName === '商户风险监控') {
        this.searchForm = [
          {
            placeholder: '时间',
            value: this.riskTimeRange,
            type: 'date'
          },
          {
            placeholder: '全部应用',
            value: '',
            type: 'select',
            options: this.allApp
          },
          {
            placeholder: '交易类型',
            value: '',
            type: 'select',
            options: this.tradeTypeItems
          },
          {
            placeholder: '出账账号',
            value: '',
            type: 'text'
          },
          {
            placeholder: '入账账号',
            value: '',
            type: 'text'
          },
          {
            placeholder: '命中规则查询',
            value: '',
            type: 'autocomplete',
            options: this.getAllRulesAry
          },
          {
            placeholder: '风险标签',
            value: '',
            type: 'select',
            options: this.riskControlAry
          }
        ];
      } else if (this.templateName === '企业风险监控') {
        this.searchForm = [
          {
            placeholder: '时间',
            value: this.riskTimeRange,
            type: 'date'
          },
          {
            placeholder: '全部应用',
            value: '',
            type: 'select',
            options: this.allApp
          },
          {
            placeholder: '交易类型',
            value: '',
            type: 'select',
            options: this.tradeTypeItems
          },
          {
            placeholder: '出账账号',
            value: '',
            type: 'text'
          },
          {
            placeholder: '入账账号',
            value: '',
            type: 'text'
          },
          {
            placeholder: '命中规则查询',
            value: '',
            type: 'autocomplete',
            options: this.getAllRulesAry
          },
          {
            placeholder: '风险标签',
            value: '',
            type: 'select',
            options: this.riskControlAry
          }
        ];
      } else if (this.templateName === '账户风险监控') {
        this.searchForm = [
          {
            placeholder: '时间',
            value: this.riskTimeRange,
            type: 'date'
          },
          {
            placeholder: '全部应用',
            value: '',
            type: 'select',
            options: this.allApp
          },
          {
            placeholder: '交易类型',
            value: '',
            type: 'select',
            options: this.tradeTypeItems
          },
          {
            placeholder: '出账账号',
            value: '',
            type: 'text'
          },
          {
            placeholder: '入账账号',
            value: '',
            type: 'text'
          },
          {
            placeholder: '命中规则查询',
            value: '',
            type: 'autocomplete',
            options: this.getAllRulesAry
          },
          {
            placeholder: '风险标签',
            value: '',
            type: 'select',
            options: this.riskControlAry
          }
        ];
      }
      this.newDate = new Date().getTime();
      this.search();
    },
    // 点击查询
    search ($event) {
      this.pageNum = 1;
      this.initGetData($event);
    },
    // 重置搜索条件
    resetSearchData ($event) {
      this.searchForm = [
        {
          placeholder: '时间',
          value: this.riskTimeRange,
          type: 'date'
        },
        {
          placeholder: '全部应用',
          value: '',
          type: 'select',
          options: this.allApp
        },
        {
          placeholder: '交易类型',
          value: '',
          type: 'select',
          options: this.tradeTypeItems
        },
        {
          placeholder: '出账账号',
          value: '',
          type: 'text'
        },
        {
          placeholder: '入账账号',
          value: '',
          type: 'text'
        },
        {
          placeholder: '命中规则查询',
          value: '',
          type: 'autocomplete',
          options: this.getAllRulesAry
        },
        {
          placeholder: '风险标签',
          value: '',
          type: 'select',
          options: this.riskControlAry
        }
      ];
      this.getTradeTypeList();
      this.newDate = new Date().getTime();
      this.search();
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
      console.log($event);
      let params = {};
      if ($event !== undefined) {
        params = Object.assign(this.templateInfo, {
          startTime: moment(moment($event[0].value.split(' 至 ')[0]).valueOf()).format('YYYYMMDDHHmmss'),
          entTime: moment(moment($event[0].value.split(' 至 ')[1]).valueOf()).format('YYYYMMDDHHmmss').replace('000000', '235959'),
          appId: $event[1].value,
          opType: $event[2].value,
          outAccount: $event[3].value,
          inAccount: $event[4].value,
          rules: $event[5].value,
          riskLabel: $event[6].value,
          startIndex: this.pageNum,
          pageSize: this.perPageNum
        });
        params.opType = params.opType ? params.opType : '';
        this.queryRiskData(params);
      } else {
        this.$nextTick(() => {
          let datesStr = this.searchForm[0].value;
          params = Object.assign(this.templateInfo, {
            startTime: moment(moment(this.searchForm[0].value.split(' 至 ')[0]).valueOf()).format('YYYYMMDDHHmmss'),
            entTime: Number(moment(moment(datesStr.split(' 至 ')[1]).valueOf()).format('YYYYMMDD') + '235959'),
            appId: this.searchForm[1].value,
            opType: this.searchForm[2].value,
            outAccount: this.searchForm[3].value,
            inAccount: this.searchForm[4].value,
            rules: this.searchForm[5].value,
            riskLabel: this.searchForm[6].value,
            startIndex: this.pageNum,
            pageSize: this.perPageNum
          });
          params.opType = params.opType ? params.opType : '';
          this.queryRiskData(params);
        });
      }
    },
    // 调取查询接口
    async queryRiskData (params) {
      // do ajax
      this.loading = true;
      const res = await transactionDetails.findriskoplog(params);
      if (res.data.code === 200) {
        this.loading = false;
        let resData = res.data.data;
        if (resData.data.length > 0) {
          this.desserts = resData.data;
          this.totalItems = resData.totalItems;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
        } else {
          this.desserts = [];
          this.pageNum = 1;
          this.totalItems = 0;
          this.queryPageLength = 0;
        }
      } else {
        this.loading = false;
      }
    },
    // 列表搜索条件change事件
    async onHandleChange ($event) {
      if ($event.placeholder === this.searchForm[1].placeholder) {
        let jsonIds = null;
        this.searchForm.forEach((item, index, ary) => {
          if (item.placeholder === '全部应用') {
            jsonIds = item.value;
          }
        });
        // this.searchTemp();
        let param = {
          jsonIds: jsonIds ? JSON.stringify(jsonIds.split(',')) : '[]'
        };
        this.tradeTypeItems = [];
        const response = await transactionDetails.tradeTypes(param);
        if (response.data.code === 200) {
          let resTradeTypeItems = response.data.data;
          this.resTradeTypeItems = response.data.data;
          resTradeTypeItems.forEach((item, index, ary) => {
            this.tradeTypeItems.push({
              text: item.tradeName,
              value: item.identifier
            });
          });
          this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
          this.searchForm[2].options = this.tradeTypeItems;
          this.searchForm.forEach((item, index, ary) => {
            if (item.placeholder === '交易类型') {
              item.value = '';
            }
          });
        } else {
          this.tradeTypeItems.unshift({ text: '全部交易类型', value: '' });
          this.searchForm[2].options = this.tradeTypeItems;
          this.searchForm.forEach((item, index, ary) => {
            if (item.placeholder === '交易类型') {
              item.value = '';
            }
          });
        }
      }
    },
    async queryDetailItem (item) {
      let param = {
        id: item.id,
        indexName: item.indexName,
        moduleType: this.templateInfo.moduleType
      };
      const response = await transactionDetails.riskoplogdetail(param);
      if (response.data.code === 200) {
        this.detailsDialog = true;
        this.hitRule = {};
        this.oplogDetails = [];
        // 上线风险策略：删除风险标签最后的逗号。
        response.data.data.hitRule.officialResult.hit_labels = (response.data.data.hitRule.officialResult.hit_labels.substring(response.data.data.hitRule.officialResult.hit_labels.length - 1) === ',') ? response.data.data.hitRule.officialResult.hit_labels.substring(0, response.data.data.hitRule.officialResult.hit_labels.length - 1) : response.data.data.hitRule.officialResult.hit_labels;
        this.hitRule = Object.assign(this.hitRule, response.data.data.hitRule);
        this.oplogDetails = response.data.data.oplogDetails;
      } else {
        this.detailsDialog = false;
        this.hitRule = {};
        this.oplogDetails = [];
      }
    },
    // 查看详情弹窗关闭事件
    cancleDetailsDialog () {
      this.detailsDialog = false;
    },
    // 获取所属应用列表
    async sysAppinfoInfos () {
      const params = {
        applyScopeId: 2
      };
      const response = await transactionDetails.getAppInfoOrTradeType(params);
      if (response.data.code === 200) {
        this.applyListItems = response.data.data;
      } else {
        this.applyListItems = [];
      }
    },
    // 加入黑名单-弹窗
    // addSelecte () {
    //   let arr = [];
    //   this.selected.forEach(item => {
    //     arr.push(item.listValue);
    //   });
    //   this.blackSet = arr.join(',');
    //   if (this.blackSet !== '') {
    //     this.detailDialog = false;
    //     this.addBlackDialog = true;
    //   }
    //   this.selected = [];
    // },
    // 获取所属应用下的名单集（黑名单)
    async getBlankListName (param) {
      try {
        const response = await transactionDetails.getBlankListNames(param);
        if (response.data.code === 200) {
          this.nameListItems = response.data.data;
        } else {
          this.nameListItems = [];
        }
      } catch (err) {
        this.nameListItems = [];
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 点击加入黑名单set
    add_black (num) {
      this.bankCard = this.accountTradeDetail[num - 1].bankCard;
      this.blackId = this.accountTradeDetail[num - 1].id;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.addBlackDialog = true;
    },
    cancelSubmit () {
      this.nameListItems = [];
      this.form.nameList = [];
      this.form.value = '';
      this.$refs.form.reset();
      this.addBlackDialog = false;
    },
    // 保存
    doSubmit () {
      // 转换为年月日时分秒
      let datetime = null;
      if (this.form.value !== '') {
        var d = this.form.value;
        datetime =
          d.getFullYear() +
          '-' +
          (d.getMonth() + 1 < 10
            ? '0' + (d.getMonth() + 1)
            : d.getMonth() + 1) +
          '-' +
          (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
          ' ' +
          (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
          ':' +
          (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
          ':' +
          (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
      } else {
        datetime = null;
      }
      let query = {
        listId: this.listsListArr,
        tableName: '',
        column: this.bankCard,
        id: this.blackId,
        expireTime: datetime
      };
      if (this.templateName === '商户风险监控') {
        query.tableName = 'effectMerTradeDetails';
      } else if (this.templateName === '企业风险监控') {
        query.tableName = 'effectEntTradeDetails';
      } else if (this.templateName === '账户风险监控') {
        query.tableName = 'effectAccoTradeDetails';
      }
      // 保存黑名单接口
      this.batchInsertNameData(query);
      this.nameListItems = [];
      this.form.nameList = [];
      this.listsListArr = '';
      this.form.value = '';
      this.$refs.form.reset();
      this.addBlackDialog = false;
    },
    // 应用select下拉框的change事件
    handleChangeSelectApply (value) {
      this.applyListItemIdAry = [];
      this.nameListItems = [];
      this.form.nameList = [];
      if (value.length > 0) {
        value.forEach((im, ix, ay) => {
          this.applyListItems.forEach((item, index, ary) => {
            if (im === item.appName) {
              this.applyListItemIdAry.push(item.appId);
            }
          });
        });
        let params = {
          appIds: this.applyListItemIdAry.join(','),
          nodeType: 'out_account'
        };
        this.getBlankListName(params);
      }
    },
    // 名单select下拉框的change事件
    handleChangeSelectList (value) {
      this.listsListArr = value.join(',');
    },
    // 批量添加黑名单
    async batchInsertNameData (query) {
      try {
        const response = await transactionDetails.addNameData(query);
        if (response.data.code === 200 && response.data.data.code === '1') {
          this.snackbarServe = true;
          this.snackbarServeMsg = '加黑成功！';
          this.snackbarServeColor = 'success';
        } else if (response.data.code === 200 && response.data.data.code === '0') {
          this.snackbarServe = true;
          this.snackbarServeMsg = response.data.data.msg;
          this.snackbarServeColor = 'error';
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = response.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.data.msg;
        this.snackbarServeColor = 'error';
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.backgroudColor {
  background: var(--v-seeDetailsHeadBgColor-base) !important;
}
.account_details {
  width: 50%;
  display: inline-block;
}
.account_header_info {
  height: 50px;
  line-height: 50px;
}
.account_content_info {
  height: 30px;
  line-height: 30px;
}
.accountTitleMLeft {
  margin-left: 20px;
}
.accountTitlePLeft {
  padding-left: 20px;
}
.add_black {
  position absolute;
  right: 10px;
  color: red;
  cursor pointer;
}
// 查看详情样式
.isEditDropdown >>> .v-select__slot .v-input__append-inner {
  display: none !important
}
.base_field_text_cu {
  font-weight: bold;
}
.addDetilBaseMTop {
  padding: 0 10px;
}
.emptyCircle {
  width: 80px;
  height:80px;
  border-radius:50%;
  display: inline-block;
  text-align: center;
  line-height: 80px;
}
.manuallyReview {
  border: 8px solid var(--v-manuallyReviewColor-base);
}
.automaticPermitThrough {
  border: 8px solid var(--v-automaticPermitThroughColor-base);
}
.identification {
  border: 8px solid var(--v-identificationColor-base);
}
.autoBlacking {
  border: 8px solid var(--v-emptyCircleColor-base);
}
.tacitlyApprove {
  border: 8px solid var(--v-tacitlyApproveColor-base);
}
.base_field_color {
  color: var(--v-seeDetialFieldColor-base);
}
.dashed_color {
  height: 1px;
  border-top: 1px dashed var(--v-dashedColor-base);
}
.header_bg_color {
  height: 40px;
  padding: 0;
  padding-left: 10px;
  font-size: 14px;
  background: var(--v-seeDetailsHeadBgColor-base) !important;
  color: #000;
  font-size: 16px;
}
.seeDetails_size {
  font-size: 18px;
}
.labelFtSize {
  font-size: 16px;
}
</style>
