<template>
  <div>
    <base-search
      :fieldList="searchParam"
      @search="search($event)"
      @reset="resetSearchData($event)"
    ></base-search>
    <v-data-table
      :headers="riskLogheaders"
      :items="riskLogItems"
      no-data-text="没有匹配数据"
      :items-per-page="20"
      hide-default-footer
    >
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar
          flat
          height="60px"
        >
          <v-toolbar-title style="font-size:18px">
            风控日志配置
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
            @click="addConfig"
          >
            添加
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.type="{ item }">
        {{ item.type | filterLogType }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:footer>
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
              @change="onPageSizeChange"
            />
            </span>条
            <span style="margin-left:15px">共{{ totalItems }}条</span>
            <v-spacer/>
            <v-pagination
              class="d-flex justify-end pagination"
              v-model="pageNum"
              :length="queryPageLength"
              @input="onPageChange"
            />
          </div>
        </div>
      </template>
    </v-data-table>
    <!-- 点击新建/编辑后, 使用stepper的按步骤配置弹窗 -->
    <v-dialog v-model="addEditDialog" persistent scrollable>
      <v-card outlined>
        <v-card-title>
          <v-toolbar-title>设定参数</v-toolbar-title>
          <div class="flex-grow-1"/>
          <v-btn icon @click="cancelConfig">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-stepper v-model="stepper" style="height:90%">
              <v-stepper-header>
                <v-stepper-step :complete="stepper > 1" step="1">设定参数</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="stepper > 2" step="2">选择字段</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="stepper > 3" step="3">添加筛选</v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step :complete="stepper > 4" step="4">配置详情</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <!-- 新建/编辑一条配置 -->
                <v-stepper-content step="1" class="elevation-0">
                  <v-card class="ma-2" outlined style="height: 50vh">
                    <v-card-title>
                      <v-toolbar-title>{{ addOrEditHeader.name }}</v-toolbar-title>
                      <div class="flex-grow-1"/>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-form ref="configForm">
                      <v-card-text>
                        <!-- 新建模式 -->
                        <v-container v-if="addOrEditHeader.isEdit !== true">
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="configName"
                                label="配置名称"
                                dense
                                outlined
                                :required="true"
                                class=""
                                v-model.trim="moduleForm.moduleName"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="configDesc"
                                label="配置描述"
                                dense
                                outlined
                                :required="true"
                                v-model.trim="moduleForm.description"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-select
                                :items="appList"
                                label="应用名称"
                                dense
                                outlined
                                v-model="moduleForm.appId"
                                @change="appListChanged(moduleForm.appId)"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="appId"
                                label="应用标识"
                                dense
                                outlined
                                disabled
                                :required="true"
                                v-model.trim="moduleForm.appNo"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-select
                                name="dataType"
                                :items="dataTypeList"
                                label="数据类型"
                                dense
                                outlined
                                v-model="moduleForm.type"
                                item-disabled="disable"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                        <!-- 编辑模式 -->
                        <v-container v-else>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="configName"
                                label="配置名称"
                                dense
                                outlined
                                :required="true"
                                class=""
                                v-model.trim="moduleForm.moduleName"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="configName"
                                label="配置id"
                                dense
                                outlined
                                :required="true"
                                class=""
                                disabled
                                v-model.trim="moduleForm.moduleNo"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="configDesc"
                                label="配置描述"
                                dense
                                outlined
                                :required="true"
                                v-model.trim="moduleForm.description"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-select
                                :items="appList"
                                label="应用名称"
                                dense
                                outlined
                                v-model="moduleForm.addId"
                                @change="appListChanged(moduleForm.addId)"
                              ></v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-text-field
                                name="appId"
                                label="应用标识"
                                dense
                                outlined
                                disabled
                                :required="true"
                                v-model.trim="moduleForm.appNo"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col md="4" sm="4" offset="4" sm-offset="1" align-self="center">
                              <v-select
                                name="dataType"
                                :items="dataTypeList"
                                label="数据类型"
                                dense
                                outlined
                                disabled
                                v-model="moduleForm.type"
                              ></v-select>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </v-form>
                  </v-card>
                  <v-btn
                    color="primary"
                    @click="stepper = 2"
                  >
                    下一步
                  </v-btn>
                </v-stepper-content>
                <!-- 配置表头字段 -->
                <v-stepper-content step="2">
                  <v-card class="elevation-0" style="height: 50vh">
                    <v-row>
                      <v-col cols="5">
                        <Transfer
                          filterable
                          :data="configurableFieldList"
                          :target-keys="targetKeys"
                          :render-format="render"
                          @on-change="handleTransfer"
                          :list-style="transferStyleObj"
                          :titles="fieldConfigHeader">
                        </Transfer>
                      </v-col>
                      <v-col cols="7">
                        <v-row>
                          <v-col cols="3" v-for="(item, index) in computedSearchFieldItems" :key="index">
                            <v-text-field
                              v-if="item.filterType === 'text'"
                              flat dense solo outlined disabled
                              :label="item.fieldName"
                              v-model="item.filterType"
                            ></v-text-field>
                            <v-select
                              v-if="item.filterType === 'select'"
                              flat dense solo outlined disabled
                              :label="item.fieldName"
                              v-model="item.filterType"
                            ></v-select>
                            <v-select
                              v-if="item.filterType === 'multiple'"
                              dense outlined disabled
                              :label="item.fieldName"
                              v-model="item.filterType"
                            ></v-select>
                            <span class="baseSectionDisplay" v-if="item.filterType === 'range'">
                              <span class="baseSectionDisplay">
                                {{ item.cnName }}
                              </span>
                              <span class="baseSection40 baseSectionDisplay">
                                <v-text-field
                                  placeholder="最小值"
                                  outlined dense disabled
                                ></v-text-field>
                              </span>
                              <span class="baseSection20 baseSectionDisplay baseSectionCenter ml-2 mr-2">
                                <div class="ml-2 mr-2">至</div>
                              </span>
                              <span class="baseSection40 baseSectionDisplay ml-2">
                                <v-text-field
                                  placeholder="最大值"
                                  outlined dense disabled
                                ></v-text-field>
                              </span>
                            </span>
                            <v-text-field
                              v-if="item.filterType === 'Date'"
                              v-model="item.filterType"
                              flat dense solo outlined disabled
                              :label="item.fieldName"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-data-table
                              :headers="previewHeader"
                              hide-default-footer
                              class="elevation-1"
                              no-data-text="预览表头排列"
                            ></v-data-table>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card>

                  <v-btn
                    color="primary"
                    @click="stepper = 3"
                  >
                    下一步
                  </v-btn>

                  <v-btn text @click="stepper -= 1">上一步</v-btn>
                </v-stepper-content>
                <!-- 配置筛选条件 -->
                <v-stepper-content step="3">
                  <v-card class="elevation-0" style="height: 50vh">
                    <v-row>
                      <v-col cols="5">
                        <v-data-table
                          :headers="searchFieldHeader"
                          :items="computedSearchFieldItems"
                          :search="searchField"
                          :calculate-widths="true"
                        >
                          <template v-slot:top>
                            <v-card-title>
                              <v-text-field
                                  v-model="searchField"
                                  placeholder="请输入条件搜索"
                                  append-icon="mdi-magnify"
                                  outlined
                                  dense
                                ></v-text-field>
                              </v-card-title>
                              <v-spacer></v-spacer>
                          </template>
                          <template v-slot:item.fieldName="{ item }">
                            <td>{{ item.fieldName }}</td>
                          </template>
                          <template v-slot:item.filterType="{ item }">
                            <v-select
                              :items="filterTypeItems"
                              v-model="item.filterType"
                              item-text="name"
                              item-value="value"
                              outlined
                              dense
                            ></v-select>
                          </template>
                          <template v-slot:item.validType="{ item }">
                            <v-select
                              :items="validTypeItems"
                              v-model="item.validType"
                              item-text="name"
                              item-value="value"
                              outlined
                              dense
                            ></v-select>
                          </template>
                        </v-data-table>
                      </v-col>
                      <v-col cols="7">
                        <v-row>
                          <v-col cols="3" v-for="(item, index) in computedSearchFieldItems" :key="index">
                            <v-text-field
                              v-model="item.filterType"
                              v-if="item.filterType === 'text'"
                              flat dense solo outlined disabled
                              :label="item.fieldName"
                            ></v-text-field>
                            <v-select
                              v-model="item.filterType"
                              v-if="item.filterType === 'select'"
                              flat dense solo outlined disabled
                              :label="item.fieldName"
                            ></v-select>
                            <v-select
                              v-model="item.filterType"
                              v-if="item.filterType === 'multiple'"
                              dense outlined disabled
                              :label="item.fieldName"
                            ></v-select>
                            <span class="baseSectionDisplay" v-if="item.filterType === 'range'">
                              <span class="baseSectionDisplay">
                                {{ item.cnName }}
                              </span>
                              <span class="baseSection40 baseSectionDisplay">
                                <v-text-field
                                  placeholder="最小值"
                                  outlined dense disabled
                                  class=""
                                ></v-text-field>
                              </span>
                              <span class="baseSection20 baseSectionDisplay baseSectionCenter mr-2">
                                <div class="ml-3 mr-3">至</div>
                              </span>
                              <span class="baseSection40 baseSectionDisplay ml-2">
                                <v-text-field
                                  placeholder="最大值"
                                  outlined dense disabled
                                ></v-text-field>
                              </span>
                            </span>
                            <v-text-field
                              v-if="item.filterType === 'Date'"
                              v-model="item.filterType"
                              flat dense solo outlined disabled
                              :label="item.fieldName"
                            >
                            </v-text-field>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                            <v-data-table
                              :headers="previewHeader"
                              hide-default-footer
                              class="elevation-1"
                              no-data-text="预览表头排列"
                            ></v-data-table>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card>

                  <v-btn
                    color="primary"
                    @click="stepper = 4"
                  >
                    下一步
                  </v-btn>

                  <v-btn text @click="stepper -= 1">上一步</v-btn>
                </v-stepper-content>
                <!-- 配置预览分组 -->
                <v-stepper-content step="4">
                  <v-card class="elevation-0">
                    <v-row>
                      <v-col cols="5">
                        <v-data-table
                          :headers="detailPreviewHeader"
                          :items="detailPreviewItems"
                          no-results-text="没有匹配数据"
                          :items-per-page="1000"
                          hide-default-footer
                        >
                          <template v-slot:top>
                            <v-toolbar flat>
                              <v-text-field
                                v-model="previewHeaderSearchField"
                                placeholder="请输入条件搜索"
                                append-icon="mdi-magnify"
                                outlined dense
                              ></v-text-field>
                              <v-spacer></v-spacer>
                              <v-card-title>
                                <v-btn
                                  color="primary"
                                  class="ma-2"
                                  @click="createNewDetailGroup"
                                  >新建</v-btn>
                                <v-btn
                                  color="primary"
                                  class="ma-2"
                                  @click="previewRiskLogDetail"
                                >预览</v-btn>
                              </v-card-title>
                            </v-toolbar>
                          </template>
                          <template v-slot:body="{ items }">
                            <tr v-for="(item, index) in items"
                              :key="index"
                              class="el-tr-defu"
                              @click="getCurrentGroupPreviewItems(item, index)">
                              <td class="el-border-defu">
                                {{ item.groupName }}
                              </td>
                              <td class="el-border-defu">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-icon
                                      small
                                      class="mr-1 icon-primary"
                                      v-on="on"
                                      color="primary"
                                      @click="editGroupInfo(item, index)"
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
                                      @click="deleteGroupInfo(item, index)"
                                    >mdi-delete</v-icon>
                                  </template>
                                  <span>删除</span>
                                </v-tooltip>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-col>
                      <v-col cols="7" v-show="currentPreviewItem">
                        <Transfer
                          filterable
                          :data="configurableFieldList"
                          :target-keys="detailGroupTargetKeys"
                          @on-change="handleGroupTransfer"
                          :list-style="transferStyleObj"
                          :titles="groupTransferTitles">
                        </Transfer>
                      </v-col>
                    </v-row>
                  </v-card>

                  <v-btn color="primary" @click="saveConfigAll">完成</v-btn>
                  <v-btn text @click="stepper -= 1">上一步</v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <del-dialog :isDialogShow="delDialogSwitch" @cancelDel="delDialogCancel" @confimDel="delDialogConfirm"></del-dialog>
    <base-create
      :formHeader='baseAddOrEditHeader'
      :crudFormDialog='crudDialogSwitch'
      :formData='baseAddOrEditFormData'
      @cancelCrudFormDialog='cancelBaseEdit($event)'
      @confimDialogSave='baseAddOrEditSave($event)'
      @switchOnChange="addOrEditFormSwitch"></base-create>
    <base-details :detailsDialog='detailsDialog' :hitRule='detailsHitRule' :oplogDetail='oplogDetail' @cancleDetailsDialog='detailsCancel'></base-details>
  </div>
</template>

<script>
import BaseCreate from '@/components/BaseCreate';
import BaseSearch from '@/components/BaseSearch';
import BaseDetails from '@/components/BaseRiskLogDetails';
import DelDialog from '@/components/DelDialog';
import * as dataService from '@/api/riskLogConfig';
import { Transfer } from 'view-design';
import { BASE_NAME, BASE_VALUE, BASE_NAME_TEXT, BASE_VALUE_TEXT } from '../../../utils/validate.js';
export default {
  name: 'riskLogConfig',
  components: {
    BaseSearch,
    BaseCreate,
    BaseDetails,
    Transfer,
    DelDialog
  },
  data () {
    return {
      currentDelMode: '', // 删除模式, 用于判断是删除module还是分组
      moduleId: '', // 当前记录的id
      selectedRiskLogApp: '',
      selectedRiskLogType: '',
      disabledDataTypeList: [], // 动账, 非动账禁用列表
      apiAddress: {
        add: '/xin/field/name',
        edit: '/xin/field/name/edit'
      },
      name: 'risk log config',
      addEditDialog: false,
      stepper: 1,
      searchField: '', // 第三步表头的搜索
      date: null, // 第三步 日期组件需要的变量
      previewHeaderSearchField: '', // 配置详情表头的搜索
      delDialogSwitch: false, // 删除弹窗开关
      currentPreviewItem: null, // 当前分组id
      currentPreviewItemIndex: null, // 当前分组id index
      detailsDialog: false, // 查看详情预览弹窗
      detailsHitRule: {
        simulatedResult: {
          matchType: '',
          hit_labels: '',
          strategy: '',
          hit_rules: [
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            },
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            },
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            }
          ]
        },
        officialResult: {
          matchType: '',
          hit_labels: '',
          strategy: '',
          hit_rules: [
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            },
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            },
            {
              rule_score: '',
              rule_name: '',
              rule_no: ''
            }
          ]
        }
      }, // 左侧的风险策略列表 - 纯展示无用
      detailsOplogDetail: [], // 预览用的配置分组列表
      fieldConfigHeader: ['风控日志数据源', '风控日志数据源'], // 选择字段时的穿梭框表头
      riskLogheaders: [
        {
          text: '配置名称',
          align: 'left',
          sortable: false,
          value: 'moduleName'
        },
        { text: '配置标识', value: 'moduleNo' },
        { text: '配置描述', value: 'description' },
        { text: '应用名称', value: 'appName' },
        { text: '应用标识', value: 'appId' },
        { text: '数据类型', value: 'type' },
        { text: '创建时间', value: 'createTime' },
        { text: '操作类型', value: 'actions', sortable: false }
      ],
      riskLogItems: [],
      searchParam: [
        { type: 'text', placeholder: '配置名称', value: '' },
        { type: 'text', placeholder: '配置标识', value: '' },
        {
          type: 'select',
          placeholder: '应用名称',
          value: null,
          options: [
            { text: '全部机构', value: '' }
          ]
        },
        {
          type: 'text',
          placeholder: '应用标识',
          value: ''
        },
        {
          type: 'select',
          placeholder: '数据类型',
          value: '',
          options: [
            { text: '动账类', value: '1' },
            { text: '非动账类', value: '0' }
          ]
        }
      ],
      // 新建/编辑 模块表头
      addOrEditHeader: {
        name: '设定参数',
        value: 'add',
        isEdit: false
      },
      // 新建编辑 模块form
      moduleForm: {
        moduleName: '',
        moduleNo: '',
        description: '',
        appId: '',
        appNo: '',
        type: '',
        logType: ''
      },
      appList: [],
      appListCN: [],
      dataTypeList: [],
      configurableFieldList: [],
      targetKeys: [],
      transferStyleObj: {
        height: '50vh'
      },
      tablePreviewHeader: [],
      searchFieldHeader: [
        { text: '字段名', value: 'fieldName' },
        { text: '筛选条件', value: 'filterType' },
        { text: '校验类型', value: 'validType' }
      ],
      searchFieldItems: [
        {
          fieldName: '电话',
          filterType: 'select',
          validType: 'phone'
        },
        {
          fieldName: '银行',
          filterType: 'text',
          validType: 'text'
        },
        {
          fieldName: '交易地点',
          filterType: 'text',
          validType: 'text'
        },
        {
          fieldName: '设备指纹',
          filterType: 'text',
          validType: 'text'
        },
        {
          fieldName: '风险等级',
          filterType: 'multiple',
          validType: 'email'
        },
        {
          fieldName: '命中规则',
          filterType: 'select',
          validType: ''
        }
      ],
      filterTypeItems: [
        {
          name: '请选择',
          value: ''
        },
        {
          name: '文本框',
          value: 'text'
        },
        {
          name: '单选下拉框',
          value: 'select'
        },
        {
          name: '多选下拉框',
          value: 'multiple'
        },
        {
          name: '日期',
          value: 'Date' // 我也不知道这个为什么要大写, 别问
        },
        {
          name: '数字区间',
          value: 'range'
        },
        {
          name: '自动补全下拉搜索',
          value: 'autocomplete'
        }
      ],
      // 校验类型
      validTypeItems: [
        {
          name: '请选择',
          value: ''
        },
        {
          name: '邮箱',
          value: 'email'
        },
        {
          name: '身份证',
          value: 'identification'
        },
        {
          name: 'IP',
          value: 'ip'
        },
        {
          name: '手机号码',
          value: 'mobile'
        },
        {
          name: '座机号码',
          value: 'tel'
        },
        {
          name: '邮编',
          value: 'zipcode'
        },
        {
          name: '密码',
          value: 'password'
        },
        {
          name: '金额',
          value: 'amount'
        },
        {
          name: '日期',
          value: 'Date'
        },
        {
          name: '汉字',
          value: 'chinese'
        },
        {
          name: '数字',
          value: 'number'
        },
        {
          name: '字母',
          value: 'letter'
        },
        {
          name: '字母和数字',
          value: 'num_letter'
        },
        {
          name: '汉字和数字',
          value: 'cn_num'
        },
        {
          name: '字母和汉字',
          value: 'cn_letter'
        },
        {
          name: '文本输入',
          value: 'text'
        },
        {
          name: '数字输入',
          value: 'number'
        },
        {
          name: '区间',
          value: 'range'
        }
      ],
      detailPreviewHeader: [
        { text: '分组名', value: 'groupName' },
        { text: '操作', value: 'action' }
      ],
      modal: null,
      detailPreviewItems: [],
      // detailGroupTargetKeys: [],
      crudDialogSwitch: false, // 详情页编辑弹窗开关
      baseAddOrEditHeader: {
        name: '分组名称',
        isEdit: false
      },
      baseAddOrEditFormData: [],
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNums: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100]
    };
  },
  methods: {
    // 第一步新建/编辑时 点击应用列表, 触发更新获取 动账/非动账 类型是否可用
    appListChanged (item) {
      console.info('app list clicked with item :', item);
      let filteredApp = this.appList.find(i => i.value === item);
      this.dataTypeList = []; // 清空数组
      this.disabledDataTypeList = [];
      // 1 动账, 0 非动账
      // this.dataTypeList = filteredApp.type;
      for (let i of filteredApp.type) {
        if (i.type === '0') {
          i['text'] = '非动账';
          i['value'] = '0';
        } else if (i.type === '1') {
          i['text'] = '动账';
          i['value'] = '1';
        }
        this.dataTypeList.push(i);
      }
      console.info(this.dataTypeList);
      console.info(filteredApp);
    },
    // 获取可配置资源池 穿梭框数据源
    async getConfFields () {
      let response = await dataService.queryConfiguarableFields();
      let res = response.data.data;
      for (let i of res) {
        let item = {};
        if (i.fieldName && i.fieldValue) {
          item.label = i.fieldName;
          item.value = i.fieldValue;
          item.key = i.id;
          item.searchSrc = i.searchSrc;
          item.fieldValue = i.fieldValue;
        }
        this.configurableFieldList.push(item);
      }
      console.info('this.configurableFieldList: ', this.configurableFieldList);
    },
    async getFilteredAppList () {
      let params = {};
      let response = await dataService.queryFilteredApps(params);
      for (let i of response.data.data) {
        let item = {};
        item['text'] = i.appName;
        item['value'] = i.appId;
        item['type'] = i.type.risk;
        this.appList.push(item);
      }
    },
    // 获取模块(每个应用动账/非动账)列表
    onPageChange (page) {
      this.pageNum = page;
      console.info('pageNum is : ', page);
      this.getRiskLogItems(this.page, this.pageSize);
    },
    onPageSizeChange (pageSize) {
      this.pageSize = pageSize;
      console.info('pageSize is: ', pageSize);
      this.getRiskLogItems(this.pageNum, pageSize);
    },
    async getRiskLogItems (startIndex = 1, pageSize = 100) {
      let pageParams = {
        startIndex: startIndex,
        pageSize: pageSize
      };
      let params = Object.assign({}, pageParams, this.searchForm);
      let response = await dataService.queryFieldData(params);
      this.riskLogItems = response.data.data.list;
    },
    // 应用筛选下拉列表
    async getAppInfo () {
      let params = {
        states: 1
      };
      let response = await dataService.queryAppInfo(params);
      let appInfoList = response.data.data;
      console.info('appInfoList: ', appInfoList);
      for (let i of appInfoList) {
        let item = {};
        item['value'] = i.appTag;
        item['text'] = i.appName;
        // this.searchParam[2].options.push(item);
        this.searchParam[2].options.push(i.appName);
      }
    },
    // 搜索框
    search ($event) {
      console.info('search: ', $event);
      console.info('this.searchForm: ', this.searchForm);
      this.getRiskLogItems();
    },
    // 重置搜索
    resetSearchData ($event) {},
    // 添加模块记录
    addConfig () {
      console.info('add config');
      this.addEditDialog = true;
    },
    // 关闭弹窗
    cancelConfig () {
      this.addEditDialog = false;
      this.$refs.configForm.reset();
    },
    // 穿梭框定制渲染内容
    render (item) {
      return item.label;
    },
    // 穿梭框的点击事件
    handleTransfer (newTargetKeys, direction, moveKeys) {
      console.info('handleTransfer: ', newTargetKeys, direction, moveKeys);
      this.targetKeys = newTargetKeys;
      console.info('newTargetKeys: ', this.targetKeys, newTargetKeys);
      if (direction === 'right') {
        this.pushToHeader(this.tablePreviewHeader, moveKeys);
        console.info('this.tablePreviewHeader: ', this.tablePreviewHeader);
      }
      if (direction === 'left') {
        this.popFromHeader(this.tablePreviewHeader, moveKeys);
      }
    },
    // 编辑分组的穿梭框
    handleGroupTransfer (newTargetKeys, direction, moveKeys) {
      console.info(newTargetKeys, direction, moveKeys);
      this.detailGroupTargetKeys = newTargetKeys;
      // 点击时, move keys, 之后赋值给当前item.targetKeys
      // 移动 moveKeys 取每一个的名称, 生成对象 { name: '', value: '' }
      // 取 moveKeys 与 源数组 list 的 交集
      if (direction === 'right') {
        this.pushToHeader(this.currentPreviewItem.detailGroupTargetKeys, moveKeys);
      }
      if (direction === 'left') {
        this.popFromHeader(this.currentPreviewItem.detailGroupTargetKeys, moveKeys);
      }
      console.info('full list :', this.detailPreviewItems);
    },
    pushToHeader (list, keys) {
      if (list && list.length >= 0) {
        for (let i = 0; i < keys.length; i++) {
          list.push(keys[i]);
        }
      };
    },
    popFromHeader (list, keys) {
      if (list && list.length >= 0) {
        for (let i = 0; i < keys.length; i++) {
          list.splice(this.tablePreviewHeader.indexOf(keys[i]), 1);
        }
      }
    },
    // 新建详情分组
    createNewDetailGroup () {
      let item = {};
      let len = this.detailPreviewItems.length + 1;
      item['groupName'] = '新建分组' + len;
      item.detailGroupTargetKeys = [];
      this.detailPreviewItems.push(item);
      console.info('新建分组', this.detailPreviewItems);
    },
    getCurrentGroupPreviewItems (item, index) {
      this.currentPreviewItem = item;
      console.info('get preview items: ', item);
      this.detailGroupTargetKeys = item.targetKeys;
      this.currentPreviewItemIndex = index;
    },
    editGroupInfo (item, index) {
      console.info('edit: ', item);
      this.crudDialogSwitch = !this.crudDialogSwitch;
      this.baseAddOrEditHeader = {
        name: '查看分组名称',
        value: 'edit',
        isEdit: true
      };
      this.baseAddOrEditFormData = [
        {
          label: '分组名称',
          value: item.groupName,
          type: 'text',
          required: true,
          rules: [v => !!v || '字段名不能为空', v => BASE_NAME.test(v) || BASE_NAME_TEXT, v => (v && v.length <= 50) || '最大50个字符']
        }
      ];
    },
    deleteGroupInfo () {
      this.delDialogSwitch = true;
    },
    delDialogCancel () {
      this.delDialogSwitch = !this.delDialogSwitch;
    },
    delDialogConfirm ($event) {
      console.info('del confirm :', $event);
      if (this.currentDelMode === 1) {
        // 删除module
        this.delModule(this.moduleId);
      } else {
        // 删除分组
      }
    },
    // 查看详情弹窗 预览功能
    previewRiskLogDetail () {
      // base-details 中的 detailsOplogDetail
      // 控制数据的展示
      this.detailsDialog = !this.detailsDialog;
    },
    detailsCancel () {
      this.detailsDialog = false;
    },
    addOrEditFormSwitch () {},
    baseAddOrEditSave ($event) {
      console.info('confirm save: ', $event);
      let currentPreviewItemName = $event[0].value;
      let existedNames = [];
      if (this.detailPreviewItems.length > 0 && this.detailPreviewItems[this.currentPreviewItemIndex]) {
        console.info('currentPreviewItemIndex: ', this.detailPreviewItems, this.currentPreviewItemIndex);
        this.detailPreviewItems[this.currentPreviewItemIndex].groupName = currentPreviewItemName;
      } else {
        for (var i = 0; i < this.detailPreviewItems.length; i++) {
          existedNames.push(this.detailPreviewItems[i].groupName);
        }
      }
      console.info('detailPreviewItems: ', this.detailPreviewItems);
    },
    cancelBaseEdit () {
      this.crudDialogSwitch = false;
    },
    // 所有步骤完成后保存数据
    async saveConfigAll () {
      console.info('save all');
      // save addModule
      console.info('moduid is : ', this.moduleId);
      if (!this.moduleId) {
        // 新建
        let moduleResponse = await this.addModule(this.moduleForm);
        if (moduleResponse.data.code === 200) {
          let moduleId = moduleResponse.data.data;
          console.info('moduid is : ', moduleId);
          this.addTitle(moduleId);
          this.addGroup(moduleId);
        } else {
          console.info('else');
        }
      } else {
        // 编辑
        let response = await dataService.editModule(this.moduleForm);
        console.info(response);
        this.addTitle(this.moduleId);
        this.addGroup(this.moduleId);
      }
      this.cancelConfig();
    },
    async addModule (params) {
      console.info('addModule: ', params);
      if (!params.moduleSrc) {
        params['moduleSrc'] = 'risk';
      }
      if (!params.logType) {
        params['logType'] = 'risk';
      }
      let response = await dataService.addModule(params);
      return response;
    },
    async addGroup (moduleId) {
      let params = {};
      params.moduleId = moduleId;

      let groups = [];
      if (this.oplogDetail) {
        for (var i = 0; i < this.oplogDetail.length; i++) {
          let currentDetail = this.oplogDetail[i];
          let item = {};
          item.sortNo = i;
          item.groupName = currentDetail.groupName;
          item.fieldList = [];
          for (let index in currentDetail.groupData) {
            let field = {};
            field['sortNo'] = index;
            field['fieldName'] = currentDetail.groupData[index].value;
            field['fieldText'] = currentDetail.groupData[index].label;
            field['fieldSrcId'] = currentDetail.groupData[index].key;
            field['searchSrc'] = currentDetail.groupData[index].searchSrc;
            item.fieldList.push(field);
          }
          groups.push(item);
        }
      }
      params.groups = groups;
      let jsonObj = {};
      jsonObj['json'] = JSON.stringify(params);
      await dataService.addGroup(jsonObj);
    },
    async addTitle (moduleId) {
      let items = [];
      if (this.computedSearchFieldItems) {
        for (var i = 0; i < this.computedSearchFieldItems.length; i++) {
          let obj = {};
          let currentItem = this.computedSearchFieldItems[i];
          obj.sortNo = i;
          obj.searchSrc = currentItem.searchSrc;
          obj.isLog = 1;
          // 根据 filterType 判断十分为可搜索字段
          if (currentItem.filterType) {
            obj.isSearch = 1;
          } else {
            obj.isSearch = 0;
          }
          // validType -> checkType
          if (currentItem.validType) {
            obj.checkType = currentItem.validType;
          }
          // filterType -> searchType
          if (currentItem.filterType) {
            obj.searchType = currentItem.filterType;
          }
          if (currentItem.fieldName) {
            let fieldItem = this.getFieldById(currentItem.key);
            obj.fieldText = fieldItem.label;
            obj.fieldName = fieldItem.value;
            obj.fieldSrcId = currentItem.key;
          }
          items.push(obj);
        }
      }
      let params = {};
      params.moduleId = moduleId;
      params.fieldList = items;
      let jsonObj = {};
      jsonObj['json'] = JSON.stringify(params);
      await dataService.addTitle(jsonObj);
    },
    getFieldById (id) {
      console.info('this is id: ', id);
      if (this.configurableFieldList) {
        try {
          // let item = this.configurableFieldList.find(i => i.key === id);
          // console.info('getFieldById getFieldById: ', item);
          for (let i in this.configurableFieldList) {
            let item = this.configurableFieldList[i];
            if (item.key === id) {
              return item;
            }
          }
        } catch (error) {
          console.info(error);
        }
      }
    },
    async editItem (item) {
      console.info(item);
      this.addOrEditHeader.isEdit = true;
      let moduleId = item.id;
      this.moduleId = item.id;
      this.addOrEditHeader.name = '编辑';
      this.moduleForm = item;
      // get detail by item.id
      this.queryTableHeader(moduleId);
      let groupResponse = await dataService.queryGroup({ id: moduleId });
      console.info('group info: ', groupResponse);
      this.queryGroup(moduleId);
      // this.handleTransfer(this.targetKeys, 'right', this.targetKeys);
      this.addEditDialog = true;
    },
    async queryGroup (moduleId) {
      if (!moduleId) {
        return [];
      }
      let params = { id: moduleId };
      let response = await dataService.queryGroup(params);
      // 获取数据后
      if (response) {
        let groupData = response.data.data.groups;
        groupData.sort(function (a, b) {
          return a.sortNo - b.sortNo;
        });
        this.detailPreviewItems = [];
        for (let i in groupData) {
          let item = {
            groupName: '',
            detailGroupTargetKeys: []
          };
          item['groupName'] = groupData[i].groupName;
          item['detailGroupTargetKeys'] = [];
          item['targetKeys'] = [];
          for (let key in groupData[i].confFieldList) {
            let conf = groupData[i].confFieldList[key];
            console.info('targetKeys conf:', conf);
            item['detailGroupTargetKeys'].push(conf.fieldSrcId);
            item['targetKeys'].push(conf.fieldSrcId);
          }
          console.info('item groupData:', item);
          this.detailPreviewItems.push(item);
          // this.detailPreviewItems.push(item);
        }
      }
    },
    async queryTableHeader (moduleId) {
      if (!moduleId) {
        return [];
      }
      let params = { id: moduleId };
      let response = await dataService.queryTableHeader(params);
      console.info('table header:', response.data.data);
      if (response) {
        let headerList = response.data.data;
        if (headerList.length > 0) {
          this.targetKeys = [];
          for (let i in headerList) {
            this.targetKeys.push(headerList[i].fieldSrcId);
          }
          this.pushToHeader(this.tablePreviewHeader, this.targetKeys);
        }
      }
    },
    getConfFieldsList (list) {
      console.info('list: ', list);
      let items = [];
      for (let i in list) {
        if (list[i].fieldSrcId) {
          items.push(list[i].fieldSrcId);
        }
      }
      return items;
    },
    deleteItem (item) {
      this.moduleId = item.id;
      this.currentDelMode = 1;
      this.delDialogSwitch = true;
      console.info(item);
      console.info('moduleId: ', this.moduleId, this.currentDelMode);
    },
    async delModule (params) {
      let delParam = {
        id: params
      };
      let response = await dataService.delModule(delParam);
      console.info('delModule: ', response);
      if (response.data.code === 200) {
        this.delDialogSwitch = false;
        this.getRiskLogItems();
      }
    }
  },
  computed: {
    previewHeader () {
      let headItems = [];
      if (this.tablePreviewHeader.length > 0) {
        let findSame = function (itm) {
          return this.configurableFieldList.find(item => item.key === itm);
        };
        for (var i = 0; i < this.tablePreviewHeader.length; i++) {
          let item = findSame(this.tablePreviewHeader[i]);
          item['text'] = item.label;
          item['value'] = item.fieldValue;
          headItems.push(item);
        }
        headItems = headItems.filter(i => i.value !== 'hit_rule_search');
        return headItems;
      }
      return [];
    },
    // filterItems () {
    //   if (this.headItems.length && this.headItems.length > 0) {
    //     for (let i = 0; i < this.headItems.length; i++) {
    //       let item = {};
    //     }
    //   }
    //   return null;
    // },
    computedSearchFieldItems () {
      let fieldList = [];
      // key, label, text, value
      if (this.previewHeader.length > 0) {
        for (let i of this.previewHeader) {
          let item = Object.assign({}, i);
          item.fieldName = i.text;
          if (!item.filterType) {
            item.filterType = 'text';
          }
          console.info('fieldList item: ', item);
          fieldList.push(item);
        }
      }
      fieldList.push({
        fieldName: '规则命中查询',
        fieldValue: '',
        filterType: '',
        key: '',
        label: '规则命中查询',
        searchSrc: '',
        text: '规则命中查询',
        value: ''
      });
      return fieldList;
    },
    detailGroupTargetKeys: {
      get: function () {
        if (!this.currentPreviewItem || !this.currentPreviewItem.detailGroupTargetKeys) {
          return [];
        }
        return this.currentPreviewItem.detailGroupTargetKeys;
      },
      set: function (newValue) {
        this.currentPreviewItem.detailPreviewItems = newValue;
      }
    },
    // groupTransferTitles: {
    //   get: function () {
    //     return ['源列表', '目的地列表'];
    //   },
    //   set: function (newValue) {
    //     let sourceName = '风控日志数据源';
    //     let newName = '风控详情_' + this.currentPreviewItem.groupName;
    //     let originalList = [sourceName, newName];
    //     console.info('originalList :', originalList);
    //     return originalList;
    //   }
    // },
    groupTransferTitles () {
      if (!this.currentPreviewItem) {
        return ['源列表', '目的地列表'];
      } else {
        let sourceName = '风控日志数据源';
        let newName = '风控详情_' + this.currentPreviewItem.groupName;
        let originalList = [sourceName, newName];
        return originalList;
      }
    },
    oplogDetail () {
      let detailList = [];
      if (this.detailPreviewItems.length > 0) {
        for (let i = 0; i < this.detailPreviewItems.length; i++) {
          let item = this.detailPreviewItems[i];
          if (item.detailGroupTargetKeys.length > 0) {
            let groupData = this.configurableFieldList.filter(i => item.detailGroupTargetKeys.includes(i.key));
            for (let data of groupData) {
              data['name'] = data.label;
            }
            item.groupData = groupData;
          }
          detailList.push(item);
        }
        return detailList;
      };
      return [];
    },
    searchForm () {
      let formData = {};
      if (this.searchParam[0].value) {
        formData['moduleName'] = this.searchParam[0].value;
      }
      if (this.searchParam[1].value) {
        formData['moduleNo'] = this.searchParam[1].value;
      }
      if (this.searchParam[2].value) {
        formData['appName'] = this.searchParam[2].value;
      }
      if (this.searchParam[3].value) {
        formData['appNo'] = this.searchParam[3].value;
      }
      if (this.searchParam[4].value) {
        formData['type'] = this.searchParam[4].value;
      }
      return formData;
    }
  },
  created () {
    // 获取页面所有应用的列表
    this.getRiskLogItems();
    this.getAppInfo();
    this.getFilteredAppList();
    this.getConfFields();
  },
  filters: {
    filterLogType: function (value) {
      return value === '1' ? '动账' : '非动账';
    }
  }
};
</script>

<style>
.baseSectionDisplay {
  display: inline-block;
}
.baseSection20 {
  width: 12%;
}
.baseSection40 {
  width: 38%;
}
.ivu-transfer-list {
  width: 40%;
}
</style>
