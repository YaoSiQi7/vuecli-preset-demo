<template>
  <v-card class=" elevation-0">
    <v-card-title class="pt-4 pb-2">交易详情</v-card-title>
    <v-card-text class="d-flex flex-row justify-space-around">
      <div class="mr-1" v-if="mainBodyInfo">
        <div class="box-border">
          <h4 class="title-bg py-1 pl-1">主体信息</h4>
          <ul class="pr-2 mt-2 text-color" v-if="mainBodyInfo.ecifType === '1'">
            <div class="info-type">(对私)</div>
            <li>ECIF客户号: {{ mainBodyInfo.ecifPrivateCustInfo.ecifAccount }}</li>
            <li>姓名: {{ mainBodyInfo.ecifPrivateCustInfo.name }}</li>
            <li>性别: {{ mainBodyInfo.ecifPrivateCustInfo.sex }}</li>
            <li>出生日期: {{ mainBodyInfo.ecifPrivateCustInfo.birthday }}</li>
            <li>手机号: {{ mainBodyInfo.ecifPrivateCustInfo.phoneNum }}</li>
            <li>证件号: {{ mainBodyInfo.ecifPrivateCustInfo.idNo }}</li>
            <li>户籍地址（证件地址）: {{ mainBodyInfo.ecifPrivateCustInfo.address }}</li>
            <li>居住地址（常住地址）: {{ mainBodyInfo.ecifPrivateCustInfo.liveAddress }}</li>
            <li>是否实名认证: {{ mainBodyInfo.ecifPrivateCustInfo.verified }}</li>
            <li>客户联网核查结果: {{ mainBodyInfo.ecifPrivateCustInfo.networkCheckSign }} {{ mainBodyInfo.ecifPrivateCustInfo.networkCheck }}</li>
            <li>电话核实标志: {{ mainBodyInfo.ecifPrivateCustInfo.phoneCheck }}</li>
            <li>客户号开立柜员号: {{ mainBodyInfo.ecifPrivateCustInfo.counter }}</li>
            <li>客户号开立网点代码: {{ mainBodyInfo.ecifPrivateCustInfo.branchCode }}</li>
            <li>客户号开立网点名称: {{ mainBodyInfo.ecifPrivateCustInfo.branchName }}</li>
          </ul>
          <ul class="pr-2 mt-2 text-color" v-if="mainBodyInfo.ecifType === '5'">
            <div class="info-type">(对公)</div>
            <li>ECIF客户号: {{ mainBodyInfo.ecifCustInfo.ecifAccount }}</li>
            <li>客户名称: {{ mainBodyInfo.ecifCustInfo.name }}</li>
            <li>统一社会信用代码: {{ mainBodyInfo.ecifCustInfo.creditCode }}</li>
            <li>组织机构代码: {{ mainBodyInfo.ecifCustInfo.orgCode }}</li>
            <li>法人(负责人)姓名: {{ mainBodyInfo.ecifCustInfo.legalName }}</li>
            <li>法人(负责人)证件号: {{ mainBodyInfo.ecifCustInfo.legalIdNo }}</li>
            <li>法人(负责人)联系电话: {{ mainBodyInfo.ecifCustInfo.legalPhone }}</li>
            <li>注册日期: {{ mainBodyInfo.ecifCustInfo.registDate }}</li>
            <li>注册地址: {{ mainBodyInfo.ecifCustInfo.registAddress }}</li>
            <li>营业地址: {{ mainBodyInfo.ecifCustInfo.businessAddress }}</li>
            <li>客户号开立柜员号: {{ mainBodyInfo.ecifPrivateCustInfo.counter }}</li>
            <li>客户号开立网点代码: {{ mainBodyInfo.ecifCustInfo.branchCode }}</li>
            <li>客户号开立网点名称: {{ mainBodyInfo.ecifCustInfo.branchName }}</li>
            <li>网点映射行政区: {{ mainBodyInfo.ecifCustInfo.branchRegion }}</li>
          </ul>
        </div>
      </div>
      <div class="mr-1" v-if="outAccountInfo && ((outAccountInfo.ecifType === '1' && outAccountInfo.ecifPrivateCustInfo) || (outAccountInfo.ecifType === '5' && outAccountInfo.ecifCustInfo))">
        <div class="box-border">
          <h4 class="title-bg py-1 pl-1">出账方信息</h4>
          <ul class="pr-2 mt-2 text-color" v-if="outAccountInfo.ecifType === '1'">
            <li>ECIF客户号: {{ outAccountInfo.ecifPrivateCustInfo.ecifAccount }}</li>
            <li>姓名: {{ outAccountInfo.ecifPrivateCustInfo.name }}</li>
            <li>性别: {{ outAccountInfo.ecifPrivateCustInfo.sex }}</li>
            <li>手机号: {{ outAccountInfo.ecifPrivateCustInfo.phoneNum }}</li>
            <li>证件号: {{ outAccountInfo.ecifPrivateCustInfo.idNo }}</li>
            <li>出生日期: {{ outAccountInfo.ecifPrivateCustInfo.birthday }}</li>
            <li>户籍地址: {{ outAccountInfo.ecifPrivateCustInfo.address }}</li>
            <li>居住地址: {{ outAccountInfo.ecifPrivateCustInfo.liveAddress }}</li>
            <li>是否实名认证: {{ outAccountInfo.ecifPrivateCustInfo.verified }}</li>
            <li>客户联网核查结果: {{ outAccountInfo.ecifPrivateCustInfo.networkCheckSign }} {{ outAccountInfo.ecifPrivateCustInfo.networkCheck }}</li>
            <li>电话核实标志: {{ outAccountInfo.ecifPrivateCustInfo.phoneCheck }}</li>
            <li>客户号开立柜员号: {{ outAccountInfo.ecifPrivateCustInfo.counter }}</li>
            <li>客户号开立网点代码: {{ outAccountInfo.ecifPrivateCustInfo.branchCode }}</li>
            <li>客户号开立网点名称: {{ outAccountInfo.ecifPrivateCustInfo.branchName }}</li>
          </ul>
          <ul class="pr-2 mt-2 text-color" v-if="outAccountInfo.ecifType === '5'">
            <li>ECIF客户号: {{ outAccountInfo.ecifCustInfo.ecifAccount }}</li>
            <li>客户名称: {{ outAccountInfo.ecifCustInfo.name }}</li>
            <li>统一社会信用代码: {{ outAccountInfo.ecifCustInfo.creditCode }}</li>
            <li>组织机构代码: {{ outAccountInfo.ecifCustInfo.orgCode }}</li>
            <li>营业执照登记注册号: {{ outAccountInfo.ecifCustInfo.licenseRegistNum }}</li>
            <li>国税登记证号: {{ outAccountInfo.ecifCustInfo.taxRegistNum }}</li>
            <li>法人(负责人)姓名: {{ outAccountInfo.ecifCustInfo.legalName }}</li>
            <li>法人(负责人)证件号: {{ outAccountInfo.ecifCustInfo.legalIdNo }}</li>
            <li>法人(负责人)联系电话: {{ outAccountInfo.ecifCustInfo.legalPhone }}</li>
            <li>注册日期: {{ outAccountInfo.ecifCustInfo.registDate }}</li>
            <li>注册地址: {{ outAccountInfo.ecifCustInfo.registAddress }}</li>
            <li>营业地址: {{ outAccountInfo.ecifCustInfo.businessAddress }}</li>
            <li>客户号开立网点代码: {{ outAccountInfo.ecifCustInfo.branchCode }}</li>
            <li>客户号开立网点名称: {{ outAccountInfo.ecifCustInfo.branchName }}</li>
            <li>网点映射行政区: {{ outAccountInfo.ecifCustInfo.branchRegion }}</li>
          </ul>
        </div>
      </div>
      <div class="mr-1" v-if="inAccountInfo && (inAccountInfo.ecifType === '1' || inAccountInfo.ecifType === '5' || inAccountInfo.chMchtInfo)">
        <div class="box-border">
          <h4 class="title-bg py-1 pl-1">入账方信息</h4>
          <ul class="pr-2 mt-2 text-color" v-if="inAccountInfo.ecifType === '1'">
            <div class="info-type">(对私)</div>
            <li>ECIF客户号: {{ inAccountInfo.ecifPrivateCustInfo.ecifAccount }}</li>
            <li>姓名: {{ inAccountInfo.ecifPrivateCustInfo.name }}</li>
            <li>性别: {{ inAccountInfo.ecifPrivateCustInfo.sex }}</li>
            <li>手机号: {{ inAccountInfo.ecifPrivateCustInfo.phoneNum }}</li>
            <li>证件号: {{ inAccountInfo.ecifPrivateCustInfo.idNo }}</li>
            <li>出生日期: {{ inAccountInfo.ecifPrivateCustInfo.birthday }}</li>
            <li>户籍地址: {{ inAccountInfo.ecifPrivateCustInfo.address }}</li>
            <li>居住地址: {{ inAccountInfo.ecifPrivateCustInfo.liveAddress }}</li>
            <li>是否实名认证: {{ inAccountInfo.ecifPrivateCustInfo.verified }}</li>
            <li>客户联网核查结果: {{ inAccountInfo.ecifPrivateCustInfo.networkCheckSign }} {{ inAccountInfo.ecifPrivateCustInfo.networkCheck }}</li>
            <li>电话核实标志: {{ inAccountInfo.ecifPrivateCustInfo.phoneCheck }}</li>
            <li>客户号开立柜员号: {{ inAccountInfo.ecifPrivateCustInfo.counter }}</li>
            <li>客户号开立网点代码: {{ inAccountInfo.ecifPrivateCustInfo.branchCode }}</li>
            <li>客户号开立网点名称: {{ inAccountInfo.ecifPrivateCustInfo.branchName }}</li>
          </ul>
          <ul class="pr-2 mt-2 text-color" v-else-if="inAccountInfo.ecifType === '5'">
            <div class="info-type">(对公)</div>
            <li>ECIF客户号: {{ inAccountInfo.ecifCustInfo.ecifAccount }}</li>
            <li>客户名称: {{ inAccountInfo.ecifCustInfo.name }}</li>
            <li>统一社会信用代码: {{ inAccountInfo.ecifCustInfo.creditCode }}</li>
            <li>组织机构代码: {{ inAccountInfo.ecifCustInfo.orgCode }}</li>
            <li>营业执照登记注册号: {{ inAccountInfo.ecifCustInfo.licenseRegistNum }}</li>
            <li>国税登记证号: {{ inAccountInfo.ecifCustInfo.taxRegistNum }}</li>
            <li>法人(负责人)姓名: {{ inAccountInfo.ecifCustInfo.legalName }}</li>
            <li>法人(负责人)证件号: {{ inAccountInfo.ecifCustInfo.legalIdNo }}</li>
            <li>法人(负责人)联系电话: {{ inAccountInfo.ecifCustInfo.legalPhone }}</li>
            <li>注册日期: {{ inAccountInfo.ecifCustInfo.registDate }}</li>
            <li>注册地址: {{ inAccountInfo.ecifCustInfo.registAddress }}</li>
            <li>营业地址: {{ inAccountInfo.ecifCustInfo.businessAddress }}</li>
            <li>客户号开立网点代码: {{ inAccountInfo.ecifCustInfo.branchCode }}</li>
            <li>客户号开立网点名称: {{ inAccountInfo.ecifCustInfo.branchName }}</li>
            <li>网点映射行政区: {{ inAccountInfo.ecifCustInfo.branchRegion }}</li>
          </ul>
          <ul class="pr-2 mt-2 text-color" v-else>
            <div class="info-type">(商户)</div>
            <li>pos商户号: {{ inAccountInfo.chMchtInfo.posMchtId }}</li>
            <li>营业执照注册名称: {{ inAccountInfo.chMchtInfo.mchtName }}</li>
            <li>商户简称: {{ inAccountInfo.chMchtInfo.mchtSimpleName }}</li>
            <li>注册地址: {{ inAccountInfo.chMchtInfo.mchtAddr }}</li>
            <li>营业执照编号: {{ inAccountInfo.chMchtInfo.mchtLicenceNo }}</li>
            <li>商户状态: {{ inAccountInfo.chMchtInfo.mchtStat }}</li>
            <li>法人姓名: {{ inAccountInfo.chMchtInfo.manager }}</li>
            <li>商户电话: {{ inAccountInfo.chMchtInfo.mchtPhone }}</li>
            <li>联系人姓名: {{ inAccountInfo.chMchtInfo.mchtCommNm }}</li>
            <li>联系人电话: {{ inAccountInfo.chMchtInfo.mchtCommTel }}</li>
            <li>推荐人工号: {{ inAccountInfo.chMchtInfo.mchtAmrNo }}</li>
            <li>推介人姓名: {{ inAccountInfo.chMchtInfo.mchtAmrName }}</li>
            <li>维护人姓名: {{ inAccountInfo.chMchtInfo.confirmNm }}</li>
            <li>营业地址: {{ inAccountInfo.chMchtInfo.instAddress }}</li>
          </ul>
        </div>
      </div>
      <div class="box-border mr-1">
        <h4 class="title-bg py-1 pl-1">交易信息</h4>
        <ul  class="pr-2 mt-2 text-color">
          <!-- <div class="info-type">({{transationInfo.isAmount === 1 ? '动账类' : '非动账类'}})</div> -->
          <li>交易时间: {{ transationInfo.createTime | timestampToTime(transationInfo.createTime) }}</li>
          <li>所属应用: {{ transationInfo.appId | convertOpType(allAppList)  }}</li>
          <li v-if="tradeTypeItems.length">交易类型: {{ transationInfo.opType | convertOpType(tradeTypeItems) }}</li>
          <li v-else>交易类型: {{ ifdsOptypeList[transationInfo.op_type ? transationInfo.op_type : transationInfo.opType] }}</li>
          <li>交易状态: {{ transationInfo.opState | convertOpType(opStateList)}}</li>
          <li>交易地点: {{ transationInfo.location}}</li>
          <div v-if="transationInfo.isAmount === 1">
            <li>出账账户: {{ transationInfo.outAccount}}</li>
            <li>入账账户: {{ transationInfo.inAccount}}</li>
            <li>交易金额: {{ transationInfo.amount}}</li>
          </div>
        </ul>
      </div>
      <div class="box-border">
        <h4 class="title-bg py-1 pl-1">其他信息</h4>
        <ul  class="pr-2 mt-2 text-color">
          <li v-if="otherInfo.eventNo">事件编号: {{ otherInfo.eventNo }}</li>
          <li>设备指纹: {{ otherInfo.devFp }}</li>
          <li>设备品牌: {{ otherInfo.brand }}</li>
          <li>设备型号: {{ otherInfo.model }}</li>
          <li>客户端IP: {{ otherInfo.ip }}</li>
        </ul>
      </div>
    </v-card-text>
    <div v-if="hitRule !== null && Object.keys(hitRule).length > 0">
      <v-divider></v-divider>
      <v-card-title class="pt-4 pb-2">风控详情</v-card-title>
      <v-card-text class="d-flex flex-row justify-center">
        <v-row>
          <v-col cols="6" xs="6" md="6" sm="12">
            <div style="border: 1px solid #F3F3F3;">
              <v-card-title class="header_bg_color">
                上线风险策略
              </v-card-title>
              <div v-if="Object.keys(hitRule.officialResult).length > 0">
                <v-row class="mt-2" style="padding: 0;margin:0;">
                  <v-col cols="4" style="padding: 0;margin:0;text-align: center;display: flex;justify-content: center;align-items: center;">
                    <!-- 人工审核 -->
                    <span v-if="hitRule.officialResult.strategy === '人工审核'" class="emptyCircle manuallyReview">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                    <!-- 自动放行 -->
                    <span v-else-if="hitRule.officialResult.strategy === '自动放行'" class="emptyCircle automaticPermitThrough">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                    <!-- 加强认证 -->
                    <span v-else-if="hitRule.officialResult.strategy === '加强认证'" class="emptyCircle identification">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                    <!-- 自动阻断 -->
                    <span v-else-if="hitRule.officialResult.strategy === '自动阻断'" class="emptyCircle autoBlacking">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                    <!-- 试运行：默认颜色 -->
                    <span v-else class="emptyCircle tacitlyApprove">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.officialResult.strategy }}</em>
                    </span>
                  </v-col>
                  <v-col cols="8">
                    <div>
                      <span class="base_field_text_cu">匹配模式：</span>
                      <span>{{ hitRule.officialResult.matchType }}</span>
                    </div>
                    <div>
                      <span class="base_field_text_cu">建议策略：</span>
                      <span>{{ hitRule.officialResult.strategy }}</span>
                    </div>
                    <div>
                      <span class="base_field_text_cu">风险标签：</span>
                      <span class="base_field_color">{{ hitRule.officialResult.hit_labels.replace(/,$/, '') }}</span>
                    </div>
                  </v-col>
                </v-row>
                <div class="dashed_color"></div>
                <v-row class="addDetilBaseMTop">
                  <v-col>
                    <v-row>
                      <v-col cols="8">
                        <span class="base_field_text_cu">命中规则：</span>
                      </v-col>
                      <v-col cols="4">
                        <span v-if="hitRule.officialResult.matchType === '评分模式'" class="base_field_text_cu">规则权重：</span>
                        <span v-else class="base_field_text_cu">处置策略：</span>
                      </v-col>
                    </v-row>
                    <div v-if="Object.keys(hitRule.officialResult).length > 0 && hitRule.officialResult.hit_rules.length > 0">
                      <v-row v-for="(item, index) in hitRule.officialResult.hit_rules" :key="index">
                        <v-col cols="8">
                          <div class="base_field_color">{{ item.rule_name }}</div>
                        </v-col>
                        <v-col cols="4">
                          <div v-if="hitRule.officialResult.matchType === '评分模式'">{{ item.rule_score | matchTypeValue() }}</div>
                          <div v-else>{{ item.rule_strategy }}</div>
                        </v-col>
                      </v-row>
                    </div>
                    <div v-else></div>
                  </v-col>
                </v-row>
              </div>
              <div v-else></div>
            </div>
          </v-col>
          <v-col cols="6" xs="6" md="6" sm="12">
            <div style="border: 1px solid #F3F3F3;">
              <v-card-title class="header_bg_color">
                试运行风险策略
              </v-card-title>
              <v-row class="mt-2" style="padding: 0;margin:0;height: 90px;">
                <v-col
                  cols="3"
                  style="padding: 0;margin:0;text-align: center;"
                >
                  <!-- 人工审核 -->
                  <span v-if="hitRule.simulatedResult.strategy === '人工审核'" class="emptyCircle manuallyReview">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                  <!-- 自动放行 -->
                  <span v-else-if="hitRule.simulatedResult.strategy === '自动放行'" class="emptyCircle automaticPermitThrough">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                  <!-- 加强认证 -->
                  <span v-else-if="hitRule.simulatedResult.strategy === '加强认证'" class="emptyCircle identification">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                  <!-- 自动阻断 -->
                  <span v-else-if="hitRule.simulatedResult.strategy === '自动阻断'" class="emptyCircle autoBlacking">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                  <!-- 试运行：默认颜色 -->
                  <span v-else class="emptyCircle tacitlyApprove">
                      <em style="position: relative;top: -7px;font-style: normal;">{{ hitRule.simulatedResult.strategy }}</em>
                    </span>
                </v-col>
                <v-col
                  cols="9"
                >
                  <div>
                    <span class="base_field_text_cu">匹配模式：</span>
                    <span>{{ hitRule.simulatedResult.matchType }}</span>
                  </div>
                  <div>
                    <span class="base_field_text_cu">建议策略：</span>
                    <span>{{ hitRule.simulatedResult.strategy }}</span>
                  </div>
                  <div>
                    <span class="base_field_text_cu">风险标签：</span>
                    <span class="base_field_color">{{ hitRule.simulatedResult.hit_labels.replace(/,$/, '') }}</span>
                  </div>
                </v-col>
              </v-row>
              <div class="dashed_color"></div>
              <v-row class="addDetilBaseMTop">
                <v-col>
                  <v-row>
                    <v-col cols="8">
                      <span class="base_field_text_cu">命中规则：</span>
                    </v-col>
                    <v-col cols="4">
                      <span v-if="hitRule.simulatedResult.matchType === '评分模式'" class="base_field_text_cu">规则权重：</span>
                      <span v-else class="base_field_text_cu">处置策略：</span>
                    </v-col>
                  </v-row>
                  <div v-if="Object.keys(hitRule.simulatedResult).length > 0 && hitRule.simulatedResult.hit_rules.length > 0">
                    <v-row v-for="(item, index) in hitRule.simulatedResult.hit_rules" :key="index">
                      <v-col cols="8">
                        <div class="base_field_color">{{ item.rule_name }}</div>
                      </v-col>
                      <v-col cols="4">
                        <div v-if="hitRule.simulatedResult.matchType === '评分模式'">{{ item.rule_score | matchTypeValue() }}</div>
                        <div v-else>{{ item.rule_strategy }}</div>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-else></div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'BasecaseDetail',
  props: {
    mainBodyInfo: {
      type: Object,
      default: () => {}
    },
    outAccountInfo: {
      type: Object,
      default: () => {}
    },
    inAccountInfo: {
      type: Object,
      default: () => {}
    },
    transationInfo: {
      type: Object,
      default: () => {}
    },
    otherInfo: {
      type: Object,
      default: () => {}
    },
    hitRule: {
      type: Object,
      default: () => {}
    },
    tradeTypeItems: {
      type: Array,
      default: () => []
    },
    ifdsOptypeList: {
      type: Object,
      default: () => {}
    },
    allAppList: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    // 评分模式下：规则权重的值删除小数点后的数字。
    matchTypeValue: function (data) {
      let dataValue;
      let dataIndex = String(data).indexOf('.');
      if (data && String(data).indexOf('.') !== -1) {
        dataValue = String(data).substring(0, dataIndex);
      } else {
        dataValue = data;
      }
      return dataValue;
    },
    // 交易类型
    convertOpType: function (str, itemList) {
      let text;
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
    // 获取风险标签
    getLabelNames: function (val) {
      let rules = val.label_hit_rules;
      if (rules.length) {
        let hitLabels = [];
        rules.forEach(item => {
          hitLabels.push(item.label_name);
        });
        return hitLabels.join(',');
      }
    },
    // 时间戳转换
    timestampToTime: function (timestamp) {
      if (!timestamp) return '';
      var date = new Date(timestamp);// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D + h + m + s;
    }
  },
  data: () => ({
    // 交易状态
    opStateList: [
      {
        value: '0',
        text: '失败'
      }, {
        value: '1',
        text: '成功'
      }, {
        value: '2',
        text: '账号失效'
      }, {
        value: '3',
        text: '密码错误'
      }, {
        value: '4',
        text: '余额不足'
      }, {
        value: '5',
        text: '账号不存在'
      }, {
        value: '6',
        text: '用户信息不符'
      }
    ]
  }),
  methods: {
  }
};
</script>

