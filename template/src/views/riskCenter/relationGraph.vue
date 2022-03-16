<template>
  <div>
    <!-- 搜索表单 -->
    <base-search
      :fieldList="searchForm"
      @search="search($event)"
      @reset="resetSearchData($event)"
      :clearDate="clearDate"
      @change="panelCounter"
      @onHandleChange="onHandleChange($event)"
    ></base-search>
    <!-- 点击节点后的弹窗 -->
    <v-dialog v-model="dialog" persistent scrollable max-width="950px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            节点详情
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn icon dark @click="dialog = false">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-list three-line>
            <v-list-item style="min-height: 35px;">
              <v-list-item-content>
                <v-list-item-title
                  class="itemblack"
                  @mouseenter="enterlist(detailsNode.key, 20, $event, detailsNode.vertex_type_code)"
                  @mouseleave="leavelist()"
                  >节点值：
                  <span class="pointers">{{ detailsNode.key }} </span>
                  <span
                    @click="addBlackList(detailsNode.key, detailsNode.vertex_type_code)"
                    v-if="showList == 20"
                    class="blacks"
                    >加入黑名单</span
                  >
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title
                  >节点类型：{{ detailsNode.vertex_type }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="min-height: 35px;">
              <v-list-item-content>
                <v-list-item-title
                  >是否核心节点：{{
                    detailsNode.if_core_vertex
                  }}</v-list-item-title
                >
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title
                  >距离核心节点距离：{{
                    detailsNode.from_core_vertex_dst
                  }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="min-height: 35px;">
              <v-list-item-content>
                <v-list-item-title
                  >是否风险节点：{{
                    detailsNode.if_risk_vertex
                  }}</v-list-item-title
                >
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title
                  >距离风险节点距离：{{
                    detailsNode.from_risk_vertex_dst
                  }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item
              style="min-height: 35px;font-size:13px;font-weight:bold;"
            >
              <v-list-item-content>
                <v-list-item-title>一度关联</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- 节点类型=ip -->
            <div
              v-if="
                detailsNode.vertex_type != '手机号' &&
                  detailsNode.vertex_type != '设备'
              "
              style="font-size:13px;"
            >
              <v-list-item style="min-height: 35px;">
                <v-list-item-content>
                  <v-list-item-title
                    class="itemblack"
                    @mouseenter="enterlist(detailsNode.order_1st_devfp_num, 1, $event, 'devfp')"
                    @mouseleave="leavelist()"
                    >关联设备节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_devfp_set,
                          detailsNode.order_1st_devfp_num
                        )
                      "
                      >{{ detailsNode.order_1st_devfp_num }}</span
                    >
                    <span
                      @click="addBlackList(detailsNode.order_1st_devfp_set, 'devfp')"
                      v-if="showList == 1"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title
                    @mouseenter="
                      enterlist(detailsNode.order_1st_risk_devfp_num, 2, $event, 'devfp')
                    "
                    @mouseleave="leavelist()"
                    >关联风险设备节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_risk_devfp_set,
                          detailsNode.order_1st_risk_devfp_num
                        )
                      "
                      >{{ detailsNode.order_1st_risk_devfp_num }}</span
                    >
                    <span
                      @click="
                        addBlackList(detailsNode.order_1st_risk_devfp_set, 'devfp')
                      "
                      v-if="showList == 2"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height: 35px;">
                <v-list-item-content>
                  <v-list-item-title
                    @mouseenter="enterlist(detailsNode.order_1st_phone_num, 3, $event, 'phone')"
                    @mouseleave="leavelist()"
                    >关联手机号节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_phone_set,
                          detailsNode.order_1st_phone_num
                        )
                      "
                      >{{ detailsNode.order_1st_phone_num }}</span
                    >
                    <span
                      @click="addBlackList(detailsNode.order_1st_phone_set, 'phone')"
                      v-if="showList == 3"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title
                    @mouseenter="
                      enterlist(detailsNode.order_1st_risk_phone_num, 4, $event, 'phone')
                    "
                    @mouseleave="leavelist()"
                    >关联风险手机号节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_risk_phone_set,
                          detailsNode.order_1st_risk_phone_num
                        )
                      "
                      >{{ detailsNode.order_1st_risk_phone_num }}</span
                    >
                    <span
                      @click="
                        addBlackList(detailsNode.order_1st_risk_phone_set, 'phone')
                      "
                      v-if="showList == 4"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>

            <!-- 节点类型=phone -->
            <div v-if="detailsNode.vertex_type == '手机号'" style="font-size:13px;">
              <v-list-item style="min-height: 35px;">
                <v-list-item-content>
                  <v-list-item-title
                    class="itemblack"
                    @mouseenter="enterlist(detailsNode.order_1st_devfp_num, 5, $event, 'devfp')"
                    @mouseleave="leavelist()"
                    >关联设备节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_devfp_set,
                          detailsNode.order_1st_devfp_num
                        )
                      "
                      >{{ detailsNode.order_1st_devfp_num }}</span
                    >
                    <span
                      @click="addBlackList(detailsNode.order_1st_devfp_set, 'devfp')"
                      v-if="showList == 5"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title
                    @mouseenter="
                      enterlist(detailsNode.order_1st_risk_devfp_num, 6, $event, 'devfp')
                    "
                    @mouseleave="leavelist()"
                    >关联风险设备节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_risk_devfp_set,
                          detailsNode.order_1st_risk_devfp_num
                        )
                      "
                      >{{ detailsNode.order_1st_risk_devfp_num }}</span
                    >
                    <span
                      @click="
                        addBlackList(detailsNode.order_1st_risk_devfp_set, 'devfp')
                      "
                      v-if="showList == 6"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height: 35px;">
                <v-list-item-content>
                  <v-list-item-title
                    @mouseenter="enterlist(detailsNode.order_1st_ip_num, 7, $event, 'ip')"
                    @mouseleave="leavelist()"
                    >关联IP节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_ip_set,
                          detailsNode.order_1st_ip_num
                        )
                      "
                      >{{ detailsNode.order_1st_ip_num }}</span
                    >
                    <span
                      @click="addBlackList(detailsNode.order_1st_ip_set, 'ip')"
                      v-if="showList == 7"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title
                    @mouseenter="
                      enterlist(detailsNode.order_1st_risk_ip_num, 8, $event, 'ip')
                    "
                    @mouseleave="leavelist()"
                    >关联风险IP节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_risk_ip_set,
                          detailsNode.order_1st_risk_ip_num
                        )
                      "
                      >{{ detailsNode.order_1st_risk_ip_num }}</span
                    >
                    <span
                      @click="addBlackList(detailsNode.order_1st_risk_ip_set, 'ip')"
                      v-if="showList == 8"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>

            <!-- 节点类型=devfp -->
            <div v-if="detailsNode.vertex_type == '设备'" style="font-size:13px;">
              <v-list-item style="min-height: 35px;">
                <v-list-item-content>
                  <v-list-item-title
                    class="itemblack"
                    @mouseenter="enterlist(detailsNode.order_1st_phone_num, 9, $event, 'phone')"
                    @mouseleave="leavelist()"
                    >关联手机号节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_phone_set,
                          detailsNode.order_1st_phone_num
                        )
                      "
                      >{{ detailsNode.order_1st_phone_num }}</span
                    >
                    <span
                      @click="addBlackList(detailsNode.order_1st_phone_set, 'phone')"
                      v-if="showList == 9"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title
                    @mouseenter="
                      enterlist(detailsNode.order_1st_risk_phone_num, 10, $event, 'phone')
                    "
                    @mouseleave="leavelist()"
                    >关联风险手机号节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_risk_phone_set,
                          detailsNode.order_1st_risk_phone_num
                        )
                      "
                      >{{ detailsNode.order_1st_risk_phone_num }}</span
                    >
                    <span
                      @click="
                        addBlackList(detailsNode.order_1st_risk_phone_set, 'phone')
                      "
                      v-if="showList == 10"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item style="min-height: 35px;">
                <v-list-item-content>
                  <v-list-item-title
                    @mouseenter="enterlist(detailsNode.order_1st_ip_num, 11, $event, 'ip')"
                    @mouseleave="leavelist()"
                    >关联IP节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_ip_set,
                          detailsNode.order_1st_ip_num
                        )
                      "
                      >{{ detailsNode.order_1st_ip_num }}</span
                    >
                    <span
                      @click="addBlackList(detailsNode.order_1st_ip_set, 'ip')"
                      v-if="showList == 11"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title
                    @mouseenter="
                      enterlist(detailsNode.order_1st_risk_ip_num, 12, $event, 'ip')
                    "
                    @mouseleave="leavelist()"
                    >关联风险IP节点数：
                    <span
                      class="pointers"
                      @click="
                        showNodeDetail(
                          detailsNode.order_1st_risk_ip_set,
                          detailsNode.order_1st_risk_ip_num
                        )
                      "
                      >{{ detailsNode.order_1st_risk_ip_num }}</span
                    >
                    <span
                      @click="addBlackList(detailsNode.order_1st_risk_ip_set, 'ip')"
                      v-if="showList == 12"
                      class="blacks"
                      >加入黑名单</span
                    >
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>

            <v-list-item
              style="min-height: 35px;font-size:13px;font-weight:bold;"
            >
              <v-list-item-content>
                <v-list-item-title>二度关联</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="min-height: 35px;">
              <v-list-item-content>
                <v-list-item-title
                  class="itemblack"
                  @mouseenter="enterlist(detailsNode.order_2nd_devfp_num, 13, $event, 'devfp')"
                  @mouseleave="leavelist()"
                  >关联设备节点数：
                  <span
                    class="pointers"
                    @click="
                      showNodeDetail(
                        detailsNode.order_2nd_devfp_set,
                        detailsNode.order_2nd_devfp_num
                      )
                    "
                    >{{ detailsNode.order_2nd_devfp_num }}</span
                  >
                  <span
                    @click="addBlackList(detailsNode.order_2nd_devfp_set, 'devfp')"
                    v-show="showList == 13"
                    class="blacks"
                    >加入黑名单</span
                  >
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title
                  @mouseenter="
                    enterlist(detailsNode.order_2nd_risk_devfp_num, 14, $event, 'devfp')
                  "
                  @mouseleave="leavelist()"
                  >关联风险设备节点数：
                  <span
                    class="pointers"
                    @click="
                      showNodeDetail(
                        detailsNode.order_2nd_risk_devfp_set,
                        detailsNode.order_2nd_risk_devfp_num
                      )
                    "
                    >{{ detailsNode.order_2nd_risk_devfp_num }}</span
                  >
                  <span
                    @click="addBlackList(detailsNode.order_2nd_risk_devfp_set, 'devfp')"
                    v-show="showList == 14"
                    class="blacks"
                    >加入黑名单</span
                  >
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="min-height: 35px;">
              <v-list-item-content>
                <v-list-item-title
                  @mouseenter="enterlist(detailsNode.order_2nd_phone_num, 15, $event, 'phone')"
                  @mouseleave="leavelist()"
                  >关联手机号节点数：
                  <span
                    class="pointers"
                    @click="
                      showNodeDetail(
                        detailsNode.order_2nd_phone_set,
                        detailsNode.order_2nd_phone_num
                      )
                    "
                    >{{ detailsNode.order_2nd_phone_num }}</span
                  >
                  <span
                    @click="addBlackList(detailsNode.order_2nd_phone_set, 'phone')"
                    v-show="showList == 15"
                    class="blacks"
                    >加入黑名单</span
                  >
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title
                  @mouseenter="
                    enterlist(detailsNode.order_2nd_risk_phone_num, 16, $event, 'phone')
                  "
                  @mouseleave="leavelist()"
                  >关联风险手机号节点数：
                  <span
                    class="pointers"
                    @click="
                      showNodeDetail(
                        detailsNode.order_2nd_risk_phone_set,
                        detailsNode.order_2nd_risk_phone_num
                      )
                    "
                    >{{ detailsNode.order_2nd_risk_phone_num }}</span
                  >
                  <span
                    @click="addBlackList(detailsNode.order_2nd_risk_phone_set, 'phone')"
                    v-show="showList == 16"
                    class="blacks"
                    >加入黑名单</span
                  >
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="min-height: 35px;">
              <v-list-item-content>
                <v-list-item-title
                  @mouseenter="enterlist(detailsNode.order_2nd_ip_num, 17, $event, 'ip')"
                  @mouseleave="leavelist()"
                  >关联IP节点数：
                  <span
                    class="pointers"
                    @click="
                      showNodeDetail(
                        detailsNode.order_2nd_ip_set,
                        detailsNode.order_2nd_ip_num
                      )
                    "
                    >{{ detailsNode.order_2nd_ip_num }}</span
                  >
                  <span
                    @click="addBlackList(detailsNode.order_2nd_ip_set, 'ip')"
                    v-show="showList == 17"
                    class="blacks"
                    >加入黑名单</span
                  >
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-content>
                <v-list-item-title
                  @mouseenter="enterlist(detailsNode.order_2nd_risk_ip_num, 18, $event, 'ip')"
                  @mouseleave="leavelist()"
                  >关联风险IP节点数：
                  <span
                    class="pointers"
                    @click="
                      showNodeDetail(
                        detailsNode.order_2nd_risk_ip_set,
                        detailsNode.order_2nd_risk_ip_num
                      )
                    "
                    >{{ detailsNode.order_2nd_risk_ip_num }}</span
                  >
                  <span
                    @click="addBlackList(detailsNode.order_2nd_risk_ip_set, 'ip')"
                    v-show="showList == 18"
                    class="blacks"
                    >加入黑名单</span
                  >
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn class="cancelButton mr-4" outlined @click="dialog = false"
              >关闭
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 点击关联详情弹窗 -->
    <v-dialog v-model="detailDialog" persistent scrollable max-width="900px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            关联详情
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn icon dark @click="detailDialog = false">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="desserts"
            :single-select="singleSelect"
            item-key="listValue"
            :items-per-page="desserts.length"
            show-select
            class="elevation-1"
          >
            <template v-slot:top>
              <div class="pa-3">
                {{detailNodeText}}
              </div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn color="primary" @click="addSelecte">加入黑名单</v-btn>
            <v-btn
              class="pl-0 mr-4"
              @click="
                detailDialog = false;
                selected = [];
              "
              >关闭</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 添加黑名单弹窗 -->
    <v-dialog v-model="addBlackDialog" persistent scrollable max-width="630px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            添加名单数据
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn icon dark @click="cancelSubmit">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
          <v-form
            ref="form"
            :lazy-validation="lazy"
            v-model="valid"
            class="form"
          >
            <v-row>
              <v-col cols="2">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="8">
                <v-select
                  label="所属应用"
                  multiple
                  required
                  :rules="[v => !!v || '所属应用不能为空']"
                  v-model="form.applyList"
                  :items="applyListItems"
                  item-text="appName"
                  item-value="appId"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  @change="handleChangeSelectApply(form.applyList)"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="2">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="8">
                <v-select
                  label="所属名单集"
                  multiple
                  required
                  :rules="[v => !!v || '所属名单集不能为空']"
                  v-model="form.nameList"
                  :items="nameListItems"
                  item-text="listName"
                  item-value="id"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                  @change="handleChangeSelectList(form.nameList)"
                />
              </v-col>
            </v-row>
            <!-- 日期 -->
            <v-row>
              <v-col cols="2">
                <div class="mt-2"></div>
              </v-col>
              <v-col cols="8">
                <DatetimePicker
                  v-if="isEditMode"
                  required
                  solo
                  flat
                  dense
                  v-model="form.value"
                  time-format="HH:mm:ss"
                  :type="3"
                  @clear="form.value = ''"
                  :text-field-props="fors.textFieldProps"
                  :date-picker-props="fors.dateProps"
                  :time-picker-props="fors.timeProps"
                  placeholder="不填写时，默认永久有效"
                  class="isEditDropdown"
                >
                </DatetimePicker>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pt-4 pb-4">
          <div class="flex-grow-1"></div>
          <v-btn class="pl-0 mr-4" @click="cancelSubmit">关闭</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="doSubmit" v-if="hasPermission(addBlacklistBtn)">提交</v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- 图谱 -->
    <div style="position: relative;cursor:pointer;" id="fullScreen">
      <div
        @click="to3DGraph"
        class=" card-info"
        style="display:flex; align-items:center;width:60px;margin-right:80px;margin-top:5px;"
        v-if="hasPermission(graphBton)"
      >
        <div style="display:inline-block;">
          <img :src="logopng" alt="" />
        </div>
        <span style="margin-left:5px;margin-bottom: 5px;color:#FFFFFF;">3D</span>
      </div>

      <div v-if="isFull" @click="fulScreen"
        class=" card-info"
        style="coursor:pointer;width:60px;margin-right:10px;margin-top:5px;"
      >
        <v-icon color="blue" medium>
          mdi-fullscreen-exit
        </v-icon>
        <span style="margin-left:3px;color:#FFFFFF;">退出</span>
      </div>
      <div
        v-if="!isFull"
        @click="fulScreen"
        class=" card-info"
        style="coursor:pointer;width:60px;margin-right:10px;margin-top:5px;"
      >
        <v-icon color="blue" medium>
          mdi-fullscreen
        </v-icon>
        <span style="margin-left:3px;color:#FFFFFF;">全屏</span>
      </div>
      <!-- 左侧固定卡片 -->
      <v-card class="elevation-0 card-legend" style="background-color: transparent;">
        <v-card-text>
          <v-list dense style="color: #FFFFFF;background-color: transparent;">
            <v-subheader class="pl-0" style="color: #FFFFFF;font-size:16px;"
              >群体画像</v-subheader
            >
            <div class="pr-4 pt-2">手机号数: {{ cardIntoItems.phoneNum }}</div>
            <div class="pr-4 pt-2">设备数: {{ cardIntoItems.deviceNum }}</div>
            <div class="pr-4 pt-2">IP数: {{ cardIntoItems.ipNum }}</div>
            <div class="pr-4 pt-2">
              风险手机号数: {{ cardIntoItems.riskPhone }}
            </div>
            <div class="pr-4 pt-2">
              风险设备数: {{ cardIntoItems.riskDevice }}
            </div>
            <div class="pr-4 pt-2">风险IP数: {{ cardIntoItems.riskIp }}</div>
          </v-list>
        </v-card-text>
      </v-card>
      <!-- 右上角图例 -->
      <v-card class="elevation-0 card-info" style="margin-top:40px;background-color:transparent;">
        <v-card-text>
          <div class="py-2" style="color:#FFFFFF;">
            <v-icon color="#89D7BD">mdi-circle</v-icon>
            <span class="legend-font">设备</span>
          </div>
          <div class="py-2" style="color:#FFFFFF;">
            <v-icon color="#ECCAA1">mdi-circle</v-icon>
            <span class="legend-font">IP</span>
          </div>
          <div class="py-2" style="color:#FFFFFF;">
            <v-icon color="#4F8BE8">mdi-circle</v-icon>
            <span class="legend-font">手机号</span>
          </div>
          <div class="py-2" style="color:#FFFFFF;">
            <v-icon color="#fe8894">mdi-circle</v-icon>
            <!-- <v-icon color="#fe8894">mdi-moon-new</v-icon> -->
            <span class="legend-font">风险节点</span>
          </div>
        </v-card-text>
      </v-card>

      <!-- 公共弹框提示 -->
      <v-snackbar
        v-model="snackbarServe"
        :timeout="timeout"
        :color="snackbarServeColor"
        :top="isSnackbarTop"
      >
        {{ snackbarServeMsg }}
      </v-snackbar>

      <!-- 2D图谱 -->
      <v-card class="mt-3">
        <v-card-text :style="styleObject">
          <v-progress-circular
            v-show="graphProgress"
            :size="50"
            color="primary"
            indeterminate
            style="margin-left:48%;position:absolute;top:180px;"
          ></v-progress-circular>
          <div id="graph" v-show="!graphProgress"></div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script>
