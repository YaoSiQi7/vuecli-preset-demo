<!--
 * @Author: your name
 * @Date: 2021-03-04 17:59:21
 * @LastEditTime: 2021-08-12 17:11:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\views\analysisCenterModel\IndicatorsDisplayPage.vue
-->
<template>
  <div>
    <div class="mb-3" style="height: 60px">
      <v-card :class="['mb-3', isFixed ? 'fixed' : '']">
        <v-card-actions style="height: 60px">
          <v-btn class="ml-4 cancelButton" @click="$router.go(-1)" outlined
            >返回</v-btn
          >
          <v-btn color="primary" class="ml-4" @click="doAllFolding()"
            >全部折叠</v-btn
          >
          <v-btn color="primary" class="ml-4" @click="doFolding()"
            >全部展开</v-btn
          >
          <v-spacer />
          <v-btn
            style="margin-right: 15px"
            color="primary"
            class="ml-4"
            @click="doAddCard()"
            >添加卡片</v-btn
          >
        </v-card-actions>
      </v-card>
    </div>
    <!-- 新建画板弹窗 -->
    <v-row justify="center">
      <v-dialog
        v-model="crudFormDialog"
        persistent
        scrollable
        max-width="550px"
      >
        <v-card class="baseCardStyle">
          <v-card-title>
            <v-toolbar-title> 添加折线图 </v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn icon dark @click="cancelCrudFormDialog">
              <v-icon color="var(--v-headerCloseIconColor-base)"
                >mdi-close</v-icon
              >
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form
              class="ruleSetAddOrEdit"
              ref="form"
              v-model="valid"
              :lazy-validation="lazy"
            >
              <v-row style="margin-top: 20px">
                <v-col cols="2"></v-col>
                <v-col cols="8" justify-left class="py-0"> </v-col>
              </v-row>
              <v-row>
                <v-col cols="2" class="pr-0"> </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="form[0].value"
                    :items="form[0].options"
                    item-text="appName"
                    item-value="appId"
                    :label="form[0].label"
                    persistent-hint
                    return-object
                    dense
                    outlined
                    @change="modelsByApp(form[0].value.appId)"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2" class="pr-0"> </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="form[1].value"
                    :items="form[1].options"
                    item-text="modelName"
                    item-value="modelName"
                    :label="form[1].label"
                    persistent-hint
                    return-object
                    dense
                    outlined
                    @change="modelNameTargets(form[1].value)"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2" class="pr-0"> </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="form[2].value"
                    :items="form[2].options"
                    item-text="itemtext"
                    item-value="itemvalue"
                    :label="form[2].label"
                    persistent-hint
                    return-object
                    dense
                    outlined
                    @change="modelRadioValue(form[2].value)"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row v-if="itemsvalue === '2'">
                <v-col cols="2" class="pr-0"> </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="form[3].value"
                    :items="form[3].options"
                    item-text="paramName"
                    item-value="paramValue"
                    :label="form[3].label"
                    persistent-hint
                    return-object
                    dense
                    outlined
                    @change="modelParamName(form[3].value.paramValue)"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2" class="pr-0"> </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="form[4].value"
                    :label="form[4].label"
                    :items="form[4].options"
                    item-text="text"
                    item-value="id"
                    dense
                    :multiple="multipleCalculate"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2" class="pr-0"> </v-col>
                <v-col cols="8">
                  <v-select
                    v-model="form[5].value"
                    :items="form[5].options"
                    item-text="itemtext"
                    item-value="itemvalue"
                    :label="form[5].label"
                    persistent-hint
                    return-object
                    dense
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="2" class="pr-0"> </v-col>
                <v-col cols="8">
                  <v-text-field
                    :label="form[6].label"
                    :rules="form[6].rules"
                    v-model.trim="form[6].value"
                    dense
                    outlined
                    type="text"
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
                @click="cancelCrudFormDialog"
                >取消
              </v-btn>
              <v-btn
                class="primary mr-4"
                style="margin-right: 10px; color: white"
                @click="confimDialogEdit()"
                :disabled="!valid"
              >
                保存
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- 卡片画板 -->
    <div
      :style="{ height: tableHeight }"
      class="elevation-3 cardStyle"
      v-if="cardLoading"
    >
      <v-card v-if="expansionAry.length === 0">
        <v-card-text>
          <v-row>
            <v-col class="py-0 pt-2 pb-2">
              <div style="text-align: center">
                <img src="../../assets/no_content.png" alt="" />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <div v-if="expansionAry.length !== 0">
        <v-expansion-panels v-model="expansionOpenNumber" multiple accordion>
          <v-expansion-panel
            ref="ele"
            v-for="(item, i) in expansionAry"
            :key="i"
          >
            <v-expansion-panel-header class="expansionBordre">
              <div style="display: flex; justify-content: space-between">
                <span>{{ item.cardName }}</span>
                <div style="height: 1px; margin-top: -10px">
                  <v-btn icon color="indigo">
                    <v-icon small @click.stop="editCard(item)"
                      >mdi-pencil</v-icon
                    >
                  </v-btn>
                  <v-btn icon color="indigo" style="margin-left: -15px">
                    <v-icon small @click.stop="deteleCard(item)"
                      >mdi-delete</v-icon
                    >
                  </v-btn>
                </div>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content style="min-height: 300px">
              <v-row>
                <v-col cols="8" class="cardCol cardColLeftStyle">
                  <v-row style="margin-left: 10px">
                    <v-col cols="4" class="mr-4">
                      <DatePicker
                        type="daterange"
                        v-model="item.dates"
                        :options="options"
                        placement="top-start"
                        placeholder="选择日期"
                        style="width: 100%;margin:10px;"
                        id='data-picker'
                        @on-change="timeChange(item.dates, item, i)"
                      ></DatePicker>
                    </v-col>
                    <!-- <v-col cols="5" sm="6" md="5" xl="4">
                      <v-select
                        v-model="item.selectTime"
                        :items="selectTimeAry"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        class="py-0"
                        @change="selectTimeChange(item, i)"
                        background-color="white"
                      />
                    </v-col>
                    <v-col cols="6" sm="6" md="5" xl="4">
                      <v-text-field
                        outlined
                        dense
                        v-model="item.datesTime"
                        append-icon="event"
                        @click="item.isdateShow = true"
                        background-color="white"
                      ></v-text-field>
                      <v-dialog v-model="item.isdateShow" width="321">
                        <v-date-picker
                          selected-items-text="已选择日期"
                          v-model="item.dates"
                          range
                          @change="timeChange(item.dates, item, i)"
                        ></v-date-picker>
                      </v-dialog>
                    </v-col> -->
                  </v-row>
                  <!-- 线图 -->
                  <div>
                    <div>
                      <base-echarts
                        v-if="item.isEchartsShow"
                        :optionParam="item.echartOptions"
                      ></base-echarts>
                    </div>
                    <div
                      v-if="!item.lineGrossShow && item.lineLoading == false"
                      class="no-data-box"
                    >
                      暂无数据
                    </div>
                    <div v-if="item.lineLoading" class="no-data-box">
                      加载中
                    </div>
                  </div>
                </v-col>
                <v-col
                  cols="4"
                  style="padding: 0; border-left: 1px solid #dddee2"
                >
                  <v-expansion-panels
                    v-model="item.cardDetailsOpenNumber"
                    accordion
                  >
                    <v-expansion-panel>
                      <v-expansion-panel-header class="expansionBordre"
                        >卡片基本信息</v-expansion-panel-header
                      >
                      <v-expansion-panel-content>
                        <div class="cardDetailsRow">
                          <v-row>
                            <v-col cols="1"></v-col>
                            <v-col cols="11">
                              <div style="line-height: 30px; margin-top: 10px">
                                <span class="textBold">应用名称: </span>
                                <span>{{ item.appName }}</span>
                              </div>
                              <div style="line-height: 30px">
                                <span class="textBold">模型名称: </span>
                                <span>{{ item.modelName }}</span>
                              </div>
                              <div style="line-height: 30px">
                                <span class="textBold">折线对应: </span>
                                <span>{{
                                  item.brokenLineCorresponding === "1"
                                    ? "指标"
                                    : "实体"
                                }}</span>
                              </div>
                              <div
                                style="line-height: 30px"
                                v-if="item.brokenLineCorresponding !== '1'"
                              >
                                <span class="textBold">实体类型: </span>
                                <span>{{entitytType(item.entityType)}}</span>
                              </div>
                              <div
                                v-if="item.brokenLineCorresponding !== '1'"
                                style="line-height: 30px"
                              >
                                <span class="textBold">展示指标: </span>
                                <span>{{ item.calcIndexName }}</span>
                              </div>
                            </v-col>
                          </v-row>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    <!-- //.. -->
                    <v-expansion-panel
                      v-if="item.brokenLineCorresponding !== '1'"
                    >
                      <v-expansion-panel-header class="expansionBordre"
                        >展示实体列表</v-expansion-panel-header
                      >
                      <v-expansion-panel-content>
                        <div>
                          <v-row style="margin-left: 10px">
                            <v-col cols="5" class="py-0 pt-2 pb-2">
                              <v-select
                                :menu-props="{ bottom: true }"
                                v-model="addOperation"
                                placeholder="添加"
                                :items="addOperationAry"
                                outlined
                                dense
                                no-data-text="没有匹配数据"
                                @change="addOperationEvent(item, i)"
                              />
                            </v-col>
                            <v-col cols="1"></v-col>
                            <v-col cols="5" class="py-0 pt-2 pb-2">
                              <v-select
                                :menu-props="{ bottom: true }"
                                v-model="item.batchOperation"
                                item-text="text"
                                item-value="value"
                                placeholder="批量操作"
                                :disabled="!item.isBlackSelect"
                                :items="batchOperationAry"
                                outlined
                                dense
                                no-data-text="没有匹配数据"
                                @change="batchOperationEvent(item, i)"
                              />
                            </v-col>
                          </v-row>
                          <!-- item-text="text"
                            item-value="value" -->
                          <v-data-table
                            v-model="item.blackList"
                            :headers="item.headers"
                            :items="item.entityLists"
                            :items-per-page="1000"
                            hide-default-footer
                            height="249"
                            item-key="entity"
                            show-select
                            no-results-text="没有匹配的数据"
                            class="elevation-1 blackListTableStyle"
                            @input="selectInput(item)"
                          >
                            <template v-slot:no-data>暂无数据</template>
                          </v-data-table>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
            <!-- // -->
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
    <!-- 展示实体列表-手动输入 -->
    <v-row justify="center">
      <v-dialog v-model="handDialog" persistent scrollable max-width="900px">
        <v-card class="baseCardStyle" style="width: 700px; min-height: 550px">
          <v-card-title>
            <v-toolbar-title> 手动输入 </v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn icon dark @click="cancelsEditor">
              <v-icon color="var(--v-headerCloseIconColor-base)"
                >mdi-close</v-icon
              >
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <!-- 查看选中模型 -->
          <v-card-text>
            <div class="home" style="width: 600px; min-height: 150px">
              <h3>
                输入内容
                <span style="font-size: 12px">（数据不超过20条）</span>
              </h3>
              <div>
                <v-textarea
                  name="input-7-1"
                  label="请输入内容"
                  v-model="editorData"
                  solo
                ></v-textarea>
              </div>
              <div
                v-if="
                  rightEditor.length !== 0 ||
                  repeatEditor.length !== 0 ||
                  notExistEditor.length !== 0
                "
              >
                <h3>检索预览</h3>
                <div style="border: 1px solid #c9d8db">
                  <div
                    id="box"
                    v-for="(item, index) in rightEditor"
                    :key="index"
                  >
                    {{ item }}
                  </div>
                  <div
                    style="color: orange"
                    id="box"
                    v-for="(item, index) in repeatEditor"
                    :key="index + 40"
                  >
                    {{ item }}
                    <span>重复</span>
                  </div>
                  <div
                    style="color: red"
                    id="box"
                    v-for="(item, index) in notExistEditor"
                    :key="index + 100"
                  >
                    {{ item }}
                    <span>不存在</span>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <div class="flex-grow-1" />
            <div>
              <v-btn class="cancelButton mr-4" outlined @click="cancelsEditor"
                >取消
              </v-btn>
              <v-btn
                class="primary mr-4"
                style="margin-right: 10px; color: white"
                @click.stop="addtoDisplayList(manualResult, manualIndex)"
              >
                添加到展示列表
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- 展示实体列表-模型结果 -->
    <v-row justify="center">
      <v-dialog
        v-model="operationDialog"
        persistent
        scrollable
        max-width="1100px"
      >
        <v-card class="baseCardStyle" >
          <v-card-title>
            <v-toolbar-title> 添加模型结果 </v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn icon dark @click="cancelviewTheResult">
              <v-icon color="var(--v-headerCloseIconColor-base)"
                >mdi-close</v-icon
              >
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <!-- 查看选中模型 -->
          <v-card-text v-if="isDisplayTable === 'model'">
            <div>
              <v-form
                ref="searchForm"
                v-model="searchValid"
                lazy-validation
                style="
                  margin-top: 20px;
                  display: flex;
                  justify-content: space-between;
                "
              >
                <div style="margin-top: 8px">
                  <span> 应用名称： </span>
                  <span>{{ manualResult.appName }}</span>
                </div>
                <div style="margin-top: 8px">
                  <span> 模型名称： </span>
                  <span>{{ manualResult.modelName }}</span>
                </div>
                <div>
                  <span> 模型运行时间： </span>
                  <v-text-field
                    style="width: 240px; display: inline-block"
                    outlined
                    dense
                    v-model="dateRangeText"
                    append-icon="event"
                    @click="dateInputClick"
                    background-color="white"
                  ></v-text-field>
                </div>
                <div>
                  <div style="width: 140px; margin-top: 5px">
                    <v-btn
                      color="primary"
                      class="ml-4"
                      small
                      @click="searchAddModel(manualResult)"
                      >查询</v-btn
                    >
                    <v-btn
                      color="primary"
                      class="ml-4"
                      @click="resetAddModel(manualResult)"
                      small
                      >重置</v-btn
                    >
                  </div>
                </div>
              </v-form>
              <v-col cols="2">
                <v-dialog v-model="ifdateShow" width="321">
                  <v-date-picker
                    selected-items-text="已选择日期"
                    v-model="searchForm.dates"
                    range
                    @change="dateChange"
                  ></v-date-picker>
                </v-dialog>
              </v-col>
            </div>
            <!-- 添加模型结果table -->
            <v-data-table
              :headers="resultHeaders"
              :items="resultdatas"
              :items-per-page="perPageNums"
              hide-default-footer
              :fixed-header="true"
              :elevation="3"
              no-results-text="没有匹配的数据"
              height="280"
              item-key="id"
              show-select
              v-model="selectedTasks"
              single-select
              selectable-key
              :loading="loading"
              loading-text="加载数据中..."
            >
              <template v-slot:no-data>没有数据</template>
              <template v-slot:footer>
                <v-divider></v-divider>
                <div
                  class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0"
                >
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
                        @change="pageChange(manualResult, $event)"
                      /> </span
                    >条
                    <span style="margin-left: 15px">共{{ totalItems }}条</span>
                    <v-spacer />
                    <v-pagination
                      class="d-flex justify-end pagination"
                      v-model="pageNum"
                      :length="queryPageLength"
                      :total-visible="7"
                      @input="onPageChange(manualResult, $event)"
                    />
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
          <!-- 查看选中集合详情 -->
          <v-card-text v-if="isDisplayTable === 'detail'">
            <v-row>
              <v-col cols="4" class="py-0 pt-2 pb-2">
                <div>
                  <span>应用名称：</span>
                  <span>{{ headerApplicationName }}</span>
                </div>
              </v-col>
              <v-col cols="4" class="py-0 pt-2 pb-2">
                <span>模型名称：</span>
                <span>{{ headerModelName }}</span>
              </v-col>
              <v-col cols="4" class="py-0 pt-2 pb-2">
                <span>模型运行时间：</span>
                <span>{{ headerRunTime }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <span> 团队节点类型： </span>
                <span>{{nodeType}}</span>
              </v-col>
            </v-row>
            <!-- 查看选中集合详情 -->
            <v-data-table
              :headers="collectionHeaders"
              :items="collectiondatas"
              :items-per-page="perPagesNum"
              hide-default-footer
              :fixed-header="true"
              :elevation="3"
              no-results-text="没有匹配的数据"
              height="280"
              item-key="num"
              show-select
              v-model="selectTask"
              single-select
              selectable-key
              :loading="loadingt"
              loading-text="加载数据中..."
            >
              <template v-slot:no-data>没有数据</template>
              <template v-slot:footer>
                <v-divider></v-divider>
                <div
                  class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0"
                >
                  <div class="footer__select">
                    每页
                    <span>
                      <v-select
                        v-model="perPagesNum"
                        item-text="fieldName"
                        item-value="fieldField"
                        :items="perPagesItem"
                        dense
                        width="27px"
                        no-data-text="没有匹配数据"
                        @change="pagesChange"
                      /> </span
                    >条
                    <span style="margin-left: 15px">共{{ totalsItem }}条</span>
                    <v-spacer />
                    <v-pagination
                      class="d-flex justify-end pagination"
                      v-model="pagesNum"
                      :length="queryPagesLength"
                      :total-visible="7"
                      @input="onPagesChange"
                    />
                  </div>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
          <!-- 添加到展示列表 -->
          <v-card-text v-if="isDisplayTable === 'list'">
            <v-row>
              <v-col cols="4" class="py-0 pt-2 pb-2">
                <div>
                  <span>应用名称：</span>
                  <span>{{ headerApplicationName }}</span>
                </div>
              </v-col>
              <v-col cols="4" class="py-0 pt-2 pb-2">
                <span>模型名称：</span>
                <span>{{ headerModelName }}</span>
              </v-col>
              <v-col cols="4" class="py-0 pt-2 pb-2">
                <span>模型运行时间：</span>
                <span>{{ headerRunTime }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4" class="py-0 pt-2 pb-2">
                <div>
                  <span>实体类型：</span>
                  <span>{{ nodeType }}</span>
                </div>
              </v-col>
              <v-col cols="4" class="py-0 pt-2 pb-2">
                <span>实体总数：</span>
                <span>{{ entitysTypeTotal }}</span>
              </v-col>
            </v-row>
            <v-data-table
              :headers="displayListHeaders"
              :items="displayListdatas"
              :items-per-page="5000"
              hide-default-footer
              :fixed-header="true"
              :elevation="3"
              no-results-text="没有匹配的数据"
              height="280"
              item-key="entity"
              show-select
              v-model="selectedTad"
              selectable-key
              :loading="loadingsd"
              loading-text="加载数据中..."
            >
              <template v-slot:no-data>没有数据</template>
            </v-data-table>
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <div class="flex-grow-1" />
            <div v-if="isDisplayTable === 'model'">
              <v-btn
                class="cancelButton mr-4"
                outlined
                @click="cancelviewTheResult"
                >取消
              </v-btn>
              <v-btn
                class="primary mr-4"
                style="margin-right: 10px; color: white"
                @click="
                  viewTheResults(manualResult.modelName, manualResult.appName, manualResult.appId)
                "
              >
                查看选中模型并继续筛选结果
              </v-btn>
            </div>
            <div v-if="isDisplayTable === 'detail'">
              <v-btn
                class="cancelButton mr-4"
                outlined
                @click="cancelviewTheResult"
                >取消
              </v-btn>
              <v-btn
                class="mr-4"
                style="margin-right: 10px"
                @click="thePageDetail"
              >
                上一页
              </v-btn>
              <v-btn
                class="primary mr-4"
                style="margin-right: 10px; color: white"
                @click="viewTheDetail"
              >
                查看选中结果集合详情
              </v-btn>
            </div>
            <div v-if="isDisplayTable === 'list'">
              <v-btn
                class="cancelButton mr-4"
                outlined
                @click="cancelviewTheResult"
                >取消
              </v-btn>
              <v-btn
                class="mr-4"
                style="margin-right: 10px"
                @click="thePageList"
              >
                上一页
              </v-btn>
              <v-btn
                class="primary mr-4"
                style="margin-right: 10px; color: white"
                @click="viewTheList(manualResult, manualIndex)"
              >
                添加到展示列表
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- 修改卡片名称 -->
    <v-row justify="center">
      <v-dialog
        v-model="editCardDialog"
        persistent
        scrollable
        max-width="500px"
      >
        <v-card class="baseCardStyle">
          <v-card-title>
            <v-toolbar-title>
              修改卡片
              <!-- 编辑 -->
            </v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn icon dark @click="cancelEditDialog">
              <v-icon color="var(--v-headerCloseIconColor-base)"
                >mdi-close</v-icon
              >
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form
              class="ruleSetAddOrEdit"
              ref="formEdit"
              v-model="valid"
              :lazy-validation="lazy"
            >
              <v-row style="margin-left: 10px">
                <v-col cols="3" class="pr-0" style="margin-top: 12px">
                  <div class="mt-2">折线排列方式：</div>
                </v-col>
                <v-col cols="7">
                  <v-radio-group v-model="formEdit.valueRadio" row>
                    <v-radio label="堆叠" value="1"></v-radio>
                    <v-radio label="平行" value="2"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row style="margin-left: 10px">
                <v-col cols="3" class="pr-0">
                  <div class="mt-2">卡片名称：</div>
                </v-col>
                <v-col cols="7">
                  <v-text-field
                    label="请输入卡片名称"
                    :rules="formEdit.rules"
                    v-model.trim="formEdit.valueText"
                    dense
                    outlined
                    type="text"
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
                @click="cancelEditDialog"
                >取消
              </v-btn>
              <v-btn
                class="primary mr-4"
                style="margin-right: 10px; color: white"
                @click="confimEditCardName()"
                :disabled="!valid"
              >
                确定
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- // 加入黑名单弹出窗 -->
    <v-row justify="center">
      <v-dialog
        style="overflow-x: hidden"
        v-model="isShowBlackList"
        persistent
        scrollable
        max-width="500px"
      >
        <v-card>
          <v-card-title>
            <span class="ckxq_size">选择黑名单</span>
            <div class="flex-grow-1" />
            <v-btn icon dark @click="cancelBlackDialog()">
              <v-icon color="#CCCCCC">mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-form
            ref="addTemplaterAry"
            :lazy-validation="lazy"
            style="overflow-x: hidden"
            v-model="valid"
            class="form"
          >
            <v-row>
              <v-col cols="2"> </v-col>
              <v-col cols="8" sm="8">
                <v-select
                  v-model="addTemplaterAry.appName"
                  item-text="appName"
                  item-value="id"
                  :items="applyNameAry"
                  :menu-props="{ bottom: true }"
                  label="应用名称*"
                  required
                  :rules="[(v) => !!v || '应用名称不能为空']"
                  outlined
                  dense
                  @change="appNameChange(addTemplaterAry.appName)"
                  no-data-text="没有匹配数据"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2"> </v-col>
              <v-col cols="8" sm="8">
                <v-select
                  v-model="addTemplaterAry.blackName"
                  item-text="listName"
                  item-value="id"
                  :items="blackNameAry"
                  :menu-props="{ bottom: true }"
                  label="黑名单集*"
                  required
                  :rules="[(v) => !!v || '黑名单集不能为空']"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="2"> </v-col>
              <v-col cols="8" sm="8">
                <datetime-picker
                  v-model="addTemplaterAry.oinvalidTime"
                  time-format="HH:mm:ss"
                  @clear="addTemplaterAry.oinvalidTime = ''"
                  :text-field-props="textFieldProps"
                  :date-picker-props="dateProps"
                  :time-picker-props="timeProps"
                  placeholder="不填写时，默认永久有效"
                />
              </v-col>
            </v-row>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="flex-grow-1" />
            <div>
              <v-btn
                class="cancelButton mr-4"
                outlined
                @click="cancelBlackDialog"
                >取消
              </v-btn>
              <v-btn
                class="primary mr-4"
                :disabled="!valid"
                @click="mistakeDialog()"
                >确定</v-btn
              >
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- 删除弹框 -->
    <del-dialog
      :isDialogShow="dialogDel"
      :customDelTitle="removeText"
      @cancelDel="dialogDel = false"
      @confimDel="deteleCards"
    ></del-dialog>
    <!-- 公共弹框提示 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >
      {{ snackbarServeMsg }}
    </v-snackbar>
    <!-- // -->
    <v-row justify="center">
      <v-dialog v-model="isDialogShows" persistent width="381">
        <v-card>
          <v-card-title class="del-dialog-title">
            {{ customDelTitles }}
          </v-card-title>
          <v-card-actions style="margin-right: 12px; margin-top: 10px">
            <div class="flex-grow-1" />
            <v-btn text class="del-dialog-btn" @click="cancelDelList()">
              取消
            </v-btn>
            <v-btn
              color="primary"
              text
              class="del-dialog-btn"
              @click="bathDelEntityLists()"
            >
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--  -->
  </div>
</template>

<script>
import {
  getCardInfo,
  getAppInfoOrTradeType,
  modelByApp,
  findsysparams,
  addCardInfo,
  targetByModel,
  delCardInfo,
  updateCardInfo,
  queryEntityListBrokenLine,
  checkEntityListIsLegitimate,
  mlModelList,
  nodeByAppAndModel,
  mlModeRestList,
  showEntityList,
  allCardSave,
  getBlackName,
  mlBatchAddBlack,
  mlBatchDelBlack,
  bathDelEntityList
} from '../../api/indicatorsDisplayPage.js';
import DelDialog from '@/components/DelDialog';
import DatetimePicker from '@c/DateTimePicker';
import BaseEcharts from '@c/BaseEcharts';
import moment from 'moment';
import { DatePicker } from 'view-design';
export default {
  name: 'indicatorsDisplayPage',
  components: {
    BaseEcharts,
    DelDialog,
    DatetimePicker,
    DatePicker
    // BaseSearchTwo
  },
  data: () => ({
    manualResult: {},
    manualIndex: '',
    isFixed: false,
    cardLoading: false,
    fullHeight: window.innerHeight,
    itemsvalue: '',
    form: [
      {
        label: '应用名称',
        value: '',
        options: [],
        type: 'select'
      },
      {
        label: '模型名称',
        value: '',
        options: [],
        type: 'select'
      },
      {
        label: '不同折线对应',
        value: '',
        options: [
          { itemtext: '指标', itemvalue: '1' },
          { itemtext: '实体', itemvalue: '2' }
        ],
        type: 'select'
      },
      {
        label: '实体类型',
        value: '',
        options: [],
        type: 'select'
      },
      {
        label: '计算指标',
        value: '',
        options: [],
        type: 'selectChip'
      },
      {
        label: '折线排列方式',
        value: '',
        options: [
          { itemtext: '堆叠', itemvalue: '1' },
          { itemtext: '平行', itemvalue: '2' }
        ],
        type: 'select'
      },
      {
        label: '卡片名称',
        value: '',
        type: 'text',
        rules: [
          v => (v && v.length <= 27 && v.length >= 3) || '长度为3-27个字符',
          v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
        ],
        counter: '27'
      }
    ],
    multipleCalculate: true,
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    // 日历时间
    selectTimeAry: [
      { text: '昨天', value: -1 },
      { text: '近一周', value: -7 },
      { text: '近一月', value: -30 },
      { text: '近一年', value: -365 }
    ],
    // 时间选择框
    options: {
      shortcuts: [
        {
          text: '今天',
          value () {
            const end = new Date();
            const start = new Date();
            return [start, end];
          }
        },
        {
          text: '近一周',
          value () {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          }
        },
        {
          text: '近一月',
          value () {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          }
        },
        {
          text: '近一年',
          value () {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            return [start, end];
          }
        }
      ]
    },
    crudFormDialog: false, // 新建卡片
    expansionOpenNumber: [], // 卡片是否折叠
    lazy: false,
    valid: true,
    addOperation: '', // 添加操作值
    addOperationAry: ['手动输入', '模型结果'],
    // batchOperation: '', // 批量操作值
    batchOperationAry: ['清除', '加入黑名单', '移出黑名单'],
    dialogDel: false,
    removeText: '',
    delCurrentId: '', // 删除卡片id
    deteleCards: '',
    editCardDialog: false, // 修改卡片弹窗
    formEdit: {
      valueRadio: '',
      valueText: '',
      rules: [
        v => (v && v.length <= 27 && v.length >= 3) || '长度为3-27个字符',
        v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
      ],
      counter: '27'
    },
    editNameCard: '',
    expansionAry: [], // 卡片结果
    handDialog: false, // 手动输入弹出框
    editorData: '',
    rightEditor: [],
    repeatEditor: [],
    notExistEditor: [],
    rightListEditor: [],
    operationDialog: false, // 模型结果弹出框
    // operationValue: '', // 选中操作值
    // 操作结果
    // dateRangeText: '', // 时间
    searchForm: {
      dates: []
    },
    searchValid: true,
    ifdateShow: false,
    // 添加模型结果table
    // -表格头部
    resultHeaders: [
      {
        text: '应用名称',
        align: 'left',
        sortable: false,
        value: 'appName',
        width: 100
      },
      { text: '模型名称', value: 'modelName', sortable: false, width: 100 },
      { text: '模型运行时间', value: 'runTime', align: 'center', sortable: false, width: '30%' }
    ],
    // -表格数据
    loading: false,
    resultdatas: [],
    perPageNums: 10, // 每页十条
    perPageItems: [5, 10, 15, 20, 50, 100],
    totalItems: 1, // 总数条
    pageNum: 1, // 第几页
    queryPageLength: 0,
    targetsIp: [],
    targetsdevFp: [],
    targetsuserId: [],
    targetsPos: [],
    targetsglobal: [],
    // -表格勾选
    selectedTasks: [],
    /// two
    headerApplicationName: '', // 应用名称
    headerModelName: '', // 模型名称
    headerRunTime: '', // 模型运行时间
    nodeType: '', // 团队节点类型
    // nodeTypeAry: [], // 团队节点类型数组
    // --表格头部
    collectionHeaders: [
      {
        text: '结果集合',
        align: 'left',
        sortable: false,
        value: 'results_set',
        width: 100
      },
      { text: '实体总数', value: 'results_nums', sortable: false, width: 100 }
    ],
    // --表格数据
    loadingt: false,
    collectiondatas: [],
    perPagesNum: 10, // 每页十条
    perPagesItem: [5, 10, 15, 20, 50, 100],
    totalsItem: 1, // 总数
    pagesNum: 1, // 第几页
    queryPagesLength: 0,
    selectTask: [], // --表格勾选
    // ---table
    displayListHeaders: [
      {
        text: '结果',
        align: 'left',
        sortable: false,
        value: 'entity',
        width: 100
      },
      { text: '是否已加入黑名单', value: 'backListState', sortable: false, width: 100 }
    ],
    displayListdatas: [],
    selectedTad: [],
    loadingsd: false,
    // 添加黑名单弹框
    isShowBlackList: false,
    addTemplaterAry: {
      appName: '',
      blackName: '',
      oinvalidTime: '' // 失效时间
    },
    blackNameAry: [],
    applyNameAry: [],
    currentItem: {}, // 当前项
    textFieldProps: {
      appendIcon: 'event'
    },
    dateProps: {
      headerColor: 'primary'
    },
    timeProps: {
      useSeconds: true,
      ampmInTitle: true
    },
    delEntityListspam: {},
    //
    entitysTypeTotal: '',
    isDisplayTable: '',
    isDialogShows: false,
    customDelTitles: '',
    entitySelectType: ''
  }),
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 204;
      }
    },
    dateRangeText: {
      get () {
        if (moment(this.searchForm.dates[0]).valueOf() < moment(this.searchForm.dates[1]).valueOf()) {
        } else if (moment(this.searchForm.dates[0]).valueOf() > moment(this.searchForm.dates[1]).valueOf()) {
          this.reverseArry(this.searchForm.dates);
        }
        return this.searchForm.dates.join(' 至 ');
      },
      set (newVal) { }
    }
  },
  watch: {},
  created () {
    sessionStorage.getItem('pageId');
    this.getCardList();
    Promise.all([
      this.getAppInfoOrTradeType(),
      // this.targetsByModel(),
      this.findsSysparam()
    ]);
    this.applyNameAry = JSON.parse(sessionStorage.getItem('vuexAppList'));
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('scroll', this.fixedBtnBox);
    sessionStorage.setItem('detail', true);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    entitytType (query) {
      if (query) {
        let type = this.form[3].options.find(item => item.paramValue === query).paramName;
        return type;
      }
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 头部fixed定位
    fixedBtnBox () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 72) { // 当页面滚动到高度72px处，动态绑定class 来设置头部固定定位
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    // 应用名称-添加弹出框
    async getAppInfoOrTradeType () {
      try {
        let param = {
          applyScopeId: 2
        };
        const res = await getAppInfoOrTradeType(param);
        if (res.data.code === 200) {
          this.form[0].options = res.data.data;
        }
      } catch (err) { }
    },
    // 模型名称-添加弹出框
    async modelsByApp (query) {
      this.form[1].value = '';
      this.form[1].options = [];
      try {
        let param = {
          appId: query
        };
        const res = await modelByApp(param);
        if (res.data.code === 200) {
          this.form[1].options = res.data.data;
          this.searchForm.modelAry = res.data.data;
        }
      } catch (err) { }
    },
    // 实体类型-添加弹出框
    async findsSysparam () {
      try {
        let param = {
          identifier: 'ml_node_type'
        };
        const res = await findsysparams(param);
        if (res.data.code === 200) {
          this.form[3].options = res.data.data;
        }
      } catch (err) { }
    },
    // 点击模型名称获取指标信息
    modelNameTargets (item) {
      if (this.form[2].value || this.form[3].value || this.form[4].value || this.form[5].value || this.form[6].value) {
        this.form[2].value = '';
        this.form[3].value = '';
        this.form[4].value = '';
        this.form[5].value = '';
        this.form[6].value = '';
      };
      this.targetsByModel(item.modelName);
      // console.log(item.modelName, 'item.modelName');
    },
    // 不同折线对应到指标
    modelRadioValue (item) {
      this.itemsvalue = this.form[2].value.itemvalue;
      if (item.itemvalue === '1') {
        this.form[4].options = this.targetsglobal;
        this.multipleCalculate = true;
        this.form[4].value = '';
      } else {
        this.multipleCalculate = false;
        this.form[3].value = '';
        this.form[4].value = '';
        this.form[4].options = [];
      }
    },
    // 点击实体类型
    modelParamName (items) {
      if (items === 'ip') {
        this.form[4].options = this.targetsIp;
      };
      if (items === 'dev_fp') {
        this.form[4].options = this.targetsdevFp;
      };
      if (items === 'user_id') {
        this.form[4].options = this.targetsuserId;
      };
      if (items === 'merchant_no') {
        this.form[4].options = this.targetsPos;
      };
    },
    // 指标信息-添加弹出框
    async targetsByModel (item) {
      try {
        let param = {
          modelName: item
        };
        const res = await targetByModel(param);
        if (res.data.code === 200) {
          let targets = res.data.data;
          this.targetsIp = targets.ip.map(item => {
            var nowArr = item.split(':');
            return { 'text': nowArr[0], 'id': nowArr[1] };
          });
          this.targetsdevFp = targets.dev_fp.map(item => {
            var nowArr = item.split(':');
            return { 'text': nowArr[0], 'id': nowArr[1] };
          });
          this.targetsuserId = targets.user_id.map(item => {
            var nowArr = item.split(':');
            return { 'text': nowArr[0], 'id': nowArr[1] };
          });
          this.targetsglobal = targets.global.map(item => {
            var nowArr = item.split(':');
            return { 'text': nowArr[0], 'id': nowArr[1] };
          });
          this.targetsPos = targets.merchant_no.map(item => {
            var nowArr = item.split(':');
            return { 'text': nowArr[0], 'id': nowArr[1] };
          });
        }
      } catch (err) { }
    },
    // 请求卡片数据
    getCardList () {
      getCardInfo({ boardId: sessionStorage.getItem('pageId') }).then(res => {
        this.cardLoading = true;
        let query = res.data.data.map(item => {
          if (item.entityLists === null) {
            item.entityLists = [];
          } else {
            item.entityLists.map(listItem => {
              if (listItem.backListState === false) {
                listItem.backListState = '';
              } else {
                listItem.backListState = '是';
              }
            });
          };
          let obj = {
            blackList: [], // 展示实体列表多选项
            headers: [
              {
                text: this.entitytType(item.entityType),
                align: 'start',
                sortable: false,
                value: 'entity',
                width: 100
              },
              { text: '是否已加入黑名单', value: 'backListState', width: 100 }
            ],
            isBlackSelect: false,
            batchOperation: '', // 批量操作值
            dates: [], // 时间弹框选择的值
            datesTime: '', // 时间弹框展示的值
            selectTime: -7, // 快捷时间select
            isdateShow: false, // 时间弹框是否展示
            newDate: null,
            cardDetailsOpenNumber: 0, // 大card展示项
            lineLoading: true,
            lineGrossShow: false
          };
          return Object.assign(obj, item);
        });
        this.expansionAry = query;
        this.expansionAry.forEach((items, index) => {
          this.changeDay(items);
          this.expansionClick(items, index);
        });
        this.expansionOpenNumber = [...Array(this.expansionAry.length).keys()].map((k, i) => i);
        this.expansionAry.forEach(item => {
          item.isEchartsShow = false;
          item.lineLoading = false;
          item.lineGrossShow = true;
        });
      });
    },
    // 请求修改单个卡片数据
    getCardOList () {
      getCardInfo({ boardId: sessionStorage.getItem('pageId'), id: this.editNameCard }).then(res => {
        if (res.data.code === 200) {
          if (res.data.data[0].entityLists === null) {
            res.data.data[0].entityLists = [];
          } else {
            var resdate = res.data.data[0].entityLists.map(listItem => {
              if (listItem.backListState === false) {
                listItem.backListState = '';
              } else {
                listItem.backListState = '是';
              }
              return res.data.data[0];
            });
          };
          this.expansionAry.forEach((item, index) => {
            if (item.id === res.data.data[0].id) {
              Object.assign(this.expansionAry[index], res.data.data[0]);
              this.expansionClick(this.expansionAry[index], index);
            }
          });
        }
      });
    },
    // 添加卡片
    doAddCard () {
      this.crudFormDialog = true;
    },
    // 取消添加卡片
    cancelCrudFormDialog () {
      this.crudFormDialog = false;
      this.$refs.form.reset();
    },
    // 确定添加卡片
    async confimDialogEdit () {
      let calcIndex = '';
      if (this.form[2].value.itemvalue === '2') {
        let calcIndex1 = this.form[4].value + ':' + this.form[3].value.paramValue;
        calcIndex = [calcIndex1];
      } else {
        calcIndex = this.form[4].value.map(e => {
          return `${e}:global`;
        });
      }
      let query = {
        boardId: sessionStorage.getItem('pageId'),
        appId: this.form[0].value.appId,
        modelName: this.form[1].value.modelName,
        brokenLineCorresponding: this.form[2].value.itemvalue,
        entityType: this.form[3].value.paramValue,
        calcIndex: calcIndex.join(','),
        brokenLineType: this.form[5].value.itemvalue,
        cardName: this.form[6].value,
        cardNum: '0',
        cardType: '1'
      };
      try {
        const res = await addCardInfo(query);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '添加成功';
          this.snackbarServeColor = 'success';
          this.crudFormDialog = false;
          this.$refs.form.reset();
          this.getCardList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.data.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // top全部折叠
    doAllFolding () {
      this.expansionOpenNumber = [];
    },
    // top全部展开
    doFolding () {
      this.expansionOpenNumber = [...Array(this.expansionAry.length).keys()].map((k, i) => i);
    },
    // 取消修改卡片
    cancelEditDialog () {
      this.editCardDialog = false;
      this.$refs.formEdit.reset();
    },
    // 修改卡片名称
    editCard (item) {
      this.editCardDialog = true;
      this.editNameCard = item.id;
      if (item.brokenLineType !== null) {
        this.formEdit.valueRadio = item.brokenLineType;
      };
      this.formEdit.valueText = item.cardName;
    },
    // 修改卡片确定按钮
    confimEditCardName () {
      let query = {
        id: this.editNameCard,
        cardName: this.formEdit.valueText,
        brokenLineType: this.formEdit.valueRadio
      };
      updateCardInfo(query).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '修改成功';
          this.snackbarServeColor = 'success';
          // this.getCardList();
          this.getCardOList();
          this.editCardDialog = false;
          this.$refs.formEdit.reset();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.data.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 删除卡片
    deteleCard (item) {
      this.dialogDel = true;
      this.delCurrentId = item.id;
      this.removeText = '即将删除卡片：' + item.cardName;
      this.deteleCards = this.confirmDel;
    },
    async confirmDel () {
      try {
        const res = await delCardInfo({ id: this.delCurrentId });
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '删除成功';
          this.snackbarServeColor = 'success';
          this.getCardList();
          this.dialogDel = false;
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
    // 点击单个卡片请求数据
    async expansionClick (item, index) {
      let query = {};
      let brokenLines = '';
      if (item.brokenLineCorresponding === '1') {
        brokenLines = item.calcIndex;
        query = {
          // indexEntityList: entityValue.join(','),
          indexEntityList: brokenLines,
          brokenLineCorresponding: item.brokenLineCorresponding,
          // appId: 'com.tsbank.demo',
          appId: item.appId,
          modelName: item.modelName,
          startTime: item.datesTime.split(' 至 ')[0],
          endTime: item.datesTime.split(' 至 ')[1],
          index
        };
      } else {
        let entityValue = [];
        if (this.expansionAry[index].entityLists !== null) {
          this.expansionAry[index].entityLists.map(i => {
            entityValue.push(`${i.entity}:${item.entityType}`);
            return entityValue;
          });
        };
        brokenLines = entityValue.join(',');
        query = {
          // indexEntityList: entityValue.join(','),
          indexEntityList: brokenLines,
          brokenLineCorresponding: item.brokenLineCorresponding,
          index: item.calcIndex.split(':')[0],
          // appId: 'com.tsbank.demo',
          appId: item.appId,
          modelName: item.modelName,
          startTime: item.datesTime.split(' 至 ')[0],
          endTime: item.datesTime.split(' 至 ')[1],
          indexs: index
        };
      }
      if (query.indexEntityList === '') {
        this.$set(this.expansionAry[index], 'echartOptions', {});
        return;
      };
      await queryEntityListBrokenLine(query).then(res => {
        if (res.data.code === 200) {
          res.data.data.series.map(i => {
            i.type = 'line';
            if (item.brokenLineType && item.brokenLineType === '2') {
              i.stack = '总量';
            }
            return i;
          });
          let echartOptions = {
            width: '100%',
            height: '389px',
            color: window.g.echartsBaseColor,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            legend: {
              // data: ['邮件营销8', '联盟广告', '视频广告', '直接访问', '搜索引擎']
              data: res.data.data.item,
              type: 'scroll'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: 50,
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                data: res.data.data.xTime
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            dataZoom: [{
              show: true,
              start: 0,
              width: '70%',
              left: '15%',
              end: 100
            }, {
              type: 'inside'
            }],
            series: res.data.data.series
          };
          this.$set(this.expansionAry[index], 'echartOptions', echartOptions);
          item.isEchartsShow = true;
        }
      });
    },
    // 快捷时间selectChange事件
    selectTimeChange (item, index) {
      this.changeDay(item);
      this.expansionClick(item, index);
    },
    changeDay (item) {
      // 生成时间
      let today = new Date();
      today.setTime(today.getTime() + item.selectTime * 24 * 60 * 60 * 1000);
      let startDay = this.dateToString(today);
      let endDay = this.dateToString(new Date()).substr(0, 10);
      this.dateStart = startDay;
      if (item.selectTime === -1) { // -1为选择了昨天的时间
        item.dates = [startDay, startDay];
      } else {
        item.dates = [startDay, endDay];
      }
      item.datesTime = item.dates.join(' 至 ');
      this.searchForm.dates = item.dates;
    },
    // 日期转字符串
    dateToString (date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length === 1) {
        month = '0' + month;
      }
      if (day.length === 1) {
        day = '0' + day;
      }
      var dateTime = year + '-' + month + '-' + day;
      return dateTime;
    },
    formatDate (dateInput) {
      var date = new Date(dateInput);
      var YY = date.getFullYear() + '-';
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      return YY + MM + DD;
    },
    // 选择时间的弹框
    timeChange (dates, item, index) {
      if (dates.length === 2 && dates[0] !== '' && dates[1] !== '') {
        // if (moment(dates[0]).valueOf() < moment(dates[1]).valueOf()) {
        // } else if (moment(dates[0]).valueOf() > moment(dates[1]).valueOf()) {
        //   this.reverseArry(dates);
        // }
        // item.datesTime = item.dates.join(' 至 ');
        item.datesTime = this.formatDate(dates[0]) + ' 至 ' + this.formatDate(dates[1]);
        this.expansionClick(item, index);
        item.isdateShow = false;
      }
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
    // 选择时间的弹框
    dateChange () {
      if (this.searchForm.dates.length === 2) {
        this.ifdateShow = false;
      }
    },
    // 添加操作选中值
    addOperationEvent (item, i) {
      this.rightEditor = [];
      // if (item.entityType === 'dev_fp') {
      //   this.nodeType = '设备指纹';
      // } else if (item.entityType === 'ip') {
      //   this.nodeType = 'IP';
      // } else if (item.entityType === 'user_id') {
      //   this.nodeType = '账号';
      // } else if (item.entityType === 'merchant_no') {
      //   this.nodeType = '商户号';
      // }
      this.nodeType = this.entitytType(item.entityType);
      this.manualResult = item;
      this.manualIndex = i;
      if (this.addOperation === '模型结果') {
        this.operationDialog = true;
        this.searchForm.dates = [];
        this.isDisplayTable = 'model';
        let queryDa = {
          page: this.pageNum,
          pageSize: this.perPageNums,
          begainTime: '',
          endTime: '',
          appId: item.appId,
          modelName: item.modelName
        };
        this.mlModelsList(queryDa);
      }
      if (this.addOperation === '手动输入') {
        this.handDialog = true;
      }
    },
    // 取消手动输入编辑框
    cancelsEditor () {
      this.addOperation = '';
      this.editorData = '';
      this.rightEditor = [];
      this.repeatEditor = [];
      this.notExistEditor = [];
      this.rightListEditor = [];
      this.handDialog = false;
    },
    // 手动输入添加到展示列表
    addtoDisplayList (item, i) {
      this.checkEntityLists(item, i);
    },
    async checkEntityLists (item, i) {
      let query = {
        entityList: this.editorData.split('\n').join(','),
        modelName: item.modelName,
        entityType: item.entityType,
        appId: item.appId
        // appId: 'com.tsbank.demo'
      };
      try {
        const res = await checkEntityListIsLegitimate(query);
        if (res.data.code === 200) {
          this.addOperation = '';
          this.editorData = '';
          this.rightEditor = res.data.data.right;
          this.repeatEditor = res.data.data.repeat;
          this.notExistEditor = res.data.data.notExist;
          if (res.data.data.isExistBlankList !== []) {
            this.rightListEditor = res.data.data.isExistBlankList;
            let arrAry = [...this.expansionAry[i].entityLists, ...this.rightListEditor];
            let objAry = [];
            arrAry.forEach(it => {
              objAry.push(it.entity);
            });
            let query = [{ id: item.id, entityList: objAry.join(',') }];
            let param = {
              entityLists: JSON.stringify(query)
            };
            if (this.repeatEditor.length === 0 && this.notExistEditor.length === 0) {
              this.editNameCard = item.id;
              allCardSave(param).then(res => {
                if (res.data.code === 200) {
                  this.handDialog = false;
                  this.getCardOList();
                };
              });
            };
          };
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.data.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 取消模型结果
    cancelviewTheResult () {
      this.operationDialog = false;
      this.searchForm.dates = this.manualResult.datesTime.split(' 至 ');
      this.addOperation = '';
      this.selectedTasks = [];
      this.resultdatas = [];
      this.collectiondatas = [];
      this.selectTask = [];
      this.displayListdatas = [];
      this.selectedTad = [];
    },
    // 模型结果列表
    mlModelsList (query) {
      this.loading = true;
      mlModelList(query).then(res => {
        if (res.data.code === 200) {
          this.loading = false;
          this.resultdatas = [];
          if (res.data.data.paramsList.length !== 0) {
            this.resultdatas = res.data.data.paramsList.map((item, index) => {
              JSON.parse(sessionStorage.getItem('vuexAppList')).forEach(i => {
                if (item.appId === i.id) {
                  res.data.data.paramsList[index]['appName'] = i.appName;
                }
              });
              return res.data.data.paramsList[index];
            });
          };
          this.totalItems = res.data.data.total;
          this.queryPageLength = res.data.data.totalPages;
        }
      });
    },
    // 改变页数
    pageChange (item, p) {
      this.perPageNums = p;
      let queryDa = {
        page: this.pageNum,
        pageSize: this.perPageNums,
        begainTime: '',
        endTime: '',
        appId: item.appId,
        modelName: item.modelName
      };
      this.mlModelsList(queryDa);
    },
    onPageChange (item, page) {
      this.currentPage = page;
      let queryDa = {
        page: this.pageNum,
        pageSize: this.perPageNums,
        begainTime: '',
        endTime: '',
        appId: item.appId,
        modelName: item.modelName
      };
      this.mlModelsList(queryDa);
    },
    // 添加模型结果-点击查询
    searchAddModel (item) {
      // console.log(item, 'model');
      if (this.dateRangeText === '') {
        return;
      };
      let queryDa = {
        page: 1,
        pageSize: 10,
        begainTime: this.dateRangeText.split(' 至 ')[0] + ' 00:00:00',
        endTime: this.dateRangeText.split(' 至 ')[1] + ' 23:59:59',
        appId: item.appId,
        modelName: item.modelName
      };
      this.mlModelsList(queryDa);
      this.perPageNums = 10;
    },
    // 添加模型结果点击重置条件
    resetAddModel (item) {
      this.searchForm.dates = [];
      this.selectedTasks = [];
      this.pageNum = 1;
      this.perPageNums = 10;
      let queryDa = {
        page: this.pageNum,
        pageSize: this.perPageNums,
        appId: item.appId,
        modelName: item.modelName
      };
      this.mlModelsList(queryDa);
    },
    // 查看选中模型并继续筛选结果
    viewTheResults (i, j, x) {
      if (this.selectedTasks.length === 0) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请勾选模型';
        this.snackbarServeColor = 'error';
        return;
      };
      this.headerApplicationName = this.selectedTasks[0].appName;
      this.headerModelName = this.selectedTasks[0].modelName;
      this.headerRunTime = this.selectedTasks[0].runTime;
      let parms = {
        modelName: i,
        appName: j
      };
      nodeByAppAndModel(parms).then(res => {
        if (res.data.code === 200) {
          // this.nodeTypeAry = res.data.data;
          // this.nodeType = res.data.data[0].paramName;
          let nodesType = '';
          if (this.nodeType === '设备指纹') {
            nodesType = 'dev_fp';
          } else if (this.nodeType === 'IP') {
            nodesType = 'ip';
          } else if (this.nodeType === '账号') {
            nodesType = 'user_id';
          } else if (this.nodeType === '商户号') {
            nodesType = 'merchant_no';
          }
          let query = {
            nodeType: nodesType,
            modelInstanceId: this.selectedTasks[0].modelInstanceId,
            appId: x,
            page: this.pagesNum,
            pageSize: this.perPagesNum
          };
          this.mlModesRestList(query);
        }
      });
      this.isDisplayTable = 'detail';
    },
    // -改变页数
    pagesChange (p) {
      this.perPagesNum = p;
      let nodesType = '';
      if (this.nodeType === '设备指纹') {
        nodesType = 'dev_fp';
      } else if (this.nodeType === 'IP') {
        nodesType = 'ip';
      } else if (this.nodeType === '账号') {
        nodesType = 'user_id';
      } else if (this.nodeType === '商户号') {
        nodesType = 'merchant_no';
      }
      let query = {
        nodeType: nodesType,
        modelInstanceId: this.selectedTasks[0].modelInstanceId,
        appId: this.manualResult.appId,
        page: this.pagesNum,
        pageSize: this.perPagesNum
      };
      this.mlModesRestList(query);
    },
    onPagesChange (page) {
      this.currentPage = page;
      let nodesType = '';
      if (this.nodeType === '设备指纹') {
        nodesType = 'dev_fp';
      } else if (this.nodeType === 'IP') {
        nodesType = 'ip';
      } else if (this.nodeType === '账号') {
        nodesType = 'user_id';
      } else if (this.nodeType === '商户号') {
        nodesType = 'merchant_no';
      }
      let query = {
        nodeType: nodesType,
        modelInstanceId: this.selectedTasks[0].modelInstanceId,
        appId: this.manualResult.appId,
        page: this.pagesNum,
        pageSize: this.perPagesNum
      };
      this.mlModesRestList(query);
    },
    // 请求添加模型结果table
    mlModesRestList (query) {
      this.loadingt = true;
      mlModeRestList(query).then(res => {
        if (res.data.code === 200) {
          // this.collectiondatas = res.data.data.paramsList;
          this.collectiondatas = res.data.data.paramsList.map((item, index) => {
            item['num'] = index;
            return item;
          });
          this.totalsItem = res.data.data.total;
          this.queryPagesLength = res.data.data.totalPages;
          this.loadingt = false;
        }
      });
    },
    // 查看选中结果上一页
    thePageDetail () {
      this.isDisplayTable = 'model';
      this.selectTask = [];
      this.selectedTad = [];
    },
    // 查看选中结果集合详情
    viewTheDetail () {
      if (this.selectTask.length === 0) return;
      this.isDisplayTable = 'list';
      this.entitysTypeTotal = this.selectTask[0].results_nums;
      this.showEntitysList({ entityLists: this.selectTask[0].results_set });
    },
    // 请求展示实体列表table
    showEntitysList (query) {
      this.loadingsd = true;
      showEntityList(query).then(res => {
        if (res.data.code === 200) {
          let que = res.data.data.map(listItem => {
            if (listItem.backListState === false) {
              listItem.backListState = '否';
            } else {
              listItem.backListState = '是';
            }
            return listItem;
          });
          this.displayListdatas = que;
          this.loadingsd = false;
        }
      });
    },
    // 添加到展示列表
    viewTheList (item, i) {
      if (this.selectedTad.length === 0) return;
      this.operationDialog = false;
      let arrAry = [...this.expansionAry[i].entityLists, ...this.selectedTad];
      let objAry = [];
      arrAry.forEach(it => {
        objAry.push(it.entity);
      });
      let query = [{ id: item.id, entityList: objAry.join(',') }];
      let param = {
        entityLists: JSON.stringify(query)
      };
      this.editNameCard = item.id;
      allCardSave(param).then(res => {
        if (res.data.code === 200) {
          this.addOperation = '';
          this.selectedTasks = [];
          this.resultdatas = [];
          this.selectTask = [];
          this.selectedTad = [];
          // this.getCardList();
          this.getCardOList();
        };
      });
    },
    // 黑名单弹窗---取消事件
    cancelBlackDialog () {
      this.isShowBlackList = false;
      this.$refs.addTemplaterAry.reset();
      this.currentItem.batchOperation = '';
      this.currentItem.blackList = [];
    },
    // 加入黑名单-确定按钮
    async mistakeDialog () {
      let oinvalidTime = '';
      let datetime = 0;
      if (this.addTemplaterAry.oinvalidTime) {
        oinvalidTime = new Date(this.addTemplaterAry.oinvalidTime);
        datetime = oinvalidTime.getFullYear() + '-' + (oinvalidTime.getMonth() + 1) + '-' + oinvalidTime.getDate() + ' ' + oinvalidTime.getHours() + ':' + oinvalidTime.getMinutes() + ':' + oinvalidTime.getSeconds();
      }
      try {
        let blackName = '';
        this.currentItem.blackList.forEach(blackItem => {
          if (blackName) {
            blackName = blackName + ',' + blackItem.entity;
          } else {
            blackName = blackItem.entity;
          }
        });
        let pam = {
          listId: this.addTemplaterAry.blackName,
          listType: 'BLACK_LIST',
          listValue: blackName,
          expireTime: datetime === 0 ? '' : datetime + ''
        };
        const res = await mlBatchAddBlack(pam);
        if (res.data.code === 200) {
          this.isShowBlackList = false;
          this.currentItem.batchOperation = '';
          this.currentItem.blackList = [];
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.$refs.addTemplaterAry.reset();
          // this.getCardList();
          this.getCardOList();
        } else {
          this.isShowBlackList = false;
          this.currentItem.batchOperation = '';
          this.currentItem.blackList = [];
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
          this.$refs.addTemplaterAry.reset();
        }
      } catch (err) {
        this.isShowBlackList = false;
        this.currentItem.batchOperation = '';
        this.currentItem.blackList = [];
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
        this.$refs.addTemplaterAry.reset();
      }
    },
    // 删除移除黑名单
    async bathDelEntityLists () {
      try {
        const res = await bathDelEntityList(this.delEntityListspam);
        if (res.data.code === 200) {
          this.currentItem.batchOperation = '';
          this.currentItem.blackList = [];
          this.isDialogShows = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          // this.getCardList();
          this.getCardOList();
        } else {
          this.currentItem.batchOperation = '';
          this.currentItem.blackList = [];
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.currentItem.batchOperation = '';
        this.currentItem.blackList = [];
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    //
    cancelDelList () {
      this.isDialogShows = false;
      this.currentItem.batchOperation = '';
      this.currentItem.blackList = [];
    },
    // 加入或移除黑名单change
    async batchOperationEvent (item, i) {
      this.entitySelectType = item.entityType || '';
      this.manualResult = item;
      this.manualIndex = i;
      this.editNameCard = item.id;
      if (item.batchOperation === '加入黑名单' && item.blackList.length > 0) { // 加入黑名单
        this.isShowBlackList = true;
        this.currentItem = item;
      } else if (item.batchOperation === '清除' && item.blackList.length > 0) { // 清除
        this.currentItem = item;
        this.isDialogShows = true;
        let blackName = '';
        item.blackList.forEach(blackItem => {
          if (blackName) {
            blackName = blackName + ',' + blackItem.entity;
          } else {
            blackName = blackItem.entity;
          }
        });
        let pam = {
          id: item.id,
          entityList: blackName
        };
        this.customDelTitles = '即将移除：' + blackName;
        this.delEntityListspam = pam;
      } else if (item.batchOperation === '移出黑名单' && item.blackList.length > 0) { // 移除黑名单
        this.currentItem = item;
        try {
          let blackName = '';
          item.blackList.forEach(blackItem => {
            if (blackName) {
              blackName = blackName + ',' + blackItem.entity;
            } else {
              blackName = blackItem.entity;
            }
          });
          let pam = {
            listValues: blackName
          };
          const res = await mlBatchDelBlack(pam);
          if (res.data.code === 200) {
            this.currentItem.batchOperation = '';
            this.currentItem.blackList = [];
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
            // this.getCardList();
            this.getCardOList();
          } else {
            this.currentItem.batchOperation = '';
            this.currentItem.blackList = [];
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        } catch (err) {
          this.currentItem.batchOperation = '';
          this.currentItem.blackList = [];
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        }
      }
    },
    // 应用名称change
    async appNameChange (appName) {
      let params = {
        appId: appName,
        businessVar: this.entitySelectType
      };
      try {
        const res = await getBlackName(params);
        if (res.data.code === 200) {
          if (res.data.data.length > 0) {
            this.blackNameAry = res.data.data;
          } else {
            this.blackNameAry = [];
          }
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
    // 卡片内的多选框勾选事件
    selectInput (data) {
      this.$nextTick(() => {
        if (data.blackList.length > 0) {
          data.isBlackSelect = true;
        } else {
          data.isBlackSelect = false;
        }
      });
    },
    // 查看展示列表下一页
    thePageList () {
      this.isDisplayTable = 'detail';
      this.selectedTad = [];
    },
    //
    // 弹出选择时间输入框的点击事件
    dateInputClick () {
      this.ifdateShow = true;
    }
  }
};
</script>
<style lang="stylus" scoped>
.cardStyle
  margin-top 16px
  // overflow-x: auto;
  // padding-top: 16px;
  background-color #fff
.ruleSetAddOrEdit >>> .v-input__control
  height auto !important
.ruleSetAddOrEdit .col
  padding 0 !important
#demo1 >>> .w-e-toolbar
  display none
.home
  width 1200px
  margin auto
  position relative
  h3
    margin 30px 0 15px
.textBold
  font-weight bold
.no-data-box
  width 100%
  height 500px
  background rgb(255, 255, 255)
  display flex
  justify-content center
  align-items center
.col, .col-4
  width 100%
  padding 0px
.v-expansion-panel-content__wrap
  padding-left 0px
>>>.v-expansion-panel-content__wrap
  padding 0 13px 16px
  -webkit-box-flex 1
  -ms-flex 1 1 auto
  flex 1 1 auto
  max-width 100%
.expansionBordre
  border-bottom 1px solid #DDDEE2
  height 47px
  font-size 14px
  font-weight bold
  padding-left 22px
.elevation-1
  box-shadow none
.blackListTableStyle
  margin-top 10px
  height 308px
  overflow-y auto
  box-shadow none !important
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
