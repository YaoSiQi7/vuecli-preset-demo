!--author：古雪瑞 -->
<!--updateTime：2020-05-21-->
<template>
  <div>
    <!-- 主体内容 -->
    <div>
      <!-- 搜索表单 -->
      <base-search
        :fieldList="searchForm"
        @search="search($event)"
        @reset="resetSearchData($event)"
        @change="panelCounter"
      ></base-search>
      <!-- 列表数据 -->
      <v-data-table
        :headers="strategyHeaders"
        :items="strategyData"
        :items-per-page="perPageNum"
        hide-default-footer
        :height="tableHeight"
        :fixed-header="true"
        class="elevation-3 mt-3"
      >
        <!-- 表头 -->
        <template v-slot:top>
          <v-toolbar flat height="60px">
            <v-toolbar-title style="font-size:18px">
              黑名单策略配置数据
            </v-toolbar-title>
            <v-spacer/>
            <v-btn color="primary" class="mr-2 mt-1" v-if="hasPermission(addBlackListBtn)" @click="add">添加</v-btn>
          </v-toolbar>
        </template>
        <template
          v-slot:item.tmplName="{ item }"
        >
          <span>{{ item.tmplName }}</span>
        </template>
        <template
          v-slot:item.createTime="{ item }"
        >
          <span>{{ item.createTime }}</span>
        </template>
        <template v-slot:item.action="{ item }">
          <v-tooltip bottom v-if="hasPermission(editBlackListBtn)">
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-2"
                color="primary"
                v-on="on"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>编辑</span>
          </v-tooltip>
          <v-tooltip bottom v-if="hasPermission(deleteBlackListBtn)">
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-2"
                color="primary"
                v-on="on"
                @click="deleteItem(item)"
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
      <!-- 添加或编辑弹窗 -->
      <v-dialog
        v-model="addOrEditDialog"
        persistent
        scrollable
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <v-toolbar-title>
              {{ formHeader.name }}
            </v-toolbar-title>
          <div class="flex-grow-1" />
            <v-btn
              icon
              dark
              @click="cancelDialog"
            >
              <v-icon color="var(--v-headerCloseIconColor-base)">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text style="min-height: 216px">
            <v-container>
              <!-- 编辑模式 -->
              <div v-if="formHeader.isEdit">
                <v-row>
                  <v-col cols="3"></v-col>
                  <v-col cols="7" justify-left class="py-0">
                   <v-switch v-if="hasPermission(editBlackListBtn)" v-model="isEditMode" inset dense label="启用编辑" @change="switchChange">
                   </v-switch>
                  </v-col>
                </v-row>
                <v-form
                  class="ruleSetAddOrEdit"
                  ref="form"
                  v-model="valid"
                  :lazy-validation="lazy"
                  :key="newDate">
                  <v-row
                    v-for="(item, index) in formData"
                    :key="index">
                    <v-col cols="3" class="pr-0">
                      <div class="mt-2">{{item.label}}:</div>
                    </v-col>
                    <v-col
                      v-if="item.type === 'text'"
                      cols="7"
                    >
                      <v-text-field
                        v-if="isEditMode"
                        :required="item.required"
                        :counter="item.counter"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        outlined
                        dense
                        :type="item.inputType"
                        :disabled="!isEditMode"
                      />
                      <v-text-field
                        v-else
                        :required="item.required"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        solo
                        flat
                        dense
                        :type="item.inputType"
                        :disabled="!isEditMode"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'select'"
                      cols="7"
                    >
                      <v-select
                        v-if="isEditMode"
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        no-data-text="没有匹配数据"
                        outlined
                        dense
                        :disabled="!isEditMode || item.disabled"
                        @change="handleChangeSelect(item.value)"
                      />
                      <v-select
                        v-else
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        no-data-text="没有匹配数据"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'autocomplete'"
                      cols="7"
                    >
                      <v-autocomplete
                        v-if="isEditMode"
                        v-model.trim="item.value"
                        outlined
                        dense
                        :multiple="item.multiple"
                        :chips="item.chips"
                        no-data-text="没有匹配数据"
                        :required="item.required"
                        :rules="item.rules"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.autocompleteOptions"
                        :disabled="!isEditMode"
                      />
                      <v-autocomplete
                        v-else
                        v-model.trim="item.value"
                        solo
                        flat
                        dense
                        :multiple="item.multiple"
                        no-data-text="没有匹配数据"
                        :required="item.required"
                        :rules="item.rules"
                        :label="item.label"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.autocompleteOptions"
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                      />
                    </v-col>
                  </v-row>
                  <v-row class="ruleSetAddOrEdit" v-if="!showValidTime">
                    <v-col cols="3" class="pr-0">
                      <div class="mt-2">有效时间(分钟):</div>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field
                        v-if="isEditMode"
                        required
                        counter="9"
                        :rules="invalidTimeRules"
                        v-model.trim="timeForm.validTime"
                        outlined
                        dense
                        :disabled="!isEditMode"
                      />
                      <v-text-field
                        v-else
                        required
                        v-model.trim="timeForm.validTime"
                        dense
                        solo
                        flat
                        :disabled="!isEditMode"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </div>
              <!-- 新增模式 -->
              <div v-else>
                <v-form class="ruleSetAddOrEdit" ref="form" v-model="valid" :lazy-validation="lazy">
                  <v-row
                    v-for="(item, index) in formData"
                    :key="index"
                  >
                    <v-col cols="2">
                    </v-col>
                    <v-col
                      v-if="item.type === 'text'"
                      cols="8"
                    >
                      <v-text-field
                        :label="item.label"
                        :required="item.required"
                        :counter="item.counter"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        outlined
                        dense
                        :type="item.inputType"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'select'"
                      cols="8"
                    >
                      <v-select
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :label="item.label"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="handleChangeSelect(item.value)"
                      />
                    </v-col>
                    <v-col
                      v-if="item.type === 'autocomplete'"
                      cols="8"
                    >
                      <v-autocomplete
                        v-model.trim="item.value"
                        outlined
                        dense
                        :multiple="item.multiple"
                        :chips="item.chips"
                        :required="item.required"
                        :rules="item.rules"
                        :label="item.label"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.autocompleteOptions"
                        no-data-text="没有匹配数据"
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="!showValidTime">
                    <v-col cols="2"></v-col>
                    <v-col cols="8">
                      <v-text-field
                        label="有效时间(分钟)"
                        required
                        counter="9"
                        :rules="invalidTimeRules"
                        v-model.trim="timeForm.validTime"
                        outlined
                        dense
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </v-container>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <div class="flex-grow-1" />
            <div v-if="!isEditMode">
              <v-btn
                class="primary mr-4"
                @click="cancelDialog"
              >
                关闭
              </v-btn>
            </div>
            <div v-else>
              <v-btn
                class="cancelButton mr-4"
                outlined
                @click="cancelDialog">取消
              </v-btn>
              <v-btn
                  class="primary mr-4"
                  @click="save"
                  :disabled="!valid"
                >
                保存
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- 删除弹框 -->
      <del-dialog :isDialogShow='dialogDel' @cancelDel='dialogDel = false' @confimDel='confirmDelFun'></del-dialog>
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
  </div>
