<template>
  <!-- tab页---基本信息 -->
  <div>
    <v-row class="backgroudColor">
      <v-col v-if="infoType === 3">商户信息</v-col>
      <v-col v-if="infoType === 2">企业信息</v-col>
      <v-col v-if="infoType === 1">客戶信息</v-col>
    </v-row>
    <v-row class="px-4 py-3" :class="classObject">
      <div
        v-for="(item, index) in twoAccountDetails"
        :key="index"
        class="account_details account_header_info mb-2 px-3 py-3"
        @mouseenter="enterlist(index, item.value)" @mouseleave="leavelist(index)">
        <span>{{ item.name }}：</span>
        <span>{{ item.value }}</span>
        <span v-if="(blackNameList.includes(item.name)) && (addBlackIndex === index)" class="add_black"
              @click="add_black(item.name)">加入黑名单</span>
      </div>
    </v-row>
    <v-row class="backgroudColor">
      <v-col>风险信息</v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <div style="text-align: center;color: #333;font-size: 18px;margin-top: 4px;">风险等级：{{ riskMonitorInfo.riskLevel }}</div>
        <div style="text-align: center;color: #666;font-size: 12px;margin-top: 9px;" v-if="infoType === 1">客户风险等级说明：根据客户的风险事件评分汇总的加权平均生成。</div>
        <div style="text-align: center;color: #666;font-size: 12px;margin-top: 9px;" v-if="infoType === 2">企业风险等级说明：根据企业的风险事件评分汇总的加权平均生成。</div>
        <div style="text-align: center;color: #666;font-size: 12px;margin-top: 9px;" v-if="infoType === 3">商户风险等级说明：根据商户的风险事件评分汇总的加权平均生成。</div>
        <div v-if="isHasData" ref="gradeCharts" id="gradeCharts" style="width: 100%; height: 324px;margin-top: 6px;"></div>
        <p v-else style="width: 100%; height: 324px;margin-top: 6px;line-height: 324px;text-align: center;">暂无数据</p>
      </v-col>
      <v-col cols="6">
        <div id="weight2scoreCharts" :options="chartOptions"></div>
