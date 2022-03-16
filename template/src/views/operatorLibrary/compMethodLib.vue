<template>
  <div class="com-fun-lib">
    <!-- 表格 -->
    <v-row>
       <v-col :cols="3" class="py-0 fill-height">
        <v-card class="elevation-3">
          <v-card-text class="pa-0" :style="{height: tableHeight + 64 + 'px', 'overflow-y': 'auto'}">
          <tree-view
            ref="treeView"
            :items="methodItems"
            :isTop="isTopShow"
            :isFirstLineSelected='isFirstLineSelected'
            :isFirstLineOpened="isFirstLineOpened"
            :deletePowerBtn="deletePowerBtn"
            :addPowerBtn="addFunBtn"
            :editPowerBtn="editPowerBtn"
            :editTwoClassBtn="editTwoClassBtn"
            :deleteTwoClassBtn="deleteTwoClassBtn"
            :openOnClick="openOnClick"
            :itemText="itemText"
            :isEnd="isEnd"
            @edits="editMethodOrGroup"
            @removes="deleteMethodOrGroup"
            @adds='addMethodOrParam'
            @getList="clickNode($event)"
          ></tree-view>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
            <v-btn text large color="primary" v-if="hasPermission(addPowerBtn)" style="width:100%" @click="addMethodGroup">添加目录项</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col :cols="9" class="py-0 pl-0"> <v-data-table
            :headers="paramHeader"
            :items="paramItems"
            :items-per-page="1000"
            hide-default-footer
            class="elevation-3"
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
                    v-model="searchParam"
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
                  <v-btn color="primary" v-if="hasPermission(addFieldBtn)" @click="addParam()" v-show="isAddParamShow">添加参数</v-btn>
                </v-card-title>
                </v-col>
                </v-row>
              </v-toolbar>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    v-on="on"
                    color="primary"
                    v-show="item.isInternal !== '1'"
                    @click="editParam(item)"
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
                    v-show="item.isInternal !== '1' && item.isQuote !== '1' && hasPermission(deleteFieldBtn)"
                    @click="deleteParam(item)"
                  >mdi-delete</v-icon>
                </template>
                <span>删除</span>
              </v-tooltip>
            </template>
            <template v-slot:no-data>
              <div>没有数据</div>
            </template>
            <!-- 分页组件 -->
            <template v-slot:footer >
              <v-divider></v-divider>
              <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
                <div class="footer__select">
                  每页
                  <span>
                    <v-select
                      v-model="perPageNums"
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
          </v-data-table></v-col>
    </v-row>
    <!-- 添加or编辑方法类型 -->
    <base-create
      :formHeader="addOrEditHeader"
      :crudFormDialog="dialogGroup"
      :formData="formDataGroup"
      :isCanEdit='isGroupCanDelOrEdit'
      :baseCteateEditPowerBtn="editPowerBtn"
      @cancelCrudFormDialog="cancelAddOrEditGroup($event)"
      @confimDialogSave="confirmAddOrEditGroup(arguments)"
      @switchOnChange="changeGroup($event)"
    ></base-create>
      <!-- 添加or编辑方法 -->
    <base-create
      :formHeader="addOrEditHeader"
      :crudFormDialog="dialogMethod"
      :formData="formDataMethod"
      :isCanEdit='isMethodCanDelOrEdit'
      :baseCteateEditPowerBtn="editTwoClassBtn"
      @cancelCrudFormDialog="cancelAddOrEditMethod($event)"
      @confimDialogSave="confirmAddOrEditMethod(arguments)"
      @switchOnChange="changeMethod($event)"
    ></base-create>
    <!-- 添加or编辑参数 -->
    <base-create
      :formHeader='addOrEditHeader'
      :crudFormDialog='dialogParam'
      :formData='formDataParam'
      @cancelCrudFormDialog='cancelAddOrEditParam($event)'
      @confimDialogSave='confirmAddOrEditParam(arguments)'
      @switchOnChange="changeParam($event)"
      :baseCteateEditPowerBtn="baseCteateEditFieldBtn"
      cardHeight="80vh">
    </base-create>
    <!-- 删除弹窗 -->
      <del-dialog :isDialogShow='dialogDel' @cancelDel='cancleDelParam($event)' @confimDel='confirmDel($event)'></del-dialog>
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

