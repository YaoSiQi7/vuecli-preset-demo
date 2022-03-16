<!----------  @author: YinGuoZheng  ----------->
<!----------  @updated_at: 2020-05-07  ----------->
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
            接口日志
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
            :fileName="appName + '-接口日志'"
            style="position: absolute; right: 16px; z-index: 4"
            @exportExcel="exportData(arguments, 'excel')"
            @exportCSV="exportData(arguments, 'csv')"
            v-if="hasPermission(exportLogBtn)"
          ></echart-export-file>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom v-if="hasPermission(showLogBtn)">
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
        <v-tooltip bottom v-if="hasPermission(showInterfaceLogBtn)">
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
          <span>查看结果</span>
        </v-tooltip>
      </template>
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
    <!-- 查看参数&&查看结果 -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent scrollable max-width="700px">
          <v-card>
            <v-card-title>
              <v-toolbar-title v-show="isParams">
                查看请求参数
              </v-toolbar-title>
              <v-toolbar-title v-show="isResult">
                查看请求结果
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
                  JSON.stringify(paramsJsonData, null, 4)
                }}</pre>
                <pre v-show="isResult">{{
                  JSON.stringify(resultJsonData, null, 4)
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
import * as dataService from '../../api/interfaceLog.js';
import EchartExportFile from '@c/EchartExportFile';
import { mapGetters } from 'vuex';
import moment from 'moment';
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
        {
          placeholder: '接口类型',
          value: '',
          type: 'select',
          options: [
            { text: '全部', value: '' }
          ]
        },
        { placeholder: '请求状态', value: '', type: 'text' },
        { placeholder: '客户端IP', value: '', type: 'text' },
        { placeholder: '状态信息', value: '', type: 'text' },
        { placeholder: '请求标识', value: '', type: 'text' },
        {
          placeholder: '请求时间',
          value: [],
          type: 'date'
        },
        { placeholder: '处理时间', value: '', type: 'text' }
        // { placeholder: '机构号', value: '', type: 'text' }
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
      paramsJsonData: {},
      resultJsonData: {},
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
        { text: '接口类型', value: 'requestType', width: '120px', sortable: false },
        { text: '请求状态', value: 'status', width: '90px', sortable: false },
        { text: '客户端IP', value: 'clientIp', width: '120px', sortable: false },
        { text: '状态信息', value: 'statusInfo', width: '90px', sortable: false },
        { text: '处理时间(ms)', value: 'processTime', width: '110px', sortable: false },
        { text: '请求标识', value: 'opId', width: '130px', sortable: false },
        { text: '请求时间', value: 'uniqueId', width: '180px', sortable: false },
        // { text: '机构号', value: 'business_org_code', width: '100px', sortable: false },
        { text: '操作', value: 'actions', width: '80px', sortable: false }
      ],
      // 增加按钮权限
      exportLogBtn: '/exportInterfaceLogButton', // 导出按钮是否展示
      showLogBtn: '/showInterfaceLogParamButton', // 表格查看差数按钮
      showInterfaceLogBtn: '/showInterfaceLogResultButton', // 表格查看结果按钮
      isActiveBtnList: true
    };
  },
  computed: {
    ...mapGetters([
      'appId',
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
    this.querySearchSelect();
    this.initQueryGetList();
  },
  methods: {
    // 导出等级占比Excel与csv
    exportData (arg, fileType) {
      this.isActiveBtnList = false;
      let fileName = arg[0];
      let params = {
        exportType: fileType,
        appId: '',
        requestType: this.searchForm[0].value === undefined ? '' : this.searchForm[0].value,
        statusInfo: this.searchForm[3].value === undefined ? '' : this.searchForm[3].value,
        status: this.searchForm[1].value === undefined ? '' : this.searchForm[1].value,
        opId: this.searchForm[4].value === undefined ? '' : this.searchForm[4].value,
        clientIp: this.searchForm[2].value === undefined ? '' : this.searchForm[2].value,
        processTime: this.searchForm[6].value === undefined ? '' : this.searchForm[6].value,
        startTime: this.searchForm[5].value.length > 0 ? this.searchForm[5].value.slice(0, 10) + ' 00:00:00' : '',
        endTime: this.searchForm[5].value.length > 0 ? this.searchForm[5].value.slice(13, 23) + ' 23:59:59' : '',
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
    // 查看结果
    async seeResult (item) {
      const params = {
        id: item.id,
        indexName: item.indexName
      };
      try {
        const response = await dataService.seeResult(params);
        if (response.data.code === 200) {
          this.dialog = true;
          this.isParams = false;
          this.isResult = true;
          this.resultJsonData = JSON.parse(response.data.data.data);
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 查看参数
    async seeParams (item) {
      const params = {
        id: item.id,
        indexName: item.indexName
      };
      try {
        const response = await dataService.seeParams(params);
        if (response.data.code === 200) {
          this.dialog = true;
          this.isParams = true;
          this.isResult = false;
          this.paramsJsonData = JSON.parse(response.data.data.data);
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 弹框确定
    save () {
      this.dialog = false;
    },
    // 弹框取消
    cancel () {
      this.dialog = false;
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
        appId: '',
        requestType: this.searchForm[0].value === undefined ? '' : this.searchForm[0].value,
        statusInfo: this.searchForm[3].value === undefined ? '' : this.searchForm[3].value,
        status: this.searchForm[1].value === undefined ? '' : this.searchForm[1].value,
        opId: this.searchForm[4].value === undefined ? '' : this.searchForm[4].value,
        clientIp: this.searchForm[2].value === undefined ? '' : this.searchForm[2].value,
        processTime: this.searchForm[6].value === undefined ? '' : this.searchForm[6].value,
        startTime: this.searchForm[5].value.length > 0 ? this.searchForm[5].value.slice(0, 10) + ' 00:00:00' : '',
        endTime: this.searchForm[5].value.length > 0 ? this.searchForm[5].value.slice(13, 23) + ' 23:59:59' : '',
        // businessOrgName: this.searchForm[7].value === undefined ? '' : this.searchForm[7].value,
        startIndex: this.pageNum,
        pageSize: this.pageSize
      };
      try {
        const response = await dataService.queryTableList(params);
        if (response.data.code === 200) {
          if (response.data.data.data.length > 0) {
            this.logListData = response.data.data.data;
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
    // 获取下拉参数
    async querySearchSelect () {
      try {
        const response = await dataService.querySelect({ appId: '' });
        if (response.data.code === 200) {
          if (response.data.data.list.length > 0) {
            response.data.data.list.forEach((item, index, ary) => {
              this.searchForm[0].options.push({
                text: item.name,
                value: item.identifier
              });
            });
          } else {
            this.searchForm[0].options.push({
              text: [],
              value: []
            });
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
