<template>
  <div class="enu-content fill-height">
    <!-- 搜索表单 -->
    <base-search
      :fieldList="searchParam"
      @search="search($event)"
      @reset="resetSearchData($event)"
      id="rulesetSearch"
      @change="panelCounter"
    ></base-search>
    <v-row>
      <v-col cols='12' class="pb-0">
        <v-card class="elevation-3">
          <v-data-table
            :headers="constHeader"
            :items="constItem"
            :items-per-page="1000"
            hide-default-footer
            :loading = "loading"
            loading-text="正在加载中..."
            no-results-text="没有匹配的数据"
            :height="tableHeight"
            :fixed-header="true"
          >
            <!-- 列表头 -->
            <template v-slot:top v-if="hasPermission(addConfigBtn)">
              <v-toolbar flat>
                <v-spacer/>
                <v-card-title>
                  <v-btn
                    color="primary"
                    @click="addParms()"
                  >
                    添加
                  </v-btn>
                </v-card-title>
              </v-toolbar>
            </template>
            <!-- 表内容 -->
            <!-- <template v-slot:item.setName="{ item }">
              <span :title="`${item.setName}`">{{ item.setName | ellipsis(16) }}</span>
            </template>
            <template v-slot:item.organizationId="{ item }">
              <span
                :title="item.organizationId | rulesetOrganization(organizationList)"
              >{{ item.organizationId | rulesetOrganization(organizationList) | ellipsis(8) }}</span>
            </template> -->
            <!-- 列表项 -->
            <template v-slot:body="{ items }">
              <tr
                v-for="(item, index) in items"
                :key="index"
                class="el-tr-defu"
              >
                <td
                  :title="`${item.tradeName}`"
                  class="el-border-defu"
                >
                  {{ item.tradeName }}
                </td>
                <td
                  :title="`${item.identifier}`"
                  class="el-border-defu"
                >
                  {{ item.identifier }}
                </td>
                <td
                  :title="item.isAmount| constantDataType()"
                  class="el-border-defu"
                >
                  {{ item.isAmount | constantDataType() }}
                </td>
                <td
                  :title="`${item.isBatch}`"
                  class="el-border-defu"
                >
                  {{ item.isBatch === '1' ? '是' : '否' }}
                  <!-- {{ item.isBatch === null ? '' : item.isBatch === '0' ? '否' : '是' }} -->
                </td>
                <td
                  :title="`${item.createTime}`"
                  class="el-border-defu"
                >
                  {{ item.createTime }}
                </td>
                <td class="el-border-defu">
                  <v-tooltip bottom v-if="hasPermission(editConfigBtn)">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="editFunc(item, index)"
                      >
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>编辑</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="hasPermission(deleteConfigBtn)">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="deleteFunc(item)"
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
    <!-- 添加、编辑 -->
    <base-create :baseCteateEditPowerBtn="editConfigBtn" :formHeader='addOrEditHeader' :crudFormDialog='dialog' :formData='addAndEditFormData' @cancelCrudFormDialog='cancel($event)' @confimDialogSave='save(arguments)' @switchOnChange="onChange($event)" :isCanEdit='isCanEdit'></base-create>
    <!-- 删除弹窗 -->
    <del-dialog :isDialogShow='dialogDel' @cancelDel='constantDelCancle($event)' @confimDel='deleteEnum($event)'></del-dialog>
    <!-- 公共提示框 -->
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
import { getList, addItem, deleteItem, editItem, isRefrecord, queryRefRecordBySourceId } from '../../api/transactionTypeConfig.js';
import { getFieldNameList } from '../../api/SystemParamLib.js';
import BaseCreate from '@/components/BaseCreate';
import BaseSearch from '@c/BaseSearch';
import DelDialog from '@/components/DelDialog';
import { NAME_NOT_NULL, MAX_INPUT_LENGTH, BASE_NAME_TEXT, BASE_VALUE_TEXT } from 'utils/validate';
export default {
  data () {
    return {
      counter: 0,
      fullHeight: window.innerHeight,
      // 列表
      constHeader: [
        { text: '交易类型名称', value: 'tradeName', sortable: false, width: 100 },
        { text: '交易类型标识', value: 'identifier', sortable: false, width: 100 },
        { text: '交易类型属性', value: 'isAmount', sortable: false, width: 100 },
        { text: '是否批量业务', value: 'isBatch', sortable: false, width: 100 },
        { text: '创建时间', value: 'createTime', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: '10%' }
      ],
      constItem: [],
      editItemId: '', // 编辑当前项的id
      loading: false,
      // 分页变量
      pageNum: 1,
      queryPageLength: 1,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 公共提示词弹窗
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '', // success', 'info', 'error' 三种类型
      dialog: false,
      dialogDel: false,
      //  表单，添加
      flg: 1,
      addOrEditHeader: {
        name: '添加交易类型',
        value: 'add',
        isEdit: true
      },
      addAndEditFormData: [
        {
          label: '交易类型名称*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || NAME_NOT_NULL('交易类型名称'),
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50),
            // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '常量只能输入汉字'
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || BASE_NAME_TEXT
          ]
        },
        {
          label: '交易类型标识*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || NAME_NOT_NULL('交易类型标识'),
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50),
            // eslint-disable-next-line no-useless-escape
            // v => !((/[^\ a-\z\A-\Z]/).test(v)) || '常量名只能输入英文字母'
            v => /^[0-9a-zA-Z_.]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线、点，及其组合'
          ]
        },
        {
          label: '交易类型属性*',
          value: '',
          type: 'select',
          required: true,
          rules: [
            v => !!v || NAME_NOT_NULL('交易类型属性')
          ],
          selectText: 'paramName',
          selectField: 'paramValue',
          options: []
        },
        {
          label: '是否批量业务*',
          value: '0',
          type: 'select',
          // required: true,
          // rules: [
          //   v => !!v || NAME_NOT_NULL('是否批量业务')
          // ],
          selectText: 'texts',
          selectField: 'values',
          options: [{ texts: '是', values: '1' }, { texts: '否', values: '0' }]
        }
      ],
      // 搜索组件数据
      searchParam: [
        { type: 'text', placeholder: '交易类型名称', value: '' },
        { type: 'text', placeholder: '交易类型标识', value: '' },
        {
          type: 'select',
          placeholder: '交易类型属性',
          value: '',
          options: []
        },
        {
          type: 'select',
          placeholder: '是否批量业务',
          value: '',
          options: [{ text: '是', value: '1' }, { text: '否', value: '0' }]
        }
      ],
      searchData: {
        tradeName: '',
        identifier: '',
        isAmount: '',
        isBatch: ''
      },
      deteleId: '', // 删除ID
      deleteItemAry: {},
      tradeTypeProperty: [],
      // 增加按钮权限
      addConfigBtn: '/addTransactionTypeConfigButton', // 添加按钮是否展示
      editConfigBtn: '/editTransactionTypeConfigButton', // 表格编辑按钮
      deleteConfigBtn: '/deleteTransactionTypeConfigButton', // 表格删除功能
      isCanEdit: true,
      editingMode: ''
    };
  },
  components: {
    DelDialog,
    BaseSearch,
    BaseCreate
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
  // 展示中英文转化
  filters: {
    constantDataType: function (str) {
      let dataTypeText;
      if (str === '0') {
        dataTypeText = '非动账';
      } else {
        dataTypeText = '动账';
      }
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
        this.tableHeight = window.innerHeight - 72;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  created () {
    this.gittransactionType();
    this.getList();
  },
  methods: {
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    search ($event) {
      $event.forEach((item, index, ary) => {
        if (item.placeholder === '交易类型名称') {
          this.searchData.tradeName = item.value === undefined ? '' : item.value;
        } else if (item.placeholder === '交易类型标识') {
          this.searchData.identifier = item.value === undefined ? '' : item.value;
        } else if (item.placeholder === '交易类型属性') {
          this.searchData.isAmount = item.value === undefined ? '' : item.value;
        } else if (item.placeholder === '是否批量业务') {
          this.searchData.isBatch = item.value === undefined ? '' : item.value;
        }
      });
      if (this.searchData.isAmount === 'all') {
        this.searchData.isAmount = '';
      }
      this.pageNum = 1;
      this.getList();
    },
    // 获取交易类型属性
    gittransactionType () {
      const parms = {
        identifier: 'sys_trade_property'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            this.tradeTypeProperty = JSON.parse(JSON.stringify(res.data.data));
            res.data.data.unshift({
              paramName: '全部',
              paramValue: 'all'
            });
            res.data.data.forEach((item, index, ary) => {
              ary[index].text = item.paramName;
              ary[index].value = item.paramValue;
            });
            // 此 tradeTypeProperty 变量是用在添加和编辑弹窗的下拉框中
            this.searchParam[2].options = res.data.data;
            this.addAndEditFormData[2].options = this.tradeTypeProperty;
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
    },
    // 获取列表内容
    getList () {
      let pageParms = {
        pageIndex: this.pageNum, // 第几页
        pageSize: this.perPageNum // 每页显示条数
      };
      let searchParam = JSON.parse(JSON.stringify(this.searchData));
      let parms = Object.assign({}, pageParms, searchParam);
      getList(parms)
        .then(res => {
          if (res.data.code === 200) {
            if (res.data.data.tradeTypeList.length > 0) {
              this.constItem = res.data.data.tradeTypeList;
              this.totalItems = res.data.data.total;
              this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
              console.log(this.totalItems, this.queryPageLength);
            } else {
              this.constItem = [];
              this.totalItems = 0;
              this.queryPageLength = 0;
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
    },
    // 添加--弹窗
    addParms () {
      this.flg = 1;
      this.dialog = true;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.$nextTick(() => {
        this.addAndEditFormData[3].value = '0';
      });
      this.addOrEditHeader = {
        name: '添加交易类型',
        value: 'add',
        isEdit: false
      };
    },
    // 添加--保存
    _addItem (a) {
      let isAmountId = '';
      this.tradeTypeProperty.forEach((item, index, ary) => {
        if (a[0][2].value === item.paramValue) {
          isAmountId = item.id;
        }
      });
      const parms = {
        tradeName: a[0][0].value,
        identifier: a[0][1].value,
        isAmount: a[0][2].value,
        isAmountId: isAmountId,
        isBatch: a[0][3].value
      };
      a[1].reset();
      addItem(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.getList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 编辑--弹窗
    editFunc (item, index) {
      queryRefRecordBySourceId({ sourceId: item.id }).then(req => {
        if (req.data.code === 200) {
          this.editingMode = req.data.data.editingMode;
          if (req.data.data.editingMode === 3) {
            this.isCanEdit = false;
          } else {
            this.isCanEdit = true;
          }
        }
      });
      this.flg = 2;
      this.editItemId = item.id;
      // let isRefrecordParms = {
      //   sourceId: item.id,
      //   sourceType: ''
      // };
      // isRefrecord(isRefrecordParms).then(res => {
      //   if (res.data.code === 200) {
      //     if (res.data.data.isReference) {
      //       this.snackbarServe = true;
      //       this.snackbarServeMsg = '交易类型被引用，不能编辑！';
      //       this.snackbarServeColor = 'error';
      //       this.dialogDel = false;
      //     } else {
      //       }
      //   }
      // });
      this.addOrEditHeader = {
        name: '查看交易类型',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        {
          label: '交易类型名称*',
          value: item.tradeName,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || NAME_NOT_NULL('交易类型名称'),
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50),
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || BASE_NAME_TEXT
          ]
        },
        {
          label: '交易类型标识*',
          value: item.identifier,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || NAME_NOT_NULL('交易类型标识'),
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50),
            // eslint-disable-next-line no-useless-escape
            v => /^[0-9a-zA-Z_.]+$/.test(v) || '包含英文字母（大小写）、数字、英文下划线、点，及其组合'
          ]
        },
        {
          label: '交易类型属性*',
          value: item.isAmount,
          type: 'select',
          required: true,
          rules: [
            v => !!v || NAME_NOT_NULL('交易类型属性')
          ],
          selectText: 'paramName',
          selectField: 'paramValue',
          options: this.tradeTypeProperty
        },
        {
          label: '是否批量业务*',
          value: item.isBatch,
          type: 'select',
          // required: true,
          // rules: [
          //   v => !!v || NAME_NOT_NULL('是否批量业务')
          // ],
          selectText: 'texts',
          selectField: 'values',
          options: [{ texts: '是', values: '1' }, { texts: '否', values: '0' }]
        }
      ];
      this.dialog = true;
    },
    // 编辑--保存
    _editItem (a) {
      let isAmountId = '';
      this.tradeTypeProperty.forEach((item, index, ary) => {
        if (a[0][2].value === item.paramValue) {
          isAmountId = item.id;
        }
      });
      const parms = {
        id: this.editItemId,
        tradeName: a[0][0].value,
        identifier: a[0][1].value,
        isAmount: a[0][2].value,
        isAmountId: isAmountId,
        isBatch: a[0][3].value
      };
      a[1].reset();
      editItem(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.getList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      });
    },
    // 点击删除按钮
    deleteFunc (item) {
      // this.dialogDel = true;
      this.deleteItemAry = item;
      // this.deteleId = item.id;
      // console.log(item);
      queryRefRecordBySourceId({ sourceId: item.id }).then(req => {
        if (req.data.code === 200) {
          this.editingMode = req.data.data.editingMode;
          this.deletesFun(item);
        }
      });
    },
    deletesFun (item) {
      let isRefrecordParms = {
        sourceId: this.deleteItemAry.id,
        sourceType: ''
      };
      isRefrecord(isRefrecordParms).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.isReference && this.editingMode === 2) {
            this.dialogDel = true;
            this.snackbarServe = true;
            this.snackbarServeMsg = '该交易已经被引用，您确定要删除此行？';
            this.snackbarServeColor = 'warning';
            this.deleteItemAry = item;
            this.deteleId = item.id;
          } else if (res.data.data.isReference && this.editingMode === 3) {
            this.snackbarServe = true;
            this.snackbarServeMsg = '交易被引用，不能删除！';
            this.snackbarServeColor = 'error';
            this.dialogDel = false;
          } else {
            this.dialogDel = true;
            this.deleteItemAry = item;
            this.deteleId = item.id;
          }
        }
      });
    },
    // 删除弹窗取消
    constantDelCancle () {
      this.dialogDel = false;
    },
    // 删除弹窗确定
    deleteEnum () {
      // let isRefrecordParms = {
      //   sourceId: this.deleteItemAry.id,
      //   sourceType: ''
      // };
      // isRefrecord(isRefrecordParms).then(res => {
      //   if (res.data.code === 200) {
      // if (res.data.data.isReference) {
      //   this.snackbarServe = true;
      //   this.snackbarServeMsg = '交易类型被引用，不能删除！';
      //   this.snackbarServeColor = 'error';
      //   this.dialogDel = false;
      // } else {
      let parms = {
        id: this.deteleId
      };
      deleteItem(parms).then(res => {
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'success';
          this.getList();
          this.dialogDel = false;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
          this.dialogDel = false;
        }
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
      // }
      //   }
      // });
    },
    // 编辑时，编辑开关的change事件
    onChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看交易类型',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑交易类型',
          value: 'edit',
          isEdit: true
        };
        if (this.editingMode === 2) {
          // console.log('该应用已经被引用，请谨慎修改');
          this.snackbarServe = true;
          this.timeout = 5000;
          this.snackbarServeMsg = '该交易已经被引用，请谨慎修改。';
          this.snackbarServeColor = 'warning';
        }
      }
    },
    // 分页
    onPageChange (page) {
      this.pageNum = page;
      this.getList();
    },
    // 页数
    pageChange () {
      this.pageNum = 1;
      this.getList();
    },
    cancel () {
      this.dialog = false;
    },
    save (a) {
      this.dialog = false;
      this.flg == 1 ? this._addItem(a) : this._editItem(a); //eslint-disable-line
    },
    // 重置查询条件
    resetSearchData ($event) {
      $event[0].value = null;
      $event[1].value = null;
      this.searchData = {
        tradeName: '',
        identifier: '',
        isAmount: '',
        isBatch: ''
      };
      this.pageNum = 1;
      this.getList();
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
.el-tr-defu:hover {
  background: var(--v-tableRowHoverActive-base);
}
/* // tr>td {
//   white-space:normal !important
// } */
</style>
