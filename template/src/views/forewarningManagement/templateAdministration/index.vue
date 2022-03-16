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
        <note v-if="activeTab===0"></note>
        <email v-if="activeTab===1"></email>

      </div>
  </div>
</template>

<script>
import note from './EarlyWarningNoteTemplateManagement';
import email from './EarlyWarningEmailTemplateManagement';

export default {
  data () {
    return {
      tabItems: [
        { text: '短信模板管理', path: '/EarlyWarningNoteTemplateManagement' },
        { text: '邮件模板管理', path: '/EarlyWarningEmailTemplateManagement' }
      ],
      activeTab: ''
    };
  },
  watch: {},
  filters: {},
  created () {},
  components: {
    note,
    email
  },
  mounted () {},
  methods: {}
};
</script>
<style>
</style>
