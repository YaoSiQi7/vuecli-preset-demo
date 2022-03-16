<!----------  @author: author  ----------->
<!----------  @updated_at: date  ----------->
<!----------  @version: version  ----------->

<template>
  <!-- 预警策略配置 -->
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
                  v-model="form.warnContent"
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
                  placeholder="预警渠道："
                  v-model="form.appId"
                  :items="channelItems"
                  item-text="appName"
                  item-value="id"
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
      </template>
    </base-search>
    <v-row>
      <v-col cols='12' class="py-0 mt-3">
        <v-card class="elevation-3">
          <v-data-table
            :headers="constHeader"
            :items="constItem"
            :items-per-page="perPageNum"
            hide-default-footer
            no-results-text="没有匹配的数据"
            :height="tableHeight"
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
                  :title="`${item.warnContent}`"
                  class="el-border-defu"
                >
                  {{ item.warnContent }}
                </td>
                <td
                  :title="`${item.appName}`"
                  class="el-border-defu"
                >
                  {{ item.appName }}
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
            <!-- <template v-slot:footer v-if="queryPageLength > 1"> -->
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
        </v-card>
      </v-col>
    </v-row>
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
                   <v-switch v-model="isEditMode" v-if="hasPermission(editStrategyBtn)" inset dense label="启用编辑" @change="onChange">
                   </v-switch>
                  </v-col>
                </v-row>
                <v-form class="ruleSetAddOrEdit" ref="formAdd" v-model="valid" :lazy-validation="lazy" :key="newDate">
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">预警渠道*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="isEditMode"
                        v-model="formAdd.appId"
                        item-text="appName"
                        item-value="id"
                        :menu-props="{ bottom: true }"
                        :items="channelItemsCopy"
                        required
                        :rules="[v => !!v || '预警渠道不能为空']"
                        outlined
                        dense
                        @change="getNoteOrEmailTemplateName(formAdd.appId, editItemObj)"
                        no-data-text="没有匹配数据"
                      />
                      <v-select
                        v-else
                        v-model="formAdd.appId"
                        item-text="appName"
                        item-value="id"
                        :items="channelItemsCopy"
                        required
                        :rules="[v => !!v || '预警渠道不能为空']"
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
                      <div class="mt-2">{{ strategyTemplateNameText }}*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="isEditMode"
                        v-model="formAdd.strategyTemplateId"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="noteOrEmailTemplateName"
                        required
                        :rules="[v => !!v || this.strategyTemplateNameText + '不能为空']"
                        outlined
                        dense
                        @change="handleChangeSelect(formAdd.strategyTemplateId)"
                        no-data-text="没有匹配数据"
                      />
                      <v-select
                        v-else
                        v-model="formAdd.strategyTemplateId"
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
                        required
                        :rules="[
                          v => !!v || this.strategyParamNameText + '不能为空'
                        ]"
                        v-model.trim="formAdd.strategyParametersName"
                        outlined
                        dense
                        disabled
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">指标阈值*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        v-if="isEditMode"
                        required
                        :counter="50"
                        :rules="indexThresholdRules"
                        v-model.trim="formAdd.indexThreshold"
                        outlined
                        dense
                        :disabled="!isEditMode"
                      />
                      <v-text-field
                        v-else
                        required
                        v-model.trim="formAdd.indexThreshold"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">逻辑判断*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="isEditMode"
                        v-model="formAdd.logicalJudgment"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="logicalJudgmentItems"
                        required
                        :rules="[v => !!v || '逻辑判断不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                      />
                      <v-select
                        v-else
                        v-model="formAdd.logicalJudgment"
                        item-text="text"
                        item-value="value"
                        :items="logicalJudgmentItems"
                        required
                        :rules="[v => !!v || '逻辑判断不能为空']"
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
                      <div class="mt-2">通知方式*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="isEditMode"
                        v-model="formAdd.informManner"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="informMannerItems"
                        required
                        :rules="[v => !!v || '通知方式不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="informMannerChange(formAdd.informManner)"
                      />
                      <v-select
                        v-else
                        v-model="formAdd.informManner"
                        item-text="text"
                        item-value="value"
                        :items="informMannerItems"
                        required
                        :rules="[v => !!v || '通知方式不能为空']"
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
                      <div class="mt-2">通知群组*：</div>
                    </v-col>
                    <v-col cols="7" class="mb-6">
                      <treeselect
                        v-if="isEditMode"
                        :value-consists-of="valueConsistsOf"
                        :multiple="isMultiple"
                        :options="informGroupItems"
                        placeholder="通知群组"
                        :disabled="!isEditMode"
                        :default-expand-level="1"
                        noChildrenText="没有数据"
                        v-model="formAdd.informGroup"
                      >
                      </treeselect>
                      <treeselect
                        v-else
                        :value-consists-of="valueConsistsOf"
                        :multiple="isMultiple"
                        :options="informGroupItems"
                        :disabled="!isEditMode"
                        :default-expand-level="1"
                        noChildrenText="没有数据"
                        v-model="formAdd.informGroup"
                      >
                      </treeselect>
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
                      <v-select
                        v-model="formAdd.appId"
                        item-text="appName"
                        item-value="id"
                        :items="channelItemsCopy"
                        label = "预警渠道："
                        required
                        :rules="[
                          v => !!v || '预警渠道不能为空',
                        ]"
                        outlined
                        dense
                        @change="getNoteOrEmailTemplateName(formAdd.appId)"
                        no-data-text="没有匹配数据"
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
                        v-model="formAdd.strategyTemplateId"
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
                        @change="handleChangeSelect(formAdd.strategyTemplateId)"
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
                        disabled
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
                        v-model="formAdd.logicalJudgment"
                        item-text="text"
                        item-value="value"
                        :items="logicalJudgmentItems"
                        label = "逻辑判断："
                        required
                        :rules="[
                          v => !!v || '逻辑判断不能为空',
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
                    <v-col
                      cols="8"
                    >
                      <v-text-field
                        label = "指标阈值："
                        required
                        :counter="50"
                        :rules="indexThresholdRules"
                        v-model.trim="formAdd.indexThreshold"
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
                        v-model="formAdd.informManner"
                        item-text="text"
                        item-value="value"
                        :items="informMannerItems"
                        label = "通知方式："
                        required
                        :rules="[
                          v => !!v || '通知方式不能为空',
                        ]"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="informMannerChange(formAdd.informManner)"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col
                      cols="8"
                      class="mb-6"
                    >
                       <treeselect
                        :value-consists-of="valueConsistsOf"
                        :multiple="isMultiple"
                        :options="informGroupItems"
                        placeholder="通知群组"
                        :default-expand-level="1"
                        noChildrenText="没有数据"
                        v-model="formAdd.informGroup"
                      >
                      </treeselect>
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
import { searchNoQuoteLogEdit, searchNoQuoteLog } from '../../api/earlyWarningPolicyTemplateManagement.js';
import { delrecord, addRecord } from '../../api/EarlyWarningTemplateManagement.js';
import { searchStrategy, addStrategy, amendStrategy, removeStrategy, phoneNoteTreeArray, emailTreeArray } from '../../api/EarlyWarningStrategyConfiguration.js';
import { isRefrecord } from '../../api/transactionTypeConfig.js';
import BaseCreate from '@/components/BaseCreate';
import BaseSearch from '@/components/BaseSearch';
import DelDialog from '@/components/DelDialog';
import { mapGetters, mapActions } from 'vuex';
import { Treeselect, LOAD_ROOT_OPTIONS } from '@riophae/vue-treeselect';
import { NO_SPACE_RISK, NO_SPACE_TEXT } from 'utils/validate';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
const moment = require('moment');
// eslint-disable-next-line promise/param-names
const sleep = d => new Promise(r => setTimeout(r, d));
let called = false;
export default {
  data () {
    return {
      newDate: null,
      indexThresholdRules: [
        v => !!v || '指标阈值不能为空',
        // eslint-disable-next-line no-mixed-operators
        v => v && v.length <= 50 || '最多只能输入50个字符',
        v => NO_SPACE_RISK.test(v) || NO_SPACE_TEXT
        // v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
      ],
      counter: 0,
      fullHeight: window.innerHeight,
      noteOrEmailTemplate: 1,
      // 搜索条件
      isdateShow: false,
      isUpdateShow: false,
      searchValid: true,
      isExpanded: true, // 搜索折叠功能。true为打开状态
      form: {
        templateName: '', // 预警策略模板名称
        warnContent: '', // 预警策略模板标识
        appId: '', // 预警渠道
        dates: [] // 创建时间
      },
      channelItems: [],
      // 列表
      constHeader: [
        { text: '预警策略名称', value: 'templateName', sortable: false },
        { text: '预警内容', value: 'warnContent', sortable: false },
        { text: '预警渠道', value: 'appId', sortable: false },
        { text: '创建时间', value: 'createTime', sortable: false },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      constItem: [],
      editItemId: '', // 编辑当前项的id
      editItemObj: '', // 编辑的当前项
      loading: false,
      searchFirstPlaceholder: '预警策略名称',
      searchSecondPlaceholder: '预警内容',
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
        name: '查看预警邮件模板',
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
        appId: '', // 预警渠道
        strategyTemplateId: '', // 预警策略名称
        strategyParametersName: '', // 预警参数
        logicalJudgment: '', // 逻辑判断
        indexThreshold: '', // 指标阈值
        informManner: '', // 通知方式
        informGroup: null // 通知群组
      },
      strategyTemplateName: '',
      // 添加保存成功后，用来表示是否添加引用记录
      isFromNewAdd: false,
      tradeTypeProperty: [],
      valueConsistsOf: 'LEAF_PRIORITY',
      nodeList: [],
      isMultiple: true,
      channelItemsCopy: [], // 预警渠道
      logicalJudgmentItems: [ // 逻辑判断
        {
          text: '>=',
          value: '>='
        },
        {
          text: '<=',
          value: '<='
        },
        {
          text: '>=',
          value: '>='
        },
        {
          text: '=',
          value: '='
        },
        {
          text: '>',
          value: '>'
        },
        {
          text: '<',
          value: '<'
        }
      ],
      informMannerItems: [ // 通知方式
        {
          text: '邮件',
          value: 'EMAIL'
        },
        {
          text: '短信',
          value: 'SMS'
        }
      ],
      informGroupItems: [], // 通知群组
      // 增加按钮权限
      addStrategyBtn: '/addWarningStrategyButton', // 添加按钮是否展示
      editStrategyBtn: '/editWarningStrategyButton', // 当编辑按钮展示时，控制baseCreate中的编辑开关
      deleteStrategyBtn: '/deleteWarningStrategyButton', // 删除按钮权限
      copyItemAppId: '' // copy编辑时的渠道。
    };
  },
  components: {
    DelDialog,
    BaseSearch,
    Treeselect
    // BaseCreate
  },
  computed: {
    ...mapGetters([
      'appId'
    ]),
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
    this.channelItems = JSON.parse(localStorage.getItem('loginData')).appList;
    this.channelItemsCopy = Object.assign([], JSON.parse(localStorage.getItem('loginData')).appList);
    this.channelItems.unshift({
      id: '',
      appName: '全部'
    });
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
    this.searchStrategy();
  },
  methods: {
    // 预警方式change事件
    informMannerChange (value) {
      if (value === 'SMS') {
        this.getPhoneNoteTreeArray();
      } else {
        this.getEmailTreeArray();
      }
    },
    // 获取预警短信树
    async getPhoneNoteTreeArray () {
      const res = await phoneNoteTreeArray();
      if (res.data.code === 200) {
        this.informGroupItems = this.delChildren(res.data.data);
      }
    },
    // 获取预警邮箱树
    async getEmailTreeArray () {
      const res = await emailTreeArray();
      if (res.data.code === 200) {
        this.informGroupItems = this.delChildren(res.data.data);
      }
    },
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 根据渠道获取未被引用的策略模板
    getNoteOrEmailTemplateName (appId, editItemObj) {
      let param = {};
      if (this.addOrEditHeader.isEdit) { // 编辑模式
        if (editItemObj.appId !== this.formAdd.appId) {
          this.addGetNoteOrEmailTemplateName(param, appId);
        } else {
          param = {
            type: 'APP',
            id: editItemObj.strategyTemplateId,
            appId: this.formAdd.appId
          };
          searchNoQuoteLogEdit(param)
            .then(res => {
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  res.data.data.forEach((item, index, ary) => {
                    ary[index].text = item.templateName;
                    ary[index].value = item.id;
                  });
                  this.noteOrEmailTemplateName = res.data.data;
                  this.noteOrEmailTemplateName.forEach((im, index, ary) => {
                    if (im.id === editItemObj.strategyTemplateId) {
                      this.formAdd.strategyParametersName = im.templateParamName;
                    }
                  });
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
        }
      } else { // 添加模式
        this.addGetNoteOrEmailTemplateName(param, appId);
        // param = {
        //   appId: appId,
        //   type: 'STRATEGY_CONFIG'
        // };
        // searchNoQuoteLog(param)
        //   .then(res => {
        //     if (res.data.code === 200) {
        //       if (res.data.data.length > 0) {
        //         res.data.data.forEach((item, index, ary) => {
        //           ary[index].text = item.templateName;
        //           ary[index].value = item.id;
        //         });
        //         this.noteOrEmailTemplateName = res.data.data;
        //       } else {
        //         this.noteOrEmailTemplateName = [];
        //       }
        //     } else {
        //       this.snackbarServe = true;
        //       this.snackbarServeMsg = res.data.msg;
        //       this.snackbarServeColor = 'error';
        //     }
        //   },
        //   err => {
        //     this.snackbarServe = true;
        //     this.snackbarServeMsg = err.msg;
        //     this.snackbarServeColor = 'error';
        //   });
      }
    },
    addGetNoteOrEmailTemplateName (param, appId) {
      param = {
        appId: appId,
        type: 'APP'
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
    // 延迟加载
    async loadOptions ({ action }) {
      if (action === 'LOAD_ROOT_OPTIONS') {
        if (!called) {
          await sleep(2000);
          called = true;
          throw new Error('Failed to load options: test.');
        } else {
          await sleep(2000);
          this.options = [ 'a', 'b', 'c', 'd', 'e' ].map(id => ({
            id,
            label: `option-${id}`
          }));
        }
      }
    },
    // 获取列表内容
    searchStrategy () {
      this.baseFilterDate(this.form.dates);
      // this.baseFilterDate(this.form.updates);
      let pageParms = {
        pageIndex: this.pageNum, // 第几页
        pageSize: this.perPageNum, // 每页显示条数
        warnContent: this.form.warnContent ? this.form.warnContent : '',
        appId: this.form.appId ? this.form.appId : '',
        templateName: this.form.templateName ? this.form.templateName : '',
        startTime: this.form.dates.length === 2 ? this.form.dates[0] : '',
        endTime: this.form.dates.length === 2 ? this.form.dates[1] : ''
        // updateTimeStart: this.form.updates.length === 2 ? this.form.updates[0] : '',
        // updateTimeEnd: this.form.updates.length === 2 ? this.form.updates[1] : ''
      };
      searchStrategy(pageParms)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.list.length > 0) {
              let dataMap = res.data.data.list;
              this.constItem = dataMap;
              this.totalItems = res.data.data.totalElements;
              this.queryPageLength = res.data.data.totalPages;
              if (this.isFromNewAdd) { // 判断是否添加的保存，如果是添加的保存就添加引用记录
                let addRecordParam = res.data.data.list[0];
                this.addRecord(addRecordParam);
                this.addTemplateAppRecord(addRecordParam);
                this.addAppRecord(addRecordParam);
                this.isFromNewAdd = false;
              }
            } else {
              this.constItem = [];
              this.totalItems = res.data.data.totalElements;
              this.queryPageLength = res.data.data.totalPages;
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
      this.searchStrategy();
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
        sourceId: params.id,
        targetId: params.strategyTemplateId,
        target_type: 'STRATEGY_CONFIG'
      };
      let addParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await addRecord(addParams);
      } catch (err) {}
    },
    // 添加模板与渠道的引用记录
    async addTemplateAppRecord (params) {
      let param = {
        sourceId: params.strategyTemplateId,
        targetId: params.appId,
        target_type: 'APP'
      };
      let addParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await addRecord(addParams);
      } catch (err) {}
    },
    async addAppRecord (params) {
      let param = {
        sourceId: params.id,
        targetId: params.appId,
        target_type: 'APP'
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
        target_type: 'STRATEGY_CONFIG'
      };
      let delParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await delrecord(delParams);
      } catch (err) {}
    },
    // 删除模板与渠道引用记录
    async delTemplateAppRecord (params) {
      let param = {
        sourceId: params.strategyTemplateId,
        targetId: params.appId,
        target_type: 'APP'
      };
      let delParams = {
        jsonStr: JSON.stringify([param])
      };
      try {
        await delrecord(delParams);
      } catch (err) {}
    },
    async delAppRecord (params) {
      let param = {
        sourceId: params.appId,
        targetId: params.id,
        target_type: 'APP'
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
      // this.getNoteOrEmailTemplateName();
      this.dialog = true;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.addOrEditHeader = {
        name: '添加预警策略配置',
        value: 'add',
        isEdit: false
      };
    },
    // 添加--保存
    _addItem () {
      if (this.formAdd.informGroup) {
        const parms = {
          appId: this.formAdd.appId,
          strategyTemplateId: this.formAdd.strategyTemplateId,
          countSymbol: this.formAdd.logicalJudgment,
          threshold: this.formAdd.indexThreshold,
          warnType: this.formAdd.informManner,
          warnObjectIds: JSON.stringify(this.formAdd.informGroup),
          templateName: this.strategyTemplateName
        };
        this.$refs.formAdd.reset();
        this.formAdd.informGroup = null;
        this.informGroupItems = [];
        addStrategy(parms).then(res => {
          if (res.data.code === 200) {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.isFromNewAdd = true;
            this.isEditMode = false;
            this.searchStrategy();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        });
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = '通知群组不能为空！';
        this.snackbarServeColor = 'error';
      }
    },
    // 编辑--弹窗
    editFunc (item, index) {
      let pageParms = {
        type: 'STRATEGY_CONFIG',
        id: item.strategyTemplateId,
        appId: item.appId
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
              this.formAdd.appId = item.appId;
              this.formAdd.strategyTemplateId = item.strategyTemplateId;
              this.formAdd.indexThreshold = item.threshold;
              this.formAdd.logicalJudgment = item.countSymbol;
              this.formAdd.informManner = item.warnType;
              this.noteOrEmailTemplateName.forEach((im, index, ary) => {
                if (im.id === item.strategyTemplateId) {
                  this.formAdd.strategyParametersName = im.templateParamName;
                }
              });
              if (item.warnType === 'EMAIL') {
                emailTreeArray().then(res => {
                  if (res.data.code === 200) {
                    this.informGroupItems = this.delChildren(res.data.data);
                    this.formAdd.informGroup = item.warnObjectIds.split(',');
                    this.dialog = true;
                  }
                });
              } else {
                phoneNoteTreeArray().then(res => {
                  if (res.data.code === 200) {
                    this.informGroupItems = this.delChildren(res.data.data);
                    this.formAdd.informGroup = item.warnObjectIds.split(',');
                    this.dialog = true;
                  }
                });
              }
              this.addOrEditHeader = {
                name: '查看预警策略配置',
                value: 'edit',
                isEdit: true
              };
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
      /* const parms = {
        templateName: this.formAdd.noteTemplateName,
        strategyTemplateId: this.formAdd.strategyTemplateId,
        templateContent: this.formAdd.noteTemplateValue
      }; */
      if (this.formAdd.informGroup) {
        const parms = {
          id: this.editItemId,
          appId: this.formAdd.appId,
          strategyTemplateId: this.formAdd.strategyTemplateId,
          countSymbol: this.formAdd.logicalJudgment,
          threshold: this.formAdd.indexThreshold,
          warnType: this.formAdd.informManner,
          warnObjectIds: JSON.stringify(this.formAdd.informGroup),
          templateName: this.strategyTemplateName
        };
        amendStrategy(parms).then(res => {
          if (res.data.code === 200) {
            // let recordParams = {
            //   id: this.editItemObj.id,
            //   strategyTemplateId: parms.strategyTemplateId
            // };
            this.delRecord(this.editItemObj);
            this.delTemplateAppRecord(this.editItemObj);
            this.delAppRecord(this.editItemObj);
            this.addRecord(this.editItemObj);
            this.addTemplateAppRecord(this.editItemObj);
            this.addAppRecord(this.editItemObj);
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.searchStrategy();
            this.isEditMode = false;
            this.$refs.formAdd.reset();
            this.formAdd.informGroup = null;
            this.informGroupItems = [];
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        });
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = '通知群组不能为空！';
        this.snackbarServeColor = 'error';
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
      let parms = {
        id: this.deteleId
      };
      removeStrategy(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.delRecord(this.deleteItemAry);
          this.delTemplateAppRecord(this.deleteItemAry);
          this.delAppRecord(this.deleteItemAry);
          this.searchStrategy();
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
    },
    // 编辑时，编辑开关的change事件
    onChange (e) {
      this.newDate = new Date().getTime();
      if (e === false) {
        if (this.noteOrEmailTemplate === 0) {
          this.addOrEditHeader = {
            name: '查看短信内容模板管理',
            value: 'edit',
            isEdit: true
          };
        } else {
          this.addOrEditHeader = {
            name: '查看预警策略配置',
            value: 'edit',
            isEdit: true
          };
        }
      } else {
        if (this.noteOrEmailTemplate === 0) {
          this.addOrEditHeader = {
            name: '编辑短信内容模板管理',
            value: 'edit',
            isEdit: true
          };
        } else {
          this.addOrEditHeader = {
            name: '编辑预警策略配置',
            value: 'edit',
            isEdit: true
          };
        }
      }
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.searchStrategy();
    },
    // 页数
    pageChange () {
      this.pageNum = 1;
      this.searchStrategy();
    },
    cancel () {
      this.dialog = false;
      this.isEditMode = false;
      this.$refs.formAdd.reset();
      this.formAdd.informGroup = null;
      this.informGroupItems = [];
    },
    save (a) {
      this.dialog = false;
      this.noteOrEmailTemplateName.forEach((item, index, ary) => {
        if (item.id === this.formAdd.strategyTemplateId) {
          this.strategyTemplateName = item.templateName;
        }
      });
      this.flg == 1 ? this._addItem(a) : this._editItem(a); //eslint-disable-line
    },
    // 树结构中children长度为零 删除此项children
    delChildren (array) {
      if (array.length) {
        array.forEach(item => {
          if (item.children && item.children.length) {
            item.children.forEach(child => {
              delete child.children;
            });
          }
        });
      }
      return array;
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
