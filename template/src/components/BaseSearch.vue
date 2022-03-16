<template>
  <v-expansion-panels v-model="panel" class="my-0 py-0 elevation-3">
    <v-expansion-panel @change="change">
      <v-expansion-panel-header class="pl-3 my-0">
        <div>查询条件</div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <!-- 条件查询form -->
        <slot>
          <v-form
            ref="searchForm"
            lazy-validation
            :key="newDate"
          >
            <v-container grid-list-xl class="ma-0 pa-0">
              <v-row class="ma-0 py-0">
                <v-col
                  v-for="(items, index) in fieldList"
                  :key="index"
                  cols="12"
                  sm="12"
                  :md="items.type === 'interval' ?  '4' : '2'"
                  :xl="items.type === 'interval' ?  '4' : '2'"
                >
                  <v-row class="ma-0 py-0" v-if="items.type === 'interval'">
                    <span class="baseSection40 baseSectionDisplay">
                      <v-text-field
                        v-model.trim="items.minValue"
                        :placeholder="items.minPlaceholder"
                        :name="items.minName"
                        outlined
                        dense
                        class="py-0"
                      ></v-text-field>
                    </span>
                    <span class="baseSection20 baseSectionDisplay baseSectionCenter">
                      -
                    </span>
                    <span class="baseSection40 baseSectionDisplay">
                      <v-text-field
                        v-model.trim="items.maxValue"
                        :name="items.maxName"
                        :placeholder="items.maxPlaceholder"
                        outlined
                        dense
                        class="py-0"
                      ></v-text-field>
                    </span>
                  </v-row>
                  <v-text-field
                    v-if="items.type === 'text'"
                    v-model.trim="items.value"
                    :name="items.name"
                    :placeholder="items.placeholder"
                    :required="items.required"
                    :type="items.inputType"
                    outlined
                    dense
                    class="py-0"
                  />
                  <v-select
                    v-if="items.type === 'select'"
                    v-model="items.value"
                    :items="items.options"
                    :placeholder="items.placeholder"
                    outlined
                    dense
                    :multiple="items.multiple"
                    :loading="items.loading"
                    no-data-text="没有匹配数据"
                    class="py-0"
                    @change="onHandleChange(items.value, items)"
                  >
                    <template v-slot:selection="{ item, index }">
                      <!-- <span v-if="index === 0">{{ item.text }}</span> -->
                      <v-chip v-if="index === 0" outlined style="border: 0;margin: 0;padding: 0;">
                        <span>{{ item.text }}</span>
                      </v-chip>
                      <span
                        v-if="index === 1"
                        class="grey--text caption"
                      >
                         (+{{ items.value.length - 1 }} 更多)
                      </span>
                    </template>
                  </v-select>
                  <v-autocomplete
                    v-if="items.type === 'autocomplete'"
                    v-model="items.value"
                    :items="items.options"
                    :placeholder="items.placeholder"
                    outlined
                    :chips="items.chips"
                    dense
                    :multiple="items.multiple"
                    no-data-text="没有匹配数据"
                    class="py-0"
                  />
                  <v-textarea
                    v-if="items.type === 'textarea'"
                    v-model="items.value"
                    :placeholder="items.placeholder"
                    :name="items.name"
                    rows="1"
                    outlined
                    dense
                    class="py-0"
                  />
                  <v-combobox
                    v-if="items.type === 'combobox'"
                    v-model="items.value"
                    :placeholder="items.placeholder"
                    :name="items.name"
                    :items="items.options"
                    :multiple="items.multiple"
                    outlined
                    dense
                    no-data-text="没有匹配数据"
                    class="py-0"
                  />
                  <v-file-input
                    v-if="items.type === 'file'"
                    :placeholder="items.placeholder"
                    :multiple="items.multiple"
                    :accept="items.accept"
                    outlined
                    dense
                    class="py-0"
                  />
                    <treeselect
                        v-if="items.type === 'treeSelect'"
                       :value-consists-of='items.valueConsistsOf'
                       :multiple="items.multiple"
                       :clearable='false'
                       :options="items.options"
                       :placeholder="items.placeholder"
                       v-model="items.value"
                       :default-expand-level="1"
                         />
                  <v-text-field
                    v-if="items.type === 'date'"
                    :placeholder="items.placeholder"
                    outlined
                    dense
                    v-model="items.value"
                    append-icon="event"
                    @click="dateClick(items.value)"
                  ></v-text-field>
                  <v-dialog v-if="items.type === 'date'" v-model="isdateShow" width="321">
                    <v-date-picker selected-items-text="已选择日期" v-model="dates" range  @change="dateChange"></v-date-picker>
                  </v-dialog>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="2"
                  xl="2"
                >
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
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import moment from 'moment';
export default {
  name: 'BaseSearch',
  props: {
    fieldList: {
      type: Array,
      default: () => []
    },
    isExpanded: {
      type: Boolean,
      default: false
    },
    clearDate: {
      type: Boolean,
      default: false
    },
    panelFromParent: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    panel: 1,
    panelValue: 0,
    isdateShow: false,
    // 日期
    dates: [],
    newDate: null
  }),
  watch: {
    clearDate: {
      handler: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.dates = [];
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.panel = this.panelFromParent;
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
        if (moment(this.dates[0]).valueOf() > moment(this.dates[1]).valueOf()) {
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
    // 翻转数组
    reverseArry (array) {
      for (var i = 0; i < array.length / 2; i++) {
        var temp = array[i];
        array[i] = array[array.length - 1 - i];
        array[array.length - 1 - i] = temp;
      }
      return array; // Array对象中的方法返回了一个数组。
    },
    onHandleChange (value, items) {
      this.$emit('onHandleChange', value, items);
    },
    // 时间点击事件，
    dateClick (dateValue) {
      this.isdateShow = true;
      if (dateValue.length > 0) { // 用来回显时间用
        this.dates = dateValue.split(' 至 ');
      }
    }
  },
  components: {
    Treeselect
  }
};
</script>
<style lang="stylus" scoped>
.v-expansion-panel-content__wrap {
  margin-bottom: 4px;
  padding-bottom: 4px;
}
.baseSectionDisplay {
  display: inline-block;
}
.baseSection20 {
  width: 8%;
}
.baseSection40 {
  width: 46%;
}
.baseSectionCenter {
  // text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
