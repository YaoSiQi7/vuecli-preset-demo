<!----------  @author: wangguodong  ----------->
<!----------  @updated_at: 2021-01-27  ----------->
<!----------  @version: develop-v1.7  ----------->

<template>
<!-- 变更日志 -->
  <div>
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3',isFixed?'fixed':'']">
       <v-card-actions style="height:60px">
          <v-btn  class="ml-4 cancelButton" @click="cancelRuleList" outlined >返回</v-btn>
       </v-card-actions>
      </v-card>
    </div>
    <div class="enu-content fill-height backColor mt-2">
      <div class="ruleSetParam mt-2">
        <v-row class="pt-4">
          <v-col cols="3" class="text-left">
            <p class="ml-6 textEllipsis" :title="operatedRuleSet.setName">规则集名称：{{ operatedRuleSet.setName }}</p>
          </v-col>
          <v-col cols="3" class="text-left">
            <p class="textEllipsis" :title="operatedRuleSet.organizationIdText">所属公司：{{ operatedRuleSet.organizationIdText }}</p>
          </v-col>
          <v-col cols="3" class="text-left">
            <p class="textEllipsis" :title="operatedRuleSet.appIdText">所属应用：{{ operatedRuleSet.appIdText }}</p>
          </v-col>
          <v-col cols="3" class="text-left">
            <p class="textEllipsis" :title="operatedRuleSet.transactionTypeIdText">交易类型： {{operatedRuleSet.transactionTypeIdText }}</p>
          </v-col>
        </v-row>
      </div>
      <!-- 查询条件 -->
      <v-row class="ml-2 searchO">
        <v-col cols="12" class="pt-0">
          <v-form ref="searchForm" v-model="searchValid" lazy-validation>
            <v-row class="amend_padding">
              <v-col cols="2" class="">
                <v-select
                  v-model="searchForm.relationType"
                  :items="typeItems"
                  item-text="text"
                  item-value="value"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                ></v-select>
              </v-col>
              <v-col cols="2" class="">
                <v-text-field
                  outlined
                  dense
                  v-model="searchForm.realName"
                  placeholder="更新人"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-autocomplete
                  class="ruleSetAddOrEdit"
                  v-model="searchForm.operationType"
                  :items="sysParamsArray"
                  item-text="value"
                  item-value="key"
                  outlined
                  dense
                  chips
                  small-chips
                  label="操作类型"
                  multiple
                  solo
                  no-data-text="没有匹配数据"
                >
                <template v-slot:selection="{ item, index }">
                    <!-- <v-chip v-if="index === 0">
                      <span>{{ item.value }}</span>
                    </v-chip> -->
                    <v-chip v-if="index === 0" outlined style="border: 0;margin: 0;padding: 0;">
                      <span>{{ item.value }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text caption"
                      >(+{{ searchForm.operationType.length - 1 }} 更多)</span
                    >
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="4" class="">
                <v-text-field
                  outlined
                  dense
                  v-model="searchForm.searchName"
                  placeholder="支持规则名称、规则编号、规则集名称搜索"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="2"
                xl="2"
                style="text-align: left; position: relative;line-height: 37px;"
              >
                <div class="dateBtnBox">
                  <v-btn
                    color="primary"
                    style="margin-left:12px;"
                    @click="resetSearchData"
                    small
                  >重置</v-btn>
                  <v-btn
                    color="primary"
                    style="margin-left:12px;"
                    small
                    @click="search($event)"
                  >查询</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
      <!-- 时间轴 -->
      <div class="pr-4" style="border-top: 10px solid #ccc; border-bottom: 10px solid #ccc;">
        <v-timeline dense v-if="timelineList.length > 0" :key="baseTime">
          <v-timeline-item
            v-for="(timelineAry, i) in timelineList"
            :key="i"
            :color="timelineAry.color"
            large
            right
          >
            <template v-slot:icon class="aaaaaa">
              <!-- <span style="display: inline-block; width: 50px;height: 50px; line-height: 50px; text-align: center;">{{ timelineAry.relationTypeName }}</span> -->
              <span v-if="timelineAry.relationTypeName === '规则集'" style="color: orange; font-weight: bold;">{{ timelineAry.relationTypeName }}</span>
              <span v-else style="color: green">{{ timelineAry.relationTypeName }}</span>
            </template>
              <!-- <template v-slot:opposite>
                <span
                  :class="`headline ${timelineAry.color}--text`"
                  v-text="timelineAry.relationTypeName"
                ></span>
                <span
                  v-text="timelineAry.relationTypeName"
                ></span>
              </template> -->
            <div class="py-4">
              <v-expansion-panels>
                <v-expansion-panel
                >
                  <v-expansion-panel-header class="panelHeaderBackColor" @click="expansionHeaderClick(timelineAry, i)">
                    <v-row v-if="timelineAry.relationTypeName === '规则集'">
                      <span class="ml-2">{{timelineAry.createTime}}</span>
                      <span class="ml-4">{{timelineAry.realName}}</span>
                      <span class="ml-4">{{timelineAry.operationTypeName}}</span>
                      <span class="ml-4">{{timelineAry.setName}}</span>
                    </v-row>
                    <v-row v-else>
                      <span class="ml-2">{{timelineAry.createTime}}</span>
                      <span class="ml-4">{{timelineAry.realName}}</span>
                      <span class="ml-4">{{timelineAry.operationTypeName}}</span>
                      <span class="ml-4">{{timelineAry.ruleNo}}</span>
                      <span class="ml-4">{{timelineAry.ruleName}}</span>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content v-if="timelineAry.ruleCollectionBasicInfo">
                    <!-- 基本信息 或 规则基本信息-->
                    <div>
                      <div v-if="timelineAry.ruleCollectionBasicInfo && timelineAry.relationTypeName === '规则集'" class="basicInfoStyle">
                        <h3 class="pt-2">基本信息</h3>
                        <v-row class="pt-2" :key="baseTimeRuleSet + i">
                          <v-col cols="3" class="text-left">
                            <p class="ml-6 textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.setName1">规则集名称：{{ timelineAry.ruleCollectionBasicInfo.setName1 }}</p>
                          </v-col>
                          <v-col cols="3" class="text-left">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.organizationNames">所属公司：{{ timelineAry.ruleCollectionBasicInfo.organizationNames }}</p>
                          </v-col>
                          <v-col cols="3" class="text-left">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.appNames">所属应用：{{ timelineAry.ruleCollectionBasicInfo.appNames }}</p>
                          </v-col>
                          <v-col cols="3" class="text-left">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.transactionTypeNames">交易类型： {{timelineAry.ruleCollectionBasicInfo.transactionTypeNames }}</p>
                          </v-col>
                        </v-row>
                        <v-row class="pt-0">
                          <v-col cols="3" class="text-left pt-0">
                            <p class="ml-6 textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.matchingModelName">规则匹配模式：{{ timelineAry.ruleCollectionBasicInfo.matchingModelName }}</p>
                          </v-col>
                        </v-row>
                      </div>
                      <div v-if="timelineAry.ruleCollectionBasicInfo && timelineAry.relationTypeName === '规则'" class="basicInfoStyle" :key="baseTimeRuleDetails + i">
                        <h3 class="pt-2">规则基本信息</h3>
                        <v-row class="pt-2">
                          <v-col cols="3" class="text-left">
                            <p class="ml-6 textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.ruleNo">规则编号：{{ timelineAry.ruleCollectionBasicInfo.ruleNo }}</p>
                          </v-col>
                          <v-col cols="3" class="text-left">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.ruleName">规则名称：{{ timelineAry.ruleCollectionBasicInfo.ruleName }}</p>
                          </v-col>
                          <v-col cols="3" class="text-left">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.labelNames">标签：{{ timelineAry.ruleCollectionBasicInfo.labelNames }}</p>
                          </v-col>
                          <v-col cols="3" class="text-left">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.enableTime">启用时间：{{ timelineAry.ruleCollectionBasicInfo.enableTime }}</p>
                          </v-col>
                        </v-row>
                        <v-row class="pt-0">
                          <v-col cols="3" class="text-left pt-0">
                            <p class="ml-6 textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.invalidTime">生效时间：{{ timelineAry.ruleCollectionBasicInfo.invalidTime }}</p>
                          </v-col>
                          <v-col v-if="pattern === '评分模式'" cols="3" class="text-left pt-0">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.weights">权重： {{timelineAry.ruleCollectionBasicInfo.weights }}</p>
                          </v-col>
                          <v-col v-if="pattern !== '评分模式'" cols="3" class="text-left pt-0">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.strategyName">处置策略： {{timelineAry.ruleCollectionBasicInfo.strategyName }}</p>
                          </v-col>
                          <v-col v-if="pattern !== '评分模式'" cols="3" class="text-left pt-0">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.priorityLevel">优先级： {{timelineAry.ruleCollectionBasicInfo.priorityLevel }}</p>
                          </v-col>
                          <v-col cols="3" class="text-left pt-0">
                            <p class="textEllipsis" :title="timelineAry.ruleCollectionBasicInfo.ruleDescription">规则描述：{{ timelineAry.ruleCollectionBasicInfo.ruleDescription }}</p>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                    <!-- 风险阈值 或 规则配置 -->
                    <div>
                      <div v-if="timelineAry.relationTypeName === '规则集' && pattern === '评分模式'" class="threshold">
                        <h3>风险阈值</h3>
                        <div v-if="timelineAry.ruleCollectionBasicInfo.riskThreshold && timelineAry.ruleCollectionBasicInfo.riskThreshold.length > 0">
                          <div class="flex"
                            v-for="(score, scoreIndex) in timelineAry.ruleCollectionBasicInfo.riskThreshold"
                            :key="scoreIndex"
                          >
                            <div class="thresholdDiv">
                              <span class="numberSpan">{{ score.from }} 分</span>
                            </div>
                            <div class="thresholdDiv lineSpan">
                              <span></span>
                            </div>
                            <div class="thresholdDiv">
                              <span class="numberSpan">{{ score.to }} 分</span>
                            </div>
                            <div class="thresholdDiv">
                              <span class="numberSpan textSpan">{{ score.strategyName }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="timelineAry.relationTypeName === '规则'">
                        <div class="basicInfoStyle" v-if="timelineAry.ruleJson">
                          <h3 class="pt-2">规则配置</h3>
                          <div v-if="timelineAry.ruleJson.conditionList && timelineAry.ruleJson.conditionList.length > 0" style="padding-left: 20px;">
                            <div v-for="(operateItem, operateIndex) in timelineAry.ruleJson.conditionList" :key="operateIndex" class="mt-2" style="overflow: hidden;">
                              <v-row class="panelHeaderBackColor">
                                <v-col class="pr-0 pl-6 lineHeightStyle" cols='1'>条件{{operateItem.filterSign}}</v-col>
                                <v-col class="pl-0 pr-0 lineHeightStyle textEllipsis" cols='3' :title="operateItem.conditionDes">{{operateItem.conditionDes}}</v-col>
                                <v-col class="pl-0 pr-0" cols='2'>
                                  <div class="out-div">
                                    <div class="arrow"></div>
                                    <span v-show="operateItem.settingType===1">类别：配置条件</span>
                                    <span v-show="operateItem.settingType===0">类别：模板条件</span>
                                  </div>
                                </v-col>
                                <v-col class="pl-0 pr-0 lineHeightStyle" cols='6' v-if="operateItem.settingType===0">
                                  <div class="temp-name textEllipsis" :title="operateItem.conditionItems[0].fieldText">
                                    所属模板：{{operateItem.conditionItems[0].fieldText}}
                                  </div>
                                </v-col>
                              </v-row>
                              <!-- 模板配置规则 -->
                              <div v-if="operateItem.settingType === 0" class="">
                                <div class="tempParamItems" v-if="operateItem.conditionItems[0].parameters && operateItem.conditionItems[0].parameters.length > 0">
                                  <div
                                    class="tempParamItem"
                                    v-for="(item, index) in operateItem.conditionItems[0].parameters"
                                    :key="index"
                                  >
                                    <span class="circle"></span>
                                    <span class="name">{{item.cnName}}</span>
                                    <span class="value">
                                      <v-text-field
                                        v-if="item.src==='select'"
                                        style="disply:inline"
                                        outlined
                                        dense
                                        readonly
                                        v-model="item.value.name"
                                      />
                                      <v-text-field
                                        v-if="item.src==='input'"
                                        style="disply:inline"
                                        outlined
                                        dense
                                        readonly
                                        v-model="item.value.value"
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <!-- 条件配置规则 -->
                              <div v-if="operateItem.settingType === 1" class="conditionConfig">
                                <div v-if="operateItem.conditionItems && operateItem.conditionItems.length > 0">
                                  <v-row v-for="(typeTextItems, typeTextIndex) in operateItem.conditionItems" :key="typeTextIndex" class="disaboldHover">
                                    <v-col class="" cols="4">
                                      <!-- <v-text-field
                                        :title="typeTextItems.fieldText"
                                        v-model="typeTextItems.fieldText"
                                        :label="typeTextItems.fieldSource | baseAmendKu(baseKu)"
                                        outlined
                                        dense
                                        readonly
                                      ></v-text-field> -->
                                      <div class="inputStyle" style="left: 6px;">
                                        <span class="labelStyel">{{ typeTextItems.fieldSource | baseAmendKu(baseKu) }}</span>
                                        <div class="textEllipsis" :title="typeTextItems.fieldText">{{ typeTextItems.fieldText }}</div>
                                      </div>
                                    </v-col>
                                    <!-- 在名单集的情况下typeTextItems.operatorText为空时是默认值：等于 -->
                                    <v-col v-if="typeTextItems.operatorText" class="" cols="1" style="text-align: center; line-height: 40px;">{{ typeTextItems.operatorText }}</v-col>
                                    <v-col v-else class="" cols="1" style="text-align: center; line-height: 40px;">等于</v-col>
                                    <v-col class="" cols="4">
                                      <!-- <v-text-field
                                        v-model="typeTextItems.resultText"
                                        :label="typeTextItems.resultSource | baseAmendKu(baseKu)"
                                        outlined
                                        dense
                                        readonly
                                      ></v-text-field> -->
                                      <div class="inputStyle">
                                        <span class="labelStyel">{{ typeTextItems.resultSource | baseAmendKu(baseKu) }}</span>
                                        <div class="textEllipsis" :title="typeTextItems.resultText">{{ typeTextItems.resultText }}</div>
                                      </div>
                                    </v-col>
                                    <v-col class="" cols="2" v-show="operateItem.conditionItems.length > 1 && typeTextIndex !== operateItem.conditionItems.length-1">
                                      <!-- <v-text-field
                                        :value="typeTextItems.conditionItemRelation | baseAmendRelationship(baseRelationship)"
                                        label="逻辑关系"
                                        outlined
                                        dense
                                        readonly
                                      ></v-text-field> -->
                                      <div class="inputStyle">
                                        <span class="labelStyel">逻辑关系</span>
                                        <div class="textEllipsis" :title="typeTextItems.conditionItemRelation">{{ typeTextItems.conditionItemRelation }}</div>
                                      </div>
                                    </v-col>
                                  </v-row>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- 条件逻辑关系 -->
                        <div class="basicInfoStyle" v-if="timelineAry.ruleJson">
                          <h3 class="pt-2">条件逻辑关系</h3>
                          <v-row v-if="timelineAry.ruleJson.logicalRelationship==='random'" class="pt-2" style="margin-left:0px">
                            <div class="conditionText" style="padding-left: 20px;">自定义:</div>
                            <div class="conditionText pl-2">{{ timelineAry.ruleJson.customizeLogicalRelation }}</div>
                          </v-row>
                          <v-row v-else style="margin-left:0px">
                            <div class="conditionText" style="padding-left: 20px;">动态预览规则条件逻辑关系:</div>
                            <div
                              v-for="(operateItem,operateIndex) in timelineAry.ruleJson.conditionList"
                              :key="operateIndexTime + operateIndex"
                            >
                              <span
                                style="display: inline-block;color: var(--v-primary-base);height: 40px;margin-left: 5px;line-height: 40px;"
                              >条件{{operateItem.filterSign}}</span>
                              <span
                                style="margin-left: 5px;color: var(--v-primary-base);"
                                v-if="timelineAry.ruleJson.logicalRelationship==='and' && operateIndex!==timelineAry.ruleJson.conditionList.length-1"
                              >且</span>
                              <span
                                style="margin-left: 5px;color: var(--v-primary-base);"
                                v-if="timelineAry.ruleJson.logicalRelationship==='or' && operateIndex!==timelineAry.ruleJson.conditionList.length-1"
                              >或</span>
                            </div>
                          </v-row>
                        </div>
                        <!-- 1.8新增：执行配置 -->
                        <div class="basicInfoStyle" v-if="timelineAry.executeConfigureJson">
                          <h3 class="pt-2">执行配置</h3>
                          <div class="conditionConfig" style="padding-left: 20px;">
                            <div v-if="timelineAry.executeConfigureJson && timelineAry.executeConfigureJson.length > 0">
                              <v-row v-for="(executeConfigureJsonItems, executeConfigureJsonIndex) in timelineAry.executeConfigureJson" :key="executeConfigureJsonIndex" class="disaboldHover">
                                <v-col class="" cols="4">
                                  <div class="inputStyle" style="left: 6px;">
                                    <div class="textEllipsis" :title="executeConfigureJsonItems.fieldText">{{ executeConfigureJsonItems.fieldText }}</div>
                                  </div>
                                </v-col>
                                <v-col v-if="executeConfigureJsonItems.operatorText" class="" cols="1" style="text-align: center; line-height: 40px;">{{ executeConfigureJsonItems.operatorText }}</v-col>
                                <v-col v-else class="" cols="1" style="text-align: center; line-height: 40px;">等于</v-col>
                                <v-col class="" cols="4">
                                  <div class="inputStyle">
                                    <div class="textEllipsis" :title="executeConfigureJsonItems.resultText">{{ executeConfigureJsonItems.resultText }}</div>
                                  </div>
                                </v-col>
                              </v-row>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-timeline-item>
        </v-timeline>
      </div>
      <!-- 加载更多 -->
      <div style="text-align: center; height: 60px; line-height: 60px;">
        <v-btn
          v-if="noMore"
          color="primary"
          small
          @click="loadMore($event)"
        >加载更多</v-btn>
        <v-text
          v-else
        >没有数据</v-text>
      </div>
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
import * as dataService from 'api/changeLog.js';
import moment from 'moment';
export default {
  name: 'changeLog',
  components: {},
  data: () => ({
    isFixed: false,
    // 基本信息
    operatedRuleSet: {
      setName: '',
      organizationIdText: '',
      appIdText: '',
      transactionTypeIdText: ''
    },
    // 搜索
    searchForm: {
      relationType: '0',
      realName: '',
      operationType: [],
      searchName: ''
    },
    // 类型
    typeItems: [
      {
        text: '全部类型 ',
        value: '0'
      },
      {
        text: '规则集 ',
        value: '1'
      },
      {
        text: '规则',
        value: '2'
      }
    ],
    // 更新人
    realName: '',
    // 操作类型
    sysParamsArray: [],
    // 搜索中的搜索所有
    searchName: '',
    searchValid: true,
    // 时间轴
    timelineList: [],
    baseTime: 1,
    baseTimeRuleSet: 1,
    baseTimeRuleDetails: 1,
    operateIndexTime: 1,
    // 当前页规则的模式
    pattern: '',
    // 分页变量
    pageNum: 1,
    pageSize: 10,
    queryPageLength: 0,
    perPageNum: 10,
    totalItems: 0,
    perPageItems: [5, 10, 15, 20],
    dialogDel: false,
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    // form表单
    valid: true,
    lazy: false,
    clearDate: false,
    counter: 0, // 搜索条件是否展开
    baseKu: [
      {
        enName: 'LIST_LIB',
        cnName: '名单库'
      },
      {
        enName: 'ENUM_VAR',
        cnName: '枚举库'
      },
      {
        enName: 'CALCULATION_VAR',
        cnName: '计算指标库'
      },
      {
        enName: 'INPUT',
        cnName: '输入值'
      },
      {
        enName: 'BUSINESS_VAR',
        cnName: '业务变量库'
      }
    ],
    baseRelationship: [
      {
        enName: '&&',
        cnName: '且'
      },
      {
        enName: '||',
        cnName: '或'
      }
    ],
    getriskThresholdAry: [], // 风险阈值
    loadNumber: 1,
    noMore: true
  }),
  computed: {
  },
  watch: {},
  filters: {
    baseAmendKu: function (str, baseKu) {
      let dataTypeText;
      baseKu.forEach(item => {
        if (item.enName === str) {
          dataTypeText = item.cnName;
        }
      });
      return dataTypeText;
    },
    baseAmendRelationship: function (str, baseRelationship) {
      let dataTypeText;
      baseRelationship.forEach(item => {
        if (item.enName === str) {
          dataTypeText = item.cnName;
        }
      });
      return dataTypeText;
    }
  },
  created () {
    this.operatedRuleSet = this.$route.params.changeItem; // 顶部信息
    this.publicArrayToText(this.operatedRuleSet.applicationListObj, 'appIdText'); // 所属应用
    this.publicArrayToText(this.operatedRuleSet.organizationTextObj, 'organizationIdText'); // 所属公司
    this.publicArrayToText(this.operatedRuleSet.tradeTypeListObj, 'transactionTypeIdText'); // 交易类型
    // 匹配模式
    if (this.operatedRuleSet.matchingModel === 'SCORE_MATCH') {
      this.pattern = '评分模式';
    } else if (this.operatedRuleSet.matchingModel === 'WORST_MATCH') {
      this.pattern = '最坏匹配';
    } else if (this.operatedRuleSet.matchingModel === 'FIRST_MATCH') {
      this.pattern = '首次匹配';
    }
    this.getOpTypeList();
    this.getriskThresholdList();
  },
  mounted () {
    window.addEventListener('scroll', this.fixedBtnBox);
  },
  methods: {
    // 头部fixed定位
    fixedBtnBox () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 72) { // 当页面滚动到高度72px处，动态绑定class 来设置头部固定定位
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    // 顶部--返回按钮
    cancelRuleList () {
      this.$router.push(
        {
          name: 'ruleSet'
        }
      );
    },
    // 获取操作类型
    async getOpTypeList () {
      try {
        let params = {};
        const res = await dataService.getOpTypeList(params);
        if (res.data.code === 200) {
          this.sysParamsArray = res.data.data;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) { console.log(err); }
    },
    // 获取风险阈值
    async getriskThresholdList () {
      try {
        let params = {
          identifier: 'sys_strategy'
        };
        const res = await dataService.getriskThresholdList(params);
        if (res.data.code === 200) {
          this.getriskThresholdAry = res.data.data;
          this.setTimeDotColor();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) { console.log(err); }
    },
    // 点击搜索按钮
    search ($event) {
      this.loadNumber = 1;
      this.setTimeDotColor($event);
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.$refs.searchForm.reset();
      this.$nextTick(() => {
        this.searchForm.relationType = '0';
      });
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
    async getDataList () {},
    // 设置左侧汉字的颜色以及增加基本信息obj（如果不添加空的对象，页面执行到基本信息标签时报错。）
    async setTimeDotColor ($event) {
      try {
        let params = {};
        if ($event) {
          params = {
            setId: this.operatedRuleSet.id,
            // setId: 'a6b3dc58b5284236aab11e90948f0d17',
            startIndex: this.loadNumber,
            pageSize: 10,
            relationType: this.searchForm.relationType,
            realName: this.searchForm.realName,
            operationType: this.searchForm.operationType.length > 0 ? this.searchForm.operationType.join() : '',
            searchName: this.searchForm.searchName
          };
        } else {
          params = {
            setId: this.operatedRuleSet.id,
            // setId: 'a6b3dc58b5284236aab11e90948f0d17',
            startIndex: this.loadNumber,
            pageSize: 10,
            relationType: this.searchForm.relationType,
            realName: this.searchForm.realName,
            operationType: this.searchForm.operationType.length > 0 ? this.searchForm.operationType.join() : '',
            searchName: this.searchForm.searchName
          };
        }
        const res = await dataService.searchData(params);
        if (res.data.code === 200) {
          if (res.data.data.list.length > 0) {
            res.data.data.list.forEach(item => {
              if (item.relationTypeName === '规则集') {
                // item.color = 'orange';
                item.color = '';
                item.ruleCollectionBasicInfo = {
                  setName1: '',
                  organizationNames: '',
                  appNames: '',
                  transactionTypeNames: '',
                  matchingModelName: '',
                  invalidTime: '',
                  ruleDescription: ''
                };
              } else {
                // item.color = 'green';
                item.color = '';
                item.ruleCollectionBasicInfo = {
                  ruleNo: '',
                  ruleName: '',
                  labelNames: '',
                  weights: '',
                  enableTime: '',
                  invalidTime: '',
                  strategyName: '',
                  priorityLevel: '',
                  ruleDescription: '',
                  executeConfigureJson: []
                };
              }
              this.noMore = true;
            });
            if (this.loadNumber > 1) {
              this.timelineList = this.timelineList.concat(res.data.data.list);
            } else {
              this.timelineList = [];
              this.baseTime++;
              this.timelineList = res.data.data.list;
            }
          } else {
            if (this.loadNumber > 1) {
              this.timelineList = this.timelineList.concat(res.data.data.list);
            } else {
              this.timelineList = [];
              this.baseTime++;
              this.timelineList = res.data.data.list;
            }
            this.noMore = false;
            // this.snackbarServe = true;
            // this.snackbarServeMsg = '没有更多了';
            // this.snackbarServeColor = 'error';
          }
        } else {
          this.timelineList = [];
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) { console.log(err); }
    },
    // 时间轴中：规则集与规则的点击事件
    async expansionHeaderClick (e, i) {
      try {
        let params = {
          recordId: e.recordId,
          relationType: e.relationType
        };
        const res = await dataService.searchRuleDetails(params);
        if (res.data.code === 200) {
          // 规则集或者规则，点开的详情信息
          let ruleSetOrRuleList = {};
          ruleSetOrRuleList = res.data.data;
          if (e.relationTypeName === '规则集') {
            let riskThreshold = JSON.parse(ruleSetOrRuleList.riskThreshold);
            this.timelineList[i].ruleCollectionBasicInfo.setName1 = ruleSetOrRuleList.setName;
            this.timelineList[i].ruleCollectionBasicInfo.organizationNames = ruleSetOrRuleList.organizationNames;
            this.timelineList[i].ruleCollectionBasicInfo.appNames = ruleSetOrRuleList.appNames;
            this.timelineList[i].ruleCollectionBasicInfo.transactionTypeNames = ruleSetOrRuleList.transactionTypeNames;
            this.timelineList[i].ruleCollectionBasicInfo.matchingModelName = ruleSetOrRuleList.matchingModelName;
            // 转换风险阈值为中文
            // console.log(this.getriskThresholdAry);
            // console.log(riskThreshold);
            if (this.getriskThresholdAry.length > 0 && riskThreshold.length > 0) {
              this.getriskThresholdAry.forEach(item => {
                riskThreshold.forEach(im => {
                  if (im.strategy === item.id) {
                    im.strategyName = item.paramName;
                  }
                });
              });
              this.timelineList[i].ruleCollectionBasicInfo.riskThreshold = riskThreshold;
              this.baseTimeRuleSet = new Date().getTime();
            } else {
              this.getriskThresholdAry = [];
              this.riskThreshold = [];
            }
          } else {
            this.timelineList[i].ruleCollectionBasicInfo.ruleNo = ruleSetOrRuleList.ruleNo ? ruleSetOrRuleList.ruleNo : '';
            this.timelineList[i].ruleCollectionBasicInfo.ruleName = ruleSetOrRuleList.ruleName ? ruleSetOrRuleList.ruleName : '';
            this.timelineList[i].ruleCollectionBasicInfo.labelNames = ruleSetOrRuleList.labelNames ? ruleSetOrRuleList.labelNames : '';
            this.timelineList[i].ruleCollectionBasicInfo.enableTime = ruleSetOrRuleList.enableTime ? ruleSetOrRuleList.enableTime : '';
            this.timelineList[i].ruleCollectionBasicInfo.weights = ruleSetOrRuleList.weights ? ruleSetOrRuleList.weights : '';
            this.timelineList[i].ruleCollectionBasicInfo.invalidTime = ruleSetOrRuleList.invalidTime ? ruleSetOrRuleList.invalidTime : '';
            this.timelineList[i].ruleCollectionBasicInfo.ruleDescription = ruleSetOrRuleList.remark ? ruleSetOrRuleList.remark : '';
            this.timelineList[i].ruleCollectionBasicInfo.strategyName = ruleSetOrRuleList.strategyName ? ruleSetOrRuleList.strategyName : '';
            this.timelineList[i].ruleCollectionBasicInfo.priorityLevel = ruleSetOrRuleList.priorityLevel ? ruleSetOrRuleList.priorityLevel : '';
            this.baseTimeRuleDetails = new Date().getTime();
            this.timelineList[i].ruleJson = JSON.parse(ruleSetOrRuleList.ruleJson); // 条件逻辑关系
            this.timelineList[i].executeConfigureJson = JSON.parse(ruleSetOrRuleList.executeConfigureJson); // 执行配置
          }
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) { console.log(err); }
    },
    // 加载更多
    loadMore () {
      this.loadNumber++;
      this.setTimeDotColor();
    },
    publicArrayToText (ary, name, id) {
      let baseAry = [];
      ary.forEach(item => {
        baseAry.push(item.text);
      });
      if (name === 'organizationIdText') {
        this.operatedRuleSet.organizationIdText = baseAry.toString();
      } else if (name === 'appIdText') {
        this.operatedRuleSet.appIdText = baseAry.toString();
      } else if (name === 'transactionTypeIdText') {
        this.operatedRuleSet.transactionTypeIdText = baseAry.toString();
      }
    },
    ruleSetFun () {
      // 按钮方法
      // // 所属公司
      // item.organizationIdText = this.rulesetOrganization(item.organizationId, this.organizationList);
      // // 所属应用
      // item.appIdText = this.rulesetApplication(item.appId, this.applications);
      // // 交易类型
      // item.transactionTypeIdText = this.rulesetTradeTypes(item.transactionTypeId, this.tradeTypes);
      // // 规则集匹配模式
      // item.matchingModelText = this.filtersShowRuleMatchingModel(item.matchingModel, this.ruleMatchingModels);
      // this.$router.push(
      //   {
      //     name: 'changeLog',
      //     params: {
      //       changeItem: item
      //     }
      //   }
      // );

      // 转换信息方法
      // // 规则集匹配模式
      // filtersShowRuleMatchingModel (dataStr, ruleMatchingModels) {
      //   var ruleMatchingModelText = '';
      //   ruleMatchingModels.forEach(element => {
      //     if (dataStr === element.value) {
      //       ruleMatchingModelText = element.text;
      //     }
      //   });
      //   return ruleMatchingModelText;
      // },
      // // 规则集所属机构
      // rulesetOrganization (dataStr, OrganizationList) {
      //   if (dataStr && typeof dataStr === 'string') {
      //     dataStr = dataStr.split(',');
      //   }
      //   if (dataStr) {
      //     var organization = [];
      //     for (let i = 0; i < dataStr.length; i++) {
      //       const element = dataStr[i];
      //       let hasValue = false;
      //       for (let j = 0; j < OrganizationList.length; j++) {
      //         if (element === OrganizationList[j].id) {
      //           organization.push(OrganizationList[j].label);
      //           hasValue = true;
      //           break;
      //         }
      //       }
      //       if (hasValue) {
      //         continue;
      //       }
      //     }
      //     return organization.join('、');
      //   }
      // },
      // // 规则集所属应用
      // rulesetApplication (dataStr, ApplicationList) {
      //   if (dataStr && typeof dataStr === 'string') {
      //     dataStr = dataStr.split(',');
      //   }
      //   if (dataStr) {
      //     var Application = [];
      //     for (let i = 0; i < dataStr.length; i++) {
      //       const element = dataStr[i];
      //       let hasValue = false;
      //       for (let j = 0; j < ApplicationList.length; j++) {
      //         if (element === ApplicationList[j].id) {
      //           Application.push(ApplicationList[j].appName);
      //           hasValue = true;
      //           break;
      //         }
      //       }
      //       if (hasValue) {
      //         continue;
      //       }
      //     }
      //     return Application.join('、');
      //   }
      // },
      // // 规则集交易类型
      // rulesetTradeTypes (dataStr, tradeTypeList) {
      //   if (dataStr && typeof dataStr === 'string') {
      //     dataStr = dataStr.split(',');
      //   }
      //   if (dataStr) {
      //     var tradeType = [];
      //     for (let i = 0; i < dataStr.length; i++) {
      //       const element = dataStr[i];
      //       let hasValue = false;
      //       for (let j = 0; j < tradeTypeList.length; j++) {
      //         if (element === tradeTypeList[j].id) {
      //           tradeType.push(tradeTypeList[j].tradeName);
      //           hasValue = true;
      //           break;
      //         }
      //       }
      //       if (hasValue) {
      //         continue;
      //       }
      //     }
      //     return tradeType.join('、');
      //   }
      // },
    }
  }
};
</script>
<style lang="stylus" scoped>
  .flex {
    display: -webkit-flex; /* Safari */
    display: flex;
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
  .backColor {
    background-color: #ffffff;
  }
  .divStyle {
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
  .icon-primary {
    color: var(--v-primary-base) !important;
  }
  .el-tr-defu:hover {
    background: var(--v-tableRowHoverActive-base);
  }
  .ruleSetAddOrEdit >>> .v-input__control {
    height: auto !important;
  }
  .v-timeline {
    // right: calc(50% - 135px);
  }
  v-timeline-item .v-timeline-item__opposite {
    // max-width: calc(20% - 48px);
  }
  // 时间轴，左侧lineHeader
  .panelHeaderBackColor {
    background-color: #F2F2F2;
  }
  // 风险阈值 或 规则配置
  .basicInfoStyle, .threshold {
    padding: 0 20px;
  }
  .threshold .thresholdDiv {
    flex: left;
  }
  .threshold .flex {
    padding-bottom: 15px;
  }
  .threshold h3 {
    padding-bottom: 20px;
  }
  .threshold .numberSpan {
    display: inline-block;
    width: 60px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 17px;
  }
  .threshold .lineSpan {
    text-align: center;
    line-height: 22px;
    padding: 0 12px;
  }
  .threshold .lineSpan span {
    width: 25px;
    display: inline-block;
    border-top: 1px solid #ccc;
  }
  .threshold .textSpan {
    width: 100px;
    margin-left: 20px;
  }
  .conditionText {
    height: 40px;
    line-height: 40px;
  }
  .out-div {
    color: #FFFFFF;
    line-height: 30px;
    display: inline-block;
    height: 30px;
    margin-top: 7px;
    width: 140px;
    text-align: center;
    margin-left: 32px;
    vertical-align: top;
    background-color: var(--v-accent-darken2);
    font-size: 14px
  }

  .arrow {
    width: 0px;
    height: 0px;
    border-top: 15px solid transparent;
    border-right: 15px solid;
    border-bottom: 15px solid transparent;
    position: absolute;
    margin-left: -15px;
    margin-top: 0px;
    border-right-color: var(--v-accent-darken2);
  }

  .temp-name {
    line-height: 30px;
    height: 30px;
    margin-top: 7px;
    margin-left: 40px;
    font-size: 14px
  }
  .disaboldHover >>> .v-input__slot {
    // pointer-events: none; // 关闭hover事件
  }
  .disaboldHover {
    margin-top: 10px;
  }
  .panelHeaderBackColor .lineHeightStyle {
    line-height: 37px;
  }
  // 超出隐藏
  .textEllipsis {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .tempParamItem {
    padding-left: 40px;
    margin-top: 20px
  }
  .tempParamItem .name {
    display: inline-block;
    min-width: 180px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }

  .tempParamItem .value {
    display: inline-block;
    width: 30%;
    height: 40px;
    margin-left: 20px;
  }
  .circle {
    width: 8px;
    height: 8px;
    background: rgba(60, 140, 240, 1);
    border-radius: 4px;
    display: inline-block;
    margin-right: 10px;
    box-shadow: 2px 2px 5px rgba(60, 140, 240, 1);
  }
  .sanjiao >>> .v-input__append-inner {
    display: none;
  }
  .sanjiao >>> .v-input__slot {
    // pointer-events: none;
  }
  .v-timeline-item >>> .v-timeline-item__inner-dot {
    height: 50px;
    margin: 5px;
    width: 50px;
  }
  .v-timeline-item >>> .v-timeline-item__dot--large {
    height: 60px;
    left: calc(50% - 26px);
    width: 60px;
  }
  // 手动创建input样式
  .conditionConfig .inputStyle {
    position: relative;
    width: 100%;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.14);
    line-height: 40px;
    border-radius: 4px;
  }
  .conditionConfig .inputStyle .labelStyel {
      position: absolute;
      display: inline-block;
      padding: 0 3px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      background-color: #fff;
      top: -10px;
      left: 8px;
  }
  .conditionConfig .inputStyle > div {
    padding-left: 12px;
  }
  // 搜索条件更改padding。(因需展示完整的提示词，更改padding。)
  .amend_padding .col-xl, .col-xl-auto, .col-xl-12, .col-xl-11, .col-xl-10, .col-xl-9, .col-xl-8, .col-xl-7, .col-xl-6, .col-xl-5, .col-xl-4, .col-xl-3, .col-xl-2, .col-xl-1, .col-lg, .col-lg-auto, .col-lg-12, .col-lg-11, .col-lg-10, .col-lg-9, .col-lg-8, .col-lg-7, .col-lg-6, .col-lg-5, .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-md, .col-md-auto, .col-md-12, .col-md-11, .col-md-10, .col-md-9, .col-md-8, .col-md-7, .col-md-6, .col-md-5, .col-md-4, .col-md-3, .col-md-2, .col-md-1, .col-sm, .col-sm-auto, .col-sm-12, .col-sm-11, .col-sm-10, .col-sm-9, .col-sm-8, .col-sm-7, .col-sm-6, .col-sm-5, .col-sm-4, .col-sm-3, .col-sm-2, .col-sm-1, .col, .col-auto, .col-12, .col-11, .col-10, .col-9, .col-8, .col-7, .col-6, .col-5, .col-4, .col-3, .col-2, .col-1 {
    padding: 12px 6px;
  }
  // 删除搜索条件中自动补充的多选框的阴影。
  .amend_padding >>> .v-input__control > .v-input__slot {
    box-shadow: 0 0 0 0 !important;
  }
</style>
