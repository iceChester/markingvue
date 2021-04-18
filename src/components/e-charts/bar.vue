<template>
  <div style="width: auto;height: 400px" id="score"></div>
</template>

<script>
require('echarts/theme/macarons') // echarts theme
export default {
  name: "bar",
  props: {
    barData: {
      type: Array
    },
    xData: {
      type: Array
    },
  },
  data() {
    return {
      series: [{
        data: this.barData,
        type: 'bar',
        showBackground: false,
        backgroundStyle: {
          color: 'rgba(220, 220, 220, 0.8)'
        },
      }],
    }
  },

  mounted() {
    // this.series[0].data = this.barData;
    // this.xAxis.data = this.xData;
    console.log(this.barData)
    this.initOptionData();
  },
  methods: {
    initOptionData() {
      let chart = this.$echarts.init(document.getElementById('score'));
      // let result = this.data;
      let options = {
        title: {
          text: "作业分数分布柱状图",
          subtext: "",
        },
        tooltip: {
          trigger: "axis",
        },

        calculable: true,
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
        xAxis: [
          {
            data: this.xData,
          },

        ],
        yAxis: [
          {
            name: '人数',
            type: "value",
          },
        ],
        series: this.series,
      };
      chart.setOption(options);
    },
  }
}
</script>

<style scoped>

</style>