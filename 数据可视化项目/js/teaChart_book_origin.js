// teaChart_origin.js
(function() {
  class TeaOriginChart {
    constructor(selector) {
      this.container = document.querySelector(selector);
      if (!this.container) {
        console.error(`容器 "${selector}" 未找到`);
        return;
      }

      this.chart = echarts.init(this.container);
      this.initChart();
      this.bindEvents();
    }

    get baseOption() {
      return {
        title: {
          text: '图4.3 唐宋茶书作者数量（籍贯角度）',
          left: 'center',
          textStyle: {
            color: '#2d5c7f',
            fontWeight: 'bold'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['南方作者', '北方作者'],
          top: 35
        },
        xAxis: {
          type: 'category',
          data: ['唐五代', '北宋', '南宋'],
          axisLabel: { color: '#666' }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#666' }
        },
        series: [
          {
            name: '南方作者',
            type: 'bar',
            data: [1, 14, 4],
            itemStyle: { color: '#2d5c7f' },
            barGap: '0%',
            barCategoryGap: '20%'
          },
          {
            name: '北方作者',
            type: 'bar',
            data: [2, 2, 2],
            itemStyle: { color: '#d4af37' }
          }
        ]
      };
    }

    initChart() {
      this.chart.setOption(this.baseOption);
    }

    bindEvents() {
      window.addEventListener('resize', () => this.chart.resize());
    }

    dispose() {
      this.chart.dispose();
      window.removeEventListener('resize', () => this.chart.resize());
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new TeaOriginChart('#chart3');
  });
})();