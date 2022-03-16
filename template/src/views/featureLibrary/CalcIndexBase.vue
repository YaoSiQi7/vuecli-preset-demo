<!----------  @author: wangGuoDong  ----------->
<!----------  @updated_at: 2020-04-14  ----------->
<!----------  @version: 2.0  ----------->

<template>
  <div class="enu-content">
    <v-row>
      <v-col :cols="3" class="py-0 fill-height">
         <v-card class="elevation-3">
           <v-card-text class="pa-0" :style="{height: tableHeight + 64 + 'px', 'overflow-y': 'auto'}">
          <tree-view
            ref="treeView"
            :items="constItem"
            :itemText="itemText"
            :deletePowerBtn="deletePowerBtn"
            :editPowerBtn="baseCteateEditPowerBtn"
            :isTop="isTopShow"
            :isFirstLineSelected='isFirstLineSelected'
            :isEnd="isEnd"
            :treeActive="treeActive"
            @edits="editParms"
            @removes="deleteParms"
            @getList="constMenu($event)"
          ></tree-view>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
            <v-btn text large color="primary" v-if="hasPermission(addPowerBtn)" style="width:100%" @click="tog">添加目录项</v-btn>
            <div v-else style="width:100%;height: 44px;"> </div>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col :cols="9" class="py-0 pl-0">
        <v-card class="elevation-3">
          <v-data-table
            :headers="filHeader"
            :items="filItem"
            hide-default-footer
            :items-per-page="perPageNum"
            no-results-text="没有匹配的数据"
            :height="tableHeight"
            :fixed-header="true"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-row style="align-items: center;">
                  <v-col class="mb-0" md="3">
                    <v-card-title class="pl-0">
                      <v-text-field
                          v-model="search1"
                          placeholder="请输入条件搜索"
                          append-icon="mdi-magnify"
                          outlined
                          dense
                          @keyup="inputSearch"
                        ></v-text-field>
                    </v-card-title>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col md="2" class="pl-0 pr-0" v-btn="['/addTempIndexButton']">
                    <v-card-title>
                      <v-btn
                        color="primary"
                        @click="addFilParms('TEMPLATE_VAR')"
                      >
                        添加模板指标
                      </v-btn>
                    </v-card-title>
                  </v-col>
                  <v-col md="2" class="pl-0 pr-0" v-btn="['/addMethodIndexButton']">
                    <v-card-title>
                      <v-btn
                        color="primary"
                        @click="addFilParms('METHOD_VAR')"
                      >
                        添加方法指标
                      </v-btn>
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-toolbar>
            </template>
            <template v-slot:item.indicName="{ item }">
              <span :title="`${item.indicName}`">{{ item.indicName | ellipsis(40) }}</span>
            </template>
            <template v-slot:item.indicType="{ item }">
              <span :title="`${item.indicType}`">{{ item.indicType }}</span>
            </template>
            <template v-slot:item.indicMode="{ item }">
              <span :title="`${item.indicMode}`">{{ item.indicMode | addType()}}</span>
            </template>
            <template v-slot:item.action="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-btn="['/editIndexButton']"
                    small
                    class="mr-1 icon-primary"
                    v-on="on"
                    color="primary"
                    @click="editFildParms(item)"
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
                    @click="deletefiled(item)"
                    v-if="item.isInternal !== '1' && item.isQuote !== '3' && hasPermission('/deleteIndexButton')"
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
    <base-create :formHeader='addOrEditHeader' :crudFormDialog='dialog' :formData='addAndEditFormData' :isCanEdit='isGroupCanDelOrEdit'
    @cancelCrudFormDialog='cancle($event)' @confimDialogSave='save(arguments)' @switchOnChange="onChang($event)" :baseCteateEditPowerBtn="baseCteateEditPowerBtn"></base-create>
    <del-dialog :isDialogShow='dialogDel' @cancelDel='constantDelCancle($event)' @confimDel='deleteEnum($event)'></del-dialog>
    <del-dialog :isDialogShow='dialogDel_f' :debugModeClueCode ="debugModeClueCode" @cancelDel='delFieldCancle($event)' @confimDel='delFieldOk($event)'></del-dialog>
    <!-- 添加指标模板 -->
    <v-row>
      <v-dialog v-model="dialog_fil" persistent width="800">
        <v-card>
          <v-card-title class="justify-left">
            <v-toolbar-title>{{ titleIndicator }}</v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn icon>
              <v-icon @click="cancleTem()">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-stepper class="mt-4" v-model="e1">
              <v-stepper-header>
                <v-stepper-step step="1">{{ oneStepName }}</v-stepper-step>
                <v-divider />
                <v-stepper-step step="2">{{ twoStepName }}</v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <!-- 第一步步骤 -->
                <v-stepper-content step="1">
                  <v-row>
                    <v-col cols="6">
                      <v-card>
                        <v-card-title>
                          <v-text-field
                            v-model="search2"
                            append-icon="mdi-magnify"
                            label="请输入条件搜索"
                            single-line
                            hide-details
                            outlined
                            dense
                          />
                        </v-card-title>
                        <v-data-table
                          :headers="tempGroupHeader"
                          :search="search2"
                          :items="tempGroupItem"
                          hide-default-footer
                          class="elevation-1"
                          :items-per-page="1000"
                          no-results-text="没有匹配的数据"
                        >
                          <template v-slot:body="{ items }">
                            <tr
                              v-for="(item, index) in items"
                              :key="index + '17'"
                              class="el-tr-defu"
                              :class="{activeUserDef:index == secondIsActive}"
                              @click="tempGroupClick(item,index)"
                            >
                              <td class="el-border-defu">{{ item.templateName }}</td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-card>
                    </v-col>
                    <v-col cols="6">
                      <v-card>
                        <v-card-title>
                          <v-text-field
                            v-model="search3"
                            append-icon="mdi-magnify"
                            label="请输入条件搜索"
                            single-line
                            hide-details
                            outlined
                            dense
                          />
                        </v-card-title>
                        <v-data-table
                          :headers="tempNameHeader"
                          :search="search3"
                          :items="tempNameItem"
                          hide-default-footer
                          class="elevation-1"
                          :items-per-page="1000"
                          no-results-text="没有匹配的数据"
                        >
                          <template v-slot:body="{ items }">
                            <tr
                              v-for="(item, index) in items"
                              :key="index + '16'"
                              class="el-tr-defu"
                              :class="{activeUserDef:index == ins}"
                              @click="tempNameClick(item,index)"
                            >
                              <td class="el-border-defu">{{ item.tempName }}</td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-btn color="primary" style="mr-5" @click="nextStep()">下一步</v-btn>
                </v-stepper-content>
                <!-- 第二步步骤 -->
                <v-stepper-content step="2">
                  <v-row>
                    <v-col cols="10">
                      <v-form ref="tempInstru_form" v-model="valid" :lazy-validation="lazy">
                        <v-row style="text-align:left">
                          <v-col cols="3">
                            <div class="labelStyle">指标名称*:</div>
                          </v-col>
                          <v-col cols="8">
                            <v-text-field
                              :disabled="!isFieldCanDelOrEdit"
                              v-model.trim="indicatorsName"
                              placeholder="指标名称*"
                              type="text"
                              required
                              :rules="[
                                v => !!v || '指标名称不能为空'
                                // eslint-disable-next-line no-mixed-operators
                                // v => v && v.length <= 50 || '最多只能输入50个字符',
                                // v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线calcIndexBase，及其组合'
                              ]"
                              outlined
                              dense
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="3">
                            <div class="labelStyle">适用渠道*:</div>
                          </v-col>
                          <v-col cols="4">
                            <v-select
                              :disabled="!isFieldCanDelOrEdit"
                              v-model="properChannelsParamValue"
                              item-text="name"
                              item-value="value"
                              :items="channelTypeFirstClassArr"
                              :rules="baseChanneltradRules"
                              no-data-text="没有匹配数据"
                              outlined
                              dense
                              @change="properChannelsfirstChange(properChannelsParamValue)"
                            />
                          </v-col>
                          <v-col cols="4" v-if="properChannelsSecondSelectShow">
                            <v-select
                              :disabled="!isFieldCanDelOrEdit"
                              v-model="properChannelsSecondSelectParamValue"
                              item-text="name"
                              item-value="value"
                              :items="channelTypeSecondClassArr"
                              :rules="baseChanneltradRules"
                              no-data-text="没有匹配数据"
                              @change="properChannelsSecondSelectChange(properChannelsSecondSelectParamValue)"
                              outlined
                              dense
                            />
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="3">
                            <div class="labelStyle">适用交易*:</div>
                          </v-col>
                          <v-col cols="4">
                            <v-select
                             :disabled="!isFieldCanDelOrEdit"
                              v-model="UsingTradeParamValue"
                              item-text="name"
                              item-value="value"
                              :items="UsingTradeFirstClassArr"
                              :rules="baseChanneltradRules"
                              no-data-text="没有匹配数据"
                              outlined
                              dense
                              @change="UsingTradefirstChange(UsingTradeParamValue)"
                            />
                          </v-col>
                          <v-col cols="4" v-if="UsingTradeSecondSelectShow">
                            <v-select
                             :disabled="!isFieldCanDelOrEdit"
                              v-model="UsingTradeSecondSelectParamValue"
                              item-text="name"
                              item-value="value"
                              :items="UsingTradeSecondClassArr"
                              :rules="baseChanneltradRules"
                              no-data-text="没有匹配数据"
                              outlined
                              dense
                            />
                          </v-col>
                        </v-row>
                        <v-row style="text-align:left">
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="3">
                                <h3 style="text-align: right;">{{ structureName }}</h3>
                              </v-col>
                              <v-col cols="9">
                                <h3 style="color: #ccc;">{{ templateOrFuncName }}</h3>
                              </v-col>
                            </v-row>

                            <v-row v-for="(item,index) in templateParameter" :key="index + '15'">
                              <v-col cols="3">
                                <div class="labelStyle"><span class="circle"></span>{{ item.paramName }}*:</div>
                              </v-col>
                              <v-col v-if="item.paramSrc == '31'" cols="8">
                                <v-text-field
                                  v-if="fflag== 1"
                                  :disabled="!isFieldCanDelOrEdit"
                                  v-model.trim="optionsValues[index]"
                                  :placeholder = "item.paramName + '*'"
                                  type="text"
                                  counter="50"
                                  required
                                  :rules="[
                                    v => !!v || item.paramName + '不能为空',
                                    // eslint-disable-next-line no-mixed-operators
                                    v => v && v.length <= 50 || '最多只能输入50个字符'
                                  ]"
                                  outlined
                                  dense
                                  class="templaterAddWidth"
                                />
                                <v-text-field
                                 :disabled="!isFieldCanDelOrEdit"
                                  v-else-if="fflag== 2"
                                  v-model.trim="optionsValues[index]"
                                  :placeholder = "item.paramName + '*'"
                                  type="text"
                                  counter="50"
                                  required
                                  :rules="[
                                    v => !!v || item.paramName + '不能为空',
                                    // eslint-disable-next-line no-mixed-operators
                                    v => v && v.length <= 50 || '最多只能输入50个字符'
                                  ]"
                                  outlined
                                  dense
                                  class="templaterAddWidth"
                                />
                                <v-text-field
                                 :disabled="!isFieldCanDelOrEdit"
                                  v-else
                                  v-model.trim="optionsValues[index].value"
                                  :placeholder = "item.paramName + '*'"
                                  type="text"
                                  counter="50"
                                  required
                                  :rules="[
                                    v => !!v || item.paramName + '不能为空',
                                    // eslint-disable-next-line no-mixed-operators
                                    v => v && v.length <= 50 || '最多只能输入50个字符'
                                  ]"
                                  outlined
                                  dense
                                  class="templaterAddWidth"
                                />
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
                                    <span>{{item.comment || '无说明'}}</span>
                                  </v-tooltip>
                                </span>
                              </v-col>
                              <v-col v-else-if="item.paramSrc === 'inputOrSrcList'" cols="8">
                                <v-combobox
                                  :disabled="!isFieldCanDelOrEdit"
                                  v-model="optionsValues[index]"
                                  :items="item.srcList"
                                  item-text="name"
                                  item-value="id"
                                  return-object
                                  :rules="[optionsValuesRules]"
                                  :placeholder = "item.paramName + '*'"
                                  no-data-text="没有数据"
                                  @blur="change1(optionsValues[index])"
                                  outlined
                                  dense
                                  class="templaterAddWidth"
                                ></v-combobox>
                                <span class="questionMark" v-if="templaterOrFunc === 'TEMPLATE_VAR'">
                                  <v-tooltip right >
                                    <template v-slot:activator="{ on }">
                                      <v-icon
                                        class="mr-1"
                                        color="primary"
                                        v-on="on"
                                        size="20"
                                      >mdi-help-circle</v-icon>
                                    </template>
                                    <span>{{item.comment || '无说明'}}</span>
                                  </v-tooltip>
                                </span>
                              </v-col>
                              <v-col v-else cols="8">
                                <v-autocomplete
                                  :disabled="!isFieldCanDelOrEdit"
                                  v-model="optionsValues[index]"
                                  :items="item.srcList"
                                  item-text="name"
                                  item-value="id"
                                  return-object
                                  :rules="[optionsValuesRules]"
                                  :placeholder = "item.paramName + '*'"
                                  no-data-text="没有数据"
                                  @change="change1(optionsValues)"
                                  outlined
                                  dense
                                  class="templaterAddWidth"
                                ></v-autocomplete>
                                <span class="questionMark" v-if="templaterOrFunc === 'TEMPLATE_VAR'">
                                  <v-tooltip right >
                                    <template v-slot:activator="{ on }">
                                      <v-icon
                                        class="mr-1"
                                        color="primary"
                                        v-on="on"
                                        size="20"
                                      >mdi-help-circle</v-icon>
                                    </template>
                                    <span>{{item.comment || '无说明'}}</span>
                                  </v-tooltip>
                                </span>
                              </v-col>
                            </v-row>

                            <v-row>
                              <v-col cols="3">
                                <h3 style="text-align:right">过滤条件</h3>
                              </v-col>
                              <v-col cols="3">
                                <v-btn
                                  color="primary"
                                  class="white--text"
                                  @click="addFilterCondition()"
                                >
                                  <v-icon>add</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
                            <div v-for="(filterItem, filterIndex) in filterCondition" :key="filterIndex + '14'" class="filter-contition">
                              <v-row>
                                <v-col cols="4" style="line-height: 36px;">
                                  <h3>过滤条件-{{ String.fromCharCode(64 + parseInt(filterIndex + 1)) }}</h3>
                                </v-col>
                                <v-col cols="8" style="text-align: right;">
                                  <v-btn icon class="mr-1">
                                    <v-icon @click="cancleFilterCondition(filterIndex)">mdi-close</v-icon>
                                  </v-btn>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="3">
                                  <div class="labelStyle"><span class="circle"></span>{{ filterItem.filterTypeLabel }}</div>
                                </v-col>
                                <v-col cols="8">
                                  <v-select
                                    v-model="filterItem.filterTypeValue"
                                    :item-text="filterItem.text"
                                    :item-value="filterItem.value"
                                    :items="filterItem.filterTypeItem"
                                    no-data-text="没有匹配数据"
                                    outlined
                                    dense
                                    @change="conditionTypeChange(filterItem.filterTypeValue, filterItem)"
                                  />
                                </v-col>
                              </v-row>
                              <div v-if="filterItem.filterTypeValue === '0' || filterItem.filterTypeValue === '2' || filterItem.filterTypeValue === '3' || filterItem.filterTypeValue === '6'">
                                <v-row v-for="(im,ix) in filterItem.filterConditionChild" :key="ix + '13'">
                                  <v-col cols="3">
                                    <div class="labelStyle"><span class="circle"></span>{{ im.paramName }}</div>
                                  </v-col>
                                  <v-col v-if="im.filterType == 'text'" cols="8">
                                    <v-text-field
                                      :placeholder = "im.paramName + '*'"
                                      v-model.trim="im.value"
                                      outlined
                                      dense
                                    />
                                  </v-col>
                                  <v-col v-else-if="im.filterType == 'inputAndSelect'" cols="8">
                                    <v-combobox
                                      v-model="im.value"
                                      :items="im.options"
                                      item-text="selectT"
                                      item-value="selectV"
                                      return-object
                                      :placeholder = "im.paramName + '*'"
                                      no-data-text="没有数据"
                                      outlined
                                      dense
                                    ></v-combobox>
                                  </v-col>
                                  <v-col v-else cols="8">
                                    <v-autocomplete
                                      v-model="im.value"
                                      :placeholder = "im.paramName + '*'"
                                      item-text="selectT"
                                      item-value="selectV"
                                      :items="im.options"
                                      no-data-text="没有匹配数据"
                                      outlined
                                      dense
                                    />
                                  </v-col>
                                </v-row>
                              </div>
                              <div v-if="filterItem.filterTypeValue === '1'">
                                <v-row v-for="(compareItem, compareIndex) in filterItem.filterConditionChild" :key="compareIndex +'12'">
                                  <v-col cols="3">
                                    <div class="labelStyle"><span class="circle"></span>{{ compareItem.paramName }}</div>
                                  </v-col>
                                  <v-col v-if="compareItem.filterType == 'text'" cols="8">
                                    <v-text-field
                                      :placeholder = "compareItem.paramName + '*'"
                                      v-model.trim="compareItem.value"
                                      outlined
                                      dense
                                    />
                                  </v-col>
                                  <v-col v-else cols="8">
                                    <v-autocomplete
                                      v-model="compareItem.value"
                                      item-text="selectT"
                                      item-value="selectV"
                                      :items="compareItem.options"
                                      no-data-text="没有匹配数据"
                                      outlined
                                      dense
                                    />
                                  </v-col>
                                </v-row>
                              </div>
                              <div v-else ></div>
                            </div>
                            <div class="contition-expression" v-if="filterCondition.length > 0">
                              <h3>条件关系表达式</h3>
                              <v-row>
                                <v-col>
                                  <v-radio-group v-model="radios" style="float:left" row>
                                    <v-radio label="全且" value="0"></v-radio>
                                    <v-radio label="全或" value="1"></v-radio>
                                    <v-radio label="自定义" value="2"></v-radio>
                                  </v-radio-group>
                                </v-col>
                              </v-row>
                              <v-row v-if="radios ==='2'">
                                <div class="fl" style="width: 18%;">逻辑关系:</div>
                                <div class="fl" style="width: 80%;">
                                  <v-text-field
                                    v-model.trim="customizeConfig"
                                    placeholder="请输入逻辑关系"
                                    outlined
                                    dense
                                    type="text"
                                  ></v-text-field>
                                  <div class="pt-4">使用条件序号加上()、且、或， 来拼接表达式，列如（条件a且条件b且条件c）或条件d。括号内不支持且和或同时存在</div>
                                </div>
                              </v-row>
                            </div>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-col>
                  </v-row>
                  <v-btn v-if="previousStep" color="primary" style="mr-5" @click="lastStep">上一步</v-btn>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="flex-grow-1" />
            <v-btn text style="mr-5" @click="cancleTem()">取消</v-btn>
            <v-btn :disabled="!valid" color="primary" text @click="saveTmp()">保存</v-btn>
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
import {
  addGroup,
  getGroupList,
  editGroup,
  deleteGroup,
  getKpiList,
  createIndicators,
  editTemplate,
  getIndicatorsById,
  deleteKpi,
  getApiTemlaterStructure, // 右侧弹框--第一部中--模板名称---点击事件，获取模板结构的json
  getTemplateName, // 右侧弹框--第一步中---根据模板分组，获取模板名称
  findTemplateGroup, // 添加指标弹框---获取模板分组
  getTemplate, // 添加指标弹框---获取模板名称
  transactionType, // 交易类型接口
  groupQuery,
  methodQuery,
  getQueryallfield, // 获取业务变量库下所有的字段
  isReferenceAndDebugMode // 查询应用记录与安全模式或者调试模式
} from '../../api/calclndexBase';
import {
  getFieldNameListArray, // 单位的接口
  getFieldNameList
} from '../../api/SystemParamLib';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';
import { queryAppListAll } from 'api/queryHeaderAppList.js';
import * as dataService from 'api/ruleSet';
export default {
  data () {
    return {
      firstTableItemId: '',
      treeActive: '',
      fullHeight: window.innerHeight,
      isEnd: true, // 左侧树形节点不展示添加按钮
      itemText: 'indicGroup',
      deletePowerBtn: '/deleteIndexManageMenuButton', // 控制删除目录按钮是否展示
      addPowerBtn: '/addindexManageMenuButton', // 控制添加目录按钮是否展示
      baseCteateEditPowerBtn: '/editIndexManageMenuButton', // 控制编辑目录按钮是否展示 当编辑目录按钮展示时，控制baseCreate中的编辑开关
      isTopShow: false,
      isFirstLineSelected: true,
      templateParameter: [],
      editItemData: {},
      tempNameTemp: '',
      tempPath: '',
      // 自动补全功能下拉框
      srcList: [],
      optionsValues: [],
      srcListValue: '',
      ins: null,
      secondIsActive: 0,
      e1: 1,
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      valid: true,
      lazy: false,
      colorIndex: 0,
      isActive: [true],
      search: '',
      search1: '',
      search2: '',
      search3: '',
      constHeader: [
        { text: '指标分组', value: 'indicGroup', sortable: false, width: 100 },
        { text: '指标组ID', value: 'groupNo', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      filHeader: [
        { text: '指标名称', value: 'indicName', sortable: false, width: 100 },
        { text: '指标类型', value: 'indicType', sortable: false, width: 100 },
        { text: '添加方式', value: 'indicMode', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: '10%' }
      ],
      filItem: [],
      constItem: [],
      enumeData: {
        groupNo: '',
        indicGroup: ''
        // enumType: ''
      },
      filData: {
        indicName: '',
        fieldField: ''
      },
      dialog: false,
      dialogDel: false,
      dialogDel_f: false,
      dialog_fil: false,
      mflag: 1,
      fflag: 1,
      enumeId: '',
      enumFieldId: '',
      //  左侧列表-----添加
      addOrEditHeader: {
        name: '添加指标分组',
        value: 'add',
        isEdit: false
      },
      addAndEditFormData: [
        { label: '指标分组*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || '指标名称不能为空',
            // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '常量只能输入汉字'
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        },
        { label: '指标组ID*',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || '指标组ID不能为空',
            // eslint-disable-next-line no-useless-escape
            // v => !((/[^\ a-\z\A-\Z]/).test(v)) || '指标组ID只能输入英文字母'
            v => /^[0-9a-zA-Z_]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        }
      ],
      // 分页变量
      pageNum: 1,
      queryPageLength: 1,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      tempGroupHeader: [
        {
          text: '模板分组',
          value: 'templateName',
          sortable: false,
          width: 100
        }
      ],
      tempNameHeader: [{ text: '模板名称', value: 'templateName', sortable: false, width: 100 }],
      tempGroupItem: [],
      tempNameItem: [],
      indicatorsName: '',
      // 上一步界面的form表单
      // tempInstru_form: {
      //   indicatorsName: ''
      // },
      previousStep: true,
      baseChanneltradRules: [
        v => !!v || '不能为空或只有空格'
      ],
      properChannelsSecondSelectShow: false,
      properChannelsParamValue: '',
      properChannelsSecondSelectParamValue: '',
      channelTypeFirstClassArr: [],
      channelTypeSecondClassArr: [],
      // 适用交易
      UsingTradeSecondSelectShow: false,
      UsingTradeParamValue: '',
      UsingTradeSecondSelectParamValue: '',
      UsingTradeFirstClassArr: [],
      UsingTradeSecondClassArr: [],
      channelTrade: [],
      properChannelsSecondSelectId: '',
      isGroupCanDelOrEdit: true,
      isFieldCanDelOrEdit: true, // 是否内部参数，如果是内部参数则不能编辑，否则可以编辑
      templaterOrFunc: '',
      titleIndicator: '', // 添加弹窗的title
      oneStepName: '', // 添加弹窗的第一步步骤名称
      twoStepName: '', // 添加弹窗的第二步步骤名称
      filterCondition: [],
      operator: [], // 计算符数组
      filtrationObjArray: [], // 过滤对象的数组
      companyArray: [], // 单位的数组
      radios: '0',
      businessVariablesArray: [], // 业务变量库所有字段的数组
      structureName: '', // 是模板机构 or 方法结构
      customizeConfig: '', // 过滤条件下----自定义输入框的值
      templateOrFuncName: '',
      isBackShow: 1,
      debugModeClueCode: ''
    };
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
  watch: {
    templaterOrFunc: function (newVal, oldVal) {
      if (newVal === 'TEMPLATE_VAR') {
        this.titleIndicator = '请选择模板指标模板';
        this.oneStepName = '请选择模板分组';
        this.twoStepName = '请填写模板指标模板';
        this.structureName = '模板结构';
        this.tempGroupHeader = [
          {
            text: '模板分组',
            value: 'templateName',
            sortable: false,
            width: 100
          }
        ];
        this.tempNameHeader = [{ text: '模板名称', value: 'templateName', sortable: false, width: 100 }];
      } else if (newVal === 'METHOD_VAR') {
        this.structureName = '方法结构';
        this.titleIndicator = '请选择方法指标模板';
        this.oneStepName = '请选择方法分组';
        this.twoStepName = '请填写方法指标模板';
        this.tempGroupHeader = [
          {
            text: '方法类型',
            value: 'templateName',
            sortable: false,
            width: 100
          }
        ];
        this.tempNameHeader = [{ text: '方法名称', value: 'templateName', sortable: false, width: 100 }];
      }
    }
  },
  created () {
    if (this.$route.params.indexNamePageNum) {
      this.isBackShow++;
    }
    let sStorage = window.sessionStorage;
    if (sStorage.getItem('indexGroupId')) {
      this.treeActive = sStorage.getItem('indexGroupId');
    }
    this.initGetEnumeList();
    this.GetOperator();
    this.getCompanyArray();
    this.getQueryallfield();
  },
  filters: {
    addType: function (str) {
      let dataTypeText;
      if (str === 'TEMPLATE_VAR') {
        dataTypeText = '模板添加';
      } else if (str === 'METHOD_VAR') {
        dataTypeText = '方法添加';
      }
      return dataTypeText;
    }
  },
  components: {
    BaseCreate,
    DelDialog,
    TreeView
  },
  methods: {
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    tog () {
      this.mflag = 1;
      this.addOrEditHeader = {
        name: '添加指标分组',
        value: 'add',
        isEdit: false
      };
      this.dialog = !this.dialog;
    },
    del () {
      this.dialogDel = true;
    },
    del1 () {
      this.dialogDel = true;
    },
    // 初始化常量弹框
    __mInit () {
      this.dialog = false;
      this.$refs.m_form.reset();
      this.$refs.m_form.resetValidation();
    },
    saveEnume () {
      if (!this.$refs.m_form.validate()) return;
      this.mflag === 1 ? this.addConstEnume() : this.editEnum();
    },
    // 添加分组---保存
    addConstEnume (paramsData) {
      const parms = {
        indicGroup: paramsData[0][0].value,
        groupNo: paramsData[0][1].value
      };
      this.dialog = false;
      paramsData[1].reset();
      addGroup(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.__mInit();
            this.treeActive = '';
            this.getGroupList();
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
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
    initGetEnumeList () {
      sessionStorage.removeItem('backCalcindexBase');
      getGroupList()
        .then(res => {
          if (res.data.code === 200) {
            this.constItem = res.data.data;
            if (this.constItem.length > 0) {
              this.enumeId = this.constItem[0].id;
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
    // 获取左侧列表
    getGroupList () {
      getGroupList()
        .then(res => {
          if (res.data.code === 200) {
            this.constItem = res.data.data;
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
    // 删除弹窗
    deleteParms (item) {
      this.dialogDel = true;
      this.enumeId = item.id;
    },
    // 添加分组---删除--取消按钮
    constantDelCancle (paramsData) {
      this.dialogDel = false;
    },
    // 第一个列表---编辑弹窗
    editParms (item, index) {
      // isInterNal 1：内置，0：非内置。
      // isQuote '0', '1', '2', '3'
      // '1'、未引用，调试模式；返回'0'  编辑和删除按钮都展示
      // '2'、未引用，安全模式；返回'1'  编辑和删除按钮都展示
      // '3'、已引用，调试模式；返回'2'  编辑和删除按钮都展示
      // '4'、已引用，安全模式；返回'3'  只可编辑查看， 但是没有编辑功能， 且不展示删除按钮
      if (item.isInternal === '1' || item.isQuote === '2' || item.isQuote === '3') {
        this.isGroupCanDelOrEdit = false;
      } else {
        this.isGroupCanDelOrEdit = true;
      }
      this.enumeData = item;
      this.colorIndex = index;
      this.mflag = 2;
      this.dialog = true;
      this.addOrEditHeader = {
        name: '查看指标分组',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        {
          label: '指标分组*',
          value: item.indicGroup,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '指标分组不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        },
        {
          label: '指标ID*',
          value: item.groupNo,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || '指标ID不能为空',
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || '最多只能输入50个字符',
            // eslint-disable-next-line no-useless-escape
            v => /^[0-9a-zA-Z_]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线，及其组合'
          ]
        }
      ];
      this.enumeId = item.id;
    },
    onChang (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看指标分组',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑指标分组',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 添加分组--删除---确定按钮
    deleteEnum () {
      if (!this.enumeId) return;
      const parms = {
        indicatorsGroupId: this.enumeId
      };
      deleteGroup(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.dialogDel = false;
            // this.__mInit();
            getGroupList()
              .then(res => {
                if (res.data.code === 200) {
                  if (res.data.data.length > 0) {
                    this.constItem = res.data.data;
                    this.enumeId = this.constItem[this.colorIndex].id;
                    let sStorage = window.sessionStorage;
                    sStorage.setItem('indexGroupId', this.enumeId);
                    this.treeActive = this.enumeId;
                    // 调取右侧列表查询接口
                    this.getFieldNameList();
                  } else {
                    this.constItem = res.data.data;
                    this.enumeId = '';
                    this.filItem = [];
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
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
          } else {
            this.dialogDel = false;
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
    // 添加分组---编辑保存
    editEnum (paramsData) {
      const parms = {
        id: this.enumeId,
        groupNo: paramsData[0][1].value,
        indicGroup: paramsData[0][0].value
      };
      this.dialog = false;
      paramsData[1].reset();
      editGroup(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.__mInit();
            this.getGroupList();
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
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
    // 点击当前切换表格
    constMenu (item, i) {
      this.firstTableItemId = item[0];
      if (this.$refs.filForm !== undefined) {
        this.$refs.filForm.reset();
      }
      this.search1 = '';
      this.pageNum = 1;
      this.perPageNum = 10;
      this.$nextTick(() => {
        this.enumeId = item[0];
        let sStorage = window.sessionStorage;
        sStorage.setItem('indexGroupId', this.enumeId);
        if (this.isBackShow > 1) {
          this.pageNum = this.$route.params.indexNamePageNum;
          this.perPageNum = this.$route.params.indexNamePerPageNum;
          this.enumeId = this.$route.params.FirstTableItemId;
          this.search1 = this.$route.params.indexNameSearch1;
          this.backShowGetFieldNameList();
        } else {
          this.getFieldNameList();
        }
      });
    },
    // 右侧列表---删除按钮
    deletefiled (item) {
      const pms = {
        sourceId: item.id
      };
      isReferenceAndDebugMode(pms).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.editingMode === 2) {
            this.snackbarServe = true;
            this.timeout = 5000;
            this.snackbarServeMsg = '该指标已经被引用，请谨慎删除。';
            this.snackbarServeColor = 'warning';
            this.debugModeClueCode = '该指标已经被引用，您确定要删除此行？';
          }
          this.dialogDel_f = true;
          this.enumFieldId = item.id;
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
    // 右侧列表---删除按钮----确定按钮
    delFieldOk () {
      let parms = {
        indicatorsId: this.enumFieldId
      };
      deleteKpi(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.debugModeClueCode = '';
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            this.getFieldNameList();
          } else {
            this.debugModeClueCode = '';
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.debugModeClueCode = '';
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
      this.dialogDel_f = false;
    },
    // 右侧列表---删除按钮----取消按钮
    delFieldCancle () {
      this.debugModeClueCode = '';
      this.dialogDel_f = false;
    },
    inputSearch () { // 右侧列表搜索框查询方法
      this.pageNum = 1;
      this.getFieldNameList();
    },
    // 查询-----右侧列表
    getFieldNameList () {
      const parms = {
        groupId: this.enumeId,
        indicName: this.search1,
        pageIndex: this.pageNum, // 第几页
        pageSize: this.perPageNum // 每页显示条数
      };
      getKpiList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.__mInit();
            if (res.data.data.indicatorsList.length > 0) {
              this.filItem = res.data.data.indicatorsList;
              this.totalItems = res.data.data.total;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
              this.ins = null;
            } else {
              this.filItem = [];
              this.totalItems = res.data.data.total;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
            }
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        },
        err => {
          console.error(err);
        });
    },
    // 当是从编辑页返回时，执行的查询-----右侧列表
    backShowGetFieldNameList () {
      const parms = {
        groupId: this.enumeId,
        indicName: this.search1,
        pageIndex: this.pageNum, // 第几页
        pageSize: this.perPageNum // 每页显示条数
      };
      getKpiList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.__mInit();
            if (res.data.data.indicatorsList.length > 0) {
              this.filItem = res.data.data.indicatorsList;
              this.totalItems = res.data.data.total;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
              this.ins = null;
            } else {
              this.filItem = [];
              this.totalItems = res.data.data.total;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
            }
            this.isBackShow--;
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        },
        err => {
          console.error(err);
        });
    },
    // 点击打开添加指标模板弹窗 或者 添加方法指标
    addFilParms (val) {
      if (!this.constItem.length) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '没有选择目录项，请先创建目录';
        this.snackbarServeColor = 'error';
        return;
      }

      let sStorage = window.sessionStorage;
      // 规则集基本信息
      sStorage.setItem('indexIsFieldCanDelOrEdit', false);
      sStorage.setItem('indexRadios', '0');
      sStorage.setItem('indexCustomizeConfig', '');
      sStorage.setItem('indexFilterCondition', []);
      sStorage.setItem('indexFflag', '1');
      sStorage.setItem('isIndex', val);
      sStorage.setItem('indexGroupId', this.enumeId);
      this.$router.push({
        path: '/calculateIndexDetails',
        name: 'calculateIndexDetails',
        params: {
          indexNamePageNum: this.pageNum,
          indexNamePerPageNum: this.perPageNum,
          FirstTableItemId: this.firstTableItemId,
          indexNameSearch1: this.search1
        }
      });
    },
    // 添加指标---获取模板名称
    getTemplate () {
      if (this.templaterOrFunc === 'TEMPLATE_VAR') {
        const params = { tmplGroupId: this.tempGroupId };
        getTemplate(params).then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              this.tempNameItem = [];
              this.tempNameItem = res.data.data;
            } else {
              this.tempNameItem = [];
              this.templateParameter = [];
            }
          }
        });
      } else if (this.templaterOrFunc === 'METHOD_VAR') {
        const params = { gid: this.tempGroupId };
        methodQuery(params).then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              res.data.data.forEach((item, index, ary) => {
                res.data.data.forEach((item, index, ary) => {
                  ary[index].tempName = item.mthodName;
                });
                this.tempNameItem = [];
                this.tempNameItem = res.data.data;
              });
            } else {
              this.tempNameItem = [];
              this.templateParameter = [];
            }
          }
        });
      }
    },
    // 添加指标---获取指标模板分组
    findTemplateGroup () {
      if (this.templaterOrFunc === 'TEMPLATE_VAR') {
        findTemplateGroup().then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              this.tempGroupItem = res.data.data;
            } else {
              this.tempGroupItem = [];
            }
          }
        });
      } else if (this.templaterOrFunc === 'METHOD_VAR') {
        const parms = {
          content: ''
        };
        groupQuery(parms).then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              this.tempGroupItem = res.data.data;
            } else {
              this.tempGroupItem = [];
            }
          }
        });
      }
    },
    __fInit () {
      this.dialog_fil = false;
      this.$refs.filForm.reset();
      this.$refs.filForm.resetValidation();
    },
    // 第二个列表-----编辑
    editFildParms (items) {
      const pms = {
        sourceId: items.id
      };
      isReferenceAndDebugMode(pms).then(res => {
        if (res.data.code === 200) {
          let sStorage = window.sessionStorage;
          let itemsObj = JSON.stringify(items);
          if (res.data.data.editingMode === 2 || res.data.data.editingMode === 3) {
            this.snackbarServe = true;
            this.timeout = 5000;
            this.snackbarServeMsg = '该指标已经被引用，请谨慎修改。';
            this.snackbarServeColor = 'warning';
          }
          // isInterNal 1：内置，0：非内置。 在内置的情况下，不用判断引用关系，直接判定为不可编辑。
          // isQuote '0', '1', '2', '3'
          // '1'、未引用，调试模式；返回'0'  编辑和删除按钮都展示
          // '2'、未引用，安全模式；返回'1'  编辑和删除按钮都展示
          // '3'、已引用，调试模式；返回'2'  编辑和删除按钮都展示
          // '4'、已引用，安全模式；返回'3'  只可编辑查看， 但是没有编辑功能， 且不展示删除按钮

          // res.data.data.editingMode
          // 1、未引用，调试模式；返回0  编辑和删除按钮都展示
          // 2、未引用，安全模式；返回1  编辑和删除按钮都展示
          // 3、已引用，调试模式；返回2  编辑和删除按钮都展示
          // 4、已引用，安全模式；返回3  只可编辑查看， 但是没有编辑功能， 且不展示删除按钮
          if (items.isInternal === '1' || res.data.data.editingMode === 3) {
            this.isFieldCanDelOrEdit = false;
          } else {
            this.isFieldCanDelOrEdit = true;
          }
          // 规则集基本信息
          sStorage.setItem('indexFflag', 2);
          sStorage.setItem('indexIsFieldCanDelOrEdit', this.isFieldCanDelOrEdit);
          sStorage.setItem('items', [itemsObj]);
          sStorage.setItem('indexNamePageNum', this.pageNum); // 第几页
          sStorage.setItem('indexNamePerPageNum', this.perPageNum); // 每页多少条
          this.$router.push({
            path: '/calculateIndexDetails',
            name: 'calculateIndexDetails',
            params: {
              indexNamePageNum: this.pageNum,
              indexNamePerPageNum: this.perPageNum,
              FirstTableItemId: this.firstTableItemId,
              indexNameSearch1: this.search1
            }
          });
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
          console.log(res);
        }
      });
    },
    // 编辑的保存
    updateIndicators () {
      this.optionsValues.forEach((item, index, ary) => {
        if (typeof item === 'string') {
          ary[index] = {
            id: '',
            name: '',
            value: item
          };
        }
      });
      const e = this.tempNameTemp;
      const templateParameter = this.templateParameter;
      const tempObj = [];
      this.optionsValues.forEach((item, index, ary) => {
        if (!item.srcType) {
          ary[index].dataType = 'String';
          ary[index].srcType = 'INPUT';
          ary[index].selectT = item.value;
          ary[index].selectV = item.value;
          item.id = item.value;
          item.name = item.value;
        }
      });
      templateParameter.forEach((item, index) => {
        tempObj.push({});
        tempObj[index].cnName = item.paramName;
        tempObj[index].enName = item.paramValue;
        tempObj[index].index = index;
        tempObj[index].type = item.paramType;
        tempObj[index].comment = item.comment;
        tempObj[index].value = this.optionsValues[index];
        tempObj[index].src = item.paramSrc;
        tempObj[index].dataType = item.dataType;
      });
      // 二期删掉了
      // tempObj.unshift({
      //   cnName: '业务对象',
      //   enName: 'opLog',
      //   index: 0,
      //   type: 'OpLog',
      //   value: {
      //     name: 'OpLog',
      //     id: '',
      //     value: 'opLog',
      //     dataType: 'int'
      //   },
      //   dataType: 'int'
      // });
      this.channelTrade = [];
      // 适用渠道
      this.channelTypeFirstClassArr.forEach((item, index, ary) => {
        if (item.value === this.properChannelsParamValue) {
          this.channelTrade.push({
            cnName: '适用渠道',
            enName: 'channelType',
            index: 0,
            type: null,
            value: {
              name: item.name,
              id: item.id,
              value: item.value,
              srcType: 'SYS_VAR'
            },
            dataType: 'String'
          });
        }
      });
      if (this.properChannelsSecondSelectShow) {
        this.channelTypeSecondClassArr.forEach((item, index, ary) => {
          if (item.value === this.properChannelsSecondSelectParamValue) {
            this.channelTrade.push({
              cnName: '应用标识',
              enName: 'appid',
              index: 1,
              type: null,
              value: {
                name: item.name,
                id: item.id,
                value: item.value,
                srcType: 'String'
              },
              dataType: 'String'
            });
          }
        });
      } else {
        this.channelTrade.push({
          cnName: '应用标识',
          enName: 'appid',
          index: 1,
          type: null,
          value: {
            name: '',
            id: '',
            value: '',
            srcType: 'String'
          },
          dataType: 'String'
        });
      }
      // 适用交易
      this.UsingTradeFirstClassArr.forEach((item, index, ary) => {
        if (item.value === this.UsingTradeParamValue) {
          this.channelTrade.push({
            cnName: '适用交易',
            enName: 'tradeType',
            index: 2,
            type: null,
            value: {
              name: item.name,
              id: item.id,
              value: item.value,
              srcType: 'SYS_VAR'
            },
            dataType: 'String'
          });
        }
      });
      if (this.UsingTradeSecondSelectShow) {
        this.UsingTradeSecondClassArr.forEach((item, index, ary) => {
          if (item.value === this.UsingTradeSecondSelectParamValue) {
            this.channelTrade.push({
              cnName: '交易类型',
              enName: 'opType',
              index: 3,
              type: null,
              value: {
                name: item.name,
                id: item.id,
                value: item.value,
                srcType: 'SYS_VAR'
              },
              dataType: 'String'
            });
          }
        });
      } else {
        this.channelTrade.push({
          cnName: '交易类型',
          enName: 'opType',
          index: 3,
          type: null,
          value: {
            name: '',
            id: '',
            value: '',
            srcType: 'SYS_VAR'
          },
          dataType: 'String'
        });
      }
      const methods = [
        {
          cnName: e.tempName,
          enName: e.tempName,
          parameters: tempObj,
          channelTrade: this.channelTrade
        }
      ];
      this.filterCondition.forEach((filterConditionItem, filterConditionIndex, filterConditionAry) => {
        if (filterConditionItem.filterTypeValue === '0') {
          let inputSelectObj = filterConditionItem.filterConditionChild[2];
          let nameArr = this.getArrayProps(inputSelectObj.options, 'name');
          if (typeof inputSelectObj.value === 'string') {
            if (nameArr.indexOf(inputSelectObj.value) === -1) {
              inputSelectObj.options.unshift(
                {
                  selectV: inputSelectObj.value,
                  selectT: inputSelectObj.value,
                  value: null,
                  id: inputSelectObj.value,
                  name: inputSelectObj.value
                }
              );
              inputSelectObj.value = inputSelectObj.options[0];
            }
          }
        }
      });
      // return;
      const indicatorsParam = JSON.stringify({
        clazz: e.tempName,
        id: e.tempName,
        filterCondition: this.filterCondition,
        radios: this.radios,
        customizeConfig: this.customizeConfig,
        methods: methods
      });
      const params = {
        id: this.enumFieldId,
        indicName: this.indicatorsName,
        groupId: this.enumeId,
        tmplGroupId: this.templaterOrFunc === 'TEMPLATE_VAR' ? e.tmplGroupId : e.id,
        tmplId: e.id,
        indicatorsParam: indicatorsParam,
        indicType: this.channelTrade[0].value.name + this.channelTrade[2].value.name,
        indicMode: this.templaterOrFunc
      };
      getIndicatorsById(params).then(res => {
        if (res.data.code === 200) {
          this.$refs.tempInstru_form.reset();
          this.getFieldNameList();
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.dialog_fil = false;
        } else {
          this.dialog_fil = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    cancle (paramsData) {
      this.dialog = false;
      paramsData.reset();
    },
    save (paramsData) {
      this.mflag === 1 ? this.addConstEnume(paramsData) : this.editEnum(paramsData);
    },
    // 点击指标模板名称
    tempNameClick (e, i) {
      if (this.ins !== i) {
        this.$nextTick(() => {
          this.templateOrFuncName = e.tempName;
          this.ins = i;
          const params = {
            templateId: e.id,
            indicMode: this.templaterOrFunc
          };
          getApiTemlaterStructure(params)
            .then(res => {
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  this.templateParameter = [];
                  this.templateParameter = res.data.data;
                  this.optionsValues = [];
                  for (let i = 0; i < res.data.data.length; i++) {
                    this.optionsValues.push('');
                  }
                } else {
                  this.templateParameter = [];
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
          // this.ins = i;
          this.tempNameTemp = e;
          this.tempPath = e.tempPath;
        });
      }
    },
    // 点击指标模板分组
    tempGroupClick (e, i) {
      this.secondIsActive = i;
      this.tempGroupId = e.id;
      this.ins = null;
      // 点击的时候显示模板名称
      this.getTemplate(); // 获取下一步的内容
    },
    change1 (data) {
    },
    // 添加指标----保存按钮
    createIndicators () {
      this.optionsValues.forEach((item, index, ary) => {
        if (typeof item === 'string') {
          ary[index] = {
            id: '',
            name: '',
            value: item
          };
        }
      });
      const e = this.tempNameTemp;
      const templateParameter = this.templateParameter;
      const tempObj = [];

      // select是输入值时，增加相对应的属性。
      this.optionsValues.forEach((item, index, ary) => {
        if (item.srcType === undefined) {
          ary[index].dataType = 'String';
          ary[index].srcType = 'INPUT';
          ary[index].selectT = item.value;
          ary[index].selectV = item.value;
          item.id = item.value;
          item.name = item.value;
        }
      });
      templateParameter.forEach((item, index) => {
        tempObj.push({});
        tempObj[index].cnName = item.paramName;
        tempObj[index].enName = item.paramValue;
        tempObj[index].index = index;
        tempObj[index].type = item.paramType;
        tempObj[index].comment = item.comment;
        tempObj[index].value = this.optionsValues[index];
        tempObj[index].src = item.paramSrc;
        tempObj[index].dataType = item.dataType;
      });
      // 二期删掉的
      // tempObj.unshift({
      //   cnName: '业务对象',
      //   enName: 'opLog',
      //   index: 0,
      //   type: 'OpLog',
      //   value: {
      //     name: 'OpLog',
      //     id: '',
      //     value: 'opLog',
      //     srcType: 'int'
      //   },
      //   dataType: 'int'
      // });
      this.channelTrade = [];
      // 适用渠道
      this.channelTypeFirstClassArr.forEach((item, index, ary) => {
        if (item.value === this.properChannelsParamValue) {
          this.channelTrade.push({
            cnName: '适用渠道',
            enName: 'channelType',
            index: 0,
            type: null,
            value: {
              name: item.name,
              id: item.id,
              value: item.value,
              srcType: 'SYS_VAR'
            },
            dataType: 'String'
          });
        }
      });
      if (this.properChannelsSecondSelectShow) {
        this.channelTypeSecondClassArr.forEach((item, index, ary) => {
          if (item.value === this.properChannelsSecondSelectParamValue) {
            this.channelTrade.push({
              cnName: '应用标识',
              enName: 'appid',
              index: 1,
              type: null,
              value: {
                name: item.name,
                id: item.id,
                value: item.value,
                srcType: 'SYS_VAR'
              },
              dataType: 'String'
            });
          }
        });
      } else {
        this.channelTrade.push({
          cnName: '应用标识',
          enName: 'appid',
          index: 1,
          type: null,
          value: {
            name: '',
            id: '',
            value: '',
            srcType: 'SYS_VAR'
          },
          dataType: 'String'
        });
      }
      // 适用交易
      this.UsingTradeFirstClassArr.forEach((item, index, ary) => {
        if (item.value === this.UsingTradeParamValue) {
          this.channelTrade.push({
            cnName: '适用交易',
            enName: 'tradeType',
            index: 2,
            type: null,
            value: {
              name: item.name,
              id: item.id,
              value: item.value,
              srcType: 'SYS_VAR'
            },
            dataType: 'String'
          });
        }
      });
      if (this.UsingTradeSecondSelectShow) {
        this.UsingTradeSecondClassArr.forEach((item, index, ary) => {
          if (item.value === this.UsingTradeSecondSelectParamValue) {
            this.channelTrade.push({
              cnName: '交易类型',
              enName: 'opType',
              index: 3,
              type: null,
              value: {
                name: item.name,
                id: item.id,
                value: item.value,
                srcType: 'SYS_VAR'
              },
              dataType: 'String'
            });
          }
        });
      } else {
        this.channelTrade.push({
          cnName: '交易类型',
          enName: 'opType',
          index: 3,
          type: null,
          value: {
            name: '',
            id: '',
            value: '',
            srcType: 'SYS_VAR'
          },
          dataType: 'String'
        });
      }
      const methods = [
        {
          cnName: e.tempName,
          enName: e.tempName,
          parameters: tempObj,
          channelTrade: this.channelTrade
        }
      ];
      // 是输入的下拉框时。自动向当前下拉框的数组push一个当前输入值的对象
      this.filterCondition.forEach((filterConditionItem, filterConditionIndex, filterConditionAry) => {
        if (filterConditionItem.filterTypeValue === '0') {
          let inputSelectObj = filterConditionItem.filterConditionChild[2];
          let nameArr = this.getArrayProps(inputSelectObj.options, 'name');
          if (typeof inputSelectObj.value === 'string') {
            if (nameArr.indexOf(inputSelectObj.value) === -1) {
              inputSelectObj.options.unshift(
                {
                  selectV: inputSelectObj.value,
                  selectT: inputSelectObj.value,
                  value: null,
                  id: inputSelectObj.value,
                  name: inputSelectObj.value
                }
              );
              inputSelectObj.value = inputSelectObj.options[0];
            }
          }
        }
      });
      const indicatorsParam = JSON.stringify({
        clazz: e.tempName,
        id: e.tempName,
        filterCondition: this.filterCondition,
        radios: this.radios,
        customizeConfig: this.customizeConfig,
        methods: methods
      });
      const params = {
        indicName: this.indicatorsName,
        groupId: this.enumeId,
        tmplGroupId: this.templaterOrFunc === 'TEMPLATE_VAR' ? e.tmplGroupId : e.id,
        tmplId: e.id,
        indicatorsParam: indicatorsParam,
        indicType: this.channelTrade[0].value.name + this.channelTrade[2].value.name,
        indicMode: this.templaterOrFunc
      };
      this.dialog_fil = true;
      createIndicators(params).then(res => {
        if (res.data.code === 200) {
          this.$refs.tempInstru_form.reset();
          this.getFieldNameList();
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.dialog_fil = false;
          this.templateParameter = [];
        } else {
          this.dialog_fil = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 获取数组中每一个对象中的某一个value
    getArrayProps (array, key1) {
      let res = [];
      if (array) {
        array.forEach(function (t) {
          res.push(t[key1]);
        });
      }
      return res;
    },
    optionsValuesRules (v) {
      if (v === '') {
        return '这个是必填项';
      } else {
        return true;
      }
    },
    // 上一步
    lastStep () {
      this.ins = null;
      this.e1 = 1;
    },
    // 下一步
    nextStep () {
      if (this.ins === null) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请选择模板名称';
        this.snackbarServeColor = 'error';
      } else {
        this.e1 = 2;
        if (this.$refs.tempInstru_form) {
          this.$refs.tempInstru_form.reset();
          this.$refs.tempInstru_form.resetValidation();
        }
        this.$nextTick(() => {
          this.radios = '0';
        });
        this.queryAppList(); // 获取应用列表数组
        this.baseGetFieldNameList('sys_trade_type'); // 适用交易数组
        this.baseGetFieldNameList('sys_channel_type'); // 适用渠道数组
        this.properChannelsSecondSelectShow = false;
        this.UsingTradeSecondSelectShow = false;
      }
      this.getFiltrationObj();
    },
    cancleTem () {
      this.dialog_fil = false;
      this.ins = null;
      this.$nextTick(() => {
        this.$refs.tempInstru_form.reset();
      });
      this.templateParameter = [];
      this.filterCondition = [];
      this.radios = '0';
      this.customizeConfig = '';
    },
    saveTmp () {
      if (this.$refs.tempInstru_form.validate()) {
        if (this.fflag === 1) {
          this.e1 = 1;
          this.createIndicators();
        } else if (this.fflag === 2) {
          this.e1 = 1;
          this.updateIndicators();
        }
      }
      this.templateParameter = [];
      this.dialog_fil = false;
    },
    // 适用渠道第一个下拉框点击事件
    properChannelsfirstChange (name) {
      if (name === 'SPECIFIED') {
        this.properChannelsSecondSelectShow = true;
        this.properChannelsSecondSelectParamValue = this.channelTypeSecondClassArr[0].value;
      } else {
        this.properChannelsSecondSelectShow = false;
        this.properChannelsSecondSelectParamValue = '';
      }
      if (this.UsingTradeParamValue !== 'CURRENT') {
        this.UsingTradeParamValue = 'CURRENT';
        this.UsingTradeSecondSelectShow = false;
      };
    },
    // 适用交易第一个下拉框点击事件
    UsingTradefirstChange (name) {
      if (name === 'SPECIFIED') {
        let jsonid = [];
        let parms = {};
        this.UsingTradeSecondSelectShow = true;
        if (this.properChannelsSecondSelectShow) { // 适用渠道中是指定渠道的情况下
          jsonid.push(this.properChannelsSecondSelectId);
          parms.jsonids = JSON.stringify(jsonid);
          this.UsingTradeSecondSelectParamValue = '';
          this.getTransactionSecondSelectAryAdd(parms);
        } else { // 适用渠道中不是指定渠道的情况下
          jsonid.push('1c36520fd2a042ccb9dcbaa5184c7114');
          parms.jsonids = JSON.stringify(jsonid);
          this.getTransactionSecondSelectAryAdd(parms);
        }
      } else {
        this.UsingTradeSecondSelectShow = false;
        this.UsingTradeSecondSelectParamValue = '';
      }
    },
    // 添加时：根据适用渠道中选择为指定渠道时，根据二级select的值获取适用交易下二级select的值
    getTransactionSecondSelectAryAdd (parms) {
      transactionType(parms)
        .then(res => {
          if (res.data.code === 200) {
            res.data.data.forEach((item, index, ary) => {
              ary[index].name = item.tradeName;
              ary[index].value = item.identifier;
            });
            this.UsingTradeSecondClassArr = res.data.data;
            this.UsingTradeSecondSelectParamValue = this.UsingTradeSecondClassArr[0].value;
          } else {
            this.UsingTradeSecondClassArr = res.data.data;
            this.UsingTradeSecondSelectParamValue = '';
          }
        },
        err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    // 编辑时：回显适用交易的二级select的值
    getTransactionSecondSelectAryEdit (parms) {
      transactionType(parms)
        .then(res => {
          if (res.data.code === 200) {
            res.data.data.forEach((item, index, ary) => {
              ary[index].name = item.tradeName;
              ary[index].value = item.identifier;
            });
            this.UsingTradeSecondClassArr = res.data.data;
            this.UsingTradeSecondSelectParamValue = this.channelTrade[3].value.value;
          } else {
            this.UsingTradeSecondClassArr = res.data.data;
            this.UsingTradeSecondSelectParamValue = '';
          }
        },
        err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    // 获取适用渠道第二个select的数组
    async queryAppList () {
      this.appItems = [];
      let params = {
        states: 1,
        appName: '',
        spid: '',
        appTag: '',
        appType: ''
      };
      try {
        const response = await queryAppListAll(params);
        this.channelTypeSecondClassArr = response.data.data;
        this.channelTypeSecondClassArr.forEach((item, index, ary) => {
          ary[index].name = item.appName;
          ary[index].value = item.appTag;
        });
        this.properChannelsSecondSelectId = this.channelTypeSecondClassArr[0].id;
      } catch (error) {}
    },
    // 适用渠道二级下拉框change事件
    properChannelsSecondSelectChange (val) {
      this.channelTypeSecondClassArr.forEach((item, index, ary) => {
        if (item.appTag === val) {
          this.properChannelsSecondSelectId = item.id;
        }
      });
      if (this.UsingTradeParamValue !== 'CURRENT') {
        this.UsingTradeParamValue = 'CURRENT';
        this.UsingTradeSecondSelectShow = false;
      };
    },
    // 公共增加name和value
    baseAddNameOrValue (array) {
      array.forEach((item, index, ary) => {
        ary[index].name = item.paramName;
        ary[index].value = item.paramValue;
      });
    },
    // 获取适用渠道以及适用渠道二级select的数组和适用交易
    baseGetFieldNameList (data) {
      const parms = {
        identifier: data
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.__mInit();
            if (res.data.data.length > 0) {
              if (data === 'sys_trade_type') { // 适用交易数组
                this.UsingTradeFirstClassArr = res.data.data;
                if (this.fflag === 1) {
                  this.UsingTradeParamValue = 'CURRENT';
                  // 点击添加方法指标----将适用渠道的值改为只剩一个【当前渠道】
                  if (this.templaterOrFunc === 'METHOD_VAR') {
                    this.UsingTradeFirstClassArr = [];
                    res.data.data.forEach((item, index, ary) => {
                      if (item.paramName === '当前交易') {
                        this.UsingTradeFirstClassArr.push(item);
                      }
                    });
                  }
                }
                this.baseAddNameOrValue(this.UsingTradeFirstClassArr);
              } else if (data === 'sys_channel_type') { // 适用渠道数组
                this.channelTypeFirstClassArr = res.data.data;
                if (this.fflag === 1) {
                  this.properChannelsParamValue = 'CURRENT';
                  // 点击添加方法指标----将适用渠道的值改为只剩一个【当前渠道】
                  if (this.templaterOrFunc === 'METHOD_VAR') {
                    this.channelTypeFirstClassArr = [];
                    res.data.data.forEach((item, index, ary) => {
                      if (item.paramName === '当前渠道') {
                        this.channelTypeFirstClassArr.push(item);
                      }
                    });
                  }
                }
                this.baseAddNameOrValue(this.channelTypeFirstClassArr);
              }
            } else {
              this.filItem = [];
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
    // 过滤条件下---条件类型change事件
    conditionTypeChange (value, item) {
      if (value === '0') {
        item.filterConditionChild = [
          {
            filterType: 'select',
            paramName: '过滤对象',
            value: '',
            options: this.filtrationObjArray
          },
          {
            filterType: 'select',
            paramName: '运算符',
            value: '',
            options: this.operator
          },
          {
            filterType: 'inputAndSelect',
            paramName: '值',
            value: '',
            options: this.filtrationObjArray
          },
          {
            filterType: 'select',
            paramName: '单位',
            value: '',
            options: this.companyArray
          }
        ];
      } else if (value === '1') {
        item.filterConditionChild = [
          {
            filterType: 'select',
            paramName: '过滤对象',
            value: '',
            options: this.filtrationObjArray
          },
          {
            filterType: 'select',
            paramName: '运算符',
            value: '',
            options: this.operator
          },
          {
            filterType: 'select',
            paramName: '过滤对象',
            value: '',
            options: this.filtrationObjArray
          }
        ];
      } else if (value === '2' || value === '3') {
        item.filterConditionChild = [
          {
            filterType: 'select',
            paramName: '过滤对象',
            value: '',
            options: this.filtrationObjArray
          },
          {
            filterType: 'text',
            paramName: '上限值'
          },
          {
            filterType: 'text',
            paramName: '下限值'
          }
        ];
      } else if (value === '6') {
        item.filterConditionChild = [
          {
            filterType: 'text',
            paramName: '过滤条件'
          }
        ];
      } else {
        item.filterConditionChild = [];
      }
    },
    // 过滤条件下---删除项
    cancleFilterCondition (ix) {
      this.filterCondition.forEach((item, index, ary) => {
        if (index === ix) {
          this.$nextTick(() => {
            ary.splice(index, 1);
          });
        }
      });
    },
    // 过滤条件下---添加项
    addFilterCondition () {
      this.$nextTick(() => {
        this.filterCondition.push(
          {
            filterTypeLabel: '条件类型',
            filterTypeValue: '0',
            filterTypeItem: [
              {
                text: '判断型',
                value: '0'
              },
              {
                text: '比较型',
                value: '1'
              },
              {
                text: '敏感时段判断',
                value: '2'
              },
              {
                text: '区间判断',
                value: '3'
              },
              {
                text: '连续递减判断',
                value: '4'
              },
              {
                text: '逐笔递减判断',
                value: '5'
              },
              {
                text: '自定义过滤条件',
                value: '6'
              }
            ],
            filterConditionChild: [
              {
                filterType: 'select',
                paramName: '过滤对象',
                value: '',
                options: this.filtrationObjArray
              },
              {
                filterType: 'select',
                paramName: '运算符',
                value: '',
                options: this.operator
              },
              {
                filterType: 'inputAndSelect',
                paramName: '值',
                value: '',
                options: this.filtrationObjArray
              },
              {
                filterType: 'select',
                paramName: '单位',
                value: '',
                options: this.companyArray
              }
            ]
          }
        );
      });
    },
    // 获取计算符
    async GetOperator () {
      try {
        const response = await dataService.GetOperator();
        if (response.data.code === 200) {
          if (response.data.data.list.length > 0) {
            response.data.data.list.forEach((item, index, ary) => {
              item.selectT = item.compName;
              item.selectV = item.compValue;
            });
            this.operator = response.data.data.list;
          } else {
            this.operator = [];
          }
        }
      } catch (error) {
      }
    },
    // 获取过滤对象的数组
    getFiltrationObj () {
      this.filtrationObjArray = [];
      this.templateParameter.forEach((item, index, ary) => {
        if (item.paramSrc !== '31') {
          this.filtrationObjArray = this.filtrationObjArray.concat(item.srcList);
        }
      });
      this.filtrationObjArray.forEach((item, index, ary) => {
        item.selectT = item.name;
        item.selectV = item.id;
      });
    },
    // 从系统参数库中获取  过滤条件中的单位的数组
    getCompanyArray () {
      const parms = {
        identifier: 'sys_unit_type'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.__mInit();
            if (res.data.data.length > 0) {
              res.data.data.forEach((item, index, ary) => {
                item.selectT = item.paramName;
                item.selectV = item.id;
              });
              res.data.data.unshift(
                {
                  selectT: '请选择',
                  selectV: ''
                }
              );
              this.companyArray = res.data.data;
            } else {
              this.companyArray = [];
            }
          }
        },
        err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    // 业务变量库所有字段的数组
    getQueryallfield () {
      const parms = {
        isContainEnum: '0'
      };
      getQueryallfield(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.__mInit();
            if (res.data.data.length > 0) {
              res.data.data.forEach((item, index, ary) => {
                item.selectT = item.fieldName;
                item.selectV = item.fieldValue;
              });
              this.businessVariablesArray = res.data.data;
            } else {
              this.businessVariablesArray = [];
            }
          }
        },
        err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.getFieldNameList();
    },
    // 页数
    pageChange () {
      this.pageNum = 1;
      this.getFieldNameList();
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
.filter-contition {
  width: 70%;
  margin-left: 10%;
  box-shadow: 1px 1px 1px #ccc;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding-left: 10px;
  margin-bottom: 20px;
}
.contition-expression {
  width: 70%;
  margin-left: 10%;
  padding-left: 10px;
}
.fl {
  float:left
}
</style>
