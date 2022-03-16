<!----------  @author: wangguodong  ----------->
<!----------  @updated_at: 2020-08-05  ----------->
<!----------  @version: wuxi-secondPhase  ----------->

<template>
<!-- 模型运行结果 -->
  <div>
    <base-search
      :fieldList="searchForm"
      @search="search($event)"
      @reset="resetSearchData($event)"
      :clearDate="clearDate"
      @change="panelCounter"
    ></base-search>
    <v-row>
      <v-col cols='12' class="py-0 mt-3">
        <v-card class="elevation-3">
          <v-data-table
            :headers="constHeader"
            :items="constItem"
            :items-per-page="perPageNum"
            hide-default-footer
            :loading="loading"
            loading-text="加载数据中..."
            :height="tableHeight"
          >
            <!-- 列表头 -->
            <!-- <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title style="font-size:18px">
                  应用管理数据
                </v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer></v-spacer>
                <v-card-title>
                  <v-btn
                    color="primary"
                    @click="addParms()"
                  >
                    添加
                  </v-btn>
                </v-card-title>
              </v-toolbar>
            </template> -->
            <!-- 列表项 -->
            <template v-if="constItem.length > 0" v-slot:body="{ items }">
              <tr
                v-for="(item, index) in items"
                :key="index"
                class="el-tr-defu"
              >
                <td
                  :title="`${item.appName}`"
                  class="el-border-defu"
                >
                  {{ item.appName }}
                </td>
                <td
                  :title="`${item.modelName}`"
                  class="el-border-defu"
                >
                  {{ item.modelName }}
                </td>
                <td
                  :title="`${item.runTime}`"
                  class="el-border-defu"
                >
                  {{ item.runTime }}
                </td>
                <td class="el-border-defu">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        small
                        class="mr-1 icon-primary"
                        v-on="on"
                        color="primary"
                        @click="seeDetails(item, index)"
                      >
                        mdi-card-account-details
                      </v-icon>
                    </template>
                    <span>查看详情</span>
                  </v-tooltip>
                </td>
              </tr>
            </template>
            <template v-slot:no-data>
              <div>没有数据</div>
            </template>
            <!-- <template v-slot:footer v-if="queryPageLength > 1"> -->
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
    <del-dialog :isDialogShow='dialogDel' @cancelDel='dialogDel = false' @confimDel='confirmDelFun'></del-dialog>
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
import BaseSearch from '@c/BaseSearch';
import DelDialog from '@/components/DelDialog';
// import * as dataService from 'api/modelRunningResults.js';
import { mlModelList, modelByApp } from '../../api/modelRunningResults.js';
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'caseReport',
  components: {
    BaseSearch,
    DelDialog
  },
  filters: {
    appNameFilters: function (str, itemList) {
      let text = '';
      itemList.forEach(item => {
        if (str === item.id) {
          text = item.appName;
        }
      });
      return text;
    }
  },
  data: () => ({
    // form表单
    clearDate: false,
    confirmDelFun: '',
    fullHeight: window.innerHeight,
    counter: 0, // 搜索条件是否展开
    searchForm: [
      {
        placeholder: '模型名称',
        value: '',
        type: 'select',
        options: []
      },
      {
        placeholder: '模型运行时间',
        value: [],
        type: 'date'
      }
    ],
    // 列表
    constHeader: [
      { text: '应用名称', value: 'appId', sortable: false },
      { text: '模型名称', value: 'modelName', sortable: false },
      { text: '模型运行时间', value: 'runTime', sortable: false },
      { text: '操作', value: 'action', sortable: false, width: '10%' }
    ],
    constItem: [],
    // 表格加载数据动画
    loading: false,
    // 分页变量
    pageNum: 1,
    pageSize: 10,
    queryPageLength: 0,
    perPageNum: 10,
    totalItems: 0,
    perPageItems: [5, 10, 15, 20, 50, 100],
    dialogDel: false,
    // 提示弹框参数
    timeout: 2000,
    isSnackbarTop: true,
    snackbarServe: false,
    snackbarServeMsg: '',
    snackbarServeColor: '',
    appData: [],
    appNameId: '',
    dateTimeReset: false
  }),
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 204;
      }
    },
    ...mapGetters([
      'appId'
    ])
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
    appId (val) {
      this.pageNum = 1;
      this.constItem = [];
      this.totalItems = 0;
      this.queryPageLength = 0;
      this.dateTimeReset = true;
      this.getAppName();
    }
  },
  created () {
    this.getAppName();
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    // 应用名称change事件
    async onHandleChange (data) {
      try {
        let params = {
          appId: this.appNameId
        };
        const res = await modelByApp(params);
        if (res.data.code === 200) {
          if (res.data.data.length > 0) {
            res.data.data.forEach(item => {
              item.text = item.modelName;
              item.value = item.modelName;
            });
          }
          res.data.data.unshift(
            { text: '全部', value: '' }
          );
          this.searchForm[0].options = res.data.data;
        } else {
          this.snackbarServe = true;
          this.snackbarServeMsg = res.data.msg;
          this.snackbarServeColor = 'error';
        }
      } catch (err) {}
    },
    // 获取应用名称和模型名称
    async getAppName () {
      this.appData = JSON.parse(sessionStorage.getItem('vuexAppList'));
      // this.searchForm[0].options = this.appData;
      // this.searchForm[0].options.forEach((item, index, ary) => {
      //   item.text = item.appName;
      //   item.value = item.id;
      // });
      // this.searchForm[0].options.unshift({ text: '全部', value: '' });
      this.appNameId = JSON.parse(sessionStorage.getItem('appName')).id;
      if (Object.keys(this.$route.params).length !== 0 && Object.keys(this.$route.params.firstParams).length !== 0) {
        this.pageNum = this.$route.params.firstParams.pageNum;
        this.perPageNum = this.$route.params.firstParams.perPageNum;
        // this.searchForm[0].value = this.$route.params.firstParams.searchForm[0].value;
        // this.searchForm[0].value = this.$route.params.firstParams.searchForm[1].value;
        this.searchForm = this.$route.params.firstParams.searchForm;
        this.getDataList();
      } else {
        try {
          let params = {
            appId: this.appNameId
          };
          let modelName = [];
          const res = await modelByApp(params);
          if (res.data.code === 200) {
            if (res.data.data.length > 0) {
              res.data.data.forEach(item => {
                item.text = item.modelName;
                item.value = item.modelName;
              });
            }
            res.data.data.unshift(
              { text: '全部', value: '' }
            );
            if (this.dateTimeReset) {
              this.clearDate = !this.clearDate;
              this.searchForm[0].value = '';
              this.searchForm[1].value = [];
            };
            this.dateTimeReset = false;
            this.searchForm[0].options = [];
            this.searchForm[0].options = res.data.data;
            this.getDataList();
          } else {
            this.snackbarServe = true;
            this.snackbarServeMsg = res.data.msg;
            this.snackbarServeColor = 'error';
          }
        } catch (err) {}
      }
    },
    // 点击搜索按钮
    search ($event) {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 查看详情按钮
    seeDetails (item, index) {
      let params = {
        appId: item.appId,
        appName: item.appName,
        modelName: item.modelName,
        modelTime: item.runTime,
        modelInstanceId: item.modelInstanceId,
        searchForm: this.searchForm,
        pageNum: this.pageNum,
        perPageNum: this.perPageNum,
        idClass: 0
      };
      sessionStorage.setItem('ModelRunningResultsParams', JSON.stringify(params));
      this.$router.push(
        {
          name: 'modelRunningResultsDetails',
          params: params
        }
      );
    },
    // 重置查询条件
    resetSearchData ($event) {
      this.clearDate = !this.clearDate;
      this.searchForm[0].value = '';
      this.searchForm[1].value = [];
      this.$nextTick(() => {
        this.searchForm[0].value = '';
      });
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 切换页码
    onPageChange (page) {
      this.pageNum = page;
      this.getDataList();
    },
    // 切换每页显示几条数据
    pageChange () {
      this.pageNum = 1; // 默认从第一页开始查询
      this.getDataList();
    },
    // 查询列表
    async getDataList () {
      let dataTime = [];
      let pageParams = {};
      this.loading = true;
      if (this.searchForm[1].value && this.searchForm[1].value.length > 0) {
        dataTime = this.searchForm[1].value.split(' 至 ');
        pageParams = {
          begainTime: dataTime[0] + ' 00:00:00',
          endTime: dataTime[1] + ' 23:59:59',
          appId: this.appNameId,
          modelName: this.searchForm[0].value,
          page: this.pageNum,
          pageSize: this.perPageNum
        };
      } else {
        pageParams = {
          begainTime: '',
          endTime: '',
          appId: this.appNameId,
          modelName: this.searchForm[0].value ? this.searchForm[0].value : '',
          page: this.pageNum,
          pageSize: this.perPageNum
        };
      }
      try {
        const res = await mlModelList(pageParams);
        if (res.data.code === 200) {
          this.$nextTick(() => {
            res.data.data.paramsList.forEach(item => {
              this.appData.forEach(im => {
                if (item.appId === im.id) {
                  item.appName = im.appName;
                }
              });
            });
            this.constItem = res.data.data.paramsList;
            this.totalItems = res.data.data.total;
            this.queryPageLength = res.data.data.totalPages;
            this.loading = false;
          });
        } else {
          this.constItem = [];
          this.totalItems = 0;
          this.queryPageLength = 0;
          this.loading = false;
        }
      } catch (err) {
        console.log(err);
      };
    }
  }
};
</script>
<style lang="stylus" scoped>
.el-border-defu {
  text-align: left;
  // cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
