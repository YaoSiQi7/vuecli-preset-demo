<!----------  @author: guxuerui  ----------->
<!----------  @updated_at: 2020-05-27  ----------->
<!----------  @version: 2.0  ----------->

<template>
  <div class="enu-content">
    <v-row no-gutters>
      <!-- 左侧树 -->
      <v-col cols="3" class="pr-3 fill-height">
        <v-card class="elevation-3">
          <v-card-text
            class="pa-0"
            :style="{ height: tableHeight + 85 + 'px', 'overflow-y': 'auto' }"
          >
            <!-- 搜索机构 -->
            <v-col
              class="head-left-sc"
              v-for="(item, index) in getTreeFormData"
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
              @getList="_getlist"
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
        <v-card class="pa-2 elevation-3" tile>
          <v-data-table
            :headers="headers"
            :items="desserts"
            hide-default-footer
            :fixed-header="true"
            :elevation="3"
            :items-per-page="20"
            no-results-text="没有匹配的数据"
            :height="tableHeight"
          >
            <template v-slot:item.actions="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    small
                    class="mr-3 icon-primary"
                    v-on="on"
                    color="primary"
                    @click="editPrivilege(item)"
                  >
                    edit
                  </v-icon>
                </template>
                <span>权限管理</span>
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
                      v-model="pageSize"
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
    <!-- 添加编辑弹窗 -->
    <base-create
      ref="baseCreate"
      :formHeader="addOrEditHeader"
      :crudFormDialog="dialog"
      :formData="addAndEditFormData"
      :baseCteateEditPowerBtn="editUserPermissionsBtn"
      @cancelCrudFormDialog="cancel($event)"
      @confimDialogSave="saveOrgZtion"
      @switchOnChange="onChange($event)"
    ></base-create>
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
import * as dataService from '../../api/userPrivileges.js';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import TreeView from '@/components/TreeView';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { mapGetters, mapActions } from 'vuex';
import { getAppListAll } from '../../api/queryHeaderAppList.js';
import {
  allRemoveRefrecord, // 批量删除引用记录
  allAddRefrecord // 批量添加引用记录
} from '../../api/ApplyManage';
import { getConfig } from 'api/systemConfiguration';
export default {
  components: {
    TreeView,
    Treeselect,
    BaseCreate,
    DelDialog
  },
  data () {
    return {
      fullHeight: window.innerHeight,
      realNames: '',
      usernames: '',
      // 分页
      pageSize: 10, // 每页10条
      perPageItems: [5, 10, 15, 20, 50, 100],
      totalItems: 0,
      pageNum: 1,
      queryPageLength: 0,
      // 用户id
      userId: '',
      userItem: {},
      flg: 1,
      isSnackbarTop: true,
      timeout: 2000,
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      dialogDel: false,
      addAndEditFormData: [],
      getTreeFormData: [
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
      // 列表树结构
      treeListDatas: [],
      desserts: [],
      // 表头
      headers: [
        { text: '用户名称', value: 'realName', sortable: false, align: 'left' },
        { text: '所属机构', value: 'departmentName', sortable: false },
        { text: '登录账号', value: 'username', sortable: false },
        { text: '操作', value: 'actions', sortable: false, width: '10%' }
      ],
      // 编辑保存前，编辑项的应用名称id
      oldAppNameId: '',
      // 数据权限是否开启
      isOpenData: false,
      // 增加按钮权限
      editUserPermissionsBtn: '/editUserPermissionsButton' // 表格编辑按钮
    };
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 170;
      }
    },
    ...mapGetters([
      'appName',
      'appId',
      'navItems',
      'appList'
    ])
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
    //
  },
  created () {
    this.initQueryTreeList();
    this.getFormData();
  },
  methods: {
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
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this._getlist(this.treeIds);
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this._getlist(this.treeIds);
    },

    // 更新store 的appList
    async getAppListAll () { // 点击获取应用列表数据
      let { data } = await getAppListAll();
      if (data.code === 200) {
        this.setAppList(data.data.appList);
      }
      let loginData = JSON.parse(localStorage.getItem('loginData'));
      loginData.appList = data.data.appList;
      localStorage.setItem('loginData', JSON.stringify(loginData));
    },
    ...mapActions([
      'setAppList'
    ]),
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
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
    // 批量删除、添加引用记录
    allRemoveAddRefrecord (parms) {
      let allRemoveRefrecordAry = {
        sourceId: this.oldAppNameId,
        targetId: this.userId
      };
      let allRemoveParams = {
        jsonStr: JSON.stringify(allRemoveRefrecordAry)
      };
      allRemoveRefrecord(allRemoveParams).then(res => {
        if (res.data.code === 200) {
          // 调用批量添加引用记录-开始点
          let allAddRefrecordAry = {
            sourceId: parms.tUserAppinfoStr,
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
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 弹框确定
    saveOrgZtion (arg, form) {
      let params = {};
      if (this.flg === 2) {
        params = {
          id: this.userId,
          tUserRoleStr: arg[0].value.join(','),
          tUserAppinfoStr: arg[1].value.join(','),
          tUserInstitutionStr: arg[2].value.join(',')
        };
        this._editItem(params, form);
      }
    },
    // 权限管理
    async _editItem (params, form) {
      try {
        const response = await dataService.allocation(params);
        if (response.data.code === 200) {
          this.message('编辑成功', 'success');
          if (this.oldAppNameId && this.oldAppNameId !== 'null') {
            this.allRemoveAddRefrecord(params);
          }
          this.getAppListAll();
          this.dialog = false;
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 获取是否开启数据权限
    getFormData () {
      let that = this;
      getConfig()
        .then(res => {
          if (res.data.code === 200) {
            let data = res.data.data;
            data.forEach(function (item, index) {
              if (item.ATAGDESCRIPTION === '数据权限配置') {
                item.INFO.forEach(function (cItem) {
                  let PVALUE = JSON.parse(cItem.PVALUE);
                  if (PVALUE.info === '0') {
                    that.isOpenData = true;
                  } else {
                    that.isOpenData = false;
                  }
                });
              }
            });
          }
        });
    },
    // 预权限管理
    async editPrivilege (item) {
      const params = {
        id: item.id
      };
      this.userId = item.id;
      try {
        const response = await dataService.prePrivilege(params);
        if (response.data.code === 200) {
          this.oldAppNameId = response.data.data.appIdList;
          const datas = response.data.data;
          this.dialog = true;
          this.flg = 2;
          this.addOrEditHeader = {
            name: '编辑',
            value: 'edit',
            isEdit: true
          };
          this.addAndEditFormData = [
            {
              label: '授权角色名称*',
              value: '',
              required: true,
              rules: [v => v.length > 0 || '授权角色名称不能为空'],
              type: 'select',
              multiple: true,
              selectText: 'selectText',
              selectField: 'selectField',
              options: []
            },
            {
              label: '授权应用名称*',
              value: '',
              required: true,
              rules: [v => v.length > 0 || '授权应用名称不能为空'],
              type: 'select',
              multiple: true,
              selectText: 'selectText',
              selectField: 'selectField',
              options: []
            },
            {
              label: '授权机构',
              value: [],
              required: this.isOpenData,
              rules: [v => v.length > 0 || '授权机构不能为空'],
              type: 'treeSelect',
              isMultiple: true,
              options: []
            }
          ];
          if (datas.amRoleList.length > 0 && datas.sysAppInfoList.length > 0) {
            datas.amRoleList.forEach(items => {
              this.addAndEditFormData[0].options.push({
                selectText: items.name,
                selectField: items.id
              });
            });
            datas.sysAppInfoList.forEach(items => {
              this.addAndEditFormData[1].options.push({
                selectText: items.appName,
                selectField: items.id
              });
            });
            let resetArr = function (arr) {
              let newArr = [];
              let obj = {};
              arr.forEach((item) => {
                obj = {
                  label: item.name,
                  id: item.id
                };
                if (item.children && item.children.length > 0) {
                  obj.children = resetArr(item.children);
                }
                newArr.push(obj);
              });
              return newArr;
            };
            this.addAndEditFormData[2].options = [];
            this.addAndEditFormData[2].options = resetArr(datas.amDepartmentList);
          } else {
            this.addAndEditFormData[0].options = [];
            this.addAndEditFormData[1].options = [];
            this.addAndEditFormData[2].options = [];
          }
          if (datas.roleIdList !== '') {
            this.addAndEditFormData[0].value = datas.roleIdList.split(',');
          }
          if (datas.appIdList !== '') {
            this.addAndEditFormData[1].value = datas.appIdList.split(',');
          }
          if (datas.institutionNumberList !== '') {
            // this.addAndEditFormData[2].value = datas.institutionNumberList.split(',');
            this.$nextTick(() => {
              this.addAndEditFormData[2].value = datas.institutionNumberList.split(',');
            });
          }
          if (datas.institutionNumberList === '') {
            this.$nextTick(() => {
              this.addAndEditFormData[2].value = [];
            });
          }
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 弹框取消
    cancel () {
      this.dialog = false;
    },
    // 机构组织树
    async queryTreeSelect (node) {
      this.realNames = '';
      this.usernames = '';
      const params = {
        companyId: node.id
      };
      try {
        const response = await dataService.queryTreeList(params);
        if (response.data.code === 200) {
          this.$nextTick(() => {
            this.treeListDatas = [response.data.data.items];
            this._getlist([this.treeListDatas[0].id]);
          });
          this.desserts = [];
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 获取下拉树
    async initQueryTreeList () {
      try {
        const response = await dataService.queryTreeSelectList();
        if (response.data.code === 200) {
          const datas = response.data.data;
          this.getTreeFormData[0].options = datas.companyItems;
          this.getTreeFormData[0].placeholder = datas.firstCompanyName;
          this.treeListDatas = [datas.amDepartmentItems];
          this._getlist([this.treeListDatas[0].id]);
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 列表
    async _getlist (ev) {
      const params = {
        id: ev[0],
        realName: this.realNames,
        username: this.usernames,
        pageSize: this.pageSize,
        page: this.pageNum
      };
      this.treeIds = [ev[0]];
      try {
        const response = await dataService.queryTableList(params);
        if (response.data.code === 200) {
          if (response.data.data.list.length > 0) {
            this.desserts = response.data.data.list;
            this.totalItems = response.data.data.total;
            this.queryPageLength = Math.ceil(this.totalItems / this.pageSize);
          } else {
            this.desserts = [];
          }
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
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
