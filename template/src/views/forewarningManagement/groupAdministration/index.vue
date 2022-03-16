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
        <phone v-if="activeTab===0"></phone>
        <email v-if="activeTab===1"></email>

      </div>
  </div>
</template>

<script>
import phone from './EarlyWarningPhoneGroupManagement';
import email from './EarlyWarningEmailGroupManagement';

export default {
  data () {
    return {
      tabItems: [
        { text: '预警手机号管理', path: '/EarlyWarningPhoneGroupManagement' },
        { text: '预警邮箱管理', path: '/EarlyWarningEmailGroupManagement' }
      ],
      activeTab: ''
    };
  },
  watch: {},
  filters: {},
  created () {},
  components: {
    phone,
    email
  },
  mounted () {},
  methods: {}
};
</script>
<style>
</style>
