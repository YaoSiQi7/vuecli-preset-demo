<template>
  <!-- 预警策略配置 -->
  <div class="enu-content fill-height">
    <!-- 搜索表单 -->
    <base-search @change="panelCounter">
      <template v-slot>
          <!-- 条件查询form -->
          <slot>
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
                      placeholder="预警策略模板名称："
                      :rules="[
                        // eslint-disable-next-line no-mixed-operators
                        // v => v.length <= 50 || '最多只能输入50个字符',
                        // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '常量只能输入汉字'
                        // v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                      ]"
                      v-model="form.templateName"
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
                    <v-text-field
                      placeholder="预警指标："
                      :rules="[
                        // v => v.length <= 64 || '最多只能输入64个字符',
                        // eslint-disable-next-line no-useless-escape
                        // v => /^[0-9a-zA-Z_]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线，及其组合'
                      ]"
                      v-model="form.templateIndicatorName"
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
                  <v-col
                    cols="12"
                    sm="12"
                    md="2"
                    xl="2"
                    style="padding-top:18px;"
                  >
                    <v-btn
                      small
                      color="primary"
                      class="mr-2"
                      @click="reset"
                    >重置</v-btn>
                    <v-btn
                      color="primary"
                      @click="searchTable"
                      :disabled="!searchValid"
                    >
                      查询
                    </v-btn>
                  </v-col>
                  <v-col
                    small
                    cols="12"
                    sm="12"
                    md="2"
                    xl="2"
                  >
                    <v-dialog v-model="isdateShow" width="321">
                      <v-date-picker selected-items-text="已选择日期" v-model="form.dates" range  @change="dateChange(form.dates)"></v-date-picker>
                    </v-dialog>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </slot>
      </template>
    </base-search>
    <v-row class="mt-3">
      <v-col cols='12' class="py-0">
        <v-card class="elevation-3">
          <v-data-table
            :headers="constHeader"
            :items="constItem"
            :items-per-page="perPageNum"
            hide-default-footer
            :loading = "loading"
            loading-text="正在加载中..."
            no-results-text="没有匹配的数据"
            :height="tableHeight"
            :fixed-header="true"
          >
            <!-- 列表头 -->
            <template v-slot:top>
              <v-toolbar flat>
                <!-- <v-toolbar-title style="font-size:18px">
                  应用管理数据
                </v-toolbar-title> -->
                <!-- <v-divider
                  class="mx-4"
                  inset
                  vertical
                /> -->
                <v-spacer></v-spacer>
                <v-card-title>
                  <v-btn
                    color="primary"
                    v-if="hasPermission(addStrategyBtn)"
                    @click="addParms()"
                  >
                    添加
                  </v-btn>
                </v-card-title>
              </v-toolbar>
            </template>
            <!-- 列表项 -->
            <template v-slot:body="{ items }">
              <tr
                v-for="(item, index) in items"
                :key="index"
                class="el-tr-defu"
              >
                <td
                  :title="`${item.templateName}`"
                  class="el-border-defu"
                >
                  {{ item.templateName }}
                </td>
                <td
                  :title="`${item.templateIndicatorName}`"
                  class="el-border-defu"
                >
                  {{ item.templateIndicatorName }}
                </td>
                <td
                  :title="`${item.createTime}`"
                  class="el-border-defu"
                >
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
                        @click="editFunc(item, index)"
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
                        class="mr-2"
                        v-on="on"
                        color="primary"
                        v-if="hasPermission(deleteStrategyBtn)"
                        @click="deleteFunc(item)"
                      >
                        mdi-delete
                      </v-icon>
                    </template>
                    <span>删除</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <template v-slot:no-data>
              <div>没有数据</div>
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
        </v-card>
      </v-col>
    </v-row>
    <!-- 添加、编辑 -->
    <base-create ref="resetValidation" :formHeader='addOrEditHeader' :crudFormDialog='dialog' :formData='addAndEditFormData' :isCanEdit="isCanEdit" @cancelCrudFormDialog='cancel($event)' @confimDialogSave='save(arguments)' @switchOnChange="onChange($event)" @handleChangeSelect="handleChangeSelect(arguments)" :baseCteateEditPowerBtn="editStrategyBtn"></base-create>
    <!-- 删除弹窗 -->
    <del-dialog :isDialogShow='dialogDel' @cancelDel='constantDelCancle($event)' @confimDel='deleteEnum($event)'></del-dialog>
    <!-- 公共提示框 -->
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
import { getList, addItem, editItem, deleteItem, getPoliceTargetAry, getPoliceTargetTypeAry } from '../../api/earlyWarningPolicyTemplateManagement.js';
import { isRefrecord } from '../../api/transactionTypeConfig.js';
import BaseCreate from '@/components/BaseCreate';
import BaseSearch from '@/components/BaseSearch';
import DelDialog from '@/components/DelDialog';
import moment from 'moment';
import {
  NO_SPACE_RISK,
  NO_SPACE_TEXT,
  BASE_NAME,
  BASE_VALUE,
  BASE_NAME_TEXT,
  BASE_VALUE_TEXT } from 'utils/validate';
