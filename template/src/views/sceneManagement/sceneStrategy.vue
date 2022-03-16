<!-- author: 古雪瑞-->
<!-- updateTime: 2020-06-17-->
<template>
  <div>
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3',isFixed?'fixed':'']">
        <v-card-actions style="height:60px">
            <v-btn  color="primary" class="ml-4" :disabled="!valid" @click="saveStrategy">保存</v-btn>
            <v-btn  class="ml-4 cancelButton" @click="cancelStrategy" outlined >返回</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-form v-model="valid" :lazy-validation="lazy">
      <v-card class="mb-3">
        <v-card-text class="pt-2 pb-0">
            <!-- 策略选择 -->
            <v-row>
              <v-col
                cols="12"
                class="pr-0 strategy-info"
              >
                策略选择
              </v-col>
              <v-col
                cols="2"
              >
                <v-select
                  v-model="strategySelectForm.strategySet"
                  :items="strategySetItems"
                  item-text="selectText"
                  item-value="selectField"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  class="pt-0 pb-0"
                  @change="selectSterategy(strategySelectForm.strategySet)"
                ></v-select>
              </v-col>
              <v-col
                cols="2"
              >

                <v-select
                  v-model="strategySelectForm.strategyVersion"
                  :items="strategyVersionItems"
                  item-text="selectText"
                  item-value="selectField"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  class="pt-0 pb-0"
                  @change="changeStrategyVersion(strategySelectForm.strategyVersion)"
                ></v-select>
              </v-col>
            </v-row>
            <!-- 策略信息 -->
            <v-row class="operatedRuleSet">
              <v-col
                cols="12"
                class="pr-0 strategy-info"
              >
                策略信息
              </v-col>
              <v-col cols="11">
                <v-chip label outlined class="mr-4 mb-2">
                  所属公司: {{ operatedRuleSet.organizationId | rulesetOrganization(organizationList) }}
                </v-chip>
                <v-chip label outlined class="mr-4 mb-2">
                  匹配模式: {{ operatedRuleSet.matchingModel | filtersShowRuleMatchingModel(ruleMatchingModels) }}
                </v-chip>
                <v-chip label outlined class="mr-4 mb-2">

                  所属应用: {{ operatedRuleSet.appId | rulesetApplication(applications) }}
                </v-chip>
                <v-chip label outlined class="mr-4 mb-2">
                  交易类型: {{ operatedRuleSet.transactionTypeId | rulesetTradeTypes(tradeTypes) }}
                </v-chip>
                <v-chip label outlined class="mr-4 mb-2">
                  规则数量: {{ operatedRuleSet.total }}
                </v-chip>
                <v-chip label outlined class="mr-4 mb-2">
                  启用规则: {{ operatedRuleSet.startUsing }}
                </v-chip>
                <v-chip label outlined class="mr-4 mb-2">
                  停用规则: {{ operatedRuleSet.blockUp }}
                </v-chip>
                <v-chip label outlined class="mb-2">
                  模拟规则: {{ operatedRuleSet.simulation }}
                </v-chip>
              </v-col>
            </v-row>
            <!-- 风险阈值 -->
            <v-row class="operatedRuleSet-select" v-if="operatedRuleSet.matchingModel==='SCORE_MATCH'">
              <v-col
                cols="12"
                class="pr-0 strategy-info"
              >
                策略选择
              </v-col>
              <v-col
                cols="11"
                class="pl-0 pb-0"
              >
                <v-row
                  v-for="(item,index) in operatedRuleSet.riskThreshold"
                  :key="'riskThresholdOperated'+index"
                  class="clear"
                >
                    <v-col cols="1" class="pr-0 pt-0 pb-0 text-center"><v-chip outlined> {{ item.from }} 分 </v-chip></v-col>
                    <v-icon style="height:40px">
                      mdi-minus
                    </v-icon>
                    <v-col cols="1" class="pr-0 pl-0 pt-0 pb-0 text-center"><v-chip outlined> {{ item.to }} 分 </v-chip></v-col>
                    <v-col cols="1" class="pr-0 pl-0 pt-0 pb-0 text-center"><p class="pt-2"> {{ item.strategy | filtersStrategies(strategies) }} </p></v-col>
                </v-row>
              </v-col>
            </v-row>
            <!-- 策略版本 -->
            <!-- <v-row class="operatedRuleSet">
              <v-col
                cols="1"
                class="pr-0 strategy-info"
              >
                策略版本
              </v-col>
              <v-col
                cols="2"
                class="pb-0"
              >
                <p>  {{ strategySelectForm.strategyVersion | conversionStrategyType(this.strategyVersionItems) }} </p>
              </v-col>
            </v-row> -->
            <!-- 策略详情 -->
            <v-row class="operatedRuleSet">
              <v-col
                cols="12"
                class="pr-0 strategy-info pt-0"
              >
                策略详情
              </v-col>
              <v-col
                cols="11"
                class="pl-0 pt-0"
              >
                <v-list>
                  <!-- <v-list-item>
                    <v-list-item-content> -->
                      <v-data-table
                        :headers="operatedRulesHeader"
                        :items="operatedRules"
                        hide-default-footer
                        class="elevation-3"
                        :items-per-page="1000">
                        <template v-slot:item.states="{ item }">
                          <v-btn-toggle class="ruleStatus" color="primary" v-model="item.states">
                            <v-btn value="OFF" style="height:26px" disabled>
                              停用
                            </v-btn>
                            <v-btn value="SIMULATION" style="height:26px" disabled>
                              模拟
                            </v-btn>
                            <v-btn value="OFFICIAL" style="height:26px" disabled>
                              启用
                            </v-btn>
                          </v-btn-toggle>
                        </template>
                        <template v-slot:item.ruleNo="{ item }">
                          {{ item.ruleNo }}
                        </template>
                        <template v-slot:item.ruleName="{ item }">
                          {{ item.ruleName }}
                        </template>
                        <template v-slot:item.comment="{ item }">
                          {{ item.comment }}
                        </template>
                        <template v-if="operatedRuleSet.matchingModel!=='SCORE_MATCH'" v-slot:item.suggestedStrategies="{ item }">
                          {{ item.strategy|filtersStrategies(strategies) }}
                        </template>
                        <template v-slot:item.riskLabel="{ item }">
                          {{ item.labelId|filtersRiskyLabel(riskyLabels) }}
                        </template>
                        <template v-slot:no-data>
                          <div>没有数据</div>
                        </template>
                      </v-data-table>
                    <!-- </v-list-item-content>
                  </v-list-item> -->
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
      </v-card>
      <v-card class="mb-3">
        <v-card-text>
          <!-- 处置策略 -->
            <div class="mb-3">
              <div class="pr-0 strategy-info py-3" style="align-self: start;">处置策略<v-btn color="primary" style="margin-left: 20px;" @click="showCopy">批量复制</v-btn></div>
              <div style="display: flex;align-items: center;">
                <div class="mr-5">处置策略类型</div>
                <v-radio-group
                  mandatory
                  v-model="policyType"
                  @change="policyTypeChange"
                >
                  <div class="radio-box" style="display: flex;align-items: center;">
                    <v-radio class="pr-3"
                      label="规则式"
                      value="1"
                    ></v-radio>
                    <v-radio class="pr-3"
                      label="决策矩阵式"
                      value="2"
                    ></v-radio>
                  </div>
                </v-radio-group>
              </div>
              <!-- 规则式 -->
              <div v-if="policyType === '1'">
                <v-row dense class="ruleSetAddOrEdit" v-for="(currItem, index) in operateStrategyItems" :key="'strategyItem' + index">
                  <v-col cols="12">
                    <div class="strategy-stepHeight pr-2 float-left">当</div>
                    <div class="float-left strategy-stepWidth" style="width: 11%;">
                      <v-select
                        v-model="currItem.disposalStrategyId"
                        item-text="selectText"
                        item-value="selectField"
                        :items="disposalConditionItems"
                        placeholder="请选择处置条件"
                        dense
                        outlined
                        no-data-text="没有匹配数据"
                      />
                    </div>
                    <div class="strategy-stepHeight pl-1 pr-1 float-left">时，命中</div>
                    <div class="float-left strategy-stepWidth">
                      <v-select
                        v-model="currItem.riskLabel"
                        item-text="selectText"
                        item-value="selectField"
                        :items="riskLabelItems"
                        placeholder="请选择风险标签"
                        dense
                        outlined
                        no-data-text="没有匹配数据"
                      />
                    </div>
                    <div class="strategy-stepHeight pl-1 pr-1 float-left">执行</div>
                    <div class="float-left strategy-stepWidth balck-active-item list-data-input">
                      <!-- multiple -->
                      <!-- v-model="blackActionItems.selectField" -->
                      <!-- @change="getlistTypeItems($event)" -->
                      <!-- {{currItem.disposalActionId}} -->
                      <v-select
                        v-model="currItem.disposalActionId"
                        item-text="selectText"
                        item-value="selectField"
                        :items="blackActionItems"
                        placeholder="请选择加黑动作"
                        multiple
                        dense
                        outlined
                        no-data-text="没有匹配数据"
                        @change="getlistTypeItems(index, currItem.disposalActionId,false)"
                      />
                    </div>
                    <div class="strategy-stepHeight pl-1 float-left"></div>
                    <!-- 名单集 -->

                    <!-- :normalizer="normalizer" -->
                    <div class="float-left strategy-stepWidth listTree">
                      <treeselect
                        :multiple="true"
                        :options="currItem.disposalActionList"
                        :disable-branch-nodes="true"
                        :normalizer="normalizer"
                        placeholder="名单集"
                        :value-consists-of="valueConsistsOf"
                        v-model="currItem.listDataId"
                        noChildrenText="没有数据"
                        noResultsText="没有匹配数据"
                        noOptionsText="没有匹配数据"
                        @input="nameTreeChange"
                      />
                    </div>
                    <div class="strategy-stepHeight pl-1 pr-1 float-left">，生成</div>
                    <div class="float-left strategy-stepWidth" style="width: 10%;">
                      <v-select
                        v-model="currItem.workOrderId"
                        item-text="selectText"
                        item-value="selectField"
                        :items="workOrderItems"
                        placeholder="请选择工单类型"
                        dense
                        outlined
                        no-data-text="没有匹配数据"
                      />
                    </div>
                    <div class="float-left pl-1 strategy-stepWidth" style="width: 8%;">
                      <v-text-field
                        v-model="currItem.priority"
                        placeholder="优先级"
                        dense
                        min='0'
                        max='999999'
                        step="1"
                        outlined
                        :rules="[changeInputNumber]"
                        type="number"
                      />
                    </div>
                    <div class="float-left" style="width: 8%">
                      <v-icon
                        color="primary"
                        class="ml-4"
                        style="height:40px;float:left"
                        @click.stop="addStrategyItem(index)"
                      >mdi-plus-circle
                      </v-icon>
                      <v-icon
                        color="primary"
                        class="ml-1"
                        style="height:40px;float:left"
                        @click.stop="delStrategyItem(index)"
                        v-if="operateStrategyItems.length > 1"
                      >mdi-minus-circle
                      </v-icon>
                    </div>
                  </v-col>
                </v-row>
              </div>
              <!-- 决策矩阵式 -->
              <div v-else>
                <div class="mt-4" style="font-size: 14px;color: #999;">注：在决策矩阵表格内，右键可配置指标阈值或执行策略</div>
                <div style="overflow-x: auto;">
                  <table class="decisionMatrix mt-3" border="1" cellspacing="0" bordercolor="#ccc">
                    <tr v-for="(item, index) in matrixData" :key="index">
                      <template v-for="(tdItem, tdIndex) in item">
                        <td ref="tableHeader" class="tableHeader" v-if="tdItem.type === 0" :key="tdIndex" style="background: #e2e5f8;padding: 0;"
                            :colspan="tdItem.colspan" :rowspan="tdItem.rowspan"
                            @contextmenu.prevent.stop="rightConfig(tdItem.type, index, tdIndex)">
                          <canvas id="tableHeaderCanvas" style="display: block;" :width="canvasWidth.toString()" :height="canvasHeight.toString()">
                          </canvas>
                          <span style="bottom: 5%;left: 5%;">条件行</span>
                          <span style="top: 12%;left: 25%;">执行策略</span>
                          <span style="top: 12%;right: 5%;">条件列</span>
                        </td>
                        <td v-else :key="tdIndex" @contextmenu.prevent.stop="rightConfig(tdItem.type, index, tdIndex)"
                            :colspan="tdItem.colspan" :rowspan="tdItem.rowspan"
                            :style="{'background': tdItem.highlight ? 'rgb(184, 222, 255)' : tdItem.type !== 5 ? '#e2e5f8' : '' }">
                          <div v-if="tdItem.type !== 5">
                            <div style="color: #4473DA;">{{ tdItem.conditionFormCN && tdItem.conditionFormCN.conditionName }}</div>
                            <template v-if="tdItem.conditionFormCN">
                              <div v-for="(itm, idx) in tdItem.conditionFormCN.comparator2Threshold" :key="idx">
                                {{ itm.comparator }}<span style="color: #FF0000;"> {{ typeof itm.threshold === 'object'? itm.threshold.label : itm.threshold }} </span>
                                {{idx === tdItem.conditionFormCN.comparator2Threshold.length - 1 ? '' : tdItem.conditionFormCN.relationship}}
                              </div>
                            </template>
                          </div>
                          <div v-else>
                            <div v-for="(itm, idx) in tdItem.executionStrategyFormCN" :key="idx">
                              {{itm.strategyOne}}：{{itm.strategyTwo}}&nbsp;{{itm.strategyOne === '赋值' ? '=&nbsp;' : ''}}{{itm.strategyThree}};
                            </div>
                          </div>
                        </td>
                      </template>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          <v-overlay
            absolute
            :value="overlay && policyType === '2'"
          >
            <v-progress-circular
              indeterminate
              color="primary"
              style="position:absolute;top:20%;left:50%;margin-left:-16px;"
            ></v-progress-circular>
          </v-overlay>
        </v-card-text>
      </v-card>
    </v-form>
    <!-- 公共弹框提示 -->
    <v-snackbar
      v-model="snackbarServe"
      :color="snackbarServeColor"
      :timeout="timeout"
      :top="isSnackbarTop"
    >
      {{ snackbarServeMsg }}
    </v-snackbar>
    <!-- 批量复制弹窗 -->
    <v-dialog v-model="copyDialog"
              persistent
              scrollable
              max-width="1050px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            从场景中选择复制处置策略
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="copyCancel"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div class="strategy-info mt-4">场景选择</div>
          <v-form ref="form" v-model="copyValid" :lazy-validation="copyLazy">
            <v-row>
              <v-col cols="4" style="display: flex;align-items: center;">
                <div class="mr-4" style="min-width: 72px;">应用名称：</div>
                <v-select
                  label="应用名称："
                  required
                  v-model="copyForm.appId"
                  :items="copyAppIds"
                  item-text="appName"
                  item-value="appId"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  @change="changeApp"
                  :rules="[v => !!v || '不能为空']"
                />
              </v-col>
              <v-col cols="4" style="display: flex;align-items: center;">
                <div class="mr-4" style="min-width: 72px;">交易类型：</div>
                <v-select
                  label="交易类型："
                  required
                  v-model="copyForm.tradeTypeId"
                  :items="copyTradeType"
                  item-text="tradeName"
                  item-value="tradeId"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  @change="tradeTypeChange"
                  :rules="[v => !!v || '不能为空']"
                />
              </v-col>
            </v-row>
          </v-form>
          <div v-show="copyForm.tradeTypeId" class="strategy-info mt-4">处置策略信息</div>
          <div v-show="policyType === '1'">
            <div v-show="copyForm.tradeTypeId && copyOperateStrategyItems.length > 0">
              <v-row dense class="ruleSetAddOrEdit" v-for="(currItem, index) in copyOperateStrategyItems" :key="'strategyItem' + index">
                <v-col cols="12">
                  <div class="strategy-stepHeight pr-2 float-left">当</div>
                  <div class="float-left strategy-stepWidth" style="width: 11%;">
                    <v-select
                      v-model="currItem.disposalStrategyId"
                      item-text="selectText"
                      item-value="selectField"
                      :items="disposalConditionItems"
                      placeholder="请选择处置条件"
                      dense
                      outlined
                      no-data-text="没有匹配数据"
                      disabled
                    />
                  </div>
                  <div class="strategy-stepHeight pl-1 pr-1 float-left">时，命中</div>
                  <div class="float-left strategy-stepWidth">
                    <v-select
                      v-model="currItem.riskLabel"
                      item-text="selectText"
                      item-value="selectField"
                      :items="riskLabelItems"
                      placeholder="请选择风险标签"
                      dense
                      outlined
                      no-data-text="没有匹配数据"
                      disabled
                    />
                  </div>
                  <div class="strategy-stepHeight pl-1 pr-1 float-left">执行</div>
                  <div class="float-left strategy-stepWidth balck-active-item list-data-input">
                    <!-- multiple -->
                    <!-- v-model="blackActionItems.selectField" -->
                    <!-- @change="getlistTypeItems($event)" -->
                    <!-- {{currItem.disposalActionId}} -->
                    <v-select
                      v-model="currItem.disposalActionId"
                      item-text="selectText"
                      item-value="selectField"
                      :items="blackActionItems"
                      placeholder="请选择加黑动作"
                      multiple
                      dense
                      outlined
                      no-data-text="没有匹配数据"
                      @change="getlistTypeItems(index, currItem.disposalActionId,false, true)"
                      disabled
                    />
                  </div>
                  <div class="strategy-stepHeight pl-1 float-left"></div>
                  <!-- 名单集 -->
                  <div class="float-left strategy-stepWidth listTree">
                    <treeselect
                      :multiple="true"
                      :options="currItem.disposalActionList"
                      :disable-branch-nodes="true"
                      :normalizer="normalizer"
                      placeholder="名单集"
                      :value-consists-of="valueConsistsOf"
                      v-model="currItem.listDataId"
                      noChildrenText="没有数据"
                      noResultsText="没有匹配数据"
                      noOptionsText="没有匹配数据"
                      @input="nameTreeChange"
                      disabled
                    />
                  </div>
                  <div class="strategy-stepHeight pl-1 pr-1 float-left">，生成</div>
                  <div class="float-left strategy-stepWidth" style="width: 10%;">
                    <v-select
                      v-model="currItem.workOrderId"
                      item-text="selectText"
                      item-value="selectField"
                      :items="workOrderItems"
                      placeholder="请选择工单类型"
                      dense
                      outlined
                      no-data-text="没有匹配数据"
                      disabled
                    />
                  </div>
                  <div class="float-left pl-1 strategy-stepWidth" style="width: 8%;">
                    <v-text-field
                      v-model="currItem.priority"
                      placeholder="优先级"
                      dense
                      outlined
                      type="number"
                      disabled
                    />
                  </div>
                </v-col>
              </v-row>
            </div>
            <div v-show="copyForm.tradeTypeId && copyOperateStrategyItems.length <= 0">
              <v-row><v-col cols="12">没有数据</v-col></v-row>
            </div>
          </div>
          <div style="overflow-x: auto;" v-show="policyType === '2' && copyForm.tradeTypeId">
            <table class="decisionMatrix mt-3" border="1" cellspacing="0" bordercolor="#ccc">
              <tr v-for="(item, index) in copyMatrixData" :key="index">
                <template v-for="(tdItem, tdIndex) in item">
                  <td ref="copyTableHeader" class="tableHeader" v-if="tdItem.type === 0" :key="tdIndex" style="background: #e2e5f8;padding: 0;"
                      :colspan="tdItem.colspan" :rowspan="tdItem.rowspan">
                    <canvas id="copyTableHeaderCanvas" style="display: block;" :width="copyCanvasWidth.toString()" :height="copyCanvasHeight.toString()">
                    </canvas>
                    <span style="bottom: 5%;left: 5%;">条件行</span>
                    <span style="top: 12%;left: 25%;">执行策略</span>
                    <span style="top: 12%;right: 5%;">条件列</span>
                  </td>
                  <td v-else :key="tdIndex" :colspan="tdItem.colspan" :rowspan="tdItem.rowspan"
                      :style="{'background': tdItem.highlight ? 'rgb(184, 222, 255)' : tdItem.type !== 5 ? '#e2e5f8' : '' }">
                    <div v-if="tdItem.type !== 5">
                      <div style="color: #4473DA;">{{ tdItem.conditionFormCN && tdItem.conditionFormCN.conditionName }}</div>
                      <template v-if="tdItem.conditionFormCN">
                        <div v-for="(itm, idx) in tdItem.conditionFormCN.comparator2Threshold" :key="idx">
                          {{ itm.comparator }}<span style="color: #FF0000;"> {{ typeof itm.threshold === 'object'? itm.threshold.label : itm.threshold }} </span>
                          {{idx === tdItem.conditionFormCN.comparator2Threshold.length - 1 ? '' : tdItem.conditionFormCN.relationship}}
                        </div>
                      </template>
                    </div>
                    <div v-else>
                      <div v-for="(itm, idx) in tdItem.executionStrategyFormCN" :key="idx">
                        {{itm.strategyOne}}：{{itm.strategyTwo}}&nbsp;{{itm.strategyOne === '赋值' ? '=&nbsp;' : ''}}{{itm.strategyThree}};
                      </div>
                    </div>
                  </td>
                </template>
              </tr>
            </table>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="copyCancel">取消
            </v-btn>
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white"
              @click="copySave"
              :disabled="!copyValid"
            >
              保存
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 配置条件/执行策略右击menu -->
    <v-card width="120" v-show="isShowRightConfig" :style="{ top: rightMenuTop, left: rightMenuLeft}"
            tile class="configBill" id="configBill" elevation="10" @contextmenu.prevent.stop="prevent">
      <v-list dense v-if="rightConfigType !== 5">
        <v-list-item @click.stop="showConfigCondition">配置条件</v-list-item>
        <v-list-item @click.stop="add2delete(1, 'add')">新建行</v-list-item>
        <v-list-item @click.stop="add2delete(2, 'add')">新建列</v-list-item>
        <v-list-item @click.stop="add2delete(1, 'delete')">删除行</v-list-item>
        <v-list-item @click.stop="add2delete(2, 'delete')">删除列</v-list-item>
        <v-list-item @click="copyCondition">复制条件</v-list-item>
        <v-list-item @click="pasteCondition">粘贴条件</v-list-item>
        <v-list-item @click="resetCondition">清除</v-list-item>
      </v-list>
      <v-list dense v-if="rightConfigType === 5">
        <v-list-item @click.stop="showExecutionStrategyDialog">配置执行策略</v-list-item>
        <v-list-item @click.stop="add2delete(1, 'delete')">删除行</v-list-item>
        <v-list-item @click.stop="add2delete(2, 'delete')">删除列</v-list-item>
        <v-list-item @click="copyStrategy">复制执行策略</v-list-item>
        <v-list-item @click="pasteStrategy">粘贴执行策略</v-list-item>
        <v-list-item @click="resetStrategy">清除</v-list-item>
      </v-list>
    </v-card>
    <!-- 配置条件 -->
    <v-dialog v-model="configConditionDialog"
              persistent
              scrollable
              max-width="700px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            配置条件
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="hideConfigConditionDialog"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="10" style="display: flex;align-items: center;">
              <div class="mr-4" style="min-width: 110px;">条件名称</div>
              <v-autocomplete
                v-model="conditionForm.conditionName"
                :items="condition.conditionName"
                item-text="label"
                item-value="id"
                placeholder="条件名称"
                no-data-text="没有匹配数据"
                outlined
                dense
                :menu-props="{ auto: true, overflowY: true }"
                item-disabled="disabled"
                @change="conditionNameTreeChange"
                class="conditionName"
                :search-input.sync="conditionNameValue"
              >
                <template v-slot:item="{ item }">
                  <div style="max-width: 533px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" :title="item.label" v-html="searchStr(item.label)"></div>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row v-for="(item, index) in conditionForm.comparator2Threshold" :key="index">
            <v-col cols="10" style="display: flex;">
              <div class="mr-4" style="min-width: 110px;line-height: 40px;">{{ index === 0 ? '比较符及阈值' : '' }}</div>
              <v-autocomplete
                v-model="item.comparator"
                style="width: 80px;margin-right: 20px;"
                :items="condition.comparator"
                item-text="compName"
                item-value="compValue"
                placeholder="请选择"
                no-data-text="没有匹配数据"
                outlined
                dense
                :menu-props="{ auto: true, overflowY: true }"
              />
              <v-combobox v-if="condition.type === 'INPUT'"
                v-model="item.threshold"
                :items="condition.threshold"
                item-text="label"
                item-value="id"
                placeholder="请选择"
                no-data-text="没有匹配数据"
                outlined
                dense
                :menu-props="{ auto: true, overflowY: true }"
              ></v-combobox>
              <v-autocomplete v-if="condition.type === 'SELECT'"
                v-model="item.threshold"
                :items="condition.threshold"
                item-text="label"
                item-value="id"
                placeholder="请选择"
                no-data-text="没有匹配数据"
                outlined
                dense
                :menu-props="{ auto: true, overflowY: true }"
                return-object
              />
            </v-col>
            <v-col cols="2">
              <v-icon
                color="primary"
                class="ml-4"
                style="height:40px;float:left"
                @click="addComparator2Threshold"
              >mdi-plus-circle
              </v-icon>
              <v-icon
                color="primary"
                class="ml-1"
                style="height:40px;float:left"
                @click="deleteComparator2Threshold(index)"
              >mdi-minus-circle
              </v-icon>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10" style="display: flex;align-items: center;">
              <div class="mr-4" style="min-width: 110px;">条件逻辑关系</div>
              <v-radio-group
                v-model="conditionForm.relationship"
                row
              >
                <v-radio label="满足全部条件" value="all"></v-radio>
                <v-radio label="满足任意条件" value="or"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="hideConfigConditionDialog">取消
            </v-btn>
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white"
              @click="saveConfigConditionDialog"
            >
              保存
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 配置执行策略 -->
    <v-dialog v-model="configExecutionStrategyDialog"
              persistent
              scrollable
              max-width="1100px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            配置执行策略
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="hideExecutionStrategyDialog"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="min-height: 200px;">
          <v-row v-for="(item, index) in executionStrategyForm" :key="index">
            <v-col cols="3">
              <v-autocomplete
                v-model="item.strategyOne"
                :items="strategyOne"
                item-text="value"
                item-value="id"
                placeholder="请选择"
                no-data-text="没有匹配数据"
                outlined
                dense
                item-disabled="disabled"
                @change="strategyOneChange($event, index)"
              />
            </v-col>
            <v-col cols="3">
              <div class="list-data-input hide">
                <v-select
                  v-model="item.strategyTwo"
                  :items="item.strategyTwoData"
                  item-text="value"
                  item-value="id"
                  placeholder="请选择"
                  no-data-text="没有匹配数据"
                  outlined
                  dense
                  :multiple="item.strategyOne === 1"
                  @change="strategyTwoChange($event, index)"
                />
              </div>
            </v-col>
            <div v-if="item.strategyOne === 3" style="line-height: 64px"> = </div>
            <v-col cols="4">
              <div v-if="item.strategyOne === 1" class="listTree">
                <treeselect
                  :multiple="true"
                  :options="item.strategyThreeData"
                  :disable-branch-nodes="true"
                  :normalizer="normalizer"
                  placeholder="名单集"
                  :value-consists-of="valueConsistsOf"
                  v-model="item.strategyThree"
                  noChildrenText="没有数据"
                  noResultsText="没有匹配数据"
                  noOptionsText="没有匹配数据"
                />
              </div>
              <div class="list-data-input hide"
                   v-else-if="item.strategyOne !== 2 && item.strategyOne !== 1 && item.strategyTwo !== 3">
                <v-autocomplete
                  v-model="item.strategyThree"
                  :items="item.strategyThreeData"
                  item-text="value"
                  item-value="id"
                  placeholder="请选择"
                  no-data-text="没有匹配数据"
                  outlined
                  dense
                  :multiple="item.strategyTwo === 1 && item.strategyOne === 3"
                />
              </div>
              <v-text-field
                v-else-if="item.strategyOne !== 2 && item.strategyOne !== 1 && item.strategyTwo === 3"
                v-model="item.strategyThree"
                placeholder="请输入"
                outlined
                dense
                type="number"
                :rules="[
                  v => (v < 9999) || '权重值最大为9999'
                ]"
              />
            </v-col>
            <v-col cols="1">
              <v-icon
                color="primary"
                style="height:40px;float:left"
                @click="addStrategy"
              >mdi-plus-circle
              </v-icon>
              <v-icon
                color="primary"
                class="ml-1"
                style="height:40px;float:left"
                @click="deleteStrategy(index)"
                v-if="executionStrategyForm.length > 1"
              >mdi-minus-circle
              </v-icon>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="hideExecutionStrategyDialog">取消
            </v-btn>
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white"
              @click="saveExecutionStrategyDialog"
            >
              保存
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import * as dataService from 'api/sceneManagement.js';
import { getVersionInfo, getSubordinateFirm } from 'api/ruleSet.js';
import { mapGetters } from 'vuex';
import { Treeselect, LOAD_ROOT_OPTIONS } from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import moment from 'moment';
export default {
  name: 'sceneStrategy',
  components: {
    Treeselect
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
      };
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
    },
    conversionRuleSet: function (str, itemList) {
      let list;
      itemList.forEach(item => {
        if (item.selectField === str) {
          list = item.versionList;
        }
      });
      return list;
    },
    // 策略类型
    conversionStrategyType: function (str, itemList) {
      let dataTypeText;
      itemList.forEach(item => {
        if (item.selectField === str) {
          dataTypeText = item.selectText;
        }
      });
      return dataTypeText;
    },
    // 规则匹配模式
    filtersShowRuleMatchingModel: function (dataStr, ruleMatchingModels) {
      var ruleMatchingModelText = '';
      ruleMatchingModels.forEach(element => {
        if (dataStr === element.value) {
          ruleMatchingModelText = element.text;
        }
      });
      return ruleMatchingModelText;
    },
    // 规则集所属公司
    rulesetOrganization: function (dataStr, OrganizationList) {
      if (dataStr && typeof (dataStr) === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var organization = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < OrganizationList.length; j++) {
            if (element === OrganizationList[j].id) {
              organization.push(OrganizationList[j].label);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return organization.join('、');
      }
    },
    // 规则集所属应用
    rulesetApplication: function (dataStr, ApplicationList) {
      // console.log(dataStr);
      if (dataStr && typeof (dataStr) === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var Application = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < ApplicationList.length; j++) {
            if (element === ApplicationList[j].id) {
              Application.push(ApplicationList[j].appName);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return Application.join('、');
      }
    },
    // 规则集交易类型
    rulesetTradeTypes: function (dataStr, tradeTypeList) {
      if (dataStr && typeof (dataStr) === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var tradeType = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < tradeTypeList.length; j++) {
            if (element === tradeTypeList[j].id) {
              tradeType.push(tradeTypeList[j].tradeName);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return tradeType.join('、');
      }
    }
  },
  data () {
    return {
      copyValid: true,
      copyLazy: false,
      overlay: false,
      conditionNameValue: '',
      // 批量复制弹窗
      copyDialog: false,
      copyForm: {
        appId: '',
        tradeTypeId: ''
      },
      copyAppIds: [],
      copyTradeType: [],
      copyOperateStrategyItems: [],
      policyType: 1, // 处置策略类型
      // 决策矩阵式
      // type 1 条件列头第一行 type 2 条件列头第一行外 type 3 条件行左侧第一列 type 4 条件行左侧第一行外 type 5 执行策略
      matrixData: [
        [
          { colspan: 1, rowspan: 1, type: 0 },
          { colspan: 1, rowspan: 1, type: 1 }
        ],
        [
          { colspan: 1, rowspan: 1, type: 3 },
          { colspan: 1, rowspan: 1, type: 5 }
        ]
      ],
      copyMatrixData: [
        [
          { colspan: 1, rowspan: 1, type: 0 },
          { colspan: 1, rowspan: 1, type: 1 }
        ],
        [
          { colspan: 1, rowspan: 1, type: 3 },
          { colspan: 1, rowspan: 1, type: 5 }
        ]
      ],
      canvasWidth: 0,
      canvasHeight: 0,
      copyCanvasWidth: 0,
      copyCanvasHeight: 0,
      // 右击
      isShowRightConfig: false,
      rightConfigType: 1,
      createMenuData: { // 新建类型
        index: '',
        tdIndex: '',
        type: '',
        createType: ''
      },
      rightMenuLeft: 0,
      rightMenuTop: 0,
      configConditionDialog: false, // 配置条件
      conditionName: [ // 条件名称
        {
          label: '业务变量库',
          id: 0,
          disabled: true,
          children: [],
          dataType: 'businessVar'
        },
        {
          label: '计算指标库',
          id: 1,
          disabled: true,
          children: [],
          dataType: 'calculationVar'
        },
        {
          label: '名单库',
          id: 2,
          disabled: true,
          children: [],
          dataType: 'listLib'
        },
        {
          label: '规则集结果',
          id: 3,
          disabled: true,
          children: [
            { label: '规则集命中标签', id: 10, dataType: '99', value: 'ruleSetRiskLab' },
            { label: '规则集命中规则', id: 11, dataType: '99', value: 'ruleSetHitRule' },
            { label: '规则集权重值', id: 12, dataType: '100', value: 'ruleSetWeight' },
            { label: '规则集处置策略', id: 13, dataType: '99', value: 'ruleSetStrategy' }
          ]
        }
      ],
      comparator: [],
      condition: {
        conditionName: [], // 条件名称
        comparator: [], // 比较符
        threshold: [], // 阈值
        type: 'SELECT'
      },
      conditionForm: {
        conditionName: null, // 条件名称
        comparator2Threshold: [ // 比较符及阈值
          { comparator: '', threshold: '' }
        ],
        relationship: ''
      },
      copyConditionData: {},
      configExecutionStrategyDialog: false, // 配置执行策略
      // 执行策略
      executionStrategyForm: [
        { strategyOne: '', strategyTwo: '', strategyTwoData: [], strategyThree: '', strategyThreeData: [] }
      ],
      strategyOne: [
        { value: '名单策略', id: 1, disabled: false, execStraType: 'listNameStrategy' },
        { value: '生成', id: 2, disabled: false, execStraType: 'generate' },
        { value: '赋值', id: 3, disabled: false, execStraType: 'assignment' },
        { value: '预警', id: 4, disabled: false, execStraType: 'warning' }
      ],
      copyStrategyData: {},
      isFixed: false,
      // 提示弹框参数
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '',
      valid: true,
      lazy: false,
      delParam: '',
      strategySelectForm: {
        strategySet: '',
        strategyVersion: ''
      },
      // 处置策略
      strategies: [],
      // 风险标签
      riskyLabels: [],
      organizationList: [],
      // 规则匹配模式
      ruleMatchingModels: [
        { text: '最坏匹配', value: 'WORST_MATCH' },
        { text: '首次匹配', value: 'FIRST_MATCH' },
        { text: '评分模式', value: 'SCORE_MATCH' }
      ],
      // 所属应用
      applications: [],
      // 交易类型
      tradeTypes: [],
      // 添加规则的数据
      operatedRules: [],
      // 策略选择选项
      strategySetItems: [],
      strategyVersionItems: [],
      // 策略信息
      operatedRuleSet: {},
      // 风险阈值
      riskThreshold: [],
      sourceId: '',
      sourceVersion: '',
      // 规则列表的表头
      operatedRulesHeader: [],
      // 处置策略form
      disposalStrategyForm: {},
      // 处置条件
      disposalConditionItems: [
        // { selectText: '请选择', selectField: '' }
      ],
      // 风险标签
      riskLabelItems: [
        { selectText: '请选择', selectField: '' }
      ],
      // 加黑动作
      blackActionItems: [
        // { selectText: '请选择', selectField: '' }
      ],
      // blackActionItems: [],
      // listItem: null,
      // listOptionList: [],
      // 名单集集合
      // nameListSetItems: [],

      // 选择工单
      workOrderItems: [
        { selectText: '请选择', selectField: '' }
      ],
      // 名单集数据
      operateStrategyItems: [],
      pageParams: '',
      valueConsistsOf: 'ALL_WITH_INDETERMINATE',
      isSaveStrategy: false, // 策略编辑是否是第一次保存
      saveSourceIdObj: [], // 用于存放引用源id
      delSourceIdObj: [] // 删除保存策略引用记录时候存储上一次的名单集
      // appIdNew: ''
    };
  },
  created () {
    // 在页面刷新时将vuex里的信息保存到localStorage里
    // window.addEventListener('beforeunload', () => {
    //   localStorage.setItem('sceneAppId', this.appId);
    // });

    // // 在页面加载时读取localStorage里的状态信息
    // this.appIdNew = localStorage.getItem('sceneAppId');
  },
  computed: {
    ...mapGetters([
      'appId',
      'secondLevelRouterItems'
    ]),
    // 搜索值添加背景色
    searchStr () {
      return (str) => {
        if (!this.conditionNameValue) return str;
        return str.replace(this.conditionNameValue, `<span style="color: rgba(0,0,0,.38);background: #eee;">${this.conditionNameValue}</span>`);
      };
    },
    newCreateMenuData () {
      const { index, tdIndex, type } = this.createMenuData;
      return { index, tdIndex, type };
    }
  },
  watch: {
    matrixData (oldVal, newVal) {
      this.canvasWidth = 0;
      this.canvasHeight = 0;
      this.$nextTick(() => {
        this.setCanvasStyle();
      });
    },
    newCreateMenuData (newVal, oldVal) {
      // 高亮
      if (newVal.type === 5) {
        if (oldVal.type === 5 && (oldVal.index !== '' || oldVal.tdIndex !== '')) {
          this.highlight(false, oldVal);
          this.highlight(true, newVal);
        } else {
          this.highlight(true, newVal);
        }
      } else {
        oldVal.type === 5 && this.highlight(false, oldVal);
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.fixedBtnBox);
    document.addEventListener('click', (event) => {
      this.hideRightConfig(event);
      this.createMenuData.type = '';
    });
    document.addEventListener('contextmenu', (event) => {
      this.hideRightConfig(event);
      this.createMenuData.type = '';
    });
    if (this.secondLevelRouterItems) {
      this.pageParams = Object.assign({}, this.secondLevelRouterItems);
    }
    this.initGetData(this.pageParams);
    this.getPolicyType(() => {
      if (this.policyType === '1') {
        Promise.all([
          this.getApplicationList(),
          this.getAllTradeTypeList(),
          this.getStrategiesList(),
          this.getRiskyLabelsList(),
          this.getOrganizationList(),
          this.getDisposalActionList(),
          this.getWorkOrderList(),
          this.queryStrategyData(),
          Promise.all([
            this.getQuerycountsymbolFn(),
            this.getQueryallfield(),
            this.getQueryindicwithtype(),
            this.getEffective(),
            this.getqueryHitRuleByRuleSetId(),
            this.getfindsysparams('sys_risk_label'),
            this.getfindsysparams('sys_strategy')
          ]).then((result) => {
            this.$nextTick(() => {
              let arr = [];
              this.conditionName.forEach((item, index) => {
                let value = JSON.parse(JSON.stringify(item));
                delete value.children;
                arr.push(value);
                arr.push(item.children);
                arr.push({
                  disabled: true,
                  divider: true
                });
              });
              arr.splice(arr.length - 1, 1);
              this.condition.conditionName = [].concat.apply([], arr);
              this.overlay = false;
            });
          })
        ]);
      } else {
        this.overlay = true;
        this.getApplicationList();
        this.getAllTradeTypeList();
        this.getStrategiesList();
        this.getRiskyLabelsList();
        this.getOrganizationList();
        this.getDisposalActionList();
        this.getWorkOrderList();
        Promise.all([
          this.getQuerycountsymbolFn(),
          this.getQueryallfield(),
          this.getQueryindicwithtype(),
          this.getEffective(),
          this.getqueryHitRuleByRuleSetId(),
          this.getfindsysparams('sys_risk_label'),
          this.getfindsysparams('sys_strategy')
        ]).then((result) => {
          this.$nextTick(() => {
            let arr = [];
            this.conditionName.forEach((item, index) => {
              let value = JSON.parse(JSON.stringify(item));
              delete value.children;
              arr.push(value);
              arr.push(item.children);
              arr.push({
                disabled: true,
                divider: true
              });
            });
            arr.splice(arr.length - 1, 1);
            this.condition.conditionName = [].concat.apply([], arr);
            this.queryStrategyData();
            this.overlay = false;
          });
        });
      }
    });
  },
  beforeDestroy () {
    window.removeEventListener('click', this.hideRightConfig);
    window.removeEventListener('contextmenu', this.hideRightConfig);
  },
  methods: {
    async getPolicyType (cb) {
      const response = await dataService.queryStrategy({ id: this.strategyId, appId: this.appId });
      this.policyType = response.data.data.disposalStrategyType;
      cb && cb();
    },
    // 检测优先级输入的时候的数值合法性校验
    changeInputNumber (v) {
      if (v < 0) {
        return '请输入正数';
      } else if (v > 999999) {
        return '请输入0~999999之间的数字';
      } else {
        return true;
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
      this.isShowRightConfig = false;
    },
    // 批量复制弹窗
    // 关闭
    copyCancel () {
      this.copyDialog = false;
      this.copyForm.appId = '';
      this.copyForm.tradeTypeId = '';
    },
    showCopy () {
      this.queryAppIdsForScenarioManager();
      this.copyDialog = true;
    },
    // 保存
    copySave () {
      if (this.policyType === '1') {
        this.operateStrategyItems = JSON.parse(JSON.stringify(this.copyOperateStrategyItems));
      } else {
        this.matrixData = this.copyMatrixData;
      }
      this.copyCancel();
    },
    // 查询分配给当前用户并且有处置策略的应用集合
    queryAppIdsForScenarioManager () {
      dataService.queryAppIdsForScenarioManager({ disposalStrategyType: this.policyType }).then(res => {
        if (res.data.code === 200) {
          this.copyAppIds = res.data.data;
        }
      });
    },
    // 根据应用ID查询有处置策略的交易类型
    changeApp () {
      this.copyOperateStrategyItems = [];
      this.copyForm.tradeTypeId = '';
      dataService.queryTradeTypeForScenarioManager({ appId: this.copyForm.appId, disposalStrategyType: this.policyType }).then(res => {
        if (res.data.code === 200) {
          this.copyTradeType = res.data.data;
        }
      });
    },
    // 根据应用ID和交易类型ID查询处置策略
    async tradeTypeChange () {
      this.copyForm.disposalStrategyType = this.policyType;
      const response = await dataService.queryStrategyData(this.copyForm);
      let responseData = response.data.data;
      if (response.data.code === 200) {
        this.copyOperateStrategyItems = [];
        if (responseData && responseData.length !== 0) {
          this.isSaveStrategy = false;
          if (this.policyType === '1') {
            for (let i = 0; i < responseData.length; i++) {
              this.copyOperateStrategyItems.push({
                disposalStrategyId: responseData[i].disposalStrategyId,
                disposalActionList: [],
                disposalActionId: responseData[i].disposalActionId === '[]' ? [] : responseData[i].disposalActionId === '' ? [] : responseData[i].disposalActionId === null ? [] : JSON.parse(responseData[i].disposalActionId),
                riskLabel: responseData[i].riskLabel,
                priority: responseData[i].priority.toString(),
                // listDataId: responseData[i].listDataId === '[]' ? [] : JSON.parse(responseData[i].listDataId),
                listDataId: responseData[i].listDataId === '[]' ? [] : responseData[i].listDataId === '' ? [] : responseData[i].listDataId === null ? [] : JSON.parse(responseData[i].listDataId),
                workOrderId: responseData[i].workOrderId,
                listDataIds: responseData[i].listDataIds
              });
              // 获取返回的回显名单集数据
              this.delSourceIdObj.push(responseData[i].listDataId === '[]' ? [] : responseData[i].listDataId === '' ? [] : responseData[i].listDataId === null ? [] : JSON.parse(responseData[i].listDataId));
              if (responseData[i].disposalActionId) {
                await this.getlistTypeItems(i, responseData[i].disposalActionId, true, true);
              }
            }
          } else if (this.policyType === '2') {
            this.getDecisionMatrix(responseData, true);
            this.$nextTick(() => this.setCanvasStyle());
          }
        }
      }
    },

    policyTypeChange (type) {
      if (type === '2') {
        if (this.condition.conditionName.length <= 0) {
          this.overlay = true;
        }
        this.$nextTick(() => {
          this.setCanvasStyle();
        });
      } else {
        this.getRegularStyle([]);
      }
    },
    // 矩阵式左上角画斜线
    setCanvasStyle () {
      let width = !this.copyDialog ? this.$refs.tableHeader[0] && this.$refs.tableHeader[0].offsetWidth
        : this.$refs.copyTableHeader[0] && this.$refs.copyTableHeader[0].offsetWidth;
      let height = !this.copyDialog ? this.$refs.tableHeader[0] && this.$refs.tableHeader[0].offsetHeight
        : this.$refs.copyTableHeader[0] && this.$refs.copyTableHeader[0].offsetHeight;
      !this.copyDialog ? this.canvasWidth = width - 1 : this.copyCanvasWidth = width - 1;
      !this.copyDialog ? this.canvasHeight = height - 1 : this.copyCanvasHeight = height - 1;
      if (width !== undefined || height !== undefined) {
        this.$nextTick(() => {
          let canvas = !this.copyDialog ? document.getElementById('tableHeaderCanvas')
            : document.getElementById('copyTableHeaderCanvas');
          let context = canvas.getContext('2d');
          context.clearRect(0, 0, width, height);
          context.moveTo(0, height / 2);
          context.lineTo(width, height);
          context.moveTo(width / 2, 0);
          context.lineTo(width, height);
          context.strokeStyle = '#ccc';
          context.stroke();
        });
      }
    },
    hideRightConfig (e) {
      if (e.target.className !== 'configBill' && e.target.className !== 'v-list-item theme--light') {
        this.isShowRightConfig = false;
        let obj = {
          index: this.createMenuData.index,
          tdIndex: this.createMenuData.tdIndex,
          type: this.createMenuData.type
        };
        if (obj.type === 5 && (obj.index !== '' || obj.tdIndex !== '')) {
          this.highlight(false, obj);
        }
      }
    },
    prevent () {},
    // 右击配置
    rightConfig (type, index, tdIndex) {
      if (type === 0) return;
      let ev = window.event || event;
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      let offsetHeight = document.documentElement.offsetHeight || document.body.offsetHeight;
      this.rightMenuLeft = ev.pageX + 'px';
      let menuHeight = 32 * (type === 5 ? 6 : 8) + 16;
      if ((offsetHeight - ev.pageY) < menuHeight) {
        this.rightMenuTop = ev.pageY - scrollTop - menuHeight + 'px';
      } else {
        this.rightMenuTop = ev.pageY - scrollTop + 'px';
      }
      this.isShowRightConfig = true;
      this.rightConfigType = type;
      this.createMenuData.index = index; // trindex
      this.createMenuData.tdIndex = tdIndex; // tdindex
      this.createMenuData.type = type;
    },
    // 高亮
    highlight (highlight, obj) {
      if (obj.type !== 5) return;
      this.matrixData[obj.index][obj.tdIndex].highlight = highlight;
      let type = '';
      type = this.matrixData[obj.index][0].type === 3 ? 0 : 1;
      // 列
      this.matrixData.forEach((trItm, trIdx) => {
        if (trItm[0].type === 0) {
          let type1Index = 0;
          let type1Colspan = 0;
          for (let k = 0; k < trItm.length; k++) {
            type1Colspan += trItm[k].colspan;
            if ((obj.tdIndex + 1 + type) <= type1Colspan) {
              type1Index = k;
              break;
            }
          }
          this.matrixData[trIdx][type1Index].highlight = highlight;
        } else if (trItm[0].type === 2) {
          this.matrixData[trIdx][obj.tdIndex - this.matrixData[0][0].colspan + type].highlight = highlight;
        } else if (trItm[0].type === 3) {
          if (trIdx <= obj.index) {
            this.matrixData[trIdx][obj.tdIndex + type].highlight = highlight;
          }
        } else if (trItm[0].type === 4) {
          if (trIdx <= obj.index) {
            type === 0 ? this.matrixData[trIdx][obj.tdIndex - 1].highlight = highlight : this.matrixData[trIdx][obj.tdIndex].highlight = highlight;
          }
        }
      });
      // 行
      if (type === 1) {
        let idx = '';
        if (this.matrixData[obj.index][0].type === 3) {
          idx = obj.index;
        } else {
          let firstArr = [obj.index];
          this.matrixData.forEach((item, index) => {
            if (item[0].type === 3) {
              firstArr.push(index);
            }
          });
          firstArr.sort(function (a, b) { return a - b; });
          idx = firstArr[firstArr.indexOf(obj.index) - 1];
        }
        this.matrixData[idx][0].highlight = highlight;
      }
      this.matrixData[obj.index].forEach((tdItem, tdIndex) => {
        if (tdIndex <= obj.tdIndex) {
          this.matrixData[obj.index][tdIndex].highlight = highlight;
        }
      });
    },
    // 取消高亮
    cancelHighlight () {
      this.matrixData.forEach(tr => {
        tr.forEach(td => {
          td.highlight = false;
        });
      });
    },
    // 新建行/列、删除行/列
    add2delete (createType, operationType) {
      this.createMenuData.createType = createType;
      if (operationType === 'delete') this.cancelHighlight();
      if (createType === 1) { // 新建行2删除行
        if (!this.returnDelete(createType) && operationType === 'delete') {
          this.isShowRightConfig = false;
          return false;
        }
        this.add2deleteCol(createType, operationType);
      } else if (createType === 2) { // 新建列2删除列
        if (!this.returnDelete(createType) && operationType === 'delete') {
          this.isShowRightConfig = false;
          return false;
        }
        this.add2deleteRow(createType, operationType);
      }
      this.isShowRightConfig = false;
    },
    // 新建删除行
    add2deleteCol (createType, operationType) {
      this.createMenuData.type = this.createMenuData.type === 5 ? 4 : this.createMenuData.type;
      // console.log(this.createMenuData);
      if (this.createMenuData.type === 1) { // 条件列
        let addData = JSON.parse(JSON.stringify(this.matrixData[0]));
        addData.forEach(item => {
          delete item.conditionFormCN;
          delete item.conditionForm;
          delete item.executionStrategyFormCN;
          delete item.executionStrategyForm;
        });
        let tdNum = 0;
        addData.splice(0, 1);
        addData.forEach(item => {
          tdNum += item.colspan;
          item.type = item.type === 1 ? 2 : item.type;
          item.colspan = 1;
        });
        if (addData.length < tdNum) {
          let differ = tdNum - addData.length;
          for (let i = 0; i < differ; i++) {
            addData.push(addData[0]);
          }
        }
        if (operationType === 'delete') { // 删除
          let tableHeader = JSON.parse(JSON.stringify(this.matrixData[0][0]));
          this.matrixData.splice(0, 1);
          this.matrixData[0].unshift(tableHeader);
          this.matrixData[0][0].rowspan -= 1;
          this.matrixData[0].forEach(item => {
            if (item.type === 2) item.type = 1;
          });
        } else { // 添加
          this.matrixData.splice(1, 0, addData);
          this.matrixData[0][0].rowspan += 1;
        }
      } else if (this.createMenuData.type === 2) {
        let addData = JSON.parse(JSON.stringify(this.matrixData[this.createMenuData.index]));
        addData.forEach(item => {
          delete item.conditionFormCN;
          delete item.conditionForm;
          delete item.executionStrategyFormCN;
          delete item.executionStrategyForm;
        });
        operationType === 'add' ? this.matrixData.splice(this.createMenuData.index + 1, 0, addData)
          : this.matrixData.splice(this.createMenuData.index, 1);
        operationType === 'add' ? this.matrixData[0][0].rowspan += 1
          : this.matrixData[0][0].rowspan -= 1;
        // 当条件列只有第一行时，如果有colspan拆分
        let colArr = this.matrixData.filter(item => {
          return item[0].type === 2;
        });
        if (colArr.length <= 0) {
          this.matrixData[0].forEach((item, index) => {
            if (item.type === 1 && item.colspan > 1) {
              let copyData = JSON.parse(JSON.stringify(item));
              copyData.colspan = 1;
              for (let i = 0; i < item.colspan - 1; i++) {
                this.matrixData[0].splice(index, 0, copyData);
              }
              item.colspan = 1;
            }
          });
        }
      } else if (this.createMenuData.type === 3) { // 条件行
        let addData = JSON.parse(JSON.stringify(this.matrixData[this.createMenuData.index]));
        addData.forEach(item => {
          delete item.conditionFormCN;
          delete item.conditionForm;
          delete item.executionStrategyFormCN;
          delete item.executionStrategyForm;
        });
        addData[0].rowspan = 1;
        if (operationType === 'add') {
          this.matrixData.splice(this.matrixData[this.createMenuData.index][0].rowspan + this.createMenuData.index,
            0, addData);
        } else {
          let deleteNum = this.matrixData[this.createMenuData.index][0].rowspan + this.createMenuData.index;
          for (let i = this.matrixData.length - 1; i >= 0; i--) {
            if (i >= this.createMenuData.index && i < deleteNum) {
              this.matrixData.splice(i, 1);
            }
          }
        }
      } else if (this.createMenuData.type === 4) {
        let addData = JSON.parse(JSON.stringify(this.matrixData[this.createMenuData.index]));
        addData.forEach(item => {
          delete item.conditionFormCN;
          delete item.conditionForm;
          delete item.executionStrategyFormCN;
          delete item.executionStrategyForm;
        });
        if (this.createMenuData.index === this.getIndex()) {
          addData.splice(0, 1);
        }
        operationType === 'add' ? this.matrixData[this.getIndex()][0].rowspan += 1
          : this.matrixData[this.getIndex()][0].rowspan -= 1;
        if (this.matrixData[this.getIndex()][0].rowspan > 0) {
          let type3Obj = this.matrixData[this.getIndex()][0];
          if (operationType === 'add') {
            this.matrixData.splice(this.createMenuData.index + 1, 0, addData);
          } else {
            let deleteData = JSON.parse(JSON.stringify(this.matrixData[this.createMenuData.index]));
            this.matrixData.splice(this.createMenuData.index, 1);
            deleteData[0].type === 3 && this.matrixData[this.createMenuData.index].unshift(type3Obj);
          }
        } else {
          operationType === 'add' ? this.matrixData.splice(this.createMenuData.index + 1, 0, addData)
            : this.matrixData.splice(this.createMenuData.index, 1);
        }
      }
    },
    // 新建删除列
    add2deleteRow (createType, operationType) {
      this.createMenuData.type === 5 && (this.createMenuData.tdIndex = this.getIndex());
      this.createMenuData.type = this.createMenuData.type === 5 ? 2 : this.createMenuData.type;
      if (this.createMenuData.type === 1 || this.createMenuData.type === 2) { // 条件列
        let deleteData = [{ colspan: 0 }];
        this.matrixData.forEach((item, index) => {
          let addData = JSON.parse(JSON.stringify(item[item.length - 1]));
          delete addData.conditionFormCN;
          delete addData.conditionForm;
          delete addData.executionStrategyFormCN;
          delete addData.executionStrategyForm;
          if (item[0].type === 0) {
            if (this.createMenuData.type === 1) {
              addData.colspan = 1;
              if (operationType === 'add') {
                item.splice(this.createMenuData.tdIndex + 1, 0, addData);
              } else {
                deleteData = item.splice(this.createMenuData.tdIndex, 1);
              }
            } else if (this.createMenuData.type === 2) {
              if (item[this.getIndex()]) {
                if (item[this.getIndex()].colspan > 1) {
                  operationType === 'add' ? item[this.getIndex()].colspan += 1 : item[this.getIndex()].colspan -= 1;
                } else {
                  operationType === 'add' ? item[this.getIndex()].colspan += 1 : item.splice(this.getIndex(), 1);
                }
              }
            }
          } else if (item[0].type === 2) {
            if (this.createMenuData.type === 1) {
              if (operationType === 'add') {
                item.splice(this.getColspan(2).colNum + 1, 0, addData);
              } else {
                for (let k = 0; k < deleteData[0].colspan; k++) {
                  item.splice(this.getColspan(2).colNum, 1);
                }
              }
            } else {
              operationType === 'add' ? item.splice(this.createMenuData.tdIndex + 1, 0, addData)
                : item.splice(this.createMenuData.tdIndex, 1);
            }
            if (this.matrixData[0][this.getIndex()] && this.matrixData[0][this.getIndex()].colspan <= 0 && operationType === 'delete') {
              this.matrixData[0].splice(this.getIndex(), 1);
            }
          } else if (item[0].type === 3) {
            if (this.createMenuData.type === 1) {
              if (operationType === 'add') {
                item.splice(this.getColspan(3).colNum + 1, 0, addData);
              } else {
                for (let k = 0; k < deleteData[0].colspan; k++) {
                  item.splice(this.getColspan(2).colNum + deleteData[0].colspan, 1);
                }
              }
            } else {
              // if (operationType === 'add') {
              //   item.splice(this.createMenuData.tdIndex + this.matrixData[0][0].colspan + 1, 0, addData);
              // } else {
              //   for (let k = 0; k < deleteData[0].colspan; k++) {
              //     item.splice(this.createMenuData.tdIndex + this.matrixData[0][0].colspan, 1);
              //   }
              // }
              operationType === 'add' ? item.splice(this.createMenuData.tdIndex + this.matrixData[0][0].colspan + 1, 0, addData)
                : item.splice(this.createMenuData.tdIndex + this.matrixData[0][0].colspan, 1);
            }
          } else if (item[0].type === 4) {
            if (this.createMenuData.type === 1) {
              if (operationType === 'add') {
                item.splice(this.getColspan(3).colNum, 0, addData);
              } else {
                for (let k = 0; k < deleteData[0].colspan; k++) {
                  item.splice(this.getColspan(2).colNum - 1 + deleteData[0].colspan, 1);
                }
              }
            } else {
              // if (operationType === 'add') {
              //   item.splice(this.createMenuData.tdIndex + this.matrixData[0][0].colspan, 0, addData);
              // } else {
              //   for (let k = 0; k < deleteData[0].colspan; k++) {
              //     item.splice(this.createMenuData.tdIndex + this.matrixData[0][0].colspan - 1, 1);
              //   }
              // }
              operationType === 'add' ? item.splice(this.createMenuData.tdIndex + this.matrixData[0][0].colspan, 0, addData)
                : item.splice(this.createMenuData.tdIndex + this.matrixData[0][0].colspan - 1, 1);
            }
          }
        });
      } else if (this.createMenuData.type === 3 || this.createMenuData.type === 4) { // 条件行
        let deleteType = '';
        if (this.matrixData[this.createMenuData.index][0].type === 3) {
          deleteType = 1;
        } else {
          deleteType = 2;
        }
        operationType === 'add' ? this.matrixData[0][0].colspan += 1 : this.matrixData[0][0].colspan -= 1;
        if (this.createMenuData.type === 3) {
          this.matrixData.forEach((item, index) => {
            let addData = JSON.parse(JSON.stringify(item[0]));
            delete addData.conditionFormCN;
            delete addData.conditionForm;
            delete addData.executionStrategyFormCN;
            delete addData.executionStrategyForm;
            if (item[0].type === 3) {
              addData.type = 4;
              addData.rowspan = 1;
              if (operationType === 'add') {
                item.splice(1, 0, addData);
              } else {
                item.splice(0, 1);
                this.matrixData[index][0].type = 3;
              }
            } else if (item[0].type === 4) {
              if (operationType === 'add') {
                item.splice(0, 0, addData);
              } else {
                this.matrixData[index][0].type = 3;
              }
            }
          });
        } else if (this.createMenuData.type === 4) {
          for (let j = this.matrixData.length - 1; j >= 0; j--) {
            let addData = JSON.parse(JSON.stringify(this.matrixData[j][0]));
            delete addData.conditionFormCN;
            delete addData.conditionForm;
            delete addData.executionStrategyFormCN;
            delete addData.executionStrategyForm;
            if (this.matrixData[j][0].type === 3) {
              addData.type = 4;
              addData.rowspan = 1;
              if (operationType === 'add') {
                if (this.matrixData[j][0].type === 3) { // 点击的为合并行的非第一行
                  this.matrixData[j].splice(deleteType === 2 ? this.createMenuData.tdIndex + 2 : this.createMenuData.tdIndex + 1, 0, addData);
                } else { // 点击的为合并行的第一行
                  this.matrixData[j].splice(deleteType === 2 ? this.createMenuData.tdIndex + 1 : this.createMenuData.tdIndex, 0, addData);
                }
              } else {
                this.matrixData[j].splice(deleteType === 2 ? this.createMenuData.tdIndex + 1 : this.createMenuData.tdIndex, 1);
                if (this.matrixData[0][0].colspan <= 1 && this.matrixData[j][0].rowspan > 1) {
                  // let copyData = JSON.parse(JSON.stringify(this.matrixData[j][0]));
                  // copyData.rowspan = 1;
                  // for (let i = 0; i < this.matrixData[j][0].rowspan - 1; i++) {
                  //   this.matrixData[i + 1 + j] && this.matrixData[i + 1 + j].splice(0, 0, copyData);
                  // }
                  this.matrixData[j][0].rowspan = this.matrixData[j][0].rowspan - 1;
                }
              }
            } else if (this.matrixData[j][0].type === 4) {
              if (operationType === 'add') {
                if (this.matrixData[j][0].type === 3) { // 点击的为合并行的非第一行
                  this.matrixData[j].splice(deleteType === 2 ? this.createMenuData.tdIndex + 2 : this.createMenuData.tdIndex + 1, 0, addData);
                } else { // 点击的为合并行的第一行
                  this.matrixData[j].splice(deleteType === 2 ? this.createMenuData.tdIndex + 1 : this.createMenuData.tdIndex, 0, addData);
                }
              } else {
                this.matrixData[j].splice(deleteType === 2 ? this.createMenuData.tdIndex : this.createMenuData.tdIndex - 1, 1);
                if (this.matrixData[j][0].type === 5) {
                  this.matrixData.splice(j, 1);
                }
              }
            }
          }
        }
      }
    },
    // 阻止最后一行一列的删除
    returnDelete (createType) {
      if (createType === 1) {
        let colArr = this.matrixData.filter(item => {
          return item[0].type === 0 ? item[1].type === 1 : item[0].type === 2;
        });
        if (colArr.length <= 1 && (this.createMenuData.type === 1 || this.createMenuData.type === 2)) {
          return false;
        } else if ((this.matrixData.length - colArr.length) <= 1 && (this.createMenuData.type !== 1 && this.createMenuData.type !== 2)) {
          return false;
        }
      } else if (createType === 2) {
        if (this.createMenuData.type !== 3 && this.createMenuData.type !== 4) {
          if (this.matrixData[1][0].type === 2) {
            if (this.matrixData[0].length === 2 && this.matrixData[1].length === 1) return false;
          } else {
            if (this.matrixData[0].length === 2) return false;
          }
        } else {
          if (this.matrixData[0][0].colspan === 1) return false;
        }
      }
      return true;
    },
    // 决策矩阵相关
    getColspan (lineType, tdIndex) {
      let tdIdx = tdIndex || this.createMenuData.tdIndex;
      let colNum = 0;
      let colOneNum = 0;
      this.matrixData[0].forEach((item, index) => {
        if (lineType === 2 && item.type !== 0 && index <= tdIdx) {
          colNum += item.colspan;
          colOneNum += 1;
        } else if (lineType === 3 && index <= tdIdx) {
          colNum += item.colspan;
          colOneNum += 1;
        }
      });
      return { colNum: colNum, colOneNum: colOneNum };
    },
    // 决策矩阵相关
    getIndex () {
      let idx = '';
      if (this.createMenuData.type === 4) {
        if (this.matrixData[this.createMenuData.index][0].type === 3) {
          idx = this.createMenuData.index;
        } else {
          let firstArr = [this.createMenuData.index];
          this.matrixData.forEach((item, index) => {
            if (item[0].type === 3) {
              firstArr.push(index);
            }
          });
          firstArr.sort(function (a, b) { return a - b; });
          idx = firstArr[firstArr.indexOf(this.createMenuData.index) - 1];
        }
      } else if (this.createMenuData.type === 2) {
        if (this.createMenuData.tdIndex === 0) {
          idx = 1;
        } else {
          let colNum = 0;
          for (let i = 0; i < this.matrixData[0].length; i++) {
            if (this.matrixData[0][i].type === 1) {
              colNum += (this.matrixData[0][i].colspan === 0 ? 1 : this.matrixData[0][i].colspan);
              if (this.createMenuData.tdIndex < colNum) {
                idx = i;
                break;
              }
            }
          }
        }
      } else if (this.createMenuData.type === 5) {
        let colNum = this.matrixData[0][0].colspan;
        let tdArr = this.matrixData[1][0].type === 2 ? this.matrixData[1] : this.matrixData[0];
        for (let i = 0; i < tdArr.length; i++) {
          if (this.createMenuData.tdIndex === colNum) {
            idx = i;
            break;
          }
          colNum += (tdArr[i].colspan === 0 ? 1 : tdArr[i].colspan);
        }
      }
      return idx;
    },

    // 配置条件
    showConfigCondition () {
      if (this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionForm && this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionForm.conditionName) {
        this.conditionForm = JSON.parse(JSON.stringify(this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionForm));
        let dataType = '';
        let enumList = '';
        let label = '';
        this.condition.conditionName.forEach((item, index) => {
          if (item.id === this.conditionForm.conditionName) {
            dataType = item.dataType;
            enumList = item.enumList;
            label = item.label;
          }
        });
        this.getQuerycountsymbol(dataType);
        this.getThreshold(dataType, enumList, label);
      }
      this.isShowRightConfig = false;
      this.configConditionDialog = true;
    },
    // 隐藏配置条件
    hideConfigConditionDialog () {
      this.conditionForm = {
        conditionName: null, // 条件名称
        comparator2Threshold: [ // 比较符及阈值
          { comparator: '', threshold: '' }
        ],
        relationship: ''
      };
      this.configConditionDialog = false;
    },
    // 保存配置条件
    saveConfigConditionDialog (isEcho) {
      if (!this.conditionForm.conditionName) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请选择条件名称！';
        this.snackbarServeColor = 'error';
        return;
      }
      for (let i = 0; i < this.conditionForm.comparator2Threshold.length; i++) {
        if (!this.conditionForm.comparator2Threshold[i].comparator) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '请选择比较符！';
          this.snackbarServeColor = 'error';
          return;
        }
        if (!this.conditionForm.comparator2Threshold[i].threshold) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '请选择阈值！';
          this.snackbarServeColor = 'error';
          return;
        }
      }
      if (!this.conditionForm.relationship) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请选择条件逻辑关系！';
        this.snackbarServeColor = 'error';
        return;
      }
      let conditionFormCN = {
        conditionName: null, // 条件名称
        comparator2Threshold: JSON.parse(JSON.stringify(this.conditionForm.comparator2Threshold)), // 比较符及阈值
        relationship: ''
      };
      this.condition.conditionName.forEach(item => {
        if (item.id === this.conditionForm.conditionName) {
          conditionFormCN.conditionName = item.label;
          conditionFormCN.value = item.value;
        }
      });
      conditionFormCN.comparator2Threshold.forEach((item, index) => {
        this.condition.comparator.forEach(cItem => {
          if (item.comparator === cItem.compValue) {
            item.comparator = cItem.compName;
          }
        });
      });
      conditionFormCN.relationship = this.conditionForm.relationship === 'all' ? '且' : '或';
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionFormCN = conditionFormCN;
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionForm = this.conditionForm;
      this.hideConfigConditionDialog();
      this.$nextTick(() => {
        this.setCanvasStyle();
      });
    },
    // 配置条件-业务变量库
    getQueryallfield () {
      return new Promise((resolve, reject) => {
        dataService.queryallfield({ isContainEnum: 1 }).then(res => {
          if (res.data.code === 200) {
            let resData = [];
            res.data.data.forEach(item => {
              resData.push({ label: item.fieldName, value: item.fieldValue, id: item.id, dataType: item.dataType, enumList: item.enumList });
            });
            this.conditionName[0].children = resData;
            resolve('success');
          }
        });
      });
    },
    // 配置条件-计算指标库
    getQueryindicwithtype () {
      return new Promise((resolve, reject) => {
        dataService.queryindicwithtype().then(res => {
          if (res.data.code === 200) {
            let resData = [];
            res.data.data.forEach(item => {
              resData.push({ label: item.indicName, value: item.indicMode, id: item.id, dataType: item.dataType, enumList: item.enumList });
            });
            this.conditionName[1].children = resData;
            resolve('success');
          }
        });
      });
    },
    // 配置条件-名单库
    getEffective () {
      return new Promise((resolve, reject) => {
        dataService.mdfindsysparams({ identifier: 'sys_list_type' }).then(res => {
          if (res.data.code === 200) {
            let listType = [];
            res.data.data.forEach(item => {
              if (item.paramName !== '白名单') {
                listType.push(item.paramValue);
              }
            });
            dataService.effective({ appType: 1, listType: listType.join() }).then(resp => {
              if (resp.data.code === 200) {
                let resData = [];
                resp.data.data.forEach(item => {
                  resData.push({ label: item.listName, value: item.listType, id: item.id, dataType: item.dataType });
                });
                this.conditionName[2].children = resData;
                resolve('success');
              }
            });
          }
        });
      });
    },
    // 条件名称change
    async conditionNameTreeChange (conditionForm, callback) {
      let dataType = '';
      let enumList = '';
      let label = '';
      let conditionName = conditionForm.conditionName ? conditionForm.conditionName : this.conditionForm.conditionName;
      this.condition.conditionName.forEach((item, index) => {
        if (item.id === conditionName) {
          dataType = item.dataType;
          enumList = item.enumList;
          label = item.label;
        }
      });
      this.conditionForm.comparator2Threshold.forEach((item, index) => {
        this.conditionForm.comparator2Threshold[index].comparator = '';
        this.conditionForm.comparator2Threshold[index].threshold = '';
      });
      await this.getQuerycountsymbol(dataType);
      await this.getThreshold(dataType, enumList, label, callback);
    },
    addComparator2Threshold () {
      this.conditionForm.comparator2Threshold.push({ comparator: '', threshold: '' });
    },
    deleteComparator2Threshold (index) {
      if (this.conditionForm.comparator2Threshold.length <= 1) return;
      this.conditionForm.comparator2Threshold.splice(index, 1);
    },
    // 配置条件-取系统中的计算符
    getQuerycountsymbolFn () {
      dataService.querycountsymbol().then(res => {
        if (res.data.code === 200) {
          this.comparator = res.data.data.list;
        }
      });
    },
    async getQuerycountsymbol (dataType) {
      if (dataType === 'String' || dataType === 'boolean' || dataType === '99') { // 等于、不等于
        this.condition.comparator = this.comparator.filter(item => {
          return item.compName === '等于' || item.compName === '不等于';
        });
      } else if (dataType === undefined) { // 等于且默认为等于
        this.condition.comparator = this.comparator.filter(item => {
          return item.compName === '等于';
        });
        this.conditionForm.comparator2Threshold.forEach(item => {
          item.comparator = this.condition.comparator[0].compValue;
        });
      } else { // 所有
        this.condition.comparator = this.comparator;
      }
    },
    // 配置条件-阈值
    async getThreshold (dataType, enumList, label, callback) {
      if (dataType === 'String' && enumList && enumList.length > 0) { // 字符型&&枚举值----下拉框
        let arr = [];
        enumList.forEach(item => {
          arr.push({
            label: item.fieldName,
            id: item.id,
            value: item.fieldValue
          });
        });
        this.condition.threshold = arr;
        this.condition.type = 'SELECT';
      } else if (dataType === 'String' && !enumList) { // 字符型&&不为枚举值----输入框、业务变量库及计算指标库中数据类型为字符型的
        this.condition.threshold = this.condition.conditionName.filter(item => {
          return item.dataType === 'String' || item.disabled;
        });
        this.condition.type = 'INPUT';
      } else if (dataType === 'boolean') { // 布尔型（boolean）----是、否、业务变量库和计算指标库为布尔型的变量和指标
        let arr = this.condition.conditionName.filter(item => {
          return item.dataType === 'boolean' || item.disabled;
        });
        this.condition.threshold = [
          {
            label: '布尔值',
            id: 1000,
            disabled: true
          },
          {
            label: '是',
            id: 1001
          },
          {
            label: '否',
            id: 1002
          },
          {
            disabled: true,
            divider: true
          }
        ];
        this.condition.threshold = this.condition.threshold.concat(arr);
        this.condition.type = 'SELECT';
      } else if (dataType && dataType !== '99' && dataType !== '100' && dataType !== 'String' && dataType !== 'boolean') { // 其他类型----自定义、其他类型
        this.condition.threshold = this.condition.conditionName.filter(item => {
          return (item.dataType && item.dataType !== '99' && item.dataType !== '100' &&
            item.dataType !== 'String' && item.dataType !== 'boolean') || item.disabled;
        });
        this.condition.type = 'INPUT';
      } else if (dataType === undefined) { // 名单库----命中、不命中
        this.condition.threshold = [
          {
            label: '命中',
            id: 2001
          },
          {
            label: '不命中',
            id: 2002
          }
        ];
        this.condition.type = 'SELECT';
      } else if (dataType === '99') { // 规则集命中标签、规则集命中规则、规则集处置策略----该规则集版本下的对应标签、命中规则集、处置策略
        if (label === '规则集命中规则') {
          this.condition.threshold = this.condition.threshold1;
          // this.queryHitRuleByRuleSetId();
        } else if (label === '规则集命中标签') {
          // this.findsysparams('sys_risk_label');
          this.condition.threshold = this.condition.threshold2;
        } else if (label === '规则集处置策略') {
          // this.findsysparams('sys_strategy');
          this.condition.threshold = this.condition.threshold3;
        }
        this.condition.type = 'SELECT';
      } else if (dataType === '100') { // 权重值----自定义以及业务变量库或计算指标库的数据类型为单精度浮点型（float）、整型（int）、长整型（long）、双精度浮点型（double）、对象（Object）
        this.condition.threshold = this.condition.conditionName.filter(item => {
          return item.dataType === 'float' || item.dataType === 'int' ||
            item.dataType === 'long' || item.dataType === 'double' || item.dataType === 'Object' || item.disabled;
        });
        this.condition.type = 'INPUT';
      }
      callback && callback();
    },
    // 规则集命中规则-阈值
    getqueryHitRuleByRuleSetId () {
      dataService.queryHitRuleByRuleSetId({ ruleSetId: this.pageParams.targetId }).then(res => {
        if (res.data.code === 200) {
          let threshold = [];
          res.data.data.forEach(item => {
            threshold.push({
              label: item.ruleName,
              id: item.id,
              value: item.ruleNo
            });
          });
          this.condition.threshold1 = threshold;
        }
      });
    },
    // 规则集命中风险标签或规则集处置策略-阈值
    getfindsysparams (identifier) {
      dataService.findsysparams({ identifier: identifier }).then(res => {
        if (res.data.code === 200) {
          let threshold = [];
          res.data.data.forEach(item => {
            threshold.push({
              label: item.paramName,
              id: item.id,
              value: item.paramValue
            });
          });
          if (identifier === 'sys_risk_label') {
            this.condition.threshold2 = threshold;
          } else {
            this.condition.threshold3 = threshold;
          }
        }
      });
    },
    // 复制条件
    copyCondition () {
      this.copyConditionData = {
        conditionFormCN: this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionFormCN,
        conditionForm: this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionForm
      };
    },
    // 粘贴条件
    pasteCondition () {
      if (!this.copyConditionData.conditionFormCN || !this.copyConditionData.conditionForm) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请先复制条件！';
        this.snackbarServeColor = 'error';
        return;
      }
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionFormCN = this.copyConditionData.conditionFormCN;
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionForm = this.copyConditionData.conditionForm;
      this.$nextTick(() => {
        this.setCanvasStyle();
      });
    },
    // 清除条件
    resetCondition () {
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionFormCN = '';
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].conditionForm = '';
      this.$nextTick(() => {
        this.setCanvasStyle();
      });
    },

    // 配置执行策略
    showExecutionStrategyDialog () {
      if (this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyForm && this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyForm.length > 0) {
        this.executionStrategyForm = JSON.parse(JSON.stringify(this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyForm));
        this.strategyOneChange();
      }
      this.isShowRightConfig = false;
      this.configExecutionStrategyDialog = true;
    },
    // 隐藏配置执行策略
    hideExecutionStrategyDialog () {
      this.executionStrategyForm = [
        { strategyOne: '', strategyTwo: '', strategyTwoData: [], strategyThree: '', strategyThreeData: [] }
      ];
      this.strategyOne.forEach(item => {
        item.disabled = false;
      });
      this.configExecutionStrategyDialog = false;
    },
    saveExecutionStrategyDialog () {
      let executionStrategyFormCN = [];
      for (let i = 0; i < this.executionStrategyForm.length; i++) {
        if (!this.executionStrategyForm[i].strategyOne) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '执行策略未填写完整！';
          this.snackbarServeColor = 'error';
          return;
        }
        if (!this.executionStrategyForm[i].strategyTwo || this.executionStrategyForm[i].strategyTwo.length <= 0) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '执行策略未填写完整！';
          this.snackbarServeColor = 'error';
          return;
        }
        if ((this.executionStrategyForm[i].strategyOne !== 2 && !this.executionStrategyForm[i].strategyThree) ||
          (this.executionStrategyForm[i].strategyOne !== 2 && this.executionStrategyForm[i].strategyThree.length <= 0)) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '执行策略未填写完整！';
          this.snackbarServeColor = 'error';
          return;
        }
        if (this.executionStrategyForm[i].strategyOne === 3 && this.executionStrategyForm[i].strategyTwo === 3) {
          if (this.executionStrategyForm[i].strategyThree > 9999) {
            this.snackbarServe = true;
            this.snackbarServeMsg = '权重最大值为9999！';
            this.snackbarServeColor = 'error';
            return;
          }
        }
        let strategyOne = '';
        let strategyTwo = '';
        let strategyThree = '';
        this.strategyOne.forEach(item => {
          if (item.id === this.executionStrategyForm[i].strategyOne) {
            strategyOne = item.value;
          }
        });
        if (this.executionStrategyForm[i].strategyOne === 1) {
          strategyTwo = [];
          strategyThree = [];
          this.executionStrategyForm[i].strategyTwoData.forEach(item => {
            this.executionStrategyForm[i].strategyTwo.forEach(vItem => {
              if (vItem === item.id) {
                strategyTwo.push(item.value);
              }
            });
          });
          strategyTwo = strategyTwo.join();
          this.executionStrategyForm[i].strategyThreeData.forEach(item => {
            item.children.forEach(cItem => {
              this.executionStrategyForm[i].strategyThree.forEach(vItem => {
                if (vItem === cItem.id) {
                  strategyThree.push(cItem.label);
                }
              });
            });
          });
          strategyThree = strategyThree.join();
        } else if (this.executionStrategyForm[i].strategyOne === 2) {
          this.executionStrategyForm[i].strategyTwoData.forEach(item => {
            if (this.executionStrategyForm[i].strategyTwo === item.id) {
              strategyTwo = item.value;
            }
          });
        } else if (this.executionStrategyForm[i].strategyOne === 3) {
          this.executionStrategyForm[i].strategyTwoData.forEach(item => {
            if (this.executionStrategyForm[i].strategyTwo === item.id) {
              strategyTwo = item.value;
            }
          });
          if (this.executionStrategyForm[i].strategyTwo === 3) {
            strategyThree = this.executionStrategyForm[i].strategyThree;
          } else if (this.executionStrategyForm[i].strategyTwo === 1) {
            strategyThree = [];
            this.executionStrategyForm[i].strategyThree.forEach(itm => {
              this.executionStrategyForm[i].strategyThreeData.forEach(item => {
                if (itm === item.id) {
                  strategyThree.push(item.value);
                }
              });
            });
            strategyThree = strategyThree.join();
          } else {
            this.executionStrategyForm[i].strategyThreeData.forEach(item => {
              if (this.executionStrategyForm[i].strategyThree === item.id) {
                strategyThree = item.value;
              }
            });
          }
        } else if (this.executionStrategyForm[i].strategyOne === 4) {
          this.executionStrategyForm[i].strategyTwoData.forEach(item => {
            if (this.executionStrategyForm[i].strategyTwo === item.id) {
              strategyTwo = item.value;
            }
          });
          this.executionStrategyForm[i].strategyThreeData.forEach(item => {
            if (this.executionStrategyForm[i].strategyThree === item.id) {
              strategyThree = item.value;
            }
          });
        }
        executionStrategyFormCN.push({ strategyOne: strategyOne, strategyTwo: strategyTwo, strategyThree: strategyThree });
      }
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyFormCN = executionStrategyFormCN;
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyForm = this.executionStrategyForm;
      this.hideExecutionStrategyDialog();
      this.$nextTick(() => {
        this.setCanvasStyle();
      });
    },
    // 配置执行策略相关
    // 添加
    addStrategy () {
      this.executionStrategyForm.push({ strategyOne: '', strategyTwo: '', strategyTwoData: [], strategyThree: '', strategyThreeData: [] });
    },
    // 删除
    deleteStrategy (index) {
      this.executionStrategyForm.splice(index, 1);
      this.strategyOneChange();
    },
    async strategyOneChange ($event, index) {
      this.strategyOne.forEach(item => {
        item.disabled = false;
      });
      this.executionStrategyForm.forEach(item => {
        if (item.strategyOne) {
          this.strategyOne[item.strategyOne - 1].disabled = true;
        }
      });
      if ($event === undefined) return;
      this.executionStrategyForm[index].strategyTwo = '';
      this.executionStrategyForm[index].strategyTwoData = [];
      this.executionStrategyForm[index].strategyThree = '';
      this.executionStrategyForm[index].strategyThreeData = [];
      if ($event === 1) {
        this.executionStrategyForm[index].strategyTwo = [];
        this.executionStrategyForm[index].strategyThree = [];
        await this.getBlacklistTmpl(index);
      } else if ($event === 2) {
        await this.getFindsysparams(index);
      } else if ($event === 3) {
        this.executionStrategyForm[index].strategyTwoData = [
          { id: 1, value: '标签', assignmentType: 'riskLab' },
          { id: 2, value: '处置策略', assignmentType: 'disposalStrategy' },
          { id: 3, value: '权重值', assignmentType: 'weightValue' }
        ];
      } else if ($event === 4) {
        this.executionStrategyForm[index].strategyTwoData = [
          { id: 1, value: '短信预警', warningType: 'phoneWarning' },
          { id: 2, value: '邮件预警', warningType: 'emailWarning' }
        ];
      }
    },
    strategyTwoChange ($event, index) {
      this.executionStrategyForm[index].strategyThree = '';
      if (this.executionStrategyForm[index].strategyOne === 1) {
        this.executionStrategyForm[index].strategyThree = [];
        this.getQueryData(index);
      } else if (this.executionStrategyForm[index].strategyOne === 3 && $event === 1) { // 生成-标签 sys_risk_label
        this.executionStrategyForm[index].strategyThree = [];
        this.getLabel2strategy(index, 'sys_risk_label');
      } else if (this.executionStrategyForm[index].strategyOne === 3 && $event === 2) { // 生成-处置策略 sys_strategy
        this.getLabel2strategy(index, 'sys_strategy');
      } else if (this.executionStrategyForm[index].strategyOne === 4 && $event === 1) { // 预警-短信
        this.getSysWarnPhoneGroup(index);
      } else if (this.executionStrategyForm[index].strategyOne === 4 && $event === 2) { // 预警-邮件
        this.getSysWarnEmailGroup(index);
      }
    },
    // 获取黑名单策略
    async getBlacklistTmpl (index, executionStrategyForm) {
      dataService.blacklistTmpl().then(res => {
        if (res.data.code === 200) {
          let strategyTwoData = [];
          res.data.data.forEach(item => {
            strategyTwoData.push({ id: item.id, value: item.tmplName });
          });
          executionStrategyForm ? executionStrategyForm[index].strategyTwoData = strategyTwoData : this.executionStrategyForm[index].strategyTwoData = strategyTwoData;
        }
      });
    },
    // 黑名单策略对应的名单集
    async getQueryData (index) {
      dataService.queryData({ appId: this.appId, blackListStrategyId: this.executionStrategyForm[index].strategyTwo.join() }).then(res => {
        if (res.data.code === 200) {
          let nameListArry = res.data.data;
          let arr = [];
          // 迭代第一层
          nameListArry.forEach((v) => {
            arr.push({
              id: v.id,
              label: v.tag,
              children: []
            });
          });
          // 循环迭代第二级
          arr.forEach((o, j) => {
            nameListArry.forEach((v, m) => {
              if (o.id === v.id) {
                // 比较查找对应id 下的children
                if (v.data.length > 0) {
                  v.data.forEach((cItem) => {
                    o.children.push({
                      id: cItem.id,
                      label: cItem.listName
                    });
                  });
                }
              }
            });
          });
          this.executionStrategyForm[index].strategyThreeData = arr;
        }
      });
    },
    // 生成 获取工单类型
    async getFindsysparams (index) {
      dataService.findsysparams({ identifier: 'work_order_id' }).then(res => {
        if (res.data.code === 200) {
          let strategyTwoData = [];
          res.data.data.forEach(item => {
            strategyTwoData.push({ id: item.id, value: item.paramName, type: item.paramValue });
          });
          this.executionStrategyForm[index].strategyTwoData = strategyTwoData;
        }
      });
    },
    // 生成-标签、生成-处置策略
    getLabel2strategy (index, label) {
      dataService.findsysparams({ identifier: label }).then(res => {
        if (res.data.code === 200) {
          let strategyThreeData = [];
          res.data.data.forEach(item => {
            strategyThreeData.push({ id: item.id, value: item.paramName, type: item.paramValue });
          });
          this.executionStrategyForm[index].strategyThreeData = strategyThreeData;
        }
      });
    },
    // 获取邮件通知群组
    getSysWarnEmailGroup (index) {
      dataService.sysWarnEmailGroup().then(res => {
        if (res.data.code === 200) {
          let strategyThreeData = [];
          res.data.data.forEach(item => {
            strategyThreeData.push({ id: item.id, value: item.groupName });
          });
          this.executionStrategyForm[index].strategyThreeData = strategyThreeData;
        }
      });
    },
    // 获取短信通知群组
    getSysWarnPhoneGroup (index) {
      dataService.sysWarnPhoneGroup().then(res => {
        if (res.data.code === 200) {
          let strategyThreeData = [];
          res.data.data.forEach(item => {
            strategyThreeData.push({ id: item.id, value: item.groupName });
          });
          this.executionStrategyForm[index].strategyThreeData = strategyThreeData;
        }
      });
    },
    // 复制执行策略
    copyStrategy () {
      this.copyStrategyData = {
        executionStrategyFormCN: this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyFormCN,
        executionStrategyForm: this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyForm
      };
    },
    // 粘贴执行策略
    pasteStrategy () {
      if (!this.copyStrategyData.executionStrategyFormCN || !this.copyStrategyData.executionStrategyForm) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请先复制执行策略！';
        this.snackbarServeColor = 'error';
        return;
      }
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyFormCN = this.copyStrategyData.executionStrategyFormCN;
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyForm = this.copyStrategyData.executionStrategyForm;
      this.$nextTick(() => {
        this.setCanvasStyle();
      });
    },
    // 清除执行策略
    resetStrategy () {
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyFormCN = '';
      this.matrixData[this.createMenuData.index][this.createMenuData.tdIndex].executionStrategyForm = '';
      this.$nextTick(() => {
        this.setCanvasStyle();
      });
    },

    // 获取风险标签
    async getRiskyLabelsList () {
      const params = {
        identifier: 'sys_risk_label'
      };
      try {
        const response = await dataService.getAllTradeType(params);
        this.riskyLabels = response.data.data;
        this.riskyLabels.forEach(item => {
          this.riskLabelItems.push({
            selectText: item.paramName,
            selectField: item.id
          });
        });
      } catch (error) {}
    },
    async getOrganizationList () {
      try {
        const response = await getSubordinateFirm();
        this.organizations = response.data.data.companyItems;
        this.treeToList(this.organizations);
      } catch (error) {}
    },
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
    // 获取枚举下拉数据  应用
    async getApplicationList () {
      try {
        const response = await dataService.getApp({ size: 10000 });
        this.applications = response.data.data.records;
      } catch (error) {}
    },
    // 获取枚举下拉数据  所有交易类型（系统参数库取）
    async getAllTradeTypeList () {
      const params = {
        tradeName: '',
        identifier: '',
        isAmount: ''
      };
      try {
        const response = await dataService.findtradelist(params);
        this.tradeTypes = response.data.data;
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
        this.strategies.forEach(item => {
          this.disposalConditionItems.push({
            selectText: item.paramName,
            selectField: item.id
          });
        });
      } catch (error) {}
    },
    // 获取处置动作数据
    async getDisposalActionList () {
      try {
        const response = await dataService.getDisposalActionList();
        let res = response.data.data;
        res.forEach(item => {
          this.blackActionItems.push({
            selectText: item.tmplName,
            selectField: item.id
          });
        });
      } catch (error) {
        console.log(error, '下拉选择错误');
      }
    },
    // 获取s暂停业务内容
    async getlistTypeItems (index, paramId, type, isCopy) {
      try {
        if (paramId) { // 不是请选择时再调接口查询
          let params = {
            appId: this.appId,
            blackListStrategyId: type ? JSON.parse(paramId).join(',') : paramId.toString()
          };
          // 选执行下拉后的级联二级下拉列表
          const res = await dataService.queryNameListNode(params);
          if (res.data.code === 200) {
            let nameListArry = res.data.data;
            let arr = [];
            // 迭代第一层
            nameListArry.forEach((v) => {
              arr.push({
                id: v.id,
                label: v.tag,
                children: []
              });
            });
            // 循环迭代第二级
            arr.forEach((o, j) => {
              nameListArry.forEach((v, m) => {
                if (o.id === v.id) {
                  // 比较查找对应id 下的children
                  if (v.data.length > 0) {
                    v.data.forEach((cItem) => {
                      o.children.push({
                        id: cItem.id,
                        label: cItem.listName
                      });
                    });
                  }
                }
              });
            });
            // console.log(arr, 'arr数据');
            // this.nameListSetItems = arr;
            // {{currItem.disposalActionList}}
            isCopy ? this.copyOperateStrategyItems[index].disposalActionList = arr : this.operateStrategyItems[index].disposalActionList = arr; // 树结构的option
            // console.log(this.operateStrategyItems[index].listDataIds ,'最初的数据');
            // this.operateStrategyItems[index].listDataId = this.nameListSetItems.id;
          }
        } else {
          isCopy ? this.copyOperateStrategyItems[index].disposalActionList = [] : this.operateStrategyItems[index].disposalActionList = [];
          isCopy ? this.copyOperateStrategyItems[index].listDataId = [] : this.operateStrategyItems[index].listDataId = [];
        }
        // if (!type) {
        //   this.operateStrategyItems[index].listDataId = [];
        // }
      } catch (err) {
        // 捕获错误信息
      }
    },
    // 树形结构上
    normalizer (node) {
      // 去掉children=null的属性
      if (node.children === null || node.children === 'null') {
        delete node.children;
      }
    },
    // 名单集选择
    nameTreeChange (node, instanceId) {
      // this.operateStrategyItems.listDataId =node;
      // console.log(node, this.operateStrategyItems, '选择的额内容');
    },
    // 获取工单数据
    async getWorkOrderList () {
      const params = {
        identifier: 'work_order_id'
      };
      try {
        const response = await dataService.getAllTradeType(params);
        let res = response.data.data;
        res.forEach(item => {
          this.workOrderItems.push({
            selectText: item.paramName,
            selectField: item.id
          });
        });
      } catch (error) {}
    },
    async initGetData (item) {
      // let ssion = window.sessionStorage;
      // let sceneAppId = ssion.getItem('sceneAppId');
      // console.log(sceneAppId,'会丢失吗。。。')
      this.sourceId = item.id; // 当前编辑的这条场景的id
      this.delParam = item; // 点击编辑策略后，当前那条场景的数据
      this.operatedRuleSet = {};
      this.operatedRules = [];
      this.strategyVersionItems = [];
      this.strategySetItems = [];
      this.strategySelectForm = {
        strategySet: '',
        strategyVersion: ''
      };
      this.strategyId = item.strategyId; // 每一条场景对应的strategyId

      let param = {
        // startIndex: 1,
        // pageSize: 1000,
        appId: this.appId,
        transactionTypeId: item.tradeId
      };
      try {
        // this.queryStrategyData(); // 查询处置策略数据
        // if (param.appId === '' || param.appId === null) {
        //   param.appId = this.appIdNew;
        // }
        const res = await dataService.getRuleSet(param);
        // 规则集列表信息
        let resData = res.data.data;
        // console.log(resData, 'resData9999');
        if (item.targetName !== null) { // 如果已经保存过策略，点击策略编辑反显，否则显示规则集列表第一条
          let currentElementName = item.targetName;
          resData.forEach((item, index, ary) => {
            if (ary[index].setName === currentElementName) {
              this.operatedRuleSet = ary[index];
            }
          });
        } else {
          if (resData.length > 0) {
            this.operatedRuleSet = resData[0];
          } else {
            this.operatedRuleSet = {};
          }
        }
        resData.forEach((item, index, ary) => {
          this.strategySetItems.push({
            selectText: item.setName,
            selectField: item.id,
            versionList: item.rulesetHistoryList
          });
        });
        if (item.targetName !== null) {
          let currentElement = item.targetName;
          this.strategySetItems.forEach((item, index, ary) => {
            if (ary[index].selectText === currentElement) {
              this.strategySelectForm.strategySet = ary[index];
            }
          });
        } else {
          this.strategySelectForm.strategySet = this.strategySetItems[0];
        }

        // console.log(this.strategySelectForm.strategySet, '处置策略，。。。');
        let versionItems = this.$options.filters.conversionRuleSet(this.strategySelectForm.strategySet.selectField, this.strategySetItems);
        console.log(versionItems, 'versionItems');
        versionItems.forEach((item, index, ary) => {
          this.strategyVersionItems.push({
            selectText: item.histVersion,
            selectField: item.id
          });
        });
        this.strategyVersionItems.sort((prev, next) => { return next.selectText - prev.selectText; });
        // console.log(this.strategyVersionItems, item.targetVersion, ' 11111111this.返显规则集版本号');
        if (item.targetVersion !== null) { // 返显规则集版本号
          let currentVersion = parseInt(item.targetVersion);
          for (let currentItem of this.strategyVersionItems) {
            if (currentItem.selectText === currentVersion) {
              this.strategySelectForm.strategyVersion = currentItem.selectField;
              break;
            } else {
              // 不相等，找出最大的版本号赋值
              this.strategySelectForm.strategyVersion = this.strategyVersionItems[0].selectField;
            }
          }
        } else {
          // console.log('没有值 找出最大的版本号赋值',this.strategyVersionItems[0].selectField)
          this.strategySelectForm.strategyVersion = this.strategyVersionItems[0].selectField;
        }

        this.targetId = this.strategySelectForm.strategySet.selectField; // 保存策略时需要的规则集id
        let ruleSetParam = {
          id: this.strategySelectForm.strategyVersion
        };
        this.getdetailList(ruleSetParam);
      } catch (err) {}
    },
    cancelStrategy () {
      // console.log(this.$router,'返回');
      // this.$router.go(-1);
      this.$router.push('/sceneManagement');
    },
    // 两个对象比较是否相同
    isObjectValueEqual (a, b) {
      let aProps = Object.getOwnPropertyNames(a);
      let bProps = Object.getOwnPropertyNames(b);
      if (aProps.length !== bProps.length) {
        return false;
      }
      for (let i = 0; i < aProps.length - 1; i++) {
        let propName = aProps[i];
        let propA = a[propName];
        let propB = b[propName];
        if (Array.isArray(propA) && Array.isArray(propB) && propA.sort().toString() !== propB.sort().toString()) {
          return false;
        } else if (!Array.isArray(propA) && !Array.isArray(propB) && propA !== propB) {
          return false;
        }
      }
      return true;
    },
    getObjectEqualResults (data) {
      let arr = data;
      let i = 0;
      while (i < arr.length - 1) {
        for (let j = i + 1; j < arr.length; j++) {
          let isshow = this.isObjectValueEqual(arr[i], arr[j]);
          if (isshow) { // 如果比较的两个对象相同就返回true
            return true;
          }
        }
        i++;
      }
      return false;
    },

    // 根据子级id查找父级id
    findPnodeId (data, nodeId) {
      let result;
      if (!data) {
        return;
      }
      for (let l = 0; l < data.length; l++) {
        for (let i = 0; i < data[l].children.length; i++) {
          let item = data[l].children[i];
          if (item.id === nodeId) {
            result = data[l].dataType;
            return result;
          } else if (item.children && item.children.length > 0) {
            result = this.findPnodeId(item, nodeId);
            if (result) {
              return result;
            }
          }
        }
      }
      return result;
    },
    // 规则式
    regularStyle () {
      for (let i = 0; i < this.operateStrategyItems.length; i++) {
        if (this.operateStrategyItems[i].listDataId === '' || this.operateStrategyItems[i].listDataId === null) {
          this.operateStrategyItems[i].listDataId = [];
        }
        if (this.operateStrategyItems[i].disposalActionId.length !== 0 && !this.operateStrategyItems[i].listDataId.toString()) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '请选择名单集';
          this.snackbarServeColor = 'error';
          return;
        }
        // if (this.operateStrategyItems[i].disposalActionList && !this.operateStrategyItems[i].listDataId.toString()) {
        //   this.snackbarServe = true;
        //   this.snackbarServeMsg = '请选择名单集';
        //   this.snackbarServeColor = 'error';
        //   return;
        // }
        // 处理往后台返回保存数据
        this.operateStrategyItems[i].listDataIds = [];
        // 名单集勾选的数据  saveSourceId
        let listDataId = this.operateStrategyItems[i].listDataId;
        this.saveSourceIdObj.push(listDataId);
        // 名单集整个树结构
        let disposalActionList = this.operateStrategyItems[i].disposalActionList;
        let partentId = '';
        listDataId.forEach(item => {
          partentId = '';
          disposalActionList.forEach(listItem => {
            if (listItem.children && listItem.children.length) {
              listItem.children.forEach(child => {
                if (child.id === item) {
                  partentId = listItem.id;
                }
              });
            }
          });
          // 判断inputData中是否有parentId
          let has = false;
          if (this.operateStrategyItems[i].listDataIds.length) {
            this.operateStrategyItems[i].listDataIds.forEach(inputItem => {
              if (inputItem.id === partentId) {
                has = true;
                inputItem.children.push({ id: item });
              }
            });
          }
          if (!has) {
            this.operateStrategyItems[i].listDataIds.push(
              {
                id: partentId,
                children: [{ id: item }]
              }
            );
          }
        });
        // if (this.operateStrategyItems[i].listDataId.length > 1) {
        //   this.operateStrategyItems[i].listDataId = this.operateStrategyItems[i].listDataId.filter(item => item !== '');
        // }
      }
      let getResults = this.getObjectEqualResults(this.operateStrategyItems);// 判断处置策略有无重复
      if (getResults) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '处置策略重复，请重新编辑';
        this.snackbarServeColor = 'error';
        return;
      }
      for (let i = 0; i < this.operateStrategyItems.length; i++) {
        // disposalActionList
        // delete this.operateStrategyItems[i].nameListSetItems; // 点击保存时，删除参数中此字段
        delete this.operateStrategyItems[i].disposalActionList;
        delete this.operateStrategyItems[i].listDataId;
      }
    },
    // 决策矩阵式
    decisionMatrix () {
      let disposalStrategy = [];
      this.matrixData.forEach((item, index) => {
        disposalStrategy.push([]);
        item.forEach((cItem, cIndex) => {
          if (cItem.type === 0) {
            disposalStrategy[index].push({
              'type': 'remarks',
              'name': '条件行,执行策略,条件行',
              'colspan': cItem.colspan,
              'rowspan': cItem.rowspan,
              'tdType': cItem.type
            });
          } else if (cItem.type !== 5 && cItem.type !== 0) {
            let conditionForm = cItem.conditionForm ? cItem.conditionForm : {};
            let conditionFormCN = cItem.conditionFormCN ? cItem.conditionFormCN : {};
            let filedType = '';
            for (let i = 0; i < this.condition.conditionName.length; i++) {
              if (this.condition.conditionName[i].id === conditionForm.conditionName &&
                this.condition.conditionName[i].dataType !== '99' && this.condition.conditionName[i].dataType !== '100') {
                filedType = this.condition.conditionName[i].dataType;
                break;
              }
            }
            if (!filedType) {
              if (conditionForm.conditionName === 10 || conditionForm.conditionName === 11 || conditionForm.conditionName === 13) {
                filedType = 'String';
              } else if (conditionForm.conditionName === 12) {
                filedType = 'double';
              } else {
                filedType = 'boolean';
              }
            }
            disposalStrategy[index].push({
              'colspan': cItem.colspan,
              'rowspan': cItem.rowspan,
              'type': cItem.type === 1 || cItem.type === 2 ? 'caseCol' : 'caseRow',
              'id': conditionForm.conditionName >= 10 && conditionForm.conditionName <= 13
                ? '' : conditionForm.conditionName || '',
              'code': conditionForm.conditionName >= 10 && conditionForm.conditionName <= 13
                ? conditionFormCN.value : conditionFormCN.value || '',
              'name': conditionFormCN.conditionName,
              'dataType': conditionForm.conditionName >= 10 && conditionForm.conditionName <= 13 ? conditionFormCN.value : this.findPnodeId(this.conditionName, conditionForm.conditionName),
              'filedType': filedType,
              'conditionalRelation': conditionForm.relationship,
              'comparatorAndThresholds': [],
              'tdType': cItem.type
            });
            cItem.conditionForm && cItem.conditionForm.comparator2Threshold.forEach((c2tItem, c2tIndex) => {
              let comparatorId = '';
              this.comparator.forEach(comItem => {
                if (c2tItem.comparator === comItem.compValue) {
                  comparatorId = comItem.id;
                }
              });
              let dataType = '';
              if (typeof c2tItem.threshold !== 'object') {
                dataType = 'input';
              } else {
                if (conditionForm.conditionName >= 10 && conditionForm.conditionName <= 13) {
                  if (conditionForm.conditionName === 12) {
                    dataType = this.findPnodeId(this.conditionName, c2tItem.threshold.id);
                  } else {
                    dataType = conditionFormCN.value;
                  }
                } else {
                  dataType = disposalStrategy[index][c2tIndex].dataType === 'listLib' ? 'listLib' : this.findPnodeId(this.conditionName, c2tItem.threshold.id);
                }
              }
              let code = '';
              if (c2tItem.threshold.id === 2001) {
                code = true;
              } else if (c2tItem.threshold.id === 2002) {
                code = false;
              }
              disposalStrategy[index][cIndex].comparatorAndThresholds.push(
                {
                  'comparator': {
                    'id': comparatorId,
                    'code': c2tItem.comparator,
                    'value': conditionFormCN.comparator2Threshold[c2tIndex].comparator
                  },
                  'threshold': {
                    'id': typeof c2tItem.threshold === 'object' && c2tItem.threshold.id !== 2001 && c2tItem.threshold.id !== 2002 ? c2tItem.threshold.id : '',
                    'code': typeof c2tItem.threshold === 'object' && c2tItem.threshold.id !== 2001 && c2tItem.threshold.id !== 2002 ? c2tItem.threshold.value : code,
                    'value': typeof c2tItem.threshold === 'object' ? c2tItem.threshold.label : c2tItem.threshold,
                    'dataType': dataType
                  }
                });
            });
          } else if (cItem.type === 5) {
            let strategyData = [];
            cItem.executionStrategyForm && cItem.executionStrategyForm.forEach((sItem, sIndex) => {
              let strategyObj = {};
              this.strategyOne.forEach(scItem => {
                if (scItem.id === sItem.strategyOne) {
                  strategyObj.execStraType = scItem.execStraType;
                  strategyObj.code = '';
                }
              });
              if (strategyObj.execStraType === 'listNameStrategy') { // 名单策略
                strategyObj.addBlankAction = [];
                strategyObj.listNames = [];
                sItem.strategyTwoData.forEach(addBlankActionItem => {
                  sItem.strategyTwo.forEach(listNamesItem => {
                    if (listNamesItem === addBlankActionItem.id) {
                      strategyObj.addBlankAction.push({
                        id: addBlankActionItem.id,
                        code: '',
                        value: addBlankActionItem.value
                      });
                    }
                  });
                });
                sItem.strategyThreeData.forEach((addBlankActionItem, addBlankActionIndex) => {
                  strategyObj.listNames.push({
                    id: addBlankActionItem.id,
                    tag: addBlankActionItem.label,
                    data: []
                  });
                  addBlankActionItem.children.forEach(addBlankActionCItem => {
                    sItem.strategyThree.forEach(listNamesItem => {
                      if (listNamesItem === addBlankActionCItem.id) {
                        strategyObj.listNames[addBlankActionIndex].data.push({
                          id: addBlankActionCItem.id,
                          listName: addBlankActionCItem.label
                        });
                      }
                    });
                  });
                });
              } else if (strategyObj.execStraType === 'generate') { // 生成
                sItem.strategyTwoData.forEach(workOrderTypeItem => {
                  if (sItem.strategyTwo === workOrderTypeItem.id) {
                    strategyObj.workOrderType = {
                      id: workOrderTypeItem.id,
                      code: workOrderTypeItem.type,
                      value: workOrderTypeItem.value
                    };
                  }
                });
              } else if (strategyObj.execStraType === 'assignment') { // 赋值
                sItem.strategyTwoData.forEach(assignmentTypeItem => {
                  if (sItem.strategyTwo === assignmentTypeItem.id) {
                    strategyObj.assignmentType = assignmentTypeItem.assignmentType;
                  }
                });
                if (sItem.strategyTwo === 3) {
                  strategyObj.assignmentValue = sItem.strategyThree;
                } else if (sItem.strategyTwo === 1) {
                  strategyObj.assignmentValue = [];
                  sItem.strategyThree.forEach(assignmentValueItem => {
                    sItem.strategyThreeData.forEach(assignmentValueCItem => {
                      if (assignmentValueItem === assignmentValueCItem.id) {
                        strategyObj.assignmentValue.push({
                          id: assignmentValueCItem.id,
                          code: assignmentValueCItem.type,
                          value: assignmentValueCItem.value
                        });
                      }
                    });
                  });
                } else {
                  sItem.strategyThreeData.forEach(assignmentValueItem => {
                    if (sItem.strategyThree === assignmentValueItem.id) {
                      strategyObj.assignmentValue = {
                        id: assignmentValueItem.id,
                        code: assignmentValueItem.type,
                        value: assignmentValueItem.value
                      };
                    }
                  });
                }
              } else if (strategyObj.execStraType === 'warning') { // 预警
                sItem.strategyTwoData.forEach(warningValueItem => {
                  if (sItem.strategyTwo === warningValueItem.id) {
                    strategyObj.warningType = warningValueItem.warningType;
                  }
                });
                sItem.strategyThreeData.forEach(warningValueItem => {
                  if (sItem.strategyThree === warningValueItem.id) {
                    strategyObj.warningValue = {
                      id: warningValueItem.id,
                      code: '',
                      value: warningValueItem.value
                    };
                  }
                });
              }
              strategyData.push(strategyObj);
            });
            disposalStrategy[index].push({
              'colspan': cItem.colspan,
              'rowspan': cItem.rowspan,
              'type': 'execStra',
              'data': strategyData,
              'tdType': cItem.type
            });
          }
        });
      });
      return JSON.stringify(disposalStrategy);
    },
    async saveStrategy () {
      let param = {
        id: this.sourceId,
        strategyId: this.strategyId,
        targetId: this.targetId,
        targetVersion: this.$options.filters.conversionStrategyType(this.strategySelectForm.strategyVersion, this.strategyVersionItems),
        disposalStrategyType: this.policyType
      };
      if (this.policyType === '1') {
        this.regularStyle();
        param.disposalStrategy = JSON.stringify(this.operateStrategyItems);
      } else {
        param.disposalStrategy = this.decisionMatrix();
      }
      console.log(param.disposalStrategy);
      try {
        // 若编辑策略时重新选择了规则集，则把旧规则集的引用记录删除
        if (this.delParam.targetId && this.delParam.targetId !== param.targetId) {
          const response = await dataService.queryIsrecord({
            sourceId: this.delParam.targetId,
            sourceType: 'RULE_SET'
          });
          if (response.data.code === 200) {
            if (response.data.data.refList.length > 0) {
              this.delRecord(this.delParam);
            }
          }
        }
        /***
         * 策略编辑保存时
         * 根据 this.isSaveStrategy   状态判断是否是第一次保存，
         * true --调用添加引用记录  false  先调用 删除引用记录，在调用添加引用记录
         *
         * **/
        console.log(this.saveSourceIdObj, this.delSourceIdObj, '判断是否是第一次策略编辑保存');
        let saveSourceFlat = this.saveSourceIdObj.flat();
        let delSourceFlat = this.delSourceIdObj.flat();
        console.log(saveSourceFlat, delSourceFlat, '数组扁平化111');
        const res = await dataService.saveStrategy(param);

        if (res.data.code === 200) {
          this.valid = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = '保存成功';
          this.snackbarServeColor = 'success';
          if (this.targetId) {
            this.addRecord(this.targetId);
          }

          // console.log(Object.assign({}, {'sourceId':this.saveSourceIdObj.join()}),'名单集对象');
          let addStrategyParam = [];//  引用记录参数
          let delStrategyParam = [];// 删除
          for (let n = 0; n < saveSourceFlat.length; n++) {
            addStrategyParam.push({
              sourceId: saveSourceFlat[n],
              sourceType: 'NAME_LIST',
              targetType: 'SCENE',
              targetId: this.sourceId // 对应当前这一条场景的id
            });
          }

          for (let m = 0; m < delSourceFlat.length; m++) {
            delStrategyParam.push({
              sourceId: delSourceFlat[m],
              sourceType: 'NAME_LIST',
              targetType: 'SCENE',
              targetId: this.sourceId // 对应当前这一条场景的id
            });
          }
          console.log(addStrategyParam, delStrategyParam, 'cans ');
          if (this.isSaveStrategy) {
            this.isSaveStrategy = false; //
            this.addStrategyRecord(addStrategyParam);// 第一次保存编辑 调用添加引用记录接口
          } else {
            // 不是第一次的操作

            this.delStragtegyRecord(delStrategyParam);
            this.addStrategyRecord(addStrategyParam);
          }
          // this.$router.go(-1);
          this.$router.push('/sceneManagement');
          // this.getDataList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = '保存失败';
          this.snackbarServeColor = 'error';
        }
        this.strategyConfigShow = false;
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '保存失败';
        this.snackbarServeColor = 'error';
      }
    },
    async selectSterategy (item) {
      this.strategyVersionItems = []; // 重置为空
      this.targetId = item;
      let setName = this.$options.filters.conversionStrategyType(item, this.strategySetItems);

      let versionItems = this.$options.filters.conversionRuleSet(item, this.strategySetItems);
      // consol.log(this.strategySelectForm.strategyVersion);
      versionItems.forEach((item, index, ary) => {
        this.strategyVersionItems.push({
          selectText: item.histVersion,
          selectField: item.id
        });
      });
      this.strategyVersionItems.sort((prev, next) => { return next.selectText - prev.selectText; });
      // 切换规则集时，返显已经保存过得规则集版本
      this.strategySelectForm.strategyVersion = this.strategyVersionItems[0].selectField;
      if (this.delParam.targetId === item) {
        let savedVersionItem = this.strategyVersionItems.filter(item => item.selectText === parseInt(this.delParam.targetVersion));
        this.strategySelectForm.strategyVersion = savedVersionItem[0].selectField;
      }
      let param = {
        // startIndex: 1,
        // pageSize: 10,
        setName: setName
      };
      try {
        const res = await dataService.getRuleSet(param);
        if (res.data.code === 200) {
          this.operatedRuleSet = res.data.data;
          let ruleSetParam = {
            id: this.strategySelectForm.strategyVersion
          };
          this.getdetailList(ruleSetParam);
        }
      } catch (err) {}
    },
    changeStrategyVersion (param) {
      console.log(param, 'version....');
      let ruleSetParam = {
        id: param
      };
      this.getdetailList(ruleSetParam);
    },
    async getdetailList (ruleSetParam) {
      console.log(ruleSetParam, 'ruleSetParam');
      // 不同的模式的规则表格的表头不同
      if (this.operatedRuleSet.matchingModel === 'SCORE_MATCH') {
        this.operatedRulesHeader = [
          {
            text: '规则编号',
            value: 'ruleNo',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '规则名称',
            value: 'ruleName',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '标签',
            value: 'riskLabel',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '权重',
            value: 'weights',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '启用时间',
            value: 'enableTime',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '失效时间',
            value: 'invalidTime',
            sortable: false,
            align: 'center',
            width: 100
          },
          { text: '规则状态', value: 'states', sortable: false, align: 'center', width: 100 }
        ];
      } else {
        this.operatedRulesHeader = [
          {
            text: '规则编号',
            value: 'ruleNo',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '规则名称',
            value: 'ruleName',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '风险标签',
            value: 'riskLabel',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '处置策略',
            value: 'suggestedStrategies',
            sortable: false,
            align: 'center',
            width: 100

          },
          {
            text: '启用时间',
            value: 'enableTime',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '失效时间',
            value: 'invalidTime',
            sortable: false,
            align: 'center',
            width: 100
          },
          {
            text: '优先级',
            value: 'priorityLevel',
            sortable: false,
            align: 'center',
            width: 100
          },
          { text: '规则状态', value: 'states', sortable: false, align: 'center', width: 100 }
        ];
      }
      try {
        const ruleSetDetailInfo = await getVersionInfo(ruleSetParam);
        if (ruleSetDetailInfo.data.code === 200) {
          this.operatedRules = ruleSetDetailInfo.data.data.ruleList;
          // console.log(this.operatedRules,'规则集详情');
          // 如果是评分模式 没有风险阈值 添加上
          if (this.operatedRuleSet.matchingModel === 'SCORE_MATCH') {
            if (!ruleSetDetailInfo.data.data.hisVersion.riskThreshold) {
              this.$set(this.operatedRuleSet, 'riskThreshold', [
                { from: '0', to: '20', strategy: '自动阻断' }
              ]);
            } else {
              this.$set(
                this.operatedRuleSet,
                'riskThreshold',
                JSON.parse(ruleSetDetailInfo.data.data.hisVersion.riskThreshold)
              );
            }
          }
          this.operatedRuleSet.total = 0;
          this.operatedRuleSet.blockUp = 0;
          this.operatedRuleSet.startUsing = 0;
          this.operatedRuleSet.simulation = 0;

          this.operatedRules.forEach(element => {
            this.operatedRuleSet.total++;
            if (element.states === 'OFFICIAL') {
              this.operatedRuleSet.startUsing++;
            } else if (element.states === 'OFF') {
              this.operatedRuleSet.blockUp++;
            } else if (element.states === 'SIMULATION') {
              this.operatedRuleSet.simulation++;
            }
          });
        }
      } catch (err) {}
    },
    // 处置策略规则式
    async getRegularStyle (responseData) {
      this.operateStrategyItems = [];
      if (responseData && Array.isArray(responseData) && responseData.length === 0) { // 处置策略为空时
        this.isSaveStrategy = true; // 如果处置策略数据为空，证明是第一次添加编辑
        this.operateStrategyItems.push({
          disposalActionId: [],
          disposalActionList: [],
          riskLabel: '',
          priority: '',
          listDataId: [],
          workOrderId: '',
          listDataIds: []
        });
      } else if (responseData && responseData.length !== 0) {
        this.isSaveStrategy = false;
        for (let i = 0; i < responseData.length; i++) {
          this.operateStrategyItems.push({
            disposalStrategyId: responseData[i].disposalStrategyId,
            disposalActionList: [],
            disposalActionId: responseData[i].disposalActionId === '[]' ? [] : responseData[i].disposalActionId === '' ? [] : responseData[i].disposalActionId === null ? [] : JSON.parse(responseData[i].disposalActionId),
            riskLabel: responseData[i].riskLabel,
            priority: responseData[i].priority.toString(),
            // listDataId: responseData[i].listDataId === '[]' ? [] : JSON.parse(responseData[i].listDataId),
            listDataId: responseData[i].listDataId === '[]' ? [] : responseData[i].listDataId === '' ? [] : responseData[i].listDataId === null ? [] : JSON.parse(responseData[i].listDataId),
            workOrderId: responseData[i].workOrderId,
            listDataIds: responseData[i].listDataIds
          });

          // 获取返回的回显名单集数据
          this.delSourceIdObj.push(responseData[i].listDataId === '[]' ? [] : responseData[i].listDataId === '' ? [] : responseData[i].listDataId === null ? [] : JSON.parse(responseData[i].listDataId));
          console.log(this.delSourceIdObj, '1212');
          if (responseData[i].disposalActionId) {
            await this.getlistTypeItems(i, responseData[i].disposalActionId, true);
          }
        }
      }
    },
    // 处置策略决策矩阵式
    async getDecisionMatrix (responseData, isCopy) {
      let matrixData = [];
      !isCopy ? this.matrixData = [] : this.copyMatrixData = [];
      responseData = JSON.parse(responseData);
      responseData.forEach((trItm, trIdx) => {
        matrixData.push([]);
        !isCopy ? this.matrixData.push([]) : this.copyMatrixData.push([]);
        trItm.forEach(async (tdItm, tdIdx) => {
          if (tdItm.type === 'remarks') {
            !isCopy ? this.matrixData[trIdx][tdIdx] = {
              type: 0,
              colspan: tdItm.colspan,
              rowspan: tdItm.rowspan
            } : this.copyMatrixData[trIdx][tdIdx] = {
              type: 0,
              colspan: tdItm.colspan,
              rowspan: tdItm.rowspan
            };
          } else if (tdItm.type === 'execStra') { // 执行策略
            this.getExecStra(trItm, trIdx, isCopy);
          } else { // 执行条件
            let conditionForm = {};
            conditionForm.conditionName = tdItm.id ? tdItm.id : tdItm.code;
            for (let l = 0; l < this.condition.conditionName.length; l++) {
              if (conditionForm.conditionName === this.condition.conditionName[l].value) {
                conditionForm.conditionName = this.condition.conditionName[l].id;
                break;
              }
            }
            conditionForm.relationship = tdItm.conditionalRelation;
            await this.conditionNameTreeChange(conditionForm, () => {
              conditionForm.comparator2Threshold = [];
              tdItm.comparatorAndThresholds.forEach((comparatorItem, comparatorIndex) => {
                conditionForm.comparator2Threshold[comparatorIndex] = {};
                this.condition.threshold.forEach(cItem => {
                  if (comparatorItem.threshold.id) {
                    if (comparatorItem.threshold.id === cItem.id) {
                      conditionForm.comparator2Threshold[comparatorIndex].threshold = cItem;
                    }
                  } else {
                    conditionForm.comparator2Threshold[comparatorIndex].threshold = tdItm.comparatorAndThresholds[comparatorIndex].threshold.value;
                  }
                });
                this.comparator.forEach(cItem => {
                  if (comparatorItem.comparator.id === cItem.id) {
                    conditionForm.comparator2Threshold[comparatorIndex].comparator = cItem.compValue;
                  }
                });
              });
              let conditionFormCN = {
                conditionName: null, // 条件名称
                comparator2Threshold: JSON.parse(JSON.stringify(conditionForm.comparator2Threshold)), // 比较符及阈值
                relationship: ''
              };
              this.condition.conditionName.forEach(item => {
                if (item.id === conditionForm.conditionName) {
                  conditionFormCN.conditionName = item.label;
                  conditionFormCN.value = item.value;
                }
              });
              conditionFormCN.comparator2Threshold.forEach((item, index) => {
                this.comparator.forEach(cItem => {
                  if (item.comparator === cItem.compValue) {
                    item.comparator = cItem.compName;
                  }
                });
              });
              conditionFormCN.relationship = conditionForm.relationship === 'all' ? '且' : '或';
              // let type = '';
              // if (tdItm.type === 'caseCol') {
              //   type = trIdx === 0 ? 1 : 2;
              // } else if (tdItm.type === 'caseRow') {
              //   type = tdIdx === 0 ? 3 : 4;
              // }
              !isCopy ? this.matrixData[trIdx][tdIdx] = {
                colspan: tdItm.colspan,
                rowspan: tdItm.rowspan,
                conditionForm: conditionForm,
                conditionFormCN: conditionFormCN,
                type: tdItm.tdType
              } : this.copyMatrixData[trIdx][tdIdx] = {
                colspan: tdItm.colspan,
                rowspan: tdItm.rowspan,
                conditionForm: conditionForm,
                conditionFormCN: conditionFormCN,
                type: tdItm.tdType
              };
            });
          }
        });
      });
      this.$nextTick(() => {
        setTimeout(() => {
          // this.matrixData = matrixData;
          this.setCanvasStyle();
          // console.log(responseData, matrixData, this.matrixData);
          this.$forceUpdate();
        }, 10);
      });
    },
    getExecStra (trItm, trIdx, isCopy) {
      trItm.forEach(async (tdItm, tdIdx) => {
        if (tdItm.type === 'execStra' && tdItm.data.length > 0) { // 执行策略
          !isCopy ? this.matrixData[trIdx][tdIdx] = {
            executionStrategyFormCN: [],
            executionStrategyForm: [],
            colspan: tdItm.colspan,
            rowspan: tdItm.rowspan,
            type: 5
          } : this.copyMatrixData[trIdx][tdIdx] = {
            executionStrategyFormCN: [],
            executionStrategyForm: [],
            colspan: tdItm.colspan,
            rowspan: tdItm.rowspan,
            type: 5
          };
          tdItm.data.forEach((straItem, straIndex) => {
            let executionStrategyForm = [];
            let strategyOneQuery = [];
            let executionStrategyFormCN = [];
            executionStrategyForm[straIndex] = {};
            strategyOneQuery = this.strategyOne.filter(strategyItem => {
              return strategyItem.execStraType === straItem.execStraType;
            });
            executionStrategyForm[straIndex].strategyOne = strategyOneQuery[0].id;
            executionStrategyForm[straIndex].strategyTwo = '';
            executionStrategyForm[straIndex].strategyTwoData = [];
            executionStrategyForm[straIndex].strategyThree = '';
            executionStrategyForm[straIndex].strategyThreeData = [];
            let strategyOne = '';
            this.strategyOne.forEach(item => {
              if (item.id === executionStrategyForm[straIndex].strategyOne) {
                strategyOne = item.value;
              }
            });
            if (strategyOneQuery[0].id === 1) {
              executionStrategyForm[straIndex].strategyTwo = [];
              executionStrategyForm[straIndex].strategyThree = [];
              dataService.blacklistTmpl().then((res) => {
                if (res.data.code === 200) {
                  let strategyTwoData = [];
                  res.data.data.forEach(item => {
                    strategyTwoData.push({ id: item.id, value: item.tmplName });
                  });
                  executionStrategyForm[straIndex].strategyTwoData = strategyTwoData;
                  let strategyTwoQuery = [];
                  let strategyThreeQuery = [];
                  straItem.listNames.forEach(blankItem => {
                    strategyTwoQuery.push(blankItem.id);
                    blankItem.data.forEach(listItem => {
                      strategyThreeQuery.push(listItem.id);
                    });
                  });
                  executionStrategyForm[straIndex].strategyTwo = strategyTwoQuery;
                  dataService.queryData({ appId: this.appId, blackListStrategyId: executionStrategyForm[straIndex].strategyTwo.join() }).then(res => {
                    if (res.data.code === 200) {
                      let nameListArry = res.data.data;
                      let arr = [];
                      // 迭代第一层
                      nameListArry.forEach((v) => {
                        arr.push({
                          id: v.id,
                          label: v.tag,
                          children: []
                        });
                      });
                      // 循环迭代第二级
                      arr.forEach((o, j) => {
                        nameListArry.forEach((v, m) => {
                          if (o.id === v.id) {
                            // 比较查找对应id 下的children
                            if (v.data.length > 0) {
                              v.data.forEach((cItem) => {
                                o.children.push({
                                  id: cItem.id,
                                  label: cItem.listName
                                });
                              });
                            }
                          }
                        });
                      });
                      executionStrategyForm[straIndex].strategyThreeData = arr;
                      executionStrategyForm[straIndex].strategyThree = strategyThreeQuery;
                      // 汉化
                      for (let i = 0; i < executionStrategyForm.length; i++) {
                        let strategyTwo = '';
                        let strategyThree = '';
                        if (executionStrategyForm[i].strategyOne === 1) {
                          strategyTwo = [];
                          strategyThree = [];
                          executionStrategyForm[i].strategyTwoData.forEach(item => {
                            executionStrategyForm[i].strategyTwo.forEach(vItem => {
                              if (vItem === item.id) {
                                strategyTwo.push(item.value);
                              }
                            });
                          });
                          strategyTwo = strategyTwo.join();
                          executionStrategyForm[i].strategyThreeData.forEach(item => {
                            item.children.forEach(cItem => {
                              executionStrategyForm[i].strategyThree.forEach(vItem => {
                                if (vItem === cItem.id) {
                                  strategyThree.push(cItem.label);
                                }
                              });
                            });
                          });
                          strategyThree = strategyThree.join();
                        }
                        executionStrategyFormCN[straIndex] = { strategyOne: strategyOne, strategyTwo: strategyTwo, strategyThree: strategyThree };
                        if (!isCopy) {
                          this.matrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                          this.matrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                        } else {
                          this.copyMatrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                          this.copyMatrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                        }
                        this.$forceUpdate();
                        this.setCanvasStyle();
                      }
                    }
                  });
                }
              });
            } else if (strategyOneQuery[0].id === 2) {
              dataService.findsysparams({ identifier: 'work_order_id' }).then(res => {
                if (res.data.code === 200) {
                  let strategyTwoData = [];
                  res.data.data.forEach(item => {
                    strategyTwoData.push({ id: item.id, value: item.paramName, type: item.paramValue });
                  });
                  executionStrategyForm[straIndex].strategyTwoData = strategyTwoData;
                  executionStrategyForm[straIndex].strategyTwoData = strategyTwoData;
                  executionStrategyForm[straIndex].strategyTwo = straItem.workOrderType.id;
                  executionStrategyFormCN[straIndex] = { strategyOne: strategyOne, strategyTwo: straItem.workOrderType.value, strategyThree: '' };
                  if (!isCopy) {
                    this.matrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                    this.matrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                  } else {
                    this.copyMatrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                    this.copyMatrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                  }
                  this.$forceUpdate();
                  this.setCanvasStyle();
                }
              });
            } else if (strategyOneQuery[0].id === 3) {
              executionStrategyForm[straIndex].strategyTwoData = [
                { id: 1, value: '标签', assignmentType: 'riskLab' },
                { id: 2, value: '处置策略', assignmentType: 'disposalStrategy' },
                { id: 3, value: '权重值', assignmentType: 'weightValue' }
              ];
              let strategyTwo = '';
              let strategyThree = '';
              executionStrategyForm[straIndex].strategyTwoData.forEach(item => {
                if (straItem.assignmentType === item.assignmentType) {
                  executionStrategyForm[straIndex].strategyTwo = item.id;
                  strategyTwo = item.value;
                }
              });
              if (executionStrategyForm[straIndex].strategyTwo === 3) {
                executionStrategyForm[straIndex].strategyThree = straItem.assignmentValue;
                strategyThree = straItem.assignmentValue;
                executionStrategyFormCN[straIndex] = { strategyOne: strategyOne, strategyTwo: strategyTwo, strategyThree: strategyThree };
                if (!isCopy) {
                  this.matrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                  this.matrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                } else {
                  this.copyMatrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                  this.copyMatrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                }
                this.$forceUpdate();
                this.setCanvasStyle();
              } else if (executionStrategyForm[straIndex].strategyTwo === 1) {
                dataService.findsysparams({ identifier: 'sys_risk_label' }).then(res => {
                  if (res.data.code === 200) {
                    let strategyThreeData = [];
                    res.data.data.forEach(item => {
                      strategyThreeData.push({ id: item.id, value: item.paramName, type: item.paramValue });
                    });
                    executionStrategyForm[straIndex].strategyThreeData = strategyThreeData;
                    strategyThree = [];
                    executionStrategyForm[straIndex].strategyThree = [];
                    straItem.assignmentValue.forEach(assignmentItm => {
                      executionStrategyForm[straIndex].strategyThreeData.forEach(assignmentItem => {
                        if (assignmentItm.id === assignmentItem.id) {
                          strategyThree.push(assignmentItem.value);
                          executionStrategyForm[straIndex].strategyThree.push(assignmentItm.id);
                        }
                      });
                    });
                    strategyThree = strategyThree.join();
                    executionStrategyFormCN[straIndex] = { strategyOne: strategyOne, strategyTwo: strategyTwo, strategyThree: strategyThree };
                    if (!isCopy) {
                      this.matrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                      this.matrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                    } else {
                      this.copyMatrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                      this.copyMatrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                    }
                    this.$forceUpdate();
                    this.setCanvasStyle();
                  }
                });
              } else {
                dataService.findsysparams({ identifier: 'sys_strategy' }).then(res => {
                  if (res.data.code === 200) {
                    let strategyThreeData = [];
                    res.data.data.forEach(item => {
                      strategyThreeData.push({ id: item.id, value: item.paramName, type: item.paramValue });
                    });
                    executionStrategyForm[straIndex].strategyThreeData = strategyThreeData;
                    executionStrategyForm[straIndex].strategyThree = straItem.assignmentValue.id;
                    executionStrategyForm[straIndex].strategyThreeData.forEach(assignmentItem => {
                      if (straItem.assignmentValue.id === assignmentItem.id) {
                        strategyThree = assignmentItem.value;
                      }
                    });
                    executionStrategyFormCN[straIndex] = { strategyOne: strategyOne, strategyTwo: strategyTwo, strategyThree: strategyThree };
                    if (!isCopy) {
                      this.matrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                      this.matrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                    } else {
                      this.copyMatrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                      this.copyMatrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                    }
                    this.$forceUpdate();
                    this.setCanvasStyle();
                  }
                });
              }
            } else if (strategyOneQuery[0].id === 4) {
              let strategyTwo = '';
              let strategyThree = '';
              executionStrategyForm[straIndex].strategyTwoData = [
                { id: 1, value: '短信预警', warningType: 'phoneWarning' },
                { id: 2, value: '邮件预警', warningType: 'emailWarning' }
              ];
              executionStrategyForm[straIndex].strategyTwoData.forEach(warningItem => {
                if (straItem.warningType === warningItem.warningType) {
                  executionStrategyForm[straIndex].strategyTwo = warningItem.id;
                  strategyTwo = warningItem.value;
                }
              });
              if (executionStrategyForm[straIndex].strategyTwo === 1) {
                dataService.sysWarnPhoneGroup().then(res => {
                  if (res.data.code === 200) {
                    let strategyThreeData = [];
                    res.data.data.forEach(item => {
                      strategyThreeData.push({ id: item.id, value: item.groupName });
                    });
                    executionStrategyForm[straIndex].strategyThreeData = strategyThreeData;
                    executionStrategyForm[straIndex].strategyThreeData.forEach(warningItem => {
                      if (straItem.warningValue) {
                        if (straItem.warningValue.id === warningItem.id) {
                          executionStrategyForm[straIndex].strategyThree = warningItem.id;
                          strategyThree = warningItem.value;
                        }
                      }
                    });
                    executionStrategyFormCN[straIndex] = { strategyOne: strategyOne, strategyTwo: strategyTwo, strategyThree: strategyThree };
                    if (!isCopy) {
                      this.matrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                      this.matrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                    } else {
                      this.copyMatrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                      this.copyMatrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                    }
                    this.$forceUpdate();
                    this.setCanvasStyle();
                  }
                });
              } else {
                dataService.sysWarnEmailGroup().then(res => {
                  if (res.data.code === 200) {
                    let strategyThreeData = [];
                    res.data.data.forEach(item => {
                      strategyThreeData.push({ id: item.id, value: item.groupName });
                    });
                    executionStrategyForm[straIndex].strategyThreeData = strategyThreeData;
                    executionStrategyForm[straIndex].strategyThreeData.forEach(warningItem => {
                      if (straItem.warningValue.id === warningItem.id) {
                        executionStrategyForm[straIndex].strategyThree = warningItem.id;
                        strategyThree = warningItem.value;
                      }
                    });
                    executionStrategyFormCN[straIndex] = { strategyOne: strategyOne, strategyTwo: strategyTwo, strategyThree: strategyThree };
                    if (!isCopy) {
                      this.matrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                      this.matrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                    } else {
                      this.copyMatrixData[trIdx][tdIdx].executionStrategyFormCN[straIndex] = executionStrategyFormCN[straIndex];
                      this.copyMatrixData[trIdx][tdIdx].executionStrategyForm[straIndex] = executionStrategyForm[straIndex];
                    }
                    this.$forceUpdate();
                    this.setCanvasStyle();
                  }
                });
              }
            }
          });
        } else if (tdItm.type === 'execStra' && tdItm.data.length <= 0) {
          !isCopy ? this.matrixData[trIdx][tdIdx] = {
            executionStrategyFormCN: [],
            executionStrategyForm: [],
            colspan: tdItm.colspan,
            rowspan: tdItm.rowspan,
            type: 5
          } : this.copyMatrixData[trIdx][tdIdx] = {
            executionStrategyFormCN: [],
            executionStrategyForm: [],
            colspan: tdItm.colspan,
            rowspan: tdItm.rowspan,
            type: 5
          };
          this.$forceUpdate();
          this.setCanvasStyle();
        }
      });
    },
    // 查询处置策略数据
    async queryStrategyData () {
      this.operateStrategyItems = []; // 处置策略数据
      const response = await dataService.queryStrategy({ id: this.strategyId, appId: this.appId });
      // console.log(response, '处置策略数据查询。。。。');
      // 查询处置策略数据
      let responseData = response.data.data.strategyList;
      this.policyType = response.data.data.disposalStrategyType;
      // console.log(responseData,'responseData');
      if (response.data.code === 200) {
        if (this.policyType === '1') {
          this.getRegularStyle(responseData);
        } else {
          this.getDecisionMatrix(responseData);
        }
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = `处置策略${responseData}`;
        this.snackbarServeColor = 'error';
      }
      // console.log(responseData,'dfdfs')
    },
    // 添加一行处置策略
    addStrategyItem (index) {
      this.operateStrategyItems.splice(index + 1, 0, {
        disposalActionList: [], // 树形的option
        disposalActionId: [], // 加黑动作
        riskLabel: '',
        priority: '',
        listDataId: [],
        workOrderId: '',
        listDataIds: []
        // nameListSetItems: []
        // nameListSetItems: [{ selectText: '请选择', selectField: '' }]
      });
    },
    // 删除一行处置策略
    delStrategyItem (index) {
      if (this.operateStrategyItems.length <= 1) {
        return;
      }
      this.operateStrategyItems.splice(index, 1);
    },
    async addRecord (quoteId) { // 添加引用记录
      let param = {
        sourceId: quoteId, // 对应被引用的规则集的id
        sourceType: 'RULE_SET',
        targetType: 'SCENE',
        targetId: this.sourceId, // 对应当前这一条场景的id
        sourceVersion: this.$options.filters.conversionStrategyType(this.strategySelectForm.strategyVersion, this.strategyVersionItems)
      };

      let addParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await dataService.addRecord(addParams);
      } catch (err) {}
    },

    // 策略编辑保存时候，调用此方法，添加引用记录
    async addStrategyRecord (params) { // 添加引用记录
      console.log(params, '添加引用记录');
      // let param = {
      //   sourceId: params.sourceId, // 对应被引用的规则集的id
      //   sourceType: 'NAME_LIST',
      //   targetType: 'SCENE',
      //   targetId: this.targetId, // 对应当前这一条场景的id
      //   // sourceVersion: this.$options.filters.conversionStrategyType(this.strategySelectForm.strategyVersion, this.strategyVersionItems)
      // };
      if (params.length > 0) {
        let addParams = {
          jsonStr: JSON.stringify(params)
        };
        try {
          await dataService.addRecord(addParams);
        } catch (err) {}
      }
    },

    // 删除场景的时候，同时删除引用记录
    async delStragtegyRecord (params) {
      console.log(params, '删除场景的时候，同时删除引用记录');
      let delParams = {
        jsonStr: JSON.stringify(params)
      };
      try {
        await dataService.delrecord(delParams);
      } catch (err) {}
    },

    // 删除场景的时候，同时删除引用记录
    async delRecord (params) {
      let param = {
        sourceId: params.targetId, // 对应被引用的规则集的id
        sourceType: 'RULE_SET',
        targetType: 'SCENE',
        // source_type:'NAME_LIST',
        // target_type:'SCENE',
        targetId: params.id, // 对应当前这一条场景的id
        sourceVersion: Number(params.targetVersion) || null
      };
      let delParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await dataService.delrecord(delParams);
      } catch (err) {}
    }
  }
};
</script>
<style lang="stylus" scoped>
  >>> .vue-treeselect__menu {
    max-height: none !important;
  }
  .decisionMatrix {
    border-collapse: collapse;
  }
  .decisionMatrix td {
    padding: 5px;
    box-sizing: border-box;
  }
  .decisionMatrix td > div {
    min-height: 50px;
    width: 278px;
  }
  .decisionMatrix td div {
    line-height: 25px;
  }
  .tableHeader {
    position: relative;
  }
  .tableHeader > span {
    position: absolute;
    color: #999;
    font-size: 14px;
  }
  >>> .v-list--dense .v-list-item {
    min-height: 32px;
  }
  .configBill {
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
  }
  .radio-box >>> .v-radio {
    margin: 0 !important;
  }
  .strategy-info {
    display: flex;
    align-items: center;
    color: #333;
    font-weight: bold;
  }
  .float-left {
    float: left;
  }
  .strategy-stepHeight {
    height: 40px;
    line-height: 40px;
  }
  .strategy-stepWidth {
    width: 15%;
  }
  .ellipsis {
    // margin: 5px 4px 3px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 90%;
  }
  .list-data-input >>> .v-input__slot input {
    padding: 0 !important;
    max-height: 16px;
  }
  .list-data-input  >>> .v-input__control{
    height:auto;
  }
  .list-data-input.hide >>> .v-text-field__details {
    display: none;
  }
  .listTree >>> .vue-treeselect__control{
    height:40px
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
