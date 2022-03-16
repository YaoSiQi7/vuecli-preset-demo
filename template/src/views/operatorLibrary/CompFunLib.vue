<template>
  <!-- 计算函数库 -->
  <div class="com-fun-lib">
    <!-- 表格 -->
    <template>
      <v-card class="elevation-3 fill-height">
        <v-row style="align-items: center;height: 64px;">
          <v-col md="3" class="mb-0 py-0">
            <v-card-title class="pt-3">
              <v-text-field
                v-model="search"
                placeholder="请输入条件搜索"
                append-icon="mdi-magnify"
                outlined
                dense
                @keyup="inputSearch"
              />
            </v-card-title>
          </v-col>
          <v-spacer />
          <v-col md="2" class="mb-0 py-0">
            <v-card-title class="pt-3">
              <div class="btn mr-8 mb-0">
                <v-btn color="primary" v-if="hasPermission(addFieldBtn)" @click="addFunc()">添加函数</v-btn>
              </div>
            </v-card-title>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="desserts"
          hide-default-footer
          :fixed-header="true"
          :elevation="3"
          :items-per-page="perPageNums"
          no-results-text="没有匹配的数据"
          :height="tableHeight"
        >
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  color="primary"
                  v-on="on"
                  @click="editFunc(item)"
                >mdi-pencil</v-icon>
              </template>
              <span>编辑</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon  v-if="item.isInternal !== '1' && item.isQuote !== '1' && hasPermission(deleteFieldBtn)"  small class="mr-1" color="primary" v-on="on" @click="_deteleFunc(item)">mdi-delete</v-icon>
              </template>
              <span>删除</span>
            </v-tooltip>

              <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon  v-if="item.isInternal === '1' || item.isQuote === '1' && hasPermission(deleteFieldBtn)"  small class="mr-1" color="primary" v-on="on" >mdi-delete</v-icon>
              </template>
              <span>删除</span>
            </v-tooltip>
          </template>
          <template v-slot:no-data>没有数据</template>
          <template v-slot:footer >
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
                  />
                </span>条
                <span style="margin-left:15px">共{{ totalItems }}条</span>
                <v-spacer/>
                <v-pagination
                  class="d-flex justify-end pagination"
                  v-model="pageNum"
                  :length="queryPageLength"
                  @input="onPageChange"
                />
              </div>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </template>
    <!-- 添加编辑弹窗 -->
    <base-create :formHeader='addOrEditHeader' :crudFormDialog='dialog'  :isCanEdit='delAndEdit' :formData='addAndEditFormData' @cancelCrudFormDialog='cancel($event)' @confimDialogSave='saveFunc' @switchOnChange="onChang($event)" :baseCteateEditPowerBtn="baseCteateEditFieldBtn"></base-create>
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

