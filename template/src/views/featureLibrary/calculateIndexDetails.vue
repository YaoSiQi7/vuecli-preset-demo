<!----------  @author: author  ----------->
<!----------  @updated_at: date  ----------->
<!----------  @version: version  ----------->

<template>
  <!-- 预警策略配置 -->
  <div class="enu-content">
    <!-- <p>计算指标详情页面</p> -->
    <!-- 保存取消 -->
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3',isFixed?'fixed':'']">
        <v-card-actions v-if="this.isFieldCanDelOrEdit" style="height:60px">
          <v-btn :disabled="disabledSave" color="primary" :loading="btnLoading" class="ml-4" @click="saveTmp">保存</v-btn>
          <v-btn class="ml-4 cancelButton" @click="cancleTem" outlined>取消</v-btn>
        </v-card-actions>
        <v-card-actions v-else style="height:60px">
          <v-btn class="ml-4 cancelButton" @click="cancleTem" outlined>返回</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-row id="calculateIndexDetails">
      <v-col cols="12">
        <v-form ref="header_form" v-model="headerValid" :lazy-validation="headerLazy">
          <!--  指标模板 -->
          <v-card>
            <v-card-text>
              <v-row v-if="isFieldCanDelOrEdit">
                <div class="base_item_label_name">
                  <h3 class="base_h3_color">指标模板</h3>
                </div>
              </v-row>
              <v-row>
                <div class="base_label_div">
                  <div class="labelStyle">指标名称*:</div>
                </div>
                <div class="base_content_div" style="width: 45%;">
                  <v-text-field
                    :class="!isFieldCanDelOrEdit ? 'indicatorsNameStyle' : ''"
                    :readonly="!isFieldCanDelOrEdit"
                    v-model.trim="indicatorsName"
                    placeholder="指标名称*"
                    type="text"
                    :title="indicatorsName"
                    required
                    :rules="[
                      v => !!v || '指标名称不能为空',
                      v => v && v.length <= 200 || '最多只能输入200个字符'
                    ]"
                    outlined
                    dense
                  />
                </div>
              </v-row>
              <div v-if="this.templaterOrFunc === 'TEMPLATE_VAR'">
                <v-row>
                  <div class="base_label_div">
                    <div class="labelStyle">适用渠道*:</div>
                  </div>
                  <div class="base_content_div">
                    <v-autocomplete
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
                  </div>
                  <div class="base_content_div" style="margin-left: 10px;" v-if="properChannelsSecondSelectShow">
                    <v-autocomplete
                      class="ruleSetAddOrEdit"
                      :disabled="!isFieldCanDelOrEdit"
                      v-model="properChannelsSecondSelectParamValue"
                      :items="channelTypeSecondClassArr"
                      :rules="properChannelsRules"
                      item-text="name"
                      item-value="value"
                      required
                      multiple
                      no-data-text="没有匹配数据"
                      @change="properChannelsSecondSelectChange(properChannelsSecondSelectParamValue)"
                      outlined
                      dense
                    />
                  </div>
                </v-row>
                <v-row>
                  <div class="base_label_div">
                    <div class="labelStyle">适用交易*:</div>
                  </div>
                  <div class="base_content_div">
                    <v-autocomplete
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
                  </div>
                  <div class="base_content_div" style="margin-left: 10px;" v-if="UsingTradeSecondSelectShow">
                    <v-autocomplete
                      class="ruleSetAddOrEdit"
                      :disabled="!isFieldCanDelOrEdit"
                      v-model="UsingTradeSecondSelectParamValue"
                      item-text="name"
                      item-value="value"
                      :items="UsingTradeSecondClassArr"
                      :rules="UsingTradeRules"
                      required
                      multiple
                      no-data-text="没有匹配数据"
                      outlined
                      dense
                    />
                  </div>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-form>
        <v-form ref="tempInstru_form" style="margin-top: 12px;" v-model="valid" :lazy-validation="lazy">
          <!-- 选择模板下的动态获取的数据结构 -->
          <v-card style="text-align:left;">
            <v-card-text>
              <v-row>
                <div v-if="isFieldCanDelOrEdit">
                  <div class="base_item_label_name base_inline_block">
                    <h3 class="base_h3_color">选择{{ structureName }}</h3>
                  </div>
                  <div class="base_item_name base_inline_block" v-if="isFieldCanDelOrEdit">
                    <v-btn v-if="templateOrFuncName" style="margin-left: 0 !important;" class="ml-4" color="primary" @click="addFilParms()">{{ templateOrFuncName }}</v-btn>
                    <v-btn v-else style="margin-left: 0 !important;" class="ml-4" color="primary" @click="addFilParms()">请选择</v-btn>
                  </div>
                </div>
                <div v-else>
                  <div class="base_item_label_name base_inline_block">
                    <h3 class="base_h3_color">选择{{ structureName }}</h3>
                  </div>
                  <div class="base_item_name base_inline_block">
                    <v-btn v-if="templateOrFuncName" style="margin-left: 0 !important;" class="ml-4" color="primary" :disabled="!isFieldCanDelOrEdit">{{ templateOrFuncName }}</v-btn>
                    <v-btn v-else style="margin-left: 0 !important;" class="ml-4" color="primary" @click="addFilParms()">请选择</v-btn>
                  </div>
                </div>
              </v-row>
              <div>
                <v-row>
                  <div class="base_label_div">
                    <div class="labelStyle"><span class="circle"></span>{{ structureName }}描述：</div>
                  </div>
                  <div class="base_content_div" style="width: 80%;">
                    <div style="color: #ccc;line-height: 40px;">{{ templateOrFuncComment }}</div>
                  </div>
                </v-row>
              </div>
              <div v-if="templateParameter.length > 0">
                <v-row v-for="(item,index) in templateParameter" :key="index + newTime">
                  <div class="base_label_div">
                    <div class="labelStyle"><span class="circle"></span>{{ item.paramName }}*:</div>
                  </div>
                  <div v-if="item.paramSrc == '31'" class="base_content_div">
                    <v-text-field
                      v-if="fflag== 1"
                      :disabled="!isFieldCanDelOrEdit"
                      v-model.trim="optionsValues[index]"
                      :placeholder = "item.paramName + '*'"
                      type="text"
                      required
                      :rules="[
                        v => !!v || item.paramName + '不能为空'
                      ]"
                      outlined
                      dense
                      :menu-props="{auto: true, overflowY: true}"
                      class="templaterAddWidth"
                    />
                    <v-text-field
                      :disabled="!isFieldCanDelOrEdit"
                      v-else-if="fflag== 2"
                      v-model.trim="optionsValues[index]"
                      :placeholder = "item.paramName + '*'"
                      type="text"
                      required
                      :rules="[
                        v => !!v || item.paramName + '不能为空'
                      ]"
                      outlined
                      dense
                      :menu-props="{auto: true, overflowY: true}"
                      class="templaterAddWidth"
                    />
                    <v-text-field
                      :disabled="!isFieldCanDelOrEdit"
                      v-else
                      v-model.trim="optionsValues[index].value"
                      :placeholder = "item.paramName + '*'"
                      type="text"
                      required
                      :rules="[
                        v => !!v || item.paramName + '不能为空'
                      ]"
                      outlined
                      dense
                      :menu-props="{auto: true, overflowY: true}"
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
                      <!-- <v-icon class="mr-1" color="primary" size="20">mdi-help-circle</v-icon> -->
                    </span>
                  </div>
                  <div v-else-if="item.paramSrc === 'inputOrSrcList'" class="base_content_div">
                    <v-combobox
                      :disabled="!isFieldCanDelOrEdit"
                      v-model="optionsValues[index]"
                      :items="item.srcList"
                      item-text="name"
                      item-value="id"
                      return-object
                      :rules="[
                        v => !!v || item.paramName + '不能为空',
                      ]"
                      :placeholder = "item.paramName + '*'"
                      no-data-text="没有数据"
                      outlined
                      dense
                      :menu-props="{auto: true, overflowY: true}"
                      class="templaterAddWidth"
                    ></v-combobox>
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
                  </div>
                  <div v-else class="base_content_div">
                    <v-autocomplete
                      :disabled="!isFieldCanDelOrEdit"
                      v-model="optionsValues[index]"
                      :items="item.srcList"
                      item-text="name"
                      item-value="id"
                      return-object
                      :rules="[
                        v => !!v || item.paramName + '不能为空',
                      ]"
                      :placeholder = "item.paramName + '*'"
                      no-data-text="没有数据"
                      outlined
                      dense
                      :menu-props="{auto: true, overflowY: true}"
                      class="templaterAddWidth"
                    ></v-autocomplete>
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
                      <!-- <v-icon class="mr-1" color="primary" size="20">mdi-help-circle</v-icon> -->
                    </span>
                  </div>
                </v-row>
              </div>
              <!-- 编辑的状态下，如果过滤条件的数组为空，则不展示过滤条件的模块 -->
              <div>
                <!-- 数据过滤条件 -->
                <div v-if="templaterOrFunc === 'TEMPLATE_VAR'">
                  <v-row>
                    <div class="base_item_label_name">
                      <h3 class="base_h3_color">过滤条件</h3>
                    </div>
                    <div class="base_item_name" v-if="isFieldCanDelOrEdit">
                      <v-btn
                        color="primary"
                        class="white--text"
                        @click="addFilterCondition()"
                      >
                        <v-icon>add</v-icon>
                      </v-btn>
                    </div>
                  </v-row>
                  <div v-for="(filterItem, filterIndex) in filterCondition" :key="filterIndex + '14'">
                    <v-row style="margin-bottom: 10px !important;">
                      <div class="base_item_label_name" style="line-height: 36px;margin-left: 40px;">
                        <h3>过滤条件{{ String.fromCharCode(64 + parseInt(filterIndex + 1)) }}</h3>
                      </div>
                      <div class="base_item_name" style="text-align: right;width: 24%;">
                        <v-btn icon class="mr-1" v-if="isFieldCanDelOrEdit">
                          <v-icon @click="cancleFilterCondition(filterIndex)">mdi-close</v-icon>
                        </v-btn>
                      </div>
                    </v-row>
                    <v-row>
                      <div class="base_label_div">
                        <div class="labelStyle"><span class="circle"></span>{{ filterItem.cnName }}*:</div>
                      </div>
                      <div class="base_content_div">
                        <v-select
                          :disabled="!isFieldCanDelOrEdit"
                          v-model="filterItem.enName"
                          item-text="text"
                          item-value="value"
                          :items="filterTypeItem"
                          :rules="baseChanneltradRules"
                          no-data-text="没有匹配数据"
                          outlined
                          dense
                          :menu-props="{auto: true, overflowY: true}"
                          class="templaterAddWidth"
                          @change="conditionTypeChange(filterItem.enName, filterItem)"
                        />
                      </div>
                    </v-row>
                    <div v-if="filterItem.parameters.length > 0">
                      <div v-if="fflag === '1'">
                        <v-row v-for="(im,ix) in filterItem.parameters" :key="ix + newTime">
                          <div class="base_label_div">
                            <div class="labelStyle"><span class="circle"></span>{{ im.cnName }}*:</div>
                          </div>
                          <div class="base_content_div" v-if="im.src == '31'">
                            <v-text-field
                              :disabled="!isFieldCanDelOrEdit"
                              :placeholder = "im.cnName + '*'"
                              :rules="baseChanneltradRules"
                              v-model.trim="im.value"
                              outlined
                              dense
                              class="templaterAddWidth"
                            />
                            <span class="questionMark" v-if="im.comment">
                              <v-tooltip right >
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    class="mr-1"
                                    color="primary"
                                    v-on="on"
                                    size="20"
                                  >mdi-help-circle</v-icon>
                                </template>
                                <span>{{im.comment || '无说明'}}</span>
                              </v-tooltip>
                            </span>
                          </div>
                          <div class="base_content_div" v-else-if="im.src == 'inputOrSrcList'">
                            <v-combobox
                              :disabled="!isFieldCanDelOrEdit"
                              v-model="im.value"
                              :items="im.options"
                              :rules="baseChanneltradRules"
                              item-text="name"
                              item-value="id"
                              return-object
                              :placeholder = "im.cnName + '*'"
                              no-data-text="没有数据"
                              outlined
                              dense
                              :menu-props="{auto: true, overflowY: true}"
                              class="templaterAddWidth"
                              @change="inputOrSrcListChange(im.value, filterIndex, im, filterItem.enName)"
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
                                <span>{{im.comment || '无说明'}}</span>
                              </v-tooltip>
                            </span>
                          </div>
                          <div class="base_content_div" v-else>
                            <v-autocomplete
                              :disabled="!isFieldCanDelOrEdit"
                              v-model="im.value"
                              :rules="baseChanneltradRules"
                              :placeholder = "im.cnName + '*'"
                              item-text="name"
                              item-value="id"
                              :items="im.options"
                              no-data-text="没有匹配数据"
                              outlined
                              dense
                              :menu-props="{auto: true, overflowY: true}"
                              class="templaterAddWidth"
                              @change="inputOrSrcListChange(im.value, filterIndex, im, filterItem.enName)"
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
                                <span>{{im.comment || '无说明'}}</span>
                              </v-tooltip>
                              <!-- <v-icon class="mr-1" color="primary" size="20">mdi-help-circle</v-icon> -->
                            </span>
                          </div>
                        </v-row>
                      </div>
                      <div v-if="fflag === '2'">
                        <v-row v-for="(im,ix) in filterItem.parameters" :key="ix + newTime">
                          <div class="base_label_div">
                            <div class="labelStyle"><span class="circle"></span>{{ im.cnName }}*:</div>
                          </div>
                          <div class="base_content_div" v-if="im.src == '31'">
                            <v-text-field
                              :disabled="!isFieldCanDelOrEdit"
                              :placeholder = "im.cnName + '*'"
                              :rules="baseChanneltradRules"
                              v-model.trim="im.value.value"
                              outlined
                              dense
                              class="templaterAddWidth"
                            />
                            <span class="questionMark" v-if="im.comment">
                              <v-tooltip right >
                                <template v-slot:activator="{ on }">
                                  <v-icon
                                    class="mr-1"
                                    color="primary"
                                    v-on="on"
                                    size="20"
                                  >mdi-help-circle</v-icon>
                                </template>
                                <span>{{im.comment || '无说明'}}</span>
                              </v-tooltip>
                              <!-- <v-icon class="mr-1" color="primary" size="20">mdi-help-circle</v-icon> -->
                            </span>
                          </div>
                          <div class="base_content_div" v-else-if="im.src == 'inputOrSrcList'">
                            <v-combobox
                              :disabled="!isFieldCanDelOrEdit"
                              v-model="im.value"
                              :items="im.options"
                              :rules="baseChanneltradRules"
                              item-text="name"
                              item-value="id"
                              return-object
                              :placeholder = "im.cnName + '*'"
                              no-data-text="没有数据"
                              outlined
                              dense
                              :menu-props="{auto: true, overflowY: true}"
                              class="templaterAddWidth"
                              @change="inputOrSrcListChange(im.value, filterIndex, im, filterItem.enName)"
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
                                <span>{{im.comment || '无说明'}}</span>
                              </v-tooltip>
                              <!-- <v-icon class="mr-1" color="primary" size="20">mdi-help-circle</v-icon> -->
                            </span>
                          </div>
                          <div class="base_content_div" v-else>
                            <v-autocomplete
                              :disabled="!isFieldCanDelOrEdit"
                              v-model="im.value"
                              :rules="baseChanneltradRules"
                              :placeholder = "im.cnName + '*'"
                              item-text="name"
                              item-value="id"
                              :items="im.options"
                              no-data-text="没有匹配数据"
                              outlined
                              dense
                              :menu-props="{auto: true, overflowY: true}"
                              class="templaterAddWidth"
                              @change="inputOrSrcListChange(im.value, filterIndex, im, filterItem.enName)"
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
                                <span>{{im.comment || '无说明'}}</span>
                              </v-tooltip>
                              <!-- <v-icon class="mr-1" color="primary" size="20">mdi-help-circle</v-icon> -->
                            </span>
                          </div>
                        </v-row>
                      </div>
                    </div>
                    <div v-else ></div>
                  </div>
                  <div class="" v-if="filterCondition.length > 0" style="padding: 0;margin: 0;">
                    <v-row>
                      <v-col cols="2">
                        <h3 class="base_h3_color">条件关系表达式</h3>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-radio-group v-model="radios" style="float:left;margin-left: 25px;" row>
                          <v-radio label="全且" value="and" :disabled="!isFieldCanDelOrEdit"></v-radio>
                          <v-radio label="全或" value="or" :disabled="!isFieldCanDelOrEdit"></v-radio>
                          <v-radio label="自定义" value="random" :disabled="!isFieldCanDelOrEdit"></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <v-row v-if="radios ==='random'">
                      <div class="fl" style="width: 100px;margin-left: 36px;">逻辑关系:</div>
                      <div class="fl" style="width: 26%;">
                        <v-text-field
                          v-model.trim="customizeConfig"
                          placeholder="请输入逻辑关系"
                          outlined
                          dense
                          type="text"
                        ></v-text-field>
                        <div class="pt-4">使用条件序号加上()、且、或， 来拼接表达式，例如(条件A且条件B且条件C)或条件D。括号内不支持且和或同时存在</div>
                      </div>
                    </v-row>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-form>
      </v-col>
    </v-row>
    <v-dialog v-model="addDialog" persistent width="800">
      <v-card style="position: relative;" :key="backShowTemlateName">
        <v-card-title class="justify-left">
          <v-toolbar-title>{{ titleIndicator }}</v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn icon>
            <v-icon @click="cancleAdd()">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="padding: 0;overflow: hidden;padding-bottom: 40px;">
          <v-row style="margin: 0;">
            <v-col cols="4" id="calculateIndexDetails_tempGroup" ref='tempGroupTable' class="group-temp" style="background-color: var(--v-tableRowHoverActive-base);border-bottom: 1px solid rgba(0, 0, 0, 0.12);border-right: 1px solid rgba(0, 0, 0, 0.12);padding-top: 11px;padding-right: 0;">
              <v-card-title class="calculateIndexDetails_searchIcon" style="padding: 0 36px 0 4px;">
                <v-text-field
                  v-model="search2"
                  append-icon="mdi-magnify"
                  placeholder="请输入条件搜索"
                  hide-details
                  dense
                />
              </v-card-title>
              <v-data-table
                :headers="tempGroupHeader"
                :search="search2"
                :items="tempGroupItem"
                hide-default-footer
                hide-default-header
                :items-per-page="1000"
                no-results-text="没有匹配的数据"
                style="background-color: var(--v-tableRowHoverActive-base);padding-left: 9px;"
              >
                <template v-slot:body="{ items }">
                  <tr
                    v-for="(item, index) in items"
                    :key="index + '17'"
                    class="tempGroupTableTr el-tr-defu"
                    :id='item.id'
                    :class="{activeUserDef:index == secondIsActive}"
                    @click="tempGroupClick(item,index)"
                  >
                    <td class="el-border-defu" style="font-weight: bold;border: 0;">{{ item.templateName }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
            <v-col cols="8" id="temps" ref='tempsTable' style="border-bottom: 1px solid rgba(0, 0, 0, 0.12);padding: 11px 0px 12px 10px;">
              <v-card-title class="calculateIndexDetails_searchIcon" style="width: 213.66px;padding: 0;margin-left: 10px;">
                <v-text-field
                  v-model="search3"
                  append-icon="mdi-magnify"
                  label="请输入条件搜索"
                  hide-details
                  outlined
                  dense
                />
              </v-card-title>
              <div style="margin-left:10px;border-top: 1px solid #EDEDED;margin-right: 20px;"></div>
              <v-data-table
                  :headers="tempNameHeaderData"
                  :search="search3"
                  :items="tempNameItem"
                  hide-default-footer
                  hide-default-header
                  :items-per-page="1000"
                  no-results-text="没有匹配的数据"
                >
                  <template v-slot:body="{ items }">
                    <v-radio-group v-model="tempNameId" :key="newTime">
                      <v-radio
                        v-for="(item, index) in items"
                        :label="item.tempName"
                        :key="index"
                        color="primary"
                        :value="item.id"
                        :id='item.id'
                        @change="tempNameClick(item,index)"
                      ></v-radio>
                    </v-radio-group>
                  </template>
                </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="templateBtnFixed">
          <div class="flex-grow-1" />
          <v-btn text style="mr-5" outlined @click="cancleAdd()">取消</v-btn>
          <v-btn color="primary" @click="addSave()">保存</v-btn>
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
  querytradelistbyappids,
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
  searchFilterTypeTemplate,
  getenumeration, // 根据枚举常量名、常量查询对应的枚举值 指标管理模块专用接口，即过滤条件change事件的接口
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
      isFixed: false,
      newTime: '',
      backShowTemlateName: '',
      btnLoading: false, // 保存按钮添加loading，避免多次提交
      tempNameId: '',
      // 公共弹框
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      isEnd: true, // 左侧树形节点不展示添加按钮
      itemText: 'indicGroup',
      isTopShow: false,
      isFirstLineSelected: true,
      tempPath: '',
      e1: 1,
      search: '',
      search1: '',
      search2: '',
      search3: '',
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
      enumeId: '',
      enumFieldId: '',
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
      properChannelsSecondSelectParamValue: [],
      channelTypeFirstClassArr: [],
      channelTypeSecondClassArr: [],
      // 适用交易
      UsingTradeSecondSelectShow: false,
      UsingTradeParamValue: '',
      UsingTradeSecondSelectParamValue: [],
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
      filterCondition: [], // 数据过滤条件---的数组
      filterConditionCalculate: [], // 计算过滤条件----的数组
      radios: 'and', // 数据过滤条件---条件关系表达式
      radiosCalculate: 'and', // 计算过滤条件---条件关系表达式
      customizeConfig: '', // 过滤条件下----自定义输入框的值
      customizeConfigCalculate: '', // 计算过滤条件----自定义输入框的值
      operator: [], // 计算符数组
      filtrationObjArray: [], // 过滤对象的数组
      companyArray: [], // 单位的数组
      businessVariablesArray: [], // 业务变量库所有字段的数组
      structureName: '', // 是模板机构 or 方法结构
      templateOrFuncName: '',
      templateOrFuncComment: '', // 模版描述
      templateParameter: [],
      tempNameTempCopy: [],
      tempInstru_form: [],
      header_form: [],
      editItemData: {},
      tempNameTemp: '',
      valid: true,
      lazy: false,
      headerValid: true,
      headerLazy: false,
      colorIndex: 0,
      // 自动补全功能下拉框
      srcList: [],
      optionsValues: [],
      srcListValue: '',
      ins: null,
      secondIsActive: 0, // 选择模板左侧列表中代表选中项的index，
      secondIsActiveRight: 0, // 选择模板右侧列表中代表选中项的index，
      fflag: '1', // 添加：1，编辑：2
      isIndex: '', // 模板指标  or  方法指标
      tempGroupHeader: [
        {
          text: '模板分组',
          value: 'templateName',
          sortable: false,
          width: 100
        }
      ],
      tempNameHeaderData: [
        {
          text: '模板分组',
          value: 'tempName',
          sortable: false,
          width: 100
        }
      ],
      tempNameHeader: [{ text: '模板名称', value: 'templateName', sortable: false, width: 100 }],
      addDialog: false,
      tmplId: '',
      secondIsActiveCopy: '',
      secondIsActiveRightCopy: '',
      templateOrFuncNameInde: '',
      disabledSave: true,
      filterTypeItem: [], // 条件类型的值
      newDate: '',
      routeParams: {},
      properChannelsRules: [v => (v && !!v.length) || '适用渠道不能为空'],
      UsingTradeRules: [v => (v && !!v.length) || '适用交易不能为空'],
      deepCopy: '', // 保存失败时，optionsValues变量的第一项如果是数字就对其操作
      copyOptions: [] // 复制一份过滤条件功能中，条件类型为判断型时的第三项【值】的原始数组，备作判断型时第一项过滤条件的change事件用。
    };
  },
  computed: {},
  watch: {
    templaterOrFunc: function (newVal, oldVal) {
      if (newVal === 'TEMPLATE_VAR') {
        this.titleIndicator = '选择模板';
        this.oneStepName = '请选择模板分组';
        this.twoStepName = '请填写模板指标模板';
        this.structureName = '模板';
      } else if (newVal === 'METHOD_VAR') {
        this.structureName = '方法';
        this.titleIndicator = '选择模板';
        this.oneStepName = '请选择方法分组';
        this.twoStepName = '请填写方法指标模板';
      }
    },
    valid: function (newVal, oldVal) {
      if (newVal && this.headerValid) {
        this.disabledSave = false;
      } else {
        this.disabledSave = true;
      }
    },
    headerValid: function (newVal, oldVal) {
      if (newVal && this.valid) {
        this.disabledSave = false;
      } else {
        this.disabledSave = true;
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.fixedBtnBox);
    this.getAllSessionStorage();
    this.GetOperator();
    this.getCompanyArray();
    this.getQueryallfield();
    this.getFilterType(); // 获取过滤条件类型
  },
  created () {
  },
  components: {},
  methods: {
    // 头部fixed定位
    fixedBtnBox () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 72) { // 当页面滚动到高度72px处，动态绑定class 来设置头部固定定位
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    /* // 返回指标管理传参数回显
    backShow () {
      this.$route.params
    }, */
    // 公共data为空弹框
    baseEmptyPopUp (res, color = 'error') {
      this.snackbarServe = true;
      this.snackbarServeMsg = res.data.msg;
      this.snackbarServeColor = color;
    },
    // 公共tempInstru_form重置
    baseFromReset (form) {
      if (form) {
        form.reset();
        form.resetValidation();
      }
    },
    // 适用渠道两个下拉框change事件后，重置适用交易第一个下拉框的值
    resetUsingTradeParamValue () {
      if (this.UsingTradeParamValue !== 'CURRENT') {
        this.UsingTradeParamValue = 'CURRENT';
        this.UsingTradeSecondSelectShow = false;
      };
    },
    // 获取本地缓存
    getAllSessionStorage () {
      this.$nextTick(() => {
        this.newTime = new Date().getTime();
        this.fflag = sessionStorage.getItem('indexFflag'); // 添加：1，编辑：2
        if (this.fflag === '1') {
          this.isFieldCanDelOrEdit = sessionStorage.getItem('indexIsFieldCanDelOrEdit'); // 是否内部参数，如果是内部参数则不能编辑，否则可以编辑
          this.radios = sessionStorage.getItem('indexRadios'); // 条件关系表达式
          this.customizeConfig = sessionStorage.getItem('indexCustomizeConfig'); // 过滤条件下----自定义输入框的值
          this.templaterOrFunc = sessionStorage.getItem('isIndex'); // 模板指标 or 方法指标
          this.enumeId = sessionStorage.getItem('indexGroupId'); // 分组id(即计算指标库左侧树的当前项的id)
          this.baseFromReset(this.$refs.tempInstru_form);
          this.baseFromReset(this.$refs.header_form);
          if (this.templaterOrFunc === 'TEMPLATE_VAR') {
            findTemplateGroup().then(res => {
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  this.tempGroupItem = res.data.data;
                  this.secondIsActiveCopy = 0;
                  this.secondIsActive = 0; // 添加弹框中第一步的左侧列表的第几项添加背景色
                  // this.tempGroupId = this.tempGroupItem[1].id;
                  this.tempGroupId = this.tempGroupItem[0].id;
                  // 点击的时候显示模板名称
                  this.$nextTick(() => {
                    this.radios = 'and';
                  });
                  this.queryAppList(); // 获取应用列表数组
                  this.baseGetFieldNameList('sys_trade_type'); // 适用交易数组
                  this.baseGetFieldNameList('sys_channel_type'); // 适用渠道数组
                  this.properChannelsSecondSelectShow = false;
                  this.UsingTradeSecondSelectShow = false;
                  const getTemplateParams = { tmplGroupId: this.tempGroupId };
                  getTemplate(getTemplateParams).then(res => { // 获取模板名称的接口
                    if (res.data.code === 200) {
                      if (res.data.data.length > 0) {
                        this.secondIsActiveRight = 0; // 添加弹框中右侧列表选中的第几项
                        this.secondIsActiveRightCopy = 0; // 添加弹框中右侧列表选中的第几项（copy）
                        this.tempNameItem = [];
                        this.tempNameItem = res.data.data;
                        this.templateOrFuncName = this.tempNameItem[0].tempName;
                        this.templateOrFuncComment = this.tempNameItem[0].comment;
                        this.tempNameTempCopy = Object.assign({}, this.tempNameItem[0]);
                        this.tempNameTemp = this.tempNameItem[0];
                        this.tmplId = this.tempNameItem[0].id;
                        this.tempNameId = this.tempNameItem[0].id;
                        const params = {
                          templateId: this.tempNameItem[0].id,
                          indicMode: this.templaterOrFunc
                        };
                        getApiTemlaterStructure(params) // 获取模板结构的接口
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
                              this.baseEmptyPopUp(res);
                            }
                          }).catch(err => console.error(err));
                      } else {
                        this.templateOrFuncName = '';
                        this.templateOrFuncComment = '';
                        this.tempNameItem = [];
                        this.templateParameter = [];
                      }
                    }
                  });
                } else {
                  this.tempGroupItem = [];
                  this.baseGetFieldNameList('sys_trade_type'); // 适用交易数组
                  this.baseGetFieldNameList('sys_channel_type'); // 适用渠道数组
                // 是否增加当tempGroupItem为空时，隐藏下一步按钮
                }
              }
            }).catch(err => console.error(err));
          } else if (this.templaterOrFunc === 'METHOD_VAR') {
            const parms = {
              content: ''
            };
            groupQuery(parms).then(res => { // 获取方法分组的名称
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  res.data.data.forEach((item, index, ary) => {
                    ary[index].templateName = item.methodType;
                  });
                  this.tempGroupItem = res.data.data;
                  this.secondIsActiveCopy = 0;
                  this.secondIsActive = 0; // 添加弹框中第一步的左侧列表的第几项添加背景色
                  this.tempGroupId = this.tempGroupItem[0].id;
                  this.$nextTick(() => {
                    this.radios = 'and';
                  });
                  const getTemplateParams = { gid: this.tempGroupId };
                  methodQuery(getTemplateParams).then(res => { // 获取方法名称的接口
                    if (res.data.code === 200) {
                      if (res.data.data.length > 0) {
                        res.data.data.forEach((item, index, ary) => {
                          res.data.data.forEach((item, index, ary) => {
                            ary[index].tempName = item.mthodName;
                          });
                        });
                        this.secondIsActiveRight = 0; // 添加弹框中右侧列表选中的第几项
                        this.secondIsActiveRightCopy = 0; // 添加弹框中右侧列表选中的第几项（copy）
                        this.tempNameItem = [];
                        this.tempNameItem = res.data.data;
                        this.templateOrFuncName = this.tempNameItem[0].tempName;
                        this.templateOrFuncComment = this.tempNameItem[0].comment;
                        this.tempNameTempCopy = Object.assign({}, this.tempNameItem[0]);
                        this.tempNameTemp = this.tempNameItem[0];
                        this.tmplId = this.tempNameItem[0].id;
                        this.tempNameId = this.tempNameItem[0].id;
                        const params = {
                          templateId: this.tempNameItem[0].id,
                          indicMode: this.templaterOrFunc
                        };
                        getApiTemlaterStructure(params) // 获取方法结构的接口
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
                              this.baseEmptyPopUp(res);
                            }
                          }).catch(err => console.error(err));
                      } else {
                        this.tempNameItem = [];
                        this.templateParameter = [];
                      }
                    }
                  }).catch(err => console.error(err));
                // 点击的时候显示模板名称
                // this.getTemplate(); // 获取下一步的内容
                } else {
                  this.tempGroupItem = [];
                // 是否增加当tempGroupItem为空时，隐藏下一步按钮
                }
              }
            }).catch(err => console.error(err));
          };
        } else {
          this.radios = sessionStorage.getItem('indexRadios'); // 条件关系表达式
          this.customizeConfig = sessionStorage.getItem('indexCustomizeConfig'); // 过滤条件下----自定义输入框的值
          this.items = JSON.parse(sessionStorage.getItem('items'));
          this.templaterOrFunc = this.items.indicMode;
          if (this.items.indicMode === 'TEMPLATE_VAR') {
            this.tempGroupHeader = [
              {
                text: '模板分组',
                value: 'templateName',
                sortable: false,
                width: 100
              }
            ];
            this.tempNameHeader = [{ text: '模板名称', value: 'templateName', sortable: false, width: 100 }];
          } else if (this.items.indicMode === 'METHOD_VAR') {
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
          this.editFildParms(this.items);
        }
      });
    },
    cancleTem () {
      this.tempNameId = '';
      this.$nextTick(() => {
        this.baseFromReset(this.$refs.tempInstru_form);
        this.baseFromReset(this.$refs.header_form);
      });
      this.templateParameter = [];
      this.filterCondition = [];
      this.radios = 'and';
      this.customizeConfig = '';
      window.sessionStorage.setItem('backCalcindexBase', 2);
      this.routeParams = this.$route.params;
      this.$router.push({
        path: '/calcIndexBase',
        name: 'calcIndexBase',
        params: this.routeParams
      });
    },
    saveTmp () {
      if (this.templateOrFuncName) {
        this.btnLoading = true;
        if (this.$refs.tempInstru_form.validate() && this.$refs.header_form.validate()) {
          if (this.fflag === '1') {
            this.createIndicators();
          } else if (this.fflag === '2') {
            this.updateIndicators();
          }
        }
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请选择模板,模板不能为空。';
        this.snackbarServeColor = 'error';
      }
      // this.templateParameter = [];
    },
    // 获取数组中每一个对象中的某一个value
    getArrayProps (array, key1) {
      // let key1 = key || 'value';
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
    // 点击打开选择模板分组
    addFilParms () {
      this.$nextTick(() => {
        this.backShowTemlateName = new Date().getTime();
        this.addDialog = true;
        if (this.templaterOrFunc === 'TEMPLATE_VAR') {
          findTemplateGroup().then(res => {
            if (res.data.code === 200) {
              if (res.data.data.length > 0) {
                this.tempGroupItem = res.data.data;
                this.tempGroupId = this.tempGroupItem[this.secondIsActive].id;
                // 点击的时候显示模板名称
                if (this.templaterOrFunc === 'TEMPLATE_VAR') {
                  const params = { tmplGroupId: this.tempGroupId };
                  getTemplate(params).then(res => {
                    if (res.data.code === 200) {
                      if (res.data.data.length > 0) {
                        this.tempNameItem = [];
                        this.tempNameItem = res.data.data;
                        this.secondIsActiveCopy = this.secondIsActive;
                        // 如果已经选了分组和模板 定位到当前分组和模板
                        this.$refs.tempGroupTable.scrollTop = this.secondIsActive * 48;
                        this.$nextTick(() => {
                          this.newTime = new Date().getTime();
                        });
                        if (this.tempNameId) {
                          this.tempNameItem.forEach((item, index) => {
                            if (item.id === this.tempNameId) {
                              this.secondIsActiveRight = index;
                            }
                          });
                          this.secondIsActiveRightCopy = this.secondIsActiveRight;
                          this.$nextTick(() => {
                            this.$refs.tempsTable.scrollTop = this.secondIsActiveRight * 48;
                          });
                        }
                      } else {
                        this.tempNameItem = [];
                        this.templateParameter = [];
                      }
                    }
                  }).catch(err => console.error(err));
                  this.tempGroupHeader = [
                    {
                      text: '模板分组',
                      value: 'templateName',
                      sortable: false,
                      width: 100
                    }
                  ];
                  this.tempNameHeader = [{ text: '模板名称', value: 'templateName', sortable: false, width: 100 }];
                }
              } else {
                this.tempGroupItem = [];
                // 是否增加当tempGroupItem为空时，隐藏下一步按钮
              }
            }
          }).catch(err => console.error(err));
        } else if (this.templaterOrFunc === 'METHOD_VAR') {
          const parms = {
            content: ''
          };
          this.tempGroupHeader = [
            {
              text: '方法类型',
              value: 'templateName',
              sortable: false,
              width: 100
            }
          ];
          this.tempNameHeader = [{ text: '方法名称', value: 'templateName', sortable: false, width: 100 }];
          groupQuery(parms).then(res => {
            if (res.data.code === 200) {
              if (res.data.data.length > 0) {
                res.data.data.forEach((item, index, ary) => {
                  ary[index].templateName = item.methodType;
                });
                this.tempGroupItem = res.data.data;
                this.tempGroupId = this.tempGroupItem[this.secondIsActive].id;
                // 已经选了方法分组之后，定位到已选择的位置
                this.$refs.tempGroupTable.scrollTop = this.secondIsActive * 48;

                // 点击的时候显示模板名称
                this.getTemplate(); // 获取下一步的内容
              } else {
                this.tempGroupItem = [];
                // 是否增加当tempGroupItem为空时，隐藏下一步按钮
              }
            }
          }).catch(err => console.error(err));
        };
      });
    },
    // 添加指标---获取模板名称
    getTemplate () {
      this.tempNameId = this.tempNameTemp.id;
      if (this.templaterOrFunc === 'TEMPLATE_VAR') {
        const params = { tmplGroupId: this.tempGroupId };
        getTemplate(params).then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              this.tempNameItem = [];
              this.tempNameItem = res.data.data;
              this.newTime = new Date().getTime();
              if (this.tempNameId) {
                this.tempNameItem.forEach((item, index) => {
                  if (item.id === this.tempNameId) {
                    this.secondIsActiveRight = index;
                  }
                });
                this.$refs.tempsTable.scrollTop = this.secondIsActiveRight * 48;
              }
            } else {
              this.tempNameItem = [];
              this.templateParameter = [];
            }
          }
        }).catch(err => console.error(err));
      } else if (this.templaterOrFunc === 'METHOD_VAR') {
        const params = { gid: this.tempGroupId };
        methodQuery(params).then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              res.data.data.forEach((item, index, ary) => {
                ary[index].tempName = item.mthodName;
              });
              this.tempNameItem = [];
              this.tempNameItem = res.data.data;
              this.newTime = new Date().getTime();
              // 如果所选方法有值，定位到所选方法所在位置
              if (this.tempNameId) {
                this.tempNameItem.forEach((item, index) => {
                  if (item.id === this.tempNameId) {
                    this.secondIsActiveRight = index;
                  }
                });
                // this.$refs.tempsTable.scrollTop = this.secondIsActive * 48;
                this.$refs.tempsTable.scrollTop = this.secondIsActiveRight * 48;
              }
            } else {
              this.tempNameItem = [];
              this.templateParameter = [];
            }
          }
        }).catch(err => console.error(err));
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
        }).catch(err => console.error(err));
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
        }).catch(err => console.error(err));
      }
    },
    // 编辑按钮---事件
    editFildParms (items) {
      const pms = {
        sourceId: items.id
      };
      isReferenceAndDebugMode(pms).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.editingMode === 2) {
            this.snackbarServe = true;
            this.timeout = 5000;
            this.snackbarServeMsg = '该指标已经被引用，请谨慎修改。';
            this.snackbarServeColor = 'warning';
          }
          // isInterNal 1：内置，0：非内置。 在内置的情况下，不用判断引用关系，直接判定为不可编辑。
          // isQuote 1：被引用，0：未被引用。

          // res.data.data.editingMode
          // 1、未引用，调试模式；返回0
          // 2、未引用，安全模式；返回1
          // 3、已引用，调试模式；返回2
          // 4、已引用，安全模式；返回3
          if (items.isInternal === '1' || res.data.data.editingMode === 3) {
            this.isFieldCanDelOrEdit = false;
          } else {
            this.isFieldCanDelOrEdit = true;
          }
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
      this.indicatorsName = items.indicName;
      this.enumFieldId = items.id;
      this.templaterOrFunc = items.indicMode;
      const params = {
        id: this.enumFieldId
      };
      editTemplate(params).then(res => {
        if (res.data.code === 200) {
          if (this.templaterOrFunc === 'TEMPLATE_VAR') { // 编辑模板指标
            this.queryAppList(); // 获取应用列表数组
            this.editItemData = res.data.data;
            findTemplateGroup().then(res => {
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  this.tempGroupItem = res.data.data;
                  this.tempGroupItem.forEach((tempGroupItemItem, tempGroupItemIndex, tempGroupItemAry) => {
                    if (tempGroupItemItem.id === this.editItemData.tmplGroupId) {
                      this.secondIsActiveCopy = tempGroupItemIndex;
                      this.secondIsActive = tempGroupItemIndex; // 添加弹框中第一步的左侧列表的第几项添加背景色
                    }
                  });
                }
              }
            });
            const templaterNameParams = { tmplGroupId: this.editItemData.tmplGroupId };
            getTemplate(templaterNameParams).then(res => {
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  this.tempNameItem = res.data.data;
                  this.tempNameItem.forEach((item, index, ary) => {
                    if (this.editItemData.tmplId === item.id) { // 这个是最初写的
                      this.secondIsActiveRight = index; // 添加弹框中右侧列表选中的第几项
                      this.secondIsActiveRightCopy = index; // 添加弹框中右侧列表选中的第几项（copy）
                      this.templateOrFuncName = item.tempName;
                      this.templateOrFuncComment = item.comment;
                      this.tempNameId = item.id;
                      this.tmplId = item.id;
                      this.tempNameTempCopy = Object.assign({}, item);
                      const pm = {
                        templateId: items.id,
                        indicMode: this.editItemData.indicMode
                      };
                      getApiTemlaterStructure(pm)
                        .then(res => {
                          if (res.data.code === 200) {
                            this.templateParameter = res.data.data;
                            this.getFiltrationObj();
                            this.optionsValues = [];
                            const tempConst = JSON.parse(this.editItemData.indicatorsParam)
                              .methods[0].parameters;
                            const optionsValues = [];
                            this.channelTrade = [];
                            this.channelTrade = JSON.parse(this.editItemData.indicatorsParam)
                              .methods[0].channelTrade;
                            this.baseGetFieldNameList('sys_trade_type'); // 适用交易数组
                            this.baseGetFieldNameList('sys_channel_type'); // 适用渠道数组
                            // 回显适用渠道
                            this.properChannelsParamValue = this.channelTrade[0].value.value;
                            if (this.channelTrade[1].value.value.length) {
                              this.properChannelsSecondSelectShow = true;
                              this.properChannelsSecondSelectParamValue = this.channelTrade[1].value.value.split(',');
                            } else {
                              this.properChannelsSecondSelectShow = false;
                              this.properChannelsSecondSelectParamValue = [];
                            }
                            // 回显适用交易
                            this.UsingTradeParamValue = this.channelTrade[2].value.value;
                            // 判断适用交易的二级select的值是否为空。如果有值，就根据适用渠道以及适用渠道二级select的值来展示出此select
                            if (this.channelTrade[3].value.id) {
                              let jsonid = [];
                              let parms = {};
                              this.UsingTradeSecondSelectShow = true;
                              if (this.channelTrade[1].value.value.length) { // 判断适用交易的二级select是否有值
                                jsonid = this.channelTrade[1].value.id.split(',');
                                parms.appIds = JSON.stringify(jsonid);
                                this.getTransactionSecondSelectAryEdit(parms);
                              } else {
                                jsonid.push('1c36520fd2a042ccb9dcbaa5184c7114');
                                parms.appIds = JSON.stringify(jsonid);
                                this.getTransactionSecondSelectAryEdit(parms);
                              }
                            } else {
                              this.UsingTradeSecondSelectShow = false;
                              this.UsingTradeSecondSelectParamValue = [];
                              this.UsingTradeSecondClassArr = [];
                            }

                            tempConst.forEach((i, x, a) => {
                              if (i.src === '31') {
                                optionsValues.push(i.value.value);
                              } else {
                                optionsValues.push(i.value);
                              }
                            });
                            this.optionsValues = optionsValues;
                            this.tempNameTemp = item;
                            this.tempPath = item.tempPath;
                            this.getFilterCondition(JSON.parse(this.editItemData.indicatorsParam).filterCondition);
                            this.radios = JSON.parse(this.editItemData.indicatorsParam)
                              .logicalRelationship;
                            this.customizeConfig = JSON.parse(this.editItemData.indicatorsParam)
                              .customizeConfig;
                          } else {
                            this.baseEmptyPopUp(res);
                          }
                        }).catch(err => console.error(err));
                    }
                  });
                } else {
                  this.tempNameItem = [];
                  this.templateParameter = [];
                }
              }
            });
          } else if (this.templaterOrFunc === 'METHOD_VAR') { // 编辑方法指标
            const parms = {
              content: ''
            };
            this.editItemData = res.data.data;
            groupQuery(parms).then(res => {
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  res.data.data.forEach((item, index, ary) => {
                    ary[index].templateName = item.methodType;
                  });
                  this.tempGroupItem = res.data.data;
                  this.tempGroupItem.forEach((tempGroupItemItem, tempGroupItemIndex, tempGroupItemAry) => {
                    if (tempGroupItemItem.id === this.editItemData.tmplGroupId) {
                      this.secondIsActiveCopy = tempGroupItemIndex;
                      this.secondIsActive = tempGroupItemIndex; // 添加弹框中第一步的左侧列表的第几项添加背景色
                    }
                  });
                  const templaterNameParams = { tmplGroupId: this.editItemData.tmplGroupId };
                  methodQuery(templaterNameParams).then(res => {
                    if (res.data.code === 200) {
                      if (res.data.data.length > 0) {
                        res.data.data.forEach((item, index, ary) => {
                          ary[index].tempName = item.mthodName;
                        });
                        this.tempNameItem = res.data.data;
                        this.tempNameItem.forEach((item, index, ary) => {
                          if (this.editItemData.tmplId === item.id) { // 这个是最初写的
                            this.secondIsActiveRight = index; // 添加弹框中右侧列表选中的第几项
                            this.secondIsActiveRightCopy = index; // 添加弹框中右侧列表选中的第几项（copy）
                            this.templateOrFuncName = item.tempName;
                            this.templateOrFuncComment = item.comment;
                            this.tempNameId = item.id;
                            this.tmplId = item.id;
                            this.tempNameTempCopy = Object.assign({}, item);
                            const pm = {
                              templateId: items.id,
                              indicMode: this.editItemData.indicMode
                            };
                            getApiTemlaterStructure(pm)
                              .then(res => {
                                if (res.data.code === 200) {
                                  if (res.data.data.length > 0) {
                                    this.templateParameter = res.data.data;
                                    this.optionsValues = [];
                                    const tempConst = JSON.parse(this.editItemData.indicatorsParam)
                                      .methods[0].parameters;
                                    const optionsValues = [];
                                    this.getFilterCondition(JSON.parse(this.editItemData.indicatorsParam).filterCondition);
                                    this.radios = JSON.parse(this.editItemData.indicatorsParam)
                                      .logicalRelationship;
                                    this.customizeConfig = JSON.parse(this.editItemData.indicatorsParam)
                                      .customizeConfig;
                                    this.channelTrade = [];
                                    this.channelTrade = JSON.parse(this.editItemData.indicatorsParam)
                                      .methods[0].channelTrade;
                                    tempConst.forEach((i, x, a) => {
                                      if (i.src === '31') {
                                        optionsValues.push(i.value.value);
                                      } else {
                                        optionsValues.push(i.value);
                                      }
                                    });
                                    this.optionsValues = optionsValues;
                                    this.tempNameTemp = item;
                                    this.tempPath = item.tempPath;
                                  } else {
                                    this.templateParameter = [];
                                  }
                                } else {
                                  this.baseEmptyPopUp(res);
                                }
                              }).catch(err => console.error(err));
                          }
                        });
                      } else {
                        this.tempNameItem = [];
                        this.templateParameter = [];
                      }
                    }
                  }).catch(err => console.error(err));
                } else {
                  this.tempGroupItem = [];
                }
              }
            });
          }
        } else {
          this.baseEmptyPopUp(res);
        }
      }).catch(err => console.error(err));
    },
    // 编辑时，给公共的this.copyOptions  赋值
    getFilterCondition (filterCondition) {
      filterCondition.forEach((filterConditionIm, filterConditionIx, filterConditionAy) => {
        if (filterConditionIm.enName === 'JUDGE') {
          filterConditionIm.parameters.forEach((filterConditionImItem, filterConditionImIndex, filterConditionImAry) => {
            if (filterConditionImItem.enName === 'filterObject') {
              this.copyOptions = filterConditionImItem.options;
            }
          });
        }
      });
      this.filterCondition = filterCondition;
    },
    // 点击指标模板名称
    tempNameClick (e, i) {
      this.$nextTick(() => {
        this.secondIsActiveRight = i;
        this.templateOrFuncName = e.tempName;
        this.templateOrFuncComment = e.comment;
        this.tempNameTemp = e;
        this.tempPath = e.tempPath;
        this.tempNameId = this.tempNameTemp.id;
      });
    },
    // 点击指标模板分组
    tempGroupClick (e, i) {
      this.secondIsActive = i;
      this.tempGroupId = e.id;
      // 点击的时候显示模板名称
      this.getTemplate(); // 获取下一步的内容
    },
    // 深拷贝 深克隆
    deepClone (target) {
      // 定义一个变量
      let result;
      // 如果当前需要深拷贝的是一个对象的话
      if (typeof target === 'object') {
      // 如果是一个数组的话
        if (Array.isArray(target)) {
          result = []; // 将result赋值为一个数组，并且执行遍历
          for (let i in target) {
            // 递归克隆数组中的每一项
            result.push(this.deepClone(target[i]));
          }
        // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
          result = null;
        // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
          result = target;
        } else {
        // 否则是普通对象，直接for in循环，递归赋值对象的所有值
          result = {};
          for (let i in target) {
            result[i] = this.deepClone(target[i]);
          }
        }
      // 如果不是对象的话，就是基本数据类型，那么直接赋值
      } else {
        result = target;
      }
      // 返回最终结果
      return result;
    },
    // 添加指标----保存按钮
    createIndicators () {
      const copyS = this.deepClone(this.optionsValues);
      copyS.forEach((item, index, ary) => {
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
      copyS.forEach((item, index, ary) => {
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
        tempObj[index].value = copyS[index];
        tempObj[index].src = item.paramSrc;
        tempObj[index].dataType = item.dataType;
      });
      this.channelTrade = [];
      if (this.templaterOrFunc === 'TEMPLATE_VAR') {
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
        if (this.properChannelsSecondSelectShow) { // 此为复选框时的数据结构
          let nameAry = [];
          let idAry = [];
          this.channelTypeSecondClassArr.forEach((item, index, ary) => {
            this.properChannelsSecondSelectParamValue.forEach((im, ix, ay) => {
              if (im === item.appTag) {
                nameAry.push(item.name);
                idAry.push(item.id);
              }
            });
          });
          this.channelTrade.push({
            cnName: '应用标识',
            enName: 'appid',
            index: 1,
            type: null,
            value: {
              name: nameAry.toString(),
              id: idAry.toString(),
              value: this.properChannelsSecondSelectParamValue.toString(),
              srcType: 'APP_VAR'
            },
            dataType: 'String'
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
              srcType: 'APP_VAR'
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
                srcType: 'TRADETYPE_VAR'
              },
              dataType: 'String'
            });
          }
        });
        if (this.UsingTradeSecondSelectShow) {
          let nameAry = [];
          let idAry = [];
          this.UsingTradeSecondClassArr.forEach((item, index, ary) => {
            this.UsingTradeSecondSelectParamValue.forEach((im, ix, ay) => {
              if (im === item.value) {
                nameAry.push(item.name);
                idAry.push(item.id);
              }
            });
          });
          this.channelTrade.push({
            cnName: '交易类型',
            enName: 'opType',
            index: 3,
            type: null,
            value: {
              name: nameAry.toString(),
              id: idAry.toString(),
              value: this.UsingTradeSecondSelectParamValue.toString(),
              srcType: 'TRADETYPE_VAR'
            },
            dataType: 'String'
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
              srcType: 'TRADETYPE_VAR'
            },
            dataType: 'String'
          });
        }
      }
      const methods = [
        {
          cnName: e.tempName,
          enName: e.tempName,
          parameters: tempObj,
          channelTrade: this.channelTrade
        }
      ];
      if (this.filterCondition.length > 0) {
        this.filterCondition.forEach((filterConditionItem, filterConditionIndex, filterConditionAry) => {
          // 增加过滤条件每一项的标识
          filterConditionAry[filterConditionIndex].filterSign = String.fromCharCode(64 + parseInt(filterConditionIndex + 1));
          // 当value值为字符串时，改变为对象
          filterConditionItem.parameters.forEach((i, x, ay) => {
            if (i.src === 'inputOrSrcList' || i.src === '31') { // 输入型select
              if (typeof i.value === 'string') {
                i.value = {
                  dataType: 'String',
                  value: i.value,
                  id: i.value,
                  name: i.value,
                  srcType: 'INPUT'
                };
              }
            } else if (i.src === '下拉框') { // select
              if (typeof i.value === 'string') {
                i.options.forEach((optionsItem, optionsIndex, optionsAry) => {
                  if (i.value === optionsItem.id) {
                    i.value = optionsItem;
                  }
                });
              }
            }
            delete i.options;
          });
        });
      };
      if (this.filterConditionCalculate.length > 0) {
        this.filterConditionCalculate.forEach((filterConditionItem, filterConditionIndex, filterConditionAry) => {
          // 增加过滤条件每一项的标识
          filterConditionAry[filterConditionIndex].filterSign = String.fromCharCode(64 + parseInt(filterConditionIndex + 1));
          // 当value值为字符串时，改变为对象
          filterConditionItem.parameters.forEach((i, x, ay) => {
            if (i.src === 'inputOrSrcList' || i.src === '31') { // 输入型select
              if (typeof i.value === 'string') {
                i.value = {
                  dataType: 'String',
                  value: i.value,
                  id: i.value,
                  name: i.value,
                  srcType: 'INPUT'
                };
              }
            } else if (i.src === '下拉框') { // select
              if (typeof i.value === 'string') {
                i.options.forEach((optionsItem, optionsIndex, optionsAry) => {
                  if (i.value === optionsItem.id) {
                    i.value = optionsItem;
                  }
                });
              }
            }
            delete i.options;
          });
        });
      };
      const indicatorsParam = JSON.stringify({
        clazz: e.tempName,
        id: e.tempName,
        filterCondition: this.filterCondition,
        logicalRelationship: this.radios,
        customizeConfig: this.customizeConfig,
        methods: methods
      });
      const params = {
        indicName: this.indicatorsName,
        groupId: this.enumeId,
        tmplGroupId: this.tempGroupId,
        tmplId: this.tmplId,
        indicatorsParam: indicatorsParam,
        indicType: this.templaterOrFunc === 'TEMPLATE_VAR' ? this.channelTrade[0].value.name + this.channelTrade[2].value.name : '',
        indicMode: this.templaterOrFunc
      };
      createIndicators(params).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          setTimeout(() => {
            this.$refs.tempInstru_form.reset();
            this.$refs.header_form.reset();
            window.sessionStorage.setItem('backCalcindexBase', 2);
            this.templateParameter = [];
            this.filterCondition = [];
            this.$router.push({
              path: '/calcIndexBase',
              name: 'calcIndexBase',
              params: this.$route.params
            });
          }, 2000);
        } else {
          this.btnLoading = false;
          this.dialog_fil = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 编辑的保存
    updateIndicators () {
      const copyS = this.deepClone(this.optionsValues);
      copyS.forEach((item, index, ary) => {
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
      copyS.forEach((item, index, ary) => {
        if (item && !item.srcType) {
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
        tempObj[index].value = copyS[index];
        tempObj[index].src = item.paramSrc;
        tempObj[index].dataType = item.dataType;
      });
      this.channelTrade = [];
      if (this.templaterOrFunc === 'TEMPLATE_VAR') {
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
        if (this.properChannelsSecondSelectShow) { // 此为复选框时的数据结构
          let nameAry = [];
          let idAry = [];
          this.channelTypeSecondClassArr.forEach((item, index, ary) => {
            this.properChannelsSecondSelectParamValue.forEach((im, ix, ay) => {
              if (im === item.appTag) {
                nameAry.push(item.name);
                idAry.push(item.id);
              }
            });
          });
          this.channelTrade.push({
            cnName: '应用标识',
            enName: 'appid',
            index: 1,
            type: null,
            value: {
              name: nameAry.toString(),
              id: idAry.toString(),
              value: this.properChannelsSecondSelectParamValue.toString(),
              srcType: 'APP_VAR'
            },
            dataType: 'String'
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
              srcType: 'APP_VAR'
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
                srcType: 'TRADETYPE_VAR'
              },
              dataType: 'String'
            });
          }
        });
        if (this.UsingTradeSecondSelectShow) {
          let nameAry = [];
          let idAry = [];
          this.UsingTradeSecondClassArr.forEach((item, index, ary) => {
            this.UsingTradeSecondSelectParamValue.forEach((im, ix, ay) => {
              if (im === item.value) {
                nameAry.push(item.name);
                idAry.push(item.id);
              }
            });
          });
          this.channelTrade.push({
            cnName: '交易类型',
            enName: 'opType',
            index: 3,
            type: null,
            value: {
              name: nameAry.toString(),
              id: idAry.toString(),
              value: this.UsingTradeSecondSelectParamValue.toString(),
              srcType: 'TRADETYPE_VAR'
            },
            dataType: 'String'
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
              srcType: 'TRADETYPE_VAR'
            },
            dataType: 'String'
          });
        }
      };
      const methods = [
        {
          cnName: e.tempName,
          enName: e.tempName,
          parameters: tempObj,
          channelTrade: this.channelTrade
        }
      ];
      // 用filterCondition的长度控制是否展示
      if (this.filterCondition.length > 0) {
        this.filterCondition.forEach((filterConditionItem, filterConditionIndex, filterConditionAry) => {
          // 增加过滤条件每一项的标识
          filterConditionAry[filterConditionIndex].filterSign = String.fromCharCode(64 + parseInt(filterConditionIndex + 1));
          // 当value值为字符串时，改变为对象
          filterConditionItem.parameters.forEach((i, x, ay) => {
            if (i.src === 'inputOrSrcList') { // 输入型select
              if (typeof i.value === 'string') {
                i.value = {
                  dataType: 'String',
                  value: i.value,
                  id: i.value,
                  name: i.value,
                  srcType: 'INPUT'
                };
              }
            } else if (i.src === '下拉框') { // select
              if (typeof i.value === 'string') {
                i.options.forEach((optionsItem, optionsIndex, optionsAry) => {
                  if (i.value === optionsItem.id) {
                    i.value = optionsItem;
                  }
                });
              }
            } else if (i.src === '31') { // 输入框
              if (typeof i.value === 'string') {
                i.value = {
                  dataType: 'String',
                  value: i.value.value,
                  id: i.value.value,
                  name: i.value.value,
                  srcType: 'INPUT'
                };
              }
            }
            delete i.options;
          });
        });
      };
      const indicatorsParam = JSON.stringify({
        clazz: e.tempName,
        id: e.tempName,
        filterCondition: this.filterCondition,
        logicalRelationship: this.radios,
        customizeConfig: this.customizeConfig,
        methods: methods
      });
      const params = {
        id: this.editItemData.id,
        indicName: this.indicatorsName,
        groupId: this.editItemData.groupId,
        tmplGroupId: this.tempGroupId,
        tmplId: this.tmplId,
        indicatorsParam: indicatorsParam,
        indicType: this.templaterOrFunc === 'TEMPLATE_VAR' ? this.channelTrade[0].value.name + this.channelTrade[2].value.name : '',
        indicMode: this.editItemData.indicMode
      };
      // return false;
      getIndicatorsById(params).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          setTimeout(() => {
            this.$refs.tempInstru_form.reset();
            this.$refs.header_form.reset();
            window.sessionStorage.setItem('backCalcindexBase', 2);
            // this.$router.push('/calcIndexBase');
            this.$router.push({
              path: '/calcIndexBase',
              name: 'calcIndexBase',
              params: this.$route.params
            });
          }, 2000);
        } else {
          this.btnLoading = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 适用渠道第一个下拉框点击事件
    properChannelsfirstChange (name) {
      if (name === 'SPECIFIED') {
        this.properChannelsSecondSelectShow = true;
      } else {
        this.properChannelsSecondSelectShow = false;
        this.properChannelsSecondSelectParamValue = [];
      }
      this.resetUsingTradeParamValue();
    },
    // 适用交易第一个下拉框点击事件
    UsingTradefirstChange (name) {
      if (name === 'SPECIFIED') {
        let jsonid = [];
        let parms = {};
        this.UsingTradeSecondSelectShow = true;
        if (this.properChannelsSecondSelectShow) { // 适用渠道中是指定渠道的情况下
          this.properChannelsSecondSelectParamValue.forEach((item, index, ary) => {
            this.channelTypeSecondClassArr.forEach((im, ix, ay) => {
              if (item === im.appTag) {
                jsonid.push(im.id);
              }
            });
          });
          parms.appIds = JSON.stringify(jsonid);
          this.UsingTradeSecondSelectParamValue = [];
          this.getTransactionSecondSelectAryAdd(parms);
        } else { // 适用渠道中不是指定渠道的情况下
          jsonid.push('1c36520fd2a042ccb9dcbaa5184c7114');
          parms.appIds = JSON.stringify(jsonid);
          this.getTransactionSecondSelectAryAdd(parms);
        }
      } else {
        this.UsingTradeSecondSelectShow = false;
        this.UsingTradeSecondSelectParamValue = [];
      }
    },
    // 添加时：根据适用渠道中选择为指定渠道时，根据二级select的值获取适用交易下二级select的值
    getTransactionSecondSelectAryAdd (parms) {
      querytradelistbyappids(parms)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length) {
              res.data.data.forEach((item, index, ary) => {
                ary[index].name = item.tradeName;
                ary[index].value = item.identifier;
              });
              this.UsingTradeSecondClassArr = res.data.data;
            } else {
              this.UsingTradeSecondClassArr = [];
              this.UsingTradeSecondSelectParamValue = [];
            }
          } else {
            this.UsingTradeSecondClassArr = [];
            this.UsingTradeSecondSelectParamValue = [];
          }
        }).catch(err => console.error(err));
    },
    // 编辑时：回显适用交易的二级select的值
    getTransactionSecondSelectAryEdit (parms) {
      querytradelistbyappids(parms)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.length) {
              res.data.data.forEach((item, index, ary) => {
                ary[index].name = item.tradeName;
                ary[index].value = item.identifier;
              });
              this.UsingTradeSecondClassArr = res.data.data;
              if (this.channelTrade[3].value.value) {
                this.UsingTradeSecondSelectParamValue = this.channelTrade[3].value.value.split(',');
              } else {
                this.UsingTradeSecondSelectParamValue = [];
              }
            } else {
              this.UsingTradeSecondClassArr = [];
              this.UsingTradeSecondSelectParamValue = [];
            }
          } else {
            this.UsingTradeSecondClassArr = [];
            this.UsingTradeSecondSelectParamValue = [];
          }
        }).catch(err => console.error(err));
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
        response.data.data.forEach((item, index, ary) => {
          ary[index].name = item.appName;
          ary[index].value = item.appTag;
        });
        this.channelTypeSecondClassArr = response.data.data;
      } catch (error) {}
    },
    // 适用渠道二级下拉框change事件
    properChannelsSecondSelectChange (val) {
      if (!this.channelTypeSecondClassArr.length) {
        this.baseEmptyPopUp('适用渠道不能为空！！！');
      }
      this.resetUsingTradeParamValue();
    },
    // 公共增加name和value
    baseAddNameOrValue (array) {
      array.forEach((item, index, ary) => {
        ary[index].name = item.paramName;
        ary[index].value = item.paramValue;
      });
    },
    // 获取适用渠道以及适用渠道二级select的数组和适用交易
    async baseGetFieldNameList (data) {
      const parms = {
        identifier: data
      };
      try {
        const res = await getFieldNameList(parms);
        if (res.data.code === 200) {
          if (res.data.data.length > 0) {
            if (data === 'sys_trade_type') { // 适用交易数组
              this.UsingTradeFirstClassArr = res.data.data;
              if (this.fflag === '1') {
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
              if (this.fflag === '1') {
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
          this.baseEmptyPopUp(res);
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      };
    },
    // 过滤条件下---条件类型change事件
    conditionTypeChange (value, item) {
      this.$nextTick(() => {
        this.newTime = new Date().getTime();
        if (this.fflag === '2') {
          const pm = {
            indicId: '',
            filterObject: '',
            filterType: value
          };
          searchFilterTypeTemplate(pm)
            .then(res => {
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  res.data.data.forEach((dataItem, dataIndex, dataAry) => {
                    if (dataItem.src === '31') {
                      dataItem.value = {
                        dataType: 'String',
                        value: '',
                        id: dataItem.value,
                        name: dataItem.value,
                        srcType: 'INPUT'
                      };
                    }
                  });
                  if (value === 'JUDGE') {
                    res.data.data.forEach(parametersDataItem => {
                      if (parametersDataItem.cnName === '过滤对象') {
                        parametersDataItem.comment = "示例：'银行卡账户类别'，判断型过滤的主体，可以是变量、指标";
                      } else if (parametersDataItem.cnName === '运算符') {
                        parametersDataItem.comment = "示例：'='，将过滤对象与值进行对比判断，涵盖常用运算符";
                      } else if (parametersDataItem.cnName === '值') {
                        parametersDataItem.comment = "示例： '一类账户'，与过滤对象进行对比判断，一般为数字";
                      }
                    });
                  } else if (value === 'COMPARE') {
                    res.data.data.forEach((parametersDataItem, parametersDataIndex, parametersDataAry) => {
                      if (parametersDataItem.cnName === '过滤对象' && parametersDataIndex === 0) {
                        parametersDataItem.comment = "示例：'入账人姓名'，判断型过滤的主体，可以是变量、指标";
                      } else if (parametersDataItem.cnName === '运算符') {
                        parametersDataItem.comment = "示例：'≠'，将主体过滤对象和客体过滤对象进行对比，涵盖常用运算符";
                      } else if (parametersDataItem.cnName === '过滤对象' && parametersDataIndex === 2) {
                        parametersDataItem.comment = "示例：'姓名/出账人姓名'，判断型过滤的客体，可以是变量、指标";
                      }
                    });
                  } else if (value === 'TIME_RANGE') {
                    res.data.data.forEach(parametersDataItem => {
                      if (parametersDataItem.cnName === '过滤对象') {
                        parametersDataItem.comment = "示例：'交易时间'，判断型过滤的主体跟时间范围相关（如交易时间、开户时间），可以是变量、指标";
                      } else if (parametersDataItem.cnName === '下限值') {
                        parametersDataItem.comment = "示例：'6'，时间值，支持格式：X XX:XX XX:XX:XX";
                      } else if (parametersDataItem.cnName === '上限值') {
                        parametersDataItem.comment = "示例：'0'，时间值，支持格式：X XX:XX XX:XX:XX";
                      }
                    });
                  } else if (value === 'INTERVAL_JUDGMENT') {
                    res.data.data.forEach(parametersDataItem => {
                      if (parametersDataItem.cnName === '过滤对象') {
                        parametersDataItem.comment = "示例：'金额'，判断型过滤的主体跟时间范围相关（如交易时间、开户时间），可以是变量、指标";
                      } else if (parametersDataItem.cnName === '下限值') {
                        parametersDataItem.comment = "示例：'1000'，数值";
                      } else if (parametersDataItem.cnName === '上限值') {
                        parametersDataItem.comment = "示例：'5000'，数值";
                      }
                    });
                  } else if (value === 'CUSTOM') {
                    res.data.data.forEach(parametersDataItem => {
                      if (parametersDataItem.cnName === '过滤对象') {
                        parametersDataItem.comment = '';
                      }
                    });
                  }
                  item.parameters = res.data.data;
                } else {
                  item.parameters = res.data.data;
                }
              }
            }).catch(err => console.error(err));
        } else {
          const pm = {
            indicId: '',
            filterObject: '',
            filterType: value
          };
          searchFilterTypeTemplate(pm)
            .then(res => {
              if (res.data.code === 200) {
                if (res.data.data.length > 0) {
                  if (value === 'JUDGE') {
                    res.data.data.forEach(parametersDataItem => {
                      if (parametersDataItem.cnName === '过滤对象') {
                        parametersDataItem.comment = "示例：'银行卡账户类别'，判断型过滤的主体，可以是变量、指标";
                      } else if (parametersDataItem.cnName === '运算符') {
                        parametersDataItem.comment = "示例：'='，将过滤对象与值进行对比判断，涵盖常用运算符";
                      } else if (parametersDataItem.cnName === '值') {
                        parametersDataItem.comment = "示例：'一类账户'，与过滤对象进行对比判断，一般为数字";
                      }
                    });
                  } else if (value === 'COMPARE') {
                    res.data.data.forEach((parametersDataItem, parametersDataIndex, parametersDataAry) => {
                      if (parametersDataItem.cnName === '过滤对象' && parametersDataIndex === 0) {
                        parametersDataItem.comment = "示例：'入账人姓名'，判断型过滤的主体，可以是变量、指标";
                      } else if (parametersDataItem.cnName === '运算符') {
                        parametersDataItem.comment = "示例：'≠'，将主体过滤对象和客体过滤对象进行对比，涵盖常用运算符";
                      } else if (parametersDataItem.cnName === '过滤对象' && parametersDataIndex === 2) {
                        parametersDataItem.comment = "示例：'姓名/出账人姓名'，判断型过滤的客体，可以是变量、指标";
                      }
                    });
                  } else if (value === 'TIME_RANGE') {
                    res.data.data.forEach(parametersDataItem => {
                      if (parametersDataItem.cnName === '过滤对象') {
                        parametersDataItem.comment = "示例：'交易时间'，判断型过滤的主体跟时间范围相关（如交易时间、开户时间），可以是变量、指标";
                      } else if (parametersDataItem.cnName === '下限值') {
                        parametersDataItem.comment = "示例：'6'，时间值，支持格式：X XX:XX XX:XX:XX";
                      } else if (parametersDataItem.cnName === '上限值') {
                        parametersDataItem.comment = "示例：'0'，时间值，支持格式：X XX:XX XX:XX:XX";
                      }
                    });
                  } else if (value === 'INTERVAL_JUDGMENT') {
                    res.data.data.forEach(parametersDataItem => {
                      if (parametersDataItem.cnName === '过滤对象') {
                        parametersDataItem.comment = "示例：'金额'，判断型过滤的主体跟时间范围相关（如交易时间、开户时间），可以是变量、指标";
                      } else if (parametersDataItem.cnName === '下限值') {
                        parametersDataItem.comment = "示例：'1000'，数值";
                      } else if (parametersDataItem.cnName === '上限值') {
                        parametersDataItem.comment = "示例：'5000'，数值";
                      }
                    });
                  } else if (value === 'CUSTOM') {
                    res.data.data.forEach(parametersDataItem => {
                      if (parametersDataItem.cnName === '过滤对象') {
                        parametersDataItem.comment = '';
                      }
                    });
                  }
                  item.parameters = res.data.data;
                } else {
                  item.parameters = [];
                }
              }
            },
            err => {
              this.snackbarServe = true;
              this.snackbarServeMsg = err.msg;
              this.snackbarServeColor = 'error';
            });
        }
      });
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
        const parms = {
          identifier: 'sys_filter_conditions'
        };
        getFieldNameList(parms)
          .then(res => {
            if (res.data.code === 200) {
              if (res.data.data.length > 0) {
                res.data.data.forEach((item, index, ary) => {
                  ary[index].text = item.paramName;
                  ary[index].value = item.paramValue;
                });
                this.filterTypeItem = res.data.data;
                const pm = {
                  indicId: '',
                  filterObject: '',
                  filterType: 'JUDGE'
                };
                searchFilterTypeTemplate(pm)
                  .then(res => {
                    if (res.data.code === 200) {
                      if (res.data.data.length > 0) {
                        res.data.data.forEach(parametersDataItem => {
                          if (parametersDataItem.cnName === '过滤对象') {
                            parametersDataItem.comment = "示例：'银行卡账户类别'，判断型过滤的主体，可以是变量、指标";
                          } else if (parametersDataItem.cnName === '运算符') {
                            parametersDataItem.comment = "示例：'='，将过滤对象与值进行对比判断，涵盖常用运算符";
                          } else if (parametersDataItem.cnName === '值') {
                            parametersDataItem.comment = "示例： '一类账户'，与过滤对象进行对比判断，一般为数字";
                          }
                        });
                        res.data.data.forEach((item, index, ary) => {
                          if (item.enName === 'filterObject') {
                            this.copyOptions = item.options;
                          }
                        });
                        this.filterCondition.push(
                          {
                            cnName: '条件类型',
                            enName: 'JUDGE',
                            id: this.generateUUID(),
                            parameters: res.data.data
                          }
                        );
                      } else {
                        this.filterCondition.push(
                          {
                            cnName: '条件类型',
                            enName: 'JUDGE',
                            id: this.generateUUID(),
                            parameters: res.data.data
                          }
                        );
                      }
                    }
                  },
                  err => {
                    if (err.msg) {
                      this.snackbarServe = true;
                      this.snackbarServeMsg = err.msg;
                      this.snackbarServeColor = 'error';
                    }
                  });
              } else {
                this.filterTypeItem = [];
              }
            }
          },
          err => {
            if (err.msg) {
              this.snackbarServe = true;
              this.snackbarServeMsg = err.msg;
              this.snackbarServeColor = 'error';
            }
          });
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
        }).catch(err => console.error(err));
    },
    // 获取过滤条件--判断型、对比性、、、、
    getFilterType () {
      const parms = {
        identifier: 'sys_filter_conditions'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // this.__mInit();
            if (res.data.data.length > 0) {
              res.data.data.forEach((item, index, ary) => {
                item.text = item.paramName;
                item.value = item.paramValue;
              });
              this.filterTypeItem = res.data.data;
            } else {
              this.filterTypeItem = [];
            }
          }
        }).catch(err => console.error(err));
    },
    // 业务变量库所有字段的数组
    getQueryallfield () {
      const parms = {
        isContainEnum: '0'
      };
      getQueryallfield(parms)
        .then(res => {
          if (res.data.code === 200) {
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
        }).catch(err => console.error(err));
    },
    // 随机生成一个id
    generateUUID () {
      const s = [];
      const hexDigits = '0123456789abcdefghijklmnpqrst';
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-';

      const uuid = s.join('');
      return uuid.split('-').join('').slice(0, 16);
    },
    cancleAdd () {
      if (this.tempNameItem.length > 0) {
        this.secondIsActive = this.secondIsActiveCopy;
        this.secondIsActiveRight = this.secondIsActiveRightCopy;
        this.tempNameTemp = this.tempNameTempCopy;
        this.tempGroupId = this.tempGroupItem[this.secondIsActive].id;
        this.tempNameId = this.tempNameTemp.id;
        this.tmplId = this.tempNameTemp.id;
        this.templateOrFuncName = this.tempNameTemp.tempName;
        this.templateOrFuncComment = this.tempNameTemp.comment;
      }
      this.addDialog = false;
    },
    // 添加确定按钮
    addSave () {
      if (this.tempNameId === '') {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请选择模板名称';
        this.snackbarServeColor = 'error';
      } else {
        this.$nextTick(() => {
          const params = {
            templateId: this.tempNameTemp.id,
            indicMode: this.templaterOrFunc
          };
          this.tmplId = this.tempNameTemp.id;
          this.tempNameId = this.tempNameTemp.id;
          getApiTemlaterStructure(params)
            .then(res => {
              if (res.data.code === 200) {
                this.tempNameTempCopy = this.tempNameTemp;
                this.secondIsActiveCopy = this.secondIsActive;
                this.secondIsActiveRightCopy = this.secondIsActiveRight;
                // this.__mInit();
                if (res.data.data.length > 0) {
                  this.newTime = new Date().getTime();
                  this.baseFromReset(this.$refs.tempInstru_form);
                  this.templateParameter = [];
                  this.templateParameter = res.data.data;
                  this.optionsValues = [];
                  for (let i = 0; i < res.data.data.length; i++) {
                    this.optionsValues.push('');
                  }
                  if (this.templaterOrFunc === 'TEMPLATE_VAR') {
                    this.$nextTick(() => {
                      this.radios = 'and';
                    });
                  }
                  this.getFiltrationObj();
                  this.addDialog = false;
                } else {
                  this.templateParameter = [];
                  this.addDialog = false;
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
        });
      }
    },
    // 计算过滤条件----添加
    addFilterConditionCalculate () {
      this.$nextTick(() => {
        const parms = {
          identifier: 'sys_filter_conditions'
        };
        getFieldNameList(parms)
          .then(res => {
            if (res.data.code === 200) {
              if (res.data.data.length > 0) {
                res.data.data.forEach((item, index, ary) => {
                  ary[index].text = item.paramName;
                  ary[index].value = item.paramValue;
                });
                this.filterTypeItem = res.data.data;
                const pm = {
                  indicId: '',
                  filterObject: '',
                  filterType: 'JUDGE'
                };
                searchFilterTypeTemplate(pm)
                  .then(res => {
                    if (res.data.code === 200) {
                      if (res.data.data.length > 0) {
                        this.filterConditionCalculate.push(
                          {
                            cnName: '条件类型',
                            enName: 'JUDGE',
                            id: this.generateUUID(),
                            parameters: res.data.data
                          }
                        );
                      } else {
                        this.filterConditionCalculate.push(
                          {
                            cnName: '条件类型',
                            enName: 'JUDGE',
                            id: this.generateUUID(),
                            parameters: []
                          }
                        );
                      }
                    }
                  },
                  err => {
                    this.snackbarServe = true;
                    this.snackbarServeMsg = err.msg;
                    this.snackbarServeColor = 'error';
                  });
              } else {
                this.filterTypeItem = [];
              }
            }
          },
          err => {
            this.snackbarServe = true;
            this.snackbarServeMsg = err.msg;
            this.snackbarServeColor = 'error';
          });
      });
    },
    // 计算过滤条件----删除
    cancleFilterConditionCalculate (ix) {
      this.filterConditionCalculate.forEach((item, index, ary) => {
        if (index === ix) {
          this.$nextTick(() => {
            ary.splice(index, 1);
          });
        }
      });
    },
    // 计算过滤条件----条件类型的change事件
    conditionTypeChangeCalculate (value, item) {
      if (this.fflag === '2') {
        const pm = {
          indicId: '',
          filterObject: '',
          filterType: value
        };
        searchFilterTypeTemplate(pm)
          .then(res => {
            if (res.data.code === 200) {
              if (res.data.data.length > 0) {
                res.data.data.forEach((dataItem, dataIndex, dataAry) => {
                  if (dataItem.src === '31') {
                    dataItem.value = {
                      dataType: 'String',
                      value: '',
                      id: dataItem.value,
                      name: dataItem.value,
                      srcType: 'INPUT'
                    };
                  }
                });
                item.parameters = res.data.data;
              } else {
                item.parameters = res.data.data;
              }
            }
          },
          err => {
            this.snackbarServe = true;
            this.snackbarServeMsg = err.msg;
            this.snackbarServeColor = 'error';
          });
      } else {
        const pm = {
          indicId: '',
          filterObject: '',
          filterType: value
        };
        searchFilterTypeTemplate(pm)
          .then(res => {
            if (res.data.code === 200) {
              if (res.data.data.length > 0) {
                item.parameters = res.data.data;
              } else {
                item.parameters = [];
              }
            }
          },
          err => {
            this.snackbarServe = true;
            this.snackbarServeMsg = err.msg;
            this.snackbarServeColor = 'error';
          });
      }
    },
    // 过滤条件：为判断型时，过滤对象的change事件
    inputOrSrcListChange (val, index, im, conditionType) {
      if (conditionType === 'JUDGE' && im.cnName === '过滤对象') {
        for (let ix = 0; ix < im.options.length; ix++) {
          if (val && typeof val !== 'string' && val.name === im.options[ix].name && im.options[ix].srcType === 'BUSINESS_VAR' && im.options[ix].isEnumeration === '1') {
            const parms = {
              groupName: val.name,
              classPath: val.value
            };
            getenumeration(parms)
              .then(res => {
                if (res.data.code === 200) {
                  this.filterCondition[index].parameters[2].options = res.data.data.enumList;
                }
              }).catch(err => console.error(err));
            break;
          } else if (val && typeof val === 'string' && val === im.options[ix].id && im.options[ix].srcType === 'BUSINESS_VAR' && im.options[ix].isEnumeration === '1') {
            const parms = {
              groupName: im.options[ix].name,
              classPath: im.options[ix].value
            };
            getenumeration(parms)
              .then(res => {
                if (res.data.code === 200) {
                  this.filterCondition[index].parameters[2].options = res.data.data.enumList;
                }
              }).catch(err => console.error(err));
            break;
          } else {
            this.filterCondition[index].parameters[2].options = this.copyOptions;
          }
        }
      }
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
  margin-left: 14px;
  cursor: pointer;
  display: inline-block;
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
  text-align: left;
}
.group-temp .activeUserDef{
  color: var(--v-primary-base) !important;
}
#temps .v-radio{
  height:48px;
  margin-right: 20px;
  margin-left:10px;
  border-bottom: 1px solid var(--v-tableRowHoverActive-base);
}
#temps  .v-input__control{
  width:100%;
  height:auto
}
.v-dialog > .v-card > .v-card__title {
  padding: 15px 0 15px 11px;
  font-size: 14px;
}
v-dialog > .v-card > .v-card__title .v-toolbar__title {
  font-size: 14px !important;
}
.v-input--radio-group--column .v-radio:not(:last-child):not(:only-child) {
  margin-bottom: 0;
}
.v-input--selection-controls {
  margin-top: 0;
  padding-top: 0;
}
.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border-color: #D9D9D9;
}
.tempGroupTableTr {
  color: #26344B;
}
.calculateIndexDetails_searchIcon .theme--light.mdi-magnify {
  color: #4473DA;
}
#temps {
  height: 400px;
  overflow: auto;
}
#temps .v-radio .mdi:before {
  font-size: 18px;
}
#temps .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner,
#calculateIndexDetails_tempGroup .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
  margin-top: 4px;
}
#temps .v-radio .v-input--selection-controls__ripple {
  color: #4473DA;
}
#temps .v-radio .v-label {
  padding-left: 46px !important;
  color: #333333;
}
#temps .v-text-field--outlined.v-input--dense.v-text-field--outlined > .v-input__control > .v-input__slot {
  min-height: 30px !important;
}
#temps .v-text-field--outlined.v-input--dense .v-label {
  top: 7px;
}
#calculateIndexDetails_tempGroup {
  height: 400px;
  overflow: auto;
}
#calculateIndexDetails_tempGroup .v-input--hide-details > .v-input__control > .v-input__slot {
  height: 30px;
}
#calculateIndexDetails_tempGroup .v-text-field {
  margin-top: 0;
}
#calculateIndexDetails_tempGroup .v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
  height: 30px;
}
#calculateIndexDetails_tempGroup .v-data-table td {
  padding: 0;
}
.base_h3_color {
  color: rgba(0, 0, 0, 0.87) !important;
}
#calculateIndexDetails .base_label_div {
  height: 40px;
  line-height: 40px;
  width: 100px;
  margin-left: 40px;
}
#calculateIndexDetails .base_content_div {
  width: 26%;
  padding-bottom: 22px;
  /* margin-left: 10px; */
}
#calculateIndexDetails .base_item_label_name {
  width: 100px;
  height: 40px;
  line-height: 40px;
  margin-left: 16px;
}
#calculateIndexDetails .base_item_name {
  height: 40px;
  line-height: 40px;
}
#calculateIndexDetails .base_inline_block {
  display: inline-block;
}
.ruleSetAddOrEdit .v-input__control {
  height: auto !important;
}
.ruleSetAddOrEdit .v-input__control .v-text-field__details {
  margin: 0;
  /* min-height: 0; */
  /* max-height: 0; */
}
/* // 适用渠道和适用交易中多选款选择多个时，自适应高度 */
.ruleSetAddOrEdit >>> .v-input__control {
  height: auto !important;
}
/* // 适用渠道和适用交易中多选款选择多个时，自适应高度，删除多余的样式 */
.ruleSetAddOrEdit >>> .v-text-field__details {
  min-height: 0;
  margin: 0;
}
/* // 适用渠道和适用交易中多选款选择多个时，自适应高度，删除多余的样式 */
.ruleSetAddOrEdit >>> .v-messages {
  min-height: 0;
}
.templateBtnFixed {
  /* position: fixed;
  bottom: calc(100vh - (100vh - 506px)/2 - 506px);
  right: calc(100% - (100% - 800px)/2 - 800px); */
  position: absolute;
  bottom: 0px;
  right: 10px;
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
.indicatorsNameStyle.v-text-field .v-input__control .v-input__slot fieldset{
  border: 0px !important;
}
.indicatorsNameStyle.theme--light.v-input:not(.v-input--is-disabled) input, .theme--light.v-input:not(.v-input--is-disabled) textarea{
  color: rgba(0, 0, 0, 0.38);
}
.indicatorsNameStyle.v-text-field.v-text-field--enclosed:not(.v-text-field--rounded) > .v-input__control > .v-input__slot{
  border: 1px solid rgba(0, 0, 0, 0.18);
}
</style>
