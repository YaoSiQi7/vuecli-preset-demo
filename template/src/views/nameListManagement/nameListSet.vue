<!--author：古雪瑞 -->
<!--updateTime：2020-04-02-->
<template>
  <div class="fill-height">
    <!-- 搜索表单 -->
    <base-search
      :fieldList="searchForm"
      @search="search($event)"
      @reset="resetSearchData"
      ref="nameListSetSearch"
      @change="panelCounter"
    ></base-search>
    <!-- 名单集列表 -->
    <v-data-table
      ref="nameListSetTable"
      :headers="nameListSetHeaders"
      :items="nameListSetData"
      :items-per-page="perPageNum"
      hide-default-footer
      :fixed-header="true"
      :height="tableHeight"
      class="elevation-3 mt-3"
    >
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar flat height="60px">
          <v-toolbar-title style="font-size:18px">名单集数据</v-toolbar-title>
          <v-spacer/>
          <v-btn color="primary" class="mr-1 mt-1" @click="AddNameListSet" v-if="hasPermission(addNameListSetBtn)">添加</v-btn>
          <!-- <v-btn color="primary" class="mr-1 mt-1" @click="AddNameListSet" >添加</v-btn> -->
        </v-toolbar>
      </template>
      <template v-slot:body="{ items }">
        <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
          <td colspan="7">没有数据</td>
        </tr>

        <tr
          v-else
          v-for="(item, index) in items"
          :key="index"
          class="el-tr-defu"
        >
          <td class="el-border-defu">
            <span :title="item.listName">
              {{ item.listName | ellipsis(16) }}
            </span>
          </td>
          <td class="el-border-defu">
            <span :title="item.applyScope">
              {{item.applyScope ==='1'?'全部应用':(item.applyScope==='2'?'指定应用':'指定交易')}}
            </span>
          </td>
          <td class="el-border-defu" v-if="item.applyScope ==='3'">
           <span :title="item.tradeType | belongListSetLabel(belongList)">{{
              item.tradeType | belongListSetLabel(belongList) | ellipsis(16)
            }}</span>
          </td>
          <td class="el-border-defu" v-else>
            <span :title="item.tradeType | nameListSetApplication(allAppList)">{{
              item.tradeType | nameListSetApplication(allAppList) | ellipsis(16)
            }}</span>
          </td>
          <td class="el-border-defu">
            {{ item.listType | textFilters(allNameTypeList) }}
          </td>
          <td class="el-border-defu">
            <span
              :title="
                item.businessVar
                  | nameListSetApplication(allBusinessVariableList)
              "
              >{{
                item.businessVar
                  | nameListSetApplication(allBusinessVariableList)
                  | ellipsis(16)
              }}</span
            >
          </td>
          <td class="el-border-defu">
            <span :title="item.description">
              {{ item.description | ellipsis(16) }}
            </span>
          </td>
          <td class="el-border-defu">
            <v-switch
              v-model="item.states"
              color="primary"
              @change="isStat(item, index)"
              v-if="hasPermission(conversionStateBtn)"
            />
          </td>
          <td class="el-border-defu">
            <v-tooltip bottom v-if="hasPermission(editNameSetBtn)">
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-3 icon-primary"
                  v-on="on"
                  color="primary"
                  @click="editNameListSet(item,index)"
                  :disabled="item.ref"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>编辑</span>
            </v-tooltip>
            <v-tooltip bottom v-if="hasPermission(deleteNameSetBtn)">
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  v-on="on"
                  color="primary"
                  @click="deleteNameListSet(item)"
                  :disabled="item.ref"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>删除</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <!-- 分页组件 -->
      <template v-slot:footer>
        <v-divider></v-divider>
        <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
          <div class="footer__select">
            每页
            <span >
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
            <span style="margin-left:15px">共{{ totalItems }}条</span>
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
    <!-- 添加或编辑的弹窗 -->
    <add-or-edit-dialog
      ref="addEdit"
      :formHeader="addOrEditHeader"
      :crudFormDialog="addOrEditDialog"
      :formData="addAndEditFormData"
      @cancelCrudFormDialog="cancel($event)"
      @confimDialogSave="save(arguments)"
      @switchOnChange="onChange(arguments)"
      :isTreeVoild="isTreeVoild"
      :editAndDelFlag = "editAndDelFlag"
      :editInfoCode='editInfoCode'
      @handleChangeSelect="nameListTypeChange"
    >
    </add-or-edit-dialog>
    <!-- 删除弹框 -->
    <del-dialog
      :isDialogShow="dialogDel"
      @cancelDel="dialogDel = false"
      @confimDel="confirmDelFun"
    ></del-dialog>
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
import * as dataService from 'api/nameListSet.js';
import { NAME_NOT_NULL, MAX_INPUT_LENGTH } from 'utils/validate.js';
import BaseSearch from '@c/BaseSearch';
// import BaseCreate from '@/components/BaseCreate';
import AddOrEditDialog from './addOrEditDialog';
import DelDialog from '@/components/DelDialog';
export default {
  name: 'nameListSet',
  components: {
    BaseSearch,
    // BaseCreate,
    DelDialog,
    AddOrEditDialog
  },
  data () {
    return {
      counter: 0,
      fullHeight: window.innerHeight,
      // 搜索组件数据
      searchForm: [
        { placeholder: '名单集名称', value: '', type: 'text' },
        {
          placeholder: '适用范围',
          value: '',
          type: 'select',
          options: []
        },
        {
          placeholder: '匹配字段',
          value: '',
          type: 'autocomplete',
          multiple: false,
          options: []
        },
        {
          placeholder: '所属应用',
          value: '',
          type: 'select',
          options: [{ text: '全部应用', value: 'all' }]
        },
        {
          placeholder: '名单类型',
          value: '',
          type: 'select',
          options: [{ text: '全部名单类型', value: 'all' }]
        }
      ],
      // 搜索参数
      searchData: {
        listName: '',
        applyScope: '', // 适用范围
        businessVar: '',
        tradeType: null,
        listType: ''
      },
      nameListSetHeaders: [
        { text: '名单集名称', value: 'listName', sortable: false, width: 100 },
        { text: '适用范围', value: 'applySope', sortable: false, width: 100 },
        { text: '所属应用', value: 'tradeType', sortable: false, width: 100 },
        { text: '名单类型', value: 'listType', sortable: false, width: 100 },
        { text: '匹配字段', value: 'matchField', sortable: false, width: 100 },
        { text: '描述', value: 'description', sortable: false, width: 100 },
        { text: '状态', value: 'states', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      nameListSetData: [],
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      appList: [
        { selectText: '手机银行', selectField: 'mobileBank' },
        { selectText: '网上银行', selectField: 'netBank' },
        { selectText: '在线商城', selectField: 'onlineShop' }
      ],
      allAppList: [],
      belongList: [], // 所属交易及类型
      editTreeList: [],
      nameTypeList: [
        { selectText: '黑名单', selectField: 'blackList' },
        { selectText: '白名单', selectField: 'whiteList' },
        { selectText: '灰名单', selectField: 'greyList' }
      ],
      // 名单类型数据
      allNameTypeList: [],
      // 添加or弹框参数
      addOrEditDialog: false,
      isTreeVoild: true,
      editAndDelFlag: true, // 是否可以编辑删除
      editInfoCode: null, // 名单集是否提示code
      addOrEditHeader: {
        name: '添加名单集',
        value: 'add',
        isEdit: false
      },

      addAndEditFormData: [
        {
          label: '名单集名称',
          value: '',
          isAutoShow: true,
          required: true,
          rules: [
            v => !!v || NAME_NOT_NULL('名单集'),
            // eslint-disable-next-line no-mixed-operators
            v => (v && v.length <= 64) || MAX_INPUT_LENGTH(64)
          ],
          type: 'text',
          counter: '64'
        },
        {
          label: '名单类型',
          fielType: 'nameType',
          value: '',
          isAutoShow: true,
          required: true,
          rules: [v => !!v || NAME_NOT_NULL('名单类型')],
          type: 'select',
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        },
        {
          label: '适用范围',
          value: '',
          isAutoShow: true,
          fielType: 'syfw',
          required: true,
          rules: [v => (v && !!v.length) || NAME_NOT_NULL('适用范围')],
          type: 'select',
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        },
        {
          label: '所属应用及交易',
          fielType: 'blongApp',
          value: '',
          isAutoShow: false,
          required: true,
          rules: [v => (v && !!v.length) || NAME_NOT_NULL('所属应用及交易')],
          type: 'select',
          multiple: true,
          selectText: 'selectText',
          selectField: 'selectField',
          options: [],
          isMultiple: true
        },

        {
          label: '匹配字段',
          value: '',
          fielType: '',
          isAutoShow: true,
          type: 'autocomplete',
          required: true,
          rules: [v => (v && !!v.length) || NAME_NOT_NULL('匹配字段')],
          multiple: true,
          chips: false,
          selectText: 'selectText',
          selectField: 'selectField',
          autocompleteOptions: []
        },
        {
          label: '描述',
          value: '',
          isAutoShow: true,
          required: false,
          type: 'textarea',
          // type: 'textarea',
          counter: 200,
          // counter: '200',
          rows: '3',
          rowHeight: '25'
        }
        //  {
        //   label: '描述',
        //   value: '',
        //   isAutoShow: true,
        //   required: false,
        //    rules: [v => v.length <= 200 || '输入内容最多200个字符'],
        //   type: 'textarea',
        //   counter: 200,
        //   rows: '3',
        //   rowHeight: '25'
        // }
      ],
      // 所有的业务变量库字段列表
      allBusinessVariableList: [],
      // 当前编辑的名单集的id
      currentEditId: '',
      // 删除弹框变量
      confirmDelFun: '', // 删除弹框传的函数名
      dialogDel: false,
      delCurrentId: '', // 删除当前行的id
      // 提示弹框参数
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '',
      // 是否来自新增
      isFromNewAdd: false,
      delParam: '',
      // 按钮权限
      addNameListSetBtn: '/addNameListSetButton', // 添加按钮是否显示
      conversionStateBtn: '/conversionNameListSetStateButton', // 表格状态按钮
      editNameSetBtn: '/editNameListSetButton', // 表格编辑按钮
      deleteNameSetBtn: '/deleteNameListSetButton' // 表格删除按钮
    };
  },
  filters: {
    textFilters: function (str, itemList) {
      let text;
      itemList.forEach(item => {
        if (item.selectField === str) {
          text = item.selectText;
        }
      });
      return text;
    },
    // 名单集所属应用
    nameListSetApplication: function (dataStr, ApplicationList) {
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var Application = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < ApplicationList.length; j++) {
            if (element === ApplicationList[j].selectField) {
              Application.push(ApplicationList[j].selectText);
              hasValue = true;
              break;
            }
          }
          if (hasValue) continue;
        }
        return Application.join(',');
      }
    },
    // 指定应用的时候，名单--id
    belongListSetLabel: function (dataStr, AppbloneList) {
      // let treeList = AppbloneList;
      let rowDataStr = [];
      var Saspplication = []; // 存放指定应用
      //  var Dapplication = []; // 指定应用对应的交易
      if (dataStr && typeof dataStr === 'string') {
        rowDataStr = dataStr.split(',');
        for (let r = 0; r < rowDataStr.length; r++) {
          let aa = rowDataStr[r].split('-');
          let joinSting = '';
          for (let j = 0; j < AppbloneList.length; j++) {
            if (aa[0] === AppbloneList[j].id) {
              joinSting = AppbloneList[j].label;
              if (joinSting !== '' && AppbloneList[j].children.length !== 0) {
                for (let sub = 0; sub < AppbloneList[j].children.length; sub++) {
                  if (aa[1] === AppbloneList[j].children[sub].id) {
                    joinSting = joinSting + ('-' + AppbloneList[j].children[sub].label);
                    break;
                  }
                }
                break;
              }
            }
          }
          Saspplication.push(joinSting);
        }
      }
      return Saspplication.join(',');
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    Promise.all([
      this.getAppParams(),
      this.queryAllListType(),
      this.getNameListSetList(),
      this.queryAllField(),
      this.fetchApplyScope('WHITE_LIST'),
      this.getAppInfoOrTradeType()
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
    // 获取全量业务变量库字段
    async queryAllField () {
      try {
        const res = await dataService.queryallfield({ isContainEnum: '1' });
        // console.log(res.data.data,'获取全量业务变量库字段res.data.data');
        for (let item of res.data.data) {
          this.allBusinessVariableList.push({
            selectText: item.fieldName,
            selectField: item.id
          });
          // 弹框里面 匹配字段赋值
          this.addAndEditFormData[4].autocompleteOptions.push({
            selectText: item.fieldName,
            selectField: item.id
          });
          // 查询模块 匹配字段赋值
          this.searchForm[2].options.push({
            text: item.fieldName,
            value: item.id
          });
        }
      } catch (err) {}
    },
    // 获取全部名单类型
    async queryAllListType () {
      try {
        let param = {
          identifier: 'sys_list_type'
        };
        const res = await dataService.findsysParams(param);
        if (res.data.code === 200) {
          res.data.data.forEach((item, index, ary) => {
            // 添加弹框中的名单类型
            // console.log( res.data.data,'添加名单类型');
            this.allNameTypeList.push({
              selectText: item.paramName,
              selectField: item.paramValue
            });
            this.addAndEditFormData[1].options.push({
              selectText: item.paramName,
              selectField: item.paramValue
            });
            // 查询条件中的名单类型
            this.searchForm[4].options.push({
              text: item.paramName,
              value: item.paramValue
            });
          });
        }
      } catch (err) {}
    },

    // 获取全部应用列表数据
    async getAppInfoOrTradeType () {
      try {
        const res = await dataService.getAppInfoOrTradeType({ applyScopeId: '3' });
        if (res.data.code === 200) {
          let tradeTypeListArry = res.data.data;
          let onelevel = []; // 存放第一级
          // let editTrarry = [];
          if (tradeTypeListArry.length !== 0) {
            tradeTypeListArry.forEach((v) => {
              onelevel.push({
                id: v.appId,
                label: v.appName,
                children: []
              });
              // 编辑里面用
            });
          }
          // 迭代第二级
          // 循环迭代第二级
          onelevel.forEach((o, j) => {
            tradeTypeListArry.forEach((v, m) => {
              if (o.id === v.appId) {
                // 比较查找对应id 下的children
                if (v.tradeTypeList.length > 0) {
                  v.tradeTypeList.forEach((cItem) => {
                    o.children.push({
                      id: cItem.id,
                      label: cItem.tradeName
                    });
                  });
                }
              }
            });
          });
          this.belongList = onelevel;
          this.editTreeList = JSON.parse(JSON.stringify(onelevel)); // 深拷贝这个对象
          // 重新处理后给编辑弹框用
          this.editTreeList.map((v) => {
            if (v.children !== []) {
              v.children.map((sub) => {
                sub.id = v.id + '-' + sub.id;
              });
            }
          });
        }
      } catch (err) {}
    },
    async getAppParams () {
      try {
        const res = await dataService.getAppInfoOrTradeType({ applyScopeId: '2' });
        this.addAndEditFormData[3].options = [];
        if (res.data.code === 200) {
          res.data.data.forEach((item, index, ary) => {
            // 添加弹框中的所属应用
            this.allAppList.push({
              selectText: item.appName,
              selectField: item.appId
            });
            // 查询条件中的所属应用
            this.searchForm[3].options.push({
              text: item.appName,
              value: item.appId
            });
          });
        }
      } catch (err) {}
    },
    // 获取适用范围
    async fetchApplyScope (nameType) {
      try {
        const res = await dataService.getApplyScope({ listType: nameType });
        if (res.data.code === 200) {
          res.data.data.forEach((item, index, ary) => {
            // 查询条件中的所属应用
            this.searchForm[1].options.push({
              text: item.applyScope,
              value: item.id
            });
            // 添加或编辑表单里面默认获取 适用范围的内容
            this.addAndEditFormData[2].options.push({
              selectText: item.applyScope,
              selectField: item.id
            });
          });
        }
      } catch (err) {
        console.log(err, 'err');
      }
    },
    // 点击搜索按钮
    search ($event) {
      $event.forEach((item, index, ary) => {
        if (item.placeholder === '名单集名称') {
          this.searchData.listName = item.value;
        } else if (item.placeholder === '适用范围') {
          this.searchData.applyScope = item.value;
        } else if (item.placeholder === '匹配字段') {
          this.searchData.businessVar = item.value;
        } else if (item.placeholder === '所属应用') {
          this.searchData.tradeType = item.value;
        } else if (item.placeholder === '名单类型') {
          this.searchData.listType = item.value;
        }
      });
      if (this.searchData.tradeType === 'all') {
        this.searchData.tradeType = '';
      }
      if (this.searchData.listType === 'all') {
        this.searchData.listType = '';
      }
      this.pageNum = 1; // 默认从第一页开始查询
      this.getNameListSetList();
    },
    // 重置查询条件
    resetSearchData () {
      this.searchData = {
        listName: '',
        applyScope: '',
        businessVar: '',
        tradeType: '',
        listType: ''
      };
      this.pageNum = 1; // 默认从第一页开始查询
      this.getNameListSetList();
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this.getNameListSetList();
    },
    // 切换每页显示几条数据
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
      try {
        const res = await dataService.queryNameListRecord(params);
        if (res.data.code === 200) {
          this.nameListSetData = res.data.data.list;
          // console.log(this.nameListSetData ,'宁');
          this.nameListSetData.forEach((item, index, ary) => {
            if (item.states === '1') {
              item.states = true;
            } else {
              item.states = false;
            }
          });
          this.totalItems = res.data.data.totalElements;
          this.queryPageLength = res.data.data.totalPages;
          // if (this.isFromNewAdd) {
          //   let addRecordParam = res.data.data.list[0];
          //   this.batchAddRecord(addRecordParam);
          //   this.isFromNewAdd = false;
          // }
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        console.log(err);
      }
    },

    // 点击添加
    AddNameListSet () {
      if (this.addAndEditFormData[2].value === undefined) {
        this.addAndEditFormData[3].isAutoShow = false;
      }

      if (this.addAndEditFormData[3].type === 'treeSelect') {
        this.addAndEditFormData[3].value = [];
      }
      this.addOrEditDialog = true;
      this.addOrEditHeader = {
        name: '添加名单集',
        value: 'add',
        isEdit: false
      };
    },
    // 点击编辑
    async editNameListSet (item) {
      // console.log(item, '名单集编辑11');
      // 调用接口，根据接口返回 安全，调试模式，来判断该条记录是否可以编辑
      let params = {
        sourceId: item.id
      };
      const res = await dataService.getQueryRefRecordBySourceId(params);
      console.log(res.data.data.editingMode, '名单集是否可编辑判断');
      let editingMode = res.data.data.editingMode;
      // 2 == 该名单集已经被应用，请谨慎修改
      if (editingMode === 0 || editingMode === 1) {
        this.editAndDelFlag = true;
        this.editInfoCode = 1;
      }

      if (editingMode === 2) {
        this.editAndDelFlag = true;
        this.editInfoCode = 2;
      }
      // if (editingMode === 3) {
      //   this.editAndDelFlag = false;
      //   this.editInfoCode = 3;
      //   this.snackbarServe = true;
      //   this.snackbarServeMsg = '该名单集已经被引用，安全模式禁止修改！';
      //   this.snackbarServeColor = 'error';
      // }
      // 3不让编辑

      this.addAndEditFormData[2].options = [];
      this.addAndEditFormData[3].options = [];
      this.fetchApplyScope(item.listType); // 从新获取一些使用范围

      // if(item.applyScope==='2' || item.applyScope==="3"){
      //   this.sentQueryTradeType(item.applyScope);
      // }
      // if(item.applyScope==="3"){
      //   this.addAndEditFormData[3].value=[];
      // }

      this.delParam = item; // 删除引用记录时用
      this.currentEditId = item.id;
      this.addOrEditDialog = true;
      this.addOrEditHeader = {
        name: '名单集详情',
        value: 'edit',
        isEdit: true
      };
      this.$nextTick(() => {
        this.addAndEditFormData[0].value = item.listName;// 名单集名称
        this.addAndEditFormData[1].value = item.listType;// 名单类别
        this.addAndEditFormData[2].value = item.applyScope; // 适用范围
        if (item.applyScope === '1') {
          this.addAndEditFormData[3].isAutoShow = false;
          this.addAndEditFormData[3].type = 'select';
          this.addAndEditFormData[3].placeholder = '所属应用';
          this.addAndEditFormData[3].label = '所属应用';
          this.addAndEditFormData[3].options = [];
          this.addAndEditFormData[3].value = '';
          item.tradeType = '';
        }

        if (item.applyScope === '2') {
          this.addAndEditFormData[3].isAutoShow = true;
          this.addAndEditFormData[3].value = '';
          this.addAndEditFormData[3].type = 'select';
          this.addAndEditFormData[3].placeholder = '所属应用';
          this.addAndEditFormData[3].label = '所属应用';
          this.addAndEditFormData[3].required = true;
          this.addAndEditFormData[3].options = this.allAppList;
        }
        if (item.applyScope === '3') {
          this.addAndEditFormData[3].isAutoShow = true;
          this.addAndEditFormData[3].value = [];
          this.addAndEditFormData[3].required = true;
          this.addAndEditFormData[3].type = 'treeSelect';
          this.addAndEditFormData[3].placeholder = '所属应用及交易';
          this.addAndEditFormData[3].label = '所属应用及交易';
          this.addAndEditFormData[3].options = this.editTreeList;
          this.addAndEditFormData[3].value = item.tradeType;
        }
        // this.addAndEditFormData[3].value = item.tradeType !== [] ? item.tradeType.split(',') : ''; // 所属应用及交易
        this.addAndEditFormData[3].value = item.tradeType === [] ? '' : item.tradeType === null ? '' : item.tradeType.split(',');
        console.log(this.addAndEditFormData[3].value, item.tradeType);
        // console.log(this.addAndEditFormData[3],this.addAndEditFormData[4], '编辑所属应用及交易');
        this.addAndEditFormData[4].value = item.businessVar.split(','); // 匹配范围
        this.addAndEditFormData[5].value = item.description; // 描述
      });
    },
    save (paramData) {
      let params = paramData;
      // console.log(paramData,'paramData');
      if (params[0][2].value === '1') {
        params[0][3].value = '';
      }
      let saveParams = {
        listName: params[0][0].value,
        listType: params[0][1].value,
        applyScope: params[0][2].value,
        tradeType: params[0][3].value !== '' ? params[0][3].value.join(',') : '',
        // tradeType:'', // 指定应用
        businessVar: params[0][4].value.join(','),
        description: params[0][5].value
      };
      if (!saveParams.listName) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '名单集名称不能为空';
        this.snackbarServeColor = 'error';
        return;
      }
      if (params[0][5].value && params[0][5].value.length > 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '描述内容不能超过200个字符';
        this.snackbarServeColor = 'error';
        return;
      }
      if (params[0][2].value === '2') {
        if (saveParams.tradeType === '') {
          this.snackbarServe = true;
          this.snackbarServeMsg = '所属应用不能为空';
          this.snackbarServeColor = 'error';
          return false;
        }
      }
      if (params[0][2].value === '3') {
        if (saveParams.tradeType === '') {
          this.isTreeVoild = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = '所属应用及交易不能为空';
          this.snackbarServeColor = 'error';
          return false;
        }
      }
      if (this.addOrEditHeader.isEdit === false) {
        this.confirmAddParm(saveParams);
      } else {
        // this.batchDelRecord(this.delParam); // 编辑状态点保存时，首先删除之前的引用记录
        saveParams.id = this.currentEditId;
        this.confirmEditParam(saveParams);
      }
      params[1].reset(); // 重置表单
      this.addOrEditDialog = false;
    },
    /**
     * 名单类型为白名单时，
     *  新需求，更改 字段所属应用及交易的 下拉框包括应用及该应用所包括的交易类型
     **/

    async nameListTypeChange (item, formData, index) {
      // 根据所选的名单类型获取适用范围
      // console.log(formData, '下拉框change');
      if (item.fielType === 'nameType') {
        // select 切换时清空下面的联动选项

        this.addAndEditFormData[2].options = []; // 适用范围
        this.addAndEditFormData[2].placeholder = '适用范围';
        this.addAndEditFormData[2].label = '适用范围';
        this.addAndEditFormData[3].options = []; // 所属应用及交易
        this.addAndEditFormData[3].value = [];
        this.addAndEditFormData[3].isAutoShow = false;
        this.fetchApplyScope(item.value);// 请求获取适用范围下拉选项
      }

      if (item.fielType === 'nameType' && formData[2].value === '2') {
        this.addAndEditFormData[3].options = []; // 所属应用及交易
        this.addAndEditFormData[3].value = '';
        this.addAndEditFormData[3].type = 'select';
        this.addAndEditFormData[3].placeholder = '所属应用';
        this.addAndEditFormData[3].label = '所属应用';
        this.addAndEditFormData[3].required = true;
        this.addAndEditFormData[3].isAutoShow = true;
        this.sentQueryTradeType(formData[2].value);
      }

      if (this.addAndEditFormData[1].value === 'WHITE_LIST' && formData[2].value === '3') {
        this.isTreeVoild = false;
        this.addAndEditFormData[3].options = []; // 所属应用及交易
        this.addAndEditFormData[3].value = [];
        this.addAndEditFormData[3].type = 'treeSelect';
        this.addAndEditFormData[3].label = '所属应用及交易';
        this.addAndEditFormData[3].placeholder = '所属应用及交易';
        this.addAndEditFormData[3].isMultiple = true;
        this.addAndEditFormData[3].isAutoShow = true;
        // this.addAndEditFormData[3].required =true;
        this.sentQueryTradeType(formData[2].value);
      }
      // 根据选择的名单类型+适用范围类型 来进行所所属应用及交易的显示隐藏，及显示形式
      if (item.fielType === 'syfw' && item.value === '1') {
        this.addAndEditFormData[3].options = []; // 所属应用及交易
        this.addAndEditFormData[3].value = '';
        this.addAndEditFormData[3].type = 'select';
        this.addAndEditFormData[3].isAutoShow = false;
      } else if (item.fielType === 'syfw' && item.value === '2') {
        this.addAndEditFormData[3].options = []; // 所属应用及交易
        this.addAndEditFormData[3].value = '';
        this.addAndEditFormData[3].type = 'select';
        this.addAndEditFormData[3].placeholder = '所属应用';
        this.addAndEditFormData[3].label = '所属应用';
        this.addAndEditFormData[3].required = true;
        this.addAndEditFormData[3].isAutoShow = true;
        this.sentQueryTradeType(item.value);
      } else if (item.fielType === 'syfw' && item.value === '3') {
        // 白名单的时候特殊处理
        this.isTreeVoild = false;
        this.addAndEditFormData[3].type = 'treeSelect';
        this.addAndEditFormData[3].label = '所属应用及交易';
        this.addAndEditFormData[3].placeholder = '所属应用及交易';
        this.addAndEditFormData[3].options = []; // 所属应用及交易
        this.addAndEditFormData[3].value = [];
        this.addAndEditFormData[3].isMultiple = true;
        this.addAndEditFormData[3].isAutoShow = true;
        this.addAndEditFormData[3].required = true;
        this.sentQueryTradeType(item.value);
      }
    },
    // 发送请求重新查询指定引用
    async sentQueryTradeType (parmas) {
      try {
        const res = await dataService.getAppInfoOrTradeType({ applyScopeId: parmas });
        if (res.data.code === 200) {
          this.addAndEditFormData[3].options = []; // 所属应用及交易
          res.data.data.forEach((item) => {
            if (parmas === '2') {
              this.addAndEditFormData[3].options.push({ selectText: item.appName, selectField: item.appId });
            } else if (parmas === '3') {
              let tradeTypeListArry = res.data.data;
              let onelevel = []; // 存放第一级
              // 迭代第一层
              if (tradeTypeListArry.length !== 0) {
                tradeTypeListArry.forEach((v) => {
                  onelevel.push({
                    id: v.appId,
                    label: v.appName,
                    children: []
                  });
                });
              }
              // 迭代第二级
              // 循环迭代第二级
              onelevel.forEach((o, j) => {
                tradeTypeListArry.forEach((v, m) => {
                  if (o.id === v.appId) {
                    // 比较查找对应id 下的children
                    if (v.tradeTypeList.length > 0) {
                      v.tradeTypeList.forEach((cItem) => {
                        o.children.push({
                          id: o.id + '-' + cItem.id,
                          label: cItem.tradeName
                        });
                      });
                    }
                  }
                });
              });

              this.addAndEditFormData[3].options = onelevel;
            }
          });
        }
      } catch (err) {

      }
    },
    // 添加时保存
    async confirmAddParm (saveParams) {
      try {
        const res = await dataService.addNameListRecord(saveParams);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '添加成功';
          this.snackbarServeColor = 'success';
          this.isFromNewAdd = true;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
        this.getNameListSetList();
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
        this.getNameListSetList();
      }
    },
    // 编辑时保存
    async confirmEditParam (saveParams) {
      try {
        const res = await dataService.updateNameListRecord(saveParams);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '修改成功';
          this.snackbarServeColor = 'success';
          // this.batchAddRecord(saveParams); // 编辑状态点保存，添加新的引用记录
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
        this.getNameListSetList();
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
        this.getNameListSetList();
      }
    },
    // 新增编辑弹窗的取消按钮
    cancel (form) {
      this.addOrEditDialog = false;
      form.reset();
    },
    // 编辑弹框中的 切换开关按钮
    onChange (changeParam) {
      // console.log(changeParam[0], changeParam[1], '1111启用编辑。。。。');
      let isEdit = changeParam[0];
      let isShwoSnack = changeParam[1];
      if (isEdit === false) {
        this.addOrEditHeader = {
          name: '名单集详情',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '名单集编辑',
          value: 'edit',
          isEdit: true
        };
      }
      // 根据当前状态判断是否弹框 isShwoSnack 2 ，3
      if (isShwoSnack === 2) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '该名单集已经被引用，请谨慎修改';
        this.snackbarServeColor = '#ffc107';
      }
      // } else if (isShwoSnack === 3) {
      //   this.snackbarServe = true;
      //   this.snackbarServeMsg = '该名单集已经被引用，安全模式禁止修改！';
      //   this.snackbarServeColor = 'waring';
      // }
    },
    async isStat (item) {
      let queryParam = {
        id: item.id,
        states: item.states ? 1 : 0
      };
      try {
        const res = await dataService.toggleSwitch(queryParam);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.getNameListSetList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
          this.getNameListSetList();
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
        this.getNameListSetList();
      }
    },
    // 点击删除
    async  deleteNameListSet (item) {
      // 调用接口，根据接口返回 安全，调试模式，来判断该条记录是否可以编辑
      let params = {
        sourceId: item.id
      };
      const res = await dataService.getQueryRefRecordBySourceId(params);
      console.log(res.data.data.editingMode, '名单集是否可编辑判断');
      let editingMode = res.data.data.editingMode;
      // 2 == 该名单集已经被应用，请谨慎修改
      if (editingMode === 0 || editingMode === 1) {
        // this.editAndDelFlag = true;
        // this.editInfoCode = 1;
      }

      if (editingMode === 2) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '该名单集已经被引用，请谨慎删除';
        this.snackbarServeColor = '#ffc107';
      }
      if (editingMode === 3) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '该名单集已经被引用，安全模式禁止删除！';
        this.snackbarServeColor = 'waring';
        this.dialogDel = false;
      }

      this.delParam = item;
      this.dialogDel = true;
      this.delCurrentId = item.id;
      this.confirmDelFun = this.confirmDel;
    },
    // 确认删除
    async confirmDel () {
      try {
        const res = await dataService.deleteNameListRecord({
          id: this.delCurrentId
        });
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '删除成功';
          this.snackbarServeColor = 'success';
          // this.batchDelRecord(this.delParam);
          this.getNameListSetList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
      this.dialogDel = false;
    },

    // 批量添加引用记录
    async batchAddRecord (params) {
      try {
        let param = {
          sourceId: params.businessVar,
          targetId: params.id
        };
        let addParams = {
          jsonStr: JSON.stringify(param)
        };
        dataService.addBatchRecords(addParams);
        // const res = await dataService.addBatchRecords(addParams);
        // if (res.data.code === 200) {
        // }
      } catch (err) {}
    },
    // 批量删除引用记录
    async batchDelRecord (params) {
      try {
        let param = {
          sourceId: params.businessVar,
          targetId: params.id
        };
        let delParams = {
          jsonStr: JSON.stringify(param)
        };
        dataService.delBatchRecords(delParams);
        // const res = await dataService.delBatchRecords(delParams);
        // if (res.data.code === 200) {
        // }
      } catch (err) {}
    }
  }
};
</script>
