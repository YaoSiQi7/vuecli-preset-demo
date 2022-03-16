<template>
  <div class="enu-content">
    <v-row>
      <!-- 添加变量 -->
      <v-col :cols="3" class="py-0 fill-height">
        <v-card class="elevation-3">
          <v-card-text class="pa-0" :style="{height: tableHeight + 64 + 'px', 'overflow-y': 'auto'}">
            <tree-view
            ref="treeView"
            :items="constItem"
            :itemText="itemText"
            :isTop="isTopShow"
            :deletePowerBtn="deletePowerBtn"
            :editPowerBtn="editPowerBtn"
            :isFirstLineSelected='isFirstLineSelected'
            :isEnd="isEnd"
            @edits="editVar"
            @removes="deteleVar"
            @getList="constMenu($event)"
          ></tree-view>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
            <v-btn text large color="primary" v-if="hasPermission(addPowerBtn)" style="width:100%" @click="addFun">添加目录项</v-btn>
            <div v-else style="width:100%;height: 44px;"> </div>
          </v-card-actions>
        </v-card>
      </v-col>
      <!-- 添加字段 -->
      <v-col ref="bodyDiv" :cols="9" class="py-0 pl-0">
        <v-card class="elevation-3">
          <v-data-table
            :headers="filHeader"
            :items="filItem"
            class="tableId"
            hide-default-footer
            no-results-text="没有匹配的数据"
            :items-per-page="1000"
            :height="tableHeight"
            :fixed-header="true"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-row style="align-items: center;">
                  <v-col class="mb-0" md="3">
                    <v-card-title class="pl-0">
                      <v-text-field
                        v-model="search1"
                        placeholder="请输入条件搜索"
                        append-icon="mdi-magnify"
                        outlined
                        dense
                        @keyup="inputSearch"
                      ></v-text-field>
                    </v-card-title>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col md="2">
                    <v-card-title>
                      <v-btn color="primary" v-if="hasPermission(addFieldBtn)" @click="addFilParms()">添加字段</v-btn>
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-toolbar>
            </template>
            <template v-slot:body="{ items }">
              <tr v-for="(item, index) in items" :key="index" class="el-tr-defu">
                <td class="el-border-defu" :title="item.fieldName">{{ item.fieldName | ellipsis() }}</td>
                <td :style="{width: widthNumber}" class="el-border-defu tableEllipsis" :title="item.fieldValue">{{ item.fieldValue }}</td>
                <td class="el-border-defu" :title="item.isEnumeration">{{ item.isEnumeration | isEnumfunc()}}</td>
                <td class="el-border-defu" :title="item.comment">{{ item.comment }}</td>
                <td class="el-border-defu">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-1 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="editFildParms(item)"
                      >mdi-pencil</v-icon>
                    </template>
                    <span>编辑</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-1 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="_deletefiled(item)"
                        v-show="item.isInternal !== '1' && item.isQuote !== '1' && hasPermission(deleteFieldBtn)"
                      >mdi-delete</v-icon>
                    </template>
                    <span>删除</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
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
    <!-- 添加常量 -->
    <base-create
      :formHeader="addOrEditHeader"
      :crudFormDialog="dialog"
      :formData="addAndEditFormData"
      :isCanEdit='isGroupCanDelOrEdit'
      @cancelCrudFormDialog="cancel($event)"
      @confimDialogSave="save"
      @switchOnChange="onChange($event)"
      :baseCteateEditPowerBtn="editPowerBtn"
    ></base-create>
    <del-dialog
      :isDialogShow="dialogDel"
      @cancelDel="constantDelCancle($event)"
      @confimDel="deleteEnum($event)"
    ></del-dialog>
    <!--  添加字段 -->
    <base-create
      :formHeader="addOrEditHeaderFil"
      :crudFormDialog="dialog_fil"
      :formData="fieldFormData"
      :isCanEdit='isFieldCanDelOrEdit'
      @cancelCrudFormDialog="fieldCancle($event)"
      @confimDialogSave="fieldSave"
      @switchOnChange="onChangeFil($event)"
      :baseCteateEditPowerBtn="baseCteateEditFieldBtn"
    ></base-create>
    <del-dialog
      :isDialogShow="dialogDel_f"
      @cancelDel="delFieldCancle($event)"
      @confimDel="delFieldOk($event)"
    ></del-dialog>
    <!-- 公共弹框提示 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >{{ snackbarServeMsg }}</v-snackbar>
  </div>
