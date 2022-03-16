<!----------  @author: YinGuoZheng  ----------->
<!----------  @updated_at: 2020-04-23  ----------->
<!----------  @version: 2.0  ----------->

<template>
  <div class="enu-content fill-height">
    <!-- 搜索表单 -->
    <base-search
      :fieldList="searchForm"
      @search="searchList($event)"
      @reset="resetSearchData($event)"
      ref="nameListSetSearch"
      @change="panelCounter"
    ></base-search>
    <v-data-table
      ref="nameListSetTable"
      :headers="interfaceListSetHeaders"
      :items="interfaceListData"
      hide-default-footer
      :fixed-header="true"
      :elevation="3"
      :items-per-page="perPageNum"
      no-data-text="没有匹配数据"
      class="elevation-3 mt-3 pl-3 pr-3"
      :height="tableHeight"
    >
      <!-- 表头 -->
      <template v-slot:top v-if="hasPermission(addInterConfigBtn)">
        <v-toolbar flat height="60px">
          <v-spacer/>
          <v-btn color="primary" class="mt-2 elevation-3" @click="AddInterfaceListData">添加</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom v-if="hasPermission(editInterConfigBtn)">
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-3 icon-primary"
              v-on="on"
              color="primary"
              @click="editInterfaceList(item)"
              :disabled="item.ref"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>编辑</span>
        </v-tooltip>
        <v-tooltip bottom v-if="hasPermission(deleteInterConfigBtn)">
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-1 icon-primary"
              v-on="on"
              color="primary"
              @click="deleteInterfaceList(item.id)"
              :disabled="item.ref"
            >
              mdi-delete
            </v-icon>
          </template>
          <span>删除</span>
        </v-tooltip>
      </template>
      <template v-slot:footer >
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
    <!-- 添加编辑弹窗 -->
    <base-create
      :formHeader='addOrEditHeader'
      :crudFormDialog='dialog'
      :formData='addAndEditFormData'
      :baseCteateEditPowerBtn="editInterConfigBtn"
      @cancelCrudFormDialog='cancel($event)'
      @confimDialogSave='save'
      @switchOnChange="onChange($event)"
    ></base-create>
    <del-dialog
      :isDialogShow='dialogDel'
      @cancelDel='constantDelCancle($event)'
      @confimDel='deleteEnum($event)'
    ></del-dialog>
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
import {
  queryTableList,
  addItem,
  editItem,
  removeItem
} from '../../api/roleManageConfig.js';
import * as dataService from '../../api/interfaceConfiguration.js';
import BaseSearch from '@c/BaseSearch';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import { NO_EMPTY_STRING, NO_EMPTY_SPACE_ALLOWED, BASE_LENGTH_TEXT, NO_SPACE_RISK, NO_SPACE_TEXT } from 'utils/validate';
export default {
  components: {
    BaseCreate,
    DelDialog,
    BaseSearch
  },
  data () {
    return {
      counter: 0,
      fullHeight: window.innerHeight,
      // 分页
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 删除id
      detId: '',
      // 编辑数据
      editItem: [],
      // 添加编辑弹框
      flg: 1,
      isSnackbarTop: true,
      timeout: 2000,
      dialogDel: false,
      addAndEditFormData: [],
      dialog: false,
      addOrEditHeader: {},
      // 搜索条件
      resetData: {
        name: '',
        identifier: ''
      },
      // 列表数据
      interfaceListData: [],
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      // 表头
      interfaceListSetHeaders: [
        { text: '接口名称', value: 'name', sortable: false },
        { text: '接口标识', value: 'identifier', sortable: false },
        { text: '接口描述', value: 'description', sortable: false },
        { text: '创建时间', value: 'createTime', sortable: false },
        { text: '操作', value: 'actions', sortable: false, width: '10%' }
      ],
      // 搜索组件数据
      searchForm: [
        { placeholder: '接口名称', value: '', type: 'text' },
        { placeholder: '接口标识', value: '', type: 'text' }
      ],
      // 增加按钮权限
      addInterConfigBtn: '/addInterfaceConfigButton', // 添加按钮是否展示
      editInterConfigBtn: '/editInterfaceConfigButton', // 表格编辑按钮
      deleteInterConfigBtn: '/deleteInterfaceConfigButton' // 表格删除功能
    };
  },
  filters: {
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
        this.tableHeight = window.innerHeight - 72;
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
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    constantDelCancle () {
      this.dialogDel = false;
    },
    // 删除
    async deleteEnum () {
      const params = {
        id: this.detId
      };
      if (!this.detId) return;
      try {
        const response = await dataService.removeItem(params);
        if (response.data.code === 200) {
          this.message('删除成功', 'success');
          this.dialogDel = false;
          this.initQueryGetList();
        } else if (response.data.code === 50071) {
          this.message('应用权限已开启，此接口不能删除', 'error');
          this.dialogDel = false;
        } else {
          this.message(response.data.msg);
        }
      } catch (error) {}
    },
    // 预删除
    deleteInterfaceList (id) {
      this.dialogDel = true;
      this.detId = id;
    },
    // 编辑
    async _editItem (params, form) {
      try {
        const response = await dataService.editItem(params);
        if (response.data.code === 200) {
          this.message('编辑成功', 'success');
          this.dialog = false;
          this.initQueryGetList();
        } else {
          this.message(response.data.msg);
        }
      } catch (error) {}
    },
    // 预编辑
    editInterfaceList (item) {
      this.dialog = true;
      this.flg = 2;
      this.addOrEditHeader = {
        name: '查看',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        {
          label: '接口名称*',
          value: item.name,
          type: 'text',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 50) || BASE_LENGTH_TEXT,
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        },
        {
          label: '接口标识*',
          value: item.identifier,
          type: 'text',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 50) || BASE_LENGTH_TEXT,
            v => (/^[0-9a-zA-Z_/]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线、英文斜线，及其组合'
          ]
        },
        {
          label: '接口描述*',
          value: item.description,
          type: 'textarea',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => NO_SPACE_RISK.test(v) || NO_SPACE_TEXT,
            v => (v && v.length <= 200) || '最大200字符'
          ]
        }
      ];
      this.editItem = item;
    },
    // 添加
    async _addItem (params, form) {
      try {
        const response = await dataService.addItem(params);
        if (response.data.code === 200) {
          this.message('添加成功', 'success');
          this.dialog = false;
          this.initQueryGetList();
        } else {
          this.message(response.data.msg);
        }
      } catch (error) {}
    },
    // 预添加
    AddInterfaceListData () {
      this.dialog = true;
      this.flg = 1;
      this.addOrEditHeader = {
        name: '添加',
        value: 'add',
        isEdit: false
      };
      this.addAndEditFormData = [
        {
          label: '接口名称*',
          value: '',
          type: 'text',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 50) || BASE_LENGTH_TEXT,
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        },
        {
          label: '接口标识*',
          value: '',
          type: 'text',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 50) || BASE_LENGTH_TEXT,
            v => (/^[0-9a-zA-Z_/]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线、英文斜线，及其组合'
          ]
        },
        {
          label: '接口描述*',
          value: '',
          type: 'textarea',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => NO_SPACE_RISK.test(v) || NO_SPACE_TEXT,
            v => (v && v.length <= 200) || '最大200字符'
          ]
        }
      ];
    },
    // 弹框确定
    save (arg, form) {
      let params = {};
      if (this.flg === 1) {
        params = {
          name: arg[0].value,
          identifier: arg[1].value,
          description: arg[2].value
        };
        this._addItem(params, form);
      } else {
        params = {
          id: this.editItem.id,
          name: arg[0].value,
          identifier: arg[1].value,
          description: arg[2].value
        };
        this._editItem(params, form);
      }
    },
    // 查看||编辑状态
    onChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 弹框取消
    cancel () {
      this.dialog = false;
    },
    // 查询
    searchList ($event) {
      this.resetData = {
        name: $event[0].value,
        identifier: $event[1].value
      };
      this.initQueryGetList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.resetData = {
        name: '',
        identifier: ''
      };
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
      const params = {
        page: this.pageNum,
        pageSize: this.pageSize,
        name: this.resetData.name,
        identifier: this.resetData.identifier
      };
      try {
        const response = await dataService.queryTableList(params);
        if (response.data.code === 200) {
          if (response.data.data.list.length > 0) {
            this.interfaceListData = response.data.data.list;
            this.totalItems = response.data.data.total;
            this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          } else {
            this.interfaceListData = [];
            this.totalItems = 0;
            this.queryPageLength = 0;
          }
        } else {
          this.message(response.data.msg);
        }
      } catch (error) {}
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
