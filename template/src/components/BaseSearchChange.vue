<template>
<!-- 与baseSearchTwo组件的不同在于selet的change事件的参数，(为了区分多了select比对空字符串) -->
  <v-form
    ref="searchForm"
    lazy-validation
    :key="newDate"
  >
      <v-row>
        <v-col
          v-for="(item, index) in fieldList"
          :key="index"
          cols="12"
          sm="12"
          :md="item.type === 'date' ? 3 : 2"
          xl="2"
        >
          <v-row class="ma-0 py-0" v-if="item.type === 'interval'">
            <span class="baseSection40 baseSectionDisplay">
              <v-text-field
                v-model.trim="item.minValue"
                :placeholder="item.minPlaceholder"
                :name="item.minName"
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
                v-model.trim="item.maxValue"
                :name="item.maxName"
                :placeholder="item.maxPlaceholder"
                outlined
                dense
                class="py-0"
              ></v-text-field>
            </span>
          </v-row>
          <v-text-field
            v-if="item.type === 'text'"
            v-model.trim="item.value"
            :name="item.name"
            :placeholder="item.placeholder"
            :required="item.required"
            :type="item.inputType"
            outlined
            dense
            class="py-0"
            background-color="white"
          />
          <v-select
            v-if="item.type === 'select'"
            v-model="item.value"
            :items="item.options"
            :placeholder="item.placeholder"
            outlined
            dense
            :multiple="item.multiple"
            :loading="item.loading"
            no-data-text="没有匹配数据"
            class="py-0"
            @change="onHandleChange(item)"
            background-color="white"
          />
          <v-select
            v-if="item.type === 'selectDate'"
            v-model="item.value"
            :items="item.options"
            :placeholder="item.placeholder"
            outlined
            dense
            :multiple="item.multiple"
            :loading="item.loading"
            no-data-text="没有匹配数据"
            class="py-0"
            @change="selectDateChange(item)"
            background-color="white"
          />
          <v-autocomplete
            v-if="item.type === 'autocomplete'"
            v-model="item.value"
            :items="item.options"
            :placeholder="item.placeholder"
            outlined
            :chips="item.chips"
            dense
            :multiple="item.multiple"
            no-data-text="没有匹配数据"
            class="py-0"
          />
          <v-textarea
            v-if="item.type === 'textarea'"
            v-model="item.value"
            :placeholder="item.placeholder"
            :name="item.name"
            rows="1"
            outlined
            dense
            class="py-0"
          />
          <v-combobox
            v-if="item.type === 'combobox'"
            v-model="item.value"
            :placeholder="item.placeholder"
            :name="item.name"
            :items="item.options"
            :multiple="item.multiple"
            outlined
            dense
            no-data-text="没有匹配数据"
            class="py-0"
          />
          <v-file-input
            v-if="item.type === 'file'"
            :placeholder="item.placeholder"
            :multiple="item.multiple"
            :accept="item.accept"
            outlined
            dense
            class="py-0"
          />
            <treeselect
                v-if="item.type === 'treeSelect'"
                :value-consists-of='item.valueConsistsOf'
                :multiple="item.multiple"
                :clearable='false'
                :options="item.options"
                :placeholder="item.placeholder"
                v-model="item.value"
                :default-expand-level="1"
                  />
          <v-text-field
            v-if="item.type === 'date'"
            :placeholder="item.placeholder"
            outlined
            dense
            v-model="item.value"
            append-icon="event"
            @click="isdateShow = true"
            background-color="white"
          ></v-text-field>
          <v-dialog v-if="item.type === 'date'" v-model="isdateShow" width="321">
            <v-date-picker selected-items-text="已选择日期" v-model="dates" range  @change="dateChange"></v-date-picker>
          </v-dialog>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="3"
          xl="3"
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
            v-show="hasPermission(exportBtn)"
            class="mt-2 mr-2 elevation-3"
            @click="exportBtnClick"
            disabled
          >
            导出
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
  </v-form>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import moment from 'moment';