import * as dataServe from '../../api/compMethodlib.js';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';
import { BASE_NAME, BASE_VALUE, BASE_NAME_TEXT, BASE_VALUE_TEXT, NO_SPACE_RISK } from '../../utils/validate.js';
import { getTreeList } from '../../api/tempparamlib.js';
import { getAllTradeType } from 'api/sceneManagement';
export default {
  data () {
    return {
      // 分页变量
      pageNum: 1,
      queryPageLength: 0,
      perPageNums: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      treeIds: [],
      fullHeight: window.innerHeight,
      // ---------------提示框相关变量-------------
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      // ----------参数相关变量-------------------
      searchParam: '',
      paramHeader: [
        { text: '参数名', value: 'paramName', sortable: false, width: 100 },
        { text: '参数', value: 'paramField', sortable: false, width: 100 },
        { text: '参数来源', value: 'paramLib', sortable: false, width: 100 },
        { text: '说明', value: 'comment', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: '10%' }
      ],
      paramItems: [],

      // ------------树形结构相关变量--------------
      methodItems: [],
      itemText: 'methodType',
      isTopShow: false,
      isEnd: true,
      isFirstLineSelected: false,
      isFirstLineOpened: true,
      openOnClick: false,
      listMethod: [],
      activeNode: null,
      // ----------新增编辑弹窗相关----------------
      addOrEditHeader: {
        name: '添加方法类型',
        value: 'add',
        isEdit: true
      },
      dialogGroup: false,
      formDataGroup: [
        {
          label: '方法类型*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '参数名不能为空',
            v => (v && v.length <= 50) || '最多只能输入50个字符',
            v => NO_SPACE_RISK.test(v) || '参数名不能为空'
          ]
        }
      ],
      isGroupCanDelOrEdit: true,
      dialogMethod: false,
      formDataMethod: [
        {
          label: '方法名*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '方法名不能为空',
            v => (v && v.length <= 50) || '最多只能输入50个字符'
          ]
        },
        {
          label: '输出数据类型*',
          value: '',
          type: 'select',
          required: true,
          rules: [v => !!v || '类型不能为空'],
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        },
        {
          label: '方法描述*',
          value: '',
          type: 'textarea',
          required: true,
          counter: '200',
          rules: [
            v => !!v || '方法描述不能为空',
            v => (v && v.length <= 200) || '最多只能输入200个字符'
          ]
        }
      ],
      isMethodCanDelOrEdit: true,
      dialogParam: false,
      formDataParam: [
        { label: '参数名*', value: '', type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => (v && v.length <= 50) || '最大50个字符', v => BASE_NAME.test(v) || BASE_NAME_TEXT] },
        { label: '参数*', value: '', type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => (v && v.length <= 50) || '最大50个字符', v => BASE_VALUE.test(v) || BASE_VALUE_TEXT] },
        { label: '参数来源*',
          value: [],
          type: 'treeSelect',
          required: true,
          rules: [v => !!v || '不能为空或只有空格'],
          isMultiple: true,
          options: this.paramSrc
        },
        {
          label: '数据类型*',
          value: '',
          type: 'select',
          required: true,
          rules: [v => !!v || '不能为空或只有空格'],
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        },
        {
          label: '说明',
          value: '',
          type: 'textarea',
          counter: 200
        }
      ],
      paramSrc: [],
      srcList: [],
      // -----------删除弹窗相关------------------
      delGroup: null,
      delMethod: null,
      delParam: null,
      dialogDel: false,
      confirmDel: '',
      // 当前添加方法所在的方法类型
      currentMethodType: null,
      // 当前添加参数所在方法
      currentMethod: {},
      // 当前被编辑的参数
      currentParam: {},
      // 是否显示添加参数的按钮
      isAddParamShow: false,
      // 数据类型列表数据
      dataTypeItems: [],
      // 增加按钮权限
      addPowerBtn: '/addCalcMethodMenuButton', // 控制添加目录按钮是否展示
      editPowerBtn: '/editCalcMethodMenuButton', // 控制编辑目录按钮是否展示
      deletePowerBtn: '/deleteCalcMethodMenuButton', // 控制删除目录按钮是否展示
      addFunBtn: '/addCalcMethodButton', // 控制添加方法按钮是否展示
      editTwoClassBtn: '/editCalcMethodButton', // 控制添加方法按钮是否展示
      deleteTwoClassBtn: '/deleteCalcMethodButton', // 控制添加方法按钮是否展示
      addFieldBtn: '/addCalcMethodParamButton', // 控制添加目录按钮是否展示
      baseCteateEditFieldBtn: '/editCalcMethodParamButton', // 当编辑字段按钮展示时，控制baseCreate中的编辑开关
      deleteFieldBtn: '/deleteCalcMethodParamButton' // 删除字段按钮权限
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
  components: {
    TreeView,
    BaseCreate,
    DelDialog
  },
  watch: {},
  methods: {
    message (msg, type) {
      this.snackbarServe = true;
      this.snackbarServeMsg = msg;
      this.snackbarServeColor = type || 'error';
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
          // 左侧添加方法时给数据类型下拉框赋值
          this.formDataMethod[1].options.push({
            selectText: item.paramName,
            selectField: item.paramValue
          });
        });
      } catch (error) {}
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 获取方法分组和方法
    getGroupList () {
      let params = {
        content: '',
        pageSize: 10000,
        page: 1
      };
      let paramOfMethod = {
        content: '',
        pageSize: 10000,
        page: 1
      };
      dataServe.groupQuery(params).then(res => {
        if (res.data.code === 200) {
          this.methodItems = res.data.data;
          dataServe.methodQuery(paramOfMethod).then(res => {
            if (res.data.code === 200) {
              this.methodItems.forEach(eleOfGroup => {
                this.$set(eleOfGroup, 'children', []);
                this.$set(eleOfGroup, 'isEnd', true);
                eleOfGroup.level = 1;
                eleOfGroup.isfirstClass = true;
                res.data.data.forEach(eleOfMethod => {
                  if (eleOfGroup.id === eleOfMethod.gid) {
                    eleOfMethod.level = 2;
                    eleOfMethod.isTwoClass = true;
                    this.$set(eleOfMethod, 'methodType', eleOfMethod.mthodName);
                    eleOfGroup.children.push(eleOfMethod);
                  }
                });
                this.listMethod = [];
                this.treeToList(this.methodItems);
              });
              this.$refs.treeView.setOpen([this.methodItems[0].id]);
            } else {
              this.message(res.data.msg);
            }
          }).catch(err => {
            console.log(err);
            this.message(err.data.msg);
          });
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        console.log(err);
        this.message(err.data.msg);
      });
    },
    // 点击树形结构编辑按钮
    editMethodOrGroup (item) {
      if (item.level === 1) {
        this.dialogGroup = true;
        this.addOrEditHeader = {
          name: '编辑方法类型',
          value: 'edit',
          isEdit: true
        };
        this.formDataGroup = [
          {
            label: '方法类型*',
            value: item.methodType,
            type: 'text',
            required: true,
            counter: '50',
            rules: [
              v => !!v || '方法类型不能为空',
              v => (v && v.length <= 50) || '最多只能输入50个字符',
              v => NO_SPACE_RISK.test(v) || '方法类型不能为空'
            ]
          }
        ];
        this.currentMethodType = item;
      } else {
        this.dialogMethod = true;
        this.addOrEditHeader = {
          name: '编辑方法',
          value: 'edit',
          isEdit: true
        };
        this.formDataMethod = [
          {
            label: '方法名*',
            value: item.mthodName,
            type: 'text',
            required: true,
            counter: '50',
            rules: [
              v => !!v || '方法名不能为空',
              v => (v && v.length <= 50) || '最多只能输入50个字符'
            ]
          },
          {
            label: '输出数据类型*',
            value: item.dataType,
            type: 'select',
            required: true,
            rules: [v => !!v || '类型不能为空'],
            selectText: 'selectText',
            selectField: 'selectField',
            options: this.dataTypeItems
          },
          {
            label: '方法描述*',
            value: item.comment,
            type: 'textarea',
            required: true,
            counter: '200',
            rules: [
              v => !!v || '方法描述不能为空',
              v => (v && v.length <= 200) || '最多只能输入200个字符'
            ]
          }
        ];
        this.currentMethod = item;
      }
    },
    // 点击树状结构删除按钮
    deleteMethodOrGroup (item) {
      this.dialogDel = true;
      if (item.level === 1) {
        this.delGroup = item;
        this.confirmDel = this.confirmDelGroup;
      } else {
        this.delMethod = item;
        this.confirmDel = this.confirmDelMethod;
      }
    },
    // 点击树状结构新增按钮
    addMethodOrParam (item) {
      if (item.level === 1) {
        this.dialogMethod = true;
        this.addOrEditHeader = {
          name: '新增方法',
          value: 'add',
          isEdit: false
        };
        this.currentMethodType = item;
      } else {
        this.currentMethod = item;
      }
    },
    // 点击节点事件
    clickNode (item) {
      this.searchParam = '';
      this.activeNode = item;
      this.currentMethod = {};
      this.searchParam = '';
      this.pageNum = 1;
      this.perPageNums = 10;
      this.$set(this.currentMethod, 'id', item[0]);
      this.getParam();
      this.listMethod.forEach(element => {
        if (element.id === item[0]) {
          if (element.level === 1) {
            this.isAddParamShow = false;
          } else if (element.level === 2) {
            this.isAddParamShow = true;
          }
        }
      });
    },
    // -----------------------------------------
    // 添加方法分组
    addMethodGroup () {
      this.dialogGroup = true;
      this.addOrEditHeader = {
        name: '添加方法类型',
        value: 'add',
        isEdit: false
      };
    },
    // 新增编辑弹窗取消按钮
    cancelAddOrEditGroup (paramsData) {
      this.dialogGroup = false;
      paramsData.reset();
    },
    // 新增编辑弹窗确定按钮
    confirmAddOrEditGroup (param) {
      if (this.addOrEditHeader.value === 'add') {
        let params = {
          methodType: this.formDataGroup[0].value
        };
        dataServe.groupAdd(params).then(res => {
          if (res.data.code === 200) {
            this.message('添加方法类型成功', 'success');
            this.getGroupList();
          } else {
            this.message(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.message(err.data.msg);
        });
      } else {
        let params = {
          id: this.currentMethodType.id,
          methodType: this.formDataGroup[0].value
        };
        dataServe.groupUpdate(params).then(res => {
          if (res.data.code === 200) {
            this.message('修改方法类型成功', 'success');
            this.getGroupList();
          } else {
            this.message(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.message(err.data.msg);
        });
      }
      this.dialogGroup = false;
    },
    // 编辑弹窗switch
    changeGroup (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看方法类型',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑方法类型',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 确定删除分组
    confirmDelGroup () {
      let params = {
        id: this.delGroup.id
      };
      dataServe.groupDelete(params).then(res => {
        if (res.data.code === 200) {
          this.message('删除方法类型成功', 'success');
          this.getGroupList();
          this.dialogDel = false;
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        console.log(err);
        this.message(err.data.msg);
      });
    },
    //  ----------------------------------------
    // 新增编辑弹窗取消按钮
    cancelAddOrEditMethod (paramsData) {
      this.dialogMethod = false;
      paramsData.reset();
    },
    // 新增编辑弹窗确定按钮
    confirmAddOrEditMethod () {
      if (this.addOrEditHeader.value === 'add') {
        let params = {
          gid: this.currentMethodType.id,
          mthodName: this.formDataMethod[0].value,
          dataType: this.formDataMethod[1].value,
          comment: this.formDataMethod[2].value
        };
        dataServe.methodAdd(params).then(res => {
          if (res.data.code === 200) {
            this.message('添加方法成功', 'success');
            this.getGroupList();
          } else {
            this.message(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.message(err.data.msg);
        });
      } else {
        let params = {
          id: this.currentMethod.id,
          mthodName: this.formDataMethod[0].value,
          dataType: this.formDataMethod[1].value,
          comment: this.formDataMethod[2].value
        };
        dataServe.methodUpdate(params).then(res => {
          if (res.data.code === 200) {
            this.message('修改方法成功', 'success');
            this.getGroupList();
          } else {
            this.message(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.message(err.data.msg);
        });
      }
      this.dialogMethod = false;
    },
    // 编辑弹窗switch
    changeMethod (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看方法',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑方法',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 确定删除方法
    confirmDelMethod () {
      let params = {
        id: this.delMethod.id
      };
      dataServe.methodDelete(params).then(res => {
        if (res.data.code === 200) {
          this.message('删除方法成功', 'success');
          this.getGroupList();
          this.dialogDel = false;
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        console.log(err);
        this.message(err.data.msg);
      });
    },
    // -----------------------------------------
    onPageChange (page) {
      this.pageNum = page;
      this.getParam();
    },
    pageChange (p) {
      this.perPageNums = p;
      this.pageNum = 1;
      this.getParam();
    },
    inputSearch () { // 右侧列表搜索框查询方法
      this.pageNum = 1;
      this.getParam();
    },
    // 获取参数
    getParam () {
      let params = {
        mid: this.currentMethod.id,
        pageSize: this.perPageNums,
        page: this.pageNum,
        paramName: this.searchParam
      };
      dataServe.paramQuery(params).then(res => {
        if (res.data.code === 200) {
          this.paramItems = res.data.data.paramsList;
          this.totalItems = res.data.data.total;
          this.queryPageLength = res.data.data.totalPages;
          this.paramItems.forEach(element => {
            if (!element.paramLib) {
              element.paramLib = '输入框';
            }
          });
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        console.log(err);
        this.message(err.data.msg);
      });
    },
    // 添加参数
    addParam () {
      this.dialogParam = true;
      this.addOrEditHeader = {
        name: '新增方法参数',
        value: 'add',
        isEdit: false
      };
      console.log(this.formDataParam);
      /* this.paramSrc[0].children[0].children = '';
      this.paramSrc[0].children[0].value = '没有数据'; */
      this.formDataParam[2].value = [];
      this.formDataParam[2].options = this.paramSrc;
      this.formDataParam[3].options = this.dataTypeItems;
      console.log(this.formDataParam);
    },
    // 编辑参数
    editParam (item) {
      this.dialogParam = true;
      this.addOrEditHeader = {
        name: '编辑方法参数',
        value: 'edit',
        isEdit: true
      };
      let s = [];
      let that = this;
      var getData = function (arr) {
        arr.forEach((r, i) => {
          let isHas = that.treeIds.find(item => item === r.id);
          if (isHas) {
            s.push(r.id);
          }
          if (r.children && r.children.length) {
            getData(r.children);
          };
        });
      };
      getData(JSON.parse(item.paramSrc));
      this.formDataParam = [
        { label: '参数名*', value: item.paramName, type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => (v && v.length <= 50) || '最大50个字符', v => BASE_NAME.test(v) || BASE_NAME_TEXT] },
        { label: '参数*', value: item.paramField, type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => (v && v.length <= 50) || '最大50个字符', v => BASE_VALUE.test(v) || BASE_VALUE_TEXT] },
        { label: '参数来源*',
          value: s,
          type: 'treeSelect',
          required: true,
          rules: [v => !!v || '不能为空或只有空格'],
          isMultiple: true,
          options: this.paramSrc
        },
        {
          label: '数据类型*',
          value: item.paramType,
          type: 'select',
          required: true,
          rules: [v => !!v || '不能为空或只有空格'],
          selectText: 'selectText',
          selectField: 'selectField',
          options: this.dataTypeItems
        },
        {
          label: '说明',
          value: item.comment,
          type: 'textarea',
          counter: 200
        }
      ];
      this.currentParam = item;
    },
    // 删除参数
    deleteParam (item) {
      let params = {
        id: item.id
      };
      // 删除前是否引用
      dataServe.methodIsRecord(params).then(res => {
        if (res.data.code === 200) {
          this.dialogDel = true;
          this.confirmDel = this.confirmDelParam;
          this.delParam = item;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        console.log(err);
        this.message(err.data.msg);
      });
    },
    // 新增编辑弹窗取消按钮
    cancelAddOrEditParam (paramsData) {
      this.dialogParam = false;
      paramsData.reset();
    },
    // 新增编辑弹窗确定按钮
    confirmAddOrEditParam (param) {
      if (!this.formDataParam[2].value.length) {
        this.message('请选择参数来源');
        return;
      }
      if (this.formDataParam[4].value && this.formDataParam[4].value.length > 200) {
        this.message('说明字段最大可输入200字符');
        return;
      }
      if (this.addOrEditHeader.value === 'add') {
        let params = {
          mid: this.currentMethod.id,
          paramName: this.formDataParam[0].value,
          paramField: this.formDataParam[1].value,
          paramSrc: this.paramSrcSwitch(this.formDataParam[2].value),
          paramType: this.formDataParam[3].value,
          comment: this.formDataParam[4].value,
          paramSerial: this.paramItems.length + 1 + ''
        };
        dataServe.paramAdd(params).then(res => {
          if (res.data.code === 200) {
            this.message('添加方法参数成功', 'success');
            this.getParam(this.currentMethod.id);
          } else {
            this.message(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.message(err.data.msg);
        });
      } else {
        let params = {
          id: this.currentParam.id,
          mid: this.currentMethod.id,
          paramName: this.formDataParam[0].value,
          paramField: this.formDataParam[1].value,
          paramSrc: this.paramSrcSwitch(this.formDataParam[2].value),
          paramType: this.formDataParam[3].value,
          comment: this.formDataParam[4].value,
          paramSerial: this.currentParam.paramSerial
        };
        dataServe.paramUpdate(params).then(res => {
          if (res.data.code === 200) {
            this.message('修改方法参数成功', 'success');
            this.getParam(this.currentMethod.id);
          } else {
            this.message(res.data.msg);
          }
        }).catch(err => {
          console.log(err);
          this.message(err.data.msg);
        });
      }
      this.dialogParam = false;
    },
    // 编辑弹窗switch
    changeParam (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看方法参数',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑方法参数',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 确定删除参数
    confirmDelParam () {
      let params = {
        id: this.delParam.id

      };
      dataServe.paramDelete(params).then(res => {
        if (res.data.code === 200) {
          this.message('删除方法参数成功', 'success');
          this.dialogDel = false;
          this.getParam(this.currentMethod.id);
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        console.log(err);
        this.message(err.data.msg);
      });
    },
    // ------------------------------------------
    cancleDelParam () {
      this.dialogDel = false;
    },
    // -----------------------------------------
    // 树形结构数据转成数组
    treeToList (node) {
      if (!!node && node.length !== 0) {
        node.forEach(item => {
          this.listMethod.push(item);
          if (!!item.children && item.children.length !== 0) {
            this.treeToList(item.children);
          }
        });
      }
    },
    getSrcList (list) {
      if (!!list && list.length !== 0) {
        list.forEach(item => {
          this.srcList.push(item.id);
          if (item.children && item.children.length !== 0) {
            this.getSrcList(item.children);
          }
        });
      }
    },
    // 参数来源转换成所需格式
    paramSrcSwitch (param) {
      let as = param;
      let ss = as;
      let valueList = this.paramSrc;
      let arr = [];
      // 循环一级菜单
      ss.forEach(s => {
        valueList.forEach((d, j) => {
          if (s === d.id) {
            arr.push({
              id: d.id,
              label: d.label,
              children: []
            });
          }
        });
      });
      // 循环二级菜单
      ss.forEach(s => {
        arr.forEach((o, j) => {
          valueList.forEach((v, m) => {
            if (o.id === v.id) {
              if (v.children) {
                for (var k = 0; k < v.children.length; k++) {
                  if (s === v.children[k].id) {
                    if (v.id) {
                      if (v.id === 'TRADETYPE_VAR' || v.id === 'APP_VAR') {
                        o.children.push({
                          id: v.children[k].id,
                          label: v.children[k].label,
                          value: v.children[k].value,
                          children: []
                        });
                      } else {
                        o.children.push({
                          id: v.children[k].id,
                          label: v.children[k].label,
                          children: []
                        });
                      }
                    }
                  }
                }
              }
            }
          });
        });
      });
      // 循环三级菜单
      ss.forEach(s => {
        arr.forEach((a, j) => {
          valueList.forEach((v, m) => {
            if (a.id === v.id) {
              a.children.forEach((aa, ai) => {
                v.children.forEach((vv, vm) => {
                  if (aa.id === vv.id) {
                    if (vv.children) {
                      for (var k = 0; k < vv.children.length; k++) {
                        if (s === vv.children[k].id) {
                          aa.children.push({
                            id: vv.children[k].id,
                            label: vv.children[k].label,
                            value: vv.children[k].value || null
                          });
                        };
                      }
                    }
                  }
                });
              });
            };
          });
        });
      });
      return JSON.stringify(arr);
    },
    getPath () {
      localStorage.setItem('getMenu', '/compMethodLib');
    }
  },
  created () {
    // 获取当前页的路由名称
    this.getPath();
    this.getDataTypeList(); // 获取数据类型下拉数据
    this.getGroupList();
    getTreeList().then(res => {
      let paramsArray = res.data.data;
      let that = this;
      let getIds = function (arr) {
        arr.forEach(item => {
          that.treeIds.push(item.id);
          if (item.id === 'APP_VAR' || item.id === 'TRADETYPE_VAR') {
            delete item.children;
          }
          if (item.children && item.children.length) {
            getIds(item.children);
          } else {
            delete item.children;// 删掉接口返回的tree数组children是null或者空数组节点
          }
        });
      };
      getIds(paramsArray);
      this.paramSrc = paramsArray;
      this.formDataParam[2].options = paramsArray;
    });
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  }
};
</script>
<style lang="stylus" scoped>
.com-fun-lib .btn {
  margin-bottom: 20px;
}
.com-fun-lib .left-btn {
  margin-right: 20px;
}
.com-fun-lib .btn {
  text-align: left;
}
</style>
