<!----------  @author: YinGuoZheng  ----------->
<!----------  @updated_at: 2020-04-20  ----------->
<!----------  @version: 2.0  ----------->

<template>
  <div class="enu-content fill-height">
    <!-- 搜索表单 -->
    <base-search @change="panelCounter">
      <template v-slot>
        <!-- 条件查询 -->
        <slot>
          <v-form>
            <v-container grid-list-xl class="ml-0 mr-0 pt-0 pb-0">
              <v-row>
                <v-col cols="12" sm="12" md="2" xl="2">
                  <v-text-field
                    outlined
                    dense
                    v-model="dateArray"
                    append-icon="event"
                    placeholder="创建时间"
                    @click="dateInputClick"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="2"
                  xl="2"
                  style="padding-top: 18px"
                >
                  <v-btn color="primary" class="mr-2" @click="resetSearchData">
                    重置
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="searchList"
                    :disabled="!searchValid"
                  >
                    查询
                  </v-btn>
                </v-col>
                <v-col small cols="12" sm="12" md="2" xl="2">
                  <v-dialog v-model="isdateShow" width="321">
                    <v-date-picker
                      selected-items-text="已选择日期"
                      v-model="dateArray"
                      range
                      @change="dateChange(dateArray)"
                    ></v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </slot>
      </template>
    </base-search>
    <v-data-table
      ref="nameListSetTable"
      :headers="roleListSetHeaders"
      :items="roleListData"
      :items-per-page="perPageNum"
      hide-default-footer
      :fixed-header="true"
      :elevation="3"
      no-data-text="没有匹配数据"
      class="elevation-3 mt-3 pl-3 pr-3"
      :height="tableHeight"
    >
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar flat height="60px">
          <v-spacer />
          <v-btn
            color="primary"
            disabled
            class="mr-1 mt-1 ml-4"
            v-if="hasPermission(exportAppPerBtn)"
            @click="exportAppListData"
            >导出</v-btn
          >
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-3 icon-primary"
              v-on="on"
              color="primary"
              :disabled="item.ref"
              @click="interfaceAuthority(item)"
            >
              edit
            </v-icon>
          </template>
          <span>接口权限管理</span>
        </v-tooltip>
      </template>
      <!-- 分页 -->
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
    <!-- 添加编辑弹窗 -->
    <template>
      <v-row justify="center">
        <v-dialog
          v-model="crudFormDialog"
          persistent
          scrollable
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <!-- 查看 -->
              <v-toolbar-title v-if="!isEditMode"> 查看 </v-toolbar-title>
              <!-- 编辑 -->
              <v-toolbar-title v-else> 编辑 </v-toolbar-title>
              <!-- 取消 -->
              <div class="flex-grow-1" />
              <v-btn icon dark @click="cancelCrudFormDialog">
                <v-icon color="#CCCCCC">mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="max-height: 600px">
              <v-container>
                <slot>
                  <div>
                    <v-row>
                      <v-col cols="5"></v-col>
                      <v-col cols="7" justify-left>
                        <v-switch
                          v-model="isEditMode"
                          inset
                          dense
                          v-if="hasPermission(editAppPerBtn)"
                          label="启用编辑"
                        >
                        </v-switch>
                      </v-col>
                    </v-row>
                    <v-form ref="form">
                      <v-row v-for="(item, index) in formData" :key="index">
                        <v-col cols="5" class="pt-2 pb-2 mt-2">
                          <div>{{ item.name }}：</div>
                        </v-col>
                        <v-col cols="2" class="pt-1 pb-1">
                          <v-switch
                            :disabled="!isEditMode"
                            v-model="item.tInterfaceAppinfo.allowAccessNum"
                            class="mt-1"
                            color="primary"
                          />
                        </v-col>
                        <v-col
                          cols="2"
                          class="pt-2 pb-2 mt-2"
                          v-show="item.tInterfaceAppinfo.allowAccessNum"
                        >
                          <div>调用限制:</div>
                        </v-col>
                        <v-col
                          cols="3"
                          class="pt-2 pb-2"
                          v-show="item.tInterfaceAppinfo.allowAccessNum"
                        >
                          <v-text-field
                            :disabled="!isEditMode"
                            v-model="item.tInterfaceAppinfo.accessCount"
                            placeholder="不限制次数"
                            outlined
                            dense
                            type="text"
                          >
                          </v-text-field>
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
                  @click="applicationDialogSave(formData)"
                  :disabled="!isEditMode"
                >
                  保存
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- 提示语 -->
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
import BaseSearch from '@/components/BaseSearch';
import * as dataService from '../../api/applicationPrivileges.js';
import moment from 'moment';
export default {
  components: {
    BaseSearch
  },
  data () {
    return {
      counter: 0,
      fullHeight: window.innerHeight,
      // 可见项
      perPageNum: 10,
      perPageItems: [5, 10, 15, 20, 50, 100],
      totalItems: 0,
      pageNum: 1,
      queryPageLength: 0,
      // 搜索条件
      isdateShow: false,
      searchValid: true,
      isExpanded: true, // 搜索折叠功能。true为打开状态
      dateArray: [],
      // 接口权限
      formId: '',
      crudFormDialog: false,
      formData: [],
      isEditMode: false,
      isSnackbarTop: true,
      timeout: 2000,
      dialog: false,
      // 列表数据
      roleListData: [],
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      // 表头
      roleListSetHeaders: [
        { text: '应用标识', value: 'appTag', sortable: false },
        { text: '应用名称', value: 'appName', sortable: false },
        { text: '企业名称', value: 'compName', sortable: false },
        { text: '创建时间', value: 'createTime', sortable: false },
        { text: '操作', value: 'actions', sortable: false }
      ],
      companys: [],
      // 权限管理
      editAppPerBtn: '/editAppPermissionsButton', // 编辑按钮权限控制
      exportAppPerBtn: '/exportAppPermissionsButton' // 导出按钮权限控制
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
    }
  },
  filters: {
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
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  created () {
    this.sysAppinfoParam();
    this.initQueryGetList();
  },
  methods: {
    onPageChange (page) {
      this.pageNum = page;
      this.initQueryGetList(page);
    },
    pageChange (p) {
      this.perPageNum = p;
      this.pageNum = 1;
      this.initQueryGetList();
    },

    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 取消
    cancelCrudFormDialog () {
      this.crudFormDialog = false;
      this.isEditMode = false;
    },
    async applicationDialogSave (form) {
      // console.log(form);
      let params = {
        appId: this.formId,
        interfaceIds: [],
        allowAccessNums: [],
        accessCounts: []
      };
      form.forEach((obj, ky, idx) => {
        params.interfaceIds.push(obj.id);
        params.allowAccessNums.push(
          obj.tInterfaceAppinfo.allowAccessNum || obj.tInterfaceAppinfo.allowAccessNum === '1' ? '1' : '0'
        );
        params.accessCounts.push(
          obj.tInterfaceAppinfo.accessCount === '' ? null : obj.tInterfaceAppinfo.accessCount
        );
      });
      for (let i = 0; i < params.accessCounts.length; i++) {
        let num = Number(params.accessCounts[i]);
        if (isNaN(num)) {
          this.message('调用限制次数只能输入数字', 'error');
          return;
        }
      }
      params.interfaceIds = params.interfaceIds.join(',');
      params.allowAccessNums = params.allowAccessNums.join(',');
      params.accessCounts = params.accessCounts.join(',');
      // console.log(params);
      try {
        const response = await dataService.interfaceAllocation(params);
        // console.log(response);
        if (response.data.code === 200) {
          // const datas = response.data.data.list;
          this.initQueryGetList();
          this.message('编辑成功', 'success');
          this.crudFormDialog = false;
          this.isEditMode = false; // 关闭启用编辑
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 预接口访问权限
    async interfaceAuthority (item) {
      const params = {
        appId: item.id
      };
      try {
        const response = await dataService.queryInterfaceAuthority(params);
        // console.log(response);
        if (response.data.code === 200) {
          const datas = response.data.data.list;
          this.formId = item.id;
          this.crudFormDialog = true;
          datas.forEach((items, key, index) => {
            if (items.tInterfaceAppinfo === null) {
              items.tInterfaceAppinfo = {
                allowAccessNum: 0,
                accessCount: ''
              };
            }
          });
          // console.log(response.data.data.list);
          this.formData = response.data.data.list;
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 导出
    exportAppListData () {
      this.message('尽请期待', 'success');
    },
    // 查询
    searchList () {
      this.searchData = {
        createTimeStart: this.dateArray.length === 2 ? this.dateArray[0] : '',
        createTimeEnd: this.dateArray.length === 2 ? this.dateArray[1] : ''
      };
      this.pageNum = 1;
      this.perPageNum = 10;
      this.initQueryGetList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.dateArray = [];
      this.pageNum = 1;
      this.perPageNum = 10;
      this.initQueryGetList();
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 获取列表中的公司
    async sysAppinfoParam () {
      try {
        const response = await dataService.sysAppinfoParam();
        if (response.data.code === 200) {
          if (response.data.data.companys.length > 0) {
            this.companys = response.data.data.companys;
          } else {
            this.roleListData = [];
          }
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
    },
    // 获取列表
    async initQueryGetList () {
      const params = {
        createTimeStart: this.dateArray.length === 2 ? this.dateArray[0] + ' 00:00:00' : '',
        createTimeEnd: this.dateArray.length === 2 ? this.dateArray[1] + ' 23:59:59' : '',
        page: this.pageNum,
        size: this.perPageNum
      };
      try {
        const response = await dataService.queryTableList(params);
        if (response.data.code === 200) {
          if (response.data.data.records.length > 0 && this.companys.length > 0) {
            // let record = response.data.data.records.map((item) => ({
            //   ...item,
            //   compName: this.companys.find((item1) => item.spid === item1.id).compName
            // }));
            let record = response.data.data.records.map(item => {
              this.companys.forEach(item1 => {
                if (item.spid === item1.id) {
                  item = { ...item, compName: item1.compName };
                }
              });
              return item;
            });
            this.roleListData = record;
            this.totalItems = response.data.data.total;
            this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          } else {
            this.roleListData = [];
          }
        } else {
          this.message(response.data.msg);
        }
      } catch (error) { }
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
    // 创建时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
    }
  }
};
</script>
<style>
</style>
