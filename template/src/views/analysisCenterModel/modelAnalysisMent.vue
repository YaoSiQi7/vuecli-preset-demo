<!--
 * @Author: your name
 * @Date: 2021-02-23 16:43:51
 * @LastEditTime: 2021-04-06 17:30:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
-->
<template>
  <div>
    <v-expansion-panels class="my-0 py-0 elevation-3">
      <v-expansion-panel @change="panelCounter">
        <v-expansion-panel-header class="pl-3 my-0">
          <div>查询条件</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- 条件查询form -->
          <slot>
            <v-form ref="searchForm" lazy-validation>
              <v-container grid-list-xl class="ma-0 pa-0">
                <v-row class="ma-0 py-0">
                  <v-col
                    v-for="(items, index) in searchForm"
                    :key="index"
                    cols="12"
                    sm="12"
                    md="2"
                    xl="2"
                  >
                    <v-text-field
                      v-if="items.type === 'text'"
                      v-model.trim="items.value"
                      :placeholder="items.placeholder"
                      outlined
                      dense
                      class="py-0"
                    />
                    <v-text-field
                      v-if="items.type === 'date'"
                      :placeholder="items.placeholder"
                      outlined
                      dense
                      v-model="items.value"
                      append-icon="event"
                      @click="isdateShow = true"
                    ></v-text-field>
                    <v-dialog
                      v-if="items.type === 'date'"
                      v-model="isdateShow"
                      width="321"
                    >
                      <v-date-picker
                        selected-items-text="已选择日期"
                        v-model="dates"
                        range
                        @change="dateChange"
                      ></v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col cols="12" sm="12" md="2" xl="2">
                    <v-btn
                      small
                      color="primary"
                      class="mt-2 mr-2 elevation-3"
                      @click="reset"
                    >
                      重置
                    </v-btn>
                    <v-btn
                      small
                      color="primary"
                      class="mt-2 elevation-3"
                      @click="inputSearch"
                    >
                      查询
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </slot>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- 表格 -->
    <template>
      <v-card class="elevation-3" style="margin-top: 15px">
        <v-data-table
          :headers="headers"
          :items="datas"
          :items-per-page="perPageNums"
          hide-default-footer
          :fixed-header="true"
          :elevation="3"
          no-results-text="没有匹配的数据"
          :height="tableHeight"
          item-key="id"
          show-select
          v-model="selectedTasks"
          selectable-key
          :loading="loading"
          loading-text="加载数据中..."
        >
          <!-- 列表头 -->
          <template v-slot:top>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-btn
                small
                color="primary"
                class="mt-2 mr-2 elevation-3"
                @click="doAddParam('add')"
              >
                新建
              </v-btn>
              <v-btn
                small
                color="primary"
                class="mt-2 elevation-3"
                @click="doDetelesParam()"
              >
                删除
              </v-btn>
            </v-toolbar>
          </template>
          <!-- 列表项 -->
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  color="primary"
                  v-on="on"
                  @click="doDetailsParam(item)"
                  >mdi-bookmark-multiple</v-icon
                >
              </template>
              <span>详情按钮</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  color="primary"
                  v-on="on"
                  @click="doAddParam(item)"
                  >mdi-pencil</v-icon
                >
              </template>
              <span>修改</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1"
                  color="primary"
                  v-on="on"
                  @click="doDeteleParam(item)"
                  >mdi-delete</v-icon
                >
              </template>
              <span>删除</span>
            </v-tooltip>
          </template>
          <template v-slot:no-data>没有数据</template>
          <template v-slot:footer>
            <v-divider></v-divider>
            <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
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
    </template>
    <!-- // -->
    <v-row justify="center">
      <v-dialog
        v-model="crudFormDialog"
        persistent
        scrollable
        max-width="500px"
      >
        <v-card class="baseCardStyle">
          <v-card-title>
            <v-toolbar-title>
              {{ form.title }}
              <!-- 编辑 -->
            </v-toolbar-title>
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
              <v-row style="margin-left:2px;margin-top: 17px">
                <v-col cols="2">
                  <span v-if="form.value !== ''">看板名称：</span>
                </v-col>
                <v-col cols="7">
                  <v-text-field
                    :label="form.label"
                    :rules="form.rules"
                    v-model.trim="form.value"
                    dense
                    outlined
                    :type="form.type"
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
                v-if="form.title === '新建分析看板'"
                class="primary mr-4"
                style="margin-right: 10px; color: white"
                @click="confimDialogSave()"
                :disabled="!valid"
              >
                创建并进入看板
              </v-btn>
              <v-btn
                v-if="form.title === '修改看板'"
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
    <!-- 删除弹框 -->
    <del-dialog
      :isDialogShow="dialogDel"
      @cancelDel="dialogDel = false"
      @confimDel="confirmDelFun"
    ></del-dialog>
    <del-dialog
      :isDialogShow="dialogDelAll"
      :customDelTitle="allRemoveText"
      @cancelDel="dialogDelAll = false"
      @confimDel="confirmDelFunAll"
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
  </div>
