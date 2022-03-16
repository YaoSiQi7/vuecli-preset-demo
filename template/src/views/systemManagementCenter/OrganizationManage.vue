<!----------  @author: guxuerui  ----------->
<!----------  @updated_at: 2020-05-27  ----------->
<!----------  @version: 1.0  ----------->

<template>
  <div class="enu-content">
    <v-row no-gutters>
      <!-- 左侧树 -->
      <v-col cols="3" class="pr-3 fill-height">
        <v-card class="elevation-3">
          <v-card-text class="pa-0" :style="{height: tableHeight + 69 + 'px', 'overflow-y': 'auto'}">
          <!-- 搜索机构 -->
          <v-col class="head-left-sc" v-for="(item, index) in addTreeFormData" :key="index">
            <treeselect
              :value-consists-of="item.valueConsistsOf"
              :multiple="item.isMultiple"
              :options="item.options"
              :placeholder="item.placeholder"
              :default-expand-level="0"
              :flatten-search-results="true"
              v-model="item.value"
              :show-count="false"
              :clearable='false'
              no-data-text="没有匹配数据"
              @select="queryTreeSelect"
            />
          </v-col>
          <tree-view
            ref="treeView"
            :items="treeListDatas"
            :isTop="isTopShow"
            :addPowerBtn="addPowerBtn"
            :deletePowerBtn="deletePowerBtn"
            @getList="changeTreeList"
            @adds="_adds"
            @edits="_edits"
            @removes="_removes"
          ></tree-view>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 列表 -->
      <v-col cols="9">
        <v-card class="pa-2 pb-0 elevation-3" tile>
          <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :fixed-header="true"
            :elevation="3"
            :items-per-page="20"
            no-results-text="没有匹配的数据"
            :height="tableHeight"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-spacer/>
                <!-- <v-btn color="primary" class="mr-2 mt-1" @click="_adds(treeListDatas[0])">添加</v-btn> -->
                <v-btn color="primary" class="mr-2 mt-1" @click="uploadDialog = true" v-if="hasPermission(importDepartmentBtn)">批量导入</v-btn>
              </v-toolbar>
            </template>
            <template v-slot:no-data>
              <div>没有数据</div>
            </template>
            <template v-slot:footer >
              <v-divider></v-divider>
              <div class="mr-4 mb-0 mx-auto pa-2 transition-swing elevation-0">
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
      @swichOnChange="onChange($event)"
    ></base-create>
    <del-dialog
      :isDialogShow='dialogDel'
      :customDelTitle='deletePrompt'
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
    <!-- 导入表格 -->
    <v-dialog
      v-model="uploadDialog"
      persistent
      scrollable
      max-width="460px">
      <v-card height="260px">
        <v-card-title>
          <v-toolbar-title>
            导入表格数据
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="cancelUpload"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form
            ref="uploadFileForm"
            :lazy-validation="uploadLazy"
            v-model="uploadFormValid">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10" class="mt-10">
                <v-file-input
                  v-model="fileInfo"
                  required
                  :rules="[v => !!v || '请选择文件']"
                  show-size
                  accept=".xlsx"
                  :disabled="uploadIsLoading"
                  :loading="uploadIsLoading"
                  prepend-icon=""
                  outlined
                  dense
                  label="点击选择文件，文件后缀为: .xlsx">
                </v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="primary mr-4"
              outlined
              style="color:white"
              @click="downloadTemp">下载模板
            </v-btn>
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white"
              @click="batchImport"
              :disabled="!uploadFormValid"
              :loading="btnLoading"
            >
              导入
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  queryTreeSelectList,
  queryTreeList,
  queryTableList,
  preAdds,
  addItem,
  preEdits,
  editItem,
  removeItem,
  importDepartment,
  getDepartData
} from '../../api/OrganizationManage.js';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';
import Treeselect from '@riophae/vue-treeselect';
import { NO_EMPTY_SPACE_ALLOWED } from 'utils/validate';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
// import { getDepartData } from 'api/UserManage';
export default {
  components: {
    TreeView,
    Treeselect,
    BaseCreate,
    DelDialog
  },
  data () {
    return {
      btnLoading: false, // 按钮添加loading，避免多次提交
      fullHeight: window.innerHeight,
      // 删除提示
      deletePrompt: '',
      detId: '',
      currnetSelectNode: [],
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
      addTreeFormData: [
        {
          required: true,
          type: 'treeSelect',
          placeholder: '',
          value: null,
          valueConsistsOf: 'BRANCH_PRIORITY',
          options: []
        }
      ],
      dialog: false,
      addOrEditHeader: {},
      // 是否第一级
      isTopShow: false,
      // 交互ID
      treeIds: [],
      // 分页
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 列表树结构
      treeListDatas: [],
      desserts: [],
      // 表头
      headers: [
        { text: '机构名称', value: 'name', sortable: false },
        { text: '机构号', value: 'institutionNumber', sortable: false },
        { text: '创建时间', value: 'createTime', sortable: false },
        { text: '修改时间', value: 'updateTime', sortable: false }
      ],
      evId: [],
      // 上传表格变量
      uploadDialog: false,
      uploadFormValid: true,
      uploadLazy: false,
      fileInfo: null,
      uploadIsLoading: false,
      // 增加按钮权限
      addPowerBtn: '/addDepartmentButton', // 控制添加按钮是否展示
      editPowerBtn: '/editDepartmentButton', // 控制编辑按钮是否展示
      deletePowerBtn: '/deleteDepartmentButton', // 控制删除按钮是否展示
      importDepartmentBtn: '/importDepartmentButton' // 导入按钮是否显示
    };
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
        return this.fullHeight - 154;
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  created () {
    this.initQueryTreeList();
  },
  methods: {
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
      // this.dialog = false;
      let parms = {};
      if (this.flg === 1) {
        if (this.isTopShow) {
          parms = {
            companyId: this.addEditIds.companyId,
            parentId: null,
            name: arg[1].value,
            institutionNumber: arg[2].value
          };
        } else {
          parms = {
            companyId: null,
            parentId: this.addEditIds.id,
            name: arg[1].value,
            institutionNumber: arg[2].value
          };
        }
      } else {
        parms = {
          id: this.addEditIds.id,
          name: arg[1].value,
          institutionNumber: arg[2].value
        };
      }
      this.flg === 1 ? this._addItem(parms, form) : this._editItem(parms, form);
    },
    // 弹框取消
    cancel () {
      this.dialog = false;
    },
    // 删除
    deleteEnum (arg, form) {
      const parms = {
        id: this.detId
      };
      if (!this.detId) return;
      removeItem(parms).then(res => {
        if (res.data.code === 200) {
          this.message('删除成功', 'success');
          this.dialogDel = false;
          this.queryTreeSelect(this.currnetSelectNode);
          this.desserts = [];
          this.queryPageLength = 0;
        } else {
          this.message(res.data.msg);
        }
      },
      err => {
        this.message(err.msg);
      });
    },
    // 预删除
    _removes (item, open, index) {
      this.dialogDel = true;
      this.detId = item.id;
      this.deletePrompt = '确认要删除机构？机构下的子机构也将被删除';
    },
    // 编辑成功
    _editItem (parms, form) {
      editItem(parms).then(res => {
        if (res.data.code === 200) {
          this.message('编辑成功', 'success');
          this.dialog = false;
          this.queryTreeSelect(this.currnetSelectNode);
          this._getlist(this.treeIds);
          form.reset();
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        if (err.data.code === 50024) {
          this.message(err.data.msg);
          return;
        }
        this.message(err.msg);
      });
    },
    // 预编辑
    _edits (item, open, index) {
      const parms = {
        id: item.id
      };
      preEdits(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.addEditIds = res.data.data.data;
            this.dialog = true;
            this.flg = 2;
            this.addOrEditHeader = {
              name: '编辑',
              value: 'edit',
              isEdit: true
            };
            if (res.data.data.belong) {
              this.addAndEditFormData = [
                {
                  label: '所属公司*',
                  value: res.data.data.data.companyName,
                  type: 'noEditText'
                },
                {
                  label: '机构名称*',
                  value: item.name,
                  type: 'text',
                  rules: [
                    v => !!v || NO_EMPTY_SPACE_ALLOWED,
                    v => (v && v.length <= 50) || '最大50字符',
                    v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                  ]
                },
                {
                  label: '机构号*',
                  value: res.data.data.data.institutionNumber,
                  type: 'text',
                  rules: [
                    v => !!v || NO_EMPTY_SPACE_ALLOWED,
                    v => (v && v.length <= 50) || '最大50字符',
                    v => (/^[a-zA-Z_\d]+$/.test(v)) || '包含英文字母（大小写）、英文下划线，数字，及其组合'
                  ]
                }
              ];
            } else {
              this.addAndEditFormData = [
                {
                  label: '所属机构*',
                  value: res.data.data.data.companyName,
                  type: 'noEditText'
                },
                {
                  label: '机构名称*',
                  value: item.name,
                  type: 'text',
                  rules: [
                    v => !!v || NO_EMPTY_SPACE_ALLOWED,
                    v => (v && v.length <= 50) || '最大50字符',
                    v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                  ]
                },
                {
                  label: '机构号*',
                  value: res.data.data.data.institutionNumber,
                  type: 'text',
                  rules: [
                    v => !!v || NO_EMPTY_SPACE_ALLOWED,
                    v => (v && v.length <= 50) || '最大50字符',
                    v => (/^[a-zA-Z_\d]+$/.test(v)) || '包含英文字母（大小写）、英文下划线，数字，及其组合'
                  ]
                }
              ];
            }
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 添加成功
    _addItem (parms, form) {
      addItem(parms).then(res => {
        console.log(res, 123123123);
        if (res.data.code === 200) {
          this.message('添加成功', 'success');
          this.dialog = false;
          this.queryTreeSelect(this.currnetSelectNode);
          this._getlist(this.treeIds);
          form.reset();
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        if (err.data.code === 50023) {
          this.message(err.data.msg);
          return;
        }
        this.message(err.msg);
      });
    },
    // 预添加
    _adds (item, open, index) {
      const parms = {
        id: item.id
      };
      preAdds(parms)
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
            if (this.isTopShow) {
              this.addAndEditFormData = [
                {
                  label: '所属公司*',
                  value: item.name,
                  type: 'noAddText'
                },
                {
                  label: '机构名称*',
                  value: '',
                  type: 'text',
                  rules: [
                    v => !!v || NO_EMPTY_SPACE_ALLOWED,
                    v => (v && v.length <= 50) || '最大50字符',
                    v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                  ]
                },
                {
                  label: '机构号*',
                  value: '',
                  type: 'text',
                  rules: [
                    v => !!v || NO_EMPTY_SPACE_ALLOWED,
                    v => (v && v.length <= 50) || '最大50字符',
                    v => (/^[a-zA-Z_\d]+$/.test(v)) || '包含英文字母（大小写）、英文下划线，数字，及其组合'
                  ]
                }
              ];
            } else {
              this.addAndEditFormData = [
                {
                  label: '所属机构*',
                  value: item.name,
                  type: 'noAddText'
                },
                {
                  label: '机构名称*',
                  value: '',
                  type: 'text',
                  rules: [
                    v => !!v || NO_EMPTY_SPACE_ALLOWED,
                    v => (v && v.length <= 50) || '最大50字符',
                    v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                  ]
                },
                {
                  label: '机构号*',
                  value: '',
                  type: 'text',
                  rules: [
                    v => !!v || NO_EMPTY_SPACE_ALLOWED,
                    v => (v && v.length <= 50) || '最大50字符',
                    v => (/^[a-zA-Z_\d]+$/.test(v)) || '包含英文字母（大小写）、英文下划线，数字，及其组合'
                  ]
                }
              ];
            }
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this._getlist(this.treeIds);
    },
    // 页数
    pageChange (p) {
      this.pageSize = p;
      this.pageNum = 1;
      this._getlist(this.treeIds);
    },
    // 机构组织树
    queryTreeSelect (node) {
      if (this.currnetSelectNode) {
        if (this.currnetSelectNode.id !== node.id || node.id === undefined) {
          this.$refs.treeView.resetSel();
        }
      }
      this.currnetSelectNode = node;
      const parms = {
        companyId: node.id
      };
      queryTreeList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.desserts = [];
            // this.queryPageLength = 0;
            this.$nextTick(() => {
              this.treeListDatas = [res.data.data.items];
              this._getlist([this.treeListDatas[0].id]);
            });
          } else {
            this.message(res.data.msg);
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 获取下拉树
    initQueryTreeList () {
      queryTreeSelectList().then(res => {
        if (res && res.data.code === 200) {
          const datas = res.data.data;
          this.addTreeFormData[0].options = datas.companyItems;
          this.addTreeFormData[0].placeholder = datas.firstCompanyName;
          this.treeListDatas = [datas.amDepartmentItems];
          this.currnetSelectNode = datas.amDepartmentItems;
          this._getlist([this.treeListDatas[0].id]);
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    changeTreeList (ev) {
      this.pageNum = 1;
      this.perPageNum = 10;
      this._getlist(ev);
    },
    // 列表
    _getlist (ev) {
      const parms = {
        id: ev[0],
        page: this.pageNum,
        pageSize: this.pageSize
      };
      this.treeIds = [ev[0]];
      queryTableList(parms)
        .then(res => {
          if (res && res.data.code === 200) {
            if (res.data.data.list.length > 0) {
              this.desserts = res.data.data.list;
              this.isTopShow = res.data.data.isTop;
              this.totalItems = res.data.data.total;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
            } else {
              this.isTopShow = res.data.data.isTop;
              this.desserts = [];
              this.totalItems = 0;
              this.queryPageLength = 0;
            }
          } else {
            this.message(res.data.msg);
          }
        }).catch(err => {
          console.error(err);
        });
    },
    // 下载模板
    downloadTemp () {
      console.log('下载');
      getDepartData().then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = '机构数据模板' + '.xlsx';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.message(err.msg, 'error');
      });
    },
    // 导入
    batchImport () {
      if (this.$refs.uploadFileForm.validate()) {
        this.uploadIsLoading = true;
        this.btnLoading = true;
        let formData = new FormData();
        // 把文件信息放入对象中
        formData.append('file', this.fileInfo);
        importDepartment(formData).then(res => {
          this.snackbarServe = true;
          this.btnLoading = false;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.initQueryTreeList();
          this.cancelUpload();
        }).catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
          this.uploadIsLoading = false;
          this.btnLoading = false;
        });
      }
    },
    // 隐藏导入
    cancelUpload () {
      console.log('隐藏');
      this.$refs.uploadFileForm.reset();
      this.uploadDialog = false;
      this.uploadIsLoading = false;
    }
  }
};
</script>
<style lang="stylus" scoped>
.vue-treeselect__control {
  background: none;
}
.head-left-sc {
  padding: 10px 24px;
  border: none;
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
>>>.v-treeview-node__label {
    overflow: visible;
}
>>>.v-treeview-node__append > div{
    display:flex;
}
</style>
