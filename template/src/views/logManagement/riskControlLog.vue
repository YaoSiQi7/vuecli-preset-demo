<!----------  @author: wangGuoDong  ----------->
<!----------  @updated_at: 2020-04-07  ----------->
<!----------  @version: 2.0  ----------->
<template>
  <div class="my-2 mt-0 fill-height">
    <div>
      <v-tabs
        style="padding:0;"
        v-model="tab"
      >
        <v-tab
          v-for="(item,index) in tabItems"
          :key="index"
          @click="tabClick(item.tabName)"
        >
          {{ item.tabName }}
        </v-tab>
      </v-tabs>
    </div>
    <div>
      <div v-show="dynamicLogShow">
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

                    <v-col v-for="(items, index) in formData" :key="index" cols="12" sm="12" :md=items.colNumber :xl=items.colNumber>
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
                          <v-chip v-if="index === 0" outlined style="border: 0;margin: 0;padding: 0;">
                            <span>{{ item.name }}</span>
                          </v-chip>
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
                  :height="tableHeight"
                >
                  <!-- 列表头 -->
                  <template v-slot:top>
                    <v-toolbar flat>
                      <v-toolbar-title style="font-size:18px">
                        {{ isAmount === 1 ? '动账日志' : '非动账日志'}}
                      </v-toolbar-title>
                      <v-divider
                        class="mx-4"
                        inset
                        vertical
                      />
                      <v-spacer></v-spacer>
                      <!--<v-btn
                        color="primary"
                        class="mr-5 mt-1">
                        批量删除
                      </v-btn>-->
                      <echart-export-file
                        :isEchart="false"
                        :isActive="isActiveBtnMovable"
                        :fileName="appName + '-动账风控日志'"
                        style="position: absolute; right: 16px; z-index: 4"
                        @exportExcel="exportData(arguments, 'excel')"
                        @exportCSV="exportData(arguments, 'csv')"
                        v-if="isAmount === 1 && hasPermission(exportBtnMovable)"
                      ></echart-export-file>
                      <echart-export-file
                        :isEchart="false"
                        :isActive="isActiveBtnNoMovable"
                        :fileName="appName + '-非动账风控日志'"
                        style="position: absolute; right: 16px; z-index: 4"
                        @exportExcel="exportData(arguments, 'excel')"
                        @exportCSV="exportData(arguments, 'csv')"
                        v-else-if="isAmount !== 1 && hasPermission(exportBtnNoMovable)"
                      ></echart-export-file>
                      <!-- <v-btn
                        color="primary"
                        class="mr-1 mt-1"
                        v-if="isAmount === 1 && hasPermission(exportBtnMovable)"
                        @click="exportData"
                      >
                        导出
                      </v-btn>
                      <v-btn
                        color="primary"
                        class="mr-1 mt-1"
                        v-else-if="isAmount !== 1 && hasPermission(exportBtnNoMovable)"
                        @click="exportData"
                      >
                        导出
                      </v-btn> -->
                    </v-toolbar>
                  </template>
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
                              v-if="isAmount === 1 && hasPermission(seeMovableRiskLogDetailsBtn)"
                              @click="seeDetails(item, index)"
                            >
                              mdi-card-account-details
                            </v-icon>
                            <v-icon
                              small
                              class="mr-1 icon-primary"
                              v-on="on"
                              color="primary"
                              v-else-if="isAmount !== 1 && hasPermission(seeNoMovableRiskLogDetailsBtn)"
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
            <v-card-text>
              <!-- <v-container> -->
                <!-- 注释掉的为一期的查看详情 -->
                <!-- <v-row>
                  <v-col cols="6">
                    <div style="border: 1px solid #F3F3F3;">
                      <v-card-title class="header_bg_color">
                        上线风险策略
                      </v-card-title>
                      <v-row class="mt-2" style="padding: 0;margin:0;">
                        <v-col
                          cols="3"
                          style="padding: 0;margin:0;text-align: center;"
                        >
                          <span class="emptyCircle">
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
                    <div style="border: 1px solid #F3F3F3;margin-top: 10px;">
                      <v-card-title class="header_bg_color">
                        试运行风险策略
                      </v-card-title>
                      <v-row class="mt-2" style="padding: 0;margin:0;height: 90px;">
                        <v-col
                          cols="3"
                          style="padding: 0;margin:0;text-align: center;"
                        >
                          <span class="emptyCircle">
                            <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                          </span>
                        </v-col>
                        <v-col
                          cols="9"
                        >
                          <div>
                            <span class="base_field_text_cu">匹配模式：</span>
                            <span>{{ hitRule.simulatedResult.matchType }}</span>
                          </div>
                          <div>
                            <span class="base_field_text_cu">建议策略：</span>
                            <span>{{ hitRule.simulatedResult.strategy }}</span>
                          </div>
                          <div>
                            <span class="base_field_text_cu">风险标签：</span>
                            <span class="base_field_color">{{ hitRule.simulatedResult.hit_labels }}</span>
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
                              <span v-if="hitRule.simulatedResult.matchType === '评分模式'" class="base_field_text_cu">规则权重：</span>
                              <span v-else class="base_field_text_cu">处置策略：</span>
                            </v-col>
                          </v-row>
                          <div v-if="Object.keys(hitRule.simulatedResult).length > 0 && hitRule.simulatedResult.hit_rules.length > 0">
                            <v-row v-for="(item, index) in hitRule.simulatedResult.hit_rules" :key="index">
                              <v-col cols="8">
                                <div class="base_field_color">{{ item.rule_name }}</div>
                              </v-col>
                              <v-col cols="4">
                                <div v-if="hitRule.simulatedResult.matchType === '评分模式'">{{ item.rule_score | matchTypeValue() }}</div>
                                <div v-else>{{ item.rule_strategy }}</div>
                              </v-col>
                            </v-row>
                          </div>
                          <div v-else></div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div style="border: 1px solid #F3F3F3;">
                      <v-card-title class="header_bg_color">
                        业务信息
                      </v-card-title>
                      <v-row class="addDetilBaseMTop">
                        <v-col>
                          <span class="base_field_text_cu">APP标识：</span>
                          <span>{{ opLog.app_id }}</span>
                        </v-col>
                      </v-row>
                      <v-row class="addDetilBaseMTop">
                        <v-col>
                          <span class="base_field_text_cu">账号：</span>
                          <span>{{ opLog.user_name }}</span>
                        </v-col>
                      </v-row>
                      <v-row class="addDetilBaseMTop">
                        <v-col>
                          <span class="base_field_text_cu">交易类型：</span>
                          <span>{{ opLog.op_type }}</span>
                        </v-col>
                      </v-row>
                      <v-row class="addDetilBaseMTop">
                        <v-col>
                          <span class="base_field_text_cu">场景标识：</span>
                          <span>{{ opLog.scene }}</span>
                        </v-col>
                      </v-row>
                      <v-row class="addDetilBaseMTop">
                        <v-col>
                          <span class="base_field_text_cu">设备品牌：</span>
                          <span>{{ opLog.brand }}</span>
                        </v-col>
                      </v-row>
                      <v-row class="addDetilBaseMTop">
                        <v-col>
                          <span class="base_field_text_cu">设备型号：</span>
                          <span>{{ opLog.model }}</span>
                        </v-col>
                      </v-row>
                      <v-row class="addDetilBaseMTop">
                        <v-col>
                          <span class="base_field_text_cu">操作时间：</span>
                          <span>{{ opLog.create_time }}</span>
                        </v-col>
                      </v-row>
                    </div>
                    <div style="border: 1px solid #F3F3F3;margin-top: 10px;">
                      <v-card-title class="header_bg_color">
                        IP信息
                      </v-card-title>
                      <v-row class="addDetilBaseMTop">
                        <v-col>
                          <span class="base_field_text_cu">IP：</span>
                          <span>{{ opLog.ip }}</span>
                        </v-col>
                      </v-row>
                      <v-row class="addDetilBaseMTop">
                        <v-col>
                          <span class="base_field_text_cu">位置：</span>
                          <span>{{ opLog.city }}</span>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </v-row> -->
              <!-- </v-container> -->
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- // 风控日志-二期：公共详情弹窗 -->
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
  searchTableContentData,
  getAllRules,
  exportLogData,
  exportLogDataCSV
} from '@/api/riskControlLog';
import BaseSearch from '@/components/BaseSearch';
import BaseDetails from '@/components/BaseRiskLogDetails';
import EchartExportFile from '@c/EchartExportFile';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { downloadFile } from '@/utils/downloadFile';
import qs from 'qs';
export default {
  data: () => ({
    newDate: null,
    counter: 0,
    fullHeight: window.innerHeight,
    // tab
    tab: null,
    tabs: 2,
    tabItems: [
      { tabName: '动账日志' },
      { tabName: '非动账日志' }
    ],
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
    isAmount: 1, // 1代表动账日志，0代表非动账日志
    // 查看风控详情
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
    // 查看风控详情
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
        name: 'amount', // 金额
        rules: [
          // eslint-disable-next-line no-useless-escape
          v => ((/^[0-9][0-9]*(\.[0-9]+)?$/ig).test(v)) || '请输入正确的金额'
        ]
      },
      {
        name: 'number', // 数字
        rules: [
          // eslint-disable-next-line no-useless-escape
          v => ((/^[0-9][0-9]*(\.[0-9]+)?$/ig).test(v)) || '请输入正确的数字'
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
    /* formData: [
      {
        sortNo: 1,
        searchSrc: '[]',
        cnName: '银行卡号',
        isSearch: '1',
        searchType: 'text',
        enName: 'bank_card',
        id: '1111',
        type: '1'
      },
      {
        sortNo: 2,
        searchSrc: '[]',
        cnName: '银行卡号',
        isSearch: '1',
        searchType: 'text',
        enName: 'user_name',
        id: '222',
        type: '1'
      },
      {
        sortNo: 3,
        searchSrc: '[]',
        cnName: '金额',
        isSearch: '1',
        searchType: 'range',
        enName: 'amount',
        id: '3333',
        type: '1'
      },
      {
        sortNo: 4,
        searchSrc: '[]',
        cnName: '分值',
        isSearch: '1',
        searchType: 'range',
        enName: 'amount2',
        id: '4444',
        type: '1'
      }
    ], */
    fData: [],
    form: {},
    searchValid: true,
    isExpanded: true,
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
    routerParams: false, // 标识是否为别的页面跳转而来。false为否，true为是。
    TabNewDate: 0, // tab页切换时的时间
    searchOrResetNewDate: 0, // 查询和重置按钮被点击时的时间
    isTabLcick: false, // tab页被点击时，搜索和重置按钮是否被点击，是：true, 否：false
    riskLogDataParamss: null,
    // 按钮权限
    exportBtnMovable: '/exportMovableAccountLogButton', // 动账导出权限
    exportBtnNoMovable: '/exportNoMovableAccountLogButton', // 非动账导出权限
    seeMovableRiskLogDetailsBtn: '/showMovableAccountRiskControlDetailsButton', // 动账日志查看详情按钮权限
    seeNoMovableRiskLogDetailsBtn: '/showNoMovableAccountRiskControlDetailsButton', // 非动账日志查看详情按钮权限
    isActiveBtnMovable: true,
    isActiveBtnNoMovable: true
  }),
  computed: {
    // 取右上角调色板右边的下拉框的id
    ...mapGetters([
      'appId',
      'pageTabs',
      'appName'
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
    appId (val) {
      this.pageNum = 1;
      this.constHeader = [];
      this.constItem = [];
      this.totalItems = 0;
      this.queryPageLength = 0;
      this.getSearchData();
    },
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 136;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  components: {
    BaseSearch,
    BaseDetails,
    EchartExportFile
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
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  created () {
    if (Object.keys(this.$route.params).length !== 0) this.routerParams = true; // router传的参数有值为true, 反之为false。默认值为false
    // 此为取本地缓存参数的方式
    // if (sessionStorage.getItem('riskLogDataParams')) {
    //   this.routerParams = true;
    //   this.$route.params = JSON.parse(sessionStorage.getItem('riskLogDataParams'));
    // }
    if (this.routerParams) { // 下方判断是为了区分isAmount是字符串还是数字，解决bug-18120根据参数回显是动账或者非动账页面
      if (typeof this.$route.params.isAmount === 'string') {
        this.tab = this.$route.params.isAmount === '1' ? 0 : 1; // 动态切换动账、非动账日志（此处之所以需要转换，是因为tab的0是动账，1是非动账。）
        this.isAmount = Number(this.$route.params.isAmount); // 动账或非动账日志 isAmount 1代表动账日志，0代表非动账日志
      } else {
        this.tab = this.$route.params.isAmount === 1 ? 0 : 1; // 动账或非动账日志
        this.isAmount = this.$route.params.isAmount; // 动态切换动账、非动账日志
      }
      if (this.tab === 0) {
        localStorage.setItem('getMenu', '/accountLog');
      } else {
        localStorage.setItem('getMenu', '/noAccountLog');
      }
    } else {
      localStorage.setItem('getMenu', '/accountLog');
    }
    if (this.appId) {
      this.getSearchData();
    }
  },
  methods: {
    // 导出数据
    async exportData (filename, type) {
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
          if (item.value === 'all') {
            requestMapData.push(
              {
                [ary[index].enName]: ''
              }
            );
          } else {
            requestMapData.push(
              {
                [ary[index].enName]: item.value || ''
              }
            );
          }
        } else if (item.searchType === 'multiple') {
          if (item.value.length > 0) {
            requestMapData.push(
              {
                [ary[index].enName]: item.value.join(',')
              }
            );
          } else {
            requestMapData.push(
              {
                [ary[index].enName]: ''
              }
            );
          }
        } else if (item.searchType === 'select') {
          requestMapData.push(
            {
              [ary[index].enName]: item.value === 'all' ? '' : item.value || ''
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
      requestMapData.push(
        {
          aid: this.appId
        }
      );

      const params = {
        requestMap: JSON.stringify(requestMapData),
        appId: this.appId,
        menuId: 'risk',
        dataType: this.isAmount
      };
      this.isActiveBtnMovable = false;
      this.isActiveBtnNoMovable = false;
      if (type === 'excel') {
        exportLogData(params).then(response => {
          let blob = new Blob([response.data]);
          downloadFile(blob, filename[0]);
          this.isActiveBtnMovable = true;
          this.isActiveBtnNoMovable = true;
        }).catch(err => {
          console.error(err);
          this.isActiveBtnMovable = true;
          this.isActiveBtnNoMovable = true;
        });
      } else if (type === 'csv') {
        exportLogDataCSV(params).then(response => {
          let blob = new Blob([response.data]);
          downloadFile(blob, filename[0]);
          this.isActiveBtnMovable = true;
          this.isActiveBtnNoMovable = true;
        }).catch(err => {
          console.error(err);
          this.isActiveBtnMovable = true;
          this.isActiveBtnNoMovable = true;
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
    // 测试去掉小数点后面的数字
    // 获取公共搜索条件
    getSearchCondition (res) {
      if (res.code === 200) {
        if (res.data.length > 0) {
          this.constHeader = [];
          res.data.forEach((item, index, ary) => {
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
                appId: this.appId
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
                  // 支持交易类下钻时单选，风控日志的交易类型是单选或多选
                  if (im.enName === 'op_type' && im.searchType === 'select' && item.searchType === im.searchType) {
                    item.value = '';
                    item.value = im.value || '';
                  } else if (im.enName === 'op_type' && im.searchType === 'select' && item.searchType === 'multiple') {
                    if (im.value === 'all') {
                      if (item.searchSrc.length) {
                        item.value = [];
                        item.searchSrc.forEach(opTypeValue => {
                          item.value.push(opTypeValue.value);
                        });
                      } else {
                        item.value = [];
                      }
                    } else if (im.value === '') {
                      item.value = [];
                    } else {
                      item.value = [];
                      item.value.push(im.value);
                    }
                  } else {
                    item.value = im.value || '';
                  }
                  // 支持交易类下钻时单选，风控日志的交易类型必须是多选的状态
                  /* if (im.enName === 'op_type' && im.searchType === 'select') {
                    item.value = '';
                    item.value = im.value;
                  } else {
                    if (im.value === 'all') {
                      if (item.searchSrc.length) {
                        item.value = [];
                        item.searchSrc.forEach(opTypeValue => {
                          item.value.push(opTypeValue.value);
                        });
                      } else {
                        item.value = [];
                      }
                    } else if (im.value === '') {
                      item.value = [];
                    } else {
                      item.value = [];
                      item.value.push(im.value);
                    }
                  } */
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
    tabClick (data) {
      let isParamsAmount = '';
      this.isAmount ? isParamsAmount = '动账日志' : isParamsAmount = '非动账日志';
      if (data) { // 当点击tab切换时
        // if (this.tab === 0) {
        //   localStorage.setItem('getMenu', 'accountLog');
        // } else {
        //   localStorage.setItem('getMenu', 'noAccountLog');
        // }
        if (data === '动账日志') {
          localStorage.setItem('getMenu', '/accountLog');
        } else {
          localStorage.setItem('getMenu', '/noAccountLog');
        }
        if (Object.keys(this.$route.params).length !== 0) { // 此为判断是否下钻到风控日志
          this.$route.params.paramsAry.forEach((item, index, ary) => {
            if (item.enName === 'op_type' && item.value === 'all' && !this.searchOrResetNewDate) { // 如果op_type_id为all 且没有点击过查询或重置按钮
              if (!this.isTabLcick) { // 当tab没有点击过一次时，（如果被多次点击）
                if (this.searchOrResetNewDate) { // 当tab没有点击过一次，且查询或重置按钮被点击过一次，把
                  this.TabNewDate = new Date().getTime();
                  if (this.TabNewDate > this.searchOrResetNewDate) {
                    this.isTabLcick = true;
                    this.routerParams = false;
                  }
                }
              }
              if (data === '动账日志') {
                this.isAmount = 1;
              } else {
                this.isAmount = 0;
              }
              this.pageNum = 1;
              this.$forceUpdate();
              this.getSearchData();
            } else if (item.enName === 'op_type' && item.value === 'all' && this.searchOrResetNewDate) { // 如果op_type的值为all且点击了查询之后再次点击tab切换时，清空下钻传的参数值，。
              if (data !== isParamsAmount && this.searchOrResetNewDate) {
                this.TabNewDate = new Date().getTime();
                if (this.TabNewDate > this.searchOrResetNewDate) {
                  this.isTabLcick = true;
                  this.routerParams = false;
                }
                if (data === '动账日志') {
                  this.isAmount = 1;
                } else {
                  this.isAmount = 0;
                }
                this.pageNum = 1;
                this.$forceUpdate();
                this.getSearchData();
              }
            } else if (item.enName === 'op_type' && item.value !== 'all') { // 如果op_type的值不为all，点击tab时，不论是否点击了查询和重置按钮，都清空下钻传的参数值，。
              if (data !== isParamsAmount && this.searchOrResetNewDate) {
                this.TabNewDate = new Date().getTime();
                if (this.TabNewDate > this.searchOrResetNewDate) {
                  this.isTabLcick = true;
                  this.routerParams = false;
                }
                if (data === '动账日志') {
                  this.isAmount = 1;
                } else {
                  this.isAmount = 0;
                }
                this.pageNum = 1;
                this.$forceUpdate();
                this.getSearchData();
              } else if (data !== isParamsAmount && !this.searchOrResetNewDate) {
                this.routerParams = false;
                if (data === '动账日志') {
                  this.isAmount = 1;
                } else {
                  this.isAmount = 0;
                }
                this.pageNum = 1;
                this.$forceUpdate();
                this.getSearchData();
              }
            }
          });
        } else { // 此为不是下钻而来的风控日志，是从菜单页点击而来的
          if (data === '动账日志') {
            this.isAmount = 1;
          } else {
            this.isAmount = 0;
          }
          this.pageNum = 1;
          this.$forceUpdate();
          this.getSearchData();
        }
      } else { // 如果是手动刷新页面时，data是空，即为false；这时应按照初次进入页面的状态来展示，没有任何回显，但是，唯一不同的是保持this.isAmount此变量的值，isAmount：0为动账日志，1为非动账日志
        if (this.isAmount === 0) {
          localStorage.setItem('getMenu', '/accountLog');
        } else {
          localStorage.setItem('getMenu', '/noAccountLog');
        }
        this.TabNewDate = 0;
        this.searchOrResetNewDate = 0;
        this.isTabLcick = false;
        this.routerParams = false;
        this.pageNum = 1;
        this.$forceUpdate();
        this.getSearchData();
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
                [ary[index].enName]: item.value || ''
              }
            );
          }
        } else if (item.searchType === 'multiple') {
          if (item.value.length > 0) {
            requestMapData.push(
              {
                [ary[index].enName]: item.value.join(',')
              }
            );
          } else {
            requestMapData.push(
              {
                [ary[index].enName]: ''
              }
            );
          }
        } else if (item.searchType === 'select') {
          requestMapData.push(
            {
              [ary[index].enName]: item.value === 'all' ? '' : item.value || ''
            }
          );
        } else {
          requestMapData.push(
            {
              [ary[index].enName]: item.value || ''
            }
          );
        }
      });
      if (this.routerParams && !this.searchOrResetNewDate) { // 下钻过来：如果搜索条件没有传参过来的搜索条件标识-enName,就在查询接口的参数中加上此搜索条件标识-enName
        for (var formDataIndex = 0; formDataIndex < this.formData.length; formDataIndex++) {
          const element = this.formData[formDataIndex];
          for (var paramsAryIndex = 0; paramsAryIndex < this.$route.params.paramsAry.length; paramsAryIndex++) {
            const elementTwo = this.$route.params.paramsAry[paramsAryIndex];
            if (elementTwo.enName === element.enName) {
              theSameItem.push(element.enName); // 取出下钻参数里和formData搜索条件中相同的enName
              break;
            }
          }
        }
        // 取出下钻参数里的enName
        this.$route.params.paramsAry.forEach((m, x, y) => {
          sourceParamsEnName.push(m.enName);
        });
        // 利用（下钻参数里和formData搜索条件中相同的enName）和（下钻参数里的enName）对比去重，如果有不一样的，就把不一样的影响加到接口的参数中。（只有在没有点击查询和重置按钮之前才进入这一步，否则就取当前formData的值）
        if (this.deWeightArray(sourceParamsEnName, theSameItem).length > 0) {
          this.$route.params.paramsAry.forEach((m, x, y) => {
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
                      [m.enName]: m.value === 'all' ? '' : m.value || '' // 此处是为传参数值时，如果value为all，则改变value值为空字符串
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
      if (!this.isTabLcick) {
        this.searchOrResetNewDate = new Date().getTime();
      }
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
