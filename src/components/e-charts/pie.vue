<template>
  <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
  <div id="accomplish" style="width: auto;height:400px;"></div>
</template>

<script>

export default {
  name: "pie",
  props: {
    pieData:  {
      type: Array
    },
  },
  data() {
    return {
      series: [
          {
            name: '人数',
            data:this.pieData,
            type: 'pie',    // 设置图表类型为饼图
            radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。,
            label: {
              normal: {
                show: true,
                // position: 'inside',
                formatter: '{b}:{d}%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
                textStyle : {
                  align : 'center',
                  baseline : 'middle',
                  fontFamily : '微软雅黑',
                  fontSize : 15,
                  fontWeight : 'bolder'
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgb(67,251,7)'
                },
                smooth: 0.2,
                length: 50,
                length2: 20
              }
            },
          },
      ],
    }
  },
  mounted() {
    this.initOptionData();
  },
  methods: {
    initOptionData() {
      let chart = this.$echarts.init(document.getElementById('accomplish'));
      // let result = this.data;
      let options = {
        title: {
          text: "完成分布图",
          subtext: "",
        },
        tooltip: {
          trigger: "item",
          formatter: '{a}: {b}<br />{c}人: {d}%',
        },
        calculable: true,
        series: this.series,
      };
      chart.setOption(options);
    },
  }
}
</script>

<style scoped>

</style>