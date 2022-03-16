<!----------  @author: yijianchao  ----------->
<!----------  @updated_at: 2020-04-22  ----------->
<!----------  @version: 2.0  ----------->
<template>
  <div >
      <!-- tab -->
      <div v-if="tabItems.length > 0" style="padding-top: 0">
        <v-tabs v-model="activeTab">
          <v-tab
            v-for="(item,index) in tabItems"
            :key="item.tabName"
            class="tabHeight pr-0 pl-2"
            @change="tabChange(item,index)"
          >{{ item.tabName }}</v-tab>
        </v-tabs>
      </div>
      <!-- 主内容 -->
      <div>
        <div class="fill-height" v-show="dynamicLogShow">
          <div class="enu-content">
            <base-search @change="panelCounter">
              <template v-slot>
                <!-- 条件查询form -->
                  <slot>
                    <v-form
                      ref="form"
                      v-model="searchValid"
                      lazy-validation
                    >
                      <v-container grid-list-xl class="ml-0 mr-0 pt-0 pb-0">
                        <v-row>
                          <v-col v-for="(item, index) in formData" :key="index" cols="12" sm="12" :md=item.colNumber :xl=item.colNumber>
                            <v-text-field
                              v-if="item.searchType === 'text'"
                              v-model.trim="item.value"
                              :placeholder="item.cnName + '：'"
                              :required="item.required"
                              :rules="item.rules"
                              :sortNo="item.sortNo"
                              outlined
                              dense
                              class="pt-0 pb-0"
                            />
                            <v-select
                              v-if="item.searchType === 'select'"
                              :placeholder="item.cnName + '：'"
                              v-model="item.value"
                              item-text="name"
                              item-value="value"
                              :items="item.searchSrc"
                              :required="item.required"
                              :rules="item.rules"
                              :sortNo="item.sortNo"
                              no-data-text="没有匹配数据"
                              outlined
                              dense
                            />
                            <v-select
                              class="ruleSetAddOrEdit"
                              :placeholder="item.cnName + '：'"
                              v-if="item.searchType === 'multiple'"
                              :menu-props="{ bottom: true }"
                              v-model="item.value"
                              item-text="name"
                              item-value="text"
                              :items="item.searchSrc"
                              :rules="item.rules"
                              :sortNo="item.sortNo"
                              multiple
                              outlined
                              dense
                              no-data-text="没有匹配数据"
                            />
                            <v-autocomplete
                              v-if="item.searchType === 'autocomplete'"
                              :placeholder="item.cnName"
                              v-model="item.value"
                              item-text="ruleName"
                              item-value="ruleName"
                              :items="item.searchSrc"
                              :required="item.required"
                              :sortNo="item.sortNo"
                              outlined
                              dense
                              no-data-text="没有数据" />
                            <span class="baseSectionDisplay maxOrMinWidth" v-if="item.searchType === 'range'">
                              <span class="baseSection40 baseSectionDisplay">
                                <v-text-field
                                  v-model.trim="item.minValue"
                                  :placeholder="item.cnName + '最小值'"
                                  :rules="item.rules"
                                  outlined
                                  dense
                                  @blur="minValueBlur(item.minValue, item.maxValue, item.cnName)"
                                ></v-text-field>
                              </span>
                              <span class="baseSection20 baseSectionDisplay baseSectionCenter">
                                -
                              </span>
                              <span class="baseSection40 baseSectionDisplay">
                                <v-text-field
                                  v-model.trim="item.maxValue"
                                  :placeholder="item.cnName + '最大值'"
                                  :rules="item.rules"
                                  outlined
                                  dense
                                  @blur="maxValueBlur(item.minValue, item.maxValue, item.cnName)"
                                ></v-text-field>
                              </span>
                            </span>
                            <v-text-field
                              :key="index"
                              v-if="item.searchType === 'Date'"
                              outlined
                              dense
                              v-model="item.value"
                              append-icon="event"
                              :placeholder="item.cnName + '：'"
                              @click="dateInputClick(item)"
                            >
                            </v-text-field>
                            <v-dialog v-model="item.isdateShow" width="321">
                              <v-date-picker selected-items-text="已选择日期" v-model="dates" range  @change="dateChange(item.value,item)"></v-date-picker>
                            </v-dialog>
                          </v-col>

                          <v-col
                            cols="12"
                            sm="12"
                            md="2"
                            xl="2"
                          >
                            <v-btn
                              small
                              color="primary"
                              class="mr-2"
                              @click="reset"
                            >
                              重置
                            </v-btn>
                            <v-btn
                              small
                              color="primary"
                              @click="searchTable"
                            >
                              查询
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </slot>
              </template>
            </base-search>

            <v-data-table
              :headers="constHeader"
              :items="constItem"
              :items-per-page="perPageNum"
              hide-default-footer
              :fixed-header="true"
              :loading="loading"
              loading-text="加载数据中..."
              class="elevation-3 mt-3"
              no-results-text="没有匹配的数据"
              :height="tableHeight"
            >
              <!-- 列表头 -->
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title style="font-size:18px">
                    {{tableName}}
                  </v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  />
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
              <template v-slot:item.appid="{ item }">
                  <span>{{ item.appName }}</span>
              </template>
              <template v-slot:item.create_time="{ item }">
                  <span>{{ item.create_time | creDate }}</span>
              </template>
              <template v-slot:item.result="{ item }">
                  <span v-if="item.result == '0'">未审核</span>
                  <span v-if="item.result == '3'">清白件</span>
                  <span v-if="item.result == '4'">疑似欺诈</span>
                  <span v-if="item.result == '5'">案件</span>
              </template>
              <!-- 列表项 -->
              <template v-slot:item.action="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      class="mr-1 icon-primary"
                      v-on="on"
                      color="primary"
                      @click="seeDetails(item)"
                    >
                      mdi-currency-bdt
                    </v-icon>
                  </template>
                  <span>查看工单详情</span>
                </v-tooltip>
              </template>
              <template v-slot:no-data>
                <div>没有数据</div>
              </template>
              <!-- 分页组件 -->
              <template v-slot:footer>
                <v-divider></v-divider>
                <div class="mr-4 mb-0 mx-auto pa-2 transition-swing elevation-0">
                  <div class="footer__select">
                    每页
                    <span style="width:60px;">
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
        <v-row justify="center">
          <v-dialog v-model="crudFormDialog" scrollable persistent max-width="1200px">
            <v-card>
              <v-card-title>
                <span class="ckxq_size">查看详情</span>
                <div class="flex-grow-1" />
                <v-btn icon dark @click="crudFormDialog = false">
                  <v-icon color="#CCCCCC">mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
            </v-card>
          </v-dialog>
        </v-row>
        <!-- // 工单日志-二期：公共详情弹窗 -->
        <base-details :detailsDialog='detailsDialog' :hitRule='detailsHitRule' :oplogDetail='detailsOplogDetail' @cancleDetailsDialog='cancleDetailsDialog($event)'></base-details>
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
import {
  searchField,
  getTableHeader,
  getTableData,
  getOrderDetails,
  getAllRules,
  getOrderTableData,
  getOrderTableHeader
} from '@/api/repairOrderLog';
import * as dataService from 'api/caseManagementCenter/caseReport.js';
import BaseDetails from '@/components/BaseRiskLogDetails';
import BaseSearch from '@/components/BaseSearch';
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'orderLog',
  data: () => ({
    // 表格数据加载loading动画
    loading: true,
    tab: null,
    tabs: 6,
    tabItems: [],
    tabDefaultItems: [{
      text: '动账核查单'
    }, {
      text: '动账预警单'
    }, {
      text: '动账告警单'
    }, {
      text: '非动账核查单'
    }, {
      text: '非动账预警单'
    }, {
      text: '非动账告警单'
    }],
    activeTab: 0,
    dates: [], // 日期
    counter: 0,
    fullHeight: window.innerHeight,
    tableName: '动账核查单',
    logType: 1,
    workOrderType: 2,
    // 二期详情右边的自动配置
    detailsOplogDetail: [],
    detailsDialog: false,
    detailsHitRule: {},
    // 获取所有规则
    getAllRulesData: [],
    // 列表内容完成的数据
    tableContentData: [],
    // 公共弹框
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '', // success', 'info', 'error' 三种类型
    // 查看工单详情
    shebeileixing: '',
    APPbiaoshi: '',
    zhanghao: '',
    jiaoyileixing: '',
    changjingbiaoshi: '',
    shebeipinpai: '',
    shebeixinghao: '',
    caozuoshijian: '',
    IP: '',
    weizhi: '',
    hitRule: {
      simulatedResult: {
        matchType: '',
        hit_labels: '',
        strategy: '',
        hit_rules: [
          {
            rule_score: '',
            rule_name: '',
            rule_no: ''
          },
          {
            rule_score: '',
            rule_name: '',
            rule_no: ''
          },
          {
            rule_score: '',
            rule_name: '',
            rule_no: ''
          }
        ]
      },
      officialResult: {
        matchType: '',
        hit_labels: '',
        strategy: '',
        hit_rules: [
          {
            rule_score: '',
            rule_name: '',
            rule_no: ''
          },
          {
            rule_score: '',
            rule_name: '',
            rule_no: ''
          },
          {
            rule_score: '',
            rule_name: '',
            rule_no: ''
          }
        ]
      }
    },
    opLog: {},
    // 查看工单详情
    dynamicLogShow: true,
    noDynamicLogShow: false,
    // 搜索条件
    searchRulesArray: [
      {
        name: 'email', // 邮箱
        rules: [
          // eslint-disable-next-line no-useless-escape
          v => ((/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ig).test(v)) || '请输入正确的邮箱'
        ]
      },
      {
        name: 'identification', // 身份证
        rules: [
          v => ((/(^\d{15}$)|(^\d{17}(x|X|\d)$)/ig).test(v)) || '请输入正确的身份证号码'
        ]
      },
      {
        name: 'ip', // IP
        rules: [
          v => ((/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/ig).test(v)) || '请输入正确的IP'
        ]
      },
      {
        name: 'mobile', // 手机号码
        rules: [
          v => {
            if (v) {
              return (/^1\d{10}$/ig).test(v).test(v) || '请输入正确的手机号';
            }
            return true;
          }
          // v => ((/^1\d{10}$/ig).test(v)) || '请输入正确的手机号'
        ]
      },
      {
        name: 'tel', // 座机号码
        rules: [
          v => ((/0\d{2,3}-\d{7,8}|\(?0\d{2,3}[)-]?\d{7,8}|\(?0\d{2,3}[)-]*\d{7,8}/ig).test(v)) || '请输入正确的座机号码'
        ]
      },
      {
        name: 'zipcode', // 邮编
        rules: [
          v => ((/^\d{6}$/ig).test(v)) || '请输入正确的邮编'
        ]
      },
      {
        name: 'password', // 密码 （6～32个任意字符,不支持中文）
        rules: [
          // v => ((/^\w{6,32}$/ig).test(v)) || '请输入正确的密码'
          v => ((/^[^\u4E00-\u9FA5]{6,32}$/ig).test(v)) || '请输入正确的密码'
        ]
      },
      {
        name: 'sum', // 金额待定 （数字）
        rules: [
          v => {
            if (v) {
              return (/^[0-9][0-9]*(\.[0-9]+)?$/ig).test(v) || '请输入正确的数';
            }
            return true;
          }
          // v => ((/^[0-9][0-9]*(\.[0-9]+)?$/ig).test(v)) || '请输入正确的数'
        ]
      },
      {
        name: 'Date', // 日期
        rules: []
      },
      {
        name: 'chinese', // 汉字
        rules: [
          v => ((/^[\u4e00-\u9fa5]{0,}$/ig).test(v)) || '请输入正确的汉字'
        ]
      },
      {
        name: 'number', // 数字
        rules: [
          // eslint-disable-next-line no-useless-escape
          v => ((/^[0-9]*$/ig).test(v)) || '请输入正确的数字'
        ]
      },
      {
        name: 'letter', // 字母
        rules: [
          v => ((/^[A-Za-z]*$/ig).test(v)) || '请输入正确的字母'
        ]
      },
      {
        name: 'num_letter', // 除空格以外的任意字符，及其组合
        rules: [
          // v => ((/^[A-Za-z0-9]*$/ig).test(v)) || '请输入正确的字母和数字'
          v => {
            if (v) {
              return (/^[^\s]+$/ig).test(v) || '请输入除空格以外的任意字符，及其组合';
            }
            return true;
          }
        ]
      },
      {
        name: 'cn_num', // 汉字和数字
        rules: [
          v => ((/^[0-9\u4e00-\u9fa5]*$/ig).test(v)) || '请输入正确的汉字和数字'
        ]
      },
      {
        name: 'cn_letter', // 字母和汉字
        rules: [
          v => ((/^[A-Za-z]*$|^[\u4e00-\u9fa5]*$/ig).test(v)) || '请输入正确的字母和汉字'
        ]
      },
      {
        name: 'text', // 字符串
        rules: []
      }
    ],
    range: [], // 分
    dateItem: {},
    isUpdateShow: false,
    // 查看详情
    crudFormDialog: false,
    formData: [],
    fData: [],
    form: {},
    searchValid: true,
    applyTypeItems: [],
    firmNameItems: [],
    // 分页变量
    pageNum: 1, // 第几页
    queryPageLength: 1, // 总共有几页
    perPageNum: 10, // 每页多少条
    totalItems: 0, // 数据的总条数
    perPageItems: [5, 10, 15, 20, 50, 100],
    // 列表
    constHeader: [],
    constItem: [],
    searchForm: {},
    // 默认动账核查单查询条件列表
    accountVerifyOrder: {
      'code': 200,
      'msg': 'success',
      'data': [{
        'checkType': '',
        'sortNo': 1,
        'searchSrc': '[]',
        'fieldSrcId': '',
        'cnName': '风险时间',
        'searchType': 'Date',
        'isSearch': 1,
        'enName': 'create_time',
        'id': '',
        'type': '1'
      }, {
        'checkType': '',
        'sortNo': 2,
        'searchSrc': [],
        'fieldSrcId': 'b3db8cd016d94acd93d5871e4cea1c81',
        'cnName': '交易类型',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'op_type',
        'id': 'c2fe91ee42754ab1848a69502b5118c2',
        'type': '0'
      }, {
        'checkType': '',
        'sortNo': 3,
        'searchSrc': '[]',
        'fieldSrcId': 'ef8d63084d1c4cbea2fe39ecfebb291c',
        'cnName': '转出账户',
        'searchType': 'text',
        'isSearch': 1,
        'enName': 'out_account',
        'id': 'debb6035b7d24dc9988f453b334fb5ae',
        'type': '0'
      }, {
        'checkType': 'number',
        'sortNo': 4,
        'searchSrc': '[]',
        'fieldSrcId': '93022fc3ef484d5b80f94017dd804436',
        'cnName': '交易金额',
        'searchType': 'range',
        'isSearch': 1,
        'enName': 'amount',
        'id': '53ad6ccf049d4487a68eb8f7d88728fb',
        'type': '1'
      }, {
        'checkType': '',
        'sortNo': 5,
        'searchSrc': [{
          'name': '待提报',
          'value': '0'
        }, {
          'name': '已提报',
          'value': '1'
        }, {
          'name': '数据沉淀的初始状态',
          'value': '2'
        }, {
          'name': '已指派',
          'value': '3'
        }, {
          'name': '已转派',
          'value': '4'
        }, {
          'name': '驳回待审核',
          'value': '5'
        }, {
          'name': '驳回待复审',
          'value': '6'
        }, {
          'name': '初审审核结束',
          'value': '7'
        }, {
          'name': '复审完结',
          'value': '8'
        }],
        'fieldSrcId': '4a475222288a4f359df02ae30ca2a4fa',
        'cnName': '核查状态',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'state',
        'id': 'ccdb1caaef78487985393bdd7e1dfdf1',
        'type': '0'
      }, {
        'checkType': '',
        'sortNo': 6,
        'searchSrc': [{
          'name': '案件',
          'value': '5'
        }, {
          'name': '疑似欺诈',
          'value': '4'
        }, {
          'name': '清白件',
          'value': '3'
        }, {
          'name': '未审核',
          'value': '0'
        }],
        'fieldSrcId': '4c0543c6d208401fb9791fab218a9b64',
        'cnName': '核查结果',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'result',
        'id': '245e40520fa04663846f50403454b448',
        'type': '0'
      }]
    },
    // 动账预警、告警单查询条件列表
    accountSearchForm: {
      'code': 200,
      'msg': 'success',
      'data': [{
        'checkType': '',
        'sortNo': 1,
        'searchSrc': '[]',
        'fieldSrcId': '',
        'cnName': '风险时间',
        'searchType': 'Date',
        'isSearch': 1,
        'enName': 'create_time',
        'id': '',
        'type': '1'
      }, {
        'checkType': '',
        'sortNo': 2,
        'searchSrc': [],
        'fieldSrcId': 'b3db8cd016d94acd93d5871e4cea1c81',
        'cnName': '交易类型',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'op_type',
        'id': 'c2fe91ee42754ab1848a69502b5118c2',
        'type': '0'
      },
      {
        'checkType': '',
        'sortNo': 3,
        'searchSrc': [{
          'name': '案件',
          'value': '5'
        }, {
          'name': '疑似欺诈',
          'value': '4'
        }, {
          'name': '清白件',
          'value': '3'
        }, {
          'name': '未审核',
          'value': '0'
        }],
        'fieldSrcId': '4c0543c6d208401fb9791fab218a9b64',
        'cnName': '告警结果',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'result',
        'id': '245e40520fa04663846f50403454b448',
        'type': '0'
      }]
    },
    // 非动账核查单查询条件列表
    noAccountVerifyOrder: {
      'code': 200,
      'msg': 'success',
      'data': [{
        'checkType': '',
        'sortNo': 1,
        'searchSrc': '[]',
        'fieldSrcId': '',
        'cnName': '风险时间',
        'searchType': 'Date',
        'isSearch': 1,
        'enName': 'create_time',
        'id': '',
        'type': '1'
      }, {
        'checkType': '',
        'sortNo': 2,
        'searchSrc': [],
        'fieldSrcId': 'b3db8cd016d94acd93d5871e4cea1c81',
        'cnName': '交易类型',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'op_type',
        'id': 'c2fe91ee42754ab1848a69502b5118c2',
        'type': '0'
      }, {
        'checkType': '',
        'sortNo': 2,
        'searchSrc': [{ name: '人工审核', id: '4dc11aad3ec54e5bad95bf19b111099c', value: '80', srcType: 'SYS_VAR' }, { name: '自动放行', id: '96b2c503e25f4f48ba47d4c2dfa922e7', value: '0', srcType: 'SYS_VAR' }, { name: '加强认证', id: 'a79a4e45a38446e6b13bac227b859719', value: '40', srcType: 'SYS_VAR' }, { name: '自动阻断', id: 'f68e79c39ef742b6a479e3ce1b4d6942', value: '100', srcType: 'SYS_VAR' }],
        'cnName': '建议策略',
        'searchType': 'select',
        'enName': 'strategy',
        'fieldSrcId': 'b3db8cd016d94acd93d5871e4cea1c81',
        'isSearch': 1,
        'id': 'c2fe91ee42754ab1848a69502b5118c2',
        'type': '0'
      },
      {
        'sortNo': 5,
        'searchSrc': [{
          'name': '案件',
          'value': '5'
        }, {
          'name': '疑似欺诈',
          'value': '4'
        }, {
          'name': '清白件',
          'value': '3'
        }, {
          'name': '未审核',
          'value': '0'
        }],
        'fieldSrcId': '4c0543c6d208401fb9791fab218a9b64',
        'cnName': '核查结果',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'result',
        'id': '245e40520fa04663846f50403454b448',
        'type': '0'
      }, {
        'checkType': '',
        'sortNo': 6,
        'searchSrc': [{
          'name': '待提报',
          'value': '0'
        }, {
          'name': '已提报',
          'value': '1'
        }, {
          'name': '数据沉淀的初始状态',
          'value': '2'
        }, {
          'name': '已指派',
          'value': '3'
        }, {
          'name': '已转派',
          'value': '4'
        }, {
          'name': '驳回待审核',
          'value': '5'
        }, {
          'name': '驳回待复审',
          'value': '6'
        }, {
          'name': '初审审核结束',
          'value': '7'
        }, {
          'name': '复审完结',
          'value': '8'
        }],
        'fieldSrcId': '4a475222288a4f359df02ae30ca2a4fa',
        'cnName': '核查状态',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'state',
        'id': 'ccdb1caaef78487985393bdd7e1dfdf1',
        'type': '0'
      } ]
    },
    // 非动账预警、告警单查询条件列表
    noAccountSearchForm: {
      'code': 200,
      'msg': 'success',
      'data': [{
        'checkType': '',
        'sortNo': 1,
        'searchSrc': '[]',
        'fieldSrcId': '',
        'cnName': '风险时间',
        'searchType': 'Date',
        'isSearch': 1,
        'enName': 'create_time',
        'id': '',
        'type': '1'
      }, {
        'checkType': '',
        'sortNo': 2,
        'searchSrc': [],
        'fieldSrcId': 'b3db8cd016d94acd93d5871e4cea1c81',
        'cnName': '交易类型',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'op_type',
        'id': 'c2fe91ee42754ab1848a69502b5118c2',
        'type': '0'
      }, {
        'checkType': '',
        'sortNo': 2,
        'searchSrc': [{ name: '人工审核', id: '4dc11aad3ec54e5bad95bf19b111099c', value: '80', srcType: 'SYS_VAR' }, { name: '自动放行', id: '96b2c503e25f4f48ba47d4c2dfa922e7', value: '0', srcType: 'SYS_VAR' }, { name: '加强认证', id: 'a79a4e45a38446e6b13bac227b859719', value: '40', srcType: 'SYS_VAR' }, { name: '自动阻断', id: 'f68e79c39ef742b6a479e3ce1b4d6942', value: '100', srcType: 'SYS_VAR' }],
        'cnName': '建议策略',
        'searchType': 'select',
        'enName': 'strategy',
        'fieldSrcId': 'b3db8cd016d94acd93d5871e4cea1c81',
        'isSearch': 1,
        'id': 'c2fe91ee42754ab1848a69502b5118c2',
        'type': '0'
      },
      {
        'sortNo': 5,
        'searchSrc': [{
          'name': '案件',
          'value': '5'
        }, {
          'name': '疑似欺诈',
          'value': '4'
        }, {
          'name': '清白件',
          'value': '3'
        }, {
          'name': '未审核',
          'value': '0'
        }],
        'fieldSrcId': '4c0543c6d208401fb9791fab218a9b64',
        'cnName': '核查结果',
        'searchType': 'select',
        'isSearch': 1,
        'enName': 'result',
        'id': '245e40520fa04663846f50403454b448',
        'type': '0'
      }]
    }
  }),
  computed: {
    // 取右上角调色板右边的下拉框的id
    ...mapGetters([
      'appId',
      'appList',
      'pageTabs'
    ]),
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 316;
      }
    }
  },
  watch: {
    // pageTabs (newValue, oldValue) {
    //   this.getPageTabs(newValue);
    // },
    appId (val) {
      this.getAllRules();// 获取所有规则
      this.getSearchCondition(this.searchForm);// 获取搜索条件
      this.getTableHeaderData(); // 获取列表头部数据
      this.getTradeTypeList();// 获取交易类型
    },
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 72;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  methods: {
    ...mapActions([
      'setPageTabs'
    ]),
    getPageTabs (val) {
      val.forEach(item => {
        item.tabName = item.text;
        // type: 1=动账 0=非动账 区分工单类型：workOrderType: 告警=0 预警=1 核查=2
        switch (item.text) {
          case '动账预警单':
            item.type = 1;
            item.workOrderType = 1;
            break;
          case '动账告警单':
            item.type = 1;
            item.workOrderType = 0;
            break;
          case '非动账核查单':
            item.type = 0;
            item.workOrderType = 2;
            break;
          case '非动账预警单':
            item.type = 0;
            item.workOrderType = 1;
            break;
          case '非动账告警单':
            item.type = 0;
            item.workOrderType = 0;
            break;
          case '动账核查单':
          default:
            item.type = 1;
            item.workOrderType = 2;
            break;
        }
      });
      this.setPageTabs(val);
      this.tabItems = val;
      if (!sessionStorage.getItem('orderLogActiveTab')) {
        sessionStorage.setItem('orderLogActiveTab', JSON.stringify(val[0]));
      }
      if (sessionStorage.getItem('currentOrderLogTab')) {
        this.activeTab = Number(sessionStorage.getItem('currentOrderLogTab'));
      }
      this.setSearchData();
    },
    setSearchData () {
      // type: 1=动账 0=非动账 区分工单类型：workOrderType: 告警=0 预警=1 核查=2
      if (sessionStorage.getItem('orderLogActiveTab')) {
        let orderLogActiveTab = JSON.parse(sessionStorage.getItem('orderLogActiveTab'));
        this.tableName = orderLogActiveTab.tabName;
        this.logType = orderLogActiveTab.type;
        this.workOrderType = orderLogActiveTab.workOrderType;
        this.searchForm = {};
        if (this.logType === 1) {
          if (this.tableName === '动账核查单') {
            this.searchForm = this.accountVerifyOrder;
          } else {
            this.searchForm = this.accountSearchForm;
          }
        } else {
          if (this.tableName === '非动账核查单') {
            this.searchForm = this.noAccountVerifyOrder;// 非动账核查单查询列表
          } else {
            this.searchForm = this.noAccountSearchForm;
          }
        }
      } else {
        this.searchForm = this.accountVerifyOrder;// 动账核查单查询列表
      }
      if (this.appId) {
        this.getAllRules();// 获取所有规则
        this.getSearchCondition(this.searchForm);// 获取查询条件
        this.getTableHeaderData(); // 获取列表头部数据
        this.getTradeTypeList();// 获取交易类型
      }
    },
    tabChange (item, index) {
      sessionStorage.setItem('orderLogActiveTab', JSON.stringify(item));
      sessionStorage.setItem('currentOrderLogTab', index);
      this.pageNum = 1;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.formData.forEach((item, index, ary) => {
        if (item.searchType === 'range') {
          item.minValue = '';
          item.maxValue = '';
        } else if (item.searchType === 'text') {
          item.value = '';
        } else if (item.searchType === 'select') {
          item.value = '';
        } else if (item.searchType === 'Date') {
          item.value = [];
          this.dates = [];
        }
      });
      this.setSearchData();
    },
    getActiveTab () {
      if (sessionStorage.getItem('currentOrderLogTab')) {
        this.activeTab = Number(sessionStorage.getItem('currentOrderLogTab'));
      } else {
        this.activeTab = 0;
      }
    },
    // 获取交易类型
    async getTradeTypeList () {
      this.tradeTypeItems = [];
      let param = {
        appId: this.appId,
        isAmount: this.logType
      };
      const response = await dataService.queryTradeType(param);
      if (response.data.code === 200) {
        let resTradeTypeItems = response.data.data.tradeList;
        resTradeTypeItems.forEach((item, index, ary) => {
          this.searchForm.data[1].searchSrc.push({
            name: item.tradeName,
            value: item.identifier
          });
        });
      }
    },
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    cancleDetailsDialog () {
      this.detailsDialog = false;
    },
    // 获取公共搜索条件
    getSearchCondition (res) {
      if (res.code === 200) {
        if (res.data.length > 0) {
          this.constHeader = [];
          res.data.forEach((item, index, ary) => {
            item.colNumber = '2';
            if (item.searchType === 'range') {
              item.minValue = '';
              item.maxValue = '';
              item.colNumber = '4';
            } else if (item.searchType === 'Date') {
              item.value = [];
              this.$set(item, 'isdateShow', false);
            } else if (item.searchType === 'multiple') {
              item.value = [];
              item.searchSrc.forEach((i, x, ay) => {
                i.text = i.value;
              });
            } else if (item.searchType === 'autocomplete') {
              this.getAllRulesData.unshift({ ruleName: '全部' });
              item.searchSrc = this.getAllRulesData;
              item.value = 'all';
            } else if (item.searchType === 'select') { // 下拉框增加 全部功能
              if (item.cnName !== '操作状态') {
                item.searchSrc.unshift({ name: '全部', value: 'all' });
              } else {
                item.searchSrc.forEach((i, x, ay) => {
                  if (i.name === '全部') {
                    i.value = 'all';
                  }
                });
              }
              item.value = '';
            } else {
              item.value = '';
            }
            if (item.checkType) {
              this.searchRulesArray.forEach((i, x, ay) => {
                if (item.checkType === i.name) {
                  item.rules = i.rules;
                }
              });
            } else {
              item.rules = [];
            }
          });
          this.formData = [];
          this.formData = res.data;
        } else {
          this.formData = [];
        }
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = res.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 获取公共列表头部条件
    getTableHeader (res) {
      if (res.code === 200) {
        if (Object.keys(res.data).length > 0) {
          this.constHeader = [];
          let headerData = res.data;
          for (const key in headerData) {
            this.constHeader.push(
              {
                text: key,
                value: headerData[key],
                sortable: false,
                width: 120
              }
            );
          }
          this.constHeader.push(
            {
              text: '风险详情',
              value: 'action',
              sortable: false,
              width: 100
            }
          );
          this.getTableData();
        } else {
          this.constHeader = [];
          this.constItem = [];
          this.formData = [];
          this.pageNum = 1; // 第几页
          this.queryPageLength = 1; // 总共有几页
          this.perPageNum = 10; // 每页多少条
          this.totalItems = 0;
        }
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = res.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 获取列表头部数据
    async getTableHeaderData () {
      const params = {
        workOrderType: this.workOrderType,
        type: this.logType
      };
      let { data } = await getOrderTableHeader(params);
      if (data.code === 200) {
        this.getTableHeader(data);
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = data.msg;
        this.snackbarServeColor = 'error';
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
    // 创建时间的弹框
    dateChange (date, item) {
      if (moment(this.dates[0]).valueOf() > moment(this.dates[1]).valueOf()) {
        this.reverseArry(this.dates);
      }
      if (this.dates.length === 2) {
        this.dateItem.isdateShow = false;
        item.value = this.dates;
      }
    },
    // 创建时间输入框的点击事件
    dateInputClick (item) {
      this.dateItem = item;
      item.isdateShow = true;
    },
    // 重置条件
    reset () {
      this.$refs.form.reset();
      this.formData.forEach((item, index, ary) => {
        if (item.searchType === 'range') {
          item.minValue = '';
          item.maxValue = '';
        } else if (item.searchType === 'text') {
          item.value = '';
        } else if (item.searchType === 'select') {
          item.value = '';
        } else if (item.searchType === 'Date') {
          item.value = [];
          this.dates = [];
        }
      });
      this.getTableData();
    },
    async getTableData () {
      this.loading = true;
      this.constItem = [];
      const requestMapData = [];
      for (let i = 0; i < this.formData.length; i++) {
        if (Number(this.formData[i].minValue) > Number(this.formData[i].maxValue)) {
          this.snackbarServe = true;
          this.snackbarServeMsg = this.formData[i].cnName + '最小值不能大于' + this.formData[i].cnName + '最大值';
          this.snackbarServeColor = 'error';
          return;
        }
      };
      this.formData.forEach((item, index, ary) => {
        switch (item.searchType) {
          case 'range':
            // “分数”“金额”的值分别都为0时。value传空数组，即“[]”
            if (item.minValue === '' && item.maxValue === '') {
              requestMapData.push(
                {
                  [ary[index].enName]: [],
                  orderSearchType: item.searchType
                }
              );
            } else {
              requestMapData.push(
                {
                  [ary[index].enName]: [Number(item.minValue), Number(item.maxValue)],
                  orderSearchType: item.searchType
                }
              );
            }
            break;
          case 'Date':
            // 获取的时间更改为数字格式
            let newDateData = [];
            if (item.value.length > 0) {
              newDateData[0] = Number(moment(moment(item.value[0]).valueOf()).format('YYYYMMDDHHmmss'));
              newDateData[1] = Number(moment(moment(item.value[1]).valueOf()).format('YYYYMMDD') + '235959');
            }
            requestMapData.push(
              {
                [ary[index].enName]: newDateData,
                orderSearchType: item.searchType
              }
            );
            break;
          case 'autocomplete':
            if (item.value === 'all') {
              requestMapData.push(
                {
                  [ary[index].enName]: [],
                  orderSearchType: item.searchType
                }
              );
            } else {
              requestMapData.push(
                {
                  [ary[index].enName]: [item.value],
                  orderSearchType: item.searchType
                }
              );
            }
            break;
          case 'multiple':
            requestMapData.push(
              {
                [ary[index].enName]: item.value,
                orderSearchType: item.searchType
              }
            );
            break;
          case 'select':
            requestMapData.push(
              {
                [ary[index].enName]: item.value === 'all' || item.value === '' ? [] : [item.value],
                orderSearchType: item.searchType
              }
            );
            break;
          default:
            requestMapData.push(
              {
                [ary[index].enName]: item.value === '' ? [] : [item.value],
                orderSearchType: item.searchType
              }
            );
            break;
        }
      });
      requestMapData.push(
        {
          appid: [this.appId],
          orderSearchType: 'text'
        }
      );
      const params = {
        appId: this.appId,
        workOrderType: this.workOrderType,
        type: this.logType,
        pageIndex: this.pageNum,
        pageSize: this.perPageNum,
        searchMap: JSON.stringify(requestMapData)
      };
      let { data } = await getOrderTableData(params);
      if (data.code === 200) {
        this.loading = false;
        if (data.data.list.length > 0) {
          // this.$nextTick((v) => {
          this.tableContentData = JSON.parse(JSON.stringify(data.data.list));
          let dataMap = data.data.list;
          dataMap.forEach(item => {
            if (item.state) {
              switch (item.state) {
                case 0:
                  item.state = '待提报';
                  break;
                case 1:
                case 2:
                  item.state = '待指派';// 其中已提报和沉淀状态 统称为待指派状态
                  break;
                case 3:
                  item.state = '已指派';
                  break;
                case 4:
                  item.state = '已转派';
                  break;
                case 5:
                  item.state = '驳回待审核';
                  break;
                case 6:
                  item.state = '驳回待复审';
                  break;
                case 7:
                  item.state = '初审审核结束';
                  break;
                case 8:
                  item.state = '复审完结';
                  break;
                default:
                  break;
              }
            }
            if (item.strategy) {
              switch (item.strategy) {
                case '0':
                  item.strategy = '自动放行';
                  break;
                case '40':
                  item.strategy = '加强认证';
                  break;
                case '80':
                  item.strategy = '人工审核';
                  break;
                case '100':
                  item.strategy = '自动阻断';
                  break;
                default:
                  break;
              }
            }
            if (item.op_type) {
              switch (item.op_type) {
                case 'TRANSFER':
                  item.op_type = '转账';
                  break;
                case 'LOGIN':
                  item.op_type = '登录';
                  break;
                case 'DEPOSIT_CASH':
                  item.op_type = '存现';
                  break;
                case 'WITH_DRAWAL':
                  item.op_type = '取现';
                  break;
                default:
                  break;
              }
            }
            let appItem = this.appList.find(key => item.appid === key.id);
            this.$set(item, 'appName', appItem.appName);
          });
          this.constItem = dataMap;
          this.totalItems = data.data.totalElements;
          this.queryPageLength = data.data.totalPages;
          // });
        } else {
          // this.$nextTick((v) => {
          this.constItem = [];
          this.totalItems = 0;
          this.queryPageLength = 1;
          // });
        }
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = data.msg;
        this.snackbarServeColor = 'error';
        this.constItem = [];
      }
    },
    // 获取所有规则
    async getAllRules () {
      const params = {
        appId: ''
      };
      let { data } = await getAllRules(params);
      if (data.code === 200) {
        this.getAllRulesData = data.data;
      }
    },
    // 查询
    searchTable () {
      this.pageNum = 1;
      this.getTableData();
    },
    // 查看工单详情===按钮
    async seeDetails (item) {
      let params = {
        appId: this.appId,
        workOrderType: this.workOrderType,
        type: this.logType,
        opId: item.op_id,
        id: item.id
      };
      let { data } = await getOrderDetails(params);
      if (data.code === 200) {
        this.detailsDialog = true;
        let baseRes = data.data.hitRule;
        this.detailsOplogDetail = data.data.oplogDetails;
        if (Object.keys(baseRes.officialResult).length > 0) {
          baseRes.officialResult.hit_labels = (baseRes.officialResult.hit_labels.substring(baseRes.officialResult.hit_labels.length - 1) === ',') ? baseRes.officialResult.hit_labels.substring(0, baseRes.officialResult.hit_labels.length - 1) : baseRes.officialResult.hit_labels;
        } else {
          baseRes.officialResult = {};
        }
        if (Object.keys(baseRes.simulatedResult).length > 0) {
          baseRes.simulatedResult.hit_labels = (baseRes.simulatedResult.hit_labels.substring(baseRes.simulatedResult.hit_labels.length - 1) === ',') ? baseRes.simulatedResult.hit_labels.substring(0, baseRes.simulatedResult.hit_labels.length - 1) : baseRes.simulatedResult.hit_labels;
        } else {
          baseRes.simulatedResult = {};
        }
        this.detailsHitRule = baseRes;
        this.opLog = data.data.opLog;
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = data.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 添加和编辑弹框----取消和差号按钮
    cancelCrudFormDialog () {
      this.crudFormDialog = false;
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.getTableData();
    },
    // 页数
    pageChange (data) {
      this.perPageNum = data;
      this.pageNum = 1;
      this.getTableData();
    },
    // 区间的最小值
    minValueBlur (minValue, maxValue, cnName) {
      if (Number(minValue) > Number(maxValue) && maxValue) {
        this.snackbarServe = true;
        this.snackbarServeMsg = cnName + '最小值不能大于' + cnName + '最大值';
        this.snackbarServeColor = 'error';
      }
    },
    // 区间的最大值
    maxValueBlur (minValue, maxValue, cnName) {
      if (Number(minValue) > Number(maxValue) && maxValue) {
        this.snackbarServe = true;
        this.snackbarServeMsg = cnName + '最小值不能大于' + cnName + '最大值';
        this.snackbarServeColor = 'error';
      }
    }
  },
  components: {
    BaseDetails,
    BaseSearch
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
    creDate (v) {
      let times = moment(v).format('YYYY-MM-DD HH:mm:ss');
      return times;
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    sessionStorage.removeItem('orderLogActiveTab');
    sessionStorage.removeItem('currentOrderLogTab');
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    // this.getActiveTab();
    this.getPageTabs(this.tabDefaultItems);
    // if (this.pageTabs && this.pageTabs.length) {
    //   this.pageTabs.forEach(item => {
    //     item.tabName = item.text;
    //     // type: 1=动账 0=非动账 区分工单类型：workOrderType: 告警=0 预警=1 核查=2
    //     switch (item.text) {
    //       case '动账核查单':
    //         item.type = 1;
    //         item.workOrderType = 2;
    //         break;
    //       case '动账预警单':
    //         item.type = 1;
    //         item.workOrderType = 1;
    //         break;
    //       case '动账告警单':
    //         item.type = 1;
    //         item.workOrderType = 0;
    //         break;
    //       case '非动账核查单':
    //         item.type = 0;
    //         item.workOrderType = 2;
    //         break;
    //       case '非动账预警单':
    //         item.type = 0;
    //         item.workOrderType = 1;
    //         break;
    //       case '非动账告警单':
    //         item.type = 0;
    //         item.workOrderType = 0;
    //         break;
    //       default:
    //         item.type = 1;
    //         item.workOrderType = 2;
    //         break;
    //     }
    //   });

    //   this.setPageTabs(this.pageTabs);
    //   this.tabItems = this.pageTabs;
    //   if (!sessionStorage.getItem('orderLogActiveTab')) {
    //     sessionStorage.setItem('orderLogActiveTab', JSON.stringify(this.pageTabs[0]));
    //   }
    //   if (sessionStorage.getItem('currentOrderLogTab')) {
    //     this.activeTab = Number(sessionStorage.getItem('currentOrderLogTab'));
    //   }
    //   this.setSearchData();
    // }
  }
};
</script>
<style lang="stylus" scoped>
.v-card__subtitle, .v-card__text, .v-card__title {
  padding: 0;
}
.v-application .px-4 {
  padding: 0;
}
.el-border-defu {
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.c-btn {
  text-align: left;
  padding-bottom: 20px;
}
.icon-primary{
    color: var(--v-primary-base) !important;
}
.el-tr-defu:hover {
  background: var(--v-tableRowHoverActive-base);
}
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
  border: 8px solid var(--v-emptyCircleColor-base);
  border-radius:50%;
  display: inline-block;
  text-align: center;
  line-height: 80px;
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
  padding-left: 10px;
  font-size: 14px;
  background: var(--v-seeDetailsHeadBgColor-base) !important;
  color: #000;
  font-size: 16px;
}
.ckxq_size {
  font-size: 18px;
}
.baseSectionDisplay {
  display: inline-block;
}
.maxOrMinWidth {
  width: 100%;
}
.baseSectionCenter {
  text-align: center;
}
.ruleSetAddOrEdit .v-input__control {
  height: auto !important;
}
// 宽度1280以下
@media all and (max-width: 1280px) {
  .baseSection20 {
    width: 8%;
  }
  .baseSection40 {
    width: 46%;
  }
}
// 宽度1280和1360之间
@media all and (min-width: 1280px) and (max-width: 1360px) {
  .baseSection20 {
    width: 8%;
  }
  .baseSection40 {
    width: 46%;
  }
}
// 宽度1360和1680之间
@media all and (min-width: 1360px) and (max-width: 1680px) {
 .baseSection20 {
    width: 8%;
  }
  .baseSection40 {
    width: 46%;
  }
}
// 宽度1680和1920之间
@media all and (min-width: 1680px) and (max-width: 1920px) {
  .baseSection20 {
    width: 5%;
  }
  .baseSection40 {
    width: 47.5%;
  }
}
//宽度大于1920
@media all and (min-width: 1920px) {
  .baseSection20 {
    width: 4.18%;
  }
  .baseSection40 {
    width: 47.91%;
  }
}
</style>
