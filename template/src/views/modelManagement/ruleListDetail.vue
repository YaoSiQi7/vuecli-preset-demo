<template>
  <div class="rulelist-content">
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3', isFixed ? 'fixed' : '']">
        <v-card-actions style="height:60px">
          <!-- <v-btn  color="primary" class="ml-4"  @click="saveRuleList()" :disabled="!isSaveAbled" v-if="hasPermission(saveRuleButn)">保存</v-btn> -->
          <v-btn
            color="primary"
            class="ml-4"
            @click="saveRuleList()"
            :disabled="!isSaveAbled || ruleSetStatus==='5'"
            v-if="hasPermission(saveRuleButn)"
            >保存</v-btn
          >
          <v-btn class="ml-4 cancelButton" @click="cancelRuleList" outlined
            >返回</v-btn
          >
        </v-card-actions>
      </v-card>
    </div>
    <v-card>
      <v-card-text>
        <!-- 规则集基本信息 -->
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <h3 style="margin-bottom:20px">规则集基本信息</h3>
              <div class="ruleSetParam">
                <v-row>
                  <v-col cols="3" class="text-left">
                    <p>规则集名称：{{ operatedRuleSet.setName }}</p>
                  </v-col>
                  <v-col cols="3" class="text-left">
                    <p>
                      所属公司：{{
                        operatedRuleSet.organizationId
                          | rulesetOrganization(organizationList)
                      }}
                    </p>
                  </v-col>
                  <v-col cols="3" class="text-left">
                    <p>
                      所属应用：{{
                        operatedRuleSet.appId | rulesetApplication(applications)
                      }}
                    </p>
                  </v-col>
                  <v-col cols="3" class="text-left">
                    <p>
                      交易类型：
                      {{
                        operatedRuleSet.transactionTypeId
                          | rulesetTradeTypes(tradeTypes)
                      }}
                    </p>
                  </v-col>
                </v-row>
              </div>
              <div class="ruleSetParam">
                <v-row>
                  <v-col cols="3" class="text-left">
                    <p>
                      规则匹配模式：
                      {{
                        operatedRuleSet.matchingModel
                          | filtersShowRuleMatchingModel(ruleMatchingModels)
                      }}
                    </p>
                  </v-col>
                  <v-col cols="3" class="text-left">
                    <p>规则总数： {{ operatedRuleSet.total }}</p>
                  </v-col>
                  <v-col cols="3" class="text-left">
                    <p>规则启用数量： {{ operatedRuleSet.startUsing }}</p>
                  </v-col>
                  <v-col cols="3" class="text-left">
                    <p>规则停用数量： {{ operatedRuleSet.blockUp }}</p>
                  </v-col>
                </v-row>
              </div>
              <div class="ruleSetParam">
                <v-row>
                  <v-col cols="3" class="text-left">
                    <p>规则模拟数量： {{ operatedRuleSet.simulation }}</p>
                  </v-col>
                </v-row>
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <!-- 风险阈值 -->
        <v-list
          v-if="operatedRuleSet.matchingModel === 'SCORE_MATCH'"
          class="clear"
        >
          <h3 style="padding-left:16px;margin-bottom:20px;display:inline-block" >设置风险阈值</h3>
          <v-tooltip right max-width="360">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                icon
                small
                v-bind="attrs"
                v-on="on"
                style="margin-top: -5px;margin-left: 10px;"
              >
                <v-icon dark dense>
                  mdi-help-circle
                </v-icon>
              </v-btn>
            </template>
            <span>
              风险阈值左边右边均为闭区间 （0分除外）<br/>
              举例：<br/>
              1、0-20 代表 0≤分值≤20 ；<br/>
              2、20-40 代表 20≤分值≤40<br/>
              3、以此类推 ，若风险累计权重值同时落在两个区间，优先匹配等级较高的处置策略
            </span>
           </v-tooltip>
          <div
            v-for="(item, index) in operatedRuleSet.riskThreshold"
            :key="'riskThresholdOperated' + index"
            style="padding-left:16px;margin-bottom:24px;height:52px"
          >
            <v-text-field
              v-model="item.from"
              style="width:100px; float:left"
              outlined
              :rules="[v => !!v || '不能为空或只有空格']"
              dense
              :disabled = "ruleSetStatus==='5'"
            />
            <v-icon style="float:left;height:40px">mdi-minus</v-icon>
            <v-text-field
              v-model="item.to"
              style="width:100px;float:left "
              outlined
              :rules="[v => !!v || '不能为空或只有空格']"
              dense
              :disabled = "ruleSetStatus==='5'"
            />
            <v-select
              v-model="item.strategy"
              style="width:150px;float:left;margin-left:10px "
              :rules="[v => !!v || '不能为空或只有空格']"
              outlined
              dense
              :items="strategies"
              item-text="paramName"
              placeholder="处置策略"
              item-value="id"
              no-data-text="没有数据"
              :disabled = "ruleSetStatus==='5'"
            />
            <v-icon
              color="primary"
              style="height:40px;float:left;margin-left:10px"
              @click="addRiskThreshold(index)"
              :disabled = "ruleSetStatus==='5'"
              >mdi-plus-circle</v-icon
            >
            <v-icon
              size="30"
              color="primary"
              style="height:40px;float:left;margin-left:10px"
              @click="delRiskThreshold(index)"
              :disabled = "ruleSetStatus==='5'"
              >mdi-delete</v-icon
            >
          </div>
        </v-list>
        <!-- 规则列表 -->
        <v-list>
          <h3 style="padding-left:16px">规则列表</h3>
          <!-- @toggle-select-all="getSelect" -->
          <v-data-table
            :headers="operatedRulesHeader"
            :items="operatedRules"
            hide-default-footer
            :disable-pagination="pagination"
            :items-per-page="rulePageSize"
            :loading="loading"
            loading-text="加载数据中..."
            no-results-text="没有匹配的数据"
            :search="search"
             item-key="id"
            show-select
            v-model="selectedRule"
            style="min-height: 500px;"
          >
            <!--表头按钮操作区域-->
            <template v-slot:top>
              <v-toolbar flat height="60px">
                <v-row style="align-items: center;">
                  <v-col cols="8">
                    <v-btn
                      color="primary"
                      class="mr-1 mt-1"
                      @click="addRule"
                      v-if="hasPermission(addRuleButn)"
                      :disabled="ruleSetStatus==='5'"
                      >新增规则</v-btn
                    >
                     <v-btn
                      color="primary"
                      class="mr-1 ml-4 mt-1"
                      :disabled="ruleSetStatus==='5'"
                       @click='batchCopy()'
                      v-if="hasPermission(batchCopyRuleButn)"
                      >导入规则</v-btn
                    >
                    <!-- <v-btn color="primary" class="mr-1 mt-1" @click="addRule">新增规则</v-btn> -->
                    <v-btn
                      color="primary"
                      class="mr-1 ml-4 mt-1"
                      :disabled="!selectedRule.length>0"
                      @click='batchDel()'
                      v-if="hasPermission(batchDeleteRuleButn)"
                      >批量删除</v-btn
                    >
                    <!-- <v-btn
                      color="primary"
                      class="mr-1 ml-4 mt-1"
                      @click='batchCopy()'
                      v-if="hasPermission(batchCopyRuleButn)"
                      >批量复制</v-btn> -->
                  </v-col>
                  <v-col cols="2">
                      <v-select
                        v-model="changeItemValue"
                        class="mr-1 ml-4 mt-1"
                        :items="changeItem"
                         no-data-text="没有匹配数据"
                        label="变更状态"
                        @change="batchStatusChange()"
                        outlined
                        dense
                      ></v-select>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="2">
                    <v-text-field
                      v-model="search"
                      placeholder="规则搜索"
                      append-icon="mdi-magnify"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-toolbar>
            </template><!--表头按钮操作区域-->
            <!--表格内容-->
             <template v-slot:body="{ items }">
                <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
                  <td colspan="10">没有数据</td>
                </tr>
                <tr
                v-else
                v-for="(item, index) in items"
                :key="index"
                class="el-tr-defu">
                   <td class="text-start">
                      <!-- @click="ruleChecked()" -->
                    <v-checkbox v-model="selectedRule" :value="item" style="margin:0px;padding:0px" hide-details />
                  </td>
                  <td class="text-left">{{item.ruleNo}}</td>
                  <td class="text-left">{{item.ruleName}}</td>
                  <td class="text-center">{{item.labelId | filtersRiskyLabel(riskyLabels)}}</td>
                  <td class="text-center"   v-if="operatedRuleSet.matchingModel === 'SCORE_MATCH'">{{item.weights}}</td>
                  <td class="text-center"   v-if="operatedRuleSet.matchingModel !== 'SCORE_MATCH'">{{ item.strategy | filtersStrategies(strategies) }}</td>
                  <td class="text-center">{{item.enableTime}}</td>
                  <td class="text-center">{{item.invalidTime}}</td>
                  <td class="text-center" v-if="operatedRuleSet.matchingModel !== 'SCORE_MATCH'">{{ item.priorityLevel}}</td>

                  <td class="text-center">
                    <v-btn-toggle
                    class="ruleStatus"
                    color="primary"
                    v-model="item.states"
                    v-if="hasPermission(conversionRuleStatesButn)"
                   >
                    <v-btn :disabled = "ruleSetStatus==='5'" value="OFF" style="height:26px">停用</v-btn>
                    <v-btn :disabled = "ruleSetStatus==='5'" value="SIMULATION" style="height:26px">模拟</v-btn>
                    <v-btn :disabled = "ruleSetStatus==='5'" value="OFFICIAL" style="height:26px">启用</v-btn>
                    </v-btn-toggle>
                  </td>
                 <td class="text-center">
                   <v-tooltip bottom v-if="hasPermission(updateRuleButn)">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-1"
                        color="primary"
                        v-on="on"
                        @click="editRule(item)"
                        >mdi-pencil</v-icon
                      >
                    </template>
                    <span>编辑</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="hasPermission(copyRuleButn)">
                    <template v-slot:activator="{ on }">
                      <v-icon small class="mr-1" v-on="on" @click="snackbar = true"
                        >mdi-book-minus-multiple</v-icon
                      >
                    </template>
                    <span>复制</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="hasPermission(deleteRuleButn)">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-1"
                        color="primary"
                        v-on="on"
                        @click="doDelRule(item)"
                        :disabled = "ruleSetStatus==='5'"
                        >mdi-delete</v-icon
                      >
                    </template>
                    <span>删除</span>
                  </v-tooltip>
                 </td>
                </tr>
             </template>
            <!--表格内容-->
          </v-data-table>
          <!-- </v-list-item-content>
         </v-list-item> -->
        </v-list>
      </v-card-text>
    </v-card>
    <!-- 确定删除的弹窗 -->
    <del-dialog
      :isDialogShow="isDialogDelShow"
      :debugModeClueCode="debugModeClueCode"
      @cancelDel="isDialogDelShow = false"
      @confimDel="confirmDelFun"
    ></del-dialog>
    <!-- 调接口结果的提示框 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
      >{{ snackbarServeMsg }}</v-snackbar
    >
    <!-- 点击删除规则按钮 确定升版的弹窗 -->
    <v-row justify="center">
      <v-dialog v-model="isUpgradeDialogShow" persistent width="350">
        <v-card class="del-dialog">
          <v-card-text style="padding-top:50px">
            确定升级版本并自动删除吗？
          </v-card-text>
          <v-card-actions style="margin-right:12px;margin-top:10px;">
            <div class="flex-grow-1" />
            <v-btn text class="del-dialog-btn" @click="cancelUpGradeFromDel()">
              取消
            </v-btn>
            <v-btn
              color="primary"
              text
              class="del-dialog-btn"
              @click="confimUpGradeFromDel()"
            >
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!---点击导入规则， 弹出批量选择规则弹框---->
    <v-row justify="center">
      <v-dialog
       v-model="isbatchDialogShow"
        persistent
        scrollable
        max-width="70%"
        class="add-edut-ruleSet">
          <v-card>
              <v-card-title>
                <v-toolbar-title>批量选择规则</v-toolbar-title>
                <div class="flex-grow-1" />
                <v-btn class="mr-0" icon dark @click="cancelBatchModel()">
                  <v-icon color="#CCCCCC">mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text style="max-height: 600px;">
                  <v-form  ref="Form"   class="batchForm">
                    <v-container class="batchContainer" >
                      <div class="formContext">
                        <div class="line_one" v-for="(item, index) in batchCopyFormData" :key="index">
                            <div class="batchRow" v-if="index===0">
                              <v-row  cols="12">
                                  <div class="mt-2 col-3 paddRnone">{{ item.label }}:</div>
                                  <div class="col-8 padLfnone">
                                      <v-autocomplete
                                      v-model="item.value"
                                        :item-text="item.selectText"
                                        :item-value="item.selectField"
                                        :items="item.options"
                                        :required="item.required"
                                        :rules="item.rules"
                                        :multiple="item.multiple"
                                         @change="changeValue(item)"
                                        no-data-text="没有匹配数据"
                                        :label="item.label"
                                        outlined
                                        dense
                                    />
                                  </div>
                              </v-row>
                            </div><!--batchRow end-->
                            <div class="batchRow"  v-if="index===1">
                              <v-row  cols="12">
                                <div class="mt-2 col-3 paddRnone">{{ item.label }}:</div>
                                <div class="col-8 padLfnone">
                                    <v-autocomplete
                                      v-model="item.value"
                                      :item-text="item.selectText"
                                      :item-value="item.selectField"
                                      :items="item.options"
                                      :required="item.required"
                                      :rules="item.rules"
                                      :multiple="item.multiple"
                                      @change="changeValue(item)"
                                      no-data-text="没有匹配数据"
                                      :label="item.label"
                                      outlined
                                      dense
                                   />
                                </div>
                            </v-row>
                            </div><!--batchRow end-->
                            <div class="batchRow" v-if="index===2">
                            <v-row  cols="12">
                                <div class="mt-2 col-3 paddRnone">{{ item.label }}:</div>
                                <div class="col-8 padLfnone">
                                    <v-select
                                      v-model="item.value"
                                      :item-text="item.selectText"
                                      :item-value="item.selectField"
                                      :items="item.options"
                                      :required="item.required"
                                      :rules="item.rules"
                                      @change="RuleChangeValue(item)"
                                      :multiple="item.multiple"
                                      no-data-text="没有匹配数据"
                                      :label="item.label"
                                      outlined
                                      dense
                                    />
                                </div>
                            </v-row>
                            </div><!--batchRow end-->
                            <div class="batchRow" v-if="index===3">
                              <v-row  cols="12" >
                                <div class="mt-2 col-3 paddRnone">{{ item.label }}:</div>
                                <div class="col-8 padLfnone">
                                    <v-select
                                      v-model="item.value"
                                      :item-text="item.selectText"
                                      :item-value="item.selectField"
                                      :items="item.options"
                                      @change="RuleChangeValue(item)"
                                      :required="item.required"
                                      :rules="item.rules"
                                      no-data-text="没有匹配数据"
                                      :multiple="item.multiple"
                                      :label="item.label"
                                      outlined
                                      dense
                                    />
                                </div>
                            </v-row>
                            </div><!--batchRow end-->
                        </div>
                      </div>
                    </v-container>
                  </v-form>
                  <!-- 策略信息 -->
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <h3 style="margin-bottom:20px">策略信息</h3>
                        <div class="ruleSetParam">
                          <v-row>
                            <v-col cols="3" class="text-left">
                              <p>
                                所属公司：{{
                                  operatedRuleSet.organizationId
                                    | rulesetOrganization(organizationList)
                                }}
                              </p>
                            </v-col>
                            <v-col cols="3" class="text-left">
                              <p>
                                所属应用：{{
                                  operatedRuleSet.appId | rulesetApplication(applications)
                                }}
                              </p>
                            </v-col>
                            <v-col cols="3" class="text-left">
                              <p>
                                交易类型：
                                {{
                                  operatedRuleSet.transactionTypeId
                                    | rulesetTradeTypes(tradeTypes)
                                }}
                              </p>
                            </v-col>
                            <v-col cols="3" class="text-left">
                              <p>
                                规则匹配模式：
                                {{
                                  operatedRuleSet.matchingModel
                                    | filtersShowRuleMatchingModel(ruleMatchingModels)
                                }}
                              </p>
                            </v-col>
                          </v-row>
                        </div>
                        <div class="ruleSetParam">
                          <v-row>
                            <v-col cols="3" class="text-left">
                              <p>规则数量： {{ operatedRuleSet.total }}</p>
                            </v-col>
                            <v-col cols="3" class="text-left">
                              <p>启用规则： {{ operatedRuleSet.startUsing }}</p>
                            </v-col>
                            <v-col cols="3" class="text-left">
                              <p>停用规则： {{ operatedRuleSet.blockUp }}</p>
                            </v-col>
                            <v-col cols="3" class="text-left">
                              <p>模拟规则： {{ operatedRuleSet.simulation }}</p>
                            </v-col>
                          </v-row>
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list><!-- 策略信息 end-->
                  <!---策略详情--->
                  <v-list>
                     <v-list-item>
                      <v-list-item-content>
                        <v-row align="center">
                            <v-col
                              class="d-flex"
                              cols="12"
                              sm="6"
                            >
                            <h3>策略信息</h3>
                            </v-col>
                            <v-col
                              class="d-flex"
                              cols="12"
                              sm="6"
                            >
                             <v-text-field
                            v-model="search"
                            placeholder="规则搜索"
                            append-icon="mdi-magnify"
                            outlined
                            dense
                          ></v-text-field>
                          </v-col>
                        </v-row>
                         <!-- @toggle-select-all="getSelect" -->
                         <v-data-table
                            :headers="batchCopyRulesHeader"
                            :items="batchExportList"
                            hide-default-footer
                            :disable-pagination="pagination"
                            :items-per-page="rulePageSize"
                            :loading="loading"
                            loading-text="加载数据中..."
                            no-results-text="没有匹配的数据"
                            :search="search"
                            item-key="id"
                            show-select
                            v-model="batchSelectRule"
                            style="min-height: 500px;"
                        >
                        <!--表格内容-->
                        <template v-slot:body="{ items }">
                            <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
                              <td colspan="10">没有数据</td>
                            </tr>
                            <tr
                            v-else
                            v-for="(item, index) in items"
                            :key="index"
                            class="el-tr-defu">
                             <!-- @click="ruleChecked()" -->
                              <td class="text-center">
                                <v-checkbox v-model="batchSelectRule" :value="item" style="margin:0px;padding:0px"  />
                              </td>
                              <td class="text-center">{{item.ruleNo}}</td>
                              <td class="text-left">{{item.ruleName}}</td>
                              <td class="text-center">{{item.labelId | filtersRiskyLabel(riskyLabels)}}</td>
                              <!-- <td class="text-center" v-if="operatedRuleSet.matchingModel !== 'SCORE_MATCH'">{{ item.strategy | filtersStrategies(strategies) }}</td>

                              <td class="text-center">{{item.enableTime}}</td>
                              <td class="text-center">{{item.invalidTime}}</td> -->

                              <td class="text-center"   v-if="operatedRuleSet.matchingModel === 'SCORE_MATCH'">{{item.weights}}</td>
                              <td class="text-center"   v-if="operatedRuleSet.matchingModel !== 'SCORE_MATCH'">{{ item.strategy | filtersStrategies(strategies) }}</td>
                              <td class="text-center">{{item.enableTime}}</td>
                              <td class="text-center">{{item.invalidTime}}</td>
                              <td class="text-center" v-if="operatedRuleSet.matchingModel !== 'SCORE_MATCH'">{{ item.priorityLevel}}</td>
                              <td class="text-center">
                                <v-btn-toggle
                                class="ruleStatus"
                                color="primary"
                                v-model="item.states"
                                v-if="hasPermission(conversionRuleStatesButn)"
                              >
                                <!-- <v-btn :disabled = "ruleSetStatus==='5'" value="OFF" style="height:26px">停用</v-btn>
                                <v-btn :disabled = "ruleSetStatus==='5'" value="SIMULATION" style="height:26px">模拟</v-btn>
                                <v-btn :disabled = "ruleSetStatus==='5'" value="OFFICIAL" style="height:26px">启用</v-btn> -->

                                <v-btn disabled  value="OFF" style="height:26px">停用</v-btn>
                                <v-btn disabled value="SIMULATION" style="height:26px">模拟</v-btn>
                                <v-btn disabled value="OFFICIAL" style="height:26px">启用</v-btn>
                                </v-btn-toggle>
                              </td>
                            </tr>
                        </template>
                        <!--表格内容-->
                        </v-data-table>
                      </v-list-item-content>
                     </v-list-item>
                  </v-list><!---策略详情end--->
              </v-card-text>
              <!--按钮操作区域-->
              <v-divider></v-divider>
                <v-card-actions>
                  <div class="flex-grow-1" />
                  <v-btn style="mr-5" @click="cancelBatchModel()">取消</v-btn>
                  <v-btn
                    color="primary"
                    class="mr-5"
                    @click="saveBatchModel()"
                    >确定</v-btn
                  >
                </v-card-actions>
          </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>
