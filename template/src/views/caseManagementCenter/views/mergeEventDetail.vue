<template>
  <div>
    <v-card class="mb-3 mt-3 elevation-3">
      <v-card-actions style="height:60px">
        <v-btn  class="ml-4 cancelButton" @click="cancel" outlined>返回</v-btn>
      </v-card-actions>
      <!--任务记录 2 流程图-->
      <v-card class="mb-3 elevation-3">
        <v-card-title class="pb-0" style="font-size: 16px;">
          <div>任务编号: {{ taskDetail.amVerifyWorkorder.eventNo }}</div>
        </v-card-title>
        <!-- 流程图 -->
        <v-card class="elevation-0" :class="[taskDetail.amVerifyWorkorder.spLevel === 1 ? 'spLevel1-height' : 'spLevel2-height']" v-if="colorIdList.length">
          <flow-viewer :level="taskDetail.amVerifyWorkorder.spLevel" :colorIdList="colorIdList"></flow-viewer>
        </v-card>
        <v-card-title class="pt-0 pb-0" style="font-size: 16px;">
          <div>任务记录</div>
        </v-card-title>
        <v-card-text class="risk-info">
          <div v-if="taskDetail.detailList">
            <div class="d-flex flex-wrap align-self-0" v-for="(item, index) in taskDetail.detailList" :key="index">
              <div class="text-center" style="line-height:28px">{{ item.createTime }}</div>
              <div class="ml-6 text-center base_field_text_cu task-record-width">{{ item.userName }}</div>
              <div class="ml-6 text-center base_field_text_cu task-record-width">{{ item.operationName }}</div>
              <div class="ml-6 text-center base_field_text_cu task-record-width" style="width:80px;">{{ item.caseTypeName }}</div>
              <div class="ml-6" v-if="item.operation !== -1">
                <v-btn class="pa-0" text color="primary" @click="checkDetail(item)">查看详情 >></v-btn>
              </div>
            </div>
          </div>
          <div v-else>无</div>
        </v-card-text>
      </v-card>
      <!--交易详情-->
      <basecase-detail v-if='transationInfo !== {}' :outAccountInfo="outAccountInfo" :inAccountInfo="inAccountInfo" :transationInfo="transationInfo" :otherInfo="otherInfo" :hitRule="hitRules" :ifdsOptypeList="secondLevelRouterItems.ifdsOptypeList" :allAppList="allAppList"></basecase-detail>
      <v-divider></v-divider>
      <v-card-title class="pt-4 pb-2">附件资料</v-card-title>
      <v-card-text class="">
        <v-row dense>
          <div>
            <span class="file-icon pl-8">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
              >
                mdi-paperclip
              </v-icon>
            </span>
            <span v-for="(item, index) in fileInfo" :key="item+index">
              <span style="cursor: pointer;margin-right:10px;" @click="downloadFileFun(item)">{{ item.name }}</span>
            </span>
          </div>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-title class="pt-4 pb-2">描述信息</v-card-title>
      <v-card-text class="pl-12 text-color">
        {{descInfo}}
      </v-card-text>
    </v-card>

    <!-- 查看详情弹窗 -->
    <v-row dense>
      <v-dialog
        v-model="detailDialog"
        persistent
        scrollable
        max-width="900px">
        <v-card min-height="300px">
          <v-card-title>
            <v-toolbar-title>{{ detailTitle }}</v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn
              icon
              dark
              @click="detailDialog = false"
            >
              <v-icon color="#CCCCCC">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="base_field_text_cu pt-6" v-if="detailTitle === '一级审核流'">
            初审人: {{ detailData.firstLevel.first }}
          </v-card-text>
          <v-card-text class="base_field_text_cu pt-6" v-if="detailTitle === '二级审核流'">
            <div>初审人: {{ detailData.secondLevel.first }}</div>
            <div> 复审人: {{ detailData.secondLevel.second }}</div>
          </v-card-text>
          <v-card-text class="base_field_text_cu pt-6" v-if="detailTitle === '审核结果' || detailTitle === '复审结果'">
            <div class="pb-2">
              <div class="case_task_left">时间</div>
              <div class="case_task_right">{{ detailData.caseInfo.createTime }}</div>
            </div>
            <div class="pb-2">
              <div class="case_task_left">初审人</div>
              <div class="case_task_right">{{ detailData.caseInfo.auditUser }}</div>
            </div>
            <div class="pb-2">
              <div class="case_task_left">审核结果</div>
              <div class="case_task_right">{{ detailData.caseInfo.result }}</div>
            </div>
            <div class="pb-2" v-if="detailData.caseInfo.caseRiskType">
              <div class="case_task_left">案件风险类别</div>
              <div class="case_task_right">{{ detailData.caseInfo.caseRiskType | textFilters(riskTypeItems) }}</div>
            </div>
            <div class="pb-2">
              <div class="case_task_left">审核描述</div>
              <div class="case_task_right">
                <v-textarea
                  row="3"
                  row-height="25"
                  outlined
                  auto-grow
                  v-model="detailData.caseInfo.description"
                  required
                  solo
                  flat
                />
              </div>
            </div>
            <div class="pb-2" v-if="filePathArr.length">
              <div class="case_task_left">附件资料</div>
              <div class="case_task_right">
                <span v-for="(item, index) in filePathArr" :key="item+index">
                  <span v-if="item.fileKey === 'url1'">门头照: </span>
                  <span v-if="item.fileKey === 'url2'">收银照: </span>
                  <span v-if="item.fileKey === 'url3'">POS签购单(含持卡人签字): </span>
                  <span v-if="item.fileKey === 'url4'">出库单: </span>
                  <span v-if="item.fileKey === 'url5'">其他: </span>
                  <span style="cursor: pointer;margin-right:10px;" @click="downloadFileFun(item)">{{ item.name }}</span><br/>
                </span>
              </div>
            </div>
            <div v-if="detailTitle === '审核结果' || detailTitle === '复审结果'">
              <div class="case_task_left" style="margin-top: 21px;">{{ nameListSetTitle }}</div>
              <div class="case_task_right">
                <v-data-table
                  ref="caseInfoDataTable"
                  :headers="addBlackListHeaders"
                  :items="currentBlackListData"
                  hide-default-footer
                  :elevation="3"
                  class="elevation-0 mt-2"
                >
                  <template v-slot:body="{ items }">
                    <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
                      <td colspan="6">没有数据</td>
                    </tr>
                    <tr
                      v-else
                      v-for="(item, index) in items"
                      :key="index"
                      class="el-tr-defu"
                    >
                      <td class="el-border-defu text-center">
                        <span>{{ item.identifer | identiferFilters() }}</span>
                      </td>
                      <td class="el-border-defu text-center">
                        <span>{{ item.content }}</span>
                      </td>
                      <td class="el-border-defu text-center">
                        <span>{{ item.flag }}</span>
                      </td>
                      <td
                        class="el-border-defu pr-0 text-center"
                      >
                        <span>{{ item.setName }}</span>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </div>
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions class="pt-4pb-4">
            <div class="flex-grow-1"></div>
            <v-btn color="primary" class="mr-4" @click="detailDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-snackbar
      v-model="snackbarError"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop">
      {{ snackbarServeMsg }}
    </v-snackbar>
  </div>
