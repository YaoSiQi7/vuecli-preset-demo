<template>
  <div class="enu-content">
    <v-row>
      <v-col :cols="3" class="py-0 fill-height">
         <v-card class="elevation-3">
           <v-card-text class="pa-0" :style="{height: tableHeight + 64 + 'px', 'overflow-y': 'auto'}">
          <tree-view
            ref="treeView"
            :items="tempGroupItems"
            :isTop="isTopShow"
            :isFirstLineSelected='isFirstLineSelected'
            :isFirstLineOpened="isFirstLineOpened"
            :openOnClick="openOnClick"
            :itemText="itemText"
            :isEnd="isEnd"
            :deletePowerBtn="deleteRuleGroupBtn"
            @edits="doEditGroup"
            @removes="doDeleteGroup"
            @getList="clickNode($event)"
          ></tree-view>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0" style="height:60px;">
            <v-btn text large color="primary" style="width:100%" @click="doAddGroup" v-if="hasPermission(addRuleGroupBtn)">添加分组</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <!-- temp -->
      <v-col :cols="9" class="py-0 pl-0">
        <v-card class="elevation-3">
          <v-data-table
            :headers="tempHeader"
            :items="tempItems"
            hide-default-footer
            no-results-text="没有匹配的数据"
            :items-per-page='1000'
            :height="tableHeight"
            :fixed-header="true"
          >
            <template v-slot:top>
            <v-row style="align-items: center;height: 64px;">
              <v-col class="mb-0 py-0">
                <v-card-title md="6" lg='3' sm='6' class="pt-3">
                  <v-text-field
                    v-model="searchTemp"
                    placeholder="请输入条件搜索"
                    append-icon="mdi-magnify"
                    outlined
                    dense
                    @keyup="inputSearch"
                  ></v-text-field>
                </v-card-title>
                  </v-col>
                <v-spacer></v-spacer>
                 <v-col md="3" class="mb-0 py-0">
                <v-card-title class="pt-3">
                  <v-btn color="primary" @click="doAddTemp()" v-if="hasPermission(addRuleTempBtn)">添加模板</v-btn>
                </v-card-title>
             </v-col>
              </v-row>
            </template>
            <template v-slot:item.fieldName="{ item }">
              <span :title="`${item.fieldName}`">{{ item.fieldName | ellipsis(10) }}</span>
            </template>
            <template v-slot:item.fieldField="{ item }">
              <span :title="`${item.fieldField}`">{{ item.fieldField | ellipsis(10) }}</span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    v-on="on"
                    color="primary"
                    v-if="item.isInternal !== '1'"
                    @click="doEditTemp(item)"
                  >mdi-pencil</v-icon>
                </template>
                <span>编辑</span>
              </v-tooltip>
              <v-tooltip bottom v-if="hasPermission(deleteRuleTempBtn)">
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    v-on="on"
                    color="primary"
                    v-if="item.isInternal !== '1'"
                    @click="doDelTemp(item)"
                  >mdi-delete</v-icon>
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
    <!--模板分组新增编辑和模板新增 -->
    <base-create
      :isCanEdit='isFieldCanDelOrEdit'
      :formHeader="baseCreateHeader"
      :crudFormDialog="baseCreateDialog"
      :formData="baseCreateForm"
      :baseCteateEditPowerBtn="editRuleGroupBtn"
      @cancelCrudFormDialog="baseCreatCancel($event)"
      @confimDialogSave="baseCreatSave"
      @switchOnChange="changeSwitchStatus"
    ></base-create>
    <!-- 删除的弹窗 -->
    <del-dialog
      :isDialogShow="dialogDel"
      @cancelDel="cancelDel($event)"
      @confimDel="conformDel($event)"
    ></del-dialog>
    <!-- 模板编辑的弹窗 -->
    <v-row justify="center">
      <v-dialog v-model="tempEditDialog" persistent scrollable width="978px" style="height:853px">
        <v-card>
          <v-card-title>
            <!-- 查看模式 -->
            <v-toolbar-title v-if="isReview">模板详情</v-toolbar-title>
            <!-- 编辑模式 -->
            <v-toolbar-title v-else>模板编辑</v-toolbar-title>
            <div class="flex-grow-1"/>
            <v-btn icon dark @click="cancelTempEdit">
              <v-icon color="#CCCCCC">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pl-0 tempBaseInfo pb-0">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container class="pb-0">
              <v-list class="py-0">
                <v-subheader>
                  <div class="tempEditTitle">模板基本信息</div>
                </v-subheader>
                <div class="toggleView" v-if="hasPermission(editRuleTempBtn)">
                  <v-btn color="primary" @click="toggleView()" v-show="isReview">编辑</v-btn>
                </div>
                <v-list-item class="pl-10">
                  <v-list-item-content class="pb-0">
                    <div v-if="!isReview" class="tempBaseEdit">
                      <div class="group">
                        <span class="name">所属分组：</span>
                        <span class="value">
                          <v-text-field
                            style="disply:inline"
                            v-model.trim="groupName"
                            outlined
                            dense
                            disabled="disabled"
                          />
                        </span>
                      </div>
                      <div class="tempName">
                        <span class="name">模板名称：</span>
                        <span class="value">
                          <v-text-field
                            style="disply:inline"
                            v-model.trim="editTempItem.templateName"
                            :rules="tempNameRules"
                            outlined
                            dense
                          />
                        </span>
                      </div>
                      <div class="tempDesc">
                        <span class="name">模板描述：</span>
                        <span class="value">
                          <v-textarea v-model.trim="editTempItem.description" outlined rows="4" :rules="descRules"></v-textarea>
                        </span>
                      </div>
                    </div>
                    <div v-if="isReview" class="tempBaseReview">
                      <div class="group">
                        <span class="circle"></span>
                        <span class="name">所属分组：</span>
                        <span class="value">{{groupName}}</span>
                      </div>
                      <div class="tempName">
                        <span class="circle"></span>
                        <span class="name">模板名称：</span>
                        <span class="value">{{editTempItem.templateName}}</span>
                      </div>
                      <div class="tempDesc">
                        <span class="circle"></span>
                        <span class="name">模板描述：</span>
                        <span class="value">{{editTempItem.description}}</span>
                      </div>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-container>
            </v-form>
            <v-container class="pt-0">
              <v-list class="pt-0">
                <v-subheader>
                  <div class="tempEditTitle">模板结构</div>
                </v-subheader>
                <v-list-item class="pl-10 pt-0">
                  <v-list-item-content class="pt-0">
                    <div v-if="!isReview" clsaa="TempDetailEdit">
                      <div class="paramItemTitle">
                        <v-row>
                          <v-col :cols="2">
                            <div>参数名</div>
                          </v-col>
                          <v-col :cols="3">
                            <div>参数来源</div>
                          </v-col>
                          <v-col :cols="2">
                            <div>默认值</div>
                          </v-col>
                          <v-col :cols="3">
                            <div>说明</div>
                          </v-col>
                          <v-col :cols="2"></v-col>
                        </v-row>
                      </div>
                      <div class="paramItemContent">
                        <v-row v-for="(paramItem,paramIndex) in tempInfo" :key="paramIndex">
                          <v-col :cols="2">
                            <v-autocomplete
                              outlined
                              dense
                              :items="tempParamList"
                              item-text="paramName"
                              item-value="paramName"
                              v-model="paramItem.paramName"
                              @change="paramNameChange(paramIndex, paramItem)"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col :cols="3">
                             <v-text-field
                              style="disply:inline"
                              v-model="paramItem.srcLibParams"
                              outlined
                              dense
                              placeholder="参数来源"
                              disabled="disabled"
                            />
                          </v-col>
                          <v-col :cols="2">
                            <v-text-field
                              v-model.trim="paramItem.paramDefault"
                              style="disply:inline"
                              outlined
                              dense
                              placeholder="无"
                            />
                          </v-col>
                          <v-col :cols="3">
                            <v-text-field
                              style="disply:inline"
                              v-model.trim="paramItem.description"
                              outlined
                              dense
                            />
                          </v-col>
                          <v-col :cols="2">
                            <v-icon
                              size="30"
                              color="primary"
                              style="height:40px;float:left;  cursor: pointer;"
                              @click="delParamItem(paramItem, paramIndex)"
                            >mdi-delete</v-icon>
                            <v-icon
                              size="30"
                              color="primary"
                              style="height:40px;float:left;  cursor: pointer;"
                              @click="addParamItem(paramItem)"
                            >mdi-plus</v-icon>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                    <div v-if="isReview">
                      <div class="tempParamItems">
                        <div
                          class="tempParamItem"
                          v-for="(item, index) in tempInfo"
                          :key="index"
                        >
                          <span class="circle"></span>
                          <span class="name">{{item.paramName}}:</span>
                          <span class="value">
                            <v-autocomplete
                              v-if="item.showType==='select'"
                              :items="item.valueList"
                              item-text="label"
                              item-value="value"
                              type="text"
                              placeholder="请选择"
                              no-data-text="没有匹配数据"
                              outlined
                              dense
                            />
                            <v-text-field
                              v-if="item.showType==='input'"
                              style="disply:inline"
                              outlined
                              dense
                              label="输入框"
                            />
                          </span>
                          <span class="questionMark">
                            <v-tooltip right >
                              <template v-slot:activator="{ on }">
                                <v-icon
                                  class="mr-1"
                                  color="primary"
                                  v-on="on"
                                  size="20"
                                >mdi-help-circle</v-icon>
                              </template>
                              <span>{{item.description || '无说明'}}</span>
                            </v-tooltip>
                          </span>
                        </div>
                      </div>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-container>
          </v-card-text>
          <v-divider/>
          <v-card-actions>
            <div class="flex-grow-1"/>
            <div>
              <v-btn class="cancelButton mr-4" outlined @click="cancelTempEdit">取消</v-btn>
              <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="confirmTempEdit"
                :disabled="!valid"
                v-if="!isReview"
              >保存</v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
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
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';
import { BASE_NAME, BASE_NAME_TEXT, BASE_LENGTH, BASE_LENGTH_TEXT, MAX_INPUT_LENGTH } from '../../utils/validate.js';
import { getList, addTempGrop, editTempGrop, deteleTempGrop, getRuleTmpListPage, addTmp, deteleTmp, editTmp, getTmpListValue, getTmpPraList, deteleTmpPrm, addAllTmpPrm, ruleUpdateTmpl } from '../../api/ruleTempLib.js';
export default {
  data () {
    return {
      isFieldCanDelOrEdit: true,
      fullHeight: window.innerHeight,
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // ------------树形结构相关变量--------------
      methodItems: [],
      itemText: 'templateGroupName',
      isTopShow: false,
      isEnd: true,
      isFirstLineSelected: true,
      isFirstLineOpened: true,
      openOnClick: false,
      listMethod: [],
      activeNode: null,
      // ------------
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      valid: true,
      lazy: false,
      colorIndex: 0,
      isActive: [true],
      searchGroup: '',
      searchTemp: '',
      // 模板分组头部
      tempGroupHeader: [
        { text: '模板分组', value: 'templateGroupName', sortable: false },
        { text: '操作', value: 'action', sortable: false, width: '16%' }
      ],
      // 模板头部
      tempHeader: [
        { text: '模板', value: 'templateName', sortable: false },
        { text: '描述', value: 'description', sortable: false },
        { text: '操作', value: 'action', sortable: false, width: '16%' }
      ],
      // 模板内容
      tempItems: [],
      // 模板分组内容
      tempGroupItems: [],
      // 当前active的模板分组行的id
      groupId: '',
      // 当前active的模板分组行的name
      groupName: '',
      // 用来区分是分组还是模板 1：分组添加 2分组编辑 3模板添加
      flag: 1,
      // 新增 编辑模板分组和新增模板的form 数据
      baseCreateForm: [],
      // 新增弹窗的显示隐藏
      baseCreateDialog: false,
      // 新增弹窗的头部
      baseCreateHeader: { name: '模板分组', value: 'add', isEdit: false },
      // 删除弹窗
      dialogDel: false,
      // 删除的分组或者模板
      delItem: {},
      // 区分删除分组还是模板 1是分组 2是模板
      delFlag: 1,
      // 编辑模板的弹窗
      tempEditDialog: false,
      // 区分模板弹窗编辑还是查看
      isReview: true,
      editTempItem: {},
      // 模板数据
      tempInfo: [],
      // 模板弹窗数据
      // 参数来源
      psramSource: [
        {
          children: [
            {
              id: '11',
              label: '业务变量库',
              parentId: '11'
            },
            {
              id: '12',
              label: '枚举常量库',
              parentId: '12'
            },
            {
              id: '13',
              label: '系统参数库',
              parentId: '13'
            }
          ],
          id: 1,
          label: '特征库'
        },
        {
          children: [
            {
              id: '21',
              label: '计算函数库',
              parentId: '21'
            },
            {
              id: '22',
              label: '计算方法库',
              parentId: '22'
            }
          ],
          id: 2,
          label: '算子库'
        },
        {
          id: 3,
          label: '自定义'
        }
      ],
      // 删除模板参数ID
      delParamItemId: '',
      // 被删除的模板
      delPAram: {},
      // 业务变量库参数来源回显
      srcLib: '',
      // 模板参数对比数据
      // tmpDp: [],
      // 所有的模板参数
      tempParamList: [],
      descRules: [
        v => {
          if (v) {
            return v.length <= 200 || MAX_INPUT_LENGTH(200);
          }
          return true;
        }
      ],

      // 模板名称校验
      tempNameRules: [
        v => !!v || '模板名称不能为空',
        v => BASE_NAME.test(v) || BASE_NAME_TEXT,
        v => (v && v.length <= BASE_LENGTH) || BASE_LENGTH_TEXT
      ],
      // 按钮权限
      addRuleGroupBtn: '/addRuleTempGroupButton', // 添加分租按钮是否展示
      editRuleGroupBtn: '/editRuleTempGroupButton', // 编辑分组按钮是否显示
      deleteRuleGroupBtn: '/deleteRuleTempGroupButton', // 删除分组按钮是否显示
      addRuleTempBtn: '/addRuleTempButton', // 添加模板按钮
      editRuleTempBtn: '/editRuleTempButton', // 表格编辑模板按钮
      deleteRuleTempBtn: '/deleteRuleTempButton' // 表格删除模板功能
    };
  },
  filters: {
    groupName: function (id, itemList) {
      let groupName;
      itemList.forEach(item => {
        if (item.id === id) {
          groupName = item.tempGroup;
        }
      });
      return groupName;
    }
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 210;
      }
    }
  },
  components: {
    TreeView,
    BaseCreate,
    DelDialog
  },
  created () {
    this.initGetGroupList();
    this._getTmpPraList();
  },
  methods: {
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 树状 点击节点事件
    clickNode (item) {
      this.searchTemp = '';
      this.pageNum = 1;
      this.pageSize = 10;
      // this.colorIndex = i;
      this.groupId = item[0];
      this.tempGroupItems.forEach(element => {
        if (this.groupId === element.id) {
          this.groupName = element.templateGroupName;
        }
      });
      this._getListTmp();
    },
    // 获取模板分组数据
    initGetGroupList () {
      getList().then(res => {
        this.tempGroupItems = res.data.data;
        if (this.colorIndex === 0) {
          this.groupId = res.data.data[this.colorIndex].id;
          this.groupName = res.data.data[this.colorIndex].templateGroupName;
          this._getListTmp();
        }
      });
    },
    inputSearch () { // 右侧列表搜索框查询方法
      this.pageNum = 1;
      this._getListTmp();
    },
    // 获取模板数据
    _getListTmp () {
      let parms = {
        templateGroupId: this.groupId,
        pageIndex: this.pageNum,
        pageSize: this.pageSize,
        templateName: this.searchTemp
      };
      getRuleTmpListPage(parms).then(res => {
        this.tempItems = res.data.data.list;
        this.totalItems = res.data.data.totalElements;
        this.queryPageLength = res.data.data.totalPages;
      });
    },
    // 获取弹窗模板列表
    _getTmpListValue () {
      let parms = {
        templateId: this.editTempItem.id
      };
      getTmpListValue(parms).then(res => {
        this.tempEditDialog = true;
        this.tempInfo = [];
        if (res.data.code === 200) {
          this.tempInfo = res.data.data;
          this.tempParamList.forEach(paramEle => {
            this.tempInfo.forEach(element => {
              if (paramEle.paramName === element.paramName) {
                element.srcLibParams = paramEle.srcLib;
              }
            });
          });
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    _getTmpPraList (list) {
      let parms = {
        pageIndex: 1,
        pageSize: 100000
      };
      getTmpPraList(parms).then(res => {
        this.tempParamList = res.data.data.list;
        // if (this.tempInfo.length === 0) {
        //   this.tempInfo.push({
        //     id: '',
        //     templateId: this.editTempItem.id,
        //     paramName: '',
        //     paramValue: '',
        //     comment: '',
        //     paramDefault: '',
        //     paramSrc: '',
        //     flag: 'fl',
        //     paramList: {
        //       list: this.tmpDp
        //     },
        //     dataType: ''
        //   });
        // }
        // if (list.length > 0) {
        //   this.tempInfo = list;
        //   this.tempInfo.forEach((el, index) => {
        //     this.tmpDp.forEach((e, l) => {
        //       if (el.paramName === e.paramName) {
        //         el.srcLibParams = e.srcLib;
        //         el.paramValue = e.paramValue;
        //         el.dataType = e.dataType;
        //         el.paramSrc = e.paramSrc;
        //       }
        //     });
        //   });
        // }
      });
    },
    // 点击添加模板分组按钮
    doAddGroup () {
      this.flag = 1;
      this.baseCreateHeader = {
        name: '添加模板分组',
        value: 'add',
        isEdit: false
      };
      this.baseCreateForm = [
        {
          label: '模板分组名称*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || '模板分组名称不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= BASE_LENGTH) || BASE_LENGTH_TEXT
          ]
        }
      ];
      this.baseCreateDialog = !this.baseCreateDialog;
    },
    // 点击分组编辑按钮
    doEditGroup (item, index) {
      if (item.isInternal === '1') {
        this.isFieldCanDelOrEdit = false;
      } else {
        this.isFieldCanDelOrEdit = true;
      }
      this.colorIndex = index;
      this.flag = 2;
      this.baseCreateDialog = true;
      this.baseCreateHeader = {
        name: '查看模板分组',
        value: 'edit',
        isEdit: true
      };
      this.baseCreateForm = [
        {
          label: '模板分组名称*',
          value: item.templateGroupName,
          type: 'text',
          required: true,
          rules: [
            v => !!v || '模板分组名称不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= BASE_LENGTH) || BASE_LENGTH_TEXT
          ]
        }
      ];
      this.groupId = item.id;
    },
    // 点击添加模板按钮
    doAddTemp () {
      if (!this.tempGroupItems.length) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '没有选择分组，请先创建分组';
        this.snackbarServeColor = 'error';
        return;
      }
      this.flag = 3;
      this.baseCreateDialog = true;
      this.baseCreateHeader = {
        name: '添加模板',
        value: 'add',
        isEdit: false
      };
      this.baseCreateForm = [
        {
          label: '模板名称*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || '模板名称不能为空',
            v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            v => (v && v.length <= BASE_LENGTH) || BASE_LENGTH_TEXT
          ]
        },
        {
          label: '描述',
          value: '',
          type: 'text',
          required: true,
          rules: this.descRules
        }
      ];
    },
    // baseCreate取消
    baseCreatCancel (paramsData) {
      paramsData.reset();
      this.baseCreateDialog = false;
    },
    // baseCreate保存
    baseCreatSave (paramsData, from) {
      let parms = {};

      if (this.flag === 1) { // 新增分组
        parms = {
          templateGroupName: paramsData[0].value
        };
        this.confirmAddGroup(parms, from);
      } else if (this.flag === 2) { // 编辑分组
        parms = {
          id: this.groupId,
          templateGroupName: paramsData[0].value
        };
        this.confirmEditGroup(parms, from);
      } else {
        parms = {
          templateGroupId: this.groupId,
          templateName: paramsData[0].value,
          description: paramsData[1].value
        };
        this.confirmAddTemp(parms, from);
      }
    },
    // 模板分组新增
    confirmAddGroup (parms, from) {
      addTempGrop(parms).then(res => {
        from.reset();
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.baseCreateDialog = !this.baseCreateDialog;
          this.initGetGroupList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 模板分组编辑
    confirmEditGroup (parms, from) {
      editTempGrop(parms).then(res => {
        from.reset();
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.baseCreateDialog = !this.baseCreateDialog;
          this.initGetGroupList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 模板新增
    confirmAddTemp (parms, from) {
      addTmp(parms).then(res => {
        from.reset();
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.baseCreateDialog = !this.baseCreateDialog;
          this._getListTmp();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 点击模板分组删除按钮
    doDeleteGroup (item) {
      this.dialogDel = true;
      this.delFlag = 1;
      this.delItem = item;
    },
    // 删除分组接口
    _deteleTempGrop () {
      let parms = {
        id: this.delItem.id
      };
      deteleTempGrop(parms).then(res => {
        if (res.data.code === 200) {
          this.dialogDel = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.colorIndex = 0;
          this.initGetGroupList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 删除模板接口
    _deteleTmp () {
      let parms = {
        id: this.delItem.id
      };
      deteleTmp(parms).then(res => {
        if (res.data.code === 200) {
          this.dialogDel = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getListTmp();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 点击模板删除按钮
    doDelTemp (item) {
      this.dialogDel = true;
      this.delFlag = 2;
      this.delItem = item;
    },
    // 删除弹框取消按钮
    cancelDel () {
      this.dialogDel = false;
    },
    // 删除弹框确认按钮
    conformDel () {
      if (this.delFlag === 1) {
        this._deteleTempGrop();
      } else if (this.delFlag === 2) {
        this._deteleTmp();
      } else {
        this._deteleTmpPrm();
      }
    },
    // 点击模板编辑按钮
    doEditTemp (item) {
      this.isReview = true;
      this.editTempItem = Object.assign({}, item);
      this._getTmpListValue(item);
    },
    // 模板编辑弹窗取消按钮
    cancelTempEdit () {
      this.tempEditDialog = false;
    },
    // 模板编辑弹窗确定按钮
    confirmTempEdit () {
      let paramList = [];
      this.tempInfo.forEach(e => {
        paramList.push({
          id: e.id,
          templateId: e.templateId,
          paramName: e.paramName,
          paramDefault: e.paramDefault,
          description: e.description
        });
      });
      let params = {
        data: JSON.stringify(paramList)
      };
      this._addAllTmpPrm(params);
    },
    // 编辑模板接口
    _editTmp (parms) {
      editTmp(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getListTmp();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 点击分组某行
    constMenu (item, i) {
      this.colorIndex = i;
      this.groupId = item.id;
      this.groupName = item.templateGroupName;
      this._getListTmp();
    },
    toggleView () {
      this.isReview = false;
      if (!this.tempInfo.length) {
        this.tempInfo = [{
          id: '',
          templateId: this.editTempItem.id,
          paramName: '',
          description: '',
          paramDefault: '',
          srcLibParams: ''
        }];
      }
    },
    delParamItem (item, index) {
      this.delFlag = 3;
      if (!this.tempInfo[index].id) {
        this.tempInfo.splice(index, 1);
      } else {
        this.delParamItemId = item.id;
        this.dialogDel = true;
      }
    },
    // 删除模板接口
    _deteleTmpPrm () {
      let parms = {
        id: this.delParamItemId,
        templateId: this.editTempItem.id
      };
      deteleTmpPrm(parms).then(res => {
        this.dialogDel = false;
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getTmpListValue();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
        this.dialogDel = false;
      });
    },
    addParamItem (item) {
      // if (this.tmpInfocc.length === 0) {
      //   this.tempInfo.push({
      //     id: '',
      //     templateId: this.editTempItem.id,
      //     paramName: '',
      //     paramValue: '',
      //     comment: '',
      //     paramDefault: '',
      //     paramSrc: '',
      //     flag: 'fl',
      //     paramList: {
      //       list: this.tmpDp
      //     },
      //     dataType: ''
      //   });
      // } else {
      this.tempInfo.push({
        id: '',
        templateId: this.editTempItem.id,
        paramName: '',
        description: '',
        paramDefault: '',
        srcLibParams: ''

      });
      // }
    },
    // 参数名称change事件
    paramNameChange (index, item) {
      this.tempParamList.forEach((e) => {
        if (item.paramName === e.paramName) {
          item.srcLibParams = e.srcLib;
        }
      });
    },
    // 编辑模板
    _editTmp_ () {
      let parms = {
        tmplGroupId: this.groupId,
        id: this.editTempItem.id,
        tempName: this.editTempItemc.tempName,
        comment: this.editTempItemc.comment
      };
      this._editTmp(parms);
    },
    // 编辑规则模版基本信息更新保存接口
    async ruleUpdateTmpl () {
      let params = {
        templateGroupId: this.groupId,
        id: this.editTempItem.id,
        templateName: this.editTempItem.templateName,
        description: this.editTempItem.description
      };
      let { data } = await ruleUpdateTmpl(params);
      if (data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = data.msg;
        this.snackbarServeColor = 'success';
        this._getListTmp();
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = data.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 批量添加模板参数库来源
    _addAllTmpPrm (parms) {
      addAllTmpPrm(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.tempEditDialog = !this.tempEditDialog;
          // this._editTmp_();
          this.ruleUpdateTmpl();// 规则模版基本信息保存
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
        this.tempEditDialog = !this.tempEditDialog;
      });
    },
    // 新增编辑弹窗 修改编辑查看状态的switch修改事件
    changeSwitchStatus (e) {
      if (e === false) {
        this.baseCreateHeader = {
          name: '查看模板分组',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.baseCreateHeader = {
          name: '编辑模板分组',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this._getListTmp();
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this._getListTmp();
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
.icon-primary {
  color: var(--v-primary-base) !important;
}
.el-tr-defu:hover {
  background: var(--v-tableRowHoverActive-base);
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
.tempBaseReview > div {
  display: flex;
  margin-bottom: 0;
}
.tempEditTitle {
  font-weight: bold;
  color: #333333;
}
.name {
  display: inline-block;
  min-width: 120px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.value {
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
.tempBaseInfo .value {
  display: inline-block;
  width: 50%;
  min-height: 40px;
  margin-left: 20px;
}
.tempDetail .value {
  display: inline-block;
  width: 50%;
  height: 40px;
  margin-left: 20px;
}
.tempParamItem {
  margin-top: 15px;
}
.questionMark {
  margin-left: 16px;
  cursor: pointer;
}
.toggleView {
  position: absolute;
  right: 20px;
  top: 20px;
}
.tempBaseInfo {
  position: relative;
}
.tempBaseEdit > div {
  margin-bottom: 15px;
}
.paramItemTitle div {
  text-align: center;
}

.tempDetail .v-list {
  min-height: 300px;
}
.v-list-item__content {
  overflow: inherit;
}
.vue-treeselect__control {
  height: 40px;
}
</style>
