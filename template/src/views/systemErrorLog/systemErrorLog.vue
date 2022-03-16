<!----------  @author: RenGuoPeng  ----------->
<!----------  @updated_at: 2021-10-12  ----------->
<!----------  @version: 2.0  ----------->

<template>
  <div class="enu-content fill-height">
    <!-- 条件查询 -->
    <base-search
      :fieldList="searchForm"
      @search="search($event)"
      @reset="resetSearchData($event)"
      :clearDate="clearDate"
      @change="panelCounter"
    ></base-search>
    <v-data-table
      ref="nameListSetTable"
      :headers="logListSetHeaders"
      :items="logListData"
      hide-default-footer
      :fixed-header="true"
      :items-per-page="perPageNum"
      no-data-text="没有匹配数据"
      class="elevation-3 mt-3"
      :height="tableHeight"
    >
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title style="font-size:18px">
            系统错误日志
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
            :fileName="appName + '-系统错误日志'"
            style="position: absolute; right: 16px; z-index: 4"
            @exportExcel="exportData(arguments, 'excel')"
            @exportCSV="exportData(arguments, 'csv')"
            v-if="hasPermission(exportLogBtn)"
          ></echart-export-file>
        </v-toolbar>
      </template>
      <!-- // 请求参数 -->
      <template v-slot:item.param="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-2 icon-primary"
              v-on="on"
              color="primary"
              @click="seeParams(item)"
            >
              mdi-file-document-outline
            </v-icon>
          </template>
          <span>查看参数</span>
        </v-tooltip>
      </template>
      <!-- // 异常信息 -->
      <template v-slot:item.msg="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-2 icon-primary"
              v-on="on"
              color="primary"
              @click="seeResult(item)"
            >
              mdi-file-check-outline
            </v-icon>
          </template>
          <span>查看信息</span>
        </v-tooltip>
      </template>
      <!-- // 分页 -->
      <template v-slot:footer>
        <v-divider></v-divider>
        <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
          <div class="footer__select">
            每页
            <span>
              <v-select
                v-model="perPageNum"
                item-text="fieldName"
                item-value="fieldField"
                :items="perPageItems"
                dense
                width="27px"
                no-data-text="没有匹配数据"
                @change="pageChange"
              /> </span
            >条
            <span style="margin-left: 15px">共{{ totalItems }}条</span>
            <v-spacer />
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
    <!-- 查看参数&&查看信息 -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent scrollable max-width="700px">
          <v-card>
            <v-card-title>
              <v-toolbar-title v-show="isParams">
                查看请求参数
              </v-toolbar-title>
              <v-toolbar-title v-show="isResult">
                查看异常信息
              </v-toolbar-title>
              <div class="flex-grow-1" />
              <v-btn icon dark @click="cancel">
                <v-icon color="#CCCCCC">mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="max-height: 600px">
              <v-container>
                <pre v-show="isParams">{{
                  paramsJsonData
                }}</pre>
                <pre v-show="isResult">{{
                  resultJsonData
                }}</pre>
              </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <div class="flex-grow-1" />
              <div>
                <v-btn class="primary mr-4" @click="cancel"> 关闭 </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- 提示语 -->
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
import * as dataService from '../../api/systemErrorlog.js';
import EchartExportFile from '@c/EchartExportFile';
import { mapGetters } from 'vuex';
import { downloadFile } from '@/utils/downloadFile';
export default {
  components: {
    BaseSearch,
    EchartExportFile
  },
  data () {
    return {
      counter: 0,
      fullHeight: window.innerHeight,
      // 提示语
      isSnackbarTop: true,
      timeout: 2000,
      // 搜索条件
      searchForm: [
        { placeholder: '用户名称', value: '', type: 'text' },
        { placeholder: '请求标识', value: '', type: 'text' },
        { placeholder: '请求URL', value: '', type: 'text' },
        { placeholder: '请求方法', value: '', type: 'text' },
        {
          placeholder: '请求时间',
          value: [],
          type: 'date'
        },
        { placeholder: '客户端IP', value: '', type: 'text' }
      ],
      clearDate: false,
      // 分页
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 1,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 查看
      dialog: false,
      isParams: false,
      isResult: false,
      paramsJsonData: '',
      resultJsonData: '',
      // 搜索条件
      resetData: {},
      // 列表数据
      logListData: [],
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      // 表头
      logListSetHeaders: [
        { text: '用户名称', value: 'userName', width: '120px', sortable: false },
        { text: '请求标识', value: 'id', width: '90px', sortable: false },
        { text: '请求URL', value: 'url', width: '120px', sortable: false },
        { text: '请求方法', value: 'method', width: '90px', sortable: false },
        { text: '请求参数', value: 'param', width: '110px', sortable: false },
        { text: '异常信息', value: 'msg', width: '110px', sortable: false },
        { text: '请求时间', value: 'reqTime', width: '100px', sortable: false },
        { text: '客户端IP', value: 'clientIp', width: '80px', sortable: false }
      ],
      // 增加按钮权限
      exportLogBtn: '/exportErrorButton', // 导出按钮是否展示
      isActiveBtnList: true
    };
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
        return this.fullHeight - 266;
      }
    }
  },
  filters: {
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  watch: {
    search (val) {
      if (val) {
        this.queryPageLength = 0;
      } else {
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      }
    },
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 136;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  created () {
    this.initQueryGetList();
  },
  methods: {
    // 导出等级占比Excel与csv
    exportData (arg, fileType) {
      this.isActiveBtnList = false;
      let fileName = arg[0];
      let params = {
        exportType: fileType,
        userName: this.searchForm[0].value === undefined ? '' : this.searchForm[0].value,
        id: this.searchForm[1].value === undefined ? '' : this.searchForm[1].value,
        url: this.searchForm[2].value === undefined ? '' : this.searchForm[2].value,
        method: this.searchForm[3].value === undefined ? '' : this.searchForm[3].value,
        reqStartTime: this.searchForm[4].value.length > 0 ? this.searchForm[4].value.slice(0, 10) + ' 00:00:00' : '',
        reqEndTime: this.searchForm[4].value.length > 0 ? this.searchForm[4].value.slice(13, 23) + ' 23:59:59' : '',
        clientIp: this.searchForm[5].value === undefined ? '' : this.searchForm[5].value
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
    // 查看参数
    seeParams (item) {
      this.dialog = true;
      this.isParams = true;
      this.isResult = false;
      this.paramsJsonData = item.param;
    },
    // 查看信息
    seeResult (item) {
      this.dialog = true;
      this.isParams = false;
      this.isResult = true;
      this.resultJsonData = item.msg;
    },
    // 弹框确定
    save () {
      this.dialog = false;
    },
    // 弹框取消
    cancel () {
      this.dialog = false;
      this.paramsJsonData = '';
      this.resultJsonData = '';
    },
    // 查询
    search ($event) {
      this.pageNum = 1;
      this.initQueryGetList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      // this.$refs.searchForm.reset();
      for (let i = 0; i < this.searchForm.length; i++) {
        this.searchForm[i].value = '';
      }
      this.searchForm[5] = {
        placeholder: '请求时间',
        value: [],
        type: 'date'
      };
      this.pageNum = 1;
      this.initQueryGetList();
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 获取列表
    async initQueryGetList () {
      let params = {
        userName: this.searchForm[0].value === undefined ? '' : this.searchForm[0].value,
        id: this.searchForm[1].value === undefined ? '' : this.searchForm[1].value,
        url: this.searchForm[2].value === undefined ? '' : this.searchForm[2].value,
        method: this.searchForm[3].value === undefined ? '' : this.searchForm[3].value,
        reqStartTime: this.searchForm[4].value.length > 0 ? this.searchForm[4].value.slice(0, 10) + ' 00:00:00' : '',
        reqEndTime: this.searchForm[4].value.length > 0 ? this.searchForm[4].value.slice(13, 23) + ' 23:59:59' : '',
        clientIp: this.searchForm[5].value === undefined ? '' : this.searchForm[5].value,
        curPage: this.pageNum,
        pageSize: this.pageSize
      };
      try {
        const response = await dataService.queryTableList(params);
        if (response.data.code === 200) {
          if (response.data.data.list.length > 0) {
            this.logListData = response.data.data.list;
            this.totalItems = response.data.data.total;
            this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          } else {
            this.logListData = [];
            this.totalItems = 0;
            this.queryPageLength = 0;
          }
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.initQueryGetList();
    },
    // 页数
    pageChange (p) {
      this.pageSize = p;
      this.pageNum = 1;
      this.initQueryGetList();
    }
  }
};
</script>
<style>
</style>
