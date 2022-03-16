<!----------  @author: author  ----------->
<!----------  @updated_at: date  ----------->
<!----------  @version: version  ----------->

<template>
  <!-- 预警模板管理 -->
  <div class="enu-content fill-height">
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
                  :placeholder = "searchFirstPlaceholder + ':'"
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
                  :placeholder = "searchSecondPlaceholder + ':'"
                  :rules="[
                    // v => v.length <= 64 || '最多只能输入64个字符',
                    // eslint-disable-next-line no-useless-escape
                    // v => /^[0-9a-zA-Z_]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线，及其组合'
                  ]"
                  v-model="form.templateContent"
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
    <v-row>
      <v-col :cols='12' class="pb-0">
        <v-card class="elevation-3">
          <v-data-table
            :headers="constHeader"
            :items="constItem"
            :items-per-page="perPageNum"
            hide-default-footer
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
                    v-if="hasPermission(addTemplateBtn)"
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
                  :title="`${item.templateContent}`"
                  class="el-border-defu"
                >
                  {{ item.templateContent }}
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
                        class="mr-1 icon-primary"
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
                        class="mr-1 icon-primary"
                        v-on="on"
                        color="primary"
                        v-if="hasPermission(deleteTemplateBtn)"
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
            <!-- <template v-slot:footer v-if="queryPageLength > 1"> -->
            <template v-slot:footer>
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
    <v-dialog v-model="dialog" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title>
          <!-- 新建模式 -->
          <v-toolbar-title v-if="addOrEditHeader.isEdit === false">
            {{ addOrEditHeader.name }}
            <!-- 新建 -->
          </v-toolbar-title>
          <!-- 查看模式 -->
          <v-toolbar-title v-else-if="addOrEditHeader.isEdit === true && isEditMode === false">
            {{ addOrEditHeader.name }}
            <!-- 详情 -->
          </v-toolbar-title>
          <!-- 编辑模式 -->
          <v-toolbar-title v-else>
            {{ addOrEditHeader.name }}
            <!-- 编辑 -->
          </v-toolbar-title>
        <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="cancel"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
          <v-divider></v-divider>
        <v-card-text style="max-height: 600px;">
          <v-container>
            <slot>
              <!-- 编辑模式 -->
              <div v-if="addOrEditHeader.isEdit">
                <v-row>
                  <v-col cols="3"></v-col>
                  <v-col cols="7" justify-left v-show="isCanEdit" class="py-0">
                   <v-switch v-model="isEditMode" v-if="hasPermission(editTemplateBtn)" inset dense label="启用编辑" @change="onChange">
                   </v-switch>
                  </v-col>
                </v-row>
                <v-form class="ruleSetAddOrEdit" ref="formAdd" v-model="valid" :lazy-validation="lazy" :key="newDate">
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">{{ searchFirstPlaceholder }}*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        v-if="isEditMode"
                        required
                        :counter="50"
                        :rules="[
                          v => !!v || this.searchFirstPlaceholder + '不能为空',
                          v => v && v.length <= 50 || '最多只能输入50个字符',
                          v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                        ]"
                        v-model.trim="formAdd.noteTemplateName"
                        outlined
                        dense
                        :disabled="!isEditMode"
                      />
                      <v-text-field
                        v-else
                        required
                        v-model.trim="formAdd.noteTemplateName"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">{{ strategyTemplateNameText }}*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="isEditMode"
                        v-model="formAdd.strategyTemplateName"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="noteOrEmailTemplateName"
                        required
                        :rules="[v => !!v || this.strategyTemplateNameText + '不能为空']"
                        outlined
                        dense
                        @change="handleChangeSelect(formAdd.strategyTemplateName)"
                        no-data-text="没有匹配数据"
                      />
                      <v-select
                        v-else
                        v-model="formAdd.strategyTemplateName"
                        item-text="text"
                        item-value="value"
                        :items="noteOrEmailTemplateName"
                        required
                        :rules="[v => !!v || this.strategyTemplateNameText + '不能为空']"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                        no-data-text="没有匹配数据"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">{{ strategyParamNameText }}*：</div>
                    </v-col>
                    <v-col
                      cols="8"
                    >
                      <v-text-field
                        v-if="isEditMode"
                        required
                        :rules="[
                          v => !!v || this.strategyParamNameText + '不能为空'
                        ]"
                        v-model.trim="formAdd.strategyParametersName"
                        outlined
                        dense
                        readonly
                      />
                      <v-text-field
                        v-else
                        required
                        v-model.trim="formAdd.strategyParametersName"
                        solo
                        flat
                        dense
                        readonly
                        :disabled="!isEditMode"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">短信模板内容*：</div>
                    </v-col>
                    <v-col
                      cols="8"
                    >
                      <v-textarea
                        v-if="isEditMode"
                        v-model.trim="formAdd.noteTemplateValue"
                        :rules="[
                          v => {
                            if (v) {
                              return (/^[^\s]+$/ig).test(v) || '请输入除空格以外的任意字符，及其组合';
                            }
                            return true;
                          },
                        ]"
                        outlined
                        auto-grow
                      />
                      <v-textarea
                        v-else
                        v-model.trim="formAdd.noteTemplateValue"
                        outlined
                        auto-grow
                        solo
                        flat
                        :disabled="!isEditMode"
                        class="textareaStyle"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </div>
              <!-- 新增模式 -->
              <div v-else>
                <v-form class="ruleSetAddOrEdit" ref="formAdd" v-model="valid" :lazy-validation="lazy">
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col
                      cols="8"
                    >
                      <v-text-field
                        :label = "searchFirstPlaceholder + ':'"
                        required
                        :counter="50"
                        :rules="[
                          v => !!v || this.searchFirstPlaceholder + '不能为空',
                          v => v && v.length <= 50 || '最多只能输入50个字符',
                          v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                        ]"
                        v-model.trim="formAdd.noteTemplateName"
                        outlined
                        dense
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col
                      cols="8"
                    >
                      <v-select
                        v-model="formAdd.strategyTemplateName"
                        item-text="text"
                        item-value="value"
                        :items="noteOrEmailTemplateName"
                        :label = "strategyTemplateNameText + ':'"
                        required
                        :rules="[
                          v => !!v || this.strategyTemplateNameText + '不能为空',
                        ]"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="handleChangeSelect(formAdd.strategyTemplateName)"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col
                      cols="8"
                    >
                      <v-text-field
                        :label = "strategyParamNameText + ':'"
                        required
                        :rules="[
                          v => !!v || this.strategyParamNameText + '不能为空',
                        ]"
                        v-model.trim="formAdd.strategyParametersName"
                        outlined
                        dense
                        readonly
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col
                      cols="8"
                    >
                      <v-textarea
                        v-model.trim="formAdd.noteTemplateValue"
                        :rules="[
                          v => {
                            if (v) {
                              return (/^[^\s]+$/ig).test(v) || '请输入除空格以外的任意字符，及其组合';
                            }
                            return true;
                          },
                        ]"
                        outlined
                        label = '短信模板内容:'
                        auto-grow
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </slot>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div v-if="addOrEditHeader.isEdit === false">
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancel">取消
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="save()"
                :disabled="!valid"
              >
              保存
            </v-btn>
          </div>
          <div v-else-if="addOrEditHeader.isEdit === true && isEditMode === true">
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancel">取消
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="save()"
                :disabled="!valid"
              >
              保存
            </v-btn>
          </div>
          <div v-else>
            <v-btn class="primary mr-4" @click="cancel">确定
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 添加、编辑 -->
    <!-- <base-create :formHeader='addOrEditHeader' :crudFormDialog='dialog' :formData='addAndEditFormData' @cancelCrudFormDialog='cancel($event)' @confimDialogSave='save(arguments)' @switchOnChange="onChange($event)"></base-create> -->
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
import { searchNoQuoteLogEdit, searchNoQuoteLog } from '../../../api/earlyWarningPolicyTemplateManagement.js';
import { delrecord, addRecord, searchNote, addNote, amendNote, removeNote, searchEmail, addEmail, amendEmail, removeEmail } from '../../../api/EarlyWarningTemplateManagement.js';
import { isRefrecord } from '../../../api/transactionTypeConfig.js';
import BaseCreate from '@/components/BaseCreate';
import BaseSearch from '@/components/BaseSearch';
import DelDialog from '@/components/DelDialog';
import moment from 'moment';
export default {
  data () {
    return {
      newDate: null,
      counter: 0,
      fullHeight: window.innerHeight,
      tab: null,
      tabs: 2,
      tabItems: [
        { tabName: '短信模板管理' },
        { tabName: '邮件模板管理' }
      ],
      noteOrEmailTemplate: 0,
      // 搜索条件
      isdateShow: false,
      isUpdateShow: false,
      searchValid: true,
      isExpanded: true, // 搜索折叠功能。true为打开状态
      form: {
        templateName: '', // 预警策略模板名称
        templateContent: '', // 预警策略模板标识
        dates: [] // 创建时间
        // updates: [] // 更新时间
      },
      // 列表
      constHeader: [
        { text: '短信模板名称', value: 'templateName', sortable: false },
        { text: '短信模板内容', value: 'templateContent', sortable: false },
        { text: '创建时间', value: 'createTime', sortable: false },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      constItem: [],
      editItemId: '', // 编辑当前项的id
      editItemObj: '', // 编辑的当前项
      loading: false,
      searchFirstPlaceholder: '短信模板名称',
      searchSecondPlaceholder: '短信模板内容',
      strategyTemplateNameText: '预警策略模板名称',
      strategyParamNameText: '预警策略参数名称',
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
      noteOrEmailTemplateName: [],
      addOrEditHeader: {
        name: '查看预警短信模板',
        value: 'add',
        isEdit: true
      },
      deteleId: '', // 删除ID
      deleteItemAry: {},
      isEditMode: false,
      isCanEdit: true,
      valid: true,
      lazy: false,
      formAdd: {
        noteTemplateName: '',
        strategyTemplateName: '',
        strategyParametersName: '',
        noteTemplateValue: ''
      },
      // 添加保存成功后，用来表示是否添加引用记录
      isFromNewAdd: false,
      tradeTypeProperty: [],
      // 增加按钮权限
      addTemplateBtn: '/addSMSTempButton', // 添加按钮是否展示
      editTemplateBtn: '/editSMSTempButton', // 当编辑按钮展示时，控制baseCreate中的编辑开关
      deleteTemplateBtn: '/deleteSMSTempButton' // 删除按钮权限
    };
  },
  components: {
    DelDialog,
    BaseSearch
    // BaseCreate
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 318;
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
        this.tableHeight = window.innerHeight - 92;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  created () {
    this.getPath();
    this.searchNote();
    this.getNoteOrEmailTemplateName();
  },
  methods: {
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    getNoteOrEmailTemplateName () {
      const param = {
        type: 'TEMPLAT_NOTE'
      };
      searchNoQuoteLog(param)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              res.data.data.forEach((item, index, ary) => {
                ary[index].text = item.templateName;
                ary[index].value = item.id;
              });
              this.noteOrEmailTemplateName = res.data.data;
            } else {
              this.noteOrEmailTemplateName = [];
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
    handleChangeSelect (v) {
      this.noteOrEmailTemplateName.forEach((item, index, ary) => {
        if (item.value === v) {
          this.formAdd.strategyParametersName = item.templateParamName;
        }
      });
    },
    // tab切换
    tabClick (data) {
      if (data === '短信内容模板管理') {
        // if (this.noteOrEmailTemplate !== 0) {
        this.$refs.form.reset();
        this.noteOrEmailTemplate = 0;
        this.pageNum = 1;
        this.queryPageLength = 1;
        this.perPageNum = 10;
        this.totalItems = 0;
        this.searchNote();
        // }
      } else {
        // if (this.noteOrEmailTemplate !== 1) {
        this.$refs.form.reset();
        this.noteOrEmailTemplate = 1;
        this.pageNum = 1;
        this.queryPageLength = 1;
        this.perPageNum = 10;
        this.totalItems = 0;
        this.searchNote();
        // }
      }
    },
    // 获取列表内容
    searchNote () {
      this.baseFilterDate(this.form.dates);
      // this.baseFilterDate(this.form.updates);
      if (this.noteOrEmailTemplate === 0) {
        let pageParms = {
          page: this.pageNum, // 第几页
          size: this.perPageNum, // 每页显示条数
          templateName: this.form.templateName ? this.form.templateName : '',
          templateContent: this.form.templateContent ? this.form.templateContent : '',
          createTimeStart: this.form.dates.length === 2 ? this.form.dates[0] : '',
          createTimeEnd: this.form.dates.length === 2 ? this.form.dates[1] : ''
          // updateTimeStart: this.form.updates.length === 2 ? this.form.updates[0] : '',
          // updateTimeEnd: this.form.updates.length === 2 ? this.form.updates[1] : ''
        };
        searchNote(pageParms)
          .then(res => {
            if (res.data.code === 200) {
              if (res.data.data.records.length > 0) {
                this.constItem = res.data.data.records;
                this.totalItems = res.data.data.total;
                this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
                if (this.isFromNewAdd) {
                  let addRecordParam = res.data.data.records[0];
                  this.addRecord(addRecordParam);
                  this.isFromNewAdd = false;
                }
              } else {
                this.constItem = [];
                this.totalItems = 0;
                this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
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
      } else {
        let pageParms = {
          page: this.pageNum, // 第几页
          size: this.perPageNum, // 每页显示条数
          templateName: this.form.templateName ? this.form.templateName : '',
          templateContent: this.form.templateContent ? this.form.templateContent : '',
          createTimeStart: this.form.dates.length === 2 ? this.form.dates[0] : '',
          createTimeEnd: this.form.dates.length === 2 ? this.form.dates[1] : ''
          // updateTimeStart: this.form.updates.length === 2 ? this.form.updates[0] : '',
          // updateTimeEnd: this.form.updates.length === 2 ? this.form.updates[1] : ''
        };
        searchEmail(pageParms)
          .then(res => {
            if (res.data.code === 200) {
              if (res.data.data.records.length > 0) {
                this.constItem = res.data.data.records;
                this.totalItems = res.data.data.total;
                this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
                if (this.isFromNewAdd) {
                  let addRecordParam = res.data.data.records[0];
                  this.addRecord(addRecordParam);
                  this.isFromNewAdd = false;
                }
              } else {
                this.constItem = [];
                this.totalItems = 0;
                this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
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
      }
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
      this.searchNote();
    },
    // 重置条件
    reset () {
      this.$refs.form.reset();
      this.pageNum = 1;
      this.searchNote();
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
    // 创建时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
    },
    // 更新时间输入框的点击事件
    updateInputClick () {
      this.isUpdateShow = true;
    },
    // 添加引用记录
    async addRecord (params) {
      let param = {
        sourceId: params.strategyTemplateId,
        targetId: params.id,
        target_type: 'TEMPLAT_NOTE'
      };
      let addParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await addRecord(addParams);
      } catch (err) {}
    },
    // 删除引用记录
    async delRecord (params) {
      let param = {
        sourceId: params.strategyTemplateId,
        targetId: params.id,
        target_type: 'TEMPLAT_NOTE'
      };
      let delParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await delrecord(delParams);
      } catch (err) {}
    },
    // 添加--弹窗
    addParms () {
      this.flg = 1;
      this.getNoteOrEmailTemplateName();
      this.dialog = true;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      if (this.noteOrEmailTemplate === 0) {
        this.addOrEditHeader = {
          name: '添加短信模板管理',
          value: 'add',
          isEdit: false
        };
      } else {
        this.addOrEditHeader = {
          name: '添加邮件模板管理',
          value: 'add',
          isEdit: false
        };
      }
    },
    // 添加--保存
    _addItem () {
      const parms = {
        templateName: this.formAdd.noteTemplateName,
        strategyTemplateId: this.formAdd.strategyTemplateName,
        templateContent: this.formAdd.noteTemplateValue
      };
      this.$refs.formAdd.reset();
      // return;
      if (this.noteOrEmailTemplate === 0) {
        addNote(parms).then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.isFromNewAdd = true;
            this.isEditMode = false;
            this.searchNote();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        });
      } else {
        addEmail(parms).then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.isFromNewAdd = true;
            this.isEditMode = false;
            this.searchNote();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        });
      }
    },
    // 编辑--弹窗
    editFunc (item, index) {
      let pageParms = {
        id: item.strategyTemplateId,
        type: 'TEMPLAT_NOTE'
      };
      searchNoQuoteLogEdit(pageParms)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              res.data.data.forEach((item, index, ary) => {
                ary[index].text = item.templateName;
                ary[index].value = item.id;
              });
              this.noteOrEmailTemplateName = res.data.data;
              this.flg = 2;
              this.editItemId = item.id;
              this.editItemObj = item;
              this.formAdd.noteTemplateName = item.templateName;
              this.formAdd.strategyTemplateName = item.strategyTemplateId;
              this.formAdd.noteTemplateValue = item.templateContent;
              this.noteOrEmailTemplateName.forEach((im, index, ary) => {
                if (im.id === item.strategyTemplateId) {
                  this.formAdd.strategyParametersName = im.templateParamName;
                }
              });
              if (this.noteOrEmailTemplate === 0) {
                this.addOrEditHeader = {
                  name: '查看短信模板管理',
                  value: 'edit',
                  isEdit: true
                };
              } else {
                this.addOrEditHeader = {
                  name: '查看邮件模板管理',
                  value: 'edit',
                  isEdit: true
                };
              }
              this.dialog = true;
            } else {
              this.noteOrEmailTemplateName = [];
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
    // 编辑--保存
    _editItem () {
      if (this.noteOrEmailTemplate === 0) {
        const parms = {
          id: this.editItemId,
          templateName: this.formAdd.noteTemplateName,
          strategyTemplateId: this.formAdd.strategyTemplateName,
          templateContent: this.formAdd.noteTemplateValue
        };
        amendNote(parms).then(res => {
          if (res.data.code === 200) {
            let recordParams = {
              id: this.editItemObj.id,
              strategyTemplateId: parms.strategyTemplateId
            };
            this.delRecord(this.editItemObj);
            this.addRecord(recordParams);
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.searchNote();
            this.isEditMode = false;
            this.$refs.formAdd.reset();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        });
      } else {
        const parms = {
          id: this.editItemId,
          templateName: this.formAdd.noteTemplateName,
          strategyTemplateId: this.formAdd.strategyTemplateName,
          templateContent: this.formAdd.noteTemplateValue
        };
        amendEmail(parms).then(res => {
          if (res.data.code === 200) {
            let recordParams = {
              id: this.editItemObj.id,
              strategyTemplateId: parms.strategyTemplateId
            };
            this.delRecord(this.editItemObj);
            this.addRecord(recordParams);
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.searchNote();
            this.isEditMode = false;
            this.$refs.formAdd.reset();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        });
      }
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
      // let isRefrecordParms = {
      //   sourceId: this.deleteItemAry.id,
      //   sourceType: ''
      // };
      // isRefrecord(isRefrecordParms).then(res => {
      //   if (res.data.code === 200) {
      //     if (res.data.data.isReference) {
      //       this.snackbarServe = true;
      //       this.snackbarServeMsg = '预警策略模板名称被引用，不能删除！';
      //       this.snackbarServeColor = 'error';
      //       this.dialogDel = false;
      //     } else {
      if (this.noteOrEmailTemplate === 0) {
        let parms = {
          id: this.deteleId
        };
        removeNote(parms).then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.delRecord(this.deleteItemAry);
            this.searchNote();
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
      } else {
        let parms = {
          id: this.deteleId
        };
        removeEmail(parms).then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.delRecord(this.deleteItemAry);
            this.searchNote();
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
      //     }
      //   }
      // });
    },
    // 编辑时，编辑开关的change事件
    onChange (e) {
      this.newDate = new Date().getTime();
      if (e === false) {
        if (this.noteOrEmailTemplate === 0) {
          this.addOrEditHeader = {
            name: '查看短信模板管理',
            value: 'edit',
            isEdit: true
          };
        } else {
          this.addOrEditHeader = {
            name: '查看邮件模板管理',
            value: 'edit',
            isEdit: true
          };
        }
      } else {
        if (this.noteOrEmailTemplate === 0) {
          this.addOrEditHeader = {
            name: '编辑短信模板管理',
            value: 'edit',
            isEdit: true
          };
        } else {
          this.addOrEditHeader = {
            name: '编辑邮件模板管理',
            value: 'edit',
            isEdit: true
          };
        }
      }
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.searchNote();
    },
    // 页数
    pageChange () {
      this.pageNum = 1;
      this.searchNote();
    },
    cancel () {
      this.dialog = false;
      this.isEditMode = false;
      this.$refs.formAdd.reset();
    },
    save (a) {
      this.dialog = false;
      this.flg == 1 ? this._addItem(a) : this._editItem(a); //eslint-disable-line
    },
    // 获取当前页的路由名称
    getPath () {
      localStorage.setItem('getMenu', '/earlyWarningNoteTemplateManagement');
    }
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
.isEditDropdown >>> .v-select__slot .v-input__append-inner {
  display: none !important
}
.textareaStyle >>> fieldset {
  border: none;
}
</style>
