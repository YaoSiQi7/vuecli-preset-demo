<template>
  <!-- 计算函数库 -->
  <div class="com-tempParam-lib">

    <!-- 表格 -->
    <template>
      <v-card class="elevation-3">
        <v-row style="align-items: center;height: 64px;">
          <v-col md="3" class="mb-0 py-0">
            <v-card-title class="pt-3">
              <v-text-field
                v-model="search"
                placeholder="请输入条件搜索"
                append-icon="mdi-magnify"
                outlined
                dense
                hide-details
                @keyup="inputSearch"
              />
            </v-card-title>
          </v-col>
          <v-spacer />
          <v-col md="2" class="mb-0 py-0">
          <v-card-title class="pt-3">
            <div class="btn mr-8 mb-0" v-if="hasPermission(addTempBtn)">
              <v-btn color="primary" @click="doAddParam()">添加参数</v-btn>
            </div>
            </v-card-title>
          </v-col>
        </v-row>
        <v-data-table
          :headers="headers"
          :items="datas"
          :items-per-page="perPageNums"
          hide-default-footer
          :fixed-header="true"
          :elevation="3"
          no-results-text="没有匹配的数据"
          :height="tableHeight"
        >
          <template v-slot:item.dataType="{ item }">
            <span>{{ item.dataType | dataTypeFilter(dataTypeItems) | ellipsis(8) }}</span>
          </template>
          <template v-slot:item.action="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  color="primary"
                  v-on="on"
                  @click="doEditParam(item)"
                >mdi-pencil</v-icon>
              </template>
              <span>编辑</span>
            </v-tooltip>
            <v-tooltip bottom v-if="hasPermission(deleteTempBtn)">
              <template v-slot:activator="{ on }">
                <v-icon small class="mr-1" color="primary" v-on="on" @click="doDeteleParam(item)">mdi-delete</v-icon>
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
                  :total-visible="7"
                  @input="onPageChange"
                />
              </div>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </template>
    <!-- 添加编辑弹窗 -->
    <base-create :baseCteateEditPowerBtn="editTempBtn" :formHeader='addOrEditHeader' :crudFormDialog='dialog' :formData='addAndEditFormData' :nodeFlg='nodeFlg' @cancelCrudFormDialog='cancel($event)' @confimDialogSave='save' @switchOnChange="swChange($event)"></base-create>
    <del-dialog :isDialogShow='dialogDel' @cancelDel='cancleDelParam($event)' @confimDel='confirmDelParam($event)'></del-dialog>
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
import { getList, deleteFunc, getTreeList, addFunc, editFunc } from '../../api/tempparamlib.js';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import { BASE_NAME, BASE_VALUE, BASE_NAME_TEXT, BASE_VALUE_TEXT } from '../../utils/validate.js';
import { getAllTradeType } from 'api/sceneManagement';
export default {
  data () {
    return {
      treeIds: [],
      fullHeight: window.innerHeight,
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      item: [],
      search: '',
      nodeFlg: '2',
      // 新增编辑弹窗
      dialog: false,
      // 删除弹窗
      dialogDel: false,
      // 表格数据
      datas: [],
      // 表格头部
      headers: [
        {
          text: '参数名',
          align: 'left',
          sortable: false,
          value: 'paramName',
          width: 100
        },
        { text: '参数', value: 'paramValue', sortable: false, width: 100 },
        { text: '参数来源', value: 'srcLib', sortable: false, width: 100 },
        { text: '数据类型', value: 'dataType', sortable: false, width: 100 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: '10%' }
      ],
      // 新增编辑弹窗头部
      addOrEditHeader: {
        name: '添加',
        value: 'add',
        isEdit: true
      },
      // 新增编辑弹窗表单信息
      addAndEditFormData: [],
      // 区分是新增还是编辑的变量 1是新增 2是编辑
      flag: 1,
      // 被删除的参数
      delParam: {},
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNums: 10,
      totalItems: 1,
      perPageItems: [5, 10, 15, 20, 50, 100],
      deteleId: '',
      edId: '',
      libList: ['TRADETYPE_VAR', 'APP_VAR'],
      // 数据类型列表数据
      dataTypeItems: [],
      // 按钮权限
      addTempBtn: '/addTempParamButton', // 控制添加按钮是否展示
      editTempBtn: '/editTempParamButton', // 表格编辑按钮
      deleteTempBtn: '/deleteTempParamButton' // 表格删除功能
    };
  },
  components: {
    BaseCreate,
    DelDialog
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 210;
      }
    }
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
    async getDataTypeList () {
      const params = {
        identifier: 'sys_data_type'
      };
      try {
        const res = await getAllTradeType(params);
        const resData = res.data.data;
        resData.forEach(item => {
          this.dataTypeItems.push({
            selectText: item.paramName,
            selectField: item.paramValue
          });
        });
      } catch (error) {}
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    onPageChange (page) {
      this.currentPage = page;
      this._getlist(page);
    },
    pageChange (p) {
      this.perPageNum = p;
      this._getlist();
    },
    inputSearch () { // 右侧列表搜索框查询方法
      this.pageNum = 1;
      this._getlist();
    },
    // 获取模板参数
    _getlist () {
      let parms = {
        pageIndex: this.pageNum,
        pageSize: this.perPageNums,
        paramName: this.search
      };
      getList(parms).then(res => {
        this.datas = [];
        this.datas = res.data.data.list;
        this.totalItems = res.data.data.totalElements;
        this.queryPageLength = res.data.data.totalPages;
      });
    },
    // 点击添加按钮
    doAddParam () {
      this.addOrEditHeader = {
        name: '添加参数',
        value: 'add',
        isEdit: false
      };
      this.addAndEditFormData = [
        { label: '参数名*', value: '', type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => (v && v.length <= 50) || '最大50个字符', v => BASE_NAME.test(v) || BASE_NAME_TEXT] },
        { label: '参数*', value: '', type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => (v && v.length <= 50) || '最大50个字符', v => BASE_VALUE.test(v) || BASE_VALUE_TEXT] },
        { label: '参数来源*',
          value: [],
          type: 'treeSelect',
          required: true,
          rules: [v => !!v || '不能为空或只有空格'],
          isMultiple: true,
          options: this.item
        },
        {
          label: '数据类型*',
          value: '',
          type: 'select',
          required: true,
          rules: [v => !!v || '不能为空或只有空格'],
          selectText: 'selectText',
          selectField: 'selectField',
          options: this.dataTypeItems
        }
      ];
      this.dialog = true;
      this.flag = 1;
    },
    // 点击编辑按钮
    doEditParam (item) {
      this.dialog = true;
      this.flag = 2;
      this.addOrEditHeader = {
        name: '查看参数',
        value: 'edit',
        isEdit: true
      };
      this.edId = item.id;
      let s = [];
      let that = this;
      var getData = function (arr) {
        arr.forEach((r, i) => {
          let isHas = that.treeIds.find(item => item === r.id);
          if (isHas) {
            s.push(r.id);
          }
          if (r.children && r.children.length) {
            getData(r.children);
          };
        });
      };
      getData(JSON.parse(item.paramSrc));
      this.addAndEditFormData = [
        { label: '参数名*', value: item.paramName, type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => (v && v.length <= 50) || '最大50个字符', v => BASE_NAME.test(v) || BASE_NAME_TEXT] },
        { label: '参数*', value: item.paramValue, type: 'text', required: true, rules: [v => !!v || '不能为空或只有空格', v => (v && v.length <= 50) || '最大50个字符', v => BASE_VALUE.test(v) || BASE_VALUE_TEXT] },
        { label: '参数来源*',
          value: s,
          type: 'treeSelect',
          required: true,
          rules: [v => !!v || '不能为空或只有空格'],
          isMultiple: true,
          options: this.item
        },
        {
          label: '数据类型*',
          value: item.dataType,
          type: 'select',
          required: true,
          rules: [v => !!v || '不能为空或只有空格'],
          selectText: 'selectText',
          selectField: 'selectField',
          options: this.dataTypeItems
        }
      ];
    },
    // 确定添加参数
    _confirmAddParam (parms, from) {
      addFunc(parms).then(res => {
        if (res.data.code === 200) {
          from.reset();
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.dialog = false;
          this._getlist();
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
    // 确定编辑参数
    _confirmEditParam (parms, from) {
      editFunc(parms).then(res => {
        if (res.data.code === 200) {
          from.reset();
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.dialog = false;
          this._getlist();
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
    // 新增编辑弹窗的取消按钮
    cancel (form) {
      this.dialog = false;
      form.reset();
    },
    // 新增编辑弹窗的确定按钮
    save (arg, from) {
      // 处理数据
      let as = arg[2].value;
      let ss = as;
      if (!as.length) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请选择参数来源';
        this.snackbarServeColor = 'error';
        return;
      }
      let valueList = this.item;
      let arr = [];
      // 循环一级菜单
      ss.forEach(s => {
        valueList.forEach((d, j) => {
          if (s === d.id) {
            arr.push({
              id: d.id,
              label: d.label,
              children: []
            });
          }
        });
      });
      // 循环二级菜单
      ss.forEach(s => {
        arr.forEach((o, j) => {
          valueList.forEach((v, m) => {
            if (o.id === v.id) {
              if (v.children) {
                for (var k = 0; k < v.children.length; k++) {
                  if (s === v.children[k].id) {
                    if (v.id) {
                      if (v.id === 'TRADETYPE_VAR' || v.id === 'APP_VAR') {
                        o.children.push({
                          id: v.children[k].id,
                          label: v.children[k].label,
                          value: v.children[k].value,
                          children: []
                        });
                      } else {
                        o.children.push({
                          id: v.children[k].id,
                          label: v.children[k].label,
                          children: []
                        });
                      }
                    }
                  }
                }
              }
            }
          });
        });
      });
      // 循环三级菜单
      ss.forEach(s => {
        arr.forEach((a, j) => {
          valueList.forEach((v, m) => {
            if (a.id === v.id) {
              a.children.forEach((aa, ai) => {
                v.children.forEach((vv, vm) => {
                  if (aa.id === vv.id) {
                    if (vv.children) {
                      for (var k = 0; k < vv.children.length; k++) {
                        if (s === vv.children[k].id) {
                          aa.children.push({
                            id: vv.children[k].id,
                            label: vv.children[k].label,
                            value: vv.children[k].value || null
                          });
                        };
                      }
                    }
                  }
                });
              });
            };
          });
        });
      });
      let parms = {};
      if (this.flag === 1) {
        parms = {
          paramName: arg[0].value,
          paramValue: arg[1].value,
          paramSrc: JSON.stringify(arr),
          dataType: arg[3].value
        };
        from.reset();
      } else {
        parms = {
          id: this.edId,
          paramName: arg[0].value,
          paramValue: arg[1].value,
          paramSrc: JSON.stringify(arr),
          dataType: arg[3].value
        };
        from.reset();
      };
      this.flag === 1 ? this._confirmAddParam(parms, from) : this._confirmEditParam(parms, from); //eslint-disable-line
    },
    // 点击删除按钮
    doDeteleParam (item) {
      this.dialogDel = true;
      this.delParam = item;
      this.deteleId = item.id;
    },
    // 删除弹窗取消
    cancleDelParam () {
      this.dialogDel = false;
    },
    // 删除弹窗确定
    async confirmDelParam () {
      this.dialogDel = false;
      let parms = {
        id: this.deteleId
      };
      deleteFunc(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this._getlist();
          // this.dialogDel = false;
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
    // 树结构列表
    _getTreeList () {
      getTreeList().then(res => {
        // 处理数据
        let paramsArray = res.data.data;
        let that = this;
        let getIds = function (arr) {
          arr.forEach(item => {
            that.treeIds.push(item.id);
            if (item.id === 'APP_VAR' || item.id === 'TRADETYPE_VAR') {
              delete item.children;
            }
            if (item.children && item.children.length) {
              getIds(item.children);
            } else {
              delete item.children;// 删掉接口返回的tree数组children是null或者空数组节点
            }
          });
        };
        getIds(paramsArray);
        this.item = paramsArray;
      });
    },
    swChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看参数',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑参数',
          value: 'edit',
          isEdit: true
        };
      }
    }
  },
  created () {
    this._getlist();
    this._getTreeList();
    this.getDataTypeList();
  },
  filters: {
    dataTypeFilter: function (dataType, dataTypeItems) {
      if (dataType) {
        for (let i = 0; i < dataTypeItems.length; i++) {
          const element = dataTypeItems[i];
          if (element.selectField === dataType) {
            return element.selectText;
          }
        }
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.com-tempParam-lib .btn {
  margin-bottom: 20px;
}
.com-tempParam-lib .left-btn {
  margin-right: 20px;
}
.com-tempParam-lib .btn {
  text-align: left;
}
</style>
