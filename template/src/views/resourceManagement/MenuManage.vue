<!----------  @author: YinGuoZheng  ----------->
<!----------  @updated_at: 2020-03-28  ----------->
<!----------  @version: 1.0  ----------->

<template>
  <div class="enu-content">
    <v-row no-gutters>
      <!-- 左侧树 -->
      <v-col cols="3" class="pr-3 fill-height">
        <v-card class="elevation-3">
          <v-card-text class="pa-0" :style="{height: tableHeight + 84 + 'px', 'overflow-y': 'auto'}">
          <tree-view
            ref="treeView"
            :items="treeListDatas"
            :isTop="isTopShow"
            :isEnd="isEndShow"
            :addPowerBtn="addPowerBtn"
            :editPowerBtn="editPowerBtn"
            :deletePowerBtn="deletePowerBtn"
            @getList="_getlist"
            @adds="_adds"
            @edits="_edits"
            @removes="_removes"
          ></tree-view>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 列表 -->
      <v-col cols="9">
        <v-card class="pa-2 elevation-3" tile>
          <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :fixed-header="true"
            :items-per-page="20"
            no-results-text="没有匹配的数据"
            :height="tableHeight"
          >
            <template v-slot:no-data>
              <div>没有数据</div>
            </template>
            <!-- 分页组件 -->
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
        </v-card>
      </v-col>
    </v-row>
    <!-- 添加编辑弹窗 -->
    <base-create
      :formHeader='addOrEditHeader'
      :crudFormDialog='dialog'
      :formData='addAndEditFormData'
      :baseCteateEditPowerBtn="editPowerBtn"
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
  queryTreeList,
  queryTableList,
  preAdds,
  addItem,
  preEdits,
  editItem,
  removeItem
} from '../../api/menuManage.js';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';
import { NO_EMPTY_SPACE_ALLOWED, NO_EMPTY_STRING } from 'utils/validate';
export default {
  components: {
    TreeView,
    BaseCreate,
    DelDialog
  },
  data () {
    return {
      fullHeight: window.innerHeight,
      detId: '',
      // 预添加编辑参数
      addEditIds: {},
      flg: 1,
      isSnackbarTop: true,
      timeout: 2000,
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      dialogDel: false,
      addAndEditFormData: [],
      dialog: false,
      addOrEditHeader: {},
      // 是否第一级
      isTopShow: false,
      // 是否最后一级
      isEndShow: false,
      // 交互ID
      treeIds: [],
      // 列表树结构
      treeListDatas: [],
      desserts: [],
      // 表头
      headers: [
        { text: '资源名称', value: 'name', sortable: false },
        { text: 'url', value: 'url', sortable: false },
        { text: '图标', value: 'iconId', sortable: false },
        { text: '创建时间', value: 'createTime', sortable: false }
      ],
      pageSize: 10, // 每页10条
      perPageNum: 10,
      perPageItems: [5, 10, 15, 20, 50, 100],
      totalItems: 0,
      queryPageLength: 0,
      pageNum: 1,
      listTree: '',
      // 增加按钮权限
      addPowerBtn: '/addResourceButton', // 控制添加按钮是否展示
      editPowerBtn: '/editResourceButton', // 控制编辑按钮是否展示
      deletePowerBtn: '/deleteResourceButton'// 控制删除按钮是否展示
    };
  },
  filters: {
  },
  watch: {
    search (val) {
      if (val) {
        this.queryPageLength = 0;
      } else {
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      }
    }
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        // return this.fullHeight - 101;
        return this.fullHeight - 170;
      }
    }
  },
  created () {
    this.initQueryTreeList();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestory () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this._getlist(this.treeIds);
    },
    // 切换每页显示几条数据
    pageChange (p) {
      this.pageNum = 1; // 默认从第一页开始查询
      this.perPageNum = p;
      this._getlist(this.treeIds);
    },

    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    constantDelCancle () {
      this.dialogDel = false;
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 编辑状态
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
    // 弹框确定
    saveOrgZtion (arg, form) {
      this.dialog = false;
      let params = {};
      if (this.flg === 1) {
        params = {
          pid: this.addEditIds.id,
          name: arg[1].value,
          url: arg[2].value,
          resourcesType: arg[3].value,
          iconId: arg[4].value,
          description: arg[5].value
        };
        params.resourcesType = params.resourcesType ? parseInt(params.resourcesType) : '';
      } else {
        params = {
          pid: this.addEditIds.pid,
          id: this.addEditIds.id,
          resourcesType: arg[3].value,
          name: arg[1].value,
          url: arg[2].value,
          iconId: arg[4].value,
          description: arg[5].value
        };
      }
      this.flg === 1 ? this._addItem(params, form) : this._editItem(params, form);
    },
    // 弹框取消
    cancel () {
      this.dialog = false;
    },
    // 删除
    deleteEnum (arg, form) {
      const params = {
        id: this.detId
      };
      if (!this.detId) return;
      removeItem(params).then(res => {
        if (res.data.code === 200) {
          this.message('删除成功', 'success');
          this.initQueryTreeList();
          this.dialogDel = false;
          this.desserts = [];
        } else {
          this.message(res.data.msg, 'error');
        }
      },
      err => {
        if (err.data.code === 50033) {
          this.message(err.data.msg);
          return;
        }
        this.message(err.msg);
      });
    },
    // 预删除
    _removes (item, open, index) {
      this.dialogDel = true;
      this.detId = item.id;
    },
    // 编辑成功
    _editItem (params, form) {
      editItem(params).then(res => {
        if (res.data.code === 200) {
          this.message('编辑成功', 'success');
          this.initQueryTreeList();
          this.dialog = false;
          this._getlist(this.treeIds);
          form.reset();
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 预编辑
    _edits (item, open, index) {
      const params = {
        id: item.id
      };
      preEdits(params)
        .then(res => {
          if (res.data.code === 200) {
            const datas = res.data.data.data;
            this.addEditIds = datas;
            this.dialog = true;
            this.flg = 2;
            this.addOrEditHeader = {
              name: '编辑',
              value: 'edit',
              isEdit: true
            };
            this.addAndEditFormData = [
              {
                label: '父级资源*',
                value: datas.pidName,
                type: 'noEditText',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED
                ]
              },
              {
                label: '资源名称*',
                value: datas.name,
                type: 'text',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED,
                  v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                ]
              },
              {
                label: 'url*',
                value: datas.url,
                type: 'text',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED,
                  v => (/^[0-9a-zA-Z_/]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线、英文斜线，及其组合'
                ]
              },
              {
                label: '菜单类型*',
                value: datas.resourcesType,
                type: 'select',
                rules: [
                  v => !!v || NO_EMPTY_STRING
                ],
                multiple: false,
                selectText: 'selectText',
                selectField: 'selectField',
                options: [
                  { selectText: '目录', selectField: 1 },
                  { selectText: ' 一级菜单(带图标的页面)', selectField: 2 },
                  { selectText: '二级菜单(不带图标的页面)', selectField: 3 },
                  { selectText: 'tab页', selectField: 4 },
                  { selectText: '详情页', selectField: 5 },
                  { selectText: '页面元素(包括按钮，图片/logo，版权/文字div)', selectField: 6 }
                ]
              },
              {
                label: '图标*',
                value: datas.iconId,
                type: 'text',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED,
                  v => (/^[0-9a-zA-Z_-]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线、英文横线，及其组合'
                ]
              },
              {
                label: '资源描述',
                value: datas.description,
                type: 'textarea'
              }
            ];
          } else {
            this.message(res.data.msg);
          }
        },
        err => {
          this.message(err.message);
        });
    },
    // 添加成功
    _addItem (params, form) {
      addItem(params).then(res => {
        if (res.data.code === 200) {
          this.message('添加成功', 'success');
          this.initQueryTreeList();
          this.dialog = false;
          this._getlist(this.treeIds);
          form.reset();
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 预添加
    _adds (item, open, index) {
      const params = {
        id: item.id
      };
      preAdds(params)
        .then(res => {
          if (res.data.code === 200) {
            this.addEditIds = res.data.data.data;
            this.dialog = true;
            this.flg = 1;
            this.addOrEditHeader = {
              name: '添加',
              value: 'add',
              isEdit: false
            };
            this.addAndEditFormData = [
              {
                label: '父级资源*',
                value: item.name,
                type: 'noAddText',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED
                ]
              },
              {
                label: '资源名称*',
                value: '',
                type: 'text',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED,
                  v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                ]
              },
              {
                label: 'url*',
                value: '',
                type: 'text',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED,
                  v => (/^[0-9a-zA-Z_/]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线、英文斜线，及其组合'
                ]
              },
              {
                label: '菜单类型*',
                value: '',
                type: 'select',
                rules: [
                  v => !!v || NO_EMPTY_STRING
                ],
                multiple: false,
                selectText: 'selectText',
                selectField: 'selectField',
                options: [
                  { selectText: '目录', selectField: 1 },
                  { selectText: ' 一级菜单(带图标的页面)', selectField: 2 },
                  { selectText: '二级菜单(不带图标的页面)', selectField: 3 },
                  { selectText: 'tab页', selectField: 4 },
                  { selectText: '详情页', selectField: 5 },
                  { selectText: '页面元素(包括按钮，图片/logo，版权/文字div)', selectField: 6 }
                ]
              },
              {
                label: '图标*',
                value: '',
                type: 'text',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED,
                  v => (/^[0-9a-zA-Z_-]+$/.test(v)) || '包含英文字母（大小写）、数字、英文下划线、英文横线，及其组合'
                ]
              },
              {
                label: '资源描述',
                value: '',
                type: 'textarea'
              }
            ];
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 列表
    _getlist (ev) {
      if (this.listTree !== ev[0]) {
        this.pageNum = 1;
        this.perPageNum = 10;
      }
      this.listTree = ev[0];
      const params = {
        id: this.listTree,
        pageIndex: this.pageNum,
        pageSize: this.perPageNum
      };
      this.treeIds = [ev[0]];
      queryTableList(params)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.list.length > 0) {
              this.desserts = res.data.data.list;
              this.isTopShow = res.data.data.isTop;
              this.isEndShow = res.data.data.isEnd;
              this.totalItems = res.data.data.total;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
            } else {
              this.isTopShow = res.data.data.isTop;
              this.isEndShow = res.data.data.isEnd;
              this.totalItems = 0;
              this.desserts = [];
              this.queryPageLength = 0;
            }
          } else {
            this.message(res.data.msg);
            this.queryPageLength = 0;
          }
        },
        err => {
          this.message(err.message);
        });
    },
    // 获取机构组织树
    initQueryTreeList () {
      queryTreeList()
        .then(res => {
          if (res.data.code === 200) {
            const datas = res.data.data;
            this.treeListDatas = datas.items.reverse();
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
.vue-treeselect__control {
  background: none;
}
.v-treeview-node.v-treeview-node--rounded .v-treeview-node__root {
  margin-top: 1px;
  margin-bottom: 1px;
}
.v-treeview-node--leaf>.v-treeview-node__root {
  padding-left: 1px;
}
.v-treeview-node {
  margin-left: 0;
}
</style>
