<template>
  <div >
      <!-- tab -->
      <div v-if="tabItems.length > 0" style="padding-top: 0">
        <v-tabs v-model="activeTab">
          <v-tab
            v-for="(item) in tabItems"
            :key="item.text"
            class="tabHeight pr-0 pl-2"
          >{{ item.text }}</v-tab>
        </v-tabs>
      </div>
      <!-- 主内容 -->
      <div>
        <risk-log-config v-if="activeTab===0"></risk-log-config>
        <!-- <order-log-config v-if="activeTab===1"></order-log-config> -->
      </div>
  </div>
</template>

<script>
import RiskLogConfig from './views/newRiskLogConfig';
// import OrderLogConfig from './views/workOrderConfig';
export default {
  name: 'fiedlConfig',
  components: {
    RiskLogConfig
    // OrderLogConfig
  },
  data: () => ({
    activeTab: 0,
    tabItems: [
      { text: '风控日志配置', path: '/riskLogConfig' }
      // { text: '工单日志配置', path: '/orderConfig' }
    ]
  }),
  methods: {
    getActiveTab () {
      if (sessionStorage.getItem('currentFieldConfigTab')) {
        this.activeTab = Number(sessionStorage.getItem('currentFieldConfigTab'));
      } else {
        this.activeTab = 0;
      }
    }
  },
  mounted () {
    this.getActiveTab();
  }
};
</script>
