<template>
  <div>
    <v-card class="baseCardStyle" style="">
      <v-card-title>
        <v-toolbar-title>
          {{ baseViewingReportsDialogLabel }}
        </v-toolbar-title>
        <div class="flex-grow-1" />
        <!-- <div class="flex-grow-1" /> -->
        <v-btn
          color="primary"
          class="ml-4"
          small
          @click="cancelBaseViewingReportsDialog"
        >返回</v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <h3 class="risk_label_style">规则基本信息</h3>
        <v-row style="border: 1px solid #ccc; border-radius: 5px;margin: 0;">
          <v-col cols='1'></v-col>
          <v-col class="base_h" cols='2'>
            <p>规则编码</p>
            <p>{{ riskInfo.riskCode }}</p>
          </v-col>
          <v-col class="base_h" cols='2'>
            <p>规则名称</p>
            <p>{{ riskInfo.riskName }}</p>
          </v-col>
          <v-col class="base_h" cols='2'>
            <p>规则关联渠道</p>
            <p>{{ riskInfo.riskChannel }}</p>
          </v-col>
          <v-col class="base_h" cols='2'>
            <p>规则关联场景</p>
            <p>{{ riskInfo.riskScene }}</p>
          </v-col>
          <v-col class="base_h" cols='2'>
            <p>触发风险数</p>
            <p>{{ riskInfo.riskNumber }}</p>
          </v-col>
          <v-col cols='1'></v-col>
        </v-row>
        <h3 class="risk_label_style">规则触发明细数据列表
          <echart-export-file
          :isEchart="false"
          :isActive="isActiveBtn"
          :chartId="'verificationSheet'"
          :fileName="appName + '-' + riskInfo.riskScene + '-' + riskInfo.riskCode + '-' + riskInfo.riskName"
          v-if="hasPermission('/riskDetailViewingReportExportBtn')"
          style="position: absolute; right: 0px; top:0px; z-index: 4"
          @exportExcel="exportRiskDetailList(arguments, 'excel')"
          @exportCSV="exportRiskDetailList(arguments, 'csv')"
        ></echart-export-file>
        </h3>
        <v-data-table
          :headers="riskHeaders"
          :items="riskData"
          :items-per-page="basePerPageNum"
          no-results-text="没有匹配的数据"
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:no-data>
            <div>没有数据</div>
          </template>
          <template v-slot:footer >
            <v-divider></v-divider>
            <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
              <div class="footer__select">
                每页
                <span>
                  <v-select
                    v-model="basePerPageNum"
                    item-text="fieldName"
                    item-value="fieldField"
                    :items="basePerPageItems"
                    dense
                    width="27px"
                    no-data-text="没有匹配数据"
                    @change="basePageChange(basePerPageNum)"
                  />
                </span>条
                <span style="margin-left:15px">共{{ baseTotalItems }}条</span>
                <v-spacer/>
                <v-pagination
                  class="d-flex justify-end pagination"
                  v-model="basePageNum"
                  :length="baseQueryPageLength"
                  :total-visible="7"
                  @input="baseOnPageChange(basePageNum)"
                />
              </div>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import * as riskDetailStatistics from 'api/riskDetailStatistics.js';
import EchartExportFile from '@c/EchartExportFile';
import { downloadFile } from '@/utils/downloadFile';
export default {
  data () {
    return {
      // 查看图表的公共弹窗的变量
      riskInfo: {
        riskCode: '',
        riskName: '',
        riskChannel: '',
        riskScene: '',
        riskNumber: '',
        total: '',
        pages: ''
      },
      riskHeaders: [],
      riskData: [],
      riskParams: {},
      baseViewingReportsDialogLabel: '查看图表',
      baseTotalItems: 10, // 共多少条
      basePageNum: 1, // 第几页
      baseQueryPageLength: 1, // 共多少页
      basePerPageNum: 10, // 每页多少条
      basePerPageItems: [5, 10, 15, 20, 50, 100],
      riskViewingReportsParams: {},
      appName: '',
      isActiveBtn: true
    };
  },
  watch: {},
  computed: {},
  mounted () {
    this.getData();
    this.appName = JSON.parse(sessionStorage.getItem('appName')).appName;
  },
  components: {
    EchartExportFile
  },
  methods: {
    getData () {
      this.riskViewingReportsParams = JSON.parse(sessionStorage.getItem('riskViewingReportsParams')); // 分页请求参数
      this.riskInfo = JSON.parse(sessionStorage.getItem('riskViewingReportsRiskInfo'));
      this.riskHeaders = JSON.parse(sessionStorage.getItem('riskViewingReportsHeaders'));
      this.riskData = JSON.parse(sessionStorage.getItem('riskViewingReportsData'));
      this.baseTotalItems = JSON.parse(sessionStorage.getItem('riskViewingReportsRiskInfo')).total;
      this.pages = JSON.parse(sessionStorage.getItem('riskViewingReportsRiskInfo')).pages;
      this.baseQueryPageLength = JSON.parse(sessionStorage.getItem('riskViewingReportsRiskInfo')).pages;
    },
    // 查看图表的公共弹窗分页
    async baseOnPageChange (page) {
      this.basePageNum = page;
      this.getPageChangeData();
    },
    // 查看图表的公共弹窗页数
    basePageChange () {
      this.basePageNum = 1;
      this.getPageChangeData();
    },
    // 查看图表的叉号
    cancelBaseViewingReportsDialog () {
      this.$router.push('/riskDetailStatistics');
    },
    async getPageChangeData () {
      this.riskViewingReportsParams.pageIndex = this.basePageNum;
      this.riskViewingReportsParams.pageSize = this.basePerPageNum;
      try {
        const res = await riskDetailStatistics.getRiskDetail(this.riskViewingReportsParams);
        if (res.data.code === 200) {
          this.riskHeaders = [];
          res.data.data.opLogTitle.forEach((item, index, ary) => {
            this.riskHeaders.push(
              {
                text: item.cnName,
                value: item.enName,
                sortable: false,
                width: 150
              }
            );
          });
          this.riskData = res.data.data.opLogDate;
          this.riskInfo.total = res.data.data.total;
          this.riskInfo.pages = res.data.data.pages;
          this.baseTotalItems = this.riskInfo.total;
          this.baseQueryPageLength = this.riskInfo.pages;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 导出
    exportRiskDetailList (fileName, type) {
      let params = {
        appId: this.riskViewingReportsParams.appId,
        opType: this.riskInfo.optype,
        startTime: this.riskViewingReportsParams.startTime,
        endTime: this.riskViewingReportsParams.endTime,
        fileType: type,
        ruleName: this.riskViewingReportsParams.ruleName,
        ruleNo: this.riskViewingReportsParams.ruleNo
      };
      this.isActiveBtn = false;
      riskDetailStatistics.exportrulehitdetail(params).then(res => {
        let blob = new Blob([res.data]);
        downloadFile(blob, fileName[0]);
        this.isActiveBtn = true;
      }).catch(() => {
        this.isActiveBtn = true;
      });
    }
  }
};
</script>
<style lang="stylus">
  .base_h {
    text-align: center;
  }
  .risk_label_style {
    position: relative;
    height: 40px;
    line-height: 40px;
  }
</style>
