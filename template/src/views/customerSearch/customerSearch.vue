<!-- author: 古雪瑞-->
<!-- updateTime: 2020-07-28-->
<!-- 客户画像功能页面 -->
<template>
  <div class="fill-height">
    <!-- 搜索表单 -->
    <base-search
      :fieldList="searchForm"
      @search="search($event)"
      @reset="resetSearchData()"
      ref="customerDataSearch"
      @change="panelCounter"
    ></base-search>
    <!-- 首页列表 -->
    <v-data-table
      ref="customerDataTable"
      :headers="customerDataHeaders"
      :items="customerData"
      :items-per-page="perPageNum"
      hide-default-footer
      :fixed-header="true"
      :height="tableHeight"
      class="elevation-3 mt-3"
      :loading="loading"
      loading-text="加载数据中..."
    >
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar flat height="60px">
          <v-toolbar-title style="font-size:18px">客户查询数据</v-toolbar-title>
          <v-spacer/>
        </v-toolbar>
      </template>
        <template
          v-slot:item.userId="{ item }"
        >
          <v-btn class="pl-0" text large color="primary" @click="getDetailInfo(item)">{{ item.userId }}</v-btn>
        </template>
        <template
          v-slot:item.name="{ item }"
        >
          <span>{{ item.name }}</span>
        </template>
        <template
          v-slot:item.idNo="{ item }"
        >
          <span>{{ item.idNo }}</span>
        </template>
        <template
          v-slot:item.phone="{ item }"
        >
          <span>{{ item.phone }}</span>
        </template>
        <template
          v-slot:item.outAccount="{ item }"
        >
          <span>{{ item.outAccount }}</span>
        </template>
        <template
          v-slot:item.riskLevel="{ item }"
        >
          <span>{{ item.riskLevel }}</span>
        </template>
      <template v-slot:no-data>
        <div>没有数据</div>
      </template>
      <!-- 分页组件 -->
      <template v-slot:footer >
        <v-divider></v-divider>
        <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
          <div class="footer__select">
            每页
            <span style="width:60px;">
              <v-select
                v-model="perPageNum"
                item-text="fieldName"
                item-value="fieldField"
                :items="perPageItems"
                dense
                width="27px"
                no-data-text="没有匹配数据"
                @change="pageChange"
              />
            </span>条
            <span style="margin-left:15px">共{{ totalItems }}条</span>
            <v-spacer/>
            <v-pagination
              class="d-flex justify-end pagination"
              v-model="pageNum"
              :length="queryPageLength"
              :total-visible="7"
              @input="onPageChange"
            />
          </div>
        </div>
      </template>
    </v-data-table>
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
import BaseSearch from '@c/BaseSearch';
import { getDataList, getUserPortrait } from 'api/customerSearch';
import { mapActions } from 'vuex';
export default {
  name: 'customerSearch',
  components: {
    BaseSearch
  },
  data () {
    return {
      loading: true,
      counter: 0,
      fullHeight: window.innerHeight,
      // 搜索组件数据
      customerItems: [
        { text: '客户号', value: 'userId' },
        { text: '姓名', value: 'name' },
        { text: '证件号', value: 'idNo' },
        { text: '手机号', value: 'phone' },
        { text: '银行卡号', value: 'outAccount' },
        { text: '客户风险等级', value: 'riskLevel' }
      ],
      searchForm: [
        {
          placeholder: '查询条件',
          value: '',
          type: 'select',
          options: []
        },
        { placeholder: '请输入条件', value: '', type: 'text' }
      ],
      // 搜索参数
      searchData: { userId: '' },
      // 列表表头
      customerDataHeaders: [
        { text: '客户号', value: 'userId', sortable: false, width: 100 },
        { text: '姓名', value: 'name', sortable: false, width: 100 },
        { text: '证件号', value: 'idNo', sortable: false, width: 100 },
        { text: '手机号', value: 'phone', sortable: false, width: 100 },
        { text: '银行卡号', value: 'outAccount', sortable: false, width: 100 },
        { text: '客户风险等级', value: 'riskLevel', sortable: false, width: 100 }
      ],
      customerData: [],
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 提示弹框参数
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: ''
    };
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    this.searchForm[0].options = this.customerItems;
    this.searchForm[0].value = 'userId';
    Promise.all([
      this.getNameListSetList()
    ]);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  watch: {
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 70;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 266;
      }
    }
  },
  methods: {
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    search ($event) {
      switch (this.searchForm[0].value) {
        case 'userId':
          this.searchData = { userId: this.searchForm[1].value };
          break;
        case 'name':
          this.searchData = { name: this.searchForm[1].value };
          break;
        case 'idNo':
          this.searchData = { idNo: this.searchForm[1].value };
          break;
        case 'phone':
          this.searchData = { phone: this.searchForm[1].value };
          break;
        case 'outAccount':
          this.searchData = { outAccount: this.searchForm[1].value };
          break;
        case 'riskLevel':
          this.searchData = { riskLevel: this.searchForm[1].value };
          break;
        default:
          break;
      }
      this.pageNum = 1; // 默认从第一页开始查询
      this.getNameListSetList();
    },
    // 重置查询条件
    resetSearchData () {
      // 查询参数赋值
      this.searchData = { userId: '' };
      // 查询条件重置为 ‘客户号’
      this.$set(this.searchForm, 0, {
        placeholder: '查询条件',
        value: 'userId',
        type: 'select',
        options: this.customerItems
      });
      this.pageNum = 1; // 默认从第一页开始查询
      this.getNameListSetList();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getNameListSetList();
    },
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getNameListSetList();
    },
    // 获取首页列表数据
    async getNameListSetList () {
      let pageParams = {
        pageIndex: this.pageNum,
        pageSize: this.perPageNum
      };
      let searchParam = JSON.parse(JSON.stringify(this.searchData));
      let params = Object.assign({}, pageParams, searchParam);
      const res = await getDataList(params);
      if (res.data.code === 200) {
        this.customerData = res.data.data.userPortraitList;
        this.totalItems = res.data.data.total;
        this.queryPageLength = res.data.data.totalPages;
        this.loading = false;
      }
    },
    // 点击客户号-- 跳转查询详细信息
    async getDetailInfo (item) {
      const params = {
        userId: item.userId,
        phone: item.phone,
        outAccount: item.outAccount,
        id: item.id
      };
      const res = await getUserPortrait(params);
      if (res.data.code === 200) {
        let detailItems = {
          dataItem: res.data.data.userPortrait,
          riskLogItems: res.data.data.riskLog,
          transactionItems: res.data.data.transactionLog
        };
        this.toSecondRouterPage(detailItems);
        this.$router.push('/detailUserInfo');
      }
    },
    ...mapActions([
      'toSecondRouterPage'
    ])
  }
};
</script>
