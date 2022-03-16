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
          <v-spacer />
          <v-btn
            color="primary"
            class="mr-1 mt-1"
            @click="AddRuleSet"
            v-if="hasPermission(addRuleSetBtn)"
            >添加</v-btn
          >
          <v-btn
            color="primary"
            class="mr-1 ml-4 mt-1"
            disabled
            v-if="hasPermission(batchDeleteRuleSetBtn)"
            >批量删除</v-btn
          >
          <!-- <v-btn
            color="primary"
            class="mr-1 ml-4 mt-1"
            disabled
            v-if="hasPermission(batchExportRuleSetBtn)"
            >批量导出</v-btn
          > -->
          <v-btn color="primary" class="mr-1 ml-4 mt-1" @click="ruleSetExport"
          :loading="ExportLoading"
           v-if="hasPermission(batchExportRuleSetBtn)">
           批量导出
          </v-btn>
        </v-toolbar>
      </template>
      <!-- 表内容 -->
      <template v-slot:item.setName="{ item }">
        <span :title="`${item.setName}`">{{
          item.setName | ellipsis(16)
        }}</span>
      </template>
      <template v-slot:item.organizationId="{ item }">
        <span
          :title="item.organizationId | rulesetOrganization(organizationList)"
          >{{
            item.organizationId
              | rulesetOrganization(organizationList)
              | ellipsis(8)
          }}</span
        >
      </template>
      <template v-slot:item.appId="{ item }">
        <span :title="item.appId | rulesetApplication(applications)">{{
          item.appId | rulesetApplication(applications) | ellipsis(8)
        }}</span>
      </template>
      <template v-slot:item.transactionTypeId="{ item }">
        <span :title="item.transactionTypeId | rulesetTradeTypes(tradeTypes)">{{
          item.transactionTypeId | rulesetTradeTypes(tradeTypes) | ellipsis(8)
        }}</span>
      </template>
      <template v-slot:item.matchingModel="{ item }">
        <span
          :title="
            item.matchingModel
              | filtersShowRuleMatchingModel(ruleMatchingModels)
          "
          >{{
            item.matchingModel
              | filtersShowRuleMatchingModel(ruleMatchingModels)
              | ellipsis(8)
          }}</span
        >
      </template>
      <template v-slot:item.states="{ item }">
        <span :title="item.states | rulesetStatus(rulesetStatus)">{{
          item.states | rulesetStatus(rulesetStatus) | ellipsis(8)
        }}</span>
      </template>
      <template v-slot:item.version="{ item }">
        <span :title="item.version">{{ item.version | ellipsis(8) }}</span>
      </template>
      <template v-slot:item.compareVersion>
        <v-btn
          disabled
          @click="snackbar = true"
          v-if="hasPermission(compareVersionBtn)"
          >版本比较</v-btn
        >
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
              >mdi-pencil</v-icon
            >
          </template>
          <span>编辑</span>
        </v-tooltip>
        <v-tooltip bottom v-if="hasPermission(editRuleDetailsBtn)">
          <template v-slot:activator="{ on }">
            <v-icon
              v-if="hasPermission(editRuleDetailsBtn)"
              small
              class="mr-1"
              color="primary"
              v-on="on"
              @click="operateRules(item, false)"
              >mdi-bookmark-multiple</v-icon
            >
          </template>
          <span>编辑规则详情</span>
        </v-tooltip>
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <!--隐藏的操作选项-->
          <v-list>
            <!--导出-->
            <v-list-item v-if="hasPermission(exportNameDataBtn)">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <!-- <v-icon small class="mr-1" v-on="on" @click="snackbar = true"
                    >mdi-file-export</v-icon
                  > -->
                  <v-icon small class="mr-1"  color="primary" v-on="on" @click="singleExport(item,false)">mdi-file-export</v-icon>
                </template>
                <span>导出</span>
              </v-tooltip>
            </v-list-item>
            <!--引用记录-->
            <v-list-item v-if="hasPermission(showRuleRecordBtn)">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-1" v-on="on" @click="snackbar = true"
                    >mdi-content-duplicate</v-icon
                  >
                </template>
                <span>引用记录</span>
              </v-tooltip>
            </v-list-item>
            <!--提审-->
            <v-list-item v-if="(item.states === '4' || item.states === '6') && hasPermission(sentRuleSetButton) ">
            <!-- <v-list-item v-if="(item.states === '4' || item.states === '6') "> -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 "
                    color="primary"
                    v-on="on"
                    @click="sentRuleCheck(item)"
                    >mdi-folder-refresh-outline</v-icon
                  >
                </template>
                <span>提审</span>
              </v-tooltip>
            </v-list-item>
            <!---复制 v-if="hasPermission(copyRuleSetButton)" -->
            <v-list-item v-if="hasPermission(copyRuleSetButton)">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                      small
                      class="mr-1"
                      color="primary"
                       v-on="on"
                      @click="copyRuleItem(item)"
                      >
                      mdi-content-copy
                  </v-icon>
                </template>
                <span>复制</span>
              </v-tooltip>
            </v-list-item>
            <!--变更日志-->
            <v-list-item v-if="hasPermission(changeLogButton)">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }"  >
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    v-on="on"
                    color="primary"
                    @click="changeLogHandle(item)"
                    :disabled="item.ref"
                  >
                    mdi-clock-outline
                  </v-icon>
                </template>
                <span>变更日志</span>
              </v-tooltip>
            </v-list-item>
            <!--删除-->
            <v-list-item v-if="hasPermission(delRuleSetButton)">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }" >
                  <v-icon
                    small
                    class="mr-1"
                    color="primary"
                    v-on="on"
                    @click="deleteRuleSet(item)"
                    >mdi-delete</v-icon
                  >
                </template>
                <span>删除</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </v-menu>
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
                v-model="perPageNum"
                item-text="fieldName"
                item-value="fieldField"
                :items="perPageItems"
                dense
                width="27px"
                no-data-text="没有匹配数据"
                @change="pageNumChange"
              /> </span
            >条
            <span style="margin-left:15px">共{{ totalItems }}条</span>
            <v-spacer />
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
    <v-dialog
      v-model="RuleSetDialog"
      persistent
      scrollable
      max-width="500px"
      class="add-edut-ruleSet"
    >
      <v-card>
        <v-card-title>
          <!-- 新建模式 -->
          <v-toolbar-title>{{ addOrEditHeader.name }}</v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn class="mr-0" icon dark @click="cancelEditOrAddRuleSet">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="max-height: 600px;">
          <v-container>
            <slot>
              <v-row v-show="addOrEditHeader.value === 'edit'">
                <v-col cols="3"></v-col>
                <v-col cols="7" justify-left @click="clickEditSwitch">
                  <v-switch
                    v-model="addOrEditHeader.isEdit"
                    inset
                    dense
                    label="启用编辑"
                    v-if="hasPermission(editRuleSetBtn)"
                    :disabled="!editAndDelFlag"
                    @change="viewToEdit(addOrEditHeader.isEdit)"
                  ></v-switch>
                </v-col>
              </v-row>
              <!-- 新增模式 -->
              <div v-if="addOrEditHeader.value === 'add' || addOrEditHeader.value ==='copy'">
                <v-form ref="Form" v-model="valid" class="ruleSetAddOrEdit">
                  <v-row
                    v-for="(item, index) in addAndEditFormData"
                    :key="index"
                  >
                    <v-col
                      cols="2"
                      v-show="addOrEditHeader.value === 'add' || addOrEditHeader.value ==='copy'"
                    ></v-col>
                    <v-col cols="3" v-show="addOrEditHeader.value === 'edit'">
                      <div class="mt-2">{{ item.label }}:</div>
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
                        @input="inputValue(item)"
                      />
                    </v-col>
                    <v-col v-if="item.type === 'autocomplete'" cols="7">
                     <v-autocomplete
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
                    <v-col v-if="item.type === 'select'" cols="7">
                      <v-select
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :disabled = "item.disabled"
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
                    <v-col
                      v-if="item.type === 'treeSelect'"
                      cols="7"
                      style="margin-bottom:25px"
                    >
                      <treeselect
                        :clearable="false"
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
              <div
                v-if="
                  addOrEditHeader.value === 'edit' && addOrEditHeader.isEdit
                "
              >
                <v-form ref="Form" v-model="valid" class="ruleSetAddOrEdit">
                  <v-row
                    v-for="(item, index) in addAndEditFormData"
                    :key="index"
                  >
                    <v-col
                      cols="2"
                      v-show="addOrEditHeader.value === 'add' || addOrEditHeader.value ==='copy'"
                    ></v-col>
                    <v-col cols="3" v-show="addOrEditHeader.value === 'edit'">
                      <div class="mt-2">{{ item.label }}:</div>
                    </v-col>
                    <v-col v-if="item.type === 'text'" cols="7">
                      <v-text-field
                        :required="item.required"
                        :rules="item.rules"
                        v-model.trim="item.value"
                        outlined
                        dense
                        label
                        :disabled = "item.disabled"
                        :type="item.inputType"
                        @input="inputValue(item)"
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
                        :disabled = "item.disabled"
                        outlined
                        dense
                        @change="changeValue(item)"
                      />
                    </v-col>
                    <v-col v-if="item.type === 'autocomplete'" cols="7">
                     <v-autocomplete
                        v-model="item.value"
                        :item-text="item.selectText"
                        :item-value="item.selectField"
                        :items="item.options"
                        :required="item.required"
                        :disabled = "item.disabled"
                        :rules="item.rules"
                        :multiple="item.multiple"
                        @change="changeValue(item)"
                        no-data-text="没有匹配数据"
                        :label="item.label"
                        outlined
                        dense
                     />
                    </v-col>
                    <v-col
                      v-if="item.type === 'treeSelect'"
                      cols="7"
                      style="margin-bottom:25px"
                    >
                      <treeselect
                        :value-consists-of="item.valueConsistsOf"
                        :multiple="item.isMultiple"
                        :disabled = "item.disabled"
                        :clearable="false"
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
              <div
                v-if="
                  addOrEditHeader.value === 'edit' && !addOrEditHeader.isEdit
                "
              >
                <v-form ref="Form" v-model="valid">
                  <v-row
                    v-for="(item, index) in addAndEditFormData"
                    :key="index"
                  >
                    <v-col cols="4">
                      <div class="mt-2">{{ item.label }}:</div>
                    </v-col>
                    <v-col cols="7">
                      <span v-if="index === 0" class="itemValue">
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
                      <span
                        v-if="index === 1"
                        class="itemValue"
                        style="padding-left:10px"
                        >{{
                          item.value | rulesetOrganization(organizationList)
                        }}</span
                      >
                      <span v-if="index === 2" class="itemValue">
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
                      <span v-if="index === 3" class="itemValue">

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
                      <span v-if="index === 4" class="itemValue">
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
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div
            v-if="
              addOrEditHeader.value === 'add' || addOrEditHeader.value ==='copy'||
                (addOrEditHeader.value === 'edit' && addOrEditHeader.isEdit)
            "
          >
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelEditOrAddRuleSet"
              >取消</v-btn
            >
            <v-btn
              class="primary mr-4"
              style="margin-right:10px;color:white"
              @click="confirmEditOrAddRuleSet"
              :disabled="!valid"
              >保存</v-btn
            >
          </div>
          <div v-else>
            <v-btn class="primary mr-4" @click="cancelEditOrAddRuleSet"
              >确定</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 确定删除的弹窗 -->
    <del-dialog
      :isDialogShow="isDialogDelShow"
      @cancelDel="isDialogDelShow = false"
      @confimDel="confirmDelFun"
    ></del-dialog>
    <!-- 调接口结果的提示框 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
      >{{ snackbarServeMsg }}</v-snackbar
    >

    <!--送审弹框--->
    <v-dialog
      v-model="SendCheckoutDialog"
      persistent
      scrollable
      max-width="680px"
      class="add-edut-ruleSet"
    >
      <v-card>
        <v-card-title>
          <!-- 新建模式 -->
          <v-toolbar-title>提交审核</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-btn class="mr-0" icon dark @click="cancelRuleSend">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="sendCheckform">
            <v-row no-gutters>
              <v-col cols="6" md="6">
                <div class="pa-2" outlined tile>
                  规则集名称：{{ sendCheckData.setName }}
                </div>
              </v-col>
              <v-col cols="6" md="6">
                <div class="pa-2" outlined tile>
                  <span :title="sendCheckData.transactionTypeId| rulesetTradeTypes(tradeTypes)">
                    交易类型：{{sendCheckData.transactionTypeId| rulesetTradeTypes(tradeTypes) | ellipsis(16) }}</span>
                </div>
              </v-col>
              <v-col cols="6" md="6">
                <div class="pa-2" outlined tile>
                  规则匹配模式：
                  <span :title=" sendCheckData.matchingModel | filtersShowRuleMatchingModel(ruleMatchingModels)">
                    {{ sendCheckData.matchingModel | filtersShowRuleMatchingModel(ruleMatchingModels) | ellipsis(16)}}</span
                  >
                </div>
              </v-col>
              <v-col cols="6" md="6">
                <div class="pa-2" outlined tile>
                  版本：{{ sendCheckData.version }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" md="6">
                <div>版本变更原因*：</div>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="reason"
                  outlined
                  name="input-7-4"
                  label="版本变更原因"
                  rows="3"
                  counter="500"
                  :rules="[
                    v => (v && !!v) || '版本变更原因不能为空',
                    v => (v && v.length <= 500) || '最多只能输入500个字符'
                  ]"
                  value=""
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" md="6">
                <div>版本变更内容描述*：</div>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="description"
                  outlined
                  name="input-7-4"
                  rows="3"
                  label="版本变更内容描述"
                  value=""
                  counter="500"
                  :rules="[
                    v => (v && !!v) || '版本变更内容描述不能为空',
                    v => (v && v.length <= 500) || '最多只能输入500个字符'
                  ]"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row >
              <v-col cols="3" >
                <div>选择审核人员*：</div>
              </v-col>
              <v-col cols="7" style="padding:0!important">
                <v-autocomplete
                  v-model="SendPerson.value"
                  :items="SendPerson.options"
                  :required="SendPerson.required"
                  :rules="SendPerson.rules"
                  item-text="selectText"
                  item-value="selectField"
                  label="请选择"
                  no-data-text="没有匹配数据"
                  @change="personChange(SendPerson)"
                  return-object
                  outlined
                />
                <!-- <v-select
                      v-model="SendPerson.value"
                      :items="SendPerson.options"
                      :required="SendPerson.required"
                      :rules="SendPerson.rules"
                      item-text="selectText"
                      item-value="selectField"
                      label="请选择"
                      no-data-text="没有匹配数据"
                      @change="personChange(SendPerson)"
                      return-object
                      outlined
                    ></v-select> -->
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn style="mr-5" @click="cancelRuleSend()">取消</v-btn>
          <v-btn
            color="primary"
            class="mr-5"
            @click="saveRuleSend()"
            :disabled="isSend"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

     <!---导出遮罩层--->
   <loadingOverlays :overlay="overlay" :progress="progress" :title="title"></loadingOverlays>
  </div>
