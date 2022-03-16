<!-- author: 古雪瑞-->
<!-- updateTime: 2020-05-12-->
<!--案件管理中心 指派or转派 公共页面-->
<template>
  <div>
    <v-data-table :headers="pageParams.dataHeaders" :items="pageParams.dataItems" hide-default-footer class="elevation-3">
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar flat height="60px">
          <v-toolbar-title style="font-size:18px">
            已选任务列表
          </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
      </template>
      <template
          v-slot:item.opType="{ item }"
        >
          <span :title="item.opType | ifdsOpType(ifdsOptypeList) | ellipsis()">{{ item.opType | ifdsOpType(ifdsOptypeList) | ellipsis() }}</span>
        </template>
      <template
        v-slot:item.appId="{ item }"
      >
        <span :title="item.appId | textFilters(allAppList) | ellipsis()">{{ item.appId | textFilters(allAppList) | ellipsis() }}</span>
      </template>
        <template
          v-slot:item.strategy="{ item }"
        >
          <span :title="item.strategy | textFilters(allStrategyList) | ellipsis()">{{ item.strategy | textFilters(allStrategyList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.createTime="{ item }"
        >
          <span :title="item.createTime">{{ item.createTime }}</span>
        </template>
        <template
          v-slot:item.src="{ item }"
        >
          <span :title="item.src | textFilters(allTaskResourceList) | ellipsis()">{{ item.src | textFilters(allTaskResourceList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.assignStyle="{ item }"
        >
          <span :title="item.assignStyle | textFilters(allAssignTypeList) | ellipsis()">{{ item.assignStyle | textFilters(allAssignTypeList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.spLevel="{ item }"
        >
          <span :title="item.spLevel | textFilters(allReviewFlowList) | ellipsis()">{{ item.spLevel | textFilters(allReviewFlowList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.result="{ item }"
        >
          <span :title="item.result | textFilters(allReviewResList) | ellipsis()">{{ item.result | textFilters(allReviewResList) | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.bankCard="{ item }"
        >
          <span :title="item.bankCard">{{ item.bankCard | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.inAccount="{ item }"
        >
          <span :title="item.inAccount">{{ item.inAccount | ellipsis() }}</span>
        </template>
        <template
          v-slot:item.executeId="{ item }"
        >
          <span :title="item.executeId">{{ item.executeId | ellipsis() }}</span>
        </template>
      <template v-slot:no-data>
        <div>没有数据</div>
      </template>
    </v-data-table>
    <v-card class="elevation-3">
      <v-card-title class="pl-4 pr-4 mt-5 mb-5">
        <v-toolbar-title>{{ pageParams.titleInfo.actionTitle }}</v-toolbar-title>
      </v-card-title>
      <div class="pl-10 pr-4 mb-2" v-if="!pageParams.titleInfo.isTransfer">
        <v-form ref="form" v-model="valid" :lazy-validation="lazy">
          <div class="mb-4">
            <span class="review-flow-text-left">
              选择审核流
            </span>
            <span class="review-flow-select-right">
              <v-autocomplete
                required="true"
                :rules= "reviewFlowRules"
                v-model="selectForm.spLevel"
                :items="reviewFlowItems"
                dense
                outlined
                :multiple="false"
                placeholder="请选择审核流"
                no-data-text="没有匹配数据"
                :full-width="true"
                :disabled="secondLevelRouterItems.assignLevel === 1"
                @change="changeReviewFlow(selectForm.spLevel)"
              />
            </span>
          </div>
          <!--  -->
          <div class="mb-4" v-if="secondLevelRouterItems.assignLevel === 0">
            <span class="review-flow-text-left">
              选择第一级审核员
            </span>
            <span class="review-flow-select-right">
              <v-autocomplete
                v-model="selectForm.firstAudit"
                :items="firstLevelItems"
                placeholder="请选择第一级审核员"
                required
                :rules= "firstAuditRules"
                outlined
                dense
                :multiple="false"
                no-data-text="没有匹配数据"
                :full-width="true"
              />
            </span>
          </div>
          <!-- selectSecondLevel -->
          <div class="mb-4" v-if="secondLevelRouterItems.assignLevel === 1">
            <span class="review-flow-text-left">
              选择第二级审核员
            </span>
            <span class="review-flow-select-right">
              <v-autocomplete
                required
                :rules= "secondAuditRules"
                v-model="selectForm.secondAudit"
                :items="secondLevelItems"
                dense
                outlined
                :multiple="false"
                placeholder="请选择第二级审核员"
                no-data-text="没有匹配数据"
                :full-width="true"
              />
            </span>
          </div>
        </v-form>
      </div>
      <div class="pl-10 pr-4 mb-2" v-else>
        <v-form ref="form1" v-model="valid" :lazy-validation="lazy">
          <div class="mb-4">
            <span class="review-flow-text-left">
              选择转派人员
            </span>
            <span class="review-flow-select-right">
              <v-autocomplete
                required
                :rules= "transferRules"
                v-model="selectForm.transferUser"
                :items="transferPersonItems"
                dense
                outlined
                chips
                :multiple="false"
                placeholder="请选择转派人员"
                no-data-text="没有匹配数据"
                :full-width="true"
              />
            </span>
          </div>
        </v-form>
      </div>
      <v-card-actions class="pt-4 pb-4">
        <v-btn color="primary" class="mr-2" style="margin-left: 180px;" @click="submit" :disabled="!valid">完成</v-btn>
        <v-btn class="pl-0" @click="cancel">取消</v-btn>
      </v-card-actions>
    </v-card>
    <!-- 公共弹框提示 -->
      <v-snackbar
        v-model="snackbarServe"
        :color="snackbarServeColor"
        :timeout="timeout"
        :top="isSnackbarTop"
        @input="cancel"
      >
        {{ snackbarServeMsg }}
      </v-snackbar>
  </div>
</template>
<script>
import * as dataService from 'api/caseManagementCenter/pendingTask';
import { NO_SELECT_VALUE, NO_TRANSFER_VALUE } from 'utils/validate';
import { mapGetters } from 'vuex';
export default {
  name: 'caseReviewDesignate',
  data: () => ({
    valid: true,
    lazy: false,
    pageParams: {
      titleInfo: {
        actionTitle: '',
        isTransfer: ''
      },
      dataHeaders: [],
      dataItems: []
    },
    reviewFlowItems: [
      { text: '一级审核流', value: 1 },
      { text: '二级审核流', value: 2 }
    ],
    firstLevelItems: [],
    secondLevelItems: [],
    transferPersonItems: [],
    selectForm: {},
    selectSecondLevel: false,
    reviewFlowRules: [v => !!v || NO_SELECT_VALUE('审核流')],
    transferRules: [v => !!v || NO_SELECT_VALUE('转派人员'), v => !(NO_TRANSFER_VALUE.test(v)) || NO_SELECT_VALUE('转派人员')],
    firstAuditRules: [v => !!v || NO_SELECT_VALUE('一级审核员')],
    secondAuditRules: [v => !!v || NO_SELECT_VALUE('二级审核员')],
    token: '',
    loginUserId: '',
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    // 用于表格中过滤中文
    allTradeTypeList: [],
    allStrategyList: [],
    allTaskResourceList: [],
    allReviewResList: [],
    allAssignTypeList: [],
    allReviewFlowList: [
      { text: '一级审核流', value: '1' },
      { text: '二级审核流', value: '2' }
    ],
    allAppList: [],
    ifdsOptypeList: [] // 风控平台，交易类型
  }),
  computed: {
    ...mapGetters([
      'appId',
      'secondLevelRouterItems',
      'appList'
    ]),
    getAppList () { // 传入列表的appid集合
      let res = [];
      for (let i = this.pageParams.dataItems.length - 1; i >= 0; i--) {
        res.push(this.pageParams.dataItems[i].appid);
      }
      return res.join(',');
    }
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        Promise.all([
          this.initData(),
          this.getTradeTypeList(),
          this.getCaseStrategyList(),
          this.getTaskResourceList(),
          this.getReviewResultList(),
          this.getassignTypetList(),
          this.queryFirstLevelUserInfo(),
          this.getAppListData(),
          this.queryIfdsOptypeList()
        ]);
      },
      immediate: true
    }
  },
  filters: {
    textFilters: function (str, itemList) {
      let text = '';
      itemList.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.value === str) {
          text = item.text;
        }
      });
      return text;
    },
    ifdsOpType: function (str, objList) { // 风控平台--交易类型
      return objList[str];
    }
  },
  mounted () {
    if (this.secondLevelRouterItems.assignLevel === 0) {
      this.selectForm.spLevel = 1;
    } else if (this.secondLevelRouterItems.assignLevel === 1) {
      this.selectForm.spLevel = 2;
    }
    Promise.all([
      this.initData(),
      this.getTradeTypeList(),
      this.getCaseStrategyList(),
      this.getTaskResourceList(),
      this.getReviewResultList(),
      this.getassignTypetList(),
      this.queryFirstLevelUserInfo(),
      this.getAppListData(),
      this.queryIfdsOptypeList()
    ]);
  },
  methods: {
    initData () {
      // 获取token
      if (localStorage.getItem('loginData')) {
        let loginData = JSON.parse(localStorage.getItem('loginData'));
        this.token = loginData.token;
        this.loginUserId = loginData.userId;
      }
      // 获取传入的参数
      if (this.secondLevelRouterItems) {
        this.pageParams = Object.assign({}, this.secondLevelRouterItems);
        if (this.pageParams.titleInfo.isTransfer) {
          // 转派时获取同级转派人员信息
          this.querySameLevelTransferInfo();
        }
      }
    },
    // 获取交易类型
    async getTradeTypeList () {
      if (this.appId) {
        let param = {
          appId: this.appId,
          isAmount: this.secondLevelRouterItems.isAmount
        };
        const response = await dataService.queryTradeType(param);
        if (response.data.code === 200) {
          let resTradeTypeItems = response.data.data.tradeList;
          resTradeTypeItems.forEach((item, index, ary) => {
            this.allTradeTypeList.push({
              text: item.tradeName,
              value: item.identifier
            });
          });
        }
      }
    },
    // 风控平台-交易类型
    async queryIfdsOptypeList () {
      this.ifdsOptypeList = [];
      const response = await dataService.queryIfdsOptypeList();
      if (response.data.code === 200) {
        this.ifdsOptypeList = response.data.data.optypeMap || {};
      }
    },
    // 获取建议策略数据
    async getCaseStrategyList () {
      let param = {
        identifier: 'sys_strategy'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.allStrategyList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取任务来源数据
    async getTaskResourceList () {
      let param = {
        identifier: 'case_src'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.allTaskResourceList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取审核结果数据
    async getReviewResultList () {
      let param = {
        identifier: 'case_result'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.allReviewResList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取指派方式数据
    async getassignTypetList () {
      let param = {
        identifier: 'case_assign'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.allAssignTypeList.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取审核员信息
    async queryFirstLevelUserInfo () {
      try {
        let businessOrgCodeArr = [];
        this.secondLevelRouterItems.dataItems.forEach((item) => {
          businessOrgCodeArr.push(item.businessOrgCode);
        });
        let params = {
          appinfoList: this.appId,
          role: 'second',
          businessOrgCode: businessOrgCodeArr.join()
        };
        const res = await dataService.queryFirstReviewerInfo(params);
        let userFirstData = res.data.data.userFirst;
        let userSecondData = res.data.data.userSecond;
        if (userFirstData.length) { // 一级审核员信息
          for (let i = userFirstData.length - 1; i >= 0; i--) {
            this.firstLevelItems.push({
              text: userFirstData[i].name,
              value: userFirstData[i].id
            });
          }
        }
        if (userSecondData.length) { // 二级审核员信息
          for (let i = userSecondData.length - 1; i >= 0; i--) {
            this.secondLevelItems.push({
              text: userSecondData[i].name,
              value: userSecondData[i].id
            });
          }
        }
      } catch (err) {}
    },
    // 获取转派人员信息
    async querySameLevelTransferInfo () {
      try {
        let params = {
          appIds: this.appId,
          userId: this.loginUserId,
          roleType: this.pageParams.roleType
        };
        const res = await dataService.querySameLevelTransferInfo(params);
        let resData = res.data.data.user;
        if (resData.length > 0) {
          for (let i = resData.length - 1; i >= 0; i--) {
            this.transferPersonItems.push({
              text: resData[i].name,
              value: resData[i].id
            });
          }
        }
      } catch (err) {}
    },
    // 处理所属应用下拉数据
    async getAppListData () {
      if (this.appList.length > 0) {
        const currAppList = await this.appList;
        currAppList.forEach((item, index, ary) => {
          this.allAppList.push(
            { text: item.appName, value: item.id, tag: item.appTag }
          );
        });
      }
    },
    cancel () {
      // 传递给上级页面路由参数，用来判断回到动账类下或非动账类下
      this.$router.push({
        path: '/pendingTask',
        name: 'pendingTask',
        params: {
          accountType: this.secondLevelRouterItems.isAmount
        }
      });
    },
    // 点击完成
    async submit () {
      let idList = [];
      let assignLevel = [];
      let states = [];
      for (let i = this.pageParams.dataItems.length - 1; i >= 0; i--) {
        idList.push(this.pageParams.dataItems[i].id);
        assignLevel.push(this.pageParams.dataItems[i].assignLevel);
        states.push(this.pageParams.dataItems[i].state);
      }
      // 任务指派时
      if (!this.pageParams.titleInfo.isTransfer) {
        let params = Object.assign({}, {
          ids: idList.join(','),
          spLevel: this.selectForm.spLevel,
          firstAudit: this.selectForm.firstAudit,
          secondAudit: this.selectForm.secondAudit,
          token: this.token,
          assignLevel: assignLevel[0],
          states: states[0]
        });
        const res = await dataService.assignSubmit(params);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
        }
      } else {
        // 转派时
        let params = Object.assign({}, {
          ids: idList.join(','),
          transferUser: this.selectForm.transferUser,
          token: this.token,
          states: states.join(',')
        });
        const res = await dataService.transferSubmit(params);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
        }
      }
    },
    // 切换选择审核流类型
    changeReviewFlow (value) {
      // 选择二级审核流时，展示第二级审核员选项
      if (value === 2) {
        this.selectSecondLevel = true;
      } else {
        this.selectSecondLevel = false;
      }
      this.queryFirstLevelUserInfo();
    }
  }
};
</script>
<style lang="stylus" scoped>
  .review-flow-text-left {
    display: inline-block;
    width: 14%;
    min-width: 112px;
    height: 40px;
    line-height: 40px;
    vertical-align: top;
    color: #000;
    font-weight: bold;
    text-align: right;
    padding-right: 20px;
  }
  .review-flow-select-right {
    display: inline-block;
    width: 30%;
    min-width: 140px;
    height: 40px;
    line-height: 40px;
  }
</style>
