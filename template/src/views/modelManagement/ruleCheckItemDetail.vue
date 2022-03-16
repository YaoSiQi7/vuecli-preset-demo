<template>
  <div class="rules-content">
    <!-- 保存取消 -->
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3',isFixed?'fixed':'']">
      <v-card-actions style="height:60px">
        <!-- <v-btn color="primary" class="ml-4" @click="confirmAddRule" :disabled="!ruleValid">保存</v-btn> -->
        <v-btn class="ml-4 cancelButton" @click="cancelAddRule" outlined>返回</v-btn>
      </v-card-actions>
    </v-card>
    </div>
    <!-- 规则基本信息 -->
    <v-card class="mb-3">
      <v-card-text style="padding-bottom:0">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom:20px">规则基本信息</h3>
              <v-form ref="ruleForm" v-model="ruleValid" lazy-validation>
                <div>
                  <v-row>
                    <div class="ruleCheck-info-item-one">
                      <div  class="middle-align">规则编号：</div>
                      <p class="middle-align">{{operateRule.ruleNo}}</p>
                    </div>
                    <div class="ruleCheck-info-item-one">
                      <div  class="middle-align"> 规则名称：</div>
                       <p class="rule-info-text">{{operateRule.ruleName}}</p>
                    </div>
                    <div class="ruleCheck-info-item-one">
                      <div  class="middle-align"> 标签：</div>
                      <p class="rule-info-text">{{ operateRule.labelId|filtersRiskyLabel(riskyLabels) }}</p>
                    </div>
                  </v-row>
                  <v-row>
                    <div class="ruleCheck-info-item-one" v-show="operatedRuleSet.matchingModel !=='SCORE_MATCH'">
                      <div style="float:left" class="middle-align">处置策略：</div>
                      <p class="rule-info-text">{{ operateRule.strategy|filtersStrategies(strategies) }}</p>
                    </div>
                    <div class="ruleCheck-info-item-one" v-show="operatedRuleSet.matchingModel ==='SCORE_MATCH'">
                      <div  class="middle-align"> 权重：</div>
                      <p class="rule-info-text">{{operateRule.weights}}</p>
                    </div>
                    <div class="ruleCheck-info-item-one">
                      <div  class="middle-align"> 启用时间：</div>
                      <p class="rule-info-text">{{operateRule.enableTime}}</p>
                    </div>
                    <div class="ruleCheck-info-item-one">
                      <div class="middle-align"> 失效时间：</div>
                       <p class="rule-info-text">{{operateRule.invalidTime}}</p>
                    </div>
                  </v-row>
                  <v-row>
                    <div class="ruleCheck-info-item-one" v-show="operatedRuleSet.matchingModel !=='SCORE_MATCH'">
                      <div class="middle-align">优先级：</div>
                      <p class="rule-info-text">{{operateRule.priorityLevel}}</p>
                   </div>
                    <div class="ruleCheck-info-item-one">
                      <div style="float:left" class="middle-align">规则描述：</div>
                      <p  class="rule-info-text">{{operateRule.comment}}</p>
                    </div>
                  </v-row>
                </div>
              </v-form>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <!-- 配置 -->
    <v-card class="mb-3">
      <v-card-text style="padding-bottom:0">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom:20px">规则配置</h3>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-text v-show="operateRule.ruleJson.conditionList && operateRule.ruleJson.conditionList.length"  style="padding-top:0">
         <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-expansion-panels multiple accordion focusable  v-model="panel">
              <v-expansion-panel
                v-for="(operateItem,operateIndex) in operateRule.ruleJson.conditionList"
                :key="'operateItem'+operateIndex"
              >
                <v-expansion-panel-header>
                  <template>
                    <v-row>
                      <div class='logic-title'>
                        条件{{ String.fromCharCode(64 + parseInt(operateIndex + 1)) }}
                      </div>
                      <v-divider
                        class="mx-4"
                        vertical
                      ></v-divider>
                      <div style="width:60%">
                        <p class="rule-info-text">{{operateItem.conditionDes}}</p>
                      </div>
                      <div class="out-div">
                        <div class="arrow"></div>
                        <span v-show="operateItem.settingType===1">类别：配置条件</span>
                        <span v-show="operateItem.settingType===0">类别：模板条件</span>
                      </div>

                    </v-row>
                  </template>

                </v-expansion-panel-header>
                <!--模板名称-->
                 <div class="temp-name" v-if="operateItem.settingType===0">
                        所属模板：{{operateItem.conditionItems[0].fieldText}}
                  </div>
                <!-- 模板配置规则 -->
                <v-expansion-panel-content v-if="operateItem.settingType===0">

                  <div class="tempParamItems">
                    <div
                      class="tempParamItem"
                      v-for="(item, index) in operateItem.conditionItems[0].parameters"
                      :key="index"
                    >
                      <span class="circle"></span>
                      <span class="name">{{item.cnName}}</span>
                      <span class="value">
                            <v-autocomplete
                              v-if="item.src==='select'"
                              :items="item.valueList"
                              item-text="label"
                              item-value="id"
                              placeholder="请选择"
                              no-data-text="没有匹配数据"
                              outlined
                              dense
                              v-model="item.value.value"
                              @change="ruleTempParamChange(operateIndex,index,item)"
                            />
                            <v-text-field
                              v-if="item.src==='input'"
                              style="disply:inline"
                              placeholder="请输入"
                              outlined
                              dense
                              v-model="item.value.value"
                            />
                          </span>
                      <span class="questionMark">
                            <v-tooltip right>
                              <template v-slot:activator="{ on }">
                                <v-icon
                                  class="mr-1"
                                  color="primary"
                                  v-on="on"
                                  size="20"
                                >mdi-help-circle</v-icon>
                              </template>
                              <span>{{item.description || '无说明'}}</span>
                            </v-tooltip>
                          </span>
                    </div>
                  </div>
                </v-expansion-panel-content>
                <!-- 条件配置规则 -->
                <v-expansion-panel-content v-if="operateItem.settingType===1">
                  <v-list class="clear rule-condition" style="margin-left:0">
                    <div
                      v-for="(item,index) in operateItem.conditionItems"
                      :key="'operateItem'+index"
                      class="clear rule-condition-item"
                    >
                      <!-- <div class="fl lib">
                        <v-btn-toggle
                          color="primary"
                          v-model="item.fieldSource"
                          @change="toggleButton(operateIndex,index)"
                        >

                          <v-btn value="BUSINESS_VAR">业务变量库</v-btn>
                          <v-btn value="CALCULATION_VAR">计算指标库</v-btn>
                          <v-btn value="LIST_LIB">名单库</v-btn>
                        </v-btn-toggle>
                      </div> -->
                        <div class="fl value" v-show="item.fieldSource === 'BUSINESS_VAR'">
                          <v-autocomplete
                            v-model="item.fieldValue"
                            v-show="item.fieldSource === 'BUSINESS_VAR'"
                            label="业务变量库"
                            :items="variableFields"
                            item-text="fieldName"
                            item-value="fieldValue"
                            outlined
                            disabled
                            no-data-text="没有数据"
                            :menu-props="{auto: true, overflowY: true}"
                          />
                        </div>
                         <div class="fl value" v-show="item.fieldSource === 'CALCULATION_VAR'">
                          <v-autocomplete
                            v-model="item.fieldValue"
                            label="计算指标库"
                            :items="indicators"
                            item-text="indicName"
                            item-value="id"
                            outlined
                            disabled

                            no-data-text="没有数据"
                            :menu-props="{auto: true, overflowY: true}"
                          />
                         </div>
                          <div class="fl value" v-show="item.fieldSource === 'LIST_LIB'">
                          <v-autocomplete
                            label="名单库"
                            v-model="item.fieldValue"
                            :items="libraryList"
                            item-text="listName"
                            item-value="id"
                            outlined
                            disabled
                            dense
                            no-data-text="没有数据"
                            :menu-props="{auto: true, overflowY: true}"
                          />
                        </div>
                         <!-- :disabled="item.fieldSource==='LIST_LIB'"
                            -->

                        <div class="fl comp">
                          <v-autocomplete
                            v-model="item.operatorValue"
                            :items="item.operatorList"
                            item-text="compName"
                            item-value="compValue"
                            outlined
                            disabled
                            dense
                            no-data-text="没有数据"
                            :menu-props="{auto: true, overflowY: true}"
                          />
                        </div>
                        <div class="fl result">
                         <v-combobox
                             v-if="(item.fieldSource ==='BUSINESS_VAR' && item.isFieldEnumeration!=='1') || item.fieldSource ==='CALCULATION_VAR'"
                              v-model.trim="item.resultValue"
                              :items="item.resultList"
                              item-text="fieldName"
                              item-value="fieldValue"
                              no-data-text="没有数据"
                              disabled
                              outlined
                              dense
                              :menu-props="{auto: true, overflowY: true}"
                            ></v-combobox>
                          <v-autocomplete
                            v-if="item.fieldSource==='BUSINESS_VAR' && item.isFieldEnumeration==='1'"
                            v-model.trim="item.resultValue"
                            :items="item.resultList"
                            item-text="fieldName"
                            item-value="fieldValue"
                            label="枚举值"
                            disabled
                            outlined
                            dense

                            no-data-text="没有数据"
                            :menu-props="{auto: true, overflowY: true}"
                          />
                          <v-autocomplete
                            v-if="item.fieldSource==='LIST_LIB'"
                            v-model="item.resultValue"
                            :items="libraryListResults"
                            item-text="text"
                            item-value="value"
                            outlined
                            disabled
                            dense
                            label="枚举值"
                            no-data-text="没有数据"
                            :menu-props="{auto: true, overflowY: true}"
                          />
                        </div>
                         <div  class="fl relation">
                           <v-autocomplete
                             v-show="operateItem.conditionItems.length > 1 && index !== operateItem.conditionItems.length-1 "
                             v-model="item.conditionItemRelation"
                             :items="conditionItemRelations"
                             item-text="text"
                             item-value="value"
                             outlined
                             dense
                             disabled
                             no-data-text="没有数据"
                             :menu-props="{auto: true, overflowY: true}"
                           />
                        </div>
                        <!-- <div class="fr add-del">
                          <v-icon
                            size="30"
                            color="primary"
                            style="height:40px;float:left"
                            @click.stop="delOperateItems(operateIndex,index)"
                            v-show="operateItem.conditionItems.length > 1 "
                          >mdi-delete
                          </v-icon>
                          <v-icon
                            color="primary"
                            style="height:40px;float:left"
                            @click="addOperateItems(operateIndex,index)"
                          >mdi-plus-circle
                          </v-icon>
                        </div> -->
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
    <!--条件逻辑关系 -->
    <v-card class="mb-3">
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom:20px">条件逻辑关系</h3>
              <div class="logicalRelationship"   v-for="(item,index) in logicalRelationship" :key="'logicalRelationship'+index">
              <!-- {{operateRule.ruleJson.logicalRelationship}} -->

                <span v-if="item.value === operateRule.ruleJson.logicalRelationship">{{item.label}}</span>
                <!-- <v-radio-group
                  v-model="operateRule.ruleJson.logicalRelationship"
                  style="float:left"
                  row
                >
               {{logicalRelationship}}
                  <v-radio
                    v-for="(item,index) in logicalRelationship"
                    :key="'logicalRelationship'+index"
                    :label="item.label"
                    :value="item.value"
                    color="primary"
                  />
                </v-radio-group> -->

              </div>

              <div class="logicalRelationshipReview">
                <v-row v-if="operateRule.ruleJson.logicalRelationship==='random'">
                  <div class="fl" style="margin-left: 10px;">自定义规则条件逻辑关系:</div>
                  <div class="fl" style="margin-left:20px">
                    <v-text-field
                      v-model.trim="operateRule.ruleJson.customizeLogicalRelation"
                      placeholder="请输入逻辑关系"
                      outlined
                      dense
                      type="text"
                    ></v-text-field>

                    <div class="pt-4">使用条件序号加上（）、且、或， 来拼接表达式，例如（A且B且C）或D。括号内不支持且和或同时存在</div>
                  </div>
                </v-row>
                <v-row v-else style="margin-left:0px">
                  <div style='height:40px;line-height:40px'>动态预览规则条件逻辑关系:</div>
                  <div
                    v-for="(operateItem,operateIndex) in operateRule.ruleJson.conditionList"
                    :key="operateIndex"
                  >
                          <span
                            style="display: inline-block;color: var(--v-primary-base);height: 40px;margin-left: 5px;line-height: 40px;"
                          >条件{{ String.fromCharCode(64 + parseInt(operateIndex + 1)) }}</span>
                    <span
                      style="margin-left: 5px;color: var(--v-primary-base);"
                      v-if="operateRule.ruleJson.logicalRelationship==='and' && operateIndex!==operateRule.ruleJson.conditionList.length-1"
                    >且</span>
                    <span
                      style="margin-left: 5px;color: var(--v-primary-base);"
                      v-if="operateRule.ruleJson.logicalRelationship==='or' && operateIndex!==operateRule.ruleJson.conditionList.length-1"
                    >或</span>
                  </div>
                </v-row>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <!-- 调接口结果的提示框 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >{{ snackbarServeMsg }}
    </v-snackbar>
    <!-- 模板添加规则的弹窗 -->
    <v-dialog v-model="tempRuleDialog" persistent width="800">
      <v-card>
        <v-card-title class="justify-left">
          <v-toolbar-title>选择模板</v-toolbar-title>
          <div class="flex-grow-1"/>
          <v-btn icon>
            <v-icon @click="cancelRuleTemp">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="padding: 0;overflow: hidden;">
          <v-row  style="margin: 0;">
            <v-col cols="4" class="group-temp" id="calculateIndexDetails_tempGroup" style="background-color: var(--v-tableRowHoverActive-base);border-bottom: 1px solid rgba(0, 0, 0, 0.12);border-right: 1px solid rgba(0, 0, 0, 0.12);padding-top: 11px;padding-right: 0;">
                <v-card-title  class="calculateIndexDetails_searchIcon" style="padding: 0 36px 0 4px;">
                  <v-text-field
                    v-model="searchForTempGroup"
                    append-icon="mdi-magnify"
                    placeholder="请输入模板类别"
                    hide-details
                    dense
                  />
                </v-card-title>
                <v-data-table
                  :headers="tempGroupHeader"
                  :search="searchForTempGroup"
                  :items="tempGroupItem"
                  hide-default-footer
                  :items-per-page="1000"
                  no-results-text="没有匹配的数据"
                  style="background-color: var(--v-tableRowHoverActive-base);padding-left: 9px;"
                >
                  <template v-slot:body="{ items }">
                    <tr
                      v-for="(item, index) in items"
                      :key="index"
                      class="tempGroupTableTr el-tr-defu"
                      :class="{activeUserDef:index == activeGroup}"
                      @click="tempGroupClick(item,index)"
                    >
                      <td class="el-border-defu" style="font-weight: bold;border: 0;">
                        {{ item.templateGroupName }}
                        </td>
                    </tr>
                  </template>
                </v-data-table>
            </v-col>
            <v-col cols="8" id="temps" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12);padding: 11px 0px 12px 10px;">
                <v-card-title class="calculateIndexDetails_searchIcon" style="width: 213.66px;padding: 0;margin-left: 10px; padding-bottom:8px">
                  <v-text-field
                    v-model="searchForTemp"
                    append-icon="mdi-magnify"
                    label="请输入模板名称"
                    hide-details
                    outlined
                    dense
                  />
                </v-card-title>
                <div style="margin-left:10px;border-top: 1px solid #EDEDED;margin-right: 20px;"></div>
                <v-radio-group v-model="tempId">
                <v-radio
                  v-for="(item, index) in searchTemps"
                  :label="item.templateName"
                  :key="index"
                  color="primary"
                  :value="item.id"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"/>
          <v-btn style="mr-5" @click="cancelRuleTemp()">取消</v-btn>
          <v-btn color="primary" class="mr-5" @click="saveRuleTemp()">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
