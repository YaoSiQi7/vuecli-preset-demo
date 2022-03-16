<template>
  <div class="enu-content">
    <v-row>
      <!-- 添加组 -->
      <v-col :cols="3" class="py-0 fill-height">
        <v-card class="elevation-3">
          <v-card-text class="pa-0" :style="{height: treeHeight - 194 + 'px', 'overflow-y': 'auto'}">
          <tree-view
            ref="treeView"
            :items="constItem"
            :itemText="itemText"
            :isTop="isTopShow"
            :deletePowerBtn="deletePowerBtn"
            :editPowerBtn="editPowerBtn"
            :isFirstLineSelected='isFirstLineSelected'
            :isEnd="isEnd"
            @edits="editEmailGroup"
            @removes="deteleEmailGroup"
            @getList="constMenu($event)"
          ></tree-view>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
            <v-btn text large color="primary" v-if="hasPermission(addPowerBtn)" style="width:100%" @click="addFun">添加目录项</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <!-- 搜索条件 -->
      <v-col :cols="9" class="py-0 pl-0">
        <div>
          <base-search @change="panelCounter">
            <template v-slot>
              <v-form
                ref="form"
                v-model="searchValid"
                lazy-validation
              >
                <v-container grid-list-xl class="ml-0 mr-0 pt-0 pb-0" >
                  <v-row>
                    <v-col
                      cols="12"
                      sm="12"
                      md="2"
                      xl="2"
                    >
                      <v-text-field
                        placeholder="请输入条件搜索"
                        v-model="form.searchStr"
                        outlined
                        dense
                        class="pt-0 pb-0"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="12"
                      md="2"
                      xl="2"
                    >
                      <v-text-field outlined dense v-model="form.dates" append-icon="event" placeholder="创建时间：" @click="dateInputClick"></v-text-field>
                    </v-col>
                    <!-- <v-col
                      cols="12"
                      sm="12"
                      md="2"
                      xl="2"
                    >
                      <v-text-field outlined dense v-model="form.updates" append-icon="event" placeholder="更新时间：" @click="updateInputClick"></v-text-field>
                    </v-col> -->
                    <v-col
                      cols="12"
                      sm="12"
                      md="3"
                      xl="3"
                      style="padding-top:18px;"
                    >
                      <v-btn
                        small
                        color="primary"
                        class="mr-2"
                        @click="reset"
                      >重置</v-btn>
                      <v-btn
                        small
                        color="primary"
                        @click="searchTable"
                        :disabled="!searchValid"
                      >
                        查询
                      </v-btn>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="12"
                      md="2"
                      xl="2"
                    >
                      <v-dialog v-model="isdateShow" width="321">
                        <v-date-picker selected-items-text="已选择日期" v-model="form.dates" range  @change="dateChange(form.dates)"></v-date-picker>
                      </v-dialog>
                    </v-col>
                    <!-- <v-col
                      cols="12"
                      sm="12"
                      md="2"
                      xl="2"
                    >
                      <v-dialog v-model="isUpdateShow" width="321">
                        <v-date-picker selected-items-text="已选择日期" v-model="form.updates" range  @change="updateChange(form.updates)"></v-date-picker>
                      </v-dialog>
                    </v-col> -->
                  </v-row>
                </v-container>
              </v-form>
            </template>
          </base-search>
        </div>
        <v-card class="elevation-3">
          <div style="margin-top: 10px;">
            <v-data-table
              :search="search1"
              :headers="filHeader"
              :items="filItem"
              hide-default-footer
              no-results-text="没有匹配的数据"
              :items-per-page="perPageNum"
              :height="tableHeight"
              :fixed-header="true"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <!-- <v-col class="mb-0" md="3">
                    <v-card-title class="pl-0">
                      <v-text-field
                        v-model="search1"
                        placeholder="请输入条件搜索"
                        append-icon="mdi-magnify"
                        outlined
                        dense
                      ></v-text-field>
                    </v-card-title>
                  </v-col> -->
                  <v-spacer></v-spacer>
                  <v-card-title>
                    <v-btn color="primary" v-if="hasPermission(addGroupBtn)" @click="addFilParms()">添加组信息</v-btn>
                  </v-card-title>
                </v-toolbar>
              </template>
              <template v-slot:body="{ items }">
                <tr v-for="(item, index) in items" :key="index" class="el-tr-defu">
                  <td class="el-border-defu" :title="`${item.groupName}`">{{ item.groupName | ellipsis() }}</td>
                  <td class="el-border-defu" :title="`${item.userName}`">{{ item.userName | ellipsis() }}</td>
                  <td class="el-border-defu" :title="`${item.dnname}`">{{ item.dnname | ellipsis() }}</td>
                  <td class="el-border-defu" :title="`${item.email}`">{{ item.email | ellipsis(11) }}</td>
                  <td class="el-border-defu" :title="`${item.createTime}`">{{ item.createTime }}</td>
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
                          v-show="item.isInternal !== '1' && item.isQuote !== '1' && hasPermission(deleteGroupBtn)"
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
          </div>
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
    <!--  添加组信息 -->
    <base-create
      ref="resetValidation"
      :formHeader="addOrEditHeaderFil"
      :crudFormDialog="dialog_fil"
      :formData="fieldFormData"
      :isCanEdit='isFieldCanDelOrEdit'
      @cancelCrudFormDialog="fieldCancle($event)"
      @confimDialogSave="fieldSave"
      @switchOnChange="onChangeFil($event)"
      @handleChangeSelect="handleChangeSelect($event)"
      :baseCteateEditPowerBtn="baseCteateEditGroupBtn"
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
  getEmailGroup,
  addEmailGroup,
  deteleEmailGroup,
  editEmailGroup,
  getEmailPeople,
  addEmailPeople,
  deteleEmailPeople,
  editEmailPeople,
  getEmailOrPhoneTree
} from '../../../api/EarlyWarningGroupManagement.js';
import BaseCreate from '@/components/BaseCreate';
import BaseSearch from '@/components/BaseSearch';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';
import {
  BASE_NAME,
  BASE_VALUE,
  BASE_NAME_TEXT,
  BASE_VALUE_TEXT
} from '../../../utils/validate.js';
import moment from 'moment';
export default {
  data () {
    return {
      counter: 0,
      treeHeight: window.innerHeight,
      fullHeight: window.innerHeight,
      // 分页变量
      pageNum: 1,
      queryPageLength: 1,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
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
        { text: '联系人组', value: 'groupName', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      filHeader: [
        { text: '联系人组', value: this.groupNameText, sortable: false, width: 100 },
        { text: '姓名', value: 'realName', sortable: false, width: 100 },
        { text: '所属机构', value: 'dnname', sortable: false, width: 100 },
        { text: '邮箱', value: 'email', sortable: false, width: 100 },
        {
          text: '创建时间',
          value: 'isEnumeration',
          sortable: false,
          width: 100
        },
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
      // 删除组Id
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
          label: '联系人组*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || '联系人组不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= 50) || '最大50个字符'
          ]
        }
      ],
      fieldFormData: [],
      switchFl: false,
      isGroupCanDelOrEdit: true,
      isFieldCanDelOrEdit: true,
      panel: 0,
      // 搜索条件
      isdateShow: false,
      isUpdateShow: false,
      searchValid: true,
      isExpanded: true,
      form: {
        dates: [],
        searchStr: []
      },
      groupNameText: '',
      nameAry: [], // 添加和编辑组信息中-姓名select的item数组
      // 增加按钮权限
      addPowerBtn: '/addWarningEmailMenuButton', // 控制添加目录按钮是否展示
      editPowerBtn: '/editWarningEmailMenuButton', // 控制编辑目录按钮是否展示
      deletePowerBtn: '/deleteWarningEmailMenuButton', // 控制删除目录按钮是否展示
      addGroupBtn: '/addWariningEmailGroupInfoButton', // 添加组按钮是否展示
      baseCteateEditGroupBtn: '/editWarningEmailGroupInfoButton', // 当编辑组按钮展示时，控制baseCreate中的编辑开关
      deleteGroupBtn: '/deleteWarningEmailGroupInfoButton' // 删除组按钮权限
    };
  },
  watch: {
    zId: function (newVal, oldVal) {
      this.constItem.forEach((item, index, ary) => {
        if (this.zId === item.id) {
          this.groupNameText = item.groupName;
        }
      });
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
  filters: {},
  created () {
    this.getPath();
    this.getEmailOrPhoneTreeData('');
    this._getRuList();
  },
  components: {
    BaseSearch,
    BaseCreate,
    DelDialog,
    TreeView
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 316;
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
    // 重置条件
    reset () {
      this.$refs.form.reset();
      this.pageNum = 1;
      this._getFilList();
    },
    // 查询
    searchTable () {
      this.baseFilterDate(this.form.dates);
      this.pageNum = 1;
      let parms = {
        groupId: this.zId,
        createTimeStart: this.form.dates.length === 2 ? this.form.dates[0] : '',
        createTimeEnd: this.form.dates.length === 2 ? this.form.dates[1] : '',
        searchStr: this.form.searchStr,
        page: 1,
        size: this.perPageNum
      };
      getEmailPeople(parms).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.records.length > 0) {
            this.filItem = res.data.data.records;
            this.totalItems = res.data.data.total;
            this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          } else {
            this.pageNum = 1;
            this.filItem = res.data.data.records;
            this.totalItems = res.data.data.total;
            this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          }
        }
      });
    },
    // 翻转数组
    reverseArry (array) {
      for (var i = 0; i < array.length / 2; i++) {
        var temp = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - 1 - i] = temp;
      }
      return array; // Array对象中的方法返回了一个数组。
    },
    // 创建时间的弹框
    dateChange (date) {
      this.$nextTick(() => {
        if (moment(date[0]).valueOf() > moment(date[1]).valueOf()) {
          this.reverseArry(date);
        }
        if (date.length === 2) {
          this.isdateShow = false;
        }
      });
    },
    // 更新时间的弹框
    updateChange (date) {
      this.$nextTick(() => {
        if (moment(date[0]).valueOf() > moment(date[1]).valueOf()) {
          this.reverseArry(date);
        }
        if (date.length === 2) {
          this.isUpdateShow = false;
        }
      });
    },
    // 创建时间和更新时间修改格式。
    baseFilterDate (data) {
      if (data.length === 2) {
        if (data[0]) {
          if (data[0].length < 11) {
            data[0] = data[0] + ' 00:00:00';
          }
        } else {
          data[0] = '';
        }
        if (data[1]) {
          if (data[1].length < 11) {
            data[1] = data[1] + ' 23:59:59';
          }
        } else {
          data[1] = '';
        }
      } else {
        data = [];
      }
    },
    // 创建时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
    },
    // 更新时间输入框的点击事件
    updateInputClick () {
      this.isUpdateShow = true;
    },
    _getRuList () {
      getEmailGroup().then(res => {
        if (res.data.code === 200) {
          this.constItem = res.data.data;
          if (this.colorIndex === 0) {
            res.data.data.map((res, index) => {
              if (index === 0 && this.constItem.length > 0) {
                this.zId = res.id;
                this._getFilList();
              }
            });
          }
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    constMenu (item, index) {
      this.zId = item[0];
      this.pageNum = 1;
      let parms = {
        groupId: this.zId,
        /* groupName: '',
        dnname: '',
        phone: '',
        userName: '',
        createTimeStart: this.form.dates.length === 2 ? this.form.dates[0] : '',
        createTimeEnd: this.form.dates.length === 2 ? this.form.dates[1] : '',
        updateTimeStart: this.form.updates.length === 2 ? this.form.updates[0] : '',
        updateTimeEnd: this.form.updates.length === 2 ? this.form.updates[1] : '', */
        page: this.pageNum,
        size: this.perPageNum
      };
      getEmailPeople(parms).then(res => {
        this.filItem = res.data.data.records;
        this.totalItems = res.data.data.total;
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      });
    },
    addFun () {
      this.dialog = true;
      this.vfl = 1;
      this.addOrEditHeader = {
        name: '添加组',
        value: 'add',
        isEdit: false
      };
    },
    cancel () {
      this.dialog = false;
    },
    save (arg, form) {
      let parms = {
        groupName: arg[0].value
      };
      let parmsEdit = {
        id: this.editVarId,
        groupName: arg[0].value
      };
      this.vfl === 1
        ? this._addGroup(parms, form)
        : this._editGroup(parmsEdit, form);
    },
    // 添加组
    _addGroup (parms, form) {
      addEmailGroup(parms)
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
    // 删除组
    deteleEmailGroup (item) {
      this.dialogDel = true;
      this.detVarId = item.id;
    },
    // 删除--组--确定按钮
    deleteEnum () {
      let parms = {
        id: this.detVarId
      };
      deteleEmailGroup(parms)
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
    // 编辑组
    editEmailGroup (item) {
      if (item.isInternal === '1' || item.isQuote === '1') {
        this.isGroupCanDelOrEdit = false;
      } else {
        this.isGroupCanDelOrEdit = true;
      }
      this.editVarId = item.id;
      this.vfl = 2;
      this.dialog = true;
      this.addOrEditHeader = {
        name: '查看组',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        {
          label: '联系人组*',
          value: item.groupName,
          type: 'text',
          required: true,
          rules: [
            v => !!v || '联系人组不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= 50) || '最大50个字符'
          ]
        }
      ];
    },
    // 编辑组接口
    _editGroup (parms, form) {
      editEmailGroup(parms)
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
    // 查询组信息部分，
    _getFilList () {
      let parms = {
        groupId: this.zId,
        /* groupName: '',
        dnname: '',
        email: '',
        userName: '',
        createTimeStart: this.form.dates.length === 2 ? this.form.dates[0] : '',
        createTimeEnd: this.form.dates.length === 2 ? this.form.dates[1] : '',
        updateTimeStart: this.form.updates.length === 2 ? this.form.updates[0] : '',
        updateTimeEnd: this.form.updates.length === 2 ? this.form.updates[1] : '', */
        page: 1,
        size: this.perPageNum
      };
      getEmailPeople(parms).then(res => {
        this.filItem = res.data.data.records;
        this.totalItems = res.data.data.total;
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      });
    },
    // 编辑
    editFildParms (item) {
      this.nameAry.forEach((items) => {
        if (items.realName === item.userName) {
          item.userNameId = items.id;
        }
      });
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
      this.fieldFormData = [
        {
          label: '联系人组*',
          value: this.groupNameText,
          type: 'noEditText'
        },
        {
          label: '姓名*',
          value: item.userNameId,
          type: 'autocomplete',
          required: true,
          rules: [
            v => !!v || '姓名不能为空'
          ],
          multiple: false,
          chips: false,
          selectText: 'realName',
          selectField: 'id',
          autocompleteOptions: this.nameAry
        },
        // {
        //   label: '部门*',
        //   value: item.dnname,
        //   type: 'text',
        //   counter: '50',
        //   required: true,
        //   rules: [
        //     v => !!v || '部门不能为空',
        //     v => (/^[^\s]+$/.test(v)) || '包含除空格以外的任意字符，及其组合',
        //     // v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
        //     v => (v && v.length <= 50) || '最大50个字符'
        //   ]
        // },
        {
          label: '邮箱*',
          value: item.email,
          type: 'noEditText',
          required: true,
          rules: [
            v => !!v || '邮箱不能为空',
            // v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            // eslint-disable-next-line no-useless-escape
            v => ((/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ig).test(v)) || '请输入正确的邮箱'
          ]
        }
      ];
    },
    // 添加和编辑组信息中的{姓名}change事件，联动效果是选择姓名之后，自动填充邮箱
    handleChangeSelect ($event) {
      for (let index = 0; index < this.nameAry.length; index++) {
        if ($event.value === this.nameAry[index].id) {
          this.fieldFormData.forEach((im, ix, ay) => {
            if (im.label === '邮箱*') {
              im.value = this.nameAry[index].email;
            }
          });
        }
      };
    },
    // 添加组信息弹框
    addFilParms () {
      if (!this.zId) {
        return;
      }
      this.fFl = 1;
      this.dialog_fil = true;
      this.addOrEditHeaderFil = {
        name: '添加组信息',
        value: 'add',
        isEdit: false
      };
      this.$nextTick(() => {
        this.fieldFormData = [
          {
            label: '联系人组*',
            value: this.groupNameText,
            type: 'noAddText'
          },
          {
            label: '姓名*',
            value: '',
            type: 'autocomplete',
            autocompleteOptions: this.nameAry,
            selectText: 'realName',
            selectField: 'id',
            required: true,
            rules: [
              v => !!v || '姓名不能为空'
              // v => (/^[^\s]+$/.test(v)) || '包含除空格以外的任意字符，及其组合'
              // v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
              // v => (v && v.length <= 50) || '最大50个字符'
            ],
            multiple: false,
            chips: false
          },
          // {
          //   label: '部门*',
          //   value: '',
          //   type: 'text',
          //   counter: '50',
          //   required: true,
          //   rules: [
          //     v => !!v || '部门不能为空',
          //     v => (/^[^\s]+$/.test(v)) || '包含除空格以外的任意字符，及其组合',
          //     // v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
          //     v => (v && v.length <= 50) || '最大50个字符'
          //   ]
          // },
          {
            label: '邮箱*',
            value: '',
            type: 'noAddText',
            required: true,
            rules: [
              v => !!v || '邮箱不能为空',
              // v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
              // eslint-disable-next-line no-useless-escape
              v => ((/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ig).test(v)) || '请输入正确的邮箱'
            ]
          }
        ];
        this.$refs.resetValidation.resetValidation();
      });
    },
    fieldCancle () {
      this.dialog_fil = false;
    },
    fieldSave (arg, from) {
      let parms = {};
      if (this.fFl === 1) {
        parms = {
          groupId: this.zId,
          userName: arg[1].value
        };
      } else {
        parms = {
          id: this.fId,
          groupId: this.zId,
          userName: arg[1].value
        };
      }
      this.fFl === 1 ? this._addFild(parms, from) : this._editFild(parms, from);
    },
    _addFild (parms, from) {
      addEmailPeople(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this._getFilList();
            this.dialog_fil = false;
            from.reset();
          } else {
            this.dialog_fil = false;
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.dialog_fil = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    _editFild (parms, from) {
      editEmailPeople(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this._getFilList();
            this.dialog_fil = false;
            from.reset();
          } else {
            this.dialog_fil = false;
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.dialog_fil = false;
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
      deteleEmailPeople(parms)
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
          name: '查看组',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑组',
          value: 'edit',
          isEdit: true
        };
      }
    },
    onChangeFil (e) {
      if (e === false) {
        this.addOrEditHeaderFil = {
          name: '查看组信息',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeaderFil = {
          name: '编辑组信息',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this._getFilList();
    },
    // 页数
    pageChange () {
      this.pageNum = 1;
      this._getFilList();
    },
    // 获取添加和编辑弹窗中姓名和邮箱数据
    getEmailOrPhoneTreeData (realName) {
      let params = {
        realName: realName
      };
      getEmailOrPhoneTree(params).then(res => {
        if (res.data.code === 200) {
          this.nameAry = res.data.data;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 获取当前页的路由名称
    getPath () {
      localStorage.setItem('getMenu', '/earlyWarningEmailGroupManagement');
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
