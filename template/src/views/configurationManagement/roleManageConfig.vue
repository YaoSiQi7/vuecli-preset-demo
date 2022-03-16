<!----------  @author: YinGuoZheng  ----------->
<!----------  @updated_at: 2020-04-09  ----------->
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
      :headers="roleListSetHeaders"
      :items="roleListData"
      hide-default-footer
      :fixed-header="true"
      :height="tableHeight"
      :elevation="3"
      class="elevation-3 mt-3 pl-2 pr-2"
    >
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar flat height="60px">
          <v-spacer/>
          <v-btn color="primary" class="mr-1 mt-1" @click="AddRoleListData">添加</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:body="{ items }">
        <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
          <td colspan="6">没有数据</td>
        </tr>
        <tr
          v-else
          v-for="(item, index) in items"
          :key="index"
          class="el-tr-defu"
        >
          <td class="el-border-defu">
            {{ item.name }}
          </td>
          <td class="el-border-defu">
            {{ item.identifier }}
          </td>
          <td class="el-border-defu">
            {{ item.description }}
          </td>
          <td class="el-border-defu">
            {{ item.createTime }}
          </td>
          <td class="el-border-defu">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-2"
                  v-on="on"
                  color="primary"
                  @click="editRoleList(item)"
                  :disabled="item.ref"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>编辑</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  v-on="on"
                  color="primary"
                  @click="deleteRoleList(item.id)"
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
    </v-data-table>
    <!-- 添加编辑弹窗 -->
    <base-create
      :formHeader='addOrEditHeader'
      :crudFormDialog='dialog'
      :formData='addAndEditFormData'
      @cancelCrudFormDialog='cancel($event)'
      @confimDialogSave='saveOrgZtion'
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
import BaseSearch from '@c/BaseSearch';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import { NO_EMPTY_SPACE_ALLOWED, MAX_INPUT_LENGTH } from 'utils/validate';
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
      // 搜索参数
      searchData: {
        name: '',
        identifier: ''
      },
      // 列表数据
      roleListData: [],
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      // 表头
      roleListSetHeaders: [
        { text: '角色类型名称', value: '', sortable: false },
        { text: '角色类型标识', value: '', sortable: false },
        { text: '角色类型描述', value: '', sortable: false },
        { text: '创建时间', value: '', sortable: false },
        { text: '操作', value: '', sortable: false, width: '10%' }
      ],
      // 搜索组件数据
      searchForm: [
        { placeholder: '角色类型名称', value: '', type: 'text' },
        { placeholder: '角色类型标识', value: '', type: 'text' }
      ]
    };
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 205;
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
    deleteEnum () {
      const params = {
        id: this.detId
      };
      if (!this.detId) return;
      removeItem(params).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.message('删除成功', 'success');
          this.dialogDel = false;
          this.initQueryGetList();
        } else {
          this.message(res.data.msg);
        }
      },
      err => {
        this.message(err.msg);
      });
    },
    // 预删除
    deleteRoleList (id) {
      this.dialogDel = true;
      this.detId = id;
    },
    // 编辑
    _editItem (params, form) {
      editItem(params).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.message('编辑成功', 'success');
          this.dialog = false;
          this.initQueryGetList();
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 预编辑
    editRoleList (item) {
      // console.log(item);
      this.dialog = true;
      this.flg = 2;
      this.addOrEditHeader = {
        name: '查看',
        value: 'add',
        isEdit: true
      };
      this.addAndEditFormData = [
        {
          label: '角色类型名称*',
          value: item.name,
          type: 'text',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 50) || MAX_INPUT_LENGTH(50),
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        },
        {
          label: '角色类型标识*',
          value: item.identifier,
          type: 'text',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 50) || MAX_INPUT_LENGTH(50),
            v => (/^[0-9a-zA-Z_]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        },
        {
          label: '角色类型描述*',
          value: item.description,
          type: 'textarea',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 200) || MAX_INPUT_LENGTH(200)
          ]
        }
      ];
      this.editItem = item;
    },
    // 添加
    _addItem (params, form) {
      addItem(params).then(res => {
        // console.log(res);
        if (res.data.code === 200) {
          this.message('添加成功', 'success');
          this.dialog = false;
          this.initQueryGetList();
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 预添加
    AddRoleListData () {
      this.dialog = true;
      this.flg = 1;
      this.addOrEditHeader = {
        name: '添加',
        value: 'add',
        isEdit: false
      };
      this.addAndEditFormData = [
        {
          label: '角色类型名称*',
          value: '',
          type: 'text',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 50) || MAX_INPUT_LENGTH(50),
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        },
        {
          label: '角色类型标识*',
          value: '',
          type: 'text',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 50) || MAX_INPUT_LENGTH(50),
            v => (/^[0-9a-zA-Z_]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        },
        {
          label: '角色类型描述*',
          value: '',
          type: 'textarea',
          rules: [
            v => !!v || NO_EMPTY_SPACE_ALLOWED,
            v => (v && v.length <= 200) || MAX_INPUT_LENGTH(200)
          ]
        }
      ];
    },
    // 弹框确定
    saveOrgZtion (arg, form) {
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
      this.searchData = {
        name: $event[0].value,
        identifier: $event[1].value
      };
      this.initQueryGetList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.searchData = {
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
    initQueryGetList () {
      const params = this.searchData;
      queryTableList(params)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.list.length > 0) {
              this.roleListData = res.data.data.list;
            } else {
              this.roleListData = [];
            }
          } else {
            this.message(res.data.msg);
          }
        },
        err => {
          this.message(err.msg);
        });
    }
  }
};
</script>
<style>
</style>
