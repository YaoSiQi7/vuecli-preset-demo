<template>
  <div class="enu-content">
    <v-row>
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
            @edits="editParms"
            @removes="deleteParms"
            @getList="constMenu($event)"
          ></tree-view>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
            <v-btn text large color="primary" v-if="hasPermission(addPowerBtn)" style="width:100%" @click="tog">添加目录项</v-btn>
            <div v-else style="width:100%;height: 44px;"> </div>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col :cols="9" class="py-0 pl-0">
        <v-card class="elevation-3">
          <v-data-table
            :headers="filHeader"
            :items="filItem"
            :items-per-page='1000'
            hide-default-footer
            no-results-text="没有匹配的数据"
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
                <v-col class="mb-0" md="2">
                <v-card-title>
                  <v-btn
                    color="primary"
                    v-if="hasPermission(addFieldBtn)"
                    @click="addFilParms()"
                  >
                    添加字段
                  </v-btn>
                </v-card-title>
                </v-col>
                </v-row>
              </v-toolbar>
            </template>
            <template v-slot:item.fieldName="{ item }">
              <span :title="`${item.fieldName}`">{{ item.fieldName | ellipsis(10) }}</span>
            </template>
            <template v-slot:item.fieldValue="{ item }">
              <span :title="`${item.fieldValue}`">{{ item.fieldValue | ellipsis(10) }}</span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    v-on="on"
                    color="primary"
                    @click="editFildParms(item)"
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
                    class="mr-1 icon-primary"
                    v-on="on"
                    color="primary"
                    v-show="item.isInternal !== '1' && item.isQuote !== '1' && hasPermission(deleteFieldBtn)"
                    @click="deletefiled(item)"
                  >
                    mdi-delete
                  </v-icon>
                </template>
                <span>删除</span>
              </v-tooltip>
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
                    v-model="pageSize"
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
    <base-create :formHeader='addOrEditHeader' :crudFormDialog='dialog' :formData='addAndEditFormData' :isCanEdit='isGroupCanDelOrEdit' @cancelCrudFormDialog='cancel($event)' @confimDialogSave='save(arguments)' @switchOnChange="onChange($event)" :baseCteateEditPowerBtn="editPowerBtn"></base-create>
    <del-dialog :isDialogShow='dialogDel' @cancelDel='constantDelCancle($event)' @confimDel='deleteEnum($event)'></del-dialog>
    <!--  添加字段 -->
    <base-create :formHeader='addOrEditHeader' :crudFormDialog='dialog_fil' :formData='fieldFormData' :isCanEdit='isFieldCanDelOrEdit' @cancelCrudFormDialog='fieldCancle($event)' @confimDialogSave='fieldSave(arguments)' @switchOnChange="onChangeField($event)" :baseCteateEditPowerBtn="baseCteateEditFieldBtn"></base-create>
    <del-dialog :isDialogShow='dialogDel_f' @cancelDel='delFieldCancle($event)' @confimDel='delFieldOk($event)'></del-dialog>
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
import {
  addConstEnume,
  getEnumeList,
  deleteEnum,
  editEnum,
  addField,
  getEnumCostList,
  deleteField,
  editFieldl
} from '../../api/const-m';
// import { ERR_OK } from "../../common/js/config";
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';

