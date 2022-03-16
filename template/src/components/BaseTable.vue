<template>
  <v-card>
    <slot name="headerActionBar">
      <v-row>
        <v-col md="2" class="mb-0">
          <v-card-title>
            <v-text-field
              v-model="search"
              label="请输入条件搜索"
              append-icon="mdi-magnify"
              outlined
              dense
            />
          </v-card-title>
        </v-col>
        <v-spacer />
        <v-col md="2" class="mb-0">
          <div class="btn mt-3 mr-8 text-right">
            <v-btn color="primary" @click="addFunc">添加函数</v-btn>
          </div>
        </v-col>
      </v-row>
    </slot>
    <slot name="table">
      <v-data-table
        :headers="tableHeader"
        :items="tableItems"
        :search="search"
        :items-per-page="itemPerPage"
        :fixed-header="true"
        hide-default-footer
        :elevation="3"
        :height="tableHeight"
        no-results-text="没有匹配的数据"
      >
        <template v-slot:item.action="{ item }" v-if="tableItems.length > 0">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-1 icon-primary"
                color="primary"
                v-on="on"
                @click="editFunc(item)"
                >mdi-pencil</v-icon
              >
            </template>
            <span>编辑</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-1"
                color="primary"
                v-on="on"
                @click="deteleFunc(item)"
                >mdi-delete</v-icon
              >
            </template>
            <span>删除</span>
          </v-tooltip>
        </template>
        <template v-slot:no-data>没有数据</template>
      </v-data-table>
    </slot>
    <v-row>
      <v-col>
        <div class="footer__select" md="1">
            每页
            <v-select
              v-model="pagination.perPageNums"
              item-text="fieldName"
              item-value="fieldField"
              :items="pagination.perPageItems"
              dense
              width="27px"
              no-data-text="没有匹配数据"
            />条
            <span style="margin-left:15px">共{{ pagination.totalItems }}条</span>
          </div>
      </v-col>
      <v-col md="10">
        <div class="mr-4 mb-2 mx-auto pa-2 transition-swing elevation-0">
            <v-pagination
              class="d-flex justify-end pagination"
              v-model="pagination.pageNum"
              :length="pagination.queryPageLength"
              :total-visible="7"
              @input="onPageChange"
            />
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'BaseTable',
  data () {
    return {
      search: ''
    };
  },
  props: {
    tableHeader: {
      type: Array,
      default: () => ([])
    },
    tableItems: {
      type: Array,
      default: () => ([])
    },
    itemPerPage: {
      type: Number,
      default: 10
    },
    tableHeight: {
      type: String,
      default: '50vh'
    },
    pagination: {
      type: Object,
      default: () => ({
        perPageNums: 10,
        perPageItems: [5, 10, 15, 20, 50, 100],
        totalItems: 100,
        pageNum: 1,
        queryPageLength: 3
      })
    }
  },
  mounted () {
    console.info('table items', this.tableItems);
  },
  methods: {
    onPageChange (page) {
    },
    addFunc () {
      this.$emit('add');
    },
    editFunc (payload) {
      this.$emit('edit', payload);
    },
    deteleFunc (payload) {
      this.$emit('delete', payload);
    }
  }
};
</script>

<style lang="stylus" scoped>

</style>
