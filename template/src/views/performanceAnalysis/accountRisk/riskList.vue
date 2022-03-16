<!----------  @author: RenGuoPeng  ----------->
<!----------  @updated_at: 2021-05-25  ----------->
<!----------  @version: 2.0  ----------->
<template>
  <div class="enu-content fill-height">
    <!-- 搜索表单 -->
    <v-expansion-panels v-model="panel" class="my-0 py-0 elevation-3">
      <v-expansion-panel @change="change">
        <v-expansion-panel-header class="pl-3 my-0">
          <div>查询条件</div>
        </v-expansion-panel-header>
        <!-- 条件查询form -->
        <v-expansion-panel-content>
          <slot>
            <v-form ref="searchForm" lazy-validation :key="newDate">
              <v-container grid-list-xl class="ma-0 pa-0">
                <v-row class="ma-0 py-0">
                  <v-col
                    v-for="(item, index) in searchParam"
                    :key="index"
                    cols="12"
                    sm="12"
                    md="2"
                    xl="2"
                  >
                    <v-row class="ma-0 py-0">
                      <v-text-field
                        v-if="item.type === 'daterange'"
                        :placeholder="item.placeholder"
                        outlined
                        dense
                        v-model="dateRangeText"
                        append-icon="event"
                        @click="dateInputClick"
                        ></v-text-field>
                      <v-text-field
                        v-if="item.type === 'daterangs'"
                        :placeholder="item.placeholder"
                        outlined
                        dense
                        v-model="dateRangeDate"
                        append-icon="event"
                        @click="dateInClick"
                        ></v-text-field>
                      <v-select
                        v-if="item.type === 'select'"
                        v-model="item.value"
                        :placeholder="item.placeholder"
                        :items="item.options"
                        :key="newDate"
                        item-text="text"
                        item-value="value"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        class="pt-0 pb-0"
                        background-color="white"
                      ></v-select>
                      <v-text-field
                        v-if="item.type === 'text'"
                        v-model.trim="item.value"
                        :placeholder="item.placeholder"
                        :required="item.required"
                        :type="item.text"
                        outlined
                        dense
                        class="py-0"
                      />
                    </v-row>
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
                      @click="searchQuery()"
                    >
                      查询
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="2"
                    xl="2"
                  >
                    <v-dialog v-model="isdateShow" width="321">
                      <v-date-picker selected-items-text="已选择日期" v-model="dates" range  @change="changeDate"></v-date-picker>
                    </v-dialog>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="12"
                    md="2"
                    xl="2"
                  >
                    <v-dialog v-model="isdatesShow" width="321">
                      <v-date-picker selected-items-text="已选择日期" v-model="datey" range  @change="updateChange"></v-date-picker>
                    </v-dialog>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </slot>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- table -->
    <v-data-table
      ref="nameListDataTable"
      :headers="listDataHeaders"
      :items="listsData.list"
      :items-per-page="pageSize"
      hide-default-footer
      :height="tableHeight"
      class="elevation-3 mt-3"
      item-key="id"
    >

      <template v-slot:top>
        <v-toolbar flat height="60px">
          <v-spacer />
          <v-btn color="primary" class="mr-2 mt-1" @click="batchQuery()">批量查询</v-btn>
          <v-btn color="primary" class="mr-1 mt-1" @click="exportQuery()">导出</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }" v-if="listsData.list.length > 0">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon
              small
              class="mr-3 icon-primary"
              v-on="on"
              color="primary"
              @click="editNameListSet(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
          <span>编辑</span>
        </v-tooltip>
      </template>
      <template v-slot:no-data>没有数据</template>

      <template v-slot:footer>
        <v-divider></v-divider>
        <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
          <div class="footer__select">
            每页
            <span style="width: 60px">
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
            <span style="margin-left: 15px"
              >共{{ listsData.total }}条</span
            >
            <v-spacer />
            <v-pagination
              class="d-flex justify-end pagination"
              v-model="listsData.pageNum"
              :length="listsData.pages"
              :total-visible="7"
              @input="onPageChange"
            />
          </div>
        </div>
      </template>
    </v-data-table>
    <!-- 导入表格 -->
    <v-dialog
      v-model="uploadDialog"
      persistent
      scrollable
      max-width="460px">
      <v-card height="310px">
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
            :lazy-validation="uploadLazy"
            v-model="uploadFormValid">
            <v-row style="margin-top:20px;">
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-select
                  label="选择匹配字段："
                  required
                  :rules="[v => !!v || '匹配字段不能为空']"
                  v-model="repeatForm.tradeType"
                  :items="originTradeTypeItems"
                  item-text="text"
                  item-value="value"
                  outlined
                  dense
                  no-data-text="没有匹配数据"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1"></v-col>
              <v-col cols="10">
                <v-file-input
                  v-model="repeatForm.fileInfo"
                  required
                  :rules="[v => !!v || '请选择文件']"
                  show-size
                  accept=".xlsx"
                  :disabled="uploadIsLoading"
                  :loading="uploadIsLoading"
                  prepend-icon=""
                  outlined
                  dense
                  label="点击选择文件，文件后缀为: .xlsx">
                </v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <div class="flex-grow-1" />
          <div>
            <v-btn
              class="primary mr-2"
              outlined
              style="color:white"
              @click="downloadTemp">下载模板
            </v-btn>
            <v-btn
              class="primary mr-2"
              style="margin-right:10px;color:white"
              @click="downloadQuery"
              :disabled="!uploadFormValid"
              >批量查询
            </v-btn>
            <v-btn
              class="primary mr-2"
              style="margin-right:10px;color:white"
              @click="exportData"
              :disabled="!uploadFormValid"
            >
              导出查询结果
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbarServe"
      :timeout="timeout"
      :color="snackbarServeColor"
      :top="isSnackbarTop"
    >
      {{ snackbarServeMsg }}
    </v-snackbar>
    <!-- -- -->
  </div>