export default {
  data () {
    return {
      fullHeight: window.innerHeight,
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
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
      seItem: ['String', 'boolean', 'int', 'double', 'float'],
      constHeader: [
        { text: '常量名', value: 'classPath', sortable: false, width: 100 },
        { text: '常量', value: 'groupName', sortable: false, width: 100 },
        { text: '关联字段数', value: 'relationNum', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      filHeader: [
        { text: '字段名', value: 'fieldName', sortable: false, width: 100 },
        { text: '字段', value: 'fieldValue', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: '10%' }
      ],
      // 右侧李表内容
      filItem: [],
      constItem: [], // 左侧列表内容
      enumeData: {
        groupName: '',
        classPath: '',
        relationNum: ''
      },
      filData: {
        fieldName: '',
        fieldValue: ''
      },
      dialog: false,
      dialog_d: false,
      dialogDel: false,
      dialogDel_f: false,
      dialog_fil: false,
      mflag: 1,
      fflag: 1,
      enumeId: '', // 添加常量列表中每一项的🆔id
      enumFieldId: '',
      selectData: [
        {
          // selectText: '字符串',
          selectField: 'String'
        },
        {
          // selectText: '数组',
          selectField: 'double'
        },
        {
          // selectText: '对象',
          selectField: 'boolean'
        },
        {
          // selectText: '对象',
          selectField: 'int'
        },
        {
          // selectText: '对象',
          selectField: 'float'
        }
      ],
      //  表单，添加
      addOrEditHeader: {
        name: '添加常量',
        value: 'add',
        isEdit: true
      },
      addAndEditFormData: [
        {
          label: '常量名*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '常量不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '常量只能输入汉字'
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线（_），及其组合'
          ]
        },
        {
          label: '常量*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '常量名不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // eslint-disable-next-line no-useless-escape
            // v => !((/[^\ a-\z\A-\Z]/).test(v)) || '常量名只能输入英文字母'
            v => /^[0-9a-zA-Z_]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线（_），及其组合'
          ]
        }
      ],
      fieldFormData: [
        {
          label: '字段名*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '字段名不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // eslint-disable-next-line no-useless-escape
            // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '字段只能输入汉字'
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线（_），及其组合'
          ]
        },
        {
          label: '字段*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '字段不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // eslint-disable-next-line no-useless-escape
            // v => !((/[^\ a-\z\A-\Z]/).test(v)) || '字段名只能输入英文字母'
            v => /^[0-9a-zA-Z_]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线（_），及其组合'
          ]
        }
      ],
      isGroupCanDelOrEdit: true,
      isFieldCanDelOrEdit: true,
      // 增加按钮权限
      addPowerBtn: '/addEnumConstantMenuButton', // 控制添加目录按钮是否展示
      editPowerBtn: '/editEnumConstantMenuButton', // 控制编辑目录按钮是否展示
      deletePowerBtn: '/deleteEnumConstantMenuButton', // 控制删除目录按钮是否展示
      addFieldBtn: '/addEnumConstantFieldButton', // 控制添加目录按钮是否展示
      baseCteateEditFieldBtn: '/editEnumConstantFieldButton', // 当编辑字段按钮展示时，控制baseCreate中的编辑开关
      deleteFieldBtn: '/deleteEnumConstantFieldButton' // 删除字段按钮权限
    };
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
  watch: {},
  // 展示中英文转化
  filters: {
    constantDataType: function (str, itemList) {
      let dataTypeText;
      itemList.forEach(item => {
        if (item.selectField === str) {
          dataTypeText = item.selectText;
        }
      });
      return dataTypeText;
    }
  },
  created () {
    this.getPath();
    this.initGetEnumeList();
  },
  components: {
    BaseCreate,
    DelDialog,
    TreeView
  },
  methods: {
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 添加常量--按钮
    tog () {
      this.mflag = 1;
      this.addOrEditHeader = {
        name: '添加常量',
        value: 'add',
        isEdit: false
      };
      this.dialog = !this.dialog;
    },
    // 添加常量---编辑的保存
    editEnum (paramsData) {
      const parms = {
        id: this.enumeId,
        groupName: paramsData[0][0].value,
        classPath: paramsData[0][1].value
      };
      paramsData[1].reset();
      editEnum(parms).then(res => {
        if (res.data.code === 200) {
          this.dialog = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.getEnumeList();
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
          name: '查看常量',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑常量',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 添加常量---编辑弹窗
    editParms (item, index) {
      if (item.isInternal === '1' || item.isQuote === '1') {
        this.isGroupCanDelOrEdit = false;
      } else {
        this.isGroupCanDelOrEdit = true;
      }
      this.colorIndex = index;
      this.mflag = 2;
      this.dialog = true;
      this.addOrEditHeader = {
        name: '查看常量',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        {
          label: '常量名*',
          value: item.groupName,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '常量不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '常量只能输入汉字'
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线（_），及其组合'
          ]
        },
        {
          label: '常量*',
          value: item.classPath,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '常量名不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // eslint-disable-next-line no-useless-escape
            // v => !((/[^\ a-\z\A-\Z]/).test(v)) || '常量名只能输入英文字母'
            v => /^[0-9a-zA-Z_]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线（_），及其组合'
          ]
        }
      ];
      this.enumeId = item.id;
    },
    // 左侧列表--- 删除按钮
    deleteParms (item) {
      this.dialogDel = true;
      this.enumeId = item.id;
      // this.getFieldNameList();
    },
    // 添加常量---删除确定---按钮
    deleteEnum (paramsData) {
      if (!this.enumeId) return;
      const parms = {
        enumId: this.enumeId
      };
      deleteEnum(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.dialogDel = false;
            getEnumeList()
              .then(res => {
                if (res.data.code === 200) {
                  if (res.data.data.length > 0) {
                    this.constItem = res.data.data;
                    this.constItem.forEach((item, index, ary) => {
                      if (!item.relationNum) {
                        item.relationNum = '0';
                      }
                    });
                    this.enumeId = this.constItem[Number(this.colorIndex)].id;
                    this.getFieldNameList();
                  } else {
                    this.constItem = res.data.data;
                    this.enumeId = '';
                    this.filItem = [];
                  }
                } else {
                  this.snackbarServe = true;
                  this.snackbarServeMsg = res.data.msg;
                  this.snackbarServeColor = 'error';
                }
              })
              .catch(err => {
                console.log(err);
                this.snackbarServe = true;
                this.snackbarServeMsg = err.msg;
                this.snackbarServeColor = 'error';
              });
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
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
    // 添加常量---删除取消--按钮
    constantDelCancle (paramsData) {
      this.dialogDel = false;
    },
    // 添加常量-- 添加的保存
    addConstEnume (paramsData) {
      let constant = '';
      let constantValue = '';
      this.dialog = false;
      paramsData[0].forEach((item, index, ary) => {
        if (item.label === '常量*') {
          constant = item.value;
        } else if (item.label === '常量名*') {
          constantValue = item.value;
        }
      });
      const parms = {
        groupName: constantValue,
        classPath: constant
      };
      paramsData[1].reset();
      addConstEnume(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.getEnumeList();
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
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
    // 初始化常量弹框
    __mInit () {
      this.dialog = false;
      this.$refs.m_form.reset();
      this.$refs.m_form.resetValidation();
    },
    /* saveEnume () {
      if (!this.$refs.m_form.validate()) return;
      this.mflag === 1 ? this.addConstEnume() : this.editEnum();
    }, */
    // creade 事件
    initGetEnumeList () {
      getEnumeList()
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              this.constItem = res.data.data;
              this.constItem.forEach((item, index, ary) => {
                if (!item.relationNum) {
                  item.relationNum = '0';
                }
              });
              this.enumeId = res.data.data[0].id;
              this.getFieldNameList();
            } else {
              this.constItem = res.data.data;
              this.enumeId = '';
              this.filItem = [];
            }
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.$alert.error(err.msg);
        });
    },
    // 获取左侧列表的值
    getEnumeList () {
      getEnumeList()
        .then(res => {
          if (res.data.code === 200) {
            this.constItem = res.data.data;
            this.constItem.forEach((item, index, ary) => {
              if (!item.relationNum) {
                item.relationNum = '0';
              }
            });
          }
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    // 右侧列表-----删除按钮
    deletefiled (item) {
      this.dialogDel_f = true;
      this.enumFieldId = item.id;
    },
    // 右侧列表---删除按钮----确定按钮
    delFieldOk () {
      let parms = {
        enumFieldId: this.enumFieldId
      };
      deleteField(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.getFieldNameList();
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
      this.dialogDel_f = false;
    },
    // 右侧列表---删除按钮----取消按钮
    delFieldCancle () {
      this.dialogDel_f = false;
    },
    // 点击当前切换表格   点击增加背景色
    constMenu (item) {
      this.search1 = '';
      this.pageNum = 1;
      this.pageSize = 10;
      this.$nextTick(() => {
        this.enumeId = item[0];
        this.getFieldNameList();
      });
    },
    okDelete () {
      /* const parms = {
        enumFieldId: this.enumFieldId
      }; */
      /* deleteField(parms)
        .then(res => {
          if (res.data.code ===  200) {
            this.dialogDel_f = false;
            this.getFieldNameList();
            this.$alert.success(res.data.msg);
          } else {
            this.$alert.error(res.data.msg);
          }
        }); */
      // .catch(err => {
      //   this.$alert.error(err.msg);
      // });
    },
    inputSearch () { // 右侧列表搜索框查询方法
      this.pageNum = 1;
      this.getFieldNameList();
    },
    // 获取右侧列表的内容
    getFieldNameList () {
      const parms = {
        enumerateId: this.enumeId,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        fieldName: this.search1
      };
      getEnumCostList(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.filItem = res.data.data.enumerationList;
            this.totalItems = res.data.data.total;
            this.queryPageLength = res.data.data.totalPages;
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          console.error(err.message);
        });
    },
    // 添加字段---弹窗
    addFilParms () {
      if (!this.constItem.length) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '没有选择目录项，请先创建目录';
        this.snackbarServeColor = 'error';
        return;
      }
      this.addOrEditHeader = {
        name: '添加字段',
        value: 'add',
        isEdit: false
      };
      this.dialog_fil = true;
      this.fflag = 1;
    },
    __fInit () {
      this.dialog_fil = false;
      this.$refs.filForm.reset();
      this.$refs.filForm.resetValidation();
    },
    // 添加字段---保存按钮
    addField (paramsData) {
      let field = '';
      let fieldNames = '';
      paramsData[0].forEach((item, index, ary) => {
        if (item.label === '字段*') {
          field = item.value;
        } else if (item.label === '字段名*') {
          fieldNames = item.value;
        }
      });
      const parms = {
        enumerateId: this.enumeId,
        fieldName: fieldNames,
        fieldValue: field
      };
      addField(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.getFieldNameList();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
          paramsData[1].reset();
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
          // this.$alert.error(err.msg);
        });
      this.dialog_fil = false;
    },
    onChangeField (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看字段',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑字段',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 添加字段---编辑弹框
    editFildParms (item) {
      if (item.isInternal === '1' || item.isQuote === '1') {
        this.isFieldCanDelOrEdit = false;
      } else {
        this.isFieldCanDelOrEdit = true;
      }
      this.fflag = 2;
      // this.filData.fieldName = item.fieldName;
      // this.filData.fieldValue = item.fieldValue;
      this.addOrEditHeader = {
        name: '查看字段',
        value: 'edit',
        isEdit: true
      };
      this.fieldFormData = [
        {
          label: '字段名*',
          value: item.fieldName,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '字段不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '字段名只能输入汉字'
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线（_），及其组合'
          ]
        },
        {
          label: '字段*',
          value: item.fieldValue,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '字段名不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // eslint-disable-next-line no-useless-escape
            // v => !((/[^\ a-\z\A-\Z]/).test(v)) || '字段只能输入英文字母'
            v => /^[0-9a-zA-Z_]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线（_），及其组合'
          ]
        }
      ];
      this.dialog_fil = true;
      this.enumFieldId = item.id;
    },
    // 添加字段---编辑按钮--保存
    editFieldl (paramsData) {
      const parms = {
        id: this.enumFieldId,
        fieldValue: paramsData[0][1].value,
        fieldName: paramsData[0][0].value
      };
      editFieldl(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.getFieldNameList();
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
          }
          paramsData[1].reset();
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
      this.dialog_fil = false;
    },
    cancel (paramsData) {
      this.dialog = false;
      paramsData.reset();
    },
    save (paramsData) {
      this.mflag === 1 ? this.addConstEnume(paramsData) : this.editEnum(paramsData);
    },
    fieldCancle (paramsData) {
      this.dialog_fil = false;
      paramsData.reset();
      paramsData.resetValidation();
    },
    fieldSave (paramsData) {
      this.fflag === 1 ? this.addField(paramsData) : this.editFieldl(paramsData);
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this.getFieldNameList();
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getFieldNameList();
    },
    // 获取当前页的路由名称
    getPath () {
      localStorage.setItem('getMenu', '/enumCostLib');
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  }
};
</script>
<style>
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
</style>
