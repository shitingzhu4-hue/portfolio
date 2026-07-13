// tea_culture_advanced.js
(function () {
  class TeaCultureChart {
    constructor(selector) {
      this.container = document.querySelector(selector);
      this.chart = echarts.init(this.container);
      this.initChart();
    }

    get baseOption() {
      return {
        title: {
          textStyle: {
            fontSize: 24,
            color: '#5a5d37',
            fontFamily: 'Ma Shan Zheng'
          },
          subtextStyle: {
            color: '#7a7d59',
            fontSize: 14
          },
          left: 'center'
        },
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#f8f5e6',
          borderColor: '#3c5438',
          borderWidth: 2,
          formatter: params => {
            let content = `<div style="border-bottom: 1px dashed #3c5438;padding-bottom:5px;margin-bottom:5px">
              ${params[0].name}年</div>`;
            params.forEach(item => {
              const icon = item.seriesType === 'line' ? '🍃' : '🫖';
              content += `${icon} ${item.seriesName}: ${this.formatValue(item.value)}<br>`;
            });
            return content;
          }
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 30,
          top: 100,
          itemWidth: 20,
          itemHeight: 14,
          textStyle: {
            color: '#4a4b32'
          },
          icon: 'circle',
          pageIconColor: '#3c5438'
        },
        xAxis: [{
          type: 'category',
          data: this.timelineData,
          axisLabel: {
            rotate: 30,
            color: '#5a5d37'
          },
          axisLine: {
            lineStyle: {
              color: '#a1a580'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          name: '贸易货值 (万两白银)',
          nameTextStyle: {
            color: '#5a5d37'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#d4d4c3'
            }
          }
        }],
        series: [
          {
            name: '茶叶贸易',
            type: 'line',
            data: this.teaData, // 明确绑定数据
            symbol: 'image://image/tea.png',
            symbolSize: 28,
            symbolKeepAspect: true,
            itemStyle: {
              borderColor: '#3c5438',
              borderWidth: 2
            },
            lineStyle: {
              width: 3,
              color: '#3c5438',
              shadowColor: 'rgba(60,84,56,0.3)',
              shadowBlur: 8,
              shadowOffsetY: 4
            }
          },
          {
            name: '总贸易额',
            type: 'bar',
            data: this.totalData, // 关键修复：添加data绑定
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#5a5d37' },
                { offset: 1, color: '#8d9070' }
              ]),
              borderRadius: [8, 8, 0, 0],
              shadowColor: 'rgba(90,93,55,0.3)',
              shadowBlur: 6,
              shadowOffsetY: 3
            },
            emphasis: {
              itemStyle: {
                shadowColor: 'rgba(90,93,55,0.5)',
                shadowBlur: 10
              }
            },
            barWidth: '40%',
            barGap: '30%'
          }
        ],
        dataZoom: [{
          type: 'slider',
          show: true,
          start: this.calculateDataZoomStart(),
          end: this.calculateDataZoomEnd(),
          backgroundColor: 'rgba(248,245,230,0.8)',
          fillerColor: 'rgba(115,136,86,0.2)'
        }]
      };
    }

    calculateDataZoomStart() {
      return 0;
    }

    calculateDataZoomEnd() {
      return 100;
    }

    get timelineData() {
      return [1730, 1740, 1750, 1760, 1770, 1780, 1790, 1800, 1888, 1890, 1895];
    }

    get teaData() {
      // 补充数据并替换null为0
      return [374311, 132960, 366231, 653000, 1323849, 125983, 4103828, 0, 31752000, 49300000, 104500000];
    }

    get totalData() {
      // 补充数据并替换null为0，保持12个数据点
      return [469879, 186214, 507102, 707000, 1413816, 2026043, 4669811, 0, 108400000, 81504000, 104500000];
    }

    formatValue(value) {
      if (!value) return '无数据';
      return value > 1000000 ?
        `${(value / 1000000).toFixed(1)}M` :
        `${(value / 10000).toFixed(0)}万`;
    }

    initChart() {
      this.chart.setOption(this.baseOption);
      window.addEventListener('resize', () => this.chart.resize());
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new TeaCultureChart('.teaChart');
  });
})();