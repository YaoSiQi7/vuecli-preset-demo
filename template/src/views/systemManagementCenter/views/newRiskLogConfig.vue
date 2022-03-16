<!----------  @author: Xin Tan  ----------->
<!----------  @updated_at: 2020-04-09  ----------->
<!----------  @version: 0.2  ----------->

<template>
  <div ref="bodyDiv">
    <base-search
      :fieldList="searchParam"
      @search="search($event)"
      @reset="resetSearchData($event)"
      @change="panelCounter"
    ></base-search>
    <!-- 模块展示用的数据表格 -->
    <v-data-table
      :headers="riskLogheaders"
      :items="riskLogItems"
      no-data-text="没有匹配数据"
      :items-per-page="perPageNum"
      hide-default-footer
      class="mt-3 elevation-3 tableId"
      :height="tableHeight"
      :fixed-header="true"
    >
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar
          flat
          height="60px"
        >
          <v-toolbar-title style="font-size:18px">
            风控日志配置
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-btn
            color="primary"
            class="mr-1 mt-1"
            v-if="hasPermission(addLogBtn)"
            @click="addConfig"
          >
            添加
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.moduleName="{ item }">
        <span :style="{width: widthNumber}" class="ellipsis" :title="item.moduleName">{{ item.moduleName }}</span>
      </template>
      <template v-slot:item.type="{ item }">
        {{ item.type | filterLogType }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          color="primary"
          v-if="hasPermission(editLogdBtn)"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          class="mr-2"
          color="primary"
          v-if="hasPermission(deleteLogBtn)"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
        <v-icon
          small
          color="primary"
          v-if="hasPermission(detailsLogBtn)"
          @click="editGroup(item)"
        >
          mdi-card-account-details
        </v-icon>
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
              @change="onPageSizeChange"
            />
            </span>条
            <span style="margin-left:15px">共{{ totalItems }}条</span>
            <v-spacer/>
            <v-pagination
              class="d-flex justify-end pagination"
              v-model="pageNum"
              :length="queryPageLength"
              @input="onPageChange"
              :total-visible="7"
            />
          </div>
        </div>
      </template>
    </v-data-table>
    <!-- 页面步骤条的弹窗 -->
    <v-dialog v-model="addEditDialog" scrollable persistent>
      <v-card outlined>
        <v-card-title>
          <v-toolbar-title>设定参数</v-toolbar-title>
          <div class="flex-grow-1"/>
          <v-btn icon @click="cancelConfig">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-stepper v-model="stepper" style="height:90%">
              <!-- stepper 的 步骤条 -->
              <v-stepper-header>
                <v-stepper-step :complete="stepper > 1" step="1">设定参数</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepper > 2" step="2">选择字段</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step :complete="stepper > 3" step="3">添加筛选条件</v-stepper-step>
                <v-divider></v-divider>
              </v-stepper-header>
              <!-- stepper 内容 -->
              <v-stepper-items>
                <!-- 新建/编辑一条配置 -->
                <v-stepper-content step="1" class="elevation-0">
                  <v-card class="ma-2 elevation-0" style="height: 50vh">
                    <v-card-title>
                      <v-toolbar-title>{{ addOrEditHeader.name }}</v-toolbar-title>
                      <div class="flex-grow-1"/>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-form ref="configForm" v-model="valid" :lazy-validation="lazy" style="height: 46vh; overflow-y: auto;">
                      <v-card-text>
                        <!-- 新建模式 -->
                        <v-container v-if="addOrEditHeader.isEdit !== true">
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                :rules="configNameRules"
                                name="configName"
                                label="配置名称"
                                dense
                                outlined
                                :required="true"
                                class=""
                                v-model.trim="moduleForm.moduleName"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="configDesc"
                                label="配置描述"
                                dense
                                outlined
                                :required="true"
                                v-model.trim="moduleForm.description"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-select
                                :rules="[v => !!v || '字段名不能为空']"
                                :items="appList"
                                label="应用名称"
                                dense
                                outlined
                                v-model="moduleForm.appId"
                                @change="appListChanged(moduleForm.appId)"
                                no-data-text="没有匹配数据"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="appId"
                                label="应用标识"
                                dense
                                outlined
                                disabled
                                :required="true"
                                v-model.trim="moduleForm.appNo"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-select
                                :rules="[v => !!v || '字段名不能为空']"
                                name="dataType"
                                :items="dataTypeList"
                                label="数据类型"
                                dense
                                outlined
                                v-model="moduleForm.type"
                                item-disabled="disable"
                                no-data-text="没有匹配数据"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                        <!-- 编辑模式 -->
                        <v-container v-else>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                :rules="configNameRules"
                                name="configName"
                                label="配置名称"
                                dense
                                outlined
                                :required="true"
                                class=""
                                v-model.trim="moduleForm.moduleName"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                :rules="[v => !!v || '字段名不能为空']"
                                name="configName"
                                label="配置id"
                                dense
                                outlined
                                :required="true"
                                class=""
                                disabled
                                v-model.trim="moduleForm.moduleNo"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="configDesc"
                                label="配置描述"
                                dense
                                outlined
                                :required="true"
                                v-model.trim="moduleForm.description"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                :items="appList"
                                label="应用名称"
                                dense
                                outlined
                                disabled
                                v-model="moduleForm.appName"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="appId"
                                label="应用标识"
                                dense
                                outlined
                                disabled
                                :required="true"
                                v-model.trim="moduleForm.appNo"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-select
                                name="dataType"
                                :items="dataTypeList"
                                label="数据类型"
                                dense
                                outlined
                                v-model="moduleForm.type"
                                no-data-text="没有匹配数据"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </v-form>
                  </v-card>
                  <v-btn
                    color="primary"
                    @click="stepper = 2"
                    :disabled="!valid"
                  >
                    下一步
                  </v-btn>
                </v-stepper-content>
                <v-stepper-content step="2" >
                  <v-card style="" class="elevation-0">
                    <v-layout row wrap>
                      <v-flex xs3 sm3 md3 lg3>
                        <v-card class="mr-1 box_shadow">
                          <v-card-title class="base_tableHeaderLabel_name">
                            风控日志字段数据源
                          </v-card-title>
                          <v-card-text style="height: 46vh; overflow-y: auto;">
                            <v-text-field
                              class="mt-2"
                              v-model="searchHeader"
                              append-icon="mdi-magnify"
                              label="输入字段名搜索"
                              clearable
                              single-line
                              hide-details
                              outlined dense
                            ></v-text-field>
                            <v-data-table
                              :items-per-page="1000"
                              class="elevation-0"
                              :headers="confListHeader"
                              :items="configurableFieldList"
                              show-select
                              hide-default-header
                              hide-default-footer
                              v-model="selectedHeader"
                              item-key="id"
                              :search="searchHeader"
                              no-data-text="没有匹配数据"
                              no-results-text="没有匹配数据"
                            >
                            </v-data-table>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                      <v-flex xs9 sm3 md9 lg9>
                        <v-card class="ml-1">
                          <v-card-title class="base_tableHeaderLabel_name">
                            已选字段: <div class="headerColor ml-2">{{ selectedHeader.length }}</div>
                          </v-card-title>
                        </v-card>
                        <v-data-table
                          :headers="previewHeader"
                          hide-default-footer
                          class="elevation-0 ml-2 mt-2"
                          no-data-text="预览表头排列"
                        ></v-data-table>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <div style="margin-top: 14px;">
                    <v-btn text @click="stepper -= 1">上一步</v-btn>
                    <v-btn color="primary" @click="stepper = 3">下一步</v-btn>
                  </div>
                </v-stepper-content>
                <v-stepper-content step="3" class="elevation-0">
                  <v-card style="height: 50vh" class="ma-2 elevation-0">
                    <v-layout row wrap>
                      <v-flex sm12 md12 lg12 xl12>
                        <v-card class="elevation-0">
                          <v-card-title>
                            设置筛选条件
                          </v-card-title>
                          <v-card-text style="height: 42vh; overflow-y: auto; padding-bottom: 0;" class="elevation-0">
                            <v-data-table
                              :headers="configHeader"
                              :items="groupItems"
                              no-data-text="没有匹配数据"
                              :items-per-page="20"
                              hide-default-footer
                            >
                              <template v-slot:item.fieldName="{ item }">
                                {{ item.fieldName }}
                              </template>
                              <template v-slot:item.isSearch="{ item }">
                                <v-switch v-model="item.isSearch"
                                  :true-value="1"
                                  :false-value="0"></v-switch>
                              </template>
                              <template v-slot:item.searchType="{ item }">
                                <v-select
                                  :items="filterTypeItems"
                                  v-model="item.searchType"
                                  item-text="name"
                                  item-value="value"
                                  outlined dense
                                  no-data-text="没有匹配数据"
                                ></v-select>
                              </template>
                              <template v-slot:item.checkType="{ item }">
                                <v-select
                                  :items="validTypeItems"
                                  v-model="item.checkType"
                                  item-text="name"
                                  item-value="value"
                                  outlined dense
                                  no-data-text="没有匹配数据"
                                ></v-select>
                              </template>
                            </v-data-table>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-card>
                  <div style="margin-top: 14px;">
                    <v-btn text @click="stepper -= 1">上一步</v-btn>
                    <v-btn color="primary" @click="saveConfig">完成</v-btn>
                  </div>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- 删除组件 -->
    <del-dialog
      :isDialogShow="delDialogSwitch"
      @cancelDel="delDialogCancel"
      @confimDel="delDialogConfirm"></del-dialog>
  </div>
</template>
<script>
import BaseCreate from '@/components/BaseCreate';
import BaseSearch from '@/components/BaseSearch';
import DelDialog from '@/components/DelDialog';
import { VALID_TYPE_ITEMS, FILTER_TYPE_ITEMS } from 'utils/selectDropDownConst.js';
import * as dataService from '@/api/riskLogConfig';
import { getEnumeList as getAppList } from '@/api/ApplyManage.js';
import { BASE_NAME, BASE_VALUE, BASE_NAME_TEXT, BASE_VALUE_TEXT } from '../../../utils/validate.js';

export default {
  name: 'newRiskLogConfig',
  components: {
    BaseSearch,
    DelDialog
  },
  created () {
    this.getPath();
    this.getWidth();
    // 获取页面所有应用的列表
    this.getRiskLogItems();
    // 获取可以创建数据的列表
    // this.getFilteredAppList();
    // 获取数据字段资源池
    this.getConfFields();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('resize', this.getWidth);
    this.getCompanyList();
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('resize', this.getWidth);
  },
  data () {
    return {
      configNameRules: [v => !!v || '不能为空或只有空格', v => BASE_NAME.test(v) || BASE_NAME_TEXT],
      counter: 0,
      fullHeight: window.innerHeight,
      lazy: false,
      valid: true,
      validTypeItems: VALID_TYPE_ITEMS,
      filterTypeItems: FILTER_TYPE_ITEMS,
      searchHeader: '',
      selectedHeader: [],
      searchField: '',
      filteredItems: [],
      confListHeader: [
        { text: '表头1', value: 'fieldName' }
      ],
      // 模块表头
      riskLogheaders: [
        {
          text: '配置名称',
          align: 'left',
          width: '30%',
          sortable: true,
          value: 'moduleName'
        },
        { text: '配置标识', value: 'moduleNo' },
        { text: '应用名称', value: 'appName' },
        { text: '数据类型', value: 'type' },
        { text: '创建时间', value: 'createTime' },
        { text: '操作类型', value: 'actions', sortable: false }
      ],
      currentDelMode: '', // 删除模式, 用于判断是删除module还是分组
      delDialogSwitch: false, // 删除弹窗开关
      moduleId: '', // 当前记录的id, 编辑/删除使用此id作为当前记录的标识
      riskLogItems: [],
      pageNum: 1,
      queryPageLength: 0, // 总共有几页
      perPageNum: 10, // 每页多少条
      totalItems: 1, // 数据的总条数
      perPageItems: [5, 10, 15, 20, 50, 100],
      appList: [], // 配置第一步可用app 列表,
      dataTypeList: [],
      configurableFieldList: [],
      configDataType: [
        { text: '动账', value: '1' },
        { text: '非动账', value: '0' }
      ],
      // 搜索组件的数据
      searchParam: [
        { type: 'text', placeholder: '配置名称', value: '' },
        { type: 'text', placeholder: '配置标识', value: '' },
        {
          type: 'select',
          placeholder: '应用名称',
          value: null,
          options: [
            { text: '全部应用', value: '' }
          ]
        },
        {
          type: 'select',
          placeholder: '数据类型',
          value: '',
          options: [
            { text: '动账类', value: '1' },
            { text: '非动账类', value: '0' }
          ]
        }
      ],
      stepper: 1, // 默认步骤条打开第一步
      addEditDialog: false, // 新建/编辑弹窗
      addOrEditHeader: { // 新建/编辑 模块表头
        name: '设定参数',
        value: 'add',
        isEdit: false
      },
      // 新建编辑 模块form
      moduleForm: {
        moduleName: '',
        moduleNo: '',
        description: '',
        appId: '',
        appNo: '',
        type: '',
        logType: ''
      },
      configHeader: [
        { text: '已选字段', value: 'fieldName' },
        { text: '作为筛选条件', value: 'isSearch' },
        { text: '筛选条件类型', value: 'searchType' },
        { text: '校验类型', value: 'checkType' }
      ],
      // 增加按钮权限
      addLogBtn: '/addFieldConfigButton', // 添加按钮是否展示
      editLogdBtn: '/editFieldConfigButton', // 当编辑按钮展示时，控制baseCreate中的编辑开关
      deleteLogBtn: '/deleteFieldConfigButton', // 删除按钮权限
      detailsLogBtn: '/deployRiskControlLogDetailButton', // 详情按钮权限
      widthNumber: ''
    };
  },
  methods: {
    getWidth () {
      let _this = this;
      this.$nextTick(function () {
        _this.widthNumber = (_this.$refs.bodyDiv.clientWidth * 0.3 - 32) + 'px';
      });
      return _this.widthNumber;
    },
    // 获取所有公司列表
    async getCompanyList () {
      let response = await getAppList();
      if (response) {
        let res = response.data.data;
        if (res.records) {
          for (let i in res.records) {
            let item = {};
            item['text'] = res.records[i].appName;
            item['value'] = res.records[i].appTag;
            this.searchParam[2].options.push(item);
          }
        }
      }
    },
    // 获取页面所有应用的列表
    async getRiskLogItems (startIndex = 1, pageSize = 10) {
      let pageParams = {
        startIndex: startIndex,
        pageSize: pageSize,
        moduleSrc: 'risk'
      };
      let params = Object.assign({}, pageParams, this.searchForm);
      let response = await dataService.queryFieldData(params);
      this.riskLogItems = response.data.data.list;
      this.totalItems = response.data.data.total;
      this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      this.moduleForm = {
        moduleName: '',
        moduleNo: '',
        description: '',
        appId: '',
        appNo: '',
        type: '',
        logType: ''
      };
      this.getFilteredAppList();// 获取可以创建数据的列表
    },
    // 获取模块(每个应用动账/非动账)列表 翻页处理
    onPageChange (page) {
      this.pageNum = page;
      this.getRiskLogItems(this.pageNum, this.perPageNum);
    },
    onPageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.getRiskLogItems(this.pageNum, pageSize);
    },
    appListChanged (item) {
      let filteredApp = this.appList.find(i => i.value === item);
      if (filteredApp.appNo) {
        this.moduleForm.appNo = filteredApp.appNo;
      }
      this.dataTypeList = []; // 清空数组
      this.disabledDataTypeList = [];
      // 1 动账, 0 非动账
      // this.dataTypeList = filteredApp.type;
      for (let i of filteredApp.type) {
        if (i.type === '0') {
          i['text'] = '非动账';
          i['value'] = '0';
        } else if (i.type === '1') {
          i['text'] = '动账';
          i['value'] = '1';
        }
        this.dataTypeList.push(i);
      }
    },
    // 获取可以创建数据的列表
    async getFilteredAppList () {
      this.appList = [];
      let params = {};
      let response = await dataService.queryFilteredApps(params);
      for (let i of response.data.data) {
        let item = {};
        item['text'] = i.appName;
        item['value'] = i.appId;
        item['type'] = i.type.risk;
        item['appNo'] = i.appNo;
        this.appList.push(item);
      }
    },
    // 获取数据字段资源池
    async getConfFields () {
      let response = await dataService.queryConfiguarableFields();
      this.configurableFieldList = response.data.data;
    },
    async editItem (item) {
      if (this.$refs.configForm) {
        this.$refs.configForm.reset();
      }
      // this.appListChanged(item.appId);
      this.addOrEditHeader.isEdit = true;
      let moduleId = item.id;
      this.moduleId = item.id;
      this.addOrEditHeader.name = '编辑';
      this.moduleForm = item;
      this.dataTypeList = this.configDataType;
      // get detail by item.id
      this.queryTableHeader(moduleId);
      this.addEditDialog = true;
    },
    async queryTableHeader (moduleId) {
      let params = { id: moduleId };
      let response = await dataService.queryTableHeader(params);
      // 需要: fieldName 中文, fieldValue 英文
      // 返回: filedText 中文, fieldName 英文
      let data = response.data.data;
      data.sort((a, b) => a.sortNo - b.sortNo);
      this.selectedHeader = [];
      for (let i in data) {
        let item = Object.assign({}, data[i]);
        if (!item.fieldValue) {
          item['fieldValue'] = item.fieldName;
        }
        if (item.fieldSrcId) {
          item['id'] = item.fieldSrcId;
        }
        if (item.fieldText) {
          item['fieldName'] = item.fieldText;
          delete item.fieldText;
        }
        this.selectedHeader.push(item);
      }
    },
    // 搜索框
    search ($event) {
      this.getRiskLogItems();
    },
    resetSearchData () {
      this.searchParam = [
        { type: 'text', placeholder: '配置名称', value: '' },
        { type: 'text', placeholder: '配置标识', value: '' },
        {
          type: 'select',
          placeholder: '应用名称',
          value: null,
          loading: true,
          options: [
            { text: '全部应用', value: '' }
          ]
        },
        {
          type: 'select',
          placeholder: '数据类型',
          value: '',
          options: [
            { text: '动账类', value: '1' },
            { text: '非动账类', value: '0' }
          ]
        }
      ];
      this.getRiskLogItems();
      this.getCompanyList();
      this.searchParam[2].loading = false;
    },
    // 触发新建的弹窗
    addConfig () {
      if (this.$refs.configForm) {
        this.$refs.configForm.reset();
      }
      this.moduleId = '';// 新建初始化id
      this.addOrEditHeader.isEdit = false;
      this.addEditDialog = true;
    },
    // 关闭新建的弹窗
    cancelConfig () {
      // 获取最新的数据列表
      this.$refs.configForm.reset();
      this.stepper = 1;
      // this.pageNum = 1;
      this.getRiskLogItems(this.pageNum);
      this.addEditDialog = false;
    },
    // 保存配置弹窗
    async saveConfig () {
      try {
        if (!this.moduleId) {
          // 新建模式, 需要先保存模块, 获取模块ID后才能继续操作
          let response = await this.saveModule(this.moduleForm);
          if (response.data.code === 200) {
            let moduleId = response.data.data;
            // 保存模块成功, 然后保存表头和搜索
            this.saveTitle(moduleId);
          }
        } else {
          // 编辑模式, 已有当前操作的模块,直接调用保存表头和搜索的方法
          // 1. 保存模块,
          // 2. 保存表头及搜索
          this.editModule(this.moduleForm);
          this.saveTitle(this.moduleId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        // 获取最新的数据列表
        this.getRiskLogItems(this.pageNum);
        this.stepper = 1;
        // this.pageNum = 1;
        // 关闭弹窗
        this.addEditDialog = false;
      }
    },
    async editModule (module) {
      let response = await dataService.editModule(module);
      return response;
    },
    // 保存单条模块记录
    async saveModule (module) {
      if (!module.moduleSrc) {
        module['moduleSrc'] = 'risk';
      }
      if (!module.logType) {
        module['logType'] = 'risk';
      }
      let response = await dataService.addModule(module);
      return response;
    },
    // 保存表头和分组
    async saveTitle (moduleId) {
      let params = {};
      params['moduleId'] = moduleId;
      let items = [];
      // 把 fieldName 和 fieldValue 换成 fieldText, fieldName
      for (let i in this.groupItems) {
        let item = Object.assign({}, this.groupItems[i]);
        item['fieldText'] = this.groupItems[i].fieldName;
        item['fieldName'] = this.groupItems[i].fieldValue;
        items.push(item);
      }
      params['fieldList'] = items;
      // 处理成后端需要的json对象格式
      let jsonObj = {};
      jsonObj['json'] = JSON.stringify(params);
      await dataService.addTitle(jsonObj);
    },
    // 删除按钮默认触发 激活弹窗
    deleteItem (item) {
      this.moduleId = item.id;
      this.currentDelMode = 1;
      this.delDialogSwitch = true;
    },
    // 关闭删除弹窗
    delDialogCancel () {
      this.delDialogSwitch = !this.delDialogSwitch;
    },
    // 确认删除
    delDialogConfirm ($event) {
      if (this.currentDelMode === 1) {
        // 删除module
        this.delModule(this.moduleId);
      } else {
        // 删除分组
      }
    },
    async delModule (params) {
      let delParam = {
        id: params
      };
      let response = await dataService.delModule(delParam);
      if (response.data.code === 200) {
        this.delDialogSwitch = false;
        this.getRiskLogItems();
        this.pageNum = 1;
      }
    },
    editGroup (item) {
      let sessionStorage = window.sessionStorage;
      sessionStorage.setItem('moduleId', JSON.stringify(item.id));
      sessionStorage.setItem('currentFieldConfigTab', 0);
      this.$router.push('/fieldConfigDetail');
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    panelCounter () {
      this.counter += 1;
    },
    // 获取当前页的路由名称
    getPath () {
      localStorage.setItem('getMenu', '/riskLogConfig');
    }
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 314;
      }
    },
    searchForm () {
      let formData = {};
      if (this.searchParam[0].value) {
        formData['moduleName'] = this.searchParam[0].value;
      }
      if (this.searchParam[1].value) {
        formData['moduleNo'] = this.searchParam[1].value;
      }
      if (this.searchParam[2].value) {
        formData['appNo'] = this.searchParam[2].value;
      }
      if (this.searchParam[3].value) {
        formData['type'] = this.searchParam[3].value;
      }
      return formData;
    },
    previewHeader () {
      let header = [];
      if (this.selectedHeader.length > 0) {
        for (let i = 0; i < this.selectedHeader.length; i++) {
          let item = {};
          item['text'] = this.selectedHeader[i].fieldName;
          item['value'] = this.selectedHeader[i].fieldValue;
          header.push(item);
        }
        header = header.filter(i => i.value !== 'hit_rule_search');
        return header;
      } else {
        return [];
      }
    },
    // 表头和搜索 数据表格的内容
    groupItems () {
      let result = [];
      if (this.selectedHeader.length > 0) {
        for (let i = 0; i < this.selectedHeader.length; i++) {
          let item = {};
          item = Object.assign({}, this.selectedHeader[i], {});
          item['sortNo'] = i + 1;
          if (!item['fieldSrcId']) {
            item['fieldSrcId'] = this.selectedHeader[i].id;
          }
          if (!item['isSearch']) {
            item['isSearch'] = 0;
          }
          if (!item['searchType']) {
            item['searchType'] = 'text';
          }
          if (!item['checkType']) {
            item['checkType'] = '';
          }
          if (!item['isLog']) {
            item['isLog'] = 1;
          }
          result.push(item);
        }
      }
      return result;
    }
  },
  filters: {
    filterLogType: function (value) {
      return value === '1' ? '动账' : '非动账';
    }
  },
  watch: {
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 75;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  }
};

</script>
<style lang="stylus" scoped>
.base_tableHeaderLabel_name {
  font-size: 18px !important;
}
.v-application .box_shadow {
  box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0), 0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
}
.tableId >>> .ellipsis {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
