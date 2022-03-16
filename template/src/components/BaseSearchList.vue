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
                    v-for="(items, index) in fieldList"
                    :key="index"
                    cols="12"
                    sm="12"
                    md="2"
                    xl="2"
                  >
                    <v-row class="ma-0 py-0">
                      <DatePicker
                        v-if="items.type === 'daterange'"
                        type="daterange"
                        v-model="items.value"
                        :options="items.options"
                        placement="top-start"
                        :placeholder="items.placeholder"
                        style="width: 100%"
                        id="data-picker"
                      ></DatePicker>
                      <v-select
                        v-if="items.type === 'select'"
                        v-model="items.value"
                        :placeholder="items.placeholder"
                        :items="items.options"
                        :key="newDate"
                        item-text="groupName"
                        item-value="groupId"
                        outlined
                        dense
                        no-data-text="没有匹配数据"
                        class="pt-0 pb-0"
                        background-color="white"
                        @change="groupSelectChange(searchForm.auditGroup)"
                      ></v-select>
                      <v-text-field
                        v-if="items.type === 'text'"
                        v-model.trim="items.value"
                        :placeholder="items.placeholder"
                        :required="items.required"
                        :type="items.text"
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
                      @click="search"
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
    <!-- table -->
    <v-data-table
      ref="nameListDataTable"
      :headers="listDataHeaders"
      :items="listsData.list"
      :items-per-page="perPageNum"
      hide-default-footer
      :fixed-header="true"
      :height="tableHeight"
      class="elevation-3 mt-3"
      item-key="id"
      show-select
      v-model="selectedTasks"
    >
      <!-- 表头 -->
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
      <!-- 分页组件 -->
      <template v-slot:footer>
        <v-divider></v-divider>
        <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
          <div class="footer__select">
            每页
            <span style="width: 60px">
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
            <span style="margin-left: 15px"
              >共{{ listsData.totalElements }}条</span
            >
            <v-spacer />
            <v-pagination
              class="d-flex justify-end pagination"
              v-model="listsData.pageIndex"
              :length="listsData.totalPages"
              :total-visible="7"
              @input="onPageChange"
            />
          </div>
        </div>
      </template>
    </v-data-table>
    <!-- -- -->
  </div>
</template>
<script>
import { DatePicker } from 'view-design';
import moment from 'moment';
export default {
  name: 'BaseSearchList',
  components: {
    DatePicker
  },
  props: {
    fieldList: {
      type: Array,
      default: () => []
    },
    counter: {
      type: Number,
      default: () => 0
    },
    listDataHeaders: {
      type: Array,
      default: () => []
    },
    listsData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      panel: 1,
      newDate: null,
      // 日期
      dates: [],
      isdateShow: false,
      //   nameListData: [],
      // 分页变量
      perPageNum: 10,
      //   totalItems: 0,
      //   pageNum: 1,
      //   queryPageLength: 0,
      perPageItems: [5, 10, 15, 20],
      selectedTasks: [],
      fullHeight: window.innerHeight,
      pageIndex: 1,
      pageSize: 10
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
  // created () {
  //   // 获取分页相关缓存
  //   let sessionS = window.sessionStorage;
  //   this.pageSize = sessionS.getItem('pageSize') ? parseInt(sessionS.getItem('pageSize')) : 10;
  //   this.pageIndex = sessionS.getItem('pageIndex') ? parseInt(sessionS.getItem('pageIndex')) : 1;
  // },
  // 离开规则集页面 可以访问到组件实例this
  // beforeRouteLeave (to, from, next) {
  //   // 如果跳转的页面是规则集详情的页面 搜索条件有值 缓存
  //   // let searchParamsForSession = {};
  //   // this.searchParam.forEach(item => {
  //   //   searchParamsForSession[item.placeholder] = item.value || '';
  //   // });
  //   if (to.name === 'accountDetail') {
  //     // window.sessionStorage.setItem('searchParam', JSON.stringify(Object.values(searchParamsForSession)));
  //     window.sessionStorage.setItem('pageSize', this.pageSize);
  //     window.sessionStorage.setItem('pageIndex', this.pageIndex);
  //   } else {
  //     // window.sessionStorage.setItem('searchParam', '');
  //     window.sessionStorage.setItem('pageSize', 10);
  //     window.sessionStorage.setItem('pageIndex', 1);
  //   }
  //   next();
  // },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
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
    change () {
      this.$emit('change', 1);
    },
    search () {
      this.$emit('search', this.fieldList);
      this.newDate = new Date().getTime();
    },
    reset () {
      this.$emit('reset', this.fieldList);
      if (this.$refs.searchForm) {
        this.$refs.searchForm.reset();
      }
      this.newDate = new Date().getTime();
    },
    // 选择时间的弹框
    dateChange () {
      if (this.dates.length === 2) {
        if (moment(this.dates[0]).valueOf() < moment(this.dates[1]).valueOf()) {
        } else if (
          moment(this.dates[0]).valueOf() > moment(this.dates[1]).valueOf()
        ) {
          this.reverseArry(this.dates);
        }
        for (let item of this.fieldList) {
          if (item.type === 'date') {
            item.value = this.dates.join(' 至 ');
          }
        }
        this.isdateShow = false;
      }
    },
    onWindowResize (event) {
      this.tableHeight = window.innerHeight;
    },
    pageChange ($event) {
      this.pageSize = $event;
      this.$emit('pageChange', $event);
    },
    onPageChange ($event) {
      this.pageIndex = $event;
      console.log(this.pageIndex, '99001');
      this.$emit('onPageChange', $event);
    },
    // 编辑
    editNameListSet (item) {
      // console.log(this.selectedTasks, 'selectedTasks');
      this.$router.push({
        name: 'accountDetail',
        params: item
      });
      console.log(item, 'item');
    },
    // 批量查询
    batchQuery () {
      this.$emit('batchQuery', true);
    },
    // 导出
    exportQuery () {
      this.$emit('exportQuery', this.selectedTasks);
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