export default {
  data () {
    return {
      counter: 0,
      fullHeight: window.innerHeight,
      // 搜索条件
      isdateShow: false,
      searchValid: true,
      isExpanded: true, // 搜索折叠功能。true为打开状态
      form: {
        templateName: '', // 预警策略模板名称
        templateIndicatorName: '', // 预警指标
        dates: [] // 创建时间
      },
      // 列表
      constHeader: [
        { text: '预警策略模板名称', value: 'templateName', sortable: false },
        { text: '预警指标', value: 'templateIndicatorName', sortable: false },
        { text: '创建时间', value: 'createTime', sortable: false },
        { text: '操作', value: 'action', sortable: false, width: '10%' }
      ],
      constItem: [],
      editItemId: '', // 编辑当前项的id
      loading: false,
      // 分页变量
      pageNum: 1,
      queryPageLength: 1,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 公共提示词弹窗
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      dialog: false,
      dialogDel: false,
      //  表单，添加
      flg: 1,
      addOrEditHeader: {
        name: '添加预警策略模板名称',
        value: 'add',
        isEdit: true
      },
      addAndEditFormData: [
        {
          label: '预警策略模板名称*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '预警策略模板名称不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '常量只能输入汉字'
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        },
        {
          label: '预警指标*',
          value: '',
          type: 'select',
          required: true,
          rules: [
            v => !!v || '预警指标不能为空'
          ],
          selectText: 'text',
          selectField: 'value',
          options: []
        },
        {
          label: '预警指标类型*',
          value: '',
          type: 'select',
          required: true,
          rules: [
            v => !!v || '预警指标类型不能为空'
          ],
          selectText: 'text',
          selectField: 'value',
          comment: '',
          options: []
        },
        {
          label: '参数名*',
          value: '',
          type: 'text',
          counter: '100',
          required: true,
          rules: [
            v => !!v || '参数名不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= 100) || '最大100个字符'
          ]
        }
      ],
      deteleId: '', // 删除ID
      deleteItemAry: {},
      tradeTypeProperty: [],
      earlyWarningTarget: [], // 预警指标
      earlyWarningType: [], // 预警指标类型
      earlyWarningTargetName: '', // 预警指标
      earlyWarningTypeName: '', // 预警指标类型
      // 增加按钮权限
      addStrategyBtn: '/addWarningStrategyTempButton', // 添加按钮是否展示
      editStrategyBtn: '/editWarningStrategyTempButton', // 当编辑按钮展示时，控制baseCreate中的编辑开关
      deleteStrategyBtn: '/deleteWarningStrategyTempButton', // 删除按钮权限
      // 当前点击了编辑的项
      currentItem: null,
      // 当前项是否可以编辑
      isCanEdit: true
    };
  },
  components: {
    DelDialog,
    BaseSearch,
    BaseCreate
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 270;
      }
    },
    // 创建时间
    createDateValue () {
      return this.form.createTime ? this.form.createTime : '';
    }
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
    this.getList();
  },
  methods: {
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 获取列表内容
    getList () {
      this.baseFilterDate(this.form.dates);
      let pageParms = {
        pageIndex: this.pageNum, // 第几页
        pageSize: this.perPageNum, // 每页显示条数
        templateName: this.form.templateName ? this.form.templateName : '',
        templateIndicatorName: this.form.templateIndicatorName ? this.form.templateIndicatorName : '',
        startTime: this.form.dates.length === 2 ? this.form.dates[0] : '',
        endTime: this.form.dates.length === 2 ? this.form.dates[1] : ''
      };
      getList(pageParms)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.list.length > 0) {
              this.constItem = res.data.data.list;
              this.totalItems = res.data.data.totalElements;
              this.queryPageLength = res.data.data.totalPages;
            } else {
              this.constItem = [];
              this.totalItems = 0;
              this.queryPageLength = 0;
            }
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        },
        err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
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
    // 查询
    searchTable () {
      this.pageNum = 1;
      this.getList();
    },
    // 重置条件
    reset () {
      this.$refs.form.reset();
      this.searchTable();
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
    // 创建时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
    },
    // 添加--弹窗
    addParms () {
      this.flg = 1;
      this.dialog = true;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.addOrEditHeader = {
        name: '添加预警策略模板',
        value: 'add',
        isEdit: false
      };
      this.getEarlyWarningTarget();
    },
    // 添加--保存
    _addItem (a) {
      const parms = {
        templateName: a[0][0].value,
        templateIndicatorId: a[0][1].value,
        templateIndicatorName: this.earlyWarningTargetName,
        templateIndicatorTypeId: a[0][2].value,
        templateIndicatorTypeName: this.earlyWarningTypeName,
        templateParamName: a[0][3].value
      };
      a[1].reset();
      addItem(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.getList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 编辑--弹窗
    editFunc (item, index) {
      this.flg = 2;
      this.editItemId = item.id;
      this.getEarlyWarningTarget(item); // 获取预警指标数组
      let isRefrecordParms = {
        sourceId: item.id,
        targetType: 'APP,NOTE_NOTE'
      };
      isRefrecord(isRefrecordParms).then(isRefrecordRes => {
        if (isRefrecordRes.data.code === 200) {
          if (isRefrecordRes.data.data.isReference) {
            this.isCanEdit = false;
          } else {
            this.isCanEdit = true;
          }
        }
      });
    },
    // 编辑--保存
    _editItem (a) {
      const parms = {
        id: this.editItemId,
        templateName: a[0][0].value,
        templateIndicatorId: a[0][1].value,
        templateIndicatorName: this.earlyWarningTargetName,
        templateIndicatorTypeId: a[0][2].value,
        templateIndicatorTypeName: this.earlyWarningTypeName,
        templateParamName: a[0][3].value
      };
      a[1].reset();
      editItem(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.getList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 点击删除按钮
    deleteFunc (item) {
      this.dialogDel = true;
      this.deleteItemAry = item;
      this.deteleId = item.id;
    },
    // 删除弹窗取消
    constantDelCancle () {
      this.dialogDel = false;
    },
    // 删除弹窗确定
    deleteEnum () {
      let isRefrecordParms = {
        sourceId: this.deleteItemAry.id,
        targetType: 'APP,NOTE_NOTE'
      };
      isRefrecord(isRefrecordParms).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.isReference) {
            this.snackbarServe = true;
            this.snackbarServeMsg = '预警策略模板名称被引用，不能删除！';
            this.snackbarServeColor = 'error';
            this.dialogDel = false;
          } else {
            let parms = {
              id: this.deteleId
            };
            deleteItem(parms).then(res => {
              if (res.data.code === 200) {
                this.snackbarServe = true;
                this.snackbarServeMsg = res.data.msg;
                this.snackbarServeColor = 'success';
                this.getList();
                this.dialogDel = false;
              } else {
                this.snackbarServe = true;
                this.snackbarServeMsg = res.data.msg;
                this.snackbarServeColor = 'error';
                this.dialogDel = false;
              }
            }).catch(err => {
              this.snackbarServe = true;
              this.snackbarServeMsg = err.msg;
              this.snackbarServeColor = 'error';
            });
          }
        }
      });
    },
    // 编辑时，编辑开关的change事件
    onChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看预警策略模板',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑预警策略模板',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.getList();
    },
    // 页数
    pageChange () {
      this.pageNum = 1;
      this.getList();
    },
    cancel () {
      this.dialog = false;
    },
    save (a) {
      this.dialog = false;
      // 取预警指标的中文名称
      this.earlyWarningTarget.forEach(item => {
        if (a[0][1].value === item.value) {
          this.earlyWarningTargetName = item.text;
        }
      });
      // 取预警指标类型的中文名称
      this.earlyWarningType.forEach(item => {
        if (a[0][2].value === item.value) {
          this.earlyWarningTypeName = item.text;
        }
      });
      this.flg == 1 ? this._addItem(a) : this._editItem(a); //eslint-disable-line 
    },
    // 获取添加和编辑弹框中的---预警指标
    getEarlyWarningTarget (paramsItem) {
      // do ajax
      let params = {};
      getPoliceTargetAry(params)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              res.data.data.forEach(item => {
                item.text = item.name;
                item.value = item.id;
              });
              this.$nextTick(() => {
                this.earlyWarningTarget = res.data.data;
                this.addAndEditFormData[1].options = res.data.data;
                if (this.flg === 1) {
                  this.$refs.resetValidation.resetValidation();
                  this.addAndEditFormData = [];
                  this.addAndEditFormData = [
                    {
                      label: '预警策略模板名称*',
                      value: '',
                      type: 'text',
                      required: true,
                      counter: '50',
                      rules: [
                        v => !!v || '预警策略模板名称不能为空',
                        // eslint-disable-next-line no-mixed-operators
                        v => v && v.length <= 50 || '最多只能输入50个字符',
                        // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '常量只能输入汉字'
                        v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                      ]
                    },
                    {
                      label: '预警指标*',
                      value: '',
                      type: 'select',
                      required: true,
                      rules: [
                        v => !!v || '预警指标不能为空'
                      ],
                      selectText: 'text',
                      selectField: 'value',
                      options: this.earlyWarningTarget
                    },
                    {
                      label: '预警指标类型*',
                      value: '',
                      type: 'select',
                      required: true,
                      rules: [
                        v => !!v || '预警指标类型不能为空'
                      ],
                      selectText: 'text',
                      selectField: 'value',
                      comment: '',
                      options: []
                    },
                    {
                      label: '参数名*',
                      value: '',
                      type: 'text',
                      counter: '100',
                      required: true,
                      rules: [
                        v => !!v || '参数名不能为空',
                        v => BASE_NAME.test(v) || BASE_NAME_TEXT,
                        v => (v && v.length <= 100) || '最大100个字符'
                      ]
                    }
                  ];
                } else if (this.flg === 2) {
                  let paramsType = { parentId: paramsItem.templateIndicatorId };
                  getPoliceTargetTypeAry(paramsType).then(res => {
                    if (res.data.code === 200) {
                      if (res.data.data.length > 0) {
                        let comment = '';
                        this.addOrEditHeader = {
                          name: '查看预警策略模板',
                          value: 'edit',
                          isEdit: true
                        };
                        this.$nextTick(() => {
                          res.data.data.forEach(items => {
                            items.text = items.name;
                            items.value = items.id;
                          });
                          this.earlyWarningType = res.data.data;
                          // conmment: 代表预警指标类型后的问号是否显示。为空：不展示，不为空：展示
                          if (this.earlyWarningType.length > 0) {
                            this.earlyWarningType.forEach(i => {
                              if (paramsItem.templateIndicatorTypeId === i.value) {
                                comment = i.desc;
                              }
                            });
                          }
                          this.addAndEditFormData = [
                            {
                              label: '预警策略模板名称*',
                              value: paramsItem.templateName,
                              type: 'text',
                              required: true,
                              counter: '50',
                              rules: [
                                v => !!v || '预警策略模板名称不能为空',
                                // eslint-disable-next-line no-mixed-operators
                                v => v && v.length <= 50 || '最多只能输入50个字符',
                                // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '常量只能输入汉字'
                                v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                              ]
                            },
                            {
                              label: '预警指标*',
                              value: paramsItem.templateIndicatorId,
                              type: 'select',
                              required: true,
                              rules: [
                                v => !!v || '预警指标不能为空'
                              ],
                              selectText: 'text',
                              selectField: 'value',
                              options: this.earlyWarningTarget
                            },
                            {
                              label: '预警指标类型*',
                              value: paramsItem.templateIndicatorTypeId,
                              type: 'select',
                              required: true,
                              rules: [
                                v => !!v || '预警指标类型不能为空'
                              ],
                              selectText: 'text',
                              selectField: 'value',
                              comment: comment,
                              options: this.earlyWarningType
                            },
                            {
                              label: '参数名*',
                              value: paramsItem.templateParamName,
                              counter: '100',
                              type: 'text',
                              required: true,
                              rules: [
                                v => !!v || '参数名不能为空',
                                v => BASE_NAME.test(v) || BASE_NAME_TEXT,
                                v => (v && v.length <= 100) || '最大100个字符'
                              ]
                            }
                          ];
                          this.dialog = true;
                        });
                      } else {
                        this.addOrEditHeader = {
                          name: '查看预警策略模板',
                          value: 'edit',
                          isEdit: true
                        };
                        this.addAndEditFormData = [];
                        this.earlyWarningType = [];
                        this.addAndEditFormData[2].options = [];
                        this.addAndEditFormData[2].comment = '';
                        this.dialog = true;
                      }
                    } else {
                      this.earlyWarningType = [];
                      this.addAndEditFormData[2].options = [];
                      this.addAndEditFormData[2].comment = '';
                      this.snackbarServe = true;
                      this.snackbarServeMsg = res.data.msg;
                      this.snackbarServeColor = 'error';
                      this.dialog = true;
                    }
                  });
                }
              });
            } else {
              this.earlyWarningTarget = [];
              this.addAndEditFormData[1].options = [];
              this.dialog = true;
            }
          } else {
            this.earlyWarningTarget = [];
            this.addAndEditFormData[1].options = [];
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
            this.dialog = true;
          }
        });
    },
    // 预警指标change
    handleChangeSelect (e) {
      let elementId = '';
      this.earlyWarningTarget.forEach(element => {
        if (e[0].value === element.id) {
          elementId = element.id;
        }
      });
      if (e[0].label === '预警指标*') {
        this.$nextTick(() => {
          // do ajax 获取预警指标类型的数据
          let params = { parentId: elementId };
          getPoliceTargetTypeAry(params)
            .then(res => {
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  res.data.data.forEach(item => {
                    item.text = item.name;
                    item.value = item.id;
                  });
                  this.earlyWarningType = res.data.data;
                  this.addAndEditFormData[2].options = res.data.data;
                  this.addAndEditFormData[2].comment = '';
                  this.addAndEditFormData[2].value = '';
                  // this.resetValidation();
                  this.$refs.resetValidation.resetValidation();
                } else {
                  this.earlyWarningType = [];
                  this.addAndEditFormData[2].options = [];
                }
              } else {
                this.earlyWarningType = [];
                this.addAndEditFormData[2].options = [];
                this.snackbarServe = true;
                this.snackbarServeMsg = res.data.msg;
                this.snackbarServeColor = 'error';
              }
            });
        });
      } else if (e[0].label === '预警指标类型*') {
        this.$nextTick(() => {
          if (this.earlyWarningType.length > 0) {
            this.earlyWarningType.forEach(item => {
              if (e[0].value === item.value) {
                this.addAndEditFormData[2].comment = item.desc;
              }
            });
          }
        });
      }

      // for (let index = 0; index < this.nameAry.length; index++) {
      //   if ($event === this.nameAry[index].enName) {
      //     this.fieldFormData.forEach((im, ix, ay) => {
      //       if (im.label === '手机号*') {
      //         im.value = this.nameAry[index].phone;
      //       }
      //     });
      //   }
      // };
    }
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
/* 问好样式 */
.questionMark {
  margin-left: 16px;
  cursor: pointer;
}
.templaterAddWidth {
  display: inline-block;
  width: 85% !important;
}
.circle {
  width: 8px;
  height: 8px;
  background: rgba(60, 140, 240, 1);
  border-radius: 4px;
  display: inline-block;
  margin-right: 10px;
  box-shadow: 2px 2px 5px rgba(60, 140, 240, 1);
}
.labelStyle {
  height: 40px;
  line-height: 40px;
  text-align: right;
}
</style>
