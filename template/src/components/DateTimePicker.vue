<template>
  <v-dialog
    v-model="display"
    :width="dialogWidth"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-bind="textFieldProps"
        :disabled="disabled"
        :loading="loading"
        :label="label"
        :value="formattedDatetime"
        readonly
        outlined
        dense
        v-on="on"
       :placeholder="placeholder"
      >
        <template v-slot:progress>
          <slot name="progress">
            <v-progress-linear
              color="primary"
              indeterminate
              absolute
              height="2"
            />
          </slot>
        </template>
      </v-text-field>
    </template>
    <v-card>
      <v-card-text class="px-0 py-0">
        <v-tabs
          v-model="activeTab"
          fixed-tabs
        >
          <v-tab key="calendar">
            <slot name="dateIcon">
              <v-icon>event</v-icon>
            </slot>
          </v-tab>
          <v-tab
            key="timer"
            :disabled="dateSelected"
          >
            <slot name="timeIcon">
              <v-icon>access_time</v-icon>
            </slot>
          </v-tab>
          <v-tab-item key="calendar">
            <v-date-picker
              v-show="type===1"
              v-model="date"
              locale="zh-cn"
              v-bind="datePickerProps"
              full-width
              :max="validDateUseing"
              @input="showTimePicker"
            />
            <v-date-picker
              v-show="type===2"
              v-model="date"
              locale="zh-cn"
              v-bind="datePickerProps"
              full-width
              :min="validDateUseing"
              @input="showTimePicker"
            />
            <v-date-picker
              v-show="type===3"
              v-model="date"
              locale="zh-cn"
              v-bind="datePickerProps"
              full-width
              :min="validDateUseing"
              @input="showTimePicker"
            />
          </v-tab-item>
          <v-tab-item key="timer">
            <v-time-picker
              v-show="type===1 && date===validDateUseing"
              ref="timer"
              v-model="time"
              class="v-time-picker-custom"
              v-bind="timePickerProps"
              full-width
              :max="validTimeUseing"
            />
            <v-time-picker
              v-show="type===2 && date===validDateUseing"
              ref="timer"
              v-model="time"
              class="v-time-picker-custom"
              v-bind="timePickerProps"
              full-width
              :min="validTimeUseing"
            />
            <v-time-picker
              v-show="type===3 && date===validDateUseing"
              ref="timer"
              v-model="time"
              class="v-time-picker-custom"
              v-bind="timePickerProps"
              full-width
              :min="validTimeUseing"
            />
            <v-time-picker
              v-show="date!==validDateUseing"
              ref="timer"
              v-model="time"
              class="v-time-picker-custom"
              v-bind="timePickerProps"
              full-width
              :min="validTimeUseing"
            />
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <slot
          name="actions"
          :parent="this"
        >
          <v-btn
            outlined
            text
            @click.native="clearHandler"
          >
            清除
          </v-btn>
          <v-btn
            color="primary"
            @click="okHandler"
          >
            确定
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { format, parse } from 'date-fns';

const DEFAULT_DATE = '';
const DEFAULT_TIME = '00:00:00';
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
const DEFAULT_TIME_FORMAT = 'HH:mm:ss';
const DEFAULT_DIALOG_WIDTH = 340;
const DEFAULT_CLEAR_TEXT = 'CLEAR';
const DEFAULT_OK_TEXT = 'OK';

