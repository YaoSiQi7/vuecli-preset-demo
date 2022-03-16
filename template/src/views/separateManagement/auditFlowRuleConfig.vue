<!----------  @author: YinGuoZheng  ----------->
<!----------  @updated_at: 2020-08-20  ----------->
<!----------  @version: 2.0  ----------->

<!---- 核查效率 ----->
<template>
  <div>
    <!-- 保存取消 -->
    <v-card class="mb-3">
      <v-card-actions style="height:60px">
        <v-btn color="primary" class="ml-4" @click="confirmAddRule" v-if="hasPermission('saveAuditFlowConfigButton')">保存</v-btn>
        <v-btn class="ml-4 cancelButton" @click="cancelAddRule" outlined>取消</v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="mb-3">
      <!-- 基本信息 -->
      <v-card-text class="essential_information" :items="basicItem">
        <h3>审核流基本信息</h3>
        <div class="strategy_base_style">
          <span>审核流名称：</span>
          <span class="strategy_label_style">{{ basicItem.name }}</span>
        </div>
        <div class="strategy_base_style">
          <span>处理方式：</span>
          <span class="strategy_label_style">{{ basicItem.resultType | treatmentMethod() }}</span>
        </div>
        <div class="strategy_base_style">
          <span>指派方式：</span>
          <span class="strategy_label_style">{{ basicItem.assignType | assignmentMethod() }}</span>
        </div>
        <div class="strategy_base_style">
          <span>审核流类型：</span>
          <span class="strategy_label_style">{{ basicItem.auditType | auditFlowType() }}</span>
        </div>
        <div class="strategy_base_style">
          <span>优先级：</span>
          <span class="strategy_label_style">{{ basicItem.priority }}</span>
        </div>
      </v-card-text>
      <!-- 规则配置(label+addBtn) -->
      <v-card-text style="padding:0 16px">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom:20px">规则配置</h3>
              <div>
                <v-btn
                  color="primary"
                  class="ma-2 white--text"
                  @click="selectSettingType(0)"
                >
                  <v-icon left>add</v-icon>
                  新增条件
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <!-- 规则配置条件 -->
      <v-card-text v-show="operateRule.strategy.strategyInfoList && operateRule.strategy.strategyInfoList.length" style="padding-top:0">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-expansion-panels multiple accordion focusable  v-model="panel">
                <v-expansion-panel
                  v-for="(operateItem,operateIndex) in operateRule.strategy.strategyInfoList"
                  :key="'operateItem'+operateIndex"
                >
                  <v-expansion-panel-header>
                    <template>
                      <v-row>
                        <div class='logic-title'>
                          条件{{ String.fromCharCode(64 + parseInt(operateIndex + 1)) }}
                          <v-icon
                            style="margin-left:10px"
                            size="30"
                            color="primary"
                            @click.stop="delcondition(operateIndex)"
                          >mdi-delete
                          </v-icon>
                        </div>
                        <v-divider
                          class="mx-4"
                          vertical
                        ></v-divider>
                        <div style="width:40%">
                          <v-text-field
                            v-model.trim="operateItem.strategyDes"
                            outlined
                            dense
                            clearable
                            type="text"
                            placeholder="请输入条件描述"
                            :rules="strategyDescRule"
                          ></v-text-field>
                        </div>
                        <div class="temp-name" v-if="operateItem.settingType===0">
                          所属模板：{{operateItem.strategyItems[0].fieldText}}
                        </div>
                      </v-row>
                    </template>
                  </v-expansion-panel-header>
                  <!-- 条件配置规则 -->
                  <v-expansion-panel-content v-if="operateItem.settingType===1">
                    <v-list class="clear rule-condition" style="margin-left:0">
                      <div
                        v-for="(item, index) in operateItem.strategyItems"
                        :key="index"
                        class="clear rule-condition-item"
                      >
                        <div class="fl value">
                          <v-select
                            v-model="item.fieldValue"
                            placeholder="条件因子"
                            :items="variableFields"
                            item-text="fieldName"
                            item-value="fieldValue"
                            :rules="[v => !!v || '不能为空或只有空格']"
                            outlined
                            dense
                            @change="variableChange(item)"
                            no-data-text="没有数据"
                          />
                        </div>
                        <div class="fl comp">
                          <v-select
                            v-model="item.operatorValue"
                            :items="operator"
                            item-text="compName"
                            item-value="compValue"
                            placeholder="符号"
                            :rules="[v => !!v || '不能为空或只有空格']"
                            outlined
                            dense
                            :disabled="item.fieldSource==='LIST_LIB'"
                            no-data-text="没有数据"
                          />
                        </div>
                        <div class="fl value">
                          <div v-if="item.fieldValue === 'receive_time'">
                            <v-text-field
                              placeholder="時分秒"
                              outlined
                              dense
                              v-model="item.resultText"
                              append-icon="event"
                              :rules="[v => !!v || '不能为空或只有空格']"
                              @click="isdateShow = true"
                            ></v-text-field>
                            <v-dialog v-model="isdateShow" width="321">
                              <v-time-picker
                                v-model="item.resultText"
                                use-seconds
                                selected-items-text="已选择日期"
                                range
                                @change="dateChange"
                              ></v-time-picker>
                            </v-dialog>
                          </div>
                          <div v-else>
                            <v-select
                              v-model="item.resultValue"
                              placeholder="阈值"
                              :items="item.sysParamsItems"
                              item-text="paramName"
                              item-value="paramValue"
                              :rules="[v => !!v || '不能为空或只有空格']"
                              outlined
                              dense
                              no-data-text="没有数据"
                            />
                          </div>
                        </div>
                        <div  class="fl relation">
                          <v-select
                            v-show="operateItem.strategyItems.length > 1 && index !== operateItem.strategyItems.length-1 "
                            v-model="item.strategyItemRelation"
                            :items="strategyItemRelations"
                            item-text="text"
                            item-value="value"
                            outlined
                            dense
                            no-data-text="没有数据"
                          />
                        </div>
                        <div class="fr add-del">
                          <v-icon
                            size="30"
                            color="primary"
                            style="height:40px;float:left"
                            @click.stop="delOperateItems(operateIndex,index)"
                            v-show="operateItem.strategyItems.length > 1 "
                          >mdi-delete
                          </v-icon>
                          <v-icon
                            color="primary"
                            style="height:40px;float:left"
                            @click="addOperateItems(operateIndex,index)"
                          >mdi-plus-circle
                          </v-icon>
                        </div>
                      </div>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <v-card class="mb-3">
      <!--条件逻辑关系 -->
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom:20px">条件逻辑关系</h3>
              <div class="logicalRelationship">
                <v-radio-group
                  v-model="operateRule.strategy.logicalRelationship"
                  style="float:left"
                  row
                >
                  <v-radio
                    v-for="(item,index) in logicalRelationship"
                    :key="'logicalRelationship'+index"
                    :label="item.label"
                    :value="item.value"
                    color="primary"
                  />
                </v-radio-group>
              </div>

              <div class="logicalRelationshipReview">
                <v-row v-if="operateRule.strategy.logicalRelationship==='random'">
                  <div class="fl" style="margin-left: 10px;">自定义规则条件逻辑关系:</div>
                  <div class="fl" style="margin-left:20px">
                    <v-text-field
                      v-model.trim="operateRule.strategy.customizeLogicalRelation"
                      placeholder="请输入逻辑关系"
                      outlined
                      dense
                      type="text"
                    ></v-text-field>
                    <div class="pt-4">
                      使用条件序号加上（）、且、或， 来拼接表达式，例如（条件A且条件B且条件C）或条件D。括号内不支持且和或同时存在
                    </div>
                  </div>
                </v-row>
                <v-row v-else style="margin-left:0px">
                  <div style='height:40px;line-height:40px'>动态预览规则条件逻辑关系:</div>
                  <div
                    v-for="(operateItem,operateIndex) in operateRule.strategy.strategyInfoList"
                    :key="operateIndex"
                  >
                    <span style="display: inline-block;color: var(--v-primary-base);height: 40px;margin-left: 5px;line-height: 40px;">
                      条件{{ String.fromCharCode(64 + parseInt(operateIndex + 1)) }}
                    </span>
                    <span
                      style="margin-left: 5px;color: var(--v-primary-base);"
                      v-if="operateRule.strategy.logicalRelationship === 'and' && operateIndex !== operateRule.strategy.strategyInfoList.length-1"
                    >
                      且
                    </span>
                    <span style="margin-left: 5px;color: var(--v-primary-base);"
                      v-if="operateRule.strategy.logicalRelationship === 'or' && operateIndex !== operateRule.strategy.strategyInfoList.length-1"
                    >
                      或
                    </span>
                  </div>
                </v-row>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
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
import { getList, getSelectDataList, deleteItem, editItem } from '../../api/auditFlowRuleConfig.js';
import { getFieldNameList } from '../../api/SystemParamLib.js';
import BaseSearch from '@c/BaseSearch';
import DelDialog from '@/components/DelDialog';
import * as dataService from 'api/caseManagementCenter/caseReport.js';
import { getSearchData } from '@/utils/generalDataTableHeaders';
import { NO_SPACE_RISK, NO_SPACE_TEXT } from 'utils/validate.js';
import moment from 'moment';
let that;
export default {
  name: 'caseReport',
  components: {
    // DelDialog
  },
  data: () => ({
    // 日期
    isdateShow: false,
    resultText: [],
    newDate: null,
    picker: null,
    // 基本信息
    basicItem: [],
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    panel: [0, 1, 2, 3, 4, 5, 6, 7],
    // 条件
    operateRule: {
      strategy: {
        strategyInfoList: [],
        logicalRelationship: 'and',
        customizeLogicalRelation: ''
      }
    },
    variableFields: [],
    operator: [],
    chips: true,
    strategyItemRelations: [
      { value: '&&', text: '且' },
      { value: '||', text: '或' }
    ],
    logicalRelationship: [
      { value: 'and', label: '满足以下全部条件' },
      { value: 'or', label: '满足以下任意条件' }
      // { value: 'random', label: '自定义' }
    ],
    strategyDescRule: [
      v => !!v || '不能为空或只有空格',
      v => (v && v.length <= 50) || '最大50字符',
      v => NO_SPACE_RISK.test(v) || NO_SPACE_TEXT
    ],
    // 缓存下拉框数据
    cacheSelects: [],
    resultTypeData: [], // 处理方式下拉数据
    assignTypeData: [], // 指派方式下拉数据
    auditTypeData: [] // 审核流类型下拉数据
  }),
  filters: {
    // 处理方式
    treatmentMethod: function (str) {
      let dataTypeText;
      that.resultTypeData.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.paramValue === str) {
          dataTypeText = item.paramName;
        }
      });
      return dataTypeText;
    },
    // 指派方式
    assignmentMethod: function (str) {
      let dataTypeText;
      that.assignTypeData.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.paramValue === str) {
          dataTypeText = item.paramName;
        }
      });
      return dataTypeText;
    },
    // 审核流类型
    auditFlowType: function (str) {
      let dataTypeText;
      that.auditTypeData.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.paramValue === str) {
          dataTypeText = item.paramName;
        }
      });
      return dataTypeText;
    }
  },
  beforeCreate: function () {
    that = this;
  },
  computed: {
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        Promise.all([
          this.getDataList()
        ]);
      }
    }
  },
  created () {
    this.getList();
    this.getSelectDataList();
    this.gitResultTypeData();
    this.gitAssignTypeData();
    this.gitAuditTypeData();
  },
  methods: {
    // 获取处理方式
    gitResultTypeData () {
      const parms = {
        identifier: 'case_action_type'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res.data.data);
            // 缓存
            this.resultTypeData = res.data.data;
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.msg);
        });
    },
    // 获取指派方式
    gitAssignTypeData () {
      const parms = {
        identifier: 'case_assign'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            console.log(res.data.data);
            // 缓存
            this.assignTypeData = res.data.data;
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.msg);
        });
    },
    // 获取审核流类型
    gitAuditTypeData () {
      const parms = {
        identifier: 'case_check_type'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res.data.data);
            // 缓存
            this.auditTypeData = res.data.data;
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.msg);
        });
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 选择时间的弹框
    dateChange () {
      this.isdateShow = false;
    },
    // 下拉框数据
    getSelectDataList () {
      getSelectDataList()
        .then(res => {
          if (res.data.code === 200) {
            console.log(res.data.data);
            res.data.data.forEach((value, key, arr) => {
              this.variableFields.push({
                fieldName: value.fieldText,
                fieldValue: value.fieldValue
              });
              // console.log(value)
              // console.log(key)
              // console.log(arr)
            });
            res.data.data[0].operator.forEach((value, key, arr) => {
              this.operator.push({
                compName: value.compName,
                compValue: value.compValue
              });
            });
            this.cacheSelects = res.data.data;
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.msg);
        });
    },
    // 查询列表
    getList () {
      let pageParms = {
        id: this.$route.params.indexId
      };
      let parms = Object.assign({}, pageParms);
      getList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res);
            // console.log(JSON.parse(res.data.data.list[0].strategy));
            if (res.data.data.list[0].strategy !== null) {
              // 编辑情况
              this.basicItem = res.data.data.list[0];
              this.operateRule = JSON.parse(res.data.data.list[0].strategy);
            } else {
              // 新增情况
              this.basicItem = res.data.data.list[0];
            }
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.msg);
        });
    },
    // 新增条件
    selectSettingType () {
      // console.log('新增...');
      this.operateRule.strategy.strategyInfoList.push({
        settingType: 1, // 所属模板
        filterSign: '', // 条件A-B...
        strategyDes: '', // 条件说明
        strategyItems: [
          {
            fieldValue: '',
            fieldText: '',
            operatorValue: '',
            operatorText: '',
            resultSource: 'SELECT',
            resultValue: '',
            strategyItemRelation: '&&',
            resultText: '',
            resultType: 'String',
            sysParamsItems: [],
            fieldSource: 'BUSINESS_VAR'
          }
        ]
      });
    },
    // 删除条件
    delcondition (operateIndex) {
      this.operateRule.strategy.strategyInfoList.splice(operateIndex, 1);
      // console.log('删除条件按钮');
    },
    // 新增条件第一个select---change事件
    variableChange (items) {
      // console.log(items)
      // console.log(this.cacheSelects)
      this.cacheSelects.forEach((value, key, arr) => {
        // console.log(value)
        if (value.fieldValue === items.fieldValue) {
          items.sysParamsItems = value.sysParamsList;
        }
      });
    },
    // 增加一行规则条件item
    addOperateItems (operateIndex, index) {
      this.operateRule.strategy.strategyInfoList[operateIndex].strategyItems.splice(index + 1, 0, {
        fieldValue: '',
        fieldText: '',
        operatorValue: '',
        operatorText: '',
        resultSource: 'SELECT',
        resultValue: '',
        strategyItemRelation: '&&',
        resultText: '',
        resultType: 'String',
        sysParamsItems: [],
        fieldSource: 'BUSINESS_VAR'
      });
    },
    // 删除一行规则条件item
    delOperateItems (operateIndex, index) {
      let strategyItems = this.operateRule.strategy.strategyInfoList[operateIndex].strategyItems;
      if (strategyItems.length <= 1) {
        return;
      }
      strategyItems.splice(index, 1);
    },
    // 取消
    cancelAddRule () {
      this.$router.push('/auditFlowConfig');
    },
    // 保存
    confirmAddRule () {
      this.operateRule.strategy.strategyInfoList.forEach((item, index, arr) => {
        item.filterSign = String.fromCharCode(64 + parseInt(index + 1));
      });
      // console.log(this.operateRule)
      // console.log(this.$route.params.indexId)
      // 条件逻辑关系--自定义
      let strategys = this.operateRule.strategy;
      if (strategys.logicalRelationship === 'random' && strategys.customizeLogicalRelation === '') {
        this.message('逻辑关系不能为空');
        return;
      }
      for (let i = 0; i < strategys.strategyInfoList.length; i++) {
        if (strategys.strategyInfoList[i].strategyDes === '') {
          this.message('条件描述不能为空');
          return;
        }
        for (let k = 0; k < strategys.strategyInfoList[i].strategyItems.length; k++) {
          if (strategys.strategyInfoList[i].strategyItems[k].fieldValue === '') {
            this.message('条件因子不能为空');
            return;
          }
          if (strategys.strategyInfoList[i].strategyItems[k].operatorValue === '') {
            this.message('符号不能为空');
            return;
          }
          if (strategys.strategyInfoList[i].strategyItems[k].fieldValue === 'receive_time' && strategys.strategyInfoList[i].strategyItems[k].resultText === '') {
            this.message('时间不能为空');
            return;
          }
          if (strategys.strategyInfoList[i].strategyItems[k].fieldValue !== 'receive_time' && strategys.strategyInfoList[i].strategyItems[k].resultValue === '') {
            this.message('阈值不能为空');
            return;
          }
        }
      }
      let params = {
        id: this.$route.params.indexId,
        strategy: JSON.stringify(this.operateRule)
      };
      editItem(params).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.message(res.data.msg, 'success');
          const TIME_COUNT = 3;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.show = false;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                this.show = true;
                clearInterval(this.timer);
                this.timer = null;
                this.$router.push('/auditFlowConfig');
              }
            }, 500);
          }
        } else {
          this.message(res.data.msg);
        }
      })
        .catch(err => {
          this.message(err.msg);
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
  .v-input--selection-controls {
    padding-left: 10px;
  }
  .clear:after {
    content: '\20';
    display: block;
    height: 0;
    clear: both;
  }
  .essential_information {
    padding-left: 32px;
    padding-bottom:0;
  }
  .strategy_base_style {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    padding-right: 30px;
  }
  .strategy_label_style {
    min-width: 50px;
    display: inline-block;
  }
  .logic-title {
    width: 100px !important;
    height: 40px !important;
    line-height: 40px !important;
    font-size: 18px !important;
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
  .fl{
    float:left
  }
  .lib .v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default{
    height:40px;
    line-height:40px
  }
  .rule-condition-item{
    display: block;
    padding:10px
  }
  .rule-condition .value{
    width:48%;
    margin-left:1%
  }
  .rule-condition .comp{
    margin-left:1%;
    width:15%
  }
  .rule-condition .result{
    margin-left:1%;
    width:10%
  }
  .rule-condition .relation{
    margin-left:1%;
    width:5%
  }
  .rule-condition .add-del{
    margin-left:1%;
    width:5%
  }
  // 宽度1280以下
  @media all and (max-width: 1280px) {
  .rule-condition .value{
      width:25%;
    }
    .rule-condition .relation{
    width:8%
    }
  .rule-condition .add-del{
    width:8%;
    margin-left:1%;
    }
  }
  // 宽度1280和1360之间
  @media all and (min-width: 1280px) and (max-width: 1360px) {
    .rule-condition .value{
      width:28%;
    }
    .rule-condition .relation{
    width:8%
    }
  .rule-condition .add-del{
    width:6%;
    margin-left:1%;

    }
  }
  // 宽度1360和1680之间
  @media all and (min-width: 1360px) and (max-width: 1680px) {
  .rule-condition .value{
      width:31%;
    }
    .rule-condition .relation{
    width:8%
    }
  .rule-condition .add-del{
    width:6%;
    margin-left:1%;
    }
    .rule-condition .comp{
    width:14%
  }
  }
  // 宽度1680和1920之间
  @media all and (min-width: 1680px) and (max-width: 1920px) {
  .rule-condition .value{
      // width:42%;
      width:31%;
    }
    .rule-condition .relation{
    width:8%
    }
  .rule-condition .add-del{
    width:6%;
    margin-left:1%;
    }
  .rule-condition .comp{
    width:9%
  }
  }
  //宽度大于1920
  @media all and (min-width: 1920px) {
  .rule-condition .value{
      // width:45%;
      width:31%;
    }
    .rule-condition .comp{
    width:9%
  }
  }
  .fr{
    float:right
  }
  .container_checkbox {
    max-width: 25%;
    display: inline-block;
  }
  .v-list-item-obj {
    min-height: 30px;
    line-height: 30px;
  }
  .v-list-item-checkbox {
    margin: 0;
    padding: 0 10px 0 0;
    display: inline-block;
  }
  .v-list-item-p {
    margin: 0;
    font-weight: bold;
  }
</style>
