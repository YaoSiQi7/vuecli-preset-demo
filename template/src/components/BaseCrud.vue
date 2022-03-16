<template>
  <!-- basic usage -->
  <!-- <base-crud :fieldList="tableHeaders" :tableHeaders="tableHeaders" :tableItems="phoneDataTableRows"></base-crud> -->
  <div>
    <div>
      <h2>I'm the child title</h2>
      <slot>
        This will only be displayed if there is no content
        to be distributed.
      </slot>
    </div>
    <!-- 查询表单 -->
    <v-expansion-panels v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header class="font-size: 18px">
          查询条件
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- 条件查询form -->
          <v-form
            ref="searchForm"
            lazy-validation
          >
            {{ fieldList }}
            <v-container>
              <v-row>
                <v-col
                  v-for="(item, index) in fieldList"
                  :key="index"
                  cols="12"
                  sm="12"
                  md="2"
                  xl="2"
                >
                  <v-text-field
                    :name="item.name"
                    :label="item.label"
                    :required="item.required"
                    outlined
                    dense
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="2"
                  xl="2"
                >
                  <v-btn
                    color="primary"
                    class="mr-4 mt-2"
                    @click="search"
                  >
                    查询
                  </v-btn>
                  <v-btn
                    class="mt-2"
                    @click="reset"
                  >
                    重置
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- 新建/编辑弹窗 -->
    <v-dialog
      v-model="crudFormDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="justify-left primary">
          <v-toolbar-title style="color:white;">
            添加手机号
          </v-toolbar-title>
          <div class="flex-grow-1" />
          <v-btn
            icon
            dark
            @click="crudFormDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          123
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="btn"
          >
            text
          </v-btn>
        </v-card-actions>
        <!-- <slot name="header"></slot> -->
        <!-- <slot name="container"></slot> -->
        <!-- <slot name="footer"></slot> -->
      </v-card>
    </v-dialog>
    <!-- 数据表格 -->
    <div
      v-if="tableHeaders"
      class="mt-2"
    >
      <v-data-table
        :headers="tableHeaders"
        :items="tableItems"
      >
        <template v-slot:top>
          <v-toolbar
            flat
            height="60px"
          >
            <v-toolbar-title style="font-size:18px">
              {{ compName }}
            </v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            />
            <v-spacer />
            <v-btn
              color="primary"
              class="mr-1 mt-1"
              @click="addRow"
            >
              添加
            </v-btn>
            <v-btn
              color="primary"
              class="mr-1 ml-4 mt-1"
              disabled
            >
              导出
            </v-btn>
            <v-btn
              color="primary"
              class="mr-1 ml-4 mt-1"
              disabled
            >
              导入
            </v-btn>
          </v-toolbar>
        </template>
        <slot name="tableDetailRows" />
      </v-data-table>
    </div>
    <!-- 删除组件 -->
    <del-dialog
      :is-dialog-show="dialogDel"
      @cancelDel="dialogDel=false"
      @confimDel="confirmDel"
    />
    <!-- 提示通知 -->
    <v-snackbar
      v-model="snackbar"
      :timeout="1500"
      :top="true"
      :color="snackbarColor"
    >
      {{ resText }}
    </v-snackbar>
  </div>
</template>

<script>
import delDialog from '@/components/common/delDialog';
export default {
  name: 'BaseCrud',
  components: {
    delDialog
  },
  props: {
    fieldList: {
      type: Array,
      default: () => []
    },
    tableHeaders: {
      type: Array,
      default: () => [],
      required: true
    },
    tableItems: {
      tyep: Array,
      default: [],
      required: true
    },
    compName: {
      type: String,
      required: true,
      default: '名单管理'
    }
  },
  data () {
    return {
      // 查询扩展
      panel: '',
      // 删除弹窗
      dialogDel: false,
      // 提示通知
      snackbar: null,
      snackbarColor: 'primary',
      resText: '',
      // crud form
      crudFormDialog: false
    };
  },
  methods: {
    search () {
      console.info('base crud search');
    },
    reset () {
      console.info('crud reset');
    },
    confirmDel () {},
    addRow () {
      this.crudFormDialog = true;
      console.info('crud add row');
    },
    btn () {
      console.info('btn');
    }
  }
};
</script>
