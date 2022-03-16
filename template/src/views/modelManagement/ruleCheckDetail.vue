<template>
  <div class="rulelist-content">
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3',isFixed?'fixed':'']">
       <v-card-actions style="height:60px">
          <v-btn  color="primary" class="ml-4" v-show="this.tabValue===0"  @click="toExamine()">{{examineTxt}}</v-btn>
          <v-btn  class="ml-4 cancelButton" @click="cancelRuleList" outlined >{{examineCalTxt}}</v-btn>
       </v-card-actions>
      </v-card>
    </div>

    <!---审核信息-->
      <v-card style="margin-bottom: 12px" v-if="isExamine">
          <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                     <h3 style="margin-bottom:20px">审核信息</h3>
                     <div class="ruleSetParam">
                      <v-row>
                        <v-col cols="12" class="text-left">
                           <v-radio-group
                            v-model="examinStates"
                            row
                          >
                          <template v-slot:label  class="col col-3">
                               <div>审核结果*</div>
                           </template>
                            <v-radio
                              label="通过"
                              value="1"
                            ></v-radio>
                            <v-radio
                              label="驳回"
                              value="2"
                            ></v-radio>
                         </v-radio-group>
                        </v-col>
                      </v-row>
                      <v-row>
                        <div style="color:#00000099;display:inline-block;padding-left: 12px;
    margin-right: 10px;
}">审核意见*</div>
                        <v-col cols="6" style="padding-left:0">
                          <v-textarea
                          style="height:auto"
                          v-model="examinOpinion"
                             outlined
                            name="input-7-4"
                            rows="3"
                            counter="500"
                            :rules=" [
                              v => (v && !!v) || '审核意见不能为空',
                              v => (v && v.length <= 500) || '最多只能输入500个字符',
                            ]"
                            value=""
                        ></v-textarea>
                        </v-col>
                    </v-row>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
          </v-card-text>
     </v-card><!--提交信息end-->
     <!--已审核 状态下 审核信息--->
     <v-card style="margin-bottom: 12px" v-show="this.tabValue!=0">
          <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                     <h3 style="margin-bottom:20px">审核信息</h3>
                     <div class="ruleSetParam">
                      <v-row>
                        <v-col cols="3" class="text-left">
                          <p>审核人：{{ ruleCheckInfo.auditorsName}}</p>
                        </v-col>
                        <v-col cols="3" class="text-left">
                          <p>审核时间：{{ ruleCheckInfo.endTime}}</p>
                        </v-col>
                      </v-row>
                      <!--审核结果-->
                      <v-row>
                          <v-col cols="12" class="text-left longText">
                            <p>审核结果： {{ ruleCheckInfo.status | rulesetStatus(rulesetStatus) | ellipsis(8) }}</p>
                          </v-col>
                      </v-row>
                      <!--审核意见：-->
                      <v-row>
                        <v-col cols="12" class="text-left longText">
                            <p>审核意见：{{ ruleCheckInfo.opinion}}</p>
                        </v-col>
                      </v-row>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
          </v-card-text>
     </v-card>
     <!--提交信息-->
      <v-card style="margin-bottom: 12px">
          <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                     <h3 style="margin-bottom:20px">提交信息</h3>
                     <div class="ruleSetParam">
                      <v-row>
                        <v-col cols="3" class="text-left">
                          <p>提交人：{{ ruleCheckInfo.creatorName }}</p>
                        </v-col>
                        <v-col cols="3" class="text-left">
                          <p>提交时间：{{ ruleCheckInfo.createTime}}</p>
                        </v-col>
                      </v-row>
                      <!--版本变更原因：--->
                      <v-row>
                        <v-col cols="12" class="text-left longText">
                              <p>版本变更原因：{{ ruleCheckInfo.reason}}</p>
                        </v-col>
                      </v-row>
                      <!--版本变更内容描述：--->
                      <v-row>
                        <v-col cols="12" class="text-left longText">
                            <p>版本变更内容描述：{{ ruleCheckInfo.description}}</p>
                        </v-col>
                      </v-row>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
          </v-card-text>
      </v-card><!--提交信息end-->
      <v-card>
          <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                      <h3 style="margin-bottom:20px">规则集基本信息</h3>
                    <div class="ruleSetParam ruleBaseInfo">
                      <v-row>
                        <v-col cols="3" class="text-left">
                          <p>规则集名称：{{ operatedRuleSet.setName }}</p>
                        </v-col>
                        <v-col cols="3" class="text-left">
                          <p>所属公司：{{ operatedRuleSet.organizationId | rulesetOrganization(organizationList)}}</p>
                        </v-col>
                        <v-col cols="3" class="text-left">
                          <p>所属应用：{{ operatedRuleSet.appId | rulesetApplication(applications)}}</p>
                        </v-col>
                        <v-col cols="3" class="text-left">
                          <p>交易类型： {{operatedRuleSet.transactionTypeId | rulesetTradeTypes(tradeTypes) }}</p>
                        </v-col>
                      </v-row>
                    </div>
                    <div class="ruleSetParam">
                      <v-row>
                        <v-col cols="3" class="text-left">
                          <p>规则匹配模式： {{ operatedRuleSet.matchingModel | filtersShowRuleMatchingModel(ruleMatchingModels)}}</p>
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
              <v-list v-if="operatedRuleSet.matchingModel==='SCORE_MATCH'" class="clear">
                  <h3 style="padding-left:16px;margin-bottom:20px">设置风险阈值</h3>
                  <div
                  v-for="(item,index) in operatedRuleSet.riskThreshold"
                  :key="'riskThresholdOperated'+index"
                  style="padding-left:16px;margin-bottom:24px;height:52px"
                >
                  <v-text-field
                    v-model="item.from"
                    style="width:100px; float:left"
                    outlined
                    readonly
                    :rules="[v => !!v || '不能为空或只有空格']"
                    dense
                  />
                  <v-icon style="float:left;height:40px">mdi-minus</v-icon>
                  <v-text-field
                    v-model="item.to"
                    style="width:100px;float:left "
                    outlined
                    readonly
                    :rules="[v => !!v || '不能为空或只有空格']"
                    dense
                  />
                  <v-select
                    v-model="item.strategy"
                    style="width:150px;float:left;margin-left:10px "
                    :rules="[v => !!v || '不能为空或只有空格']"
                    outlined
                    dense
                    disabled
                    :items="strategies"
                    item-text="paramName"
                    item-value="id"
                    no-data-text="没有数据"
                  />
                  <!-- <v-icon
                    color="primary"
                    style="height:40px;float:left;margin-left:10px"
                    @click="addRiskThreshold(index)"
                  >mdi-plus-circle</v-icon>
                  <v-icon
                    size="30"
                    color="primary"
                    style="height:40px;float:left;margin-left:10px"
                    @click="delRiskThreshold(index)"
                  >mdi-delete</v-icon> -->
                </div>
              </v-list>
              <!-- 规则列表 -->
              <v-list>
                <h3 style="padding-left:16px">规则列表</h3>
                <!-- <v-list-item>
                  <v-list-item-content> -->
                    <v-data-table
                      :headers="operatedRulesHeader"
                      :items="operatedRules"
                      hide-default-footer
                      :disable-pagination='pagination'
                      :items-per-page='rulePageSize'
                      :loading="loading"
                      loading-text="加载数据中..."
                      no-results-text="没有匹配的数据"
                      :search="search"
                      style="min-height: 500px;"
                    >
                      <template v-slot:item.states="{ item }">
                        <v-btn-toggle
                          class="ruleStatus"
                          color="primary"
                          v-model="item.states"
                        >
                          <v-btn value="OFF" disabled style="height:26px">停用</v-btn>
                          <v-btn value="SIMULATION"  disabled style="height:26px">模拟</v-btn>
                          <v-btn value="OFFICIAL" disabled style="height:26px">启用</v-btn>
                        </v-btn-toggle>
                      </template>
                      <template v-slot:item.ruleNo="{ item }">{{ item.ruleNo }}</template>
                      <template v-slot:item.ruleName="{ item }">{{ item.ruleName }}</template>
                      <template v-slot:item.info="{ item }">{{ item.comment }}</template>
                      <template
                        v-if="operatedRuleSet.matchingModel!=='SCORE_MATCH'"
                        v-slot:item.suggestedStrategies="{ item }"
                      >{{ item.strategy|filtersStrategies(strategies) }}</template>
                      <template
                        v-slot:item.labelId="{ item }"
                      >{{ item.labelId|filtersRiskyLabel(riskyLabels) }}</template>
                      <template v-slot:item.action="{ item }">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              small
                              class="mr-1"
                              color="primary"
                              v-on="on"
                              @click="editRule(item)"
                            >mdi-pencil</v-icon>
                          </template>
                          <span>编辑</span>
                        </v-tooltip>
                      </template>
                      <template v-slot:no-data>
                        <div>没有数据</div>
                      </template>
                    </v-data-table>
                  <!-- </v-list-item-content>
                </v-list-item> -->
              </v-list>
          </v-card-text>
      </v-card>
    <!-- 确定删除的弹窗 -->
    <!-- <del-dialog
      :isDialogShow="isDialogDelShow"
      @cancelDel="isDialogDelShow = false;"
      @confimDel="confirmDelFun"
    ></del-dialog> -->
     <!-- 调接口结果的提示框 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >{{ snackbarServeMsg }}</v-snackbar>
    <!-- 点击删除规则按钮 确定升版的弹窗 -->
     <!-- <v-row justify="center">
    <v-dialog
      v-model="isUpgradeDialogShow"
      persistent
      width="350"
    >
      <v-card class="del-dialog">
        <v-card-text style="padding-top:50px">
         该版本规则集已被引用，不能删除，可升级版本并自动删除
        </v-card-text>
        <v-card-actions style="margin-right:12px;margin-top:10px;">
          <div class="flex-grow-1" />
          <v-btn
            text
            class="del-dialog-btn"
            @click="cancelUpGradeFromDel()"
          >
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
  </v-row> -->
  </div>
