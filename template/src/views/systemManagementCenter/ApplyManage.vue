<template>
  <div class="enu-content fill-height">
    <!-- 搜索表单 -->
    <base-search @change="panelCounter">
      <template v-slot>
        <!-- 条件查询form -->
        <slot>
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
                    placeholder="应用名称："
                    :rules="[v => v.length <= 50 || NO_EMPTY_SPACE_ALLOWED]"
                    v-model="form.appName"
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
                    placeholder="应用标识："
                    :rules="[v => v.length <= 64 || NO_EMPTY_SPACE_ALLOWED]"
                    v-model="form.appTag"
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
                    placeholder="企业名称："
                    v-model="form.compName"
                    :items="firmNameItems"
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
                  <v-text-field
                    placeholder="应用根密钥："
                    v-model="form.key"
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
                    placeholder="应用类型："
                    v-model="form.appType"
                    :items="applyTypeItems"
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
                >
                  <v-text-field outlined dense v-model="form.updates" append-icon="event" placeholder="更新时间：" @click="updateInputClick"></v-text-field>
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
                    small
                    color="primary"
                    @click="searchTable"
                    :disabled="!searchValid"
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
                    <v-date-picker selected-items-text="已选择日期" v-model="form.dates" range  @change="dateChange(form.dates)"></v-date-picker>
                  </v-dialog>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="2"
                  xl="2"
                >
                  <v-dialog v-model="isUpdateShow" width="321">
                    <v-date-picker selected-items-text="已选择日期" v-model="form.updates" range  @change="updateChange(form.updates)"></v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </slot>
      </template>
    </base-search>
    <v-row>
      <v-col :cols='12' class="pb-0">
        <v-card class="elevation-3">
          <v-data-table
            :headers="constHeader"
            :items="constItem"
            :items-per-page="perPageNum"
            hide-default-footer
            :search="search"
            :loading = "loading"
            loading-text="正在加载中..."
            no-results-text="没有匹配的数据"
            :height="tableHeight"
            :fixed-header="true"
          >
            <!-- 列表头 -->
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title style="font-size:18px">
                  应用管理数据
                </v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer></v-spacer>
                <v-card-title>
                  <v-btn
                    color="primary"
                     v-if="hasPermission(addAppBtn)"
                    @click="tog()"
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
                  :title="`${item.appName}`"
                  class="el-border-defu"
                >
                  {{ item.appName }}
                </td>
                <td
                  :title="`${item.appTag}`"
                  class="el-border-defu"
                >
                  {{ item.appTag }}
                </td>
                <td
                  :title="`${item.spid}` | firmNameFilter(applyNameDataCopy)"
                  class="el-border-defu"
                >
                  {{ item.spid | firmNameFilter(applyNameDataCopy) }}
                </td>
                <td
                  :title="`${item.key}`"
                  class="el-border-defu"
                >
                  {{ item.key }}
                </td>
                <td
                  :title="`${item.keyVersion}`"
                  class="el-border-defu"
                >
                  {{ item.keyVersion }}
                </td>
                <td
                  :title="`${item.appType}` | constantDataType(selectData)"
                  class="el-border-defu"
                >
                  {{ item.appType | constantDataType(selectData) }}
                </td>
                <td
                  class="el-border-defu"
                >
                  <v-switch
                    v-if="hasPermission(statesButton)"
                    v-model="item.states"
                    color="primary"
                    @change="isStat(item,index)"
                  />
                  <v-switch
                    v-else
                    v-model="item.states"
                    disabled
                    color="primary"
                    @change="isStat(item,index)"
                  />
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
                <td class="el-border-defu">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-1 icon-primary"
                        v-on="on"
                        color="primary"
                        v-if="hasPermission(updateKeyBtn)"
                        @click="updateKey(item, index)"
                      >
                        mdi-key-outline
                      </v-icon>
                    </template>
                    <span>更新根密钥</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-1 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="editParms(item, index)"
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
                        v-if="hasPermission(deleteAppBtn)"
                        @click="deleteParms(item)"
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
        </v-card>
      </v-col>
    </v-row>

    <!-- 添加应用管理 -->
    <del-dialog :isDialogShow='dialogDel' :debugModeClueCode ="debugModeClueCode" @cancelDel='constantDelCancle($event)' @confimDel='deleteEnum($event)'></del-dialog>
    <!-- 添加弹框 -->
    <v-dialog
      v-model="crudFormDialog"
      persistent
      scrollable
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <!-- 新建模式 -->
          <v-toolbar-title v-if="formHeader.isEdit === false">
            添加应用
            <!-- 新建 -->
          </v-toolbar-title>
          <!-- 查看模式 -->
          <v-toolbar-title v-else-if="formHeader.isEdit === true && isEditMode === false">
            查看应用
            <!-- 详情 -->
          </v-toolbar-title>
          <!-- 编辑模式 -->
          <v-toolbar-title v-else>
            编辑应用
            <!-- 编辑 -->
          </v-toolbar-title>
        <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="cancelCrudFormDialog"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
          <v-divider></v-divider>
        <v-card-text style="max-height: 600px;">
          <v-container>
            <slot>
              <!-- 编辑模式 -->
              <div v-if="formHeader.isEdit">
                <v-row>
                  <v-col cols="3"></v-col>
                  <v-col cols="7" justify-left>
                   <v-switch v-model="isEditMode" v-if="hasPermission(editAppBtn)" @change="switchChange" inset dense label="启用编辑">
                   </v-switch>
                  </v-col>
                </v-row>
                <v-form
                  ref="editTemplaterAry"
                  :lazy-validation="lazy"
                  v-model="valid"
                  class="form"
                  :key="newDate"
                >
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">应用名称*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        v-if="isEditMode && isreferenceRecord"
                        required
                        v-model.trim="editTemplaterAry.appName"
                        solo
                        flat
                        dense
                        disabled
                      />
                      <v-text-field
                        v-else-if="isEditMode && !isreferenceRecord"
                        required
                        :counter="50"
                        :rules="appNameRules"
                        v-model.trim="editTemplaterAry.appName"
                        outlined
                        dense
                        :disabled="!isEditMode"
                      />
                      <v-text-field
                        v-else
                        required
                        v-model.trim="editTemplaterAry.appName"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">应用标识*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        v-if="isEditMode && isreferenceRecord"
                        required
                        v-model.trim="editTemplaterAry.appTag"
                        solo
                        flat
                        dense
                        disabled
                      />
                      <v-text-field
                        v-else-if="isEditMode && !isreferenceRecord"
                        required
                        :counter="64"
                        :rules="[
                          v => !!v || '应用标识不能为空',
                          v => v && v.length <= 64 || '最多只能输入64个字符',
                          v => /^[0-9a-zA-Z_.]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线、点，及其组合'
                        ]"
                        v-model.trim="editTemplaterAry.appTag"
                        outlined
                        dense
                      />
                      <v-text-field
                        v-else
                        required
                        v-model.trim="editTemplaterAry.appTag"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">企业名称*：</div>
                    </v-col>
                    <v-col cols="8">
                      <!-- 增加有引用记录的编辑===>isreferenceRecord -->
                      <v-select
                        v-if="this.applyNameDataCopy.length > 1 && isEditMode && isreferenceRecord"
                        v-model="editTemplaterAry.compName"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="applyNameDataCopy"
                        required
                        :rules="[v => !!v || '企业名称不能为空']"
                        solo
                        flat
                        dense
                        no-data-text="没有匹配数据"
                        :disabled="isEditMode"
                        class="isEditDropdown"
                      />
                      <v-select
                        v-if="this.applyNameDataCopy.length > 1 && isEditMode && !isreferenceRecord"
                        v-model="editTemplaterAry.compName"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="applyNameDataCopy"
                        required
                        :rules="[v => !!v || '企业名称不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                      />
                      <v-select
                        v-else-if="this.applyNameDataCopy.length > 1 && !isEditMode"
                        v-model="editTemplaterAry.compName"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="applyNameDataCopy"
                        required
                        :rules="[v => !!v || '企业名称不能为空']"
                        solo
                        flat
                        dense
                        no-data-text="没有匹配数据"
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                      />
                      <v-text-field
                        v-else-if="this.applyNameDataCopy.length === 1 && isEditMode"
                        required
                        :rules="[v => !!v || '企业名称不能为空']"
                        v-model.trim="editTemplaterAry.compName"
                        disabled
                        solo
                        flat
                        dense
                        class="isEditDropdown"
                      />
                      <v-text-field
                        v-else-if="this.applyNameDataCopy.length === 1 && !isEditMode"
                        required
                        :rules="[v => !!v || '企业名称不能为空']"
                        v-model.trim="editTemplaterAry.compName"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                        class="isEditDropdown"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3">
                      <div class="mt-2">应用类型*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="isEditMode && isreferenceRecord"
                        v-model="editTemplaterAry.appType"
                        item-text="text"
                        item-value="value"
                        :items="applyTypeItemsCopy"
                        required
                        :rules="[v => !!v || '应用类型不能为空']"
                        solo
                        flat
                        dense
                        disabled
                        class="isEditDropdown"
                        no-data-text="没有匹配数据"
                      />
                      <v-select
                        v-else-if="isEditMode && !isreferenceRecord"
                        v-model="editTemplaterAry.appType"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="applyTypeItemsCopy"
                        required
                        :rules="[v => !!v || '应用类型不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                      />
                      <v-select
                        v-else
                        v-model="editTemplaterAry.appType"
                        item-text="text"
                        item-value="value"
                        :items="applyTypeItemsCopy"
                        required
                        :rules="[v => !!v || '应用类型不能为空']"
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
                      <div class="mt-2">交易类型*：</div>
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        class="ruleSetAddOrEdit"
                        v-if="isEditMode"
                        :menu-props="{ bottom: true }"
                        v-model="editTemplaterAry.tradeType"
                        :items="sysParamsArray"
                        item-text="text"
                        item-value="value"
                        required
                        multiple
                        :rules="[v => v.length > 0 || '交易类型不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="ruleTypeLenght(editTemplaterAry.tradeType, $event)"
                      />
                      <v-select
                        v-else
                        v-model="editTemplaterAry.tradeType"
                        :items="sysParamsArray"
                        item-text="text"
                        item-value="value"
                        required
                        multiple
                        :rules="[v => v.length > 0 || '交易类型不能为空']"
                        solo
                        flat
                        dense
                        :disabled="!isEditMode"
                        class="isEditDropdown ruleSetAddOrEdit"
                        no-data-text="没有匹配数据"
                        @change="ruleTypeLenght(editTemplaterAry.tradeType, $event)"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </div>
              <!-- 新增模式 -->
              <div v-else>
                <v-form
                  ref="addTemplaterAry"
                  :lazy-validation="lazy"
                  v-model="valid"
                  class="form"
                >
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                          label="应用名称*"
                          required
                          :counter="50"
                          :rules="[
                            v => !!v || '应用名称不能为空',
                            v => v && v.length <= 50 || '最多只能输入50个字符',
                            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                          ]"
                          v-model.trim="addTemplaterAry.appName"
                          outlined
                          dense
                        />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                          label="应用标识*"
                          required
                          :counter="64"
                          :rules="[
                            v => !!v || '应用标识不能为空',
                            v => v && v.length <= 64 || '最多只能输入64个字符',
                            v => /^[0-9a-zA-Z_.]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线、点，及其组合111'
                          ]"
                          v-model.trim="addTemplaterAry.appTag"
                          outlined
                          dense
                        />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-if="this.applyNameDataCopy.length > 1"
                        v-model="addTemplaterAry.compName"
                        item-text="text"
                        item-value="value"
                        :items="applyNameDataCopy"
                        :menu-props="{ bottom: true }"
                        label="企业名称*"
                        required
                        :rules="[v => !!v || '企业名称不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                      />
                      <v-text-field
                          v-else
                          label="企业名称*"
                          required
                          :rules="[v => !!v || '企业名称不能为空']"
                          v-model.trim="addTemplaterAry.compName"
                          disabled
                          outlined
                          dense
                        />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        v-model="addTemplaterAry.appType"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="applyTypeItemsCopy"
                        label="应用类型*"
                        required
                        :rules="[v => !!v || '应用类型不能为空']"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                    </v-col>
                    <v-col cols="8">
                      <v-select
                        class="ruleSetAddOrEdit"
                        v-model="addTemplaterAry.tradeType"
                        item-text="text"
                        item-value="value"
                        :menu-props="{ bottom: true }"
                        :items="sysParamsArray"
                        :rules="[v => v.length > 0 || '交易类型不能为空']"
                        label="交易类型*："
                        required
                        multiple
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        @change="ruleTypeLenght(addTemplaterAry.tradeType)"
                      />
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
          <div v-if="formHeader.isEdit === false">
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelCrudFormDialog">取消
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="confimDialogSave"
                :disabled="!valid"
              >
              保存
            </v-btn>
          </div>
          <div v-else-if="formHeader.isEdit === true && isEditMode === true">
            <v-btn
              class="cancelButton mr-4"
              outlined
              @click="cancelCrudFormDialog">取消
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="confimDialogSave"
                :disabled="!valid"
              >
              保存
            </v-btn>
          </div>
          <div v-else>
            <v-btn class="primary mr-4" @click="addOkCrudFormDialog">确定
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 更新密钥弹框 -->
    <v-dialog
      v-model="isUpdateKeyShow"
      persistent
      width="321"
    >
      <v-card class="del-dialog">
        <v-card-title class="del-dialog-title">
          确认更新根密钥？
        </v-card-title>
        <v-card-actions style="margin-right:12px;margin-top:10px;">
          <div class="flex-grow-1" />
          <v-btn
            text
            class="del-dialog-btn"
            @click="cancelDelKey()"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            text
            class="del-dialog-btn"
            @click="confimDelKey()"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  addConstEnume,
  getApplyName,
  getEnumeList,
  updataKey,
  deleteEnum,
  editEnum,
  amendDetails,
  allRemoveRefrecord, // 批量删除引用记录
  allAddRefrecord // 批量添加引用记录
} from '../../api/ApplyManage';
import {
  isReferenceAndDebugMode // 查询应用记录与安全模式或者调试模式
} from '../../api/calclndexBase';
import BaseSearch from '@/components/BaseSearch';
import { getAppListAll } from '../../api/queryHeaderAppList.js';
import { mapGetters, mapActions } from 'vuex';
import { getTrasactionTypeList, isRefrecord } from '../../api/transactionTypeConfig.js'; // 获取交易类型下拉框的数组
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import moment from 'moment';
import { NO_EMPTY_SPACE_ALLOWED, NAME_NOT_NULL, MAX_INPUT_LENGTH, BASE_NAME, BASE_NAME_TEXT } from 'utils/validate';
export default {
  data () {
    return {
      appNameRules: [
        v => !!v || NAME_NOT_NULL('应用名称'),
        // eslint-disable-next-line no-mixed-operators
        v => v && v.length <= 50 || MAX_INPUT_LENGTH(50),
        v => (BASE_NAME.test(v)) || BASE_NAME_TEXT],
      counter: 0,
      fullHeight: window.innerHeight,
      delItem: {},
      loading: true,
      newDate: null,
      // 新增与编辑弹窗
      // 编辑时的item
      editItem: {},
      crudFormDialog: false,
      formHeader: {
        isEdit: false,
        name: ''
      },
      addTemplaterAry: {
        appName: '',
        appTag: '',
        compName: '',
        appType: '',
        tradeType: []
      },
      editTemplaterAry: {
        appName: '',
        appTag: '',
        compName: '',
        appType: '',
        tradeType: []
      },
      // 新增与编辑弹窗
      valid: true,
      lazy: false,
      isEditMode: false,
      isSwitchChange: false,
      baseParams: {},
      dates: [],
      updates: [],
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      isActive: [true],
      search: '',
      search1: '',
      seItem: ['String', 'boolean', 'int', 'double', 'float'],
      constHeader: [
        { text: '应用名称', value: 'appName', sortable: false, width: 100 },
        { text: '应用标识', value: 'appTag', sortable: false, width: 100 },
        { text: '企业名称', value: 'compName', sortable: false, width: 100 },
        { text: '应用根密钥', value: 'key', sortable: false, width: 100 },
        { text: '密钥版本', value: 'keyVersion', sortable: false, width: 100 },
        { text: '应用类型', value: 'appType', sortable: false, width: 100 },
        { text: '状态', value: 'states', sortable: false, width: 100 },
        { text: '创建时间', value: 'createTime', sortable: false, width: 100 },
        { text: '更新时间', value: 'updateTime', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      // 搜索条件
      isdateShow: false,
      isUpdateShow: false,
      form: {
        appName: '',
        appTag: '',
        key: '',
        appType: '',
        compName: '',
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
      // 更新密钥
      isUpdateKeyShow: false,
      applyTypeItemsCopy: [],
      applyTypeItems: [],
      firmNameItems: [],
      // 分页变量
      pageNum: 1,
      queryPageLength: 2,
      perPageNum: 10,
      totalItems: 13,
      perPageItems: [5, 10, 15, 20, 50, 100],
      singleSelect: false,
      constItem: [], // 左侧列表内容
      dialog: false,
      dialogDel: false,
      mflag: 1,
      enumeId: '', // 添加应用管理列表中每一项的??id
      applyNameDataCopy: [],
      selectData: [],
      //  表单，添加
      addOrEditHeader: {
        name: '添加应用管理',
        value: 'add',
        isEdit: true
      },
      addAndEditFormData: [],
      sysParamsArray: [],
      isStatValue: false,
      dateRangeText: [],
      updateRangeText: [],
      // 增加按钮权限
      statesButton: '/conversionAppStatesButton', // 状态开关是否有权限修改
      updateKeyBtn: '/updateAppRootKeyButton', // 更新密钥是否有权限修改
      addAppBtn: '/addAppButton', // 添加按钮是否展示
      editAppBtn: '/editAppButton', // 当编辑按钮展示时，控制baseCreate中的编辑开关
      deleteAppBtn: '/deleteAppButton', // 删除按钮权限
      isreferenceRecord: false, // 引用记录，true为被引用，false为未被引用。
      debugModeClueCode: '', // 调试模式下，删除有引用记录时的提示词
      isReferenceAndDebugMode: ''
    };
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 270;
      }
    },
    isEditDropdown () {
      return {
        'v-input__icon': this.isEditMode ? 'display: none' : '',
        'v-input__icon--append': this.isEditMode ? 'display: none' : ''
      };
    },
    // 创建时间
    createDateValue () {
      return this.form.createTime ? this.form.createTime : '';
    },
    // 修改时间
    reviseDateValue () {
      return this.form.updateTime ? this.form.updateTime : '';
    },
    ...mapGetters([
      'appName',
      'appId',
      'navItems',
      'ruleEditMode', // 0 调试模式 1安全模式，不会在变动
      'appList'
    ])
  },
  // 展示中英文转化
  filters: {
    // 应用类型
    constantDataType: function (str, itemList) {
      let dataTypeText;
      itemList.forEach(item => {
        if (item.appType === str) {
          dataTypeText = item.appTypeName;
        }
      });
      return dataTypeText;
    },
    // 企业名称
    firmNameFilter: function (str, itemList) {
      let dataTypeText;
      itemList.forEach(item => {
        if (item.value === str) {
          dataTypeText = item.compName;
        }
      });
      return dataTypeText;
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  watch: {
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 136;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  created () {
    this.initGetEnumeList();
    this.getTrasactionTypeList();
  },
  components: {
    // DatetimePicker,
    BaseSearch,
    DelDialog
  },
  methods: {
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 添加和编辑弹框
    // 编辑开关
    switchChange (data) {
      this.$forceUpdate();
      let isRefrecordParms = {
        sourceId: this.editItem.id,
        sourceType: ''
      };
      isReferenceAndDebugMode(isRefrecordParms).then(res => {
        // res.data.data.editingMode
        // 1、未引用，调试模式；返回0  编辑和删除按钮都展示
        // 2、未引用，安全模式；返回1  编辑和删除按钮都展示
        // 3、已引用，调试模式；返回2  编辑和删除按钮都展示
        // 4、已引用，安全模式；返回3  只可编辑查看， 但是没有编辑功能， 且不展示删除按钮
        this.$nextTick(() => {
          var myDate = new Date();
          this.newDate = myDate.getTime();
          this.isEditMode = data;
          if (res.data.data.editingMode === 2 && this.isEditMode) {
            this.snackbarServe = true;
            this.timeout = 5000;
            this.snackbarServeMsg = '该应用已经被引用，请谨慎修改。';
            this.snackbarServeColor = 'warning';
          } else if (res.data.data.editingMode === 3 && this.isEditMode) {
            this.snackbarServe = true;
            this.timeout = 5000;
            this.snackbarServeMsg = '应用被引用，只能添加交易类型';
            this.snackbarServeColor = 'warning';
          }
          // if (this.isreferenceRecord && this.isEditMode) {
          //   this.snackbarServe = true;
          //   this.timeout = 5000;
          //   this.snackbarServeMsg = '应用被引用，只能添加交易类型';
          //   this.snackbarServeColor = 'warning';
          // }
        });
      });
    },
    // 添加和编辑弹框----取消和差号按钮
    cancelCrudFormDialog () {
      this.crudFormDialog = false;
      this.isEditMode = false;
      if (this.mflag === 1) {
        this.$refs.addTemplaterAry.reset();
      } else {
        this.$refs.editTemplaterAry.reset();
      };
    },
    addOkCrudFormDialog () {
      this.crudFormDialog = false;
      this.isEditMode = false;
      this.$refs.editTemplaterAry.reset();
    },
    // 交易类型change事件，选择项不能超过200个
    ruleTypeLenght (TransactionTypeArray, e) {
      if (TransactionTypeArray.length > 200) {
        this.valid = false;
        this.snackbarServe = true;
        this.snackbarServeMsg = '交易类型最多不能超过200个';
        this.snackbarServeColor = 'error';
      }
    },
    // 添加和编辑的保存按钮
    confimDialogSave () {
      let compNameData;
      if (this.mflag === 1) {
        if (this.applyNameDataCopy.length === 1) {
          compNameData = this.applyNameDataCopy[0].value;
        } else if (this.applyNameDataCopy.length === 0) {
          compNameData = '';
        } else {
          compNameData = this.addTemplaterAry.compName;
        }
        const parms = {
          appName: this.addTemplaterAry.appName,
          appTag: this.addTemplaterAry.appTag,
          spid: compNameData,
          // spid: this.addTemplaterAry.compName,
          appType: this.addTemplaterAry.appType,
          tradeType: this.addTemplaterAry.tradeType.toString()
        };
        this.$refs.addTemplaterAry.reset();
        this.crudFormDialog = false;
        addConstEnume(parms)
          .then(res => {
            if (res.data.code === 200) {
              this.baseFilterDate(this.form.dates);
              this.baseFilterDate(this.form.updates);
              let params = {
                page: this.pageNum,
                size: this.perPageNum,
                appName: this.form.appName ? this.form.appName : '',
                appTag: this.form.appTag ? this.form.appTag : '',
                spid: this.form.compName ? this.form.compName : '',
                initkey: this.form.key ? this.form.key : '',
                appType: this.form.appType ? this.form.appType : '',
                createTimeStart: this.form.dates.length === 2 ? this.form.dates[0] : '',
                createTimeEnd: this.form.dates.length === 2 ? this.form.dates[1] : '',
                updateTimeStart: this.form.updates.length === 2 ? this.form.updates[0] : '',
                updateTimeEnd: this.form.updates.length === 2 ? this.form.updates[1] : ''
              };
              getEnumeList(params)
                .then(res => {
                  if (res.data.code === 200) {
                    // 调用批量添加引用记录
                    let allAddRefrecordAry = {
                      sourceId: res.data.data.records[0].tradeType,
                      targetId: res.data.data.records[0].id
                    };
                    let allAddParams = {
                      jsonStr: JSON.stringify(allAddRefrecordAry)
                    };
                    allAddRefrecord(allAddParams).then(res => {
                      if (res.data.code !== 200) {
                        this.snackbarServe = true;
                        this.snackbarServeMsg = res.data.msg;
                        this.snackbarServeColor = 'error';
                      }
                    });
                    // 把新添加的第一项中，选择的所有交易类型的id拼成jsonString格式
                    this.constItem = res.data.data.records;
                    this.constItem.forEach((item, index, ary) => {
                      if (item.states === '1') {
                        item.states = true;
                      } else {
                        item.states = false;
                      }
                    });
                    this.totalItems = res.data.data.total;
                    this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
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
              this.getAppListAll();
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
            this.snackbarServeMsg = err.data.msg;
            this.snackbarServeColor = 'error';
          });
      } else {
        if (this.applyNameDataCopy.length === 1) {
          compNameData = this.applyNameDataCopy[0].value;
        } else if (this.applyNameDataCopy.length === 0) {
          compNameData = '';
        } else {
          compNameData = this.editTemplaterAry.compName;
        }
        const parms = {
          id: this.enumeId,
          appName: this.editTemplaterAry.appName,
          appTag: this.editTemplaterAry.appTag,
          spid: compNameData,
          appType: this.editTemplaterAry.appType,
          tradeType: this.editTemplaterAry.tradeType.toString()
        };
        this.$refs.editTemplaterAry.reset();
        this.crudFormDialog = false;
        editEnum(parms)
          .then(res => {
            if (res.data.code === 200) {
              // 调用批量删除引用记录-开始点
              let allAddRefrecordAry = {
                sourceId: this.editItem.tradeType,
                targetId: this.editItem.id
              };
              let allAddParams = {
                jsonStr: JSON.stringify(allAddRefrecordAry)
              };
              allRemoveRefrecord(allAddParams).then(res => {
                if (res.data.code === 200) {
                  // 调用批量添加引用记录-开始点
                  let allAddRefrecordAry = {
                    sourceId: parms.tradeType,
                    targetId: parms.id
                  };
                  let allAddParams = {
                    jsonStr: JSON.stringify(allAddRefrecordAry)
                  };
                  allAddRefrecord(allAddParams).then(res => {
                    if (res.data.code !== 200) {
                      this.snackbarServe = true;
                      this.snackbarServeMsg = res.data.msg;
                      this.snackbarServeColor = 'error';
                    }
                  });
                  // 调用批量添加引用记录-结束点
                }
              });
              // 调用批量删除引用记录-开始点
              // 保存成功后，获取新列表
              this.getEnumeList();
              this.snackbarServe = true;
              this.snackbarServeMsg = res.data.msg;
              this.snackbarServeColor = 'success';
            }
          },
          err => {
            this.snackbarServe = true;
            this.snackbarServeMsg = err.msg;
            this.snackbarServeColor = 'error';
          });
      }
      this.isEditMode = false;
    },
    async getAppListAll () { // 点击获取应用列表数据
      let { data } = await getAppListAll();
      if (data.code === 200) {
        this.setAppList(data.data.appList);
      }
    },
    ...mapActions([
      'setAppList'
    ]),
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
    // 列表中禁用状态事件
    isStat (item, index) {
      this.enumeId = item.id;
      const parms = {
        id: this.enumeId,
        states: item.states ? 1 : 0
      };
      amendDetails(parms).then(res => {
        if (res.data.code === 200) {
          // this.getEnumeList();
          // this.__mInit();
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.loading = false;
          this.isSwitchChange = false;
          this.getEnumeList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
          this.loading = true;
          this.isSwitchChange = false;
          this.getEnumeList();
        }
      },
      err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
        this.isSwitchChange = false;
      });
    },
    // 重置条件
    reset () {
      this.form = { // 重置查询表单内容
        appName: '',
        appTag: '',
        key: '',
        appType: '',
        compName: '',
        dates: [],
        updates: []
      };
      this.pageNum = 1; // 默认从第一页开始查询
      this.getEnumeList();
    },
    // 查询
    searchTable () {
      this.pageNum = 1;
      this.getEnumeList();
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.getEnumeList();
    },
    // 页数
    pageChange () {
      this.pageNum = 1;
      this.getEnumeList();
    },
    // 添加应用管理--按钮
    tog () {
      this.mflag = 1;
      // this.$refs.addTemplaterAry.resetValidation(); // 清空表单报错
      this.sysParamsArray.forEach((im, ix, ay) => {
        im.disabled = false;
      });
      this.crudFormDialog = !this.crudFormDialog;
      this.formHeader.isEdit = false;
      if (this.applyNameDataCopy.length > 1) {
        this.applyNameDataCopy.forEach((item, index, ary) => {
          if (index === 0) {
            this.addTemplaterAry.compName = item.value;
          }
        });
      } else if (this.applyNameDataCopy.length === 1) {
        this.addTemplaterAry.compName = this.applyNameDataCopy[0].text;
      } else {
        this.addTemplaterAry.compName = '';
      }
    },
    // 添加应用管理---编辑弹窗
    editParms (item, index) {
      let isRefrecordParms = {
        sourceId: item.id,
        sourceType: ''
      };
      isReferenceAndDebugMode(isRefrecordParms).then(res => {
        if (res.data.code === 200) {
          let tradeTypeCopy = item.tradeType.split(',');
          if (res.data.data.editingMode === 2) {
            this.isReferenceAndDebugMode = true;
            this.isreferenceRecord = false;
          } else if (res.data.data.editingMode === 3) {
            this.isReferenceAndDebugMode = false;
            this.isreferenceRecord = true;
            this.sysParamsArray.forEach((im, ix, ay) => {
              for (let i = 0; i < tradeTypeCopy.length; i++) {
                if (im.value === tradeTypeCopy[i]) {
                  ay[ix].disabled = true;
                  break;
                } else {
                  ay[ix].disabled = false;
                }
              }
            });
          } else if (res.data.data.editingMode === 1 || res.data.data.editingMode === 0) {
            this.isReferenceAndDebugMode = false;
            this.isreferenceRecord = false;
          }
          let spidData = '';
          this.mflag = 2;
          this.editItem = item;
          if (this.applyNameDataCopy.length > 1) {
            spidData = item.spid;
          } else if (this.applyNameDataCopy.length === 1) {
            spidData = this.applyNameDataCopy[0].text;
          } else {
            spidData = '';
          }
          this.enumeId = item.id;
          this.crudFormDialog = true;
          this.formHeader.isEdit = true;
          this.$nextTick(() => {
            this.editTemplaterAry.appName = item.appName;
            this.editTemplaterAry.appTag = item.appTag;
            this.editTemplaterAry.appType = item.appType;
            this.editTemplaterAry.compName = spidData;
            this.editTemplaterAry.tradeType = tradeTypeCopy;
            this.$forceUpdate();
          });
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 添加应用管理--- 删除按钮
    deleteParms (items) {
      let isRefrecordParms = {
        sourceId: items.id,
        sourceType: ''
      };
      isReferenceAndDebugMode(isRefrecordParms).then(res => {
        // res.data.data.editingMode
        // 1、未引用，调试模式；返回0  编辑和删除按钮都展示
        // 2、未引用，安全模式；返回1  编辑和删除按钮都展示
        // 3、已引用，调试模式；返回2  编辑和删除按钮都展示
        // 4、已引用，安全模式；返回3  只可编辑查看， 但是没有编辑功能， 且不展示删除按钮
        if (res.data.code === 200) {
          if (res.data.data.editingMode === 2) {
            this.snackbarServe = true;
            this.timeout = 5000;
            this.snackbarServeMsg = '该应用已经被引用，请谨慎删除。';
            this.snackbarServeColor = 'warning';
            this.debugModeClueCode = '该应用已经被引用，您确定要删除此行？';
            this.dialogDel = true;
            this.enumeId = items.id;
            this.delItem = items;
          } else if (res.data.data.editingMode === 3) {
            this.snackbarServe = true;
            this.snackbarServeMsg = '应用被引用，不能删除！';
            this.snackbarServeColor = 'error';
            this.dialogDel = false;
          } else {
            this.dialogDel = true;
            this.enumeId = items.id;
            this.delItem = items;
          }
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
      // let isRefrecordParms = {
      //   sourceId: item.id,
      //   sourceType: ''
      // };
      // isRefrecord(isRefrecordParms).then(res => {
      //   if (res.data.code === 200) {
      //     if (res.data.data.isReference && this.ruleEditMode.info === '0') {
      //       this.snackbarServe = true;
      //       this.timeout = 5000;
      //       this.snackbarServeMsg = '该应用已经被引用，请谨慎删除。';
      //       this.snackbarServeColor = 'warning';
      //       this.debugModeClueCode = '该应用已经被引用，您确定要删除此行？';
      //       this.dialogDel = true;
      //       this.enumeId = item.id;
      //       this.delItem = item;
      //     } else if (res.data.data.isReference && this.ruleEditMode.info === '1') {
      //       this.snackbarServe = true;
      //       this.snackbarServeMsg = '应用被引用，不能删除！';
      //       this.snackbarServeColor = 'error';
      //       this.dialogDel = false;
      //     } else {
      //       this.dialogDel = true;
      //       this.enumeId = item.id;
      //       this.delItem = item;
      //     }
      //   }
      // });
    },
    // 添加应用管理---删除确定---按钮
    deleteEnum (paramsData) {
      if (!this.enumeId) return;
      const parms = {
        id: this.enumeId
      };
      deleteEnum(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.dialogDel = false;
            this.debugModeClueCode = '';
            // 调用批量删除引用记录-开始点
            let allAddRefrecordAry = {
              sourceId: this.delItem.tradeType,
              targetId: this.delItem.id
            };
            let allAddParams = {
              jsonStr: JSON.stringify(allAddRefrecordAry)
            };
            allRemoveRefrecord(allAddParams).then(res => {
              if (res.data.code !== 200) {
                this.snackbarServe = true;
                this.snackbarServeMsg = res.data.msg;
                this.snackbarServeColor = 'error';
              }
            });
            this.getEnumeList();
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'success';
          } else {
            this.debugModeClueCode = '';
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        },
        err => {
          this.debugModeClueCode = '';
          this.snackbarServe = true;
          this.snackbarServeMsg = err.data.msg;
          this.snackbarServeColor = 'error';
        });
    },
    // 添加应用管理---删除取消--按钮
    constantDelCancle (paramsData) {
      this.debugModeClueCode = '';
      this.dialogDel = false;
    },
    // 添加应用管理---更新密钥--按钮
    updateKey (item, index) {
      this.isUpdateKeyShow = true;
      this.enumeId = item.id;
    },
    // 添加应用管理---更新密钥---删除确定--按钮
    confimDelKey () {
      const parms = {
        appId: this.enumeId
      };
      this.dialog = false;
      updataKey(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.__mInit();
            this.getEnumeList();
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
      this.isUpdateKeyShow = false;
      this.snackbarServe = true;
      this.snackbarServeMsg = '更新密钥成功';
      this.snackbarServeColor = 'success';
    },
    // 添加应用管理---更新密钥---删除取消--按钮
    cancelDelKey () {
      this.isUpdateKeyShow = false;
    },
    // 初始化常量弹框
    // __mInit () {
    //   this.dialog = false;
    //   this.$refs.m_form.reset();
    //   this.$refs.m_form.resetValidation();
    // },
    // creade 事件
    initGetEnumeList () {
      // 获取企业名称和应用类型
      getApplyName()
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.types.length > 0) {
              res.data.data.types.forEach((item, index, ary) => {
                item.text = item.appTypeName;
                item.value = item.appType;
              });
              this.applyTypeItems = res.data.data.types;
              // 此 applyTypeItemsCopy 变量是用在添加和编辑弹窗的下拉框中
              this.applyTypeItemsCopy = JSON.parse(JSON.stringify(res.data.data.types));
              this.applyTypeItems.unshift({ text: '全部应用类型', value: '' });
              this.selectData = this.applyTypeItems;
            } else {
              this.applyTypeItems = [];
              this.applyTypeItemsCopy = [];
              this.selectData = [];
            }

            // 企业名称
            if (res.data.data.companys.length > 0) {
              res.data.data.companys.forEach((item, index, ary) => {
                item.text = item.compName;
                item.value = item.id;
              });
              this.firmNameItems = res.data.data.companys;
              // 此 applyNameDataCopy 变量是用在添加和编辑弹窗的下拉框中
              this.applyNameDataCopy = JSON.parse(JSON.stringify(res.data.data.companys));
              this.firmNameItems.unshift({ text: '全部企业', value: '' });
            } else {
              this.applyNameDataCopy = [];
              this.firmNameItems = [];
            }
            this.loading = false;
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
      this.getEnumeList();
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
    // 获取列表的值
    getEnumeList () {
      this.baseFilterDate(this.form.dates);
      this.baseFilterDate(this.form.updates);
      let params = {
        page: this.pageNum,
        size: this.perPageNum,
        appName: this.form.appName ? this.form.appName : '',
        appTag: this.form.appTag ? this.form.appTag : '',
        spid: this.form.compName ? this.form.compName : '',
        initkey: this.form.key ? this.form.key : '',
        appType: this.form.appType ? this.form.appType : '',
        createTimeStart: this.form.dates.length === 2 ? this.form.dates[0] : '',
        createTimeEnd: this.form.dates.length === 2 ? this.form.dates[1] : '',
        updateTimeStart: this.form.updates.length === 2 ? this.form.updates[0] : '',
        updateTimeEnd: this.form.updates.length === 2 ? this.form.updates[1] : ''
      };
      getEnumeList(params)
        .then(res => {
          if (res.data.code === 200) {
            this.constItem = res.data.data.records;
            this.constItem.forEach((item, index, ary) => {
              if (item.states === '1') {
                item.states = true;
              } else {
                item.states = false;
              }
            });
            this.totalItems = res.data.data.total;
            this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
            this.getAppListAll();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        },
        err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.message;
          this.snackbarServeColor = 'error';
        });
    },
    // 获取交易类型select数组
    getTrasactionTypeList () {
      let pageParms = {
        tradeName: '',
        identifier: '',
        isAmount: ''
      };
      getTrasactionTypeList(pageParms)
        .then(res => {
          if (res.data.code === 200) {
            // 交易类型
            if (res.data.data.length > 0) {
              this.sysParamsArray = res.data.data;
              this.sysParamsArray.forEach((item, index, ary) => {
                item.text = item.tradeName;
                item.value = item.id;
                item.disabled = false;
              });
            } else {
              this.sysParamsArray = [];
            }
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        })
        .catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
        });
    }
  }
};
</script>
<style lang="stylus" scoped>
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
.isEditDropdown >>> .v-select__slot .v-input__append-inner {
  display: none !important
}
.ruleSetAddOrEdit >>> .v-input__control {
  height: auto !important;
}
/* // tr>td {
//   white-space:normal !important
// } */
</style>
