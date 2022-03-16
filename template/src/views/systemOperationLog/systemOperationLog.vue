<!----------  @author: wangguodong  ----------->
<!----------  @updated_at: 2020-08-05  ----------->
<!----------  @version: wuxi-secondPhase  ----------->

<template>
  <div class="enu-content fill-height">
    <base-search
      :fieldList="searchForm"
      @search="search($event)"
      @reset="resetSearchData($event)"
      :clearDate="clearDate"
      @change="panelCounter"
    ></base-search>
    <v-data-table
      :headers="paramHeader"
      :items="paramItems"
      :items-per-page="1000"
      hide-default-footer
      no-results-text="没有匹配的数据"
      :height="tableHeight"
      :fixed-header="true"
      class="elevation-3 mt-3"
    >
      <!-- 列表头 -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title style="font-size:18px">
            系统操作日志
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer></v-spacer>
          <echart-export-file
            :isEchart="false"
            :isActive="isActiveBtnList"
            :fileName="appName + '-系统操作日志'"
            style="position: absolute; right: 16px; z-index: 4"
            @exportExcel="exportData(arguments, 'excel')"
            @exportCSV="exportData(arguments, 'csv')"
            v-if="hasPermission(exportBtnOperationLog)"
          ></echart-export-file>
        </v-toolbar>
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
            <span>
              <v-select
                v-model="perPageNums"
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
    <!-- 删除弹窗 -->
    <del-dialog :isDialogShow='dialogDel' @cancelDel='cancleDelParam($event)' @confimDel='confirmDel($event)'></del-dialog>
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
import BaseSearch from '@/components/BaseSearch';
import DelDialog from '@/components/DelDialog';
import * as dataService from 'api/systemOperationLog.js';
import EchartExportFile from '@c/EchartExportFile';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { downloadFile } from '@/utils/downloadFile';
export default {
  data: () => ({
    fullHeight: window.innerHeight,
    // 搜索组件数据
    searchForm: [
      { placeholder: '用户名称', value: '', type: 'text' },
      { placeholder: '登录账号', value: '', type: 'text' },
      { placeholder: '模块', value: '', type: 'text' },
      { placeholder: '操作数据', value: '', type: 'text' },
      { placeholder: '时间', value: [], type: 'date' },
      { placeholder: '客户端IP', value: '', type: 'text' }
    ],
    // 搜索参数
    searchData: {
      listName: '',
      businessVar: '',
      appId: null,
      listType: ''
    },
    // 分页变量
    pageNum: 1,
    pageSize: 10,
    queryPageLength: 0,
    perPageNums: 10,
    totalItems: 0,
    perPageItems: [5, 10, 15, 20, 50, 100],
    dialogDel: false,
    // 列表头
    paramHeader: [
      { text: '用户名称', value: 'realName', sortable: false, width: 150 },
      { text: '登录账号', value: 'username', sortable: false, width: 100 },
      { text: '所属机构', value: 'departmentName', sortable: false, width: 100 },
      { text: '模块', value: 'module', sortable: false, width: 200 },
      { text: '功能', value: 'function', sortable: false, width: 150 },
      { text: '操作数据', value: 'operateMsg', sortable: false, width: 150 },
      { text: '操作状态', value: 'status', sortable: false, width: 100 },
      { text: '操作时间', value: 'operateTime', sortable: false },
      { text: '客户端IP', value: 'clientIp', sortable: false }
    ],
    // 列表内容
    paramItems: [],
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    // form表单
    valid: true,
    lazy: false,
    clearDate: false,
    counter: 0, // 搜索条件是否展开
    newDate: null,
    exportBtnOperationLog: '/exportBtnOperationLog',
    isActiveBtnList: true
  }),
  components: {
    BaseSearch,
    DelDialog,
    EchartExportFile
  },
  filters: {
  },
  watch: {
    // appId: {
    //   handler: function (newVal, oldVal) {
    //     Promise.all([
    //       this.search()
    //     ]);
    //   }
    // },
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 140;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  computed: {
    ...mapGetters([
      'appName'
    ]),
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 200;
      }
    }
  },
  created () {
    this.search();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    // 导出等级占比Excel与csv
    exportData (arg, fileType) {
      this.isActiveBtnList = false;
      let fileName = arg[0];
      let startTime = '';
      let endTime = '';
      if (this.searchForm[4].value.length > 0) {
        startTime = this.searchForm[4].value.split(' 至 ')[0] + ' 00:00:00';
        endTime = this.searchForm[4].value.split(' 至 ')[1] + ' 23:59:59';
      }
      let params = {
        exportType: fileType,
        realName: this.searchForm[0].value, // 用户名称
        userName: this.searchForm[1].value, // 账号
        module: this.searchForm[2].value, // 模块名称
        operateMsg: this.searchForm[3].value, // 操作数据
        clientIp: this.searchForm[5].value, // 客户端Ip
        startTime: startTime,
        endTime: endTime,
        businessOrgName: ''
      };
      dataService.exportLogData(params).then(res => {
        let blob = new Blob([res.data]);
        downloadFile(blob, fileName);
        this.isActiveBtnList = true;
      }).catch(() => {
        this.isActiveBtnList = true;
      });
    },
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 点击搜索按钮
    search ($event) {
      this.pageNum = 1;
      this.getDataList($event);
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.searchForm = [
        { placeholder: '用户名称', value: '', type: 'text' },
        { placeholder: '登录账号', value: '', type: 'text' },
        { placeholder: '模块', value: '', type: 'text' },
        { placeholder: '操作数据', value: '', type: 'text' },
        { placeholder: '时间', value: [], type: 'date' },
        { placeholder: '客户端IP', value: '', type: 'text' }
      ];
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this.getDataList();
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 查询列表
    async getDataList ($event) {
      let params = {};
      // let startTime = '';
      // let endTime = '';
      let dateAry = {
        startTime: '',
        endTime: ''
      };
      if ($event !== undefined) {
        console.log($event);
        if ($event[4].value.length > 0) {
          dateAry = {
            startTime: $event[4].value.split(' 至 ')[0] + ' 00:00:00',
            endTime: $event[4].value.split(' 至 ')[1] + ' 23:59:59'
          };
        }
        params = Object.assign({}, dateAry, {
          realName: $event[0].value, // 用户名称
          userName: $event[1].value, // 账号
          module: $event[2].value, // 模块名称
          operateMsg: $event[3].value, // 操作数据
          clientIp: $event[5].value, // 客户端Ip
          curPage: this.pageNum,
          pageSize: this.perPageNums
        });
      } else {
        let datesStr = this.searchForm[4].value;
        if (datesStr.length > 0) {
          dateAry = {
            startTime: datesStr.split(' 至 ')[0] + ' 00:00:00',
            endTime: datesStr.split(' 至 ')[1] + ' 23:59:59'
          };
        }
        params = Object.assign({}, dateAry, {
          realName: this.searchForm[0].value, // 用户名称
          userName: this.searchForm[1].value, // 账号
          module: this.searchForm[2].value, // 模块名称
          operateMsg: this.searchForm[3].value, // 操作数据
          clientIp: this.searchForm[5].value, // 客户端Ip
          curPage: this.pageNum,
          pageSize: this.perPageNums
        });
      }
      const res = await dataService.searchListData(params);
      if (res.data.code === 200) {
        if (res.data.data.list.length > 0) {
          this.paramItems = res.data.data.list;
        } else {
          this.paramItems = [];
        }
        this.totalItems = res.data.data.total;
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNums);
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = res.data.msg;
        this.snackbarServeColor = 'error';
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
</style>