<!--        <highcharts :options="chartOptions" :updateArgs="[true, false]" style="width: 100%; height: 324px;"></highcharts>-->
      </v-col>
    </v-row>
    <div v-for="(item, index) in linksWeightScore" :key="item.id + index">
      <v-row class="backgroudColor">
        <v-col>{{ item.linkName }}环节风险信息</v-col>
        <div style="display: flex;line-height: 48px;font-size: 14px;padding: 0 12px;">
          <div>环节得分：{{ item.linkScore }}</div>
          <div style="margin-left: 20px;">环节权重：{{ item.linkWeight }}</div>
          <div style="margin-left: 20px;">规则触发数：{{ item.ruleTriggerNum }}</div>
        </div>
      </v-row>
      <v-row class="px-3">
        <v-col cols="8">
          <span class="risk_text">命中规则：</span>
        </v-col>
        <v-col cols="4">
          <span class="risk_text">命中次数：</span>
        </v-col>
      </v-row>
      <v-row class="px-3" v-for="(cItem, cIndex) in item.linkHitRule" :key="cItem.id + cIndex">
        <v-col cols="8">
          <span class="risk_name">{{ cItem.hitRuleName }}</span>
        </v-col>
        <v-col cols="4">
          <span>{{ cItem.hitNum }}</span>
        </v-col>
      </v-row>
    </div>
    <!-- 添加黑名单弹窗 -->
    <v-dialog v-model="addBlackDialog" persistent scrollable max-width="630px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            添加名单数据
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn icon dark @click="addBlackDialog = false">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-form
            ref="form"
            :lazy-validation="lazy"
            v-model="valid"
            class="form"
          >
            <v-row>
              <v-col cols="2">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="8">
                <v-select
                  label="所属应用"
                  multiple
                  required
                  :rules="[v => !!v || '所属应用不能为空']"
                  v-model="form.listId"
                  :items="applyListItems"
                  item-text="appName"
                  item-value="appId"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  @change="handleChangeSelectApply(form.listId)"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="8">
                <v-select
                  label="所属名单集"
                  multiple
                  required
                  :rules="[v => !!v || '所属名单集不能为空']"
                  v-model="form.listValues"
                  :items="nameListItems"
                  item-text="listName"
                  item-value="id"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  @change="handleChangeSelectList(form.listValues)"
                />
              </v-col>
            </v-row>
            <!-- 日期 -->
            <v-row>
              <v-col cols="2">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="8">
                <DatetimePicker
                  v-if="isEditMode"
                  required
                  solo
                  flat
                  dense
                  v-model="form.expireTime"
                  time-format="HH:mm:ss"
                  :type="3"
                  @clear="form.expireTime = null"
                  :text-field-props="fors.textFieldProps"
                  :date-picker-props="fors.dateProps"
                  :time-picker-props="fors.timeProps"
                  placeholder="不填写时，默认永久有效"
                  class="isEditDropdown"
                >
                </DatetimePicker>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pt-4 pb-4">
          <div class="flex-grow-1"></div>
          <v-btn class="pl-0 mr-4" @click="cancelSubmit">关闭</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="doSubmit">提交</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 公共弹框提示 -->
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
import { mapGetters } from 'vuex';
import * as dataService from 'api/performanceAnalysis';
import DatetimePicker from '@c/DateTimePicker';
import HighCharts from 'highcharts';
import variableInit from 'highcharts/modules/variable-pie';
variableInit(HighCharts);
export default {
  name: 'essentialInformation',
  components: {
    DatetimePicker
  },
  data: () => ({
    timeout: 2000, // 弹窗
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '', // success', 'info', 'error' 三种类型
    twoAccountDetails: {}, // 客户信息
    riskMonitorInfo: {}, // 风险信息
    linksWeightScore: [], // 各个环节权重得分
    addBlackIndex: '',
    addBlackDialog: false,
    blackNameList: [
      '手机',
      '证件号',
      '银行账号',
      '法人身份证号',
      '法人联系方式',
      '代办人证件号',
      '代办人联系方式',
      '统一社会信用代码',
      '商户手机号',
      '法人证件号',
      '法人手机号码'
    ],
    nodeType: {
      '手机': 'phone',
      '证件号': 'id_no',
      '银行账号': 'out_account',
      '法人身份证号': 'legal_person_id_no',
      '法人联系方式': 'legal_person_phone',
      '代办人证件号': 'agent_id_no',
      '代办人联系方式': 'agent_phone',
      '统一社会信用代码': 'id_no',
      '商户手机号': 'phone',
      '法人证件号': 'legal_person_id_no',
      '法人手机号码': 'legal_person_phone'
    },
    accoInfoList: { // 账户
      '手机': 'effectAccoInfo---phone',
      '证件号': 'effectAccoInfo---id_no'
    },
    entInfoList: { // 企业
      '统一社会信用代码': 'effectEntInfo---credit_code',
      '法人身份证号': 'effectEntInfo---legal_id_card',
      '法人联系方式': 'effectEntInfo---legal_contact_info',
      '代办人证件号': 'effectEntInfo---id_no',
      '代办人联系方式': 'effectEntInfo---contact_phone'
    },
    merInfoList: { // 商户
      '商户手机号': 'effectMerInfo---merchant_phone',
      '统一社会信用代码': 'effectMerInfo---credit_code',
      '法人证件号': 'effectMerInfo---legal_id_card',
      '法人手机号码': 'effectMerInfo---legal_phone',
      '法人联系方式': 'effectMerInfo---legal_phone'
    },
    blackNodeType: '',
    valid: true,
    lazy: false,
    form: {
      listId: '',
      listValues: '',
      expireTime: null
    },
    tableName: '',
    column: '',
    listsListArr: '',
    applyListItems: [],
    nameListItems: [],
    isEditMode: true, // 选择日期
    fors: {
      label: '失效时间*',
      textFieldProps: {
        appendIcon: 'event'
      },
      dateProps: {
        headerColor: 'primary'
      },
      timeProps: {
        useSeconds: true,
        ampmInTitle: true
      }
    },
    chartOptions: {},
    infoType: '',
    infoId: '',
    levelId: '',
    isHasData: true
  }),
  created () {
    if (sessionStorage.getItem('tabsName') === '商户风险监控') {
      this.infoType = 3;
      this.infoId = JSON.parse(sessionStorage.getItem('tabsQuery')).merInfoId;
      this.levelId = JSON.parse(sessionStorage.getItem('tabsQuery')).merId;
      this.twoAccountDetails = [
        { name: '商户名称', value: '' },
        { name: '经营场所', value: '' },
        { name: '法人', value: '' },
        { name: '商户号', value: '' },
        { name: '经营场所地址', value: '' },
        { name: '法人证件类型', value: '' },
        { name: '行业类型', value: '' },
        { name: '商户联系人', value: '' },
        { name: '法人证件号', value: '' },
        { name: '商户类型', value: '' },
        { name: '商户手机号', value: '' },
        { name: '法人联系方式', value: '' },
        { name: '统一社会信用代码', value: '' },
        { name: '注册邮箱', value: '' }
      ];
    } else if (sessionStorage.getItem('tabsName') === '企业风险监控') {
      this.infoType = 2;
      this.infoId = JSON.parse(sessionStorage.getItem('tabsQuery')).entInfoId;
      this.levelId = JSON.parse(sessionStorage.getItem('tabsQuery')).entId;
      this.twoAccountDetails = [
        { name: '客户号', value: '' },
        { name: '法人', value: '' },
        { name: '代办人姓名', value: '' },
        { name: '企业名称', value: '' },
        { name: '法人身份证号', value: '' },
        { name: '代办人证件类型', value: '' },
        { name: '注册地址', value: '' },
        { name: '法人联系方式', value: '' },
        { name: '代办人证件号', value: '' },
        { name: '经营地址', value: '' },
        { name: '业务归属机构', value: '' },
        { name: '代办人联系方式', value: '' },
        { name: '统一社会信用代码', value: '' },
        { name: '常用设备指纹', value: '' },
        { name: '常用IP', value: '' },
        { name: '常用城市', value: '' }
      ];
    } else if (sessionStorage.getItem('tabsName') === '账户风险监控') {
      this.twoAccountDetails = [
        { name: '客户号', value: '' },
        { name: '证件类型', value: '' },
        { name: '证件号', value: '' },
        { name: '客户姓名', value: '' },
        { name: '性别', value: '' },
        { name: '年龄', value: '' },
        { name: '手机', value: '' },
        { name: '业务归属机构', value: '' },
        { name: '常用设备指纹', value: '' },
        { name: '常用IP', value: '' },
        { name: '常用城市', value: '' }
      ];
      this.infoType = 1;
      this.infoId = JSON.parse(sessionStorage.getItem('tabsQuery')).accoInfoId;
      this.levelId = JSON.parse(sessionStorage.getItem('tabsQuery')).accoId;
    }
    // 账户/企业/商户风险监控基本信息
    this.getQueryBaseInfo();
    this.sysAppinfoInfos();
    // 账户/企业/商户风险信息
    this.getRiskInfo();
  },
  mounted () {

  },
  computed: {
    ...mapGetters([
      'appId'
    ]),
    classObject: function () {
      return {
        accountRiskMonitor: this.infoType === 1,
        enterpriseRiskMonitor: this.infoType === 2,
        merchantRiskMonitor: this.infoType === 3
      };
    }
  },
  methods: {
    // 账户/企业/商户风险监控基本信息
    getQueryBaseInfo () {
      let params = {};
      if (this.infoType === 1) { // 账户
        params = { accoInfoId: this.infoId };
        dataService.accountRiskMonitorQueryBaseInfo(params).then(res => {
          this.twoAccountDetails = [
            { name: '客户号', value: res.data.data.customerNo },
            { name: '证件类型', value: res.data.data.idType },
            { name: '证件号', value: res.data.data.idNo },
            { name: '客户姓名', value: res.data.data.customerName },
            { name: '性别', value: res.data.data.sex },
            { name: '年龄', value: res.data.data.age },
            { name: '手机', value: res.data.data.phone },
            { name: '业务归属机构', value: res.data.data.organ },
            { name: '常用设备指纹', value: res.data.data.commonEquipment },
            { name: '常用IP', value: res.data.data.commonIP },
            { name: '常用城市', value: res.data.data.commonCity }
          ];
        }).catch(error => {
          console.log(error);
        });
      } else if (this.infoType === 2) { // 企业
        params = { entInfoId: this.infoId };
        dataService.enterpriseRiskMonitorQueryBaseInfo(params).then(res => {
          this.twoAccountDetails = [
            { name: '客户号', value: res.data.data.customerNo },
            { name: '法人', value: res.data.data.legalPerson },
            { name: '代办人姓名', value: res.data.data.agentName },
            { name: '企业名称', value: res.data.data.enterpriseName },
            { name: '法人身份证号', value: res.data.data.legalIdCard },
            { name: '代办人证件类型', value: res.data.data.idType },
            { name: '注册地址', value: res.data.data.registerAddr },
            { name: '法人联系方式', value: res.data.data.legalContactInfo },
            { name: '代办人证件号', value: res.data.data.idNo },
            { name: '经营地址', value: res.data.data.operatAddr },
            { name: '业务归属机构', value: res.data.data.organ },
            { name: '代办人联系方式', value: res.data.data.contactPhone },
            { name: '统一社会信用代码', value: res.data.data.creditCode },
            { name: '常用设备指纹', value: res.data.data.commonEquipment },
            { name: '常用IP', value: res.data.data.commonIP },
            { name: '常用城市', value: res.data.data.commonCity }
          ];
        }).catch(error => {
          console.log(error);
        });
      } else if (this.infoType === 3) { // 商户
        params = { merInfoId: this.infoId };
        dataService.merchantRiskMonitorQueryBaseInfo(params).then(res => {
          this.twoAccountDetails = [
            { name: '商户名称', value: res.data.data.merchantName },
            { name: '经营场所', value: res.data.data.busPlace },
            { name: '法人', value: res.data.data.legalPerson },
            { name: '商户号', value: res.data.data.merchantNo },
            { name: '经营场所地址', value: res.data.data.busPlaceAddr },
            { name: '法人证件类型', value: res.data.data.legalIdType },
            { name: '行业类型', value: res.data.data.industryType },
            { name: '商户联系人', value: res.data.data.merchantContacts },
            { name: '法人证件号', value: res.data.data.legalIdCard },
            { name: '商户类型', value: res.data.data.merType },
            { name: '商户手机号', value: res.data.data.merchantPhone },
            { name: '法人联系方式', value: res.data.data.legalPhone },
            { name: '统一社会信用代码', value: res.data.data.creditCode },
            { name: '注册邮箱', value: res.data.data.registerEmail }
          ];
        }).catch(error => {
          console.log(error);
        });
      }
    },
    // 账户/企业/商户风险信息
    getRiskInfo () {
      let params = {};
      if (this.infoType === 1) { // 账户
        params = { accoInfoId: this.infoId };
        dataService.accountRiskMonitorRiskInfo(params).then(res => {
          // 风险等级charts
          const gradeCharts = this.$echarts.init(this.$refs.gradeCharts);
          gradeCharts.clear();
          dataService.AccoGetMaxScoreGroupByRiskLevel({ accoId: this.levelId }).then(resp => {
            let gaugeDataColor = ['#55bf3b', '#dddf0d', '#df5353'];
            let gaugeData = [];
            let gaugeData2 = [0];
            resp.data.data.length > 0 && resp.data.data.forEach(item => {
              if (item.riskLevel === '低风险') {
                gaugeData.push([Math.ceil(item.score) / Math.ceil(resp.data.data[resp.data.data.length - 1].score), gaugeDataColor[0]]);
              } else if (item.riskLevel === '中风险') {
                gaugeData.push([Math.ceil(item.score) / Math.ceil(resp.data.data[resp.data.data.length - 1].score), gaugeDataColor[1]]);
              } else if (item.riskLevel === '高风险') {
                gaugeData.push([Math.ceil(item.score / item.score), gaugeDataColor[2]]);
              }
              gaugeData2.push(Math.ceil(item.score) * 1);
            });
            let isHasData = gaugeData2.filter(item => {
              return item > 0;
            });
            if (isHasData.length <= 0) {
              this.isHasData = false;
            }
            gradeCharts.setOption({
              series: [
                {
                  name: '风险等级',
                  type: 'gauge',
                  min: 0,
                  splitNumber: gaugeData2[gaugeData2.length - 1],
                  max: Math.ceil(resp.data.data[resp.data.data.length - 1].score * 1),
                  data: [{ value: res.data.data.riskMonitorInfo.score }],
                  radius: '78%',
                  axisLine: {
                    lineStyle: {
                      color: gaugeData,
                      width: 18
                    }
                  },
                  axisLabel: {
                    color: '#333',
                    distance: 8,
                    fontSize: 13,
                    fontWeight: 'bold',
                    formatter: function (value) {
                      if (gaugeData2.includes(value)) {
                        return value;
                      } else {
                        return '';
                      }
                    }
                  },
                  splitLine: {
                    show: false,
                    lineStyle: {
                      color: '#333'
                    },
                    length: 13
                  },
                  axisTick: {
                    show: false,
                    lineStyle: {
                      color: '#333'
                    },
                    length: 12
                  },
                  pointer: {
                    width: 5
                  },
                  itemStyle: {
                    color: '#3f3f3f'
                  },
                  detail: {
                    borderColor: '#999',
                    borderWidth: 1,
                    fontSize: 20,
                    offsetCenter: [0, '75%'],
                    color: '#333',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    formatter: '{value}'
                  }
                }
                // {
                //   name: '外边框',
                //   type: 'pie',
                //   clockWise: false, // 顺时加载
                //   hoverAnimation: false, // 鼠标移入变大
                //   center: ['50%', '50%'],
                //   radius: ['78%', '78%'],
                //   label: {
                //     normal: {
                //       show: false
                //     }
                //   },
                //   data: [{
                //     value: 9,
                //     itemStyle: {
                //       normal: {
                //         borderWidth: 2,
                //         borderColor: '#595959',
                //         shadowColor: 'rgba(0, 0, 0, 0.5)',
                //         shadowBlur: 2
                //       }
                //     }
                //   }]
                // }
              ]
            });
          });

          this.riskMonitorInfo = res.data.data.riskMonitorInfo;
          // 权重及得分charts
          let chartsData = [];
          res.data.data.linksWeightScore.forEach(item => {
            this.getLinkHitRule(item.id).then(rule => {
              item.linkHitRule = rule;
            });
            chartsData.push({
              name: item.linkName,
              y: item.linkWeight * 1,
              z: item.linkScore * 1
            });
          });
          HighCharts.chart('weight2scoreCharts', {
            chart: {
              type: 'variablepie',
              backgroundColor: 'rgba(0,0,0,0)'
            },
            credits: {
              enabled: false // 不显示LOGO
            },
            title: {
              text: '各环节权重及得分'
            },
            subtitle: {
              text: '扇区长度（圆周方法）表示权重，宽度（纵向）表示得分'
            },
            tooltip: {
              headerFormat: '',
              pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                '权重: <b>{point.y}</b><br/>' +
                '得分: <b>{point.z}</b><br/>'
            },
            colors: window.g.echartsBaseColor,
            series: [{
              size: '86%',
              minPointSize: 10,
              innerSize: '20%',
              zMin: 0,
              name: 'countries',
              data: chartsData
            }]
          });
          this.linksWeightScore = res.data.data.linksWeightScore;
        }).catch(error => {
          console.log(error);
        });
      } else if (this.infoType === 2) { // 企业
        params = { entInfoId: this.infoId };
        dataService.enterpriseRiskMonitorRiskInfo(params).then(res => {
          // 风险等级charts
          const gradeCharts = this.$echarts.init(this.$refs.gradeCharts);
          gradeCharts.clear();
          dataService.EntGetMaxScoreGroupByRiskLevel({ entId: this.levelId }).then(resp => {
            let gaugeDataColor = ['#55bf3b', '#dddf0d', '#df5353'];
            let gaugeData = [];
            let gaugeData2 = [0];
            resp.data.data.length > 0 && resp.data.data.forEach(item => {
              if (item.riskLevel === '低风险') {
                gaugeData.push([Math.ceil(item.score) / Math.ceil(resp.data.data[resp.data.data.length - 1].score), gaugeDataColor[0]]);
              } else if (item.riskLevel === '中风险') {
                gaugeData.push([Math.ceil(item.score) / Math.ceil(resp.data.data[resp.data.data.length - 1].score), gaugeDataColor[1]]);
              } else if (item.riskLevel === '高风险') {
                gaugeData.push([Math.ceil(item.score / item.score), gaugeDataColor[2]]);
              }
              gaugeData2.push(Math.ceil(item.score) * 1);
            });
            let isHasData = gaugeData2.filter(item => {
              return item > 0;
            });
            if (isHasData.length <= 0) {
              this.isHasData = false;
            }
            gradeCharts.setOption({
              series: [
                {
                  name: '风险等级',
                  type: 'gauge',
                  min: 0,
                  splitNumber: gaugeData2[gaugeData2.length - 1],
                  max: Math.ceil(resp.data.data[resp.data.data.length - 1].score * 1),
                  data: [{ value: res.data.data.riskMonitorInfo.score }],
                  radius: '78%',
                  axisLine: {
                    lineStyle: {
                      color: gaugeData,
                      width: 18
                    }
                  },
                  axisLabel: {
                    color: '#333',
                    distance: 8,
                    fontSize: 13,
                    fontWeight: 'bold',
                    formatter: function (value) {
                      if (gaugeData2.includes(value)) {
                        return value;
                      } else {
                        return '';
                      }
                    }
                  },
                  splitLine: {
                    show: false,
                    lineStyle: {
                      color: '#333'
                    },
                    length: 13
                  },
                  axisTick: {
                    show: false,
                    lineStyle: {
                      color: '#333'
                    },
                    length: 12
                  },
                  pointer: {
                    width: 5
                  },
                  itemStyle: {
                    color: '#3f3f3f'
                  },
                  detail: {
                    borderColor: '#999',
                    borderWidth: 1,
                    fontSize: 20,
                    offsetCenter: [0, '75%'],
                    color: '#333',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    formatter: '{value}'
                  }
                }
                // {
                //   name: '外边框',
                //   type: 'pie',
                //   clockWise: false, // 顺时加载
                //   hoverAnimation: false, // 鼠标移入变大
                //   center: ['50%', '50%'],
                //   radius: ['78%', '78%'],
                //   label: {
                //     normal: {
                //       show: false
                //     }
                //   },
                //   data: [{
                //     value: 9,
                //     itemStyle: {
                //       normal: {
                //         borderWidth: 2,
                //         borderColor: '#595959',
                //         shadowColor: 'rgba(0, 0, 0, 0.5)',
                //         shadowBlur: 2
                //       }
                //     }
                //   }]
                // }
              ]
            });
          });
          this.riskMonitorInfo = res.data.data.riskMonitorInfo;
          // 权重及得分charts
          let chartsData = [];
          res.data.data.linksWeightScore.forEach(item => {
            this.getLinkHitRule(item.id).then(rule => {
              item.linkHitRule = rule;
            });
            chartsData.push({
              name: item.linkName,
              y: item.linkWeight * 1,
              z: item.linkScore * 1
            });
          });
          HighCharts.chart('weight2scoreCharts', {
            chart: {
              type: 'variablepie',
              backgroundColor: 'rgba(0,0,0,0)'
            },
            credits: {
              enabled: false // 不显示LOGO
            },
            title: {
              text: '各环节权重及得分'
            },
            subtitle: {
              text: '扇区长度（圆周方法）表示权重，宽度（纵向）表示得分'
            },
            tooltip: {
              headerFormat: '',
              pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                '权重: <b>{point.y}</b><br/>' +
                '得分: <b>{point.z}</b><br/>'
            },
            colors: window.g.echartsBaseColor,
            series: [{
              size: '86%',
              minPointSize: 10,
              innerSize: '20%',
              zMin: 0,
              name: 'countries',
              data: chartsData
            }]
          });
          this.linksWeightScore = res.data.data.linksWeightScore;
        }).catch(error => {
          console.log(error);
        });
      } else if (this.infoType === 3) { // 商户
        params = { merInfoId: this.infoId };
        dataService.merchantRiskMonitorRiskInfo(params).then(res => {
          // 风险等级charts
          const gradeCharts = this.$echarts.init(this.$refs.gradeCharts);
          gradeCharts.clear();
          dataService.MerGetMaxScoreGroupByRiskLevel({ merId: this.levelId }).then(resp => {
            let gaugeDataColor = ['#55bf3b', '#dddf0d', '#df5353'];
            let gaugeData = [];
            let gaugeData2 = [0];
            resp.data.data.length > 0 && resp.data.data.forEach(item => {
              if (item.riskLevel === '低风险') {
                gaugeData.push([Math.ceil(item.score) / Math.ceil(resp.data.data[resp.data.data.length - 1].score), gaugeDataColor[0]]);
              } else if (item.riskLevel === '中风险') {
                gaugeData.push([Math.ceil(item.score) / Math.ceil(resp.data.data[resp.data.data.length - 1].score), gaugeDataColor[1]]);
              } else if (item.riskLevel === '高风险') {
                gaugeData.push([Math.ceil(item.score / item.score), gaugeDataColor[2]]);
              }
              gaugeData2.push(Math.ceil(item.score) * 1);
            });
            let isHasData = gaugeData2.filter(item => {
              return item > 0;
            });
            if (isHasData.length <= 0) {
              this.isHasData = false;
            }
            gradeCharts.setOption({
              series: [
                {
                  name: '风险等级',
                  type: 'gauge',
                  min: 0,
                  splitNumber: gaugeData2[gaugeData2.length - 1],
                  max: Math.ceil(resp.data.data[resp.data.data.length - 1].score * 1),
                  data: [{ value: res.data.data.riskMonitorInfo.score }],
                  radius: '78%',
                  axisLine: {
                    lineStyle: {
                      color: gaugeData,
                      width: 18
                    }
                  },
                  axisLabel: {
                    color: '#333',
                    distance: 8,
                    fontSize: 13,
                    fontWeight: 'bold',
                    formatter: function (value) {
                      if (gaugeData2.includes(value)) {
                        return value;
                      } else {
                        return '';
                      }
                    }
                  },
                  splitLine: {
                    show: false,
                    lineStyle: {
                      color: '#333'
                    },
                    length: 13
                  },
                  axisTick: {
                    show: false,
                    lineStyle: {
                      color: '#333'
                    },
                    length: 12
                  },
                  pointer: {
                    width: 5
                  },
                  itemStyle: {
                    color: '#3f3f3f'
                  },
                  detail: {
                    borderColor: '#999',
                    borderWidth: 1,
                    fontSize: 20,
                    offsetCenter: [0, '75%'],
                    color: '#333',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    formatter: '{value}'
                  }
                }
                // {
                //   name: '外边框',
                //   type: 'pie',
                //   clockWise: false, // 顺时加载
                //   hoverAnimation: false, // 鼠标移入变大
                //   center: ['50%', '50%'],
                //   radius: ['78%', '78%'],
                //   label: {
                //     normal: {
                //       show: false
                //     }
                //   },
                //   data: [{
                //     value: 9,
                //     itemStyle: {
                //       normal: {
                //         borderWidth: 2,
                //         borderColor: '#595959',
                //         shadowColor: 'rgba(0, 0, 0, 0.5)',
                //         shadowBlur: 2
                //       }
                //     }
                //   }]
                // }
              ]
            });
          });
          this.riskMonitorInfo = res.data.data.riskMonitorInfo;
          // 权重及得分charts
          let chartsData = [];
          res.data.data.linksWeightScore.forEach(item => {
            this.getLinkHitRule(item.id).then(rule => {
              item.linkHitRule = rule;
            });
            chartsData.push({
              name: item.linkName,
              y: item.linkWeight * 1,
              z: item.linkScore * 1
            });
          });
          HighCharts.chart('weight2scoreCharts', {
            chart: {
              type: 'variablepie',
              backgroundColor: 'rgba(0,0,0,0)'
            },
            credits: {
              enabled: false // 不显示LOGO
            },
            title: {
              text: '各环节权重及得分'
            },
            subtitle: {
              text: '扇区长度（圆周方法）表示权重，宽度（纵向）表示得分'
            },
            tooltip: {
              headerFormat: '',
              pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                '权重: <b>{point.y}</b><br/>' +
                '得分: <b>{point.z}</b><br/>'
            },
            colors: window.g.echartsBaseColor,
            series: [{
              size: '86%',
              minPointSize: 10,
              innerSize: '20%',
              zMin: 0,
              name: 'countries',
              data: chartsData
            }]
          });
          this.linksWeightScore = res.data.data.linksWeightScore;
        }).catch(error => {
          console.log(error);
        });
      }
    },
    // 账户/企业/商户风险信息
    async getLinkHitRule (id) {
      if (this.infoType === 1) { // 账户
        try {
          const response = await dataService.accountRiskMonitorLinkHitRule({ accoAppTraWeightId: id });
          return response.data.data;
        } catch (error) {}
      } else if (this.infoType === 2) { // 企业
        try {
          const response = await dataService.enterpriseRiskMonitorLinkHitRule({ entAppTradeWeightId: id });
          return response.data.data;
        } catch (error) {}
      } else if (this.infoType === 3) { // 商户
        try {
          const response = await dataService.merchantRiskMonitorLinkHitRule({ merAppTradeWeightId: id });
          return response.data.data;
        } catch (error) {}
      }
    },
    // 加入黑名单滑过
    enterlist (index, value) {
      if (!value) return;
      this.addBlackIndex = index;
    },
    // 加入黑名单滑过离开
    leavelist (index) {
      this.addBlackIndex = '';
    },
    // 加入黑名单点击事件
    add_black (name) {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.blackNodeType = this.nodeType[name];
      if (this.infoType === 1) {
        let accoInfoArr = this.accoInfoList[name].split('---');
        this.tableName = accoInfoArr[0];
        this.column = accoInfoArr[1];
      } else if (this.infoType === 2) {
        let entInfoArr = this.entInfoList[name].split('---');
        this.tableName = entInfoArr[0];
        this.column = entInfoArr[1];
      } else if (this.infoType === 3) {
        let merInfoArr = this.merInfoList[name].split('---');
        this.tableName = merInfoArr[0];
        this.column = merInfoArr[1];
      }
      this.addBlackDialog = true;
    },
    // 获取所属应用列表
    async sysAppinfoInfos () {
      const response = await dataService.getAppInfoOrTradeType({ applyScopeId: 2 });
      if (response.data.code === 200) {
        response.data.data.forEach(item => {
          this.applyListItems.push(item);
        });
      }
    },
    // 获取所属应用下的名单集（黑名单)
    async getBlankListName (query) {
      this.nameListItems = [];
      const response = await dataService.getBlankListNames(query);
      if (response.data.code === 200) {
        response.data.data.forEach(item => {
          this.nameListItems.push(item);
        });
      }
    },
    // 应用select下拉框的change事件
    handleChangeSelectApply (value) {
      if (value.length > 0) {
        let query = value.join(',');
        this.getBlankListName({ appIds: query, nodeType: this.blackNodeType });
      }
    },
    // 名单select下拉框的change事件
    handleChangeSelectList (value) {
      this.listsListArr = value.join(',');
    },
    cancelSubmit () {
      this.$refs.form.reset();
      this.blackNodeType = '';
      this.addBlackDialog = false;
    },
    // 保存
    doSubmit () {
      // 转换为年月日时分秒
      var datetime = '';
      if (this.form.expireTime) {
        var d = this.form.expireTime;
        datetime =
          d.getFullYear() +
          '-' +
          (d.getMonth() + 1 < 10
            ? '0' + (d.getMonth() + 1)
            : d.getMonth() + 1) +
          '-' +
          (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
          ' ' +
          (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
          ':' +
          (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
          ':' +
          (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
      } else {
        datetime = '';
      }
      this.nameListItems = [];
      let blackSet = JSON.parse(JSON.stringify(this.form.listValues));
      let query = {
        listId: this.listsListArr,
        // listValues: blackSet.join(),
        tableName: this.tableName,
        column: this.column,
        id: this.infoId,
        expireTime: datetime
      };
      this.batchInsertNameData(query);
      this.$refs.form.reset();
      this.listsListArr = '';
      this.form.expireTime = '';
      this.addBlackDialog = false;
    },
    // 批量添加黑名单
    async batchInsertNameData (query) {
      const response = await dataService.batchInsertNameData(query);
      if (response.data.code === 200 && response.data.data.code === '1') {
        this.snackbarServe = true;
        this.snackbarServeMsg = '加黑成功！';
        this.snackbarServeColor = 'success';
      } else if (response.data.code === 200 && response.data.data.code === '0') {
        this.snackbarServe = true;
        this.snackbarServeMsg = response.data.data.msg;
        this.snackbarServeColor = 'error';
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = response.data.msg;
        this.snackbarServeColor = 'error';
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.backgroudColor {
  background-color: var(--v-seeDetailsHeadBgColor-base) !important;
  font-size: 16px;
}
.account_details {
  width: 33.333333%;
  display: inline-block;
  position: relative;
}
.accountRiskMonitor .account_details:nth-child(9),
.accountRiskMonitor .account_details:nth-child(10),
.accountRiskMonitor .account_details:nth-child(11) {
  width: 100%;
}
.enterpriseRiskMonitor .account_details:nth-child(13),
.enterpriseRiskMonitor .account_details:nth-child(14),
.enterpriseRiskMonitor .account_details:nth-child(15),
.enterpriseRiskMonitor .account_details:nth-child(16){
  width: 100%;
}
.risk_name {
  color: var(--v-primary-base);
}
.add_black {
  margin-left: 10px;
  color: red;
  cursor pointer;
}
</style>
