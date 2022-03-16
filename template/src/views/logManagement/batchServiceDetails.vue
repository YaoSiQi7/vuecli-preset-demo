<!--author：FuCheng -->
<!--updateTime：2021-04-08-->
<template>
  <div>
    <!-- 返回 -->
    <v-card class="mb-3">
      <v-card-actions style="height:60px">
        <v-btn class="ml-4 cancelButton" outlined @click="back">返回</v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mb-3">
      <!-- 交易汇总信息 -->
      <v-card-text>
        <h3 style="margin-bottom:20px;color: #000;">交易汇总信息</h3>
        <v-list>
          <v-list-item>
            <v-list-item-content v-if="secondLevelRouterItems.isAccount === 1">
              <div class="ruleSetParam">
                <v-row>
                  <v-col cols="2">
                    <p>批次号：{{ secondLevelRouterItems.dataItem.batchId }}</p>
                  </v-col>
                  <v-col cols="3">
                    <p>出账账户：{{ secondLevelRouterItems.dataItem.outAccount }}</p>
                  </v-col>
                  <v-col cols="2" >
                    <p>出账人姓名：{{ secondLevelRouterItems.dataItem.outName }}</p>
                  </v-col>
                  <v-col cols="2">
                    <p>入账账户数：{{ secondLevelRouterItems.dataItem.inAccountCount }}</p>
                  </v-col>
                  <v-col cols="3">
                    <p>交易总金额：{{ secondLevelRouterItems.dataItem.tradeAmount }}</p>
                  </v-col>
                </v-row>
              </div>
              <div class="ruleSetParam">
                <v-row>
                  <v-col cols="2">
                    <p>交易笔数：{{ secondLevelRouterItems.dataItem.tradeCount }}</p>
                  </v-col>
                  <v-col cols="3">
                    <p>交易时间：{{ secondLevelRouterItems.dataItem.tradeTime }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>业务归属机构：{{ secondLevelRouterItems.dataItem.businessOrgCode }}</p>
                  </v-col>
                  <v-col cols="2">
                    <p>交易类型：{{ secondLevelRouterItems.dataItem.opType }}</p>
                  </v-col>
                </v-row>
              </div>
            </v-list-item-content>
            <v-list-item-content v-else>
              <div class="ruleSetParam">
                <v-row>
                  <v-col cols="3">
                    <p>批次号：{{ secondLevelRouterItems.dataItem.batchId }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>交易笔数：{{ secondLevelRouterItems.dataItem.tradeCount }}</p>
                  </v-col>
                  <v-col cols="3" >
                    <p>新开账户数：{{ secondLevelRouterItems.dataItem.tradeCount }}</p>
                  </v-col>
                </v-row>
              </div>
              <div class="ruleSetParam">
                <v-row>
                  <v-col cols="3">
                    <p>交易时间：{{ secondLevelRouterItems.dataItem.tradeTime }}</p>
                  </v-col>
                  <v-col cols="4">
                    <p>业务归属机构：{{ secondLevelRouterItems.dataItem.businessOrgCode }}</p>
                  </v-col>
                  <v-col cols="3">
                    <p>交易类型：{{ secondLevelRouterItems.dataItem.opType }}</p>
                  </v-col>
                </v-row>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <v-card class="mb-3">
      <!-- 风险汇总信息 -->
      <v-card-text>
        <h3 style="margin-bottom:20px;color: #000;">风险汇总信息</h3>
        <v-row>
          <v-col cols='6'>
            <div ref="echarts" class="echarts" :style="{ width: riskInfo.width,height: riskInfo.height}"></div>
          </v-col>
          <v-col cols='6'>
            <div style="font-size: 16px;color: #000;margin-top: 10px;">命中规则TOP10</div>
            <v-row class="mt-4">
              <v-col cols="8">
                <span class="risk_text">规则名称：</span>
              </v-col>
              <v-col cols="4">
                <span class="risk_text">命中次数：</span>
              </v-col>
            </v-row>
            <div>
              <div v-for="(item, index) in secondLevelRouterItems.itRuleTopList" :key="index">
                <v-row>
                  <v-col cols="8">
                    <span class="risk_name" style="cursor: pointer;"
                          @click="searchInfo(item.name)">{{ item.name }}</span>
                  </v-col>
                  <v-col cols="4">
                    <span>{{ item.value }}</span>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- 交易明细信息 -->
    <v-card class="mb-3">
      <v-card-text>
        <h3 style="margin-bottom:20px;color: #000;">交易明细信息</h3>
        <!--<div>
          &lt;!&ndash;搜索&ndash;&gt;
          <base-search
            :fieldList="searchForm"
            @search="search($event)"
            @reset="resetSearchData($event)"
            :clearDate="clearDate"
            @change="panelCounter"
          ></base-search>
          &lt;!&ndash;列表&ndash;&gt;
          <v-data-table
            :headers="pendingTaskHeaders"
            :items="pendingTaskData"
            :items-per-page="perPageNum"
            hide-default-footer
            class="elevation-3 mt-3"
            :loading="loading"
            loading-text="加载数据中..."
            :fixed-header="true"
          >
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
            &lt;!&ndash; 分页组件 &ndash;&gt;
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
        </div>-->
        <div class="enu-content">
          <base-search @change="panelCounter">
            <template v-slot>
              <v-form
                ref="form"
                v-model="searchValid"
                lazy-validation
                :key="newDate"
              >
                <v-container grid-list-xl class="ml-0 mr-0 pt-0 pb-0">
                  <v-row>

                    <v-col v-for="(items, index) in formData" :key="genKey(index)" cols="12" sm="12" :md=items.colNumber :xl=items.colNumber>
                      <v-text-field
                        v-if="items.searchType === 'text'"
                        v-model.trim="items.value"
                        :placeholder="items.cnName + '：'"
                        :required="items.required"
                        :rules="items.rules"
                        :sortNo="items.sortNo"
                        outlined
                        dense
                        class="pt-0 pb-0"
                      />
                      <v-select
                        v-if="items.searchType === 'select'"
                        :placeholder="items.cnName + '：'"
                        v-model="items.value"
                        item-text="name"
                        item-value="value"
                        :items="items.searchSrc"
                        :required="items.required"
                        :rules="items.rules"
                        :sortNo="items.sortNo"
                        no-data-text="没有匹配数据"
                        outlined
                        dense
                      />
                      <v-select
                        class="ruleSetSearchMultiple"
                        style="height: auto !important;"
                        :placeholder="items.cnName + '：'"
                        v-if="items.searchType === 'multiple'"
                        :menu-props="{ bottom: true }"
                        v-model="items.value"
                        item-text="name"
                        item-value="text"
                        :items="items.searchSrc"
                        :rules="items.rules"
                        :sortNo="items.sortNo"
                        multiple
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                      >
                        <template v-slot:selection="{ item, index }">
                          <!-- <v-chip v-if="index === 0"> -->
                          <span v-if="index === 0" style="display: inline-block; width: 150px;">{{ item.name }}</span>
                          <!-- </v-chip> -->
                          <span
                            v-if="index === 1"
                            class="grey--text caption"
                          >
                          (+{{ items.value.length - 1 }} 更多)
                        </span>
                        </template>
                      </v-select>
                      <v-autocomplete
                        v-if="items.searchType === 'autocomplete'"
                        :placeholder="items.cnName + '：'"
                        v-model="items.value"
                        item-text="ruleName"
                        item-value="ruleName"
                        :items="items.searchSrc"
                        :required="items.required"
                        :sortNo="items.sortNo"
                        outlined
                        dense
                        no-data-text="没有数据" />
                      <span class="baseSectionDisplay maxOrMinWidth" v-if="items.searchType === 'range'">
                      <span class="baseSection40 baseSectionDisplay">
                        <v-text-field
                          v-model.trim="items.minValue"
                          :placeholder="items.cnName + '最小值'"
                          :rules="items.rules"
                          outlined
                          dense
                          @blur="minValueBlur(items.minValue, items.maxValue, items.cnName)"
                        ></v-text-field>
                      </span>
                      <span class="baseSection20 baseSectionDisplay baseSectionCenter">
                        -
                      </span>
                      <span class="baseSection40 baseSectionDisplay">
                        <v-text-field
                          v-model.trim="items.maxValue"
                          :placeholder="items.cnName + '最大值'"
                          :rules="items.rules"
                          outlined
                          dense
                          @blur="maxValueBlur(items.minValue, items.maxValue, items.cnName)"
                        ></v-text-field>
                      </span>
                    </span>
                      <!-- <v-card-text v-if="item.searchType === 'range'"> -->
                      <!-- <v-row> -->
                      <!-- <v-col cols="2" sm="2" md="2" xl="2">
                        {{ item.cnName }}
                      </v-col>
                      <v-col cols="4" sm="4" md="4" xl="4">
                        <v-text-field
                          v-model.trim="item.minValue"
                          :placeholder="item.cnName + '最小值'"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2" xl="2" :key="item.sortNo">
                        至
                      </v-col>
                      <v-col cols="4" sm="4" md="4" xl="4">
                        <v-text-field
                          v-model.trim="item.maxValue"
                          :placeholder="item.cnName + '最大值'"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col> -->
                      <!-- <v-col class="px-4">
                        <v-range-slider
                          v-model="item.value"
                          :max="item.max"
                          :min="item.min"
                          hide-details
                          :label="item.cnName"
                          thumb-label
                          class="align-center"
                        >
                        <template v-slot:prepend>
                          <v-text-field
                            :value="range[0]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(range, 0, $event)"
                          ></v-text-field>
                        </template>
                        <template v-slot:append>
                          <v-text-field
                            :value="range[1]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(range, 1, $event)"
                          ></v-text-field>
                        </template>
                        </v-range-slider>
                      </v-col> -->
                      <!-- </v-row> -->
                      <!-- </v-card-text> -->
                      <v-text-field
                        :key="index"
                        v-if="items.searchType === 'Date'"
                        outlined
                        dense
                        v-model="items.value"
                        append-icon="event"
                        :placeholder="items.cnName + '：'"
                        @click="dateInputClick(items)"
                      >
                      </v-text-field>
                      <v-dialog v-model="items.isdateShow" width="321">
                        <v-date-picker selected-items-text="已选择日期" v-model="items.value" range  @change="dateChange(items.value)"></v-date-picker>
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
            </template>
          </base-search>
          <v-row style="margin-top: 12px !important;">
            <v-col :cols='12' class="py-0">
              <v-card class="elevation-3">
                <v-data-table
                  :headers="constHeader"
                  :items="constItem"
                  :items-per-page="perPageNum"
                  hide-default-footer
                  no-results-text="没有匹配的数据"
                  :fixed-header="true"
                >
                  <!-- 列表项 -->
                  <template v-slot:body="{ items }">
                    <tr
                      v-for="(item, index) in items"
                      :key="index"
                      class="el-tr-defu"
                    >
                      <td
                        v-for="(i, x) in item"
                        :key="x"
                        class="el-border-defu"
                      >
                        {{ i }}
                      </td>
                      <td class="el-border-defu" :key='index'>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              small
                              class="mr-1 icon-primary"
                              v-on="on"
                              color="primary"
                              @click="seeDetails(item, index)"
                            >
                              mdi-card-account-details
                            </v-icon>
                          </template>
                          <span>查看风控详情</span>
                        </v-tooltip>
                      </td>
                    </tr>
                  </template>
                  <template v-slot:no-data>
                    <div>没有数据</div>
                  </template>
                  <template v-slot:footer>
                    <v-divider></v-divider>
                    <div class="mr-4 mb-0 mx-auto pa-2 transition-swing elevation-0">
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
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <!-- 公共弹框提示 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >
      {{ snackbarServeMsg }}
    </v-snackbar>

    <!--交易明细信息弹窗-->
    <base-details :detailsDialog='detailsDialog' :hitRule='detailsHitRule' :oplogDetail='detailsOplogDetail' @cancleDetailsDialog='cancleDetailsDialog($event)'></base-details>
  </div>
</template>

<script>
import { getAllRules, getTableData, getTableHeader, searchField, searchTableContentData } from '@/api/riskControlLog';
import BaseSearch from '@c/BaseSearch';
import { mapGetters } from 'vuex';
import BaseDetails from '@/components/BaseRiskLogDetails';
import moment from 'moment';
export default {
  name: 'batchServiceDetails',
  components: {
    BaseSearch,
    BaseDetails
  },
  data () {
    return {
      // 风险汇总信息图标
      riskInfo: {
        width: '90%',
        height: '500px'
      },
      // 交易明细信息
      newDate: null,
      // 列表
      constHeader: [],
      constItem: [],
      routerParams: false, // 标识是否为别的页面跳转而来。false为否，true为是。
      TabNewDate: 0, // tab页切换时的时间
      searchOrResetNewDate: 0, // 查询和重置按钮被点击时的时间
      isTabLcick: false, // tab页被点击时，搜索和重置按钮是否被点击，是：true, 否：false
      riskLogDataParamss: null,
      // 分页变量
      pageNum: 1, // 第几页
      queryPageLength: 1, // 总共有几页
      perPageNum: 10, // 每页多少条
      totalItems: 0, // 数据的总条数
      perPageItems: [5, 10, 15, 20],
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
      dateItem: {},
      searchValid: true,
      // 查看详情
      crudFormDialog: false,
      formData: [],
      // 公共弹框
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      isAmount: 1, // 1代表动账日志，0代表非动账日志
      // 获取所有规则
      getAllRulesData: [],
      // 列表内容完成的数据
      tableContentData: [],
      // 二期详情右边的自动配置
      detailsOplogDetail: [],
      detailsDialog: false,
      detailsHitRule: {}
    };
  },
  computed: {
    ...mapGetters([
      'appId',
      'secondLevelRouterItems'
    ])
  },
  watch: {
    appId (val) {
      this.isAmount = this.secondLevelRouterItems.isAccount;
      this.pageNum = 1;
      this.constHeader = [];
      this.constItem = [];
      this.totalItems = 0;
      this.queryPageLength = 0;
      this.getSearchData();
    }
  },
  mounted () {
    this.initChart();
    if (this.appId) {
      this.isAmount = this.secondLevelRouterItems.isAccount;
      this.getSearchData();
    }
  },
  beforeRouteLeave (to, from, next) {
    // 离开当前路由页面时调用
    if (to.path !== '/batchServiceStatistics') {
      window.sessionStorage.removeItem('batchServiceDetailsTab');
    }
    next();
  },
  methods: {
    // 返回
    back () {
      this.$router.go(-1);
    },
    // echarts
    initChart () {
      let data = [];
      let strategyMapList = JSON.parse(JSON.stringify(this.secondLevelRouterItems.strategyMapList));
      strategyMapList.forEach(item => {
        data.push(item.name);
        // switch (item.name) {
        //   case ('自动阻断') :
        //     item.itemStyle = { color: '#f4c79b' };
        //     break;
        //   case ('人工审核') :
        //     item.itemStyle = { color: '#fe8894' };
        //     break;
        //   case ('加强认证') :
        //     item.itemStyle = { color: '#62a8ef' };
        //     break;
        //   case ('自动放行') :
        //     item.itemStyle = { color: '#3dabb5' };
        //     break;
        // }
      });
      this.riskInfo = {
        width: '90%',
        height: '500px',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        title: {
          subtext: '等级占比',
          left: 'center',
          subtextStyle: {
            fontSize: 16,
            color: '#000',
            fontWeight: 400
          }
        },
        legend: {
          left: '0px',
          bottom: '10px',
          data: data
        },
        color: window.g.echartsBaseColor,
        series: [
          {
            name: '等级占比',
            type: 'pie',
            radius: '70%',
            bottom: '50px',
            // color: window.g.echartsBaseColor,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false
              }
            },
            labelLine: {
              show: false
            },
            data: strategyMapList
          }
        ]
      };
      const initCharts = this.$echarts.init(this.$refs.echarts);
      const options = {
        color: this.riskInfo.color || window.g.echartsBaseColor, // 父组件未传颜色则获取全局默认的
        tooltip: this.riskInfo.tooltip,
        title: this.riskInfo.title,
        legend: this.riskInfo.legend,
        series: this.riskInfo.series,
        xAxis: this.riskInfo.xAxis,
        yAxis: this.riskInfo.yAxis,
        grid: this.riskInfo.grid,
        toolbox: this.riskInfo.toolbox,
        dataZoom: this.riskInfo.dataZoom
      };
      initCharts.setOption(options, true);
      window.addEventListener('resize', () => { initCharts.resize(); });
      // 点击事件
      initCharts.on('click', (params) => {
        this.formData.forEach(item => {
          if (item.cnName === '处置策略') {
            item.searchSrc.forEach(cItem => {
              if (cItem.name === params.name) {
                item.value = cItem.value;
              }
            });
          }
        });
        this.searchTable();
      });
    },
    searchInfo (name) {
      let formData = JSON.parse(JSON.stringify(this.formData));
      formData.forEach((item, index) => {
        if (item.cnName === '规则命中查询') {
          item.searchSrc.forEach(cItem => {
            if (cItem.ruleName === name) {
              item.value = cItem.ruleName;
              // this.$set(this.formData[index], 'value', cItem.ruleName);
              // this.$forceUpdate();
            }
          });
        }
      });
      this.formData = formData;
      this.searchTable();
    },
    genKey (length) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
    },
    // 交易明细信息
    panelCounter () {
      this.counter += 1;
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
            if (item.enName === 'batchId') {
              res.data.splice(index, 1);
            }
            if (item.searchType === 'range') {
              item.minValue = '';
              item.maxValue = '';
            } else if (item.searchType === 'Date') {
              item.value = [];
            } else if (item.searchType === 'multiple') {
              item.value = [];
              item.searchSrc.forEach((i, x, ay) => {
                i.text = i.value;
              });
            } else if (item.searchType === 'autocomplete') {
              item.searchSrc = [];
              const params = {
                appId: ''
              };
              getAllRules(params).then(res => {
                if (res.data.code === 200) {
                  this.$nextTick(() => {
                    this.getAllRulesData = res.data.data;
                    this.getAllRulesData.unshift({ ruleName: '全部' });
                    item.searchSrc = this.getAllRulesData;
                    item.value = 'all';
                  });
                } else {
                  this.snackbarServe = true;
                  this.snackbarServeMsg = res.data.msg;
                  this.snackbarServeColor = 'error';
                }
              },
              err => {
                console.error(err);
              });
            } else if (item.searchType === 'select') { // 下拉框增加 全部功能
              if (item.cnName !== '操作状态') {
                item.searchSrc.unshift({ name: '全部', value: 'all', id: 'all' });
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
          res.data.forEach((item, index, ary) => {
            item.colNumber = '2';
            if (item.searchType === 'range') {
              item.minValue = '';
              item.maxValue = '';
              item.colNumber = '4';
            }
            if (item.searchType === 'Date') {
              ary[index].isdateShow = false;
            }
          });
          this.formData = res.data;
          if (this.routerParams && !this.searchOrResetNewDate) { // 判断是否从别的页面跳转而来，true：是，false: 否。\
            this.formData.forEach((item, index, ary) => {
              this.$route.params.paramsAry.forEach((im, ix, ay) => {
                if (item.enName === im.enName) {
                  item.value = im.value;
                }
              });
            });
          }
          // 此为之前写的风险大盘跳转到风控日志，后来取消了跳转，所以此方法暂时已经遗弃;
          /* this.formData.forEach((item, index, ary) => {
            if ((this.routerParams && item.cnName === '交易类型') || (this.routerParams && item.cnName === '处置策略')) {
              for (let i = 0; i < item.searchSrc.length; i++) {
                if (item.searchSrc[i].id === this.$route.params.transactionData || item.searchSrc[i].name === this.$route.params.riskTypeNumber.slice(0, 4)) {
                  item.value = item.searchSrc[i].value;
                } else if (this.$route.params.riskTypeNumber === '' || this.$route.params.transactionData === '') {
                  item.value = 'all';
                }
              }
            }
            if (this.routerParams && item.cnName === '风控时间') {
              item.value = this.$route.params.dates;
            }
          }); */
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
        if (res.data.length > 0) {
          this.constHeader = [];
          res.data.forEach((item, index, ary) => {
            this.constHeader.push(
              {
                text: item.cnName,
                value: item.enName,
                sortable: false,
                width: 150
              }
            );
          });
          this.constHeader.push(
            {
              text: '操作',
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
    // 获取搜索条件
    getSearchData () {
      this.$nextTick(() => {
        if (this.isAmount === 1) {
          const params = {
            // appId: 'MobilePhoneBank',
            appId: this.appId,
            menuId: 'risk',
            dataType: this.isAmount
          };
          searchField(params).then(res => {
            if (res.data.code === 200) {
              this.getSearchCondition(res.data);
              this.getTableHeaderData();
            } else {
              this.snackbarServe = true;
              this.snackbarServeMsg = res.data.msg;
              this.snackbarServeColor = 'error';
              this.getTableHeaderData(); // 获取搜索的接口报错也能请求列表的接口
            }
          }).catch(err => console.error(err));
        } else {
          const params = {
            appId: this.appId,
            menuId: 'risk',
            dataType: this.isAmount
          };
          searchField(params).then(res => {
            if (res.data.code === 200) {
              this.getSearchCondition(res.data);
              this.getTableHeaderData();
            } else {
              this.snackbarServe = true;
              this.snackbarServeMsg = res.data.msg;
              this.snackbarServeColor = 'error';
              this.getTableHeaderData(); // 获取搜索的接口报错也能请求列表的接口
            }
          }).catch(err => console.error(err));
        }
      });
    },
    // 获取列表头部数据
    getTableHeaderData () {
      if (this.isAmount === 1) {
        const params = {
          appId: this.appId,
          menuId: 'risk',
          dataType: this.isAmount
        };
        getTableHeader(params).then(res => {
          if (res.data.code === 200) {
            setTimeout(() => {
              this.getTableHeader(res.data);
            }, 500);
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        }).catch(err => console.error(err));
      } else {
        const params = {
          // appId: 'MobilePhoneBank',
          appId: this.appId,
          menuId: 'risk',
          dataType: this.isAmount
        };
        getTableHeader(params).then(res => {
          setTimeout(() => {
            this.getTableHeader(res.data);
          }, 300);
        }).catch(err => console.error(err));
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
    dateChange (date, value) {
      this.$nextTick(() => {
        if (moment(date[0]).valueOf() > moment(date[1]).valueOf()) {
          this.reverseArry(date);
        }
        if (date.length === 2) {
          this.dateItem.isdateShow = false;
        }
      });
    },
    // 创建时间输入框的点击事件
    dateInputClick (item) {
      this.dateItem = item;
      item.isdateShow = true;
    },
    // 重置条件
    reset () {
      this.newDate = new Date().getTime();
      this.searchOrResetNewDate = new Date().getTime();
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
        }
      });
    },
    // 去重数组
    deWeightArray (arr1, arr2) {
      return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
      });
    },
    // 获取列表内容的数据
    getTableData () {
      const requestMapData = [];
      let theSameItem = []; // this.formData和this.riskLogDataParamss.paramsAry相同的enName.
      let sourceParamsEnName = []; // this.$route.params.paramsAry有的enName
      // 是否包含跳转页面params的搜索条件标识：params.enName true有两种情况：1.搜索条件中的含有下钻参数的标识，2.当点击过查询或者重置按钮之后。否则则为false。
      for (let i = 0; i < this.formData.length; i++) {
        if (Number(this.formData[i].minValue) > Number(this.formData[i].maxValue)) {
          this.snackbarServe = true;
          this.snackbarServeMsg = this.formData[i].cnName + '最小值不能大于' + this.formData[i].cnName + '最大值';
          this.snackbarServeColor = 'error';
          return;
        }
      };
      this.formData.forEach((item, index, ary) => {
        if (item.searchType === 'range') {
          // “分数”“金额”的值分别都为0时。value传空数组，即“[]”
          if (item.minValue === '' && item.maxValue === '') {
            requestMapData.push(
              {
                [ary[index].enName]: []
              }
            );
          } else {
            requestMapData.push(
              {
                [ary[index].enName]: [Number(item.minValue), Number(item.maxValue)]
              }
            );
          }
        } else if (item.searchType === 'Date') {
          // 获取的时间更改为数字格式
          let newDateData = [];
          if (item.value.length > 0) {
            newDateData[0] = Number(moment(moment(item.value[0]).valueOf()).format('YYYYMMDDHHmmss'));
            newDateData[1] = Number(moment(moment(item.value[1]).valueOf()).format('YYYYMMDD') + '235959');
          }
          requestMapData.push(
            {
              [ary[index].enName]: newDateData
            }
          );
        } else if (item.searchType === 'autocomplete') {
          if (item.value === '全部' || item.value === 'all' || !item.value) { // 此处之所以是‘全部’,因为这个下拉框的item-value和item-text是同一个字段，都是中文。
            requestMapData.push(
              {
                [ary[index].enName]: ''
              }
            );
          } else {
            requestMapData.push(
              {
                [ary[index].enName]: item.value
              }
            );
          }
        } else if (item.searchType === 'multiple') {
          requestMapData.push(
            {
              [ary[index].enName]: Array.isArray(item.value) ? item.value.join(',') : item.value
            }
          );
        } else if (item.searchType === 'select') {
          requestMapData.push(
            {
              [ary[index].enName]: item.value === 'all' ? '' : item.value
            }
          );
        } else {
          requestMapData.push(
            {
              [ary[index].enName]: item.value
            }
          );
        }
      });
      if (!this.searchOrResetNewDate) { // 下钻过来：如果搜索条件没有传参过来的搜索条件标识-enName,就在查询接口的参数中加上此搜索条件标识-enName
        for (var formDataIndex = 0; formDataIndex < this.formData.length; formDataIndex++) {
          const element = this.formData[formDataIndex];
          if (this.$route.params.paramsAry) {
            for (var paramsAryIndex = 0; paramsAryIndex < this.$route.params.paramsAry.length; paramsAryIndex++) {
              const elementTwo = this.$route.params.paramsAry[paramsAryIndex];
              if (elementTwo.enName === element.enName) {
                theSameItem.push(element.enName); // 取出下钻参数里和formData搜索条件中相同的enName
                break;
              }
            }
          }
        }
        // 取出下钻参数里的enName
        this.$route.params.paramsAry && this.$route.params.paramsAry.forEach((m, x, y) => {
          sourceParamsEnName.push(m.enName);
        });
        // 利用（下钻参数里和formData搜索条件中相同的enName）和（下钻参数里的enName）对比去重，如果有不一样的，就把不一样的影响加到接口的参数中。（只有在没有点击查询和重置按钮之前才进入这一步，否则就取当前formData的值）
        if (this.deWeightArray(sourceParamsEnName, theSameItem).length > 0) {
          this.$route.params.paramsAry && this.$route.params.paramsAry.forEach((m, x, y) => {
            this.deWeightArray(sourceParamsEnName, theSameItem).forEach((m1, x1, y1) => {
              if (m1 === m.enName) {
                if (m.searchType === 'multiple') { // 因为后端参数searchType在为multiple时，必须把数组改成以逗号分隔的字符串
                  requestMapData.push(
                    {
                      [m.enName]: m.value === 'all' ? '' : m.value.toString() // 此处是为传参数值时，如果value为all，则改变value值为空字符串
                    }
                  );
                } else if (m.searchType === 'Date') {
                  // 获取的时间更改为数字格式
                  let newDateData = [];
                  if (m.value.length > 0) {
                    newDateData[0] = Number(moment(moment(m.value[0]).valueOf()).format('YYYYMMDDHHmmss'));
                    newDateData[1] = Number(moment(moment(m.value[1]).valueOf()).format('YYYYMMDD') + '235959');
                  }
                  requestMapData.push(
                    {
                      [m.enName]: newDateData // 是时间的情况下增加时间后缀
                    }
                  );
                } else {
                  requestMapData.push(
                    {
                      [m.enName]: m.value === 'all' ? '' : m.value // 此处是为传参数值时，如果value为all，则改变value值为空字符串
                    }
                  );
                }
              }
            });
          });
        }
      }
      requestMapData.push(
        {
          aid: this.appId
        },
        {
          batch_id: this.secondLevelRouterItems.dataItem.batchId
        }
      );
      const params = {
        startIndex: this.pageNum,
        pageSize: this.perPageNum,
        requestMap: JSON.stringify(requestMapData),
        appId: this.appId,
        menuId: 'risk',
        dataType: this.isAmount
      };
      getTableData(params).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.data.length > 0) {
            this.$nextTick((v) => {
              this.tableContentData = JSON.parse(JSON.stringify(res.data.data.data));
              this.constItem = res.data.data.data;
              this.constItem.forEach((item, index, ary) => {
                delete item['indexName'];
                delete item['id'];
              });
              this.totalItems = res.data.data.totalItems;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
            });
          } else {
            this.$nextTick((v) => {
              this.constItem = [];
              this.totalItems = 0;
              this.queryPageLength = 0;
            });
          }
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
          this.constItem = [];
        }
      }).catch(err => console.error(err));
    },
    // 查询
    searchTable () {
      this.searchOrResetNewDate = new Date().getTime();
      this.pageNum = 1;
      this.getTableData();
    },
    // 查看风控详情===按钮
    seeDetails (item, clickIndex) {
      let params = {};
      this.tableContentData.forEach((i, x, ay) => {
        if (x === clickIndex) {
          params = {
            id: i.id,
            indexName: i.indexName,
            appId: this.appId,
            menuId: 'risk',
            dataType: this.isAmount
          };
        }
      });
      searchTableContentData(params).then(res => {
        if (res.data.code === 200) {
          this.detailsDialog = true;
          let baseRes = res.data.data.hitRule;
          this.detailsOplogDetail = res.data.data.oplogDetails;
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
          this.opLog = res.data.data.opLog;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => console.error(err));
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
  }
};
</script>

<style scoped lang="stylus">
  .echarts {
    margin: 0 auto;
  }
  .risk_text {
    font-weight: bold;
  }
  .risk_name {
    color: var(--v-primary-base);
  }
  .ruleSetParam p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
  // 搜索条件中多选款选择多个时，自适应高度
     .ruleSetSearchMultiple >>> .v-input__control {
       height: auto !important;
     }
  // 搜索条件中多选款选择多个时，自适应高度，删除多余的样式
     .ruleSetSearchMultiple >>> .v-text-field__details {
       min-height: 0;
       margin: 0;
     }
  // 搜索条件中多选款选择多个时，自适应高度，删除多余的样式
     .ruleSetSearchMultiple >>> .v-messages {
       min-height: 0;
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