</template>
<script>
import BaseSearch from '@c/BaseSearch';
import DelDialog from '@c/DelDialog';
import * as dataService from 'api/blackStrategyConfig';
import { NAME_NOT_NULL, MAX_INPUT_LENGTH, BASE_NAME, BASE_NAME_TEXT } from 'utils/validate';
export default {
  name: 'blackListStrategyConfig',
  components: {
    BaseSearch,
    DelDialog
  },
  data: () => ({
    newDate: null,
    counter: 0,
    fullHeight: window.innerHeight,
    valid: true,
    lazy: false,
    // 删除弹框变量
    dialogDel: false,
    confirmDelFun: '',
    blackListType: 1,
    searchForm: [
      { placeholder: '黑名单策略名称', value: '', type: 'text' }
    ],
    searchData: {
      tmplName: ''
    },
    formData: [],
    timeForm: {
      validTime: '',
      unit: ''
    },
    showValidTime: true,
    // 匹配字段
    tmplParamItems: [],
    // 时间单位
    validTimeItems: [],
    // 名单类型
    listTypeItems: [
      { selectText: '永久有效', selectField: -1 },
      { selectText: '临时有效', selectField: 1 }
    ],
    strategyHeaders: [
      { text: '黑名单策略名称', value: 'tmplName', sortable: false },
      { text: '创建时间', value: 'createTime', sortable: false },
      { text: '操作', value: 'action', sortable: false, width: '10%' }
    ],
    strategyData: [],
    invalidTimeRules: [
      v => !!v || NAME_NOT_NULL('有效时间'),
      v => ((/^[0-9]*$/ig).test(v)) || '请输入大于或等于0的数字',
      v => (v && v.length <= 9) || MAX_INPUT_LENGTH(9)
    ],
    // 分页变量
    pageNum: 1,
    pageSize: 10,
    queryPageLength: 0,
    perPageNum: 10,
    totalItems: 0,
    perPageItems: [5, 10, 15, 20, 50, 100],
    // 添加或编辑弹窗参数
    isEditMode: true,
    addOrEditDialog: false,
    formHeader: {
      name: '添加黑名单策略',
      value: 'add',
      isEdit: false,
      isConfig: false
    },
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    // 删除参数
    delParam: '',
    // 增加按钮权限
    addBlackListBtn: '/addBlackListStrategyConifgButton', // 添加按钮是否展示
    editBlackListBtn: '/editBlackListStrategyConfigButton', // 表格编辑按钮
    deleteBlackListBtn: '/deleteBlackListStrategyConfigButton' // 表格删除功能
  }),
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
        return this.fullHeight - 266;
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
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    Promise.all([
      this.queryAllField(),
      this.queryTimeUnitList(),
      this.getDataList()
    ]);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    // 获取全量业务变量库字段
    async queryAllField () {
      try {
        const res = await dataService.queryallfield({ isContainEnum: '1' });
        let resData = res.data.data;
        for (let i = 0; i < resData.length; i++) {
          this.tmplParamItems.push(
            {
              selectText: resData[i].fieldName,
              selectField: resData[i].id
            }
          );
        }
      } catch (err) {}
    },
    // 获取时间单位列表
    async queryTimeUnitList () {
      try {
        let param = {
          identifier: 'sys_time_type'
        };
        const res = await dataService.findsysParams(param);
        if (res.data.code === 200) {
          res.data.data.forEach((item, index, ary) => {
            this.validTimeItems.push(
              { selectText: item.paramName, selectField: item.paramValue }
            );
          });
        }
      } catch (err) {}
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    panelCounter () {
      this.counter += 1;
    },
    // 点击搜索按钮
    search ($event) {
      this.searchData.tmplName = $event[0].value;
      this.pageNum = 1;
      this.getDataList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.searchData = {
        tmplName: ''
      };
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this.getDataList();
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 查询列表内容
    async getDataList () {
      let pageParams = {
        pageIndex: this.pageNum,
        pageSize: this.perPageNum
      };
      let searchParam = Object.assign({}, pageParams, this.searchData);
      const res = await dataService.queryDataList(searchParam);
      if (res.data.code === 200) {
        this.strategyData = res.data.data.list;
        this.totalItems = res.data.data.totalElements;
        this.queryPageLength = res.data.data.totalPages;
      }
    },
    // 添加
    add () {
      this.showValidTime = true;
      this.isEditMode = true;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.formHeader = {
        name: '添加黑名单策略',
        value: 'add',
        isEdit: false,
        isConfig: false
      };
      this.formData = [
        {
          label: '黑名单策略名称',
          value: '',
          required: true,
          rules: [
            v => !!v || NAME_NOT_NULL('黑名单策略名称'),
            v => (BASE_NAME.test(v)) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 64 || MAX_INPUT_LENGTH(64)
          ],
          type: 'text',
          counter: '64'
        },
        {
          label: '匹配字段',
          value: '',
          required: true,
          rules: [v => !!v || NAME_NOT_NULL('匹配字段')],
          type: 'autocomplete',
          chips: false,
          multiple: false,
          selectText: 'selectText',
          selectField: 'selectField',
          autocompleteOptions: this.tmplParamItems
        },
        {
          label: '名单类型',
          value: '',
          required: true,
          rules: [v => !!v || NAME_NOT_NULL('名单类型')],
          type: 'select',
          multiple: false,
          selectText: 'selectText',
          selectField: 'selectField',
          options: this.listTypeItems
        }
      ];
      this.addOrEditDialog = true;
    },
    // 新增编辑弹窗的保存按钮
    save () {
      let saveParams = {
        tmplName: this.formData[0].value,
        tmplParam: this.formData[1].value,
        tmplValidTime: this.timeForm.validTime
      };
      // 区分选择的是永久有效还是临时有效，选择永久时赋值为-1
      if (!saveParams.tmplValidTime || this.formData[2].value === -1) {
        saveParams.tmplValidTime = -1;
      }
      // 区分保存或编辑
      if (!this.formHeader.isEdit) {
        this.confirmAddParam(saveParams);
      } else {
        saveParams.id = this.delParam.id;
        this.confirmEditParam(saveParams);
      }
      this.addOrEditDialog = false;
      this.$refs.form.reset();
    },
    // 新增编辑弹窗的取消按钮
    cancelDialog () {
      this.addOrEditDialog = false;
      this.$refs.form.reset();
    },
    // 编辑
    editItem (item) {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.isEditMode = false;
      this.delParam = item; // 这里复用一下此变量，用于编辑保存时获取id
      let namelistType; // 给名单类型字段赋值
      if (item.tmplValidTime >= 0) {
        namelistType = 1; // 此时是临时有效
        this.showValidTime = false;
      } else {
        namelistType = -1; // 此时是永久有效
        this.showValidTime = true;
        // item.tmplValidTime = '';
      }
      this.formHeader = {
        name: '查看黑名单策略',
        value: 'edit',
        isEdit: true,
        isConfig: true
      };
      this.formData = [
        {
          label: '黑名单策略名称',
          value: item.tmplName,
          required: true,
          rules: [
            v => !!v || NAME_NOT_NULL('黑名单策略名称'),
            v => (BASE_NAME.test(v)) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 64 || MAX_INPUT_LENGTH(64)
          ],
          type: 'text',
          counter: '64'
        },
        {
          label: '匹配字段',
          value: item.tmplParam,
          required: true,
          rules: [v => !!v || NAME_NOT_NULL('匹配字段')],
          type: 'autocomplete',
          chips: false,
          multiple: false,
          selectText: 'selectText',
          selectField: 'selectField',
          autocompleteOptions: this.tmplParamItems
        },
        {
          label: '名单类型',
          value: namelistType,
          required: true,
          rules: [v => !!v || NAME_NOT_NULL('名单类型')],
          type: 'select',
          multiple: false,
          selectText: 'selectText',
          selectField: 'selectField',
          options: this.listTypeItems
        }
      ];
      this.timeForm = Object.assign({}, {
        validTime: item.tmplValidTime + ''
      });
      this.addOrEditDialog = true;
    },
    // 添加时保存
    async confirmAddParam (params) {
      const res = await dataService.insertStrategy(params);
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '添加成功';
        this.snackbarServeColor = 'success';
      }
      this.getDataList();
    },
    // 编辑时保存
    async confirmEditParam (params) {
      const res = await dataService.updateItem(params);
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '修改成功';
        this.snackbarServeColor = 'success';
      }
      this.getDataList();
    },
    handleChangeSelect (param) {
      if (param === -1) {
        this.showValidTime = true;
      } else if (param === 1) {
        this.showValidTime = false;
      }
      // this.showValidTime = param !== 1;
    },
    // 删除
    deleteItem (item) {
      this.dialogDel = true;
      this.delParam = item;
      this.confirmDelFun = this.confirmDelParam;
    },
    // 确认删除
    async confirmDelParam () {
      let params = {
        id: this.delParam.id
      };
      const res = await dataService.deleteItem(params);
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '删除成功';
        this.snackbarServeColor = 'success';
      }
      this.getDataList();
      this.dialogDel = false;
    },
    // 弹窗中的切换开关按钮
    switchChange (flag) {
      this.newDate = new Date().getTime();
      this.formHeader = {
        value: 'edit',
        isEdit: true,
        isConfig: true
      };
      this.formHeader.name = flag ? '编辑黑名单策略' : '查看黑名单策略';
    }
  }
};
</script>
<style lang="stylus" scoped>
  .isEditDropdown >>> .v-select__slot .v-input__append-inner {
    display: none !important
  }
  .ruleSetAddOrEdit >>> .v-input__control {
    height: auto !important;
  }
  .ruleSetAddOrEdit .col {
    padding: 0 !important;
  }
  >>> .v-text-field.v-text-field--enclosed .v-text-field__details {
    margin-bottom: 4px;
  }
  .float-left {
    float: left;
  }
  .strategy-stepWidth {
    width: 18%;
  }
</style>
