<!----------  @author: wangguodong  ----------->
<!----------  @updated_at: 2021-008-12  ----------->
<!----------  @version: 1.8.0  ----------->
<template>
  <div>
    <!-- 搜索表单 -->
    <v-form ref="searchForm" lazy-validation :key="newDate">
      <v-container grid-list-xl class="ma-0 pa-0">
        <v-row class="ma-0 py-0">
          <v-col
            v-for="(item, index) in fieldList"
            :key="index"
            cols="12"
            sm="12"
            :md="item.cols || 2"
            :xl="item.cols || 2"
          >
            <v-row class="ma-0 py-0">
              <DatePicker
                v-if="item.type === 'daterange'"
                type="daterange"
                v-model="item.value"
                :options="item.options"
                placement="top-start"
                :placeholder="item.placeholder"
                style="width: 100%"
                id="data-picker"
                :clearable="item.clearable"
              ></DatePicker>
              <v-select
                v-if="item.type === 'select'"
                v-model="item.value"
                :items="item.options"
                :placeholder="item.placeholder"
                outlined
                :key="newDate"
                dense
                :multiple="item.multiple"
                :loading="item.loading"
                no-data-text="没有匹配数据"
                class="py-0"
                @change="onHandleChange(item)"
                background-color="white"
              />
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
              @click="search"
            >
              查询
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
<script>
import { DatePicker } from 'view-design';
import moment from 'moment';
export default {
  name: 'BaseSearchNewDate',
  components: {
    DatePicker
  },
  props: {
    fieldList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      panel: 1,
      newDate: null,
      // 日期
      dates: [],
      isdateShow: false
    };
  },
  watch: {},
  mounted () {},
  beforeDestroy () {},
  computed: {},
  methods: {
    onHandleChange (value) {
      this.$emit('onHandleChange', value);
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

#data-picker {}

#data-picker >>>.ivu-input {
  height: 40px;
}
</style>