</template>
<script>
import { queryList, querysList, exportTemplate, exportQueryList, exportList } from 'api/accountRisk.js';
import moment from 'moment';
export default {
  name: 'BaseSearchList',
  data () {
    return {
      panel: 1,
      counter: 0,
      newDate: null,
      // 搜索组件数据
      searchParam: [
        {
          type: 'daterange',
          placeholder: '风险评分时间',
          value: []
        },
        { type: 'text', placeholder: '姓名', value: '' },
        { type: 'text', placeholder: '客户号', value: '' },
        { type: 'text', placeholder: '证件号', value: '' },
        {
          type: 'daterangs',
          placeholder: '最早开户日期',
          value: []
        },
        { type: 'text', placeholder: '业务归属机构', value: '' },
        {
          type: 'select',
          placeholder: '请选择风险评级',
          value: '',
          options: [
            { text: '低风险', value: '低风险' },
            { text: '中风险', value: '中风险' },
            { text: '高风险', value: '高风险' }
          ]
        }
      ],
      dates: [],
      datey: [],
      searchData: {
        riskScoreStartTime: '',
        riskScoreEndTime: '',
        customerName: '',
        customerNo: '',
        idNo: '',
        earliestOpenStartTime: '',
        earliestOpenEndTime: '',
        organ: '',
        riskLevel: ''
      },
      // table列表表头
      listDataHeaders: [
        { text: '客户号', value: 'customerNo', sortable: false, width: 100 },
        { text: '姓名', value: 'customerName', sortable: false, width: 100 },
        { text: '证件号', value: 'idNo', sortable: false, width: 100 },
        {
          text: '账户数',
          value: 'accountNum',
          sortable: false,
          width: 100
        },
        {
          text: '最早开户日期',
          value: 'earliestOpenTime',
          sortable: false,
          width: 110
        },
        { text: '业务归属机构', value: 'organ', sortable: false, width: 110 },
        { text: '风险评级', value: 'riskLevel', sortable: false, width: 100 },
        { text: '风险分数', value: 'score', sortable: false, width: 100 },
        { text: '风险评分时间', value: 'riskScoreTime', sortable: false, width: 110 },
        { text: '风险监控时间范围', value: 'riskTimeRange', sortable: false, width: 130 },
        { text: '操作', value: 'action', sortable: false, width: 100 }
      ],
      listsData: {
        list: []
      },
      // table数据
      isdateShow: false,
      isdatesShow: false,
      // 分页变量
      perPageItems: [5, 10, 15, 20],
      fullHeight: window.innerHeight,
      pageIndex: 1,
      pageSize: 10,
      // 导入导出
      uploadDialog: false,
      uploadFormValid: true,
      uploadLazy: false,
      uploadIsLoading: false,
      // 文件选择
      repeatForm: {
        tradeType: '',
        fileInfo: null
      },
      originTradeTypeItems: [
        { text: '证件号', value: '证件号' }
      ],
      isSnackbarTop: true,
      timeout: 2000,
      // 提示语
      snackbarServe: false,
      snackbarServeMsg: '',
      snackbarServeColor: '' // success', 'info', 'error' 三种类型
    };
  },
  watch: {
    counter: function (newValue, oldValue) {
      if (this.counter % 2 === 1) {
        // 开
        this.tableHeight = window.innerHeight - 142;
      } else {
        // 关
        this.tableHeight = window.innerHeight;
      }
    }
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
    //     Promise.all([
    //       this.getlistTypeItems(),
    //       this.queryAllListType(),
    //       this.queryAllDataSource(),
    //       this.queryReviewResult(),
    //       this.getNameListSetList()
    //     ]);
  },
  created () {
    // 获取分页相关缓存
    let sessionS = window.sessionStorage;
    this.pageSize = sessionS.getItem('pageSize') ? parseInt(sessionS.getItem('pageSize')) : 10;
    this.pageIndex = sessionS.getItem('pageIndex') ? parseInt(sessionS.getItem('pageIndex')) : 1;
    this.getNameListSetList();
    console.log(this.pageSize, this.pageIndex, '000');
  },
  // 离开规则集页面 可以访问到组件实例this
  beforeRouteLeave (to, from, next) {
    // 如果跳转的页面是规则集详情的页面 搜索条件有值 缓存
    // let searchParamsForSession = {};
    // this.searchParam.forEach(item => {
    //   searchParamsForSession[item.placeholder] = item.value || '';
    // });
    if (to.name === 'accountRiskDetail') {
      // window.sessionStorage.setItem('searchParam', JSON.stringify(Object.values(searchParamsForSession)));
      window.sessionStorage.setItem('pageSize', this.pageSize);
      window.sessionStorage.setItem('pageIndex', this.pageIndex);
    } else {
      // window.sessionStorage.setItem('searchParam', '');
      window.sessionStorage.setItem('pageSize', 10);
      window.sessionStorage.setItem('pageIndex', 1);
    }
    next();
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  computed: {
    // 风险评分时间
    dateRangeText: {
      get () {
        if (moment(this.dates[0]).valueOf() < moment(this.dates[1]).valueOf()) {
        } else if (moment(this.dates[0]).valueOf() > moment(this.dates[1]).valueOf()) {
          this.reverseArry(this.dates);
        }
        return this.dates.join(',');
      },
      set (newVal) {}
    },
    // 开户时间
    dateRangeDate: {
      get () {
        if (moment(this.datey[0]).valueOf() < moment(this.datey[1]).valueOf()) {
        } else if (moment(this.datey[0]).valueOf() > moment(this.datey[1]).valueOf()) {
          this.reverseArry(this.datey);
        }
        return this.datey.join(',');
      },
      set (newVal) {}
    },
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
    // 翻转数组
    reverseArry (array) {
      for (var i = 0; i < array.length / 2; i++) {
        var temp = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - 1 - i] = temp;
      }
      return array; // Array对象中的方法返回了一个数组。
    },
    change () {
      this.counter += 1;
    },
    // 创建时间输入框的点击事件
    dateInputClick () {
      this.isdateShow = true;
      console.log(this.isdateShow, 'this.isdateShow');
    },
    // 最早开会时间点击事件
    dateInClick () {
      this.isdatesShow = true;
    },
    // 风险评分时间
    changeDate () {
      if (this.dates.length === 2) {
        this.isdateShow = false;
      }
    },
    updateChange () {
      if (this.datey.length === 2) {
        this.isdatesShow = false;
      }
    },
    // 查询
    searchQuery () {
      let riskScoreStartTime = this.dates[0] ? this.dates[0] + ' 00:00:00' : '';
      let riskScoreEndTime = this.dates[1] ? this.dates[1] + ' 23:59:59' : '';
      let earliestOpenStartTime = this.datey[0] ? this.datey[0] + ' 00:00:00' : '';
      let earliestOpenEndTime = this.datey[1] ? this.datey[1] + ' 23:59:59' : '';
      this.searchData = {
        riskScoreStartTime: riskScoreStartTime,
        riskScoreEndTime: riskScoreEndTime,
        customerName: this.searchParam[1].value,
        customerNo: this.searchParam[2].value,
        idNo: this.searchParam[3].value,
        earliestOpenStartTime: earliestOpenStartTime,
        earliestOpenEndTime: earliestOpenEndTime,
        organ: this.searchParam[5].value,
        riskLevel: this.searchParam[6].value
      };
      this.getNameListSetList();
      this.newDate = new Date().getTime();
    },
    // 重置
    reset () {
      this.dates = [];
      this.searchParam[1].value = '';
      this.searchParam[2].value = '';
      this.searchParam[3].value = '';
      this.datey = [];
      this.searchParam[5].value = '';
      this.searchParam[6].value = '';
      this.pageIndex = 1;
      this.pageSize = 10;
      if (this.$refs.searchForm) {
        this.searchData = {};
        this.$refs.searchForm.reset();
      }
      this.getNameListSetList();
      this.newDate = new Date().getTime();
    },
    // 风险日期的转换
    riskdatesChange (dat) {
      var date = new Date(dat);
      var YY = date.getFullYear() + '-';
      var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return YY + MM + DD + ' ' + hh + mm + ss;
    },
    // 日期的转换
    dateChange (dateStr) {
      var date = new Date(dateStr);
      var Month = date.getMonth() + 1;
      var Day = date.getDate();
      var Y = date.getFullYear() + '-';
      var M = Month < 10 ? '0' + Month + '-' : Month + '-';
      var D = Day < 10 ? '0' + Day : Day;
      return Y + M + D;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 获取列表数据
    async getNameListSetList () {
      let pageParams = {
        curPage: this.pageIndex,
        pageSize: this.pageSize
      };
      let searchParam = JSON.parse(JSON.stringify(this.searchData));
      let params = Object.assign({}, pageParams, searchParam);
      try {
        const res = await queryList(params);
        if (res.data.code === 200) {
          this.listsData = res.data.data;
        }
      } catch (err) {}
    },
    pageChange ($event) {
      this.pageIndex = 1;
      this.pageSize = $event;
      this.getNameListSetList();
    },
    onPageChange ($event) {
      this.pageIndex = $event;
      this.getNameListSetList();
    },
    // 下载模板
    downloadTemp () {
      exportTemplate().then(response => {
        // 获取后台返回文件名称
        const files = response.headers['content-disposition'].match(
          /filename=(.*)/
        )[1].split('.')[0];
        const fileNameEncode = decodeURI(files);
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = fileNameEncode + '.xlsx';
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }).catch(err => {
        this.message(err.msg, 'error');
      });
    },
    // 编辑
    editNameListSet (item) {
      this.$router.push({
        name: 'accountRiskDetail'
      });
      window.sessionStorage.setItem('tabsQuery', JSON.stringify(item));
      window.sessionStorage.setItem('tabsName', '账户风险监控');
    },
    // 批量查询
    batchQuery () {
      this.uploadDialog = true;
    },
    // 导出
    exportQuery () {
      let riskScoreStartTime = this.dates[0] ? this.dates[0] + ' 00:00:00' : '';
      let riskScoreEndTime = this.dates[1] ? this.dates[1] + ' 23:59:59' : '';
      let earliestOpenStartTime = this.datey[0] ? this.datey[0] + ' 00:00:00' : '';
      let earliestOpenEndTime = this.datey[1] ? this.datey[1] + ' 23:59:59' : '';
      let customerName = '';
      let customerNo = '';
      let idNo = '';
      let organ = '';
      let riskLevel = '';
      customerName = this.searchParam[1].value;
      customerNo = this.searchParam[2].value;
      idNo = this.searchParam[3].value;
      organ = this.searchParam[5].value;
      riskLevel = this.searchParam[6].value;
      this.searchData = {
        riskScoreStartTime: riskScoreStartTime,
        riskScoreEndTime: riskScoreEndTime,
        customerName: customerName,
        customerNo: customerNo,
        idNo: idNo,
        earliestOpenStartTime: earliestOpenStartTime,
        earliestOpenEndTime: earliestOpenEndTime,
        organ: organ,
        riskLevel: riskLevel
      };
      const params = Object.assign({}, this.searchData);
      exportQueryList(params).then(response => {
        // 获取后台返回文件名称
        const files = response.headers['content-disposition'].match(
          /filename=(.*)/
        )[1].split('.')[0];
        const fileNameEncode = decodeURI(files);
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = fileNameEncode + '.xlsx';
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
    // 取消导入弹窗
    cancelUpload () {
      this.$refs.uploadFileForm.reset();
      this.uploadDialog = false;
      this.uploadIsLoading = false;
    },
    // 批量查询按钮
    async downloadQuery () {
      if (this.$refs.uploadFileForm.validate()) {
        this.uploadIsLoading = true;
        let formData = new FormData();
        // 把文件信息放入对象中
        formData.append('file', this.repeatForm.fileInfo);
        formData.append('batchField', this.repeatForm.tradeType);
        try {
          const res = await querysList(formData);
          if (res.data.code === 200) {
            this.message('查询成功', 'success');
            this.uploadDialog = false;
            this.uploadIsLoading = false;
            this.listsData = res.data.data;
            this.$refs.uploadFileForm.reset();
          }
        } catch (err) {
          this.message(err.msg, 'error');
        }
      }
    },
    // 导出查询结果
    exportData () {
      let formData = new FormData();
      // 把文件信息放入对象中
      formData.append('file', this.repeatForm.fileInfo);
      formData.append('batchField', this.repeatForm.tradeType);
      exportList(formData).then(response => {
        // 获取后台返回文件名称
        const files = response.headers['content-disposition'].match(
          /filename=(.*)/
        )[1].split('.')[0];
        const fileNameEncode = decodeURI(files);
        console.log(response, 'response', fileNameEncode);
        let blob = new Blob([response.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = fileNameEncode + '.xlsx';
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
    // 提示语状态
    message (str, theme) {
      this.snackbarServe = true;
      this.snackbarServeMsg = str;
      this.snackbarServeColor = theme || 'error';
    }
  }
};
</script>
<style lang="stylus" scoped>
.isEditDropdown >>> .v-select__slot .v-input__append-inner {
  display: none !important;
}

.el-border-defu {
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.c-btn {
  text-align: left;
  padding-bottom: 20px;
}

.icon-primary {
  color: var(--v-primary-base) !important;
}

.el-tr-defu:hover {
  background: var(--v-tableRowHoverActive-base);
}
</style>
