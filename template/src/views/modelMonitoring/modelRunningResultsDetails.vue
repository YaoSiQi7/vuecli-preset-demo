<!----------  @author: wangguodong  ----------->
<!----------  @updated_at: 2020-08-05  ----------->
<!----------  @version: wuxi-secondPhase  ----------->

<template>
<!-- 模型运行结果详情页 -->
  <div>
    <!-- 保存取消 -->
    <div class="mb-3" style="height: 60px;">
      <v-card :class="['mb-3',isFixed?'fixed':'']">
        <v-card-actions style="height:60px">
          <v-btn class="ml-4" color="primary" @click="backTopPage" outlined>返回</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-card>
      <v-card-text>
        <!-- <h3 style="padding-bottom: 10px;">结果结合列表</h3> -->
        <v-row>
          <v-col cols="4" class="py-0 pt-2 pb-2">
            <div>
              <span>应用名称：</span>
              <span>{{ headerFirstName }}</span>
            </div>
          </v-col>
          <v-col cols="4" class="py-0 pt-2 pb-2">
            <span>模型名称：</span>
            <span>{{ headerTwoName }}</span>
          </v-col>
          <v-col cols="4" class="py-0 pt-2 pb-2">
            <span>模型运行时间：</span>
            <span>{{ headerTime }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <span>
              团伙节点类型：
            </span>
            <v-select
              style="width: 200px; display: inline-block;"
              :menu-props="{ bottom: true }"
              v-model="nodeType"
              item-text="paramName"
              item-value="paramValue"
              :items="nodeTypeAry"
              @change="nodeTypeChange()"
              outlined
              dense
              no-data-text="没有匹配数据"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-row>
      <v-col cols='12' class="py-0 mt-3">
        <v-card class="elevation-3">
          <v-data-table
            :headers="constHeader"
            :items="constItem"
            :items-per-page="perPageNum"
            hide-default-footer
            no-results-text="没有匹配的数据"
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
                  :title="`${item.results_set}`"
                  class="el-border-defu"
                >
                  {{ item.results_set | changeResultMuster() }}
                </td>
                <td
                  :title="`${item.node_type}`"
                  class="el-border-defu"
                >
                  {{ item.node_type | gangNodeType(nodeTypeAry) }}
                </td>
                <td
                  :title="`${item.results_nums}`"
                  class="el-border-defu"
                >
                  {{ item.results_nums }}
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
import { mlModeRestList, nodeByAppAndModel } from '../../api/modelRunningResults.js';
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'caseReport',
  components: {
    // BaseSearch,
    DelDialog
  },
  data: () => ({
    isFixed: false,
    // form表单
    confirmDelFun: '',
    fullHeight: window.innerHeight,
    counter: 0, // 搜索条件是否展开
    // 列表
    constHeader: [
      { text: '结果集合', value: 'results_set', sortable: false },
      { text: '团伙节点类型', value: 'node_type', sortable: false, width: '150' },
      { text: '实体总数', value: 'results_nums', sortable: false, width: '100' },
      { text: '操作', value: 'action', sortable: false, width: '60' }
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
    headerFirstName: '', // 应用名称
    headerTwoName: '', // 模型名称
    headerTime: '', // 模型运行时间
    nodeTypeAry: [], // 团队节点类型数组
    nodeType: '', // 团队节点类型
    routerParams: null
  }),
  computed: {
    tableHeight: {
      set: function (newValue) {
        this.fullHeight = newValue;
      },
      get: function () {
        return this.fullHeight - 360;
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
    appId: {
      handler: function (newVal, oldVal) {
        if (oldVal) {
          this.$route.params.pageNum = 1;
          if (this.$route.params.idClass === 0) {
            this.$route.params.firstParams = this.$route.params;
            sessionStorage.setItem('ModelRunningResultsParams', null);
            this.$router.push({
              path: '/modelRunningResults',
              name: 'modelRunningResults',
              params: this.$route.params
            });
          } else if (this.$route.params.idClass === 2) {
            sessionStorage.setItem('ModelRunningResultsParams', null);
            this.$router.push({
              path: '/modelRunningResults',
              name: 'modelRunningResults',
              params: this.$route.params
            });
          }
        }
      },
      immediate: true
    }
  },
  // 展示中英文转化
  filters: {
    gangNodeType: function (str, itemList) {
      let dataTypeText;
      itemList.forEach(items => {
        if (items.paramValue === str) {
          dataTypeText = items.paramName;
        }
      });
      return dataTypeText;
    },
    changeResultMuster: function (strings) {
      let stringsActive;
      stringsActive = strings.replace(/,/g, ', ');
      return stringsActive;
    }
  },
  created () {},
  mounted () {
    window.addEventListener('scroll', this.fixedBtnBox);
    if (Object.keys(this.$route.params).length !== 0) {
      if (this.$route.params.idClass === 0) {
        this.headerFirstName = this.$route.params.appName;
        this.headerTwoName = this.$route.params.modelName;
        this.headerTime = this.$route.params.modelTime;
        this.nodeType = '';
      } else if (this.$route.params.idClass === 2) {
        this.headerFirstName = this.$route.params.firstParams.appName;
        this.headerTwoName = this.$route.params.firstParams.modelName;
        this.headerTime = this.$route.params.firstParams.modelTime;
        this.nodeType = this.$route.params.nodeType;
        this.pageNum = this.$route.params.pageNum;
        this.perPageNum = this.$route.params.perPageNum;
      }
    } else {
      Object.assign(this.$route.params, JSON.parse(sessionStorage.getItem('ModelRunningResultsParams')));
      if (this.$route.params.idClass === 0) {
        this.headerFirstName = this.$route.params.appName;
        this.headerTwoName = this.$route.params.modelName;
        this.headerTime = this.$route.params.modelTime;
        this.nodeType = '';
      } else if (this.$route.params.idClass === 2) {
        this.headerFirstName = this.$route.params.firstParams.appName;
        this.headerTwoName = this.$route.params.firstParams.modelName;
        this.headerTime = this.$route.params.firstParams.modelTime;
        this.nodeType = this.$route.params.nodeType;
        this.pageNum = this.$route.params.pageNum;
        this.perPageNum = this.$route.params.perPageNum;
      }
    }
    window.addEventListener('resize', this.onWindowResize);
    // 获取团队节点类型
    this.nodeByAppAndModel();
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
  },
  methods: {
    // 头部fixed定位
    fixedBtnBox () {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 72) { // 当页面滚动到高度72px处，动态绑定class 来设置头部固定定位
        this.isFixed = true;
      } else {
        this.isFixed = false;
      }
    },
    backTopPage () {
      if (this.$route.params.idClass === 0) {
        this.$route.params.firstParams = this.$route.params;
        sessionStorage.setItem('ModelRunningResultsParams', null);
        this.$router.push({
          path: '/modelRunningResults',
          name: 'modelRunningResults',
          params: this.$route.params
        });
      } else if (this.$route.params.idClass === 2) {
        sessionStorage.setItem('ModelRunningResultsParams', null);
        this.$router.push({
          path: '/modelRunningResults',
          name: 'modelRunningResults',
          params: this.$route.params
        });
      }
    },
    panelCounter () {
      this.counter += 1;
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    seeDetails (item, index) {
      let nodeTypeCNName = '';
      let params = {};
      this.nodeTypeAry.forEach(items => {
        if (items.paramValue === item.node_type) {
          nodeTypeCNName = items.paramName;
        }
      });
      if (this.$route.params.idClass === 0) {
        params = {
          firstParams: this.$route.params,
          resultSet: item.results_set, // 结果集合
          entityNumber: item.results_nums, // 实体总数
          node_type: item.node_type, // 团伙类型-英文名称
          nodeTypeCNName: nodeTypeCNName, // 团伙类型-中文名称
          create_time: item.create_time, // 创建时间
          id: item.model_instance_id, // 模型实例ID
          appId: this.$route.params.appId, // 应用id
          appName: this.$route.params.appName, // 应用名称
          modelName: this.$route.params.modelName, // 模型名称
          modelTime: this.$route.params.modelTime, // 模型运行时间
          nodeType: this.nodeType,
          pageNum: this.pageNum,
          perPageNum: this.perPageNum,
          idClass: 1,
          endTime: item.endTime,
          startTime: item.startTime
        };
      } else if (this.$route.params.idClass === 2) {
        params = {
          firstParams: this.$route.params.firstParams,
          resultSet: item.results_set, // 结果集合
          entityNumber: item.results_nums, // 实体总数
          node_type: item.node_type, // 团伙类型-英文名称
          nodeTypeCNName: nodeTypeCNName, // 团伙类型-中文名称
          create_time: item.create_time, // 创建时间
          id: item.model_instance_id, // 模型实例ID
          appId: this.$route.params.appId, // 应用id
          appName: this.$route.params.appName, // 应用名称
          modelName: this.$route.params.modelName, // 模型名称
          modelTime: this.$route.params.modelTime, // 模型运行时间
          nodeType: this.nodeType,
          pageNum: this.pageNum,
          perPageNum: this.perPageNum,
          idClass: 1,
          endTime: item.endTime,
          startTime: item.startTime
        };
      }
      sessionStorage.setItem('ModelRunningResultsDetailsParams', JSON.stringify(params));
      this.$router.push(
        {
          name: 'modelRunningResultsDetailsInfo',
          params: params
        }
      );
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
    // 团队节点类型 change事件
    nodeTypeChange () {
      this.page = 1;
      this.pageSize = 10;
      this.getDataList();
    },
    // 获取团队节点类型
    async nodeByAppAndModel () {
      let params = {
        appName: this.headerFirstName,
        modelName: this.headerTwoName
      };
      const res = await nodeByAppAndModel(params);
      if (res.data.code === 200) {
        this.nodeTypeAry = res.data.data;
        this.nodeTypeAry.unshift(
          {
            paramValue: '',
            paramName: '全部'
          }
        );
        this.getDataList();
      }
    },
    // 查询列表
    async getDataList () {
      this.loading = true;
      let params = {};
      if (this.$route.params.idClass === 0) {
        params = {
          appId: this.appId,
          nodeType: this.nodeType,
          page: this.pageNum,
          pageSize: this.perPageNum,
          modelInstanceId: this.$route.params.modelInstanceId
        };
      } else if (this.$route.params.idClass === 2) {
        params = {
          appId: this.appId,
          nodeType: this.nodeType,
          page: this.pageNum,
          pageSize: this.perPageNum,
          modelInstanceId: this.$route.params.firstParams.modelInstanceId
        };
      }
      try {
        const res = await mlModeRestList(params);
        if (res.data.code === 200) {
          this.constItem = res.data.data.paramsList;
          this.totalItems = res.data.data.total;
          this.queryPageLength = res.data.data.totalPages;
          this.loading = false;
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
  .fixed {
    position: fixed;
    width: auto;
    top: 0;
    left: 240px;
    right: 12px;
    z-index: 9;
    border-bottom: 1px solid #ededed;
  }
  .icon-primary{
    color: var(--v-primary-base) !important;
  }
  .el-border-defu {
    text-align: left;
  }
  .el-tr-defu:hover {
    background: var(--v-tableRowHoverActive-base);
  }
</style>
