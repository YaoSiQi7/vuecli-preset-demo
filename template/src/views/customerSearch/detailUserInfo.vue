<!-- author: 古雪瑞-->
<!-- updateTime: 2020-07-28-->
<template>
  <div>
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3',isFixed?'fixed':'']">
       <v-card-actions style="height:60px">
          <v-btn class="ml-4 cancelButton" @click="goback" outlined>返回</v-btn>
       </v-card-actions>
      </v-card>
    </div>
    <v-card class="mx-auto">
      <!-- 基本信息 -->
      <v-card-title class="pb-0">基本信息</v-card-title>
      <v-card-text class="pt-2 pl-8 d-flex flex-column">
        <div class="basicinfo-color">
          <div class="pb-2">姓名: {{ basicInfoItems.name }}</div>
          <div class="pb-2">性别: {{ basicInfoItems.sex }}</div>
          <div class="pb-2">出生日期: {{ basicInfoItems.birthday }}</div>
          <div class="pb-2">手机号: {{ basicInfoItems.phone }}</div>
          <div class="pb-2">证件类型: {{ basicInfoItems.idType }}</div>
          <div class="pb-2">证件号: {{ basicInfoItems.idNo }}</div>
          <div class="pb-2">户籍地址: {{ basicInfoItems.residentialAddress }}</div>
          <div class="pb-2">居住地址: {{ basicInfoItems.permanentAddress }}</div>
          <div class="pb-2">账户类型: {{ basicInfoItems.outBankCardAccountType }}</div>
          <div class="pb-2">银行卡号: {{ basicInfoItems.outAccount }}</div>
        </div>
      </v-card-text>
      <!-- 用户画像 -->
      <v-card-title class="pt-0 pb-0">用户画像</v-card-title>
      <v-card-text class="pt-2 pl-8">
        <div class="pb-2 basicinfo-color">客户风险等级: {{ secondLevelRouterItems.dataItem.riskLevel || '无' }}</div>
        <div class="d-flex flex-row align-start">
          <div class="pl-12 basicinfo-color d-flex flex-column" v-if="leftLabelItems.length">
            <div class="d-flex flex-row risk-label" v-for="(item, index) in leftLabelItems" :key="index">
              <span class="risk-label-box">{{ item }}</span>
            </div>
          </div>
          <div style="width: 200px;" v-if="showIcon">
            <v-icon x-large color="primary" style="font-size:100px;">mdi-human-male</v-icon>
            <v-icon x-large color="grey" style="font-size:100px;">mdi-human-female</v-icon>
          </div>
          <div style="width: 200px;" v-else>
            <v-icon x-large color="grey" style="font-size:100px;">mdi-human-male</v-icon>
            <v-icon x-large color="primary" style="font-size:100px;">mdi-human-female</v-icon>
          </div>
          <div class="basicinfo-color d-flex flex-column" v-if="rightLabelItems.length">
            <div class="d-flex flex-row risk-label" v-for="(item, index) in rightLabelItems" :key="index">
              <span class="risk-label-box">{{ item }}</span>
            </div>
          </div>
        </div>
      </v-card-text>
      <!-- 风险记录 -->
      <v-card-title class="pt-0 pb-0">风险记录</v-card-title>
      <v-card-text class="pt-2 pl-8">
        <div class="log-border px-2 py-2" v-if="riskLogItems.length">
          <div class="basicinfo-color" v-for="(item, index) in riskLogItems" :key="index">
            <span>{{ item.opLog }}</span>,
            <span class="pl-2">{{ item.ruleName }}</span>
          </div>
        </div>
        <div class="log-border px-2 py-2" v-else>
          <div class="basicinfo-color">
            暂无数据
          </div>
        </div>
      </v-card-text>
      <!-- 交易记录 -->
      <v-card-title class="pt-0 pb-0">交易记录</v-card-title>
      <v-card-text class="pt-2 pl-8">
        <div class="log-border px-2 py-2" v-if="transactionItems.length">
          <div class="basicinfo-color" v-for="(item, index) in transactionItems" :key="index">
            <span>{{ item.opLog }}</span>,
            <span class="pl-2">{{ item.strategy }}</span>
          </div>
        </div>
        <div class="log-border px-2 py-2" v-else>
          <div class="basicinfo-color">
            暂无数据
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { getUserPortrait } from 'api/customerSearch';
import { mapGetters } from 'vuex';
export default {
  name: 'detailUserInfo',
  data: () => ({
    isFixed: false,
    basicInfoItems: {
      name: '',
      sex: '',
      birthday: '',
      phone: '',
      idType: '',
      idNo: '',
      residentialAddress: '',
      permanentAddress: ''
    },
    // 左侧风险label展示
    leftLabelItems: [],
    // 右侧风险label展示
    rightLabelItems: [],
    // 风险记录
    riskLogItems: [],
    // 交易激励
    transactionItems: []
  }),
  computed: {
    showIcon () {
      return this.basicInfoItems.sex === '男';
    },
    ...mapGetters([
      'secondLevelRouterItems'
    ])
  },
  mounted () {
    this.initData();
    window.addEventListener('scroll', this.fixedBtnBox);
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
    initData () {
      if (this.secondLevelRouterItems.dataItem) {
        this.basicInfoItems = Object.assign({}, {
          name: this.secondLevelRouterItems.dataItem.name,
          sex: this.secondLevelRouterItems.dataItem.sex,
          birthday: this.secondLevelRouterItems.dataItem.birthday,
          phone: this.secondLevelRouterItems.dataItem.phone,
          idType: this.secondLevelRouterItems.dataItem.idType,
          idNo: this.secondLevelRouterItems.dataItem.idNo,
          residentialAddress: this.secondLevelRouterItems.dataItem.residentialAddress,
          permanentAddress: this.secondLevelRouterItems.dataItem.permanentAddress,
          outBankCardAccountType: this.secondLevelRouterItems.dataItem.outBankCardAccountType,
          outAccount: this.secondLevelRouterItems.dataItem.outAccount
        });
      }

      if (this.secondLevelRouterItems.dataItem.riskLabel) {
        const labelArr = this.secondLevelRouterItems.dataItem.riskLabel.split(',');
        this.leftLabelItems = labelArr;
        if (labelArr.length > 5) {
          this.leftLabelItems = labelArr.slice(0, 5);
          this.rightLabelItems = labelArr.slice(5);
        }
      }

      if (this.secondLevelRouterItems.riskLogItems) {
        this.riskLogItems = this.secondLevelRouterItems.riskLogItems;
      }

      if (this.secondLevelRouterItems.transactionItems) {
        this.transactionItems = this.secondLevelRouterItems.transactionItems;
      }
    },
    goback () {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="stylus" scoped>
  .basicinfo-color {
    color: #111;
  }
  .risk-label {
    min-width: 50px;
  }
  .risk-label-box {
    background-color: var(--v-primary-base);
    color: #fff;
    justify-content: center;
    border-radius: 10px;
    padding: 2px 10px;
    margin-bottom: 5px;
  }
  .log-border {
    height: 100px;
    border: 1px solid #000;
    overflow-y: auto;
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
