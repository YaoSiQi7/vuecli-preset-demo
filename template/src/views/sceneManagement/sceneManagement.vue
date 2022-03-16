<!--author：古雪瑞 -->
<!--updateTime：2020-05-13-->
<template>
  <!-- 场景管理 -->
  <div class="com-tempParam-lib">
    <base-search @change="panelCounter">
      <template v-slot>
          <!-- 条件查询form -->
          <slot>
            <v-row>
              <v-col class="pb-0 pt-0">
                <v-form
                  ref="searchForm"
                  v-model="searchValid"
                  lazy-validation
                >
                  <v-container grid-list-xl class="ml-0 mr-0 pt-0 pb-0 pl-3" >
                    <v-row>
                      <v-col
                        cols="12"
                        sm="12"
                        md="2"
                        xl="2"
                      >
                        <!-- <v-select
                          placeholder="交易类型："
                          v-model="searchForm.tradeId"
                          :items="tradeTypeItems"
                          outlined
                          dense
                          no-data-text="没有匹配数据"
                          class="pt-0 pb-0"
                        ></v-select> -->

                         <v-autocomplete
                            v-model="searchForm.tradeId"
                            :items="tradeTypeItems"
                            placeholder="交易类型"
                            outlined
                            dense
                            no-data-text="没有匹配数据"
                            class="pt-0 pb-0"
                       />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="2"
                        xl="2"
                      >
                        <v-text-field
                          placeholder="交易场景标识："
                          v-model="searchForm.scenesNo"
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
                        <v-select
                          placeholder="策略类型："
                          v-model="searchForm.strategyType"
                          :items="strategyTypeItems"
                          item-text="selectText"
                          item-value="selectField"
                          outlined
                          dense
                          no-data-text="没有匹配数据"
                          class="pt-0 pb-0"
                        ></v-select>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="2"
                        xl="2"
                      >
                        <v-text-field placeholder="创建时间:" outlined dense v-model="dateRangeText" append-icon="event"  @click="dateInputClick"></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="2"
                        xl="2"
                      >
                        <v-text-field placeholder="修改时间:" outlined dense v-model="updateRangeText" append-icon="event"  @click="updateInputClick"></v-text-field>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="2"
                        xl="2"
                        class="pl-0"
                        style="padding-top:18px;"
                      >
                        <v-btn
                          color="primary"
                          class="mr-2"
                          @click="reset"
                          small
                        >
                          重置
                        </v-btn>
                        <v-btn
                          color="primary"
                          @click="searchTable"
                          small
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
                          <v-date-picker selected-items-text="已选择日期" v-model="searchForm.dates" range  @change="dateChange"></v-date-picker>
                        </v-dialog>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="2"
                        xl="2"
                      >
                        <v-dialog v-model="isUpdateShow" width="321">
                          <v-date-picker selected-items-text="已选择日期" v-model="searchForm.updates" range  @change="updateChange"></v-date-picker>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-col>
            </v-row>
          </slot>
      </template>
    </base-search>
    <!-- 表格 -->
    <v-data-table
      :headers="sceneManageHeaders"
      :items="sceneManageData"
      :items-per-page="perPageNum"
      hide-default-footer
      :height="tableHeight"
      class="elevation-3 mt-3"
      :fixed-header="true"
    >
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar
          flat
          height="60px"
        >
          <v-toolbar-title style="font-size:18px">
            场景管理数据
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          />
          <v-spacer />
          <v-btn
            color="primary"
            class="mr-1 mt-1"
            @click="AddScene"
            v-if="hasPermission(addSceneBtn)"
          >
            添加
          </v-btn>
          <!--<v-btn
            color="primary"
            class="mr-1 ml-4 mt-1"
            disabled
            v-if="hasPermission(importSceneBtn)"
          >
            导入
          </v-btn>
          <v-btn
            color="primary"
            class="mr-1 ml-4 mt-1"
            disabled
            v-if="hasPermission(exportSceneBtn)"
          >
            导出
          </v-btn>
          <v-btn
            color="primary"
            class="mr-1 ml-4 mt-1"
            @click="repeatUse"
            disabled
            v-if="hasPermission(reuseSceneBtn)"
          >
            复用
          </v-btn>-->
        </v-toolbar>
      </template>
      <template v-slot:body="{ items }">
        <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
          <td colspan="9">没有数据</td>
        </tr>
        <tr
          v-else
          v-for="(item, index) in items"
          :key="index"
          class="el-tr-defu"
        >
          <td
            class="el-border-defu"
          >
            {{ item.tradeName }}
          </td>
          <td class="el-border-defu">
            {{ item.scenesNo }}
          </td>
          <td
            class="el-border-defu"
          >
            {{ item.strategyType | conversionStrategyType(strategyTypeItems) }}
          </td>
          <td class="el-border-defu">
            {{ item.targetName }}
          </td>
          <td class="el-border-defu">
            {{ item.targetVersion }}
          </td>
          <td
            class="el-border-defu"
          >
            <!--<v-switch
              v-model="item.states"
              color="primary"
              @change="isStat"
              v-if="hasPermission(sceneStatusBtn)"
            />-->
            <v-btn-toggle color="primary" mandatory v-model="item.states" @change="statesChange($event, item)">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" style="height:26px" value="0">停用</v-btn>
                </template>
                <span>停用状态下，系统将拒绝调用方的<br/>接口请求，返回请求参数无效</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" style="height:26px" value="2">试运行</v-btn>
                </template>
                <span>试运行状态下，系统将会记录交易<br/>风险情况，但返回给调用方的处置<br/>策略为自动放行</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" style="height:26px" value="1">启用</v-btn>
                </template>
                <span>启用状态下，系统将交易风险情况<br/>返给调用方</span>
              </v-tooltip>
            </v-btn-toggle>
          </td>
          <td
            class="el-border-defu"
          >
              <span>{{ item.createTime }}</span>
          </td>
          <td
            class="el-border-defu"
          >
              <span>{{ item.updateTime }}</span>
          </td>
          <td class="el-border-defu" style="width: 120px;">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-3 icon-primary"
                  v-on="on"
                  color="primary"
                  @click="editScene(item)"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>场景编辑</span>
            </v-tooltip>
            <v-tooltip bottom v-if="hasPermission(saveSceneStrategyBtn)">
            <!-- <v-tooltip bottom > -->
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-3 icon-primary"
                  v-on="on"
                  color="primary"
                  @click="editStrategy(item)"
                >
                  fas fa-edit
                </v-icon>
              </template>
              <span>策略编辑</span>
            </v-tooltip>
            <v-tooltip bottom v-if="hasPermission(deleteSceneBtn)">
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  v-on="on"
                  color="primary"
                  @click="doDeteleParam(item)"
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
    <!-- 添加或编辑的弹窗 -->
    <base-create :baseCteateEditPowerBtn="editSceneBtn" :formHeader='addOrEditHeader' :crudFormDialog='dialog' :formData='addAndEditFormData' @cancelCrudFormDialog='cancel($event)' @confimDialogSave='save(arguments)' @switchOnChange="onChange($event)"></base-create>
    <!-- 点击复用按钮的弹框 -->
    <v-dialog
      v-model="repeatUseDialog"
      persistent
      scrollable
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <!-- 场景复用 -->
          <v-toolbar-title>
            复用场景
          </v-toolbar-title>
        <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="repeatUseCancel"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form
            ref="repeatForm"
            :lazy-validation="lazy"
            v-model="valid"
            class="form"
          >
            <v-row>
              <v-col cols="3">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="7">
                <v-select
                  label="源应用选择："
                  required
                  :rules="[v => !!v || '源应用不能为空']"
                  v-model="repeatForm.tradeApp"
                  :items="originAppinfo"
                  item-text="selectText"
                  item-value="selectField"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  @change="changeApp(repeatForm.tradeApp)"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="7">
                <v-select
                  label="源交易类型："
                  required
                  :rules="[v => !!v || '源交易类型不能为空']"
                  v-model="repeatForm.tradeType"
                  :items="originTradeTypeItems"
                  item-text="selectText"
                  item-value="selectField"
                  outlined
                  dense
                  @change="changeTradeType(repeatForm.tradeType)"
                  no-data-text="没有匹配数据"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="7">
                <v-text-field
                  label="源交易场景标识："
                  required
                  :counter="50"
                  :rules="[
                    v => !!v || '源交易场景标识不能为空',
                    v => /^[0-9a-zA-Z_]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线，及其组合',
                    v => v && v.length <= 50 || '最多只能输入50个字符'
                  ]"
                  v-model.trim="repeatForm.sceneNo"
                  item-text="selectText"
                  item-value="selectField"
                  outlined
                  dense
                  :disabled="isNeedEdit"
                  no-data-text="没有匹配数据"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="repeatUseCancel">取消
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="repeatUseSave"
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
    <!-- 敬请期待的提示框 -->
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :top="isSnackbarTop"
    >
      敬请期待
    </v-snackbar>
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
import * as dataService from 'api/sceneManagement.js';
import { getRuleSet, getVersionInfo, getSubordinateFirm } from 'api/ruleSet.js';
import { BASE_LENGTH_TEXT, NO_EMPTY_SPACE_ALLOWED, BASE_VALUE_TEXT, NO_SCENE_NO, BASE_VALUE } from 'utils/validate.js';
import { mapGetters, mapActions } from 'vuex';
import BaseSearch from '@/components/BaseSearch';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import moment from 'moment';
export default {
  name: 'sceneManagement',
  data () {
    return {
      counter: 0,
      fullHeight: window.innerHeight,
      operateStrategyItems: [],
      // 是否显示复用弹窗
      repeatFormDialog: false,
      valid: true,
      lazy: false,
      originAppinfo: [],
      originTradeTypeItems: [],
      repeatForm: {
        tradeApp: '',
        tradeType: '',
        sceneNo: '',
        targetVersion: ''
      },
      isNeedEdit: false,
      confirmDelFun: '',
      snackbar: false,
      timeout: 2000,
      isSnackbarTop: true,
      sSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '',
      isStatValue: false,
      isSwitchChange: false,
      // 策略编辑弹窗
      strategyConfigShow: false,
      // 新增编辑弹窗
      dialog: false,
      editId: '',
      historyId: '',
      // 删除弹窗
      dialogDel: false,
      // 表格数据
      sceneManageData: [],
      // 表格头部
      sceneManageHeaders: [
        {
          text: '交易类型',
          align: 'left',
          sortable: false,
          value: 'tradeName',
          width: 100
        },
        { text: '交易场景标识', value: 'scenesNo', sortable: false, width: 100 },
        { text: '策略类型', value: 'strategyType', sortable: false, width: 100 },
        { text: '策略名称', value: 'targetName', sortable: false, width: 100 },
        { text: '策略版本', value: 'targetVersion', sortable: false, width: 100 },
        { text: '状态', value: 'states', sortable: false, width: 100 },
        { text: '创建时间', value: 'createTime', sortable: false, width: 100 },
        { text: '修改时间', value: 'updateTime', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      strategyId: '',
      targetId: '',
      // 新增编辑弹窗头部
      addOrEditHeader: {
        name: '添加',
        value: 'add',
        isEdit: true
      },
      // 新增编辑弹窗表单信息
      addAndEditFormData: [
        {
          label: '交易类型:',
          value: '',
          required: true,
          rules: [v => !!v || NO_EMPTY_SPACE_ALLOWED],
          type: 'autocomplete',
          selectText: 'selectText',
          selectField: 'selectField',
          autocompleteOptions: []
        },
        { label: '交易场景标识:',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || NO_SCENE_NO,
            v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || BASE_LENGTH_TEXT
          ]
        },
        {
          label: '策略类型:',
          value: '',
          required: true,
          rules: [v => !!v || NO_EMPTY_SPACE_ALLOWED],
          type: 'select',
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        }
      ],
      // 复用弹窗
      repeatUseDialog: false,
      // 区分是新增还是编辑的变量 1是新增 2是编辑
      flag: 1,
      // 被删除的参数
      delParam: {},
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 搜索条件
      dates: [],
      updates: [],
      isdateShow: false,
      isUpdateShow: false,
      searchForm: {
        tradeId: '',
        scenesNo: '',
        strategyType: '',
        dates: [],
        updates: []
      },
      dateProps: {
        headerColor: 'primary'
      },
      timeProps: {
        useSeconds: true,
        ampmInTitle: true
      },
      textFieldProps: {
        appendIcon: 'event'
      },
      dateTypeStart: 1,
      dateTypeEnd: 2,
      isCreateDate: false,
      isReviseDate: false,
      searchValid: true,
      isExpanded: true,
      // 策略类型选项
      strategyTypeItems: [],
      tradeTypeItems: [],
      // 编辑弹窗中传入的策略类型选项
      allStrategyTypeItems: [],
      // 添加弹框中交易类型选项
      allTradeTypeitems: [],
      // 添加的场景是否来自复用
      isFromRepeat: false,
      // 按钮权限
      addSceneBtn: 'addSceneButton', // 控制添加按钮是否展示
      importSceneBtn: 'importSceneButton', // 控制导入按钮是否显示
      exportSceneBtn: 'exportSceneButton', // 控制导出按钮是否显示
      reuseSceneBtn: 'reuseSceneButton', // 控制复用按钮是否显示
      sceneStatusBtn: 'conversionSceneStatusButton', // 表格状态按钮
      editSceneBtn: 'editSceneButton', // 表格编辑按钮
      saveSceneStrategyBtn: 'saveSceneStrategyButton', // 表格策略按钮
      deleteSceneBtn: 'deleteSceneButton', // 表格删除功能
      appIdNew: '' // 暂存appID
    };
  },
  components: {
    BaseCreate,
    DelDialog,
    BaseSearch
  },
  filters: {
    // 策略类型
    conversionStrategyType: function (str, itemList) {
      // console.log(str, itemList, '策略类型');
      let dataTypeText;
      itemList.forEach(item => {
        if (item.selectField === str) {
          dataTypeText = item.selectText;
        }
      });
      return dataTypeText;
    },
    // 场景标识
    conversionSceneNo: function (str, itemList) {
      let text;
      itemList.forEach(item => {
        if (item.selectField === str) {
          text = item.sceneNo;
        }
      });
      return text;
    },
    // 场景标识
    conversVersion: function (str, itemList) {
      let text;
      itemList.forEach(item => {
        if (item.selectField === str) {
          text = item.targetVersion;
        }
      });
      return text;
    },
    conversionTargetId: function (str, itemList) {
      let text;
      itemList.forEach(item => {
        if (item.selectField === str) {
          text = item.targetId;
        }
      });
      return text;
    },
    conversionTradeId: function (str, itemList) {
      let text;
      itemList.forEach(item => {
        if (item.selectField === str) {
          text = item.tradeId;
        }
      });
      return text;
    },
    // 规则条件配置方式
    filtersSettingRuleType: function (dataStr, settingRuleTypes) {
      var settingRuleType = '';
      settingRuleTypes.forEach(element => {
        if (dataStr === element.value) {
          settingRuleType = element.text;
        }
      });

      return settingRuleType;
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
    }
  },
  computed: {
    // titleName () {
    //   let t = '';
    //   return this.flg == 1 ? (t = "添加") : "编辑"; //eslint-disable-line
    // },
    panel: {
      // 查询表单的扩展, 默认关闭, 0为打开
      // 接受props.isExpanded, true时打开, false或未传值为关闭
      get: function () {
        return this.isExpanded ? 0 : 1;
      },
      set: function () {
        this.isExpanded = !this.panel;
      }
    },
    // 创建时间
    dateRangeText: {
      get () {
        if (moment(this.searchForm.dates[0]).valueOf() > moment(this.searchForm.dates[1]).valueOf()) {
          this.reverseArry(this.searchForm.dates);
        }
        return this.searchForm.dates.join(' ~ ');
      },
      set (newVal) {}
    },
    // 更新时间
    updateRangeText: {
      get () {
        if (moment(this.searchForm.updates[0]).valueOf() > moment(this.searchForm.updates[1]).valueOf()) {
          this.reverseArry(this.searchForm.updates);
        }
        return this.searchForm.updates.join(' ~ ');
      },
      set (newVal) {}
    },
    ...mapGetters([
      'appId'
    ]),
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 264;
      }
    }
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        this.pageNum = 1;
        Promise.all([
          this.getTradeTypeList(),
          this.getDataList(),
          this.queryParams()
        ]);
      },
      immediate: false
    },
    counter: {
      handler: function (newValue, oldValue) {
        if (this.counter % 2 === 1) {
          // 开
          this.tableHeight = window.innerHeight - 90;
        } else {
          // 关
          this.tableHeight = window.innerHeight;
        }
      },
      immediate: true
    }
  },
  created () {

  },

  // 离开规则集页面 可以访问到组件实例this
  beforeRouteLeave (to, from, next) {
    // 如果跳转的页面是场景编辑页面，记录当前的页码
    if (to.name === 'sceneStrategy') {
      window.sessionStorage.setItem('perPageNum', this.perPageNum);
      window.sessionStorage.setItem('pageNum', this.pageNum);
      window.sessionStorage.setItem('sceneAppId', this.appId);
    } else {
      window.sessionStorage.setItem('perPageNum', 10);
      window.sessionStorage.setItem('pageNum', 1);
      window.sessionStorage.setItem('sceneAppId', this.appId);
    }
    next();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    let sessionS = window.sessionStorage; // 获取页面缓存
    // 获取分页相关缓存
    this.perPageNum = sessionS.getItem('perPageNum') ? parseInt(sessionS.getItem('perPageNum')) : 10;
    this.pageNum = sessionS.getItem('pageNum') ? parseInt(sessionS.getItem('pageNum')) : 1;
    this.appIdNew = sessionS.getItem('sceneAppId');
    // console.log(this.perPageNum, this.pageNum, 'created11111');
    this.getDataList();// 页面列表数据请求
    this.queryParams();
    this.getTradeTypeList();
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    panelCounter: function () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 搜索条件重置
    reset () {
      this.$refs.searchForm.reset();
      this.searchForm.dates = [];
      this.searchForm.updates = [];
      this.getDataList();
    },
    // 点击查询
    searchTable () {
      this.pageNum = 1;// 查询从第一页开始
      this.getDataList();
    },
    async getTradeTypeList () {
      this.tradeTypeItems = [];
      let param = {
        jsonIds: ''
      };
      if (!this.appId && !this.appIdNew) return;
      if (this.appId === '' || this.appId === null) {
        param.jsonIds = JSON.stringify([this.appIdNew]);
      } else {
        param.jsonIds = JSON.stringify([this.appId]);
      }
      const response = await dataService.queryTradeType(param);
      if (response.data.code === 200) {
        let resTradeTypeItems = response.data.data;
        resTradeTypeItems.forEach((item, index, ary) => {
          this.tradeTypeItems.push({
            text: item.tradeName,
            value: item.id
          });
        });
      }
      this.tradeTypeItems.unshift({ text: '全部交易类型', value: 'all' });
    },
    onPageChange (page) {
      this.pageNum = page;
      this.currentPage = page;
      this.getDataList(page);
    },
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 获取首页列表
    async getDataList (startIndex = 1, pageSize = 10) {
      console.log(this.pageNum, '当前页');
      if (this.searchForm.tradeId === 'all') {
        this.searchForm.tradeId = '';
      }
      if (this.searchForm.strategyType === 'all') {
        this.searchForm.strategyType = '';
      }
      if (this.appId) {
        let params = {
          pageNo: this.pageNum,
          pageSize: this.perPageNum,
          tradeId: this.searchForm.tradeId,
          appId: this.appId,
          scenesNo: this.searchForm.scenesNo,
          strategyType: this.searchForm.strategyType,
          createTimeStart: this.searchForm.dates.length === 2 ? (this.searchForm.dates[0] + ' 00:00:00') : '',
          createTimeEnd: this.searchForm.dates.length === 2 ? (this.searchForm.dates[1] + ' 23:59:59') : '',
          updateTimeStart: this.searchForm.updates.length === 2 ? (this.searchForm.updates[0] + ' 00:00:00') : '',
          updateTimeEnd: this.searchForm.updates.length === 2 ? (this.searchForm.updates[1] + ' 23:59:59') : ''
        };
        const res = await dataService.querySceneList(params);
        if (res.data.code === 200) {
          this.sceneManageData = res.data.data.records;
          // console.log(this.sceneManageData,'场景列表数据');
          // this.sceneManageData.forEach((item, index, ary) => {
          //   if (item.states === '1') {
          //     item.states = true;
          //   } else {
          //     item.states = false;
          //   }
          // });
          this.totalItems = res.data.data.total;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          if (this.isFromRepeat) { // 若是通过复用添加的场景，并且已存在选择的规则集，则添加一条引用记录
            let addRecordParam = res.data.data.records[0];
            if (addRecordParam.targetName) {
              let param = {
                sourceId: addRecordParam.targetId, // 对应被引用的规则集的id
                sourceType: 'RULE_SET',
                targetType: 'SCENE',
                targetId: addRecordParam.id, // 对应当前这一条场景的id
                sourceVersion: Number(addRecordParam.targetVersion)
              };
              let addParams = {
                jsonStr: JSON.stringify([param])
              };
              try {
                const res = await dataService.addRecord(addParams);
                if (res.data.code === 200) {
                  this.isFromRepeat = false;
                  this.queryRuleSet(addRecordParam.targetName, addRecordParam.tradeId);
                }
              } catch (err) {}
            }
          }
        }
      }
      // console.log(this.sceneManageData, 'sceneManageData');
    },
    // 查询当前复用的那条规则集
    async queryRuleSet (ruleSetName, ruleSetTransactionTypeId) {
      let queryParams = {
        startIndex: 1,
        pageSize: 1000,
        setName: ruleSetName,
        organizationId: '',
        appId: '',
        transactionTypeId: ruleSetTransactionTypeId,
        matchingModel: ''
      };
      try {
        const res = await dataService.queryRuleSetInfo(queryParams);
        if (res.data.code === 200) {
          let currentRuleSet = res.data.data.list[0];
          let editRuleSetParams = {
            id: currentRuleSet.id,
            setNo: currentRuleSet.setNo,
            setName: currentRuleSet.setName,
            organizationId: currentRuleSet.organizationId,
            appId: currentRuleSet.appId + ',' + this.appId,
            transactionTypeId: currentRuleSet.transactionTypeId,
            machingModel: currentRuleSet.machingModel,
            riskThkreshold: currentRuleSet.riskThreshold,
            version: parseInt(currentRuleSet.version / 1)
          };
          this.modifyRepeatRuleSet(editRuleSetParams);
        }
      } catch (err) {}
    },
    // 修改复用的规则集
    async modifyRepeatRuleSet (editRuleSetParams) {
      try {
        const res = await dataService.modifyCurrentSet(editRuleSetParams);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '复用成功';
          this.snackbarServeColor = 'success';
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = '复用失败';
          this.snackbarServeColor = 'error';
        }
      } catch (err) {}
    },
    statesChange ($event, item) {
      if (!$event) return;
      this.constMenu(item, $event);
    },
    // 列表中开关按钮事件
    async constMenu (item, states) {
      let queryParam = {
        id: item.id,
        states: states
      };
      try {
        const res = await dataService.editScenesState(queryParam);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '修改成功';
          this.snackbarServeColor = 'success';
          this.getDataList(this.currentPage);
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    isStat (data, index) {
      this.isStatValue = data;
      this.isSwitchChange = true;
    },
    async queryParams () {
      this.addAndEditFormData[0].autocompleteOptions = [];
      this.addAndEditFormData[2].options = [];
      try {
        const res = await dataService.queryParams({ appId: this.appId });
        if (res.data.code === 200) {
          let strategyTypeData = res.data.data.strategyType; // 策略类型
          let tradeTypeData = res.data.data.tradeType; // 交易类型
          strategyTypeData.forEach((item, index, ary) => {
            this.addAndEditFormData[2].options.push({
              selectText: item.strategyTypeName,
              selectField: item.strategyTypeNo
            });
            // 查询条件中的策略类型选项
            this.strategyTypeItems.push({
              selectText: item.strategyTypeName,
              selectField: item.strategyTypeNo
            });
            // 编辑时候需要传入的策略类型选项
            this.allStrategyTypeItems.push({
              selectText: item.strategyTypeName,
              selectField: item.strategyTypeNo
            });
          });
          this.strategyTypeItems.unshift({ selectText: '全部策略类型', selectField: 'all' });

          tradeTypeData.forEach((item, index, ary) => {
            this.addAndEditFormData[0].autocompleteOptions.push({
              selectText: item.tradeName,
              selectField: item.id
            });
            this.allTradeTypeitems.push({
              selectText: item.tradeName,
              selectField: item.id
            });
          });
        }
      } catch (err) {}
    },
    // 点击添加按钮
    AddScene () {
      this.addOrEditHeader = {
        name: '添加场景',
        value: 'add',
        isEdit: false
      };
      this.dialog = true;
      this.flag = 1;
    },
    onChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看场景',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑场景',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 点击编辑按钮
    editScene (item) {
      this.editId = item.id;
      this.historyId = item.historyId;
      this.strategyId = item.strategyId;
      this.dialog = true;
      this.flag = 2;
      this.addOrEditHeader = {
        name: '查看场景',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        {
          label: '交易类型',
          value: item.tradeId,
          required: true,
          rules: [v => !!v || NO_EMPTY_SPACE_ALLOWED],
          type: 'autocomplete',
          selectText: 'selectText',
          selectField: 'selectField',
          autocompleteOptions: this.allTradeTypeitems
        },
        { label: '交易场景标识',
          value: item.scenesNo,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || NO_SCENE_NO,
            v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || BASE_LENGTH_TEXT
          ] },
        {
          label: '策略类型',
          value: item.strategyType,
          required: true,
          rules: [v => !!v || NO_EMPTY_SPACE_ALLOWED],
          type: 'select',
          selectText: 'selectText',
          selectField: 'selectField',
          options: this.allStrategyTypeItems
        }
      ];
    },
    // 添加时的保存按钮
    async confirmAddParam (params) {
      let queryParam = {
        tradeTypeId: '',
        scenesNo: '',
        strategyType: '',
        appId: this.appId
      };
      let existSceneNoParam = {
        appId: this.appId,
        scenesNo: ''
      };
      params[0].forEach((item, index, ary) => {
        queryParam.tradeTypeId = ary[0].value;
        queryParam.scenesNo = ary[1].value;
        queryParam.strategyType = ary[2].value;
        existSceneNoParam.scenesNo = ary[1].value;
      });

      // 第一步先查询交易场景标识是否已存在
      const response = await dataService.existSceneNo(existSceneNoParam);
      if (response.data.data === 0) {
        const res = await dataService.insertScene(queryParam);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          // this.getDataList();
          this.getDataList(this.currentPage);
        }
      } else if (response.data.data > 0) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '交易场景标识已存在';
        this.snackbarServeColor = 'error';
      }
      params[1].reset(); // 重置表单
    },
    // 编辑时的保存按钮
    async confirmEditParam (params) {
      let queryParam = {
        id: this.editId,
        tradeTypeId: '',
        scenesNo: '',
        strategyType: '',
        appId: this.appId,
        strategyID: this.strategyId,
        historyId: this.historyId
      };
      params[0].forEach((item, index, ary) => {
        queryParam.tradeTypeId = ary[0].value;
        queryParam.scenesNo = ary[1].value;
        queryParam.strategyType = ary[2].value;
      });
      const res = await dataService.editScene(queryParam);
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = res.data.msg;
        this.snackbarServeColor = 'success';
        this.getDataList(this.currentPage);
      }
      params[1].reset(); // 重置表单
    },
    // 新增编辑弹窗的取消按钮
    cancel (form) {
      this.dialog = false;
      form.reset();
    },
    // 新增编辑弹窗的确定按钮
    save (paramData) {
      this.dialog = false;
      let params = paramData;
      if (this.flag === 1) {
        this.confirmAddParam(params);
      } else if (this.flag === 2) {
        this.confirmEditParam(params);
      }
    },
    // 点击删除按钮
    doDeteleParam (item) {
      this.dialogDel = true;
      this.delParam = item;
      this.confirmDelFun = this.confirmDelParam;
      this.sourceId = item.id;
    },
    // 删除弹窗确定
    async confirmDelParam () {
      try {
        const res = await dataService.deleteScene({ id: this.delParam.id });
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '删除成功';
          this.snackbarServeColor = 'success';
          // console.log(this.delParam.id,'this.delParam.id');
          // 删除记录的时候，同时删除该条记录的引用
          this.delRecord({ targetId: this.delParam.id, // 引用id
            targetType: 'SCENE' // 引用类型
          });
          this.getDataList(this.currentPage);
          // if (this.delParam.targetName) {
          //   const response = await dataService.queryIsrecord({
          //     sourceId: this.delParam.targetId,
          //     sourceType: 'RULE_SET'
          //   });
          //   if (response.data.code === 200) {
          //     if (response.data.data.refList.length > 0) {
          //       this.delRecord({
          //         targetId : this.delParam.id, //引用id
          //         targetType : 'SCENE' //引用类型
          //       }); // 删除记录的时候，同时删除该条记录的引用
          //       // this.delRecord(this.delParam);
          //     }
          //   }
          // }
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
      this.dialogDel = false;
    },
    // 删除场景的时候，同时删除引用记录
    async delRecord (params) {
      let param = {
        // sourceId: params.targetId, // 对应被引用的规则集的id
        // sourceType: 'RULE_SET',
        targetType: 'SCENE',
        //  targetId: params.id,
        targetId: params.targetId // 对应当前这一条场景的id
        // sourceVersion: Number(params.targetVersion) || null
      };
      let delParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await dataService.delrecord(delParams);
      } catch (err) {}
    },
    // 点击复用
    async repeatUse () {
      this.originAppinfo = [];
      try {
        const res = await dataService.queryAppinfo({ appId: this.appId });
        if (res.data.code === 200) {
          let appinfoData = res.data.data;
          appinfoData.forEach((item, index, ary) => {
            this.originAppinfo.push({
              selectText: item.appname,
              selectField: item.appid
            });
          });
        }
      } catch (err) {}
      this.repeatUseDialog = true;
    },
    async repeatUseSave () {
      this.targetId = this.$options.filters.conversionTargetId(this.repeatForm.tradeType, this.originTradeTypeItems);
      let repeatTeradeId = this.$options.filters.conversionTradeId(this.repeatForm.tradeType, this.originTradeTypeItems);
      let param = {
        tradeTypeId: repeatTeradeId,
        scenesNo: this.repeatForm.sceneNo,
        strategyType: '0',
        appId: this.appId,
        targetId: this.targetId,
        targetVersion: this.repeatForm.targetVersion
      };
      let examineNoParam = {
        appId: this.appId,
        scenesNo: this.repeatForm.sceneNo
      };
      try {
        const response = await dataService.existSceneNo(examineNoParam); // 判断标识是否重复
        if (response.data.data === 0) {
          const res = await dataService.insertScene(param);
          if (res.data.code === 200) {
            this.isFromRepeat = true;
            this.getDataList(this.currentPage);
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = '复用失败';
            this.snackbarServeColor = 'error';
          }
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = '交易场景标识已存在';
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
      this.repeatUseDialog = false;
      this.$refs.repeatForm.reset();
    },
    repeatUseCancel () {
      this.repeatUseDialog = false;
      this.$refs.repeatForm.reset();
    },
    async changeApp (param) {
      this.originTradeTypeItems = [];
      let params = {
        appId: param,
        currentAppId: this.appId
      };
      try {
        const res = await dataService.copyOriginAppInfo(params);
        let typeData = res.data.data;
        typeData.forEach((item, index, ary) => {
          this.originTradeTypeItems.push({
            selectText: item.tradeName,
            selectField: item.id,
            tradeId: item.tradeId,
            sceneNo: item.scenesNo,
            targetId: item.targetId,
            targetVersion: item.targetVersion
          });
        });
      } catch (err) {}
    },
    async changeTradeType (param) {
      this.repeatForm.sceneNo = this.$options.filters.conversionSceneNo(param, this.originTradeTypeItems);
      this.repeatForm.targetVersion = this.$options.filters.conversVersion(param, this.originTradeTypeItems);
      let params = {
        appId: this.appId,
        scenesNo: this.repeatForm.sceneNo
      };
      try {
        const res = await dataService.existSceneNo(params);
        if (res.data.data > 0) {
          this.isNeedEdit = false;
          this.repeatForm.sceneNo = '';
        } else {
          this.isNeedEdit = true;
        }
      } catch (err) {}
    },
    // 策略编辑按钮
    async editStrategy (item) {
      if (item.strategyType === '1') { // 如果策略类型是决策流，不能编辑，因为目前只有规则集
        this.snackbar = true;
      } else {
        this.$router.push('/sceneStrategy');
        this.toSecondRouterPage(item);
      }
    },
    async addRecord (quoteId) { // 添加引用记录
      let param = {
        sourceId: quoteId, // 对应被引用的规则集的id
        sourceType: 'RULE_SET',
        targetType: 'SCENE',
        targetId: this.sourceId, // 对应当前这一条场景的id
        sourceVersion: this.$options.filters.conversionStrategyType(this.strategySelectForm.strategyVersion, this.strategyVersionItems)
      };
      let addParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await dataService.addRecord(addParams);
      } catch (err) {}
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
    dateChange () {
      if (this.searchForm.dates.length === 2) {
        this.isdateShow = false;
      }
    },
    // 更新时间的弹框
    updateChange () {
      if (this.searchForm.updates.length === 2) {
        this.isUpdateShow = false;
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
    ...mapActions([
      'toSecondRouterPage'
    ])
  }
};
</script>
<style lang="stylus" scoped>
.com-tempParam-lib >>> .v-data-table-header > tr > th:nth-child(6) {
  text-align: center !important;
}
.com-tempParam-lib >>> .v-expansion-panel-content__wrap {
  padding-bottom: 0;
}
.com-tempParam-lib .btn {
  margin-bottom: 20px;
}
.com-tempParam-lib .left-btn {
  margin-right: 20px;
}
.com-tempParam-lib .btn {
  text-align: left;
}
.operatedRuleSet p {
  padding-top: 8px;
}
.operatedRuleSet-select p {
  padding-top: 16px;
}
.ruleSetAddOrEdit >>> .v-input__control {
  height: auto !important;
}
.ruleSetAddOrEdit .col {
  padding: 0 !important;
}
</style>
