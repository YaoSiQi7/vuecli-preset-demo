<!--author：Fc -->
<!--updateTime：2021-05-24-->
<template>
  <div class="com-tempParam-lib">
    <base-search @change="panelCounter">
      <template v-slot>
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
                      <v-text-field placeholder="任务创建时间" outlined dense v-model="dateRangeText" append-icon="event"  @click="dateInputClick"></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="12"
                      md="2"
                      xl="2"
                    >
                      <v-text-field
                        placeholder="任务名称"
                        v-model="searchForm.riskTaskName"
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
                        placeholder="任务类型"
                        v-model="searchForm.riskTaskType"
                        :items="typeItem"
                        item-text="selectText"
                        item-value="selectField"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        class="pt-0 pb-0"
                      ></v-select>
                    </v-col>
                    <!--<v-col
                      cols="12"
                      sm="12"
                      md="2"
                      xl="2"
                    >
                      <v-text-field
                        placeholder="数据范围"
                        v-model="searchForm.name"
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
                        placeholder="执行频次"
                        v-model="searchForm.name"
                        outlined
                        dense
                        class="pt-0 pb-0"
                      ></v-text-field>
                    </v-col>-->
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
                        <v-date-picker selected-items-text="已选择日期" v-model="dates" range  @change="dateChange"></v-date-picker>
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
    <!--表格-->
    <!-- 表格 -->
    <v-data-table
      :headers="riskMonitoringHeaders"
      :items="riskMonitoringData"
      :items-per-page="searchForm.pageSize"
      hide-default-footer
      :height="tableHeight"
      class="elevation-3 mt-3"
      :fixed-header="true"
    >
      !-- 表头 -->
      <template v-slot:top>
        <v-toolbar
          flat
          height="60px"
        >
          <v-toolbar-title style="font-size:18px">
            任务管理列表
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
            @click="addRisk"
          >
            添加
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.riskTaskType="{ item }">
        <span>{{ item.riskTaskType |  riskTaskTypeFilter()}}</span>
      </template>
      <template v-slot:item.dataRange="{ item }">
        <span>{{ item.dataRange |  rangeFilter(item.dataRangeValue)}}</span>
      </template>
      <template v-slot:item.taskFrequency="{ item }">
        <span>{{ item.taskFrequency |  taskFrequencyFilter(item.taskFrequencyValue)}}</span>
      </template>
      <template v-slot:item.taskState="{ item }">
        <v-switch
          v-model="item.taskState"
          @change="taskStateChange(item)"
        ></v-switch>
      </template>
      <template v-slot:item.action="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-1 icon-primary"
              color="primary"
              v-on="on"
              @click="editItem(item)"
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
              color="primary"
              v-on="on"
              @click="configItem(item)"
            >
              mdi-square-edit-outline
            </v-icon>
          </template>
          <span>配置</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-1 icon-primary"
              color="primary"
              v-on="on"
              @click="distributeItem(item)"
            >
              mdi-cog-transfer
            </v-icon>
          </template>
          <span>离线资源分配</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-1 icon-primary"
              color="primary"
              v-on="on"
              @click="deleteItemFn(item)"
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
      <template v-slot:footer>
        <v-divider></v-divider>
        <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
          <div class="footer__select">
            每页
            <span>
              <v-select
                v-model="searchForm.pageSize"
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
              v-model="searchForm.page"
              :length="queryPageLength"
              :total-visible="7"
              @input="onPageChange"
            />
          </div>
        </div>
      </template>
    </v-data-table>
    <!-- 添加或编辑的弹窗 -->
    <v-dialog
      v-model="dialog"
      persistent
      scrollable
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            {{ addOrEditHeader.name }}
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
        <v-card-text>
          <v-container>
            <slot>
              <!--<div v-if="addOrEditHeader.isEdit">
                <v-form
                  class="ruleSetAddOrEdit"
                  ref="form" v-model="valid"
                  :lazy-validation="lazy">
                  <v-row>
                    <v-col cols="3" class="pr-0">
                      <div class="mt-2">任务名称:</div>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field solo flat dense disabled v-model="add2EditForm.riskTaskName"/>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3" class="pr-0">
                      <div class="mt-2">任务类型:</div>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field solo flat dense disabled v-model="add2EditForm.riskTaskType"/>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3" class="pr-0">
                      <div class="mt-2">数据范围:</div>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field solo flat dense disabled v-model="add2EditForm.dataRange"/>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3" class="pr-0">
                      <div class="mt-2">执行频次:</div>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field solo flat dense disabled v-model="add2EditForm.frequency"/>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3" class="pr-0">
                      <div class="mt-2">执行时间:</div>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field solo flat dense disabled v-model="add2EditForm.time"/>
                    </v-col>
                  </v-row>
                </v-form>
              </div>-->
              <div>
                <v-form
                  class="ruleSetAddOrEdit"
                  ref="form" v-model="valid"
                  :lazy-validation="lazy">
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="8">
                      <v-text-field class="taskName" dense outlined v-model="add2EditForm.riskTaskName" label="任务名称*"
                                    counter="50"
                                    :rules="[
                                      v => !!v || '任务名称不能为空',
                                      v => (v.replace(/ /g, '') !== '') || '任务名称不能为空',
                                      v => v && v.length <= 50 || '最多只能输入50个字符',
                                      v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                                    ]"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="8">
                      <v-select
                        v-model="add2EditForm.riskTaskType"
                        item-text="value"
                        item-value="label"
                        :items="taskType"
                        label="任务类型*"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        :rules="[
                          v => !!v || '任务类型不能为空'
                        ]"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="4">
                      <v-select
                        v-model="add2EditForm.dataRange"
                        item-text="value"
                        item-value="label"
                        :items="dataRange"
                        label="数据范围*"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        :rules="[
                          v => !!v || '数据范围不能为空'
                        ]"
                      />
                    </v-col>
                    <v-col cols="4" style="display: flex;align-items: center;" v-if="add2EditForm.dataRange === 5">
                      <v-text-field dense outlined v-model="add2EditForm.dataRangeValue"
                                    :rules="[
                                      v => !!v || '不能为空',
                                      v => ((/^(-)?\d+(\d+)?$/).test(v)) || '只能输入数字',
                                      v => ((/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/).test(v)) || '只能输入1-999的数字'
                                    ]"
                      /><span class="ml-4">天</span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="4">
                      <v-text-field dense outlined v-model="add2EditForm.taskFrequencyValue" label="执行频次*"
                                    :rules="[
                                      v => !!v || '不能为空',
                                      v => ((/^(-)?\d+(\d+)?$/).test(v)) || '只能输入数字',
                                      v => ((/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/).test(v)) || '只能输入1-999的数字'
                                    ]"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        v-model="add2EditForm.taskFrequency"
                        item-text="value"
                        item-value="label"
                        :items="dataFrequency"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        :rules="[
                          v => !!v || '执行频次不能为空'
                        ]"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="6">
                      <v-dialog
                        ref="dialog"
                        v-model="modal2"
                        :return-value.sync="add2EditForm.taskTime"
                        persistent
                        width="360px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field dense outlined v-model="add2EditForm.taskTime"
                                        append-icon="mdi-clock-outline"
                                        label="执行时间*"
                                        v-bind="attrs"
                                        v-on="on"
                                        :rules="[
                                          v => !!v || '执行时间不能为空'
                                        ]"
                          />
                        </template>
                        <v-time-picker
                          v-if="modal2"
                          v-model="add2EditForm.taskTime"
                          full-width
                          use-seconds
                          @click:second="$refs.dialog.save(add2EditForm.taskTime)"
                        >
                        </v-time-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </slot>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelDialog">取消
            </v-btn>
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white"
              @click="confimDialogSave()"
              :disabled="!valid"
            >
              保存
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 离线资源分配弹窗 -->
    <v-dialog
      v-model="distributeDialog"
      persistent
      scrollable
      max-width="620px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>离线资源分配</v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="cancelDistribute"
          >
            <v-icon color="var(--v-headerCloseIconColor-base)">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form
            ref="distributeForm" v-model="distributeValid"
            :lazy-validation="distributeLazy">
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="3" class="pr-0">
                <div class="mt-2">driver 内存大小：</div>
              </v-col>
              <v-col cols="6" class="d-flex px-0">
                <div class="flex-grow-1">
                  <v-text-field dense outlined v-model="distributeForm.driverMemory" placeholder="默认为1"
                                :rules="[
                                  v => (/^(0|\+?[1-9][0-9]{0,4})(\.\d{1,2})?$/).test(v) || '最多五位数的数字'
                                ]"/>
                </div>
              </v-col>
              <div style="line-height: 60px;" class="ml-3">g</div>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="3" class="pr-0">
                <div class="mt-2">driver 核心数：</div>
              </v-col>
              <v-col cols="6" class="d-flex px-0">
                <div class="flex-grow-1">
                  <v-text-field dense outlined v-model="distributeForm.driverCores" placeholder="默认为1"
                                :rules="[
                                  v => (/^(0|\+?[1-9][0-9]{0,4})(\.\d{1,2})?$/).test(v) || '最多五位数的数字'
                                ]"/>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="3" class="pr-0">
                <div class="mt-2">executor 内存大小：</div>
              </v-col>
              <v-col cols="6" class="d-flex px-0">
                <div class="flex-grow-1">
                  <v-text-field dense outlined v-model="distributeForm.executorMemory" placeholder="默认为1"
                                :rules="[
                                  v => (/^(0|\+?[1-9][0-9]{0,4})(\.\d{1,2})?$/).test(v) || '最多五位数的数字'
                                ]"/>
                </div>
              </v-col>
              <div style="line-height: 60px;" class="ml-3">g</div>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="3" class="pr-0">
                <div class="mt-2">executor 核心数：</div>
              </v-col>
              <v-col cols="6" class="d-flex px-0">
                <div class="flex-grow-1">
                  <v-text-field dense outlined v-model="distributeForm.executorCores" placeholder="默认为1"
                                :rules="[
                                  v => (/^(0|\+?[1-9][0-9]{0,4})(\.\d{1,2})?$/).test(v) || '最多五位数的数字'
                                ]"/>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="3" class="pr-0">
                <div class="mt-2">executor 总数量：</div>
              </v-col>
              <v-col cols="6" class="d-flex px-0">
                <div class="flex-grow-1">
                  <v-text-field dense outlined v-model="distributeForm.numExecutors" placeholder="默认为3"
                                :rules="[
                                  v => (/^(0|\+?[1-9][0-9]{0,4})(\.\d{1,2})?$/).test(v) || '最多五位数的数字'
                                ]"/>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="3" class="pr-0">
                <div class="mt-2">任务调优参数：</div>
              </v-col>
              <v-col cols="6" class="d-flex px-0">
                <div class="flex-grow-1"><v-text-field dense outlined v-model="distributeForm.submitConfParams"/></div>
              </v-col>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-icon
                    class="ml-3"
                    color="primary"
                    v-on="on"
                    size="20"
                  >mdi-help-circle</v-icon>
                </template>
                <span>传递给spark提交任务调优参数。例如：<br/>"{\"spark.default.parallelism\":\"1000\",\"spark<br/>.storage.memoryFraction\":\"0.5\"}"</span>
              </v-tooltip>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1"/>
          <div>
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelDistribute">取消
            </v-btn>
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white"
              @click="confimDistributeSave()"
              :disabled="!distributeValid"
            >
              保存
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 删除提示框 -->
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
</template>

