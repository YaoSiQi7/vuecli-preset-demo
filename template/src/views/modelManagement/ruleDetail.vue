<template>
  <div class="rules-content">
    <!-- 保存取消 -->
    <div class="mb-3" style="height: 60px">
      <v-card :class="['mb-3', isFixed ? 'fixed' : '']">
        <v-card-actions style="height: 60px">
          <v-btn
            color="primary"
            class="ml-4"
            @click="confirmAddRule"
            :disabled="!ruleValid || ruleSetStatus==='5'"
            >保存</v-btn
          >
          <v-btn class="ml-4 cancelButton" @click="cancelAddRule" outlined
            >取消</v-btn
          >
        </v-card-actions>
      </v-card>
    </div>
    <!-- 规则基本信息 -->
    <v-card class="mb-3">
      <v-card-text style="padding-bottom: 0">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom: 20px">规则基本信息</h3>
              <v-form ref="ruleForm" v-model="ruleValid" lazy-validation>
                <div>
                  <v-row>
                    <div class="rule-info-item-one">
                      <div style="float: left" class="middle-align">
                        规则编号：
                      </div>
                      <v-text-field
                        v-model.trim="operateRule.ruleNo"
                        outlined
                        dense
                        type="text"
                        required
                        :rules="ruleNoRule"
                        :disabled = "ruleSetStatus==='5'"
                      ></v-text-field>
                    </div>
                    <div class="rule-info-item-one">
                      <div style="float: left" class="middle-align">
                        规则名称*：
                      </div>
                      <v-text-field
                        v-model.trim="operateRule.ruleName"
                        outlined
                        dense
                        type="text"
                        :rules="ruleNameRule"
                        :disabled = "ruleSetStatus==='5'"
                      ></v-text-field>
                    </div>
                    <div class="rule-info-item-one">
                      <div style="float: left" class="middle-align">标签：</div>
                      <v-select
                        v-model="operateRule.labelId"
                        :items="riskyLabels"
                        item-text="paramName"
                        item-value="id"
                        multiple
                        required
                        outlined
                        dense
                        no-data-text="没有数据"
                        :rules="labelRules"
                        :disabled = "ruleSetStatus==='5'"
                      >
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="index === 0">
                            <span>{{ item.paramName }}</span>
                          </v-chip>
                          <span v-if="index === 1" class="grey--text caption"
                            >(+{{ operateRule.labelId.length - 1 }} 更多)</span
                          >
                        </template>
                      </v-select>
                    </div>
                  </v-row>
                  <v-row>
                    <div
                      class="rule-info-item"
                      v-show="operatedRuleSet.matchingModel !== 'SCORE_MATCH'"
                    >
                      <div style="float: left" class="middle-align">
                        处置策略*：
                      </div>
                      <v-select
                        v-model="operateRule.strategy"
                        :rules="[v => !!v || '不能为空']"
                        :items="strategies"
                        item-text="paramName"
                        item-value="id"
                        outlined
                        dense
                        no-data-text="没有数据"
                        :disabled = "ruleSetStatus==='5'"
                      />
                    </div>
                    <div
                      class="rule-info-item"
                      v-show="operatedRuleSet.matchingModel === 'SCORE_MATCH'"
                    >
                      <div style="float: left" class="middle-align">
                        权重*：
                      </div>
                      <v-text-field
                        v-model.trim="operateRule.weights"
                        required
                        :rules="weightRule"
                        outlined
                        dense
                        :disabled = "ruleSetStatus==='5'"
                      />
                    </div>
                    <div class="rule-info-item">
                      <div style="float: left" class="middle-align">
                        启用时间：
                      </div>
                      <datetime-picker
                        v-model="operateRule.enableTime"
                        time-format="HH:mm:ss"
                        :type="dateTypeStart"
                        :valid-time="operateRule.invalidTime"
                        @clear="operateRule.enableTime = ''"
                        :text-field-props="textFieldProps"
                        :date-picker-props="dateProps"
                        :time-picker-props="timeProps"
                        placeholder="不填写时，默认保存后即时生效"
                        :disabled = "ruleSetStatus==='5'"
                      />
                    </div>
                    <div class="rule-info-item">
                      <div style="float: left" class="middle-align">
                        失效时间：
                      </div>
                      <datetime-picker
                        v-model="operateRule.invalidTime"
                        time-format="HH:mm:ss"
                        :type="dateTypeEnd"
                        :valid-time="operateRule.enableTime"
                        @clear="operateRule.invalidTime = ''"
                        :text-field-props="textFieldProps"
                        :date-picker-props="dateProps"
                        :time-picker-props="timeProps"
                        placeholder="不填写时，默认永久有效"
                        :disabled = "ruleSetStatus==='5'"
                      />
                    </div>
                  </v-row>
                  <v-row>
                    <div
                      class="rule-info-item"
                      v-show="operatedRuleSet.matchingModel !== 'SCORE_MATCH'"
                    >
                      <div style="float: left" class="middle-align">
                        优先级：
                      </div>
                      <v-text-field
                        v-model="operateRule.priorityLevel"
                        type="text"
                        outlined
                        dense
                        :rules="weightRule"
                        placeholder="数字越大，优先级越高"
                        :disabled = "ruleSetStatus==='5'"
                      />
                    </div>
                    <div class="rule-info-item">
                      <div style="float: left" class="middle-align">
                        规则描述：
                      </div>
                      <v-text-field
                        v-model.trim="operateRule.comment"
                        outlined
                        dense
                        type="text"
                        :disabled = "ruleSetStatus==='5'"
                      ></v-text-field>
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
      <v-card-text style="padding-bottom: 0">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom: 20px">规则配置</h3>
              <div>
                <v-btn
                  color="primary"
                  class="ma-2 white--text"
                  :disabled = "ruleSetStatus==='5'"
                  @click="selectSettingType(0)"
                >
                  <v-icon left>add</v-icon>
                  新增配置条件
                </v-btn>

                <v-btn
                  color="primary"
                  class="ma-2 white--text"
                  :disabled = "ruleSetStatus==='5'"
                  @click="selectSettingType(1)"
                >
                  <v-icon left>add</v-icon>
                  新增模板条件
                </v-btn>

                <v-btn
                  color="primary"
                  class="ma-2 white--text"
                  :disabled = "ruleSetStatus==='5'"
                  @click="selectSettingType(2)"
                >
                  <v-icon left>add</v-icon>
                  新增脚本条件
                </v-btn>

                <v-btn
                  color="primary"
                  class="ma-2 white--text"
                  :disabled = "ruleSetStatus==='5'"
                  @click="selectSettingType(3)"
                >
                  <v-icon left>add</v-icon>
                  新增算法条件
                </v-btn>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-text
        v-show="
          operateRule.ruleJson.conditionList &&
            operateRule.ruleJson.conditionList.length
        "
        style="padding-top: 0"
      >
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-expansion-panels multiple accordion focusable v-model="panel">
                <v-expansion-panel
                  v-for="(operateItem, operateIndex) in operateRule.ruleJson
                    .conditionList"
                  :key="'operateItem' + operateIndex"
                >
                  <v-expansion-panel-header>
                    <template>
                      <v-row>
                        <div class="logic-title">
                          条件{{String.fromCharCode(64 + parseInt(operateIndex + 1)) }}
                          <v-icon
                            style="margin-left: 10px"
                            size="30"
                            color="primary"
                            @click.stop="delcondition(operateIndex)"
                            :disabled = "ruleSetStatus==='5'"
                            >mdi-delete
                          </v-icon>
                        </div>
                        <v-divider class="mx-4" vertical></v-divider>
                        <div style="width: 60%">
                          <v-text-field
                            @click.stop="operateItemConditionDes"
                            v-model.trim="operateItem.conditionDes"
                            outlined
                            dense
                            clearable
                            type="text"
                            placeholder="请输入条件描述"
                            :rules="conditionDescRule"
                            :disabled = "ruleSetStatus==='5'"
                          ></v-text-field>
                        </div>
                        <div class="out-div">
                          <div class="arrow"></div>
                          <span v-show="operateItem.settingType === 1">类别：配置条件</span>
                          <span v-show="operateItem.settingType === 0">类别：模板条件</span>
                        </div>
                      </v-row>
                    </template>
                  </v-expansion-panel-header>
                  <!--模板名称-->
                  <div class="temp-name" v-if="operateItem.settingType === 0">
                      <span class="circle"></span>所属模板：{{operateItem.conditionItems[0].fieldText}}
                  </div>
                  <div class="temp-name" v-if="operateItem.settingType === 0 && operateItem.conditionItems[0].fieldDescription">
                      <span class="circle"></span>模板描述：{{operateItem.conditionItems[0].fieldDescription}}
                  </div>
                  <!-- 模板配置规则 -->
                  <v-expansion-panel-content
                    v-if="operateItem.settingType === 0"
                  >

                    <div class="tempParamItems">
                      <div
                        class="tempParamItem"
                        v-for="(item, index) in operateItem.conditionItems[0].parameters"
                        :key="index"
                      >
                        <span class="circle"></span>
                        <span class="name">{{ item.cnName }}</span>
                        <span class="value">
                          <v-autocomplete
                            v-if="item.src === 'select'"
                            :items="item.valueList"
                            item-text="label"
                            item-value="id"
                            placeholder="请选择"
                            no-data-text="没有匹配数据"
                            outlined
                            dense
                            v-model="item.value.value"
                            :disabled = "ruleSetStatus==='5'"
                            @change="
                              ruleTempParamChange(operateIndex, index, item)
                            "
                          />
                          <v-text-field
                            v-if="item.src === 'input'"
                            style="disply: inline"
                            placeholder="请输入"
                            outlined
                            dense
                            :disabled = "ruleSetStatus==='5'"
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
                                :disabled = "ruleSetStatus==='5'"
                                >mdi-help-circle</v-icon
                              >
                            </template>
                            <span>{{ item.description || "无说明" }}</span>
                          </v-tooltip>
                        </span>
                      </div>
                    </div>
                  </v-expansion-panel-content>
                  <!-- 条件配置规则 -->
                  <v-expansion-panel-content
                    v-if="operateItem.settingType === 1"
                  >
                    <v-list class="clear rule-condition" style="margin-left: 0">
                      <div
                        v-for="(item, index) in operateItem.conditionItems"
                        :key="'operateItem' + index"
                        class="clear rule-condition-item"
                      >
                        <div class="fl lib">
                          <v-btn-toggle
                            color="primary"
                            v-model="item.fieldSource"
                            @change="toggleButton(operateIndex, index)"
                          >
                            <v-btn :disabled = "ruleSetStatus==='5'" value="BUSINESS_VAR">业务变量库</v-btn>
                            <v-btn :disabled = "ruleSetStatus==='5'" value="CALCULATION_VAR">计算指标库</v-btn>
                            <v-btn :disabled = "ruleSetStatus==='5'" value="LIST_LIB">名单库</v-btn>
                          </v-btn-toggle>
                        </div>
                        <div class="fl value">
                          <v-autocomplete
                            v-model="item.fieldValue"
                            v-show="item.fieldSource === 'BUSINESS_VAR'"
                            placeholder="业务变量库"
                            :items="variableFields"
                            item-text="fieldName"
                            item-value="fieldValue"
                            :rules="[v => !!v || '不能为空或只有空格']"
                            outlined
                            dense
                            @change="variableChange(operateIndex, index, item)"
                            no-data-text="没有数据"
                            :menu-props="{ auto: true, overflowY: true }"
                            :disabled = "ruleSetStatus==='5'"
                          />
                          <v-autocomplete
                            v-show="item.fieldSource === 'CALCULATION_VAR'"
                            v-model="item.fieldValue"
                            placeholder="计算指标库"
                            :items="indicators"
                            item-text="indicName"
                            item-value="id"
                            :rules="[v => !!v || '不能为空或只有空格']"
                            outlined
                            dense
                            @change="indicatorsChange(item)"
                            no-data-text="没有数据"
                            :menu-props="{ auto: true, overflowY: true }"
                            :disabled = "ruleSetStatus==='5'"
                          />
                          <v-autocomplete
                            v-show="item.fieldSource === 'LIST_LIB'"
                            placeholder="名单库"
                            v-model="item.fieldValue"
                            :items="libraryList"
                            item-text="listName"
                            item-value="id"
                            :rules="[v => !!v || '不能为空或只有空格']"
                            outlined
                            dense
                            @change="listLibraryChange(item)"
                            no-data-text="没有数据"
                            :menu-props="{ auto: true, overflowY: true }"
                            :disabled = "ruleSetStatus==='5'"
                          />
                        </div>
                        <div class="fl comp">
                          <v-autocomplete
                            v-model="item.operatorValue"
                            :items="item.operatorList"
                            item-text="compName"
                            item-value="compValue"
                            placeholder="比较符"
                            :rules="[v => !!v || '不能为空或只有空格']"
                            outlined
                            dense
                            :disabled="item.fieldSource === 'LIST_LIB' || ruleSetStatus==='5'"
                            @change="operatorChange(item)"
                            no-data-text="没有数据"
                            :menu-props="{ auto: true, overflowY: true }"
                          />
                        </div>
                        <div class="fl result">
                          <v-combobox
                            v-if="
                              (item.fieldSource === 'BUSINESS_VAR' &&
                                item.isFieldEnumeration !== '1') ||
                                item.fieldSource === 'CALCULATION_VAR'
                            "
                            v-model.trim="item.resultValue"
                            :items="item.resultList"
                            item-text="fieldName"
                            item-value="fieldValue"
                            placeholder="比较值"
                            no-data-text="没有数据"
                            outlined
                            dense
                            @change="resultSelectChange(item)"
                            :menu-props="{ auto: true, overflowY: true }"
                            :disabled = "ruleSetStatus==='5'"
                          ></v-combobox>
                          <v-autocomplete
                            v-if="
                              item.fieldSource === 'BUSINESS_VAR' &&
                                item.isFieldEnumeration === '1'
                            "
                            v-model.trim="item.resultValue"
                            :items="item.resultList"
                            item-text="fieldName"
                            item-value="fieldValue"
                            :rules="[v => !!v || '不能为空或只有空格']"
                            label="枚举值"
                            outlined
                            dense
                            @change="resultEnumerationSelectChange(item)"
                            no-data-text="没有数据"
                            :menu-props="{ auto: true, overflowY: true }"
                            :disabled = "ruleSetStatus==='5'"
                          />
                          <v-autocomplete
                            v-if="item.fieldSource === 'LIST_LIB'"
                            v-model="item.resultValue"
                            :items="libraryListResults"
                            item-text="text"
                            item-value="value"
                            :rules="[v => !!v || '不能为空或只有空格']"
                            outlined
                            dense
                            label="枚举值"
                            @change="libraryListResultsChange(item)"
                            no-data-text="没有数据"
                            :menu-props="{ auto: true, overflowY: true }"
                            :disabled = "ruleSetStatus==='5'"
                          />
                        </div>
                        <div class="fl relation">
                          <v-autocomplete
                            v-show="
                              operateItem.conditionItems.length > 1 &&
                                index !== operateItem.conditionItems.length - 1
                            "
                            v-model="item.conditionItemRelation"
                            :items="conditionItemRelations"
                            item-text="text"
                            item-value="value"
                            outlined
                            dense
                            no-data-text="没有数据"
                            :menu-props="{ auto: true, overflowY: true }"
                            :disabled = "ruleSetStatus==='5'"
                          />
                        </div>
                        <div class="fr add-del">
                          <v-icon
                            size="30"
                            color="primary"
                            style="height: 40px; float: left"
                            @click.stop="delOperateItems(operateIndex, index)"
                            v-show="operateItem.conditionItems.length > 1"
                            :disabled = "ruleSetStatus==='5'"
                            >mdi-delete
                          </v-icon>
                          <v-icon
                            color="primary"
                            style="height: 40px; float: left"
                            @click="addOperateItems(operateIndex, index)"
                            :disabled = "ruleSetStatus==='5'"
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
    <!--条件逻辑关系 -->
    <v-card class="mb-3">
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom: 20px">条件逻辑关系</h3>
              <div class="logicalRelationship">
                <v-radio-group
                  v-model="operateRule.ruleJson.logicalRelationship"
                  style="float: left"
                  row
                  :disabled="ruleSetStatus==='5'"
                >
                  <v-radio
                    v-for="(item, index) in logicalRelationship"
                    :key="'logicalRelationship' + index"
                    :label="item.label"
                    :value="item.value"
                    color="primary"
                  />
                </v-radio-group>
              </div>
              <div class="logicalRelationshipReview">
                <v-row
                  v-if="operateRule.ruleJson.logicalRelationship === 'random'"
                >
                  <div class="fl" style="margin-left: 10px">
                    自定义规则条件逻辑关系:
                  </div>
                  <div class="fl" style="margin-left: 20px">
                    <v-text-field
                      v-model.trim="
                        operateRule.ruleJson.customizeLogicalRelation
                      "
                      placeholder="请输入逻辑关系"
                      outlined
                      dense
                      type="text"
                      :disabled="ruleSetStatus==='5'"
                    ></v-text-field>
                    <!-- <div class="pt-4">使用条件序号加上（）、且、或， 来拼接表达式，例如（A且B且C）或D。括号内不支持且和或同时存在</div> -->
                    <div class="pt-4">
                      使用条件序号加上（）、且、或，
                      来拼接表达式，例如（A且B且C）或D。
                    </div>
                  </div>
                </v-row>
                <v-row v-else style="margin-left: 0px">
                  <div style="height: 40px; line-height: 40px">
                    动态预览规则条件逻辑关系:
                  </div>
                  <div
                    v-for="(operateItem, operateIndex) in operateRule.ruleJson
                      .conditionList"
                    :key="operateIndex"
                  >
                    <span
                      style="
                        display: inline-block;
                        color: var(--v-primary-base);
                        height: 40px;
                        margin-left: 5px;
                        line-height: 40px;
                      "
                      >条件{{
                        String.fromCharCode(64 + parseInt(operateIndex + 1))
                      }}</span
                    >
                    <span
                      style="margin-left: 5px; color: var(--v-primary-base)"
                      v-if="
                        operateRule.ruleJson.logicalRelationship === 'and' &&
                          operateIndex !==
                            operateRule.ruleJson.conditionList.length - 1
                      "
                      >且</span
                    >
                    <span
                      style="margin-left: 5px; color: var(--v-primary-base)"
                      v-if="
                        operateRule.ruleJson.logicalRelationship === 'or' &&
                          operateIndex !==
                            operateRule.ruleJson.conditionList.length - 1
                      "
                      >或</span
                    >
                  </div>
                </v-row>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
    <!-- 执行配置-->
    <v-card class="mb-3">
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom:20px">执行配置</h3>
              <div class="addConfigure">
                <v-btn color="primary" class="mr-1  mt-1" @click='addConfigure' :disabled="operateRule.executeConfigureJson.length >= 3">新增执行配置</v-btn>
              </div>
              <div class="configure rule-condition rule-condition-item"
                   v-for="(configureItem,configureIndex) in operateRule.executeConfigureJson"
                   :key="'configureItem'+configureIndex">
               <div class="fl value">
                  <v-autocomplete
                    v-model="configureItem.fieldValue"
                    placeholder="请选择"
                    :items="configureItem.ListLeft"
                    item-text="fieldName"
                    item-value="fieldValue"
                    :rules="[v => !!v || '不能为空或只有空格']"
                    outlined
                    dense
                    clearable
                    no-data-text="没有数据"
                    :menu-props="{auto: true, overflowY: true}"
                    @clear = "configurefieldClear(configureIndex,configureItem)"
                    @change="configurefieldChange(configureIndex,configureItem)"
                  />
                </div>
                <div class="fl comp">
                  <v-autocomplete
                    v-model="configureItem.operatorValue"
                    :items="operator"
                    item-text="compName"
                    item-value="compValue"
                    placeholder="比较符"
                    :rules="[v => !!v || '不能为空或只有空格']"
                    outlined
                    dense
                    disabled
                    no-data-text="没有数据"
                    :menu-props="{auto: true, overflowY: true}"
                  />
                </div>
                <div class="fl result">
                 <v-text-field
                    v-model.trim="configureItem.resultValue"
                    placeholder="请输入"
                    solo
                    flat
                    dense
                    outlined
                    @change="configureResultChange(configureItem)"
                  />
                </div>
                <div class="fl add-del" >
                    <v-icon
                      size="30"
                      color="primary"
                      style="height:40px;float:left"
                      @click.stop="delconfigureItems(configureIndex)"
                    >mdi-delete
                    </v-icon>
                </div>
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
          <div class="flex-grow-1" />
          <v-btn icon>
            <v-icon @click="cancelRuleTemp">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="padding: 0; overflow: hidden">
          <v-row style="margin: 0">
            <v-col
              cols="4"
              class="group-temp"
              id="calculateIndexDetails_tempGroup"
              style="
                background-color: var(--v-tableRowHoverActive-base);
                border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                border-right: 1px solid rgba(0, 0, 0, 0.12);
                padding-top: 11px;
                padding-right: 0;
              "
            >
              <v-card-title
                class="calculateIndexDetails_searchIcon"
                style="padding: 0 36px 0 4px"
              >
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
                style="
                  background-color: var(--v-tableRowHoverActive-base);
                  padding-left: 9px;
                "
              >
                <template v-slot:body="{ items }">
                  <tr
                    v-for="(item, index) in items"
                    :key="index"
                    class="tempGroupTableTr el-tr-defu"
                    :class="{ activeUserDef: index == activeGroup }"
                    @click="tempGroupClick(item, index)"
                  >
                    <td
                      class="el-border-defu"
                      style="font-weight: bold; border: 0"
                    >
                      {{ item.templateGroupName }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
            <v-col
              cols="8"
              id="temps"
              style="
                border-bottom: 1px solid rgba(0, 0, 0, 0.12);
                padding: 11px 0px 12px 10px;
              "
            >
              <v-card-title
                class="calculateIndexDetails_searchIcon"
                style="
                  width: 213.66px;
                  padding: 0;
                  margin-left: 10px;
                  padding-bottom: 8px;
                "
              >
                <v-text-field
                  v-model="searchForTemp"
                  append-icon="mdi-magnify"
                  label="请输入模板名称"
                  hide-details
                  outlined
                  dense
                />
              </v-card-title>
              <div
                style="
                  margin-left: 10px;
                  border-top: 1px solid #ededed;
                  margin-right: 20px;
                "
              ></div>
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
          <div class="flex-grow-1" />
          <v-btn style="mr-5" @click="cancelRuleTemp()">取消</v-btn>
          <v-btn color="primary" class="mr-5" @click="saveRuleTemp()"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import * as dataService from 'api/ruleSet';
import {
  getList,
  getListTmp,
  getTmpListValue,
  getTmpPraList
} from '../../api/ruleTempLib.js';
import delDialog from '@c/DelDialog';
import DatetimePicker from '@c/DateTimePicker';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  name: 'ruleSet',
  components: {
    DatetimePicker
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
        v =>
          /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/.test(
            v
          ) || '不能包含特殊字符'
      ],
      ruleNameRule: [
        v => !!v || '不能为空或只有空格',
        v => !/^\s/.test(v) || '不能为空',
        v => (v && v.length <= 200) || '最多只能输入200个字符'
      ],
      weightRule: [
        v => !!v || '不能为空',
        v => !/^\s/.test(v) || '不能为空',
        v => /^[+]{0,1}(\d+)$/.test(v) || '必须为正整数'
      ],
      conditionDescRule: [v => v.length <= 100 || '最多只能输入100个字符'],
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
        },
        executeConfigureJson: []
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
      // 当前版本号
      versionNum: '',
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
      tempHeader: [
        {
          text: '模板名称',
          value: 'templateName',
          sortable: false,
          width: 100
        }
      ],
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
      numberDataTypeList: ['int', 'double', 'float', 'long'],
      saveStates: null,
      // 是否需要审核
      isNeedAudit: '',
      ruleEditFlag: '',
      // 规则集模式
      ruleSetPattern: '',
      // 规则集状态
      ruleSetStatus: '',
      // isdelRecWithCond: ''// 是否调用删除引用
      // 执行配置左侧
      executeConfigureListLeft: [
        {
          fieldName: '账户风险监测',
          fieldValue: 'Account_Risk_Detection'
        },
        {
          fieldName: '商户风险监测',
          fieldValue: 'Merchant_Risk_Detection'

        },
        {
          fieldName: '企业风险监测',
          fieldValue: 'Enterprise_Risk_Detection'
        }
      ]
    };
  },
  computed: {
    canResolveItem () {
      return (
        this.isIndicatorReady &&
        this.isVariableFieldReady &&
        this.isOperatorReady
      );
    }
  },
  watch: {
    searchForTemp (val) {
      this.searchTemps = [];
      if (val) {
        this.tempItem.forEach(element => {
          if (
            element.templateName.indexOf(val) >= 0 ||
            element.templateName === val
          ) {
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
    // for (let index = 0; index < this.operateRule.ruleJson.conditionList.length; index++) {
    //   const element = this.operateRule.ruleJson.conditionList[index];
    //   if (element.settingType === 1) {
    //   }
    // }
  },
  methods: {
    // 头部fixed定位
    fixedBtnBox () {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 72) {
        // 当页面滚动到高度72px处，动态绑定class 来设置头部固定定位
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
      } catch (error) {}
    },
    // 获取处置策略
    async getStrategiesList () {
      const params = {
        identifier: 'sys_strategy'
      };
      try {
        const response = await dataService.getAllTradeType(params);
        this.strategies = response.data.data;
      } catch (error) {}
    },
    // 确定保存规则的按钮 ,分新增和编辑两种情况
    async confirmAddRule () {
      if (
        this.operateRule.invalidTime &&
        this.operateRule.enableTime &&
        new Date(this.operateRule.invalidTime).getTime() <
          new Date(this.operateRule.enableTime).getTime()
      ) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '启用时间应小于失效时间';
        this.snackbarServeColor = 'error';
        return;
      }
      // 如果不能点击直接 return
      if (!this.canSave) {
        return;
      }
      for (let index = 0; index < this.operatedRules.length; index++) {
        const element = this.operatedRules[index];
        if (
          element.ruleName === this.operateRule.ruleName &&
          element.id !== this.operateRule.id
        ) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '规则名称重复，请修改';
          this.snackbarServeColor = 'error';
          return;
        }
        if (this.operateRule.ruleNo) {
          if (
            element.ruleNo === this.operateRule.ruleNo &&
            element.id !== this.operateRule.id
          ) {
            this.snackbarServe = true;
            this.snackbarServeMsg = '规则编号重复，请修改';
            this.snackbarServeColor = 'error';
            return;
          }
        }
      }
      // 规则名称不能为空
      if (!this.operateRule.ruleName) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '规则名称不能为空';
        this.snackbarServeColor = 'error';
        return;
      }
      // 评分模式风险权重不能为空
      if (
        this.operatedRuleSet.matchingModel === 'SCORE_MATCH' &&
        !this.operateRule.weights
      ) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '风险权重不能为空';
        this.snackbarServeColor = 'error';
        return;
      }
      // 匹配模式处置策略不能为空
      if (
        this.operatedRuleSet.matchingModel !== 'SCORE_MATCH' &&
        !this.operateRule.strategy
      ) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '处置策略不能为空';
        this.snackbarServeColor = 'error';
        return;
      }
      // 逻辑关系不能为空
      if (!this.operateRule.ruleJson.logicalRelationship) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '逻辑关系不能为空';
        this.snackbarServeColor = 'error';
        return;
      }
      // 失效时间转换
      if (
        this.operateRule.enableTime &&
        typeof this.operateRule.enableTime !== 'string'
      ) {
        this.operateRule.enableTime = this.myGetDate(
          this.operateRule.enableTime
        );
      }
      // 启用时间转换
      if (
        this.operateRule.invalidTime &&
        typeof this.operateRule.invalidTime !== 'string'
      ) {
        this.operateRule.invalidTime = this.myGetDate(
          this.operateRule.invalidTime
        );
      }
      // 规则不能为空
      if (this.operateRule.ruleJson.conditionList.length <= 0) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请配置规则';
        this.snackbarServeColor = 'error';
        return;
      }
      // 1、条件配置参数值不能为空  2、模板配置valueList删除 3.条件配置的描述长度超过100或者有特殊字符的情况不能保存
      for (
        let index = 0;
        index < this.operateRule.ruleJson.conditionList.length;
        index++
      ) {
        const element = this.operateRule.ruleJson.conditionList[index];
        if (element.conditionDes.length > 100) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '条件描述的长度不能大于100';
          this.snackbarServeColor = 'error';
          return;
        }
        element.filterSign = String.fromCharCode(64 + parseInt(index + 1));
        if (element.settingType === 1) {
          for (
            let itemIndex = 0;
            itemIndex < element.conditionItems.length;
            itemIndex++
          ) {
            const itemElement = element.conditionItems[itemIndex];
            if (!itemElement.fieldValue) {
              this.snackbarServe = true;
              this.snackbarServeMsg = '参数值不能为空';
              this.snackbarServeColor = 'error';
              return;
            }
            if (!itemElement.operatorValue) {
              this.snackbarServe = true;
              this.snackbarServeMsg = '运算符不能为空';
              this.snackbarServeColor = 'error';
              return;
            }
            if (!itemElement.resultValue) {
              this.snackbarServe = true;
              this.snackbarServeMsg = '参数值不能为空';
              this.snackbarServeColor = 'error';
              return;
            }
          }
        }
        if (element.settingType === 0) {
          element.conditionItems[0].parameters.forEach(element => {
            delete element.valueList;
          });
        }
      }
      let paramOperateRule = JSON.parse(JSON.stringify(this.operateRule));
      // 删除条件配置的规则 每条的运算符和阈值可选值  resultValue
      paramOperateRule.ruleJson.conditionList.forEach(condition => {
        if (condition.settingType === 1) {
          condition.conditionItems.forEach(conditionItem => {
            conditionItem.operatorList = [];
            conditionItem.resultList = [];
            if (typeof conditionItem.resultValue === 'object') {
              conditionItem.resultValue = conditionItem.resultValue.fieldValue;
            }
          });
        }
      });
      // 执行配置验证
      if (paramOperateRule.executeConfigureJson.length) {
        for (let index = 0; index < paramOperateRule.executeConfigureJson.length; index++) {
          let configure = paramOperateRule.executeConfigureJson[index];
          if (configure.operatorList) {
            delete configure.operatorList;
          }
          if (!configure.fieldValue || !configure.resultValue) {
            this.snackbarServe = true;
            this.snackbarServeMsg = '执行配置参数值不能为空';
            this.snackbarServeColor = 'error';
            return;
          }
        }
      }

      paramOperateRule.executeConfigureJson = JSON.stringify(paramOperateRule.executeConfigureJson);
      this.operateRule.ruleJson.conditionList.forEach(condition => {
        if (condition.settingType === 1) {
          condition.conditionItems.forEach(conditionItem => {
            conditionItem.operatorList = [];
            conditionItem.resultList = [];
            if (typeof conditionItem.resultValue === 'object') {
              conditionItem.resultValue = conditionItem.resultValue.fieldValue;
            }
          });
        }
      });
      let isUpgrade;
      // 1.1、安全模式且被引用,需要升级
      if (this.ruleSetPattern === '1' && this.isReferenced) {
        isUpgrade = true;
      }
      // 1.2、安全模式且没被引用状态是已输出(已输出 === 需要审核且审核通过) === 安全模式&&没被引用&&需审核&&审核通过
      if (this.ruleSetPattern === '1' && !this.isReferenced && this.isNeedAudit === '1' && this.ruleSetStatus === '1') {
        isUpgrade = true;
      }
      // 2.1、安全模式且没被引用且状态是待审核、驳回、已输出(不需要审核)
      if (this.ruleSetPattern === '1' && !this.isReferenced && (this.ruleSetStatus === '4' || this.ruleSetStatus === '6' || (this.ruleSetStatus === '1' && this.isNeedAudit === '0'))) {
        isUpgrade = false;
      }
      // 2.2、调试模式不升版
      if (this.ruleSetPattern === '0') {
        isUpgrade = false;
      }
      // 不需要升版
      if (!isUpgrade) {
        // 规则集版本赋值
        paramOperateRule.rulesetHistoryId = this.versionId;
        // 先保存一下规则列表
        let ruleList = [];
        this.operatedRules.forEach(element => {
          ruleList.push({
            id: element.id,
            states: element.states
          });
        });
        let riskThreshold = '';
        if (typeof this.operatedRuleSet.riskThreshold === 'object') {
          riskThreshold = JSON.stringify(this.operatedRuleSet.riskThreshold);
        }
        const setParam = {
          id: this.operatedRuleSet.id,
          setNo: this.operatedRuleSet.setNo,
          setName: this.operatedRuleSet.setName,
          organizationId: this.operatedRuleSet.organizationId,
          appId: this.operatedRuleSet.appId,
          transactionTypeId: this.operatedRuleSet.transactionTypeId,
          matchingModel: this.operatedRuleSet.matchinmodel,
          riskThreshold: riskThreshold,
          version: parseInt(this.operatedRuleSet.version / 1),
          ruleList: JSON.stringify(ruleList),
          states: this.isNeedAudit === '0' ? '1' : '4' // 配置完规则后，根据是否审核的状态来返回列表状态  0 不需要审核 ---1（已输出） 4（待审核）
        };
        try {
          const response = await dataService.modifyRuleSet(setParam);
          const code = response.data.code;
          if (code > 0) {
          }
        } catch (error) {
        };
        // this.isNeedAudit==='0'?setParam.states='1':
        let resRuleData = await dataService.modifyRuleSet(setParam);
        if (resRuleData.data.code === 200) {
          this.ruleEditFlag = '1';
        }

        if (typeof paramOperateRule.ruleJson !== 'string') {
          paramOperateRule.ruleJson = JSON.stringify(paramOperateRule.ruleJson);
        }
        if (typeof paramOperateRule.label !== 'string') {
          paramOperateRule.labelId = paramOperateRule.labelId
            ? paramOperateRule.labelId.join(',')
            : '';
        }
        if (typeof paramOperateRule.executeConfigureJson !== 'string') {
          paramOperateRule.executeConfigureJson = JSON.stringify(paramOperateRule.executeConfigureJson);
        }
        // 新增;
        if (this.isAddRule === true) {
          this.canSave = false;
          let param = paramOperateRule;
          try {
            const response = await dataService.addRule(param);
            const code = response.data.code;
            if (code === 200) {
              this.snackbarServe = true;
              this.snackbarServeMsg = '保存成功';
              this.snackbarServeColor = 'success';
              this.addRel(
                this.operatedRuleSet.id,
                JSON.parse(paramOperateRule.ruleJson),
                this.versionNum
              );
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
                    this.$router.push('/ruleListDetail');
                  }
                }, 500);
              }
            } else {
              this.snackbarServe = true;
              this.snackbarServeMsg = response.data.msg;
              this.snackbarServeColor = 'error';
              this.canSave = true;
            }
          } catch (error) {
            this.canSave = true;
          }
        } else if (this.isAddRule === false) { // 编辑
          let param = {
            id: paramOperateRule.id,
            rulesetHistoryId: paramOperateRule.rulesetHistoryId,
            ruleNo: paramOperateRule.ruleNo,
            ruleName: paramOperateRule.ruleName,
            labelId: paramOperateRule.labelId,
            isWeak: paramOperateRule.isWeak,
            strategy: paramOperateRule.strategy,
            enableTime: paramOperateRule.enableTime,
            invalidTime: paramOperateRule.invalidTime,
            priorityLevel: paramOperateRule.priorityLevel,
            weights: paramOperateRule.weights,
            riskThreshold: paramOperateRule.riskThreshold,
            comment: paramOperateRule.comment,
            ruleJson: paramOperateRule.ruleJson,
            states: paramOperateRule.states,
            upgrade: false,
            setId: this.operatedRuleSet.id,
            ruleList: '',
            executeConfigureJson: paramOperateRule.executeConfigureJson
          };
          try {
            if (this.ruleEditFlag === '1') {
              const response = await dataService.modifyRule(param);
              const code = response.data.code;
              if (code === 200) {
                if (typeof this.oldRuleJson.ruleJson === 'string') {
                  this.oldRuleJson.ruleJson = JSON.parse(
                    this.oldRuleJson.ruleJson
                  );
                }
                this.delRel(
                  this.operatedRuleSet.id,
                  this.oldRuleJson.ruleJson,
                  this.versionNum,
                  JSON.parse(paramOperateRule.ruleJson)
                );
                // this.addRel(
                //   this.operatedRuleSet.id,
                //   JSON.parse(paramOperateRule.ruleJson),
                //   this.versionNum
                // );
                this.snackbarServe = true;
                this.snackbarServeMsg = '保存成功';
                this.snackbarServeColor = 'success';
                const TIME_COUNT = 3;
                if (!this.timer) {
                  this.count = TIME_COUNT;
                  this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                      this.count--;
                    } else {
                      clearInterval(this.timer);
                      this.timer = null;
                      this.$router.push('/ruleListDetail');
                    }
                  }, 500);
                }
              } else {
                this.snackbarServe = true;
                this.snackbarServeMsg = response.data.msg;
                this.snackbarServeColor = 'error';
              }
            }
            this.ruleEditFlag = ''; //  清空当前编辑标识
          } catch (error) {}
        }
      }
      // 需要升版
      if (isUpgrade) {
        this.canSave = false;
        // labelId字符串转对象
        if (typeof this.oldRuleJson.labelId === 'object') {
          this.oldRuleJson.labelId = this.oldRuleJson.labelId
            ? this.oldRuleJson.labelId.join(',')
            : '';
        }
        let newLabelId = ''; // 改变后的labelId,用于中转，解决标签labelId格式改变页面报错的问题
        if (typeof this.operateRule.labelId === 'object') {
          newLabelId = this.operateRule.labelId
            ? this.operateRule.labelId.join(',')
            : '';
        }
        let paramOperateRule = JSON.parse(JSON.stringify(this.operateRule));
        paramOperateRule.labelId = newLabelId;
        if (typeof paramOperateRule.executeConfigureJson !== 'string') {
          paramOperateRule.executeConfigureJson = JSON.stringify(paramOperateRule.executeConfigureJson);
        }
        // 新增 不用比较 直接调接口生版本
        if (this.isAddRule === true) {
          let ruleList = [];
          this.operatedRules.forEach(newEle => {
            ruleList.push({
              id: newEle.id,
              states: newEle.states,
              isDel: false
            });
          });
          let param = {
            id: '',
            rulesetHistoryId: this.versionId,
            ruleNo: paramOperateRule.ruleNo,
            ruleName: paramOperateRule.ruleName,
            labelId: paramOperateRule.labelId,
            isWeak: paramOperateRule.isWeak,
            strategy: paramOperateRule.strategy,
            enableTime: paramOperateRule.enableTime,
            invalidTime: paramOperateRule.invalidTime,
            priorityLevel: paramOperateRule.priorityLevel,
            weights: paramOperateRule.weights,
            riskThreshold: JSON.stringify(this.operatedRuleSet.riskThreshold),
            comment: paramOperateRule.comment,
            ruleJson: JSON.stringify(paramOperateRule.ruleJson),
            states: 'OFFICIAL',
            upgrade: true,
            setId: this.operatedRuleSet.id,
            ruleList: JSON.stringify(ruleList),
            isOperator: 'true',
            executeConfigureJson: paramOperateRule.executeConfigureJson
          };
          dataService.UpgradeRule(param).then(response => {
            const code = response.data.code;
            if (code > 0) {
              this.snackbarServe = true;
              this.snackbarServeMsg = '当前版本规则集被引用，已自动升版';
              this.snackbarServeColor = 'success';
              this.addRel(this.operatedRuleSet.id, paramOperateRule.ruleJson, response.data.data.historyVersion);
              let sStorage = window.sessionStorage;
              // 版本号
              sStorage.setItem('versionNum', response.data.data.historyVersion);
              // 版本id
              sStorage.setItem('versionId', response.data.data.rulesetHistoryId);
              const TIME_COUNT = 3;
              if (!this.timer) {
                this.count = TIME_COUNT;
                this.timer = setInterval(() => {
                  if (this.count > 0 && this.count <= TIME_COUNT) {
                    this.count--;
                  } else {
                    clearInterval(this.timer);
                    this.timer = null;
                    this.$router.push('/ruleListDetail');
                  }
                }, 500);
              }
            } else {
              this.snackbarServe = true;
              this.snackbarServeMsg = response.data.msg;
              this.snackbarServeColor = 'error';
              this.canSave = true;
            }
          }).catch(() => {
            this.canSave = true;
          });
        } else if (this.isAddRule === false) {
          // 编辑
          let generateNewVersion = false;
          // 对比数据判断规定的字段是否有变化
          if (this.oldRuleJson) {
            const ruleParamKeyList = [
              'labelId',
              'strategy',
              'priorityLevel',
              'weights',
              'invalidTime',
              'enableTime'
            ];
            const consitionItemParamKeyList = [
              'fieldSource',
              'fieldValue',
              'operatorValue',
              'resultSource',
              'resultValue',
              'conditionItemRelation'
            ];
            const configureItemParamKeyList = [
              'fieldValue',
              'operatorValue',
              'resultValue'
            ];
            var oldRuleList;
            var newRuleList;
            // ruleJson字符串转成对象
            if (typeof this.oldRuleJson.ruleJson === 'string') {
              oldRuleList = JSON.parse(this.oldRuleJson.ruleJson);
            } else if (typeof this.oldRuleJson.ruleJson === 'object') {
              oldRuleList = JSON.parse(
                JSON.stringify(this.oldRuleJson.ruleJson)
              );
            }
            if (typeof this.operateRule.ruleJson === 'string') {
              newRuleList = JSON.parse(this.operateRule.ruleJson);
            } else if (typeof this.operateRule.ruleJson === 'object') {
              newRuleList = JSON.parse(
                JSON.stringify(this.operateRule.ruleJson)
              );
            }
            // 判断规则的基本字段是否有改动
            for (const key in this.oldRuleJson) {
              if (ruleParamKeyList.indexOf(key) !== -1) {
                if (key === 'labelId') {
                  if (
                    JSON.stringify(this.oldRuleJson[key]) !==
                    JSON.stringify(newLabelId)
                  ) {
                    generateNewVersion = true;
                  }
                } else {
                  if (this.oldRuleJson[key] !== this.operateRule[key]) {
                    generateNewVersion = true;
                  }
                }
              }
            }
            // 如果基本字段没有改变判断ruleJson
            if (!generateNewVersion) {
              if (
                newRuleList.logicalRelationship !==
                oldRuleList.logicalRelationship
              ) {
                generateNewVersion = true;
              }
              if (
                newRuleList.conditionList.length !==
                oldRuleList.conditionList.length
              ) {
                generateNewVersion = true;
              }
            }
            // 遍历判断规则条件
            if (!generateNewVersion) {
              for (
                let index = 0;
                index < newRuleList.conditionList.length;
                index++
              ) {
                let newCondition = newRuleList.conditionList[index];
                let oldCondition = oldRuleList.conditionList[index];
                if (newCondition.settingType !== oldCondition.settingType) {
                  generateNewVersion = true;
                }
                if (!generateNewVersion) {
                  if (newCondition.settingType === 1) {
                    if (
                      newCondition.conditionItems.length !==
                      oldCondition.conditionItems.length
                    ) {
                      generateNewVersion = true;
                    } else {
                      for (
                        let itemIndex = 0;
                        itemIndex < newCondition.conditionItems.length;
                        itemIndex++
                      ) {
                        for (const key in newCondition.conditionItems[itemIndex]) {
                          if (consitionItemParamKeyList.indexOf(key) !== -1) {
                            if (
                              newCondition.conditionItems[itemIndex][key] !==
                              oldCondition.conditionItems[itemIndex][key]
                            ) {
                              generateNewVersion = true;
                            }
                          }
                        }
                      }
                    }
                  } else if (newCondition.settingType === 0) {
                    if (
                      newCondition.conditionItems[0].fieldValue !==
                      oldCondition.conditionItems[0].fieldValue
                    ) {
                      generateNewVersion = true;
                    }

                    if (!generateNewVersion) {
                      for (
                        let newParamOfTempIndex = 0;
                        newParamOfTempIndex <
                        newCondition.conditionItems[0].parameters.length;
                        newParamOfTempIndex++
                      ) {
                        const newParamOfTempElement = newCondition.conditionItems[0].parameters[newParamOfTempIndex];
                        const oldParamOfTempElement = oldCondition.conditionItems[0].parameters[newParamOfTempIndex];
                        if (newParamOfTempElement.value.value !== oldParamOfTempElement.value.value) {
                          generateNewVersion = true;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }
            // 判断执行配置
            console.log(this.operateRule.executeConfigureJson);
            console.log(this.oldRuleJson);
            if (!generateNewVersion) {
              if (
                this.operateRule.executeConfigureJson.length !==
                  this.oldRuleJson.executeConfigureJson.length
              ) {
                generateNewVersion = true;
              }
            }
            if (!generateNewVersion) {
              for (let itemIndex = 0; itemIndex < this.operateRule.executeConfigureJson.length; itemIndex++) {
                for (const key in this.operateRule.executeConfigureJson[itemIndex]) {
                  if (configureItemParamKeyList.indexOf(key) !== -1) {
                    if (this.operateRule.executeConfigureJson[itemIndex][key] !== this.oldRuleJson.executeConfigureJson[itemIndex][key]) {
                      generateNewVersion = true;
                    }
                  }
                }
              }
            }
          }
          // 有变化 进行升版
          if (generateNewVersion) {
            let ruleList = [];
            this.operatedRules.forEach(newEle => {
              ruleList.push({
                id: newEle.id,
                states: newEle.states,
                isDel: false
              });
            });
            let param = {
              id: paramOperateRule.id,
              rulesetHistoryId: this.versionId,
              ruleNo: paramOperateRule.ruleNo,
              ruleName: paramOperateRule.ruleName,
              labelId: paramOperateRule.labelId,
              isWeak: paramOperateRule.isWeak,
              strategy: paramOperateRule.strategy,
              enableTime: paramOperateRule.enableTime,
              invalidTime: paramOperateRule.invalidTime,
              priorityLevel: paramOperateRule.priorityLevel,
              weights: paramOperateRule.weights,
              riskThreshold: JSON.stringify(this.operatedRuleSet.riskThreshold),
              comment: paramOperateRule.comment,
              ruleJson: JSON.stringify(paramOperateRule.ruleJson),
              executeConfigureJson: paramOperateRule.executeConfigureJson,
              states: paramOperateRule.states,
              upgrade: true,
              setId: this.operatedRuleSet.id,
              ruleList: JSON.stringify(ruleList),
              isOperator: 'true'
            };
            try {
              const response = await dataService.UpgradeRule(param);
              const code = response.data.code;
              if (code === 200) {
                this.snackbarServe = true;
                this.snackbarServeMsg = '当前版本规则集被引用，已自动升版';
                this.snackbarServeColor = 'success';
                this.addRel(
                  this.operatedRuleSet.id,
                  paramOperateRule.ruleJson,
                  response.data.data.historyVersion
                );
                let sStorage = window.sessionStorage;
                // 版本号
                sStorage.setItem(
                  'versionNum',
                  response.data.data.historyVersion
                );
                // 版本id
                sStorage.setItem(
                  'versionId',
                  response.data.data.rulesetHistoryId
                );
                const TIME_COUNT = 3;
                if (!this.timer) {
                  this.count = TIME_COUNT;
                  this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                      this.count--;
                    } else {
                      clearInterval(this.timer);
                      this.timer = null;
                      this.$router.push('/ruleListDetail');
                    }
                  }, 500);
                }
              } else {
                this.canSave = true;
                this.snackbarServe = true;
                this.snackbarServeMsg = response.data.msg;
                this.snackbarServeColor = 'error';
              }
            } catch (error) {
              this.canSave = true;
            }
          } else {
            // 没有变化 编辑
            let param = {
              id: paramOperateRule.id,
              rulesetHistoryId: paramOperateRule.rulesetHistoryId,
              ruleNo: paramOperateRule.ruleNo,
              ruleName: paramOperateRule.ruleName,
              labelId: paramOperateRule.labelId,
              isWeak: paramOperateRule.isWeak,
              strategy: paramOperateRule.strategy,
              enableTime: paramOperateRule.enableTime,
              invalidTime: paramOperateRule.invalidTime,
              priorityLevel: paramOperateRule.priorityLevel,
              weights: paramOperateRule.weights,
              riskThreshold: paramOperateRule.riskThreshold,
              comment: paramOperateRule.comment,
              ruleJson: JSON.stringify(paramOperateRule.ruleJson),
              states: paramOperateRule.states,
              upgrade: false,
              setId: this.operatedRuleSet.id,
              ruleList: '',
              executeConfigureJson: paramOperateRule.executeConfigureJson
            };
            try {
              const response = await dataService.modifyRule(param);
              const code = response.data.code;
              if (code === 200) {
                this.snackbarServe = true;
                this.snackbarServeMsg = '保存成功';
                this.snackbarServeColor = 'success';
                const TIME_COUNT = 3;
                if (!this.timer) {
                  this.count = TIME_COUNT;
                  this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                      this.count--;
                    } else {
                      clearInterval(this.timer);
                      this.timer = null;
                      this.$router.push('/ruleListDetail');
                    }
                  }, 500);
                }
              } else {
                this.canSave = true;
                this.snackbarServe = true;
                this.snackbarServeMsg = response.data.msg;
                this.snackbarServeColor = 'error';
              }
            } catch (error) {
              this.canSave = true;
            }
          }
        }
      }
    },
    // 取消保存规则
    cancelAddRule () {
      this.$router.push('/ruleListDetail');
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
              fieldDescription: '',
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
    addOperateItems (operateIndex, index) {
      this.operateRule.ruleJson.conditionList[operateIndex].conditionItems.splice(index + 1, 0, {
        fieldSource: 'BUSINESS_VAR',
        fieldValue: '',
        fieldText: '',
        fieldDescription: '',
        isFieldEnumeration: '',
        // 阈值可选列表
        resultList: JSON.parse(JSON.stringify(this.resultOptions)),
        operatorValue: '',
        operatorText: '',
        resultSource: 'INPUT',
        resultValue: '',
        resultText: '',
        resultType: '',
        conditionItemRelation: '&&',
        // 运算符列表
        operatorList: JSON.parse(JSON.stringify(this.operator))
      });
    },
    // 删除一行规则条件item
    delOperateItems (operateIndex, index) {
      let conditionItems = this.operateRule.ruleJson.conditionList[operateIndex]
        .conditionItems;
      if (conditionItems.length <= 1) {
        return;
      }
      conditionItems.splice(index, 1);
      // this.operateRule.ruleJson.conditionList[operateIndex].conditionItems[0].conditionItemRelation = '';
    },
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
        operateConditionItem.resultList = JSON.parse(
          JSON.stringify(this.resultOptions)
        );
        operateConditionItem.operatorList = JSON.parse(
          JSON.stringify(this.operator)
        );
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
        operateConditionItem.resultList = JSON.parse(
          JSON.stringify(this.resultOptions)
        );
        operateConditionItem.operatorList = JSON.parse(
          JSON.stringify(this.operator)
        );
      }
    },
    // 业务变量库change事件
    async variableChange (operateIndex, index, item) {
      let fieldItem;
      item.operatorList = [];
      this.variableFields.forEach(element => {
        if (item.fieldValue === element.fieldValue) {
          item.fieldText = element.fieldName;
          item.fieldType = element.dataType;
          item.isFieldEnumeration = element.isEnumeration;
          item.resultList = element.enumList;
          fieldItem = element;
        }
      });
      // 字符串类型和布尔类型运算符只能是等于或者不等于
      if (item.fieldType === 'String' || item.fieldType === 'boolean') {
        this.operator.forEach(element => {
          if (element.compName === '等于' || element.compName === '不等于') {
            item.operatorList.push(JSON.parse(JSON.stringify(element)));
          }
        });
      } else {
        item.operatorList = JSON.parse(JSON.stringify(this.operator));
      }
      if (item.isFieldEnumeration === '0') {
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
        // 如果是数值类型 int double float long类型的数值都可以进行比较 阈值下拉框的值是这四种类型的合集
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
        item.resultList.push(
          {
            fieldValue: '',
            fieldName: '',
            disabled: true,
            divider: true
          },
          {
            fieldValue: 'CALCULATION_VAR',
            fieldName: '计算指标库',
            disabled: true,
            divider: false
          }
        );
        // 如果是数值类型 int double float long类型的数值都可以进行比较 阈值下拉框的值是这四种类型的合集
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
        } else {
          // 其他类型的 string boolean Object  阈值下拉框是相同的类型的数据的合集
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
          item.resultList.unshift(
            {
              fieldValue: 'Boolean',
              fieldName: '布尔值',
              disabled: true,
              divider: false
            },
            {
              fieldName: '是',
              fieldValue: 'true',
              srcType: 'INPUT'
            },
            {
              fieldName: '否',
              fieldValue: 'false',
              srcType: 'INPUT'
            }
          );
        }
        // 如果当前行是选中行
        let operateCondition = this.operateRule.ruleJson.conditionList[operateIndex];
        let operateConditionItem = operateCondition.conditionItems[index];
        if (operateCondition.activeIndex === index) {
          if (fieldItem.isEnumeration === '1') {
            operateConditionItem.resultSource = 'ENUM_VAR';
            operateCondition.resultType = '枚举值';
          } else {
            operateConditionItem.resultSource = 'INPUT';
            operateCondition.resultType = '阈值';
          }
        } else {
          if (fieldItem.isEnumeration === '1') {
            operateConditionItem.resultSource = 'ENUM_VAR';
          } else {
            operateConditionItem.resultSource = 'INPUT';
          }
        }
      }
    },
    // 选择框阈值修改事件
    resultSelectChange (item) {
      if (typeof item.resultValue === 'string') {
        item.resultSource = 'INPUT';
        item.resultText = item.resultValue;
        item.resultType = '';
      } else if (typeof item.resultValue === 'object') {
        let resultObj = JSON.parse(JSON.stringify(item.resultValue));
        if (resultObj.srcType && resultObj.srcType === 'BUSINESS_VAR') {
          item.resultSource = 'BUSINESS_VAR';
          item.resultText = resultObj.fieldName;
        } else if (resultObj.srcType && resultObj.srcType === 'INPUT') {
          item.resultSource = 'INPUT';
          item.resultText = resultObj.fieldName;
        } else {
          item.resultSource = 'CALCULATION_VAR';
          item.resultText = resultObj.fieldName;
        }
      }
      // 类型
      item.resultList.forEach(element => {
        if (element.fieldValue === item.resultValue.fieldValue) {
          item.resultType = element.dataType;
        }
      });
    },
    // 业务变量库是枚举时 枚举值修改事件
    resultEnumerationSelectChange (item) {
      item.resultList.forEach(element => {
        if (item.resultValue === element.fieldValue) {
          item.resultText = element.fieldName;
          item.resultType = element.dataType;
          item.resultSource = 'ENUM_VAR';
        }
      });
    },
    // 计算指标库change事件
    async indicatorsChange (item) {
      this.indicators.forEach(element => {
        if (item.fieldValue === element.id) {
          item.fieldText = element.indicName;
          item.fieldType = element.dataType;
        }
      });
      item.operatorList = [];
      item.resultList = [];
      // 字符串类型和布尔类型运算符只能是等于或者不等于
      if (item.fieldType === 'String' || item.fieldType === 'boolean') {
        this.operator.forEach(element => {
          if (element.compName === '等于' || element.compName === '不等于') {
            item.operatorList.push(JSON.parse(JSON.stringify(element)));
          }
        });
      } else {
        item.operatorList = JSON.parse(JSON.stringify(this.operator));
      }
      // 根据所选的数据类型 阈值下拉框中对应值为不同类型
      if (item.fieldType === 'boolean') {
        item.resultList.push({
          fieldValue: 'BUSINESS_VAR',
          fieldName: '业务变量库',
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
      // 如果是数值类型 int double float long类型的数值都可以进行比较 阈值下拉框的值是这四种类型的合集
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
      item.resultList.push(
        {
          fieldValue: '',
          fieldName: '',
          disabled: true,
          divider: true
        },
        {
          fieldValue: 'CALCULATION_VAR',
          fieldName: '计算指标库',
          disabled: true,
          divider: false
        }
      );
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
      } else {
        // 其他类型的 string boolean Object  阈值下拉框是相同的类型的数据的合集
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
        item.resultList.unshift(
          {
            fieldValue: 'Boolean',
            fieldName: '布尔值',
            disabled: true,
            divider: false
          },
          {
            fieldName: '是',
            fieldValue: 'true',
            srcType: 'INPUT'
          },
          {
            fieldName: '否',
            fieldValue: 'false',
            srcType: 'INPUT'
          }
        );
      }
    },
    // 运算符change事件
    operatorChange (item) {
      this.operator.forEach(element => {
        if (item.operatorValue === element.compValue) {
          item.operatorText = element.compName;
        }
      });
    },
    // 名单库change事件
    listLibraryChange (item) {
      this.libraryList.forEach(element => {
        if (item.fieldValue === element.id) {
          item.fieldText = element.listName;
          item.fieldType = 'String';
        }
      });
    },
    // 名单库结果change事件
    libraryListResultsChange (item) {
      this.libraryListResults.forEach(element => {
        if (item.resultValue === element.value) {
          item.resultText = element.text;
        }
      });
    },
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
      } catch (error) {}
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
      } catch (error) {}
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
      } catch (error) {}
    },
    // 从系统参数库查询参数
    async getNameType () {
      // 从系统参数库获取名单类型 白名单除外

      try {
        let param = {
          identifier: 'sys_list_type'
        };
        const res = await dataService.findsysParamsNameType(param);
        if (res.data.code === 200) {
          let NamelistType = [];
          res.data.data.forEach((item, index, ary) => {
            // 添加弹框中的名单类型 NamelistType
            if (item.paramValue === 'WHITE_LIST') {
              // 筛除掉白名单
            } else {
              NamelistType.push(item.paramValue);
            }
          });
          //  debugger;
          let listparams = {
            appType: '1',
            listType: NamelistType.toString()
          };
          this.getForListManage(listparams);
          // console.log(this.NamelistType,'33333');
        }
      } catch (err) {}
    },
    // 获取名单库
    async getForListManage (param) {
      console.log(param, '获取名单库');
      try {
        const response = await dataService.getListManage(param);
        if (response.data.code === 200) {
          this.libraryList = response.data.data;
        }
      } catch (error) {}
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
      let resultDate =
        year +
        '-' +
        month +
        '-' +
        date +
        ' ' +
        hour +
        ':' +
        minutes +
        ':' +
        second;
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
      var tempDescription = '';
      this.tempItem.forEach(element => {
        if (element.id === this.tempId) {
          tempName = element.templateName;
          tempDescription = element.description;
        }
      });
      getTmpListValue(parms)
        .then(res => {
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
              conditionItems: [
                {
                  fieldSource: 'RULE_TEMPLATE',
                  fieldValue: this.tempId,
                  fieldText: tempName,
                  fieldDescription: tempDescription,
                  parameters: parameters
                }
              ]
            });
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
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
    async delRel (ruleSetId, oldRuleJson, ruleSetVersion, newRuleJson) {
      let delRelList = [];
      oldRuleJson.conditionList.forEach(conditionEle => {
        if (conditionEle.settingType === 1) {
          conditionEle.conditionItems.forEach(conditionItemEle => {
            let RelItemOfField = {
              sourceId: '',
              sourceType: conditionItemEle.fieldSource,
              targetId: ruleSetId,
              targetType: 'RULE_SET',
              targetVersion: ruleSetVersion
            };
            let RelItemOfOperator = {
              sourceId: '',
              sourceType: 'COMPARATOR_VAR',
              targetId: ruleSetId,
              targetType: 'RULE_SET',
              targetVersion: ruleSetVersion
            };
            let RelItemOfResult = {
              sourceId: '',
              sourceType: conditionItemEle.resultSource,
              targetId: ruleSetId,
              targetType: 'RULE_SET',
              targetVersion: ruleSetVersion
            };
            // 业务变量库
            if (conditionItemEle.fieldSource === 'BUSINESS_VAR' || conditionItemEle.resultSource === 'BUSINESS_VAR') {
              this.variableFields.forEach(element => {
                if (element.fieldValue === conditionItemEle.fieldValue) {
                  RelItemOfField.sourceId = element.id;
                }
                if (element.fieldValue === conditionItemEle.resultValue) {
                  RelItemOfResult.sourceId = element.id;
                }
              });
            }
            // 计算指标库
            if (conditionItemEle.fieldSource === 'CALCULATION_VAR') {
              RelItemOfField.sourceId = conditionItemEle.fieldValue;
            }
            if (conditionItemEle.resultSource === 'CALCULATION_VAR') {
              RelItemOfResult.sourceId = conditionItemEle.resultValue;
            }
            // 名单库
            if (conditionItemEle.fieldSource === 'LIST_LIB') {
              RelItemOfField.sourceId = conditionItemEle.fieldValue;
            }
            // 运算符
            this.operator.forEach(element => {
              if (element.compValue === conditionItemEle.operatorValue) {
                RelItemOfOperator.sourceId = element.id;
              }
            });
            // 枚举常量库
            if (conditionItemEle.resultSource === 'ENUM_VAR') {
              this.variableFields.forEach(element => {
                if (element.fieldValue === conditionItemEle.fieldValue) {
                  element.enumList.forEach(enmuEle => {
                    if (enmuEle.fieldValue === conditionItemEle.resultValue) {
                      RelItemOfResult.sourceId = element.id;
                    }
                  });
                }
              });
            }
            delRelList.push(RelItemOfField);
            delRelList.push(RelItemOfOperator);
            if (conditionItemEle.fieldSource !== 'LIST_LIB' && conditionItemEle.resultSource !== 'INPUT') {
              delRelList.push(RelItemOfResult);
            }
          });
        }
      });
      let param = {
        jsonStr: JSON.stringify(delRelList)
      };
      dataService.delRecWithCond(param);
      try {
        const response = await dataService.delRecWithCond(param);
        if (response.data.code === 200) {
          this.addRel(ruleSetId, newRuleJson, ruleSetVersion);
        }
      } catch (error) {
        // this.isdelRecWithCond = "";
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
            let addRelItemOfResult = {
              sourceId: '',
              sourceType: conditionItemEle.resultSource,
              targetId: ruleSetId,
              targetType: 'RULE_SET',
              targetVersion: ruleSetVersion
            };
            // 业务变量库
            if (conditionItemEle.fieldSource === 'BUSINESS_VAR' || conditionItemEle.resultSource === 'BUSINESS_VAR') {
              this.variableFields.forEach(element => {
                if (element.fieldValue === conditionItemEle.fieldValue) {
                  addRelItemOfField.sourceId = element.id;
                }
                if (element.fieldValue === conditionItemEle.resultValue) {
                  addRelItemOfResult.sourceId = element.id;
                }
              });
            }
            // 计算指标库
            if (conditionItemEle.fieldSource === 'CALCULATION_VAR') {
              addRelItemOfField.sourceId = conditionItemEle.fieldValue;
            }
            if (conditionItemEle.resultSource === 'CALCULATION_VAR') {
              addRelItemOfResult.sourceId = conditionItemEle.resultValue;
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
            // 枚举常量库
            if (conditionItemEle.resultSource === 'ENUM_VAR') {
              this.variableFields.forEach(element => {
                if (element.fieldValue === conditionItemEle.fieldValue) {
                  console.log(element, 'element');
                  element.enumList.forEach(enmuEle => {
                    if (enmuEle.fieldValue === conditionItemEle.resultValue) {
                      addRelItemOfResult.sourceId = element.id;
                    }
                  });
                }
              });
            }
            addRelList.push(addRelItemOfField);
            addRelList.push(addRelItemOfOperator);
            if (conditionItemEle.fieldSource !== 'LIST_LIB' && conditionItemEle.resultSource !== 'INPUT') {
              addRelList.push(addRelItemOfResult);
            }
          });
        }
      });
      let param = {
        jsonStr: JSON.stringify(addRelList)
      };

      await dataService.addRecord(param);
      //  try{
      //   if(this.isdelRecWithCond==='1'){
      //     await dataService.addRecord(param);
      //   }
      //   this.isdelRecWithCond =""
      //  }catch(err){

      //  }
    },
    // 初始化的时候处理不同类型业务变量库和计算指标库对应的不用计算符和阈值选项111
    dealDataType () {
      for (
        let index = 0;
        index < this.operateRule.ruleJson.conditionList.length;
        index++
      ) {
        const element = this.operateRule.ruleJson.conditionList[index];
        if (element.settingType === 1) {
          element.conditionItems.forEach(item => {
            item.operatorList = [];
            // 字符串类型和布尔类型运算符只能是等于或者不等于
            if (item.fieldType === 'String' || item.fieldType === 'boolean') {
              this.operator.forEach(operatorItem => {
                if (
                  operatorItem.compName === '等于' ||
                  operatorItem.compName === '不等于'
                ) {
                  item.operatorList.push(
                    JSON.parse(JSON.stringify(operatorItem))
                  );
                }
              });
            } else {
              item.operatorList = JSON.parse(JSON.stringify(this.operator));
            }
            if (
              item.fieldSource === 'CALCULATION_VAR' ||
              (item.fieldSource === 'BUSINESS_VAR' &&
                item.isFieldEnumeration === '0')
            ) {
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
              item.resultList.push(
                {
                  fieldValue: '',
                  fieldName: '',
                  disabled: true,
                  divider: true
                },
                {
                  fieldValue: 'CALCULATION_VAR',
                  fieldName: '计算指标库',
                  disabled: true,
                  divider: false
                }
              );
              if (this.numberDataTypeList.indexOf(item.fieldType) > -1) {
                this.indicators.forEach(indicator => {
                  if (
                    this.numberDataTypeList.indexOf(indicator.dataType) > -1
                  ) {
                    let element = {
                      fieldValue: indicator.id,
                      fieldName: indicator.indicName,
                      dataType: indicator.dataType
                    };
                    item.resultList.push(element);
                  }
                });
              } else {
                // 其他类型的 string boolean Object  阈值下拉框是相同的类型的数据的合集
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
                item.resultList.unshift(
                  {
                    fieldValue: 'Boolean',
                    fieldName: '布尔值',
                    disabled: true,
                    divider: false
                  },
                  {
                    fieldName: '是',
                    fieldValue: 'true',
                    srcType: 'INPUT'
                  },
                  {
                    fieldName: '否',
                    fieldValue: 'false',
                    srcType: 'INPUT'
                  }
                );
              }
            } else if (
              item.fieldSource === 'BUSINESS_VAR' &&
              item.isFieldEnumeration === '1'
            ) {
              this.variableFields.forEach(element => {
                if (item.fieldValue === element.fieldValue) {
                  item.resultList = element.enumList;
                }
              });
            }
            if (
              item.resultSource === 'CALCULATION_VAR' ||
              item.resultSource === 'BUSINESS_VAR'
            ) {
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
      for (let index = 0; index < this.operateRule.executeConfigureJson.length; index++) {
        const item = this.operateRule.executeConfigureJson[index];
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
      }
    },
    // 添加执行配置
    addConfigure () {
      this.operateRule.executeConfigureJson.push(
        {
          fieldValue: '',
          fieldText: '',
          fieldType: 'double',
          isFieldEnumeration: false,
          operatorValue: '==',
          operatorText: '等于',
          resultSource: 'INPUT',
          resultValue: '',
          resultText: '',
          resultType: 'double'
        }
      );
      this.ConfigureListLeftchange();
    },
    // 删除执行配置
    delconfigureItems (index) {
      this.operateRule.executeConfigureJson.splice(index, 1);
      this.ConfigureListLeftchange();
    },
    // 筛选只能选的选项
    ConfigureListLeftchange () {
      // 选择过的字段 改成不能选择
      for (let i = 0; i < this.operateRule.executeConfigureJson.length; i++) {
        // 当前行的选择
        let ConfigureItem = this.operateRule.executeConfigureJson[i];
        let ListLeft = [
          {
            fieldName: '账户风险监测',
            fieldValue: 'Account_Risk_Detection'
          },
          {
            fieldName: '商户风险监测',
            fieldValue: 'Merchant_Risk_Detection'

          },
          {
            fieldName: '企业风险监测',
            fieldValue: 'Enterprise_Risk_Detection'
          }
        ];
        // 把其他行选择的字段找到，并从当前行的可选项删除
        for (let j = 0; j < this.operateRule.executeConfigureJson.length; j++) {
          if (j !== i) {
            let otherValue = this.operateRule.executeConfigureJson[j].fieldValue;
            for (let m = 0; m < ListLeft.length; m++) {
              if (ListLeft[m].fieldValue === otherValue) {
                ListLeft.splice(m, 1);
                m--;
              }
            }
          }
        }
        ConfigureItem.ListLeft = ListLeft;
      }
    },
    // 执行配置修改字段
    configurefieldChange (index, item) {
      this.executeConfigureListLeft.forEach(element => {
        if (item.fieldValue === element.fieldValue) {
          item.fieldText = element.fieldName;
        }
      });
      this.ConfigureListLeftchange();
    },
    // 执行配置 结果修改
    configureResultChange (item) {
      item.resultText = item.resultValue;
    },
    getTmpListValueFn (element) {
      let parms = {
        templateId: element.conditionItems[0].fieldValue
      };

      getTmpListValue(parms)
        .then(res => {
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
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    }
  },
  created () {
    this.GetVariableField();
    this.GetOperator();
    this.GetIndicators();
    this.getRiskyLabelsList();
    this.getStrategiesList();
    // this.getListManage();
    this.getNameType(); // 从系统数据库获取名单集类型
    let sStorage = window.sessionStorage;
    this.operatedRuleSet = JSON.parse(sStorage.getItem('ruleSet'));
    this.operateRule = JSON.parse(sStorage.getItem('operateRule'));
    this.operatedRules = JSON.parse(sStorage.getItem('operatedRules'));
    this.versionId = sStorage.getItem('versionId');
    this.versionNum = sStorage.getItem('versionNum');
    this.ruleSetStatus = sStorage.getItem('ruleSetStatus'); // 规则集状态
    this.ruleSetPattern = sStorage.getItem('ruleSetPattern'); // 规则集模式 安全模式/调试模式
    this.isNeedAudit = sStorage.getItem('needAudit'); // 判断是否需要审核
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
    }

    if (this.operateRule.executeConfigureJson) {
      if (typeof this.operateRule.executeConfigureJson === 'string') {
        this.operateRule.executeConfigureJson = JSON.parse(this.operateRule.executeConfigureJson);
      }
    } else {
      this.operateRule.executeConfigureJson = [];
    }
    this.ConfigureListLeftchange();
    if (typeof this.operateRule.labelId === 'string') {
      if (this.operateRule.labelId) {
        this.operateRule.labelId = this.operateRule.labelId.split(',');
      } else {
        this.operateRule.labelId = [];
      }
    }
    for (
      let index = 0;
      index < this.operateRule.ruleJson.conditionList.length;
      index++
    ) {
      const element = this.operateRule.ruleJson.conditionList[index];
      if (element.settingType === 0) {
        this.getTmpListValueFn(element);
      }
    }
    this.oldRuleJson = JSON.parse(sStorage.getItem('operateRule'));
    if (this.oldRuleJson.executeConfigureJson) {
      if (typeof this.oldRuleJson.executeConfigureJson === 'string') {
        this.oldRuleJson.executeConfigureJson = JSON.parse(this.oldRuleJson.executeConfigureJson);
      }
    } else {
      this.oldRuleJson.executeConfigureJson = [];
    }
  }
};
</script>
<style lang="stylus">
.rule-info-item {
  width: 30%;
  margin-left: 3%;
  margin-bottom: 20px;
}

.rule-info-item-one {
  width: 30%;
  margin-left: 3%;
  margin-bottom: 20px;
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
  color: rgba(0, 0, 0, 0.6);
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
  z-index: 0;
}

.v-data-table--fixed-header thead tr th:nth-child(2) {
  z-index: 0;
}

.v-data-table--fixed-header thead tr th:nth-child(3) {
  z-index: 0;
}

.v-data-table--fixed-header thead tr th:nth-child(4) {
  z-index: 0;
}

.theme--light.v-chip:not(.v-chip--active) {
  background-color: transparent !important;
  padding:0!important;
}
.v-chip .v-chip__content span{
   overflow: hidden;
  text-overflow:ellipsis!important;
  white-space: nowrap !important;
  width: 100px!important;
  padding:0 8px!important;
}
.tempParamName {
  padding-left: 150px;
  margin-top: 20px;
  font-weight: 700;
}

.tempParamItem {
  padding-left: 40px;
  margin-top: 20px;
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
  padding-bottom: 30px;
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
  font-size: 14px;
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
  font-size: 14px;
}

.fl {
  float: left;
}

.lib .v-btn-toggle:not(.v-btn-toggle--dense) .v-btn.v-btn.v-size--default {
  height: 40px;
  line-height: 40px;
}

.rule-condition-item {
  padding: 10px;
}

.rule-condition .value {
  width: 30%;
  margin-left: 1%;
}

.rule-condition .comp {
  margin-left: 1%;
  width: 15%;
}

.rule-condition .result {
  margin-left: 1%;
  width: 28%;
}

.rule-condition .relation {
  margin-left: 1%;
  width: 5%;
}

.rule-condition .add-del {
  margin-left: 1%;
  width: 5%;
}

// 宽度1280以下
@media all and (max-width: 1280px) {
  .rule-condition .value {
    width: 18%;
  }

  .rule-condition .relation {
    width: 8%;
  }

  .rule-condition .add-del {
    width: 8%;
    margin-left: 1%;
  }

  .rule-condition .result {
    width: 17%;
  }
}

// 宽度1280和1360之间
@media all and (min-width: 1280px) and (max-width: 1360px) {
  .rule-condition .value {
    width: 29%;
  }

  .rule-condition .relation {
    width: 8%;
  }

  .rule-condition .add-del {
    width: 6%;
    margin-left: 1%;
  }

  .rule-condition .result {
    width: 19%;
  }
}

// 宽度1360和1680之间
@media all and (min-width: 1360px) and (max-width: 1680px) {
  .rule-condition .value {
    width: 21%;
  }

  .rule-condition .result {
    width: 20%;
  }

  .rule-condition .relation {
    width: 8%;
  }

  .rule-condition .add-del {
    width: 6%;
    margin-left: 1%;
  }

  .rule-condition .comp {
    width: 14%;
  }
}

// 宽度1680和1920之间
@media all and (min-width: 1680px) and (max-width: 1920px) {
  .rule-condition .value {
    width: 26%;
  }

  .rule-condition .result {
    width: 26%;
  }

  .rule-condition .relation {
    width: 8%;
  }

  .rule-condition .add-del {
    width: 6%;
    margin-left: 1%;
  }

  .rule-condition .comp {
    width: 9%;
  }
}

// 宽度大于1920
@media all and (min-width: 1920px) {
  .rule-condition .value {
    width: 28%;
  }

  .rule-condition .result {
    width: 27%;
  }

  .rule-condition .comp {
    width: 9%;
  }
}

.fr {
  float: right;
}

.v-expansion-panel-content__wrap: {
  padding: 0px !important;
}

.group-temp .activeUserDef {
  color: var(--v-primary-base) !important;
}

#temps .v-radio {
  height: 40px;
  width: 90%;
  margin-left: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.24);
}

#temps  .v-input__control {
  width: 100%;
  height: auto;
}

.v-expansion-panel-header--active {
  background-color: white !important;
}

.v-chip {
  margin: 0 !important;
}

.group-temp .activeUserDef {
  color: var(--v-primary-base) !important;
}

#temps .v-radio {
  height: 40px;
  width: 90%;
  margin-left: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.24);
}

#temps  .v-input__control {
  width: 100%;
  height: auto;
}

#temps .v-radio .mdi:before {
  font-size: 18px;
}

#temps .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner, #calculateIndexDetails_tempGroup .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
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

.group-temp .activeUserDef {
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
</style>
