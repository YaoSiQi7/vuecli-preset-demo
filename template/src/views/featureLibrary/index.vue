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
        <rules-variable-lib v-if="activeTab===0"></rules-variable-lib>
        <enum-cost-lib v-if="activeTab===1"></enum-cost-lib>
        <system-param-lib  v-if="activeTab===2"></system-param-lib>
      </div>
  </div>
</template>

<script>
import EnumCostLib from './EnumCostLib';
import RulesVariableLib from './RulesVariableLib';
import SystemParamLib from './SystemParamLib';

export default {
  data () {
    return {
      tabItems: [
        { text: '业务变量库', path: '/rulesVariableLib' },
        { text: '枚举常量库', path: '/enumCostLib' },
        { text: '系统参数库', path: '/systemParamLib' }
      ],
      activeTab: 0
    };
  },
  watch: {},
  filters: {},
  created () {
    this.getctiveTabA();
  },
  components: {
    EnumCostLib,
    RulesVariableLib,
    SystemParamLib
  },
  mounted () {},
  methods: {
    getctiveTabA () {
      this.$nextTick(() => {
        if (sessionStorage.getItem('backCalcindexBase')) {
          this.activeTab = Number(sessionStorage.getItem('backCalcindexBase'));
        } else {
          this.activeTab = 0;
        }
      });
    }
  }
};
</script>
<style>
</style>