<script>
import * as dataService from 'api/ruleSet';
import { getList, getListTmp, getTmpListValue, getTmpPraList } from '../../api/ruleTempLib.js';
import delDialog from '@c/DelDialog';
// import DatetimePicker from '@c/DateTimePicker';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'ruleSet',
  components: {
    // DatetimePicker
  },
  filters: {
    // 处置策略
    filtersStrategies: function (dataStr, strategies) {
      var strategy = '';
      strategies.forEach(element => {
        if (dataStr === element.id) {
          strategy = element.paramName;
        }
      });

      return strategy;
    },
    // 风险标签
    filtersRiskyLabel: function (dataStr, riskyLabels) {
      if (typeof dataStr === 'string' && dataStr) {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var RiskyLabel = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < riskyLabels.length; j++) {
            if (element === riskyLabels[j].id) {
              RiskyLabel.push(riskyLabels[j].paramName);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return RiskyLabel.join('、');
      }
    }
  },
  data () {
    return {
      isFixed: false,
      panel: [0, 1, 2, 3, 4, 5, 6, 7],
      operatedRuleSet: null,
      operatedRules: [],
      // 删除弹窗
      configRuleDialog: false,
      ruleNoRule: [
        v => /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/.test(v) || '不能包含特殊字符'
      ],
      ruleNameRule: [v => !!v || '不能为空或只有空格', v => !/^\s/.test(v) || '不能为空',
        v => (v && v.length <= 200) || '最多只能输入200个字符'
      ],
      weightRule: [
        v => !!v || '不能为空',
        v => !/^\s/.test(v) || '不能为空',
        v => /^[+]{0,1}(\d+)$/.test(v) || '必须为正整数'
      ],
      conditionDescRule: [
        v => (v.length <= 100) || '最多只能输入100个字符'
      ],
      labelRules: [
        v => {
          if (v) {
            return v.length <= 10 || '最多选择10个标签';
          }
          return true;
        }
      ],
      confirmDelFun: '',
      ruleValid: true,
      RuleConditionItemValid: true,
      snackbar: false,
      timeout: 2000,
      isSnackbarTop: true,
      chips: true,
      // 被操作的规则
      operateRule: {
        ruleNo: '',
        ruleName: '',
        versionId: '',
        label: '',
        strategy: '', // 匹配模式
        enableTime: '',
        invalidTime: '',
        priorityLevel: '', // 匹配模式
        states: '',
        descption: '',
        weights: '', // 评分模式
        ruleJson: {
          logicalRelationship: 'and',
          // 条件列表
          conditionList: []
        }
      },
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      conditionItemRelations: [
        { value: '&&', text: '且' },
        { value: '||', text: '或' }
      ],
      dateProps: {
        headerColor: 'primary'
      },
      timeProps: {
        useSeconds: true,
        ampmInTitle: true
      },
      textFieldProps: {
        appendIcon: 'event'
      },
      // 区分开始时间和结束时间 1是开始时间 2是结束时间
      dateTypeStart: 1,
      dateTypeEnd: 2,
      // 当前规则所在规则集版本
      currentVersion: '1',
      // 当前版本规则集是否被引用
      isReferenced: false,
      // 当前版本ID
      versionId: '',
      ruleSettingType: '',
      // 规则编辑之前旧的规则 编辑前后的规则要进行判断，被引用的时候如果规则前后有变化要生成新的版本的规则集
      oldRuleJson: '',
      // 如果是评分模式的 编辑之前旧的阈值
      oldRiskThreshold: '',
      // -----枚举列表--------------------
      // 风险标签
      riskyLabels: [],
      // 处置策略
      strategies: [],
      // 根据不同数据类型 可选的运算符
      showOperator: [],
      // 获取到的所有运算符
      operator: [],
      // 业务变量库
      variableFields: [],
      // 计算指标库
      indicators: [],
      // 名单库
      libraryList: [],
      // 是否命中
      libraryListResults: [
        { text: '不命中', value: 'false' },
        { text: '命中', value: 'true' }
      ],
      // 逻辑关联关系
      logicalRelationship: [
        { value: 'and', label: '满足以下全部条件' },
        { value: 'or', label: '满足以下任意条件' },
        { value: 'random', label: '自定义' }
      ],
      // 配置规则的方式
      settingRuleType: [
        { value: 0, text: '模板配置' },
        { value: 1, text: '条件配置' },
        { value: 2, text: '脚本配置' },
        { value: 3, text: '算法配置' }
      ],
      // 模板配置规则弹窗
      tempRuleDialog: false,
      // 搜索规则模板分组
      searchForTempGroup: '',
      // 搜索规则模板
      searchForTemp: '',
      // 规则模板分组list
      tempGroupItem: [],
      // 规则模板list
      tempItem: [],
      // 选中的模板分组
      activeGroup: 0,
      // 选中的模板
      activeTemp: 0,
      tempGroupHeader: [
        {
          text: '模板分组',
          value: 'templateGroupName',
          sortable: false,
          width: 100
        }
      ],
      tempHeader: [{ text: '模板名称', value: 'templateName', sortable: false, width: 100 }],
      // 删除规则的时候如果已经被引用 提示弹框
      isUpgradeDialogShow: false,
      count: '',
      tempId: '',
      searchTemps: [],
      // 当前保存按钮是否可以点击
      canSave: true,
      // 业务变量库和计算指标库可选的值
      resultOptions: [],
      isIndicatorReady: false,
      isVariableFieldReady: false,
      isOperatorReady: false,
      // 数据是数值时的类型列表
      numberDataTypeList: [
        'int', 'double', 'float', 'long'
      ]
    };
  },
  computed: {
    canResolveItem () {
      return this.isIndicatorReady && this.isVariableFieldReady && this.isOperatorReady;
    }
  },
  watch: {
    searchForTemp (val) {
      this.searchTemps = [];
      if (val) {
        this.tempItem.forEach(element => {
          if (element.templateName.indexOf(val) >= 0 || element.templateName === val) {
            this.searchTemps.push(element);
          }
        });
      } else {
        this.searchTemps = this.tempItem;
      }
    },
    canResolveItem (val) {
      if (val) {
        this.dealDataType();
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.fixedBtnBox);
    for (let index = 0; index < this.operateRule.ruleJson.conditionList.length; index++) {
      const element = this.operateRule.ruleJson.conditionList[index];
      if (element.settingType === 1) {
      }
    }
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
    // 获取风险标签
    async getRiskyLabelsList () {
      const params = {
        identifier: 'sys_risk_label'
      };
      try {
        const response = await dataService.getAllTradeType(params);
        this.riskyLabels = response.data.data;
      } catch (error) {
      }
    },
    // 获取处置策略
    async getStrategiesList () {
      const params = {
        identifier: 'sys_strategy'
      };
      try {
        const response = await dataService.getAllTradeType(params);
        this.strategies = response.data.data;
      } catch (error) {
      }
    },
    // // 确定保存规则的按钮 ,分新增和编辑两种情况
    // async confirmAddRule () {
    //   if (this.operateRule.invalidTime && this.operateRule.enableTime && (new Date(this.operateRule.invalidTime).getTime() < new Date(this.operateRule.enableTime).getTime())) {
    //     this.snackbarServe = true;
    //     this.snackbarServeMsg = '启用时间应小于失效时间';
    //     this.snackbarServeColor = 'error';
    //     return;
    //   }
    //   // 如果不能点击直接 return
    //   if (!this.canSave) {
    //     return;
    //   }
    //   for (let index = 0; index < this.operatedRules.length; index++) {
    //     const element = this.operatedRules[index];
    //     if (element.ruleName === this.operateRule.ruleName && element.id !== this.operateRule.id) {
    //       this.snackbarServe = true;
    //       this.snackbarServeMsg = '规则名称重复，请修改';
    //       this.snackbarServeColor = 'error';
    //       return;
    //     }
    //     if (this.operateRule.ruleNo) {
    //       if (element.ruleNo === this.operateRule.ruleNo && element.id !== this.operateRule.id) {
    //         this.snackbarServe = true;
    //         this.snackbarServeMsg = '规则编号重复，请修改';
    //         this.snackbarServeColor = 'error';
    //         return;
    //       }
    //     }
    //   }
    //   // 规则名称不能为空
    //   if (!this.operateRule.ruleName) {
    //     this.snackbarServe = true;
    //     this.snackbarServeMsg = '规则名称不能为空';
    //     this.snackbarServeColor = 'error';
    //     return;
    //   }
    //   // 评分模式风险权重不能为空
    //   if (
    //     this.operatedRuleSet.matchingModel === 'SCORE_MATCH' &&
    //       !this.operateRule.weights
    //   ) {
    //     this.snackbarServe = true;
    //     this.snackbarServeMsg = '风险权重不能为空';
    //     this.snackbarServeColor = 'error';
    //     return;
    //   }
    //   // 匹配模式处置策略不能为空
    //   if (
    //     this.operatedRuleSet.matchingModel !== 'SCORE_MATCH' &&
    //       !this.operateRule.strategy
    //   ) {
    //     this.snackbarServe = true;
    //     this.snackbarServeMsg = '处置策略不能为空';
    //     this.snackbarServeColor = 'error';
    //     return;
    //   }
    //   // 逻辑关系不能为空
    //   if (!this.operateRule.ruleJson.logicalRelationship) {
    //     this.snackbarServe = true;
    //     this.snackbarServeMsg = '逻辑关系不能为空';
    //     this.snackbarServeColor = 'error';
    //     return;
    //   }
    //   // 失效时间转换
    //   if (
    //     this.operateRule.enableTime &&
    //       typeof this.operateRule.enableTime !== 'string'
    //   ) {
    //     this.operateRule.enableTime = this.myGetDate(this.operateRule.enableTime);
    //   }
    //   // 启用时间转换
    //   if (
    //     this.operateRule.invalidTime &&
    //       typeof this.operateRule.invalidTime !== 'string'
    //   ) {
    //     this.operateRule.invalidTime = this.myGetDate(this.operateRule.invalidTime);
    //   }
    //   // 规则不能为空
    //   if (this.operateRule.ruleJson.conditionList.length <= 0) {
    //     this.snackbarServe = true;
    //     this.snackbarServeMsg = '请配置规则';
    //     this.snackbarServeColor = 'error';
    //     return;
    //   }
    //   // 1、条件配置参数值不能为空  2、模板配置valueList删除 3.条件配置的描述长度超过100或者有特殊字符的情况不能保存
    //   for (let index = 0; index < this.operateRule.ruleJson.conditionList.length; index++) {
    //     const element = this.operateRule.ruleJson.conditionList[index];
    //     if (element.conditionDes.length > 100) {
    //       this.snackbarServe = true;
    //       this.snackbarServeMsg = '条件描述的长度不能大于100';
    //       this.snackbarServeColor = 'error';
    //       return;
    //     }
    //     element.filterSign = String.fromCharCode(64 + parseInt(index + 1));
    //     if (element.settingType === 1) {
    //       for (let itemIndex = 0; itemIndex < element.conditionItems.length; itemIndex++) {
    //         const itemElement = element.conditionItems[itemIndex];
    //         if (!itemElement.fieldValue) {
    //           this.snackbarServe = true;
    //           this.snackbarServeMsg = '参数值不能为空';
    //           this.snackbarServeColor = 'error';
    //           return;
    //         }
    //         if (!itemElement.operatorValue) {
    //           this.snackbarServe = true;
    //           this.snackbarServeMsg = '运算符不能为空';
    //           this.snackbarServeColor = 'error';
    //           return;
    //         }
    //         if (!itemElement.resultValue) {
    //           this.snackbarServe = true;
    //           this.snackbarServeMsg = '参数值不能为空';
    //           this.snackbarServeColor = 'error';
    //           return;
    //         }
    //       }
    //     }
    //     if (element.settingType === 0) {
    //       element.conditionItems[0].parameters.forEach(element => {
    //         delete element.valueList;
    //       });
    //     }
    //   }

    //   let paramOperateRule = JSON.parse(JSON.stringify(this.operateRule));
    //   // 删除条件配置的规则 每条的运算符和阈值可选值  resultValue
    //   paramOperateRule.ruleJson.conditionList.forEach(condition => {
    //     if (condition.settingType === 1) {
    //       condition.conditionItems.forEach(conditionItem => {
    //         conditionItem.operatorList = [];
    //         conditionItem.resultList = [];
    //         if (typeof (conditionItem.resultValue) === 'object') {
    //           conditionItem.resultValue = conditionItem.resultValue.fieldValue;
    //         }
    //       });
    //     }
    //   });
    //   this.operateRule.ruleJson.conditionList.forEach(condition => {
    //     if (condition.settingType === 1) {
    //       condition.conditionItems.forEach(conditionItem => {
    //         conditionItem.operatorList = [];
    //         conditionItem.resultList = [];
    //         if (typeof (conditionItem.resultValue) === 'object') {
    //           conditionItem.resultValue = conditionItem.resultValue.fieldValue;
    //         }
    //       });
    //     }
    //   });
    //   // 当前版本没有被引用
    //   if (!this.isReferenced) {
    //     // 规则集版本赋值
    //     paramOperateRule.rulesetHistoryId = this.versionId;
    //     // 先保存一下规则列表
    //     let ruleList = [];
    //     this.operatedRules.forEach(element => {
    //       ruleList.push({
    //         id: element.id,
    //         states: element.states
    //       });
    //     });
    //     let riskThreshold = '';
    //     if (typeof this.operatedRuleSet.riskThreshold === 'object') {
    //       riskThreshold = JSON.stringify(this.operatedRuleSet.riskThreshold);
    //     }
    //     const setParam = {
    //       id: this.operatedRuleSet.id,
    //       setNo: this.operatedRuleSet.setNo,
    //       setName: this.operatedRuleSet.setName,
    //       organizationId: this.operatedRuleSet.organizationId,
    //       appId: this.operatedRuleSet.appId,
    //       transactionTypeId: this.operatedRuleSet.transactionTypeId,
    //       matchingModel: this.operatedRuleSet.matchinmodel,
    //       riskThreshold: riskThreshold,
    //       version: parseInt(this.operatedRuleSet.version / 1),
    //       ruleList: JSON.stringify(ruleList)
    //     };
    //     try {
    //       const response = await dataService.modifyRuleSet(setParam);
    //       const code = response.data.code;
    //       if (code > 0) {
    //       }
    //     } catch (error) {
    //     };
    //     // let paramOperateRule = JSON.parse(JSON.stringify(this.operateRule));
    //     if (typeof paramOperateRule.ruleJson !== 'string') {
    //       paramOperateRule.ruleJson = JSON.stringify(paramOperateRule.ruleJson);
    //     }
    //     if (typeof paramOperateRule.label !== 'string') {
    //       paramOperateRule.labelId = paramOperateRule.labelId ? paramOperateRule.labelId.join(',') : '';
    //     }
    //     // 新增;
    //     if (this.isAddRule === true) {
    //       this.canSave = false;
    //       let param = paramOperateRule;
    //       try {
    //         const response = await dataService.addRule(param);
    //         const code = response.data.code;
    //         if (code === 200) {
    //           this.snackbarServe = true;
    //           this.snackbarServeMsg = '保存成功';
    //           this.snackbarServeColor = 'success';
    //           this.addRel(this.operatedRuleSet.id, JSON.parse(paramOperateRule.ruleJson), 1);
    //           const TIME_COUNT = 3;
    //           if (!this.timer) {
    //             this.count = TIME_COUNT;
    //             this.show = false;
    //             this.timer = setInterval(() => {
    //               if (this.count > 0 && this.count <= TIME_COUNT) {
    //                 this.count--;
    //               } else {
    //                 this.show = true;
    //                 clearInterval(this.timer);
    //                 this.timer = null;
    //                 this.$router.push('/ruleCheckDetail');
    //               }
    //             }, 500);
    //           }
    //         } else {
    //           this.snackbarServe = true;
    //           this.snackbarServeMsg = response.data.msg;
    //           this.snackbarServeColor = 'error';
    //           this.canSave = true;
    //         }
    //       } catch (error) {
    //         this.canSave = true;
    //       }
    //     } else if (this.isAddRule === false) {
    //       // 编辑
    //       let param = {
    //         id: paramOperateRule.id,
    //         rulesetHistoryId: paramOperateRule.rulesetHistoryId,
    //         ruleNo: paramOperateRule.ruleNo,
    //         ruleName: paramOperateRule.ruleName,
    //         labelId: paramOperateRule.labelId,
    //         isWeak: paramOperateRule.isWeak,
    //         strategy: paramOperateRule.strategy,
    //         enableTime: paramOperateRule.enableTime,
    //         invalidTime: paramOperateRule.invalidTime,
    //         priorityLevel: paramOperateRule.priorityLevel,
    //         weights: paramOperateRule.weights,
    //         riskThreshold: paramOperateRule.riskThreshold,
    //         comment: paramOperateRule.comment,
    //         ruleJson: paramOperateRule.ruleJson,
    //         states: paramOperateRule.states,
    //         upgrade: false,
    //         setId: this.operatedRuleSet.id,
    //         ruleList: ''
    //       };
    //       try {
    //         const response = await dataService.modifyRule(param);
    //         const code = response.data.code;
    //         if (code === 200) {
    //           if (typeof (this.oldRuleJson.ruleJson) === 'string') {
    //             this.oldRuleJson.ruleJson = JSON.parse(this.oldRuleJson.ruleJson);
    //           }
    //           this.delRel(this.operatedRuleSet.id, this.oldRuleJson.ruleJson, 1);
    //           this.addRel(this.operatedRuleSet.id, JSON.parse(paramOperateRule.ruleJson), 1);
    //           this.snackbarServe = true;
    //           this.snackbarServeMsg = '保存成功';
    //           this.snackbarServeColor = 'success';
    //           const TIME_COUNT = 3;
    //           if (!this.timer) {
    //             this.count = TIME_COUNT;
    //             this.timer = setInterval(() => {
    //               if (this.count > 0 && this.count <= TIME_COUNT) {
    //                 this.count--;
    //               } else {
    //                 clearInterval(this.timer);
    //                 this.timer = null;
    //                 this.$router.push('/ruleCheckDetail');
    //               }
    //             }, 500);
    //           }
    //         } else {
    //           this.snackbarServe = true;
    //           this.snackbarServeMsg = response.data.msg;
    //           this.snackbarServeColor = 'error';
    //         }
    //       } catch (error) {
    //       }
    //     }
    //   }

    //   // 当前版本被引用;
    //   if (this.isReferenced) {
    //     this.canSave = false;
    //     // labelId字符串转对象
    //     if (typeof this.oldRuleJson.labelId === 'object') {
    //       this.oldRuleJson.labelId = this.oldRuleJson.labelId ? this.oldRuleJson.labelId.join(',') : '';
    //     }
    //     let newLabelId = '';// 改变后的labelId,用于中转，解决标签labelId格式改变页面报错的问题
    //     if (typeof this.operateRule.labelId === 'object') {
    //       newLabelId = this.operateRule.labelId ? this.operateRule.labelId.join(',') : '';
    //     }
    //     let paramOperateRule = JSON.parse(JSON.stringify(this.operateRule));
    //     paramOperateRule.labelId = newLabelId;
    //     // 新增 不用比较 直接调接口生版本
    //     if (this.isAddRule === true) {
    //       let ruleList = [];
    //       this.operatedRules.forEach(newEle => {
    //         ruleList.push({
    //           id: newEle.id,
    //           states: newEle.states,
    //           isDel: false
    //         });
    //       });
    //       let param = {
    //         id: '',
    //         rulesetHistoryId: this.versionId,
    //         ruleNo: paramOperateRule.ruleNo,
    //         ruleName: paramOperateRule.ruleName,
    //         labelId: paramOperateRule.labelId,
    //         isWeak: paramOperateRule.isWeak,
    //         strategy: paramOperateRule.strategy,
    //         enableTime: paramOperateRule.enableTime,
    //         invalidTime: paramOperateRule.invalidTime,
    //         priorityLevel: paramOperateRule.priorityLevel,
    //         weights: paramOperateRule.weights,
    //         riskThreshold: JSON.stringify(this.operatedRuleSet.riskThreshold),
    //         comment: paramOperateRule.comment,
    //         ruleJson: JSON.stringify(paramOperateRule.ruleJson),
    //         states: 'OFFICIAL',
    //         upgrade: true,
    //         setId: this.operatedRuleSet.id,
    //         ruleList: JSON.stringify(ruleList),
    //         isOperator: 'true'
    //       };
    //       dataService
    //         .UpgradeRule(param)
    //         .then(response => {
    //           const code = response.data.code;
    //           if (code > 0) {
    //             this.snackbarServe = true;
    //             this.snackbarServeMsg = '当前版本规则集被引用，已自动升版';
    //             this.snackbarServeColor = 'success';
    //             this.addRel(this.operatedRuleSet.id, paramOperateRule.ruleJson, response.data.data.historyVersion);
    //             let sStorage = window.sessionStorage;
    //             // 版本号
    //             sStorage.setItem('versionNum', response.data.data.historyVersion);
    //             // 版本id
    //             sStorage.setItem('versionId', response.data.data.rulesetHistoryId);
    //             const TIME_COUNT = 3;
    //             if (!this.timer) {
    //               this.count = TIME_COUNT;
    //               this.timer = setInterval(() => {
    //                 if (this.count > 0 && this.count <= TIME_COUNT) {
    //                   this.count--;
    //                 } else {
    //                   clearInterval(this.timer);
    //                   this.timer = null;
    //                   this.$router.push('/ruleCheckDetail');
    //                 }
    //               }, 500);
    //             }
    //           } else {
    //             this.snackbarServe = true;
    //             this.snackbarServeMsg = response.data.msg;
    //             this.snackbarServeColor = 'error';
    //             this.canSave = true;
    //           }
    //         })
    //         .catch(() => {
    //           this.canSave = true;
    //         });
    //     } else if (this.isAddRule === false) { // 编辑
    //       let generateNewVersion = false;
    //       // 对比数据判断规定的字段是否有变化
    //       if (this.oldRuleJson) {
    //         const ruleParamKeyList = [
    //           'labelId',
    //           'strategy',
    //           'priorityLevel',
    //           'weights',
    //           'invalidTime',
    //           'enableTime'
    //         ];
    //         const consitionItemParamKeyList = [
    //           'fieldSource',
    //           'fieldValue',
    //           'operatorValue',
    //           'resultSource',
    //           'resultValue',
    //           'conditionItemRelation'
    //         ];
    //         var oldRuleList;
    //         var newRuleList;
    //         // ruleJson字符串转成对象
    //         if (typeof this.oldRuleJson.ruleJson === 'string') {
    //           oldRuleList = JSON.parse(this.oldRuleJson.ruleJson);
    //         } else if (typeof this.oldRuleJson.ruleJson === 'object') {
    //           oldRuleList = JSON.parse(JSON.stringify(this.oldRuleJson.ruleJson));
    //         }
    //         if (typeof this.operateRule.ruleJson === 'string') {
    //           newRuleList = JSON.parse(this.operateRule.ruleJson);
    //         } else if (typeof this.operateRule.ruleJson === 'object') {
    //           newRuleList = JSON.parse(JSON.stringify(this.operateRule.ruleJson));
    //         }
    //         console.log(this.oldRuleJson.ruleJson);
    //         console.log(this.operateRule.ruleJson);
    //         // 判断规则的基本字段是否有改动
    //         for (const key in this.oldRuleJson) {
    //           if (ruleParamKeyList.indexOf(key) !== -1) {
    //             if (key === 'labelId') {
    //               if (JSON.stringify(this.oldRuleJson[key]) !== JSON.stringify(newLabelId)) {
    //                 generateNewVersion = true;
    //               }
    //             } else {
    //               if (this.oldRuleJson[key] !== this.operateRule[key]) {
    //                 generateNewVersion = true;
    //               }
    //             }
    //           }
    //         }
    //         // 如果基本字段没有改变判断ruleJson
    //         if (!generateNewVersion) {
    //           if (
    //             newRuleList.logicalRelationship !==
    //               oldRuleList.logicalRelationship
    //           ) {
    //             generateNewVersion = true;
    //           }
    //           if (
    //             newRuleList.conditionList.length !==
    //               oldRuleList.conditionList.length
    //           ) {
    //             generateNewVersion = true;
    //           }
    //         }
    //         // 遍历判断规则条件
    //         if (!generateNewVersion) {
    //           for (
    //             let index = 0;
    //             index < newRuleList.conditionList.length;
    //             index++
    //           ) {
    //             let newCondition = newRuleList.conditionList[index];
    //             let oldCondition = oldRuleList.conditionList[index];
    //             if (
    //               newCondition.settingType !==
    //                 oldCondition.settingType
    //             ) {
    //               generateNewVersion = true;
    //             }
    //             if (!generateNewVersion) {
    //               if (newCondition.settingType === 1) {
    //                 if (newCondition.conditionItems.length !== oldCondition.conditionItems.length) {
    //                   generateNewVersion = true;
    //                 } else {
    //                   for (let itemIndex = 0; itemIndex < newCondition.conditionItems.length; itemIndex++) {
    //                     for (const key in newCondition.conditionItems[itemIndex]) {
    //                       if (consitionItemParamKeyList.indexOf(key) !== -1) {
    //                         if (newCondition.conditionItems[itemIndex][key] !== oldCondition.conditionItems[itemIndex][key]) {
    //                           generateNewVersion = true;
    //                         }
    //                       }
    //                     }
    //                   }
    //                 }
    //               } else if (newCondition.settingType === 0) {
    //                 if (newCondition.conditionItems[0].fieldValue !== oldCondition.conditionItems[0].fieldValue) {
    //                   generateNewVersion = true;
    //                 }

    //                 if (!generateNewVersion) {
    //                   for (let newParamOfTempIndex = 0; newParamOfTempIndex < newCondition.conditionItems[0].parameters.length; newParamOfTempIndex++) {
    //                     const newParamOfTempElement = newCondition.conditionItems[0].parameters[newParamOfTempIndex];
    //                     const oldParamOfTempElement = oldCondition.conditionItems[0].parameters[newParamOfTempIndex];
    //                     if (newParamOfTempElement.value.value !== oldParamOfTempElement.value.value) {
    //                       generateNewVersion = true;
    //                       break;
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //       // 有变化 进行升版
    //       if (generateNewVersion) {
    //         let ruleList = [];
    //         this.operatedRules.forEach(newEle => {
    //           ruleList.push({
    //             id: newEle.id,
    //             states: newEle.states,
    //             isDel: false
    //           });
    //         });
    //         let param = {
    //           id: paramOperateRule.id,
    //           rulesetHistoryId: this.versionId,
    //           ruleNo: paramOperateRule.ruleNo,
    //           ruleName: paramOperateRule.ruleName,
    //           labelId: paramOperateRule.labelId,
    //           isWeak: paramOperateRule.isWeak,
    //           strategy: paramOperateRule.strategy,
    //           enableTime: paramOperateRule.enableTime,
    //           invalidTime: paramOperateRule.invalidTime,
    //           priorityLevel: paramOperateRule.priorityLevel,
    //           weights: paramOperateRule.weights,
    //           riskThreshold: JSON.stringify(this.operatedRuleSet.riskThreshold),
    //           comment: paramOperateRule.comment,
    //           ruleJson: JSON.stringify(paramOperateRule.ruleJson),
    //           states: paramOperateRule.states,
    //           upgrade: true,
    //           setId: this.operatedRuleSet.id,
    //           ruleList: JSON.stringify(ruleList),
    //           isOperator: 'true'
    //         };
    //         try {
    //           const response = await dataService.UpgradeRule(param);
    //           const code = response.data.code;
    //           if (code === 200) {
    //             this.snackbarServe = true;
    //             this.snackbarServeMsg = '当前版本规则集被引用，已自动升版';
    //             this.snackbarServeColor = 'success';
    //             this.addRel(this.operatedRuleSet.id, paramOperateRule.ruleJson, response.data.data.historyVersion);
    //             let sStorage = window.sessionStorage;
    //             // 版本号
    //             sStorage.setItem('versionNum', response.data.data.historyVersion);
    //             // 版本id
    //             sStorage.setItem('versionId', response.data.data.rulesetHistoryId);
    //             const TIME_COUNT = 3;
    //             if (!this.timer) {
    //               this.count = TIME_COUNT;
    //               this.timer = setInterval(() => {
    //                 if (this.count > 0 && this.count <= TIME_COUNT) {
    //                   this.count--;
    //                 } else {
    //                   clearInterval(this.timer);
    //                   this.timer = null;
    //                   this.$router.push('/ruleCheckDetail');
    //                 }
    //               }, 500);
    //             }
    //           } else {
    //             this.canSave = true;
    //             this.snackbarServe = true;
    //             this.snackbarServeMsg = response.data.msg;
    //             this.snackbarServeColor = 'error';
    //           }
    //         } catch (error) {
    //           this.canSave = true;
    //         }
    //       } else { // 没有变化 编辑
    //         let param = {
    //           id: paramOperateRule.id,
    //           rulesetHistoryId: paramOperateRule.rulesetHistoryId,
    //           ruleNo: paramOperateRule.ruleNo,
    //           ruleName: paramOperateRule.ruleName,
    //           labelId: paramOperateRule.labelId,
    //           isWeak: paramOperateRule.isWeak,
    //           strategy: paramOperateRule.strategy,
    //           enableTime: paramOperateRule.enableTime,
    //           invalidTime: paramOperateRule.invalidTime,
    //           priorityLevel: paramOperateRule.priorityLevel,
    //           weights: paramOperateRule.weights,
    //           riskThreshold: paramOperateRule.riskThreshold,
    //           comment: paramOperateRule.comment,
    //           ruleJson: JSON.stringify(paramOperateRule.ruleJson),
    //           states: paramOperateRule.states,
    //           upgrade: false,
    //           setId: this.operatedRuleSet.id,
    //           ruleList: ''
    //         };
    //         try {
    //           const response = await dataService.modifyRule(param);
    //           const code = response.data.code;
    //           if (code === 200) {
    //             this.snackbarServe = true;
    //             this.snackbarServeMsg = '保存成功';
    //             this.snackbarServeColor = 'success';
    //             const TIME_COUNT = 3;
    //             if (!this.timer) {
    //               this.count = TIME_COUNT;
    //               this.timer = setInterval(() => {
    //                 if (this.count > 0 && this.count <= TIME_COUNT) {
    //                   this.count--;
    //                 } else {
    //                   clearInterval(this.timer);
    //                   this.timer = null;
    //                   this.$router.push('/ruleCheckDetail');
    //                 }
    //               }, 500);
    //             }
    //           } else {
    //             this.canSave = true;
    //             this.snackbarServe = true;
    //             this.snackbarServeMsg = response.data.msg;
    //             this.snackbarServeColor = 'error';
    //           }
    //         } catch (error) {
    //           this.canSave = true;
    //         }
    //       }
    //     }
    //   }
    // },
    // 取消保存规则
    cancelAddRule () {
      this.$router.push('/ruleCheckDetail');
    },
    // 选择配置方式,新增規則某一項
    selectSettingType (item) {
      // 条件配置
      if (item === 0) {
        this.operateRule.ruleJson.conditionList.push({
          settingType: 1,
          conditionDes: '',
          fieldType: 'BUSINESS_VAR',
          resultType: '阈值',
          activeIndex: 0,
          conditionItems: [
            {
              fieldSource: 'BUSINESS_VAR',
              fieldValue: '',
              fieldText: '',
              isFieldEnumeration: '',
              // 阈值可选值
              resultList: JSON.parse(JSON.stringify(this.resultOptions)),
              operatorValue: '',
              operatorText: '',
              // 运算符列表
              operatorList: JSON.parse(JSON.stringify(this.operator)),
              resultSource: 'INPUT',
              resultValue: '',
              resultText: '',
              resultType: '',
              fieldType: '',
              conditionItemRelation: '&&'
            }
          ]
        });
      } else if (item === 1) {
        this.initGetGroupList();
        this.tempRuleDialog = true;
      }
    },
    // 删除规则某一项
    delcondition (operateIndex) {
      this.operateRule.ruleJson.conditionList.splice(operateIndex, 1);
    },
    // 增加一行规则条件item
    // addOperateItems (operateIndex, index) {
    //   this.operateRule.ruleJson.conditionList[operateIndex].conditionItems.splice(index + 1, 0, {
    //     fieldSource: 'BUSINESS_VAR',
    //     fieldValue: '',
    //     fieldText: '',
    //     isFieldEnumeration: '',
    //     // 阈值可选列表
    //     resultList: JSON.parse(JSON.stringify(this.resultOptions)),
    //     operatorValue: '',
    //     operatorText: '',
    //     resultSource: 'INPUT',
    //     resultValue: '',
    //     resultText: '',
    //     resultType: '',
    //     conditionItemRelation: '&&',
    //     // 运算符列表
    //     operatorList: JSON.parse(JSON.stringify(this.operator))
    //   });
    // },
    // 删除一行规则条件item
    // delOperateItems (operateIndex, index) {
    //   let conditionItems = this.operateRule.ruleJson.conditionList[operateIndex].conditionItems;
    //   if (conditionItems.length <= 1) {
    //     return;
    //   }
    //   conditionItems.splice(index, 1);
    //   // this.operateRule.ruleJson.conditionList[operateIndex].conditionItems[0].conditionItemRelation = '';
    // },
    // 切换 业务变量库 | 计算指标库 | 名单库
    toggleButton (operateIndex, index) {
      let operateCondition = this.operateRule.ruleJson.conditionList[operateIndex];
      let operateConditionItem = operateCondition.conditionItems[index];
      let itemFieldSource = operateConditionItem.fieldSource;
      operateConditionItem.fieldValue = '';
      operateConditionItem.fieldText = '';
      operateConditionItem.resultValue = '';
      operateConditionItem.resultText = '';
      operateConditionItem.operatorValue = '';
      operateConditionItem.operatorText = '';
      // 计算指标库
      if (itemFieldSource === 'CALCULATION_VAR') {
        operateConditionItem.resultSource = 'INPUT';
        operateConditionItem.resultType = '';
        operateConditionItem.resultList = JSON.parse(JSON.stringify(this.resultOptions));
        operateConditionItem.operatorList = JSON.parse(JSON.stringify(this.operator));
      }
      // 名单库
      if (itemFieldSource === 'LIST_LIB') {
        operateConditionItem.resultSource = 'ENUM_VAR';
        operateConditionItem.resultType = '';
        this.operator.forEach(element => {
          if (element.compName === '等于') {
            operateConditionItem.operatorValue = element.compValue;
          }
        });
      }
      // 业务变量库
      if (itemFieldSource === 'BUSINESS_VAR') {
        operateConditionItem.resultList = JSON.parse(JSON.stringify(this.resultOptions));
        operateConditionItem.operatorList = JSON.parse(JSON.stringify(this.operator));
      }
    },
    // 业务变量库change事件
    // async variableChange (operateIndex, index, item) {
    //   let fieldItem;
    //   item.operatorList = [];
    //   this.variableFields.forEach(element => {
    //     if (item.fieldValue === element.fieldValue) {
    //       item.fieldText = element.fieldName;
    //       item.fieldType = element.dataType;
    //       item.isFieldEnumeration = element.isEnumeration;
    //       item.resultList = element.enumList;
    //       fieldItem = element;
    //     }
    //   });
    //   // 字符串类型和布尔类型运算符只能是等于或者不等于
    //   if (item.fieldType === 'String' || item.fieldType === 'boolean') {
    //     this.operator.forEach(element => {
    //       if (element.compName === '等于' || element.compName === '不等于') {
    //         item.operatorList.push(JSON.parse(JSON.stringify(element)));
    //       }
    //     });
    //   } else {
    //     item.operatorList = JSON.parse(JSON.stringify(this.operator));
    //   }
    //   if (item.isFieldEnumeration === '0') {
    //     item.resultList = [];
    //     // 根据所选的数据类型 阈值下拉框中对应值为不同类型
    //     if (item.fieldType === 'boolean') {
    //       item.resultList.push(
    //         {
    //           fieldValue: '',
    //           fieldName: '',
    //           disabled: true,
    //           divider: true
    //         });
    //     }
    //     item.resultList.push({
    //       fieldValue: 'BUSINESS_VAR',
    //       fieldName: '业务变量库',
    //       disabled: true,
    //       divider: false
    //     });
    //     // 如果是数值类型 int double float long类型的数值都可以进行比较 阈值下拉框的值是这四种类型的合集
    //     if (this.numberDataTypeList.indexOf(item.fieldType) > -1) {
    //       this.variableFields.forEach(element => {
    //         if (this.numberDataTypeList.indexOf(element.dataType) > -1) {
    //           item.resultList.push(element);
    //         }
    //       });
    //     } else {
    //       this.variableFields.forEach(element => {
    //         if (element.dataType === item.fieldType) {
    //           item.resultList.push(element);
    //         }
    //       });
    //     }
    //     item.resultList.push({
    //       fieldValue: '',
    //       fieldName: '',
    //       disabled: true,
    //       divider: true
    //     }, {
    //       fieldValue: 'CALCULATION_VAR',
    //       fieldName: '计算指标库',
    //       disabled: true,
    //       divider: false
    //     });
    //     // 如果是数值类型 int double float long类型的数值都可以进行比较 阈值下拉框的值是这四种类型的合集
    //     if (this.numberDataTypeList.indexOf(item.fieldType) > -1) {
    //       this.indicators.forEach(indicator => {
    //         if (this.numberDataTypeList.indexOf(indicator.dataType) > -1) {
    //           let element = {
    //             fieldValue: indicator.id,
    //             fieldName: indicator.indicName,
    //             dataType: indicator.dataType

    //           };
    //           item.resultList.push(element);
    //         }
    //       });
    //     } else { // 其他类型的 string boolean Object  阈值下拉框是相同的类型的数据的合集
    //       this.indicators.forEach(indicator => {
    //         if (indicator.dataType === item.fieldType) {
    //           let element = {
    //             fieldValue: indicator.id,
    //             fieldName: indicator.indicName
    //           };
    //           item.resultList.push(element);
    //         }
    //       });
    //     }
    //     // 如果是布尔类型 可选的阈值 增加是否选项
    //     if (item.fieldType === 'boolean') {
    //       item.resultList.unshift({
    //         fieldValue: 'Boolean',
    //         fieldName: '布尔值',
    //         disabled: true,
    //         divider: false
    //       }, {
    //         fieldName: '是',
    //         fieldValue: 'true',
    //         srcType: 'INPUT'
    //       }, {
    //         fieldName: '否',
    //         fieldValue: 'false',
    //         srcType: 'INPUT'
    //       });
    //     }
    //     // 如果当前行是选中行
    //     let operateCondition = this.operateRule.ruleJson.conditionList[operateIndex];
    //     let operateConditionItem = operateCondition.conditionItems[index];
    //     if (operateCondition.activeIndex === index) {
    //       if (fieldItem.isEnumeration === '1') {
    //         operateConditionItem.resultSource = 'ENUM_VAR';
    //         operateCondition.resultType = '枚举值';
    //       } else {
    //         operateConditionItem.resultSource = 'INPUT';
    //         operateCondition.resultType = '阈值';
    //       }
    //     } else {
    //       if (fieldItem.isEnumeration === '1') {
    //         operateConditionItem.resultSource = 'ENUM_VAR';
    //       } else {
    //         operateConditionItem.resultSource = 'INPUT';
    //       }
    //     }
    //   }
    // },
    // 选择框阈值修改事件
    // resultSelectChange (item) {
    //   if (typeof (item.resultValue) === 'string') {
    //     item.resultSource = 'INPUT';
    //     item.resultText = item.resultValue;
    //     item.resultType = '';
    //   } else if (typeof (item.resultValue) === 'object') {
    //     let resultObj = JSON.parse(JSON.stringify(item.resultValue));
    //     if (resultObj.srcType && resultObj.srcType === 'BUSINESS_VAR') {
    //       item.resultSource = 'BUSINESS_VAR';
    //       item.resultText = resultObj.fieldName;
    //     } else if (resultObj.srcType && resultObj.srcType === 'INPUT') {
    //       item.resultSource = 'INPUT';
    //       item.resultText = resultObj.fieldName;
    //     } else {
    //       item.resultSource = 'CALCULATION_VAR';
    //       item.resultText = resultObj.fieldName;
    //     }
    //   }
    //   // 类型
    //   item.resultList.forEach(element => {
    //     if (element.fieldValue === item.resultValue.fieldValue) {
    //       item.resultType = element.dataType;
    //     }
    //   });
    // },
    // 业务变量库是枚举时 枚举值修改事件
    // resultEnumerationSelectChange (item) {
    //   item.resultList.forEach(element => {
    //     if (item.resultValue === element.fieldValue) {
    //       item.resultText = element.fieldName;
    //       item.resultType = element.dataType;
    //       item.resultSource = 'ENUM_VAR';
    //     }
    //   });
    // },
    // 计算指标库change事件
    // async indicatorsChange (item) {
    //   this.indicators.forEach(element => {
    //     if (item.fieldValue === element.id) {
    //       item.fieldText = element.indicName;
    //       item.fieldType = element.dataType;
    //     }
    //   });
    //   item.operatorList = [];
    //   item.resultList = [];
    //   // 字符串类型和布尔类型运算符只能是等于或者不等于
    //   if (item.fieldType === 'String' || item.fieldType === 'boolean') {
    //     this.operator.forEach(element => {
    //       if (element.compName === '等于' || element.compName === '不等于') {
    //         item.operatorList.push(JSON.parse(JSON.stringify(element)));
    //       }
    //     });
    //   } else {
    //     item.operatorList = JSON.parse(JSON.stringify(this.operator));
    //   }
    //   // 根据所选的数据类型 阈值下拉框中对应值为不同类型
    //   if (item.fieldType === 'boolean') {
    //     item.resultList.push({
    //       fieldValue: 'BUSINESS_VAR',
    //       fieldName: '业务变量库',
    //       disabled: true,
    //       divider: true
    //     });
    //   }
    //   item.resultList.push({
    //     fieldValue: 'BUSINESS_VAR',
    //     fieldName: '业务变量库',
    //     disabled: true,
    //     divider: false
    //   });
    //   // 如果是数值类型 int double float long类型的数值都可以进行比较 阈值下拉框的值是这四种类型的合集
    //   if (this.numberDataTypeList.indexOf(item.fieldType) > -1) {
    //     this.variableFields.forEach(element => {
    //       if (this.numberDataTypeList.indexOf(element.dataType) > -1) {
    //         item.resultList.push(element);
    //       }
    //     });
    //   } else {
    //     this.variableFields.forEach(element => {
    //       if (element.dataType === item.fieldType) {
    //         item.resultList.push(element);
    //       }
    //     });
    //   }
    //   item.resultList.push({
    //     fieldValue: '',
    //     fieldName: '',
    //     disabled: true,
    //     divider: true
    //   }, {
    //     fieldValue: 'CALCULATION_VAR',
    //     fieldName: '计算指标库',
    //     disabled: true,
    //     divider: false
    //   });
    //   if (this.numberDataTypeList.indexOf(item.fieldType) > -1) {
    //     this.indicators.forEach(indicator => {
    //       if (this.numberDataTypeList.indexOf(indicator.dataType) > -1) {
    //         let element = {
    //           fieldValue: indicator.id,
    //           fieldName: indicator.indicName,
    //           dataType: indicator.dataType

    //         };
    //         item.resultList.push(element);
    //       }
    //     });
    //   } else { // 其他类型的 string boolean Object  阈值下拉框是相同的类型的数据的合集
    //     this.indicators.forEach(indicator => {
    //       if (indicator.dataType === item.fieldType) {
    //         let element = {
    //           fieldValue: indicator.id,
    //           fieldName: indicator.indicName
    //         };
    //         item.resultList.push(element);
    //       }
    //     });
    //   }
    //   // 如果是布尔类型 可选的阈值 增加是否选项
    //   if (item.fieldType === 'boolean') {
    //     item.resultList.unshift({
    //       fieldValue: 'Boolean',
    //       fieldName: '布尔值',
    //       disabled: true,
    //       divider: false
    //     }, {
    //       fieldName: '是',
    //       fieldValue: 'true',
    //       srcType: 'INPUT'
    //     }, {
    //       fieldName: '否',
    //       fieldValue: 'false',
    //       srcType: 'INPUT'
    //     });
    //   }
    // },
    // 运算符change事件
    // operatorChange (item) {
    //   this.operator.forEach(element => {
    //     if (item.operatorValue === element.compValue) {
    //       item.operatorText = element.compName;
    //     }
    //   });
    // },
    // 名单库change事件
    // listLibraryChange (item) {
    //   this.libraryList.forEach(element => {
    //     if (item.fieldValue === element.id) {
    //       item.fieldText = element.listName;
    //       item.fieldType = 'String';
    //     }
    //   });
    // },
    // 名单库结果change事件
    // libraryListResultsChange (item) {
    //   this.libraryListResults.forEach(element => {
    //     if (item.resultValue === element.value) {
    //       item.resultText = element.text;
    //     }
    //   });
    // },
    // 获取业务变量
    async GetVariableField () {
      const params = {
        isContainEnum: '1'
      };
      try {
        const response = await dataService.GetVariableField(params);
        if (response.data.code === 200) {
          this.variableFields = response.data.data;
          this.isVariableFieldReady = true;
          this.resultOptions = this.resultOptions.concat(response.data.data);
        }
      } catch (error) {
      }
    },
    // 获取计算指标
    async GetIndicators () {
      const params = {
        groupId: ''
      };
      try {
        const response = await dataService.GetIndicators(params);
        this.isIndicatorReady = true;
        this.indicators = response.data.data;
        response.data.data.forEach(indicator => {
          let item = {
            fieldValue: indicator.id,
            fieldName: indicator.indicName
          };
          this.resultOptions.push(item);
        });
      } catch (error) {
      }
    },
    // 获取计算符
    async GetOperator () {
      try {
        const response = await dataService.GetOperator();
        if (response.data.code === 200) {
          this.operator = response.data.data.list;
          this.isOperatorReady = true;
          this.showOperator = JSON.parse(JSON.stringify(this.operator));
        }
      } catch (error) {
      }
    },
    // 获取名单库
    async getListManage () {
      try {
        const response = await dataService.getListManage();
        if (response.data.code === 200) {
          this.libraryList = response.data.data;
        }
      } catch (error) {
      }
    },
    // 描述防止冒泡
    operateItemConditionDes () {
      return false;
    },
    // 時間格式化
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
    // 樹形結構數據轉出數組
    treeToList (node) {
      if (!!node && node.length !== 0) {
        node.forEach(item => {
          this.organizationList.push({
            label: item.label,
            id: item.id
          });
          if (!!item.children && item.children.length !== 0) {
            this.treeToList(item.children);
          }
        });
      }
    },
    // 规则模板弹窗关闭
    cancelRuleTemp () {
      this.tempRuleDialog = false;
      this.activeGroup = 0;
      this.activeTemp = 0;
    },
    // 规则模板确定事件
    saveRuleTemp () {
      let parms = {
        templateId: this.tempId
      };
      var tempName = '';
      this.tempItem.forEach(element => {
        if (element.id === this.tempId) {
          tempName = element.templateName;
        }
      });
      getTmpListValue(parms).then(res => {
        if (res.data.code === 200) {
          this.tempRuleDialog = false;
          let parameters = [];
          for (let index = 0; index < res.data.data.length; index++) {
            const element = res.data.data[index];
            parameters.push({
              cnName: element.paramName,
              enName: element.paramValue,
              index: index,
              value: {
                name: '',
                id: '',
                value: '',
                srcType: ''
              },
              dataType: element.dataType,
              valueList: element.valueList,
              src: element.showType,
              description: element.description
            });
          }
          this.operateRule.ruleJson.conditionList.push({
            settingType: 0,
            conditionDes: '',
            conditionItems: [{
              fieldSource: 'RULE_TEMPLATE',
              fieldValue: this.tempId,
              fieldText: tempName,
              parameters: parameters
            }]
          });
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 模板分组点击事件
    tempGroupClick (item, index) {
      this.activeGroup = index;
      this.activeTemp = 0;
      this.getListTmp();
    },
    // 获取模板分组数据
    initGetGroupList () {
      getList().then(res => {
        this.tempGroupItem = res.data.data;
        if (this.activeGroup === 0) {
          this.getListTmp();
        }
      });
    },
    // 获取模板数据
    getListTmp () {
      let index = this.activeGroup;
      let parms = {
        templateGroupId: this.tempGroupItem[index].id
      };
      getListTmp(parms).then(res => {
        this.tempItem = res.data.data;
        this.searchTemps = res.data.data;
        this.tempId = res.data.data[0].id;
      });
    },
    // 规则模板参数下拉值修改事件
    ruleTempParamChange (operateIndex, index) {
      let operateCondition = this.operateRule.ruleJson.conditionList[operateIndex];
      let paramItem = operateCondition.conditionItems[0].parameters[index];
      paramItem.valueList.forEach(element => {
        if (element.id === paramItem.value.value) {
          paramItem.value.name = element.label;
          paramItem.value.id = element.value;
          paramItem.value.srcType = element.srcType;
        }
      });
    },
    // 删除引用记录
    // 修改规则的保存/删除规则
    // 删除规则集/规则被引用之后的修改
    async delRel (ruleSetId, oldRuleJson, ruleSetVersion) {
      let delRelList = [];
      oldRuleJson.conditionList.forEach(conditionEle => {
        if (conditionEle.settingType === 1) {
          conditionEle.conditionItems.forEach(conditionItemEle => {
            let delRelItemOfField = {
              sourceId: '',
              sourceType: conditionItemEle.fieldSource,
              sourceVersion: 0,
              targetId: ruleSetId,
              targetType: 'RULE_SET',
              targetVersion: ruleSetVersion
            };
            let delRelItemOfOperator = {
              sourceId: '',
              sourceType: 'COMPARATOR_VAR',
              sourceVersion: 0,
              targetId: ruleSetId,
              targetType: 'RULE_SET',
              targetVersion: ruleSetVersion
            };
              // 业务变量库
            if (conditionItemEle.fieldSource === 'BUSINESS_VAR') {
              this.variableFields.forEach(element => {
                if (element.fieldValue === conditionItemEle.fieldValue) {
                  delRelItemOfField.sourceId = element.id;
                }
              });
            }
            // 计算指标库
            if (conditionItemEle.fieldSource === 'CALCULATION_VAR') {
              delRelItemOfField.sourceId = conditionItemEle.fieldValue;
            }
            // 名单库
            if (conditionItemEle.fieldSource === 'LIST_LIB') {
              delRelItemOfField.sourceId = conditionItemEle.fieldValue;
            }
            // 运算符
            this.operator.forEach(element => {
              if (element.compValue === conditionItemEle.operatorValue) {
                delRelItemOfOperator.sourceId = element.id;
              }
            });
            // 业务变量库是枚举 枚举常量库
            if (conditionItemEle.isFieldEnumeration === '1') {
              let delRelItemOfSource = {
                sourceId: '',
                sourceType: 'CALCULATION_VAR ',
                sourceVersion: 0,
                targetId: ruleSetId,
                targetType: 'RULE_SET',
                targetVersion: ruleSetVersion
              };
              conditionItemEle.resultList.forEach(element => {
                if (element.fieldValue === conditionItemEle.resultValue) {
                  delRelItemOfSource.sourceId = element.id;
                }
              });
              delRelList.push(delRelItemOfSource);
            }
            delRelList.push(delRelItemOfField);
            delRelList.push(delRelItemOfOperator);
          });
        }
      });
      let param = {
        jsonStr: JSON.stringify(delRelList)
      };
      try {
        const response = await dataService.delRecWithCond(param);
        if (response.data.code === 200) {
        }
      } catch (error) {
      }
    },
    // 新增引用记录
    // 修改规则的保存/新增规则的保存
    // 规则被引用之后的修改  新增
    async addRel (ruleSetId, newRuleJson, ruleSetVersion) {
      let addRelList = [];
      newRuleJson.conditionList.forEach(conditionEle => {
        if (conditionEle.settingType === 1) {
          conditionEle.conditionItems.forEach(conditionItemEle => {
            let addRelItemOfField = {
              sourceId: '',
              sourceType: conditionItemEle.fieldSource,
              targetId: ruleSetId,
              targetType: 'RULE_SET',
              targetVersion: ruleSetVersion
            };
            let addRelItemOfOperator = {
              sourceId: '',
              sourceType: 'COMPARATOR_VAR',
              targetId: ruleSetId,
              targetType: 'RULE_SET',
              targetVersion: ruleSetVersion
            };
              // 业务变量库
            if (conditionItemEle.fieldSource === 'BUSINESS_VAR') {
              this.variableFields.forEach(element => {
                if (element.fieldValue === conditionItemEle.fieldValue) {
                  addRelItemOfField.sourceId = element.id;
                }
              });
            }
            // 计算指标库
            if (conditionItemEle.fieldSource === 'CALCULATION_VAR') {
              addRelItemOfField.sourceId = conditionItemEle.fieldValue;
            }
            // 名单库
            if (conditionItemEle.fieldSource === 'LIST_LIB') {
              addRelItemOfField.sourceId = conditionItemEle.fieldValue;
            }
            // 运算符
            this.operator.forEach(element => {
              if (element.compValue === conditionItemEle.operatorValue) {
                addRelItemOfOperator.sourceId = element.id;
              }
            });
            // 业务变量库是枚举 枚举常量库
            if (conditionItemEle.isFieldEnumeration === '1') {
              let addRelItemOfSource = {
                sourceId: '',
                sourceType: 'CALCULATION_VAR ',
                targetId: ruleSetId,
                targetType: 'RULE_SET',
                targetVersion: ruleSetVersion
              };
              conditionItemEle.resultList.forEach(element => {
                if (element.fieldValue === conditionItemEle.resultValue) {
                  addRelItemOfSource.sourceId = element.id;
                }
              });
              addRelList.push(addRelItemOfSource);
            }
            addRelList.push(addRelItemOfField);
            addRelList.push(addRelItemOfOperator);
          });
        }
      });
      let param = {
        jsonStr: JSON.stringify(addRelList)
      };
      try {
        const response = await dataService.addRecord(param);
        if (response.data.code === 200) {
        }
      } catch (error) {
      }
    },
    // 初始化的时候处理不同类型业务变量库和计算指标库对应的不用计算符和阈值选项
    dealDataType () {
      for (let index = 0; index < this.operateRule.ruleJson.conditionList.length; index++) {
        const element = this.operateRule.ruleJson.conditionList[index];
        if (element.settingType === 1) {
          element.conditionItems.forEach(item => {
            item.operatorList = [];
            // 字符串类型和布尔类型运算符只能是等于或者不等于
            if (item.fieldType === 'String' || item.fieldType === 'boolean') {
              this.operator.forEach(operatorItem => {
                if (operatorItem.compName === '等于' || operatorItem.compName === '不等于') {
                  item.operatorList.push(JSON.parse(JSON.stringify(operatorItem)));
                }
              });
            } else {
              item.operatorList = JSON.parse(JSON.stringify(this.operator));
            }
            if (item.fieldSource === 'CALCULATION_VAR' || (item.fieldSource === 'BUSINESS_VAR' && item.isFieldEnumeration === '0')) {
              item.resultList = [];
              // 根据所选的数据类型 阈值下拉框中对应值为不同类型
              if (item.fieldType === 'boolean') {
                item.resultList.push({
                  fieldValue: '',
                  fieldName: '',
                  disabled: true,
                  divider: true
                });
              }
              item.resultList.push({
                fieldValue: 'BUSINESS_VAR',
                fieldName: '业务变量库',
                disabled: true,
                divider: false
              });
              if (this.numberDataTypeList.indexOf(item.fieldType) > -1) {
                this.variableFields.forEach(element => {
                  if (this.numberDataTypeList.indexOf(element.dataType) > -1) {
                    item.resultList.push(element);
                  }
                });
              } else {
                this.variableFields.forEach(element => {
                  if (element.dataType === item.fieldType) {
                    item.resultList.push(element);
                  }
                });
              }
              item.resultList.push({
                fieldValue: '',
                fieldName: '',
                disabled: true,
                divider: true
              }, {
                fieldValue: 'CALCULATION_VAR',
                fieldName: '计算指标库',
                disabled: true,
                divider: false
              });
              if (this.numberDataTypeList.indexOf(item.fieldType) > -1) {
                this.indicators.forEach(indicator => {
                  if (this.numberDataTypeList.indexOf(indicator.dataType) > -1) {
                    let element = {
                      fieldValue: indicator.id,
                      fieldName: indicator.indicName,
                      dataType: indicator.dataType
                    };
                    item.resultList.push(element);
                  }
                });
              } else { // 其他类型的 string boolean Object  阈值下拉框是相同的类型的数据的合集
                this.indicators.forEach(indicator => {
                  if (indicator.dataType === item.fieldType) {
                    let element = {
                      fieldValue: indicator.id,
                      fieldName: indicator.indicName
                    };
                    item.resultList.push(element);
                  }
                });
              }
              // 如果是布尔类型 可选的阈值 增加是否选项
              if (item.fieldType === 'boolean') {
                item.resultList.unshift({
                  fieldValue: 'Boolean',
                  fieldName: '布尔值',
                  disabled: true,
                  divider: false
                }, {
                  fieldName: '是',
                  fieldValue: 'true',
                  srcType: 'INPUT'
                }, {
                  fieldName: '否',
                  fieldValue: 'false',
                  srcType: 'INPUT'
                });
              }
            } else if (item.fieldSource === 'BUSINESS_VAR' && item.isFieldEnumeration === '1') {
              this.variableFields.forEach(element => {
                if (item.fieldValue === element.fieldValue) {
                  item.resultList = element.enumList;
                }
              });
            }
            if (item.resultSource === 'CALCULATION_VAR' || item.resultSource === 'BUSINESS_VAR') {
              this.resultOptions.forEach(resultItem => {
                if (resultItem.fieldValue === item.resultValue) {
                  item.resultValue = JSON.parse(JSON.stringify(resultItem));
                }
              });
            } else if (item.resultText === '是') {
              item.resultValue = {
                fieldName: '是',
                fieldValue: 'true',
                srcType: 'INPUT'
              };
            } else if (item.resultText === '否') {
              item.resultValue = {
                fieldName: '否',
                fieldValue: 'false',
                srcType: 'INPUT'
              };
            }
          });
        }
      }
    }
  },
  created () {
    this.GetVariableField();
    this.GetOperator();
    this.GetIndicators();
    this.getRiskyLabelsList();
    this.getStrategiesList();
    this.getListManage();
    let sStorage = window.sessionStorage;
    this.operatedRuleSet = JSON.parse(sStorage.getItem('ruleSet'));
    this.operateRule = JSON.parse(sStorage.getItem('operateRule'));
    console.log(this.operateRule, 'this.operateRule');
    this.operatedRules = JSON.parse(sStorage.getItem('operatedRules'));
    this.versionId = sStorage.getItem('versionId');
    if (sStorage.getItem('isReferenced') === 'false') {
      this.isReferenced = false;
    } else {
      this.isReferenced = true;
    }
    if (sStorage.getItem('isAddRule') === 'false') {
      this.isAddRule = false;
    } else {
      this.isAddRule = true;
    }
    if (typeof this.operateRule.ruleJson === 'string') {
      this.operateRule.ruleJson = JSON.parse(this.operateRule.ruleJson);
      console.log(this.operateRule.ruleJson, ' this.operateRule.ruleJson ');
    }
    if (typeof this.operateRule.labelId === 'string') {
      if (this.operateRule.labelId) {
        this.operateRule.labelId = this.operateRule.labelId.split(',');
      } else {
        this.operateRule.labelId = [];
      }
    }
    for (let index = 0; index < this.operateRule.ruleJson.conditionList.length; index++) {
      const element = this.operateRule.ruleJson.conditionList[index];
      if (element.settingType === 0) {
        let parms = {
          templateId: element.conditionItems[0].fieldValue
        };
        getTmpListValue(parms).then(res => {
          if (res.data.code === 200) {
            res.data.data.forEach(elementOfParam => {
              element.conditionItems[0].parameters.forEach(paramOfRule => {
                if (elementOfParam.paramValue === paramOfRule.enName) {
                  this.$set(paramOfRule, 'valueList', elementOfParam.valueList);
                }
              });
            });
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        }).catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
      }
    }
    this.oldRuleJson = JSON.parse(sStorage.getItem('operateRule'));
  }
};
</script>
<style lang='stylus' >
.rule-info-item {
    width: 30%
    margin-left: 3%;

     display:flex;
  }
.ruleCheck-info-item-one{
   width: 30%
   margin-left: 3%;
   display:flex;
  margin-bottom:0 !important;
 }
.clear:after {
    content: '\20';
    display: block;
    height: 0;
    clear: both;
}
.middle-align {
    height: 40px;
    line-height: 40px;
    width: 80px;
    margin-bottom:0!important;
  }
  .rule-info-text{
     height: 40px;
    line-height: 40px;
    margin-bottom:0 !important;
  }

.relation-padding {
    padding-left: 0px !important;
  }
.relation-padding >>> .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
    padding: 0 10px;
  }
  .vue-treeselect__control {
    height: 40px !important;
    border: 1px solid rgba(0, 0, 0, 0.24);
  }

  .vue-treeselect__placeholder {
    font-size: 13px;
    line-height: 40px;
  }

  .vue-treeselect__single-value {
    font-size: 13px;
    line-height: 40px;
  }

  .ruleSetAddOrEdit .vue-treeselect__placeholder {
    color: rgba(0, 0, 0, 0.6)
  }

  .itemValue {
    display: inline-block;
    height: 40px;
    line-height: 40px;
  }

  .ruleSetAddOrEdit .v-input__control {
    height: auto !important;
  }

  .ruleSetAddOrEdit .col {
    padding: 0 !important;
  }

  .ruleSetParam .col {
    padding: 0 !important;
    padding-left: 12px !important;
  }
  .v-data-table--fixed-header thead tr th:nth-child(1) {
    z-index: 0
  }

  .v-data-table--fixed-header thead tr th:nth-child(2) {
    z-index: 0
  }

  .v-data-table--fixed-header thead tr th:nth-child(3) {
    z-index: 0
  }

  .v-data-table--fixed-header thead tr th:nth-child(4) {
    z-index: 0
  }

  .theme--light.v-chip:not(.v-chip--active) {
    background-color: transparent !important;
  }

  .tempParamName {
    padding-left: 150px;
    margin-top: 20px;
    font-weight: 700
  }

  .tempParamItem {
    padding-left: 40px;
    margin-top: 20px
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

  .questionMark {
    margin-left: 16px;
    cursor: pointer;
  }

  .Rule-setting .v-expansion-panel-content__wrap {
    padding-bottom: 30px
  }

  .v-expansion-panel-header {
    padding: 10px 24px;
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
  padding:10px
}
.rule-condition .value{
  width:30%;
  margin-left:1%
}
.rule-condition .comp{
  margin-left:1%;
  width:15%
}
.rule-condition .result{
  margin-left:1%;
  width:28%
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
    width:18%;
  }
  .rule-condition .relation{
  width:8%
  }
 .rule-condition .add-del{
   width:8%;
   margin-left:1%;
  }
 .rule-condition .result{
  width:17%
}
}
// 宽度1280和1360之间
@media all and (min-width: 1280px) and (max-width: 1360px) {
   .rule-condition .value{
    width:29%;
  }
  .rule-condition .relation{
   width:8%
  }
 .rule-condition .add-del{
   width:6%;
   margin-left:1%;
  }
  .rule-condition .result{
  width:19%
}
}
// 宽度1360和1680之间
@media all and (min-width: 1360px) and (max-width: 1680px) {
 .rule-condition .value{
    width:24%;
  }
  .rule-condition .result{
  width:20%
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
    width:26%;
  }
  .rule-condition .result{
  width:26%
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
    width:28%;
  }
  .rule-condition .result{
  width:27%
 }
  .rule-condition .comp{
  width:9%
}
}
.fr{
    float:right
  }
.v-expansion-panel-content__wrap:{
    padding:0px !important
  }
.group-temp .activeUserDef{
    color: var(--v-primary-base) !important;

  }
#temps .v-radio{
    height:40px;
    width:90%;
    margin-left:10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.24);

  }
#temps  .v-input__control{
   width:100%;
   height:auto

  }
  .v-expansion-panel-header--active{
        background-color: white !important;

  }
  .v-chip{
  margin:0 !important
}

.group-temp .activeUserDef{
    color: var(--v-primary-base) !important;

  }
#temps .v-radio{
    height:40px;
    width:90%;
    margin-left:10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.24);

  }
