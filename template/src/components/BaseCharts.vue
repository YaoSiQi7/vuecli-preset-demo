<!-- author: 古雪瑞-->
<!-- updateTime: 2020-04-07-->
<template>
  <div>
    <v-card class="elevation-3">
      <v-card-text style="position: relative;height: 234px;" class="pb-4">
        <v-img
          src="../../static/img/arrow_right.png"
          class="arrow-right"
          @click="toDetailPage(chartTitle)"
        ></v-img>
        <p class="echartsP">{{ chartTitle }}</p>
        <div v-if="optionParams.length === 0" class="pl-5">暂无数据</div>
        <div v-else>
          <div class="mt-4 risk-event-box risk-event-box-date">
            <div class="risk-event-name" @mouseenter="eventMouseEnter(item)" @click="eventClick(item)" v-for="(item, index) in optionParams" :key="index">
              <span class="risk-event-cityname">{{ item.name }}</span>
              <span class="risk-event-allEventNum">{{ item.allEventNum }}</span>
            </div>
          </div>
          <div class="risk-event-box">
            <div class="risk-event-box-background">
              <span class="risk-event-currentEvent">
                <i class="risk-event-icon risk-event-release-icon"></i>
                <span>自动放行</span>
                {{ eventParam.eRelease }}
              </span>
              <span class="risk-event-currentEvent">
                <i class="risk-event-icon risk-event-Certification-icon"></i>
                <span>加强认证</span>
                {{ eventParam.certification }}
              </span>
              <span class="risk-event-currentEvent">
                <i class="risk-event-icon risk-event-review-icon"></i>
                <span>人工审核</span>
                {{ eventParam.review }}
              </span>
              <span class="mb-4 risk-event-currentEvent">
                <i class="risk-event-icon risk-event-block-icon"></i>
                <span>自动阻断</span>
                {{ eventParam.block }}
              </span>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'baseCharts',
  props: {
    chartsParam: {
      type: Array,
      default: () => []
    },
    chartTitle: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      optionParams: [],
      eventParam: {}
    };
  },
  watch: {
    chartsParam: function (newVal, oldVal) {
      this.optionParams = newVal;
      newVal && this.initCharts();
    }
  },
  methods: {
    // 风险事件图表的鼠标悬浮事件
    eventMouseEnter (param) {
      this.eventParam = param;
    },
    // 风险时间图表鼠标点击事件
    eventClick (param) {
      this.$emit('eventClick', param);
    },
    initCharts () {
      if (this.optionParams.length > 0) {
        this.eventParam = this.optionParams[0];
      }
    },
    toDetailPage (param) {
      this.$emit('toDetailPage', param);
    }
  }
};
</script>
<style lang="stylus" scoped>
  .echartsP {
    color: #000;
    font-size: 16px;
    font-weight: bold;
    padding-left: 20px;
    margin-bottom: 5px;
  }
  .arrow-right {
    width: 14px;
    height: 10px;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
  .risk-event-box {
    padding: 0 20px;
    overflow: hidden;
  }
  .risk-event-box-date {
    height: 74px;
    overflow-x: auto;
    white-space: nowrap;
    margin: 0 20px;
    padding: 0;
  }
  .risk-event-name {
    min-width: 60px;
    display: inline-block;
    text-align: center;
  }
  .risk-event-name:hover {
    cursor: pointer;
  }
  .risk-event-cityname {
    display: block;
    font-size:14px;
    color:#666
    height: 22px;
    line-height 22px;
  }
  .risk-event-allEventNum {
    display: block;
    font-size: 18px;
    color: #2d2d2d;
    padding: 15px 0;
  }
  .risk-event-box-background {
    background-color: #f9f9f9;
  }
  .risk-event-currentEvent {
    display: inline-block;
    width: 50%;
  }
  .risk-event-icon {
    display: inline-block;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    margin: 20px 5px 0 8%;
  }
  .risk-event-release-icon {
    background-color: #6ed9ba;
  }
  .risk-event-Certification-icon {
    background-color: #4473da;
  }
  .risk-event-review-icon {
    background-color: #f4c79b;
  }
  .risk-event-block-icon {
    background-color: #fe8894;
  }
</style>
