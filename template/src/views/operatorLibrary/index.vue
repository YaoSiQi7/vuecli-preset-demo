<template>
  <div>
      <!-- tab -->
      <div v-if="tabItems.length > 0" fluid style="padding-top: 0">
        <v-tabs v-model="activeTab">
          <v-tab
            v-for="(item) in tabItems"
            :key="item.text"
            class="tabHeight pr-0 pl-2"
          >{{ item.text }}</v-tab>
        </v-tabs>
      </div>
      <!-- 主页面内容 -->
      <div fluid>
        <comp-method-lib v-if="activeTab===0"></comp-method-lib>
        <!-- <comp-fun-lib v-if="activeTab===1"></comp-fun-lib> -->
        <comparison-lib v-if="activeTab===1"></comparison-lib>

      </div>
  </div>
</template>

<script>
// import CompFunLib from './CompFunLib';
import ComparisonLib from './ComparisonLib';
import compMethodLib from './compMethodLib';

export default {
  data () {
    return {
      tabItems: [
        { text: '计算方法库', path: '/compMethodLib' },
        // { text: '计算函数库', path: '/compFunLib' },
        { text: '计算符库', path: '/comparisonLib' }
      ],
      activeTab: ''
    };
  },
  watch: {},
  filters: {},
  created () {},
  components: {
    ComparisonLib,
    // CompFunLib,
    compMethodLib
  },
  mounted () {},
  methods: {}
};
</script>
<style>
</style>