</template>
<script>
import * as dataService from 'api/ruleSet';
// import delDialog from '@c/DelDialog';
import { stringify } from 'querystring';

export default {
  name: 'ruleSet',
  components: {
    // delDialog
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

    // 规则集状态
    rulesetStatus: function (dataStr, rulesetStatusList) {
      var rulesetStatus = '';
      rulesetStatusList.forEach(element => {
        if (dataStr === element.value) {
          rulesetStatus = element.text;
        }
      });
      return rulesetStatus;
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
      column: null,
      examinStates: '', // 审核结果
      examinOpinion: '', // 审核意见
      search: '', // 规则搜索框
      isFixed: false,
      isExamine: false, // 是否展示审核模块
      examineTxt: '审核',
      examineCalTxt: '返回',
      // 表格加载数据动画
      loading: true,
      // 删除弹窗
      isDialogDelShow: false,
      // 新增编辑规则弹窗的title
      addOrEditRuleTitle: '新增规则',
      // 区分是否是新增规则
      isAddRule: true,
      // 是否可以删除和编辑的标识
      editAndDelFlag: true,
      confirmDelFun: '',
      ruleCheckInfo: {},
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
      // 交易类型
      tradeTypes: [],
      // 规则匹配模式
      ruleMatchingModels: [
        { text: '最坏匹配', value: 'WORST_MATCH' },
        { text: '首次匹配', value: 'FIRST_MATCH' },
        { text: '评分模式', value: 'SCORE_MATCH' }
      ],
      // 规则集状态
      // 1.通过、2.驳回、3.待审核
      rulesetStatus: [
        { value: 1, text: '通过' },
        { value: 2, text: '驳回' },
        { value: 3, text: '待审核' }
      ],
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
      // 保存按钮点击后是否已经有数据返回
      isSaveSuccess: true,

      clickNum: 0,
      tabValue: '' // 当前tab
    };
  },
  computed: {},
  watch: {},
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
    // 获取计算符
    async GetOperator () {
      try {
        const response = await dataService.GetOperator();
        if (response.data.code === 200) {
          this.operator = response.data.data.list;
        }
      } catch (error) {
      }
    },
    // 获取枚举下拉数据  机构
    async getOrganizationList () {
      const params = {
        enumerateId: 'ORGANIZATION'
      };
      try {
        const response = await dataService.getSubordinateFirm();
        this.organizations = response.data.data.companyItems;
        this.treeToList(this.organizations);
        this.addAndEditFormData[1].options = JSON.parse(JSON.stringify(this.organizations));
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
        this.searchParam[2].options = [
          {
            text: '全部应用',
            value: 'all'
          }
        ];
        this.applications.forEach(element => {
          this.appIDList.push(element.id);
          this.addAndEditFormData[2].options.push({
            selectText: element.appName,
            selectField: element.id
          });
          this.searchParam[2].options.push({
            text: element.appName,
            value: element.id
          });
        });
        this.getTradeTypeList(this.appIDList, 1);
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
    // 初始化加载规则列表和规则集基本信息
    async operateRules (item) {
      // 获取是否被引用
      // console.log(item, 'ssssssssssssssss');
      const paramForIsReferenced = {
        sourceId: item.id,
        sourceType: 'RULE_SET',
        sourceVersion: this.versionNum
      };
      try {
        const response = await dataService.checkIsrefrecord(paramForIsReferenced);
        const code = response.data.code;
        if (code === 200) {
          this.isReferenced = response.data.data.isReference;
        }
      } catch (error) {
      }

      // 如果是被引用状态并且是评分模式 保存旧的阈值
      // let index = item.rulesetHistoryList.length - 1;
      // if (item.matchingModel === 'SCORE_MATCH') {
      //   this.oldRiskThreshold = item.rulesetHistoryList[index].riskThreshold;
      //   if (!this.oldRiskThreshold) {
      //     this.oldRiskThreshold = [
      //       { from: '0', to: '20', strategy: '' }
      //     ];
      //   }
      // }
      const param = {
        id: this.versionId
      };

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
        id: this.versionId,
        flag: 1
      };
      try {
        const response = await dataService.getVersionInfo(param);
        const code = response.data.code;
        if (code === 200) {
          // 拿到当前用户所选版本号的规则列表
          this.operatedRules = response.data.data.ruleList;
          this.oldOperatedRules = JSON.parse(JSON.stringify(response.data.data.ruleList));
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
        }
      } catch (error) {}
    },
    // 审核to examine
    async  toExamine () {
      this.clickNum++; // 记录是第二次点
      let sStorage = window.sessionStorage;
      let StorageItem = JSON.parse(sStorage.getItem('ruleSetVerifyInfo'));
      let examineId = StorageItem.id;
      let setId = StorageItem.setId;
      let version = StorageItem.version;
      // console.log(StorageItem, 'StorageItem');
      let params = {};
      // completedAudit
      this.isExamine = true;
      this.examineTxt = '提交';

      if (this.clickNum > 1) {
        // console.log(this.clickNum, '点击次数');
        if (this.examinStates === '') {
          this.snackbarServe = true;
          this.snackbarServeMsg = '审核结果参数不能为空';
          this.snackbarServeColor = 'error';
          return;
        }
        if (this.examinOpinion === '') {
          this.snackbarServe = true;
          this.snackbarServeMsg = '审核意见不能为空';
          this.snackbarServeColor = 'error';
          return;
        }
        if (this.examinOpinion.length > 500) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '审核意见字数超出限制';
          this.snackbarServeColor = 'error';
        } else {
          this.clickNum = 0; // 重置点击次数
          params.id = examineId;
          params.setId = setId;
          params.version = parseInt(version);
          params.status = this.examinStates;
          params.opinion = this.examinOpinion;
          const response = await dataService.completedAudit(params);
          this.$router.push('/ruleSetVerify');
          console.log(response.data, '审核');
        }
      }

      // 点击审核结果
      // if (this.states) {
      //   this.$router.push('/ruleSetSubmit');
      // }

      // this.examineCalTxt ="取消"
    },

    // 规则列表保存按钮
    // async saveRuleList () {
    //   if (!this.isSaveSuccess) {
    //     return;
    //   }
    //   this.isSaveSuccess = false;
    //   // 评分模式下验证风险阈值不能有值为空的情况
    //   if (this.operatedRuleSet.matchingModel === 'SCORE_MATCH') {
    //     let isEmpty = false;
    //     for (
    //       let index = 0;
    //       index < this.operatedRuleSet.riskThreshold.length;
    //       index++
    //     ) {
    //       const element = this.operatedRuleSet.riskThreshold[index];
    //       if (!element.from || !element.to || !element.strategy) {
    //         isEmpty = true;
    //         break;
    //       }
    //     }
    //     if (isEmpty) {
    //       this.snackbarServe = true;
    //       this.snackbarServeMsg = '风险阈值参数不能为空';
    //       this.snackbarServeColor = 'error';
    //       return;
    //     }
    //   }
    //   // 没有被引用点击保存按钮调修改接口
    //   if (!this.isReferenced) {
    //     let ruleList = [];
    //     this.operatedRules.forEach(element => {
    //       ruleList.push({
    //         id: element.id,
    //         states: element.states
    //       });
    //     });
    //     let param = {
    //       id: this.operatedRuleSet.id,
    //       setNo: this.operatedRuleSet.setNo,
    //       setName: this.operatedRuleSet.setName,
    //       organizationId: this.operatedRuleSet.organizationId,
    //       appId: this.operatedRuleSet.appId,
    //       transactionTypeId: this.operatedRuleSet.transactionTypeId,
    //       matchingModel: this.operatedRuleSet.matchingModel,
    //       riskThreshold: this.operatedRuleSet.matchingModel === 'SCORE_MATCH' ? JSON.stringify(this.operatedRuleSet.riskThreshold) : '',
    //       version: parseInt(this.versionNum / 1),
    //       ruleList: JSON.stringify(ruleList)
    //     };
    //     const response = await dataService.modifyRuleSet(param);
    //     const code = response.data.code;
    //     if (code > 0) {
    //       this.$router.push('/ruleSetVerify');
    //     } else {
    //       this.snackbarServe = true;
    //       this.snackbarServeMsg = response.data.msg;
    //       this.snackbarServeColor = 'red';
    //     }
    //   } else {
    //     let isChange = false;
    //     // 判断阈值是否有变化
    //     if (this.operatedRuleSet.matchingModel === 'SCORE_MATCH') {
    //       // 阈值长度有变化
    //       if (typeof (this.oldRiskThreshold) === 'string') {
    //         this.oldRiskThreshold = JSON.parse(this.oldRiskThreshold);
    //       }
    //       if (this.oldRiskThreshold.length !== this.operatedRuleSet.riskThreshold.length) {
    //         isChange = true;
    //       }
    //       // 阈值长度没有变化 比较具体的值
    //       if (!isChange) {
    //         for (let index = 0; index < this.operatedRuleSet.riskThreshold.length; index++) {
    //           const element = this.operatedRuleSet.riskThreshold[index];
    //           const oldElement = this.oldRiskThreshold[index];
    //           if (element.from !== oldElement.from || element.to !== oldElement.to || element.strategy !== oldElement.strategy) {
    //             isChange = true;
    //             break;
    //           }
    //           if (isChange) {
    //             break;
    //           }
    //         }
    //       }
    //     }
    //     // 判断规则的状态是否有变化
    //     if (!isChange) {
    //       this.oldOperatedRules.forEach(oldEle => {
    //         this.operatedRules.forEach(newEle => {
    //           if (oldEle.id === newEle.id) {
    //             if (oldEle.states !== newEle.states) {
    //               isChange = true;
    //             }
    //           }
    //         });
    //       });
    //     }
    //     let ruleList = [];
    //     this.operatedRules.forEach(newEle => {
    //       ruleList.push({
    //         id: newEle.id,
    //         states: newEle.states,
    //         isDel: false
    //       });
    //     });
    //     // 阈值或者状态有变化 升版
    //     if (isChange) {
    //       let param = {
    //         id: '',
    //         rulesetHistoryId: this.versionId,
    //         ruleNo: '',
    //         ruleName: '',
    //         labelId: '',
    //         isWeak: '',
    //         strategy: '',
    //         enableTime: '',
    //         invalidTime: '',
    //         priorityLevel: '',
    //         weights: '',
    //         riskThreshold: JSON.stringify(this.operatedRuleSet.riskThreshold),
    //         comment: '',
    //         ruleJson: '',
    //         states: '',
    //         upgrade: true,
    //         setId: this.operatedRuleSet.id,
    //         ruleList: JSON.stringify(ruleList),
    //         isOperator: false
    //       };
    //       dataService
    //         .UpgradeRule(param)
    //         .then(response => {
    //           const code = response.data.code;
    //           if (code > 0) {
    //             this.snackbarServe = true;
    //             this.snackbarServeMsg = '当前版本规则集被引用，已自动升版';
    //             this.snackbarServeColor = 'primary';
    //             this.versionId = response.data.data.rulesetHistoryId;
    //             this.isReferenced = false;
    //             const TIME_COUNT = 3;
    //             if (!this.timer) {
    //               this.count = TIME_COUNT;
    //               this.timer = setInterval(() => {
    //                 if (this.count > 0 && this.count <= TIME_COUNT) {
    //                   this.count--;
    //                 } else {
    //                   clearInterval(this.timer);
    //                   this.timer = null;
    //                   this.$router.push('/ruleSetVerify');
    //                 }
    //               }, 500);
    //             }
    //           } else {
    //             this.snackbarServe = true;
    //             this.isSaveSuccess = true;
    //             this.snackbarServeMsg = response.data.msg;
    //             this.snackbarServeColor = 'error';
    //           }
    //         })
    //         .catch(() => {});
    //     } else {
    //       this.$router.push('/ruleSetVerify');
    //     }
    //   }
    // },
    // 规则列表取消按钮
    cancelRuleList () {
      this.$router.push('/ruleSetVerify');
    },
    // 点击添加规则的按钮
    // async addRule () {
    //   let sStorage = window.sessionStorage;
    //   let operateRule = {
    //     ruleNo: '',
    //     ruleName: '',
    //     versionId: '',
    //     labelId: '',
    //     strategy: '', // 匹配模式
    //     enableTime: '',
    //     invalidTime: '',
    //     priorityLevel: '', // 匹配模式
    //     states: 'OFFICIAL',
    //     descption: '',
    //     weights: '', // 评分模式
    //     ruleJson: {
    //       logicalRelationship: 'and',
    //       // 条件列表
    //       conditionList: []
    //     }
    //   };
    //   sStorage.setItem('operateRule', JSON.stringify(operateRule));
    //   sStorage.setItem('operatedRules', JSON.stringify(this.operatedRules));
    //   sStorage.setItem('isReferenced', this.isReferenced);
    //   sStorage.setItem('versionId', this.versionId);
    //   sStorage.setItem('isAddRule', true);
    //   sStorage.setItem('ruleSet', JSON.stringify(this.operatedRuleSet));
    //   this.$router.push('/ruleDetail');
    // },
    // 点击修改规则的按钮
    async editRule (item) {
      console.log(item, 'item121212');
      let sStorage = window.sessionStorage;
      sStorage.setItem('operateRule', JSON.stringify(item));
      sStorage.setItem('operatedRules', JSON.stringify(this.operatedRules));
      sStorage.setItem('isReferenced', this.isReferenced);
      sStorage.setItem('versionId', this.versionId);
      sStorage.setItem('isAddRule', false);
      sStorage.setItem('ruleSet', JSON.stringify(this.operatedRuleSet));

      this.$router.push('/ruleCheckItemDetail');
    },
    // 点击删除规则的按钮
    // doDelRule (item) {
    //   this.delRule = item;
    //   if (this.isReferenced) {
    //     this.isUpgradeDialogShow = true;
    //   } else {
    //     this.delDialogModal = true;
    //     this.isDialogDelShow = true;
    //     this.confirmDelFun = this.confimDelRule;
    //   }
    // },
    // 确定删除规则
    // confimDelRule () {
    //   const param = { id: this.delRule.id };
    //   dataService
    //     .delRule(param)
    //     .then(response => {
    //       const code = response.data.code;
    //       if (code > 0) {
    //         this.snackbarServe = true;
    //         this.snackbarServeMsg = '删除成功';
    //         this.snackbarServeColor = 'primary';
    //         this.delRel(this.operatedRuleSet.id, JSON.parse(this.delRule.ruleJson), this.versionNum);
    //         this.getRuleList();
    //         this.isDialogDelShow = false;
    //       } else {
    //         this.snackbarServe = true;
    //         this.snackbarServeMsg = response.data.msg;
    //         this.snackbarServeColor = 'error';
    //       }
    //     })
    //     .catch(() => {});
    // },
    // 升版删除规则的取消弹框
    // cancelUpGradeFromDel () {
    //   this.isUpgradeDialogShow = false;
    // },
    // 升版删除规则的确定弹框
    // confimUpGradeFromDel () {
    //   let ruleList = [];
    //   this.operatedRules.forEach(newEle => {
    //     ruleList.push({
    //       id: newEle.id,
    //       states: newEle.states,
    //       isDel: newEle.id === this.delRule.id
    //     });
    //   });

    //   let param = {
    //     id: '',
    //     rulesetHistoryId: this.versionId,
    //     ruleNo: '',
    //     ruleName: '',
    //     labelId: '',
    //     isWeak: '',
    //     strategy: '',
    //     enableTime: '',
    //     invalidTime: '',
    //     priorityLevel: '',
    //     weights: '',
    //     riskThreshold: JSON.stringify(this.operatedRuleSet.riskThreshold),
    //     comment: '',
    //     ruleJson: '',
    //     states: '',
    //     upgrade: true,
    //     setId: this.operatedRuleSet.id,
    //     ruleList: JSON.stringify(ruleList),
    //     isOperator: 'false'
    //   };
    //   dataService
    //     .UpgradeRule(param)
    //     .then(response => {
    //       const code = response.data.code;
    //       if (code > 0) {
    //         this.snackbarServe = true;
    //         this.snackbarServeMsg = '当前版本规则集被引用，已自动升版';
    //         this.snackbarServeColor = 'primary';
    //         this.versionId = response.data.data.rulesetHistoryId;
    //         this.isReferenced = false;
    //         let sStorage = window.sessionStorage;
    //         sStorage.setItem('versionId', this.versionId);
    //         sStorage.setItem('isReferenced', this.isReferenced);
    //         sStorage.setItem('versionNum', response.data.data.historyVersion);
    //         this.isUpgradeDialogShow = false;
    //         this.getRuleList();
    //       } else {
    //         this.snackbarServe = true;
    //         this.snackbarServeMsg = response.data.msg;
    //         this.snackbarServeColor = 'error';
    //       }
    //     })
    //     .catch(() => {});
    // },
    // 添加风险阈值
    // addRiskThreshold (index) {
    //   let length = this.operatedRuleSet.riskThreshold.length;
    //   let nextFrom = '';
    //   if (
    //     this.operatedRuleSet.riskThreshold[index].to
    //   ) {
    //     nextFrom = this.operatedRuleSet.riskThreshold[index].to / 1 + 1;
    //   }

    //   this.operatedRuleSet.riskThreshold.splice(index + 1, 0, {
    //     from: '',
    //     to: '',
    //     strategy: ''
    //   });
    // },
    // 删除风险阈值
    // delRiskThreshold (index) {
    //   if (this.operatedRuleSet.riskThreshold.length <= 1) {
    //     return;
    //   }
    //   this.operatedRuleSet.riskThreshold.splice(index, 1);
    // },
    // 删除引用记录
    // 修改规则的保存/删除规则
    // 删除规则集/规则被引用之后的修改
    // async delRel (ruleSetId, oldRuleJson, ruleSetVersion) {
    //   let delRelList = [];
    //   if (oldRuleJson.conditionList && oldRuleJson.conditionList.length) {
    //     oldRuleJson.conditionList.forEach(conditionEle => {
    //       if (conditionEle.settingType === 1) {
    //         if (conditionEle.conditionItems && conditionEle.conditionItems.length) {
    //           conditionEle.conditionItems.forEach(conditionItemEle => {
    //             let delRelItemOfField = {
    //               sourceId: '',
    //               sourceType: conditionItemEle.fieldSource,
    //               sourceVersion: 0,
    //               targetId: ruleSetId,
    //               targetType: 'RULE_SET',
    //               targetVersion: ruleSetVersion
    //             };
    //             let delRelItemOfOperator = {
    //               sourceId: '',
    //               sourceType: 'COMPARATOR_VAR',
    //               sourceVersion: 0,
    //               targetId: ruleSetId,
    //               targetType: 'RULE_SET',
    //               targetVersion: ruleSetVersion
    //             };
    //             // 业务变量库
    //             if (conditionItemEle.fieldSource === 'BUSINESS_VAR') {
    //               if (this.variableFields && this.variableFields.length) {
    //                 this.variableFields.forEach(element => {
    //                   if (element.fieldValue === conditionItemEle.fieldValue) {
    //                     delRelItemOfField.sourceId = element.id;
    //                   }
    //                 });
    //               }
    //             }
    //             // 计算指标库
    //             if (conditionItemEle.fieldSource === 'CALCULATION_VAR') {
    //               delRelItemOfField.sourceId = conditionItemEle.fieldValue;
    //             }
    //             // 名单库
    //             if (conditionItemEle.fieldSource === 'LIST_LIB') {
    //               delRelItemOfField.sourceId = conditionItemEle.fieldValue;
    //             }
    //             // 运算符
    //             if (this.operator && this.operator.length) {
    //               this.operator.forEach(element => {
    //                 if (element.compValue === conditionItemEle.operatorValue) {
    //                   delRelItemOfOperator.sourceId = element.id;
    //                 }
    //               });
    //             }

    //             // 业务变量库是枚举 枚举常量库
    //             if (conditionItemEle.isFieldEnumeration === '1') {
    //               let delRelItemOfSource = {
    //                 sourceId: '',
    //                 sourceType: 'CALCULATION_VAR ',
    //                 sourceVersion: 0,
    //                 targetId: ruleSetId,
    //                 targetType: 'RULE_SET',
    //                 targetVersion: ruleSetVersion
    //               };
    //               conditionItemEle.resultList.forEach(element => {
    //                 if (element.fieldValue === conditionItemEle.resultValue) {
    //                   delRelItemOfSource.sourceId = element.id;
    //                 }
    //               });
    //               delRelList.push(delRelItemOfSource);
    //             }
    //             delRelList.push(delRelItemOfField);
    //             delRelList.push(delRelItemOfOperator);
    //           });
    //         }
    //       }
    //     });
    //   }

    //   let param = {
    //     jsonStr: JSON.stringify(delRelList)
    //   };
    //   try {
    //     const response = await dataService.delRecWithCond(param);
    //     if (response.data.code === 200) {
    //     }
    //   } catch (error) {}
    // },
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
    }
  },
  mounted () {
    window.addEventListener('scroll', this.fixedBtnBox);
    let sStorage = window.sessionStorage;
    let item = JSON.parse(sStorage.getItem('ruleSetVerifyInfo'));

    this.versionId = item.hisId;
    this.versionNum = sStorage.getItem('versionNum');
    this.operateRules(item);
    this.GetOperator();
  },
  created () {
    let sStorage = window.sessionStorage;
    let StorageItem = JSON.parse(sStorage.getItem('ruleSetVerifyInfo'));
    let sentInfo = JSON.parse(sStorage.getItem(''));
    this.tabValue = Number(sStorage.getItem('tabValue'));
    this.ruleCheckInfo = StorageItem;

    // console.log(this.ruleCheckInfo, '待审核带入数据');
    this.operatedRuleSet.riskThreshold = [];
    this.getApplicationList();
    this.getOrganizationList();
    this.getAllTradeTypeList();
    this.getRiskyLabelsList();
    this.getStrategiesList();
  }
};
</script>
<style  lang='stylus' scoped>
  .fixed {
    position: fixed;
    width: auto;
    top: 0;
    left: 240px;
    right: 12px;
    z-index: 9;
    border-bottom: 1px solid #ededed;
  }
  .v-application p{margin-bottom:0!important}
 .ruleSetParam  .row{min-height:40px !important;line-height: 40px;}
 .ruleSetParam  .row .longText{word-break: break-all;line-height:20px;margin-bottom: 10px;}
 .ruleSetParam  .row .text-left{padding:0 12px !important}

</style>
