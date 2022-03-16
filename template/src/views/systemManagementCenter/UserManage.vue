<!----------  @author: yijianchao  ----------->
<!----------  @updated_at: 2020-11-16  ----------->
<!----------  @version: 1.3.0  ----------->

<template>
  <div class="enu-content">
    <v-row no-gutters>
      <!-- 左侧树 -->
      <v-col cols="3" class="pr-3 fill-height">
        <v-card class="elevation-3">
          <v-card-text
            class="pa-0"
            :style="{ height: tableHeight + 87 + 'px', 'overflow-y': 'auto' }"
          >
            <!-- 搜索机构 -->
            <v-col
              class="head-left-sc"
              v-for="(item, index) in addTreeFormData"
              :key="index"
            >
              <treeselect
                :value-consists-of="item.valueConsistsOf"
                :multiple="item.isMultiple"
                :options="item.options"
                :placeholder="item.placeholder"
                :default-expand-level="0"
                :flatten-search-results="true"
                noResultsText="没有匹配数据"
                v-model="item.value"
                :show-count="false"
                :clearable="false"
                no-data-text="没有匹配数据"
                @select="queryTreeSelect"
              />
            </v-col>
            <tree-view
              :items="treeListDatas"
              :isShowIcon="false"
              :openIds="treeOpenIdList"
              @getList="changeTreeList"
            ></tree-view>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- 列表 -->
      <v-col cols="9">
        <!-- 搜索表单 -->
        <v-card class="elevation-3">
          <v-form ref="form" lazy-validation class="mb-3" tile>
            <v-container grid-list-xl class="ma-0 pa-0">
              <v-row class="ma-0 py-0">
                <v-col md="2">
                  <v-text-field
                    v-model="realNames"
                    placeholder="用户名称："
                    outlined
                    dense
                    class="py-0"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="usernames"
                    placeholder="登录账号："
                    outlined
                    dense
                    class="py-0"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="phoneNumber"
                    placeholder="手机号："
                    outlined
                    dense
                    class="py-0"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="email"
                    placeholder="邮箱："
                    outlined
                    dense
                    class="py-0"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-btn
                    small
                    color="primary"
                    class="mt-2 mr-2 elevation-3"
                    @click="reset"
                  >重置</v-btn
                  >
                  <v-btn
                    small
                    color="primary"
                    class="mt-2 elevation-3"
                    @click="queryList"
                  >查询</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
        <v-card class="pa-2 pb-0 elevation-3" tile>
          <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :fixed-header="true"
            :items-per-page="20"
            no-results-text="没有匹配的数据"
            :height="tableHeight - '122' + 'px'"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-spacer />
                <v-btn
                  color="primary"
                  class="mr-2 mt-1"
                  v-if="hasPermission(addUserBtn)"
                  @click="addUser"
                  :disabled="isDisabled"
                >添加</v-btn
                >
                <v-btn
                  color="primary"
                  class="mr-2 mt-1"
                  v-if="hasPermission(importUserBtn)"
                  @click="uploadDialog = true"
                >导入</v-btn
                >
                <v-btn
                  color="primary"
                  class="mr-1 mt-1"
                  v-if="hasPermission(exportUserBtn)"
                  @click="exportData"
                >导出</v-btn
                >
              </v-toolbar>
            </template>
            <template v-slot:body="{ items }">
              <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
                <td colspan="9">没有数据</td>
              </tr>
              <tr
                v-else
                v-for="(item, index) in items"
                :key="index"
                class="el-tr-defu"
              >
                <td class="el-border-defu">
                  {{ item.realName }}
                </td>
                <td class="el-border-defu">
                  {{ item.departmentName }}
                </td>
                <td class="el-border-defu">
                  {{ item.username }}
                </td>
                <td class="el-border-defu">
                  {{ item.phoneNumber }}
                </td>
                <td class="el-border-defu">
                  {{ item.email }}
                </td>
                <td class="el-border-defu">
                  {{ item.states == 0 ? "禁用" : "启用" }}
                </td>
                <td class="el-border-defu">
                  <v-switch
                    v-model="item.states"
                    color="primary"
                    @change="constMenu(item)"
                  />
                </td>
                <td class="el-border-defu">
                  {{ item.createTime }}
                </td>
                <td class="el-border-defu">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="resetPwd(item.id)"
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
                        class="mr-2 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="editPwd(item)"
                      >
                        mdi-lock-reset
                      </v-icon>
                    </template>
                    <span>重置</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="unLockStateFn(item.id)"
                      >
                        mdi-lock-open-variant
                      </v-icon>
                    </template>
                    <span>解锁</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="hasPermission(deleteUserBtn)">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-1 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="removes(item.id)"
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
                    /> </span
                  >条
                  <span style="margin-left: 15px">共{{ totalItems }}条</span>
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
        </v-card>
      </v-col>
    </v-row>
    <!-- 导入表格 -->
    <v-dialog v-model="uploadDialog" persistent scrollable max-width="460px">
      <v-card height="260px">
        <v-card-title>
          <v-toolbar-title> 导入表格数据 </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn icon dark @click="cancelUpload">
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form
            ref="uploadFileForm"
            :lazy-validation="lazy"
            v-model="uploadFormValid"
          >
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10" class="mt-10">
                <v-file-input
                  v-model="fileInfo"
                  required
                  :rules="[(v) => !!v || '请选择文件']"
                  show-size
                  accept=".xlsx"
                  :disabled="uploadIsLoading"
                  :loading="uploadIsLoading"
                  prepend-icon=""
                  outlined
                  dense
                  label="点击选择文件，文件后缀为: .xlsx"
                >
                </v-file-input>
                <div style="font-size: 12px">
                  说明：新导入的用户，登录密码默认为123456789
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="primary mr-4"
              outlined
              style="color: white"
              @click="downloadTemp"
            >下载模板
            </v-btn>
            <v-btn
              class="primary mr-4"
              style="margin-right: 10px; color: white"
              @click="uploadFile"
              :disabled="!uploadFormValid"
              :loading="btnLoading"
            >
              导入
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 添加编辑弹窗 -->
    <base-create
      ref="baseCreate"
      :formHeader="addOrEditHeader"
      :crudFormDialog="dialog"
      :formData="addAndEditFormData"
      :baseCteateEditPowerBtn="editUserBtn"
      @cancelCrudFormDialog="cancel($event)"
      @confimDialogSave="saveOrgZtion"
      @switchOnChange="onChange($event)"
    ></base-create>
    <!-- // 重置密码 -->
    <v-row justify="center">
      <v-dialog
        v-model="dialogEditShow"
        persistent
        scrollable
        max-width="500px"
      >
        <v-card class="baseCardStyle">
          <v-card-title>
            <v-toolbar-title>重置密码</v-toolbar-title>
            <div class="flex-grow-1" />
            <v-btn icon dark @click="canceleditDialog">
              <v-icon color="var(--v-headerCloseIconColor-base)"
              >mdi-close</v-icon
              >
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form
              class="ruleSetAddOrEdit"
              ref="editPwdForm"
              v-model="valid"
              :lazy-validation="lazy"
            >
              <v-row>
                <v-col cols="2">
                </v-col>
                <v-col cols="8">
                  <v-text-field
                    label="现密码*"
                    required
                    type="password"
                    :counter="20"
                    :rules="pwdPolicyRules"
                    v-model.trim="editPwdForm.newPassword"
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
                    label="确认现密码*"
                    required
                    type="password"
                    :counter="20"
                    :rules="okPwdPolicyRules"
                    v-model.trim="editPwdForm.okPassword"
                    outlined
                    dense
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
                @click="canceleditDialog"
              >取消
              </v-btn>
              <v-btn
                class="primary mr-4"
                style="margin-right: 10px; color: white"
                @click="sureEditDialog()"
                :disabled="!valid"
              >
                保存
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- // -->
    <del-dialog
      :isDialogShow="dialogDel"
      @cancelDel="constantDelCancle($event)"
      @confimDel="deleteEnum($event)"
    ></del-dialog>
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
  queryTreeSelectList,
  queryTreeList,
  queryTableList,
  preAdds,
  addItem,
  preEdits,
  editItem,
  removeItem,
  updateStates,
  getExportData,
  getTemplData,
  importData,
  queryTreeSelectListNew,
  editNewItem,
  unLockState
} from '../../api/UserManage.js';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';
import Treeselect from '@riophae/vue-treeselect';
import { NO_EMPTY_SPACE_ALLOWED, NAME_NOT_NULL, BASE_EMAIL, BASE_PHONE_TEST, BASE_EMAIL_TEXT, BASE_PHONE } from 'utils/validate';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { getRulesState } from 'utils/pwdPolicy';
import { getPwdPolicy } from 'api/login';
export default {
  components: {
    TreeView,
    Treeselect,
    BaseCreate,
    DelDialog
  },
  data () {
    return {
      btnLoading: false, // 按钮添加loading，避免多次提交
      treeOpenIdList: [], // 树结构所有节点id
      // 上传表格变量
      uploadDialog: false,
      uploadFormValid: true,
      lazy: false,
      Affiliatelistset: '', // 上传表格时，所属名单集变量
      fileInfo: null,
      uploadIsLoading: false,
      // ----
      fullHeight: window.innerHeight,
      realNames: '',
      usernames: '',
      phoneNumber: '',
      email: '',
      // 是否可添加
      isDisabled: true,
      detId: '',
      // 预添加编辑参数
      addEditIds: {},
      flg: 1,
      isSnackbarTop: true,
      timeout: 2000,
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      dialogDel: false,
      addAndEditFormData: [],
      addTreeFormData: [
        {
          required: true,
          type: 'treeSelect',
          placeholder: '',
          value: null,
          valueConsistsOf: 'BRANCH_PRIORITY',
          options: []
        }
      ],
      dialog: false,
      addOrEditHeader: {},
      // 交互ID
      treeIds: [],
      // 分页
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 列表树结构
      treeListDatas: [],
      // 获取机构下拉树数据
      treeListDatasNew: [], // 公司
      treeListDatasAm: [], // 机构
      desserts: [],
      // 表头
      headers: [
        { text: '用户名称', value: 'realName', sortable: false, align: 'left', width: 100 },
        { text: '所属机构', value: 'companyName', sortable: false, width: 100 },
        { text: '登录账号', value: 'username', sortable: false, width: 100 },
        { text: '手机号', value: 'phoneNumber', sortable: false, width: 100 },
        { text: '邮箱', value: 'email', sortable: false, width: 100 },
        { text: '账号状态', value: 'states', sortable: false, width: 100 },
        { text: '启用/禁用', value: 'states', sortable: false, width: 100 },
        { text: '创建时间', value: 'createTime', sortable: false, width: 100 },
        { text: '操作', value: '', sortable: false, width: 130 }
      ],
      // 增加按钮权限
      addUserBtn: '/addUserButton', // 控制添加按钮是否展示
      editUserBtn: '/editUserButton', // 表格编辑按钮
      deleteUserBtn: '/deleteUserButton', // 表格删除功能
      importUserBtn: '/importUserButton', // 控制导入按钮是否显示
      exportUserBtn: '/exportUserButton', // 表格导出按钮是否显示
      // 密码复杂策略
      pwdPolicy: {},
      pwdPolicyTips: '',
      pwdPolicyRules: [
        v => !!v || '登录密码不能为空',
        v => (v && v.length <= 20) || '最多只能输入20个字符'
      ],
      okPwdPolicyRules: [
        v => !!v || '确认密码不能为空',
        v => (v && v.length <= 20) || '最多只能输入20个字符'
      ],
      // edit密码
      dialogEditShow: false,
      editPwdForm: {
        newPassword: '', // 新密码
        okPassword: '' // 确认新密码
      },
      valid: false,
      passwordEdit: {
        userId: '',
        loginpwd: '',
        flag: true
      }
    };
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 172;
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  filters: {
    //
  },
  watch: {
    search (val) {
      if (val) {
        this.queryPageLength = 0;
      } else {
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
      }
    }
  },
  created () {
    this.initQueryTreeList();
    this._queryTreeSelectListNew();
    this.getPwdPolicy();
  },
  methods: {
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 解锁用户
    unLockStateFn (id) {
      unLockState({ id: id }).then(res => {
        if (res.data.data === 'ok') {
          this.message('解锁成功', 'success');
        } else {
          this.message('该用户未被锁定，不需要解锁', 'error');
        }
      }).catch(err => {
        this.message(err.msg, 'error');
      });
    },
    getPwdPolicy () { // 获取密码复杂度配置
      getPwdPolicy()
        .then(res => {
          let data = res.data.data;
          this.pwdPolicy = res.data.data;
          let str = '';
          if (res.data.data.info === '1') {
            data.complicatedUnit.forEach(item => {
              if (data.complicated.indexOf(item.info) !== -1) {
                str += item.desc + '、';
              }
            });
            str = str.replace(/、$/, '');
            this.pwdPolicyTips = '密码长度最小' + data.miniLength + '位，至少包含' + str + '中的' + data.complicatedNum + '种类型组合';
            this.pwdPolicyRules.push(
              v => (getRulesState(data.complicated, data.complicatedNum, data.miniLength, v)) || this.pwdPolicyTips
            );
            this.okPwdPolicyRules.push(
              v => (getRulesState(data.complicated, data.complicatedNum, data.miniLength, v)) || this.pwdPolicyTips
            );
          }
        });
    },
    // 获取机构下拉树
    _queryTreeSelectListNew () {
      queryTreeSelectListNew()
        .then(res => {
          if (res.data.code === 200) {
            // this.treeListDatasNew = res.data.data.amDepartmentItems;
            this.treeListDatasAm = res.data.data.amDepartmentItems;
            this.treeListDatasNew = res.data.data.companyItems;
          } else {
            this.message(res.data.msg, 'error');
          }
        })
        .catch(err => {
          this.message(err.msg, 'error');
        });
    },
    // 导入表格数据
    uploadFile () {
      if (this.$refs.uploadFileForm.validate()) {
        this.uploadIsLoading = true;
        this.btnLoading = true;
        let formData = new FormData();
        // 把文件信息放入对象中
        formData.append('file', this.fileInfo);
        formData.append('listId', this.Affiliatelistset);
        // formData.append('expireTime', this.getTimes(this.importDate)); // 导入弹框增加失效时间(暂时没用此功能)
        importData(formData).then(res => {
          this.btnLoading = false;
          this.message(res.data.msg, 'success');
          this.cancelUpload();
          this._getlist(this.treeIds); // 刷新列表
        }).catch(err => {
          this.message(err.msg, 'error');
          this.uploadIsLoading = false;
          this.btnLoading = false;
        });
      }
    },
    cancelUpload () {
      this.$refs.uploadFileForm.reset();
      this.uploadDialog = false;
      this.uploadIsLoading = false;
    },
    // 下载模板
    downloadTemp () {
      getTemplData().then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = '用户数据模板' + '.xlsx';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.message(err.msg, 'error');
      });
    },
    // 导出数据
    exportData () {
      getExportData().then(res => {
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = '用户数据' + '.xlsx';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.message(err.msg, 'error');
      });
    },
    // 状态
    constMenu (item) {
      const params = {
        id: item.id,
        states: item.states ? '0' : '1'
      };
      updateStates(params)
        .then(res => {
          if (res.data.code === 200) {
            this.message(item.states ? '启用成功' : '禁用成功', 'success');
            this._getlist(this.treeIds);
          } else {
            this._getlist(this.treeIds);
            this.message(res.data.msg);
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 查询
    queryList () {
      this.pageNum = 1;
      this._getlist(this.treeIds);
    },
    // 重置条件
    reset () {
      this.$refs.form.reset();
      this._getlist(this.treeIds);
    },
    constantDelCancle () {
      this.dialogDel = false;
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 编辑状态
    onChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑',
          value: 'edit',
          isEdit: true
        };
      }
    },
    // 对用户登录密码进行3次加密
    encodeFun (loginpwd) {
      // encode方法在 main.js
      let pwd = this.encode(loginpwd);
      let pwdx = this.encode('X' + pwd);
      let pwdxd = this.encode('D' + pwdx);
      return pwdxd;
    },
    // 弹框确定
    saveOrgZtion (arg, form) {
      let isPhone = /^1[3456789]\d{9}$/;// 手机号验证
      let isEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;// 邮箱验证
      let params = {};
      if (this.flg === 1) {
        if (arg[3].value !== arg[4].value) {
          this.message('两次密码填写不一致', 'error');
          return false;
        }
        if (this.pwdPolicyTips && !getRulesState(this.pwdPolicy.complicated, this.pwdPolicy.complicatedNum, this.pwdPolicy.miniLength, arg[3].value)) {
          this.message(this.pwdPolicyTips, 'error');
          return false;
        }
        if (arg[6].value && !isPhone.test(arg[6].value)) {
          this.message('请输入正确的手机号码', 'error');
          this.$refs.baseCreate.isEditMode = true;
          return false;
        }
        if (arg[7].value && !isEmail.test(arg[7].value)) {
          this.message('请输入正确的邮箱地址', 'error');
          this.$refs.baseCreate.isEditMode = true;
          return false;
        }
        // let loginpwd = this.encodeFun(arg[3].value);
        params = {
          departmentId: this.treeIds[0],
          realName: arg[1].value,
          username: arg[2].value,
          loginpwd: arg[3].value,
          expiration: arg[5].value,
          phoneNumber: arg[6].value,
          email: arg[7].value
        };
        this._addItem(params, form);
      }
      if (this.flg === 2) {
        // if (arg[2].value !== arg[3].value) {
        //   this.message('两次密码填写不一致', 'error');
        //   this.$refs.baseCreate.isEditMode = true;
        //   return false;
        // }
        // if (arg[2].value !== 'loginpwd' && this.pwdPolicyTips && !getRulesState(this.pwdPolicy.complicated, this.pwdPolicy.complicatedNum, this.pwdPolicy.miniLength, arg[2].value)) {
        //   this.message(this.pwdPolicyTips, 'error');
        //   return false;
        // }
        if (arg[3].value && !isPhone.test(arg[3].value)) {
          this.message('请输入正确的手机号码', 'error');
          this.$refs.baseCreate.isEditMode = true;
          return false;
        }
        // let loginpwd = this.encodeFun(arg[3].value);
        // params = {
        //   id: this.addEditIds.id,
        //   loginpwd: loginpwd
        // };this.addAndEditFormData
        params = {
          id: this.addEditIds.id,
          departmentId: this.addAndEditFormData[0].value,
          // loginpwd: this.addAndEditFormData[2].value,
          // expiration: this.addAndEditFormData[4].value,
          // phoneNumber: this.addAndEditFormData[5].value,
          // email: this.addAndEditFormData[6].value,
          expiration: this.addAndEditFormData[2].value,
          phoneNumber: this.addAndEditFormData[3].value,
          email: this.addAndEditFormData[4].value
        };
        this._editItem(params, form);
      }
    },
    // 弹框取消
    cancel () {
      this.dialog = false;
    },
    // 删除
    deleteEnum (arg, form) {
      const params = {
        id: this.detId
      };
      if (!this.detId) return;
      removeItem(params).then(res => {
        if (res.data.code === 200) {
          this.message('删除成功', 'success');
          this.dialogDel = false;
          this.dialog = false;
          this._getlist(this.treeIds);
        } else {
          this.message(res.data.msg, 'error');
        }
      },
      err => {
        this.message(err.msg);
      });
    },
    // 预删除
    removes (id) {
      this.dialogDel = true;
      this.detId = id;
    },
    // edit取消
    canceleditDialog () {
      this.dialogEditShow = false;
      this.$refs.editPwdForm.reset();
    },
    // edit确认
    sureEditDialog () {
      if (this.editPwdForm.newPassword === '' || this.editPwdForm.okPassword === '') {
        this.message('密码框不可为空', 'error');
        return false;
      }
      if (this.editPwdForm.newPassword !== this.editPwdForm.okPassword) {
        this.message('两次密码填写不一致', 'error');
        return false;
      } else {
        this.passwordEdit.loginpwd = this.editPwdForm.newPassword;
      }
      // 对用户登录密码进行3次加密
      // encode方法在 main.js
      let pwd = this.encode(this.passwordEdit.loginpwd);
      let pwdx = this.encode('X' + pwd);
      let pwdxd = this.encode('D' + pwdx);
      this.passwordEdit.loginpwd = pwdxd;
      editNewItem(this.passwordEdit).then(res => {
        if (res.data.code === 200) {
          this.dialogEditShow = false;
          this.message('修改成功', 'success');
          this.$refs.editPwdForm.reset();
        }
      }).catch(err => {
        this.message(err.data.msg, 'error');
      });
    },
    // 重置新密码
    editPwd (query) {
      this.dialogEditShow = true;
      this.passwordEdit.userId = query.id;
    },
    // 编辑
    _editItem (params, form) {
      // 对用户登录密码进行3次加密
      // encode方法在 main.js
      // let pwd = this.encode(params.loginpwd);
      // let pwdx = this.encode('X' + pwd);
      // let pwdxd = this.encode('D' + pwdx);
      // params.loginpwd = pwdxd;
      editItem(params).then(res => {
        if (res.data.code === 200) {
          this.message(res.data.msg, 'success');
          this.dialog = false;
          this._getlist(this.treeIds);
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 预编辑
    resetPwd (id) {
      let getFullYear = new Date().getFullYear();
      let getMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      let getDate = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let currentTime = `${getFullYear}-${getMonth}-${getDate}`;
      const params = {
        id: id
      };
      preEdits(params)
        .then(res => {
          if (res.data.code === 200) {
            const data = res.data.data.data;
            this.addEditIds = data;
            this.dialog = true;
            this.flg = 2;
            this.addOrEditHeader = {
              name: '编辑',
              value: 'edit',
              isEdit: true
            };
            if (data.departmentId !== null) {
              this.addAndEditFormData = [
                {
                  label: '所属机构*',
                  placeholder: '所属机构*',
                  value: data.departmentId,
                  required: true,
                  rules: [v => !!v || NAME_NOT_NULL('所属机构')],
                  type: 'treeSelect',
                  isMultiple: false,
                  valueConsistsOf: 'BRANCH_PRIORITY',
                  options: this.treeListDatasAm
                },
                {
                  label: '登录账号*',
                  value: data.username,
                  type: 'noEditText'
                },
                // {
                //   label: '登录密码*',
                //   value: 'loginpwd',
                //   type: 'text',
                //   inputType: 'password',
                //   rules: this.pwdPolicyRules,
                //   counter: '20'
                // },
                // {
                //   label: '确认密码*',
                //   value: 'loginpwd',
                //   type: 'text',
                //   inputType: 'password',
                //   rules: this.okPwdPolicyRules,
                //   counter: '20'
                // },
                {
                  label: '过期时间',
                  value: data.expirationStr,
                  minTime: currentTime,
                  type: 'dateSelection'
                },
                {
                  label: '手机号',
                  value: data.phoneNumber,
                  type: 'text',
                  counter: '11'
                },
                {
                  label: '邮箱',
                  value: data.email,
                  type: 'text'
                }
              ];
            } else {
              this.addAndEditFormData = [
                {
                  label: '所属机构*',
                  placeholder: '所属机构*',
                  value: data.companyId,
                  required: true,
                  rules: [v => !!v || NAME_NOT_NULL('所属机构')],
                  type: 'treeSelect',
                  isMultiple: false,
                  valueConsistsOf: 'BRANCH_PRIORITY',
                  options: this.treeListDatasAm
                },
                {
                  label: '登录账号*',
                  value: data.username,
                  type: 'noEditText'
                },
                // {
                //   label: '登录密码*',
                //   value: 'loginpwd',
                //   type: 'text',
                //   inputType: 'password',
                //   rules: this.pwdPolicyRules,
                //   counter: '20'
                // },
                // {
                //   label: '确认密码*',
                //   value: 'loginpwd',
                //   type: 'text',
                //   inputType: 'password',
                //   rules: this.okPwdPolicyRules,
                //   counter: '20'
                // },
                {
                  label: '过期时间',
                  value: data.expirationStr,
                  minTime: currentTime,
                  type: 'dateSelection'
                },
                {
                  label: '手机号',
                  value: data.phoneNumber,
                  type: 'text',
                  counter: '11'
                },
                {
                  label: '邮箱',
                  value: data.email,
                  type: 'text'
                }
              ];
            };
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 添加成功
    _addItem (params, form) {
      // 对用户登录密码进行3次加密
      // encode方法在 main.js
      let pwd = this.encode(params.loginpwd);
      let pwdx = this.encode('X' + pwd);
      let pwdxd = this.encode('D' + pwdx);
      params.loginpwd = pwdxd;
      // console.log(params)
      addItem(params).then(res => {
        if (res.data.code === 200) {
          this.message('添加成功', 'success');
          this.dialog = false;
          this._getlist(this.treeIds);
        } else {
          this.message(res.data.msg);
        }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 预添加
    addUser () {
      let getFullYear = new Date().getFullYear();
      let getMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      let getDate = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let currentTime = `${getFullYear}-${getMonth}-${getDate}`;
      const params = {
        id: this.treeIds[0]
      };
      preAdds(params)
        .then(res => {
          if (res.data.code === 200) {
            const data = res.data.data.data;
            this.addEditIds = res.data.data.data;
            this.dialog = true;
            this.flg = 1;
            this.addOrEditHeader = {
              name: '添加',
              value: 'add',
              isEdit: false
            };
            this.addAndEditFormData = [
              {
                label: '所属机构*',
                value: data.departmentName || data.companyName,
                type: 'noEditText'
              },
              {
                label: '用户名称*',
                value: '',
                type: 'text',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED,
                  v => (v && v.length <= 10) || '最大10字符',
                  v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                ],
                counter: '10'
              },
              {
                label: '登录账号*',
                value: '',
                type: 'text',
                rules: [
                  v => !!v || NO_EMPTY_SPACE_ALLOWED,
                  v => (v && v.length <= 100) || '最大100字符',
                  v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
                ],
                counter: '100'
              },
              {
                label: '登录密码*',
                value: '',
                type: 'text',
                inputType: 'password',
                rules: this.pwdPolicyRules,
                counter: '20'
              },
              {
                label: '确认密码*',
                value: '',
                type: 'text',
                inputType: 'password',
                rules: this.okPwdPolicyRules,
                counter: '20'
              },
              {
                label: '过期时间',
                value: '',
                minTime: currentTime,
                type: 'dateSelection'
              },
              {
                label: '手机号',
                value: '',
                type: 'text',
                counter: '11'
              },
              {
                label: '邮箱',
                value: '',
                type: 'text'
              }
            ];
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this._getlist(this.treeIds);
    },
    // 页数
    pageChange (p) {
      this.pageNum = 1;
      this.perPageNum = p;
      this._getlist(this.treeIds);
    },
    // 机构组织树
    queryTreeSelect (node) {
      this.realNames = '';
      this.usernames = '';
      const params = {
        companyId: node.id
      };
      queryTreeList(params)
        .then(res => {
          if (res.data.code === 200) {
            this.$nextTick(() => {
              this.treeListDatas = [res.data.data.items];
              this.treeOpenIdList = [];
              this.getIds(this.treeListDatas);
              this._getlist([this.treeListDatas[0].id]);
            });
            this.isDisabled = true;
            this.desserts = [];
            this.queryPageLength = 0;
          } else {
            this.message(res.data.msg);
          }
        },
        err => {
          this.message(err.msg);
        });
    },
    // 获取下拉树
    initQueryTreeList () {
      queryTreeSelectList()
        .then(res => {
          if (res && res.data.code === 200) {
            const datas = res.data.data;
            this.addTreeFormData[0].options = datas.companyItems;
            this.addTreeFormData[0].placeholder = datas.firstCompanyName;
            this.treeListDatas = [datas.amDepartmentItems];
            this.treeOpenIdList = [];
            this.getIds(this.treeListDatas);
            this._getlist([this.treeListDatas[0].id]);
          } else {
            this.message(res.data.msg);
          }
        }).catch(err => {
          console.error(err);
        });
    },
    // 获取下拉树所有节点id
    getIds (arr) {
      arr.forEach(item => {
        this.treeOpenIdList.push(item.id);
        if (item.children && item.children.length) {
          this.getIds(item.children);
        }
      });
    },
    changeTreeList (ev) {
      this.pageNum = 1;
      this.perPageNum = 10;
      this._getlist(ev);
    },
    // 列表
    _getlist (ev) {
      const params = {
        id: ev[0],
        page: this.pageNum,
        pageSize: this.perPageNum,
        realName: this.realNames,
        username: this.usernames,
        phoneNumber: this.phoneNumber,
        email: this.email
      };
      this.treeIds = [ev[0]];
      queryTableList(params)
        .then(res => {
          if (res && res.data.code === 200) {
            if (res.data.data.list.length > 0) {
              // let list = res.data.data.list;
              // list.map(item => {
              //   item.states === 1 ? item.sta = true : item.sta = false;
              // });
              this.desserts = res.data.data.list;
              this.totalItems = res.data.data.total;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
            } else {
              this.desserts = [];
              this.totalItems = 0;
              this.queryPageLength = 0;
            }
            this.isDisabled = false;
          } else {
            this.message(res.data.msg);
          }
        });
      // .catch(err => {
      //   // console.error(err);
      // });
    }
  }
};
</script>
<style lang="stylus" scoped>
.vue-treeselect__control
  background none
.head-left-sc
  padding 10px 24px
  border none
.v-treeview-node.v-treeview-node--rounded .v-treeview-node__root
  margin-top 1px
  margin-bottom 1px
.v-treeview-node--leaf>.v-treeview-node__root
  padding-left 1px
.v-treeview-node
  margin-left 0
>>>.v-treeview-node__label
  overflow visible
</style>
