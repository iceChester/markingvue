<template>
  <div style="width: auto;height: 400px" id="score"></div>
</template>

<script>
require('echarts/theme/macarons') // echarts theme
export default {
  name: "bar",
  props: {
    barData: [],
    xData: []
  },
  data() {
    return {
      series: [{
        data: [],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(220, 220, 220, 0.8)'
        }
      }],
      xAxis: {
        type: 'category',
        data:[]
      },
      yAxis: {
        type: 'value'
      },
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
      },
    }
  },

  mounted() {
    this.series[0].data = this.barData;
    this.xAxis.data = this.xData;
    console.log(this.barData)
    this.echartsInit();
  },
  methods: {
    echartsInit(){
      let myChart = this.$echarts.init(document.getElementById('score'));
      myChart.setOption({
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        series: this.series,
        toolbox: this.toolbox,
      });
    }
  }
}
</script>

<style scoped>

</style>