</template>

<script>
import {
  getRuList,
  addVar,
  deteleVar,
  editVar,
  getFieldList,
  addField,
  updateField,
  deleteField
} from '../../api/rulesVariableLib.js';
import { getAllTradeType } from 'api/sceneManagement';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';
import {
  BASE_NAME,
  BASE_VALUE,
  BASE_NAME_TEXT,
  BASE_VALUE_TEXT
} from '../../utils/validate.js';
export default {
  data () {
    return {
      fullHeight: window.innerHeight,
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // ---------------------------------
      itemText: 'groupName',
      isTopShow: false,
      isEnd: true,
      isFirstLineSelected: true,
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      valid: true,
      lazy: false,
      colorIndex: 0,
      isActive: [true],
      search: '',
      search1: '',
      constHeader: [
        { text: '变量名', value: 'groupName', sortable: false, width: 100 },
        { text: '变量', value: 'classPath', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      filHeader: [
        { text: '字段名', value: 'fieldName', sortable: false, width: 100 },
        { text: '字段', value: 'fieldValue', sortable: false, width: '30%' },
        {
          text: '是否有枚举值',
          value: 'isEnumeration',
          sortable: false,
          width: 100
        },
        { text: '说明', value: 'comment', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: '10%' }
      ],
      // 右侧列表内容
      filItem: [],
      constItem: [],
      dialog: false,
      dialogDel: false,
      dialog_fil: false,
      dialogDel_f: false,
      editVarId: '',
      zId: '',
      fId: '',
      dFilId: '',
      vfl: 1,
      fFl: 1,
      // 删除变量Id
      detVarId: '',
      //  表单，添加
      addOrEditHeader: {
        name: '添加',
        value: 'add',
        isEdit: false
      },
      addOrEditHeaderFil: {
        name: '添加',
        value: 'add',
        isEdit: false
      },
      addAndEditFormData: [
        {
          label: '变量名*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || '变量名不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= 50) || '最大50个字符'
          ]
        },
        {
          label: '变量*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || '变量不能为空',
            v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            v => (v && v.length <= 200) || '最大50个字符'
          ]
        }
      ],
      fieldFormData: [],
      switchFl: false,
      isGroupCanDelOrEdit: true,
      isFieldCanDelOrEdit: true,
      // 数据类型列表数据
      dataTypeItems: [],
      // 增加按钮权限
      addPowerBtn: '/addBusinessVariableMenuButton', // 控制添加目录按钮是否展示
      editPowerBtn: '/editBusinessVariableMenuButton', // 控制编辑目录按钮是否展示
      deletePowerBtn: '/deleteBusinessVariableMenuButton', // 控制删除目录按钮是否展示
      addFieldBtn: '/addBusinessVariablerFieldButton', // 控制添加目录按钮是否展示
      baseCteateEditFieldBtn: '/editBusinessVariablerFieldButton', // 当编辑字段按钮展示时，控制baseCreate中的编辑开关
      deleteFieldBtn: '/deleteBusinessVariableFieldButton', // 删除字段按钮权限
      widthNumber: ''
    };
  },
  watch: {},
  // 右侧----是否枚举
  filters: {
    isEnumfunc (v) {
      // eslint-disable-next-line no-return-assign
      return (v === '1' ? '是' : '否');
    }
  },
  created () {
    // this.initGetEnumeList();
    this.getWidth();
    this.getPath();
    this.getDataTypeList();
    this._getRuList();
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 258;
      }
    }
  },
  components: {
    BaseCreate,
    DelDialog,
    TreeView
  },
  methods: {
    getWidth () {
      let _this = this;
      this.$nextTick(function () {
        _this.widthNumber = (_this.$refs.bodyDiv.clientWidth * 0.3 - 9) + 'px';
      });
      return _this.widthNumber;
    },
    async getDataTypeList () {
      const params = {
        identifier: 'sys_data_type'
      };
      try {
        const res = await getAllTradeType(params);
        const resData = res.data.data;
        resData.forEach(item => {
          this.dataTypeItems.push({
            selectText: item.paramName,
            selectField: item.paramValue
          });
        });
      } catch (error) {}
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    _getRuList () {
      getRuList().then(res => {
        this.constItem = res.data.data;
        if (this.colorIndex === 0) {
          res.data.data.map((res, index) => {
            if (index === 0 && this.constItem.length > 0) {
              this.zId = res.id;
              this._getFilList();
            }
          });
        }
      });
    },
    constMenu (item, index) {
      this.search1 = '';
      this.pageNum = 1;
      this.perPageNum = 10;
      this.zId = item[0];
      this._getFilList();
    },
    addFun () {
      this.dialog = true;
      this.vfl = 1;
      this.addOrEditHeader = {
        name: '添加变量',
        value: 'add',
        isEdit: false
      };
    },
    cancel () {
      this.dialog = false;
    },
    save (arg, form) {
      // console.log(arg, form);
      let parms = {
        groupName: arg[0].value,
        classPath: arg[1].value
      };
      let parmsEdit = {
        id: this.editVarId,
        groupName: arg[0].value,
        classPath: arg[1].value
      };
      this.vfl === 1
        ? this._addVar(parms, form)
        : this._editVar(parmsEdit, form);
    },
    _addVar (parms, form) {
      addVar(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.dialog = false;
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this._getRuList();
            form.reset();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    deteleVar (item) {
      this.dialogDel = true;
      this.detVarId = item.id;
    },
    deleteEnum () {
      let parms = {
        id: this.detVarId
      };
      deteleVar(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.dialogDel = false;
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this._getRuList();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    // 编辑变量
    editVar (item) {
      if (item.isInternal === '1' || item.isQuote === '1') {
        this.isGroupCanDelOrEdit = false;
      } else {
        this.isGroupCanDelOrEdit = true;
      }
      this.editVarId = item.id;
      this.vfl = 2;
      this.dialog = true;
      this.addOrEditHeader = {
        name: '查看变量',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        {
          label: '变量名*',
          value: item.groupName,
          type: 'text',
          required: true,
          rules: [
            v => !!v || '变量名不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= 50) || '最大50个字符'
          ]
        },
        {
          label: '变量*',
          value: item.classPath,
          type: 'text',
          required: true,
          rules: [
            v => !!v || '变量不能为空',
            v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            v => (v && v.length <= 50) || '最大50个字符'
          ]
        }
      ];
    },
    // 编辑变量接口
    _editVar (parms, form) {
      editVar(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.dialog = false;
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            form.reset();
            this._getRuList();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    // 取消弹窗
    constantDelCancle () {
      this.dialogDel = false;
    },
    inputSearch () { // 右侧列表搜索框查询方法
      this.pageNum = 1;
      this._getFilList();
    },
    // 添加字段部分，
    _getFilList () {
      let parms = {
        enumerateId: this.zId,
        pageIndex: this.pageNum,
        pageSize: this.perPageNum,
        fieldName: this.search1
      };
      getFieldList(parms).then(res => {
        this.filItem = res.data.data.list;
        this.totalItems = res.data.data.totalElements;
        this.queryPageLength = res.data.data.totalPages;
      });
    },
    // 编辑
    editFildParms (item) {
      if (item.isInternal === '1' || item.isQuote === '1') {
        this.isFieldCanDelOrEdit = false;
      } else {
        this.isFieldCanDelOrEdit = true;
      }
      this.fFl = 2;
      this.dialog_fil = true;
      this.fId = item.id;
      this.addOrEditHeaderFil = {
        name: '查看字段',
        value: 'edit',
        isEdit: true
      };
      let isEm = '';
      let isDisab = '';
      if (item.isEnumeration === '0') {
        isEm = '否';
        isDisab = false;
      } else {
        isEm = '是';
        isDisab = true;
      }
      this.fieldFormData = [
        {
          label: '字段名*',
          value: item.fieldName,
          type: 'text',
          required: true,
          rules: [
            v => !!v || '字段名不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= 50) || '最大50个字符'
          ]
        },
        {
          label: '字段*',
          value: item.fieldValue,
          type: 'text',
          required: true,
          rules: [
            v => !!v || '字段值不能为空',
            v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            v => (v && v.length <= 50) || '最大50个字符'
          ]
        },
        {
          label: '数据类型*',
          value: item.dataType,
          type: 'select',
          required: true,
          rules: [v => !!v || '字段值不能为空'],
          selectText: 'selectText',
          selectField: 'selectField',
          options: this.dataTypeItems
        },
        {
          label: '是否有枚举值*',
          value: isEm,
          type: 'select',
          required: true,
          disabled: isDisab,
          rules: [v => !!v || '枚举值不能为空'],
          selectText: 'selectField',
          selectField: 'selectField',
          options: [{ selectField: '是' }, { selectField: '否' }]
        },
        {
          label: '说明',
          value: item.comment,
          type: 'textarea',
          counter: 200
        }
      ];
    },
    addFilParms () {
      if (!this.constItem.length) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '没有选择目录项，请先创建目录';
        this.snackbarServeColor = 'error';
        return;
      }

      if (!this.zId) {
        return;
      }
      this.fFl = 1;
      this.dialog_fil = true;
      this.addOrEditHeaderFil = {
        name: '添加字段',
        value: 'add',
        isEdit: false
      };
      this.fieldFormData = [
        {
          label: '字段名*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || '字段名不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= 50) || '最大50个字符'
          ]
        },
        {
          label: '字段*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || '字段值不能为空',
            v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            v => (v && v.length <= 50) || '最大50个字符'
          ]
        },
        {
          label: '数据类型*',
          value: '',
          type: 'select',
          required: true,
          rules: [v => !!v || '字段值不能为空'],
          selectText: 'selectText',
          selectField: 'selectField',
          options: this.dataTypeItems
        },
        {
          label: '是否有枚举值*',
          value: '否',
          type: 'select',
          required: true,
          rules: [v => !!v || '枚举值不能为空'],
          selectText: 'selectField',
          selectField: 'selectField',
          options: [{ selectField: '是' }, { selectField: '否' }]
        },
        {
          label: '说明',
          value: '',
          type: 'textarea',
          counter: 200
        }
      ];
    },
    fieldCancle () {
      this.dialog_fil = false;
    },
    fieldSave (arg, from) {
      if (arg[4].value && arg[4].value.length > 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '说明字段最大可输入200字符';
        this.snackbarServeColor = 'error';
        return;
      }
      let parms = {};
      let e = arg[3].value === '否' ? '0' : '1';
      if (this.fFl === 1) {
        parms = {
          enumerateId: this.zId,
          fieldName: arg[0].value,
          fieldValue: arg[1].value,
          dataType: arg[2].value,
          isEnumeration: e,
          comment: arg[4].value
        };
      } else {
        parms = {
          id: this.fId,
          enumerateId: this.zId,
          fieldName: arg[0].value,
          fieldValue: arg[1].value,
          dataType: arg[2].value,
          isEnumeration: e,
          comment: arg[4].value
        };
      }
      this.fFl === 1 ? this._addFild(parms, from) : this._editFild(parms, from);
    },
    _addFild (parms, from) {
      addField(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this._getFilList();
            this.dialog_fil = false;
            from.reset();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    _editFild (parms, from) {
      updateField(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this._getFilList();
            this.dialog_fil = false;
            from.reset();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    _deletefiled (item) {
      this.dFilId = item.id;
      this.dialogDel_f = true;
    },
    delFieldCancle () {
      this.dialogDel_f = false;
    },
    delFieldOk () {
      let parms = {
        id: this.dFilId
      };
      deleteField(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this._getFilList();
            this.dialogDel_f = false;
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    onChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看变量',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑变量',
          value: 'edit',
          isEdit: true
        };
      }
    },
    onChangeFil (e) {
      if (e === false) {
        this.addOrEditHeaderFil = {
          name: '查看字段',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeaderFil = {
          name: '编辑字段',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this._getFilList();
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this._getFilList();
    },
    // 获取当前页的路由名称
    getPath () {
      localStorage.setItem('getMenu', '/rulesVariableLib');
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('resize', this.getWidth);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('resize', this.getWidth);
  }
};
</script>
<style lang="stylus" scoped>
.el-border-defu {
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.c-btn {
  text-align: left;
  padding-bottom: 20px;
}
.icon-primary{
    color: var(--v-primary-base) !important;
}
.el-tr-defu:hover {
  background: var(--v-tableRowHoverActive-base);
}
/* // tr>td {
//   white-space:normal !important
// } */
.tableId >>> .tableEllipsis {
  line-height: 48px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
