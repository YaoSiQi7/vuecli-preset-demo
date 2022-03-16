<template>
  <div>
    <!-- 保存取消 -->
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3',isFixed?'fixed':'']">
        <v-card-actions style="height:60px">
          <v-btn class="ml-4 cancelButton" @click="$router.go(-1)" outlined>返回</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <template>
      <v-card>
      <v-tabs>
          <v-tab @click='tabClick("商户风险监控", "0")'>基本信息</v-tab>
          <v-tab @click='tabClick("企业风险监控", "1")'>风险报告</v-tab>
          <v-tab @click='tabClick("账户风险监控", "2")'>交易详情</v-tab>
      </v-tabs>
    </v-card>
    </template>
    <template>
      <v-card>
        <div class="tabpadd" v-if="tab==='0'">
          <!-- <basic-information></basic-information> -->
          <essential-Information :allData="routerParams"></essential-Information>
        </div>
        <div class="tabpadd" v-if="tab==='1'">
          <risk-reports :allData="routerParams"></risk-reports>
        </div>
        <div class="tabpadd" v-if="tab==='2'">
          <transaction-details :allData="routerParams"></transaction-details>
        </div>
      </v-card>
    </template>
  </div>
</template>

<script>
import essentialInformation from '../components/essentialInformation.vue';
// import basicInformation from '@c/BasicInformation';
import riskReports from '@c/RiskReports';
import transactionDetails from '@c/TransactionDetails';
export default {
  components: {
    // basicInformation,
    riskReports,
    transactionDetails,
    essentialInformation
  },
  data () {
    return {
      tab: '0',
      isFixed: false,
      routerParams: {
        distinguishName: '商户风险监控', // 区分来自于哪一个页面，如：'商户风险监控'页面
        oneAccount: '98678788976789', // 一类用户
        // 一类用户详细信息
        oneAccountDetails: [
          {
            name: '出账次数',
            value: '90'
          },
          {
            name: '入账次数',
            value: '40'
          },
          {
            name: '出账总金额',
            value: '1111111111'
          },
          {
            name: '入账总金额',
            value: '22222'
          },
          {
            name: '平均出账金额',
            value: '333333333'
          }
        ],
        twoAccount: '22222222222222', // 二类用户
        // 二类用户详细信息
        twoAccountDetails: [
          {
            name: '出账次数',
            value: '90'
          },
          {
            name: '入账次数',
            value: '40'
          },
          {
            name: '出账总金额',
            value: '1111111111'
          },
          {
            name: '入账总金额',
            value: '22222'
          },
          {
            name: '平均出账金额',
            value: '333333333'
          }
        ],
        headers: []
      }
    };
  },
  created () {
    window.addEventListener('scroll', this.fixedBtnBox);
    // console.log(this.$route.params, 'tab需要数据');
  },
  mounted () {

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
    tabClick (distinguishName, tab) {
      this.tab = tab;
      this.routerParams.distinguishName = this.$route.params.riskName;
      console.log(this.routerParams.distinguishName);
      console.log(this.tab);
    }
  }

};
</script>

<style>
.tabpadd{
  padding: 15px;
}
</style>
