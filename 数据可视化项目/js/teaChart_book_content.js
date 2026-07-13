// teaChart_content.js
(function() {
    class TeaContentChart {
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
            text: '图4.1 唐宋茶书数量（内容角度）',
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
            data: ['综合类茶书', '专题类茶书'],
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
              name: '综合类茶书',
              type: 'bar',
              data: [2, 1, 2],
              itemStyle: { color: '#009f4d' },
              barGap: '0%',
              barCategoryGap: '20%'
            },
            {
              name: '专题类茶书',
              type: 'bar',
              data: [0, 1, 2],
              itemStyle: { color: '#c8102e' }
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
      new TeaContentChart('#chart2');
    });
  })();