<script>
import BaseSearch from '@/components/BaseSearch';
import DelDialog from '@/components/DelDialog';
import moment from 'moment';
import { mapActions } from 'vuex';
import {
  effectRiskList,
  addEffectRisk,
  updateEffectRisk,
  delEffectRisk,
  upTaskState,
  effectRiskListInfo,
  upConfig
} from '@/api/riskMonitoringTask';
export default {
  name: 'riskList',
  data () {
    return {
      // 提示框
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      counter: 0,
      fullHeight: window.innerHeight,
      searchValid: true,
      isdateShow: false,
      typeItem: [
        { selectText: '账户风险监测', selectField: '1' },
        { selectText: '企业风险监测', selectField: '2' },
        { selectText: '商户风险监测', selectField: '3' }
      ],
      dates: [],
      searchForm: {
        beginTime: '',
        endTime: '',
        riskTaskName: '',
        riskTaskType: '',
        page: 1,
        pageSize: 10
      },
      // 表头
      riskMonitoringHeaders: [
        { text: '任务名称', value: 'riskTaskName', sortable: false, width: 100 },
        { text: '任务类型', value: 'riskTaskType', sortable: false, width: 100 },
        { text: '数据范围', value: 'dataRange', sortable: false, width: 100 },
        { text: '执行频次', value: 'taskFrequency', sortable: false, width: 100 },
        { text: '执行时间', value: 'taskTime', sortable: false, width: 100 },
        { text: '任务状态', value: 'taskState', sortable: false, width: 100 },
        { text: '任务创建时间', value: 'createTime', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      riskMonitoringData: [],
      // 分页变量
      queryPageLength: 0,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 新增编辑弹窗头部
      addOrEditHeader: {
        name: '添加',
        value: 'add',
        isEdit: true
      },
      valid: true,
      lazy: false,
      // 区分是新增还是编辑的变量 1是新增 2是编辑
      flag: 1,
      // 新增编辑弹窗
      dialog: false,
      // 新增编辑弹窗表单信息
      addAndEditFormData: [],
      add2EditForm: {
        riskTaskName: '', // 任务名称
        riskTaskType: '', // 任务类型
        dataRange: '', // 数据范围
        dataRangeValue: '', // 数据范围自定义值
        taskFrequency: '', // 执行频次
        taskFrequencyValue: '', // 执行频次值
        taskTime: '' // 执行时间
      },
      taskType: [
        { value: '账户风险监测', label: 1 },
        { value: '企业风险监测', label: 2 },
        { value: '商户风险监测', label: 3 }
      ],
      dataRange: [
        { value: '近一周', label: 1 },
        { value: '近一个月', label: 2 },
        { value: '近三个月', label: 3 },
        { value: '近六个月', label: 4 },
        { value: '自定义', label: 5 }
      ],
      dataFrequency: [
        { value: '天', label: 1 },
        { value: '周', label: 2 },
        { value: '月', label: 3 }
      ],
      modal2: false,
      // 删除提示
      dialogDel: false,
      deleteItem: '',
      // 离线资源分配
      distributeDialog: false,
      distributeValid: true,
      distributeLazy: false,
      distributeForm: {
        driverMemory: '', // driver内存大小
        driverCores: '', // driver核心数
        executorMemory: '', // executor内存大小
        executorCores: '', // executor核心数
        numExecutors: '', // executor总数量
        submitConfParams: '', // 传递给spark提交任务调优参数
        id: ''
      }
    };
  },
  components: {
    DelDialog,
    BaseSearch
  },
  computed: {
    // 创建时间
    dateRangeText: {
      get () {
        if (moment(this.dates[0]).valueOf() < moment(this.dates[1]).valueOf()) {
        } else if (moment(this.dates[0]).valueOf() > moment(this.dates[1]).valueOf()) {
          this.reverseArry(this.dates);
        }
        return this.dates.join(' 到 ');
      },
      set (newVal) {}
    },
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 224;
      }
    }
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        // Promise.all([]);
      },
      immediate: true
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
  filters: {
    riskTaskTypeFilter: (type) => {
      let typeObj = {
        1: '账户风险监测',
        2: '企业风险监测',
        3: '商户风险监测'
      };
      return typeObj[type];
    },
    rangeFilter: (range, rangeValue) => {
      let rangeObj = {
        1: '近一周',
        2: '近一个月',
        3: '近三个月',
        4: '近六个月'
      };
      if (range !== 5) {
        return rangeObj[range];
      } else {
        return rangeValue + '天';
      }
    },
    taskFrequencyFilter: (frequency, frequencyValue) => {
      let frequencyObj = {
        1: '天',
        2: '周',
        3: '月'
      };
      return frequencyValue + frequencyObj[frequency];
    }
  },
  // beforeRouteLeave (to, from, next) {
  //   if (to.path === '/riskMonitoringTaskDetail') {
  //
  //   }
  // },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  created () {
    this.effectRiskList();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  methods: {
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    panelCounter: function () {
      this.counter += 1;
    },
    showMassage (msg, type) {
      this.snackbarServe = true;
      this.snackbarServeMsg = msg;
      this.snackbarServeColor = type || 'error';
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
      if (this.dates.length === 2) {
        this.isdateShow = false;
      }
    },
    // 创建时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
    },
    // 点击查询
    searchTable () {
      this.effectRiskList();
    },
    // 搜索条件重置
    reset () {
      this.$refs.searchForm.reset();
      this.dates = [];
      this.effectRiskList();
    },
    onPageChange (page) {
      this.searchForm.page = page;
      this.effectRiskList();
    },
    pageChange (pageSize) {
      this.searchForm.pageSize = pageSize;
      this.searchForm.page = 1;
      this.effectRiskList();
    },
    // 风险任务监控列表
    effectRiskList () {
      this.searchForm.beginTime = this.dates[0] ? this.dates[0] + ' 00:00:00' : '';
      this.searchForm.endTime = this.dates[1] ? this.dates[1] + ' 23:59:59' : '';
      effectRiskList(this.searchForm).then(res => {
        if (res.data.code === 200) {
          this.riskMonitoringData = res.data.data.verList;
          this.totalItems = res.data.data.total;
          this.queryPageLength = res.data.data.totalPage;
        } else {
          this.showMassage(res.data.msg);
        }
      }).catch(error => {
        this.showMassage(error.data.msg);
      });
    },
    // 开启或关闭风险监控任务
    taskStateChange (item) {
      this.$nextTick(() => {
        upTaskState({
          id: item.id,
          taskState: item.taskState ? 1 : 0
        }).then(res => {
          if (res.data.code !== 200) {
            this.showMassage(res.data.msg);
          }
        }).catch(error => {
          this.showMassage(error.data.msg);
        });
      });
    },
    // 离线资源分配
    distributeItem (item) {
      this.distributeForm = {
        driverMemory: item.driverMemory, // driver内存大小
        driverCores: item.driverCores, // driver核心数
        executorMemory: item.executorMemory, // executor内存大小
        executorCores: item.executorCores, // executor核心数
        numExecutors: item.numExecutors, // executor总数量
        submitConfParams: item.submitConfParams, // 传递给spark提交任务调优参数
        id: item.id
      };
      this.distributeDialog = true;
    },
    cancelDistribute () {
      this.distributeDialog = false;
    },
    confimDistributeSave () {
      upConfig(this.distributeForm).then(res => {
        if (res.data.code === 200) {
          this.showMassage(res.data.msg, 'success');
          this.effectRiskList();
          this.cancelDistribute();
        } else {
          this.showMassage(res.data.msg);
        }
      }).catch(error => {
        this.showMassage(error.data.msg);
      });
    },
    editItem (item) {
      this.addOrEditHeader = {
        name: '编辑',
        value: 'edit',
        isEdit: false
      };
      this.dialog = true;
      this.flag = 1;
      this.add2EditForm = {
        riskTaskName: item.riskTaskName,
        riskTaskType: item.riskTaskType,
        dataRange: item.dataRange,
        dataRangeValue: item.dataRangeValue,
        taskFrequency: item.taskFrequency,
        taskFrequencyValue: item.taskFrequencyValue,
        taskTime: item.taskTime,
        id: item.id
      };
    },
    configItem (item) {
      effectRiskListInfo({ id: item.id }).then(res => {
        if (res.data.code === 200) {
          let params = {
            detailInfo: item,
            weightList: res.data.data.weightList,
            riskLevelList: res.data.data.riskLevelList
          };
          this.toSecondRouterPage(params);
          this.$router.push('/riskMonitoringTaskDetail');
        }
      }).catch(error => {
        console.log(error);
      });
    },
    deleteItemFn (item) {
      this.dialogDel = true;
      this.deleteItem = item;
    },
    // 删除确定
    confirmDelFun () {
      delEffectRisk({ id: this.deleteItem.id }).then(res => {
        if (res.data.code === 200) {
          this.showMassage('删除成功', 'success');
          this.dialogDel = false;
          this.searchForm.page = 1;
          this.effectRiskList();
        } else {
          this.showMassage(res.data.msg);
        }
      }).catch(error => {
        this.showMassage(error.data.msg);
      });
    },
    // 添加
    addRisk () {
      this.addOrEditHeader = {
        name: '添加',
        value: 'add',
        isEdit: false
      };
      this.dialog = true;
      this.flag = 1;
    },
    // 隐藏添加编辑弹窗
    cancelDialog () {
      this.$refs.form.reset();
      this.dialog = false;
    },
    // 新增风险监控任务2修改风险监控任务
    confimDialogSave () {
      if (this.addOrEditHeader.value === 'add') {
        addEffectRisk(this.add2EditForm).then(res => {
          if (res.data.code === 200) {
            this.showMassage('添加成功', 'success');
            this.cancelDialog();
            this.searchForm.page = 1;
            this.effectRiskList();
          } else {
            this.showMassage(res.data.msg);
          }
        }).catch(error => {
          this.showMassage(error.data.msg);
        });
      } else {
        updateEffectRisk(this.add2EditForm).then(res => {
          if (res.data.code === 200) {
            this.showMassage('修改成功', 'success');
            this.cancelDialog();
            this.searchForm.page = 1;
            this.effectRiskList();
          } else {
            this.showMassage(res.data.msg);
          }
        }).catch(error => {
          this.showMassage(error.data.msg);
        });
      }
    },
    hideTime () {
      this.modal2 = false;
    },
    ...mapActions([
      'toSecondRouterPage'
    ])
  }
};
</script>

<style scoped>
  .taskName >>> .v-input__control {
    height: auto;
  }
</style>
