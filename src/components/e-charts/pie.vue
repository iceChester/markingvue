<template>
  <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
  <div id="accomplish" style="width: auto;height:400px;"></div>
</template>

<script>

export default {
  name: "pie",
  props: {
    pieData: [],
  },
  data() {
    return {
      series: [{
        name: '访问来源',
        data:[],
        type: 'pie',    // 设置图表类型为饼图
        radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
      }],
      toolbox: { // 工具箱
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: {readOnly: false},
          magicType: {type: ['bar', 'line']},
          restore: {}
        }
      }
    }
  },
  mounted() {
    this.series[0].data = this.pieData;
    this.echartsInit();
  },
  methods: {
    echartsInit(){
      let myChart = this.$echarts.init(document.getElementById('accomplish'));
      myChart.setOption({
        series: this.series,
        // toolbox: this.toolbox,
      });
    }
  }
}
</script>

<style scoped>

</style>