import { getList, addItem, deteleItem, editItem } from '../../api/compfunlib.js';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import { BASE_NAME, BASE_VALUE, BASE_NAME_TEXT, BASE_VALUE_TEXT } from '../../utils/validate.js';
export default {
  data () {
    return {
      fullHeight: window.innerHeight,
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      search: '',
      dialog: false,
      dialogDel: false,
      desserts: [],
      headers: [
        { text: '函数名', align: 'left', sortable: false, value: 'funcName', width: '25%' },
        { text: '函数', value: 'funcValue', sortable: false, width: '25%' },
        { text: '描述', value: 'comment', sortable: false, width: '40%' },
        { text: '操作', value: 'action', sortable: false, width: '10%' }
      ],
      addOrEditHeader: {},
      functionName: '',
      func: '',
      description: '',
      addAndEditFormData: [
        { label: '函数名*', value: '', type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => BASE_NAME.test(v) || BASE_NAME_TEXT, v => (v && v.length <= 50) || '最大50个字符'] },
        { label: '函数*', value: '', type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => BASE_VALUE.test(v) || BASE_VALUE_TEXT, v => (v && v.length <= 50) || '最大50个字符'] },
        { label: '描述', value: '', type: 'textarea', counter: 200, required: false }
      ],
      detId: '',
      editId: '',
      flg: 1,
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNums: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      delAndEdit: true,
      // 增加按钮权限
      addFieldBtn: '/addCalculatorButton', // 添加按钮是否展示
      baseCteateEditFieldBtn: '/editCalculatorButton', // 当编辑按钮展示时，控制baseCreate中的编辑开关
      deleteFieldBtn: '/deleteCalculatorButton' // 删除按钮权限
    };
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 258;
      }
    }
  },
  components: {
    // BaseSearch,
    BaseCreate,
    DelDialog
  },
  watch: {
    search (val) {
      if (val) {
        this.queryPageLength = 0;
      } else {
        this.queryPageLength = Math.ceil(this.totalItems / this.perPageNums);
      }
    }
  },
  methods: {
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    onPageChange (page) {
      this.pageNum = page;
      this._getlist();
    },
    pageChange (p) {
      this.pageSize = p;
      this.pageNum = 1;
      this._getlist();
    },
    inputSearch () { // 右侧列表搜索框查询方法
      this.pageNum = 1;
      this._getlist();
    },
    _getlist () {
      let parms = {
        pageSize: this.pageSize,
        pageIndex: this.pageNum,
        funcName: this.search
      };
      getList(parms).then(res => {
        if (res.data.code === 200) {
          this.desserts = res.data.data.list;
          this.totalItems = res.data.data.totalElements;
          this.queryPageLength = Math.ceil(this.totalItems / this.perPageNums);
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => console.info(err));
    },
    addFunc () {
      this.dialog = true;
      this.flg = 1;
      this.addOrEditHeader = {
        name: '添加函数',
        value: 'add',
        isEdit: false
      };
    },
    _addItem (parms, form) {
      addItem(parms).then(res => {
        if (res.data.code === 200) {
          this.dialog = false;
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getlist();
          form.reset();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => console.info(err));
    },
    editFunc (item) {
      if (item.isInternal === '1' || item.isQuote === '1') {
        this.delAndEdit = false;
      } else {
        this.delAndEdit = true;
      }
      this.dialog = true;
      this.flg = 2;
      this.addOrEditHeader = {
        name: '查看函数',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        { label: '函数名*', value: item.funcName, type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => BASE_NAME.test(v) || BASE_NAME_TEXT, v => (v && v.length <= 50) || '最大50个字符'] },
        { label: '函数*', value: item.funcValue, type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => BASE_VALUE.test(v) || BASE_VALUE_TEXT, v => (v && v.length <= 50) || '最大50个字符'] },
        { label: '描述', value: item.comment, type: 'textarea', counter: 200, required: false }
      ];
      this.editId = item.id;
    },
    _editItem (parms, form) {
      editItem(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getlist();
          form.reset();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => console.info(err));
    },
    cancel () {
      this.dialog = false;
    },
    saveFunc (arg, form) {
      if (arg[2].value && arg[2].value.length > 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '描述字段最大可输入200字符';
        this.snackbarServeColor = 'error';
        return;
      }
      this.dialog = false;
      let parms = {};
      if (this.flg === 1) {
        parms = {
          funcName: arg[0].value,
          funcValue: arg[1].value,
          comment: arg[2].value
        };
      } else {
        parms = {
          id: this.editId,
          funcName: arg[0].value,
          funcValue: arg[1].value,
          comment: arg[2].value
        };
      }
      this.flg === 1 ? this._addItem(parms, form) : this._editItem(parms, form);
    },
    _deteleFunc (item) {
      this.dialogDel = true;
      this.detId = item.id;
    },
    constantDelCancle () {
      this.dialogDel = false;
    },
    deleteEnum () {
      this.dialogDel = false;
      let parms = {
        id: this.detId
      };
      deteleItem(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getlist();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      }).catch(err => console.info(err));
    },
    onChang (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看函数',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑函数',
          value: 'edit',
          isEdit: true
        };
      }
    },
    getPath () {
      localStorage.setItem('getMenu', '/compFunLib');
    }
  },
  created () {
    // 获取当前页的路由名称
    this.getPath();
    this._getlist();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  }
};
</script>
<style lang="stylus" scoped>
.com-fun-lib .btn {
  margin-bottom: 20px;
}
.com-fun-lib .left-btn {
  margin-right: 20px;
}
.com-fun-lib .btn {
  text-align: left;
}
</style>