export default {
  name: 'BaseSearchTwo',
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
    // dates: {
    //   type: Array,
    //   default: () => []
    // }
    exportBtn: {
      type: String,
      default: () => ''
    }
  },
  data: () => ({
    panelValue: 0,
    isdateShow: false,
    newDate: null,
    dates: []
  }),
  watch: {
    // 风险图表各页面没有用到手动清空已选择日期操作
    // clearDate: {
    //   handler: function (newVal, oldVal) {
    //     if (newVal !== oldVal) {
    //       this.dates = [];
    //     }
    //   },
    //   immediate: true
    // }
    // 监听日期，给dates赋值
    fieldList: {
      deep: true,
      handler: function (newVal, oldVal) {
        newVal.forEach(item => {
          if (item.type === 'date') {
            this.dates = item.value.split(' 至 ');
          }
        });
      }
    }
  },
  mounted () {
    this.fieldList.forEach((item, index, ary) => {
      if (item.type === 'date' && item.value.length > 0) {
        item.value = item.value.join(' 至 ');
      } else if (item.type === 'date' && item.value.length === 0) {
        this.changeDay(0);
      }
    });
  },
  methods: {
    // change () {
    //   this.$emit('change', 1);
    // },
    search () {
      this.$emit('search', this.fieldList);
      this.newDate = new Date().getTime();
    },
    exportBtnClick () {},
    reset () {
      this.$emit('reset', this.fieldList);
      if (this.$refs.searchForm) {
        this.$refs.searchForm.reset();
      }
      this.newDate = new Date().getTime();
    },
    changeDay (daysOfNumber) {
      console.log('daysOfNumber-----', daysOfNumber);
      this.fieldList.forEach((item, index, ary) => {
        if (item.type === 'date') {
          // 生成开始时间和结束时间
          let today = new Date();
          today.setTime(today.getTime() + daysOfNumber * 24 * 60 * 60 * 1000);

          let startDay = this.dateToString(today);
          let endDay = this.dateToString(new Date()).substr(0, 10);
          this.dateStart = startDay;
          if (daysOfNumber === -1) { // -1为选择了昨天的时间
            item.value = [startDay, startDay];
            this.dates = [startDay, startDay];
            // this.dateEnd = startDay;
          } else {
            item.value = [startDay, endDay];
            this.dates = [startDay, endDay];
            // this.dateEnd = endDay;
          }
          item.value = item.value.join(' 至 ');
        }
      });
    },
    // 日期转字符串
    dateToString (date) {
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length === 1) {
        month = '0' + month;
      }
      if (day.length === 1) {
        day = '0' + day;
      }
      var dateTime = year + '-' + month + '-' + day;
      return dateTime;
    },
    // 选择时间的弹框
    dateChange () {
      if (this.dates.length === 2) {
        if (moment(this.dates[0]).valueOf() < moment(this.dates[1]).valueOf()) {
        } else if (moment(this.dates[0]).valueOf() > moment(this.dates[1]).valueOf()) {
          this.reverseArry(this.dates);
        }
        for (let item of this.fieldList) {
          if (item.placeholder === '风控时间' || item.placeholder === '时间') {
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
    onHandleChange (value) {
      this.$emit('onHandleChange', value);
    },
    // 固定日期selectChange事件
    selectDateChange (value) {
      if (value) {
        this.changeDay(value);
      } else {
        this.changeDay(value);
      }
    }
  },
  components: {
    Treeselect
  }
};
</script>
<style lang="stylus" scoped>
// .v-expansion-panel-content__wrap {
//   margin-bottom: 4px;
//   padding-bottom: 4px;
// }
.baseSectionDisplay {
  display: inline-block;
}
.baseSection20 {
  width: 12%;
}
.baseSection40 {
  width: 38%;
}
.baseSectionCenter {
  // text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
