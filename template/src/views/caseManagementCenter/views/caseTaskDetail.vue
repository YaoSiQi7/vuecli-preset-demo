<template>
  <div>
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3 elevation-3',isFixed?'fixed':'']">
        <v-card-actions style="height:60px" v-if="!showSubmit && !showTransfer">
          <v-btn  class="ml-4 cancelButton" @click="cancel" outlined >返回</v-btn>
          <!-- <v-btn color="primary" class="ml-4" @click="doTrial" v-show="pendingTasks">审核</v-btn>-->
          <!-- <v-btn color="primary" class="ml-4" @click="transfer" v-show="pendingTasks"> 转派</v-btn>-->
          <v-btn color="primary" class="ml-4" v-if="showTrialOrTransfer && hasPermission('auditPendingTaskButton')" @click="doTrial">审核</v-btn>
          <v-btn color="primary" class="ml-4" v-if="showTrialOrTransfer && hasPermission('transferPendingTaskButton')" @click="transfer">转派</v-btn>
          <!-- <v-btn color="primary" class="ml-4" @click="review" v-if="taskDetail.title == '案件' || taskDetail.title === '疑似欺诈事件' || taskDetail.title === '清白件'">重审</v-btn> -->
        </v-card-actions>
        <!-- 点击转派 -->
        <v-card-actions style="height:60px" v-else-if="showTransfer">
          <v-btn  class="ml-4 cancelButton" @click="showTransfer = false" outlined >返回</v-btn>
          <v-btn  color="primary" class="ml-4" :disabled="!valid" @click="doTransfer" v-show="pendingTasks">提交</v-btn>
        </v-card-actions>
        <!-- 点击审核 -->
        <v-card-actions style="height:60px" v-else>
          <v-btn  class="ml-4 cancelButton" @click="showSubmit = false" outlined >返回</v-btn>
          <v-btn  class="ml-4" color="primary" :disabled="!valid" @click="stashData" v-show="pendingTasks">暂存</v-btn>
          <v-btn  color="primary" class="ml-4" :disabled="!valid" @click="doSubmit" v-show="pendingTasks">提交</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <!-- 设置任务转派对象 -->
    <v-card class="text-color elevation-3 mb-3" v-if="showTransfer" height="100">
      <v-row>
        <v-col cols="6">
          <v-form ref="form" v-model="valid" :lazy-validation="lazy">
            <div class="mb-4">
              <span class="span_left">
                选择转派人员
              </span>
                <span class="span_right">
                <v-autocomplete
                  required
                  :rules= "transferRules"
                  v-model="selectForm.transferPerson"
                  :items="transferPersonItems"
                  dense
                  outlined
                  chips
                  :multiple="false"
                  placeholder="请选择转派人员"
                  no-data-text="没有匹配数据"
                  :full-width="true"
                />
              </span>
            </div>
            <!--<div class="mb-4" v-if="!showTransferGroup">
              <span class="span_left">
                选择初审审核组
              </span>
              <span class="span_right">
                <v-autocomplete
                  required="true"
                  :rules= "reviewFirstGroupRules"
                  v-model="selectForm.reviewFistGroup"
                  :items="reviewFirstGroupItems"
                  dense
                  outlined
                  :multiple="false"
                  placeholder="请选择审核组人员"
                  no-data-text="没有匹配数据"
                  :full-width="true"
                  @change="querySameLevelTransferInfo(selectForm.reviewFistGroup)"
                />
              </span>
            </div>
            <div class="mb-4" v-else>
              <span class="span_left" >
                选择复审审核组
              </span>
              <span class="span_right">
                <v-autocomplete
                  required="true"
                  :rules= "reviewSecondGroupRules"
                  v-model="selectForm.reviewSecondGroup"
                  :items="reviewSecondGroupItems"
                  dense
                  outlined
                  :multiple="false"
                  placeholder="请选择审核组人员"
                  no-data-text="没有匹配数据"
                  :full-width="true"
                  @change="querySameLevelTransferInfo(selectForm.reviewSecondGroup)"
                />
              </span>
            </div>
            <br>
            <div class="mb-4">
              <span class="span_left">
                选择任务转派对象
              </span>
              <span class="span_right">
                <v-autocomplete
                  required="true"
                  :rules= "transferRules"
                  v-model="selectForm.transferPerson"
                  :multiple="false"
                  :full-width="true"
                  :items="transferPersonItems"
                  dense
                  outlined
                  chips
                  placeholder="请选择转派人员"
                  no-data-text="没有匹配数据"
                />
              </span>
            </div>-->
          </v-form>
        </v-col>
      </v-row>
    </v-card>
    <!-- 初审或复审 -->
    <v-card class="text-color elevation-3 mb-3" v-if="showSubmit">
      <v-row dense>
        <v-col cols="12" md="12" xs="12" sm="12" class="pa-4 pb-0">
          <v-card-title class="header_bg_color">
            事件审核
          </v-card-title>
        </v-col>
      </v-row>
      <v-form ref="taskForm" v-model="valid" :lazy-validation="lazy">
        <div style="display: flex;align-items: center;">
          <div class="case_task_left">案件认定</div>
          <div class="case_task_right">
            <v-radio-group v-model="taskForm.reviewResultRadios" row v-if="showRadioGroup" @change="onChangeRadio(taskForm.reviewResultRadios)">
              <v-radio label="案件" :value="5"></v-radio>
              <v-radio label="疑似欺诈事件" :value="4"></v-radio>
              <v-radio label="清白件" :value="3"></v-radio>
            </v-radio-group>
            <v-radio-group v-model="taskForm.reviewResultRadios" row v-else>
              <v-radio label="同意" :value="1"></v-radio>
              <v-radio label="驳回" :value="-1"></v-radio>
            </v-radio-group>
          </div>
        </div>
        <div class="mb-3" v-if="(secondLevelRouterItems.state <= 5 || secondLevelRouterItems.state === 11) && taskForm.reviewResultRadios !== 3">
          <div class="case_task_left">案件风险类别</div>
          <div class="case_task_right" style="width: 20%;">
            <v-select
              outlined
              dense
              placeholder="请选择"
              v-model.trim="taskForm.riskType"
              item-text="text"
              item-value="value"
              :items="riskTypeItems"
              required
              :rules="[v => !!v || '请选择风险类别']"
              solo
              flat
            />
          </div>
        </div>
        <div>
          <div class="case_task_left">审核描述</div>
          <div class="case_task_right">
            <v-textarea
              row="3"
              row-height="25"
              outlined
              auto-grow
              v-model.trim="taskForm.reviewDesc"
              required
              :rules= "reviewDescRules"
              solo
              flat
            />
          </div>
        </div>
        <div class="pb-3" v-if="showRadioGroup">
          <div class="case_task_left">附件内容</div>
          <div v-if="secondLevelRouterItems.detailItemInfo.appid === 'com.wrcb.pos'">
            <div class="case_task_right file-position-left">
              <div class="file-position">门头照*</div>
              <file-upload @getFileFun="getFileFun($event, 1)" :numb="0" :accessoryArr="accessoryArr1" :accessoryUrl="accessoryUrl1" :isEdit="isEdit" @downloadFileFun="downloadFileFun"></file-upload>
            </div>
            <div class="case_task_right file-position-left">
              <div class="file-position">收银照*</div>
              <file-upload @getFileFun="getFileFun($event, 2)" :accessoryArr="accessoryArr2" :accessoryUrl="accessoryUrl2" :isEdit="isEdit" :numb="1" @downloadFileFun="downloadFileFun"></file-upload>
            </div>
            <div class="case_task_right file-position-left">
              <div class="file-position">POS签购单(含持卡人签字)</div>
              <file-upload @getFileFun="getFileFun($event, 3)" :accessoryArr="accessoryArr3" :accessoryUrl="accessoryUrl3" :isEdit="isEdit" :numb="2" @downloadFileFun="downloadFileFun"></file-upload>
            </div>
            <div class="case_task_right file-position-left">
              <div class="file-position">出库单</div>
              <file-upload @getFileFun="getFileFun($event, 4)" :accessoryArr="accessoryArr4" :accessoryUrl="accessoryUrl4" :isEdit="isEdit" :numb="3" @downloadFileFun="downloadFileFun"></file-upload>
            </div>
          </div>
          <div>
            <div class="case_task_right file-position-left">
              <div class="file-position">其他</div>
              <file-upload @getFileFun="getFileFun($event, 5)" :accessoryArr="accessoryArr5" :accessoryUrl="accessoryUrl5" :isEdit="isEdit" :numb="4" @downloadFileFun="downloadFileFun"></file-upload>
            </div>
          </div>
        </div>
      </v-form>
      <!-- 初审状态时 -->
      <div v-if="showSelectNameListSet">
        <div class="case_task_left" style="margin-top: 21px;">{{ nameListSetTitle }}</div>
        <div class="case_task_right">
          <v-data-table
            ref="addBlackListTable"
            :headers="addBlackListHeaders"
            :items="currentBlackListData"
            hide-default-footer
            :elevation="3"
            class="elevation-0 mt-2"
          >
            <template v-slot:body="{ items }">
              <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
                <td colspan="6">没有数据</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in items"
                :key="index"
                class="el-tr-defu"
              >
                <td
                  class="el-border-defu text-center"
                >
                  <span>
                    {{ item.identifer | identiferFilters() }}
                  </span>
                </td>
                <td class="el-border-defu text-center">
                  <span>{{ item.content }}</span>
                </td>
                <td
                  class="el-border-defu"
                >
                  <v-switch
                    v-model="item.flag"
                    color="primary"
                    style="margin-left: 35%;"
                    :disabled="(!item.map || item.map.length === 0) || !item.content || ((secondLevelRouterItems.state >= 6 && secondLevelRouterItems.state <= 10) || secondLevelRouterItems.state >= 12)"
                  />
                </td>
                <td
                  class="el-border-defu pr-0 text-center"
                  style="width: 25%"
                >
                  <v-autocomplete
                    v-model="item.dataId"
                    item-text="listName"
                    item-value="id"
                    :items="item.map"
                    dense
                    outlined
                    :multiple="true"
                    :full-width="true"
                    style="width: 82%;max-width: 140px;margin: 0 auto;"
                    no-data-text="没有匹配数据"
                    required
                    :rules="dataIdRules"
                    v-if="item.flag"
                    :clearable="true"
                    :disabled="(secondLevelRouterItems.state >= 6 && secondLevelRouterItems.state <= 10) || secondLevelRouterItems.state >= 12"
                  />
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </div>
    </v-card>
    <v-card class="mb-3 elevation-3">
      <v-card-title class="pb-0" style="font-size: 16px;">
        <div>任务编号: {{ taskDetail.amVerifyWorkorder.eventNo }}</div>
      </v-card-title>
      <!-- 流程图 -->
      <v-card class="elevation-0" :class="[taskDetail.amVerifyWorkorder.spLevel === 1 ? 'spLevel1-height' : 'spLevel2-height']" v-if="colorIdList.length">
        <flow-viewer :level="taskDetail.amVerifyWorkorder.spLevel" :colorIdList="colorIdList"></flow-viewer>
      </v-card>
      <v-card-title class="pt-0 pb-0" style="font-size: 16px;">
        <div>任务记录</div>
      </v-card-title>
      <v-card-text class="risk-info">
        <div v-if="taskDetail.detailList">
          <div class="d-flex flex-wrap align-self-0" v-for="(item, index) in taskDetail.detailList" :key="index">
            <div class="text-center" style="line-height:28px">{{ item.createTime }}</div>
            <div class="ml-6 text-center base_field_text_cu task-record-width">{{ item.userName }}</div>
            <div class="ml-6 text-center base_field_text_cu task-record-width">{{ item.operationName }}</div>
            <div class="ml-6 text-center base_field_text_cu task-record-width" style="width:80px;">{{ item.caseTypeName }}</div>
            <div class="ml-6" v-if="item.operation !== -1">
              <v-btn class="pa-0" text color="primary" @click="checkDetail(item)">查看详情 >></v-btn>
            </div>
          </div>
        </div>
        <div v-else>无</div>
      </v-card-text>
    </v-card>
    <v-card class="mb-3 mt-3 elevation-3">
      <basecase-detail :outAccountInfo="outAccountInfo" :inAccountInfo="inAccountInfo" :transationInfo="transationInfo" :otherInfo="otherInfo" :hitRule="hitRules" :ifdsOptypeList="secondLevelRouterItems.ifdsOptypeList" :allAppList="allAppList"></basecase-detail>
      <v-divider></v-divider>
      <v-card-title class="pt-4 pb-2">附件资料</v-card-title>
      <v-card-text class="">
        <v-row dense>
          <div>
            <span class="file-icon pl-8">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
              >
                mdi-paperclip
              </v-icon>
            </span>
            <span v-for="(item, index) in fileInfo" :key="item+index">
              <span style="cursor: pointer;margin-right:10px;" @click="downloadFileFun(item)">{{ item.name }}</span>
            </span>
          </div>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-title class="pt-4 pb-2">描述信息</v-card-title>
      <v-card-text class="pl-12 text-color">
        {{descInfo}}
      </v-card-text>
      <div v-if="taskDetail.amVerifyWorkorder.isGroup === 1">
        <v-divider></v-divider>
        <v-card-title class="pt-4 pb-2">聚合事件</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="pendingTaskHeaders"
            :items="pendingTaskData"
            :items-per-page="perPageNum"
            hide-default-footer
            class="elevation-3 mt-3"
            :fixed-header="true">
            <template v-slot:item.op_type="{ item }">
              <span>{{ item.op_type | ifdsOpType(secondLevelRouterItems.ifdsOptypeList)}}</span>
            </template>
            <template
              v-slot:item.app_id="{ item }"
            >
              <span :title="item.app_id | textFilters(allAppList) | ellipsis()">{{ item.app_id | textFilters(allAppList) | ellipsis() }}</span>
            </template>
            <template v-slot:item.strategy="{ item }">
              <span :title="item.strategy | textFilters(allStrategyList) | ellipsis()">{{ item.strategy | textFilters(allStrategyList) | ellipsis() }}</span>
            </template>
            <template v-slot:item.create_time="{ item }">
              <span>{{ item.create_time }}</span>
            </template>
            <template v-slot:item.src="{ item }">
              <span :title="item.src | textFilters(allTaskResourceList) | ellipsis()">{{ item.src | textFilters(allTaskResourceList) | ellipsis() }}</span>
            </template>
            <template v-slot:item.assignStyle="{ item }">
              <span :title="item.assignStyle | textFilters(allAssignTypeList) | ellipsis()">{{ item.assignStyle | textFilters(allAssignTypeList) | ellipsis() }}</span>
            </template>
            <template v-slot:item.riskLabels="{ item }">
              <span :title="item.riskLabels | getRiskLableNames(item.riskLabels)">{{ item.riskLabels | getRiskLableNames(item.riskLabels) | ellipsis() }}</span>
            </template>
            <template v-slot:item.stateName="{ item }">
              <span :title="item.stateName">{{ item.stateName | ellipsis() }}</span>
            </template>
            <template v-slot:item.bankCard="{ item }">
              <span :title="item.bankCard">{{ item.bank_card | ellipsis() }}</span>
            </template>
            <template v-slot:item.inAccount="{ item }">
              <span :title="item.inAccount">{{ item.in_account | ellipsis() }}</span>
            </template>
            <template v-slot:item.executeId="{ item }">
              <span :title="item.executeId">{{ item.executeId | ellipsis() }}</span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    color="primary"
                    v-on="on"
                    @click="queryDetailItem(item)"
                  >
                    mdi-card-account-details
                  </v-icon>
                </template>
                <span>查看详情</span>
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
        </v-card-text>
      </div>
      <div v-if="secondLevelRouterItems.taskStateName && secondLevelRouterItems.taskStateName === '待处理任务'">
        <!--核查单合并处理-->
        <v-divider></v-divider>
        <v-card-title class="pt-4 pb-0">核查单合并处理</v-card-title>
        <v-card-text>
          <!-- 查询条件 -->
          <v-row class="pt-0">
            <v-col cols="10" class="pt-0">
              <v-form ref="searchForm" v-model="checkSearchValid" :lazy-validation="lazy">
                <v-row>
                  <v-col cols="6" class="mr-2" style='display:flex;'>
                    <div style='height:100%;display:flex;align-items:center;font-size: 16px;color: rgba(0, 0, 0, 0.87);'>相同关键词事件筛选：</div>
                    <v-select
                      v-model="field"
                      :items="checkItems"
                      item-text="text"
                      item-value="value"
                      outlined
                      dense
                      no-data-text="没有匹配数据"
                      class="pt-0 pb-0"
                      background-color="white"
                      required
                      placeholder="选择筛选关键词"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="2"
                    style="text-align: left; position: relative"
                    class="pt-4 pl-0"
                  >
                    <div class="dateBtnBox" style="display: flex;min-width: 140px;">
                      <v-btn style="display: inline-block;"
                        color="primary"
                        class="ml-4"
                        @click="checkReset"
                        small
                      >重置</v-btn>
                      <v-btn style="display: inline-block;"
                        color="primary"
                        class="ml-4"
                        small
                        @click="checkSearch"
                      >查询</v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
            <v-spacer/>
            <v-col class="pt-4">
              <v-btn color="primary" @click="addCheck">添加选中事件</v-btn>
            </v-col>
          </v-row>
          <v-data-table
            v-model="checkSelection"
            :headers="checkTableHeaders"
            :items="checkTableData"
            :items-per-page="checkPerPageNum"
            :page.sync="checkPageNum"
            hide-default-footer
            class="elevation-3"
            :loading="checkLoading"
            show-select
            :fixed-header="true">
            <template v-slot:item.appId="{ item }">
              <span :title="item.appId | textFilters(allAppList) | ellipsis()">{{ item.appId | textFilters(allAppList) | ellipsis() }}</span>
            </template>
            <template v-slot:item.opType="{ item }">
              <span>{{ item.opType | ifdsOpType(secondLevelRouterItems.ifdsOptypeList)}}</span>
            </template>
            <template v-slot:item.create_time="{ item }">
              <span>{{ item.create_time || item.createTime}}</span>
            </template>
            <template v-slot:item.userId="{ item }">
              <span :title="item.userId">{{ item.userId }}</span>
            </template>
            <template v-slot:item.outAccount="{ item }">
              <span :title="item.outAccount">{{ item.outAccount }}</span>
            </template>
            <template v-slot:item.inAccount="{ item }">
              <span :title="item.inAccount">{{ item.inAccount }}</span>
            </template>
            <template v-slot:item.amount="{ item }">
              <span :title="item.amount">{{ item.amount }}</span>
            </template>
            <template v-slot:item.riskLabels="{ item }">
              <span :title="item.riskLabels">{{ item.riskLabels }}</span>
            </template>
            <template
              v-slot:item.src="{ item }"
            >
              <span :title="item.src | textFilters(allTaskResourceList) | ellipsis()">{{ item.src | textFilters(allTaskResourceList) | ellipsis() }}</span>
            </template>
            <template
              v-slot:item.assignStyle="{ item }"
            >
              <span :title="item.assignStyle | textFilters(allAssignTypeList) | ellipsis()">{{ item.assignStyle | textFilters(allAssignTypeList) | ellipsis() }}</span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    color="primary"
                    v-on="on"
                    @click="eventDetail(item)"
                  >
                    mdi-card-account-details
                  </v-icon>
                </template>
                <span>查看详情</span>
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
                      v-model="checkPerPageNum"
                      item-text="fieldName"
                      item-value="fieldField"
                      :items="perPageItems"
                      dense
                      width="27px"
                      no-data-text="没有匹配数据"
                      @change="checkPageChange"
                    />
                  </span>条
                  <span style="margin-left:15px">共{{ checkTotalItems }}条</span>
                  <v-spacer/>
                  <v-pagination
                    class="d-flex justify-end pagination"
                    v-model="checkPageNum"
                    :length="checkQueryPageLength"
                    :total-visible="7"
                    @input="checkOnPageChange"
                  />
                </div>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
        <!--合并处理事件-->
        <v-divider></v-divider>
        <v-card-title class="pt-4 pb-0">
          <div class="title-info">合并处理事件<span style='font-size: 16px;'>(该列表中的事件会合并处理，给出统一审核结果)</span></div>
          <v-spacer/>
          <v-btn color="primary" @click="removeCheck">删除选中事件</v-btn>
        </v-card-title>
        <v-card-text>
          <v-data-table
            v-model="mergeSelection"
            :headers="checkTableHeaders"
            :items="mergeTableData"
            :items-per-page="mergePerPageNum"
            :page.sync="mergePageNum"
            hide-default-footer
            class="elevation-3"
            :loading="mergeLoading"
            show-select
            :fixed-header="true">
            <template v-slot:item.appId="{ item }">
              <span :title="item.appId | textFilters(allAppList) | ellipsis()">{{ item.appId | textFilters(allAppList) | ellipsis() }}</span>
            </template>
            <template v-slot:item.opType="{ item }">
              <span>{{ item.opType | ifdsOpType(secondLevelRouterItems.ifdsOptypeList)}}</span>
            </template>
            <template v-slot:item.userId="{ item }">
              <span :title="item.userId">{{ item.userId }}</span>
            </template>
            <template v-slot:item.create_time="{ item }">
              <span>{{ item.create_time || item.createTime}}</span>
            </template>
            <template v-slot:item.outAccount="{ item }">
              <span :title="item.outAccount">{{ item.outAccount }}</span>
            </template>
            <template v-slot:item.inAccount="{ item }">
              <span :title="item.inAccount">{{ item.inAccount }}</span>
            </template>
            <template v-slot:item.amount="{ item }">
              <span :title="item.amount">{{ item.amount }}</span>
            </template>
            <template v-slot:item.riskLabels="{ item }">
              <span :title="item.riskLabels">{{ item.riskLabels }}</span>
            </template>
            <template
              v-slot:item.src="{ item }"
            >
              <span :title="item.src | textFilters(allTaskResourceList) | ellipsis()">{{ item.src | textFilters(allTaskResourceList) | ellipsis() }}</span>
            </template>
            <template
              v-slot:item.assignStyle="{ item }"
            >
              <span :title="item.assignStyle | textFilters(allAssignTypeList) | ellipsis()">{{ item.assignStyle | textFilters(allAssignTypeList) | ellipsis() }}</span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-1 icon-primary"
                    color="primary"
                    v-on="on"
                    @click="eventDetail(item)"
                  >
                    mdi-card-account-details
                  </v-icon>
                </template>
                <span>查看详情</span>
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
                      v-model="mergePerPageNum"
                      item-text="fieldName"
                      item-value="fieldField"
                      :items="perPageItems"
                      dense
                      width="27px"
                      no-data-text="没有匹配数据"
                      @change="mergePageChange"
                    />
                  </span>条
                  <span style="margin-left:15px">共{{ mergeTotalItems }}条</span>
                  <v-spacer/>
                  <v-pagination
                    class="d-flex justify-end pagination"
                    v-model="mergePageNum"
                    :length="mergeQueryPageLength"
                    :total-visible="7"
                    @input="mergeOnPageChange"
                  />
                </div>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </div>

      <v-divider></v-divider>
      <v-card-title class="pt-4 pb-0">查询关联风控日志</v-card-title>
      <v-card-text>
        <!-- 查询条件 -->
        <v-row class="pt-0">
          <v-col cols="10" class="pt-0">
            <v-form ref="searchForm" v-model="searchValid" :lazy-validation="lazy">
              <v-row>
                <v-col cols="3" class="mr-2">
                  <v-text-field
                    outlined
                    dense
                    v-model="dateRangeText"
                    append-icon="event"
                    @click="dateInputClick"
                    background-color="white"
                    placeholder="请选择日期"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3" class="mr-2" style="display: flex;align-items: flex-start;">
                  <i class="mr-1" style="color: red;">*</i>
                  <v-select
                    v-model="searchForm.eventBody"
                    :items="eventBodyItems"
                    item-text="text"
                    item-value="value"
                    outlined
                    dense
                    no-data-text="没有匹配数据"
                    class="pt-0 pb-0"
                    background-color="white"
                    required
                    placeholder="请选择事件主体*"
                    @change="changeEventBody(searchForm.eventBody)"
                    :rules="[v => !!v || '事件主体不能为空']"
                  ></v-select>
                </v-col>
                <v-col cols="2" class="mr-2" style="display: flex;align-items: flex-start;">
                  <i class="mr-1" style="color: red;">*</i>
                  <v-text-field
                    outlined
                    dense
                    v-model.trim="searchForm.eventValue"
                    background-color="white"
                    required
                    :placeholder="`请填写${conditionPlaceholder}*`"
                    :rules="[v => !!v || '内容不能为空']"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="3"
                  style="text-align: left; position: relative"
                  class="pt-4 pl-0"
                >
                  <div class="dateBtnBox">
                    <v-btn
                      color="primary"
                      class="ml-4"
                      @click="reset"
                      small
                    >重置</v-btn>
                    <v-btn
                      color="primary"
                      class="ml-4"
                      small
                      @click="search"
                    >查询</v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
          <v-col cols="2">
            <v-dialog v-model="isdateShow" width="321">
              <v-date-picker selected-items-text="已选择日期" v-model="searchForm.dates" range  @change="dateChange"></v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
        <v-data-table
          :headers="riskLogTableHeaders"
          :items="riskLogTableData"
          :items-per-page="riskLogPerPageNum"
          :page.sync="riskLogPageNum"
          hide-default-footer
          class="elevation-3"
          :loading="loading"
          :fixed-header="true">
          <template v-slot:item.aid="{ item }">
            <span :title="item.aid | textFilters(allAppList) | ellipsis()">{{ item.aid | textFilters(allAppList) | ellipsis() }}</span>
          </template>
          <template v-slot:item.op_type="{ item }">
            <span>{{  item.op_type | ifdsOpType(secondLevelRouterItems.ifdsOptypeList)}}</span>
          </template>
          <template v-slot:item.user_id="{ item }">
            <span :title="item.user_id">{{ item.user_id }}</span>
          </template>
          <template v-slot:item.outAccount="{ item }">
            <span :title="item.outAccount">{{ item.out_account }}</span>
          </template>
          <template v-slot:item.inAccount="{ item }">
            <span :title="item.inAccount">{{ item.in_account }}</span>
          </template>
          <template v-slot:item.amount="{ item }">
            <span :title="item.amount">{{ item.amount }}</span>
          </template>
          <template v-slot:item.riskLabels="{ item }">
            <span :title="item.riskLabels">{{ item.riskLabels }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  color="primary"
                  v-on="on"
                  @click="queryDetailItem(item)"
                >
                  mdi-card-account-details
                </v-icon>
              </template>
              <span>查看详情</span>
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
                    v-model="riskLogPerPageNum"
                    item-text="fieldName"
                    item-value="fieldField"
                    :items="perPageItems"
                    dense
                    width="27px"
                    no-data-text="没有匹配数据"
                    @change="riskLogPageChange"
                  />
                </span>条
                <span style="margin-left:15px">共{{ riskLogTotalItems }}条</span>
                <v-spacer/>
                <v-pagination
                  class="d-flex justify-end pagination"
                  v-model="riskLogPageNum"
                  :length="riskLogQueryPageLength"
                  :total-visible="7"
                  @input="riskLogOnPageChange"
                />
              </div>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- 查看日志详情弹窗 -->
    <v-row dense>
      <v-dialog
        v-model="riskLogDetail"
        persistent
        scrollable
        max-width="1200px">
        <v-card>
          <v-card-title>
            <v-toolbar-title>查看详情</v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn
              icon
              dark
              @click="riskLogDetail = false"
            >
              <v-icon color="#CCCCCC">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <basecase-detail :outAccountInfo="outAccountInfoDialog" :inAccountInfo="inAccountInfoDialog" :transationInfo="transationInfoDialog" :otherInfo="otherInfoDialog" :hitRule="hitRulesDialog" :ifdsOptypeList="secondLevelRouterItems.ifdsOptypeList" :allAppList="allAppList"></basecase-detail>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- 查看详情弹窗 -->
    <v-row dense>
      <v-dialog
        v-model="detailDialog"
        persistent
        scrollable
        max-width="900px">
        <v-card min-height="300px">
          <v-card-title>
            <v-toolbar-title>{{ detailTitle }}</v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn
              icon
              dark
              @click="detailDialog = false"
            >
              <v-icon color="#CCCCCC">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="base_field_text_cu pt-6" v-if="detailTitle === '一级审核流'">
            初审人: {{ detailData.firstLevel.first }}
          </v-card-text>
          <v-card-text class="base_field_text_cu pt-6" v-if="detailTitle === '二级审核流'">
            <div>初审人: {{ detailData.secondLevel.first }}</div>
            <div> 复审人: {{ detailData.secondLevel.second }}</div>
          </v-card-text>
          <v-card-text class="base_field_text_cu pt-6" v-if="detailTitle === '审核结果' || detailTitle === '复审结果'">
            <div class="pb-2">
              <div class="case_task_left">时间</div>
              <div class="case_task_right">{{ detailData.caseInfo.createTime }}</div>
            </div>
            <div class="pb-2">
              <div class="case_task_left">初审人</div>
              <div class="case_task_right">{{ detailData.caseInfo.auditUser }}</div>
            </div>
            <div class="pb-2">
              <div class="case_task_left">审核结果</div>
              <div class="case_task_right">{{ detailData.caseInfo.result }}</div>
            </div>
            <div class="pb-2" v-if="detailData.caseInfo.caseRiskType">
              <div class="case_task_left">案件风险类别</div>
              <div class="case_task_right">{{ detailData.caseInfo.caseRiskType | textFilters(riskTypeItems) }}</div>
            </div>
            <div class="pb-2">
              <div class="case_task_left">审核描述</div>
              <div class="case_task_right">
                <v-textarea
                  row="3"
                  row-height="25"
                  outlined
                  auto-grow
                  v-model="detailData.caseInfo.description"
                  required
                  solo
                  flat
                />
              </div>
            </div>
            <div class="pb-2" v-if="filePathArr.length">
              <div class="case_task_left">附件资料</div>
              <div class="case_task_right">
                <span v-for="(item, index) in filePathArr" :key="item+index">
                  <span v-if="item.fileKey === 'url1'">门头照: </span>
                  <span v-if="item.fileKey === 'url2'">收银照: </span>
                  <span v-if="item.fileKey === 'url3'">POS签购单(含持卡人签字): </span>
                  <span v-if="item.fileKey === 'url4'">出库单: </span>
                  <span v-if="item.fileKey === 'url5'">其他: </span>
                  <span style="cursor: pointer;margin-right:10px;" @click="downloadFileFun(item)">{{ item.name }}</span><br/>
                </span>
              </div>
            </div>
            <div v-if="detailTitle === '审核结果' || detailTitle === '复审结果'">
              <div class="case_task_left" style="margin-top: 21px;">{{ nameListSetTitle }}</div>
              <div class="case_task_right">
                <v-data-table
                  ref="caseInfoDataTable"
                  :headers="addBlackListHeaders"
                  :items="dialog_currentBlackListData"
                  hide-default-footer
                  :elevation="3"
                  class="elevation-0 mt-2"
                >
                  <template v-slot:body="{ items }">
                    <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
                      <td colspan="6">没有数据</td>
                    </tr>
                    <tr
                      v-else
                      v-for="(item, index) in items"
                      :key="index"
                      class="el-tr-defu"
                    >
                      <td class="el-border-defu text-center">
                        <span>{{ item.identifer | identiferFilters() }}</span>
                      </td>
                      <td class="el-border-defu text-center">
                        <span>{{ item.content }}</span>
                      </td>
                      <td class="el-border-defu text-center">
                        <span>{{ item.flag }}</span>
                      </td>
                      <td
                        class="el-border-defu pr-0 text-center"
                      >
                        <span>{{ item.setName }}</span>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </div>
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions class="pt-4pb-4">
            <div class="flex-grow-1"></div>
            <v-btn color="primary" class="mr-4" @click="detailDialog = false">关闭</v-btn>
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
      @input="cancel">
      {{ snackbarServeMsg }}
    </v-snackbar>

    <v-snackbar
      v-model="snackbarError"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop">
      {{ snackbarServeMsg }}
    </v-snackbar>
  </div>
</template>
<script>
import * as dataService from 'api/caseManagementCenter/pendingTask';
import { getEventsRiskList } from 'api/caseManagementCenter/caseReport.js';
import { NO_SELECT_VALUE, NO_TRANSFER_VALUE, NAME_NOT_NULL } from 'utils/validate';

import { mapGetters } from 'vuex';
import FlowViewer from '@c/FlowViewer';
import BasecaseDetail from '@c/BasecaseDetail';
import moment from 'moment';
import FileUpload from '@/components/FileUpload';
export default {
  name: 'caseTaskDetail',
  components: {
    FlowViewer,
    BasecaseDetail,
    FileUpload
  },
  data () {
    return {
      checkTableHeaders: [
        { text: '任务编号', value: 'eventNo', sortable: false, width: 100 },
        { text: '所属应用', value: 'appId', sortable: false, width: 100 },
        { text: '交易类型', value: 'opType', sortable: false, width: 100 },
        { text: '用户标识', value: 'userId', sortable: false, width: 100 },
        { text: '出账账号', value: 'outAccount', sortable: false, width: 100 },
        { text: '入账账号', value: 'inAccount', sortable: false, width: 100 },
        { text: '金额', value: 'amount', sortable: false, width: 100 },
        { text: '风险标签', value: 'riskLabels', sortable: false, width: 100 },
        { text: '生成时间', value: 'create_time', sortable: false, width: 100 },
        { text: '任务来源', value: 'src', sortable: false, width: 100 },
        { text: '指派方式', value: 'assignStyle', sortable: false, width: 100 },
        { text: '关联维度', value: 'relationDesc', sortable: false, width: 100 },
        { text: '查看详情', value: 'action', sortable: false, width: 100 }
      ],
      // 核查单合并处理
      checkSearchValid: true,
      checkItems: [
        { text: '用户标识', value: 1 },
        { text: '入账账号', value: 2 },
        { text: '出账账号', value: 3 },
        { text: '商户号', value: 4 }
      ],
      checkTableData: [],
      checkPerPageNum: 10,
      checkPageNum: 1,
      checkPageNumSize: 10,
      checkTotalItems: 0,
      checkQueryPageLength: 0,
      checkSelection: [],
      field: 0,
      checkLoading: false,
      // 合并处理事件
      mergeTableData: [],
      mergeAllTableData: [],
      mergePerPageNum: 10,
      mergePageNum: 1,
      mergeSelection: [],
      mergeTotalItems: 0,
      mergeQueryPageLength: 0,
      mergeLoading: false,
      isFixed: false,
      // 查看详情弹窗
      detailDialog: false,
      detailTitle: '',
      detailData: {
        firstLevel: {
          first: '',
          depInfo: ''
        },
        secondLevel: {
          first: '',
          second: '',
          depInfo: ''
        },
        caseInfo: {}
      },
      // 提示弹框参数
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '',
      snackbarError: false,
      // 切换展示任务处理内容
      showSubmit: false,
      // 切换转派，设置任务转派对象
      showTransfer: false,
      radios: null,
      taskDetail: {},
      valid: true,
      lazy: false,
      addBlackListHeaders: [
        { text: '字段名', value: 'identifer', sortable: false, align: 'center', width: '100px' },
        { text: '值', value: 'content', sortable: false, align: 'center', width: '100px' },
        { text: '是否拉黑', value: 'flag', sortable: false, align: 'center', width: '100px' },
        { text: '匹配名单集', value: 'dataId', sortable: false, align: 'center', width: '100px' }
      ],
      addBlackListData: [],
      currentBlackListData: [],
      dialog_currentBlackListData: [],
      selectForm: {
        transferPerson: ''
      },
      transferRules: [v => !!v || NO_SELECT_VALUE('转派人员'), v => !(NO_TRANSFER_VALUE.test(v)) || NO_SELECT_VALUE('转派人员')],
      reviewDescRules: [v => !!v || NAME_NOT_NULL('审核描述')],
      dataIdRules: [v => !!v || NO_SELECT_VALUE('名单集')],
      reviewFirstGroupRules: [v => !!v || NO_SELECT_VALUE('初审审核组')],
      reviewSecondGroupRules: [v => !!v || NO_SELECT_VALUE('复审审核组')],
      // 任务处理form
      taskForm: {
        reviewResultRadios: null,
        reviewDesc: '',
        riskType: null
      },
      token: '',
      // 当前登录的用户id
      loginUserId: '',
      // 是否展示名单集选择列表
      showSelectNameListSet: false,
      nameListSetTitle: '',
      // 转派人员信息列表
      transferPersonItems: [],
      // 交易信息列表
      allTradeTypeList: [],
      // 交易详情--出账方信息
      outAccountInfo: {
        ecifPrivateCustInfo: {},
        ecifCustInfo: {},
        ecifType: ''
      },
      // 交易详情--入账方信息
      inAccountInfo: {
        ecifPrivateCustInfo: {},
        ecifCustInfo: {},
        chMchtInfo: {},
        ecifType: ''
      },
      // 交易详情--交易信息
      transationInfo: {},
      // 交易详情--其他信息
      otherInfo: {},
      // 风控详情信息
      hitRules: {},
      // 交易详情弹窗信息
      outAccountInfoDialog: {
        ecifPrivateCustInfo: {},
        ecifCustInfo: {},
        ecifType: ''
      },
      inAccountInfoDialog: {
        ecifPrivateCustInfo: {},
        ecifCustInfo: {},
        chMchtInfo: {},
        ecifType: ''
      },
      transationInfoDialog: {},
      otherInfoDialog: {},
      hitRulesDialog: {},
      // 风控详情默认
      hitRule: {
        'simulatedResult': {
          'matchType': '',
          'hit_labels': '',
          'strategy': '',
          'hit_rules': []
        },
        'officialResult': {
          // 'matchType': '',
          // 'label_hit_rules': [],
          // 'strategy': '',
          // 'hit_rules': []
        }
      },
      // 上传的file附件
      uploadFileInfo: {},
      pendingTaskHeaders: [],
      pendingTaskData: [],
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      selectedHeader: [],
      allStrategyList: [],
      allTaskResourceList: [],
      allAssignTypeList: [],
      // 查询风控日志表格--分页变量
      riskLogPageNum: 1,
      riskLogPageSize: 10,
      riskLogQueryPageLength: 0,
      riskLogPerPageNum: 10,
      riskLogTotalItems: 0,
      // 查询关联风控日志
      isdateShow: false,
      searchValid: true,
      searchForm: {
        dates: [],
        eventBody: null,
        eventValue: '' // 最后一个查询条件
      },
      eventBodyItems: [
        { text: '请选择事件主体', value: '' }
      ],
      conditionPlaceholder: '',
      riskLogTableHeaders: [
        { text: '所属应用', value: 'aid', sortable: false, width: 100 },
        { text: '交易类型', value: 'op_type', sortable: false, width: 100 },
        { text: '用户标识', value: 'user_id', sortable: false, width: 100 },
        { text: '出账账号', value: 'outAccount', sortable: false, width: 100 },
        { text: '入账账号', value: 'inAccount', sortable: false, width: 100 },
        { text: '金额', value: 'amount', sortable: false, width: 100 },
        { text: '风险标签', value: 'riskLabels', sortable: false, width: 100 },
        { text: '查看详情', value: 'action', sortable: false, width: 100 }
      ],
      riskLogTableData: [],
      // 查看日志详情弹窗
      riskLogDetail: false,
      // 风险类别数据
      riskTypeItems: [
        { text: '请选择', value: '' }
      ],
      allAppList: [],
      // 上传文件loading标志
      uploadIsLoading: false,
      loading: false,
      // 转派时展示审核组
      showTransferGroup: false,
      reviewFirstGroupItems: [],
      reviewSecondGroupItems: [],
      accessoryArr1: [], // 上传的附件
      accessoryUrl1: [], // 上传的附件
      accessoryArr2: [],
      accessoryUrl2: [],
      accessoryArr3: [],
      accessoryUrl3: [],
      accessoryArr4: [],
      accessoryUrl4: [],
      accessoryArr5: [],
      accessoryUrl5: [],
      isEdit: true, // true 是新增，false是编辑查看
      filePathArr: [],
      pendingTasks: false // 是否待处理任务
    };
  },
  computed: {
    ...mapGetters([
      'appId',
      'secondLevelRouterItems'
    ]),
    // 流程图所需要高亮的节点的id
    colorIdList () {
      let arr = [];
      if (this.taskDetail.allActiveIds && this.taskDetail.highLightedFlows) {
        arr = [...this.taskDetail.allActiveIds, ...this.taskDetail.highLightedFlows];
      }
      return arr;
    },
    // 展示初审或者复审的单选框
    showRadioGroup () {
      return this.secondLevelRouterItems.state <= 5 || this.secondLevelRouterItems.state === 11;
    },
    // 是否展示审核和转派按钮
    showTrialOrTransfer () {
      // 判断当前角色是否为初审或复审，只有这两个角色的人员才可操作这两个按钮
      const roleFlag = this.secondLevelRouterItems.roleIdenList.some(item => item === 'first' || item === 'second');
      // 同时要满足从待处理任务页面进入
      return roleFlag && this.secondLevelRouterItems.title && this.secondLevelRouterItems.title === '待处理任务';
    },
    dateRangeText: {
      get () {
        if (moment(this.searchForm.dates[0]).valueOf() > moment(this.searchForm.dates[1]).valueOf()) {
          this.reverseArry(this.searchForm.dates);
        }
        return this.searchForm.dates.join(' 至 ');
      },
      set (newVal) {}
    },
    // 描述信息
    descInfo () {
      return this.taskDetail.amVerifyWorkorder.eventSubmitDescribe;
    },
    fileInfo () {
      return this.taskDetail.amVerifyWorkorder.filePathList;
    }
  },
  created () {
    Promise.all([
      this.initData(),
      this.queryEventBodyList(),
      this.queryRiskTypeList(),
      this.querySameLevelTransferInfo()
    ]);
    this.querySameLevelTransferInfo();
    if (sessionStorage.getItem('eventObj')) {
      let eventObj = JSON.parse(sessionStorage.getItem('eventObj'));
      this.checkSearchValid = eventObj.checkSearchValid;
      this.checkTableData = eventObj.checkTableData;
      this.checkPerPageNum = eventObj.checkPerPageNum;
      this.checkPageNum = eventObj.checkPageNum;
      this.checkPageNumSize = eventObj.checkPageNumSize;
      this.checkTotalItems = eventObj.checkTotalItems;
      this.checkQueryPageLength = eventObj.checkQueryPageLength;
      this.checkSelection = eventObj.checkSelection;
      this.field = eventObj.field;
      this.mergeTableData = eventObj.mergeTableData;
      this.mergeAllTableData = eventObj.mergeAllTableData;
      this.mergePerPageNum = eventObj.mergePerPageNum;
      this.mergePageNum = eventObj.mergePageNum;
      this.mergeSelection = eventObj.mergeSelection;
      this.mergeTotalItems = eventObj.mergeTotalItems;
      this.mergeQueryPageLength = eventObj.mergeQueryPageLength;
      sessionStorage.removeItem('eventObj');
    } else {
      this.getPolymerizationList();
    }
  },
  mounted () {
    window.addEventListener('scroll', this.fixedBtnBox);
  },
  watch: {
    appId: {
      handler: function (newVal, oldVal) {
        Promise.all([
          this.getTradeTypeList()
        ]);
      },
      immediate: true
    }
  },
  filters: {
    textFilters: function (str, itemList) {
      let text = '';
      itemList.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.value === str || item.tag === str) {
          text = item.text;
        }
      });
      return text;
    },
    identiferFilters: function (str) {
      let text;
      switch (str) {
        case 'dev_fp':
          text = '设备指纹';
          break;
        case 'ip':
          text = 'IP';
          break;
        case 'phone':
          text = '手机号';
          break;
        case 'id_no':
          text = '证件号';
          break;
        case 'bank_card':
          text = '银行卡号';
          break;
        case 'merchant_no':
          text = '商户号';
          break;
      }
      return text;
    },
    ifdsOpType: function (str, objList) { // 风控平台--交易类型
      return objList[str];
    },
    getRiskLableNames: function (data) {
      let obj = JSON.parse(data);
      let str = [];
      for (const item in obj) {
        if (obj.hasOwnProperty(item)) {
          str.push(obj[item]);
        }
      }
      return str.join(',');
    }
  },
  methods: {
    // 核查单合并处理
    addCheck () {
      this.mergeAllTableData = this.checkSelection.concat(this.mergeAllTableData);
      let obj = {};
      this.mergeAllTableData = this.mergeAllTableData.reduce(function (item, next) {
        let data = obj[next.id] ? '' : obj[next.id] = true && item.push(next);
        return item;
      }, []);
      let mergeTableData = [];
      this.mergeAllTableData.forEach((item, index) => {
        if (index < this.mergePerPageNum) {
          mergeTableData.push(item);
        }
      });
      this.mergeTableData = mergeTableData;
      this.mergeTotalItems = this.mergeAllTableData.length;
      this.mergeQueryPageLength = Math.ceil(this.mergeAllTableData.length / this.mergePerPageNum);
    },
    checkReset () {
      this.field = 0;
      this.getPolymerizationList();
    },
    checkSearch () {
      this.getPolymerizationList();
    },
    // 切换每页显示几条数据
    checkPageChange (pageNum) {
      this.checkPageNum = 1; // 默认从第一页开始查询
      this.checkPageNumSize = this.checkPerPageNum;
      this.getPolymerizationList();
    },
    // 切换页码
    checkOnPageChange (page) {
      this.checkPageNum = page;
      this.getPolymerizationList();
    },
    // 查询核查单合并处理列表
    async getPolymerizationList (groupIds) {
      this.checkLoading = true;
      const params = {
        field: this.field,
        appidList: this.appId,
        page: this.checkPageNum,
        pageSize: this.checkPageNumSize,
        state: 100,
        id: this.secondLevelRouterItems.id,
        groupIds: groupIds
      };
      const res = await dataService.polymerizationList(params);
      if (res.data.code === 200) {
        this.checkLoading = false;
        this.checkTableData = res.data.data.verifyList;
        this.checkTotalItems = res.data.data.total;
        this.checkQueryPageLength = Math.ceil(res.data.data.total / this.checkTotalItems);
      }
    },
    // 合并处理事件
    removeCheck () {
      let that = this;
      for (let i = that.mergeAllTableData.length - 1; i >= 0; i--) {
        let index = that.mergeSelection.findIndex(val => val.id === that.mergeAllTableData[i].id);
        if (index >= 0) {
          that.mergeAllTableData.splice(i, 1);
        }
      }
      let mergeTableData = [];
      this.mergeAllTableData.forEach((item, index) => {
        if (index < this.mergePerPageNum) {
          mergeTableData.push(item);
        }
      });
      this.mergeTableData = mergeTableData;
      this.mergeTotalItems = this.mergeAllTableData.length;
      this.mergeQueryPageLength = Math.ceil(this.mergeAllTableData.length / this.mergePerPageNum);
      this.mergeSelection = [];
    },
    // 切换每页显示几条数据
    mergePageChange (pageNum) {
      this.mergePageNum = 1; // 默认从第一页开始查询
      this.mergePerPageNum = pageNum;
      this.mergeQueryPageLength = Math.ceil(this.mergeAllTableData.length / this.mergePerPageNum);
      let mergeTableData = [];
      this.mergeAllTableData.forEach(function (item, index) {
        if (index < this.mergePerPageNum) {
          mergeTableData.push(item);
        }
      });
      this.mergeTableData = mergeTableData;
    },
    // 切换页码
    mergeOnPageChange (page) {
      this.mergePageNum = page;
      let mergeTableData = [];
      this.mergeAllTableData.forEach(function (item, index) {
        if (index < (page + 1) * this.mergePerPageNum && index > page * this.mergePerPageNum) {
          mergeTableData.push(item);
        }
      });
      this.mergeTableData = mergeTableData;
    },
    // 合并事件详情
    eventDetail (item) {
      let eventObj = {
        // 核查单合并处理
        checkSearchValid: this.checkSearchValid,
        checkTableData: this.checkTableData,
        checkPerPageNum: this.checkPerPageNum,
        checkPageNum: this.checkPageNum,
        checkPageNumSize: this.checkPageNumSize,
        checkTotalItems: this.checkTotalItems,
        checkQueryPageLength: this.checkQueryPageLength,
        checkSelection: this.checkSelection,
        field: this.field,
        // 合并处理事件
        mergeTableData: this.mergeTableData,
        mergeAllTableData: this.mergeAllTableData,
        mergePerPageNum: this.mergePerPageNum,
        mergePageNum: this.mergePageNum,
        mergeSelection: this.mergeSelection,
        mergeTotalItems: this.mergeTotalItems,
        mergeQueryPageLength: this.mergeQueryPageLength
      };
      sessionStorage.setItem('eventObj', JSON.stringify(eventObj));
      this.$router.push({
        path: '/mergeEventDetail',
        name: 'mergeEventDetail',
        params: {
          details: item,
          submitId: this.secondLevelRouterItems.id
        }
      });
    },
    // 头部fixed定位
    fixedBtnBox () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 72) { // 当页面滚动到高度300px处，动态绑定class 来设置头部固定定位
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    // 获取交易类型
    async getTradeTypeList () {
      if (this.appId) {
        const param = {
          appId: this.appId,
          isAmount: this.secondLevelRouterItems.isAmount
        };
        const response = await dataService.queryTradeType(param);
        if (response.data.code === 200) {
          let resTradeTypeItems = response.data.data.tradeList;
          resTradeTypeItems.forEach((item, index, ary) => {
            this.allTradeTypeList.push({
              text: item.tradeName,
              value: item.identifier
            });
          });
        }
      };
    },
    // 下载审核时上传的文件
    downloadFileFun (item) {
      if (item.value) {
        item.url = item.value;
      }
      const params = {
        urls: item.url
      };
      dataService.downloadFile(params).then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = item.name;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        if (err.msg) {
          this.snackbarError = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    initData () {
      if (localStorage.getItem('loginData')) {
        let loginData = JSON.parse(localStorage.getItem('loginData'));
        this.token = loginData.token;
        this.loginUserId = loginData.userId;
      }
      let pageParams = Object.assign({}, JSON.parse(JSON.stringify(this.secondLevelRouterItems)));
      if (pageParams.taskDetail) {
        this.taskDetail = pageParams.taskDetail;
        this.outAccountInfo = Object.assign({}, pageParams.taskDetail.opTypeDetail.outAccountInfo);
        this.inAccountInfo = Object.assign({}, pageParams.taskDetail.opTypeDetail.inAccountInfo);
        this.transationInfo = Object.assign({}, {
          isAmount: this.secondLevelRouterItems.isAmount,
          createTime: pageParams.detailItemInfo.riskTime,
          appId: pageParams.detailItemInfo.appId,
          opType: pageParams.detailItemInfo.opType,
          opState: pageParams.detailItemInfo.opState,
          location: pageParams.detailItemInfo.location,
          outAccount: pageParams.detailItemInfo.outAccount,
          inAccount: pageParams.detailItemInfo.inAccount,
          amount: pageParams.detailItemInfo.amount
        });
        this.otherInfo = Object.assign({}, {
          eventNo: pageParams.detailItemInfo.eventNo,
          devFp: pageParams.detailItemInfo.devFp,
          brand: pageParams.detailItemInfo.brand,
          model: pageParams.detailItemInfo.model,
          ip: pageParams.detailItemInfo.ip
        });
        let baseRes = Object.assign({}, pageParams.taskDetail.opTypeDetail.hitRule);
        if (baseRes.officialResult && Object.keys(baseRes.officialResult).length > 0) {
          baseRes.officialResult.hit_labels = (baseRes.officialResult.hit_labels.substring(baseRes.officialResult.hit_labels.length - 1) === ',') ? baseRes.officialResult.hit_labels.substring(0, baseRes.officialResult.hit_labels.length - 1) : baseRes.officialResult.hit_labels;
        } else {
          baseRes.officialResult = {};
        }
        if (baseRes.simulatedResult && Object.keys(baseRes.simulatedResult).length > 0) {
          baseRes.simulatedResult.hit_labels = (baseRes.simulatedResult.hit_labels.substring(baseRes.simulatedResult.hit_labels.length - 1) === ',') ? baseRes.simulatedResult.hit_labels.substring(0, baseRes.simulatedResult.hit_labels.length - 1) : baseRes.simulatedResult.hit_labels;
        } else {
          baseRes.simulatedResult = {};
        }
        this.hitRules = baseRes;
        this.pendingTaskHeaders = pageParams.isAmount ? pageParams.accountTypeHeaders : pageParams.noAccountTypeHeaders;
        this.allStrategyList = pageParams.allStrategyList;
        this.allTaskResourceList = pageParams.allTaskResourceList;
        this.allAssignTypeList = pageParams.allAssignTypeList;
        this.allAppList = pageParams.allAppList;
        this.allTradeTypeList = pageParams.allTradeTypeList;
        // 判断是否待处理任务
        if (pageParams.taskDetail.amVerifyWorkorder.result === 0 || pageParams.taskDetail.amVerifyWorkorder.result === null || pageParams.taskDetail.amVerifyWorkorder.hiden === 0) {
          this.pendingTasks = true;
        } else {
          this.pendingTasks = false;
        }
        // 判断是否是暂存过的任务
        if (pageParams.taskDetail.amVerifyWorkorder.tmpSave === 'true') {
          this.showSubmit = true;
          this.taskForm.reviewResultRadios = pageParams.taskDetail.amVerifyWorkorder.state > 6 && pageParams.taskDetail.amVerifyWorkorder.state !== 11
            ? (pageParams.taskDetail.variable && pageParams.taskDetail.variable.auditResult)
            : (pageParams.taskDetail.variable && pageParams.taskDetail.variable.result);
          this.taskForm.riskType = pageParams.taskDetail.amVerifyWorkorder.caseRiskType;
          this.taskForm.reviewDesc = pageParams.taskDetail.variable && pageParams.taskDetail.variable.auditOption;
          if (pageParams.state >= 3) {
            this.showSelectNameListSet = true;
            this.onChangeRadio(pageParams.taskDetail.variable.result);
            let stashBlackInfo = pageParams.taskDetail.amVerifyWorkorder.addBlackInfo
              ? pageParams.taskDetail.amVerifyWorkorder.addBlackInfo.split(',') : [];
            let currArr = [];
            for (let i = stashBlackInfo.length - 1; i >= 0; i--) {
              currArr.push(stashBlackInfo[i].split(':'));
            };
            // 6<=state<=10 || state >=12
            for (let j = 0; j < currArr.length; j++) {
              this.currentBlackListData[j].flag = currArr[j][1] === 'true';
              if ((pageParams.state < 6 && pageParams.state > 10) || pageParams.state === 11) {
                this.currentBlackListData[j].dataId = currArr[j][2].split(';');
              }
            }
          }
          if (pageParams.taskDetail.variable && pageParams.taskDetail.variable.filePath !== null) {
            const stashFilePath = JSON.parse(pageParams.taskDetail.variable.filePath);
            const pathKeys = Object.keys(stashFilePath);
            for (let i = 0; i < pathKeys.length; i++) {
              this.getStashFilePath(pathKeys[i], stashFilePath[pathKeys[i]]);
            }
          }
        }
        // 查询聚合列表信息
        if (pageParams.taskDetail.amVerifyWorkorder.isGroup === 1) {
          this.getDataList();
        }
        // 核查单合并处理
        if (pageParams.taskDetail.amVerifyWorkorder.groupIds) {
          const params = {
            field: this.field,
            appidList: this.appId,
            page: this.checkPageNum,
            pageSize: this.checkPageNumSize,
            state: 100,
            id: this.secondLevelRouterItems.id,
            groupIds: pageParams.taskDetail.amVerifyWorkorder.groupIds
          };
          dataService.polymerizationList(params).then(response => {
            this.mergeTableData = response.data.data.verifyList;
            this.mergeTotalItems = response.data.data.total;
            this.mergeQueryPageLength = response.data.data.totalPage;
          }).catch(err => { console.log(err); });
        }
      }
    },
    getStashFilePath (key, value) {
      let accessoryArr = [];
      let accessoryUrl = [];
      let accessorys = value.split(',');
      accessorys.forEach(item => {
        if (item) {
          accessoryUrl.push(item);
          let index = item.lastIndexOf('/');
          let fileName = item.substring(index + 1, item.length);
          accessoryArr.push({
            name: fileName,
            uploadStatus: 2,
            uploadPercentage: '100%',
            url: item
          });
        }
      });
      this.$nextTick(() => {
        switch (key) {
          case 'url1':
            this.accessoryArr1 = accessoryArr;
            this.accessoryUrl1 = accessoryUrl;
            break;
          case 'url2':
            this.accessoryArr2 = accessoryArr;
            this.accessoryUrl2 = accessoryUrl;
            break;
          case 'url3':
            this.accessoryArr3 = accessoryArr;
            this.accessoryUrl3 = accessoryUrl;
            break;
          case 'url4':
            this.accessoryArr4 = accessoryArr;
            this.accessoryUrl4 = accessoryUrl;
            break;
          case 'url5':
            this.accessoryArr5 = accessoryArr;
            this.accessoryUrl5 = accessoryUrl;
            break;
          default:
            break;
        }
      });
    },
    // 获取事件主体数据
    async queryEventBodyList () {
      let param = {
        identifier: 'sys_event_body'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.eventBodyItems.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    async queryRiskTypeList () {
      let param = {
        identifier: 'sys_case_risk_type'
      };
      const res = await dataService.findsysParams(param);
      if (res.data.code === 200) {
        res.data.data.forEach((item, index, ary) => {
          this.riskTypeItems.push({
            text: item.paramName,
            value: item.paramValue
          });
        });
      }
    },
    // 获取黑名单列表信息
    getAddBlackListData (param) {
      this.addBlackListData = [];
      this.currentBlackListData = [];
      if ((this.secondLevelRouterItems.state >= 6 && this.secondLevelRouterItems.state <= 10) || this.secondLevelRouterItems.state >= 12) {
        this.taskDetail.dataList.reverse();
      }
      if (this.taskDetail.dataList.length > 0) {
        this.taskDetail.dataList.forEach(item => {
          this.addBlackListData.push(Object.assign({}, item));
          this.currentBlackListData.push(Object.assign({}, item));
        });
        if (this.addBlackListData.length > 0) {
          for (let i = 0; i < this.addBlackListData.length; i++) {
            if (param === 3) {
              if (this.addBlackListData[i].map && this.addBlackListData[i].map.WHITE_LIST) {
                this.currentBlackListData[i].map = this.addBlackListData[i].map.WHITE_LIST;
              } else if (this.addBlackListData[i].map && this.addBlackListData[i].map.white) {
                this.currentBlackListData[i].map = this.addBlackListData[i].map.white;
                this.currentBlackListData[i].map.forEach((mapItm) => {
                  mapItm.listName = mapItm.name;
                });
              } else {
                this.currentBlackListData[i].map = [];
              }
              // this.currentBlackListData[i].map = this.addBlackListData[i].map && this.addBlackListData[i].map.WHITE_LIST;
            } else if (param === 4) {
              if (this.addBlackListData[i].map && this.addBlackListData[i].map.GREY_LIST) {
                this.currentBlackListData[i].map = this.addBlackListData[i].map.GREY_LIST;
              } else if (this.addBlackListData[i].map && this.addBlackListData[i].map.grey) {
                this.currentBlackListData[i].map = this.addBlackListData[i].map.grey;
                this.currentBlackListData[i].map.forEach((mapItm) => {
                  mapItm.listName = mapItm.name;
                });
              } else {
                this.currentBlackListData[i].map = [];
              }
              // this.currentBlackListData[i].map = this.addBlackListData[i].map && this.addBlackListData[i].map.GREY_LIST;
            } else if (param === 5) {
              if (this.addBlackListData[i].map && this.addBlackListData[i].map.BLACK_LIST) {
                this.currentBlackListData[i].map = this.addBlackListData[i].map.BLACK_LIST;
              } else if (this.addBlackListData[i].map && this.addBlackListData[i].map.black) {
                this.currentBlackListData[i].map = this.addBlackListData[i].map.black;
                this.currentBlackListData[i].map.forEach((mapItm) => {
                  mapItm.listName = mapItm.name;
                });
              } else {
                this.currentBlackListData[i].map = [];
              }
              // this.currentBlackListData[i].map = this.addBlackListData[i].map && this.addBlackListData[i].map.BLACK_LIST;
            }
          }
          if ((this.secondLevelRouterItems.state >= 6 && this.secondLevelRouterItems.state <= 10) || this.secondLevelRouterItems.state >= 12) {
            this.currentBlackListData.forEach((item, index) => {
              let dataIdArr = [];
              item.map.length > 0 && item.map.forEach(mapItm => {
                dataIdArr.push(mapItm.id);
              });
              item.dataId = dataIdArr;
            });
          }
        }
      }
    },
    // 点击审核按钮
    doTrial () {
      // 检查当前角色是否可以进行审核操作
      const roleFlag = this.secondLevelRouterItems.roleIdenList.some(item => item === 'first' || item === 'second' || item === 'normal' || item === 'admin');
      if (roleFlag && this.secondLevelRouterItems.isTrial === 'true' && (this.secondLevelRouterItems.taskStateName && this.secondLevelRouterItems.taskStateName === '待处理任务') && this.secondLevelRouterItems.state >= 3) {
        this.showSubmit = true;
      } else {
        this.snackbarError = true;
        this.snackbarServeMsg = '您没有权限对当前任务进行审核!';
        this.snackbarServeColor = 'error';
      }
    },
    // 返回一级页面
    cancel () {
      this.$router.go(-1);
    },
    // 转派
    transfer () {
      // 检查当前角色是否可以进行转派操作
      const roleFlag = this.secondLevelRouterItems.roleIdenList.some(item => item === 'first' || item === 'second' || item === 'normal' || item === 'admin');
      if (roleFlag && this.secondLevelRouterItems.isTransfer && (this.secondLevelRouterItems.taskStateName && this.secondLevelRouterItems.taskStateName === '待处理任务') && this.secondLevelRouterItems.state >= 3) {
        let groupIdent;
        // if (this.secondLevelRouterItems.roleIdenList.includes('first') && this.secondLevelRouterItems.roleType === 'first') {
        if (this.secondLevelRouterItems.roleType === 'first') {
          this.showTransferGroup = false;
          groupIdent = 'first';
          // } else if (this.secondLevelRouterItems.roleIdenList.includes('second') && this.secondLevelRouterItems.roleType === 'second') {
        } else if (this.secondLevelRouterItems.roleType === 'second') {
          this.showTransferGroup = true;
          groupIdent = '';
        }
        this.groupQueryData(groupIdent);
        this.showTransfer = true;
      } else {
        this.snackbarError = true;
        this.snackbarServeMsg = '您没有权限对当前任务进行转派!';
        this.snackbarServeColor = 'error';
      }
    },
    // 获取审核组人员信息
    async groupQueryData (item) {
      const params = { groupIdent: item };
      const res = await dataService.groupQuery(params);
      if (res.data.code === 200) {
        const resData = res.data.data.groupList;
        if (resData.length) {
          const firstGroup = resData.filter(item => item.groupIdent === 'first');
          const secondGroup = resData.filter(item => item.groupIdent === 'second');
          firstGroup.forEach((item) => {
            this.reviewFirstGroupItems.push({
              text: item.groupName,
              value: item.id,
              groupIdent: item.groupIdent
            });
          });
          secondGroup.forEach((item) => {
            this.reviewSecondGroupItems.push({
              text: item.groupName,
              value: item.id,
              groupIdent: item.groupIdent
            });
          });
        }
      }
    },
    // 获取转派人员信息
    async querySameLevelTransferInfo () {
      try {
        let params = {
          appIds: this.appId,
          userId: this.loginUserId,
          roleType: this.secondLevelRouterItems.roleType
        };
        const res = await dataService.querySameLevelTransferInfo(params);
        let resData = res.data.data.user;
        if (resData.length > 0) {
          for (let i = resData.length - 1; i >= 0; i--) {
            this.transferPersonItems.push({
              text: resData[i].name,
              value: resData[i].id
            });
          }
        }
      } catch (err) {}
    },
    // 审核时候的 -- 提交
    async doSubmit () {
      // 判断是否选择了审核结果
      if (!this.taskForm.reviewResultRadios) {
        this.snackbarError = true;
        this.snackbarServeMsg = '请选择审核结果';
        this.snackbarServeColor = 'error';
        return;
      }
      // POS渠道下
      if (this.secondLevelRouterItems.detailItemInfo.appId === 'com.wrcb.pos' && this.showRadioGroup) {
        let valiableFilePath = null;
        if (this.secondLevelRouterItems.taskDetail.variable && this.secondLevelRouterItems.taskDetail.variable.filePath !== null) {
          valiableFilePath = Object.assign({}, JSON.parse(this.secondLevelRouterItems.taskDetail.variable.filePath));
        }
        // if (!this.uploadFileInfo.url1 && (valiableFilePath && !valiableFilePath.url1)) {
        // console.log(this.uploadFileInfo)
        // console.log(valiableFilePath)
        if (!this.uploadFileInfo.url1 && valiableFilePath === null) {
          this.snackbarError = true;
          this.snackbarServeMsg = '请上传门头照!';
          this.snackbarServeColor = 'error';
          return;
        }
        if (this.uploadFileInfo.url1 === '') {
          this.snackbarError = true;
          this.snackbarServeMsg = '请上传门头照!';
          this.snackbarServeColor = 'error';
          return;
        }
        // if (!this.uploadFileInfo.url2 && (valiableFilePath && !valiableFilePath.url2)) {
        if (!this.uploadFileInfo.url2 && valiableFilePath === null) {
          this.snackbarError = true;
          this.snackbarServeMsg = '请上传收银照!';
          this.snackbarServeColor = 'error';
          return;
        }
        if (this.uploadFileInfo.url2 === '') {
          this.snackbarError = true;
          this.snackbarServeMsg = '请上传收银照!';
          this.snackbarServeColor = 'error';
          return;
        }
      }
      // const fileModify = Object.keys(this.uploadFileInfo).length ? 'true' : 'false';
      if (!Object.keys(this.uploadFileInfo).length && (this.secondLevelRouterItems.taskDetail.variable && this.secondLevelRouterItems.taskDetail.variable.filePath !== null)) {
        this.uploadFileInfo = JSON.parse(this.secondLevelRouterItems.taskDetail.variable.filePath);
      } else if (Object.keys(this.uploadFileInfo).length && (this.secondLevelRouterItems.taskDetail.variable && this.secondLevelRouterItems.taskDetail.variable.filePath !== null)) {
        let curObj = {};
        const curArr = ['url1', 'url2', 'url3', 'url4', 'url5'];
        let filePathObj = JSON.parse(this.secondLevelRouterItems.taskDetail.variable.filePath);
        for (const item of curArr) {
          if (this.uploadFileInfo[item] || this.uploadFileInfo[item] === undefined) { // 先过滤为true或者undefined都可以进，
            if (this.uploadFileInfo[item] ? this.uploadFileInfo[item] : filePathObj[item]) { // this.uploadFileInfo[item] ? this.uploadFileInfo[item] : filePathObj[item]此结果为true才可以
              curObj[item] = this.uploadFileInfo[item] ? this.uploadFileInfo[item] : filePathObj[item];
            }
          }
        }
        this.uploadFileInfo = Object.assign({}, curObj);
      }
      let params = null; // 初始化接口参数
      let mergeIdArr = [];
      this.mergeTableData.forEach(function (item) {
        mergeIdArr.push(item.id);
      });
      // 一级审批时
      if (this.showRadioGroup) {
        // 处理所选择的名单集信息
        let blackInfo = [];
        let blackSub = true;
        let labelHitRules = this.hitRules;
        if (!labelHitRules.officialResult) {
          labelHitRules = '';
        } else {
          labelHitRules = JSON.stringify(this.hitRules.officialResult.label_hit_rules);
        }
        for (let i = this.currentBlackListData.length - 1; i >= 0; i--) {
          switch (this.currentBlackListData[i].identifer) {
            case 'dev_fp':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`dev_fp:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`dev_fp:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'ip':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`ip:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`ip:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'phone':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`phone:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`phone:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'id_no':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`id_no:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`id_no:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'bank_card':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`bank_card:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`bank_card:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'merchant_no':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`merchant_no:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`merchant_no:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            default:
              break;
          }
        }
        if (!blackSub) {
          this.snackbarError = true;
          this.snackbarServeMsg = '请选择名单集';
          this.snackbarServeColor = 'error';
          return;
        }
        params = Object.assign({}, {
          verifyId: mergeIdArr.length > 0 ? this.secondLevelRouterItems.id + ',' + mergeIdArr.join(',') : this.secondLevelRouterItems.id,
          auditResult: 1,
          auditOption: this.taskForm.reviewDesc,
          addBlackInfo: blackInfo.join(','),
          result: this.taskForm.reviewResultRadios,
          token: this.token,
          // fileModify: fileModify,
          caseRiskType: this.taskForm.riskType,
          filePath: JSON.stringify(this.uploadFileInfo),
          // 后台需要风控详情信息
          workWeightHitRule: labelHitRules
          // workWeightHitRule: JSON.stringify(this.hitRules.officialResult.label_hit_rules)
        });
      } else {
        // 二级审核时
        params = Object.assign({}, {
          verifyId: mergeIdArr.length > 0 ? this.secondLevelRouterItems.id + ',' + mergeIdArr.join(',') : this.secondLevelRouterItems.id,
          auditResult: this.taskForm.reviewResultRadios,
          auditOption: this.taskForm.reviewDesc,
          token: this.token,
          result: this.taskDetail.amVerifyWorkorder.result,
          addBlackInfo: this.taskDetail.amVerifyWorkorder.addBlackInfo,
          // fileModify: fileModify,
          caseRiskType: this.taskForm.riskType,
          filePath: JSON.stringify(this.uploadFileInfo)
        });
      }
      // console.log(params)
      // return;
      const res = await dataService.taskSubmit(params);
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = res.data.msg;
        this.snackbarServeColor = 'success';
      }
    },
    // 转派时候的提交
    async doTransfer () {
      // 处理转派时的接口参数
      let params = {
        ids: this.secondLevelRouterItems.id,
        transferUser: this.selectForm.transferPerson,
        token: this.token,
        states: this.secondLevelRouterItems.detailItemInfo.state
      };
      const res = await dataService.transferSubmit(params);
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = res.data.msg;
        this.snackbarServeColor = 'success';
      }
    },
    // 选择事件类型 -- 单选按钮
    onChangeRadio (param) {
      if (param === 3) {
        this.nameListSetTitle = '添加白名单';
        this.addBlackListHeaders[2].text = '是否加白';
        this.taskForm.riskType = null;
      } else if (param === 4) {
        this.nameListSetTitle = '添加灰名单';
        this.addBlackListHeaders[2].text = '是否加灰';
      } else if (param === 5) {
        this.nameListSetTitle = '添加黑名单';
        this.addBlackListHeaders[2].text = '是否加黑';
      }
      this.getAddBlackListData(param);
      this.showSelectNameListSet = true;
    },
    getDetailFile (key, value) {
      let detailFileItems = value.split(',');
      detailFileItems.forEach(item => {
        if (item) {
          let index = item.lastIndexOf('/');
          let fileName = item.substring(index + 1, item.length);
          this.filePathArr.push({
            name: fileName,
            url: item,
            fileKey: key
          });
        }
      });
    },
    // 点击审核记录中的--查看详情按钮
    async checkDetail (item) {
      // 返显详情记录中的附件资料
      this.filePathArr = [];
      let recordFileArr = this.secondLevelRouterItems.taskDetail.amVerifyWorkorder.filePath !== null ? JSON.parse(this.secondLevelRouterItems.taskDetail.amVerifyWorkorder.filePath) : {};
      const pathKeys = Object.keys(recordFileArr);
      for (let i = 0; i < pathKeys.length; i++) {
        this.getDetailFile(pathKeys[i], recordFileArr[pathKeys[i]]);
      }

      // 调查询记录详情的接口
      let params = {
        id: item.id,
        caseType: item.caseType,
        operation: item.operation,
        token: this.token,
        createTime: item.operationName === '分配任务' ? item.createTime : ''
      };
      const res = await dataService.checkDetail(params);
      this.detailData = res.data.data;
      // 判断任务状态，设置弹窗标题
      if (item.caseType === 1) {
        this.detailTitle = '一级审核流';
      } else if (item.caseType === 2) {
        this.detailTitle = '二级审核流';
      } else if (item.operation === 1) {
        this.detailTitle = '审核结果';
      } else if (item.operation === 2) {
        this.detailTitle = '复审结果';
      }
      // 是初审状态时
      if (this.detailData.caseInfo) {
        this.dialog_currentBlackListData = this.detailData.caseInfo.dataList;
        // 判断审核结果状态，设置表格表头
        if (this.detailData.caseInfo.result === '清白件') {
          this.nameListSetTitle = '添加白名单';
          this.addBlackListHeaders[2].text = '是否加白';
          this.dialog_currentBlackListData.forEach(item => {
            if (item.map) {
              item.setName = item.map.white[0].name;
            }
          });
        } else if (this.detailData.caseInfo.result === '疑似欺诈') {
          this.nameListSetTitle = '添加灰名单';
          this.addBlackListHeaders[2].text = '是否加灰';
          this.dialog_currentBlackListData.forEach(item => {
            if (item.map) {
              item.setName = item.map.grey[0].name;
            }
          });
        } else if (this.detailData.caseInfo.result === '案件') {
          this.nameListSetTitle = '添加黑名单';
          this.addBlackListHeaders[2].text = '是否加黑';
          this.dialog_currentBlackListData.forEach(item => {
            if (item.map) {
              item.setName = item.map.black[0].name;
            }
          });
        }
        this.dialog_currentBlackListData.forEach(item => {
          if (item.flag) {
            item.flag = '是';
          } else {
            item.flag = '否';
          }
        });
      }
      // 是复审状态时
      if (this.detailData.reback) {
        this.detailData.caseInfo = Object.assign({}, this.detailData.reback);
      }
      // 展示弹窗
      this.detailDialog = true;
    },
    // 查询聚合事件列表
    async getDataList () {
      this.pendingTaskData = [];
      if (this.taskDetail.amVerifyWorkorder.isGroup === 1) {
        const params = {
          dataGroupId: this.taskDetail.amVerifyWorkorder.dataGroupId,
          page: this.pageNum,
          pageSize: this.perPageNum,
          token: this.token
        };
        const res = await dataService.queryGroupList(params);
        if (res.data.code === 200) {
          this.pendingTaskData = res.data.data.groupBondList;
          this.totalItems = res.data.data.total;
          this.queryPageLength = res.data.data.totalPage;
        }
      }
    },
    // 聚合事件列表--点击查看详情
    async queryDetailItem (item) {
      // this.outAccountInfoDialog = {};
      // this.inAccountInfoDialog = {};
      // this.transationInfoDialog = {};
      // this.otherInfoDialog = {};
      // this.hitRulesDialog = {};
      const params = {
        userId: item.user_id,
        opId: item.op_id,
        inAccount: item.inAccount,
        mchtNo: item.shopNo,
        token: this.token
      };
      const res = await dataService.showDataDetail(params);
      if (res.data.code === 200) {
        const resData = res.data.data;
        this.outAccountInfoDialog = Object.assign({}, resData.outAccountInfo);
        this.inAccountInfoDialog = Object.assign({}, resData.inAccountInfo);
        this.transationInfoDialog = Object.assign({}, {
          isAmount: this.secondLevelRouterItems.isAmount,
          createTime: item.create_time,
          appId: item.aid,
          opType: item.op_type,
          op_type: item.op_type,
          opState: item.op_state,
          location: item.city,
          outAccount: item.out_account,
          inAccount: item.in_account,
          amount: item.amount
        });
        this.otherInfoDialog = Object.assign({}, {
          eventNo: item.eventNo,
          devFp: item.dev_fp,
          brand: item.brand,
          model: item.model,
          ip: item.ip
        });
        if (resData.hitRule) {
          let baseRes = Object.assign({}, resData.hitRule);
          if (Object.keys(baseRes.officialResult).length > 0) {
            baseRes.officialResult.hit_labels = (baseRes.officialResult.hit_labels.substring(baseRes.officialResult.hit_labels.length - 1) === ',') ? baseRes.officialResult.hit_labels.substring(0, baseRes.officialResult.hit_labels.length - 1) : baseRes.officialResult.hit_labels;
          } else {
            baseRes.officialResult = {};
          }
          if (Object.keys(baseRes.simulatedResult).length > 0) {
            baseRes.simulatedResult.hit_labels = (baseRes.simulatedResult.hit_labels.substring(baseRes.simulatedResult.hit_labels.length - 1) === ',') ? baseRes.simulatedResult.hit_labels.substring(0, baseRes.simulatedResult.hit_labels.length - 1) : baseRes.simulatedResult.hit_labels;
          } else {
            baseRes.simulatedResult = {};
          }
          this.hitRulesDialog = baseRes;
        } else {
          this.hitRulesDialog = this.hitRule;
        }
        this.riskLogDetail = true;
      }
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
    // 查询关联风控日志
    async getEventsRiskList () {
      this.loading = true;
      const params = {
        startIndex: this.riskLogPageNum,
        pageSize: this.riskLogPerPageNum,
        isAmount: this.secondLevelRouterItems.isAmount,
        dataType: this.secondLevelRouterItems.isAmount,
        eventBody: this.searchForm.eventBody,
        eventValue: this.searchForm.eventValue,
        startTime: this.searchForm.dates[0],
        endTime: this.searchForm.dates[1]
      };
      const res = await getEventsRiskList(params);
      if (res.data.code === 200) {
        this.riskLogTableData = res.data.data.data;
        this.riskLogTotalItems = res.data.data.total;
        this.riskLogQueryPageLength = res.data.data.pages;
        this.loading = false;
      }
    },
    // 选择时间的弹框
    dateChange () {
      if (this.searchForm.dates.length === 2) {
        this.isdateShow = false;
      }
    },
    // 选择时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
    },
    changeEventBody (item) {
      this.conditionPlaceholder = this.eventBodyItems.filter(items => items.value === item)[0].text;
      if (!item) {
        this.conditionPlaceholder = '';
      }
    },
    reset () {
      this.$refs.searchForm.reset();
      this.searchForm.dates = [];
      this.riskLogPageNum = 1;
      this.conditionPlaceholder = '';
      this.riskLogTableData = [];
      this.riskLogTotalItems = 0;
      this.riskLogQueryPageLength = 0;
      // this.getEventsRiskList();
    },
    search () {
      if (!this.$refs.searchForm.validate()) return;
      this.riskLogPageNum = 1;
      this.getEventsRiskList();
    },
    // 切换每页显示几条数据
    riskLogPageChange () {
      this.riskLogPageNum = 1; // 默认从第一页开始查询
      this.getEventsRiskList();
    },
    // 切换页码
    riskLogOnPageChange (page) {
      this.riskLogPageNum = page;
      this.getEventsRiskList();
    },
    // 点击暂存按钮
    async stashData () {
      let params = null;
      if (!Object.keys(this.uploadFileInfo).length && (this.secondLevelRouterItems.taskDetail.variable && this.secondLevelRouterItems.taskDetail.variable.filePath !== null)) {
        this.uploadFileInfo = JSON.parse(this.secondLevelRouterItems.taskDetail.variable.filePath);
      } else if (Object.keys(this.uploadFileInfo).length && (this.secondLevelRouterItems.taskDetail.variable && this.secondLevelRouterItems.taskDetail.variable.filePath !== null)) {
        let curObj = {};
        const curArr = ['url1', 'url2', 'url3', 'url4', 'url5'];
        let filePathObj = JSON.parse(this.secondLevelRouterItems.taskDetail.variable.filePath);
        for (const item of curArr) {
          if (this.uploadFileInfo[item] || this.uploadFileInfo[item] === undefined) { // 先过滤为true或者undefined都可以进，
            if (this.uploadFileInfo[item] ? this.uploadFileInfo[item] : filePathObj[item]) { // this.uploadFileInfo[item] ? this.uploadFileInfo[item] : filePathObj[item]此结果为true才可以
              curObj[item] = this.uploadFileInfo[item] ? this.uploadFileInfo[item] : filePathObj[item];
            }
          }
        }
        this.uploadFileInfo = Object.assign({}, curObj);
      }
      let mergeIdArr = [];
      this.mergeTableData.forEach(function (item) {
        mergeIdArr.push(item.id);
      });
      if (this.showRadioGroup) {
        // 处理所选择的名单集信息
        let blackInfo = [];
        let blackSub = true;
        for (let i = this.currentBlackListData.length - 1; i >= 0; i--) {
          switch (this.currentBlackListData[i].identifer) {
            case 'dev_fp':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`dev_fp:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`dev_fp:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'ip':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`ip:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`ip:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'phone':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`phone:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`phone:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'id_no':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`id_no:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`id_no:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'bank_card':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`bank_card:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`bank_card:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            case 'merchant_no':
              if (this.currentBlackListData[i].flag === true) {
                if (this.currentBlackListData[i].dataId instanceof Array) {
                  blackInfo.push(`merchant_no:${this.currentBlackListData[i].flag}:${this.currentBlackListData[i].dataId.join(';')}`);
                } else {
                  blackSub = false;
                }
              } else {
                blackInfo.push(`merchant_no:${this.currentBlackListData[i].flag}:null`);
              }
              break;
            default:
              break;
          }
        }
        if (!blackSub) {
          this.snackbarError = true;
          this.snackbarServeMsg = '请选择名单集';
          this.snackbarServeColor = 'error';
          return;
        }
        params = Object.assign({}, {
          verifyId: mergeIdArr.length > 0 ? this.secondLevelRouterItems.id + ',' + mergeIdArr.join(',') : this.secondLevelRouterItems.id,
          auditResult: 1,
          auditOption: this.taskForm.reviewDesc,
          addBlackInfo: blackInfo.join(','),
          result: this.taskForm.reviewResultRadios,
          caseRiskType: this.taskForm.riskType,
          token: this.token,
          filePath: JSON.stringify(this.uploadFileInfo)
        });
      } else {
        // 二级审核时
        params = Object.assign({}, {
          verifyId: mergeIdArr.length > 0 ? this.secondLevelRouterItems.id + ',' + mergeIdArr.join(',') : this.secondLevelRouterItems.id,
          auditResult: this.taskForm.reviewResultRadios,
          auditOption: this.taskForm.reviewDesc,
          token: this.token,
          result: this.taskDetail.amVerifyWorkorder.result,
          caseRiskType: this.taskForm.riskType,
          addBlackInfo: this.taskDetail.amVerifyWorkorder.addBlackInfo,
          filePath: JSON.stringify(this.uploadFileInfo)
        });
      }
      const res = await dataService.storeTask(params);
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = res.data.msg;
        this.snackbarServeColor = 'success';
      }
    },
    getFileFun ($event, type) {
      switch (type) {
        case 1:
          this.uploadFileInfo.url1 = $event.length ? $event.join(',') : ''; // 附件
          break;
        case 2:
          this.uploadFileInfo.url2 = $event.length ? $event.join(',') : ''; // 附件
          break;
        case 3:
          this.uploadFileInfo.url3 = $event.length ? $event.join(',') : ''; // 附件
          break;
        case 4:
          this.uploadFileInfo.url4 = $event.length ? $event.join(',') : ''; // 附件
          break;
        case 5:
          this.uploadFileInfo.url5 = $event.length ? $event.join(',') : ''; // 附件
          break;
        default:
          break;
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
  .title-info {
    span {
      color:#999999;
    }
  }
  .base_field_text_cu {
    color: #000;
    font-weight: bold;
  }
  .base_field_color {
    color: var(--v-seeDetialFieldColor-base);
  }
  .header_bg_color {
    height: 40px;
    padding: 0;
    padding-left: 10px;
    font-size: 14px;
    background: var(--v-seeDetailsHeadBgColor-base) !important;
    color: #000;
    font-size: 16px;
  }
  .seeDetails_size {
    font-size: 18px;
  }
  .rule-risk-strategy {
    height: 20px;
    line-height: 20px;
    padding: 0;
    padding-left: 6px;
    padding-top: 6px;
    font-size: 18px;
    color: #000;
  }
  .text-color {
    color:#000;
    font-weight:500;
  }
  .span_left {
    display: inline-block;
    width: 120px;
    margin-left: 10px;
    margin-right: 10px;
    text-align: right;
    height: 32px;
    line-height: 32px;
    vertical-align: top;
  }
  .span_right {
    display: inline-block;
    width: 300px;
    text-align: left;
    height: 32px;
    line-height: 32px;
  }
  .case_task_left {
    display: inline-block;
    width: 12%;
    text-align: right;
    vertical-align: top;
  }
  .case_task_right {
    display: inline-block;
    width: 65%;
    padding-left: 15px;
  }
  .box-background {
    padding-left: 10px;
    background: #f8f9fa;
    color: #292a2c;
  }
  .strategy-margin-left {
    margin-left: 32%;
  }
  .strategy-title-margin-left {
    margin-left: 24%;
  }
  // 表格样式
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
  // 流程图对应的详情样式
  .spLevel1-height { // 初审时流程图高度
    height: 300px;
  }
  .spLevel2-height { // 复审时流程图高度
    height: 500px;
  }
  .risk-info {
    padding-left: 50px;
  }
  .task-record-width {
    line-height:28px;
    width: 85px;
  }
  .file-icon {
    text-align: right;
  }
  .file-position {
    position: absolute;
    top: 15px;
  }
  .file-position-left {
    position: relative;
    margin-left: 12%;
    width: 88% !important;
  }
  >>> .v-select__selections{
    flex-wrap: nowrap;
  }
  .fixed {
    position: fixed;
    width: auto;
    top: 0;
    left: 240px;
    right: 12px;
    z-index: 9;
    border-bottom: 1px solid #ededed;
  }
</style>
