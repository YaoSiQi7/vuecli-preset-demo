<!----------  @author: YinGuoZheng  ----------->
<!----------  @updated_at: 2020-03-20  ----------->
<!----------  @version: 1.0  ----------->

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
      :items-per-page="perPageNum"
      hide-default-footer
      :fixed-header="true"
      no-data-text="没有匹配数据"
      class="elevation-3 mt-3 pl-3 pr-3"
      :height="tableHeight"
    >
      <!-- 表头 -->
      <template v-slot:top class="elevation-3">
        <v-toolbar flat height="60px">
          <v-spacer />
          <v-btn
            color="primary"
            v-if="hasPermission(addFieldBtn)"
            class="mr-1 mt-1"
            @click="AddRoleListData"
            >添加</v-btn
          >
          <v-btn
            color="primary"
            disabled
            v-if="hasPermission(exportFieldBtn)"
            class="mr-1 mt-1 ml-4"
            @click="exportRoleListData"
            >导出</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-2 icon-primary"
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
          <template
            v-slot:activator="{ on }"
            v-if="hasPermission(assignRolePermissionsBtn)"
          >
            <v-icon
              small
              class="mr-2 icon-primary"
              v-on="on"
              color="primary"
              :disabled="item.ref"
              @click="toAllocate(item)"
            >
              mdi-account-arrow-right
            </v-icon>
          </template>
          <span>分配权限</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template
            v-slot:activator="{ on }"
            v-if="hasPermission(deleteRoleBtn)"
          >
            <v-icon
              small
              class="mr-1 icon-primary"
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
    <!-- 添加编辑弹窗 -->
    <base-create
      :formHeader="addOrEditHeader"
      :crudFormDialog="dialog"
      :formData="addAndEditFormData"
      :baseCteateEditPowerBtn="editRoleBtn"
      @cancelCrudFormDialog="cancel($event)"
      @confimDialogSave="saveOrgZtion"
      @switchOnChange="onChange($event)"
    ></base-create>
    <del-dialog
      :isDialogShow="dialogDel"
      @cancelDel="constantDelCancle($event)"
      @confimDel="deleteEnum($event)"
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
  queryTResources,
  allocation,
  preAddAndEdit,
  addItem,
  editItem,
  removeItem
} from '../../api/roleManage.js';
import BaseSearch from '@c/BaseSearch';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
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
      // 可见项
      perPageNum: 10,
      perPageItems: [5, 10, 15, 20, 50, 100], // 每页多少条
      totalItems: 0, // 总数
      pageNum: 1, // 分页变量
      queryPageLength: 0,
      // 删除id
      detId: '',
      // 操作项id
      addEditIds: [],
      // 分配权限
      toAllocatetions: [],
      // 是否分配权限
      isToAllocate: false,
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
        { text: '角色名称', value: 'name', sortable: false },
        { text: '角色标识', value: 'identifier', sortable: false },
        { text: '角色描述', value: 'description', sortable: false },
        // { text: '角色类型', value: 'adminId', sortable: false },
        { text: '创建时间', value: 'createTime', sortable: false },
        { text: '操作', value: 'actions', sortable: false, width: 100 }
      ],
      // 搜索组件数据
      searchForm: [
        { placeholder: '角色名称', value: '', type: 'text' },
        { placeholder: '角色标识', value: '', type: 'text' }
      ],
      // 增加按钮权限
      addFieldBtn: '/addRoleButton', // 控制添加按钮是否展示
      exportFieldBtn: '/exportRoleButton', // 控制导出按钮是否显示
      editRoleBtn: '/editRoleButton', // 表格编辑按钮
      assignRolePermissionsBtn: '/assignRolePermissionsButton', // 表格分配权限按钮
      deleteRoleBtn: '/deleteRoleButton' // 表格删除功能
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
        return this.fullHeight - 270;
      }
    }
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
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestory () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    onPageChange (page) {
      this.pageNum = page;
      this.initQueryGetList(page);
    },
    pageChange (p) {
      this.perPageNum = p;
      this.pageNum = 1;
      this.initQueryGetList();
    },

    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    constantDelCancle () {
      this.dialogDel = false;
    },
    // 导出
    exportRoleListData () {
      this.message('尽请期待', 'success');
    },
    // 分配权限
    _allocation (params, form) {
      // console.log(params);
      allocation(params).then(res => {
        if (res.data.code === 200) {
          this.message('分配成功', 'success');
          this.initQueryGetList();
          this.dialog = false;
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        this.message(err.msg);
      });
      this.isToAllocate = false;
    },
    // 预分配权限
    toAllocate (item) {
      // console.log(item);
      const params = {
        id: item.id
      };
      queryTResources(params)
        .then(res => {
          if (res.data.code === 200) {
            this.addEditIds = item;
            this.isToAllocate = true;
            this.dialog = true;
            this.flg = 2;
            this.toAllocatetions = res.data.data.items;
            this.addOrEditHeader = {
              name: '分配权限',
              value: 'edit',
              isEdit: true
            };
            this.addAndEditFormData = [
              {
                label: '分配权限*',
                value: null,
                required: true,
                rules: [v => !!v || '请选择需要分配的角色'],
                type: 'treeSelect',
                isMultiple: true,
                placeholder: '分配权限',
                valueConsistsOf: 'BRANCH_PRIORITY',
                options: this.toAllocatetions
              }
            ];
            if (res.data.data.tRoleResourcesStr !== '') {
              this.addAndEditFormData[0].value = Array.from(new Set(res.data.data.tRoleResourcesStr.split(',')));
            }
          } else {
            this.message(res.data.msg);
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 删除
    deleteEnum () {
      const params = {
        id: this.detId
      };
      if (!this.detId) return;
      removeItem(params).then(res => {
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
      const params = {
        id: item.id
      };
      preAddAndEdit(params)
        .then(res => {
          if (res.data.code === 200) {
            let roleTypeList = res.data.data.amAdminList;
            this.addEditIds = res.data.data.data;
            this.dialog = true;
            this.flg = 2;
            this.addOrEditHeader = {
              name: '编辑',
              value: 'edit',
              isEdit: true
            };
            this.addAndEditFormData = [
              {
                label: '角色名称*',
                value: res.data.data.data.name,
                type: 'text',
                rules: [
                  v => !!v || '不能为空或只有空格',
                  v => (v && v.length <= 50) || '最大50字符',
                  v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                ]
              },
              {
                label: '角色标识*',
                value: res.data.data.data.identifier,
                type: 'text',
                rules: [
                  v => !!v || '不能为空或只有空格',
                  v => (v && v.length <= 50) || '最大50字符',
                  v => (/^[0-9a-zA-Z_]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线，及其组合'
                ]
              },
              // {
              //   label: '角色类型',
              //   value: res.data.data.data.adminId,
              //   required: true,
              //   rules: [
              //     v => !!v || '不能为空或只有空格'
              //   ],
              //   type: 'select',
              //   selectText: 'selectText',
              //   selectField: 'selectField',
              //   options: []
              // },
              {
                label: '角色描述*',
                value: res.data.data.data.description,
                type: 'text',
                rules: [
                  v => !!v || '不能为空或只有空格',
                  v => (v && v.length <= 50) || '最大50字符'
                ]
              }
            ];
            // roleTypeList.forEach((item, index, ary) => {
            //   this.addAndEditFormData[2].options.push({
            //     selectText: item.name,
            //     selectField: item.identifier
            //   });
            // });
          } else {
            this.message(res.data.msg);
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 添加
    _addItem (params, form) {
      addItem(params).then(res => {
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
      const params = {
        id: ''
      };
      preAddAndEdit(params)
        .then(res => {
          if (res.data.code === 200) {
            let roleTypeList = res.data.data.amAdminList;
            this.dialog = true;
            this.flg = 1;
            this.addOrEditHeader = {
              name: '添加',
              value: 'add',
              isEdit: false
            };
            this.addAndEditFormData = [
              {
                label: '角色名称*',
                value: '',
                type: 'text',
                rules: [
                  v => !!v || '不能为空或只有空格',
                  v => (v && v.length <= 50) || '最大50字符',
                  v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                ]
              },
              {
                label: '角色标识*',
                value: '',
                type: 'text',
                rules: [
                  v => !!v || '不能为空或只有空格',
                  v => (v && v.length <= 50) || '最大50字符',
                  v => (/^[0-9a-zA-Z_]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线，及其组合'
                ]
              },
              // {
              //   label: '角色类型',
              //   value: '',
              //   required: true,
              //   rules: [
              //     v => !!v || '不能为空或只有空格'
              //   ],
              //   type: 'select',
              //   selectText: 'selectText',
              //   selectField: 'selectField',
              //   options: []
              // },
              {
                label: '角色描述*',
                value: '',
                type: 'text',
                rules: [
                  v => !!v || '不能为空或只有空格',
                  v => (v && v.length <= 50) || '最大50字符'
                ]
              }
            ];
            // roleTypeList.forEach((item, index, ary) => {
            //   this.addAndEditFormData[2].options.push({
            //     selectText: item.name,
            //     selectField: item.identifier
            //   });
            // });
          } else {
            this.message(res.data.msg);
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 弹框确定
    saveOrgZtion (arg, form) {
      let params = {};
      if (this.flg === 1) {
        params = {
          name: arg[0].value,
          identifier: arg[1].value,
          // adminId: arg[2].value,
          description: arg[2].value
        };
        this._addItem(params, form);
      } else {
        if (this.isToAllocate) {
          params = {
            id: this.addEditIds.id,
            tResourcesStr: arg[0].value.join(',')
          };
          this._allocation(params, form);
        } else {
          params = {
            id: this.addEditIds.id,
            name: arg[0].value,
            identifier: arg[1].value,
            // adminId: arg[2].value,
            description: arg[2].value
          };
          this._editItem(params, form);
        }
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
        if (this.isToAllocate) {
          this.addOrEditHeader = {
            name: '分配权限',
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
      }
    },
    // 弹框取消
    cancel () {
      this.dialog = false;
      this.isToAllocate = false;
    },
    // 查询
    searchList ($event) {
      this.searchData = {
        name: $event[0].value,
        identifier: $event[1].value
      };
      this.pageNum = 1;
      this.initQueryGetList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.searchData = {
        name: '',
        identifier: ''
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
    initQueryGetList () {
      let pageParms = {
        pageIndex: this.pageNum, // 第几页
        pageSize: this.perPageNum // 每页显示条数
      };
      let parms = Object.assign({}, pageParms, this.searchData);
      console.log(parms, 'this.totalItems');
      queryTableList(parms)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.list.length > 0) {
              this.roleListData = res.data.data.list;
              this.totalItems = res.data.data.total || res.data.data.list.length;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
            } else {
              this.roleListData = [];
              this.totalItems = 0;
              this.queryPageLength = 0;
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