<script>
import * as dataService from 'api/ruleSet';
import delDialog from '@c/DelDialog';

export default {
  name: 'ruleSet',
  components: {
    delDialog
  },
  filters: {
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
    // 规则集所属机构
    rulesetOrganization: function (dataStr, OrganizationList) {
      if (dataStr && typeof dataStr === 'string') {
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
      if (dataStr && typeof dataStr === 'string') {
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
      if (dataStr && typeof dataStr === 'string') {
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
    },
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
      search: '', // 规则搜索框
      isSelect: 1, // 列表中复选框是否全选中，1为未选中，2为全选择
      selectedRule: [],
      batchSelectRule: [], // 导入规则里面的所勾选的内容
      isFixed: false,
      // 表格加载数据动画
      loading: true,
      // 删除弹窗
      isDialogDelShow: false,
      isbatchDialogShow: false, // 导入规则弹框是否展示

      // 区分是否是新增规则
      isAddRule: true,
      // 是否可以删除和编辑的标识
      editAndDelFlag: true,
      confirmDelFun: '',
      operatedRuleSet: {},
      // 添加规则的数据
      operatedRules: [],
      // 规则列表的表头
      operatedRulesHeader: [],
      // 规则列表的弹窗
      isDelRuleModelShow: false,
      // 当前删除的规则
      delrule: {},
      // 被操作的规则
      operateRule: {
        ruleNo: '',
        ruleName: '',
        versionId: '',
        labelId: '',
        strategy: '', // 匹配模式
        enableTime: '',
        invalidTime: '',
        priorityLevel: '', // 匹配模式
        states: '',
        descption: '',
        weights: '', // 评分模式
        ruleJson: {
          logicalRelationship: '',
          // 条件列表
          conditionList: []
        }
        // addruleStates: null // 点击 新增规则的时候，调整当前规则集状态
      },
      // 旧的规则列表
      oldOperatedRules: [],
      // 当前版本规则集是否被引用
      isReferenced: false,
      // 当前版本ID
      versionId: '',
      // 当前版本号
      versionNum: '',
      // 规则编辑之前旧的规则 编辑前后的规则要进行判断，被引用的时候如果规则前后有变化要生成新的版本的规则集
      oldRuleJson: '',
      // 如果是评分模式的 编辑之前旧的阈值
      oldRiskThreshold: '',
      // 所属机构
      organizations: [],
      // 机构的数组
      organizationList: [],
      // 所属应用
      applications: [],
      // appIDList: [],
      // 交易类型
      tradeTypes: [],
      // 规则匹配模式
      ruleMatchingModels: [
        { text: '最坏匹配', value: 'WORST_MATCH' },
        { text: '首次匹配', value: 'FIRST_MATCH' },
        { text: '评分模式', value: 'SCORE_MATCH' }
      ],
      // 规则集状态
      // rulesetStatus: [
      //   { value: '0', text: '已保存' },
      //   { value: '1', text: '已输出' },
      //   { value: '2', text: '输出失败' }
      // ],
      // 风险标签
      riskyLabels: [],
      // 处置策略
      strategies: [],
      // 删除规则的时候如果已经被引用 提示弹框
      isUpgradeDialogShow: false,
      pagination: false,
      rulePageSize: 1000,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      timeout: 2000,
      isSnackbarTop: true,
      // 运算符
      operator: [],
      // 保存按钮是否可用
      isSaveAbled: false,
      isSaveVoildModel: false, // 导入规则内的保存按钮是否可用
      // 保存按钮点击后是否已经有数据返回
      isSaveSuccess: true,
      // 详情权限
      saveRuleButn: '/saveRuleButton', // 详情保存按钮是否显示
      addRuleButn: '/addRuleButton', // 新增规则按钮
      batchDeleteRuleButn: '/batchDeleteRuleButton', // 批量删除按钮
      batchCopyRuleButn: '/batchCopyRuleButton', // 批量复制规则按钮
      conversionRuleStatesButn: '/conversionRuleStatesButton', // 状态转换按钮
      updateRuleButn: '/updateRuleButton', // 修改规则按钮
      copyRuleButn: '/copyRuleButton', // 复制规则按钮
      deleteRuleButn: '/deleteRuleButton', // 删除规则按钮
      uv: false, // 是否调用升版标记
      isNeedAudit: '', // 是否需要审核
      ruleSetPattern: '', // 规则集模式 （调试、安全）
      // 规则集状态
      ruleSetStatus: '',
      variableFields: [],
      changeItem: [{ value: 'OFFICIAL', text: '批量启用' },
        { value: 'OFF', text: '批量停用' },
        { value: 'SIMULATION', text: '批量模拟' }
      ],
      changeItemValue: '', // 变更状态value
      // 规则集新增编辑弹框表单数据
      batchCopyFormData: [
        {
          label: '应用名称*',
          value: '',
          required: true,
          rules: [v => (v && !!v.length) || '应用名称不能为空'],
          type: 'autocomplete',
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        },
        {
          label: '交易类型*',
          value: '',
          required: true,
          rules: [v => (v && !!v.length) || '交易类型不能为空'],
          type: 'autocomplete',
          // multiple: true,
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        },
        {
          label: '规则集名称*',
          value: '',
          type: 'select',
          required: true,
          selectText: 'selectText',
          selectField: 'selectField',
          options: [],
          rules: [
            v => (v && !!v) || '规则集名称不能为空',
            v => (v && v.length <= 50) || '最多只能输入50个字符',
            v =>
              /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”、；‘'，。、]/.test(
                v
              ) || '不能包含特殊字符'
          ]
        },
        {
          label: '规则集版本*',
          value: '',
          required: true,
          rules: [v => (v && !!v) || '规则集版本不能为空'],
          type: 'select',
          selectText: 'histVersion',
          selectField: 'histVersion',
          options: []
        }
      ],
      batchCopyRulesHeader: [
        {
          text: '规则编号',
          value: 'ruleNo',
          sortable: true,
          align: 'center',
          width: 100
          // filterable :false
        },
        {
          text: '规则名称',
          value: 'ruleName',
          sortable: true,
          align: 'left'
        },
        {
          text: '标签',
          value: 'labelId',
          sortable: true,
          align: 'center',
          width: 100
        },
        {
          text: '权重',
          value: 'suggestedStrategies',
          sortable: true,
          align: 'center',
          width: 100
        },
        {
          text: '启用时间',
          value: 'enableTime',
          sortable: true,
          align: 'center',
          width: 100
        },
        {
          text: '失效时间',
          value: 'invalidTime',
          sortable: true,
          align: 'center',
          width: 100
        },

        { text: '规则状态', value: 'states', sortable: false, align: 'center' }
      ],
      batchExportList: [], // 规则集导出列表
      isbatchDel: false, // 是否是批量删除
      batchDelIds: [], //  批量删除的时候ids
      debugModeClueCode: '', // 删除的内容
      exportParam: {}, // 导入规则弹框，根据应用，交易类型获取规则集下拉查询条件
      listParam: {},
      ruleNameChangeVerion: []// 根据规则集名称获取当前规则集版本
    };
  },
  computed: {},
  watch: {
    // search(newVal,oldVal){
    //   console.log(newVal,oldVal);
    // }
    search: {
      // 深度监听，可监听到对象、数组的变化
      handler (val, oldVal) {
        console.log('b.c: ' + val, oldVal);
      },
      deep: true // true 深度监听
    }
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

    // 获取计算符
    async GetOperator () {
      try {
        const response = await dataService.GetOperator();
        if (response.data.code === 200) {
          this.operator = response.data.data.list;
        }
      } catch (error) {}
    },
    // 获取枚举下拉数据  机构
    async getOrganizationList () {
      try {
        const response = await dataService.getSubordinateFirm();
        this.organizations = response.data.data.companyItems;
        this.treeToList(this.organizations);
        // this.addAndEditFormData[1].options = JSON.parse(
        //   JSON.stringify(this.organizations)
        // );
        if (this.organizations.length > 0) {
          this.organizations.forEach((item, index, ary) => {
            this.searchParam[1].options.push(item);
          });
        }
      } catch (error) {}
    },
    // 获取枚举下拉数据  应用
    async getApplicationList () {
      let params = {
        states: 1,
        appName: '',
        spid: '',
        appTag: '',
        appType: ''
      };
      try {
        const response = await dataService.getApp(params);
        this.applications = response.data.data;

        this.batchCopyFormData[0].options = [{
          selectText: '全部应用',
          selectField: 'all'
        }];
        this.applications.forEach(element => {
          // 批量规则导出
          this.batchCopyFormData[0].options.push({
            selectText: element.appName,
            selectField: element.id
          });
        });

        // this.getTradeTypeList(this.appIDList,1);
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
    // 获取所选应用下的交易类型
    async getTradeTypeList (param, forWhat) {
      let ids;
      if (forWhat === 1) {
        if (typeof param === 'string') {
          ids = [param];
        }
        if (typeof param === 'object') {
          ids = param;
        }
      } else {
        if (typeof param === 'string') {
          ids = [param];
        }
        if (typeof param === 'object') {
          ids = param;
        }
      }
      const params = {
        jsonIds: JSON.stringify(ids)
      };

      try {
        const response = await dataService.getTradeType(params);
        if (response.data.code < 0) {
          response.data.data = [];
        }
        // 搜索的应用选中
        if (forWhat === 1) {
          this.batchCopyFormData[1].options = [
            {
              selectText: '全部交易类型',
              selectField: 'allOfOne'
            }
          ];
          // 返回的交易类型有值
          if (response.data.data.length) {
            response.data.data.forEach(element => {
              this.batchCopyFormData[1].options.push({
                selectText: element.tradeName,
                selectField: element.id
              });
            });
          } else {
            this.batchCopyFormData[1].options = [];
          }
        } else {
          // 新增和编辑的应用选择
          if (response.data.data.length) {
            //  安全模式且被引用  可修改的字段   所属应用、交易类型
            if (this.refRecordStatus === 3) {
              // 交易类型 被引用---不可修改
              console.log(this.batchCopyFormData[1].value, '被选中的参数', this.addAndEditFormData[3].options, '所有的选项');
              this.batchCopyFormData[1].options.forEach((opItem) => {
                let isHave = false;
                this.batchCopyFormData[1].value.forEach((item) => {
                  if (opItem.selectField === item) {
                    isHave = true;
                  }
                });
                opItem.disabled = isHave;
              });
            }
          } else {
            this.batchCopyFormData[1].options = [];
          }
        }
      } catch (error) {}
    },

    // 新增编辑规则集选择框change事件
    changeValue (item) {
      // for (let index = 0; index < item.value.length; index++) {
      //   const element = item.value[index];
      //   if (!element) {
      //     item.value.splice(index, 1);
      //   }
      // }
      if (item.label === '应用名称*') {
        // 没有被引用下清空交易类型，根据当前所选的所属引用--获取交易类型。。。
        this.getTradeTypeList(item.value, 1);
        this.exportParam.appId = item.value;// 所属应用
        if (!item.value.length) {
          item.value = '';
          this.batchCopyFormData[1].value = '';
          this.batchCopyFormData[2].value = '';
          this.batchCopyFormData[3].value = '';
          // this.batchCopyFormData[3].options = [];
        }
        // 不是安全模式被引用的情况下，不清除交易类型
        if (this.refRecordStatus !== 3) {
          this.batchCopyFormData[1].value = '';
        }
      }
      if (item.label === '交易类型*') {
        if (!item.value.length) {
          item.value = '';
          //  this.batchCopyFormData[2].value=''
        }
        this.exportParam.transactionId = item.value;// 交易类型
        this.getExportRuleModelSelect(this.exportParam);// 规则集导入弹框 根据所勾选应用，交易类型 获取查询条件
        if (item.value.length > 200) {
          this.valid = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = '交易类型最多不能超过200个';
          this.snackbarServeColor = 'error';
        }
      }
    },
    /***
     * 规则集导入弹框 根据所勾选应用，交易类型 获取查询条件
     * 参数 appId应用id, transactionId交易类型id
     * **/
    async getExportRuleModelSelect (exportParam) {
      // console.log(exportParam,'xialacans')
      try {
        const response = await dataService.getRuleConditiong(exportParam);
        if (response.data.code === 200) {
          this.batchCopyFormData[2].options = []; // 赋值前先清空，避免重复叠加
          this.ruleNameChangeVerion = response.data.data;// 整体接口返回的数据
          // 对象 value 的数组
          Object.keys(response.data.data).forEach((item) => {
            let keyArry = response.data.data[item]; // 迭代出所有的key 对应的数组
            if (keyArry.length > 0) {
              // 取出数组里面的 规则集名称数据
              keyArry.forEach((innerItem) => {
                this.batchCopyFormData[2].options.push({
                  selectText: innerItem.setName,
                  selectField: innerItem.setId
                });
              });
            } else {
              this.batchCopyFormData[2].options = [];
            }
          });
        }
      } catch (error) {}
    },
    // 规则集名称筛选取出对应规则的版本号
    RuleChangeValue (item) {
      // for (let index = 0; index < item.value.length; index++) {
      //     const element = item.value[index];
      //     if (!element) {
      //       item.value.splice(index, 1);
      //     }
      //   }
      // 对象 key 的数组
      if (item.label === '规则集名称*') {
        console.log(item.options, 'iiiiiiii');
        // 根据当前规则集名称赛选出当前规则集的版本号
        let totalData = this.ruleNameChangeVerion;
        let valuesArr = Object.values(totalData);
        this.batchCopyFormData[3].value = '';
        this.batchCopyFormData[3].options = [];
        for (let i = 0; i < valuesArr.length; i++) {
          const valuesItem = valuesArr[i];// 得到各个key 下方的value
          // let hasValue = false; // 不满足条件接着循环，满足条件跳出循环
          if (item.value === valuesItem[0].setId) {
            this.batchCopyFormData[3].options = valuesItem;
            this.listParam.setName = valuesItem[0].setName;
            console.log(valuesItem, 'valuesItem');
          }
        }
      }
      // 规则版本
      if (item.label === '规则集版本*') {
        // console.log(item,'banb')
        this.listParam.version = item.value;
        this.getRuleExportList();
        if (!item.value.length) {
          item.value = '';
        }
      }
    },
    /******
     * 规则集导入 获取规则列表
     * 参数
     * appId
     * transactionTypeId
     * setName
     * version
     * *****/
    // 获取风险标签
    async getRuleExportList () {
      let param = {
        appId: this.exportParam.appId,
        transactionTypeId: this.exportParam.transactionId,
        setName: this.listParam.setName,
        version: this.listParam.version
      };
      console.log(param, 'param');
      try {
        let response = await dataService.getQueryRules(param);
        console.log(response, 'response');
        if (response.data.code === 200) {
          console.log(response.data.data, '导出规则列表数据');
          if (response.data.data.rules.length > 0) {
            this.batchExportList = response.data.data.rules;
          } else {
            this.batchExportList = [];
          }
        }
      } catch (error) {}
    },
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
    // 初始化加载规则列表和规则集基本信息
    async operateRules (item) {
      // 获取是否被引用
      // console.log(item, 'itemitemitemitem');
      const paramForIsReferenced = {
        sourceId: item.id,
        sourceType: 'RULE_SET',
        sourceVersion: this.versionNum
      };
      try {
        const response = await dataService.checkIsrefrecord(
          paramForIsReferenced
        );
        const code = response.data.code;
        if (code === 200) {
          this.isReferenced = response.data.data.isReference;
        }
      } catch (error) {}

      // 如果是被引用状态并且是评分模式 保存旧的阈值
      let index = item.rulesetHistoryList.length - 1;
      if (item.matchingModel === 'SCORE_MATCH') {
        this.oldRiskThreshold = item.rulesetHistoryList[index].riskThreshold;
        if (!this.oldRiskThreshold) {
          this.oldRiskThreshold = [{ from: '0', to: '20', strategy: '' }];
        }
      }
      try {
        this.operatedRuleSet = JSON.parse(JSON.stringify(item));
        // 不同的模式的规则表格的表头不同
        if (this.operatedRuleSet.matchingModel === 'SCORE_MATCH') {
          this.operatedRulesHeader = [
            {
              text: '规则编号',
              value: 'ruleNo',
              sortable: true,
              align: 'center',
              width: 100
              // filterable :false
            },
            {
              text: '规则名称',
              value: 'ruleName',
              sortable: true,
              align: 'left'
            },
            {
              text: '标签',
              value: 'labelId',
              sortable: true,
              align: 'center',
              width: 100
            },
            {
              text: '权重',
              value: 'weights',
              sortable: true,
              align: 'center',
              width: 100
            },
            {
              text: '启用时间',
              value: 'enableTime',
              sortable: true,
              align: 'center',
              width: 100
            },
            {
              text: '失效时间',
              value: 'invalidTime',
              sortable: true,
              align: 'center',
              width: 100
            },
            { text: '状态', value: 'states', sortable: false, align: 'center' },
            {
              text: '操作',
              value: 'action',
              sortable: false,
              align: 'center',
              width: 100
            }
          ];
        } else {
          this.operatedRulesHeader = [
            {
              text: '规则编号',
              value: 'ruleNo',
              sortable: true,
              align: 'center',
              width: 100
              // filterable :false
            },
            {
              text: '规则名称',
              value: 'ruleName',
              sortable: true,
              align: 'left'
            },
            {
              text: '风险标签',
              value: 'labelId',
              sortable: true,
              align: 'center',
              width: 100
            },
            {
              text: '处置策略',
              value: 'suggestedStrategies',
              sortable: true,
              align: 'center',
              width: 100
            },
            {
              text: '启用时间',
              value: 'enableTime',
              sortable: true,
              align: 'center',
              width: 100
            },
            {
              text: '失效时间',
              value: 'invalidTime',
              sortable: true,
              align: 'center',
              width: 100
            },
            {
              text: '优先级',
              value: 'priorityLevel',
              sortable: true,
              align: 'center',
              width: 100
            },
            { text: '状态', value: 'states', sortable: false, align: 'center' },
            {
              text: '操作',
              value: 'action',
              sortable: false,
              align: 'center',
              width: 100
            }
          ];
        }
        // 获取规则列表
        this.getRuleList();
      } catch (error) {}
    },
    // 获取当前版本的规则列表
    async getRuleList () {
      this.loading = true;
      const param = {
        id: this.versionId
      };
      try {
        const response = await dataService.getVersionInfo(param);
        const code = response.data.code;
        if (code === 200) {
          // 拿到当前用户所选版本号的规则列表
          this.operatedRules = response.data.data.ruleList;
          // this.selectedRule = this.operatedRules
          this.oldOperatedRules = JSON.parse(
            JSON.stringify(response.data.data.ruleList)
          );
          // 如果是评分模式 没有风险阈值 添加上
          if (this.operatedRuleSet.matchingModel === 'SCORE_MATCH') {
            if (!response.data.data.hisVersion.riskThreshold) {
              this.$set(this.operatedRuleSet, 'riskThreshold', [
                { from: '0', to: '20', strategy: '' }
              ]);
            } else {
              this.$set(
                this.operatedRuleSet,
                'riskThreshold',
                JSON.parse(response.data.data.hisVersion.riskThreshold)
              );
            }
          }
          // 规则总数  启用数  停用数
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
          this.isSaveAbled = true;
          this.loading = false;
          // 这个版本规则集状态修改
          let sStorage = window.sessionStorage;
          this.ruleSetStatus = response.data.data.hisVersion.states; // 规则集状态
          sStorage.setItem('ruleSetStatus', response.data.data.hisVersion.states);
          this.selectedRule = [];
        }
      } catch (error) {}
    },
    // 批量复制
    batchCopy () {
      if (this.$refs.Form) {
        this.$refs.Form.reset();
      }
      this.batchExportList = [];
      this.isbatchDialogShow = true;
    },
    // 批量删除
    batchDel () {
      this.isbatchDel = true;// 是批量删除
      console.log(this.selectedRule, '勾选的id');
      this.batchDelIds = [];
      if (this.selectedRule) {
        this.selectedRule.forEach((item) => {
          this.batchDelIds.push(item.id);
        });
        this.delRule = this.batchDelIds;
        console.log(this.delRule, 'this.delRule111');
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请先勾选需要删除的选项';
        this.snackbarServeColor = 'error';
      }
      this.debugModeClueCode = '您确定要删除所选项吗？';
      let isUpgradeVal = this.isUpgradeFun();
      // console.log(isUpgradeVal, 'isUpgradeVal');
      if (isUpgradeVal) {
        this.isUpgradeDialogShow = true;
      } else {
        this.delDialogModal = true;
        this.isDialogDelShow = true;
        this.confirmDelFun = this.confimDelRule;
      }
    },
    // 变更状态
    batchStatusChange () {
      if (this.selectedRule.length > 0) {
        this.operatedRules.forEach(newEle => {
          this.selectedRule.forEach((batchIte) => {
            if (newEle.id === batchIte.id) {
              newEle.states = this.changeItemValue;
            }
          });
        });
        console.log(this.operatedRules, this.selectedRule, '勾选数据与变更数据');
        // ruleList = this.operatedRules;
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请先勾选需要变更状态选项';
        this.snackbarServeColor = 'error';
      }
    },
    // 添加or编辑规则集弹框的取消按钮方法
    cancelBatchModel () {
      if (this.$refs.Form) {
        this.$refs.Form.reset();
      }
      // this.$refs.Form.reset();
      this.isbatchDialogShow = false;
    },
    // 批量导出保存按钮
    async saveBatchModel () {
      // 防止连续点击
      if (!this.isSaveSuccess) {
        return;
      }
      let isUpgrade = this.isUpgradeFun();
      let batchRuleList = [];
      // 没有被引用点击保存按钮调修改接口
      // if (!isUpgrade) {
      if (this.batchSelectRule.length > 0) {
        console.log(this.batchSelectRule, '勾选数据与变更数据');
        this.batchSelectRule.forEach(element => {
          console.log(element.ruleJson, '121212');
          if (element.riskThreshold !== '' && element.riskThreshold !== null) {
            element.riskThreshold = JSON.parse(element.riskThreshold);
          }
          element.ruleJson = JSON.parse(element.ruleJson);
          // rulesetHistoryId: this.versionId,
          element.rulesetHistoryId = this.versionId;
        });
        batchRuleList = this.batchSelectRule;
      } else {
        batchRuleList = [];
        this.snackbarServe = true;
        this.snackbarServeMsg = '请先勾选需要变更状态选项';
        this.snackbarServeColor = 'error';
      }
      console.log(batchRuleList, 'dddddddddddddddd');
      let param = {
        rules: JSON.stringify(batchRuleList)
      };
      const response = await dataService.batchAddRules(param);
      const code = response.data.code;
      // 保存接口返回成功后---跳转到规则列表
      if (code > 0) {
        this.isbatchDialogShow = false; // 关闭弹框
        this.getRuleList();
      } else {
        // 保存失败
        this.snackbarServe = true;
        this.isbatchDialogShow = true; // 关闭弹框
        this.snackbarServeMsg = response.data.msg;
        this.snackbarServeColor = 'red';
      }
    },
    // 规则列表保存按钮
    async saveRuleList () {
      // 防止连续点击
      if (!this.isSaveSuccess) {
        return;
      }
      // 评分模式下验证风险阈值不能有值为空的情况
      if (this.operatedRuleSet.matchingModel === 'SCORE_MATCH') {
        let isEmpty = false;
        for (
          let index = 0;
          index < this.operatedRuleSet.riskThreshold.length;
          index++
        ) {
          const element = this.operatedRuleSet.riskThreshold[index];
          if (!element.from || !element.to || !element.strategy) {
            isEmpty = true;
            break;
          }
        }
        if (isEmpty) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '风险阈值参数不能为空';
          this.snackbarServeColor = 'error';
          return;
        }
      }
      this.isSaveSuccess = false;
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
      // 没有被引用点击保存按钮调修改接口
      if (!isUpgrade) {
        let ruleList = [];
        this.operatedRules.forEach(element => {
          ruleList.push({
            id: element.id,
            states: element.states
          });
        });
        let param = {
          id: this.operatedRuleSet.id,
          setNo: this.operatedRuleSet.setNo,
          setName: this.operatedRuleSet.setName,
          organizationId: this.operatedRuleSet.organizationId,
          appId: this.operatedRuleSet.appId,
          transactionTypeId: this.operatedRuleSet.transactionTypeId,
          matchingModel: this.operatedRuleSet.matchingModel,
          riskThreshold:
            this.operatedRuleSet.matchingModel === 'SCORE_MATCH'
              ? JSON.stringify(this.operatedRuleSet.riskThreshold)
              : '',
          version: parseInt(this.versionNum / 1),
          ruleList: JSON.stringify(ruleList),
          uv: this.uv,
          states: this.isNeedAudit === '0' ? '1' : '4' // 配置完规则后，根据是否审核的状态来返回列表状态  0 不需要审核 ---1（已输出） 4（待审核）
        };
        const response = await dataService.modifyRuleSet(param);
        const code = response.data.code;
        // 保存接口返回成功后---跳转到规则列表
        if (code > 0) {
          this.$router.push('/ruleSet');
        } else {
          // 保存失败
          this.snackbarServe = true;
          this.snackbarServeMsg = response.data.msg;
          this.snackbarServeColor = 'red';
        }
      } else {
        // 有引用的情况下 升版操作
        this.rulesetChangeValue(); // 调用升版方法，根据字段是否发生变化来进行升版处理
      }
    },
    // 保存之前，判断当前规则集是否有变化
    async rulesetChangeValue () {
      // 该条规则集被引用的情况下
      let isChange = false;
      // 判断阈值是否有变化
      if (this.operatedRuleSet.matchingModel === 'SCORE_MATCH') {
        // 阈值长度有变化
        if (typeof this.oldRiskThreshold === 'string') {
          this.oldRiskThreshold = JSON.parse(this.oldRiskThreshold);
        }
        if (this.oldRiskThreshold.length !== this.operatedRuleSet.riskThreshold.length) {
          isChange = true;
        }
        // 阈值长度没有变化 比较具体的值
        if (!isChange) {
          for (let index = 0; index < this.operatedRuleSet.riskThreshold.length; index++) {
            const element = this.operatedRuleSet.riskThreshold[index];
            const oldElement = this.oldRiskThreshold[index];
            if (element.from !== oldElement.from || element.to !== oldElement.to || element.strategy !== oldElement.strategy) {
              isChange = true;
              break;
            }
            if (isChange) {
              break;
            }
          }
        }
      }
      // 判断规则的状态是否有变化
      if (!isChange) {
        this.oldOperatedRules.forEach(oldEle => {
          this.operatedRules.forEach(newEle => {
            if (oldEle.id === newEle.id) {
              if (oldEle.states !== newEle.states) {
                isChange = true;
              }
            }
          });
        });
      }
      let ruleList = [];
      this.operatedRules.forEach(newEle => {
        ruleList.push({
          id: newEle.id,
          states: newEle.states,
          isDel: false
        });
      });
      // 阈值或者状态有变化 升版
      if (isChange) {
        let param = {
          id: '',
          rulesetHistoryId: this.versionId,
          ruleNo: '',
          ruleName: '',
          labelId: '',
          isWeak: '',
          strategy: '',
          enableTime: '',
          invalidTime: '',
          priorityLevel: '',
          weights: '',
          riskThreshold: JSON.stringify(this.operatedRuleSet.riskThreshold),
          comment: '',
          ruleJson: '',
          states: this.isNeedAudit === '0' ? '1' : '4', // 配置完规则后，根据是否审核的状态来返回列表状态  0 不需要审核 ---1（已输出） 4（待审核）
          upgrade: true,
          setId: this.operatedRuleSet.id,
          ruleList: JSON.stringify(ruleList),
          isOperator: false
        };

        dataService.UpgradeRule(param).then(response => {
          const code = response.data.code;
          if (code > 0) {
            this.uv = true;
            this.snackbarServe = true;
            this.snackbarServeMsg = '当前版本规则集被引用，已自动升版';
            this.snackbarServeColor = 'primary';
            this.versionId = response.data.data.rulesetHistoryId;
            this.isReferenced = false;
            const TIME_COUNT = 3;
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  clearInterval(this.timer);
                  this.timer = null;
                  this.$router.push('/ruleSet');
                }
              }, 500);
            }
          } else {
            this.uv = false;
            this.snackbarServe = true;
            this.isSaveSuccess = true;
            this.snackbarServeMsg = response.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.$router.push('/ruleSet');
      }
    },
    // 规则列表取消按钮
    cancelRuleList () {
      this.$router.push('/ruleSet');
    },
    // 点击添加规则的按钮
    async addRule () {
      let sStorage = window.sessionStorage;
      let operateRule = {
        ruleNo: '',
        ruleName: '',
        versionId: '',
        labelId: '',
        strategy: '', // 匹配模式
        enableTime: '',
        invalidTime: '',
        priorityLevel: '', // 匹配模式
        states: 'OFFICIAL',
        descption: '',
        weights: '', // 评分模式
        ruleJson: {
          logicalRelationship: 'and',
          // 条件列表
          conditionList: []
        },
        // 执行配置列表
        executeConfigureJson: []
        // addruleStates: '4' // 点击 新增规则的时候，调整当前规则集状态
      };
      sStorage.setItem('operateRule', JSON.stringify(operateRule));
      sStorage.setItem('operatedRules', JSON.stringify(this.operatedRules));
      sStorage.setItem('isReferenced', this.isReferenced);
      sStorage.setItem('versionId', this.versionId);
      sStorage.setItem('isAddRule', true);
      sStorage.setItem('ruleSet', JSON.stringify(this.operatedRuleSet));
      this.$router.push('/ruleDetail');
    },
    // 点击修改规则的按
    async editRule (item) {
      let sStorage = window.sessionStorage;
      sStorage.setItem('operateRule', JSON.stringify(item));
      sStorage.setItem('operatedRules', JSON.stringify(this.operatedRules));
      sStorage.setItem('isReferenced', this.isReferenced);
      sStorage.setItem('versionId', this.versionId);
      sStorage.setItem('isAddRule', false);
      sStorage.setItem('ruleSet', JSON.stringify(this.operatedRuleSet));
      this.$router.push('/ruleDetail');
    },
    // 点击删除规则的按钮
    doDelRule (item) {
      this.delRule = item;
      console.log(item, '删除的item~~');
      this.isbatchDel = false;
      this.debugModeClueCode = '您确定要删除此行？';
      let isUpgradeVal = this.isUpgradeFun();
      console.log(isUpgradeVal, 'isUpgradeVal');
      if (isUpgradeVal) {
        this.isUpgradeDialogShow = true;
      } else {
        this.delDialogModal = true;
        this.isDialogDelShow = true;
        this.confirmDelFun = this.confimDelRule;
      }
    },
    // 根据当前模式，判断删除的时候是否需要升级
    isUpgradeFun () {
      let isUpgrade;
      // 1.1、安全模式且被引用,需要升级
      if (this.ruleSetPattern === '1' && this.isReferenced) {
        isUpgrade = true;
        return isUpgrade;
      }
      // 1.2、安全模式且没被引用状态是已输出(已输出 === 需要审核且审核通过) === 安全模式&&没被引用&&需审核&&审核通过
      if (this.ruleSetPattern === '1' && !this.isReferenced && this.isNeedAudit === '1' && this.ruleSetStatus === '1') {
        isUpgrade = true;
        return isUpgrade;
      }
      // 2.1、安全模式且没被引用且状态是待审核、驳回、已输出(不需要审核)
      if (this.ruleSetPattern === '1' && !this.isReferenced && (this.ruleSetStatus === '4' || this.ruleSetStatus === '6' || (this.ruleSetStatus === '1' && this.isNeedAudit === '0'))) {
        isUpgrade = false;
        return isUpgrade;
      }
      // 2.2、调试模式不升版
      if (this.ruleSetPattern === '0') {
        isUpgrade = false;
        return isUpgrade;
      }
    },
    // 确定删除规则
    confimDelRule () {
      let param = {};
      if (!this.isbatchDel) {
        param = { ids: this.delRule.id };
      } else {
        param = { ids: this.batchDelIds.toString() };
      }
      console.log(param, '批量删除1111');
      // console.log(this.operatedRuleSet.id,JSON.parse(this.delRule.ruleJson), this.versionNum,'删除11')
      // 调取删除接口
      debugger;
      dataService.delRule(param).then(response => {
        const code = response.data.code;
        if (code > 0) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '删除成功';
          this.snackbarServeColor = 'primary';
          this.isDialogDelShow = false;
          this.selectedRule = [];// 删除之后，置空
          // this.delRel(this.operatedRuleSet.id, JSON.parse(this.delRule.ruleJson), this.versionNum);
          debugger;
          this.getRuleList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = response.data.msg;
          this.snackbarServeColor = 'error';
        }
      })
        .catch(() => {});
    },
    // 升版删除规则的取消弹框
    cancelUpGradeFromDel () {
      this.isUpgradeDialogShow = false;
    },
    // 升版删除规则的确定弹框
    confimUpGradeFromDel () {
      let ruleList = [];
      console.log(this.isbatchDel, '升版！！！！');
      // 批量删除的
      this.operatedRules.forEach(newEle => {
        newEle.isDel = false;
        this.batchDelIds.forEach((batchIte) => {
          if (newEle.id === batchIte) {
            // newEle.isDel = true;
            ruleList.push({
              id: newEle.id,
              states: newEle.states,
              isDel: newEle.id === batchIte
            });
          }
        });
      });
      // if (!this.isbatchDel) {
      //   this.operatedRules.forEach(newEle => {
      //     ruleList.push({
      //       id: newEle.id,
      //       states: newEle.states,
      //       isDel: newEle.id === this.delRule.id
      //     });
      //   });
      // } else {
      // // 批量删除的
      // this.operatedRules.forEach(newEle => {
      //   newEle.isDel = false;
      //   this.batchDelIds.forEach((batchIte) => {
      //     if (newEle.id === batchIte) {
      //         // newEle.isDel = true;
      //          ruleList.push({
      //         id: newEle.id,
      //         states: newEle.states,
      //         isDel: newEle.id === batchIte
      //      });
      //     }
      //   });
      // });
      // ruleList = this.operatedRules;
      // }
      let param = {
        id: '',
        rulesetHistoryId: this.versionId,
        ruleNo: '',
        ruleName: '',
        labelId: '',
        isWeak: '',
        strategy: '',
        enableTime: '',
        invalidTime: '',
        priorityLevel: '',
        weights: '',
        riskThreshold: JSON.stringify(this.operatedRuleSet.riskThreshold),
        comment: '',
        ruleJson: '',
        states: '',
        upgrade: true,
        setId: this.operatedRuleSet.id,
        ruleList: JSON.stringify(ruleList),
        isOperator: 'false'
      };
      dataService.UpgradeRule(param).then(response => {
        // if (param.upgrade) {
        //   this.operateRule.addruleStates = '4';
        // }
        const code = response.data.code;
        if (code > 0) {
          this.uv = true;
          this.snackbarServe = true;
          this.snackbarServeMsg = '当前版本规则集被引用，已自动升版';
          this.snackbarServeColor = 'primary';
          this.versionId = response.data.data.rulesetHistoryId;
          this.isReferenced = false;
          let sStorage = window.sessionStorage;
          sStorage.setItem('versionId', this.versionId);
          sStorage.setItem('isReferenced', this.isReferenced);
          sStorage.setItem('versionNum', response.data.data.historyVersion);
          this.versionNum = response.data.data.historyVersion;
          this.isUpgradeDialogShow = false;
          this.getRuleList();
          this.delRel(this.operatedRuleSet.id, JSON.parse(this.delRule.ruleJson), this.versionNum);
          // debugger
          // this.getRuleList();
        } else {
          this.uv = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = response.data.msg;
          this.snackbarServeColor = 'error';
        }
      })
        .catch(() => {});
    },
    // 添加风险阈值
    addRiskThreshold (index) {
      // let length = this.operatedRuleSet.riskThreshold.length;
      // let nextFrom = '';
      // if (
      //   this.operatedRuleSet.riskThreshold[index].to
      // ) {
      //   nextFrom = this.operatedRuleSet.riskThreshold[index].to / 1 + 1;
      // }

      this.operatedRuleSet.riskThreshold.splice(index + 1, 0, {
        from: '',
        to: '',
        strategy: ''
      });
    },
    // 删除风险阈值
    delRiskThreshold (index) {
      if (this.operatedRuleSet.riskThreshold.length <= 1) {
        return;
      }
      this.operatedRuleSet.riskThreshold.splice(index, 1);
    },
    // 删除引用记录
    // 修改规则的保存/删除规则
    // 删除规则集/规则被引用之后的修改
    async delRel (ruleSetId, oldRuleJson, ruleSetVersion) {
      let delRelList = [];
      if (oldRuleJson.conditionList && oldRuleJson.conditionList.length) {
        oldRuleJson.conditionList.forEach(conditionEle => {
          if (conditionEle.settingType === 1) {
            if (conditionEle.conditionItems && conditionEle.conditionItems.length) {
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
          }
        });
      }

      let param = {
        jsonStr: JSON.stringify(delRelList)
      };
      dataService.delRecWithCond(param);
      // try {
      //   const response = await dataService.delRecWithCond(param);
      //   if (response.data.code === 200) {
      //   }
      // } catch (error) {}
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
    async GetVariableField () {
      const params = {
        isContainEnum: '1'
      };
      try {
        const response = await dataService.GetVariableField(params);
        if (response.data.code === 200) {
          this.variableFields = response.data.data;
          this.isVariableFieldReady = true;
        }
      } catch (error) {}
    }
  },
  mounted () {
    window.addEventListener('scroll', this.fixedBtnBox);
    let sStorage = window.sessionStorage;
    let item = JSON.parse(sStorage.getItem('ruleSet'));
    this.versionId = sStorage.getItem('versionId');
    this.versionNum = sStorage.getItem('versionNum');
    this.isNeedAudit = sStorage.getItem('needAudit'); // 判断是否需要审核
    this.ruleSetPattern = sStorage.getItem('ruleSetPattern');// 规则集模式
    this.ruleSetStatus = sStorage.getItem('ruleSetStatus'); // 规则集状态
    this.operateRule = item;
    this.operateRules(item);
    this.GetOperator();
    this.GetVariableField();
    this.getApplicationList();
  },
  created () {
    this.operatedRuleSet.riskThreshold = [];
    this.getApplicationList();
    this.getOrganizationList();
    this.getAllTradeTypeList();
    this.getRiskyLabelsList();
    this.getStrategiesList();
  }
};
</script>
<style lang="stylus" scoped>
.fixed {
  position: fixed;
  width: auto;
  top: 0;
  left: 240px;
  right: 12px;
  z-index: 9;
  border-bottom: 1px solid #ededed;
}
.itemValue {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  color:rgba(0, 0, 0, 0.38)
}

.batchRow{float:left;width: 50%;height:90px;}
.batchRow:nth-child(odd) .row {padding-left:0;padding-right:0;margin-left:10px;}
.padLfnone{padding-left:0!important}
.paddRnone{padding-right:0!important}
</style>