#temps  .v-input__control{
   width:100%;
   height:auto

  }
  #temps .v-radio .mdi:before {
  font-size: 18px;
}
#temps .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner,
#calculateIndexDetails_tempGroup .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
  margin-top: 4px;
}
#temps .v-radio .v-input--selection-controls__ripple {
  color: #4473DA;
}
#temps .v-radio .v-label {
  left: 46px !important;
  color: #333333;
}
#temps .v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot {
  min-height: 30px !important;
}
#temps .v-text-field--outlined.v-input--dense .v-label {
  top: 7px;
}
#calculateIndexDetails_tempGroup .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
  margin-top: 4px;
}
#calculateIndexDetails_tempGroup .v-input--hide-details > .v-input__control > .v-input__slot {
  height: 30px;
}
#calculateIndexDetails_tempGroup .v-text-field {
  margin-top: 0;
}
#calculateIndexDetails_tempGroup .v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
  height: 30px;
}
#calculateIndexDetails_tempGroup .v-data-table td {
  padding: 0;
}
.calculateIndexDetails_searchIcon .theme--light.mdi-magnify {
  color: #4473DA;
}
.tempGroupTableTr {
  color: #26344B;
}
.group-temp .activeUserDef{
  color: var(--v-primary-base) !important;
}
.tempGroupTableTr {
  color: #26344B;
}
.el-border-defu {
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: #D9D9D9;
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

 .rule-condition-item .v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--full-width > .v-input__control > .v-input__slot, .v-text-field--outlined > .v-input__control > .v-input__slot {
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: center;
    min-height: 40px;
}

.v-application--is-ltr .v-text-field .v-input__append-inner{display:none!important;}
</style>
