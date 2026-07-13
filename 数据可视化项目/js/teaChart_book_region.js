// teaChart_region.js
(function() {
    class TeaRegionChart {
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
            text: '图4.2 唐宋茶书数量（地域角度）',
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
            data: ['全国性茶书', '地域性茶书'],
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
              name: '全国性茶书',
              type: 'bar',
              data: [2, 1, 2],
              itemStyle: { color: '#2d5c7f' },
              barGap: '0%',
              barCategoryGap: '20%'
            },
            {
              name: '地域性茶书',
              type: 'bar',
              data: [0, 1, 2],
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
      new TeaRegionChart('#chart1');
    });
  })();