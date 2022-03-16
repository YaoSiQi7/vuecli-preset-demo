<template>
  <div class="fill-height">
    <!-- 搜索表单 -->
    <base-search
      :fieldList="searchForm"
      @search="search($event)"
      @reset="resetSearchData($event)"
      ref="nameListDataSearch"
      @change="panelCounter"
    ></base-search>
    <!-- 名单集列表 -->
    <v-data-table
      ref="nameListDataTable"
      :headers="nameListDataHeaders"
      :items="nameListData"
      :items-per-page="perPageNum"
      hide-default-footer
      :fixed-header="true"
      :height="tableHeight"
      class="elevation-3 mt-3"
      item-key="id"
      show-select
      v-model="selectedTasks"
      selectable-key
      @toggle-select-all="getSelect"
    >
      <!-- :selectable-key='isSelectable' -->
      <!-- 表头 -->
      <template v-slot:top>
        <v-toolbar flat height="60px">
          <v-toolbar-title style="font-size:18px">名单数据</v-toolbar-title>
          <v-spacer/>
          <v-btn color="primary" class="mr-2 mt-1" @click="AddNameListData" v-if="hasPermission(addNameListDataBtn)">添加</v-btn>
          <v-btn color="primary" class="mr-2 mt-1" @click="uploadDialog = true" v-if="hasPermission(importNameLIstDataBtn)">导入</v-btn>
          <v-btn color="primary" class="mr-1 mt-1" @click="exportData" v-if="hasPermission(exportNameListDataBtn)">导出</v-btn>
          <v-btn color="primary" class="mr-1 mt-1" @click="deleteAll" v-if="hasPermission(batchDeleteDataBtn)">批量删除</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:body="{ items }">
        <tr class="v-data-table__empty-wrapper" v-if="items.length === 0">
          <td colspan="6">没有数据</td>
        </tr>
        <tr
          v-else
          v-for="(item, index) in items"
          :key="index"
          class="el-tr-defu"
        >
          <td>
            <v-checkbox v-model="selectedTasks" :value="item" style="margin:0px;padding:0px" hide-details :disabled="item.states" />
          </td>
          <td
            class="el-border-defu"
          >
            {{ item.listValue }}
          </td>
          <td class="el-border-defu">
            {{ item.listId | textFilters(nameListSet) }}
          </td>
          <td
            class="el-border-defu"
          >
            {{ item.listTypeName }}
          </td>
          <td
            class="el-border-defu"
          >
            {{ item.dataSourceName }}
          </td>
          <td
            class="el-border-defu"
          >
            {{ item.checkResultName }}
          </td>
          <td
            class="el-border-defu"
          >
            <v-switch
              v-model="item.states"
              color="primary"
              :disabled="item.switchDisabled"
              @change="isStat(item, index)"
              v-if="hasPermission(conversionStateBtn)"
            />
          </td>
          <td
            class="el-border-defu"
          >
            {{ item.createTime }}
          </td>
          <td
            class="el-border-defu"
          >
            {{ item.expireTime || '永久有效' }}
          </td>
          <td class="el-border-defu">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-3 icon-primary"
                  v-on="on"
                  color="primary"
                  @click="editNameListSet(item)"
                  :disabled="item.isDisabled"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <span>编辑</span>
            </v-tooltip>
            <v-tooltip bottom v-if="hasPermission(deleteNameDataBtn)">
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  class="mr-1 icon-primary"
                  v-on="on"
                  color="primary"
                  @click="deleteNameListSet(item)"
                  :disabled="item.isDisabled"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>删除</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <!-- 分页组件 -->
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
    <!-- 添加或编辑的弹窗 -->
    <base-create ref="nameListDataModel" :baseCteateEditPowerBtn="editNameListDataBtn" :formHeader='addOrEditHeader' :crudFormDialog='addOrEditDialog' :formData='addAndEditFormData' @cancelCrudFormDialog='cancel($event)' @confimDialogSave='save(arguments)' @submitReview="submitReviewSave(arguments)" @switchOnChange="onChange($event)"></base-create>
     <!-- 删除弹框 -->
    <del-dialog :isDialogShow='dialogDel' @cancelDel='dialogDel = false' @confimDel='confirmDelFun'></del-dialog>
    <del-dialog :isDialogShow='dialogDelAll' @cancelDel='dialogDelAll = false' :customDelTitle='allRemoveText' @confimDel='confirmDelFunAll'></del-dialog>
    <!-- 导入表格 -->
    <v-dialog
      v-model="uploadDialog"
      persistent
      scrollable
      max-width="500px">
      <v-card height="300px">
        <v-card-title>
          <v-toolbar-title>
            导入表格数据
          </v-toolbar-title>
        <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="cancelUpload"
          >
            <v-icon color="#CCCCCC">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-form
            ref="uploadFileForm"
            :lazy-validation="lazy"
            v-model="uploadFormValid">
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <v-select
                    v-model="Affiliatelistset"
                    :items="nameListSet"
                    item-text="selectText"
                    item-value="selectField"
                    outlined
                    dense
                    label="选择名单集"
                    required
                    :rules="[v => !!v || '请选择名单集']">
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">

                  <v-file-input
                    v-model="fileInfo"
                    required
                    :rules="[v => !!v || '请选择文件']"
                    show-size
                    accept=".xlsx"
                    :disabled="uploadIsLoading"

                    prepend-icon=""
                    outlined
                    dense
                    label="点击选择文件，文件后缀为: .xlsx">
                  </v-file-input>
                </v-col>
              </v-row>
              <!-- 导入弹框增加失效时间(暂时没用此功能) -->
              <!-- <v-row>
                <v-col cols="1"></v-col>
                <v-col cols="10">
                  <datetime-picker
                    v-model="importDate"
                    time-format="HH:mm:ss"
                    :type='3'
                    @clear="importDate=''"
                    :text-field-props="textFieldProps"
                    :date-picker-props="dateProps"
                    :time-picker-props="timeProps"
                    placeholder="不填写时，默认永久有效"
                    label="失效时间"
                  />
                </v-col>
              </v-row> -->
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="primary mr-4"
              outlined
              style="color:white"
              @click="downloadTemp">下载模板
            </v-btn>
            <v-btn
                class="primary mr-4"
                style="margin-right:10px;color:white"
                @click="uploadFile"
                :disabled="!uploadFormValid"
                :loading="uploadIsLoading"
              >
              导入
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 公共弹框提示 -->
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >
      {{ snackbarServeMsg }}
    </v-snackbar>
     <!---导出遮罩层--->
   <loadingOverlays :overlay="overlay" :progress="progress" :title="title"></loadingOverlays>
  </div>
