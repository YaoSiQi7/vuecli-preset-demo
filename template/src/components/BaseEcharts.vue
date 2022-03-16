<!--
 * @Author: your name
 * @Date: 2020-12-02 13:14:52
 * @LastEditTime: 2020-12-02 19:56:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \ipa-manage\src\components\BaseEcharts.vue
-->
<template>
  <div>
    <v-card class="elevation-3">
      <v-card-text style="position: relative" class="pb-4">
        <div
          ref="echarts"
          class="echarts"
          :id="chartId"
          :style="{ width: optionParam.width, height: optionParam.height }"
        ></div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'baseEcharts',
  data () {
    return {
    };
  },
  props: {
    optionParam: {
      width: { // 宽度
        type: [String, Number],
        default: '300px'
      },
      height: {// 高度
        type: [String, Number],
        default: '300px'
      },
      color: Array, // 颜色
      tooltip: Object, // 提示框
      title: Object, // 标题
      legend: Object, // 图例组件
      series: Array, // 系列列表。每个系列通过 type 决定自己的图表类型
      xAxis: Object, // 直角坐标系 grid 中的 x 轴
      yAxis: Object, // 直角坐标系 grid 中的 y 轴
      toolbox: Object, // 工具栏
      grid: Object, // 直角坐标系内绘图网格
      dataZoom: Array // 区域缩放，
    },
    chartId: {
      type: String,
      default: ''
    }
  },
  watch: {
    optionParam: {
      handler () {
        this.initChart();
      },
      deep: true
    }
  },
  mounted () {
    this.initChart();
  },
  methods: {
    initChart () {
      const initCharts = this.$echarts.init(this.$refs.echarts);
      const options = {
        color: this.optionParam.color || window.g.echartsBaseColor, // 父组件未传颜色则获取全局默认的
        tooltip: this.optionParam.tooltip,
        title: this.optionParam.title,
        legend: this.optionParam.legend,
        series: this.optionParam.series,
        xAxis: this.optionParam.xAxis,
        yAxis: this.optionParam.yAxis,
        grid: this.optionParam.grid,
        toolbox: this.optionParam.toolbox,
        dataZoom: this.optionParam.dataZoom
      };
      initCharts.setOption(options, true);
      window.addEventListener('resize', () => { initCharts.resize(); });
      // 点击事件
      initCharts.on('click', (params) => { this.$emit('clickEvent', params); });
      // 双击事件
      initCharts.on('dblclick', (params) => { this.$emit('dblclickEvent', params); });
      // 切换图例选中状态后的事件。
      initCharts.on('legendselectchanged', (params) => { this.$emit('legendselectchanged', params); });
      // 图例取消选中后的事件。
      initCharts.on('legendunselected', (params) => { this.$emit('legendunselected', params); });
      // 鼠标经过事件
      initCharts.on('mouseover', (params) => { this.$emit('mouseoverEvent', params); });
    }
  }
};
</script>
<style lang="stylus" scoped>
.echarts {
  margin: 0 auto;
}
</style>
