<template>
  <div class="enu-content fill-height">
    <base-search @change="panelCounter">
      <template v-slot>
        <v-form
          ref="form"
          v-model="searchValid"
          lazy-validation
          autocomplete="off"
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
                placeholder="公司名称："
                v-model="form.compName"
                label=""
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
                placeholder="公司标识："
                v-model="form.sign"
                label=""
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
                  placeholder="机构号："
                  v-model="form.institutionNumber"
                  label=""
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
                <v-menu
                  v-model="isCreateDate"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      placeholder='创建时间：'
                      :value="createDateValue"
                      label=""
                      outlined
                      dense
                      append-icon="event"
                      v-on="on"
                      @click="updateInputClick"
                    ></v-text-field>
                  </template>
                  <v-date-picker selected-items-text="已选择日期" v-model="cDates" range @change="dateChange"></v-date-picker>
                  <!-- <v-date-picker
                    v-model="form.createDate"
                    range
                    @change="isCreateDate = false"
                  ></v-date-picker> -->
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="2"
                xl="2"
              >
                <v-menu
                  v-model="isReviseDate"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      placeholder='更新时间：'
                      :value="reviseDateValue"
                      label=""
                      outlined
                      dense
                      v-on="on"
                      append-icon="event"
                      @click:clear="form.reviseDate = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker selected-items-text="已选择日期" v-model="uDates" range @change="changUpDate"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col
                  cols="12"
                  sm="12"
                  md="4"
                  xl="4"
                >
                  <v-btn
                    color="primary"
                    class="mr-4"
                    @click="reset"
                    style="margin-top:5.5px"
                  >
                    重置
                  </v-btn>
                  <v-btn
                    color="primary"
                    style="margin-top:5.5px"
                    @click="searchFunc()"
                  >
                    查询
                  </v-btn>
                </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
    </base-search>
  <!-- 表格部分 -->
    <v-row>
      <v-col :cols='12'>
        <v-card class="elevation-3">
          <v-data-table
            :headers="constHeader"
            :items="constItem"
            :items-per-page="perPageNum"
            hide-default-footer
            :height="tableHeight"
            :fixed-header="true"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title style="font-size:18px">
                  公司管理数据
                </v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer></v-spacer>
                <v-card-title>
                  <v-btn color="primary" @click="_addFunc()" v-if="hasPermission(addCompanyBtn)">
                    添加
                  </v-btn>
                </v-card-title>
              </v-toolbar>
            </template>
            <!-- body 显示部分 -->
            <template v-slot:body="{ items }">
              <tr class="el-tr-defu" v-for="(item, index) in items" :key="index">
                <td class="el-border-defu">{{ item.compName }}</td>
                <td class="el-border-defu">{{ item.corporate }}</td>
                <td class="el-border-defu">{{ item.address }}</td>
                <td class="el-border-defu">{{ item.profile }}</td>
                <td class="el-border-defu">{{ item.sign }}</td>
                <td class="el-border-defu">{{ item.institutionNumber }}</td>
                <td class="el-border-defu">{{ item.createTime | creDate }}</td>
                <td class="el-border-defu">{{ item.updateTime | creDate }}</td>
                <!-- 操作部分 -->
                <td class="el-border-defu">
                  <v-tooltip bottom v-if="hasPermission(showCompanyDetailsBtn)">
                    <template v-slot:activator="{ on }">
                      <!-- <span v-on="on" class="c-company-set" @click="_detailFunc(item)"> -->
                      <v-icon
                          small
                          class="mr-2 icon-primary"
                          v-on="on"
                          color="primary"
                          @click="_detailFunc(item)"
                        >
                          mdi-card-account-details
                      </v-icon>
                      <!-- </span> -->
                    </template>
                    <span>显示详情</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="hasPermission(deploySubsBtn)">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2"
                        color="primary"
                        v-on="on"
                        @click="_zCompfunc(item)"
                      >mdi-bookmark-multiple</v-icon>
                    </template>
                    <span>配置</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2 icon-primary"
                        color="primary"
                        v-on="on"
                        @click="editFunc(item)"
                      >mdi-pencil</v-icon>
                    </template>
                    <span>编辑</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="hasPermission(deleteCompanyBtn)">
                    <template v-slot:activator="{ on }">
                      <v-icon small class="" color="primary" v-on="on" @click="_deteleFunc(item)">mdi-delete</v-icon>
                    </template>
                    <span>删除</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <!-- 无数据显示内容 -->
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
    <!-- 显示详情部分 -->
    <v-dialog v-model="detDialog" persistent scrollable max-width="1300px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            详情
          </v-toolbar-title>
        </v-card-title>
        <v-divider></v-divider>
        <!-- 母公司信息 -->
        <v-container>
          <div>
            公司信息：
          </div>
          <v-row style="padding: 0 15px;">
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司名称："
                v-model="mComp.compName"
                disabled="disabled"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司法人："
                v-model="mComp.corporate"
                disabled="disabled"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司地址："
                v-model="mComp.address"
                disabled="disabled"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司描述："
                disabled="disabled"
                v-model="mComp.profile"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司标识："
                disabled="disabled"
                v-model="mComp.sign"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="机构号："
                disabled="disabled"
                v-model="mComp.institutionNumber"
              />
            </v-col>
          </v-row>
        </v-container>
        <!-- 子公司信息 -->
        <v-container v-show="zComp.length>0" style="background-color: #fff;">
          <div>
            子公司信息：
          </div>
          <v-row style="padding: 0 15px;" v-for="(item, index) in zComp" :key="index">
            <v-col>
              <v-text-field
                outlined dense type="text" label="公司名称" disabled="disabled" :value="item.compName"
                :rules="[
                  v => v.length <= 50 || '最多只能输入50个字符',
                ]"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined dense type="text" label="公司法人" disabled="disabled" :value="item.corporate"
                :rules="[
                  v => v.length <= 50 || '最多只能输入50个字符',
                ]"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined dense type="text" label="公司地址" disabled="disabled" :value="item.address"
                :rules="[
                  v => v.length <= 100 || '最多只能输入100个字符',
                ]"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined dense type="text" label="公司描述" disabled="disabled" :value="item.profile"
                :rules="[
                  v => v.length <= 255 || '最多只能输入255个字符',
                ]"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined dense type="text" label="公司标识" disabled="disabled" :value="item.sign"
                :rules="[
                  v => v.length <= 50 || '最多只能输入50个字符',
                ]"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined dense type="text" label="机构号" disabled="disabled" :value="item.institutionNumber"
                :rules="[
                  v => v.length <= 50 || '最多只能输入50个字符',
                ]"
              />
            </v-col>
          </v-row>
        </v-container>
        <!-- 底部按钮 -->
        <v-card-actions style="background-color: #fff;">
          <div class="flex-grow-1" />
            <div>
              <v-btn class="cancelButton mr-4" outlined @click="detCancleFunc()">
                关闭
              </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 配置子公司信息 -->
    <v-dialog v-model="detDialogZgs" persistent scrollable max-width="1300px">
      <v-card>
        <v-card-title>
          <v-toolbar-title>
            配置
          </v-toolbar-title>
        </v-card-title>
        <v-divider></v-divider>
        <!-- 母公司信息 -->
        <v-container>
          <div>
            公司信息：
          </div>
          <v-row>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司名称："
                v-model="zCompSet.compName"
                disabled="disabled"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司法人："
                v-model="zCompSet.corporate"
                disabled="disabled"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司地址："
                v-model="zCompSet.address"
                disabled="disabled"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司描述："
                disabled="disabled"
                v-model="zCompSet.profile"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="公司标识："
                disabled="disabled"
                v-model="zCompSet.sign"
              />
            </v-col>
            <v-col>
              <v-text-field
                outlined
                dense
                type="text"
                label="机构号："
                disabled="disabled"
                v-model="zCompSet.institutionNumber"
              />
            </v-col>
            <v-col cols="1" sm="1" md="1" xl="1">
              <!-- <v-btn color="primary" @click="addzzCompy()">
                添加
              </v-btn> -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    size="20"
                    class="mr-1"
                    color="primary"
                    v-on="on"
                    @click="addzzCompy()"
                  >mdi-plus</v-icon>
                </template>
              <span>添加</span>
            </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
        <v-form ref="formVal" v-model="valid" :lazy-validation="lazy" style="background: white;">
          <!-- 子公司信息 -->
          <v-container v-show="zzCompy.length>0">
            <div>
              子公司信息：
            </div>
              <v-row v-for="(item, index) in zzCompy" :key="index">
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    type="text"
                    label="公司名称："
                    v-model="item.compName"
                    :rules="[
                      v => v.length <= 50 || '最多只能输入50个字符',
                    ]"
                    :required="true"/>
                </v-col>
                <v-col>
                  <v-text-field
                  outlined
                  dense
                  type="text"
                  label="公司法人："
                  v-model="item.corporate"
                  :rules="[
                    v => v.length <= 50 || '最多只能输入50个字符',
                  ]"
                  :required="true"/>
                </v-col>
                <v-col>
                  <v-text-field
                    outlined dense type="text" label="公司地址：" v-model="item.address" :required="true"
                    :rules="[
                      v => v.length <= 100 || '最多只能输入100个字符',
                    ]"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    outlined dense type="text" label="公司描述：" v-model="item.profile" :required="true"
                    :rules="[
                      v => v.length <= 255 || '最多只能输入255个字符',
                    ]"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    outlined dense type="text" label="公司标识：" v-model="item.sign" :required="true"
                    :rules="[
                      v => v.length <= 50 || '最多只能输入50个字符',
                    ]"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    outlined dense type="text" label="机构号：" v-model="item.institutionNumber" :required="true"
                    :rules="[
                      v => v.length <= 50 || '最多只能输入50个字符',
                    ]"
                  />
                </v-col>
                <v-col cols="1" sm="1" md="1" xl="1">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        size="20"
                        class="mr-1"
                        color="primary"
                        v-on="on"
                        @click="__deleteZcomp(item, index)"
                      >
                          mdi-delete
                      </v-icon>
                    </template>
                    <span>删除</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          size="20"
                          class="mr-1 icon-primary"
                          color="primary"
                          v-on="on"
                          @click="addzzCompy()"
                        >mdi-plus</v-icon>
                      </template>
                    <span>添加</span>
                  </v-tooltip>
                </v-col>
              </v-row>
          </v-container>
          <!-- 底部按钮 -->
          <v-card-actions>
            <div class="flex-grow-1" />
            <div>
              <v-btn class="cancelButton mr-4" outlined @click="cancleZcompFunc()">
                取消
              </v-btn>
              <v-btn class="primary mr-4" outlined style="color:#fff" :disabled="!valid" @click="saveZcompFunc()">
                保存
              </v-btn>
            </div>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- 添加 -->
    <base-create :baseCteateEditPowerBtn="editCompanyBtn" :formHeader='addOrEditHeader' :crudFormDialog='dialog' :formData='addAndEditFormData' @cancelCrudFormDialog='cancelFunc($event)' @confimDialogSave='saveFunc(arguments)' @switchOnChange="onChang($event)"></base-create>
    <!-- 删除 -->
    <del-dialog :isDialogShow='dialogDel' @cancelDel='constantDelCancle($event)' @confimDel='deleteEnum($event)'></del-dialog>
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
import { getList, detailFunc, addFunc, editItem, deteleItem, addzcoFunc, delChecked } from '../../api/companymanage.js';
import BaseSearch from '@/components/BaseSearch';
// import { addzcoFunc } from '../../api/ApplyManage.js';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import { BASE_NAME, BASE_VALUE, BASE_VALUE_TEXT, BASE_NAME_TEXT, NO_EMPTY_STRING, MAX_INPUT_LENGTH } from '../../utils/validate.js';
import moment from 'moment';
export default {
  data () {
    return {
      deleteZzCompyId: [], // 要删除的子公司id
      counter: 0,
      fullHeight: window.innerHeight,
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      search: '',
      detDialog: false,
      detDialogZgs: false,
      // compItem: [],
      constHeader: [
        { text: '公司名称', value: 'compName', sortable: false, width: 100 },
        { text: '公司法人', value: 'corporate', sortable: false, width: 100 },
        { text: '公司地址', value: 'address', sortable: false, width: 100 },
        { text: '公司描述', value: 'profile', sortable: false, width: 100 },
        { text: '公司标识', value: 'sign', sortable: false, width: 100 },
        { text: '机构号', value: 'sign', sortable: false, width: 100 },
        { text: '创建时间', value: 'createTime', sortable: false, width: 100 },
        { text: '更新时间', value: 'updateTime', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 120 }
      ],
      // 搜索条件
      form: {
        compName: '',
        sign: '',
        institutionNumber: ''
      },
      uDates: [],
      cDates: [],
      isCreateDate: false,
      isReviseDate: false,
      searchValid: true,
      isExpanded: true,
      constItem: [], // 左侧列表内容
      dialog: false,
      dialogDel: false,
      mflag: 1,
      mComp: {},
      zComp: [],
      zCompSet: {},
      zId: '',
      deleteId: '',
      addOrEditHeader: {},
      addAndEditFormData: [],
      zzCompy: [],
      zzPid: '',
      lazy: true,
      valid: true,
      pageNum: 1,
      queryPageLength: 1,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      rulesForm: {
        name: [
          v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT
        ],
        length1: [
          v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT
        ],
        length2: [
          v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT
        ],
        length3: [
          v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT
        ],
        sing: [
          v => !!v || NO_EMPTY_STRING, v => BASE_VALUE.test(v) || BASE_VALUE_TEXT
        ],
        institutionNumber: [
          v => !!v || NO_EMPTY_STRING, v => BASE_VALUE.test(v) || BASE_VALUE_TEXT
        ]
      },
      // 权限管理
      addCompanyBtn: '/addCompanyButton', // 添加公司按钮是否显示
      showCompanyDetailsBtn: '/showCompanyDetailsButton', // 显示详情按钮
      deploySubsBtn: '/deploySubsidiary', // 配置子公司按钮
      editCompanyBtn: '/editCompanyButton', // 编辑按钮
      deleteCompanyBtn: '/deleteCompanyButton' // 删除按钮
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
    createDateValue () {
      if (moment(this.cDates[0]).valueOf() > moment(this.cDates[1]).valueOf()) {
        this.reverseArry(this.cDates);
      }
      return this.cDates.join('~');
    },
    reviseDateValue () {
      if (moment(this.uDates[0]).valueOf() > moment(this.uDates[1]).valueOf()) {
        this.reverseArry(this.uDates);
      }
      return this.uDates.join('~');
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
        this.tableHeight = window.innerHeight - 72;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  filters: {
    creDate (v) {
      let times = moment(v).format('YYYY-MM-DD HH:mm:ss');
      return times;
    }
  },
  created () {
    this._getList();
  },
  components: {
    BaseCreate,
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
    // 重置条件
    reset () {
      this.$refs.form.reset();
      this.pageNum = 1; // 默认从第一页开始查询
      this.cDates = [];
      this.uDates = [];
      this._getList();
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
    onPageChange (page) {
      this.pageNum = page;
      this._getList();
    },
    // 页数
    pageChange (p) {
      this.perPageNum = p;
      this.pageNum = 1;
      this._getList();
    },
    updateInputClick () {
      this.isdateShow = true;
    },
    dateChange (value) {
      if (this.cDates.length === 2) {
        this.isCreateDate = false;
      }
    },
    changUpDate () {
      if (this.uDates.length === 2) {
        this.isReviseDate = false;
      }
    },
    creDate (v) {
      let times = moment(v).format('YYYY-MM-DD HH:mm:ss');
      return times;
    },
    _getList () {
      let parms = {
        compName: this.form.compName,
        sign: this.form.sign,
        createTimeStart: this.cDates.length === 2 ? `${this.cDates[0] + ' ' + '00:00:00'}` : '',
        createTimeEnd: this.cDates.length === 2 ? `${this.cDates[1] + ' ' + '23:59:59'}` : '',
        updateTimeStart: this.uDates.length === 2 ? `${this.uDates[0] + ' ' + '00:00:00'}` : '',
        updateTimeEnd: this.uDates.length === 2 ? `${this.uDates[1] + ' ' + '23:59:59'}` : '',
        institutionNumber: this.form.institutionNumber,
        size: this.perPageNum,
        page: this.pageNum
      };
      let p = {};
      for (let k in parms) {
        if (parms[k]) {
          p[k] = parms[k];
        }
      };
      parms = p;
      getList(parms).then(res => {
        this.constItem = res.data.data.records;
        this.totalItems = res.data.data.total;
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      });
    },
    _addFunc () {
      this.dialog = true;
      this.mflag = 1;
      this.addOrEditHeader = {
        name: '添加公司',
        value: 'add',
        isEdit: false
      };
      this.addAndEditFormData = [
        { label: '公司名称：',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50)
          ]
        },
        { label: '公司法人：',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50)
          ] },
        { label: '公司地址：',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 100 || MAX_INPUT_LENGTH(100)
          ] },
        { label: '公司描述：',
          value: '',
          type: 'text',
          required: true,
          rules: [
            // v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 255 || MAX_INPUT_LENGTH(255)
          ] },
        { label: '公司标识：',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50)
          ] },
        { label: '机构号：',
          value: '',
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50)
          ] }
      ];
    },
    _addFuncNet (parms) {
      addFunc(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getList();
          this.dialog = false;
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
    // 编辑
    editFunc (item) {
      this.dialog = true;
      this.mflag = 2;
      this.zId = item.id;
      this.addOrEditHeader = {
        name: '查看公司',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        { label: '公司名称',
          value: item.compName,
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50)
          ] },
        { label: '公司法人',
          value: item.corporate,
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50)
          ] },
        { label: '公司地址',
          value: item.address,
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 100 || MAX_INPUT_LENGTH(100)
          ] },
        { label: '公司描述',
          value: item.profile,
          type: 'text',
          required: true,
          rules: [
            // v => !!v || NO_EMPTY_STRING, v => BASE_NAME.test(v) || BASE_NAME_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 255 || MAX_INPUT_LENGTH(255)
          ] },
        { label: '公司标识',
          value: item.sign,
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50)
          ] },
        { label: '机构号',
          value: item.institutionNumber,
          type: 'text',
          required: true,
          rules: [
            v => !!v || NO_EMPTY_STRING, v => BASE_VALUE.test(v) || BASE_VALUE_TEXT,
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50)
          ] }
      ];
    },
    _editFuncNet (parms) {
      editItem(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getList();
          this.dialog = false;
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
    saveFunc (arg) {
      let parms;
      if (this.mflag === 1) {
        parms = [{
          compName: arg[0][0].value,
          corporate: arg[0][1].value,
          address: arg[0][2].value,
          profile: arg[0][3].value,
          sign: arg[0][4].value,
          institutionNumber: arg[0][5].value
        }];
      } else {
        parms = {
          compName: arg[0][0].value,
          corporate: arg[0][1].value,
          address: arg[0][2].value,
          profile: arg[0][3].value,
          sign: arg[0][4].value,
          institutionNumber: arg[0][5].value,
          id: this.zId
        };
      }
      this.mflag === 1 ? this._addFuncNet({ companies: JSON.stringify(parms) }) : this._editFuncNet(parms);
    },
    cancelFunc (paramsData) {
      this.dialog = false;
      paramsData.reset();
    },
    searchFunc () {
      this.pageNum = 1; // 默认从第一页开始查询
      this._getList();
    },
    detCancleFunc () {
      this.detDialog = false;
    },
    detSaveFunc () {
      this.detDialog = false;
    },
    _detailFunc (item) {
      this.mComp = {
        compName: item.compName,
        corporate: item.corporate,
        address: item.address,
        profile: item.profile,
        sign: item.sign,
        institutionNumber: item.institutionNumber
      };
      let parms = {
        pid: item.id
      };
      detailFunc(parms).then(res => {
        this.zComp = res.data.data;
        this.detDialog = true;
      });
    },
    // 删除
    _deteleFunc (item) {
      this.dialogDel = true;
      this.deleteId = item.id;
    },
    constantDelCancle () {
      this.dialogDel = false;
    },
    deleteEnum () {
      let parms = {
        id: this.deleteId
      };
      deteleItem(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getList();
          this.dialogDel = false;
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
    // 配置子公司信息
    _zCompfunc (item) {
      this.zCompSet = {
        compName: item.compName,
        corporate: item.corporate,
        address: item.address,
        profile: item.profile,
        sign: item.sign,
        institutionNumber: item.institutionNumber
      };
      this.zzPid = item.id;
      this.__detailFunc__();
    },
    // 配置回显子公司信息
    __detailFunc__ () {
      let parms = {
        pid: this.zzPid
      };
      detailFunc(parms).then(res => {
        this.zzCompy = [];
        res.data.data.forEach(item => {
          this.zzCompy.push({
            compName: item.compName,
            corporate: item.corporate,
            sign: item.sign,
            address: item.address,
            profile: item.profile,
            pid: item.pid,
            id: item.id,
            institutionNumber: item.institutionNumber
          });
        });
        this.detDialogZgs = true;
      });
    },
    // 添加子公司
    addzzCompy () {
      this.zzCompy.push({
        compName: '',
        corporate: '',
        sign: '',
        address: '',
        profile: '',
        pid: this.zzPid,
        flg: 'child',
        id: ''
      });
    },
    cancleZcompFunc () {
      this.detDialogZgs = false;
      this.deleteZzCompyId = [];// 清空带删除id
      this.$refs.formVal.reset();
    },
    saveZcompFunc () {
      let fl = true;
      if (this.zzCompy.length) {
        this.zzCompy.forEach(el => {
          if (!el.compName || !el.corporate || !el.address || !el.profile || !el.sign || !el.institutionNumber) {
            fl = false;
            return false;
          }
        });
      }
      if (!fl) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请补全子公司信息';
        this.snackbarServeColor = 'error';
        return;
      }
      let parms = { companies: JSON.stringify(this.zzCompy) };
      // let parms = JSON.stringify(this.zzCompy);
      // return;
      addzcoFunc(parms).then(res => {
        if (res.data.code === 200) {
          if (this.deleteZzCompyId.length) {
            this.deleteChildCompy();// 删除带删除的子公司
          } else {
            this.detDialogZgs = false;
          }
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
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
    deleteChildCompy () {
      // 删除子公司信息
      let params = {
        id: this.deleteZzCompyId.join(',')
      };
      deteleItem(params).then(res => {
        if (res.data.code === 200) {
          this.deleteZzCompyId = [];// 清空带删除id
          this.detDialogZgs = false;
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
    // 点击删除按钮调用是否可删除校验接口
    __deleteZcomp (item, i) {
      if (item.id) {
        delChecked(item.id).then(res => {
          if (res.data.code === 200) {
            this.zzCompy.splice(i, 1);
            this.deleteZzCompyId.push(item.id);
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
      } else {
        this.zzCompy.pop();// 移除子公司数组的最后一个
      }
    },
    onChang (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看公司',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑公司',
          value: 'edit',
          isEdit: true
        };
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
.el-tr-defu:hover {
  background: var(--v-tableRowHoverActive-base);
}
.c-company-set {
  color: var(--v-primary-base);
  font-size: 12px;
  cursor: pointer;
  margin-right: 10px;
}
</style>