</template>
<script>
import * as dataService from 'api/nameListData.js';
import { findsysParams } from 'api/nameListSet.js';
import { NAME_NOT_NULL, MAX_INPUT_LENGTH, NO_EMPTY_SPACE_ALLOWED } from 'utils/validate.js';
import BaseSearch from '@c/BaseSearch';
import BaseCreate from '@/components/BaseCreate';
import DelDialog from '@/components/DelDialog';
import loadingOverlays from '@c/loadingOverlays';
import { BreadcrumbItem } from 'view-design';
import DatetimePicker from '@c/DateTimePicker'; // 导入弹框增加失效时间(暂时没用此功能)
import moment from 'moment';
export default {
  name: 'nameListData',
  components: {
    BaseSearch,
    BaseCreate,
    DelDialog,
    loadingOverlays
    // DatetimePicker  // 导入弹框增加失效时间(暂时没用此功能)
  },
  data () {
    return {
      overlay: false,
      progress: 0, // 进度
      title: '正在导入...',
      isSelect: 1, // 列表中复选框是否全选中，1为未选中，2为全选择
      selectedTasks: [],
      counter: 0,
      fullHeight: window.innerHeight,
      // 搜索组件数据
      searchForm: [
        { placeholder: '名单数据', value: '', type: 'text' },
        {
          placeholder: '所属名单集',
          value: '',
          type: 'select',
          options: [
            { text: '全部名单集', value: 'all' }
          ]
        },
        {
          placeholder: '名单类型',
          value: '',
          type: 'select',
          options: [
            { text: '全部名单类型', value: 'all' }
          ]
        },
        {
          placeholder: '名单数据来源',
          value: '',
          type: 'select',
          options: [
            { text: '全部数据来源', value: 'all' }
          ]
        },
        {
          placeholder: '名单审核结果',
          value: '',
          type: 'select',
          options: [
            { text: '全部审核结果', value: 'all' }
          ]
        }
      ],
      // 搜索参数
      searchData: {
        listValue: '',
        listId: '',
        listType: '',
        dataSource: '',
        checkResult: ''
      },
      // 拼接上送参数
      saveParams: {},
      editParams: {},
      // 列表表头
      nameListDataHeaders: [
        { text: '名单数据', value: 'listValue', sortable: false, width: 100 },
        { text: '所属名单集', value: 'listId', sortable: false, width: 100 },
        { text: '名单类型', value: 'listType', sortable: false, width: 100 },
        { text: '名单数据来源', value: 'dataSource', sortable: false, width: 100 },
        { text: '名单审核结果', value: 'checkResult', sortable: false, width: 100 },
        { text: '状态', value: 'states', sortable: false, width: 100 },
        { text: '创建时间', value: 'createTime', sortable: false, width: 100 },
        { text: '失效时间', value: 'expireTime', sortable: false, width: 100 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      nameListData: [],
      // 分页变量
      pageNum: 1,
      pageSize: 10,
      queryPageLength: 0,
      perPageNum: 10,
      totalItems: 0,
      perPageItems: [5, 10, 15, 20, 50, 100],
      // 名单数据来源
      nameListDataSourceSet: [],
      // 所属名单集
      nameListSet: [],
      // 名单类型
      nameTypeList: [],
      // 名单审核结果
      nameListReviewResultList: [],
      // 添加or弹框参数
      addOrEditDialog: false,
      addOrEditHeader: {
        name: '添加名单数据',
        value: 'add',
        isEdit: false,
        needReview: true
      },
      addAndEditFormData: [
        {
          label: '所属名单集',
          value: '',
          required: true,
          rules: [v => !!v || NAME_NOT_NULL('所属名单集')],
          type: 'select',
          selectText: 'selectText',
          selectField: 'selectField',
          options: []
        },
        {
          label: '名单数据',
          value: '',
          required: true,
          rules: [
            v => !!v || NAME_NOT_NULL('名单数据'),
            // eslint-disable-next-line no-mixed-operators
            v => v && v.length <= 100 || MAX_INPUT_LENGTH(100)
          ],
          type: 'text',
          counter: '100'
        },
        {
          // required: true,
          label: '失效时间',
          value: '',
          textFieldProps: {
            appendIcon: 'event'
          },
          dateProps: {
            headerColor: 'primary'
          },
          timeProps: {
            useSeconds: true,
            ampmInTitle: true
          },
          type: 'dateTypeEnd'
          /* rules: [
            // v => !!v || NO_EMPTY_SPACE_ALLOWED
            v => !!v || NAME_NOT_NULL('名单数据222221')
          ] */
        }
      ],
      dialogState: 'add', // 添加行为或者编辑行为
      // 删除弹框变量
      confirmDelFun: '', // 删除弹框传的函数名
      confirmDelFunAll: '', // 批量删除弹框传的函数名
      dialogDel: false,
      dialogDelAll: false,
      delCurrentId: '', // 删除当前行的id
      // 提示弹框参数
      timeout: 2000,
      isSnackbarTop: true,
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '',
      // 当前要编辑的名单数据id
      currentEditId: '',
      listid: '', // 所属名单集id
      originListType: '',
      isFromNewAdd: false, // 添加名单数据后，添加引用记录需要的标识
      delParam: '',
      // 上传表格变量
      uploadDialog: false,
      uploadFormValid: true,
      lazy: false,
      Affiliatelistset: '', // 上传表格时，所属名单集变量
      fileInfo: null,
      uploadIsLoading: false,
      importDate: '', // 导入表格时，失效时间(暂时没用此功能)
      textFieldProps: {
        appendIcon: 'event'
      },
      dateProps: {
        headerColor: 'primary'
      },
      timeProps: {
        useSeconds: true,
        ampmInTitle: true
      },
      removeListIdAry: '', // 批量删除的sourceId=>listId的所有源id。类型为字符串。(此为名单集的id)
      allRemoveText: '', // 批量删除弹窗中的提示词
      removeIdString: '', // 批量删除的targetId=>id的所有被引用的id。类型为字符串。(此为名单数据每一项的id)
      // 按钮权限
      addNameListDataBtn: '/addNameListDataButton', // 添加按钮是否显示
      importNameLIstDataBtn: '/importNameLIstDataButton', // 导入按钮是否显示
      exportNameListDataBtn: '/exportNameListDataButton', // 导出按钮是否显示
      batchDeleteDataBtn: '/batchDeleteNameListDataButton', // 批量删除按钮是否显示
      conversionStateBtn: '/conversionNameListDataStateButton', // 表格状态按钮
      editNameListDataBtn: '/editNameListDataButton', // 表格编辑按钮
      deleteNameDataBtn: '/deleteNameListDataButton', // 表格删除按钮
      returnProssData: '' // 获取上传的进度返回数据
    };
  },
  filters: {
    textFilters: function (str, itemList) {
      let text;
      itemList.forEach(item => {
        if (item.selectField === str) {
          text = item.selectText;
        }
      });
      return text;
    },
    listTypeFilters: function (str, itemList) {
      let text;
      itemList.forEach(item => {
        if (item.selectField === str) {
          text = item.listType;
        }
      });
      return text;
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    Promise.all([
      this.getlistTypeItems(),
      this.queryAllListType(),
      this.queryAllDataSource(),
      this.queryReviewResult(),
      this.getNameListSetList()
    ]);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  watch: {
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 70;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 266;
      }
    }
  },
  methods: {
    // 列表全选功能
    getSelect () {
      if (this.isSelect === 1) {
        this.selectedTasks = this.nameListData.filter(item => !item.states);
        this.isSelect++;
      } else {
        this.isSelect--;
        this.selectedTasks = this.nameListData.filter(item => false);
      }
    },
    // 批量删除
    deleteAll () {
      this.removeListIdAry = ''; // 批量删除的sourceId=>listId的所有源id。类型为字符串。(此为名单集的id)
      this.removeIdString = ''; // 批量删除的targetId=>id的所有被引用的id。类型为字符串。(此为名单数据每一项的id)
      if (this.selectedTasks.length) {
        let removeListIdAry = [];
        let removeListIdString = '';
        this.selectedTasks.forEach((item, index, ary) => {
          removeListIdAry.push(item.listId); // 取所选中的每一项的listId，即所有的名单集的id
          this.removeIdString = this.removeIdString + ',' + item.id; // 取所选中的所有的名单数据的id，组成一个字符串
        });
        removeListIdAry = [...new Set(removeListIdAry)]; // 去重sourceId,即源id，也是名单集的id
        removeListIdAry.forEach((item, index, ary) => {
          removeListIdString = removeListIdString + ',' + item; // 把所选中的名单集的id，组成一个字符串
        });
        this.removeListIdAry = removeListIdString;
        this.allRemoveText = '您确定要删除所选项吗？';
        this.dialogDelAll = true;
        this.confirmDelFunAll = this.confirmDelAll;
      } else {
        this.snackbarServe = true;
        this.snackbarServeMsg = '请先勾选需要删除的选项';
        this.snackbarServeColor = 'error';
      }
    },
    async confirmDelAll () {
      try {
        const res = await dataService.deleteNameListData({ ids: this.removeIdString.substr(1, this.removeIdString.length) });
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '删除成功';
          this.snackbarServeColor = 'success';
          // this.delRecordAll(this.selectedTasks[0]); // 注释掉的是批量删除引用记录。这一块由后台接手去完成。
          this.getNameListSetList();
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
      this.dialogDelAll = false;
    },
    // 下载模板
    downloadTemp () {
      const params = Object.assign({}, {
        listValue: this.searchForm[0].value,
        listId: this.searchForm[1].value,
        listType: this.searchForm[2].value,
        dataSource: this.searchForm[3].value,
        checkResult: this.searchForm[4].value
      });
      dataService.getTemplData(params).then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = '名单数据模板' + '.xlsx';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    // 转换时间
    getTimes (time) {
      if (time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    // 导入表格数据
    uploadFile () {
      if (this.$refs.uploadFileForm.validate()) {
        this.uploadIsLoading = true;
        let formData = new FormData();
        // 把文件信息放入对象中
        formData.append('file', this.fileInfo);
        formData.append('listId', this.Affiliatelistset);
        // formData.append('expireTime', this.getTimes(this.importDate)); // 导入弹框增加失效时间(暂时没用此功能)
        dataService.importData(formData).then(res => {
          console.log(res.data.code, 'eee');
          // 调用导入状态进度接口
          if (res.data.code === 200) {
            // this.snackbarServe = true;
            // this.snackbarServeMsg = res.data.msg;
            // this.snackbarServeColor = 'success';
            this.title = res.data.msg;
            this.overlay = true;// 遮罩，弹框进度展示
            this.returnProssData = res.data.data;
            this.importantFetchProsse();// 导入进度获取方法
            this.cancelUpload();// 取消上传
            this.getNameListSetList(); // 刷新名单列表
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
            this.uploadIsLoading = false;
          }
        }).catch(err => {
          this.snackbarServe = true;
          this.snackbarServeMsg = err.msg;
          this.snackbarServeColor = 'error';
          this.uploadIsLoading = false;
        });
      }
    },
    cancelUpload () {
      this.$refs.uploadFileForm.reset();
      this.uploadDialog = false;
      this.uploadIsLoading = false;
    },
    // 导入数据进度获取
    importantFetchProsse () {
      let params = {
        key: this.returnProssData
      };
      dataService.importantProsse(params).then(res => {
        console.log(res, '导入进度获取。。。。');
        if (res.data.code === 200) {
          this.progress = res.data.data;
          console.log(this.progress, 'dddd');
          if (this.progress < 100) {
            // 判断返回进度是否完成
            setTimeout(() => {
              this.importantFetchProsse(params);
            }, 2000);
          } else {
            this.overlay = false;
            this.title = '名单数据导入成功';
            this.message('名单数据导入成功', 'success');
          }
        }
      });
    },
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    },
    // 导出数据
    async exportData () {
      // const params = `${window.g.address}/listData/export?listValue=${this.searchForm[0].value}&listId=${this.searchForm[1].value}&listType=${this.searchForm[2].value}&dataSource=${this.searchForm[3].value}&checkResult=${this.searchForm[4].value}`;
      // window.open(params);
      const params = Object.assign({}, {
        listValue: this.searchForm[0].value,
        listId: this.searchForm[1].value,
        listType: this.searchForm[2].value,
        dataSource: this.searchForm[3].value,
        checkResult: this.searchForm[4].value
      });
      dataService.getExportData(params).then(response => {
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = '名单数据' + '.xlsx';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      });
    },
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 获取名单集数据
    async getlistTypeItems () {
      try {
        const res = await dataService.queryNameListSet({ appType: '1' });
        if (res.data.code === 200) {
          res.data.data.forEach((item, index, ary) => {
            this.nameListSet.push(
              { selectText: item.listName, selectField: item.id, listType: item.listType }
            );
            this.addAndEditFormData[0].options.push(
              { selectText: item.listName, selectField: item.id }
            );
            this.searchForm[1].options.push(
              { text: item.listName, value: item.id }
            );
          });
        }
      } catch (err) {}
    },
    // 名单类型
    async queryAllListType () {
      try {
        let param = {
          identifier: 'sys_list_type'
        };
        const res = await findsysParams(param);
        if (res.data.code === 200) {
          res.data.data.forEach((item, index, ary) => {
            this.nameTypeList.push(
              { text: item.paramName, value: item.paramValue }
            );
            this.searchForm[2].options.push(
              { text: item.paramName, value: item.paramValue }
            );
          });
        }
      } catch (err) {}
    },
    // 数据来源
    async queryAllDataSource () {
      try {
        let param = {
          identifier: 'sys_data_source'
        };
        const res = await findsysParams(param);
        if (res.data.code === 200) {
          res.data.data.forEach((item, index, ary) => {
            this.nameListDataSourceSet.push(
              { text: item.paramName, value: item.paramValue }
            );
            this.searchForm[3].options.push(
              { text: item.paramName, value: item.paramValue }
            );
          });
        }
      } catch (err) {}
    },
    // 审核结果
    async queryReviewResult () {
      try {
        let param = {
          identifier: 'sys_check_result'
        };
        const res = await findsysParams(param);
        if (res.data.code === 200) {
          res.data.data.forEach((item, index, ary) => {
            this.nameListReviewResultList.push(
              { text: item.paramName, value: item.paramValue }
            );
            this.searchForm[4].options.push(
              { text: item.paramName, value: item.paramValue }
            );
          });
        }
      } catch (err) {}
    },
    search ($event) {
      $event.forEach((item, index, ary) => {
        if (item.placeholder === '名单数据') {
          this.searchData.listValue = item.value;
        } else if (item.placeholder === '所属名单集') {
          this.searchData.listId = item.value;
        } else if (item.placeholder === '名单类型') {
          this.searchData.listType = item.value;
        } else if (item.placeholder === '名单数据来源') {
          this.searchData.dataSource = item.value;
        } else if (item.placeholder === '名单审核结果') {
          this.searchData.checkResult = item.value;
        }
      });
      if (this.searchData.listId === 'all') {
        this.searchData.listId = '';
      }
      if (this.searchData.listType === 'all') {
        this.searchData.listType = '';
      }
      if (this.searchData.dataSource === 'all') {
        this.searchData.dataSource = '';
      }
      if (this.searchData.checkResult === 'all') {
        this.searchData.checkResult = '';
      }
      this.pageNum = 1; // 默认从第一页开始查询
      this.getNameListSetList();
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.searchData = {
        listValue: '',
        listId: '',
        listType: '',
        dataSource: '',
        checkResult: ''
      };
      this.pageNum = 1; // 默认从第一页开始查询
      this.getNameListSetList();
    },
    onPageChange (page) {
      this.pageNum = page;
      this.getNameListSetList();
    },
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getNameListSetList();
    },
    // 获取首页列表数据
    async getNameListSetList () {
      let pageParams = {
        pageIndex: this.pageNum,
        pageSize: this.perPageNum
      };
      let searchParam = JSON.parse(JSON.stringify(this.searchData));
      let params = Object.assign({}, pageParams, searchParam);
      try {
        const res = await dataService.queryNameListData(params);
        if (res.data.code === 200) {
          this.nameListData = res.data.data.list;
          for (let item of this.nameListData) {
            if (item.checkResultName === '通过' && item.states === '1') {
              item.states = true;
              item.switchDisabled = false; // 审核状态为通过状态下开关不禁用，否则禁用
              item.isDisabled = true; // 开关启用后编辑和删除按钮禁用，否则不禁用
            } else if (item.checkResultName === '通过' && item.states === '0') {
              item.states = false;
              item.switchDisabled = false;
              item.isDisabled = false;
            } else if (item.checkResultName !== '通过') {
              item.states = false;
              item.switchDisabled = true;
              item.isDisabled = false;
            }
          }
          this.totalItems = res.data.data.totalElements;
          this.queryPageLength = res.data.data.totalPages;
          if (this.isFromNewAdd) {
            let addRecordParam = res.data.data.list[0];
            this.addRecord(addRecordParam);
            this.isFromNewAdd = false;
          }
          this.selectedTasks = this.nameListData.filter(item => false);
        }
      } catch (err) {}
    },
    // 添加引用记录
    async addRecord (params) {
      let param = {
        sourceId: params.listId,
        targetId: params.id,
        sourceType: 'NAME_LIST',
        targetType: 'NAME_LIST_DATA'
      };
      let addParams = {
        jsonStr: JSON.stringify([param])
      };
      dataService.addRecord(addParams);
      // try {
      //   const res = await dataService.addRecord(addParams);
      //   if (res.data.code === 200) {}
      // } catch (err) {}
    },
    // 删除名单数据的时候，单个删除引用记录
    async delRecord (params) {
      let param = {
        sourceId: params.listId,
        sourceType: 'NAME_LIST',
        targetType: 'NAME_LIST_DATA',
        targetId: params.id
      };
      // return false;
      let delParams = {
        jsonStr: JSON.stringify([param])
      };
      dataService.delrecord(delParams);
      // try {
      //   const res = await dataService.delrecord(delParams);
      //   if (res.data.code === 200) {}
      // } catch (err) {}
    },
    // 删除名单数据的时候，批量删除引用记录
    async delRecordAll (params) {
      let param = {
        sourceId: this.removeListIdAry.substr(1, this.removeListIdAry.length),
        targetId: this.removeIdString.substr(1, this.removeIdString.length)
      };
      let delParams = {
        jsonStr: JSON.stringify([param])
      };
      dataService.delrecordAll(delParams);
      // try {
      //   const res = await dataService.delrecordAll(delParams);
      //   if (res.data.code === 200) {}
      // } catch (err) {}
    },
    // 点击添加
    AddNameListData () {
      this.addAndEditFormData[2].value = '';
      // let getFullYear = new Date().getFullYear();
      // let getMonth = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      // let getDate = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      // let currentTime = `${getFullYear}-${getMonth}-${getDate}`;
      this.addOrEditHeader = {
        name: '添加名单数据',
        value: 'add',
        isEdit: false,
        needReview: true
      };
      this.addOrEditDialog = true;
    },
    // 点击编辑
    async editNameListSet (item) {
      this.addAndEditFormData[2].value = '';
      this.delParam = item;
      this.currentEditId = item.id;
      this.originListType = item.listType;
      this.addOrEditHeader = {
        name: '名单数据详情',
        value: 'edit',
        isEdit: true,
        needReview: false
      };
      this.$nextTick(() => {
        this.addAndEditFormData[0].value = item.listId;
        this.addAndEditFormData[1].value = item.listValue;
        this.addAndEditFormData[2].value = item.expireTime;
      });
      this.addOrEditDialog = true;
    },
    // 点击保存
    save (paramData) {
      this.saveParams = {}; // 每次重置为空
      this.editParams = {};
      let params = paramData;
      if (this.addOrEditHeader.isEdit === false) {
        this.spliceSaveParams(params);
        this.saveParams.action = 'save';
        this.confirmAddParm(this.saveParams);
      } else {
        this.spliceEditParams(params);
        this.editParams.action = 'save';
        this.editParams.id = this.currentEditId;
        this.confirmEditParam(this.editParams);
      }
      this.addOrEditDialog = false;
      params[1].reset(); // 重置表单
    },
    // 拼接上送参数
    spliceSaveParams (params) {
      this.saveParams = Object.assign({}, {
        listId: params[0][0].value,
        listValue: params[0][1].value,
        expireTime: this.getTimes(params[0][2].value),
        listType: this.$options.filters.listTypeFilters(params[0][0].value, this.nameListSet)
      });
    },

    spliceEditParams (params) {
      this.editParams = Object.assign({}, {
        listValue: params[0][1].value,
        listId: params[0][0].value,
        expireTime: this.getTimes(params[0][2].value),
        listType: this.originListType
      });
    },
    // 添加时保存
    async confirmAddParm (params) {
      console.log(params, '1111111111');
      if (!params.listValue) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '名单数据不能为空';
        this.snackbarServeColor = 'error';
        return;
      }
      try {
        const res = await dataService.addNameListData(params);
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '添加成功';
          this.snackbarServeColor = 'success';
          this.isFromNewAdd = true;
          this.getNameListSetList();
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = '添加失败';
          this.snackbarServeColor = 'error';
        }
      } catch (err) {
        this.snackbarServe = true;
        this.snackbarServeMsg = err.msg;
        this.snackbarServeColor = 'error';
      }
    },
    // 编辑时保存
    async confirmEditParam (params) {
      if (!params.listValue) {
        this.snackbarServe = true;
        this.snackbarServeMsg = '名单数据不能为空';
        this.snackbarServeColor = 'error';
        return;
      }
      try {
        const res = await dataService.updateNameListData(params);
        // 如果新保存的名单集和修改之前的不一样，则删除之前保存的名单集对应的引用记录,并添加新的引用记录
        if (this.delParam.listId && this.delParam.listId !== params.listId) {
          this.delRecord(this.delParam);
          let addRecordParam = {
            listId: params.listId,
            id: params.id
          };
          this.addRecord(addRecordParam);
        }
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '修改成功';
          this.snackbarServeColor = 'success';
          this.getNameListSetList();
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
    },
    // 点击-送审
    submitReviewSave (paramData) {
      this.saveParams = {}; // 每次重置为空
      this.editParams = {};
      let params = paramData;
      if (this.addOrEditHeader.isEdit === false) {
        this.spliceSaveParams(params);
        this.saveParams.action = 'check';
        this.confirmAddParm(this.saveParams);
      } else {
        this.spliceEditParams(params);
        this.editParams.action = 'check';
        this.editParams.id = this.currentEditId;
        this.confirmEditParam(this.editParams);
      }
      this.addOrEditDialog = false;
      params[1].reset(); // 重置表单
    },
    // 新增编辑弹窗的取消按钮
    cancel (form) {
      this.addOrEditDialog = false;
      form.reset();
    },
    // 编辑弹框中的 切换开关按钮
    onChange (e) {
      if (e === false) {
        this.addOrEditHeader = {
          name: '名单数据详情',
          value: 'edit',
          isEdit: true,
          needReview: false
        };
      } else if (e && this.delParam.checkResultName === '通过') {
        this.addOrEditHeader = {
          name: '名单数据编辑',
          value: 'edit',
          isEdit: true,
          needReview: false
        };
      } else {
        this.addOrEditHeader = {
          name: '名单数据编辑',
          value: 'edit',
          isEdit: true,
          needReview: true
        };
      }
    },
    async isStat (item) {
      let queryParam = {
        id: item.id,
        states: item.states ? 1 : 0
      };
      const res = await dataService.toggleSwitchStates(queryParam);
      if (res.data.code === 200) {
        this.snackbarServe = true;
        this.snackbarServeMsg = res.data.msg;
        this.snackbarServeColor = 'success';
      }
      this.getNameListSetList();
    },
    // 点击删除
    deleteNameListSet (item) {
      this.dialogDel = true;
      this.delParam = item; // 当前这一条名单数据
      this.delCurrentId = item.id;
      this.confirmDelFun = this.confirmDel;
    },
    async confirmDel () {
      try {
        const res = await dataService.deleteNameListData({ ids: this.delCurrentId });
        if (res.data.code === 200) {
          this.snackbarServe = true;
          this.snackbarServeMsg = '删除成功';
          this.snackbarServeColor = 'success';
          // this.delRecord(this.delParam); // 注释掉的是批量删除引用记录。这一块由后台接手去完成。
          this.getNameListSetList();
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
    }
  }
};
</script>
<style lang="stylus" scoped>
>>> .v-select.v-text-field--outlined:not(.v-text-field--single-line).v-input--dense .v-select__selections{
 height:40px!important;
 line-height:40px;
 padding:0;
}
>>> .v-select.v-text-field--outlined:not(.v-text-field--single-line).v-input--dense .v-select__selections span{
// width:130px;
overflow: hidden;
text-overflow:ellipsis!important;
white-space: nowrap;
}

</style>