</template>
<script>
import * as dataService from 'api/ruleSet';
import delDialog from '@c/DelDialog';
import Treeselect from '@riophae/vue-treeselect';
import BaseSearch from '@c/BaseSearch';
import loadingOverlays from '@c/loadingOverlays';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

import {
  getList,
  getListTmp,
  getTmpListValue,
  getTmpPraList
} from '../../api/ruleTempLib.js';
export default {
  name: 'ruleSet',
  components: {
    delDialog,
    BaseSearch,
    Treeselect,
    loadingOverlays
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
              organization.push(OrganizationList[j].compName);
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
      ExportLoading: false,
      overlay: false,
      progress: 0, // 进度
      title: '正在导出...',
      counter: 0,
      panel: 1,
      fullHeight: window.innerHeight,
      valid: true,
      isSend: true,
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      perPageNum: 10,
      queryPageLength: 0,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 规则集列表表头
      rulesetHeaders: [
        { text: '规则集名称', value: 'setName', sortable: false },
        { text: '所属公司', value: 'organizationId', sortable: false },
        { text: '所属应用', value: 'appId', sortable: false },
        { text: '交易类型', value: 'transactionTypeId', sortable: false },
        {
          text: '规则匹配模式',
          value: 'matchingModel',
          width: '110px',
          sortable: false
        },
        { text: '状态', value: 'states', width: '80px', sortable: false },
        { text: '版本', value: 'version', width: '80px', sortable: false },
        { text: '版本比较', value: 'compareVersion', sortable: false },
        { text: '操作', value: 'action', sortable: false, width: '13%' }
      ],
      // SendPerson: [],
      SendPersoncurrentItem: [],
      SendPerson: {
        value: '',
        required: true,
        rules: [v => (v && !!v) || '审核人员不能为空'],
        type: 'select',
        multiple: false,
        options: []
      },
      reason: '', // 版本变更原因
      description: '', // 版本变更描述
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
      // 送审弹框数据
      sendCheckData: {
        setName: '',
        hisId: '',
        // organizationId: null,
        setId: '', // 规则集id
        appId: '',
        transactionTypeId: '',
        matchingModel: '',
        version: '',
        reason: '', // 版本变更原因
        description: '', // 版本变更描述
        // creatorId: '', // 创建人员id
        // creatorName: '', // 创建人员名称
        auditorsId: '', // 审核人员id
        auditorsName: '', // 审核人员名称
        states: '' // 审核状态
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
          options: [{ value: 'all', text: '全部公司' }]
        },
        {
          type: 'select',
          placeholder: '所属应用',
          value: '',
          options: [{ text: '全部应用', value: 'all' }]
        },
        {
          type: 'autocomplete',
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
            // 校验是否包含特殊字符
            (v) => {
              let specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
              if (v && v.length !== 0) {
                for (let i = 0; i < v.length; i++) {
                  if (specialKey.indexOf(v.substr(i, 1)) !== -1) {
                    return '不能包含特殊字符';
                  }
                }
                // return true;
              }
              return true;
            }
            // v =>
            //   /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”、；‘'，。、]/.test(
            //     v
            //   ) || '不能包含特殊字符'
          ]
        },
        {
          label: '所属公司*',
          value: '',
          required: true,
          rules: [v => (v && !!v.length) || '所属公司不能为空'],
          type: 'select',
          multiple: true,
          selectText: 'compName',
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
          type: 'autocomplete',
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
      // 所有公司的数组
      organizationList: [],
      // 当前用户授权的公司
      organizationListOfCurrentUser: [],
      // 所有应用
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
      // 0、删除状态 1、已输出 2、未知(暂不使用) 3、未配置 4、待提审 5、审核中 6、驳回
      rulesetStatus: [
        { value: '0', text: '删除状态' },
        { value: '1', text: '已输出' },
        { value: '2', text: '输出失败' },
        { value: '3', text: '未配置' },
        { value: '4', text: '待提审' },
        { value: '5', text: '审核中' },
        { value: '6', text: '驳回' }
      ],
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      timeout: 2000,
      isSnackbarTop: true,
      SendCheckoutDialog: false, // 送审弹框
      // 按钮权限
      addRuleSetBtn: '/addRuleSetButton', // 添加按钮是否显示
      batchDeleteRuleSetBtn: '/batchDeleteRuleSetButton', // 表格批量删除按钮
      batchExportRuleSetBtn: '/batchExportRuleSetButton', // 表格批量导出按钮
      compareVersionBtn: '/compareRuleSetVersionButton', // 版本比较按钮是否显示
      editRuleSetBtn: '/editRuleSetButton', // 编辑按钮是否显示
      editRuleDetailsBtn: '/editRuleDetailsButton', // 编辑规则按钮是否显示
      exportNameDataBtn: '/exportNameListDataButton', // 表格导出按钮
      showRuleRecordBtn: '/showRuleSetReferenceRecordButton', // 引用记录按钮
      delRuleSetButton: '/delRuleSetButton', // 引用记录按钮
      changeLogButton: '/changeLogButton', // 变更日志
      copyRuleSetButton: '/copyRuleSetButton', // 复制规则集
      sentRuleSetButton: '/sentRuleSetButton', // 提审
      //
      ruleIsExis: null, // 是否配置规则集、
      ruleSetPattern: '', // 是否是安全模式，调试模式
      refRecordStatus: '', // 0 -->未引用调试模式  1-->未引用安全模式 2-->已引用调试模式 3--> 已引用安全模式
      ruleSeIsReference: '', // 是否引用
      copyRuleId: ''// 当前复制的规则集id
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
    // 搜索表单的公司
    compOfSearch () {
      return this.searchParam[1].value;
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
    //  $route(){
    //    this.getRuleSetList();
    // },
    // '$route': 'getRuleSetList',
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 70;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    },
    compOfSearch (val) {
      if (val) {
        if (val === 'all') {
          this.getApplicationList();
        } else {
          let param = val;

          let app = this.getAppListOfComp(param);
          app.then(val => {
            let apps = [];
            this.searchParam[2].options = [
              {
                text: '全部应用',
                value: 'all'
              }
            ];
            val.forEach(element => {
              this.searchParam[2].options.push({
                text: element.appName,
                value: element.id
              });
            });
          });
        }
        //
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
          for (
            let versionIndex = 0;
            versionIndex < this.ruleSets[index].rulesetHistoryList.length;
            versionIndex++
          ) {
            this.ruleSets[index].versionList[versionIndex] = parseFloat(
              versionIndex + 1
            ).toFixed(1);
          }
        }
        for (let index = 0; index < this.ruleSets.length; index++) {
          const element = this.ruleSets[index];
          element.version = parseFloat(
            element.rulesetHistoryList.length
          ).toFixed(1);
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
      this.pageNum = 1;// 查询从第一页开始
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
    // 获取枚举下拉数据  所有公司
    async getOrganizationList () {
      try {
        const response = await dataService.getSubordinateFirm();
        this.organizations = response.data.data.companyItems;
        this.organizationList = response.data.data.companyItems;
        if (this.organizations.length > 0) {
          this.organizations.forEach((item, index, ary) => {
            this.searchParam[1].options.push({
              text: item.label,
              value: item.id
            });
          });
        }
      } catch (error) {}
    },
    // 获取当前用户被授权的公司
    async getOrganizationListOfCurUser () {
      try {
        const response = await dataService.initDepartment();
        this.organizations = response.data.data;
        this.organizationList = response.data.data;
        this.organizationListOfCurrentUser = response.data.data;
        if (this.organizations.length > 0) {
          this.organizations.forEach((item, index, ary) => {
            this.searchParam[1].options.push({
              text: item.compName,
              value: item.id
            });
          });
        }
        this.addAndEditFormData[1].options = JSON.parse(
          JSON.stringify(this.organizationListOfCurrentUser)
        );
      } catch (error) {}
    },
    // 获取枚举下拉数据  当前所选公司下的应用
    async getAppListOfComp (param) {
      let params = {
        companyIds: param
      };
      try {
        const response = await dataService.getCompanys(params);
        let applications = response.data.data;
        return applications;
      } catch (error) {}
    },
    // 获取枚举下拉数据  所有应用
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

            //  安全模式且被引用  可修改的字段   所属应用、交易类型

            if (this.refRecordStatus === 3) {
              // 交易类型 被引用---不可修改
              console.log(this.addAndEditFormData[3].value, '被选中的参数', this.addAndEditFormData[3].options, '所有的选项');
              this.addAndEditFormData[3].options.forEach((opItem) => {
                let isHave = false;
                this.addAndEditFormData[3].value.forEach((item) => {
                  if (opItem.selectField === item) {
                    isHave = true;
                  }
                });
                opItem.disabled = isHave;
              });
            }
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
      this.addAndEditFormData[2].options = [];
      this.addAndEditFormData[3].options = [];
      this.addAndEditFormData[4].disabled = false;
      this.isAddRuleSet = true;
      this.RuleSetDialog = !this.RuleSetDialog;
    },
    // 编辑规则集
    async editRuleset (item) {
      console.log(item, 'dfdfdfdfdfddddddddddd');
      let apps = this.getAppListOfComp(item.organizationId);
      apps.then((value) => {
        value.forEach(element => {
          this.addAndEditFormData[2].options.push({
            selectText: element.appName,
            selectField: element.id
          });
        });
      });
      this.editAndDelFlag = true;
      let params = { ruleSetId: item.id };
      let res = await dataService.getIsEditParam(params); // 判断安全、调试模式
      this.ruleIsExis = res.data.data.ruleIsExist;
      this.ruleSetPattern = res.data.data.ruleSetPattern; // 1 安全， 0 调试
      this.refRecordStatus = res.data.data.refRecordStatus; // 0 -->未引用调试模式  1-->未引用安全模式 2-->已引用调试模式 3--> 已引用安全模式
      try {
        this.addOrEditHeader = {
          name: '查看规则集',
          value: 'edit',
          isEdit: false
        };
        this.RuleSetDialog = !this.RuleSetDialog;// 放到此处，不管是覅有数据，确保弹框能弹出。。。
        // console.log( this.RuleSetDialog ,'是否弹框')
        this.addAndEditFormData[0].value = item.setName;
        this.addAndEditFormData[1].value = item.organizationId != null ? item.organizationId.split(',') : '';
        this.addAndEditFormData[2].value = item.appId.split(',');
        this.addAndEditFormData[3].value = item.transactionTypeId.split(',');
        this.addAndEditFormData[4].value = item.matchingModel;

        //  安全模式且被引用  可修改的字段   所属应用、交易类型
        if (this.refRecordStatus === 3) {
          // console.log(this.addAndEditFormData,'表单数据')
          this.addAndEditFormData[0].disabled = true;
          this.addAndEditFormData[1].disabled = true;
          this.addAndEditFormData[4].disabled = true;
          // 所属应用被引用---不可修改
          this.addAndEditFormData[2].options.forEach((opItem) => {
            let isHave = false;
            this.addAndEditFormData[2].value.forEach((item) => {
              if (opItem.selectField === item) {
                isHave = true;
              }
            });
            opItem.disabled = isHave;
          });

          // 交易类型 被引用---不可修改
          this.addAndEditFormData[3].options.forEach((opItem) => {
            let isHave = false;
            this.addAndEditFormData[3].value.forEach((item) => {
              if (opItem.selectField === item) {
                isHave = true;
              }
            });
            opItem.disabled = isHave;
          });
        } else {
          // 不是安全模式，且没有被引用下，都可以编辑
          this.addAndEditFormData[0].disabled = false;
          this.addAndEditFormData[1].disabled = false;
          this.addAndEditFormData[4].disabled = false;
          // 所属应用被引用---可修改
          this.addAndEditFormData[2].options.forEach((opItem) => {
            opItem.disabled = false;
          });

          // 交易类型 被引用---可修改
          this.addAndEditFormData[3].options.forEach((opItem) => {
            opItem.disabled = false;
          });
        }
        // this.RuleSetDialog = !this.RuleSetDialog;
        this.RuleSet = item;
      } catch (error) {}
    },
    // 编辑弹窗 点击编辑的开关按钮
    async clickEditSwitch () {
      console.log(this.ruleIsExis, '是否配置规则。。。');
      // if (this.refRecordStatus === 0 || this.refRecordStatus === 1) {
      //   this.snackbarServe = true;
      //   this.snackbarServeMsg = '该规则集已经配置规则，请谨慎修改';
      //   this.snackbarServeColor = '#ffc107';
      // }

      // 已引用调试模式下的情况下提示谨慎修改
      if (this.refRecordStatus === 2) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '该规则集已经被引用，请谨慎修改';
        this.snackbarServeColor = '#ffc107';
      }

      // 配置规则 谨慎删除
      if (this.ruleIsExis > 0) {
        this.snackbarServe = true;
        this.snackbarServe = true;
        this.snackbarServeMsg = '该规则集已经配置规则，请谨慎修改';
        this.snackbarServeColor = '#ffc107';
      }
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
        console.log(item, 'dddd');
        if (item.label === '规则集名称*') {
          setname = item.value;
        } else if (item.label === '所属公司*') {
          orgainztionid = item.value.join(',');
        } else if (item.label === '所属应用*') {
          appId = item.value.join(',');
        } else if (item.label === '交易类型*') {
          transactionTypeId = item.value.join(',');
          console.log(transactionTypeId, 'ssdfdf');
        } else if (item.label === '规则匹配模式*') {
          matchinmodel = item.value;
        }
      });
      // 复制的情况下，直接获取规则匹配模式
      let riskValue = [{ from: '0', to: '20', strategy: '' }];
      let copyParam = {};// 复制对象参数
      if (this.addOrEditHeader.value === 'copy') {
        copyParam = {
          id: this.copyRuleId,
          setName: setname,
          organizationId: orgainztionid,
          appId: appId,
          transactionTypeId: transactionTypeId,
          matchingModel: this.addAndEditFormData[4].value.selectField,
          riskThreshold: JSON.stringify(riskValue)
        };
      }

      let params = {
        setName: setname,
        organizationId: orgainztionid,
        appId: appId,
        transactionTypeId: transactionTypeId,
        matchingModel: matchinmodel,
        riskThreshold: JSON.stringify(riskValue)
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
        } catch (error) {}
      } else if (this.addOrEditHeader.value === 'copy') {
        // 复制
        console.log(copyParam, 'copySave~~~');
        try {
          const copyResponse = await dataService.copyRuleSetFun(copyParam);
          const copyCode = copyResponse.data.code;
          if (copyCode > 0) {
            this.RuleSetDialog = false;
            this.snackbarServe = true;
            this.snackbarServeMsg = '复制成功';
            this.snackbarServeColor = 'primary';
            this.getRuleSetList();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = copyResponse.data.msg;
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
        console.log(param, '编辑保存');
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
    // 复制规则集
    copyRuleItem (item) {
      console.log(item, this.addAndEditFormData[0], 'copy11111');
      this.copyRuleId = item.id;
      if (this.$refs.Form) {
        this.$refs.Form.reset();
      }
      this.addOrEditHeader = {
        name: '复制生成新规则集',
        value: 'copy',
        isEdit: false
      };
      this.addAndEditFormData[1].value = [];
      this.addAndEditFormData[2].options = [];
      this.addAndEditFormData[3].options = [];
      // 所属模式不可变更，从当前记录获取

      this.addAndEditFormData[4].options.forEach((optionItem) => {
        console.log(optionItem, '所属规则模式');
        if (optionItem.selectField === item.matchingModel) {
          this.addAndEditFormData[4].value = optionItem;
          this.addAndEditFormData[4].disabled = true;
        }
      });

      this.isAddRuleSet = true;
      this.RuleSetDialog = !this.RuleSetDialog;
      console.log(this.addOrEditHeader.value, this.copyRuleId, 'copy....');
    },
    // 获取送审弹框里面审核人员
    async getRulesetAuditor (param) {
      let params = {
        appIds: param
      };
      const response = await dataService.getAuditUserList(params);
      // const response = await dataService.getAuditUserList()
      const res = response.data.data;
      const code = response.data.code;
      if (code === 200) {
        if (res.length > 0) {
          // console.log(res,'审核人员列表121');
          this.SendPerson.options = [];
          res.forEach(item => {
            // this.SendPersoncurrentItem.push(item.id);
            this.SendPerson.options.push({
              selectText: item.name,
              selectField: item.id
            });
          });
        } else {
          this.SendPerson.options = [];
        }
      }
    },
    // 送审弹框 审核人changes 事件
    personChange (item) {
      if (item.value.selectField !== '') {
        this.isSend = false;
      } else {
        this.isSend = true;
      }
      //  this.SendPersoncurrentItem = item.value.selectField
    },
    // 送审按钮点击事件
    sentRuleCheck (item) {
      // this.description = ''; // 审核描述
      // this.SendPerson.options = []; // 清空审核人
      // this.reason = ''; // 审核原因
      this.SendCheckoutDialog = true; // 弹出送审弹框
      if (this.$refs.sendCheckform) {
        this.$refs.sendCheckform.reset();
      }
      let sStorage = window.sessionStorage;
      this.SendPerson.options = [];
      // console.log(item, '送审按钮点击');
      this.getRulesetAuditor(item.appId); // 送审弹框 审核人员
      // 规则集基本信息
      sStorage.setItem('ruleSet', JSON.stringify(item));
      // 版本号
      sStorage.setItem('versionNum', parseInt(item.version / 1));
      // 版本id
      item.rulesetHistoryList.forEach(element => {
        if (parseInt(item.version / 1) === element.histVersion) {
          sStorage.setItem('versionId', element.id);
          this.sendCheckData.hisId = element.id;
        }
      });

      this.sendCheckData = {
        setName: item.setName,
        setId: item.id, // 规则集id
        hisId: this.sendCheckData.hisId,
        // organizationId: item.orgainztionid,
        appId: item.appId,
        transactionTypeId: item.transactionTypeId,
        matchingModel: item.matchingModel,
        version: item.version,
        reason: '', // 版本变更原因
        description: '', // 版本变更描述
        // creatorId: '', // 创建人员id
        // creatorName: '', // 创建人员名称
        auditorsId: '', // 审核人员id
        auditorsName: '', // 审核人员名称
        states: item.states // 审核状态
      };
    },
    // 规则送审弹窗关闭
    cancelRuleSend () {
      this.$refs.sendCheckform.reset();// 重置表单
      this.SendCheckoutDialog = false;
    },
    // 送审按钮保存
    async saveRuleSend () {
      this.sendCheckData.reason = this.reason;
      this.sendCheckData.description = this.description;
      this.sendCheckData.auditorsId = this.SendPerson.value.selectField;
      this.sendCheckData.auditorsName = this.SendPerson.value.selectText;
      // this.description= sendCheckData.description
      if (this.sendCheckData.reason.length > 500) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '版本变更原因超出500字';
        this.snackbarServeColor = 'error';
        return;
      }
      if (this.sendCheckData.description.length > 500) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '版本变更描述超出500字';
        this.snackbarServeColor = 'error';
        return;
      }
      let sStorage = window.sessionStorage;
      sStorage.setItem('sendCheckData', JSON.stringify(this.sendCheckData));
      // submitExamine
      let param = this.sendCheckData;
      const response = await dataService.submitExamine(param);
      const code = response.data.code;
      if (code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '送审成功';
        this.snackbarServeColor = 'success';
        this.getRuleSetList(this.currentPage);
        this.SendCheckoutDialog = false;
      }
    },
    // 点击规则集删除按钮
    async deleteRuleSet (item) {
      let params = { ruleSetId: item.id };
      let res = await dataService.getIsEditParam(params); // 判断安全，调试模式
      this.ruleIsExis = res.data.data.ruleIsExist; // 是否配置规则
      this.ruleSetPattern = res.data.data.ruleSetPattern; // 1->安全模式  0 -> 调试模式
      this.refRecordStatus = res.data.data.refRecordStatus; // 0 -->未引用调试模式  1-->未引用安全模式 2-->已引用调试模式 3--> 已引用安全模式
      // 安全模式，被引用 --禁止删除
      if (this.refRecordStatus === 3) {
        this.snackbarServe = true;
        this.isDialogDelShow = false; //  弹出删除框
        this.snackbarServeMsg = '已引用，安全模式禁止删除';
        this.snackbarServeColor = 'error';
        return;
      }

      // 调试模式被引用 --谨慎删除
      if (this.refRecordStatus === 2) {
        this.snackbarServe = true;
        this.delRuleset = item;
        this.isDialogDelShow = true; //  弹出删除框
        this.confirmDelFun = this.confimDelRuleset; // 调用删除方法
        this.snackbarServeMsg = '该规则集已经被引用，请谨慎删除';
        this.snackbarServeColor = '#ffc107';
      }
      // 配置规则 谨慎删除
      if (this.ruleIsExis > 0) {
        this.snackbarServe = true;
        this.delRuleset = item;
        this.isDialogDelShow = true; //  弹出删除框
        this.confirmDelFun = this.confimDelRuleset; // 调用删除方法
        this.snackbarServeMsg = '该规则集已经配置规则，请谨慎删除';
        this.snackbarServeColor = '#ffc107';
        return;
      }

      // 没有被引用的情况下可以删除
      if (this.refRecordStatus === 0 || this.refRecordStatus === 1) {
        // this.snackbarServe = true;
        this.delRuleset = item;
        this.isDialogDelShow = true; //  弹出删除框
        this.confirmDelFun = this.confimDelRuleset; // 调用删除方法
        // this.snackbarServeMsg = '该规则集已经配置规则，请谨慎删除';
        // this.snackbarServeColor = '#ffc107';
      }

      // if (item.rulesetHistoryList.length > 1 && this.refRecordStatus === 3) {
      //   this.snackbarServe = true;
      //   this.snackbarServeMsg = '已引用，安全模式禁止删除';
      //   this.snackbarServeColor = 'error';
      // }
      // if (item.rulesetHistoryList.length > 1 && this.refRecordStatus === 2) {
      //   this.snackbarServe = true;
      //   this.delRuleset = item;
      //   this.isDialogDelShow = true; //  弹出删除框
      //   this.confirmDelFun = this.confimDelRuleset; // 调用删除方法
      //   this.snackbarServeMsg = '该规则集已经被引用或配置规则，请谨慎删除';
      //   this.snackbarServeColor = '#ffc107';
      //   return;
      // }
      // if (this.refRecordStatus === 2 || this.ruleIsExis > 0) {
      //   this.snackbarServe = true;
      //   // 规则集存在被引用的版本和有规则的时候不能删除
      //   this.delRuleset = item;
      //   this.isDialogDelShow = true; //  弹出删除框
      //   this.confirmDelFun = this.confimDelRuleset;
      //   this.snackbarServeMsg = '该规则集已经被引用或配置规则，请谨慎删除';
      //   this.snackbarServeColor = '#ffc107';
      //   return;
      // } else if (this.refRecordStatus === 0 || this.refRecordStatus === 1) {
      //   this.snackbarServe = false; // 不弹框
      // }

      // 如果是多个版本的话 不能删除或编辑
      // if (item.rulesetHistoryList.length > 1) {
      //   this.editAndDelFlag = false; // 启用编辑按钮是否可以开启
      // } else {
      //   this.editAndDelFlag = true;
      //   // 只有一个版本 已经有配置规则的时候
      //   // const param = {
      //   //   id: item.rulesetHistoryList[0].id
      //   // };
      //   // try {
      //   //   const response = await dataService.getVersionInfo(param);
      //   //   const code = response.data.code;
      //   //   if (code === 200) {
      //   //     if (response.data.data.ruleList.length > 0) {
      //   //       this.editAndDelFlag = false;
      //   //     }
      //   //   }
      //   // } catch (error) {}
      // }

      // 如果是多个版本的话 不能删除或编辑
      // if (item.rulesetHistoryList.length > 1) {
      //   this.editAndDelFlag = false;
      // } else {
      //   // 只有一个版本 已经有配置规则的时候
      //   const param = {
      //     id: item.rulesetHistoryList[0].id
      //   };
      //   try {
      //     const response = await dataService.getVersionInfo(param);
      //     const code = response.data.code;
      //     if (code === 200) {
      //       if (response.data.data.ruleList.length > 0) {
      //         this.editAndDelFlag = false;
      //       }
      //     }
      //   } catch (error) {}
      // }
      // 只有一个版本但是没有规则配置时候看是否被引用
      // if (this.editAndDelFlag) {
      //   const param = {
      //     sourceId: item.id,
      //     sourceType: 'RULE_SET',
      //     sourceVersion: parseInt(item.version / 1)
      //   };
      //   try {
      //     const response = await dataService.checkIsrefrecord(param);
      //     const code = response.data.code;
      //     if (code === 200) {
      //       if (response.data.data.isReference) {
      //         this.editAndDelFlag = false;
      //       }
      //     }
      //   } catch (error) {}
      // }
      // 规则集被引用或者配置规则不能删除
      // if (!this.editAndDelFlag) {
      //   this.snackbarServe = true;
      //   this.snackbarServeMsg = '规则集被引用或者已配置规则，不能删除';
      //   this.snackbarServeColor = 'error';
      // } else {
      //   // 规则集存在被引用的版本和有规则的时候不能删除
      //   this.delRuleset = item;
      //   this.isDialogDelShow = true;
      //   this.confirmDelFun = this.confimDelRuleset;
      // }
    },
    // 确定删除规则集
    async confimDelRuleset () {
      const param = { id: this.delRuleset.id };
      console.log(param, '删除规则集id111');
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
      } catch (error) {}
    },
    // 列表的版本下拉框change事件
    VersionChange (item) {
      this.currentVersion = parseInt(item.version / 1);
    },

    // 新增编辑规则集选择框change事件
    changeValue (item) {
      for (let index = 0; index < item.value.length; index++) {
        const element = item.value[index];
        if (!element) {
          item.value.splice(index, 1);
        }
      }
      if (item.label === '所属公司*') {
        this.addAndEditFormData[2].options = [];
        let apps = this.getAppListOfComp(item.value.join(','));
        // this.addAndEditFormData[2].options = [];
        apps.then(value => {
          value.forEach(element => {
            this.addAndEditFormData[2].options.push({
              selectText: element.appName,
              selectField: element.id
            });
          });
        });

        this.addAndEditFormData[2].value = '';
        this.addAndEditFormData[3].value = '';
      }
      if (item.label === '所属应用*') {
        // 没有被引用下清空交易类型，根据当前所选的所属引用--获取交易类型。。。
        this.getTradeTypeList(item.value, 2);
        if (!item.value.length) {
          item.value = '';
        }
        // 不是安全模式被引用的情况下，不清除交易类型
        if (this.refRecordStatus !== 3) {
          this.addAndEditFormData[3].value = '';
        }
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
      let params = { ruleSetId: item.id };
      let res = await dataService.getIsEditParam(params);
      let sStorage = window.sessionStorage;
      // 规则集基本信息
      sStorage.setItem('ruleSet', JSON.stringify(item));
      // 规则集是否需要审核
      sStorage.setItem('needAudit', res.data.data.gzjshpz);
      // 当前规则集模式 (0:调试模式  1:安全模式)
      sStorage.setItem('ruleSetPattern', res.data.data.ruleSetPattern);
      // 规则集状态
      sStorage.setItem('ruleSetStatus', item.states);
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
    },
    // 得到规则集 所属机构、中文，id
    getOrganizationText (dataStr) {
      let OrganizationList = this.organizationList;
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var OrganizationListObj = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < OrganizationList.length; j++) {
            if (element === OrganizationList[j].id) {
              OrganizationListObj.push({
                id: OrganizationList[j].id,
                text: OrganizationList[j].compName
              });
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        console.log(OrganizationListObj, '所属机构1111111');
        return OrganizationListObj;
      }
    },
    // 得到规则集 所属应用、中文，id
    getApplicationText (dataStr) {
      let applicationList = this.applications;
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var ApplicationListObj = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < applicationList.length; j++) {
            if (element === applicationList[j].id) {
              ApplicationListObj.push({
                id: applicationList[j].id,
                text: applicationList[j].appName
              });
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        console.log(ApplicationListObj, '所属应用222');
        return ApplicationListObj;
      }
    },
    // 得到规则集 所属应用、中文，id
    getTradeTypesText (dataStr) {
      let tradeTypesList = this.tradeTypes;
      if (dataStr && typeof dataStr === 'string') {
        dataStr = dataStr.split(',');
      }
      if (dataStr) {
        var tradeTypesListObj = [];
        for (let i = 0; i < dataStr.length; i++) {
          const element = dataStr[i];
          let hasValue = false;
          for (let j = 0; j < tradeTypesList.length; j++) {
            if (element === tradeTypesList[j].id) {
              tradeTypesListObj.push({
                id: tradeTypesList[j].id,
                text: tradeTypesList[j].tradeName
              });
              hasValue = true;
              break;
            }
          }
          if (hasValue) {
            continue;
          }
        }
        console.log(tradeTypesListObj, '交易类型最多不能超过200个');
        return tradeTypesListObj;
      }
    },
    // 变更日志
    changeLogHandle (item) {
      let sStorage = window.sessionStorage;
      // 规则集基本信息
      sStorage.setItem('ruleSet', JSON.stringify(item));
      let ruseObj = {}; // 存放交易类型，所属机构，所属应用
      let organizationTextObj = this.getOrganizationText(item.organizationId); // 所属机构
      let applicationListObj = this.getApplicationText(item.appId); // 所属应用
      let tradeTypeListObj = this.getTradeTypesText(item.transactionTypeId); // 交易类型

      ruseObj.organizationTextObj = organizationTextObj;
      ruseObj.applicationListObj = applicationListObj;
      ruseObj.tradeTypeListObj = tradeTypeListObj;

      let logObj = Object.assign(item, ruseObj);
      console.log(logObj, 'ggggggg');

      this.$router.push({
        name: 'changeLog',
        params: {
          changeItem: logObj
        }
      });
    },

    // 批量导出
    async ruleSetExport () {
      const params = {
        setName: this.searchParam[0].value,
        organizationId: this.searchParam[1].value,
        appId: this.searchParam[2].value,
        transactionTypeId: this.searchParam[3].value,
        matchingModel: this.searchParam[4].value
      };
      let keyStatus = new Date().getTime();// 随机生成时间戳
      setTimeout(() => {
        this.overlay = true;// 遮罩，弹框进度展示
        this.exportStatus(keyStatus, 'batchEx');// 导出状态判断
      }, 1000);

      await dataService.exportRuleSetData(keyStatus, params, { timeout: 1000000000000 }).then(response => {
        console.log(response.data.msg, '提示信息');
        if (response.status === 200) {
          this.overlay = false;
          this.title = '导出成功';
          let blob = new Blob([response.data], { type: 'application/zip;charset=utf-8' }); // 导出zip 格式
          console.log(response, '批量导出···');
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const filename = response.headers['content-disposition'].split(';')[1].split('=')[1];
          // console.log(decodeURI(filename), 'ssss');
          link.setAttribute('download', decodeURI(filename));
          // link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          this.snackbarServe = true;
          this.overlay = false;
          this.title = '导出失败';
          this.snackbarServeMsg = response.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.overlay = false;
        this.title = '导出失败';
        // this.ExportLoading = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    /** *单条记录导出****/
    async singleExport (item) {
      let keyStatus = new Date().getTime();// 随机生成时间戳
      const params = { id: item.id };
      setTimeout(() => {
        this.overlay = true;
        this.exportStatus(keyStatus, 'single');// 导出状态判断
      }, 1000);

      await dataService.exportRuleSetData(keyStatus, params, { timeout: 1000000000000 }).then(response => {
        if (response.status === 200) {
          this.overlay = false;
          this.title = '导出成功';
          let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
          console.log(response, 'response');
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const filename = response.headers['content-disposition'].split(';')[1].split('=')[1];
          // console.log(decodeURI(filename), 'ssss');
          link.setAttribute('download', decodeURI(filename));
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        // } else {
        //   this.exportStatus(keyStatus);// 导出状态判断
        // }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 导出状态
    exportStatus (keyStatus, flog) {
      dataService.exportStatus(keyStatus).then(res => {
        console.log(res.data.data, '进度条状态');
        if (res.data.code === 200) {
          this.progress = res.data.data;
          console.log(this.progress, 'dddd');
          if (this.progress < 100) {
            // 判断返回进度是否完成
            if (flog === 'single') {
              setTimeout(() => {
                this.exportStatus(keyStatus);
              }, 300);
            } else {
              setTimeout(() => {
                this.exportStatus(keyStatus);
              }, 500);
            }
          } else {
            this.overlay = false;
            this.message('导出成功', 'success');
          }
        } else {
          this.message(res.data.msg, 'error');
        }
      });
    },

    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
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
        this.searchData[Object.keys(this.searchData)[index]] =
          searchParamsForSession[index];
        if (searchParamsForSession[index] === 'all') {
          this.searchData[Object.keys(this.searchData)[index]] = '';
        }

        if (searchParamsForSession[index]) {
          this.panel = 0;
        }
      }
    }
    // 获取分页相关缓存
    this.perPageNum = sessionS.getItem('perPageNum')
      ? parseInt(sessionS.getItem('perPageNum'))
      : 10;
    this.pageNum = sessionS.getItem('pageNum')
      ? parseInt(sessionS.getItem('pageNum'))
      : 1;
    this.getRuleSetList();
    this.getApplicationList();
    this.getAllTradeTypeList();
    this.getOrganizationListOfCurUser();
  },
  // 离开规则集页面 可以访问到组件实例this
  beforeRouteLeave (to, from, next) {
    // 如果跳转的页面是规则集详情的页面 搜索条件有值 缓存
    let searchParamsForSession = {};
    this.searchParam.forEach(item => {
      searchParamsForSession[item.placeholder] = item.value || '';
    });
    if (to.name === 'ruleListDetail') {
      window.sessionStorage.setItem(
        'searchParam',
        JSON.stringify(Object.values(searchParamsForSession))
      );
      window.sessionStorage.setItem('perPageNum', this.perPageNum);
      window.sessionStorage.setItem('pageNum', this.pageNum);
    } else if (to.name === 'changeLog') {
      window.sessionStorage.setItem(
        'searchParam',
        JSON.stringify(Object.values(searchParamsForSession))
      );
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
<style lang="stylus">
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
.v-select.v-text-field--outlined:not(.v-text-field--single-line).v-input--dense .v-select__selections span{
  // width:130px;
  overflow: hidden;
  text-overflow:ellipsis!important;
  white-space: nowrap !important;
}
.v-application .pa-2{padding:8px 0!important;}
// .operationIcons >>>.theme--dark.v-btn.v-btn--icon {

//     color: var(--v-primary-base) !important;
//     caret-color: var(--v-primary-base) !important;
// }

</style>