<style lang="stylus" scoped>
  .info-type{
    color: var(--v-error-base);
  }
  .title-bg {
    background-color #eee;
  }
  .box-border {
    border: 1px solid #000000;
  }
  .text-color {
    color: #3a3a3a;
  }
  .isEditDropdown >>> .v-select__slot .v-input__append-inner {
    display: none !important
  }
  .base_field_text_cu {
    font-weight: bold;
  }
  .addDetilBaseMTop {
    padding: 0 10px;
  }
  .emptyCircle {
    width: 80px;
    height:80px;
    border-radius:50%;
    display: inline-block;
    text-align: center;
    line-height: 80px;
  }
  .manuallyReview {
    border: 8px solid var(--v-manuallyReviewColor-base);
  }
  .automaticPermitThrough {
    border: 8px solid var(--v-automaticPermitThroughColor-base);
  }
  .identification {
    border: 8px solid var(--v-identificationColor-base);
  }
  .autoBlacking {
    border: 8px solid var(--v-emptyCircleColor-base);
  }
  .tacitlyApprove {
    border: 8px solid var(--v-tacitlyApproveColor-base);
  }
  .base_field_color {
    color: var(--v-seeDetialFieldColor-base);
  }
  .dashed_color {
    height: 1px;
    border-top: 1px dashed var(--v-dashedColor-base);
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
</style>