import logopng from '../../assets/3d.png';
import ForceGraph from 'force-graph';
import BaseSearch from '@c/BaseSearch';
import DatetimePicker from '@c/DateTimePicker';
import {
  queryassociationmap,
  getNodeInfo,
  getAssociateInfo,
  getTradeType,
  sysAppinfoInfo,
  getBlankListNames,
  batchInsertNameData
} from 'api/relationGraph.js';
export default {
  name: 'relationGraph',
  components: {
    BaseSearch,
    DatetimePicker
  },
  data () {
    return {
      detailNodeText: '',
      isFull: false, // 全屏-退出
      graphProgress: true,
      logopng: logopng,
      timeout: 2000, // 弹窗
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      isEditMode: true, // 选择日期
      showList: '', // 红色黑名单显示
      infoItems: [
        {
          text: '设备数: 3',
          subtitle: ''
        },
        {
          text: '手机号数: 3',
          subtitle: ''
        },
        {
          text: 'IP数: 3',
          subtitle: ''
        },
        {
          text: '风险设备数: 1',
          subtitle: '设备: 洗钱设备黑名单'
        },
        {
          text: '风险IP数: 1',
          subtitle: 'IP: 洗钱IP黑名单'
        }
      ],
      // 右上角卡片数据
      cardIntoItems: {},
      dialog: false,
      searchForm: [
        {
          placeholder: '时间',
          value: '',
          type: 'date'
        },
        {
          placeholder: '源节点类型',
          value: '',
          type: 'select',
          options: [
            { text: '设备', value: 'devfp' },
            { text: '手机号', value: 'phone' },
            { text: 'IP', value: 'ip' }
          ]
        },
        { placeholder: '源节点值', value: '', type: 'text' },
        {
          placeholder: '关联节点类型',
          value: '',
          type: 'select',
          multiple: true,
          options: [
            { text: '设备', value: 'devfp' },
            { text: '手机号', value: 'phone' },
            { text: 'IP', value: 'ip' }
          ]
        },
        {
          placeholder: '交易类型',
          value: '',
          type: 'select',
          multiple: true,
          options: []
        },
        {
          placeholder: '关联层级',
          value: '',
          type: 'select',
          options: [
            { text: '1', value: 1 },
            { text: '2', value: 2 },
            { text: '3', value: 3 },
            { text: '4', value: 4 },
            { text: '5', value: 5 }
          ]
        }
      ],
      nodeItems: [
        { text: '设备', value: 'devfp' },
        { text: '手机号', value: 'phone' },
        { text: 'IP', value: 'ip' }
      ],
      clearDate: false,
      counter: 0,
      fullHeight: window.innerHeight,
      graphJson: {
        nodes: [],
        links: []
      },
      myGraph: '',
      nodeInfo: '',
      detailNodeInfo: {},
      detailDialog: false,
      addBlackDialog: false,
      valid: true,
      lazy: false,
      form: {
        applyList: '',
        nameList: '',
        value: ''
      },
      fors: {
        label: '失效时间*',
        textFieldProps: {
          appendIcon: 'event'
        },
        dateProps: {
          headerColor: 'primary'
        },
        timeProps: {
          useSeconds: true,
          ampmInTitle: true
        }
      },
      applyListItems: [],
      nameListItems: [],
      // table
      singleSelect: false,
      selected: [],
      headers: [
        {
          text: '数据',
          align: 'start',
          sortable: false,
          value: 'listValue'
        },
        { text: '是否已加黑', value: 'isBlankList', width: 200 },
        { text: '所属名单集', value: 'listName', width: 200 }
      ],
      desserts: [], // table列表数据
      startTime: '',
      endTime: '',
      srcVertexType: '',
      srcVertexValue: '',
      destVertexType: '',
      edgeType: '',
      level: '',
      // 节点详情
      detailsNode: {},
      // 名单集搜到数据
      listsListArr: '',
      blackSet: '',
      // 权限控制
      graphBton: '3dgraphButton', // 关联图谱按钮
      addBlacklistBtn: 'addBlacklistButton', // 加入黑名单
      blackId: ''
    };
  },
  computed: {
    relGraphHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 20;
      }
    },
    styleObject () {
      return {
        height: this.relGraphHeight + 'px'
      };
    }
  },
  watch: {
    counter: {
      handler: function (newValue, oldValue) {
        if (this.counter % 2 === 1) {
          // 开
          this.relGraphHeight = window.innerHeight - 130;
        } else {
          // 关
          this.relGraphHeight = window.innerHeight;
        }
      },
      immediate: true
    }
  },
  filters: {
    groupFilter: function (str, itemList) {
      let text;
      itemList.forEach(item => {
        if (item.value.toUpperCase() === str) {
          text = item.text;
        }
      });
      return text;
    }
  },
  created () {
    this.getTradeType();
    this.sysAppinfoInfos();
    this.queryassociationmaps();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    // Promise.all([this.init()]);
    // 监听键盘按键事件
    let self = this;
    this.$nextTick(function () {
      document.addEventListener('keyup', function (e) {
        if (e.keyCode === 27) {
          self.fulScreen();
        }
      });
    });
  },
  beforeDestroy () {
    this.myGraph = null;
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    // 图谱请求数据
    async queryassociationmaps () {
      this.graphProgress = true;
      let param = {
        startTime: this.startTime,
        endTime: this.endTime,
        srcVertexType: this.srcVertexType,
        srcVertexValue: this.srcVertexValue,
        destVertexType: this.destVertexType,
        edgeType: this.edgeType,
        level: this.level
      };
      const response = await queryassociationmap(param);
      if (response.data.code === 200) {
        this.graphJson = Object.assign({}, response.data.data.graphJson);
        this.cardIntoItems = Object.assign(
          {},
          {
            deviceNum: response.data.data.devFpNum,
            phoneNum: response.data.data.phoneNum,
            ipNum: response.data.data.ipNum,
            riskDevice: response.data.data.riskDevFpNum,
            riskPhone: response.data.data.riskPhoneNum,
            riskIp: response.data.data.riskIpNum
          }
        );
        this.graphProgress = false;
        this.init();
      } else {
        this.graphProgress = false;
      }
    },
    // 节点详情
    async getNodeInfo (query) {
      this.detailsNode = {};
      let param = {
        key: query.value,
        vertexType: query.group.toLowerCase()
      };
      const response = await getNodeInfo(param);
      if (response.data.code === 200) {
        this.detailsNode = Object.assign({}, response.data.data);
      }
    },
    // 关联详情
    async getAssociateInfo (query) {
      const response = await getAssociateInfo({ listValues: query });
      if (response.data.code === 200) {
        let res = response.data.data.map(item => {
          if (item.isBlankList) {
            item.isBlankList = '是';
          }
          return item;
        });
        this.desserts = res;
      }
    },
    // select交易类型
    async getTradeType () {
      const response = await getTradeType();
      if (response.data.code === 200) {
        response.data.data.forEach(item => {
          let obj = {};
          obj['text'] = item.tradeName;
          obj['value'] = item.identifier;
          this.searchForm[4].options.push(obj);
        });
      }
    },
    // 获取所属应用列表
    async sysAppinfoInfos () {
      const response = await sysAppinfoInfo({ applyScopeId: 2 });
      if (response.data.code === 200) {
        response.data.data.forEach(item => {
          this.applyListItems.push(item);
        });
      }
    },
    // 获取所属应用下的名单集（黑名单)
    async getBlankListName (query) {
      this.nameListItems = [];
      const response = await getBlankListNames(query);
      if (response.data.code === 200) {
        response.data.data.forEach(item => {
          this.nameListItems.push(item);
        });
      }
    },
    // 批量添加黑名单
    async batchInsertNameData (query) {
      const response = await batchInsertNameData(query);
      if (response.data.code === 200 && response.data.data.code === '1') {
        this.snackbarServe = true;
        this.snackbarServeMsg = response.data.data.msg;
        this.snackbarServeColor = 'success';
      } else if (response.data.code === 200 && response.data.data.code === '0') {
        this.snackbarServe = true;
        this.snackbarServeMsg = response.data.data.msg;
        this.snackbarServeColor = 'error';
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = response.data.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 监听搜索form下拉框选择事件
    onHandleChange ($event) {
      if ($event === 'devfp' || $event === 'phone' || $event === 'ip') {
        this.searchForm[2].placeholder =
          '目标' + this.nodeItems.filter(item => item.value === $event)[0].text;
        this.searchForm[2].value = '';
        // this.searchForm[3].options = JSON.parse(JSON.stringify(this.nodeItems));
        // this.searchForm[3].value = '';
        // this.searchForm[3].options.forEach(item => {
        //   if (item.value === $event) {
        //     item.disabled = true;
        //   }
        // });
      }
    },
    search ($event) {
      if ($event[0].value === '' || $event[0].value === undefined) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '查询时间不可为空';
        this.snackbarServeColor = 'error';
        return;
      }
      if ($event[1].value === '' || $event[1].value === undefined) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '源节点类型不可为空';
        this.snackbarServeColor = 'error';
        return;
      }
      var obj = $event[0].value;
      var obj1, obj2;
      if (obj !== '' && obj !== undefined) {
        obj1 = obj
          .split('至')[0]
          .split('-')
          .join('')
          .trim();
        obj2 = obj
          .split('至')[1]
          .split('-')
          .join('')
          .trim();
      } else {
        obj1 = ''; obj2 = '';
      }
      (this.startTime = obj1);
      (this.endTime = obj2);
      (this.srcVertexType = $event[1].value);
      (this.srcVertexValue = $event[2].value);
      if ($event[3].value !== '' && obj !== undefined) {
        this.destVertexType = $event[3].value.join(',');
      }
      if ($event[4].value !== '' && obj !== undefined) {
        this.edgeType = $event[4].value.join(',');
      }
      (this.level = $event[5].value); this.queryassociationmaps();
    },
    resetSearchData ($event) {
      this.searchForm[2].placeholder = '源节点值';
      this.clearDate = !this.clearDate;
    },
    to3DGraph () {
      this.$router.push('/3dgraph');
    },
    panelCounter: function () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.relGraphHeight = window.innerHeight;
      this.myGraph.height(this.relGraphHeight).width(window.innerWidth);
    },
    beforeRouteLeave (to, from, next) {
      window.removeEventListener('resize', this.onWindowResize);
      this.myGraph = null;
      next();
    },
    // 关联图谱
    init () {
      this.graphJson.links.forEach(link => {
        var a, b;
        this.graphJson.nodes.forEach(item => {
          if (item.id === link.source) {
            a = item;
          }
          if (item.id === link.target) {
            b = item;
          }
        });
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b);
        b.neighbors.push(a);

        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(link);
        b.links.push(link);
      });

      const NODE_R = 6;
      const highlightNodes = new Set();
      const highlightLinks = new Set();
      let hoverNode = null;
      const elem = document.getElementById('graph');

      this.myGraph = ForceGraph()(elem)
        .zoom(1.6)
        .centerAt(-360, -200)
        .backgroundColor('#24344B')
        .linkColor(() => 'rgba(255,255,255,0.2)')
        .graphData(this.graphJson)
        .height(this.relGraphHeight)
        .nodeRelSize(NODE_R)
        .nodeId('id')
        .nodeVal('val')
        .nodeAutoColorBy('group')
        .nodeLabel(node => {
          let gradetype = '';
          switch (true) {
            case node.group === 'IP':
              gradetype = node.group;
              break;
            case node.group === 'PHONE':
              gradetype = '手机';
              break;
            case node.group === 'DEVFP':
              gradetype = '设备';
              break;
            default:
          }
          if (node.val === '8') {
            return `节点值: ${node.value} <br/> 节点类型: ${gradetype} <br/>风险高、中心节点`;
          } else if (node.val === '6') {
            return `节点值: ${node.value} <br/> 节点类型: ${gradetype} <br/>中心节点`;
          } else if (node.risk) {
            return `节点值: ${node.value} <br/> 节点类型: ${gradetype} <br/>风险高`;
          } else {
            return `节点值: ${node.value} <br/> 节点类型: ${gradetype}`;
          }
        })
        .linkSource('source')
        .linkTarget('target')
        .linkLabel(link => `${link.value}`)
        .nodeColor(node => {
          if (node.val === '8' || node.risk) {
            return '#fe8894';
          } else {
            if (node.group === 'PHONE') {
              return '#4F8BE8';
            } else if (node.group === 'DEVFP') {
              return '#89D7BD';
            } else if (node.group === 'IP') {
              return '#ECCAA1';
            }
          }
        })
        .onNodeHover(node => {
          highlightNodes.clear();
          highlightLinks.clear();
          if (node) {
            highlightNodes.add(node);
            // node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
            node.links.forEach(link => highlightLinks.add(link));
          }
          hoverNode = node || null;
          elem.style.cursor = node ? 'pointer' : null;
        })
        .onLinkHover(link => {
          highlightNodes.clear();
          highlightLinks.clear();

          if (link) {
            highlightLinks.add(link);
            highlightNodes.add(link.source);
            highlightNodes.add(link.target);
          }
        })
        .linkWidth(link => (highlightLinks.has(link) ? 5 : 1))
        .linkDirectionalParticles(4)
        .linkDirectionalParticleWidth(link =>
          highlightLinks.has(link) ? 4 : 0
        )
        .nodeCanvasObjectMode(node =>
          highlightNodes.has(node) ? 'before' : undefined
        )
        .nodeCanvasObject((node, ctx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, NODE_R * 1.3, 0, 2 * Math.PI, false);
          ctx.fillStyle = node === hoverNode ? '#fe8894' : '#f4c79b';
          ctx.fill();
        })
        .onNodeClick((node, event) => {
          // 当前点击的节点信息
          this.nodeInfo = Object.assign({}, node);
          this.nodeInfo.linkLength = node.neighbors.length;
          this.dialog = true;
          this.getNodeInfo(node);
        });
      // .onLinkRightClick((node, event) => console.log(node, event, elem));
    },
    // 点击加入黑名单set
    addBlackList (query, id) {
      this.blackSet = query;
      // this.blackId = id;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.addBlackDialog = true;
    },
    cancelSubmit () {
      this.$refs.form.reset();
      this.addBlackDialog = false;
      this.nameListItems = [];
      this.form.applyList = '';
      this.form.nameList = '';
      // this.nameListItems = ''
      // this.blackSet = ''
    },
    // 保存
    doSubmit () {
      // 转换为年月日时分秒
      var datetime = '';
      if (this.form.value !== '') {
        var d = this.form.value;
        datetime =
          d.getFullYear() +
          '-' +
          (d.getMonth() + 1 < 10
            ? '0' + (d.getMonth() + 1)
            : d.getMonth() + 1) +
          '-' +
          (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
          ' ' +
          (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
          ':' +
          (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
          ':' +
          (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
      } else {
        datetime = '';
      }
      this.nameListItems = [];
      let query = {
        listId: this.listsListArr,
        listValues: this.blackSet,
        expireTime: datetime
      };
      this.batchInsertNameData(query);
      this.$refs.form.reset();
      this.blackSet = '';
      this.listsListArr = '';
      this.form.value = '';
      this.addBlackDialog = false;
    },
    // 点击节点详情
    showNodeDetail (val, nums) {
      this.desserts = [];
      this.blackSet = val;
      if (nums !== 0) {
        this.getAssociateInfo(val);
      }
      this.detailNodeInfo = Object.assign(
        {},
        {
          deviceNum: this.nodeInfo.neighbors.filter(
            item => item.group === 'devfp'
          ).length,
          phoneNum: this.nodeInfo.neighbors.filter(
            item => item.group === 'phone'
          ).length,
          ipNum: this.nodeInfo.neighbors.filter(item => item.group === 'ip')
            .length
        }
      );
      if (nums > 0) {
        this.detailDialog = true;
      }
    },
    /// 是否全屏
    fulScreen () {
      let element = document.getElementById('fullScreen');
      if (this.isFull) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.isFull = !this.isFull;
    },
    enterlist (value, num, $event, id) {
      this.blackId = id;
      this.detailNodeText = $event.target.innerText;
      if (value && num === 20) {
        this.showList = 20;
      } else if (value > 0 && num === 1) {
        this.showList = 1;
      } else if (value > 0 && num === 2) {
        this.showList = 2;
      } else if (value > 0 && num === 3) {
        this.showList = 3;
      } else if (value > 0 && num === 4) {
        this.showList = 4;
      } else if (value > 0 && num === 5) {
        this.showList = 5;
      } else if (value > 0 && num === 6) {
        this.showList = 6;
      } else if (value > 0 && num === 7) {
        this.showList = 7;
      } else if (value > 0 && num === 8) {
        this.showList = 8;
      } else if (value > 0 && num === 9) {
        this.showList = 9;
      } else if (value > 0 && num === 10) {
        this.showList = 10;
      } else if (value > 0 && num === 11) {
        this.showList = 11;
      } else if (value > 0 && num === 12) {
        this.showList = 12;
      } else if (value > 0 && num === 13) {
        this.showList = 13;
      } else if (value > 0 && num === 14) {
        this.showList = 14;
      } else if (value > 0 && num === 15) {
        this.showList = 15;
      } else if (value > 0 && num === 16) {
        this.showList = 16;
      } else if (value > 0 && num === 17) {
        this.showList = 17;
      } else if (value > 0 && num === 18) {
        this.showList = 18;
      } else if (value > 0 && num === 19) {
        this.showList = 19;
      }
    },
    leavelist () {
      this.showList = '';
    },
    // 加入黑名单-弹窗
    addSelecte () {
      let arr = [];
      this.selected.forEach(item => {
        arr.push(item.listValue);
      });
      this.blackSet = arr.join(',');
      if (this.blackSet !== '') {
        this.detailDialog = false;
        this.addBlackDialog = true;
      }
      this.selected = [];
    },
    // 应用select下拉框的change事件
    handleChangeSelectApply (value) {
      if (value.length > 0) {
        let query = value.join(',');
        let params = {
          appIds: query,
          nodeType: this.blackId
        };
        this.getBlankListName(params);
      }
    },
    // 名单select下拉框的change事件
    handleChangeSelectList (value) {
      this.listsListArr = value.join(',');
    }
  }
};
</script>
<style lang="stylus" scoped>
.card-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}
.card-info {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}
.card-legend {
  position: absolute;
  left: 10px;
  z-index: 2;
}
.legend-font {
  display: inline-block;
  padding-left: 8px;
  vertical-align: middle;
}
.blacks {
  cursor:pointer;
  color:red;
  font-size:13px;
  margin-left:8px;
}
.pointers{
  cursor:pointer;
  -webkit-user-select: text;
}
.loadtop{
  padding-left:48%;
}
>>>.v-data-footer{
  display:none;
}
>>>.v-card__text, .v-card__title {
    padding: 0;
    overflow:hidden;
}
</style>