export default {
  name: 'VDatetimePicker',
  model: {
    prop: 'datetime',
    event: 'input'
  },
  props: {
    validTime: {
      type: [Date, String],
      default: null
    },
    type: {
      type: Number,
      default: 1
    },
    datetime: {
      type: [Date, String],
      default: null
    },
    disabled: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    label: {
      type: String,
      default: ''
    },
    dialogWidth: {
      type: Number,
      default: DEFAULT_DIALOG_WIDTH
    },
    dateFormat: {
      type: String,
      default: DEFAULT_DATE_FORMAT
    },
    timeFormat: {
      type: String,
      default: 'HH:mm'
    },
    clearText: {
      type: String,
      default: DEFAULT_CLEAR_TEXT
    },
    okText: {
      type: String,
      default: DEFAULT_OK_TEXT
    },
    textFieldProps: {
      type: Object
    },
    datePickerProps: {
      type: Object
    },
    timePickerProps: {
      type: Object
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      display: false,
      activeTab: 0,
      date: DEFAULT_DATE,
      time: DEFAULT_TIME,
      validDateUseing: '',
      validTimeUseing: ''
    };
  },
  computed: {
    dateTimeFormat () {
      return this.dateFormat + ' ' + this.timeFormat;
    },
    defaultDateTimeFormat () {
      return DEFAULT_DATE_FORMAT + ' ' + DEFAULT_TIME_FORMAT;
    },
    formattedDatetime () {
      return this.selectedDatetime
        ? format(this.selectedDatetime, this.dateTimeFormat)
        : '';
    },
    selectedDatetime () {
      if (this.date && this.time) {
        let datetimeString = this.date + ' ' + this.time;
        if (this.time.length === 5) {
          datetimeString += ':00';
        }
        return parse(datetimeString, this.defaultDateTimeFormat, new Date());
      } else {
        return null;
      }
    },
    dateSelected () {
      return !this.date;
    }
  },
  watch: {
    datetime: function () {
      this.init();
    },
    validTime (val) {
      console.log(val, 1111);
      if (val) {
        if (typeof val === 'object') {
          this.validDateUseing = format(val, DEFAULT_DATE_FORMAT);
          this.validTimeUseing = format(val, DEFAULT_TIME_FORMAT);
        } else {
          this.validDateUseing = val.split(' ')[0];
          this.validTimeUseing = val.split(' ')[1];
        }
      }
    }
  },
  mounted () {
    if (this.validTime) {
      if (typeof this.validTime === 'object') {
        this.validDateUseing = format(this.validTime, DEFAULT_DATE_FORMAT);
        this.validTimeUseing = format(this.validTime, DEFAULT_TIME_FORMAT);
      } else {
        this.validDateUseing = this.validTime.split(' ')[0];
        this.validTimeUseing = this.validTime.split(' ')[1];
      }
    }
    this.init();
  },
  methods: {
    init () {
      if (!this.datetime) {
        return;
      }

      let initDateTime;
      if (this.datetime instanceof Date) {
        initDateTime = this.datetime;
      } else if (
        typeof this.datetime === 'string' ||
          this.datetime instanceof String
      ) {
        // see https://stackoverflow.com/a/9436948
        initDateTime = parse(this.datetime, this.dateTimeFormat, new Date());
      }

      this.date = format(initDateTime, DEFAULT_DATE_FORMAT);
      this.time = format(initDateTime, DEFAULT_TIME_FORMAT);
    },
    okHandler () {
      this.resetPicker();
      this.$emit('input', this.selectedDatetime);
    },
    clearHandler () {
      // this.resetPicker();
      this.date = DEFAULT_DATE;
      this.time = DEFAULT_TIME;
      this.$emit('clear', null);
    },
    resetPicker () {
      this.display = false;
      this.activeTab = 0;
      if (this.$refs.timer) {
        this.$refs.timer.selectingHour = true;
      }
    },
    // 日期插件展开
    showTimePicker (val) {
      // console.log(this.date, this.type, this.validDateUseing, this.validTime, 'showTimePicker');
      /**
       * 截至时间==如果日期是同一天，需限制时间不能小于当前起始时间的 时间值，
       * 如果是后一天，则不需要限制时间的勾选区间
       */

      let date1 = new Date(this.date);
      let date2 = new Date(this.validDateUseing);
      // if (this.type === 2) {
      if (date1.getTime() === date2.getTime()) {
        this.validTimeUseing = format(this.validTime, DEFAULT_TIME_FORMAT);
      } else {
        this.validTimeUseing = '';// 不用控制时间区间
      }
      // }
      this.activeTab = 1;
    }
  }
};
</script>