</template>

<script>
import DelDialog from '@/components/DelDialog';
import { getList, addBoardIntser, mlBoardUpdate, mlBoardDel } from '../../api/modelAnalysisMent.js';
import moment from 'moment';
export default {
  name: 'modelAnalysisMent',
  components: {
    DelDialog
  },
  data: () => ({
    fullHeight: window.innerHeight,
    // form表单
    counter: 0, // 搜索条件是否展开
    isdateShow: false,
    dates: [],
    searchForm: [
      { placeholder: '看板名称', value: '', type: 'text' },
      {
        placeholder: '创建时间',
        value: '',
        type: 'date'
      }
    ],
    headers: [
      {
        text: '看板名称',
        align: 'left',
        sortable: false,
        value: 'boardName',
        width: 100
      },
      { text: '创建时间', value: 'createTime', sortable: false, width: 100 },
      { text: '操作', value: 'action', align: 'center', sortable: false, width: '10%' }
    ],
    // 表格数据
    loading: false,
    datas: [],
    perPageNums: 10,
    perPageItems: [5, 10, 15, 20, 50, 100],
    totalItems: 1,
    pageNum: 1,
    queryPageLength: 0,
    search: '', // 搜索table
    crudFormDialog: false, // 新增弹出框
    editId: '', // 修改id
    confirmDelFun: '', // 删除弹框传的函数名
    confirmDelFunAll: '', // 批量删除弹框传的函数名
    dialogDel: false, // 删除弹出框
    dialogDelAll: false,
    delCurrentId: '', // 删除当前行的id
    allRemoveText: '', // 批量删除弹窗中的提示词
    lazy: false,
    valid: true,
    form: {
      title: '',
      label: '请输入看板名称',
      value: '',
      type: 'text',
      rules: [
        v => (v && v.length <= 27 && v.length >= 3) || '长度为3-27个字符',
        v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || '包含中文、英文字母（大小写）、数字、英文下划线，及其组合'
      ],
      counter: '27'
    },
    isSelect: 1, // 列表中复选框是否全选中，1为未选中，2为全选择
    selectedTasks: [], // 表格勾选
    selectDel: [],
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    createId: ''
  }),
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 274;
      }
    }
  },
  watch: {
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 80;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    },
    search (val) {
      if (val) {
        this.queryPageLength = 0;
      } else {
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNums);
      }
    }
  },
  created () {
    this.getSchoolWebModuleMessageListFunc();
    this._getlist();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  destroyed () {
    sessionStorage.removeItem('detail');
  },
  methods: {
    getSchoolWebModuleMessageListFunc () {
      if (sessionStorage.getItem('detail')) {
        this.pageNum = Number(sessionStorage.getItem('currentPage')) || this.pageNum;
        this.perPageNums = Number(sessionStorage.getItem('perPages')) || this.perPageNums;
      } else {
        this.pageNum = 1;
        this.perPageNums = 10;
        sessionStorage.removeItem('currentPage');
        sessionStorage.removeItem('perPages');
      }
    },
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 选择时间的弹框
    dateChange () {
      if (this.dates.length === 2) {
        if (moment(this.dates[0]).valueOf() < moment(this.dates[1]).valueOf()) {
        } else if (moment(this.dates[0]).valueOf() > moment(this.dates[1]).valueOf()) {
          this.reverseArry(this.dates);
        }
        for (let item of this.searchForm) {
          if (item.type === 'date') {
            item.value = this.dates.join(' 至 ');
          }
        }
        this.isdateShow = false;
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
    // 右侧列表搜索框查询方法
    inputSearch () {
      this.pageNum = 1;
      this._getlist();
    },
    reset () {
      if (this.$refs.searchForm) {
        this.$refs.searchForm.reset();
        this.dates = [];
        this._getlist();
      };
    },
    // 获取模板参数
    _getlist () {
      let parms;
      this.loading = true;
      if (this.searchForm[1].value === '' || this.searchForm[1].value === undefined || this.searchForm[1].value.indexOf(' 至 ') === -1) {
        parms = {
          page: this.pageNum,
          pageSize: this.perPageNums,
          boardName: this.searchForm[0].value
        };
      } else {
        parms = {
          page: this.pageNum,
          pageSize: this.perPageNums,
          boardName: this.searchForm[0].value,
          begainTime: this.searchForm[1].value.split(' 至 ')[0] + ' 00:00:00',
          endTime: this.searchForm[1].value.split(' 至 ')[1] + ' 23:59:59'
        };
      };
      getList(parms).then(res => {
        this.loading = false;
        this.datas = [];
        this.datas = res.data.data.paramsList;
        this.totalItems = res.data.data.total;
        this.queryPageLength = res.data.data.totalPages;
        // this.datas.forEach((item, index) => {
        //   if (item.boardName === this.form.value) {
        //     this.createId = item.id;
        //     // this.$refs.form.reset();
        //   }
        // });
      });
    },
    // 改变页数
    pageChange (p) {
      this.perPageNums = p;
      this.pageNum = 1;
      sessionStorage.setItem('perPages', p);
      this._getlist();
    },
    onPageChange (page) {
      this.pageNum = page;
      sessionStorage.setItem('currentPage', page);
      this._getlist();
    },
    // 新建/修改按钮弹窗
    doAddParam (query) {
      if (query === 'add') {
        this.form.title = '新建分析看板';
      } else {
        this.form.title = '修改看板';
        this.form.label = '';
        this.form.value = query.boardName;
        this.editId = query.id;
        console.log(query);
      }
      this.crudFormDialog = true;
    },
    // 取消创建看板
    cancelCrudFormDialog () {
      this.crudFormDialog = false;
      this.$refs.form.reset();
      this.form.value = '';
      this.form.label = '请输入看板名称';
    },
    // 确定创建看板按钮
    confimDialogSave () {
      addBoardIntser({ boardName: this.form.value }).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '添加成功';
          this.snackbarServeColor = 'success';
          this.crudFormDialog = false;
          getList().then(res => {
            const addList = res.data.data.paramsList;
            this.createId = addList.find(item => item.boardName === this.form.value);
            this.doDetailsParam(this.createId);
          });
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 修改按钮
    confimDialogEdit () {
      let parms = {
        boardName: this.form.value,
        id: this.editId
      };
      mlBoardUpdate(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '修改成功';
          this.snackbarServeColor = 'success';
          this._getlist();
          this.crudFormDialog = false;
          this.$refs.form.reset();
          this.form.value = '';
          this.form.label = '请输入看板名称';
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 单个删除
    doDeteleParam (item) {
      this.dialogDel = true;
      this.delCurrentId = item.id;
      this.confirmDelFun = this.confirmDel;
    },
    async confirmDel () {
      try {
        const res = await mlBoardDel({ id: this.delCurrentId });
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '删除成功';
          this.snackbarServeColor = 'success';
          this._getlist();
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
      this.dialogDel = false;
      this.dialogDelAll = false;
    },
    // 批量删除
    doDetelesParam () {
      this.selectedTasks.forEach((item) => {
        this.selectDel.push(item.id);
      });
      if (this.selectDel.length !== 0 && this.selectedTasks !== []) {
        this.dialogDelAll = true;
        this.delCurrentId = this.selectDel.toString();
        this.allRemoveText = '即将删除勾选的' + this.selectDel.length + '个看板';
        this.confirmDelFunAll = this.confirmDel;
      }
    },
    // 点击table查看详情按钮
    doDetailsParam (item) {
      let id = item.id;
      this.$router.push(
        {
          path: `/indicatorsDisplayPage`
        }
      );
      sessionStorage.setItem('pageId', id);
      if (this.form.value) {
        this.$refs.form.reset();
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.ruleSetAddOrEdit >>> .v-input__control
  height auto !important
.ruleSetAddOrEdit .col
  padding 0 !important
  margin-top 20px
  margin-left 10px
</style>
