<!----------  @author: YinGuoZheng  ----------->
<!----------  @updated_at: 2020-08-18  ----------->
<!----------  @version: 2.0  ----------->

<template>
  <div class="enu-content fill-height">
    <!-- 搜索表单 -->
    <base-search
      :fieldList="searchParam"
      @search="search($event)"
      @reset="resetSearchData($event)"
      :clearDate="clearDate"
      @change="panelCounter"
    ></base-search>
    <v-row>
      <v-col cols='12' class="pb-0">
        <v-card class="elevation-3">
          <v-data-table
            :headers="constHeader"
            :items="constItem"
            :items-per-page="1000"
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
                <v-spacer/>
                <v-card-title v-if="hasPermission('addAuditFlowConfigButton')">
                  <v-btn
                    color="primary"
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
                  :title="`${item.name}`"
                  class="el-border-defu"
                >
                  {{ item.name }}
                </td>
                <td
                  :title="item.resultType | treatmentMethod()"
                  class="el-border-defu"
                >
                  {{ item.resultType | treatmentMethod() }}
                </td>
                <td
                  :title="item.assignType | assignmentMethod()"
                  class="el-border-defu"
                >
                  {{ item.assignType | assignmentMethod() }}
                </td>
                <td
                  :title="item.auditType | auditFlowType()"
                  class="el-border-defu"
                >
                  {{ item.auditType | auditFlowType() }}
                </td>
                <td
                  :title="`${item.priority}`"
                  class="el-border-defu"
                >
                  {{ item.priority }}
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
                        class="mr-2 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="editFunc(item, index)"
                      >
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>编辑</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="hasPermission('deployAuditFlowConfigButton')">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2"
                        color="primary"
                        v-on="on"
                        @click="toConfigure(item)"
                      >mdi-bookmark-multiple</v-icon>
                    </template>
                    <span>配置</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2 icon-primary"
                        v-on="on"
                        color="primary"
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
    <v-dialog v-model="dialog" scrollable persistent max-width="500px">
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
                   <v-switch v-model="isEditMode" inset dense label="启用编辑" @change="onChange" v-if="hasPermission('editAuditFlowConfigButton')">
                   </v-switch>
                  </v-col>
                </v-row>
                <v-form ref="formEdit" v-model="valid" :lazy-validation="lazy" :key="newDate">
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">审核流名称*</div>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        v-if="isEditMode"
                        required
                        :counter="50"
                        :rules="[
                          v => !!v || '审核流名称不能为空',
                          v => v && v.length <= 50 || '最多只能输入50个字符',
                          v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                        ]"
                        v-model.trim="formEdit.name"
                        outlined
                        dense
                        :disabled="!isEditMode"
                      />
                      <v-text-field
                        v-else
                        required
                        v-model.trim="formEdit.name"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">处理方式*</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="isEditMode"
                        v-model="formEdit.resultType"
                        item-text="text"
                        item-value="value"
                        :items="resultTypeData"
                        required
                        :rules="[v => !!v || '处理方式不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="onChangeResultType(formEdit.resultType)"
                      />
                      <v-select
                        v-else
                        v-model="formEdit.resultType"
                        item-text="text"
                        item-value="value"
                        :items="resultTypeData"
                        required
                        :rules="[v => !!v || '处理方式不能为空']"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                        no-data-text="没有匹配数据"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="isShowZ">
                    <v-col cols="3">
                      <div class="mt-2">指派方式*</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="isEditMode"
                        v-model="formEdit.assignType"
                        item-text="text"
                        item-value="value"
                        :items="assignTypeData"
                        required
                        :rules="[v => !!v || '指派方式不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="onChangeAssignType(formEdit.assignType)"
                      />
                      <v-select
                        v-else
                        v-model="formEdit.assignType"
                        item-text="text"
                        item-value="value"
                        :items="assignTypeData"
                        required
                        :rules="[v => !!v || '指派方式不能为空']"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                        no-data-text="没有匹配数据"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="isShowS">
                    <v-col cols="3">
                      <div class="mt-2">审核流类型*</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="isEditMode"
                        v-model="formEdit.auditType"
                        item-text="text"
                        item-value="value"
                        :items="auditTypeData"
                        required
                        :rules="[v => !!v || '审核流类型不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                      />
                      <v-select
                        v-else
                        v-model="formEdit.auditType"
                        item-text="text"
                        item-value="value"
                        :items="auditTypeData"
                        required
                        :rules="[v => !!v || '审核流类型不能为空']"
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
                      <div class="mt-2">优先级*</div>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        v-if="isEditMode"
                        required
                        :counter="2"
                        :rules="[
                          v => !!v || '优先级不能为空',
                          v => v && v.length <= 2 || '最多只能输入2个字符',
                          v => ((/^(-)?\d+(\.\d+)?$/).test(v)) || '优先级只能输入数字',
                        ]"
                        v-model.trim="formEdit.priority"
                        outlined
                        dense
                        :disabled="!isEditMode"
                      />
                      <v-text-field
                        v-else
                        required
                        v-model.trim="formEdit.priority"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </div>
              <!-- 新增模式 -->
              <div v-else>
                <v-form ref="formAdd" v-model="valid" :lazy-validation="lazy">
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        label='审核流名称*'
                        value=''
                        type='text'
                        required
                        counter='50'
                        :rules="[
                          v => !!v || '审核流名称不能为空',
                          v => v && v.length <= 50 || '最多只能输入50个字符',
                          v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、英文下划线，数字，及其组合'
                        ]"
                        v-model.trim="formAdd.name"
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
                        v-model="formAdd.resultType"
                        item-text="text"
                        item-value="value"
                        :items="resultTypeData"
                        :label="'处理方式*'"
                        required
                        :rules="[
                          v => !!v || '处理方式不能为空',
                        ]"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="onChangeResultType(formAdd.resultType)"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="isShowZ">
                    <v-col cols="2">
                    </v-col>
                    <v-col
                      cols="8"
                    >
                      <v-select
                        v-model="formAdd.assignType"
                        item-text="text"
                        item-value="value"
                        :items="assignTypeData"
                        :label="'指派方式*'"
                        required
                        :rules="[
                          v => !!v || '指派方式不能为空',
                        ]"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="onChangeAssignType(formAdd.assignType)"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="isShowS">
                    <v-col cols="2">
                    </v-col>
                    <v-col
                      cols="8"
                    >
                      <v-select
                        v-model="formAdd.auditType"
                        item-text="text"
                        item-value="value"
                        :items="auditTypeData"
                        :label="'审核流类型*'"
                        required
                        :rules="[
                          v => !!v || '审核流类型不能为空',
                        ]"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        label='优先级*'
                        value=''
                        type='text'
                        required
                        counter='2'
                        :rules="[
                          v => !!v || '优先级不能为空',
                          v => v && v.length <= 2 || '最多只能输入2个字符',
                          v => ((/^(-)?\d+(\.\d+)?$/).test(v)) || '优先级只能输入数字',
                        ]"
                        v-model.trim="formAdd.priority"
                        outlined
                        dense
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
import { getList, addItem, deleteItem, editItem } from '../../api/auditFlowConfig.js';
import { getFieldNameList } from '../../api/SystemParamLib.js';
import BaseSearch from '@c/BaseSearch';
import DelDialog from '@/components/DelDialog';
import { NAME_NOT_NULL, MAX_INPUT_LENGTH, BASE_NAME_TEXT, BASE_VALUE_TEXT } from 'utils/validate';
let that;
export default {
  components: {
    DelDialog,
    BaseSearch
  },
  data () {
    return {
      // 处理方式交互
      isShowZ: true,
      // 指派方式交互
      isShowS: true,
      // ----------
      newDate: null,
      formAdd: {
        name: '',
        resultType: '',
        assignType: '',
        auditType: '',
        priority: ''
      },
      formEdit: {
        name: '',
        resultType: '',
        assignType: '',
        auditType: '',
        priority: ''
      },
      isEditMode: false,
      isCanEdit: true,
      valid: true,
      lazy: false,
      // ----------
      clearDate: true,
      counter: 0,
      fullHeight: window.innerHeight,
      // 列表
      constHeader: [
        { text: '审核流名称', value: 'name', sortable: false, width: 100 },
        { text: '处理方式', value: 'resultType', sortable: false, width: 100 },
        { text: '指派方式', value: 'assignType', sortable: false, width: 100 },
        { text: '审核流类型', value: 'auditType', sortable: false, width: 100 },
        { text: '优先级', value: 'priority', sortable: false, width: 100 },
        { text: '创建时间', value: 'createTime', sortable: false, width: 100 },
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
      // 表单，添加
      flg: 1,
      addOrEditHeader: {
        name: '添加审核流',
        value: 'add',
        isEdit: true
      },
      // 搜索组件数据
      searchParam: [
        { type: 'text', placeholder: '审核流名称', value: '' },
        {
          type: 'select',
          placeholder: '处理方式',
          value: '',
          options: []
        },
        {
          type: 'select',
          placeholder: '指派方式',
          value: '',
          options: []
        },
        {
          type: 'select',
          placeholder: '审核流类型',
          value: '',
          options: []
        },
        { type: 'date', placeholder: '创建时间', value: [] }
      ],
      searchData: {
        name: '',
        resultType: '',
        assignType: '',
        auditType: '',
        startTime: '',
        endTime: ''
      },
      deteleId: '', // 删除ID
      deleteItemAry: {},
      resultTypeData: [], // 处理方式下拉数据
      assignTypeData: [], // 指派方式下拉数据
      auditTypeData: [] // 审核流类型下拉数据
    };
  },
  computed: {
    isEditDropdown () {
      return {
        'v-input__icon': this.isEditMode ? 'display: none' : '',
        'v-input__icon--append': this.isEditMode ? 'display: none' : ''
      };
    },
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 270;
      }
    }
  },
  filters: {
    // 处理方式
    treatmentMethod: function (str) {
      let dataTypeText;
      that.resultTypeData.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.paramValue === str) {
          dataTypeText = item.paramName;
        }
      });
      return dataTypeText;
    },
    // 指派方式
    assignmentMethod: function (str) {
      let dataTypeText;
      that.assignTypeData.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.paramValue === str) {
          dataTypeText = item.paramName;
        }
      });
      return dataTypeText;
    },
    // 审核流类型
    auditFlowType: function (str) {
      let dataTypeText;
      that.auditTypeData.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.paramValue === str) {
          dataTypeText = item.paramName;
        }
      });
      return dataTypeText;
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeCreate: function () {
    that = this;
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
    this.gitResultTypeData();
    this.gitAssignTypeData();
    this.gitAuditTypeData();
  },
  methods: {
    // 处理方式联动
    onChangeResultType (val) {
      let dataTypeText;
      that.resultTypeData.forEach(item => {
        if (typeof val === 'number') {
          val = String(val);
        }
        if (item.paramValue === val) {
          dataTypeText = item.paramName;
        }
      });
      if (dataTypeText === '放弃') {
        this.isShowZ = false;
        this.isShowS = false;
        this.formAdd.assignType = ' ';
        this.formAdd.auditType = ' ';
        this.formEdit.assignType = ' ';
        this.formEdit.auditType = ' ';
      } else {
        this.isShowZ = true;
        this.isShowS = true;
        this.formAdd.assignType = '';
        this.formAdd.auditType = '';
        this.formEdit.assignType = '';
        this.formEdit.auditType = '';
      }
    },
    // 指派方式联动
    onChangeAssignType (val) {
      let dataTypeText;
      that.assignTypeData.forEach(item => {
        if (typeof val === 'number') {
          val = String(val);
        }
        if (item.paramValue === val) {
          dataTypeText = item.paramName;
        }
      });
      if (dataTypeText === '人工指派') {
        this.isShowS = false;
        this.formAdd.auditType = ' ';
        this.formEdit.auditType = ' ';
      } else {
        this.isShowS = true;
        this.formAdd.auditType = '';
        this.formEdit.auditType = '';
      }
    },
    // 获取处理方式
    gitResultTypeData () {
      const parms = {
        identifier: 'case_action_type'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res.data.data);
            res.data.data.forEach((item, index, ary) => {
              ary[index].text = item.paramName;
              ary[index].value = item.paramValue;
            });
            // 搜索
            this.searchParam[1].options = res.data.data;
            // 添加
            // this.addAndEditFormData[1].options = res.data.data;
            // 编辑
            this.resultTypeData = res.data.data;
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.msg);
        });
    },
    // 获取指派方式
    gitAssignTypeData () {
      const parms = {
        identifier: 'case_assign'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res.data.data);
            res.data.data.forEach((item, index, ary) => {
              ary[index].text = item.paramName;
              ary[index].value = item.paramValue;
            });
            // 搜索
            this.searchParam[2].options = res.data.data;
            // 添加
            // this.addAndEditFormData[2].options = res.data.data;
            // 编辑
            this.assignTypeData = res.data.data;
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.msg);
        });
    },
    // 获取审核流类型
    gitAuditTypeData () {
      const parms = {
        identifier: 'case_check_type'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res.data.data);
            res.data.data.forEach((item, index, ary) => {
              ary[index].text = item.paramName;
              ary[index].value = item.paramValue;
            });
            // 搜索
            this.searchParam[3].options = res.data.data;
            // 添加
            // this.addAndEditFormData[3].options = res.data.data;
            // 编辑
            this.auditTypeData = res.data.data;
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.msg);
        });
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 配置审核流
    toConfigure (item) {
      this.$router.push({
        path: '/auditFlowRuleConfig',
        name: 'auditFlowRuleConfig',
        params: {
          indexId: item.id
        }
      });
    },
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 查询
    search ($event) {
      let startTime = '';
      let endTime = '';
      if ($event[4].value.length !== 0) {
        startTime = $event[4].value.substr(0, 10) + ' 00:00:00';
        endTime = $event[4].value.substr(13, 20) + ' 23:59:59';
      }
      this.searchData = {
        name: $event[0].value === undefined ? '' : $event[0].value,
        resultType: $event[1].value === undefined ? '' : $event[1].value,
        assignType: $event[2].value === undefined ? '' : $event[2].value,
        auditType: $event[3].value === undefined ? '' : $event[3].value,
        startTime: $event[4].value.length === 0 ? '' : startTime,
        endTime: $event[4].value.length === 0 ? '' : endTime
      };
      // console.log($event);
      this.pageNum = 1;
      this.getList();
    },
    // 获取列表内容
    getList () {
      let pageParms = {
        pageIndex: this.pageNum, // 第几页
        pageSize: this.perPageNum // 每页显示条数
      };
      let searchParam = JSON.parse(JSON.stringify(this.searchData));
      let parms = Object.assign({}, pageParms, searchParam);
      getList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res);
            this.constItem = res.data.data.list;
            this.totalItems = res.data.data.totalElements;
            this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          } else {
            this.message(res.data.msg);
          }
        });
      // .catch(err => {
      //   // this.message(err.msg);
      // });
    },
    // 添加--弹窗
    addParms () {
      this.flg = 1;
      this.dialog = true;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.addOrEditHeader = {
        name: '添加审核流',
        value: 'add',
        isEdit: false
      };
    },
    // 添加--保存
    _addItem () {
      const parms = {
        name: this.formAdd.name,
        resultType: this.formAdd.resultType,
        assignType: this.formAdd.assignType === ' ' ? '' : this.formAdd.assignType,
        auditType: this.formAdd.auditType === ' ' ? '' : this.formAdd.auditType,
        priority: this.formAdd.priority
      };
      this.$refs.formAdd.reset();
      addItem(parms).then(res => {
        if (res.data.code === 200) {
          this.message(res.data.msg, 'success');
          this.getList();
        } else {
          this.message(res.data.msg);
        }
        this.isEditMode = false;
        this.isShowZ = true;
        this.isShowS = true;
      });
    },
    // 编辑--弹窗
    editFunc (item, index) {
      this.newDate = new Date().getTime();
      this.flg = 2;
      this.editItemId = item.id;
      this.addOrEditHeader = {
        name: '查看审核流',
        value: 'edit',
        isEdit: true
      };
      this.formEdit.name = item.name;
      this.formEdit.resultType = item.resultType + '';
      this.formEdit.assignType = item.assignType + '';
      this.formEdit.auditType = item.auditType + '';
      this.formEdit.priority = item.priority + '';
      this.dialog = true;
      // console.log(this.formEdit)
      if (item.assignType === null || item.assignType === undefined || item.assignType === '') {
        this.isShowZ = false;
      }
      if (item.auditType === null || item.auditType === undefined || item.auditType === '') {
        this.isShowS = false;
      }
    },
    // 编辑--保存
    _editItem () {
      const parms = {
        id: this.editItemId,
        name: this.formEdit.name,
        resultType: this.formEdit.resultType,
        assignType: this.formEdit.assignType === ' ' || this.formEdit.assignType === 'null' ? '' : this.formEdit.assignType,
        auditType: this.formEdit.auditType === ' ' || this.formEdit.auditType === 'null' ? '' : this.formEdit.auditType,
        priority: this.formEdit.priority
      };
      this.$refs.formEdit.reset();
      editItem(parms).then(res => {
        if (res.data.code === 200) {
          this.message(res.data.msg, 'success');
          this.getList();
        } else {
          this.message(res.data.msg);
        }
        this.isEditMode = false;
        this.isShowZ = true;
        this.isShowS = true;
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
      let parms = {
        ids: this.deteleId
      };
      deleteItem(parms).then(res => {
        if (res.data.code === 200) {
          this.message(res.data.msg, 'success');
          this.getList();
          this.dialogDel = false;
        } else {
          this.message(res.data.msg);
          this.dialogDel = false;
        }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 编辑时，编辑开关的change事件
    onChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看审核流',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑审核流',
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
    // 取消添加编辑
    cancel () {
      this.dialog = false;
      this.isEditMode = false;
      this.isShowZ = true;
      this.isShowS = true;
      if (this.flg === 1) {
        this.$refs.formAdd.reset();
      } else {
        // this.$refs.formEdit.reset();
      };
    },
    save (a) {
      this.dialog = false;
      this.flg == 1 ? this._addItem(a) : this._editItem(a); //eslint-disable-line
    },
    // 重置查询条件
    resetSearchData ($event) {
      // console.log($event);
      $event[0].value = null;
      $event[1].value = null;
      $event[2].value = null;
      $event[3].value = null;
      $event[4].value = null;
      this.searchData = {
        name: '',
        resultType: '',
        assignType: '',
        auditType: '',
        startTime: '',
        endTime: ''
      };
      this.pageNum = 1;
      this.getList();
    }
  }
};
</script>
<style lang="stylus" scoped>
.isEditDropdown >>> .v-select__slot .v-input__append-inner {
  display: none !important
}
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
</style>
