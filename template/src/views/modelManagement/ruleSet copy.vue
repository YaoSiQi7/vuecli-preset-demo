<template>
  <div class="rule-set-content fill-height">
    <!-- 搜索表单 -->
    <base-search
      :fieldList="searchParam"
      :panelFromParent="panel"
      @search="search($event)"
      @reset="resetSearchData($event)"
      id="rulesetSearch"
      @change="panelCounter"
    ></base-search>
    <!-- 规则集列表 -->
    <v-data-table
      id="ruleSetTable"
      :headers="rulesetHeaders"
      :items="ruleSets"
      :items-per-page="perPageNum"
      hide-default-footer
      :fixed-header="true"
      class="elevation-3 mt-3"
      :height="tableHeight"
      :loading="loading"
      loading-text="加载数据中..."
    >
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar flat height="60px">
          <v-toolbar-title style="font-size:18px">规则集数据</v-toolbar-title>
          <v-spacer/>
          <v-btn color="primary" class="mr-1 mt-1" @click="AddRuleSet">添加</v-btn>
          <v-btn color="primary" class="mr-1 ml-4 mt-1" disabled>批量删除</v-btn>
          <v-btn color="primary" class="mr-1 ml-4 mt-1" disabled>批量导出</v-btn>
        </v-toolbar>
      </template>
      <!-- 表内容 -->
      <template v-slot:item.setName="{ item }">
        <span :title="`${item.setName}`">{{ item.setName | ellipsis(16) }}</span>
      </template>
      <template v-slot:item.organizationId="{ item }">
        <span
          :title="item.organizationId | rulesetOrganization(organizationList)"
        >{{ item.organizationId | rulesetOrganization(organizationList) | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.appId="{ item }">
        <span
          :title="item.appId | rulesetApplication(applications)"
        >{{ item.appId | rulesetApplication(applications) | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.transactionTypeId="{ item }">
        <span
          :title="item.transactionTypeId | rulesetTradeTypes(tradeTypes)"
        >{{ item.transactionTypeId | rulesetTradeTypes(tradeTypes) | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.matchingModel="{ item }">
        <span
          :title="item.matchingModel | filtersShowRuleMatchingModel(ruleMatchingModels)"
        >{{ item.matchingModel | filtersShowRuleMatchingModel(ruleMatchingModels) | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.states="{ item }">
        <span
          :title="item.states | rulesetStatus(rulesetStatus)"
        >{{ item.states | rulesetStatus(rulesetStatus) | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.version="{ item }">
         <span
          :title="item.version | rulesetStatus(rulesetStatus)"
        >{{ item.version | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.compareVersion>
        <v-btn disabled   @click="snackbar = true">版本比较</v-btn>
      </template>
      <template v-slot:item.action="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-1 icon-primary"
              color="primary"
              v-on="on"
              @click="editRuleset(item)"
            >mdi-pencil</v-icon>
          </template>
          <span>编辑</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-1"
              color="primary"
              v-on="on"
              @click="operateRules(item,false)"
            >mdi-bookmark-multiple</v-icon>
          </template>
          <span>编辑规则详情</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon small class="mr-1" v-on="on" @click="snackbar = true">mdi-file-export</v-icon>
          </template>
          <span>导出</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-1"
              v-on="on"
              @click="snackbar = true"
            >mdi-content-duplicate</v-icon>
          </template>
          <span>引用记录</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-1"
              color="primary"
              v-on="on"
              @click="deleteRuleSet(item)"
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
                v-model="perPageNum"
                item-text="fieldName"
                item-value="fieldField"
                :items="perPageItems"
                dense
                width="27px"
                no-data-text="没有匹配数据"
                @change="pageNumChange"
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
    <!-- 添加规则集And修改规则集 -->
    <v-dialog v-model="RuleSetDialog" persistent scrollable max-width="500px" class='add-edut-ruleSet'>
      <v-card>
        <v-card-title>
          <!-- 新建模式 -->
          <v-toolbar-title>{{ addOrEditHeader.name }}</v-toolbar-title>
          <div class="flex-grow-1"/>
          <v-btn class="mr-0" icon dark @click="cancelEditOrAddRuleSet">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 600px;">
          <v-container>
            <slot>
              <v-row v-show="addOrEditHeader.value==='edit'">
                <v-col cols="3"></v-col>
                <v-col cols="7" justify-left @click="clickEditSwitch">
                  <v-switch v-model="addOrEditHeader.isEdit" inset dense label="启用编辑" :disabled="!editAndDelFlag" @change="viewToEdit(addOrEditHeader.isEdit)"></v-switch>
                </v-col>
              </v-row>
              <!-- 新增模式 -->
              <div v-if="addOrEditHeader.value==='add'">
                <v-form ref="Form" v-model="valid" class="ruleSetAddOrEdit">
                  <v-row v-for="(item, index) in addAndEditFormData" :key="index">
                    <v-col cols="2" v-show="addOrEditHeader.value==='add'"></v-col>
                    <v-col cols="3" v-show="addOrEditHeader.value==='edit'">
                      <div class="mt-2">{{item.label}}:</div>
                    </v-col>
                    <v-col v-if="item.type === 'text'" cols="7">
                      <v-text-field
                        :required="item.required"
                        :rules="item.rules"
                        v-model="item.value"
                        outlined
                        dense
                        :type="item.inputType"
                        :label="item.label"
                        @input='inputValue(item)'
                      />
                    </v-col>
                    <v-col v-if="item.type === 'select'" cols="7">
                      <v-select
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        @change="changeValue(item)"
                        no-data-text="没有匹配数据"
                        :label="item.label"
                        outlined
                        dense
                      />
                    </v-col>
                    <v-col v-if="item.type === 'treeSelect'" cols="7" style="margin-bottom:25px">
                      <treeselect
                        :clearable='false'
                        :value-consists-of="item.valueConsistsOf"
                        :multiple="item.isMultiple"
                        :options="item.options"
                        :placeholder="item.placeholder"
                        :default-expand-level="1"
                        v-model="item.value"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </div>
              <!-- 编辑模式 -->
              <div v-if="addOrEditHeader.value==='edit' && addOrEditHeader.isEdit">
                <v-form ref="Form" v-model="valid" class="ruleSetAddOrEdit">
                  <v-row v-for="(item, index) in addAndEditFormData" :key="index">
                    <v-col cols="2" v-show="addOrEditHeader.value==='add'"></v-col>
                    <v-col cols="3" v-show="addOrEditHeader.value==='edit'">
                      <div class="mt-2">{{item.label}}:</div>
                    </v-col>
                    <v-col v-if="item.type === 'text'" cols="7">
                      <v-text-field
                        :required="item.required"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        outlined
                        dense
                        label
                        :type="item.inputType"
                        @input='inputValue(item)'
                      />
                    </v-col>
                    <v-col v-if="item.type === 'select'" cols="7">
                      <v-select
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
                        @change="changeValue(item)"
                      />
                    </v-col>
                    <v-col v-if="item.type === 'treeSelect'" cols="7" style="margin-bottom:25px">
                      <treeselect
                        :value-consists-of="item.valueConsistsOf"
                        :multiple="item.isMultiple"
                        :clearable='false'
                        :options="item.options"
                        :placeholder="item.placeholder"
                        :default-expand-level="1"
                        v-model="item.value"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </div>
              <!-- 查看模式 -->
              <div v-if="addOrEditHeader.value==='edit' && !addOrEditHeader.isEdit">
               <v-form ref="Form" v-model="valid">
                <v-row v-for="(item, index) in addAndEditFormData" :key="index">
                  <v-col cols="4">
                    <div class="mt-2">{{item.label}}:</div>
                  </v-col>
                  <v-col cols="7" >
                    <span v-if="index===0" class="itemValue">
                      <v-text-field
                        :required="item.required"
                        v-model.trim="item.value"
                        dense
                        solo
                        flat
                        label
                        disabled
                      />
                    </span>
                    <span v-if="index===1" class="itemValue" style="padding-left:10px">{{item.value | rulesetOrganization(organizationList) }}</span>
                    <span v-if="index===2" class="itemValue">
                      <v-select
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        dense
                        solo
                        flat
                        disabled
                        append-icon="false"
                      />
                      </span>
                    <span
                      v-if="index===3"
                      class="itemValue"
                    >
                    <v-select
                        v-model="item.value"
                        item-text="tradeName"
                        item-value="id"
                        :items="tradeTypes"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        dense
                        solo
                        flat
                        disabled
                        append-icon="false"
                      />
                    </span>
                    <span
                      v-if="index===4"
                      class="itemValue"
                    >
                    <v-select
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :required="item.required"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        dense
                        solo
                        flat
                        disabled
                        append-icon="false"
                      />
                    </span>
                  </v-col>
              </v-row>
                </v-form>
              </div>
            </slot>
          </v-container>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <div class="flex-grow-1"/>
          <div
            v-if="addOrEditHeader.value === 'add' || (addOrEditHeader.value === 'edit' && addOrEditHeader.isEdit)"
          >
            <v-btn class="cancelButton mr-4" outlined @click="cancelEditOrAddRuleSet">取消</v-btn>
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white"
              @click="confirmEditOrAddRuleSet"
              :disabled="!valid"
            >保存</v-btn>
          </div>
          <div v-else>
            <v-btn class="primary mr-4" @click="cancelEditOrAddRuleSet">确定</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 确定删除的弹窗 -->
    <del-dialog
      :isDialogShow="isDialogDelShow"
      @cancelDel="isDialogDelShow = false;"
      @confimDel="confirmDelFun"
    ></del-dialog>
     <!-- 调接口结果的提示框 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >{{ snackbarServeMsg }}</v-snackbar>
  </div>
</template>
<script>
import * as dataService from 'api/ruleSet';
import delDialog from '@c/DelDialog';
import Treeselect from '@riophae/vue-treeselect';
import BaseSearch from '@c/BaseSearch';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

import { getList, getListTmp, getTmpListValue, getTmpPraList } from '../../api/ruleTempLib.js';
export default {
  name: 'ruleSet',
  components: {
    delDialog,
    BaseSearch,
    Treeselect
  },
  filters: {
    // 规则集匹配模式
    filtersShowRuleMatchingModel: function (dataStr, ruleMatchingModels) {
      var ruleMatchingModelText = '';
      ruleMatchingModels.forEach(element => {
        if (dataStr === element.value) {
          ruleMatchingModelText = element.text;
        }
      });
      return ruleMatchingModelText;
    },
    // 规则集状态
    rulesetStatus: function (dataStr, rulesetStatusList) {
      var rulesetStatus = '';
      rulesetStatusList.forEach(element => {
        if (dataStr === element.value) {
          rulesetStatus = element.text;
        }
      });
      return rulesetStatus;
    },
    // 规则集所属机构
    rulesetOrganization: function (dataStr, OrganizationList) {
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var organization = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < OrganizationList.length; j++) {
            if (element === OrganizationList[j].id) {
              organization.push(OrganizationList[j].label);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return organization.join('、');
      }
    },
    // 规则集所属应用
    rulesetApplication: function (dataStr, ApplicationList) {
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var Application = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < ApplicationList.length; j++) {
            if (element === ApplicationList[j].id) {
              Application.push(ApplicationList[j].appName);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return Application.join('、');
      }
    },
    // 规则集交易类型
    rulesetTradeTypes: function (dataStr, tradeTypeList) {
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var tradeType = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < tradeTypeList.length; j++) {
            if (element === tradeTypeList[j].id) {
              tradeType.push(tradeTypeList[j].tradeName);
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        return tradeType.join('、');
      }
    }
  },
  data () {
    return {
      // 表格加载数据动画
      loading: true,
      counter: 0,
      panel: 1,
      fullHeight: window.innerHeight,
      valid: true,
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      perPageNum: 10,
      queryPageLength: 0,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20],
      // 规则集列表表头
      rulesetHeaders: [
        { text: '规则集名称', value: 'setName', sortable: false },
        { text: '所属公司', value: 'organizationId', sortable: false },
        { text: '所属应用', value: 'appId', sortable: false },
        { text: '交易类型', value: 'transactionTypeId', sortable: false },
        { text: '规则匹配模式', value: 'matchingModel', width: '110px', sortable: false },
        { text: '状态', value: 'states', width: '80px', sortable: false },
        { text: '版本', value: 'version', width: '80px', sortable: false },
        { text: '版本比较', value: 'compareVersion', sortable: false },
        { text: '操作', value: 'action', sortable: false, width: '13%' }
      ],
      // 规则集列表数据
      ruleSets: [],
      // 搜索参数
      searchData: {
        setName: '',
        organizationId: null,
        appId: '',
        transactionTypeId: '',
        matchingModel: '',
        version: ''
      },
      // 删除弹窗
      isDialogDelShow: false,
      // 搜索组件数据
      searchParam: [
        { type: 'text', placeholder: '规则集名称', value: '' },
        {
          type: 'select',
          placeholder: '所属公司',
          value: '',
          options: [
            { value: 'all', text: '全部公司' }
          ]
        },
        {
          type: 'select',
          placeholder: '所属应用',
          value: '',
          options: [
            { text: '全部应用', value: 'all' }
          ]
        },
        {
          type: 'select',
          placeholder: '交易类型',
          value: '',
          options: []
        },
        {
          type: 'select',
          placeholder: '规则匹配模式',
          value: '',
          options: [
            { text: '全部规则匹配模式', value: 'all' },
            { text: '最坏匹配', value: 'WORST_MATCH' },
            { text: '首次匹配', value: 'FIRST_MATCH' },
            { text: '评分模式', value: 'SCORE_MATCH' }
          ]
        }
      ],
      // 规则集新增编辑弹框头部信息
      addOrEditHeader: {
        name: '添加规则集',
        value: 'add',
        isEdit: false
      },
      // 规则集新增编辑弹框表单数据
      addAndEditFormData: [
        {
          label: '规则集名称*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => (v && !!v) || '规则集名称不能为空',
            v => (v && v.length <= 50) || '最多只能输入50个字符',
            v => /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”、；‘'，。、]/.test(v) || '不能包含特殊字符'
          ]

        },
        {
          label: '所属公司*',
          value: '',
          required: true,
          rules: [v => (v && !!v.length) || '所属公司不能为空'],
          type: 'select',
          multiple: true,
          selectText: 'label',
          selectField: 'id',
          options: []
        },
        {
          label: '所属应用*',
          value: '',
          required: true,
          rules: [v => (v && !!v.length) || '所属应用不能为空'],
          type: 'select',
          multiple: true,
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        },
        {
          label: '交易类型*',
          value: '',
          required: true,
          rules: [v => (v && !!v.length) || '交易类型不能为空'],
          type: 'select',
          multiple: true,
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        },
        {
          label: '规则匹配模式*',
          value: '',
          required: true,
          rules: [v => (v && !!v) || '规则匹配模式不能为空'],
          type: 'select',
          selectText: 'selectText',
          selectField: 'selectField',
          options: [
            { selectText: '最坏匹配', selectField: 'WORST_MATCH' },
            { selectText: '首次匹配', selectField: 'FIRST_MATCH' },
            { selectText: '评分模式', selectField: 'SCORE_MATCH' }
          ]
        }
      ],
      // 新增编辑规则弹窗的title
      addOrEditRuleTitle: '新增规则',
      // 区分是否是新增规则
      isAddRule: true,
      // 是否可以删除和编辑的标识
      editAndDelFlag: true,
      confirmDelFun: '',
      RuleSetDialog: false,
      // 机构的数组
      organizationList: [],
      // 所属应用
      applications: [],
      appIDList: [],
      // 交易类型
      tradeTypes: [],
      // // 规则匹配模式
      ruleMatchingModels: [
        { text: '最坏匹配', value: 'WORST_MATCH' },
        { text: '首次匹配', value: 'FIRST_MATCH' },
        { text: '评分模式', value: 'SCORE_MATCH' }
      ],
      // 规则集状态
      rulesetStatus: [
        { value: '0', text: '已保存' },
        { value: '1', text: '已输出' },
        { value: '2', text: '输出失败' }
      ],
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      timeout: 2000,
      isSnackbarTop: true

    };
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 266;
      }
    },
    // 搜索表单的应用
    applicationOfSearch () {
      return this.searchParam[2].value;
    },
    // 规则集弹窗 编辑模式还是查看模式
    isRuleSetEdit () {
      return this.addOrEditHeader.isEdit;
    }
  },
  watch: {
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 70;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    },
    applicationOfAddOrEdit (val) {
      this.getTradeTypeList(val, 2);
      if (val.length === 1 && !val[0]) {
        this.addAndEditFormData[3].value = '';
      }
    },
    applicationOfSearch (val) {
      if (val) {
        if (val === 'all') {
          let param = [];
          this.applications.forEach(element => {
            param.push(element.id);
          });
          this.getTradeTypeList(param, 1);
        } else {
          let param = val;
          this.getTradeTypeList(param, 1);
        }
      }
    },
    isRuleSetEdit (val) {
      if (val) {
        this.addOrEditHeader.name = '编辑规则集';
      } else {
        this.addOrEditHeader.name = '查看规则集';
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 获取规则集列表
    async getRuleSetList () {
      this.loading = true;
      const pageParams = {
        startIndex: this.pageNum,
        pageSize: this.perPageNum
      };
      let searchData = JSON.parse(JSON.stringify(this.searchData));
      const params = Object.assign({}, pageParams, searchData);
      try {
        const response = await dataService.getRuleSet(params);
        const res = response.data.data;
        this.ruleSets = [];
        if (res.list) {
          this.ruleSets = res.list;
        }
        // 每条规则集的版本list
        for (let index = 0; index < this.ruleSets.length; index++) {
          this.ruleSets[index].versionList = [];
          for (let versionIndex = 0; versionIndex < this.ruleSets[index].rulesetHistoryList.length; versionIndex++) {
            this.ruleSets[index].versionList[versionIndex] = parseFloat(versionIndex + 1).toFixed(1);
          }
        }
        for (let index = 0; index < this.ruleSets.length; index++) {
          const element = this.ruleSets[index];
          element.version = parseFloat(element.rulesetHistoryList.length).toFixed(1);
        }
        this.queryPageLength = res.pages;
        this.totalItems = res.total;
        this.loading = false;
      } catch (error) {}
    },
    // 分页
    onPageChange (page) {
      this.currentPage = page;
      this.getRuleSetList(page);
    },
    // 没页的数据量修改
    pageNumChange () {
      this.getRuleSetList();
    },
    // 根据查询条件查询
    search ($event) {
      let setname = '';
      let orgainztionid = '';
      let appId = '';
      let transactionTypeId = '';
      let matchinmodel = '';
      $event.forEach((item, index, ary) => {
        if (item.placeholder === '规则集名称') {
          setname = item.value;
        } else if (item.placeholder === '所属公司') {
          orgainztionid = item.value;
        } else if (item.placeholder === '所属应用') {
          appId = item.value;
        } else if (item.placeholder === '交易类型') {
          transactionTypeId = item.value;
        } else if (item.placeholder === '规则匹配模式') {
          matchinmodel = item.value;
        }
      });
      if (orgainztionid === 'all') {
        orgainztionid = '';
      }
      if (appId === 'all') {
        appId = '';
      }
      if (transactionTypeId === 'all') {
        appId = '';
        transactionTypeId = '';
      }
      if (transactionTypeId === 'allOfOne') {
        transactionTypeId = '';
      }
      if (matchinmodel === 'all') {
        matchinmodel = '';
      }
      this.searchData = {
        setName: setname,
        organizationId: orgainztionid,
        appId: appId,
        transactionTypeId: transactionTypeId,
        matchingModel: matchinmodel
      };
      this.getRuleSetList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      $event[1].value = null;
      this.getTradeTypeList(this.appIDList, 1);
      this.searchData = {
        setName: '',
        organizationId: '',
        appId: '',
        transactionTypeId: '',
        matchingModel: ''
      };
      this.getRuleSetList();
    },
    // 获取枚举下拉数据  机构
    async getOrganizationList () {
      const params = {
        enumerateId: 'ORGANIZATION'
      };
      try {
        const response = await dataService.getSubordinateFirm();
        this.organizations = response.data.data.companyItems;
        this.organizationList = response.data.data.companyItems;
        this.addAndEditFormData[1].options = JSON.parse(JSON.stringify(this.organizations));
        if (this.organizations.length > 0) {
          this.organizations.forEach((item, index, ary) => {
            this.searchParam[1].options.push({ text: item.label, value: item.id });
          });
        }
      } catch (error) {}
    },
    // 获取枚举下拉数据  应用
    async getApplicationList () {
      let params = {
        states: 1,
        appName: '',
        spid: '',
        appTag: '',
        appType: ''
      };
      try {
        const response = await dataService.getApp(params);
        this.applications = response.data.data;
        this.searchParam[2].options = [
          {
            text: '全部应用',
            value: 'all'
          }
        ];
        this.applications.forEach(element => {
          this.appIDList.push(element.id);
          this.addAndEditFormData[2].options.push({
            selectText: element.appName,
            selectField: element.id
          });
          this.searchParam[2].options.push({
            text: element.appName,
            value: element.id
          });
        });
        this.getTradeTypeList(this.appIDList, 1);
      } catch (error) {}
    },
    // 获取枚举下拉数据  所有交易类型（系统参数库取）
    async getAllTradeTypeList () {
      const params = {
        tradeName: '',
        identifier: '',
        isAmount: ''
      };
      try {
        const response = await dataService.findtradelist(params);
        this.tradeTypes = response.data.data;
      } catch (error) {}
    },
    // 获取所选应用下的交易类型
    async getTradeTypeList (param, forWhat) {
      let ids;
      if (forWhat === 1) {
        if (typeof param === 'string') {
          ids = [param];
        }
        if (typeof param === 'object') {
          ids = param;
        }
      } else {
        ids = param;
      }
      const params = {
        jsonIds: JSON.stringify(ids)
      };
      try {
        const response = await dataService.getTradeType(params);
        if (response.data.code < 0) {
          response.data.data = [];
        }
        // 搜索的应用选中
        if (forWhat === 1) {
          this.searchParam[3].options = [
            {
              text: '全部交易类型',
              value: 'allOfOne'
            }
          ];
          // 返回的交易类型有值
          if (response.data.data.length) {
            response.data.data.forEach(element => {
              this.searchParam[3].options.push({
                text: element.tradeName,
                value: element.id
              });
            });
          } else {
            this.searchParam[3].options = [];
          }
        } else {
          // 新增和编辑的应用选择
          if (response.data.data.length) {
            this.addAndEditFormData[3].options = [];
            response.data.data.forEach(element => {
              this.addAndEditFormData[3].options.push({
                selectText: element.tradeName,
                selectField: element.id
              });
            });
          } else {
            this.addAndEditFormData[3].options = [];
          }
        }
      } catch (error) {}
    },
    // 添加规则集
    AddRuleSet () {
      if (this.$refs.Form) {
        this.$refs.Form.reset();
      }
      this.addOrEditHeader = {
        name: '添加规则集',
        value: 'add',
        isEdit: false
      };
      this.addAndEditFormData[1].value = [];
      this.addAndEditFormData[3].options = [];
      this.isAddRuleSet = true;
      this.RuleSetDialog = !this.RuleSetDialog;
    },
    // 编辑规则集
    async editRuleset (item) {
      this.editAndDelFlag = true;
      // 如果是多个版本的话 不能删除或编辑
      if (item.rulesetHistoryList.length > 1) {
        this.editAndDelFlag = false;
      } else {
        // 只有一个版本 已经有配置规则的时候
        const param = {
          id: item.rulesetHistoryList[0].id
        };
        try {
          const response = await dataService.getVersionInfo(param);
          const code = response.data.code;
          if (code === 200) {
            if (response.data.data.ruleList.length > 0) {
              this.editAndDelFlag = false;
            }
          }
        } catch (error) {}
      }
      // 只有一个版本但是没有规则配置时候看是否被引用
      if (this.editAndDelFlag) {
        const param = {
          sourceId: item.id,
          sourceType: 'RULE_SET',
          sourceVersion: parseInt(item.version / 1)
        };
        try {
          const response = await dataService.checkIsrefrecord(param);
          const code = response.data.code;
          if (code === 200) {
            if (response.data.data.isReference) {
              this.editAndDelFlag = false;
            }
          }
        } catch (error) {
        }
      }
      try {
        this.addOrEditHeader = {
          name: '查看规则集',
          value: 'edit',
          isEdit: false
        };
        this.addAndEditFormData[0].value = item.setName;
        this.addAndEditFormData[1].value = item.organizationId.split(',');
        this.addAndEditFormData[2].value = item.appId.split(',');
        this.addAndEditFormData[3].value = item.transactionTypeId.split(',');
        this.addAndEditFormData[4].value = item.matchingModel;
        this.RuleSetDialog = !this.RuleSetDialog;
        this.RuleSet = item;
      } catch (error) {}
    },
    // 添加or编辑规则集弹框的取消按钮方法
    cancelEditOrAddRuleSet () {
      if (this.$refs.Form) {
        this.$refs.Form.reset();
      }
      this.RuleSetDialog = false;
    },
    // 添加or编辑规则集弹框的保存按钮方法
    async confirmEditOrAddRuleSet () {
      let setname = '';
      let orgainztionid = '';
      let appId = '';
      let transactionTypeId = '';
      let matchinmodel = '';
      this.addAndEditFormData.forEach((item, index, ary) => {
        if (item.label === '规则集名称*') {
          setname = item.value;
        } else if (item.label === '所属公司*') {
          orgainztionid = item.value.join(',');
        } else if (item.label === '所属应用*') {
          appId = item.value.join(',');
        } else if (item.label === '交易类型*') {
          transactionTypeId = item.value.join(',');
        } else if (item.label === '规则匹配模式*') {
          matchinmodel = item.value;
        }
      });

      let params = {
        setName: setname,
        organizationId: orgainztionid,
        appId: appId,
        transactionTypeId: transactionTypeId,
        matchingModel: matchinmodel
      };
      if (!params.organizationId) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '所属公司不能为空';
        this.snackbarServeColor = 'error';
        return;
      }
      if (this.addOrEditHeader.value === 'add') {
        // 添加
        try {
          const response = await dataService.addRuleSet(params);
          const code = response.data.code;
          if (code > 0) {
            this.RuleSetDialog = false;
            this.snackbarServe = true;
            this.snackbarServeMsg = '添加成功';
            this.snackbarServeColor = 'primary';
            this.getRuleSetList();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = response.data.msg;
            this.snackbarServeColor = 'red';
          }
        } catch (error) {
        }
      } else {
        // 编辑
        const param = {
          id: this.RuleSet.id,
          setNo: this.RuleSet.setNo,
          setName: setname,
          organizationId: orgainztionid,
          appId: appId,
          transactionTypeId: transactionTypeId,
          matchingModel: matchinmodel,
          riskThreshold: this.RuleSet.riskThreshold,
          version: parseInt(this.RuleSet.version / 1),
          ruleList: '[]'
        };
        const response = await dataService.modifyRuleSet(param);
        const code = response.data.code;
        if (code > 0) {
          this.RuleSetDialog = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = '修改成功';
          this.snackbarServeColor = 'primary';
          this.getRuleSetList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = response.data.msg;
          this.snackbarServeColor = 'red';
        }
      }
    },
    // 点击规则集删除按钮
    async deleteRuleSet (item) {
      this.editAndDelFlag = true;
      // 如果是多个版本的话 不能删除或编辑
      if (item.rulesetHistoryList.length > 1) {
        this.editAndDelFlag = false;
      } else {
        // 只有一个版本 已经有配置规则的时候
        const param = {
          id: item.rulesetHistoryList[0].id
        };
        try {
          const response = await dataService.getVersionInfo(param);
          const code = response.data.code;
          if (code === 200) {
            if (response.data.data.ruleList.length > 0) {
              this.editAndDelFlag = false;
            }
          }
        } catch (error) {}
      }
      // 只有一个版本但是没有规则配置时候看是否被引用
      if (this.editAndDelFlag) {
        const param = {
          sourceId: item.id,
          sourceType: 'RULE_SET',
          sourceVersion: parseInt(item.version / 1)
        };
        try {
          const response = await dataService.checkIsrefrecord(param);
          const code = response.data.code;
          if (code === 200) {
            if (response.data.data.isReference) {
              this.editAndDelFlag = false;
            }
          }
        } catch (error) {
        }
      }
      // 规则集被引用或者配置规则不能删除
      if (!this.editAndDelFlag) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '规则集被引用或者已配置规则，不能删除';
        this.snackbarServeColor = 'error';
      } else {
        // 规则集存在被引用的版本和有规则的时候不能删除
        this.delRuleset = item;
        this.isDialogDelShow = true;
        this.confirmDelFun = this.confimDelRuleset;
      }
    },
    // 确定删除规则集
    async confimDelRuleset () {
      const param = { id: this.delRuleset.id };
      try {
        const response = await dataService.delRuleSet(param);
        const code = response.data.code;
        if (code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '删除成功';
          this.snackbarServeColor = 'primary';
          this.getRuleSetList(this.currentPage);
          this.isDialogDelShow = false;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = response.data.msg;
          this.snackbarServeColor = 'red';
          this.getRuleSetList(this.currentPage);
          this.isDialogDelShow = false;
        }
      } catch (error) {
      }
    },
    // 列表的版本下拉框change事件
    VersionChange (item) {
      this.currentVersion = parseInt(item.version / 1);
    },
    // 编辑弹窗 点击编辑的开关按钮
    clickEditSwitch () {
      if (!this.editAndDelFlag) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '规则集被引用或者已配置规则，不能编辑';
        this.snackbarServeColor = 'red';
      }
    },
    // 新增编辑规则集选择框change事件
    changeValue (item) {
      for (let index = 0; index < item.value.length; index++) {
        const element = item.value[index];
        if (!element) {
          item.value.splice(index, 1);
        }
      }
      if (item.label === '所属应用*') {
        this.getTradeTypeList(item.value, 2);
        if (!item.value.length) {
          item.value = '';
        }
        this.addAndEditFormData[3].value = '';
      }
      if (item.label === '交易类型*') {
        if (!item.value.length) {
          item.value = '';
        }
        if (item.value.length > 200) {
          this.valid = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = '交易类型最多不能超过200个';
          this.snackbarServeColor = 'error';
        }
      }
    },
    // 新增编辑规则集输入框输入事件
    inputValue (item) {
      if (item.value) {
        item.value = item.value.replace(/(^\s*)|(\s*$)/g, '');
      }
    },
    // 点击规则集编辑规则详情按钮
    async operateRules (item) {
      let sStorage = window.sessionStorage;
      // 规则集基本信息
      sStorage.setItem('ruleSet', JSON.stringify(item));
      // 版本号
      sStorage.setItem('versionNum', parseInt(item.version / 1));
      // 版本id
      item.rulesetHistoryList.forEach(element => {
        if (parseInt(item.version / 1) === element.histVersion) {
          sStorage.setItem('versionId', element.id);
        }
      });
      this.$router.push('/ruleListDetail');
    },
    // 规则集由查看变为编辑
    viewToEdit (param) {
      if (param) {
        this.getTradeTypeList(this.addAndEditFormData[2].value, 2);
      }
    }
  },
  created () {
    let sessionS = window.sessionStorage;
    // 获取搜索条件的缓存
    let searchParamsForSession = sessionS.getItem('searchParam');
    if (searchParamsForSession) {
      searchParamsForSession = JSON.parse(searchParamsForSession);
    }
    if (searchParamsForSession && searchParamsForSession.length) {
      for (let index = 0; index < searchParamsForSession.length; index++) {
        this.searchParam[index].value = searchParamsForSession[index];
        this.searchData[Object.keys(this.searchData)[index]] = searchParamsForSession[index];
        if (searchParamsForSession[index] === 'all') {
          this.searchData[Object.keys(this.searchData)[index]] = '';
        }

        if (searchParamsForSession[index]) {
          this.panel = 0;
        }
      }
    }
    // 获取分页相关缓存
    this.perPageNum = sessionS.getItem('perPageNum') ? parseInt(sessionS.getItem('perPageNum')) : 10;
    this.pageNum = sessionS.getItem('pageNum') ? parseInt(sessionS.getItem('pageNum')) : 1;
    this.getRuleSetList();
    this.getApplicationList();
    this.getOrganizationList();
    this.getAllTradeTypeList();
  },
  // 离开规则集页面 可以访问到组件实例this
  beforeRouteLeave (to, from, next) {
    // 如果跳转的页面是规则集详情的页面 搜索条件有值 缓存
    let searchParamsForSession = {};
    this.searchParam.forEach(item => {
      searchParamsForSession[item.placeholder] = item.value || '';
    });
    if (to.name === 'ruleListDetail') {
      window.sessionStorage.setItem('searchParam', JSON.stringify(Object.values(searchParamsForSession)));
      window.sessionStorage.setItem('perPageNum', this.perPageNum);
      window.sessionStorage.setItem('pageNum', this.pageNum);
    } else {
      window.sessionStorage.setItem('searchParam', '');
      window.sessionStorage.setItem('perPageNum', 10);
      window.sessionStorage.setItem('pageNum', 1);
    }
    next();
  }

};
</script>
<style  lang='stylus' >
.clear:after {
  content: '\20';
  display: block;
  height: 0;
  clear: both;
}

.ruleSetVersion.v-text-field--outlined.v-input--is-focused fieldset {
  height: 40px !important;
}

.ruleSetVersion .v-select__slot {
  height: 40px !important;
}

.ruleSetVersion .mdi-menu-down::before {
  margin-bottom: 0px !important;
}

.ruleSetVersion.theme--light.v-text-field--outlined fieldset {
  height: 40px;
}

.middle-align {
  height: 40px;
  line-height: 40px;
}

.logic-title {
  font-size: 14px;
}

.relation-padding {
  padding-left: 0px !important;
}

.relation-padding >>> .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot, .v-text-field.v-text-field--enclosed .v-text-field__details {
  padding: 0 10px;
}

.activeItem {
  background-color: #f5f5f5;
}

.vue-treeselect__control {
  height: 40px !important;
  border: 1px solid rgba(0, 0, 0, 0.24);
}

.vue-treeselect__placeholder {
  font-size: 13px;
  line-height: 40px;
}

.vue-treeselect__single-value {
  font-size: 13px;
  line-height: 40px;
}
.ruleSetAddOrEdit .vue-treeselect__placeholder{
  color:rgba(0, 0, 0, 0.6)
}
.itemValue {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  color:rgba(0, 0, 0, 0.38)
}

.ruleSetAddOrEdit .v-input__control {
  height: auto !important;
}
.ruleSetAddOrEdit .col {
  padding: 0 !important;
}
.ruleSetParam .col {
  padding: 0 !important;
  padding-left: 12px !important;
}
.activeItem .col {
  padding-bottom: 15px;
  padding-top: 15px;
}

.v-data-table--fixed-header thead tr th:nth-child(1){
  z-index:0
}
.v-data-table--fixed-header thead tr th:nth-child(2){
  z-index:0
}
.v-data-table--fixed-header thead tr th:nth-child(3){
  z-index:0
}
.v-data-table--fixed-header thead tr th:nth-child(4){
  z-index:0
}
.theme--light.v-chip:not(.v-chip--active){
   background-color: transparent!important;
}
.tempParamName{
 padding-left:150px;
  margin-top:20px;
  font-weight:700
}

.tempParamItem{
  padding-left:150px;
  margin-top:20px
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
.tempParamItem .name{
  display: inline-block;
  min-width: 180px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.tempParamItem .value {
  display: inline-block;
  width: 50%;
  height: 40px;
  margin-left: 20px;
}
.questionMark {
  margin-left: 16px;
  cursor: pointer;
}
.Rule-setting .v-expansion-panel-content__wrap{
  padding-bottom:30px
}
</style>
