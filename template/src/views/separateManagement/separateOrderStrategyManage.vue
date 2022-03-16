<!----------  @author: YinGuoZheng  ----------->
<!----------  @updated_at: 2020-08-24  ----------->
<!----------  @version: 2.0  ----------->

<template>
  <div class="enu-content fill-height">
    <v-tabs v-model="tab">
      <v-tab @click='tabClick("0")'>初审</v-tab>
      <v-tab @click='tabClick("1")'>复审</v-tab>
    </v-tabs>
    <!-- 搜索表单 -->
    <base-search
      :fieldList="searchParam"
      @search="search($event)"
      @reset="resetSearchData($event)"
      :clearDate="clearDate"
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
            <template v-slot:top>
              <v-toolbar flat>
                <v-spacer/>
                <v-card-title v-if="(searchData.segment === '0' && hasPermission('addFirstAuditSeparateOrderStrategyConfigButton')) ||
                 (searchData.segment === '1' && hasPermission('addReauditSeparateOrderStrategyConfigButton'))">
                  <v-btn
                    color="primary"
                    @click="addParms()"
                  >
                    添加
                  </v-btn>
                </v-card-title>
              </v-toolbar>
            </template>
            <!-- 列表项 -->
            <template v-slot:body="{ items }">
              <tr
                v-for="(item, index) in items"
                :key="index"
                class="el-tr-defu"
              >
                <td
                  :title="`${item.name}`"
                  class="el-border-defu"
                >
                  {{ item.name }}
                </td>
                <td
                  :title="item.segment | segments()"
                  class="el-border-defu"
                >
                  {{ item.segment | segments() }}
                </td>
                <td
                  :title="`${item.priority}`"
                  class="el-border-defu"
                >
                  {{ item.priority }}
                </td>
                <td
                  :title="`${item.createTime}`"
                  class="el-border-defu"
                >
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
                        @click="editFunc(item, index)"
                      >
                        mdi-pencil
                      </v-icon>
                    </template>
                    <span>编辑</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="(searchData.segment === '0' && hasPermission('deployFirstAuditSeparateOrderStrategyConfigButton')) ||
                 (searchData.segment === '1' && hasPermission('deployReauditSeparateOrderStrategyConfigButton'))">
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-2"
                        color="primary"
                        v-on="on"
                        @click="toConfigure(item)"
                      >mdi-bookmark-multiple</v-icon>
                    </template>
                    <span>配置</span>
                  </v-tooltip>
                  <v-tooltip bottom>
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
    <base-create :formHeader='addOrEditHeader' :crudFormDialog='dialog' :formData='addAndEditFormData' @cancelCrudFormDialog='cancel($event)' @confimDialogSave='save(arguments)' @switchOnChange="onChange($event)"
                 :baseCteateEditPowerBtn="(searchData.segment === '0' && hasPermission('editFirstAuditSeparateOrderStrategyConfigButton')) ? 'editFirstAuditSeparateOrderStrategyConfigButton' :
                 (searchData.segment === '1' && hasPermission('editReauditSeparateOrderStrategyConfigButton')) ? 'editReauditSeparateOrderStrategyConfigButton' : ''"></base-create>
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
import { getList, addItem, deleteItem, editItem } from '../../api/separateOrderStrategyManage.js';
import { getFieldNameList } from '../../api/SystemParamLib.js';
import BaseCreate from '@/components/BaseCreate';
import BaseSearch from '@c/BaseSearch';
import DelDialog from '@/components/DelDialog';
import { NAME_NOT_NULL, MAX_INPUT_LENGTH, BASE_NAME_TEXT, BASE_VALUE_TEXT } from 'utils/validate';
let that;
export default {
  components: {
    DelDialog,
    BaseSearch,
    BaseCreate
  },
  data () {
    return {
      tab: null,
      clearDate: true,
      counter: 0,
      fullHeight: window.innerHeight,
      // 列表
      constHeader: [
        { text: '分单策略名称', value: 'name', sortable: false, width: 100 },
        { text: '分单环节', value: 'segment', sortable: false, width: 100 },
        { text: '优先级', value: 'priority', sortable: false, width: 100 },
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
        name: '添加审核流',
        value: 'add',
        isEdit: true
      },
      // 添加
      addAndEditFormData: [
        {
          label: '分单策略名称*',
          value: '',
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || NAME_NOT_NULL('分单策略名称'),
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50),
            // v => !((/[^\u4E00-\u9FA5]/).test(v)) || '常量只能输入汉字'
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || BASE_NAME_TEXT
          ]
        },
        // {
        //   label: '分单环节*',
        //   value: '',
        //   type: 'select',
        //   required: true,
        //   rules: [
        //     v => !!v || NAME_NOT_NULL('分单环节')
        //   ],
        //   options: []
        // },
        {
          label: '优先级*',
          value: '',
          type: 'text',
          required: true,
          counter: '2',
          rules: [
            v => !!v || NAME_NOT_NULL('优先级'),
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 2 || MAX_INPUT_LENGTH(2),
            // eslint-disable-next-line no-useless-escape
            // v => !((/[^\ a-\z\A-\Z]/).test(v)) || '常量名只能输入英文字母'
            // v => /^[0-9a-zA-Z_]+$/.test(v) || BASE_VALUE_TEXT
            v => ((/^(-)?\d+(\.\d+)?$/).test(v)) || '优先级只能输入数字'
          ]
        }
      ],
      // 搜索组件数据
      searchParam: [
        { type: 'text', placeholder: '分单策略名称', value: '' },
        // {
        //   type: 'select',
        //   placeholder: '分单环节',
        //   value: '',
        //   options: []
        // },
        { type: 'date', placeholder: '创建时间', value: [] }
      ],
      searchData: {
        name: '',
        segment: '0',
        startTime: '',
        endTime: ''
      },
      deteleId: '', // 删除ID
      deleteItemAry: {},
      segmentData: [] // 分单环节下拉数据
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
    // 分单环节
    segments: function (str) {
      let dataTypeText;
      that.segmentData.forEach(item => {
        if (typeof str === 'number') {
          str = String(str);
        }
        if (item.paramValue === str) {
          dataTypeText = item.paramName;
        }
      });
      return dataTypeText;
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeCreate: function () {
    that = this;
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
  beforeRouteLeave (to, from, next) {
    // 离开当前路由页面时调用
    if (to.path === '/splittingPolicyConfig') {
      window.sessionStorage.setItem('separateOrderStrategyManageTab', this.searchData.segment);
    } else {
      window.sessionStorage.removeItem('separateOrderStrategyManageTab');
    }
    next();
  },
  created () {
    this.getTab();
    this.getList();
    this.gitSegmentData();
  },
  methods: {
    getTab () {
      if (sessionStorage.getItem('separateOrderStrategyManageTab')) {
        this.tab = Number(sessionStorage.getItem('separateOrderStrategyManageTab'));
        this.searchData.segment = sessionStorage.getItem('separateOrderStrategyManageTab');
        sessionStorage.removeItem('separateOrderStrategyManageTab');
      } else {
        this.tab = 0;
      }
    },
    // 获取分单环节
    gitSegmentData () {
      const parms = {
        identifier: 'case_assign_segment'
      };
      getFieldNameList(parms)
        .then(res => {
          if (res.data.code === 200) {
            // console.log(res.data.data);
            res.data.data.forEach((item, index, ary) => {
              ary[index].text = item.paramName;
              ary[index].value = item.paramValue;
            });
            // 搜索
            this.searchParam[1].options = res.data.data;
            // // 添加
            // this.addAndEditFormData[1].options = res.data.data;
            // 编辑
            this.segmentData = res.data.data;
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.msg);
        });
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 分单策略配置
    toConfigure (item) {
      // console.log(item)
      this.$router.push({
        path: '/splittingPolicyConfig',
        name: 'splittingPolicyConfig',
        params: {
          indexId: item.id,
          spLevel: item.segment
        }
      });
    },
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 查询
    search ($event) {
      let startTime = '';
      let endTime = '';
      if ($event[1].value.length !== 0) {
        startTime = $event[1].value.substr(0, 10) + ' 00:00:00';
        endTime = $event[1].value.substr(13, 20) + ' 23:59:59';
      }
      this.searchData = {
        name: $event[0].value === undefined ? '' : $event[0].value,
        segment: this.searchData.segment,
        startTime: $event[1].value.length === 0 ? '' : startTime,
        endTime: $event[1].value.length === 0 ? '' : endTime
      };
      // console.log($event);
      this.pageNum = 1;
      this.getList();
    },
    // tab 点击
    tabClick (segment) {
      this.searchData.segment = segment;
      this.pageNum = 1;
      this.getList();
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
            // console.log(res);
            this.constItem = res.data.data.list;
            this.totalItems = res.data.data.totalElements;
            this.queryPageLength = Math.ceil(this.totalItems / this.perPageNum);
          } else {
            this.message(res.data.msg);
          }
        })
        .catch(err => {
          this.message(err.message);
        });
    },
    // 添加--弹窗
    addParms () {
      this.flg = 1;
      this.dialog = true;
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.addOrEditHeader = {
        name: '添加分单策略',
        value: 'add',
        isEdit: false
      };
    },
    // 添加--保存
    _addItem (a) {
      const parms = {
        name: a[0][0].value,
        segment: this.searchData.segment,
        priority: a[0][1].value
      };
      // console.log(parms)
      a[1].reset();
      addItem(parms).then(res => {
        // console.log(res)
        if (res.data.code === 200) {
          this.message(res.data.msg, 'success');
          this.getList();
        } else {
          this.message(res.data.msg);
        }
      });
    },
    // 编辑--弹窗
    editFunc (item, index) {
      this.flg = 2;
      this.editItemId = item.id;
      // let isRefrecordParms = {
      //   sourceId: item.id,
      //   sourceType: ''
      // };
      // console.log(item)
      this.addOrEditHeader = {
        name: '查看分单策略',
        value: 'edit',
        isEdit: true
      };
      this.addAndEditFormData = [
        {
          label: '分单策略名称*',
          value: item.name,
          type: 'text',
          required: true,
          counter: '50',
          rules: [
            v => !!v || NAME_NOT_NULL('审核流名称'),
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 50 || MAX_INPUT_LENGTH(50),
            v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || BASE_NAME_TEXT
          ]
        },
        // {
        //   label: '分单环节*',
        //   value: item.segment + '',
        //   type: 'select',
        //   required: true,
        //   rules: [
        //     v => !!v || NAME_NOT_NULL('分单环节')
        //   ],
        //   // selectText: 'paramName',
        //   // selectField: 'paramValue',
        //   options: this.segmentData
        // },
        {
          label: '优先级*',
          value: item.priority + '',
          type: 'text',
          required: true,
          counter: '2',
          rules: [
            v => !!v || NAME_NOT_NULL('优先级'),
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 2 || MAX_INPUT_LENGTH(2),
            // v => (/^[\u4e00-\u9fa50-9a-zA-Z_]+$/.test(v)) || BASE_NAME_TEXT
            v => ((/^(-)?\d+(\.\d+)?$/).test(v)) || '优先级只能输入数字'
          ]
        }
      ];
      this.dialog = true;
    },
    // 编辑--保存
    _editItem (a) {
      const parms = {
        id: this.editItemId,
        name: a[0][0].value,
        segment: this.searchData.segment,
        priority: a[0][1].value
      };
      a[1].reset();
      editItem(parms).then(res => {
        if (res.data.code === 200) {
          this.message(res.data.msg, 'success');
          this.getList();
        } else {
          this.message(res.data.msg);
        }
      });
    },
    // 点击删除按钮
    deleteFunc (item) {
      this.dialogDel = true;
      this.deleteItemAry = item;
      this.deteleId = item.id;
      // console.log(item);
    },
    // 删除弹窗取消
    constantDelCancle () {
      this.dialogDel = false;
    },
    // 删除弹窗确定
    deleteEnum () {
      // let isRefrecordParms = {
      //   ids: this.deleteItemAry.id
      // };
      let parms = {
        ids: this.deteleId
      };
      deleteItem(parms).then(res => {
        if (res.data.code === 200) {
          this.message(res.data.msg, 'success');
          this.getList();
          this.dialogDel = false;
        } else {
          this.message(res.data.msg);
          this.dialogDel = false;
        }
      }).catch(err => {
        this.message(err.msg);
      });
    },
    // 编辑时，编辑开关的change事件
    onChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '查看分单策略',
          value: 'edit',
          isEdit: true
        };
      } else {
        this.addOrEditHeader = {
          name: '编辑分单策略',
          value: 'edit',
          isEdit: true
        };
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
      // console.log($event);
      $event[0].value = null;
      $event[1].value = null;
      // $event[2].value = null;
      this.searchData = {
        name: '',
        segment: this.searchData.segment,
        startTime: '',
        endTime: ''
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
</style>