</template>

<script>
import BasecaseDetail from '@c/BasecaseDetail';
import * as dataService from 'api/caseManagementCenter/pendingTask';
import { mapGetters } from 'vuex';
import moment from 'moment';
import FlowViewer from '@c/FlowViewer';
export default {
  name: 'mergeEventDetail',
  components: {
    BasecaseDetail,
    FlowViewer
  },
  data () {
    return {
      // 提示弹框参数
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '',
      snackbarError: false,
      detailItem: '',
      submitId: '',
      taskDetail: {
        amVerifyWorkorder: {}
      },
      token: '',
      loginUserId: '',
      // 交易详情--出账方信息
      outAccountInfo: {
        ecifPrivateCustInfo: {},
        ecifCustInfo: {},
        ecifType: ''
      },
      // 交易详情--入账方信息
      inAccountInfo: {
        ecifPrivateCustInfo: {},
        ecifCustInfo: {},
        chMchtInfo: {},
        ecifType: ''
      },
      // 交易详情--交易信息
      transationInfo: {},
      // 交易详情--其他信息
      otherInfo: {},
      // 风控详情信息
      hitRules: {},
      allAppList: [],
      // 查看详情弹窗信息
      detailDialog: false,
      detailTitle: '',
      detailData: {
        firstLevel: {
          first: '',
          depInfo: ''
        },
        secondLevel: {
          first: '',
          second: '',
          depInfo: ''
        },
        caseInfo: {}
      },
      nameListSetTitle: '',
      currentBlackListData: [],
      addBlackListHeaders: [
        { text: '字段名', value: 'identifer', sortable: false, align: 'center' },
        { text: '值', value: 'content', sortable: false, align: 'center' },
        { text: '是否拉黑', value: 'flag', sortable: false, align: 'center' },
        { text: '匹配名单集', value: 'dataId', sortable: false, align: 'center' }
      ],
      // 风险类别数据
      riskTypeItems: [
        { text: '请选择', value: '' }
      ]
    };
  },
  computed: {
    ...mapGetters([
      'appId',
      'secondLevelRouterItems',
      'appList'
    ]),
    // 流程图所需要高亮的节点的id
    colorIdList () {
      let arr = [];
      if (this.taskDetail.allActiveIds && this.taskDetail.highLightedFlows) {
        arr = [...this.taskDetail.allActiveIds, ...this.taskDetail.highLightedFlows];
      }
      return arr;
    },
    // 描述信息
    descInfo () {
      return this.taskDetail.amVerifyWorkorder.eventSubmitDescribe;
    },
    fileInfo () {
      return this.taskDetail.amVerifyWorkorder.filePathList;
    }
  },
  filters: {
    textFilters: function (str, itemList) {
      let text = '';
      itemList.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.value === str || item.tag === str) {
          text = item.text;
        }
      });
      return text;
    },
    identiferFilters: function (str) {
      let text;
      switch (str) {
        case 'dev_fp':
          text = '设备指纹';
          break;
        case 'ip':
          text = 'IP';
          break;
        case 'phone':
          text = '手机号';
          break;
        case 'id_no':
          text = '证件号';
          break;
        case 'bank_card':
          text = '银行卡号';
          break;
        case 'merchant_no':
          text = '商户号';
          break;
      }
      return text;
    }
  },
  created () {
    this.detailItem = this.$route.params.details;
    this.submitId = this.$route.params.submitId;
    // console.log(this.detailItem, this.secondLevelRouterItems);
  },
  mounted () {
    if (localStorage.getItem('loginData')) {
      let loginData = JSON.parse(localStorage.getItem('loginData'));
      this.token = loginData.token;
      this.loginUserId = loginData.userId;
    }
    this.queryDetailItem();
    this.getAppListData();
    this.queryRiskTypeList();
  },
  methods: {
    // 返回一级页面
    cancel () {
      this.$router.go(-1);
    },
    // initData () {
    //   let pageParams = Object.assign({}, this.secondLevelRouterItems);
    //   if (pageParams.taskDetail) {
    //     this.taskDetail = pageParams.taskDetail;
    //     this.outAccountInfo = Object.assign({}, pageParams.taskDetail.opTypeDetail.outAccountInfo);
    //     this.inAccountInfo = Object.assign({}, pageParams.taskDetail.opTypeDetail.inAccountInfo);
    //     this.transationInfo = Object.assign({}, {
    //       isAmount: this.secondLevelRouterItems.isAmount,
    //       createTime: pageParams.detailItemInfo.create_time,
    //       appId: pageParams.detailItemInfo.app_id,
    //       opType: pageParams.detailItemInfo.op_type,
    //       opState: pageParams.detailItemInfo.op_state,
    //       location: pageParams.detailItemInfo.location,
    //       outAccount: pageParams.detailItemInfo.outAccount,
    //       inAccount: pageParams.detailItemInfo.inAccount,
    //       amount: pageParams.detailItemInfo.amount
    //     });
    //     this.otherInfo = Object.assign({}, {
    //       eventNo: pageParams.detailItemInfo.eventNo,
    //       devFp: pageParams.detailItemInfo.devFp,
    //       brand: pageParams.detailItemInfo.brand,
    //       model: pageParams.detailItemInfo.model,
    //       ip: pageParams.detailItemInfo.ip
    //     });
    //     this.hitRules = Object.assign({}, pageParams.taskDetail.opTypeDetail.hitRule);
    //     this.pendingTaskHeaders = pageParams.isAmount ? pageParams.accountTypeHeaders : pageParams.noAccountTypeHeaders;
    //     this.allStrategyList = pageParams.allStrategyList;
    //     this.allTaskResourceList = pageParams.allTaskResourceList;
    //     this.allAssignTypeList = pageParams.allAssignTypeList;
    //     this.allAppList = pageParams.allAppList;
    //     this.allTradeTypeList = pageParams.allTradeTypeList;
    //   }
    // },
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
    async queryDetailItem () {
      let params = {
        id: this.detailItem.id,
        opId: this.detailItem.op_id,
        submitId: this.submitId,
        // dataGroupId: this.detailItem.dataGroupId,
        // isGroup: this.detailItem.isGroup,
        token: this.token
      };
      const res = await dataService.checkTaskDetail(params);
      if (res.data.code === 200) {
        this.taskDetail = res.data.data;
        this.outAccountInfo = Object.assign({}, this.taskDetail.opTypeDetail.outAccountInfo);
        this.inAccountInfo = Object.assign({}, this.taskDetail.opTypeDetail.inAccountInfo);
        this.transationInfo = Object.assign({}, {
          isAmount: this.secondLevelRouterItems.isAmount,
          createTime: this.detailItem.createTime || this.detailItem.create_time,
          appId: this.detailItem.aid || this.detailItem.appId || this.detailItem.app_id,
          opType: this.detailItem.opType || this.detailItem.op_type,
          opState: this.detailItem.opState || this.detailItem.op_state,
          location: this.taskDetail.amVerifyWorkorder.location,
          outAccount: this.detailItem.outAccount || this.detailItem.out_account,
          inAccount: this.detailItem.inAccount || this.detailItem.in_account,
          amount: this.detailItem.amount
        });
        this.otherInfo = Object.assign({}, {
          eventNo: this.detailItem.eventNo || this.detailItem.event_no,
          devFp: this.detailItem.devFp || this.detailItem.dev_fp,
          brand: this.detailItem.brand,
          model: this.detailItem.model,
          ip: this.detailItem.ip
        });
        this.hitRules = Object.assign({}, this.taskDetail.opTypeDetail.hitRule);
      }
    },
    async queryRiskTypeList () {
      let param = {
        identifier: 'sys_case_risk_type'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.riskTypeItems.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    getDetailFile (key, value) {
      let detailFileItems = value.split(',');
      detailFileItems.forEach(item => {
        if (item) {
          let index = item.lastIndexOf('/');
          let fileName = item.substring(index + 1, item.length);
          this.filePathArr.push({
            name: fileName,
            url: item,
            fileKey: key
          });
        }
      });
    },
    // 下载审核时上传的文件
    downloadFileFun (item) {
      if (item.value) {
        item.url = item.value;
      }
      const params = {
        urls: item.url
      };
      dataService.downloadFile(params).then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = item.name;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.snackbarError = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 点击审核记录中的--查看详情按钮
    async checkDetail (item) {
      // 返显详情记录中的附件资料
      this.filePathArr = [];
      let recordFileArr = this.taskDetail.amVerifyWorkorder.filePath !== null ? JSON.parse(this.taskDetail.amVerifyWorkorder.filePath) : {};
      const pathKeys = Object.keys(recordFileArr);
      for (let i = 0; i < pathKeys.length; i++) {
        this.getDetailFile(pathKeys[i], recordFileArr[pathKeys[i]]);
      }

      // 调查询记录详情的接口
      let params = {
        id: item.id,
        caseType: item.caseType,
        operation: item.operation,
        token: this.token
      };
      const res = await dataService.checkDetail(params);
      this.detailData = res.data.data;
      // 判断任务状态，设置弹窗标题
      if (item.caseType === 1) {
        this.detailTitle = '一级审核流';
      } else if (item.caseType === 2) {
        this.detailTitle = '二级审核流';
      } else if (item.operation === 1) {
        this.detailTitle = '审核结果';
      } else if (item.operation === 2) {
        this.detailTitle = '复审结果';
      }
      // 是初审状态时
      if (this.detailData.caseInfo) {
        this.currentBlackListData = this.detailData.caseInfo.dataList;
        // 判断审核结果状态，设置表格表头
        if (this.detailData.caseInfo.result === '清白件') {
          this.nameListSetTitle = '添加白名单';
          this.addBlackListHeaders[2].text = '是否加白';
          this.currentBlackListData.forEach(item => {
            if (item.map) {
              item.setName = item.map.white[0].name;
            }
          });
        } else if (this.detailData.caseInfo.result === '疑似欺诈') {
          this.nameListSetTitle = '添加灰名单';
          this.addBlackListHeaders[2].text = '是否加灰';
          this.currentBlackListData.forEach(item => {
            if (item.map) {
              item.setName = item.map.grey[0].name;
            }
          });
        } else if (this.detailData.caseInfo.result === '案件') {
          this.nameListSetTitle = '添加黑名单';
          this.addBlackListHeaders[2].text = '是否加黑';
          this.currentBlackListData.forEach(item => {
            if (item.map) {
              item.setName = item.map.black[0].name;
            }
          });
        }
        this.currentBlackListData.forEach(item => {
          if (item.flag) {
            item.flag = '是';
          } else {
            item.flag = '否';
          }
        });
      }
      // 是复审状态时
      if (this.detailData.reback) {
        this.detailData.caseInfo = Object.assign({}, this.detailData.reback);
      }
      // 展示弹窗
      this.detailDialog = true;
    }
  }
};
</script>

<style lang="stylus" scoped>
.title-info {
  span {
    color:#999999;
  }
}
.base_field_text_cu {
  color: #000;
  font-weight: bold;
}
.base_field_color {
  color: var(--v-seeDetialFieldColor-base);
}
.header_bg_color {
  height: 40px;
  padding: 0;
  padding-left: 10px;
  font-size: 14px;
  background: var(--v-seeDetailsHeadBgColor-base) !important;
  color: #000;
  font-size: 16px;
}
.seeDetails_size {
  font-size: 18px;
}
.rule-risk-strategy {
  height: 20px;
  line-height: 20px;
  padding: 0;
  padding-left: 6px;
  padding-top: 6px;
  font-size: 18px;
  color: #000;
}
.text-color {
  color:#000;
  font-weight:500;
}
.span_left {
  display: inline-block;
  width: 120px;
  margin-left: 10px;
  margin-right: 10px;
  text-align: right;
  height: 32px;
  line-height: 32px;
  vertical-align: top;
}
.span_right {
  display: inline-block;
  width: 300px;
  text-align: left;
  height: 32px;
  line-height: 32px;
}
.case_task_left {
  display: inline-block;
  width: 12%;
  text-align: right;
  vertical-align: top;
}
.case_task_right {
  display: inline-block;
  width: 65%;
  padding-left: 15px;
}
.box-background {
  padding-left: 10px;
  background: #f8f9fa;
  color: #292a2c;
}
.strategy-margin-left {
  margin-left: 32%;
}
.strategy-title-margin-left {
  margin-left: 24%;
}
// 表格样式
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
// 流程图对应的详情样式
.spLevel1-height { // 初审时流程图高度
  height: 300px;
}
.spLevel2-height { // 复审时流程图高度
  height: 500px;
}
.risk-info {
  padding-left: 50px;
}
.task-record-width {
  line-height:28px;
  width: 85px;
}
.file-icon {
  text-align: right;
}
.file-position {
  position: absolute;
  top: 15px;
}
.file-position-left {
  position: relative;
  margin-left: 12%;
  width: 88% !important;
}
>>> .v-select__selections{
  flex-wrap: nowrap;
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
